import * as cheerio from 'cheerio';
import { getBrowser } from './browserManager.js';

export async function scrapeTAG(certId: string) {
  let page = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const url = `https://taggrading.com/pages/cert-search?cert=${certId}`;
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

    const cardName = map['Card Name'] || map['Subject'] || map['Title'] || '';
    const setName = map['Set'] || map['Series'] || '';
    const year = map['Year'] || '';
    const rawGrade = map['Grade'] || '10';

    const gradeMatch = rawGrade.match(/\b(10|9\.5|9|8\.5|8|7|6|5|4|3|2|1)\b/);
    const grade = gradeMatch ? gradeMatch[1] : (rawGrade || "10");

    if (!cardName) {
      return null;
    }

    return {
      provider: "TAG",
      certId,
      cardName,
      setName: setName || "TAG Registry Item",
      cardNumber: map['Card Number'] || '',
      year,
      grade,
      gradeLabel: `TAG ${grade}`,
      subGrades: null,
      certImages: []
    };
  } catch (error) {
    console.error("Error scraping TAG:", error);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (_) {}
    }
  }
}
