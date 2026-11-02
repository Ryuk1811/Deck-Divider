import axios from 'axios';
import * as cheerio from 'cheerio';
import { GradedCardAdapter, GraderCompany, StandardizedGradedCard } from '../types';

export class PSAAdapter implements GradedCardAdapter {
  graderName: GraderCompany = 'PSA';

  async lookupCertificate(certNumber: string): Promise<StandardizedGradedCard> {
    const cleanCert = certNumber.trim().replace(/[^0-9]/g, '');
    const retrievedAt = new Date().toISOString();
    const sourceUrl = `https://www.psacard.com/cert/${cleanCert}`;

    if (!cleanCert) {
      return this.notFoundResponse(certNumber, retrievedAt, sourceUrl);
    }

    try {
      // Method 1: Official PSA Public API
      const psaApiKey = process.env.PSA_API_KEY;
      if (psaApiKey) {
        try {
          const apiResponse = await axios.get(`https://api.psacard.com/publicapi/cert/GetByCertNumber/${cleanCert}`, {
            headers: { 'Authorization': `bearer ${psaApiKey}` },
            timeout: 10000
          });
          if (apiResponse.data && apiResponse.data.PSACert) {
            const cert = apiResponse.data.PSACert;
            return {
              grader: 'PSA',
              certNumber: cleanCert,
              verificationStatus: 'VERIFIED',
              card: {
                name: cert.Subject || cert.CardTitle || 'Pokémon Card',
                set: cert.Brand || cert.SetName || 'Pokémon TCG',
                cardNumber: cert.CardNumber || '#N/A',
                year: cert.Year ? parseInt(cert.Year, 10) : null,
                language: 'English',
                variant: cert.Variety || cert.SpecDescription || null,
              },
              grading: {
                grade: cert.CardGrade || String(cert.GradeNum || '10'),
                gradeLabel: cert.GradeDescription || 'GEM MINT',
                subgrades: null,
              },
              images: {
                front: cert.ImageFrontUrl || null,
                back: cert.ImageBackUrl || null,
              },
              provenance: { source: 'official_api', sourceUrl, retrievedAt },
              rawMetadata: cert,
            };
          }
        } catch (apiErr) {
          console.error('PSA API Error:', apiErr);
        }
      }

      // Method 2: Web Scraping with Cheerio
      const response = await axios.get(sourceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // PSA uses a layout with th/td pairs
      const name = $('th:contains("Subject")').next('td').text().trim() || 
                   $('h1.cert-title').text().trim() || 
                   'Pokémon Card';
      
      const grade = $('th:contains("Grade")').next('td').text().trim();
      const set = $('th:contains("Brand")').next('td').text().trim() || 'Pokémon TCG';
      const cardNumber = $('th:contains("Card Number")').next('td').text().trim() || '#N/A';
      const year = $('th:contains("Year")').next('td').text().trim();

      if (grade || name !== 'Pokémon Card') {
        const gradeNumber = grade.match(/\d+(\.\d+)?/)?.[0] || '10';
        return {
          grader: 'PSA',
          certNumber: cleanCert,
          verificationStatus: 'VERIFIED',
          card: {
            name: name.replace(/PSA Cert.*$/i, '').trim(),
            set,
            cardNumber,
            year: year ? parseInt(year, 10) : null,
            language: 'English',
          },
          grading: {
            grade: gradeNumber,
            gradeLabel: grade || 'GEM MINT 10',
            subgrades: null,
          },
          images: {
            front: `https://d1htnxgqgh6l20.cloudfront.net/PSA/${cleanCert}_front.jpg`,
            back: `https://d1htnxgqgh6l20.cloudfront.net/PSA/${cleanCert}_back.jpg`,
          },
          provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        };
      }

      return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
    } catch (err: any) {
      if (err.response?.status === 404) return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
      return {
        grader: 'PSA',
        certNumber: cleanCert,
        verificationStatus: 'UNAVAILABLE',
        card: { name: 'Service Unavailable', set: 'System', cardNumber: 'N/A', year: null, language: null },
        grading: { grade: 'N/A', gradeLabel: 'Error', subgrades: null },
        images: { front: null, back: null },
        provenance: { source: 'web_scraper', sourceUrl, retrievedAt },
        errorMessage: 'PSA verification is currently unreachable. The provider may be rate-limiting or undergoing maintenance.',
      };
    }
  }

  private notFoundResponse(cert: string, at: string, url: string): StandardizedGradedCard {
    return {
      grader: 'PSA',
      certNumber: cert,
      verificationStatus: 'NOT_FOUND',
      card: { name: 'Unknown', set: 'Unknown', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Not Found', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'web_scraper', sourceUrl: url, retrievedAt: at },
      errorMessage: `Certificate #${cert} could not be found in the PSA registry.`,
    };
  }
}
