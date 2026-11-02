import { GradedCardAdapter, GraderCompany, StandardizedGradedCard } from './types';
import { PSAAdapter } from './adapters/psaAdapter';
import { CGCAdapter } from './adapters/cgcAdapter';
import { BGSAdapter } from './adapters/bgsAdapter';
import { SGCAdapter } from './adapters/sgcAdapter';
import { TAGAdapter } from './adapters/tagAdapter';

const adapters: Record<GraderCompany, GradedCardAdapter> = {
  PSA: new PSAAdapter(),
  CGC: new CGCAdapter(),
  BGS: new BGSAdapter(),
  SGC: new SGCAdapter(),
  TAG: new TAGAdapter(),
};

/**
 * Main Multi-Grader Pokémon Certificate Verification Function
 * @param grader Grading Company ('PSA', 'CGC', 'BGS', 'SGC', 'TAG')
 * @param certNumber Certificate / Serial Number
 */
export async function fetchGradedCard(
  grader: GraderCompany | string,
  certNumber: string
): Promise<StandardizedGradedCard> {
  const normalizedGrader = (grader?.toUpperCase() || 'PSA') as GraderCompany;
  const adapter = adapters[normalizedGrader];

  const retrievedAt = new Date().toISOString();

  if (!adapter) {
    return {
      grader: normalizedGrader,
      certNumber: certNumber || '',
      verificationStatus: 'UNAVAILABLE',
      card: { name: 'Unsupported Grader', set: 'System', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Unsupported', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'official_api', sourceUrl: null, retrievedAt },
      errorMessage: `Grading company '${grader}' is not supported. Supported companies: PSA, CGC, BGS, SGC, TAG.`,
    };
  }

  const cleanCert = (certNumber || '').trim();
  if (!cleanCert) {
    return {
      grader: normalizedGrader,
      certNumber: '',
      verificationStatus: 'NOT_FOUND',
      card: { name: 'Missing Certificate Number', set: 'System', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Missing Cert', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'official_api', sourceUrl: null, retrievedAt },
      errorMessage: 'Please enter a valid certificate number.',
    };
  }

  try {
    const result = await adapter.lookupCertificate(cleanCert);
    return result;
  } catch (error: any) {
    return {
      grader: normalizedGrader,
      certNumber: cleanCert,
      verificationStatus: 'UNAVAILABLE',
      card: { name: 'Verification Engine Error', set: 'System', cardNumber: 'N/A', year: null, language: null },
      grading: { grade: 'N/A', gradeLabel: 'Error', subgrades: null },
      images: { front: null, back: null },
      provenance: { source: 'official_api', sourceUrl: null, retrievedAt },
      errorMessage: error?.message || 'An unexpected error occurred during certificate lookup.',
    };
  }
}
