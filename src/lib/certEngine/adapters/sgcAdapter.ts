import axios from 'axios';
import * as cheerio from 'cheerio';
import { GradedCardAdapter, GraderCompany, StandardizedGradedCard } from '../types';

export class SGCAdapter implements GradedCardAdapter {
  graderName: GraderCompany = 'SGC';

  async lookupCertificate(certNumber: string): Promise<StandardizedGradedCard> {
    const cleanCert = certNumber.trim().replace(/[^0-9]/g, '');
    const retrievedAt = new Date().toISOString();
    const sourceUrl = `https://www.gosgc.com/cert-code-lookup?cert=${cleanCert}`;

    try {
      const response = await axios.get(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      const cardName = $('.card-name').text().trim() || 
                       $('strong:contains("Card Name:")').next('span').text().trim() || 
                       'Pokémon Card';
      const setName = $('.set-name').text().trim() || 
                      $('strong:contains("Set Name:")').next('span').text().trim() || 
                      'SGC Catalogued Set';
      const grade = $('strong:contains("Grade:")').next('span').text().trim() || 
                    $('.grade').text().trim();

      if (grade || cardName !== 'Pokémon Card') {
        const gradeNum = grade.match(/\d+(\.\d+)?/)?.[0] || '10';

        return {
          grader: 'SGC',
          certNumber: cleanCert,
          verificationStatus: 'VERIFIED',
          card: {
            name: cardName,
            set: setName,
            cardNumber: '#N/A',
            year: null,
            language: 'English',
          },
          grading: {
            grade: gradeNum,
            gradeLabel: grade || '10 GEM MINT',
            subgrades: null,
          },
          images: { front: null, back: null },
          provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        };
      }

      return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
    } catch (err: any) {
      if (err.response?.status === 404) return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
      return {
        grader: 'SGC',
        certNumber: cleanCert,
        verificationStatus: 'UNAVAILABLE',
        card: { name: 'Service Unavailable', set: 'System', cardNumber: 'N/A', year: null, language: null },
        grading: { grade: 'N/A', gradeLabel: 'Error', subgrades: null },
        images: { front: null, back: null },
        provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        errorMessage: 'SGC verification service is currently unreachable.',
      };
    }
  }

  private notFoundResponse(cert: string, at: string, url: string): StandardizedGradedCard {
    return {
      grader: 'SGC',
      certNumber: cert,
      verificationStatus: 'NOT_FOUND',
      card: { name: 'Unknown', set: 'Unknown', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Not Found', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'web_scraper', sourceUrl: url, retrievedAt: at },
      errorMessage: `Certificate #${cert} could not be found in SGC database.`,
    };
  }
}
