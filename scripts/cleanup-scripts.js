import { readdirSync, unlinkSync, rmSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '../dist');
const chunkDir = join(distDir, 'assets/chunk');

try {
  // chunkディレクトリが存在する場合は削除
  if (existsSync(chunkDir)) {
    rmSync(chunkDir, { recursive: true, force: true });
    console.log('✓ Removed chunk directory');
  }
  
  console.log('✓ Cleanup complete');
} catch (error) {
  console.error('Cleanup error:', error.message);
}
