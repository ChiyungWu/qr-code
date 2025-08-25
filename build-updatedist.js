import { rmSync, mkdirSync, existsSync, cpSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const distDir = resolve(__dirname, './dist');
const wantDir = resolve(__dirname, './dist-seo');

// 1. 刪除 /dist
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true, force: true });
  console.log('✅ /dist REMOVED');
}

// 2. 重建 /dist
mkdirSync(distDir);
console.log('📁 /dist CREATED');

// 3. 複製 /dist-seo 到 /dist
cpSync(wantDir, distDir, { recursive: true });
console.log('📦 /dist-seo COPY-TO /dist');
