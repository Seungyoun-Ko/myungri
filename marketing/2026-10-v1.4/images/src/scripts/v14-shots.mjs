import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
const OUT = process.argv[2];
const browser = await puppeteer.launch({ args: [...chromium.args, '--proxy-server=' + process.env.HTTPS_PROXY], executablePath: await chromium.executablePath(), headless: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const HIDE = '.bottomnav{display:none!important}';
async function fill(page, vals) {
  for (const [id, v] of vals) { await page.$eval(`#${id}`, (e) => (e.value = '')); await page.type(`#${id}`, v); }
}
async function newPage(url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(() => { sessionStorage.clear(); localStorage.clear(); });
  await page.reload({ waitUntil: 'networkidle0' });
  return page;
}
async function hero(base, prefix, date = ['1990', '5', '15', '8', '30']) {
  const page = await newPage(base);
  await fill(page, [['f-year', date[0]], ['f-month', date[1]], ['f-day', date[2]], ['f-hour', date[3]], ['f-minute', date[4]]]);
  await page.click('form button[type=submit]');
  await page.waitForSelector('[data-region="hero"] .hero-card', { timeout: 15000 });
  await page.addStyleTag({ content: HIDE });
  await wait(800);
  const h = await page.$('[data-region="hero"]');
  console.log(prefix, JSON.stringify(await h.evaluate(e => e.innerText)));
  if (prefix) {
    await h.screenshot({ path: `${OUT}/${prefix}.png` });
    if (await page.$('.hero-mbti')) {
      await page.$eval('.hero-mbti', (d) => (d.open = true));
      await wait(400);
      await h.screenshot({ path: `${OUT}/${prefix}-mbti-open.png` });
    }
  }
  await page.close();
}
const mode = process.argv[3] || 'all';
if (mode === 'probe') {
  for (const d of [['1988','11','3','14','10'],['1995','2','21','6','40'],['1993','8','9','19','5'],['1991','12','27','10','15'],['1997','7','4','16','50'],['1989','3','30','22','20']]) await hero('https://app.inseol.com/', '', d);
} else {
  await hero('https://app.inseol.com/', 'shot-hero');
  await hero('https://app.inseol.com/en/', 'shot-en-hero');
  const page = await newPage('https://app.inseol.com/#/match');
  await fill(page, [['pa-y', '1990'], ['pa-m', '5'], ['pa-d', '15'], ['pb-y', '1992'], ['pb-m', '3'], ['pb-d', '8']]);
  await page.click('form button[type=submit]');
  await wait(1500);
  await page.addStyleTag({ content: HIDE });
  const mr = await page.$('#match-result');
  console.log('match', JSON.stringify(await mr.evaluate(e => e.innerText.slice(0, 800))));
  await mr.screenshot({ path: `${OUT}/shot-match-full.png` });
  await page.close();
  const p2 = await newPage('https://app.inseol.com/2027/');
  await page.addStyleTag?.({ content: HIDE }).catch(() => {});
  await wait(500);
  await p2.screenshot({ path: `${OUT}/shot-2027.png` });
  console.log('2027', JSON.stringify(await p2.evaluate(() => document.body.innerText.slice(0, 600))));
}
await browser.close();
