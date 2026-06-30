import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
  mkdirSync,
} from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

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
// 2-a. チャンクの export 文を解析して取り除く
// -------------------------------------------------------------------
function extractExports(code) {
  const map = {};
  const exportRe = /^export\s*\{([^}]*)\}\s*;?\s*$/gm;
  const body = code.replace(exportRe, (_full, names) => {
    for (const part of names.split(",")) {
      const token = part.trim();
      if (!token) continue;
      const m = token.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
      if (!m) continue;
      const local = m[1];
      const exported = m[2] || m[1];
      map[exported] = local;
    }
    return ""; // export 文は出力から除去
  });
  return { body, map };
}

// -------------------------------------------------------------------
// 2-b. import 文を再帰的にインライン展開する
// -------------------------------------------------------------------
function inlineImports(code, baseDir) {
  const importRe =
    /^import\s*(?:\{([^}]*)\}\s*from\s*)?["']([^"']+)["'];?\s*$/gm;
  let result = code;
  let match;

  while ((match = importRe.exec(result)) !== null) {
    const bindings = match[1];
    const importPath = match[2];
    if (!importPath.startsWith(".")) {
      importRe.lastIndex = match.index + match[0].length;
      continue;
    }

    const absPath = join(baseDir, importPath);
    if (!existsSync(absPath)) {
      importRe.lastIndex = match.index + match[0].length;
      continue;
    }

    let chunkCode = readFileSync(absPath, "utf-8");
    chunkCode = inlineImports(chunkCode, dirname(absPath));

    let replacement;
    if (!bindings) {
      replacement = extractExports(chunkCode).body;
    } else {
      const { body, map } = extractExports(chunkCode);
      const aliasLines = bindings
        .split(",")
        .map((part) => {
          const token = part.trim();
          if (!token) return "";
          const m = token.match(/^(\w+)(?:\s+as\s+(\w+))?$/);
          if (!m) return "";
          const imported = m[1];
          const localName = m[2] || m[1];
          const internal = map[imported] || imported;
          return internal === localName
            ? ""
            : `const ${localName} = ${internal};`;
        })
        .filter(Boolean)
        .join("\n");
      replacement = aliasLines ? `${body}\n${aliasLines}` : body;
    }

    result =
      result.slice(0, match.index) +
      replacement +
      result.slice(match.index + match[0].length);
    importRe.lastIndex = 0;
  }

  return result;
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
function cleanupScriptsRun(distDir, logger) {
  const chunkDir = join(distDir, "assets/chunk");
  const scriptsDir = join(distDir, "assets/scripts");

  const entryFile = findEntryChunk(chunkDir);
  if (!entryFile) {
    logger.warn("エントリーチャンクが見つかりません。スキップします。");
    return;
  }

  const entryPath = join(chunkDir, entryFile);
  logger.info(`エントリー発見: ${entryFile}`);

  // インライン展開
  let code = readFileSync(entryPath, "utf-8");
  code = inlineImports(code, chunkDir);

  // scripts/ ディレクトリを作成して script.js として書き出す
  mkdirSync(scriptsDir, { recursive: true });
  const outputPath = join(scriptsDir, "script.js");
  writeFileSync(outputPath, code, "utf-8");
  logger.info("出力: assets/scripts/script.js");

  // HTML のパスを書き換え
  const oldSrc = `assets/chunk/${entryFile}`;
  const newSrc = `assets/scripts/script.js`;
  for (const htmlPath of findHtmlFiles(distDir)) {
    rewriteHtmlScriptPath(htmlPath, oldSrc, newSrc, logger);
  }

  // chunk/ ディレクトリをまるごと削除
  rmSync(chunkDir, { recursive: true, force: true });
  logger.info("chunk/ ディレクトリを削除しました");
  logger.info("cleanup 完了");
}

/**
 * Astro が生成するスクリプトチャンクを単一の script.js にインライン展開し、
 * HTML 参照を書き換えて chunk/ を削除する Astroインテグレーション。
 * JS minify を行う compress より後ろに配置すること。
 *
 * @returns {import('astro').AstroIntegration}
 */
export default function cleanupScripts() {
  return {
    name: "cleanup-scripts",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        cleanupScriptsRun(fileURLToPath(dir), logger);
      },
    },
  };
}
