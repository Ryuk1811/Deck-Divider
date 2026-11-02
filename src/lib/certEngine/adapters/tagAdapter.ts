import axios from 'axios';
import { GradedCardAdapter, GraderCompany, StandardizedGradedCard } from '../types';

export class TAGAdapter implements GradedCardAdapter {
  graderName: GraderCompany = 'TAG';

  async lookupCertificate(certNumber: string): Promise<StandardizedGradedCard> {
    const cleanCert = certNumber.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const retrievedAt = new Date().toISOString();
    const sourceUrl = `https://taggrading.com/cert/${cleanCert}`;

    try {
      // TAG DIG report API
      const response = await axios.get(`https://taggrading.com/api/cert/${cleanCert}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        timeout: 10000
      });

      if (response.data && (response.data.card || response.data.certNumber)) {
        const card = response.data.card || {};
        const grade = response.data.grade || {};

        return {
          grader: 'TAG',
          certNumber: cleanCert,
          verificationStatus: 'VERIFIED',
          card: {
            name: card.name || card.title || 'Pokémon Card',
            set: card.setName || card.series || 'TAG Catalogued Set',
            cardNumber: card.cardNumber || '#N/A',
            year: card.year ? parseInt(card.year, 10) : null,
            language: 'English',
          },
          grading: {
            grade: String(grade.overall || '1000'),
            gradeLabel: grade.label || 'PRISTINE',
            subgrades: grade.subgrades ? {
              centering: grade.subgrades.centering || null,
              corners: grade.subgrades.corners || null,
              edges: grade.subgrades.edges || null,
              surface: grade.subgrades.surface || null,
            } : null,
          },
          images: {
            front: response.data.images?.frontUrl || null,
            back: response.data.images?.backUrl || null,
          },
          provenance: { source: 'dig_report', sourceUrl, retrievedAt },
        };
      }

      return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
    } catch (err: any) {
      if (err.response?.status === 404) return this.notFoundResponse(cleanCert, retrievedAt, sourceUrl);
      return {
        grader: 'TAG',
        certNumber: cleanCert,
        verificationStatus: 'UNAVAILABLE',
        card: { name: 'Service Unavailable', set: 'System', cardNumber: 'N/A', year: null, language: null },
        grading: { grade: 'N/A', gradeLabel: 'Error', subgrades: null },
        images: { front: null, back: null },
        provenance: { source: 'dig_report', sourceUrl, retrievedAt },
        errorMessage: 'TAG DIG verification service is currently unreachable.',
      };
    }
  }

  private notFoundResponse(cert: string, at: string, url: string): StandardizedGradedCard {
    return {
      grader: 'TAG',
      certNumber: cert,
      verificationStatus: 'NOT_FOUND',
      card: { name: 'Unknown', set: 'Unknown', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Not Found', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'dig_report', sourceUrl: url, retrievedAt: at },
      errorMessage: `Certificate #${cert} could not be found in TAG database.`,
    };
  }
}
