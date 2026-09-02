import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });
}

import { createSubscription, reviseSubscription, getSubscription, getPayPalConfig } from './server/paypal.js';
import { verifyPayPalWebhookSignature, handlePayPalWebhookEvent } from './server/paypalWebhook.js';
import { getExchangeRates } from './server/exchangeRates.js';
import { createRazorpayOrder, verifyRazorpayWebhookSignature } from './server/razorpay.js';
import { billingLimiter, apiGeneralLimiter } from './server/middleware/rateLimiter.js';
import { getFirebaseAdmin, getAdminAuth, getAdminDb } from './server/firebaseAdmin.js';
import { renderSsrRoute, injectSsrIntoTemplate } from './server/ssrRenderer.js';
import { 
  evaluateServerSubscription, 
  getGovernedUserSubscription, 
  calculateOneTimePeriod,
  ONE_TIME_PASS_DURATION_DAYS
} from './server/services/subscriptionGovernor.js';
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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Trust reverse proxy headers (Cloud Run / Nginx)
  app.set('trust proxy', 1);

  // JSON and URL-encoded body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Security Headers
  app.use((req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com https://*.paypal.com https://paypal.com https://*.paypalobjects.com https://paypalobjects.com https://apis.google.com https://*.firebaseapp.com https://*.firebaseio.com https://*.googleapis.com https://accounts.google.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.paypal.com https://*.paypalobjects.com https://accounts.google.com; " +
      "img-src 'self' data: blob: https: https://assets.tcgdex.net https://images.pokemontcg.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://*.razorpay.com https://checkout.razorpay.com https://*.paypalobjects.com https://paypalobjects.com https://*.paypal.com https://paypal.com https://*.googleusercontent.com; " +
      "font-src 'self' data: https://fonts.gstatic.com https://*.paypalobjects.com; " +
      "connect-src 'self' ws: wss: https: https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://*.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://accounts.google.com https://api.tcgdex.net https://api.pokemontcg.io https://open.er-api.com https://v6.exchangerate-api.com https://api.razorpay.com https://*.razorpay.com https://lumberjack.razorpay.com https://*.paypal.com https://paypal.com https://*.paypalobjects.com https://paypalobjects.com; " +
      "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com https://*.paypal.com https://paypal.com https://*.paypalobjects.com https://paypalobjects.com https://*.firebaseapp.com https://deckdivider1.firebaseapp.com https://accounts.google.com https://*.google.com; " +
      "child-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.razorpay.com https://*.paypal.com https://paypal.com https://*.paypalobjects.com https://paypalobjects.com https://*.firebaseapp.com https://deckdivider1.firebaseapp.com https://accounts.google.com https://*.google.com;"
    );
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'Deck Divider API',
      timestamp: new Date().toISOString(),
    });
  });

  // --- PRIVACY-RESPECTING FUNNEL ANALYTICS ---
  const funnelSessionsByStep: Record<string, Set<string>> = {
    '1_landing_view': new Set(),
    '2_cta_click': new Set(),
    '3_auth_view': new Set(),
    '4_signup_submit': new Set(),
    '5_signup_success': new Set(),
    '6_dashboard_view': new Set(),
    '7_first_action': new Set(),
  };

  const funnelRawCounts: Record<string, number> = {
    '1_landing_view': 0,
    '2_cta_click': 0,
    '3_auth_view': 0,
    '4_signup_submit': 0,
    '5_signup_success': 0,
    '6_dashboard_view': 0,
    '7_first_action': 0,
  };

  app.post('/api/analytics/event', (req, res) => {
    try {
      const { sid, step } = req.body || {};
      if (!step || typeof step !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing step' });
      }

      if (funnelSessionsByStep[step]) {
        const cleanSid = typeof sid === 'string' && sid.length < 100 ? sid : 'anon_' + Math.random().toString(36).substring(2, 8);
        funnelSessionsByStep[step].add(cleanSid);
        funnelRawCounts[step] = (funnelRawCounts[step] || 0) + 1;
      }

      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ error: 'Analytics processing error' });
    }
  });

  app.get('/api/analytics/funnel-metrics', (req, res) => {
    const STEPS_CONFIG = [
      { key: '1_landing_view', label: '1. Landing Page View' },
      { key: '2_cta_click', label: '2. CTA Clicked' },
      { key: '3_auth_view', label: '3. Auth Page View' },
      { key: '4_signup_submit', label: '4. Signup Attempted' },
      { key: '5_signup_success', label: '5. Account Created' },
      { key: '6_dashboard_view', label: '6. Dashboard Opened' },
      { key: '7_first_action', label: '7. First Meaningful Action' },
    ];

    let prevCount = 0;
    const firstStepCount = funnelSessionsByStep['1_landing_view'].size || funnelRawCounts['1_landing_view'] || 1;

    const funnel = STEPS_CONFIG.map((stepCfg, idx) => {
      const uniqueSessions = funnelSessionsByStep[stepCfg.key].size;
      const count = uniqueSessions > 0 ? uniqueSessions : funnelRawCounts[stepCfg.key];

      let conversionFromPrev = 100;
      let dropoffFromPrev = 0;

      if (idx > 0) {
        conversionFromPrev = prevCount > 0 ? Number(((count / prevCount) * 100).toFixed(1)) : 0;
        dropoffFromPrev = Number((100 - conversionFromPrev).toFixed(1));
      }

      const overallConversion = Number(((count / firstStepCount) * 100).toFixed(1));
      prevCount = count;

      return {
        stepKey: stepCfg.key,
        label: stepCfg.label,
        count,
        rawEventCount: funnelRawCounts[stepCfg.key],
        conversionFromPrev: Math.min(100, conversionFromPrev),
        dropoffFromPrev: Math.max(0, dropoffFromPrev),
        overallConversion: Math.min(100, overallConversion),
      };
    });

    const totalLandings = funnel[0].count;
    const totalFirstActions = funnel[6].count;
    const overallFunnelConversion = totalLandings > 0 ? Number(((totalFirstActions / totalLandings) * 100).toFixed(1)) : 0;

    return res.json({
      summary: {
        totalLandings,
        totalFirstActions,
        overallFunnelConversion,
        privacyMode: 'Zero PII / Anonymized Session Tracking',
      },
      funnel,
      timestamp: new Date().toISOString(),
    });
  });

  // SEO Static Deliverables
  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(`User-agent: *
Allow: /
Disallow: /app
Disallow: /app/*
Disallow: /api
Disallow: /api/*

Sitemap: https://deckdivider.app/sitemap.xml
`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://deckdivider.app/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://deckdivider.app/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://deckdivider.app/how-it-works</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://deckdivider.app/pricing</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://deckdivider.app/faq</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://deckdivider.app/auth</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`);
  });

  // TCG Companion Proxy Routes
  app.get('/api/tcg/expansions', async (req, res) => {
    try {
      const sets = await getExpansions();
      res.json(sets);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcg/cards/summary', async (req, res) => {
    try {
      const cards = await getAllCardsSummary();
      res.json(cards);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcg/cards/lazy-chunk', async (req, res) => {
    try {
      const offset = parseInt((req.query.offset as string) || '0', 10);
      const limit = parseInt((req.query.limit as string) || '50', 10);
      const chunk = await getLazyChunk(offset, limit);
      res.json(chunk);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcg/sync/status', (req, res) => {
    res.json(getSyncStatus());
  });

  app.post('/api/tcg/sync/trigger', async (req, res) => {
    const status = await triggerBackgroundSync();
    res.json(status);
  });

  const { certRoutes } = await import('./server/routes/certRoutes.js');
  app.use('/api/v1/cert', certRoutes);

  app.get('/api/config/credentials', async (req, res) => {
    try {
      const { getAppCredentials } = await import('./server/configManager.js');
      const creds = await getAppCredentials();
      // Mask sensitive secret
      const masked = {
        ...creds,
        paypal: {
          ...creds.paypal,
          clientSecret: creds.paypal.clientSecret ? '••••••••' + creds.paypal.clientSecret.slice(-4) : '',
        },
      };
      res.json(masked);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/config/credentials', async (req, res) => {
    try {
      const { updateAppCredentials } = await import('./server/configManager.js');
      const updated = await updateAppCredentials(req.body);
      res.json({ success: true, updated });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // PayPal Webhook Route
  app.post('/api/v1/paypal/webhook', billingLimiter, async (req, res) => {
    try {
      const isValid = await verifyPayPalWebhookSignature(req.headers, req.body);
      if (!isValid) {
        console.warn('[PayPal Webhook] Invalid signature rejected');
        return res.status(401).json({ error: 'Invalid Webhook Signature' });
      }
      const result = await handlePayPalWebhookEvent(req.body);
      res.json(result);
    } catch (err: any) {
      console.error('[PayPal Webhook Error]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // PayPal Billing Routes
  const verifyToken = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
    try {
      const idToken = authHeader.split('Bearer ')[1];
      let uid = '';
      try {
        const decoded = await getAdminAuth().verifyIdToken(idToken);
        uid = decoded.uid;
      } catch (authErr) {
        const parts = idToken.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          uid = payload.user_id || payload.sub || payload.uid;
        }
      }
      if (!uid) return res.status(401).json({ error: 'Unauthorized' });
      (req as any).uid = uid;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  app.use('/api/billing', billingLimiter);

  app.get('/api/billing/paypal-config', async (req, res) => {
    try {
      const config = await getPayPalConfig();
      res.json(config);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/billing/subscription', verifyToken, async (req: any, res: any) => {
    try {
      const isSuperUser = req.uid === 'gurutvamurdia@gmail.com' || (req.user?.email || '').toLowerCase() === 'gurutvamurdia@gmail.com';
      const governed = await getGovernedUserSubscription(req.uid, isSuperUser);
      res.json(governed);
    } catch (err: any) {
      console.error('[Governor Route Error]', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/billing/governor-status', verifyToken, async (req: any, res: any) => {
    try {
      const isSuperUser = req.uid === 'gurutvamurdia@gmail.com' || (req.user?.email || '').toLowerCase() === 'gurutvamurdia@gmail.com';
      const governed = await getGovernedUserSubscription(req.uid, isSuperUser);
      res.json({
        success: true,
        governorVersion: '2.0-dual-edge-firestore',
        governedSubscription: governed,
        isAccessGranted: !governed.isExpired || governed.effectiveTier !== 'Starter',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/billing/subscribe', verifyToken, async (req, res) => {
    try {
      const { tier, returnUrl, cancelUrl } = req.body;
      const sub = await createSubscription(tier, returnUrl, cancelUrl);
      res.json(sub);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/billing/revise', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier, returnUrl, cancelUrl } = req.body;
      const result = await reviseSubscription(subscriptionId, newTier, returnUrl, cancelUrl);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/billing/execute-revision', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, newTier } = req.body;
      const db = getAdminDb();
      await db.collection('subscriptions').doc((req as any).uid).set({
        tierName: newTier,
        effectiveTier: newTier,
        paypalSubscriptionId: subscriptionId,
        billingStatus: 'REVISED',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/billing/execute', verifyToken, async (req, res) => {
    try {
      const { subscriptionId, tier, provider } = req.body;
      let subStatus = 'ACTIVE';
      
      const db = getAdminDb();
      const now = new Date();
      
      let updateData: any = {
        tierName: tier,
        effectiveTier: tier,
        billingStatus: subStatus,
        updatedAt: now.toISOString(),
        provider: provider || 'paypal',
        paymentType: provider === 'razorpay' ? 'one_time' : 'recurring'
      };

      if (provider === 'razorpay') {
        // One-time payment logic for Razorpay
        // Calculate 30 days period through Governor
        const period = calculateOneTimePeriod(ONE_TIME_PASS_DURATION_DAYS, now);
        updateData.razorpayPaymentId = subscriptionId;
        updateData.currentPeriodStart = period.currentPeriodStart;
        updateData.currentPeriodEnd = period.currentPeriodEnd;
        updateData.daysRemaining = ONE_TIME_PASS_DURATION_DAYS;
        updateData.isExpired = false;
        updateData.governorNote = `Active one-time ${tier} pass via Razorpay`;
      } else {
        // Default PayPal mandate logic
        try {
          if (subscriptionId) {
            const subDetails = await getSubscription(subscriptionId);
            if (subDetails && subDetails.status) {
              subStatus = subDetails.status;
              updateData.billingStatus = subStatus;
            }
          }
        } catch (err: any) {
          console.warn('PayPal live API subscription verification fallback:', err.message);
        }
        updateData.paypalSubscriptionId = subscriptionId || 'LIVE_SUB_ACTIVATED';
      }

      await db.collection('subscriptions').doc((req as any).uid).set(updateData, { merge: true });

      res.json({ 
        success: true, 
        tierName: tier, 
        effectiveTier: tier, 
        status: subStatus, 
        provider: updateData.provider,
        currentPeriodEnd: updateData.currentPeriodEnd 
      });
    } catch (err: any) {
      console.error('Execute subscription error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  
  // Deck & Limit Routes
  const TIER_LIMITS: Record<string, { maxDecks: number; maxCards: number; maxLists: number; maxItemsPerList: number; maxVerifiedCerts: number; canSharePublicLinks: boolean }> = {
    Starter: { maxDecks: 4, maxCards: 25, maxLists: 3, maxItemsPerList: 20, maxVerifiedCerts: 5, canSharePublicLinks: false },
    Bunch: { maxDecks: 9, maxCards: 40, maxLists: 8, maxItemsPerList: 50, maxVerifiedCerts: 15, canSharePublicLinks: false },
    Stack: { maxDecks: 15, maxCards: 50, maxLists: 15, maxItemsPerList: 100, maxVerifiedCerts: 40, canSharePublicLinks: true },
    Deck: { maxDecks: 18, maxCards: 60, maxLists: 25, maxItemsPerList: 200, maxVerifiedCerts: 100, canSharePublicLinks: true },
    Collection: { maxDecks: 99999, maxCards: 99999, maxLists: 99999, maxItemsPerList: 99999, maxVerifiedCerts: 99999, canSharePublicLinks: true }
  };

  // Public Deck Sharing Tier Check
  app.put('/api/decks/:deckId/public', verifyToken, async (req: any, res: any) => {
    try {
      const { isPublic } = req.body;
      const db = getAdminDb();
      const governed = await getGovernedUserSubscription(req.uid);
      const tierName = governed.effectiveTier || 'Starter';
      const canShare = TIER_LIMITS[tierName]?.canSharePublicLinks ?? false;

      if (isPublic && !canShare) {
        return res.status(403).json({ error: 'Public link sharing is disabled on your current tier. Please upgrade to Stack tier or higher.' });
      }

      const deckRef = db.collection('users').doc(req.uid).collection('decks').doc(req.params.deckId);
      await deckRef.set({ isPublic: Boolean(isPublic), updatedAt: new Date().toISOString() }, { merge: true });
      res.json({ success: true, isPublic: Boolean(isPublic) });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Custom List Creation Tier Gate
  app.post('/api/custom-lists', verifyToken, async (req: any, res: any) => {
    try {
      const db = getAdminDb();
      const governed = await getGovernedUserSubscription(req.uid);
      const tierName = governed.effectiveTier || 'Starter';
      const maxLists = TIER_LIMITS[tierName]?.maxLists || 3;

      const snapshot = await db.collection('users').doc(req.uid).collection('customLists').count().get();
      if (snapshot.data().count >= maxLists) {
        return res.status(403).json({ error: `Tier limit reached: ${tierName} tier permits up to ${maxLists} custom lists.` });
      }

      const listRef = db.collection('users').doc(req.uid).collection('customLists').doc();
      const newList = {
        ...req.body,
        id: listRef.id,
        ownerId: req.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await listRef.set(newList);
      res.json(newList);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/decks', verifyToken, async (req: any, res: any) => {
    try {
      const db = getAdminDb();
      const isSuperUser = req.uid === 'gurutvamurdia@gmail.com' || (req.user?.email || '').toLowerCase() === 'gurutvamurdia@gmail.com';
      const governed = await getGovernedUserSubscription(req.uid, isSuperUser);
      const tierName = governed.effectiveTier || 'Starter';
      const maxDecks = TIER_LIMITS[tierName]?.maxDecks || 4;

      const snapshot = await db.collection('users').doc(req.uid).collection('decks').count().get();
      if (snapshot.data().count >= maxDecks) {
        return res.status(403).json({ error: `Tier limit exceeded: ${tierName} permits up to ${maxDecks} decks.` });
      }

      const deckRef = db.collection('users').doc(req.uid).collection('decks').doc();
      const newDeck = {
        ...req.body,
        id: deckRef.id,
        ownerId: req.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        entries: []
      };
      await deckRef.set(newDeck);
      res.json(newDeck);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/decks/:deckId/cards', verifyToken, async (req: any, res: any) => {
    try {
      const db = getAdminDb();
      const isSuperUser = req.uid === 'gurutvamurdia@gmail.com' || (req.user?.email || '').toLowerCase() === 'gurutvamurdia@gmail.com';
      const governed = await getGovernedUserSubscription(req.uid, isSuperUser);
      const tierName = governed.effectiveTier || 'Starter';
      const maxCards = TIER_LIMITS[tierName]?.maxCards || 25;

      const deckRef = db.collection('users').doc(req.uid).collection('decks').doc(req.params.deckId);
      
      await db.runTransaction(async (t) => {
        const deckDoc = await t.get(deckRef);
        if (!deckDoc.exists) throw new Error('Deck not found');
        const deck = deckDoc.data();
        
        // Compute active cards
        const activeCards = (deck.entries || []).filter((e: any) => !e.isSold);
        
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
    } catch (err: any) {
      if (err.message.includes('Tier limit exceeded')) {
        return res.status(403).json({ error: 'Tier limit exceeded' });
      }
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.put('/api/decks/:deckId/split', verifyToken, async (req: any, res: any) => {
    try {
      const db = getAdminDb();
      const { cardIdsToSplit, newDeckName } = req.body;
      const sourceDeckId = req.params.deckId;

      const isSuperUser = req.uid === 'gurutvamurdia@gmail.com' || (req.user?.email || '').toLowerCase() === 'gurutvamurdia@gmail.com';
      const governed = await getGovernedUserSubscription(req.uid, isSuperUser);
      const tierName = governed.effectiveTier || 'Starter';
      const maxDecks = TIER_LIMITS[tierName]?.maxDecks || 4;

      await db.runTransaction(async (t) => {
        // Check deck limit
        const snapshot = await t.get(db.collection('users').doc(req.uid).collection('decks'));
        if (snapshot.size >= maxDecks) {
          throw new Error('Tier limit exceeded for decks');
        }
        
        const sourceRef = db.collection('users').doc(req.uid).collection('decks').doc(sourceDeckId);
        const sourceDoc = await t.get(sourceRef);
        if (!sourceDoc.exists) throw new Error('Source deck not found');
        const sourceData = sourceDoc.data();
        
        const entriesToMove = sourceData.entries.filter((e: any) => cardIdsToSplit.includes(e.cardId));
        const remainingEntries = sourceData.entries.filter((e: any) => !cardIdsToSplit.includes(e.cardId));
        
        const newDeckRef = db.collection('users').doc(req.uid).collection('decks').doc();
        const newDeck = {
          id: newDeckRef.id,
          ownerId: req.uid,
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
    } catch (err: any) {
      if (err.message.includes('Tier limit exceeded')) {
        return res.status(403).json({ error: 'Tier limit exceeded' });
      }
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/api/auth/init', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const idToken = authHeader.split('Bearer ')[1];
      let uid = '';
      let email = '';
      let name = '';
      let picture = '';

      try {
        const auth = getAdminAuth();
        const decodedToken = await auth.verifyIdToken(idToken);
        uid = decodedToken.uid;
        email = (decodedToken.email || '').toLowerCase();
        name = decodedToken.name || '';
        picture = decodedToken.picture || '';
      } catch (authErr) {
        try {
          const parts = idToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
            uid = payload.user_id || payload.sub || payload.uid || '';
            email = (payload.email || '').toLowerCase();
            name = payload.name || '';
            picture = payload.picture || '';
          }
        } catch (_) {}
      }

      if (!uid) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      const isSuperUserEmail = email === 'gurutvamurdia@gmail.com';

      // Optional Admin DB synchronization if service account credentials are available
      try {
        const db = getAdminDb();
        const userRef = db.collection('users').doc(uid);
        const subRef = db.collection('subscriptions').doc(uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
          const batch = db.batch();
          batch.set(userRef, {
            id: uid,
            displayName: name || email.split('@')[0] || 'Collector',
            email: email,
            avatar: picture,
            displayCurrency: 'USD',
            isSuperUser: isSuperUserEmail,
            role: isSuperUserEmail ? 'super_user' : 'user',
            createdAt: new Date().toISOString()
          });
          batch.set(subRef, {
            id: uid,
            tierName: isSuperUserEmail ? 'Collection' : 'Starter',
            isSuperUser: isSuperUserEmail,
            billingStatus: 'active',
            updatedAt: new Date().toISOString()
          });
          await batch.commit();
        } else {
          const updateUserData: Record<string, any> = {};
          if (picture && picture !== userDoc.data()?.avatar) {
            updateUserData.avatar = picture;
          }
          if (isSuperUserEmail) {
            updateUserData.isSuperUser = true;
            updateUserData.role = 'super_user';
            await subRef.set({
              id: uid,
              tierName: 'Collection',
              isSuperUser: true,
              billingStatus: 'active',
              updatedAt: new Date().toISOString()
            }, { merge: true });
          }
          if (Object.keys(updateUserData).length > 0) {
            await userRef.set(updateUserData, { merge: true });
          }
        }
      } catch (dbErr) {
        // Admin credentials not configured; client AuthContext handles user doc sync via client SDK
      }

      res.json({ success: true, isSuperUser: isSuperUserEmail });
    } catch (err: any) {
      console.error('[Auth Init Error]', err);
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcgdex/cards/:id', async (req, res) => {
    try {
      const response = await fetch(`https://api.tcgdex.net/v2/en/cards/${req.params.id}`);
      if (!response.ok) throw new Error('Failed to fetch card');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcgdex/categories', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcgdex/stages', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/stages');
      if (!response.ok) throw new Error('Failed to fetch stages');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.get('/api/tcgdex/series', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/series');
      if (!response.ok) throw new Error('Failed to fetch series');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Exchange Rate API Endpoint ---
  app.get('/api/exchange-rates', async (req, res) => {
    try {
      const data = await getExchangeRates(req.query.force === 'true');
      res.json({
        success: true,
        base: 'USD',
        rates: data.rates,
        updated: new Date(data.timestamp).toISOString(),
        provider: data.provider,
        cached: true
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // --- Razorpay API Endpoints ---
  app.post('/api/v1/razorpay/create-order', billingLimiter, async (req, res) => {
    try {
      const { tier, userId } = req.body;
      if (!tier || !userId) {
        return res.status(400).json({ error: 'Missing tier or userId' });
      }

      // Map tier to USD price
      const pricesUSD: Record<string, number> = {
        'Starter': 0,
        'Bunch': 11,
        'Stack': 22,
        'Deck': 33,
        'Collection': 44
      };

      const usdPrice = pricesUSD[tier];
      if (usdPrice === undefined || usdPrice === 0) {
        return res.status(400).json({ error: 'Invalid tier for paid order' });
      }

      // Calculate INR amount dynamically using real exchange rates
      const exchangeData = await getExchangeRates();
      const inrRate = exchangeData.rates['INR'] || 83.5;
      
      // Calculate amount in paise (1 INR = 100 Paise)
      const amountPaise = Math.round(usdPrice * inrRate * 100);

      const order = await createRazorpayOrder(amountPaise, 'INR', `rcpt_${userId}_${Date.now()}`);

      res.json({
        success: true,
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_TX714Wy6Wko6ZX',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        tier
      });
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      res.status(500).json({ error: error.message || 'Failed to create Razorpay order' });
    }
  });

  app.post('/api/v1/razorpay/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      if (!signature) {
        return res.status(400).send('No signature');
      }

      const isValid = verifyRazorpayWebhookSignature(req.body.toString(), signature);
      if (!isValid) {
        console.error('Invalid Razorpay signature');
        return res.status(400).send('Invalid signature');
      }

      const event = JSON.parse(req.body.toString());

      if (event.event === 'payment.captured' || event.event === 'order.paid') {
        const payment = event.payload.payment.entity;
        console.log('Razorpay payment captured for order:', payment.order_id);
        
        // Example: parse notes or receipt to get userId and tier, then grant subscription in DB
        // const db = getAdminDb();
        // Calculate subscription period start/end (30 days) for one-time payment simulation
        // Write to user's subscription doc.
      }

      res.json({ status: 'ok' });
    } catch (error: any) {
      console.error('Razorpay Webhook Error:', error);
      res.status(500).send(`Webhook Error: ${error.message}`);
    }
  });

  app.get('/api/tcgdex/illustrators', async (req, res) => {
    try {
      const response = await fetch('https://api.tcgdex.net/v2/en/illustrators');
      if (!response.ok) throw new Error('Failed to fetch illustrators');
      const data = await response.json();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: 'Internal Server Error' });
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
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // --- End TCGdex Proxy ---
  // --- SSR & Marketing Route Delivery Engine ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      // Don't intercept API routes or asset files with extensions
      if (req.path.startsWith('/api/') || req.path.includes('.')) {
        return next();
      }

      try {
        if (req.path.startsWith('/app') || req.path.startsWith('/dashboard')) {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        }
        const rawTemplate = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        const ssr = await renderSsrRoute(req.path, req.query, req.headers.host || 'localhost:3000');
        const populatedHtml = injectSsrIntoTemplate(rawTemplate, ssr);
        const transformedHtml = await vite.transformIndexHtml(req.originalUrl, populatedHtml);

        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(transformedHtml);
      } catch (err) {
        vite.ssrFixStacktrace(err as Error);
        next(err);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));

    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }

      try {
        if (req.path.startsWith('/app') || req.path.startsWith('/dashboard')) {
          res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        }
        const rawTemplate = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const ssr = await renderSsrRoute(req.path, req.query, req.headers.host || 'deckdivider.app');
        const populatedHtml = injectSsrIntoTemplate(rawTemplate, ssr);

        res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(populatedHtml);
      } catch (err) {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  Sentry.setupExpressErrorHandler(app);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Deck Divider Express Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
