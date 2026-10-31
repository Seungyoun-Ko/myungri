import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { readdirSync } from 'node:fs';
// usage: node v14-render.mjs <srcDir> <outDir> [filter]
const [DIR, OUT, FILTER] = process.argv.slice(2);
const browser = await puppeteer.launch({ args: [...chromium.args, '--allow-file-access-from-files', '--proxy-server=' + process.env.HTTPS_PROXY], executablePath: await chromium.executablePath(), headless: true });
for (const f of readdirSync(DIR).filter((x) => x.endsWith('.html') && (!FILTER || x.includes(FILTER)))) {
  const page = await browser.newPage();
  await page.goto(`file://${DIR}/${f}`, { waitUntil: 'networkidle0' });
  const [w, h, dsf] = await page.evaluate(() => [document.body.offsetWidth, document.body.offsetHeight, +(document.body.dataset.dsf || 1)]);
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dsf });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 400));
  await page.screenshot({ path: `${OUT}/${f.replace('.html', '.png')}` });
  console.log(f, w, h, dsf);
  await page.close();
}
await browser.close();
