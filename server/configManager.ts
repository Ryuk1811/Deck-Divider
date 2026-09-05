import { getAdminDb } from './firebaseAdmin.js';

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

/**
 * Resolves the active app credentials from server environment variables.
 */
export async function getAppCredentials(): Promise<AppCredentials> {
  return {
    paypal: {
      mode: process.env.PAYPAL_MODE || 'live',
      clientId: process.env.PAYPAL_CLIENT_ID || '',
      clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
      webhookId: process.env.PAYPAL_WEBHOOK_ID || '9LD1144121247983E',
      planIds: {
        Bunch: process.env.PAYPAL_PLAN_BUNCH || 'P-86F48638UK390893LNJY5FHQ',
        Stack: process.env.PAYPAL_PLAN_STACK || 'P-62J90197VJ601823CNJY5GFI',
        Deck: process.env.PAYPAL_PLAN_DECK || 'P-8K993431SB9741949NJY5GVY',
        Collection: process.env.PAYPAL_PLAN_COLLECTION || 'P-1EH4703021893203DNJY5HII',
      },
    },
    tcgdex: {
      baseUrl: process.env.TCGDEX_BASE_URL || 'https://api.tcgdex.net/v2/en',
      apiKey: process.env.TCGDEX_API_KEY || '',
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID || 'deckdivider1',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    },
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Update credentials is not supported in this environment as secrets are managed in the UI.
 */
export async function updateAppCredentials(newCreds: Partial<AppCredentials>): Promise<AppCredentials> {
  console.warn("updateAppCredentials is not supported. Use the AI Studio Secrets UI.");
  return getAppCredentials();
}


