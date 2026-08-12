import puppeteer from 'puppeteer';

(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.psacard.com/cert/69225215', { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log("Title:", title);
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
