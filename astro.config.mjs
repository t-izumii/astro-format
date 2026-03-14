// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import preact from '@astrojs/preact';
import compress from 'astro-compress';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = 'assets';
const base = '/htdocs';

// https://astro.build/config
export default defineConfig({
  base: base,
  compressHTML: false,
  outDir: './dist',
  build: {
    assets: `${assetsDir}/chunk`,
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `$base-url: '${base}';`,
          importers: [
            {
              findFileUrl(url) {
                if (!url.startsWith('@/')) return null;
                return pathToFileURL(
                  path.resolve(__dirname, 'src', url.slice(2))
                );
              },
            },
          ],
        },
      },
    },
    build: {
      emptyOutDir: true,
      minify: true,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: (info) => {
            let fileName = 'index';
            if (info.facadeModuleId) {
              const match = info.facadeModuleId
                ?.toLowerCase()
                .match(/\/([^\/]+)\.astro/);
              if (match && match[1]) {
                fileName = match[1];
              }
            }
            return `${assetsDir}/scripts/${fileName}.js`;
          },
          chunkFileNames: `${assetsDir}/chunk/[name].[hash].js`,
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0];
            if (!name) return `${assetsDir}/[name][extname]`;
            const ext = name.split('.').pop();
            if (ext === 'css') {
              const baseName = name.replace(/\.css$/, '');
              return `${assetsDir}/styles/${baseName}[extname]`;
            }
            return `${assetsDir}/${name}`;
          },
        },
      },
    },
  },
  integrations: [preact(), compress({ HTML: false })],
});
