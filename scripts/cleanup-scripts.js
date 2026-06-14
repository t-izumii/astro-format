import {
  existsSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');
const chunkDir = join(distDir, 'assets/chunk');
const scriptsDir = join(distDir, 'assets/scripts');

// -------------------------------------------------------------------
// 1. chunk/ 内のスクリプトエントリーを特定
//    Astro が生成する "script.astro_astro_type_script_*" ファイルを探す
// -------------------------------------------------------------------
function findEntryChunk(dir) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir);
  return files.find((f) => f.startsWith('script.astro_astro_type_script_'));
}

// -------------------------------------------------------------------
// 2. import 文を再帰的にインライン展開する
// -------------------------------------------------------------------
function inlineImports(code, baseDir) {
  const importRe = /^import\s*["']([^"']+)["'];?\s*$/gm;
  let result = code;
  let match;

  while ((match = importRe.exec(code)) !== null) {
    const importPath = match[1];
    if (!importPath.startsWith('.')) continue;

    const absPath = join(baseDir, importPath);
    if (!existsSync(absPath)) continue;

    let chunkCode = readFileSync(absPath, 'utf-8');
    // 再帰的に内部のインポートも解決
    chunkCode = inlineImports(chunkCode, dirname(absPath));

    result = result.replace(match[0], chunkCode);
    importRe.lastIndex = 0; // 文字列が変わるのでリセット
  }

  return result;
}

// -------------------------------------------------------------------
// 3. HTML 内のスクリプト参照パスを書き換える
// -------------------------------------------------------------------
function rewriteHtmlScriptPath(htmlPath, oldSrc, newSrc) {
  if (!existsSync(htmlPath)) return;
  const html = readFileSync(htmlPath, 'utf-8');
  // 同一ページ内に複数参照があっても全て書き換える
  const updated = html.split(oldSrc).join(newSrc);
  if (html !== updated) {
    writeFileSync(htmlPath, updated, 'utf-8');
    console.log(`✓ HTML 書き換え: ${htmlPath}`);
  }
}

// dist 以下の .html を再帰的に全て収集する
function findHtmlFiles(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findHtmlFiles(fullPath));
    } else if (entry.name.endsWith('.html')) {
      result.push(fullPath);
    }
  }
  return result;
}

// -------------------------------------------------------------------
// メイン処理
// -------------------------------------------------------------------
try {
  const entryFile = findEntryChunk(chunkDir);
  if (!entryFile) {
    console.log('⚠ エントリーチャンクが見つかりません。スキップします。');
    process.exit(0);
  }

  const entryPath = join(chunkDir, entryFile);
  console.log(`✓ エントリー発見: ${entryFile}`);

  // インライン展開
  let code = readFileSync(entryPath, 'utf-8');
  code = inlineImports(code, chunkDir);

  // scripts/ ディレクトリを作成して script.js として書き出す
  const { mkdirSync } = await import('fs');
  mkdirSync(scriptsDir, { recursive: true });

  const outputPath = join(scriptsDir, 'script.js');
  writeFileSync(outputPath, code, 'utf-8');
  console.log(`✓ 出力: assets/scripts/script.js`);

  // HTML のパスを書き換え（base付きのパス → 新パス）
  const oldSrc = `assets/chunk/${entryFile}`;
  const newSrc = `assets/scripts/script.js`;

  // dist 以下の全 HTML を再帰的に書き換える（深い階層のページも対象）
  for (const htmlPath of findHtmlFiles(distDir)) {
    rewriteHtmlScriptPath(htmlPath, oldSrc, newSrc);
  }

  // chunk/ ディレクトリをまるごと削除
  rmSync(chunkDir, { recursive: true, force: true });
  console.log('✓ chunk/ ディレクトリを削除しました');

  console.log('✓ cleanup 完了');
} catch (error) {
  console.error('Cleanup error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
