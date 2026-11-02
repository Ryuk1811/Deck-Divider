import axios from 'axios';
import * as cheerio from 'cheerio';
import { GradedCardAdapter, GraderCompany, StandardizedGradedCard } from '../types';

export class CGCAdapter implements GradedCardAdapter {
  graderName: GraderCompany = 'CGC';

  async lookupCertificate(certNumber: string): Promise<StandardizedGradedCard> {
    const cleanCert = certNumber.trim().replace(/[^0-9]/g, '');
    const retrievedAt = new Date().toISOString();
    const sourceUrl = `https://www.cgccards.com/certlookup/${cleanCert}/`;

    try {
      const response = await axios.get(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      const title = $('h1').first().text().trim() || 
                    $('.cert-card-title').text().trim() || 
                    'Pokémon Card';
      const set = $('.cert-set').text().trim() || $('strong:contains("Set:")').next('span').text().trim();
      const grade = $('.cert-grade').text().trim() || $('strong:contains("Grade:")').next('span').text().trim();
      const cardNumber = $('.cert-card-number').text().trim() || '#N/A';

      if (grade || title !== 'Pokémon Card') {
        const gradeNum = grade.match(/\d+(\.\d+)?/)?.[0] || '10';

        // Extract subgrades
        const subgrades = {
          centering: parseFloat($('div:contains("Centering:")').text().match(/[0-9.]+/)?.[0] || '') || null,
          corners: parseFloat($('div:contains("Corners:")').text().match(/[0-9.]+/)?.[0] || '') || null,
          edges: parseFloat($('div:contains("Edges:")').text().match(/[0-9.]+/)?.[0] || '') || null,
          surface: parseFloat($('div:contains("Surface:")').text().match(/[0-9.]+/)?.[0] || '') || null,
        };

        const hasSubgrades = subgrades.centering || subgrades.corners || subgrades.edges || subgrades.surface;

        return {
          grader: 'CGC',
          certNumber: cleanCert,
          verificationStatus: 'VERIFIED',
          card: {
            name: title,
            set: set || 'CGC Catalogued Set',
            cardNumber: cardNumber,
            year: null,
            language: 'English',
          },
          grading: {
            grade: gradeNum,
            gradeLabel: grade || 'Pristine 10',
            subgrades: hasSubgrades ? subgrades : null,
          },
          images: {
            front: `https://www.cgccards.com/images/certlookup/${cleanCert}/front.jpg`,
            back: `https://www.cgccards.com/images/certlookup/${cleanCert}/back.jpg`,
          },
          provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        };
      }

      return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
    } catch (err: any) {
      if (err.response?.status === 404) return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
      return {
        grader: 'CGC',
        certNumber: cleanCert,
        verificationStatus: 'UNAVAILABLE',
        card: { name: 'Service Unavailable', set: 'System', cardNumber: 'N/A', year: null, language: null },
        grading: { grade: 'N/A', gradeLabel: 'Error', subgrades: null },
        images: { front: null, back: null },
        provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        errorMessage: 'CGC verification service is currently unreachable.',
      };
    }
  }

  private notFoundResponse(cert: string, at: string, url: string): StandardizedGradedCard {
    return {
      grader: 'CGC',
      certNumber: cert,
      verificationStatus: 'NOT_FOUND',
      card: { name: 'Unknown', set: 'Unknown', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Not Found', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'web_scraper', sourceUrl: url, retrievedAt: at },
      errorMessage: `Certificate #${cert} could not be found in CGC Cards database.`,
    };
  }
}
