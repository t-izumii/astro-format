// @ts-check
import { defineConfig } from "astro/config";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import imageOptimize from "./integrations/image-optimize.mjs";
import cleanupScripts from "./integrations/cleanup-scripts.mjs";
import formatHtml from "./integrations/format-html.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = "assets";
const base = "/";
const outDir = "./dist";
// 公開先のオリジン。sitemap と、canonical / OGP の絶対URL
// （src/data/meta.ts の siteMeta.siteUrl が import.meta.env.SITE 経由で参照）に使う
const site = "https://example.com";

/**
 * sitemap の filter。出力済みHTMLに robots の noindex があるページを除外する。
 * pages.ts の noindex と Layout へ直接渡した noindex の両方を拾うため、
 * 定義側ではなく出力HTMLを見て判定する。
 *
 * @param {string} pageUrl site と base を含むページの完全なURL
 * @returns {boolean} sitemap に掲載するなら true
 */
function isIndexablePage(pageUrl) {
  const basePath = base.endsWith("/") ? base : `${base}/`;
  const { pathname } = new URL(pageUrl);
  const relativePath = decodeURIComponent(
    pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname
  ).replace(/^\/|\/$/g, "");
  const distDir = path.resolve(__dirname, outDir);
  // build.format が directory なら index.html、file なら {path}.html
  const htmlFile = [
    path.join(distDir, relativePath, "index.html"),
    path.join(distDir, `${relativePath}.html`),
  ].find((file) => existsSync(file));

  if (!htmlFile) {
    // 対応付けが壊れて除外が効かなくなったことに気づけるよう、ビルドログに出す
    // eslint-disable-next-line no-console
    console.warn(
      `[sitemap] 出力HTMLが見つからないため noindex を判定できません: ${pageUrl}`
    );
    return true;
  }

  return !/<meta[^>]*name=["']robots["'][^>]*noindex/i.test(
    readFileSync(htmlFile, "utf-8")
  );
}

/**
 * 開発時のみコンポーネントプレビュー(/components)を注入するインテグレーション。
 * エントリは src/pages の外(src/dev)にあるため、astro build では
 * ルート自体が生成されず、CSS/JSバンドルを一切汚染しない。
 *
 * @returns {import('astro').AstroIntegration}
 */
function devComponentsPreview() {
  return {
    name: "dev-components-preview",
    hooks: {
      "astro:config:setup": ({ command, injectRoute }) => {
        if (command !== "dev") return;
        injectRoute({
          pattern: "/components",
          entrypoint: path.resolve(__dirname, "./src/dev/components.astro"),
        });
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: site,
  base: base,
  compressHTML: false,
  outDir: outDir,
  build: {
    assets: `${assetsDir}/chunk`,
  },
  vite: {
    optimizeDeps: {
      rolldownOptions: {
        transform: {
          jsx: {
            runtime: "automatic",
            importSource: "preact",
          },
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/_abstracts" as *; $base-url: '${base}';`,
          importers: [
            {
              findFileUrl(url) {
                if (!url.startsWith("@/")) return null;
                return pathToFileURL(
                  path.resolve(__dirname, "src", url.slice(2))
                );
              },
            },
          ],
        },
      },
    },
    build: {
      emptyOutDir: true,
      minify: "oxc",
      cssMinify: "lightningcss",
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      rolldownOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0];
            if (!name) return `${assetsDir}/[name][extname]`;
            const ext = name.split(".").pop();
            if (ext === "css") {
              const baseName = name.replace(/\.css$/, "");
              return `${assetsDir}/styles/${baseName}[extname]`;
            }
            return `${assetsDir}/${name}`;
          },
        },
      },
    },
  },
  integrations: [
    devComponentsPreview(),
    preact(),
    // sitemap-index.xml / sitemap-0.xml を生成（site の指定が必須）。noindex のページは載せない
    sitemap({ filter: isIndexablePage }),
    // スクリプトチャンクを単一script.jsへインライン展開
    cleanupScripts(),
    // dist出力後にsharpで画像最適化（APNGは素通し）
    imageOptimize(),
    // 出力HTMLをPrettierで整形（HTMLを書き換える処理より後に置く）
    formatHtml(),
  ],
});
