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
        runtime: 'Cloudflare Pages Edge Worker',
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

    // 3. TCGdex Proxy Endpoints
    if (pathname === '/api/tcgdex/index-data') {
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
      const data = await tcgdexRes.json();
      return jsonResponse(data);
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
      const res = await fetch(`https://api.tcgdex.net/v2/en/cards/${cardId}`);
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

    // 4. Market status
    if (pathname === '/api/market/status') {
      return jsonResponse({
        status: 'active',
        marketSource: 'TCGPlayer / Pokemon TCG API Sync (Cloudflare Edge)',
        lastSynced: new Date().toISOString(),
        baseCurrency: 'USD',
        supportedCurrencies: ['USD', 'EUR', 'GBP', 'JPY'],
      });
    }

    // 5. PTCGL Deck Export Route
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

    // 6. PayPal Config Endpoint
    if (pathname === '/api/billing/paypal-config') {
      return jsonResponse({
        clientId: env.PAYPAL_CLIENT_ID || 'LIVE_CLIENT_ID_CONFIGURED',
        mode: env.PAYPAL_MODE || 'live',
        plans: {
          Bunch: env.PAYPAL_PLAN_BUNCH || 'P-86F48638UK390893LNJY5FHQ',
          Stack: env.PAYPAL_PLAN_STACK || 'P-62J90197VJ601823CNJY5GFI',
          Deck: env.PAYPAL_PLAN_DECK || 'P-8K993431SB9741949NJY5GVY',
          Collection: env.PAYPAL_PLAN_COLLECTION || 'P-1EH4703021893203DNJY5HII',
        },
      });
    }

    // 7. Auth init endpoint
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

    // 8. Proxy fallback if BACKEND_URL is set for custom scraper services
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
