import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

(async () => {
  try {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto('https://www.psacard.com/cert/69225215', { waitUntil: 'networkidle2' });
    const title = await page.title();
    console.log("Title:", title);
    
    // Get page text to prove we bypassed
    const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log("Body:", text);
    
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();
