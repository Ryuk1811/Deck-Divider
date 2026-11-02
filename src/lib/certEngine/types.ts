/**
 * Multi-Grader Pokémon Card Data Verification Engine Types
 */

export type GraderCompany = 'PSA' | 'CGC' | 'BGS' | 'SGC' | 'TAG';

export type VerificationStatus = 
  | 'VERIFIED'
  | 'NOT_FOUND'
  | 'MISMATCH'
  | 'UNAVAILABLE'
  | 'INCONCLUSIVE'
  | 'UNVERIFIED';

export interface CardSubgrades {
  centering: number | null;
  corners: number | null;
  edges: number | null;
  surface: number | null;
}

export interface StandardizedGradedCard {
  grader: GraderCompany;
  certNumber: string;
  verificationStatus: VerificationStatus;
  card: {
    name: string;
    set: string;
    cardNumber: string;
    year: number | null;
    language: string | null;
    publisher?: string | null;
    variant?: string | null;
  };
  grading: {
    grade: string; // e.g. "10", "9.5", "Authentic"
    gradeLabel: string; // e.g. "GEM MINT", "MINT", "PRISTINE"
    subgrades: CardSubgrades | null;
  };
  images: {
    front: string | null;
    back: string | null;
  };
  provenance: {
    source: 'official_api' | 'web_scraper' | 'dig_report' | 'ocr_fallback';
    sourceUrl: string | null;
    retrievedAt: string;
  };
  rawMetadata?: Record<string, any>;
  errorMessage?: string;
}

export interface GradedCardAdapter {
  graderName: GraderCompany;
  lookupCertificate(certNumber: string): Promise<StandardizedGradedCard>;
}
