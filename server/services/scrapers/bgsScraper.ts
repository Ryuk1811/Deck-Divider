import * as cheerio from 'cheerio';
import { getBrowser } from './browserManager.js';

export async function scrapeBGS(certId: string) {
  let page = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const url = `https://www.beckett.com/grading/card-lookup?item_type=BGS&item_id=${certId}`;
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await new Promise(r => setTimeout(r, 2000));

    const html = await page.content();
    const $ = cheerio.load(html);

    const map: Record<string, string> = {};
    $('tr').each((_, el) => {
      const tds = $(el).find('td, th');
      if (tds.length >= 2) {
        const k = $(tds[0]).text().trim();
        const v = $(tds[tds.length - 1]).text().trim();
        if (k && v && k !== v) map[k] = v;
      }
    });

    $('dt').each((_, el) => {
      const k = $(el).text().trim();
      const v = $(el).next('dd').text().trim();
      if (k && v) map[k] = v;
    });

    const cardName = map['Player'] || map['Item'] || map['Card Name'] || map['Subject'] || '';
    const setName = map['Set Name'] || map['Set'] || map['Brand'] || '';
    const year = map['Year'] || '';
    const rawGrade = map['Final Grade'] || map['Grade'] || map['Overall Grade'] || '';

    const centering = map['Centering'] || '9.5';
    const corners = map['Corners'] || '9.5';
    const edges = map['Edges'] || '9.5';
    const surface = map['Surface'] || '9.5';

    const gradeMatch = rawGrade.match(/\b(10|9\.5|9|8\.5|8|7|6|5|4|3|2|1)\b/);
    const grade = gradeMatch ? gradeMatch[1] : (rawGrade || "9.5");

    if (!cardName) {
      return null;
    }

    return {
      provider: "BGS",
      certId,
      cardName,
      setName: setName || "BGS Graded Item",
      cardNumber: map['Card Number'] || '',
      year,
      grade,
      gradeLabel: `BGS ${grade}`,
      subGrades: { centering, corners, edges, surface },
      certImages: []
    };
  } catch (error) {
    console.error("Error scraping BGS:", error);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (_) {}
    }
  }
}
