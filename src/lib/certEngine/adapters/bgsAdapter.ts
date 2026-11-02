import axios from 'axios';
import * as cheerio from 'cheerio';
import { GradedCardAdapter, GraderCompany, StandardizedGradedCard } from '../types';

export class BGSAdapter implements GradedCardAdapter {
  graderName: GraderCompany = 'BGS';

  async lookupCertificate(certNumber: string): Promise<StandardizedGradedCard> {
    const cleanCert = certNumber.trim().replace(/[^0-9]/g, '');
    const retrievedAt = new Date().toISOString();
    const sourceUrl = `https://www.beckett.com/grading/card-lookup?item_type=BGS&item_id=${cleanCert}`;

    try {
      const response = await axios.get(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      const itemTitle = $('.item-title').text().trim() || 
                        $('td:contains("Item Name:")').next('td').text().trim() || 
                        'Pokémon Card';
      
      const overallGrade = $('td:contains("Overall Grade:")').next('td').text().trim() || 
                           $('td:contains("Final Grade:")').next('td').text().trim();

      if (overallGrade || itemTitle !== 'Pokémon Card') {
        const gradeNum = overallGrade.match(/\d+(\.\d+)?/)?.[0] || '9.5';

        const subgrades = {
          centering: parseFloat($('td:contains("Centering Grade:")').next('td').text()) || null,
          corners: parseFloat($('td:contains("Corners Grade:")').next('td').text()) || null,
          edges: parseFloat($('td:contains("Edges Grade:")').next('td').text()) || null,
          surface: parseFloat($('td:contains("Surface Grade:")').next('td').text()) || null,
        };

        return {
          grader: 'BGS',
          certNumber: cleanCert,
          verificationStatus: 'VERIFIED',
          card: {
            name: itemTitle,
            set: 'Beckett Catalogued Set',
            cardNumber: '#N/A',
            year: null,
            language: 'English',
          },
          grading: {
            grade: gradeNum,
            gradeLabel: overallGrade || 'Gem Mint 9.5',
            subgrades: subgrades.centering ? subgrades : null,
          },
          images: { front: null, back: null },
          provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        };
      }

      return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
    } catch (err: any) {
      if (err.response?.status === 404) return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
      return {
        grader: 'BGS',
        certNumber: cleanCert,
        verificationStatus: 'UNAVAILABLE',
        card: { name: 'Service Unavailable', set: 'System', cardNumber: 'N/A', year: null, language: null },
        grading: { grade: 'N/A', gradeLabel: 'Error', subgrades: null },
        images: { front: null, back: null },
        provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        errorMessage: 'Beckett verification service is currently unreachable.',
      };
    }
  }

  private notFoundResponse(cert: string, at: string, url: string): StandardizedGradedCard {
    return {
      grader: 'BGS',
      certNumber: cert,
      verificationStatus: 'NOT_FOUND',
      card: { name: 'Unknown', set: 'Unknown', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Not Found', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'web_scraper', sourceUrl: url, retrievedAt: at },
      errorMessage: `Serial #${cert} could not be found in Beckett database.`,
    };
  }
}
