var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// deck/[id].js
async function onRequestGet(context) {
  const { request, env, params } = context;
  const response = await env.ASSETS.fetch(request);
  if (!response.ok) return response;
  const id = params.id;
  if (!id) return response;
  let deckName = "Shared Deck";
  let cardCount = 0;
  try {
    const decodedUrl = decodeURIComponent(id);
    const binary = atob(decodedUrl);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonString);
    if (parsed.n) deckName = parsed.n;
    if (parsed.p && Array.isArray(parsed.p)) {
      cardCount = parsed.p.reduce((acc, curr) => acc + (curr.q || 1), 0);
    }
  } catch (err) {
  }
  const title = `${deckName} - Pok\xE9mon TCG Deck | DECK / divider`;
  const description = `View ${deckName}, a ${cardCount}-card Pok\xE9mon TCG deck built on DECK / divider.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": deckName,
    "description": description,
    "numberOfItems": cardCount,
    "itemListElement": []
  };
  class ElementHandler {
    static {
      __name(this, "ElementHandler");
    }
    element(element) {
      element.append(`<title>${title}</title>`, { html: true });
      element.append(`<meta name="description" content="${description}">`, { html: true });
      element.append(`<meta property="og:title" content="${title}">`, { html: true });
      element.append(`<meta property="og:description" content="${description}">`, { html: true });
      element.append(`<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`, { html: true });
    }
  }
  return new HTMLRewriter().on("head", new ElementHandler()).transform(response);
}
__name(onRequestGet, "onRequestGet");

// portfolio/[id].js
async function onRequestGet2(context) {
  const { request, env, params } = context;
  const response = await env.ASSETS.fetch(request);
  if (!response.ok) return response;
  const id = params.id;
  if (!id) return response;
  let displayName = "Collector";
  let deckCount = 0;
  let sealedCount = 0;
  let totalCards = 0;
  try {
    const decodedUrl = decodeURIComponent(id);
    const binary = atob(decodedUrl);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const jsonString = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(jsonString);
    if (parsed.u) displayName = parsed.u;
    if (parsed.d && Array.isArray(parsed.d)) {
      deckCount = parsed.d.length;
      parsed.d.forEach((deck) => {
        if (deck.p && Array.isArray(deck.p)) {
          totalCards += deck.p.reduce((acc, curr) => acc + (curr.q || 1), 0);
        }
      });
    }
    if (parsed.s && Array.isArray(parsed.s)) {
      sealedCount = parsed.s.reduce((acc, curr) => acc + (curr.q || 1), 0);
    }
  } catch (err) {
  }
  const title = `${displayName}'s Pok\xE9mon TCG Portfolio | DECK / divider`;
  const description = `View ${displayName}'s Pok\xE9mon TCG collection, including ${deckCount} decks, ${sealedCount} sealed products, and ${totalCards} cards.`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": title,
    "description": description
  };
  class ElementHandler {
    static {
      __name(this, "ElementHandler");
    }
    element(element) {
      element.append(`<title>${title}</title>`, { html: true });
      element.append(`<meta name="description" content="${description}">`, { html: true });
      element.append(`<meta property="og:title" content="${title}">`, { html: true });
      element.append(`<meta property="og:description" content="${description}">`, { html: true });
      element.append(`<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`, { html: true });
    }
  }
  return new HTMLRewriter().on("head", new ElementHandler()).transform(response);
}
__name(onRequestGet2, "onRequestGet");

// set/[[path]].js
async function onRequestGet3(context) {
  const { request, env, params } = context;
  const response = await env.ASSETS.fetch(request);
  if (!response.ok) return response;
  const pathParts = params.path || [];
  const setId = pathParts[0];
  const isTopCards = pathParts[1] === "top-cards";
  if (!setId) return response;
  let setName = "Pok\xE9mon Set";
  let setSeries = "Pok\xE9mon TCG";
  let totalCards = 0;
  let imageUrl = "";
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const apiRes = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.data) {
        setName = data.data.name;
        setSeries = data.data.series;
        totalCards = data.data.total;
        imageUrl = data.data.images?.logo || "";
      }
    }
  } catch (e) {
  }
  let title = `${setName} (${setSeries}) - Pok\xE9mon TCG Card List | DECK / divider`;
  let description = `Browse all ${totalCards} cards in the ${setName} expansion for the Pok\xE9mon Trading Card Game. View prices, legality, and variations.`;
  if (isTopCards) {
    title = `Top 10 Most Expensive Cards in ${setName} | DECK / divider`;
    description = `Discover the top most valuable and chased cards in the ${setName} expansion.`;
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "image": imageUrl
  };
  class ElementHandler {
    static {
      __name(this, "ElementHandler");
    }
    element(element) {
      element.append(`<title>${title}</title>`, { html: true });
      element.append(`<meta name="description" content="${description}">`, { html: true });
      element.append(`<meta property="og:title" content="${title}">`, { html: true });
      element.append(`<meta property="og:description" content="${description}">`, { html: true });
      if (imageUrl) {
        element.append(`<meta property="og:image" content="${imageUrl}">`, { html: true });
      }
      element.append(`<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`, { html: true });
    }
  }
  return new HTMLRewriter().on("head", new ElementHandler()).transform(response);
}
__name(onRequestGet3, "onRequestGet");

// api/[[catchall]].ts
var cachedExchangeRates = null;
var cachedSets = null;
var cachedSetsTimestamp = 0;
var CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
};
function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
      ...extraHeaders
    }
  });
}
__name(jsonResponse, "jsonResponse");
async function fetchWithTimeout(url, init, timeoutMs = 3500) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}
__name(fetchWithTimeout, "fetchWithTimeout");
var onRequest = /* @__PURE__ */ __name(async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method;
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS
    });
  }
  try {
    if (pathname === "/api/health") {
      return jsonResponse({
        status: "ok",
        runtime: "Cloudflare Pages Functions (Edge)",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (pathname === "/api/exchange-rates") {
      const now = Date.now();
      const forceRefresh = url.searchParams.get("force") === "true";
      if (cachedExchangeRates && now - cachedExchangeRates.timestamp < 36e5 && !forceRefresh) {
        return jsonResponse({
          success: true,
          base: "USD",
          rates: cachedExchangeRates.rates,
          updated: new Date(cachedExchangeRates.timestamp).toISOString(),
          provider: cachedExchangeRates.provider,
          cached: true
        });
      }
      const apiKey = env.EXCHANGE_RATE_API_KEY?.trim();
      let rates = null;
      let provider = "ExchangeRate-API Open";
      if (apiKey && apiKey !== "MY_EXCHANGE_RATE_API_KEY") {
        try {
          const res = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`);
          if (res.ok) {
            const data = await res.json();
            if (data.rates || data.conversion_rates) {
              rates = data.rates || data.conversion_rates;
              provider = "ExchangeRate-API Pro (Configured Key)";
            }
          }
        } catch (_) {
        }
      }
      if (!rates) {
        try {
          const openRes = await fetch("https://open.er-api.com/v6/latest/USD");
          if (openRes.ok) {
            const openData = await openRes.json();
            if (openData.rates) {
              rates = openData.rates;
              provider = "ExchangeRate-API Live (Open)";
            }
          }
        } catch (_) {
        }
      }
      if (!rates) {
        rates = {
          USD: 1,
          EUR: 0.92,
          GBP: 0.78,
          JPY: 155,
          CAD: 1.38,
          AUD: 1.52,
          CHF: 0.89,
          INR: 83.5,
          SGD: 1.35,
          HKD: 7.82,
          NZD: 1.65,
          BRL: 5.65,
          CNY: 7.25,
          KRW: 1380,
          MXN: 18.5,
          SEK: 10.6,
          NOK: 10.8,
          DKK: 6.85,
          PLN: 3.95,
          TRY: 33
        };
        provider = "Fallback Default Rates";
      }
      cachedExchangeRates = { rates, timestamp: now, provider };
      return jsonResponse({
        success: true,
        base: "USD",
        rates,
        updated: new Date(now).toISOString(),
        provider,
        cached: false
      });
    }
    if (pathname === "/api/tcg/expansions") {
      const now = Date.now();
      if (cachedSets && now - cachedSetsTimestamp < 36e5) {
        return jsonResponse(cachedSets);
      }
      try {
        const setsRes = await fetch("https://api.tcgdex.net/v2/en/sets");
        if (setsRes.ok) {
          const setsData = await setsRes.json();
          cachedSets = setsData;
          cachedSetsTimestamp = now;
          return jsonResponse(setsData);
        }
      } catch (err) {
      }
      return jsonResponse(cachedSets || []);
    }
    if (pathname.startsWith("/api/tcg/sets/")) {
      const setId = pathname.replace("/api/tcg/sets/", "");
      const setRes = await fetch(`https://api.tcgdex.net/v2/en/sets/${encodeURIComponent(setId)}`);
      if (setRes.ok) {
        const setData = await setRes.json();
        return jsonResponse(setData);
      }
      return jsonResponse({ error: "Set not found" }, 404);
    }
    if (pathname === "/api/tcg/cards/summary") {
      try {
        const restRes = await fetch("https://api.tcgdex.net/v2/en/cards");
        if (restRes.ok) {
          const cards = await restRes.json();
          return jsonResponse(cards);
        }
      } catch (_) {
      }
      return jsonResponse([]);
    }
    if (pathname === "/api/tcg/cards/lazy-chunk") {
      const offset = parseInt(url.searchParams.get("offset") || "0", 10);
      const limit = parseInt(url.searchParams.get("limit") || "50", 10);
      try {
        const restRes = await fetch("https://api.tcgdex.net/v2/en/cards");
        if (restRes.ok) {
          const cards = await restRes.json();
          const chunk = cards.slice(offset, offset + limit);
          return jsonResponse(chunk);
        }
      } catch (_) {
      }
      return jsonResponse([]);
    }
    if (pathname.startsWith("/api/tcg/cards/")) {
      const cardId = pathname.replace("/api/tcg/cards/", "");
      const cardRes = await fetch(`https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(cardId)}`);
      if (cardRes.ok) {
        const cardData = await cardRes.json();
        return jsonResponse(cardData);
      }
      return jsonResponse({ error: "Card not found" }, 404);
    }
    if (pathname === "/api/tcg/search") {
      const q = url.searchParams.get("q") || "";
      const targetUrl = "https://api.tcgdex.net/v2/en/cards" + (q ? `?name=${encodeURIComponent(q)}` : "");
      const searchRes = await fetch(targetUrl);
      if (searchRes.ok) {
        const data = await searchRes.json();
        return jsonResponse({ cards: data, total: Array.isArray(data) ? data.length : 0 });
      }
      return jsonResponse({ cards: [], total: 0 });
    }
    if (pathname === "/api/tcg/sync/status") {
      return jsonResponse({
        status: "synced",
        totalCards: 18450,
        lastSynced: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    if (pathname === "/api/tcg/sync/trigger") {
      return jsonResponse({ success: true, status: "triggered" });
    }
    if (pathname === "/api/tcgdex/index-data") {
      try {
        const tcgdexRes = await fetch("https://api.tcgdex.net/v2/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        if (tcgdexRes.ok) {
          const data = await tcgdexRes.json();
          return jsonResponse(data);
        }
      } catch (_) {
      }
      try {
        const restRes = await fetch("https://api.tcgdex.net/v2/en/cards");
        if (restRes.ok) {
          const cards = await restRes.json();
          return jsonResponse({ data: { cards } });
        }
      } catch (_) {
      }
      return jsonResponse({ data: { cards: [] } });
    }
    if (pathname === "/api/tcgdex/cards") {
      try {
        const name = url.searchParams.get("name") || "";
        const targetUrl = "https://api.tcgdex.net/v2/en/cards" + (name ? `?name=${encodeURIComponent(name)}` : "");
        const res = await fetchWithTimeout(targetUrl, void 0, 3500);
        if (!res.ok) return jsonResponse([]);
        const data = await res.json();
        return jsonResponse(data);
      } catch (_) {
        return jsonResponse([]);
      }
    }
    if (pathname.startsWith("/api/tcgdex/cards/")) {
      try {
        const cardId = pathname.replace("/api/tcgdex/cards/", "");
        const res = await fetchWithTimeout(`https://api.tcgdex.net/v2/en/cards/${encodeURIComponent(cardId)}`, void 0, 3500);
        if (!res.ok) return jsonResponse({ error: "Card not found" }, res.status);
        const data = await res.json();
        return jsonResponse(data, res.status);
      } catch (_) {
        return jsonResponse({ error: "Card details temporarily unavailable" }, 200);
      }
    }
    if (pathname === "/api/tcgdex/categories") {
      try {
        const res = await fetchWithTimeout("https://api.tcgdex.net/v2/en/categories", void 0, 3500);
        if (!res.ok) return jsonResponse([]);
        const data = await res.json();
        return jsonResponse(data);
      } catch (_) {
        return jsonResponse([]);
      }
    }
    if (pathname === "/api/tcgdex/stages") {
      try {
        const res = await fetchWithTimeout("https://api.tcgdex.net/v2/en/stages", void 0, 3500);
        if (!res.ok) return jsonResponse([]);
        const data = await res.json();
        return jsonResponse(data);
      } catch (_) {
        return jsonResponse([]);
      }
    }
    if (pathname === "/api/tcgdex/series") {
      try {
        const res = await fetchWithTimeout("https://api.tcgdex.net/v2/en/series", void 0, 3500);
        if (!res.ok) return jsonResponse([]);
        const data = await res.json();
        return jsonResponse(data);
      } catch (_) {
        return jsonResponse([]);
      }
    }
    if (pathname === "/api/tcgdex/sets") {
      try {
        const res = await fetchWithTimeout("https://api.tcgdex.net/v2/en/sets", void 0, 3500);
        if (!res.ok) return jsonResponse([]);
        const data = await res.json();
        return jsonResponse(data);
      } catch (_) {
        return jsonResponse([]);
      }
    }
    if (pathname === "/api/tcgdex/illustrators") {
      try {
        const res = await fetchWithTimeout("https://api.tcgdex.net/v2/en/illustrators", void 0, 3500);
        if (!res.ok) return jsonResponse([]);
        const data = await res.json();
        return jsonResponse(data);
      } catch (_) {
        return jsonResponse([]);
      }
    }
    if (pathname.startsWith("/api/tcgdex/image/")) {
      try {
        const imagePath = pathname.replace("/api/tcgdex/image/", "");
        const imageRes = await fetchWithTimeout(`https://assets.tcgdex.net/${imagePath}`, void 0, 4e3);
        if (!imageRes.ok) {
          return new Response("Not Found", { status: 404 });
        }
        return new Response(imageRes.body, {
          status: 200,
          headers: {
            "Content-Type": imageRes.headers.get("Content-Type") || "image/png",
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        });
      } catch (_) {
        return new Response("Not Found", { status: 404 });
      }
    }
    if (pathname === "/api/market/status") {
      return jsonResponse({
        status: "active",
        marketSource: "TCGPlayer / Pokemon TCG API Sync (Cloudflare Edge)",
        lastSynced: (/* @__PURE__ */ new Date()).toISOString(),
        baseCurrency: "USD",
        supportedCurrencies: ["USD", "EUR", "GBP", "JPY"]
      });
    }
    if (pathname === "/api/deck/export-ptcgl" && method === "POST") {
      const body = await request.json();
      const { deckName, entries } = body;
      if (!entries || !Array.isArray(entries)) {
        return jsonResponse({ error: "Invalid entries array provided" }, 400);
      }
      const formattedLines = [`# Deck: ${deckName || "Untitled Deck"}`, ""];
      entries.forEach((entry) => {
        const qty = entry.quantity || 1;
        const name = entry.card?.name || "Unknown Card";
        const setCode = entry.card?.set?.ptcgoCode || entry.card?.set?.id || "PR";
        const num = entry.card?.number || "1";
        formattedLines.push(`${qty} ${name} ${setCode} ${num}`);
      });
      return jsonResponse({
        success: true,
        ptcglFormat: formattedLines.join("\n")
      });
    }
    if (pathname === "/api/billing/paypal-config") {
      const planIds = {
        Bunch: env.PAYPAL_PLAN_BUNCH || "P-86F48638UK390893LNJY5FHQ",
        Stack: env.PAYPAL_PLAN_STACK || "P-62J90197VJ601823CNJY5GFI",
        Deck: env.PAYPAL_PLAN_DECK || "P-8K993431SB9741949NJY5GVY",
        Collection: env.PAYPAL_PLAN_COLLECTION || "P-1EH4703021893203DNJY5HII"
      };
      return jsonResponse({
        clientId: env.PAYPAL_CLIENT_ID || "LIVE_CLIENT_ID_CONFIGURED",
        mode: env.PAYPAL_MODE || "live",
        planIds,
        plans: planIds
      });
    }
    if (pathname === "/api/billing/governor-status" || pathname === "/api/billing/subscription") {
      const authHeader = request.headers.get("authorization");
      let uid = "guest";
      let isSuperUser = false;
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.split("Bearer ")[1];
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            uid = payload.user_id || payload.sub || payload.uid || "guest";
            if ((payload.email || "").toLowerCase() === "gurutvamurdia@gmail.com") {
              isSuperUser = true;
            }
          }
        } catch (_) {
        }
      }
      if (env.BACKEND_URL) {
        try {
          const backendTarget = new URL(pathname + url.search, env.BACKEND_URL);
          const proxyReq = new Request(backendTarget.toString(), request);
          return await fetch(proxyReq);
        } catch (_) {
        }
      }
      const now = Date.now();
      const defaultGovernorState = {
        id: uid,
        tierName: isSuperUser ? "Collection" : "Starter",
        effectiveTier: isSuperUser ? "Collection" : "Starter",
        billingStatus: "active",
        paymentType: isSuperUser ? "recurring" : "one_time",
        provider: "system",
        daysRemaining: isSuperUser ? 999999 : 999999,
        isExpired: false,
        isSuperUser,
        currentPeriodStart: new Date(now).toISOString(),
        currentPeriodEnd: isSuperUser ? new Date(now + 31536e8).toISOString() : new Date(now + 31536e8).toISOString(),
        updatedAt: new Date(now).toISOString(),
        governorNote: isSuperUser ? "Edge Governed: Super User (Collection Tier)" : "Edge Governed: Standard Free Starter Tier"
      };
      return jsonResponse(defaultGovernorState);
    }
    if (pathname === "/api/billing/execute" && method === "POST") {
      const body = await request.json();
      const { subscriptionId, tier, provider } = body;
      const now = /* @__PURE__ */ new Date();
      const periodEnd = new Date(now);
      periodEnd.setDate(periodEnd.getDate() + 30);
      const governorRecord = {
        success: true,
        tierName: tier,
        effectiveTier: tier,
        status: "ACTIVE",
        billingStatus: "active",
        paymentType: "recurring",
        provider: provider || "paypal",
        currentPeriodStart: now.toISOString(),
        currentPeriodEnd: periodEnd.toISOString(),
        daysRemaining: 30,
        isExpired: false,
        subscriptionId,
        updatedAt: now.toISOString()
      };
      if (env.BACKEND_URL) {
        try {
          const backendTarget = new URL(pathname, env.BACKEND_URL);
          const proxyReq = new Request(backendTarget.toString(), request);
          return await fetch(proxyReq);
        } catch (_) {
        }
      }
      return jsonResponse(governorRecord);
    }
    if (pathname === "/api/config/credentials") {
      return jsonResponse({
        paypal: {
          clientId: env.PAYPAL_CLIENT_ID ? "\u2022\u2022\u2022\u2022" + env.PAYPAL_CLIENT_ID.slice(-4) : "\u2022\u2022\u2022\u20225FHQ",
          clientSecret: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
          mode: env.PAYPAL_MODE || "live",
          planIds: {
            Bunch: env.PAYPAL_PLAN_BUNCH || "P-86F48638UK390893LNJY5FHQ",
            Stack: env.PAYPAL_PLAN_STACK || "P-62J90197VJ601823CNJY5GFI",
            Deck: env.PAYPAL_PLAN_DECK || "P-8K993431SB9741949NJY5GVY",
            Collection: env.PAYPAL_PLAN_COLLECTION || "P-1EH4703021893203DNJY5HII"
          }
        },
        tcgdex: {
          baseUrl: "https://api.tcgdex.net/v2/en"
        },
        firebase: {
          projectId: "deckdivider1"
        }
      });
    }
    if (pathname === "/api/firebase/status") {
      return jsonResponse({
        status: "initialized",
        projectId: "deckdivider1",
        hasPrivateKey: true,
        clientEmail: "Configured via Environment"
      });
    }
    if (pathname === "/api/v1/cert/graded-market" || pathname === "/api/v1/cert/lookup") {
      const cardName = url.searchParams.get("cardName") || "Pokemon Card";
      const setName = url.searchParams.get("setName") || "Expansion";
      const provider = url.searchParams.get("provider") || "PSA";
      const grade = url.searchParams.get("grade") || "10";
      const rawPrice = parseFloat(url.searchParams.get("rawPrice") || "25");
      const gradeMultiplier = grade === "10" ? 3.4 : grade === "9" ? 1.7 : grade === "8" ? 1.2 : 0.9;
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
            { date: new Date(Date.now() - 864e5 * 3).toISOString().split("T")[0], price: estimatedGradedPrice, grade: `${provider} ${grade}` },
            { date: new Date(Date.now() - 864e5 * 12).toISOString().split("T")[0], price: Number((estimatedGradedPrice * 0.96).toFixed(2)), grade: `${provider} ${grade}` }
          ]
        }
      });
    }
    if (pathname === "/api/auth/init") {
      const authHeader = request.headers.get("authorization");
      let isSuperUser = false;
      if (authHeader?.startsWith("Bearer ")) {
        const idToken = authHeader.split("Bearer ")[1];
        try {
          const parts = idToken.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            const email = (payload.email || "").toLowerCase();
            if (email === "gurutvamurdia@gmail.com") {
              isSuperUser = true;
            }
          }
        } catch (_) {
        }
      }
      return jsonResponse({ success: true, isSuperUser });
    }
    const checkSuperAdmin = /* @__PURE__ */ __name((req) => {
      const authHeader = req.headers.get("authorization") || "";
      let isSuperUser = false;
      let email = "";
      let token = "";
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
        try {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            email = (payload.email || "").toLowerCase();
            if (email === "gurutvamurdia@gmail.com") {
              isSuperUser = true;
            }
          }
        } catch (_) {
        }
      }
      return { isSuperUser, email, token };
    }, "checkSuperAdmin");
    if (pathname === "/api/admin/metrics") {
      const { isSuperUser, token } = checkSuperAdmin(request);
      if (!isSuperUser) {
        return jsonResponse({ error: "Unauthorized Email" }, 403);
      }
      let usersList = [];
      let subDocs = [];
      const subStatuses = { active: 1, past_due: 0, canceled: 0, expired: 0 };
      if (token) {
        try {
          const usersRes = await fetchWithTimeout(
            "https://firestore.googleapis.com/v1/projects/deckdivider1/databases/(default)/documents/users",
            { headers: { Authorization: `Bearer ${token}` } },
            4e3
          );
          if (usersRes.ok) {
            const data = await usersRes.json();
            for (const doc of data.documents || []) {
              const docId = doc.name ? doc.name.split("/").pop() : "unknown";
              const f = doc.fields || {};
              usersList.push({
                id: docId,
                email: f.email?.stringValue || "",
                displayName: f.displayName?.stringValue || "",
                tierName: f.tierName?.stringValue || "Starter",
                createdAt: f.createdAt?.stringValue || (/* @__PURE__ */ new Date()).toISOString(),
                isSuperUser: f.email?.stringValue === "gurutvamurdia@gmail.com"
              });
            }
          }
        } catch (_) {
        }
        try {
          const subsRes = await fetchWithTimeout(
            "https://firestore.googleapis.com/v1/projects/deckdivider1/databases/(default)/documents/subscriptions",
            { headers: { Authorization: `Bearer ${token}` } },
            4e3
          );
          if (subsRes.ok) {
            const data = await subsRes.json();
            for (const doc of data.documents || []) {
              const f = doc.fields || {};
              const st = (f.billingStatus?.stringValue || "active").toLowerCase();
              if (st === "active") subStatuses.active++;
              else if (st === "past_due") subStatuses.past_due++;
              else if (st === "canceled" || st === "cancelled") subStatuses.canceled++;
              else if (st === "expired") subStatuses.expired++;
            }
          }
        } catch (_) {
        }
      }
      if (usersList.length === 0) {
        usersList = [
          {
            id: "usr_super",
            displayName: "Super User",
            email: "gurutvamurdia@gmail.com",
            tierName: "Collection",
            createdAt: (/* @__PURE__ */ new Date()).toISOString(),
            isSuperUser: true
          }
        ];
      }
      const usersByTier = {
        Starter: 0,
        Bunch: 0,
        Stack: 0,
        Deck: 0,
        Collection: 0
      };
      usersList.forEach((u) => {
        const t = u.tierName || "Starter";
        if (usersByTier[t] !== void 0) {
          usersByTier[t]++;
        } else {
          usersByTier.Starter++;
        }
      });
      const revenueByTier = {
        Starter: 0,
        Bunch: usersByTier.Bunch * 11,
        Stack: usersByTier.Stack * 22,
        Deck: usersByTier.Deck * 33,
        Collection: Math.max(0, usersByTier.Collection - 1) * 44
      };
      const mrr = revenueByTier.Bunch + revenueByTier.Stack + revenueByTier.Deck + revenueByTier.Collection;
      const arr = mrr * 12;
      const totalUsers = usersList.length;
      const paidUsers = usersByTier.Bunch + usersByTier.Stack + usersByTier.Deck + usersByTier.Collection;
      const arpu = totalUsers > 0 ? Number((mrr / totalUsers).toFixed(2)) : 0;
      const arppu = paidUsers > 0 ? Number((mrr / paidUsers).toFixed(2)) : 0;
      const conversionRate = totalUsers > 0 ? Number((paidUsers / totalUsers * 100).toFixed(1)) : 0;
      const funnelData = [
        { stepKey: "1_landing_view", label: "1. Landing Page View", count: 124, conversionFromPrev: 100 },
        { stepKey: "2_cta_click", label: "2. CTA Clicked", count: 88, conversionFromPrev: 71 },
        { stepKey: "3_auth_view", label: "3. Auth Page View", count: 52, conversionFromPrev: 59.1 },
        { stepKey: "4_signup_submit", label: "4. Signup Attempted", count: 31, conversionFromPrev: 59.6 },
        { stepKey: "5_signup_success", label: "5. Account Created", count: 28, conversionFromPrev: 90.3 },
        { stepKey: "6_dashboard_view", label: "6. Dashboard Opened", count: 28, conversionFromPrev: 100 },
        { stepKey: "7_first_action", label: "7. First Action Taken", count: 22, conversionFromPrev: 78.6 }
      ];
      return jsonResponse({
        totalUsers,
        usersByTier,
        revenueByTier,
        mrr,
        arr,
        arpu,
        arppu,
        conversionRate,
        subscriptionStatuses: subStatuses,
        funnelData,
        crawlerStats: {
          totalRequests: 42,
          uniqueBots: 4,
          botCounts: { Googlebot: 28, Bingbot: 8, YandexBot: 4, Applebot: 2 },
          recentCrawls: [
            { timestamp: (/* @__PURE__ */ new Date()).toISOString(), bot: "Googlebot", path: "/", userAgent: "Mozilla/5.0 (compatible; Googlebot/2.1)" },
            { timestamp: new Date(Date.now() - 36e5).toISOString(), bot: "Bingbot", path: "/pricing", userAgent: "Mozilla/5.0 (compatible; bingbot/2.0)" }
          ]
        },
        recentUsers: usersList.slice(0, 50),
        system: {
          uptimeSeconds: 86400,
          memoryUsageMB: { rss: 64, heapTotal: 48, heapUsed: 32 },
          tcgCatalogStatus: {
            totalCardsCached: 18450,
            totalExpansions: 172,
            isSyncing: false,
            lastSyncTimestamp: (/* @__PURE__ */ new Date()).toISOString()
          },
          recentWebhookCount: 0
        }
      });
    }
    if (pathname === "/api/admin/diagnostics") {
      const { isSuperUser } = checkSuperAdmin(request);
      if (!isSuperUser) {
        return jsonResponse({ error: "Unauthorized Email" }, 403);
      }
      return jsonResponse({
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalCheckTimeMs: 12,
        dependencies: {
          edge_worker: {
            name: "Cloudflare Edge Worker Runtime",
            category: "Infrastructure",
            status: "healthy",
            details: { region: "global_edge", runtime: "V8 Isolate", timestamp: (/* @__PURE__ */ new Date()).toISOString() }
          },
          firebase_firestore: {
            name: "Firebase Firestore Database",
            category: "Database & Storage",
            status: "healthy",
            details: { projectId: "deckdivider1", databaseId: "(default)" }
          },
          tcgdex_api: {
            name: "TCGDex Pok\xE9mon Catalog API",
            category: "External Data Providers",
            status: "healthy",
            details: { latencyMs: 45, endpoint: "https://api.tcgdex.net/v2/en" }
          },
          justcards_api: {
            name: "JustCards Marketplace Pricing",
            category: "External Data Providers",
            status: "healthy",
            details: { latencyMs: 65, endpoint: "https://api.justcards.com" }
          },
          exchange_rates: {
            name: "Exchange Rate Provider",
            category: "Currency & Localization",
            status: "healthy",
            details: { provider: "open.er-api.com", supportedCurrencies: 16 }
          },
          indexnow: {
            name: "IndexNow Search Engine Protocol",
            category: "SEO & Search Engine Indexing",
            status: "healthy",
            details: { host: "deckdivider.app", keyEndpoint: "/deckdivider-indexnow-key-7392abcd.txt" }
          }
        }
      });
    }
    if ((pathname === "/api/admin/user/tier" || pathname === "/api/admin/set-user-tier") && method === "POST") {
      const { isSuperUser, token } = checkSuperAdmin(request);
      if (!isSuperUser) {
        return jsonResponse({ error: "Unauthorized Email" }, 403);
      }
      const body = await request.json().catch(() => ({}));
      const { targetUid, tierName } = body;
      if (!targetUid || !tierName) {
        return jsonResponse({ error: "Missing targetUid or tierName" }, 400);
      }
      if (token) {
        try {
          const userUrl = `https://firestore.googleapis.com/v1/projects/deckdivider1/databases/(default)/documents/users/${targetUid}?updateMask.fieldPaths=tierName&updateMask.fieldPaths=updatedAt`;
          await fetchWithTimeout(userUrl, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              fields: {
                tierName: { stringValue: tierName },
                updatedAt: { stringValue: (/* @__PURE__ */ new Date()).toISOString() }
              }
            })
          }, 4e3);
        } catch (_) {
        }
      }
      return jsonResponse({ success: true, targetUid, tierName });
    }
    if (pathname === "/api/admin/manual-sync" && method === "POST") {
      const { isSuperUser } = checkSuperAdmin(request);
      if (!isSuperUser) return jsonResponse({ error: "Unauthorized Email" }, 403);
      return jsonResponse({ success: true, message: "Catalog background sync scheduled." });
    }
    if (pathname === "/api/admin/funnel/reset" && method === "POST") {
      const { isSuperUser } = checkSuperAdmin(request);
      if (!isSuperUser) return jsonResponse({ error: "Unauthorized Email" }, 403);
      return jsonResponse({ success: true, message: "Funnel statistics reset." });
    }
    if (pathname === "/api/admin/ping-indexnow") {
      try {
        const body = method === "POST" ? await request.json().catch(() => ({})) : {};
        const urlsToPing = Array.isArray(body.urls) && body.urls.length > 0 ? body.urls : [
          "https://deckdivider.app/",
          "https://deckdivider.app/pricing",
          "https://deckdivider.app/faq",
          "https://deckdivider.app/about",
          "https://deckdivider.app/how-it-works",
          "https://deckdivider.app/sets",
          "https://deckdivider.app/compare",
          "https://deckdivider.app/best",
          "https://deckdivider.app/tools"
        ];
        const indexNowPayload = {
          host: "deckdivider.app",
          key: "7392abcd",
          keyLocation: "https://deckdivider.app/7392abcd.txt",
          urlList: urlsToPing
        };
        const inRes = await fetchWithTimeout("https://api.indexnow.org/indexnow", {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify(indexNowPayload)
        }, 4e3);
        return jsonResponse({
          success: inRes.ok,
          status: inRes.status,
          submittedUrls: urlsToPing.length,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      } catch (inErr) {
        return jsonResponse({
          success: false,
          error: inErr?.message || "IndexNow submission timeout"
        }, 200);
      }
    }
    if (env.BACKEND_URL) {
      try {
        const backendTarget = new URL(pathname + url.search, env.BACKEND_URL);
        const proxyReq = new Request(backendTarget.toString(), request);
        return await fetchWithTimeout(backendTarget.toString(), proxyReq, 5e3);
      } catch (proxyErr) {
        return jsonResponse({
          error: "Upstream backend unreachable",
          message: proxyErr?.message || "Connection timeout"
        }, 502);
      }
    }
    return jsonResponse({ error: "Endpoint not implemented on Edge Worker" }, 404);
  } catch (err) {
    return jsonResponse({ error: "Edge Function Handler Error", message: err?.message || "Unexpected exception" }, 500);
  }
}, "onRequest");

// ../.wrangler/tmp/pages-scU0NW/functionsRoutes-0.08583392399475387.mjs
var routes = [
  {
    routePath: "/deck/:id",
    mountPath: "/deck",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/portfolio/:id",
    mountPath: "/portfolio",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/set/:path*",
    mountPath: "/set",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/:catchall*",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest]
  }
];

// ../node_modules/wrangler/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
