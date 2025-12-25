// @ts-check
import { defineConfig } from 'astro/config';

const assetsDir = 'assets';

// https://astro.build/config
export default defineConfig({
  base: '/htdocs',
  compressHTML: false,
  outDir: './dist',
  build: {
    assets: `${assetsDir}/chunk`,
  },
  vite: {
    build: {
      minify: false,
      assetsInlineLimit: 0,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          entryFileNames: (info) => {
            let fileName = 'index';
            if (info.facadeModuleId) {
              const match = info.facadeModuleId?.toLowerCase().match(/\/([^\/]+)\.astro/);
              if (match && match[1]) {
                fileName = match[1];
              }
            }
            return `${assetsDir}/scripts/${fileName}.js`;
          },
          chunkFileNames: `${assetsDir}/chunk/[name].[hash].js`,
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return `${assetsDir}/[name][extname]`;
            const ext = assetInfo.name.split('.').pop();
            if (ext === 'css') {
              return `${assetsDir}/styles/style[extname]`;
            }
            return `${assetsDir}/${assetInfo.name}`;
          },
        },
      },
    },
  },
});
