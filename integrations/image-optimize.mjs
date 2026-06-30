import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

// -------------------------------------------------------------------
// 設定
// -------------------------------------------------------------------
const CONFIG = {
  jpeg: { quality: 80, mozjpeg: true },
  webp: { quality: 80 },
  // PNGはロスレス（compressionLevel/effort）。APNGのフレームを保持するため
  // パレット量子化(palette)はデフォルト無効。静的PNGをさらに縮めたい場合は true に。
  png: { compressionLevel: 9, effort: 10, palette: false },
  gif: {},
};

const TARGET_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

// -------------------------------------------------------------------
// APNG判定: acTLチャンクが最初のIDATより前に存在すればAPNG（アニメPNG）。
// sharp/libvips はこのAPNGをアニメとして扱えず静止画に潰してしまうため、
// 検出して圧縮対象から除外（素通し）する。
// -------------------------------------------------------------------
function isApng(buf) {
  const idat = buf.indexOf("IDAT");
  const actl = buf.indexOf("acTL");
  return actl !== -1 && (idat === -1 || actl < idat);
}

// dist配下の画像ファイルを再帰収集
function findImages(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findImages(fullPath));
    } else if (TARGET_EXTS.has(extname(entry.name).toLowerCase())) {
      result.push(fullPath);
    }
  }
  return result;
}

// 1ファイルを最適化（アニメは保持。失敗時は元画像を維持）
async function optimizeFile(file) {
  const ext = extname(file).toLowerCase();
  const inputBuf = readFileSync(file);

  // APNGはsharpが扱えず静止画に潰すため、無加工で素通しする
  if (ext === ".png" && isApng(inputBuf)) {
    return { status: "kept-apng" };
  }

  // animated:true で読み込み、アニメGIF/アニメWebPのフレームを保持
  const meta = await sharp(inputBuf, { animated: true }).metadata();
  const isAnimated = (meta.pages ?? 1) > 1;

  let pipeline = sharp(inputBuf, { animated: true });
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      pipeline = pipeline.jpeg(CONFIG.jpeg);
      break;
    case ".webp":
      pipeline = pipeline.webp(CONFIG.webp);
      break;
    case ".png":
      pipeline = pipeline.png(CONFIG.png);
      break;
    case ".gif":
      pipeline = pipeline.gif(CONFIG.gif);
      break;
    default:
      return { status: "skip" };
  }

  const outputBuf = await pipeline.toBuffer();

  // 安全装置: 元がアニメなら再エンコード後もアニメ(pages>1)であることを検証。
  // フレームが失われていたら元画像を維持する。
  if (isAnimated) {
    const outMeta = await sharp(outputBuf, { animated: true }).metadata();
    if ((outMeta.pages ?? 1) <= 1) {
      return { status: "kept-animated" };
    }
  }

  // 縮まなかった場合は元画像を維持
  if (outputBuf.length >= inputBuf.length) {
    return { status: "kept-larger" };
  }

  writeFileSync(file, outputBuf);
  return {
    status: "optimized",
    before: inputBuf.length,
    after: outputBuf.length,
  };
}

// 出力ディレクトリ配下の画像をまとめて最適化
async function optimizeImages(distDir, logger) {
  const images = findImages(distDir);
  if (images.length === 0) {
    logger.info("画像が見つかりませんでした。");
    return;
  }

  let savedBytes = 0;
  let optimizedCount = 0;

  for (const file of images) {
    const rel = file.replace(distDir + "/", "");
    try {
      const r = await optimizeFile(file);
      if (r.status === "optimized") {
        savedBytes += r.before - r.after;
        optimizedCount++;
        const pct = (((r.before - r.after) / r.before) * 100).toFixed(1);
        logger.info(`✓ ${rel}  -${pct}%`);
      } else if (r.status === "kept-apng") {
        logger.info(`↷ ${rel}  APNG検出のため素通し(sharp非対応)`);
      } else if (r.status === "kept-animated") {
        logger.info(`↷ ${rel}  アニメ保持のため元画像を維持`);
      }
    } catch (e) {
      logger.warn(`✗ ${rel}  ${e.message}`);
    }
  }

  logger.info(
    `画像最適化 完了: ${optimizedCount}件 / 合計 ${(savedBytes / 1024).toFixed(1)} KB 削減`
  );
}

/**
 * ビルド出力(dist)の画像を最適化するAstroインテグレーション。
 * astro:build:done（出力書き出し後）で実行する。dev/preview では走らない。
 *
 * @returns {import('astro').AstroIntegration}
 */
export default function imageOptimize() {
  return {
    name: "image-optimize",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await optimizeImages(fileURLToPath(dir), logger);
      },
    },
  };
}
