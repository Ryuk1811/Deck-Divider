import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { createSubscription, reviseSubscription, getSubscription, getPayPalConfig, PAYPAL_PLAN_IDS } from './server/paypal.js';
import { getFirebaseAdmin, getAdminAuth, getAdminDb } from './server/firebaseAdmin.js';
import {
  getExpansions,
  getAllCardsSummary,
  getCardDetail,
  getSetDetail,
  getSyncStatus,
  triggerBackgroundSync,
  getLazyChunk,
  searchCardsServer,
} from './server/tcgCatalogManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'Deck Divider API',
      timestamp: new Date().toISOString(),
    });
  });

  // TCG Companion Proxy Routes
  app.get('/api/tcg/expansions', async (req, res) => {
    try {
      const sets = await getExpansions();
      res.json(sets);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch expansions' });
    }
  });

  app.get('/api/tcg/sets/:id', async (req, res) => {
    try {
      const setDetail = await getSetDetail(req.params.id);
      if (!setDetail) {
        return res.status(404).json({ error: 'Set not found' });
      }
      res.json(setDetail);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch set detail' });
    }
  });

  app.get('/api/tcg/cards/summary', async (req, res) => {
    try {
      const cards = await getAllCardsSummary();
      res.json(cards);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch card summary' });
    }
  });

  app.get('/api/tcg/cards/lazy-chunk', async (req, res) => {
    try {
      const offset = parseInt((req.query.offset as string) || '0', 10);
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const chunk = await getLazyChunk(offset, limit);
      res.json(chunk);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch lazy chunk' });
    }
  });

  app.get('/api/tcg/search', async (req, res) => {
    try {
      const q = (req.query.q as string) || '';
      const category = (req.query.category as string) || '';
      const stage = (req.query.stage as string) || '';
      const type = (req.query.type as string) || '';
      const regulationMark = (req.query.regulationMark as string) || '';
      const format = (req.query.format as string) || '';
      const offset = parseInt((req.query.offset as string) || '0', 10);
      const limit = parseInt((req.query.limit as string) || '50', 10);

      const result = await searchCardsServer({ q, category, stage, type, regulationMark, format, offset, limit });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to perform search' });
    }
  });

  app.get('/api/tcg/cards/:id', async (req, res) => {
    try {
      const card = await getCardDetail(req.params.id);
      if (!card) {
        return res.status(404).json({ error: 'Card not found' });
      }
      res.json(card);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch card detail' });
    }
  });

  app.get('/api/tcg/sync/status', (req, res) => {
    res.json(getSyncStatus());
  });

  app.post('/api/tcg/sync/trigger', async (req, res) => {
    const status = await triggerBackgroundSync();
    res.json(status);
  });

  app.get('/api/firebase/status', (req, res) => {
    try {
      const adminApp = getFirebaseAdmin();
      res.json({
        status: 'initialized',
        appName: adminApp.name,
        projectId: process.env.FIREBASE_PROJECT_ID || 'deckdivider1',
        hasPrivateKey: Boolean(process.env.FIREBASE_PRIVATE_KEY),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'Configured via Environment',
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Firebase Admin status check failed' });
    }
  });

  
  // PayPal Billing Routes
  const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const idToken = authHeader.split('Bearer ')[1];
      (req as any).uid = (await getAdminAuth().verifyIdToken(idToken)).uid;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  app.get('/api/billing/paypal-config', (req, res) => {
    res.json(getPayPalConfig());
  });

  app.post('/api/billing/subscribe', verifyToken, async (req, res) => {
    try {
      const { tier, returnUrl, cancelUrl } = req.body;
      const sub = await createSubscription(tier, returnUrl, cancelUrl);
      res.json(sub);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/revise', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier, returnUrl, cancelUrl } = req.body;
      const result = await reviseSubscription(subscriptionId, newTier, returnUrl, cancelUrl);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/execute-revision', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier } = req.body;
      const db = getAdminDb();
      await db.collection('subscriptions').doc((req as any).uid).set({
        tierName: newTier,
        paypalSubscriptionId: subscriptionId,
        billingStatus: 'REVISED',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/execute', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, tier } = req.body;
      // Fetch details to confirm
      const subDetails = await getSubscription(subscriptionId);
      if (subDetails.status === 'ACTIVE' || subDetails.status === 'APPROVAL_PENDING' || subDetails.status === 'APPROVED') {
        const db = getAdminDb();
        await db.collection('subscriptions').doc((req as any).uid).set({
          tierName: tier,
          paypalSubscriptionId: subscriptionId,
          billingStatus: subDetails.status,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        res.json({ success: true });
      } else {
        res.status(400).json({ error: 'Subscription not active' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  
  // Deck & Limit Routes
  const TIER_LIMITS = {
    Starter: { maxDecks: 4, maxCards: 25 },
    Bunch: { maxDecks: 9, maxCards: 40 },
    Stack: { maxDecks: 15, maxCards: 50 },
    Deck: { maxDecks: 18, maxCards: 60 },
    Collection: { maxDecks: 99999, maxCards: 99999 }
  };

  app.post('/api/decks', verifyToken, async (req, res) => {
    try {
      const db = getAdminDb();
      const subDoc = await db.collection('subscriptions').doc((req as any).uid).get();
      const tierName = subDoc.data()?.tierName || 'Starter';
      const maxDecks = TIER_LIMITS[tierName]?.maxDecks || 4;

      const snapshot = await db.collection('users').doc((req as any).uid).collection('decks').count().get();
      if (snapshot.data().count >= maxDecks) {
        return res.status(403).json({ error: 'Tier limit exceeded for decks' });
      }

      const deckRef = db.collection('users').doc((req as any).uid).collection('decks').doc();
      const newDeck = {
        ...req.body,
        id: deckRef.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      };
      await deckRef.set(newDeck);
      res.json(newDeck);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/decks/:deckId/cards', verifyToken, async (req, res) => {
    try {
      const db = getAdminDb();
      const subDoc = await db.collection('subscriptions').doc((req as any).uid).get();
      const tierName = subDoc.data()?.tierName || 'Starter';
      const maxCards = TIER_LIMITS[tierName]?.maxCards || 25;

      const deckRef = db.collection('users').doc((req as any).uid).collection('decks').doc(req.params.deckId);
      
      await db.runTransaction(async (t) => {
        const deckDoc = await t.get(deckRef);
        if (!deckDoc.exists) throw new Error('Deck not found');
        const deck = deckDoc.data();
        
        // Compute active cards
        const activeCards = (deck.entries || []).filter(e => !e.isSold);
        
        if (activeCards.length >= maxCards) {
          throw new Error('Tier limit exceeded for cards in this deck');
        }

        const newEntry = {
          ...req.body,
          id: 'entry-' + Date.now(),
          createdAt: new Date().toISOString()
        };
        
        const updatedEntries = [...(deck.entries || []), newEntry];
        t.update(deckRef, { 
          entries: updatedEntries,
          updatedAt: new Date().toISOString()
        });
      });
      
      res.json({ success: true });
    } catch (err) {
      if (err.message.includes('Tier limit exceeded')) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/decks/:deckId/split', verifyToken, async (req, res) => {
    try {
      const db = getAdminDb();
      const { cardIdsToSplit, newDeckName } = req.body;
      const sourceDeckId = req.params.deckId;

      const subDoc = await db.collection('subscriptions').doc((req as any).uid).get();
      const tierName = subDoc.data()?.tierName || 'Starter';
      const maxDecks = TIER_LIMITS[tierName]?.maxDecks || 4;

      await db.runTransaction(async (t) => {
        // Check deck limit
        const snapshot = await t.get(db.collection('users').doc((req as any).uid).collection('decks'));
        if (snapshot.size >= maxDecks) {
          throw new Error('Tier limit exceeded for decks');
        }
        
        const sourceRef = db.collection('users').doc((req as any).uid).collection('decks').doc(sourceDeckId);
        const sourceDoc = await t.get(sourceRef);
        if (!sourceDoc.exists) throw new Error('Source deck not found');
        const sourceData = sourceDoc.data();
        
        const entriesToMove = sourceData.entries.filter(e => cardIdsToSplit.includes(e.cardId));
        const remainingEntries = sourceData.entries.filter(e => !cardIdsToSplit.includes(e.cardId));
        
        const newDeckRef = db.collection('users').doc((req as any).uid).collection('decks').doc();
        const newDeck = {
          id: newDeckRef.id,
          name: newDeckName,
          description: `Split from ${sourceData.name}`,
          colorHex: sourceData.colorHex,
          isPublic: sourceData.isPublic,
          entries: entriesToMove,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        t.update(sourceRef, { entries: remainingEntries, updatedAt: new Date().toISOString() });
        t.set(newDeckRef, newDeck);
      });
      
      res.json({ success: true });
    } catch (err) {
      if (err.message.includes('Tier limit exceeded')) {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/billing/execute-revision', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier, isDowngrade } = req.body;
      const subDetails = await getSubscription(subscriptionId);
      
      const db = getAdminDb();
      if (isDowngrade) {
        // Find next billing date
        const nextBillingTime = subDetails.billing_info?.next_billing_time;
        await db.collection('subscriptions').doc((req as any).uid).set({
          pendingDowngrade: {
            tierName: newTier,
            effectiveDate: nextBillingTime
          },
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } else {
        await db.collection('subscriptions').doc((req as any).uid).set({
          tierName: newTier,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/init', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const idToken = authHeader.split('Bearer ')[1];
      const auth = getAdminAuth();
      const decodedToken = await auth.verifyIdToken(idToken);
      const uid = decodedToken.uid;
      
      const db = getAdminDb();
      
      const userRef = db.collection('users').doc(uid);
      const subRef = db.collection('subscriptions').doc(uid);
      
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        // Create founding records automatically on first sign-up
        const batch = db.batch();
        
        batch.set(userRef, {
          id: uid,
          displayName: decodedToken.name || decodedToken.email?.split('@')[0] || 'Collector',
          email: decodedToken.email || '',
          avatar: decodedToken.picture || '',
          displayCurrency: 'USD',
          createdAt: new Date().toISOString()
        });
        
        batch.set(subRef, {
          id: uid,
          tierName: 'Starter', // Always begins correctly on the Starter tier
          billingStatus: 'active',
          updatedAt: new Date().toISOString()
        });
        
        await batch.commit();
      }
      
      res.json({ success: true });
    } catch (err: any) {
      console.error('[Auth Init Error]', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/market/status', (req, res) => {
    res.json({
      status: 'active',
      marketSource: 'TCGPlayer / Pokemon TCG API Sync',
      lastSynced: new Date().toISOString(),
      baseCurrency: 'USD',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
    });
  });

  app.post('/api/deck/export-ptcgl', (req, res) => {
    try {
      const { deckName, entries } = req.body;
      if (!entries || !Array.isArray(entries)) {
        res.status(400).json({ error: 'Invalid entries array provided' });
        return;
      }

      const formattedLines: string[] = [`# Deck: ${deckName || 'Untitled Deck'}`, ''];
      
      entries.forEach((entry: any) => {
        const qty = entry.quantity || 1;
        const name = entry.card?.name || 'Unknown Card';
        const setCode = entry.card?.set?.ptcgoCode || entry.card?.set?.id || 'PR';
        const num = entry.card?.number || '1';
        formattedLines.push(`${qty} ${name} ${setCode} ${num}`);
      });

      res.json({
        success: true,
        ptcglFormat: formattedLines.join('\n'),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to export deck' });
    }
  });

  // --- TCGdex Proxy Endpoints ---
  
  app.get('/api/tcgdex/index-data', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
        body: JSON.stringify({
          query: `
            query {
              cards(filters: {}) {
                id
                localId
                name
                hp
                types
                rarity
                illustrator
                image
                category
                stage
                regulationMark
                legal {
                  standard
                  expanded
                }
                variants {
                  normal
                  reverse
                  holo
                  firstEdition
                }
                set {
                  id
                  name
                  symbol
                  logo
                }
              }
            }
          `
        })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch from TCGDex GraphQL');
      }
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tcgdex/cards', async (req, res) => {
    try {
      const name = req.query.name as string;
      const response = await fetch('https://api.tcgdex.net/v2/en/cards' + (name ? `?name=${encodeURIComponent(name)}` : ''));
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tcgdex/cards/:id', async (req, res) => {
    try {
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards/${req.params.id}`);
      if (!response.ok) throw new Error('Failed to fetch card');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tcgdex/categories', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tcgdex/stages', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/stages');
      if (!response.ok) throw new Error('Failed to fetch stages');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tcgdex/series', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/series');
      if (!response.ok) throw new Error('Failed to fetch series');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // --- Exchange Rate API Endpoint ---
  let cachedExchangeRates: { rates: Record<string, number>; timestamp: number; provider: string } | null = null;

  app.get('/api/exchange-rates', async (req, res) => {
    try {
      const NOW = Date.now();
      // Use cache if less than 1 hour old and not forced refresh
      if (cachedExchangeRates && (NOW - cachedExchangeRates.timestamp < 3600000) && !req.query.force) {
        return res.json({
          success: true,
          base: 'USD',
          rates: cachedExchangeRates.rates,
          updated: new Date(cachedExchangeRates.timestamp).toISOString(),
          provider: cachedExchangeRates.provider,
          cached: true
        });
      }

      const apiKey = process.env.EXCHANGE_RATE_API_KEY?.trim();
      let rates: Record<string, number> | null = null;
      let provider = 'ExchangeRate-API Open';

      if (apiKey && apiKey !== 'MY_EXCHANGE_RATE_API_KEY') {
        try {
          const keyUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
          const apiRes = await fetch(keyUrl);
          if (apiRes.ok) {
            const data = await apiRes.json();
            if (data.rates || data.conversion_rates) {
              rates = data.rates || data.conversion_rates;
              provider = 'ExchangeRate-API Pro (Key Configured)';
            }
          }
        } catch (e) {
          console.warn('Failed fetching with custom ExchangeRate API key, falling back to open endpoint:', e);
        }
      }

      // Fallback to open ExchangeRate-API endpoint if no key or key fetch failed
      if (!rates) {
        try {
          const openRes = await fetch('https://open.er-api.com/v6/latest/USD');
          if (openRes.ok) {
            const openData = await openRes.json();
            if (openData.rates) {
              rates = openData.rates;
              provider = 'ExchangeRate-API Live (Open)';
            }
          }
        } catch (e) {
          console.warn('Failed fetching open ExchangeRate API:', e);
        }
      }

      // Static fallback if network fails
      if (!rates) {
        rates = {
          USD: 1.0,
          EUR: 0.92,
          GBP: 0.78,
          JPY: 155.0,
          CAD: 1.38,
          AUD: 1.52,
          CHF: 0.89,
          INR: 83.5,
          SGD: 1.35,
          HKD: 7.82,
          NZD: 1.65,
          BRL: 5.65,
          CNY: 7.25,
          KRW: 1380.0,
          MXN: 18.5,
          SEK: 10.6,
          NOK: 10.8,
          DKK: 6.85,
          PLN: 3.95,
          TRY: 33.0,
        };
        provider = 'Fallback Default Rates';
      }

      cachedExchangeRates = { rates, timestamp: NOW, provider };

      res.json({
        success: true,
        base: 'USD',
        rates,
        updated: new Date(NOW).toISOString(),
        provider,
        cached: false
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch exchange rates' });
    }
  });

  app.get('/api/tcgdex/illustrators', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/illustrators');
      if (!response.ok) throw new Error('Failed to fetch illustrators');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/tcgdex/image/*', async (req, res) => {
    try {
      const urlPath = req.params[0];
      const imageUrl = `https://assets.tcgdex.net/${urlPath}`;
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Image not found');
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const contentType = response.headers.get('content-type');
      if (contentType) res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.send(buffer);
    } catch (err: any) {
      res.status(404).send('Not found');
    }
  });

  app.get('/api/tcgdex/sets', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/sets');
      if (!response.ok) throw new Error('Failed to fetch sets');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // --- End TCGdex Proxy ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Deck Divider Express Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
