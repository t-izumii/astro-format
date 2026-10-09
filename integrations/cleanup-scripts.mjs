import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  renameSync,
  rmSync,
  mkdirSync,
} from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { rolldown } from "rolldown";

// -------------------------------------------------------------------
// 1. chunk/ 内のスクリプトエントリーを特定
//    Astro が生成する "script.astro_astro_type_script_*" ファイルを探す
// -------------------------------------------------------------------
function findEntryChunk(dir) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir);
  return files.find((f) => f.startsWith("script.astro_astro_type_script_"));
}

// -------------------------------------------------------------------
// 2. エントリーから辿れるチャンクを 1 ファイルに束ね直す
//    minify 後の出力は import と本体が同じ行に並び、別チャンクの短縮名
//    （e, t など）も衝突するため、文字列の連結ではなく bundler で結合する
// -------------------------------------------------------------------
async function bundleEntry(entryPath, outputPath) {
  const bundle = await rolldown({ input: entryPath });
  try {
    await bundle.write({
      file: outputPath,
      format: "es",
      // import() も含めて 1 ファイルに展開する
      codeSplitting: false,
      minify: true,
    });
  } finally {
    await bundle.close();
  }
}

// -------------------------------------------------------------------
// 3. HTML 内のスクリプト参照パスを書き換える
// -------------------------------------------------------------------
function rewriteHtmlScriptPath(htmlPath, oldSrc, newSrc, logger) {
  if (!existsSync(htmlPath)) return;
  const html = readFileSync(htmlPath, "utf-8");
  const updated = html.split(oldSrc).join(newSrc);
  if (html !== updated) {
    writeFileSync(htmlPath, updated, "utf-8");
    logger.info(`HTML 書き換え: ${htmlPath}`);
  }
}

// dist 以下の .html を再帰的に全て収集する
function findHtmlFiles(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith(".html")) {
      result.push(fullPath);
    }
  }
  return result;
}

// -------------------------------------------------------------------
// メイン処理（出力ディレクトリを受け取って実行）
// -------------------------------------------------------------------
async function cleanupScriptsRun(distDir, logger) {
  const chunkDir = join(distDir, "assets/chunk");
  const scriptsDir = join(distDir, "assets/scripts");
  const stylesDir = join(distDir, "assets/styles");

  const entryFile = findEntryChunk(chunkDir);
  if (!entryFile) {
    logger.warn("エントリーチャンクが見つかりません。スキップします。");
    return;
  }

  const entryPath = join(chunkDir, entryFile);
  logger.info(`エントリー発見: ${entryFile}`);

  // scripts/ ディレクトリを作成して script.js として書き出す
  mkdirSync(scriptsDir, { recursive: true });
  mkdirSync(stylesDir, { recursive: true });
  const outputPath = join(scriptsDir, "script.js");
  await bundleEntry(entryPath, outputPath);
  logger.info("出力: assets/scripts/script.js");

  // HTML のパスを書き換え
  const oldSrc = `assets/chunk/${entryFile}`;
  const newSrc = `assets/scripts/script.js`;
  for (const htmlPath of findHtmlFiles(distDir)) {
    rewriteHtmlScriptPath(htmlPath, oldSrc, newSrc, logger);
  }

  // Astro は script 経由で読み込まれた CSS も chunk/ に出力する。
  // 参照が残ったまま chunk/ を消すと 404 になるため、styles/ へ退避する
  for (const file of readdirSync(chunkDir)) {
    if (!file.endsWith(".css")) continue;

    renameSync(join(chunkDir, file), join(stylesDir, file));
    for (const htmlPath of findHtmlFiles(distDir)) {
      rewriteHtmlScriptPath(
        htmlPath,
        `assets/chunk/${file}`,
        `assets/styles/${file}`,
        logger
      );
    }
    logger.info(`CSS を退避: assets/styles/${file}`);
  }

  // island（client:*）や別コンポーネントの <script> など、集約対象外の
  // チャンクを HTML が参照している場合は、消すと 404 になるため残す
  const remainingRefs = findHtmlFiles(distDir).filter((htmlPath) =>
    readFileSync(htmlPath, "utf-8").includes("assets/chunk/")
  );
  if (remainingRefs.length > 0) {
    logger.warn(
      `assets/chunk/ を参照する HTML が残っているため、chunk/ を削除しません: ${remainingRefs
        .map((htmlPath) => relative(distDir, htmlPath))
        .join(", ")}`
    );
    return;
  }

  // chunk/ ディレクトリをまるごと削除
  rmSync(chunkDir, { recursive: true, force: true });
  logger.info("chunk/ ディレクトリを削除しました");
  logger.info("cleanup 完了");
}

/**
 * Astro が生成するスクリプトチャンクを単一の script.js に束ね直し、
 * HTML 参照を書き換えて chunk/ を削除する Astroインテグレーション。
 *
 * @returns {import('astro').AstroIntegration}
 */
export default function cleanupScripts() {
  return {
    name: "cleanup-scripts",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await cleanupScriptsRun(fileURLToPath(dir), logger);
      },
    },
  };
}
