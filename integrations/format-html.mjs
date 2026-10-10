import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, extname, relative } from "path";
import { fileURLToPath } from "url";
import * as prettier from "prettier";

// dist配下のHTMLファイルを再帰収集
function findHtmlFiles(dir) {
  const result = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findHtmlFiles(fullPath));
    } else if (extname(entry.name) === ".html") {
      result.push(fullPath);
    }
  }
  return result;
}

async function formatHtmlFiles(distDir, logger) {
  const files = findHtmlFiles(distDir);
  for (const file of files) {
    // .prettierignore は dist を除外しているため、設定(.prettierrc)だけを読む
    const options = await prettier.resolveConfig(file);
    const source = readFileSync(file, "utf-8");
    // parser ではなく filepath で指定する。CLI と同じく .html として扱われ、DOCTYPE も小文字になる
    const formatted = await prettier.format(source, {
      ...options,
      filepath: file,
    });
    if (formatted !== source) writeFileSync(file, formatted);
  }
  logger.info(
    `${files.length}件のHTMLを整形しました。（${relative(process.cwd(), distDir) || "."}）`
  );
}

/**
 * 出力HTMLをPrettierで整形するインテグレーション。
 * HTMLを書き換える他のインテグレーション（cleanup-scripts）より後に登録する。
 * astro:build:done（出力書き出し後）で実行する。dev/preview では走らない。
 *
 * @returns {import('astro').AstroIntegration}
 */
export default function formatHtml() {
  return {
    name: "format-html",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await formatHtmlFiles(fileURLToPath(dir), logger);
      },
    },
  };
}
