import * as cheerio from 'cheerio';
import { getBrowser } from './browserManager.js';

export async function scrapeCGC(certId: string) {
  let page = null;
  try {
    const browser = await getBrowser();
    if (!browser) return null;
    page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const url = `https://www.cgccards.com/certlookup/${certId}/`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });

    // Give JS time to hydrate or Cloudflare to pass if needed
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

    const cardName = map['Card Name'] || map['Subject'] || map['Title'] || map['Name'] || '';
    const setName = map['Set Name'] || map['Set'] || map['Series'] || '';
    const year = map['Year'] || map['Release Year'] || '';
    const cardNumber = map['Card Number'] || map['Number'] || map['Card #'] || '';
    const rawGrade = map['Grade'] || map['CGC Grade'] || '';

    const gradeMatch = rawGrade.match(/\b(10|9\.5|9|8\.5|8|7|6|5|4|3|2|1)\b/);
    const grade = gradeMatch ? gradeMatch[1] : (rawGrade || "10");

    if (!cardName) {
      return null;
    }

    return {
      provider: "CGC",
      certId,
      cardName,
      setName: setName || "CGC Registry Item",
      cardNumber,
      year,
      grade,
      gradeLabel: `CGC ${grade}`,
      subGrades: null,
      certImages: []
    };
  } catch (error) {
    console.error("Error scraping CGC:", error);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (_) {}
    }
  }
}
