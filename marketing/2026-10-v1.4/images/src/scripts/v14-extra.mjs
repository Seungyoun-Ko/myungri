import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
const OUT = process.argv[2];
const browser = await puppeteer.launch({ args: [...chromium.args, '--proxy-server=' + process.env.HTTPS_PROXY], executablePath: await chromium.executablePath(), headless: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const HIDE = '.bottomnav{display:none!important}';
async function fill(page, vals) { for (const [id, v] of vals) { await page.$eval(`#${id}`, (e) => (e.value = '')); await page.type(`#${id}`, v); } }
async function newPage(url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
  await page.reload({ waitUntil: 'networkidle0' });
  return page;
}
// today
let page = await newPage('https://app.inseol.com/');
await fill(page, [['f-year', '1991'], ['f-month', '12'], ['f-day', '27'], ['f-hour', '10'], ['f-minute', '15']]);
await page.click('form button[type=submit]');
await page.waitForSelector('[data-region="hero"] .hero-card', { timeout: 15000 });
await page.addStyleTag({ content: HIDE });
await wait(800);
await (await page.$('[data-region="hero"]')).screenshot({ path: `${OUT}/today-hero.png` });
const info = await page.evaluate(() => {
  const lab = [...document.querySelectorAll('[data-region="hero"] *')].find(e => e.children.length === 0 && e.textContent.trim() === '오늘의 나');
  let row = lab; while (row && !row.textContent.includes('날이에요')) row = row.parentElement;
  const r = row.getBoundingClientRect(); const c = document.querySelector('[data-region="hero"] .hero-card').getBoundingClientRect();
  return { tag: row.tagName, cls: row.className, x: c.x, y: r.y + scrollY, w: c.width, h: r.height, html: row.outerHTML.slice(0, 400) };
});
console.log(JSON.stringify(info));
await page.screenshot({ path: `${OUT}/today-row.png`, clip: { x: info.x, y: info.y - 14, width: info.w, height: info.h + 28 }, captureBeyondViewport: true });
await page.close();
// match crop
page = await newPage('https://app.inseol.com/#/match');
await fill(page, [['pa-y', '1990'], ['pa-m', '5'], ['pa-d', '15'], ['pb-y', '1992'], ['pb-m', '3'], ['pb-d', '8']]);
await page.click('form button[type=submit]');
await wait(1500);
await page.addStyleTag({ content: HIDE });
const box = await page.evaluate(() => {
  const m = document.querySelector('#match-result'); const r = m.getBoundingClientRect();
  const good = [...m.querySelectorAll('*')].find(e => e.children.length === 0 && e.textContent.trim() === '잘 맞는 점');
  let b = good; while (b && b.getBoundingClientRect().width < r.width - 60) b = b.parentElement;
  return { x: r.x, y: r.y + scrollY, w: r.width, bottom: b.getBoundingClientRect().bottom + scrollY };
});
await page.screenshot({ path: `${OUT}/shot-match.png`, clip: { x: box.x, y: box.y, width: box.w, height: box.bottom - box.y + 18 }, captureBeyondViewport: true });
await browser.close();
