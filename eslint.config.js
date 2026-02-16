import eslintPluginAstro from 'eslint-plugin-astro';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  // 除外するファイル・ディレクトリ
  {
    ignores: ['node_modules/', 'dist/', '.astro/', '*.min.js'],
  },
  // Astro推奨設定
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  // Prettierとの競合回避（最後に配置）
  eslintConfigPrettier,
];
