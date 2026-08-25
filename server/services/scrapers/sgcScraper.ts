import * as cheerio from 'cheerio';
import { getBrowser } from './browserManager.js';

export async function scrapeSGC(certId: string) {
  let page = null;
  try {
    const browser = await getBrowser();
    if (!browser) return null;
    page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const url = `https://gosgc.com/cert-verify/${certId}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000));

    const html = await page.content();
    const $ = cheerio.load(html);

    const map: Record<string, string> = {};
    $('dt').each((_, el) => {
      const k = $(el).text().trim();
      const v = $(el).next('dd').text().trim();
      if (k && v) map[k] = v;
    });

    $('tr').each((_, el) => {
      const tds = $(el).find('td, th');
      if (tds.length >= 2) {
        const k = $(tds[0]).text().trim();
        const v = $(tds[1]).text().trim();
        if (k && v && k !== v) map[k] = v;
      }
    });

    const cardName = map['Subject'] || map['Card Name'] || $('.cert-subject').text().trim() || '';
    const setName = map['Set'] || map['Brand'] || $('.cert-set').text().trim() || '';
    const year = map['Year'] || $('.cert-year').text().trim() || '';
    const rawGrade = map['Grade'] || $('.cert-grade').text().trim() || '';

    const gradeMatch = rawGrade.match(/\b(10|9\.5|9|8\.5|8|7|6|5|4|3|2|1)\b/);
    const grade = gradeMatch ? gradeMatch[1] : (rawGrade || "10");

    if (!cardName) {
      return null;
    }

    return {
      provider: "SGC",
      certId,
      cardName,
      setName: setName || "SGC Registry Item",
      cardNumber: map['Card #'] || map['Card Number'] || '',
      year,
      grade,
      gradeLabel: `SGC ${grade}`,
      subGrades: null,
      certImages: []
    };
  } catch (error) {
    console.error("Error scraping SGC:", error);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (_) {}
    }
  }
}
