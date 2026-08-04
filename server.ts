import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { getFirebaseAdmin, getAdminAuth, getAdminDb } from './server/firebaseAdmin.js';
import {
  getExpansions,
  getAllCardsSummary,
  getCardDetail,
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
                  wPrerelease
                  secret100
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
