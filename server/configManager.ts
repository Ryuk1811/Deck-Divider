import { getAdminDb } from './firebaseAdmin';

export interface AppCredentials {
  paypal: {
    mode: string;
    clientId: string;
    clientSecret: string;
    webhookId?: string;
    planIds: {
      Bunch: string;
      Stack: string;
      Deck: string;
      Collection: string;
    };
  };
  tcgdex: {
    baseUrl: string;
    apiKey?: string;
  };
  firebase: {
    projectId: string;
    clientEmail: string;
  };
  updatedAt?: string;
}

const DEFAULT_CREDENTIALS: AppCredentials = {
  paypal: {
    mode: process.env.PAYPAL_MODE || 'live',
    clientId: process.env.PAYPAL_CLIENT_ID || 'BAAART0wdN_LoLV8d5vHUpcdNm7Nz9OAzCEnhJtMzH34baRvl3oYJrwuoy6cy9w1UFF_6fy7kvkOKHURTQ',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    planIds: {
      Bunch: process.env.PAYPAL_PLAN_BUNCH || 'P-86F48638UK390893LNJY5FHQ',
      Stack: process.env.PAYPAL_PLAN_STACK || 'P-62J90197VJ601823CNJY5GFI',
      Deck: process.env.PAYPAL_PLAN_DECK || 'P-8K993431SB9741949NJY5GVY',
      Collection: process.env.PAYPAL_PLAN_COLLECTION || 'P-1EH4703021893203DNJY5HII',
    },
  },
  tcgdex: {
    baseUrl: process.env.TCGDEX_BASE_URL || 'https://api.tcgdex.net/v2/en',
  },
  firebase: {
    projectId: 'deckdivider1',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@deckdivider1.iam.gserviceaccount.com',
  },
};

let cachedCredentials: AppCredentials | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute TTL cache

export async function getAppCredentials(): Promise<AppCredentials> {
  return DEFAULT_CREDENTIALS;
}

export async function updateAppCredentials(newCreds: Partial<AppCredentials>): Promise<AppCredentials> {
  // In-memory update
  cachedCredentials = {
    ...DEFAULT_CREDENTIALS,
    ...newCreds,
    paypal: {
      ...DEFAULT_CREDENTIALS.paypal,
      ...(newCreds.paypal || {}),
      planIds: {
        ...DEFAULT_CREDENTIALS.paypal.planIds,
        ...(newCreds.paypal?.planIds || {}),
      },
    },
    tcgdex: {
      ...DEFAULT_CREDENTIALS.tcgdex,
      ...(newCreds.tcgdex || {}),
    },
    firebase: {
      ...DEFAULT_CREDENTIALS.firebase,
      ...(newCreds.firebase || {}),
    },
    updatedAt: new Date().toISOString(),
  };
  
  // Note: Changes won't persist across server restarts without a database backend
  // In a production environment with proper service account credentials, 
  // this would write to Firestore.
  return cachedCredentials;
}
