import * as cheerio from 'cheerio';
import { getBrowser } from './browserManager.js';

export async function scrapePSA(certId: string) {
  let page = null;
  try {
    const browser = await getBrowser();
    page = await browser.newPage();
    
    // Set realistic headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    const url = `https://www.psacard.com/cert/${certId}`;
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 25000 });
    
    const title = await page.title();
    if (title.includes('Not Found') || title.includes('404')) {
      return null;
    }

    const html = await page.content();
    const $ = cheerio.load(html);

    const certMap: Record<string, string> = {};
    $('dt').each((_, el) => {
      const key = $(el).text().trim();
      const val = $(el).next('dd').text().trim();
      if (key && val) {
        certMap[key] = val;
      }
    });

    // Fallback if table or tr is used instead of dt/dd
    if (Object.keys(certMap).length === 0) {
      $('tr').each((_, el) => {
        const key = $(el).find('th, td').first().text().trim();
        const val = $(el).find('td').last().text().trim();
        if (key && val && key !== val) {
          certMap[key] = val;
        }
      });
    }

    const subject = certMap['Subject'] || certMap['ITEM'] || certMap['Item'] || '';
    const brand = certMap['Brand/Title'] || certMap['BRAND'] || certMap['Set'] || '';
    const year = certMap['Year'] || certMap['YEAR'] || '';
    const cardNumber = certMap['Card Number'] || certMap['CARD NUMBER'] || certMap['Number'] || '';
    const rawGrade = certMap['Item Grade'] || certMap['GRADE'] || certMap['Grade'] || '';
    const labelType = certMap['Label Type'] || certMap['Variety/Pedigree'] || '';

    // Extract numerical grade e.g. "GEM MT 10" -> "10", "MINT 9" -> "9"
    const gradeMatch = rawGrade.match(/\b(10|9\.5|9|8\.5|8|7|6|5|4|3|2|1)\b/);
    const grade = gradeMatch ? gradeMatch[1] : (rawGrade || "10");

    let cardName = subject;
    if (!cardName && brand) {
      cardName = brand;
    }
    
    if (!cardName) {
      // Look for main header on PSA page
      const headerText = $('h1, .cert-details-heading, .subject-name').first().text().trim();
      if (headerText) cardName = headerText;
    }

    if (!cardName) {
      return null;
    }

    // Try extracting cert image
    const certImages: string[] = [];
    $('img[src*="psacard.com/cert/"], img[src*="cert-images"]').each((_, img) => {
      const src = $(img).attr('src');
      if (src && !certImages.includes(src)) certImages.push(src);
    });

    return {
      provider: "PSA",
      certId,
      cardName,
      setName: brand || "PSA Registry Item",
      cardNumber,
      year,
      grade,
      gradeLabel: `PSA ${grade}`,
      subGrades: null,
      certImages
    };
  } catch (error) {
    console.error("Error scraping PSA:", error);
    return null;
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (_) {}
    }
  }
}
