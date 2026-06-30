// @ts-check
import { defineConfig } from "astro/config";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import preact from "@astrojs/preact";
import compress from "astro-compress";
import imageOptimize from "./integrations/image-optimize.mjs";
import cleanupScripts from "./integrations/cleanup-scripts.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = "assets";
const base = "/htdocs";

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
  base: base,
  compressHTML: false,
  outDir: "./dist",
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
    esbuild: {
      minifyIdentifiers: false,
      minifySyntax: false,
      minifyWhitespace: false,
    },
    build: {
      emptyOutDir: true,
      minify: false,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      rollupOptions: {
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
    // HTML/CSS/JSは必要に応じて圧縮（true化）する。
    // Image（Sharp）はAPNGを壊すため無効化し、画像圧縮はimageOptimizeで行う。
    compress({ HTML: false, CSS: true, JavaScript: true, Image: false }),
    // スクリプトチャンクを単一script.jsへインライン展開（compressのJS minify後に実行）
    cleanupScripts(),
    // dist出力後にsharpで画像最適化（APNGは素通し）
    imageOptimize(),
  ],
});
