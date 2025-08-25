import {
  rmSync,
  cpSync,
  writeFileSync,
  readFileSync,
  existsSync,
  readdirSync,
  mkdirSync,
} from 'fs';
import { resolve, join, basename } from 'path';
import puppeteer from 'puppeteer';
import express from 'express';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, './dist');
const wantDir = resolve(__dirname, './dist-seo');
const viewDir = resolve(__dirname, './dist-seo-view');

// 1. 刪除 wantDir 資料夾（如果存在）
if (existsSync(wantDir)) {
  rmSync(wantDir, { recursive: true, force: true });
}

// 2. 複製 distDir 到 wantDir
cpSync(distDir, wantDir, { recursive: true });

// 3. 重建截圖資料夾
if (existsSync(viewDir)) {
  rmSync(viewDir, { recursive: true, force: true });
}
mkdirSync(viewDir);

// 4. 讀取 ./src/locales 下所有 .json，排除 all.json
const localesDir = resolve(__dirname, './src/locales');
const localeFiles = readdirSync(localesDir).filter(
  (file) => file.endsWith('.json') && basename(file, '.json') !== 'all'
);

// 5. 加入根目錄空字串 '' 代表預設語言
const langKeys = ['', ...localeFiles.map((file) => basename(file, '.json'))];

// 6. 啟動靜態伺服器
const app = express();
app.use(express.static(wantDir));

const server = app.listen(4173, async () => {
  console.log('伺服器啟動在 http://localhost:4173');

  try {
    const browser = await puppeteer.launch();

    for (const langKey of langKeys) {
      const url =
        langKey === ''
          ? 'http://localhost:4173/'
          : `http://localhost:4173/?webLang=${langKey}`;

      console.log(`處理: ${langKey || 'root'} → ${url}`);

      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle0' });

      await page.waitForFunction(
        () => {
          const root = document.querySelector('#root');
          return root && root.innerHTML.trim().length > 0;
        },
        { timeout: 10000 }
      );

      const fullHtml = await page.evaluate(
        () => document.documentElement.outerHTML
      );

      const objDom = new JSDOM(fullHtml);
      const document = objDom.window.document;

      // 7-1. 移除所有 <svg> 標籤（連同內容）
      document.querySelectorAll('svg').forEach((svg) => svg.remove());

      // 7-2. 移除歐有 特定的 # 元件
      document.querySelectorAll('#_goober').forEach((el) => el.remove());
      document.querySelectorAll('#_rht_toaster').forEach((el) => el.remove());

      document.querySelectorAll('#_displayIp').forEach((el) => el.remove());
      document.querySelectorAll('#_showError').forEach((el) => el.remove());

      // 7-3. 清除 <html> 的 class 屬性 (dark | light)
      document.documentElement.removeAttribute('class');

      // 7-4. 序列化整份 HTML，[做 replace]，輸出存檔
      let htmlString = document.documentElement.outerHTML;

      if (langKey === '') {
        writeFileSync(join(wantDir, 'index.html'), htmlString, 'utf-8');
        console.log(`成功產生 root index.html`);
      } else {
        htmlString = htmlString
          .replace(/href="\//g, 'href="../')
          .replace(/src="\//g, 'src="../');

        const targetDir = join(wantDir, langKey);
        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }
        writeFileSync(join(targetDir, 'index.html'), htmlString, 'utf-8');
        console.log(`成功產生 ${langKey}/index.html`);
      }

      // 7-5. 截圖存檔
      const viewFile =
        langKey === ''
          ? join(viewDir, 'root.png')
          : join(viewDir, `${langKey}.png`);
      await page.screenshot({ path: viewFile, fullPage: true });
      console.log(`成功截圖: ${viewFile}`);

      await page.close();
    }

    await browser.close();
  } catch (err) {
    console.error('預渲染失敗:', err);
  } finally {
    server.close();
  }
});
