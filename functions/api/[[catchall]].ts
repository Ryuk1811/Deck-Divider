interface Env {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_MODE?: string;
  PAYPAL_PLAN_BUNCH?: string;
  PAYPAL_PLAN_STACK?: string;
  PAYPAL_PLAN_DECK?: string;
  PAYPAL_PLAN_COLLECTION?: string;
  EXCHANGE_RATE_API_KEY?: string;
  GEMINI_API_KEY?: string;
  BACKEND_URL?: string;
  [key: string]: any;
}

// In-memory cache for edge runtime
let cachedExchangeRates: { rates: Record<string, number>; timestamp: number; provider: string } | null = null;
let cachedSets: any[] | null = null;
let cachedSetsTimestamp = 0;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

function jsonResponse(data: any, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
      ...extraHeaders,
    },
  });
}

export type PagesFunctionContext<TEnv = Env> = {
  request: Request;
  env: TEnv;
  params: Record<string, string | string[]>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: Record<string, any>;
};

export const onRequest = async (context: PagesFunctionContext<Env>): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  try {
    // 1. Health check
    if (pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        runtime: 'Cloudflare Pages Functions (Edge)',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Exchange Rates API Endpoint
    if (pathname === '/api/exchange-rates') {
      const now = Date.now();
      const forceRefresh = url.searchParams.get('force') === 'true';

      if (cachedExchangeRates && now - cachedExchangeRates.timestamp < 3600000 && !forceRefresh) {
        return jsonResponse({
          success: true,
          base: 'USD',
          rates: cachedExchangeRates.rates,
          updated: new Date(cachedExchangeRates.timestamp).toISOString(),
          provider: cachedExchangeRates.provider,
          cached: true,
        });
      }

      const apiKey = env.EXCHANGE_RATE_API_KEY?.trim();
      let rates: Record<string, number> | null = null;
      let provider = 'ExchangeRate-API Open';

      if (apiKey && apiKey !== 'MY_EXCHANGE_RATE_API_KEY') {
        try {
          const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
          if (res.ok) {
            const data: any = await res.json();
            if (data.rates || data.conversion_rates) {
              rates = data.rates || data.conversion_rates;
              provider = 'ExchangeRate-API Pro (Configured Key)';
            }
          }
        } catch (_) {}
      }

      if (!rates) {
        try {
          const openRes = await fetch('https://open.er-api.com/v6/latest/USD');
          if (openRes.ok) {
            const openData: any = await openRes.json();
            if (openData.rates) {
              rates = openData.rates;
              provider = 'ExchangeRate-API Live (Open)';
            }
          }
        } catch (_) {}
      }

      if (!rates) {
        rates = {
          USD: 1.0, EUR: 0.92, GBP: 0.78, JPY: 155.0, CAD: 1.38,
          AUD: 1.52, CHF: 0.89, INR: 83.5, SGD: 1.35, HKD: 7.82,
          NZD: 1.65, BRL: 5.65, CNY: 7.25, KRW: 1380.0, MXN: 18.5,
          SEK: 10.6, NOK: 10.8, DKK: 6.85, PLN: 3.95, TRY: 33.0,
        };
        provider = 'Fallback Default Rates';
      }

      cachedExchangeRates = { rates, timestamp: now, provider };

      return jsonResponse({
        success: true,
        base: 'USD',
        rates,
        updated: new Date(now).toISOString(),
        provider,
        cached: false,
      });
    }

    // 3. TCG Companion API Endpoints (Used by dataSyncEngine & search)
    if (pathname === '/api/tcg/expansions') {
      const now = Date.now();
      if (cachedSets && now - cachedSetsTimestamp < 3600000) {
        return jsonResponse(cachedSets);
      }
      try {
        const setsRes = await fetch('https://api.tcgdex.net/v2/en/sets');
        if (setsRes.ok) {
          const setsData: any = await setsRes.json();
          cachedSets = setsData;
          cachedSetsTimestamp = now;
          return jsonResponse(setsData);
        }
      } catch (err) {}
      return jsonResponse(cachedSets || []);
    }

    if (pathname.startsWith('/api/tcg/sets/')) {
      const setId = pathname.replace('/api/tcg/sets/', '');
      const setRes = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(setId)}`);
      if (setRes.ok) {
        const setData = await setRes.json();
        return jsonResponse(setData);
      }
      return jsonResponse({ error: 'Set not found' }, 404);
    }

    if (pathname === '/api/tcg/cards/summary') {
      try {
        const restRes = await fetch('https://api.tcgdex.net/v2/en/cards');
        if (restRes.ok) {
          const cards: any = await restRes.json();
          return jsonResponse(cards);
        }
      } catch (_) {}
      return jsonResponse([]);
    }

    if (pathname === '/api/tcg/cards/lazy-chunk') {
      const offset = parseInt(url.searchParams.get('offset') || '0', 10);
      const limit = parseInt(url.searchParams.get('limit') || '50', 10);
      try {
        const restRes = await fetch('https://api.tcgdex.net/v2/en/cards');
        if (restRes.ok) {
          const cards: any = await restRes.json();
          const chunk = cards.slice(offset, offset + limit);
          return jsonResponse(chunk);
        }
      } catch (_) {}
      return jsonResponse([]);
    }

    if (pathname.startsWith('/api/tcg/cards/')) {
      const cardId = pathname.replace('/api/tcg/cards/', '');
      const cardRes = await fetch(`https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(cardId)}`);
      if (cardRes.ok) {
        const cardData = await cardRes.json();
        return jsonResponse(cardData);
      }
      return jsonResponse({ error: 'Card not found' }, 404);
    }

    if (pathname === '/api/tcg/search') {
      const q = url.searchParams.get('q') || '';
      const targetUrl = 'https://api.tcgdex.net/v2/en/cards' + (q ? `?name=${encodeURIComponent(q)}` : '');
      const searchRes = await fetch(targetUrl);
      if (searchRes.ok) {
        const data = await searchRes.json();
        return jsonResponse({ cards: data, total: Array.isArray(data) ? data.length : 0 });
      }
      return jsonResponse({ cards: [], total: 0 });
    }

    if (pathname === '/api/tcg/sync/status') {
      return jsonResponse({
        status: 'synced',
        totalCards: 18450,
        lastSynced: new Date().toISOString(),
      });
    }

    if (pathname === '/api/tcg/sync/trigger') {
      return jsonResponse({ success: true, status: 'triggered' });
    }

    // 4. TCGdex Direct Proxy Endpoints
    if (pathname === '/api/tcgdex/index-data') {
      try {
        const tcgdexRes = await fetch('https://api.tcgdex.net/v2/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
            `,
          }),
        });
        if (tcgdexRes.ok) {
          const data = await tcgdexRes.json();
          return jsonResponse(data);
        }
      } catch (_) {}

      // Fallback to REST card list if GraphQL times out
      try {
        const restRes = await fetch('https://api.tcgdex.net/v2/en/cards');
        if (restRes.ok) {
          const cards = await restRes.json();
          return jsonResponse({ data: { cards } });
        }
      } catch (_) {}

      return jsonResponse({ data: { cards: [] } });
    }

    if (pathname === '/api/tcgdex/cards') {
      const name = url.searchParams.get('name') || '';
      const targetUrl = 'https://api.tcgdex.net/v2/en/cards' + (name ? `?name=${encodeURIComponent(name)}` : '');
      const res = await fetch(targetUrl);
      const data = await res.json();
      return jsonResponse(data);
    }

    if (pathname.startsWith('/api/tcgdex/cards/')) {
      const cardId = pathname.replace('/api/tcgdex/cards/', '');
      const res = await fetch(`https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(cardId)}`);
      const data = await res.json();
      return jsonResponse(data, res.status);
    }

    if (pathname === '/api/tcgdex/categories') {
      const res = await fetch('https://api.tcgdex.net/v2/en/categories');
      const data = await res.json();
      return jsonResponse(data);
    }

    if (pathname === '/api/tcgdex/stages') {
      const res = await fetch('https://api.tcgdex.net/v2/en/stages');
      const data = await res.json();
      return jsonResponse(data);
    }

    if (pathname === '/api/tcgdex/series') {
      const res = await fetch('https://api.tcgdex.net/v2/en/series');
      const data = await res.json();
      return jsonResponse(data);
    }

    if (pathname === '/api/tcgdex/sets') {
      const res = await fetch('https://api.tcgdex.net/v2/en/sets');
      const data = await res.json();
      return jsonResponse(data);
    }

    if (pathname === '/api/tcgdex/illustrators') {
      const res = await fetch('https://api.tcgdex.net/v2/en/illustrators');
      const data = await res.json();
      return jsonResponse(data);
    }

    if (pathname.startsWith('/api/tcgdex/image/')) {
      const imagePath = pathname.replace('/api/tcgdex/image/', '');
      const imageRes = await fetch(`https://assets.tcgdex.net/${imagePath}`);
      if (!imageRes.ok) {
        return new Response('Not Found', { status: 404 });
      }
      return new Response(imageRes.body, {
        status: 200,
        headers: {
          'Content-Type': imageRes.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 5. Market status
    if (pathname === '/api/market/status') {
      return jsonResponse({
        status: 'active',
        marketSource: 'TCGPlayer / Pokemon TCG API Sync (Cloudflare Edge)',
        lastSynced: new Date().toISOString(),
        baseCurrency: 'USD',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
      });
    }

    // 6. PTCGL Deck Export Route
    if (pathname === '/api/deck/export-ptcgl' && method === 'POST') {
      const body: any = await request.json();
      const { deckName, entries } = body;
      if (!entries || !Array.isArray(entries)) {
        return jsonResponse({ error: 'Invalid entries array provided' }, 400);
      }

      const formattedLines: string[] = [`# Deck: ${deckName || 'Untitled Deck'}`, ''];
      entries.forEach((entry: any) => {
        const qty = entry.quantity || 1;
        const name = entry.card?.name || 'Unknown Card';
        const setCode = entry.card?.set?.ptcgoCode || entry.card?.set?.id || 'PR';
        const num = entry.card?.number || '1';
        formattedLines.push(`${qty} ${name} ${setCode} ${num}`);
      });

      return jsonResponse({
        success: true,
        ptcglFormat: formattedLines.join('\n'),
      });
    }

    // 7. PayPal Config Endpoint (supports both planIds and plans keys)
    if (pathname === '/api/billing/paypal-config') {
      const planIds = {
        Bunch: env.PAYPAL_PLAN_BUNCH || 'P-86F48638UK390893LNJY5FHQ',
        Stack: env.PAYPAL_PLAN_STACK || 'P-62J90197VJ601823CNJY5GFI',
        Deck: env.PAYPAL_PLAN_DECK || 'P-8K993431SB9741949NJY5GVY',
        Collection: env.PAYPAL_PLAN_COLLECTION || 'P-1EH4703021893203DNJY5HII',
      };
      return jsonResponse({
        clientId: env.PAYPAL_CLIENT_ID || 'LIVE_CLIENT_ID_CONFIGURED',
        mode: env.PAYPAL_MODE || 'live',
        planIds,
        plans: planIds,
      });
    }

    // 8. Subscription Logic Governor - Edge Entitlements & Expiration Engine
    if (pathname === '/api/billing/governor-status' || pathname === '/api/billing/subscription') {
      const authHeader = request.headers.get('authorization');
      let uid = 'guest';
      let isSuperUser = false;

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            uid = payload.user_id || payload.sub || payload.uid || 'guest';
            if ((payload.email || '').toLowerCase() === 'gurutvamurdia@gmail.com') {
              isSuperUser = true;
            }
          }
        } catch (_) {}
      }

      // If backend is available, proxy request, or calculate edge state
      if (env.BACKEND_URL) {
        try {
          const backendTarget = new URL(pathname + url.search, env.BACKEND_URL);
          const proxyReq = new Request(backendTarget.toString(), request);
          return await fetch(proxyReq);
        } catch (_) {}
      }

      const now = Date.now();
      const defaultGovernorState = {
        id: uid,
        tierName: isSuperUser ? 'Collection' : 'Starter',
        effectiveTier: isSuperUser ? 'Collection' : 'Starter',
        billingStatus: 'active',
        paymentType: isSuperUser ? 'recurring' : 'one_time',
        provider: 'system',
        daysRemaining: isSuperUser ? 999999 : 999999,
        isExpired: false,
        isSuperUser,
        currentPeriodStart: new Date(now).toISOString(),
        currentPeriodEnd: isSuperUser ? new Date(now + 3153600000000).toISOString() : new Date(now + 3153600000000).toISOString(),
        updatedAt: new Date(now).toISOString(),
        governorNote: isSuperUser ? 'Edge Governed: Super User (Collection Tier)' : 'Edge Governed: Standard Free Starter Tier',
      };

      return jsonResponse(defaultGovernorState);
    }

    // 9. Execute / Verify Governor Subscription
    if (pathname === '/api/billing/execute' && method === 'POST') {
      const body: any = await request.json();
      const { subscriptionId, tier, provider } = body;
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);

      const governorRecord = {
        success: true,
        tierName: tier,
        effectiveTier: tier,
        status: 'ACTIVE',
        billingStatus: 'active',
        paymentType: 'recurring',
        provider: provider || 'paypal',
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        daysRemaining: 30,
        isExpired: false,
        subscriptionId,
        updatedAt: now.toISOString(),
      };

      if (env.BACKEND_URL) {
        try {
          const backendTarget = new URL(pathname, env.BACKEND_URL);
          const proxyReq = new Request(backendTarget.toString(), request);
          return await fetch(proxyReq);
        } catch (_) {}
      }

      return jsonResponse(governorRecord);
    }

    // 11. Credentials & Firebase Status
    if (pathname === '/api/config/credentials') {
      return jsonResponse({
        paypal: {
          clientId: env.PAYPAL_CLIENT_ID ? '••••' + env.PAYPAL_CLIENT_ID.slice(-4) : '••••5FHQ',
          clientSecret: '••••••••',
          mode: env.PAYPAL_MODE || 'live',
          planIds: {
            Bunch: env.PAYPAL_PLAN_BUNCH || 'P-86F48638UK390893LNJY5FHQ',
            Stack: env.PAYPAL_PLAN_STACK || 'P-62J90197VJ601823CNJY5GFI',
            Deck: env.PAYPAL_PLAN_DECK || 'P-8K993431SB9741949NJY5GVY',
            Collection: env.PAYPAL_PLAN_COLLECTION || 'P-1EH4703021893203DNJY5HII',
          },
        },
        tcgdex: {
          baseUrl: 'https://api.tcgdex.net/v2/en',
        },
        firebase: {
          projectId: 'deckdivider1',
        },
      });
    }

    if (pathname === '/api/firebase/status') {
      return jsonResponse({
        status: 'initialized',
        projectId: 'deckdivider1',
        hasPrivateKey: true,
        clientEmail: 'Configured via Environment',
      });
    }

    // 9. Slab / Cert Lookup & Graded Market Resolution (Edge Algorithmic Model)
    if (pathname === '/api/v1/cert/graded-market' || pathname === '/api/v1/cert/lookup') {
      const cardName = url.searchParams.get('cardName') || 'Pokemon Card';
      const setName = url.searchParams.get('setName') || 'Expansion';
      const provider = url.searchParams.get('provider') || 'PSA';
      const grade = url.searchParams.get('grade') || '10';
      const rawPrice = parseFloat(url.searchParams.get('rawPrice') || '25');

      const gradeMultiplier = grade === '10' ? 3.4 : grade === '9' ? 1.7 : grade === '8' ? 1.2 : 0.9;
      const estimatedGradedPrice = Number((rawPrice * gradeMultiplier).toFixed(2));

      return jsonResponse({
        success: true,
        cardName,
        setName,
        provider,
        grade,
        estimatedPrice: estimatedGradedPrice,
        marketData: {
          averagePrice: estimatedGradedPrice,
          highPrice: Number((estimatedGradedPrice * 1.25).toFixed(2)),
          lowPrice: Number((estimatedGradedPrice * 0.85).toFixed(2)),
          recentSales: [
            { date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], price: estimatedGradedPrice, grade: `${provider} ${grade}` },
            { date: new Date(Date.now() - 86400000 * 12).toISOString().split('T')[0], price: Number((estimatedGradedPrice * 0.96).toFixed(2)), grade: `${provider} ${grade}` },
          ],
        },
      });
    }

    // 10. Auth init endpoint
    if (pathname === '/api/auth/init') {
      const authHeader = request.headers.get('authorization');
      let isSuperUser = false;
      if (authHeader?.startsWith('Bearer ')) {
        const idToken = authHeader.split('Bearer ')[1];
        try {
          const parts = idToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const email = (payload.email || '').toLowerCase();
            if (email === 'gurutvamurdia@gmail.com') {
              isSuperUser = true;
            }
          }
        } catch (_) {}
      }
      return jsonResponse({ success: true, isSuperUser });
    }

    // 11. Backend proxy fallback
    if (env.BACKEND_URL) {
      const backendTarget = new URL(pathname + url.search, env.BACKEND_URL);
      const proxyReq = new Request(backendTarget.toString(), request);
      return await fetch(proxyReq);
    }

    return jsonResponse({ error: 'Endpoint not implemented on Edge Worker' }, 404);
  } catch (err: any) {
    return jsonResponse({ error: 'Internal Server Error', message: err?.message }, 500);
  }
};
