import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser } from 'puppeteer';

puppeteer.use(StealthPlugin());

let globalBrowser: Browser | null = null;

export async function getBrowser(): Promise<Browser | null> {
  if (!globalBrowser) {
    try {
      globalBrowser = await puppeteer.launch({ 
        headless: true, 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'] 
      });
    } catch (err) {
      console.warn('[BrowserManager] Headless browser launch not supported in this runtime environment:', err);
      return null;
    }
  }
  return globalBrowser;
}

export async function closeBrowser() {
  if (globalBrowser) {
    try {
      await globalBrowser.close();
    } catch (_) {}
    globalBrowser = null;
  }
}

