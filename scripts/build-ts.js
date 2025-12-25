import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// src/scripts/index.ts を読み込む
const indexTs = readFileSync(join(root, 'src/scripts/index.ts'), 'utf-8');
const testTs = readFileSync(join(root, 'src/scripts/test.ts'), 'utf-8');

// test.ts を処理（exportを削除してシンプルなJSに変換）
let testJs = testTs
  .replace(/export /g, '')
  .replace(/const /g, 'const ')
  .replace(/\.ts/g, '.js');

// index.ts を処理
let indexJs = indexTs
  .replace(/import.*from\s+['"]\.\/test['"];?/g, '') // import文を削除
  .replace(/\.ts/g, '.js');

// 結合
const combinedJs = `// Combined JavaScript
${testJs}

${indexJs}
`;

// public/assets/scripts ディレクトリを作成
const outputDir = join(root, 'public/assets/scripts');
mkdirSync(outputDir, { recursive: true });

// index.js として出力
writeFileSync(join(outputDir, 'index.js'), combinedJs);

console.log('✓ Built scripts: public/assets/scripts/index.js');
