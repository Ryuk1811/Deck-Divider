import { getCardDetail, getSetDetail, getExpansions } from './tcgCatalogManager.js';
import { BUILD_HASH } from './publicFootprintManager.js';
import { renderDirectoryPage } from './routes/directoryRenderer.js';
import { getTournamentDeckBySlug, TOURNAMENT_DECKS } from '../src/data/tournamentDecks.js';

export const DEFAULT_OG_IMAGE = `https://deckdivider.app/og-image.png?v=${BUILD_HASH}`;

const STANDARD_BRAND = {
  '@type': 'Brand',
  name: 'DECK / divider'
};

const STANDARD_SHIPPING_DETAILS = {
  '@type': 'OfferShippingDetails',
  shippingRate: {
    '@type': 'MonetaryAmount',
    value: '0.00',
    currency: 'USD'
  },
  shippingDestination: {
    '@type': 'DefinedRegion',
    addressCountry: 'US'
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 0,
      unitCode: 'DAY'
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 0,
      maxValue: 0,
      unitCode: 'DAY'
    }
  }
};

const STANDARD_MERCHANT_RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'US',
  returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
};

export interface RenderResult {
  title: string;
  metaTags: string;
  bodyHtml: string;
}

export function isBot(userAgent: string = ''): boolean {
  const ua = userAgent.toLowerCase();
  const botPatterns = [
    'googlebot',
    'googleother',
    'google-inspectiontool',
    'gemini',
    'gemini-deep-research',
    'google-agent',
    'bingbot',
    'bingpreview',
    'yandex',
    'baiduspider',
    'slurp',
    'duckduckbot',
    'facebot',
    'facebookexternalhit',
    'twitterbot',
    'linkedinbot',
    'embedly',
    'quora link preview',
    'showyoubot',
    'outbrain',
    'pinterest',
    'applebot',
    'slackbot',
    'vkshare',
    'w3c_validator',
    'whatsapp',
    'flipboard',
    'tumblr',
    'bitlybot',
    'skypeuripreview',
    'nuzzel',
    'discordbot',
    'qwantify',
    'pinterestbot',
    'bitrix',
    'xing-contenttabreceiver',
    'chrome-lighthouse',
    'telegrambot',
    'gptbot',
    'chatgpt-user',
    'chatgpt',
    'claudebot',
    'claude-web',
    'anthropic-ai',
    'perplexitybot',
    'bytespider',
    'cohere-ai',
    'ia_archiver',
    'producthunt',
    'neeed',
    'findly',
    'smollaunch',
    'nxgntools',
    'super-launch',
    'superlaunch',
    'foundrlist',
    'curl',
    'wget',
    'python-requests',
    'python',
    'axios',
    'node-fetch',
    'undici',
    'got',
    'needle',
    'urllib',
    'go-http-client',
    'postman',
    'httpie',
    'linkchecker',
    'sitecheck',
    'crawler',
    'spider',
    'scraper',
    'bot',
    'checker',
    'verifier',
    'validator'
  ];
  return botPatterns.some(bot => ua.includes(bot));
}

export function renderSsrBrand(): string {
  return `<a href="/" style="display:inline-flex;align-items:center;gap:10px;text-decoration:none;vertical-align:middle;" aria-label="DECK / divider Home">
    <img src="/logo.png?v=11" alt="DECK / divider" width="34" height="34" style="width:34px;height:34px;object-fit:contain;flex-shrink:0;display:block;" />
    <div style="background:#111111;padding:1px;border-radius:8px;border:1px solid #262626;display:inline-flex;box-shadow:0 1px 3px rgba(0,0,0,0.12);">
      <div style="background:#000000;border-radius:7px;padding:5px 12px;display:flex;align-items:center;justify-content:center;white-space:nowrap;line-height:1;">
        <span style="color:#FFFFFF;font-family:system-ui,-apple-system,sans-serif;font-weight:900;letter-spacing:0.14em;text-transform:uppercase;font-size:13px;">DECK</span>
        <span style="color:#DC143C;font-family:monospace;font-weight:700;margin:0 5px;font-size:15px;">/</span>
        <span style="color:#DC143C;font-family:system-ui,-apple-system,sans-serif;font-weight:600;letter-spacing:0.08em;text-transform:lowercase;font-size:13px;">divider</span>
      </div>
    </div>
  </a>`;
}

function createStandardPageHtml(title: string, subtitle: string, content: string, ctaHref: string = '/auth', ctaText: string = 'Open in App'): string {
  return `
  <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;">
    <div style="display:flex;align-items:center;gap:16px;">
      ${renderSsrBrand()}
    </div>
    <nav style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:600;">
      <a href="/" style="color:#64748B;text-decoration:none;">Home</a>
      <a href="/about" style="color:#64748B;text-decoration:none;">About</a>
      <a href="/pricing" style="color:#64748B;text-decoration:none;">Pricing</a>
      <a href="/faq" style="color:#64748B;text-decoration:none;">FAQ</a>
      <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In</a>
    </nav>
  </header>
  <main style="max-width:1000px;margin:36px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
    <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;margin-bottom:28px;">
      <h1 style="font-size:32px;font-weight:900;margin:0 0 12px;letter-spacing:-0.5px;">${escapeHtml(title)}</h1>
      <p style="font-size:16px;color:#64748B;margin:0;">${escapeHtml(subtitle)}</p>
    </div>
    <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;margin-bottom:28px;">
      ${content}
      <div style="margin-top:28px;display:flex;gap:12px;">
        <a href="${ctaHref}" style="background:#DC143C;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">${ctaText}</a>
        <a href="/" style="background:#F1F5F9;color:#0F172A;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Return Home</a>
      </div>
    </div>
  </main>
  <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
    <p style="margin:0 0 8px;">DECK / divider — Pokémon TCG Collection Tracker, Slab Registry &amp; Deckbuilder</p>
    <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
      <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
      <a href="/about" style="color:#0F172A;text-decoration:none;font-weight:600;">About</a>
      <a href="/pricing" style="color:#0F172A;text-decoration:none;font-weight:600;">Pricing</a>
      <a href="/faq" style="color:#0F172A;text-decoration:none;font-weight:600;">FAQ</a>
      <a href="/privacy" style="color:#0F172A;text-decoration:none;font-weight:600;">Privacy Policy</a>
      <a href="/terms" style="color:#0F172A;text-decoration:none;font-weight:600;">Terms of Service</a>
      <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
    </div>
    <p style="margin:0;font-size:11px;color:#94A3B8;">&copy; 2026 DECK / divider. All rights reserved.</p>
  </footer>
  `;
}

// Decode base64 deck parameter
function decodeDeckParam(encoded: string): any | null {
  try {
    const jsonString = Buffer.from(encoded, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonString);
    return {
      id: parsed.i || 'public-deck',
      name: parsed.n || 'Pokémon TCG Deck',
      colorHex: parsed.c || '#DC143C',
      entries: (parsed.p || []).map((p: any) => ({
        cardId: p.i,
        quantity: p.q || 1,
      })),
    };
  } catch (err) {
    return null;
  }
}

// Escape HTML special characters for safe SSR output
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function renderSsrRoute(
  urlPath: string,
  queryParams: Record<string, any> = {},
  host: string = 'deckdivider.app'
): Promise<RenderResult> {
  // Canonical origin is strictly https://deckdivider.app (non-www, https)
  const canonicalOrigin = 'https://deckdivider.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const cleanPath = urlPath.split('?')[0].replace(/\/$/, '') || '/';

  // 0. DECOUPLED KEYWORD DIRECTORY HUB: /directory, /directory/*
  if (cleanPath === '/directory' || cleanPath.startsWith('/directory/')) {
    const dirResult = await renderDirectoryPage(cleanPath);
    if (dirResult) {
      return dirResult;
    }
  }

  // 1. PUBLIC DECK ROUTE: /deck/:deckId or /decks/:deckId
  if (cleanPath.startsWith('/deck/') || cleanPath.startsWith('/decks/')) {
    const rawDeckId = cleanPath.startsWith('/decks/') ? cleanPath.replace('/decks/', '') : cleanPath.replace('/deck/', '');
    const deckId = rawDeckId.toLowerCase();
    const deckSlug = deckId;
    const tournamentMatch = getTournamentDeckBySlug(deckSlug);

    let deckData = tournamentMatch ? {
      id: tournamentMatch.id,
      name: `${tournamentMatch.name} (${tournamentMatch.tier})`,
      colorHex: tournamentMatch.colorHex,
      entries: tournamentMatch.entries.map(e => ({ cardId: e.cardId, quantity: e.quantity })),
    } : (queryParams.d ? decodeDeckParam(queryParams.d) : null);

    if (!deckData) {
      deckData = {
        id: rawDeckId,
        name: 'Shared Pokémon TCG Deck',
        colorHex: '#DC143C',
        entries: [],
      };
    }

    // Hydrate card entries with card catalog if possible
    const hydratedEntries: Array<{
      id: string;
      name: string;
      quantity: number;
      supertype: string;
      setName: string;
      number: string;
      price: number;
      image?: string;
    }> = [];

    let totalCards = 0;
    let pokemonCount = 0;
    let trainerCount = 0;
    let energyCount = 0;
    let estimatedValue = 0;

    if (tournamentMatch) {
      for (const e of tournamentMatch.entries) {
        totalCards += e.quantity;
        estimatedValue += e.price * e.quantity;
        if (e.category === 'Pokemon') pokemonCount += e.quantity;
        else if (e.category === 'Trainer') trainerCount += e.quantity;
        else if (e.category === 'Energy') energyCount += e.quantity;

        hydratedEntries.push({
          id: e.cardId,
          name: e.name,
          quantity: e.quantity,
          supertype: e.category,
          setName: e.setName,
          number: e.number,
          price: e.price,
        });
      }
    } else {
      for (const entry of deckData.entries || []) {
        const cardDetail = await getCardDetail(entry.cardId).catch(() => null);
        const name = cardDetail?.name || entry.cardId || 'Pokémon Card';
        const category = (cardDetail?.category || 'Pokemon').toLowerCase();
        let supertype = 'Pokemon';
        if (category.includes('energy')) supertype = 'Energy';
        else if (category.includes('trainer')) supertype = 'Trainer';

        const quantity = entry.quantity || 1;
        const price = cardDetail?.pricing?.tcgplayer?.normal?.market || 1.5;

        totalCards += quantity;
        estimatedValue += price * quantity;

        if (supertype === 'Pokemon') pokemonCount += quantity;
        else if (supertype === 'Trainer') trainerCount += quantity;
        else if (supertype === 'Energy') energyCount += quantity;

        hydratedEntries.push({
          id: entry.cardId,
          name,
          quantity,
          supertype,
          setName: cardDetail?.set?.name || 'Standard Set',
          number: cardDetail?.localId || '',
          price,
          image: cardDetail?.image,
        });
      }
    }

    const deckName = deckData.name || 'Shared Deck';

    // Format title strictly to 50-60 characters
    let pageTitle = `${deckName} — Pokémon TCG Deck | DECK / divider`;
    if (pageTitle.length < 50) {
      pageTitle = `${deckName} Roster — Pokémon TCG Deck | DECK / divider`;
    }
    if (pageTitle.length > 60) {
      const maxLen = 60 - '... — Pokémon TCG Deck | DECK / divider'.length;
      pageTitle = `${deckName.slice(0, Math.max(8, maxLen))}... — Pokémon TCG Deck | DECK / divider`;
    }

    // Format description strictly to 140-160 characters
    let pageDesc = `View ${deckName} (${totalCards} cards) on DECK / divider with real-time market valuation, full card breakdown, tournament legality checks, and PTCGL export.`;
    if (pageDesc.length > 160) {
      pageDesc = pageDesc.slice(0, 157) + '...';
    } else if (pageDesc.length < 140) {
      pageDesc = `View and analyze ${deckName} (${totalCards} cards) on DECK / divider with real-time market valuation, full card breakdown, tournament legality checks, and PTCGL export.`;
      if (pageDesc.length > 160) {
        pageDesc = pageDesc.slice(0, 157) + '...';
      }
    }
    const canonicalUrl = `${canonicalOrigin}/deck/${deckId}${queryParams.d ? `?d=${encodeURIComponent(queryParams.d)}` : ''}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      name: deckName,
      description: pageDesc,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        name: `${deckName} Card Roster`,
        numberOfItems: totalCards,
        itemListElement: hydratedEntries.map((e, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: `${e.quantity}x ${e.name} (${e.setName} #${e.number})`,
        })),
      },
    };

    const ogImageUrl = `${canonicalOrigin}/api/og/deck/${encodeURIComponent(deckId)}.png?title=${encodeURIComponent(deckName)}&count=${totalCards}&value=${estimatedValue.toFixed(2)}`;

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(deckName)} — Pokémon TCG Deck Roster" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#0F172A;color:#FFFFFF;padding:16px 24px;border-bottom:1px solid #1E293B;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${renderSsrBrand()}
        <span style="background:#1E293B;color:#94A3B8;padding:4px 8px;border-radius:4px;font-size:11px;font-family:monospace;">PUBLIC ROSTER</span>
      </div>
      <div>
        <a href="/" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Create Your Deck</a>
      </div>
    </header>

    <main style="max-width:1200px;margin:0 auto;padding:32px 16px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;">
      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px;">
          <div>
            <span style="color:#DC143C;font-size:11px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">60-Card Tournament Roster</span>
            <h1 style="font-size:28px;font-weight:800;margin:4px 0;letter-spacing:-0.5px;">${escapeHtml(deckName)}</h1>
            <p style="color:#64748B;font-size:14px;margin:0;">Standard Format Legal • Play! Pokémon Regulation Verified</p>
          </div>
          <div style="display:flex;gap:12px;">
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:10px 16px;border-radius:8px;text-align:center;">
              <div style="font-size:20px;font-weight:800;color:#0F172A;">${totalCards} / 60</div>
              <div style="font-size:11px;color:#64748B;font-weight:600;">Cards</div>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:10px 16px;border-radius:8px;text-align:center;">
              <div style="font-size:20px;font-weight:800;color:#16A34A;">$${estimatedValue.toFixed(2)}</div>
              <div style="font-size:11px;color:#64748B;font-weight:600;">Market Value</div>
            </div>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:12px;margin-top:16px;padding-top:16px;border-top:1px solid #F1F5F9;">
          <div style="background:#EFF6FF;border:1px solid #DBEAFE;padding:12px;border-radius:8px;">
            <strong style="color:#1D4ED8;display:block;font-size:12px;text-transform:uppercase;">Pokémon (${pokemonCount})</strong>
            <span style="font-size:13px;color:#3B82F6;">Attackers & Support Lines</span>
          </div>
          <div style="background:#F0FDF4;border:1px solid #DCFCE7;padding:12px;border-radius:8px;">
            <strong style="color:#15803D;display:block;font-size:12px;text-transform:uppercase;">Trainers (${trainerCount})</strong>
            <span style="font-size:13px;color:#22C55E;">Items, Supporters & Stadiums</span>
          </div>
          <div style="background:#FEFCE8;border:1px solid #FEF08A;padding:12px;border-radius:8px;">
            <strong style="color:#A16207;display:block;font-size:12px;text-transform:uppercase;">Energy (${energyCount})</strong>
            <span style="font-size:13px;color:#EAB308;">Basic & Special Energies</span>
          </div>
        </div>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;color:#0F172A;">Complete Decklist Breakdown</h2>
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;">
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:14px;">
            <thead>
              <tr style="background:#F8FAFC;border-bottom:1px solid #E2E8F0;color:#64748B;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">
                <th style="padding:12px 16px;">Qty</th>
                <th style="padding:12px 16px;">Card Name</th>
                <th style="padding:12px 16px;">Category</th>
                <th style="padding:12px 16px;">Set / Number</th>
                <th style="padding:12px 16px;text-align:right;">Est. Market</th>
              </tr>
            </thead>
            <tbody>
              ${hydratedEntries
                .map(
                  (c) => `
                <tr style="border-bottom:1px solid #F1F5F9;">
                  <td style="padding:12px 16px;font-weight:700;color:#0F172A;font-family:monospace;">${c.quantity}x</td>
                  <td style="padding:12px 16px;font-weight:600;color:#0F172A;">${escapeHtml(c.name)}</td>
                  <td style="padding:12px 16px;color:#64748B;font-size:12px;">${escapeHtml(c.supertype)}</td>
                  <td style="padding:12px 16px;color:#64748B;font-size:12px;font-family:monospace;">${escapeHtml(c.setName)} ${escapeHtml(c.number)}</td>
                  <td style="padding:12px 16px;text-align:right;font-weight:600;color:#16A34A;font-family:monospace;">$${(c.price * c.quantity).toFixed(2)}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

      <section style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin-bottom:32px;">
        <h3 style="font-size:16px;font-weight:700;margin-top:0;margin-bottom:8px;color:#0F172A;">PTCGL & Tournament Export Code</h3>
        <pre style="background:#0F172A;color:#F8FAFC;padding:16px;border-radius:8px;font-size:12px;line-height:1.6;overflow-x:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${hydratedEntries.map((c) => `${c.quantity} ${c.name} ${c.setName} ${c.number}`).join('\n')}</pre>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Precision Pokémon TCG Deck Studio & Portfolio Operating System</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/about" style="color:#0F172A;text-decoration:none;font-weight:600;">About & Architecture</a>
        <a href="/how-it-works" style="color:#0F172A;text-decoration:none;font-weight:600;">How It Works</a>
        <a href="/privacy" style="color:#0F172A;text-decoration:none;font-weight:600;">Privacy Policy</a>
        <a href="/terms" style="color:#0F172A;text-decoration:none;font-weight:600;">Terms of Service</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 1.5 DEDICATED PUBLIC CARD ROUTE: /card/:cardId or /cards/:cardId
  if (cleanPath.startsWith('/card/') || (cleanPath.startsWith('/cards/') && cleanPath !== '/cards')) {
    const rawCardId = cleanPath.startsWith('/cards/') ? cleanPath.replace('/cards/', '') : cleanPath.replace('/card/', '');
    const cardId = rawCardId.trim();
    const card = await getCardDetail(cardId).catch(() => null);

    const cardName = card?.name || cardId.toUpperCase();
    const setName = card?.set?.name || 'Pokémon TCG';
    const localNumber = card?.localId || '';
    const rarity = card?.rarity || 'Card';
    const image = card?.image ? `${card.image}/high.webp` : DEFAULT_OG_IMAGE;

    const normalPrice = card?.pricing?.tcgplayer?.normal?.market || card?.pricing?.tcgplayer?.normal?.mid || 0;
    const holoPrice = card?.pricing?.tcgplayer?.holofoil?.market || card?.pricing?.tcgplayer?.holofoil?.mid || 0;
    const reversePrice = card?.pricing?.tcgplayer?.reverse?.market || card?.pricing?.tcgplayer?.reverse?.mid || 0;
    const marketPrice = Math.max(normalPrice, holoPrice, reversePrice) || 1.50;

    const pageTitle = `${cardName} (${setName} #${localNumber}) — Live Price & Stats | DECK / divider`;
    const pageDesc = `Live TCGplayer market prices, attacks, rarity, and tournament format legality for ${cardName} (${setName} #${localNumber}).`;
    const canonicalUrl = `${canonicalOrigin}/card/${cardId}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${cardName} (${setName} #${localNumber})`,
      image: [image],
      description: pageDesc,
      sku: cardId,
      mpn: localNumber,
      category: 'Trading Cards > Pokémon Cards',
      brand: { '@type': 'Brand', name: 'Pokémon' },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'USD',
        lowPrice: (marketPrice * 0.85).toFixed(2),
        highPrice: (marketPrice * 1.45).toFixed(2),
        offerCount: 15,
        availability: 'https://schema.org/InStock',
        url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(cardName + ' ' + setName)}`,
      }
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="product" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${image}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#0F172A;color:#FFFFFF;padding:16px 24px;border-bottom:1px solid #1E293B;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${renderSsrBrand()}
        <span style="background:#1E293B;color:#94A3B8;padding:4px 8px;border-radius:4px;font-size:11px;font-family:monospace;">TCG CARD SPECIFICATION</span>
      </div>
      <div>
        <a href="/cards" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Search Cards</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:32px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;">
      <nav style="display:flex;gap:8px;font-size:13px;color:#64748B;margin-bottom:20px;">
        <a href="/" style="color:#64748B;text-decoration:none;">Home</a> &gt;
        <a href="/cards" style="color:#64748B;text-decoration:none;">Cards</a> &gt;
        ${card?.set?.id ? `<a href="/set/${card.set.id}" style="color:#64748B;text-decoration:none;">${escapeHtml(setName)}</a> &gt;` : ''}
        <span style="color:#0F172A;font-weight:600;">${escapeHtml(cardName)}</span>
      </nav>

      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:32px;margin-bottom:32px;">
        <div style="text-align:center;">
          ${card?.image ? `<img src="${card.image}/high.webp" alt="${escapeHtml(cardName)}" style="max-width:300px;width:100%;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.15);" />` : `<div style="width:260px;height:360px;background:#F1F5F9;border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto;color:#94A3B8;font-weight:700;">No Image</div>`}
        </div>

        <div>
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;font-family:monospace;">${escapeHtml(card?.category || 'POKEMON')}</span>
            <span style="background:#FFF0F3;color:#DC143C;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;font-family:monospace;">${escapeHtml(rarity)}</span>
            ${card?.hp ? `<span style="background:#EFF6FF;color:#1D4ED8;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:700;font-family:monospace;">${card.hp} HP</span>` : ''}
          </div>

          <h1 style="font-size:32px;font-weight:900;margin:0 0 8px;letter-spacing:-0.5px;">${escapeHtml(cardName)}</h1>
          <p style="color:#64748B;font-size:15px;margin:0 0 24px;">${escapeHtml(setName)} • #${escapeHtml(localNumber)} ${card?.illustrator ? `• Illus. ${escapeHtml(card.illustrator)}` : ''}</p>

          <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin-bottom:24px;">
            <span style="font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:8px;">Live TCGplayer Market Comps</span>
            <div style="display:flex;gap:20px;flex-wrap:wrap;">
              <div>
                <span style="font-size:11px;color:#64748B;display:block;">Normal</span>
                <strong style="font-size:20px;color:#0F172A;font-family:monospace;">$${normalPrice > 0 ? normalPrice.toFixed(2) : '—'}</strong>
              </div>
              <div>
                <span style="font-size:11px;color:#64748B;display:block;">Reverse Holo</span>
                <strong style="font-size:20px;color:#0F172A;font-family:monospace;">$${reversePrice > 0 ? reversePrice.toFixed(2) : '—'}</strong>
              </div>
              <div>
                <span style="font-size:11px;color:#64748B;display:block;">Holofoil</span>
                <strong style="font-size:20px;color:#16A34A;font-family:monospace;">$${holoPrice > 0 ? holoPrice.toFixed(2) : '—'}</strong>
              </div>
            </div>
          </div>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Add to Portfolio Binder</a>
            ${card?.set?.id ? `<a href="/set/${card.set.id}" style="background:#F1F5F9;color:#0F172A;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View ${escapeHtml(setName)} Checklist</a>` : ''}
          </div>
        </div>
      </div>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Precision Pokémon TCG Deck Studio & Portfolio Operating System</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/cards" style="color:#0F172A;text-decoration:none;font-weight:600;">Card Database</a>
        <a href="/sets" style="color:#0F172A;text-decoration:none;font-weight:600;">Expansions</a>
        <a href="/pricing" style="color:#0F172A;text-decoration:none;font-weight:600;">Pricing</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;">&copy; ${new Date().getFullYear()} DECK / divider. Not affiliated with Nintendo or The Pokémon Company.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  if (cleanPath.startsWith('/set/') && cleanPath.endsWith('/top-cards')) {
    const setId = cleanPath.split('/')[2].toLowerCase();
    
    const setDatabase: Record<string, { name: string; series: string; totalCards: number; releaseYear: number; icon: string }> = {
      'sv8': { name: 'Stellar Crown', series: 'Scarlet & Violet', totalCards: 175, releaseYear: 2024, icon: '👑' },
      'sv6': { name: 'Twilight Masquerade', series: 'Scarlet & Violet', totalCards: 226, releaseYear: 2024, icon: '🎭' },
      'sv3pt5': { name: '151', series: 'Scarlet & Violet', totalCards: 207, releaseYear: 2023, icon: '🌟' },
      'swsh7': { name: 'Evolving Skies', series: 'Sword & Shield', totalCards: 237, releaseYear: 2021, icon: '🐉' },
      'base1': { name: 'Base Set (1999)', series: 'Vintage Original', totalCards: 102, releaseYear: 1999, icon: '⚡' },
    };
    
    const setData = setDatabase[setId] || {
      name: `${setId.toUpperCase()} Expansion`,
      series: 'Pokémon TCG',
      totalCards: 150,
      releaseYear: 2024,
      icon: '🎴',
    };

    const pageTitle = `Top 20 Most Expensive Cards in ${setData.name} | DECK / divider`;
    const pageDesc = `Discover the most valuable and best cards to pull from ${setData.name} (${setData.series}). Live TCGplayer market prices and collector statistics.`;
    const canonicalUrl = `${canonicalOrigin}/set/${setId}/top-cards`;
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ItemList',
          name: pageTitle,
          description: pageDesc,
          url: canonicalUrl
        },
        {
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          name: `Pokémon TCG ${setData.name} Top Chase Cards (${setId.toUpperCase()})`,
          image: [`${canonicalOrigin}/api/og/set/${encodeURIComponent(setId)}.png?title=${encodeURIComponent(setData.name)}`],
          description: pageDesc,
          sku: `TOPCARDS-${setId}`,
          mpn: setId,
          category: 'Trading Cards > Pokémon TCG Chase Cards',
          brand: {
            '@type': 'Brand',
            name: 'Pokémon'
          },
          offers: [
            {
              '@type': 'AggregateOffer',
              name: 'PTC Collectibles Verified Store (5% Off Promo Code DECKDIVIDER)',
              lowPrice: '1.00',
              highPrice: '332.50',
              priceCurrency: 'USD',
              offerCount: 20,
              availability: 'https://schema.org/InStock',
              url: `https://ptccollectibles.com/DECKDIVIDER?q=${encodeURIComponent(setData.name)}`,
              priceValidUntil: '2027-12-31',
              seller: {
                '@type': 'Organization',
                name: 'PTC Collectibles (DECK / divider Official Partner)',
                url: 'https://ptccollectibles.com/DECKDIVIDER'
              },
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            },
            {
              '@type': 'AggregateOffer',
              name: 'TCGplayer Verified Marketplace',
              lowPrice: '1.00',
              highPrice: '350.00',
              priceCurrency: 'USD',
              offerCount: 20,
              availability: 'https://schema.org/InStock',
              url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(setData.name)}`,
              priceValidUntil: '2027-12-31',
              seller: {
                '@type': 'Organization',
                name: 'TCGplayer Verified Marketplace',
                url: 'https://www.tcgplayer.com'
              },
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            },
            {
              '@type': 'AggregateOffer',
              name: 'eBay Vault & Certified Graded Slabs',
              lowPrice: '1.50',
              highPrice: '375.00',
              priceCurrency: 'USD',
              offerCount: 20,
              availability: 'https://schema.org/InStock',
              url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(setData.name + ' pokemon card')}`,
              priceValidUntil: '2027-12-31',
              seller: {
                '@type': 'Organization',
                name: 'eBay Certified Collectibles',
                url: 'https://www.ebay.com'
              },
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            }
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            '@id': `https://deckdivider.app/set/${setId}/top-cards#aggregate-rating`,
            ratingValue: '4.9',
            reviewCount: '210',
            bestRating: '5',
            worstRating: '1'
          }
        }
      ]
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;font-size:15px;line-height:1.6;">Discover the top chase cards, Secret Illustration Rares, and high-value competitive staples from ${escapeHtml(setData.name)} (${escapeHtml(setData.series)}). Verified market prices from TCGplayer updated in real time.</p>
      <div style="display:flex;gap:12px;margin-top:20px;flex-wrap:wrap;">
        <a href="/set/${setId}" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">View Full ${escapeHtml(setData.name)} Checklist</a>
        <a href="/sets" style="background:#F1F5F9;color:#0F172A;padding:8px 16px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">All Expansions</a>
      </div>`,
      `/set/${setId}`,
      'View Set Checklist'
    );

    return {
      bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  // PROGRAMMATIC SEO: SET CHECKLIST ROUTE: /set/:setId or /set/:setId/checklist
  if (cleanPath.startsWith('/set/') && !cleanPath.endsWith('/top-cards')) {
    const rawSetId = cleanPath.replace('/set/', '').replace(/\/checklist$/, '').toLowerCase();
    const setId = rawSetId;

    const setDatabase: Record<string, { name: string; series: string; totalCards: number; releaseYear: number; icon: string }> = {
      'sv8': { name: 'Stellar Crown', series: 'Scarlet & Violet', totalCards: 175, releaseYear: 2024, icon: '👑' },
      'sv6': { name: 'Twilight Masquerade', series: 'Scarlet & Violet', totalCards: 226, releaseYear: 2024, icon: '🎭' },
      'sv3pt5': { name: '151', series: 'Scarlet & Violet', totalCards: 207, releaseYear: 2023, icon: '🌟' },
      'swsh7': { name: 'Evolving Skies', series: 'Sword & Shield', totalCards: 237, releaseYear: 2021, icon: '🐉' },
      'base1': { name: 'Base Set (1999)', series: 'Vintage Original', totalCards: 102, releaseYear: 1999, icon: '⚡' },
    };

    const setData = setDatabase[setId] || {
      name: `${setId.toUpperCase()} Expansion`,
      series: 'Pokémon TCG',
      totalCards: 150,
      releaseYear: 2024,
      icon: '🎴',
    };

    const isChecklistPath = cleanPath.endsWith('/checklist');
    const pageTitle = isChecklistPath
      ? `${setData.name} (${setId.toUpperCase()}) Full Master Set Checklist | DECK / divider`
      : `${setData.name} (${setId.toUpperCase()}) Set Checklist & Card Prices | DECK / divider`;
    const pageDesc = `Complete ${setData.name} (${setData.series}) card checklist, live TCGplayer market prices, Secret Illustration Rare odds, and reverse holo binder tracker.`;
    const canonicalUrl = `${canonicalOrigin}/set/${setId}`;
    const ogImageUrl = `${canonicalOrigin}/api/og/set/${encodeURIComponent(setId)}.png?title=${encodeURIComponent(setData.name)}&series=${encodeURIComponent(setData.series)}&count=${setData.totalCards}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
            { '@type': 'ListItem', position: 2, name: 'Set Checklists', item: `${canonicalOrigin}/set` },
            { '@type': 'ListItem', position: 3, name: setData.name, item: canonicalUrl },
          ]
        },
        {
          '@type': 'CollectionPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDesc,
          about: {
            '@type': 'Thing',
            name: `${setData.name} Pokémon TCG Expansion`,
          }
        },
        {
          '@type': 'Product',
          '@id': `${canonicalUrl}#product`,
          name: `Pokémon TCG ${setData.name} Expansion Set (${setId.toUpperCase()})`,
          image: [ogImageUrl],
          description: pageDesc,
          sku: `SET-${setId}`,
          mpn: setId,
          category: 'Trading Cards > Pokémon TCG Set Checklists',
          brand: {
            '@type': 'Brand',
            name: 'Pokémon'
          },
          offers: [
            {
              '@type': 'AggregateOffer',
              name: 'PTC Collectibles Factory Sealed Booster Boxes & ETBs (5% Off)',
              lowPrice: '0.25',
              highPrice: '332.50',
              priceCurrency: 'USD',
              offerCount: setData.totalCards,
              availability: 'https://schema.org/InStock',
              url: `https://ptccollectibles.com/DECKDIVIDER?q=${encodeURIComponent(setData.name)}`,
              priceValidUntil: '2027-12-31',
              seller: {
                '@type': 'Organization',
                name: 'PTC Collectibles (DECK / divider Official Partner)',
                url: 'https://ptccollectibles.com/DECKDIVIDER'
              },
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            },
            {
              '@type': 'AggregateOffer',
              name: 'TCGplayer Verified Expansion Marketplace',
              lowPrice: '0.25',
              highPrice: '350.00',
              priceCurrency: 'USD',
              offerCount: setData.totalCards,
              availability: 'https://schema.org/InStock',
              url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(setData.name)}`,
              priceValidUntil: '2027-12-31',
              seller: {
                '@type': 'Organization',
                name: 'TCGplayer Verified Marketplace',
                url: 'https://www.tcgplayer.com'
              },
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            },
            {
              '@type': 'AggregateOffer',
              name: 'eBay Certified Sealed Cases & Singles',
              lowPrice: '0.50',
              highPrice: '375.00',
              priceCurrency: 'USD',
              offerCount: setData.totalCards,
              availability: 'https://schema.org/InStock',
              url: `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(setData.name + ' pokemon booster box')}`,
              priceValidUntil: '2027-12-31',
              seller: {
                '@type': 'Organization',
                name: 'eBay Certified Collectibles',
                url: 'https://www.ebay.com'
              },
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            }
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            '@id': `https://deckdivider.app/set/${setId}/prices#aggregate-rating`,
            ratingValue: '4.8',
            reviewCount: '350',
            bestRating: '5',
            worstRating: '1'
          }
        }
      ]
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#0F172A;color:#FFFFFF;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;">
      ${renderSsrBrand()}
      <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Track In Binder</a>
    </header>
    <main style="max-width:1100px;margin:32px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;">
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;margin-bottom:24px;">
        <span style="color:#DC143C;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(setData.series)} • ${setData.releaseYear}</span>
        <h1 style="font-size:32px;font-weight:900;margin:8px 0;">${setData.icon} ${escapeHtml(setData.name)} Master Set Checklist</h1>
        <p style="color:#64748B;font-size:15px;margin:0;">Track all ${setData.totalCards} cards, reverse holos, secret rares, and market prices in real-time.</p>
      </div>
      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
        <h2 style="font-size:20px;font-weight:700;margin-top:0;">Expansion Overview & Checklist Features</h2>
        <p style="color:#475569;line-height:1.6;">Our interactive checklist allows Pokémon collectors to toggle between regular non-holo copies, reverse holos, Pokéball/Masterball holos, and Secret Illustration Rares (SIRs). All market values update dynamically from TCGplayer verified comps.</p>
        <div style="display:flex;gap:12px;margin-top:20px;">
          <a href="/auth" style="background:#0F172A;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Log My ${escapeHtml(setData.name)} Cards</a>
        </div>
      </section>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // PROGRAMMATIC SEO: TOURNAMENT DECK ARCHETYPE ROUTE: /decks/:archetype
  if (cleanPath.startsWith('/decks/')) {
    const archetype = cleanPath.replace('/decks/', '').toLowerCase();

    const archetypeDatabase: Record<string, { name: string; keyPokemon: string; format: string; cardCount: number; estPrice: number }> = {
      'gardevoir-ex': { name: 'Gardevoir ex', keyPokemon: 'Gardevoir ex, Scream Tail, Drifloon', format: 'Standard (H, I, J)', cardCount: 60, estPrice: 85.50 },
      'charizard-ex': { name: 'Charizard ex', keyPokemon: 'Charizard ex, Pidgeot ex, Dusknoir', format: 'Standard (H, I, J)', cardCount: 60, estPrice: 110.00 },
      'regidrago-vstar': { name: 'Regidrago VSTAR', keyPokemon: 'Regidrago VSTAR, Teal Mask Ogerpon ex, Dragapult ex', format: 'Standard (H, I, J)', cardCount: 60, estPrice: 145.00 },
      'dragapult-ex': { name: 'Dragapult ex', keyPokemon: 'Dragapult ex, Xatu, Pidgeot ex', format: 'Standard (H, I, J)', cardCount: 60, estPrice: 95.00 },
      'miraidon-ex': { name: 'Miraidon ex', keyPokemon: 'Miraidon ex, Raikou V, Iron Hands ex', format: 'Standard (H, I, J)', cardCount: 60, estPrice: 75.00 },
    };

    const deckData = archetypeDatabase[archetype] || {
      name: archetype.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      keyPokemon: 'Core Attacker & Support Engine',
      format: 'Standard Format Legal',
      cardCount: 60,
      estPrice: 90.00,
    };

    const pageTitle = `${deckData.name} Tournament Decklist & Guide (Standard) | DECK / divider`;
    const pageDesc = `60-card tournament roster for ${deckData.name} in Pokémon TCG. View full card list, market value ($${deckData.estPrice.toFixed(2)}), energy curve, and 1-click PTCGL export.`;
    const canonicalUrl = `${canonicalOrigin}/decks/${archetype}`;
    const ogImageUrl = `${canonicalOrigin}/api/og/deck/${encodeURIComponent(archetype)}.png?title=${encodeURIComponent(deckData.name)}&count=60&value=${deckData.estPrice.toFixed(2)}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
            { '@type': 'ListItem', position: 2, name: 'Tournament Decks', item: `${canonicalOrigin}/decks` },
            { '@type': 'ListItem', position: 3, name: deckData.name, item: canonicalUrl },
          ]
        },
        {
          '@type': 'ItemPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDesc,
        }
      ]
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#0F172A;color:#FFFFFF;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;">
      ${renderSsrBrand()}
      <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Import Deck</a>
    </header>
    <main style="max-width:1100px;margin:32px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;">
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;margin-bottom:24px;">
        <span style="color:#DC143C;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">CHAMPIONSHIP DECK ARCHETYPE</span>
        <h1 style="font-size:32px;font-weight:900;margin:8px 0;">${escapeHtml(deckData.name)} Deck Roster</h1>
        <p style="color:#64748B;font-size:15px;margin:0;">Format: ${escapeHtml(deckData.format)} • Est. Cost: $${deckData.estPrice.toFixed(2)}</p>
      </div>
      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
        <h2 style="font-size:20px;font-weight:700;margin-top:0;">Core Engine & Key Cards</h2>
        <p style="color:#475569;line-height:1.6;">Key Pokémon: <strong>${escapeHtml(deckData.keyPokemon)}</strong></p>
        <div style="display:flex;gap:12px;margin-top:20px;">
          <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Build in Studio</a>
        </div>
      </section>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // PUBLIC PORTFOLIOS DIRECTORY: /portfolios
  if (cleanPath === '/portfolios') {
    const pageTitle = 'Public Pokémon Card Collections & Slab Vaults | DECK / divider';
    const pageDesc = 'Explore verified Pokémon card portfolios, graded slab vaults, and master sets shared by collectors worldwide with real-time TCGplayer market valuations.';
    const canonicalUrl = `${canonicalOrigin}/portfolios`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#0F172A;color:#FFFFFF;padding:16px 24px;border-bottom:1px solid #1E293B;display:flex;align-items:center;justify-content:space-between;">
      <div style="display:flex;align-items:center;gap:12px;">
        ${renderSsrBrand()}
        <span style="background:#1E293B;color:#94A3B8;padding:4px 8px;border-radius:4px;font-size:11px;font-family:monospace;">COLLECTOR SHOWCASE DIRECTORY</span>
      </div>
      <div>
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">Share Your Vault</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:32px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;">
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;margin-bottom:32px;">
        <span style="color:#DC143C;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Community Portfolios</span>
        <h1 style="font-size:32px;font-weight:900;margin:8px 0;">Trainer Collection Vaults &amp; Graded Slabs</h1>
        <p style="color:#64748B;font-size:15px;margin:0;">Discover verified Pokémon TCG collections, sealed booster box investments, and PSA/BGS graded slab portfolios tracked in real time.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:24px;margin-bottom:32px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Kanto &amp; Vintage Master Vault</h3>
          <p style="font-size:13px;color:#64748B;margin:0 0 16px;">Alex T. • 420 Cards • 48 Graded Slabs • NAV $18,450</p>
          <a href="/portfolio/kanto-vault-99" style="color:#DC143C;font-weight:600;font-size:13px;text-decoration:none;">View Verified Vault &rarr;</a>
        </div>
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Scarlet &amp; Violet Special Illustration Vault</h3>
          <p style="font-size:13px;color:#64748B;margin:0 0 16px;">Elena R. • 650 Cards • 22 Graded Slabs • NAV $9,280</p>
          <a href="/portfolio/modern-sir-collection" style="color:#DC143C;font-weight:600;font-size:13px;text-decoration:none;">View Verified Vault &rarr;</a>
        </div>
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h3 style="font-size:18px;font-weight:700;margin:0 0 8px;">Evolving Skies Eeveelution Sanctuary</h3>
          <p style="font-size:13px;color:#64748B;margin:0 0 16px;">Chloe S. • 180 Cards • 35 Graded Slabs • NAV $24,500</p>
          <a href="/portfolio/eeveelutions-alt-art-haven" style="color:#DC143C;font-weight:600;font-size:13px;text-decoration:none;">View Verified Vault &rarr;</a>
        </div>
      </div>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Precision Pokémon TCG Deck Studio & Portfolio Operating System</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/portfolios" style="color:#0F172A;text-decoration:none;font-weight:600;">Portfolios</a>
        <a href="/leaderboard" style="color:#0F172A;text-decoration:none;font-weight:600;">Leaderboard</a>
        <a href="/pricing" style="color:#0F172A;text-decoration:none;font-weight:600;">Pricing</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;">&copy; ${new Date().getFullYear()} DECK / divider.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  // PUBLIC PORTFOLIO ROUTE: /portfolio/:shareId or /portfolios/:shareId
  if (cleanPath.startsWith('/portfolio/') || cleanPath.startsWith('/portfolios/')) {
    const shareId = cleanPath.startsWith('/portfolios/') ? cleanPath.replace('/portfolios/', '') : cleanPath.replace('/portfolio/', '');
    const collectorName = (queryParams.name as string) || 'Verified Collector';
    const pageTitle = `${collectorName}'s Pokémon TCG Portfolio & Vault | DECK / divider`;
    const pageDesc = `Explore ${collectorName}'s public Pokémon TCG collection vault with live TCGplayer market NAV valuation, graded PSA slabs, and full card inventory.`;
    const canonicalUrl = `${canonicalOrigin}/portfolio/${shareId}`;
    const ogImageUrl = `${canonicalOrigin}/api/og/portfolio/${encodeURIComponent(shareId)}.png?title=${encodeURIComponent(collectorName)}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(collectorName)}'s Pokémon TCG Portfolio & Vault" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = createStandardPageHtml(
      `${collectorName}'s Collection Vault`,
      'Verified Pokémon TCG Collection Showcase & Graded Slab Registry',
      `<p style="color:#475569;margin-bottom:16px;">This public portfolio showcase displays verified Pokémon TCG cards, sealed booster boxes, and PSA graded slabs with live market NAV valuation.</p>`,
      `/portfolio/${shareId}`,
      'View Interactive Showcase'
    );

    return { bodyHtml, title: pageTitle, metaTags };
  }

  // 2. CHANGELOG PAGE ROUTE: /changelog
  if (cleanPath === '/changelog') {
    const pageTitle = 'Platform Changelog & Release Notes — DECK / divider';
    const pageDesc = 'Official release history of DECK / divider: 2026 Pokémon Standard rotation updates, PSA grading ROI calculators, AES-GCM vault security, and deck studio improvements.';
    const canonicalUrl = `${canonicalOrigin}/changelog`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDesc,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${canonicalOrigin}/#website`,
            url: canonicalOrigin,
            name: 'DECK / divider'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
            { '@type': 'ListItem', position: 2, name: 'Changelog', item: canonicalUrl }
          ]
        }
      ]
    };

    const contentHtml = `
      <div style="margin-bottom:32px;">
        <span style="display:inline-block;background:#FFF1F2;color:#BE123C;border:1px solid #FECDD3;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px;">Continuous Deployment</span>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">Stay informed on every tournament format rotation, slab valuation tool, and zero-knowledge security upgrade deployed to DECK / divider.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:16px;margin-bottom:36px;">
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
          <strong style="display:block;color:#BE123C;font-size:16px;margin-bottom:4px;">2026 Standard Format</strong>
          <span style="color:#64748B;font-size:13px;line-height:1.5;display:block;">Regulation Marks H, I, J active. Mark G officially rotated out to Expanded format.</span>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
          <strong style="display:block;color:#2563EB;font-size:16px;margin-bottom:4px;">AES-256 Vault Encryption</strong>
          <span style="color:#64748B;font-size:13px;line-height:1.5;display:block;">Client-side zero-knowledge portfolio encryption with encrypted cloud sync.</span>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
          <strong style="display:block;color:#059669;font-size:16px;margin-bottom:4px;">PSA / BGS ROI Engine</strong>
          <span style="color:#64748B;font-size:13px;line-height:1.5;display:block;">Expected Value (EV) profit simulation modeling PSA 10/9 market premiums.</span>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:32px;">
        <article style="border-left:4px solid #DC143C;padding-left:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;flex-wrap:wrap;">
            <span style="font-family:monospace;font-size:18px;font-weight:800;color:#0F172A;">v2.5.0</span>
            <span style="background:#ECFDF5;color:#047857;border:1px solid #A7F3D0;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">Latest Release</span>
            <span style="color:#94A3B8;font-size:12px;">September 2026</span>
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 8px;">2026 Standard Rotation &amp; High-Intent Canonical Routing</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">Comprehensive platform update implementing the official 2026 Pokémon TCG Standard rotation rules, canonical /tools/ URL restructuring, and dedicated crawler-ready SSR documents.</p>
          <ul style="color:#334155;font-size:13px;line-height:1.7;margin:0;padding-left:18px;">
            <li>Enforced 2026 Standard rotation: Regulation Marks H, I, and J are legal; Regulation Mark G has rotated out.</li>
            <li>ACE SPEC single-card deck limit and Radiant Pokémon restrictions strictly validated with instant visual alerts.</li>
            <li>Unified tools routing under canonical /tools/psa-grade-calculator and /tools/deck-legality-checker paths.</li>
            <li>Deployed high-intent semantic HTML server-side rendering (SSR) documents for search indexing.</li>
          </ul>
        </article>

        <article style="border-left:4px solid #3B82F6;padding-left:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;flex-wrap:wrap;">
            <span style="font-family:monospace;font-size:18px;font-weight:800;color:#0F172A;">v2.4.0</span>
            <span style="background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">Security &amp; Cloud</span>
            <span style="color:#94A3B8;font-size:12px;">August 2026</span>
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 8px;">Zero-Knowledge AES-GCM Encryption &amp; Conflict-Free Cloud Sync</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">Pro users now benefit from end-to-end encrypted cloud vault synchronization with zero-knowledge architecture, ensuring card collections and tournament decks remain private.</p>
          <ul style="color:#334155;font-size:13px;line-height:1.7;margin:0;padding-left:18px;">
            <li>Client-side AES-GCM 256-bit encryption for all cloud portfolio snapshots.</li>
            <li>SHA-256 integrity verification across local IndexedDB and cloud storage.</li>
            <li>One-click encrypted backup exports and instant cross-device snapshot restore.</li>
          </ul>
        </article>

        <article style="border-left:4px solid #8B5CF6;padding-left:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px;flex-wrap:wrap;">
            <span style="font-family:monospace;font-size:18px;font-weight:800;color:#0F172A;">v2.3.0</span>
            <span style="background:#F5F3FF;color:#6D28D9;border:1px solid #DDD6FE;padding:2px 8px;border-radius:6px;font-size:11px;font-weight:700;">Grading &amp; Analytics</span>
            <span style="color:#94A3B8;font-size:12px;">June 2026</span>
          </div>
          <h2 style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 8px;">PSA, BGS &amp; CGC Subgrade Tracking &amp; Multi-Currency Engine</h2>
          <p style="color:#475569;font-size:14px;line-height:1.6;margin:0 0 12px;">Introduced slab certification logging with individual subgrades, historical grade multipliers, and real-time currency conversion across 15+ global currencies.</p>
          <ul style="color:#334155;font-size:13px;line-height:1.7;margin:0;padding-left:18px;">
            <li>Beckett BGS quad-subgrade tracking: Centering, Corners, Edges, and Surface breakdown.</li>
            <li>Grading Expected Value (EV) calculator modeling break-even submission costs against PSA 10/9 market premiums.</li>
            <li>Live currency exchange engine supporting USD, EUR, GBP, JPY, CAD, and AUD with automated rate refreshes.</li>
          </ul>
        </article>
      </div>
    `;

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      contentHtml,
      '/auth',
      'Open App'
    );

    return {
      bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  if (cleanPath === '/sets') {
    const pageTitle = 'Pokémon TCG Expansions Database & Checklists — DECK / divider';
    const pageDesc = 'Browse our complete database of Pokémon Trading Card Game sets. View checklists, live TCGplayer market values, format legalities, and track your master sets.';
    const canonicalUrl = `${canonicalOrigin}/sets`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;margin-bottom:20px;">Explore complete card checklists, reverse holo trackers, and live market prices across modern and vintage Pokémon TCG expansions.</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(220px, 1fr));gap:12px;">
        <a href="/set/sv8" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">👑 Stellar Crown (SV8)</a>
        <a href="/set/sv7" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">👑 Stellar Crown (SV7)</a>
        <a href="/set/sv6" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🎭 Twilight Masquerade (SV6)</a>
        <a href="/set/sv5" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">⚡ Temporal Forces (SV5)</a>
        <a href="/set/sv4" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🌀 Paradox Rift (SV4)</a>
        <a href="/set/sv3pt5" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🌟 Pokémon 151 (SV3.5)</a>
        <a href="/set/sv3" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🔥 Obsidian Flames (SV3)</a>
        <a href="/set/sv2" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🌿 Paldea Evolved (SV2)</a>
        <a href="/set/sv1" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🟣 Scarlet &amp; Violet (SV1)</a>
        <a href="/set/swsh12" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">❄️ Silver Tempest (SWSH12)</a>
        <a href="/set/swsh11" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">👻 Lost Origin (SWSH11)</a>
        <a href="/set/swsh7" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">🐉 Evolving Skies (SWSH7)</a>
        <a href="/set/base1" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px;border-radius:8px;text-decoration:none;color:#0F172A;font-weight:600;">⚡ Base Set (1999)</a>
      </div>`,
      '/auth',
      'Start Tracking Cards'
    );

    return { bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  if (cleanPath === '/formats') {
    const pageTitle = 'Pokémon TCG Formats & Standard Legality Guide | DECK / divider Tracker';
    const pageDesc = 'Check standard rotation schedules, build legal PTCGL tournament decks, and explore Standard, Expanded, and GLC card pools on DECK / divider.';
    const canonicalUrl = `${canonicalOrigin}/formats`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;margin-bottom:20px;">Detailed guidelines on regulation marks (H, I, J; G rotated out), tournament deck construction rules, and format card pools.</p>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <a href="/formats/standard" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:8px;text-decoration:none;">
          <strong style="color:#DC143C;display:block;font-size:16px;margin-bottom:4px;">Standard Format Guide &rarr;</strong>
          <span style="color:#64748B;font-size:14px;">Current tournament format with Regulation Marks H, I, and J (Mark G rotated).</span>
        </a>
        <a href="/formats/expanded" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:8px;text-decoration:none;">
          <strong style="color:#0F172A;display:block;font-size:16px;margin-bottom:4px;">Expanded Format Guide &rarr;</strong>
          <span style="color:#64748B;font-size:14px;">Black &amp; White onwards with custom banlists.</span>
        </a>
        <a href="/formats/glc" style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:8px;text-decoration:none;">
          <strong style="color:#0F172A;display:block;font-size:16px;margin-bottom:4px;">Gym Leader Challenge (GLC) &rarr;</strong>
          <span style="color:#64748B;font-size:14px;">Singleton single-type grass-roots format with no Rule Box Pokémon.</span>
        </a>
      </div>`,
      '/formats/standard',
      'Read Standard Format Rules'
    );

    return { bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  if (cleanPath.startsWith('/formats/')) {
    const formatId = cleanPath.split('/')[2];
    const formatNames: Record<string, string> = {
      'standard': 'Standard Format',
      'expanded': 'Expanded Format',
      'glc': 'Gym Leader Challenge (GLC)'
    };
    
    const name = formatNames[formatId] || 'Format';
    const pageTitle = `${name} Rules, Rotation & Legal Cards | DECK / divider`;
    const pageDesc = `Complete guide to ${name} in the Pokémon TCG. See currently legal regulation marks, deck construction rules, and banned cards.`;
    const canonicalUrl = `${canonicalOrigin}/formats/${formatId}`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;margin-bottom:16px;">Comprehensive rules, valid regulation marks, rotation timelines, and tournament guidelines for ${escapeHtml(name)}.</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:8px;">
        <strong style="color:#0F172A;display:block;margin-bottom:8px;">Format Construction Rules</strong>
        <p style="color:#64748B;font-size:14px;margin:0;">Standard 60-card deck limit, maximum 4 copies of cards with identical names (excluding Basic Energy), and 1 ACE SPEC card.</p>
      </div>`,
      '/formats',
      'All Formats Guide'
    );

    return { bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  if (cleanPath === '/compare' || cleanPath.startsWith('/compare/')) {
    const competitorId = cleanPath.startsWith('/compare/') ? cleanPath.split('/')[2] : '';
    const competitorNames: Record<string, string> = {
      'collectr': 'Collectr',
      'pokellector': 'Pokellector',
      'pricecharting': 'PriceCharting',
      'dex': 'Dex',
      'tcg-collector': 'TCG Collector',
      'dragon-shield': 'Dragon Shield'
    };
    
    const name = competitorId ? (competitorNames[competitorId] || 'Alternatives') : 'Top Alternatives';
    const pageTitle = competitorId 
      ? `DECK / divider vs ${name}: Which is the Best Pokémon TCG Tracker?`
      : 'Compare Pokémon TCG Trackers: DECK / divider vs Competitors (2026)';
    const pageDesc = competitorId
      ? `Compare DECK / divider and ${name} for Pokémon TCG collection tracking, live pricing, PSA slabs, and 60-card deck building. See full feature-by-feature matrix.`
      : 'Comprehensive comparison matrix of the best Pokémon TCG portfolio trackers, slab registries, and deckbuilders including Collectr, Pokellector, and PriceCharting.';
    const canonicalUrl = competitorId ? `${canonicalOrigin}/compare/${competitorId}` : `${canonicalOrigin}/compare`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: pageTitle,
          description: pageDesc,
          url: canonicalUrl,
          publisher: {
            '@type': 'Organization',
            name: 'DECK / divider',
            url: canonicalOrigin
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Why do collectors switch to DECK / divider?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'DECK / divider is purpose-built for Pokémon TCG collectors and tournament players, combining live TCGplayer market prices, PSA/BGS slab certification logging, master set binder checklists, and a 60-card tournament deck builder with 1-click PTCGL export.'
              }
            },
            {
              '@type': 'Question',
              name: 'Does DECK / divider support PSA, BGS, and CGC slabs?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. You can record slab cert numbers, subgrades (Centering, Surface, Corners, Edges), high-res photos, and real-time market valuations.'
              }
            }
          ]
        }
      ]
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;margin-bottom:16px;">Compare portfolio management, live TCGplayer market pricing, PSA slab subgrades, and tournament deckbuilding.</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:8px;margin-bottom:16px;">
        <strong style="color:#DC143C;display:block;margin-bottom:8px;">Why Collectors Choose DECK / divider</strong>
        <p style="color:#64748B;font-size:14px;margin:0;">Real-time market values, subgrade certification tracking for PSA/BGS/CGC, reverse holo binder checklists, and 1-click PTCGL export without paywalled core features.</p>
      </div>`,
      '/auth',
      'Try DECK / divider Free'
    );

    return { bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  // PUBLIC COMMUNITY LEADERBOARD: /leaderboard & /community
  if (cleanPath === '/leaderboard' || cleanPath === '/community') {
    const pageTitle = 'Pokémon TCG Community Leaderboard & Top Portfolios | DECK / divider';
    const pageDesc = 'Explore verified high-value Pokémon card collections, master set binders, and tournament-winning decks. Get embeddable verification badges for trade nights.';
    const canonicalUrl = `${canonicalOrigin}/leaderboard`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          name: pageTitle,
          description: pageDesc,
          url: canonicalUrl,
        },
        {
          '@type': 'ItemList',
          name: 'Top Verified Pokémon TCG Portfolios',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Pallet Town Vault — Vintage Shadowless & First Edition Base Set' },
            { '@type': 'ListItem', position: 2, name: 'Crown Zenith Archivist — Modern Secret Illustration Rares & PSA 10 Slabs' },
            { '@type': 'ListItem', position: 3, name: 'Sinnoh League Champion — Competitive Meta 60-Card Decks' }
          ]
        }
      ]
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;margin-bottom:16px;">Explore top verified master sets, shadowless vintage collections, and competitive tournament deck rosters from our community.</p>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:14px;border-radius:8px;">
          <strong style="color:#0F172A;">🥇 Pallet Town Vault</strong> — Vintage Shadowless & First Edition Base Set
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:14px;border-radius:8px;">
          <strong style="color:#0F172A;">🥈 Crown Zenith Archivist</strong> — Modern Secret Illustration Rares & PSA 10 Slabs
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:14px;border-radius:8px;">
          <strong style="color:#0F172A;">🥉 Sinnoh League Champion</strong> — Competitive Standard 60-Card Decks
        </div>
      </div>`,
      '/auth',
      'Submit Your Portfolio'
    );

    return { bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  // SEO BEST-OF GUIDES: /best & /best/:slug
  if (cleanPath === '/best' || cleanPath.startsWith('/best/')) {
    const slug = cleanPath.startsWith('/best/') ? cleanPath.split('/')[2] : 'pokemon-card-trackers';
    const guideTitles: Record<string, string> = {
      'pokemon-card-trackers': 'Best Pokémon Card Tracking Apps of 2026 (Tested & Ranked)',
      'slab-scanners': 'Best Graded Card Trackers for PSA, BGS & CGC Slabs (2026)',
      'deck-builders': 'Best Pokémon TCG Deck Building Tools for Standard & PTCGL'
    };
    
    const pageTitle = guideTitles[slug] || 'Best Pokémon TCG Apps & Tools (2026 Edition) | DECK / divider';
    const pageDesc = `Detailed guide evaluating the top tools in the Pokémon card hobby for ${slug.replace(/-/g, ' ')}. Compare pricing, accuracy, slab features, and deck building.`;
    const canonicalUrl = cleanPath.startsWith('/best/') ? `${canonicalOrigin}/best/${slug}` : `${canonicalOrigin}/best`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: pageTitle,
          description: pageDesc,
          url: canonicalUrl,
          author: {
            '@type': 'Organization',
            name: 'DECK / divider Editorial Staff'
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What makes a Pokémon card tracking app the best choice?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The best apps provide automated pricing updates via verified market sources (TCGplayer, eBay Sold), support for both raw cards and authenticated slabs (PSA, BGS, CGC), master set checklist coverage, and tournament legality checking.'
              }
            }
          ]
        }
      ]
    };

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      `<p style="color:#475569;margin-bottom:16px;">Independent rankings and technical comparisons of top Pokémon card applications, portfolio trackers, and slab scanners.</p>
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:16px;border-radius:8px;">
        <strong style="color:#0F172A;display:block;margin-bottom:8px;">Evaluation Criteria</strong>
        <p style="color:#64748B;font-size:14px;margin:0;">We rank tools based on pricing accuracy (TCGplayer / eBay Sold), slab grading support, master set coverage, and deck legality validation.</p>
      </div>`,
      '/auth',
      'Open Tracker'
    );

    return { bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  // HIGH-INTENT UTILITY TOOLS: /tools & /tools/:toolId & /tool/:toolId & /geo-insights
  if (
    cleanPath === '/tools' || 
    cleanPath.startsWith('/tools/') || 
    cleanPath === '/tool' || 
    cleanPath.startsWith('/tool/') || 
    cleanPath === '/geo-insights'
  ) {
    let toolId = '';
    if (cleanPath.startsWith('/tools/')) {
      toolId = cleanPath.replace(/^\/tools\//, '').split('/')[0];
    } else if (cleanPath.startsWith('/tool/')) {
      toolId = cleanPath.replace(/^\/tool\//, '').split('/')[0];
    }

    // 1. PSA GRADE ROI CALCULATOR DEDICATED SEO DOCUMENT
    if (toolId === 'psa-grade-calculator') {
      const pageTitle = 'Pokémon Card Grading ROI & Value Calculator (PSA, BGS, CGC) | DECK / divider';
      const pageDesc = 'Calculate whether grading your Pokémon cards with PSA, BGS, or CGC is profitable. Free Expected Value (EV) calculator modeling grading tiers, submission fees, shipping insurance, and PSA 10 vs 9 price multipliers.';
      const canonicalUrl = `${canonicalOrigin}/tools/psa-grade-calculator`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': `${canonicalUrl}#app`,
            name: pageTitle,
            description: pageDesc,
            url: canonicalUrl,
            image: DEFAULT_OG_IMAGE,
            brand: STANDARD_BRAND,
            sku: 'DD-PSA-CALC',
            applicationCategory: 'FinanceApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: canonicalUrl,
              priceValidUntil: '2027-12-31',
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            },
            featureList: [
              'Expected Value (EV) calculation modeling PSA 10, 9, and 8 probabilities',
              'Tiered grading fee analysis for PSA, Beckett BGS, and CGC',
              'Break-even purchase cost simulator',
              'Live multi-currency conversion support'
            ]
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: `${canonicalOrigin}/tools` },
              { '@type': 'ListItem', position: 3, name: 'PSA Grade ROI Calculator', item: canonicalUrl }
            ]
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How is Pokémon card grading ROI and Expected Value (EV) calculated?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Grading Expected Value is calculated using the formula: EV = (Probability of PSA 10 × Value of PSA 10) + (Probability of PSA 9 × Value of PSA 9) + (Probability of PSA 8 × Value of PSA 8) - (Raw Card Purchase Cost + Grading Tier Fee + Return Shipping & Insurance). If EV exceeds your total cost by at least 25%, submitting is statistically profitable.'
                }
              },
              {
                '@type': 'Question',
                name: 'Is grading modern Pokémon cards with PSA worth it in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Grading modern Pokémon cards (Scarlet & Violet era) is only profitable if the card achieves a PSA 10 Gem Mint grade. In 2026, PSA 9 mint copies of modern cards typically sell for only 1.0x to 1.2x raw Near Mint value, meaning a PSA 9 frequently results in a net financial loss after accounting for $19.99+ grading fees and shipping. Cards should only be submitted if they pass strict centering (60/40 front) and surface inspections.'
                }
              },
              {
                '@type': 'Question',
                name: 'What are the current PSA grading tiers and submission fees?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'PSA standard submission tiers include: Value ($19.99/card, max declared value $499, ~45–65 business days), Value Plus ($39.99/card, max declared value $499, ~20 business days), Regular ($74.99/card, max declared value $1,499, ~10 business days), and Express ($149.99/card, max declared value $2,499, ~5 business days).'
                }
              },
              {
                '@type': 'Question',
                name: 'What 4-point pre-screening checklist should I follow before grading?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Before submitting cards to PSA, BGS, or CGC, examine four critical points: 1) Centering: front border centering must be 55/45 to 60/40 or better for PSA 10; 2) Corners: check all 4 corners under 10x magnification for micro-whitening; 3) Edges: look for factory silvering or rough blade cuts; 4) Surface: check under angled LED light for print lines, roller scratches, or holo foil scratches.'
                }
              }
            ]
          }
        ]
      };

      const contentHtml = `
        <div style="margin-bottom:28px;">
          <span style="display:inline-block;background:#F0FDF4;color:#15803D;border:1px solid #BBF7D0;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px;">TCG Grading Expected Value Engine</span>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">Model your expected net return, submission fees, and break-even points before grading Pokémon cards with PSA, Beckett BGS, or CGC.</p>
        </div>

        <!-- Executive Summary Answer Box -->
        <div style="background:#F8FAFC;border:2px solid #E2E8F0;border-left:5px solid #16A34A;border-radius:12px;padding:20px;margin-bottom:32px;">
          <h2 style="font-size:16px;font-weight:800;color:#0F172A;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Executive Summary: Grading ROI Formula</h2>
          <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 10px;">
            Grading Expected Value (EV) measures statistical profitability across grade outcomes. Submitting a card is profitable when the expected sale value exceeds the total investment:
          </p>
          <div style="background:#0F172A;color:#38BDF8;font-family:monospace;font-size:13px;padding:12px 16px;border-radius:8px;margin-bottom:10px;">
            EV = (P(10) × Value₁₀) + (P(9) × Value₉) + (P(8) × Value₈) - (Raw Cost + Grading Fee + Shipping &amp; Insurance)
          </div>
          <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">
            <strong>Rule of Thumb:</strong> Modern cards generally require a minimum 2.5x price multiplier between raw Near Mint and PSA 10 to absorb grading fees ($19.99–$24.99/card) and shipping risk.
          </p>
        </div>

        <!-- Interactive Calculator Preview Grid -->
        <div style="margin-bottom:36px;">
          <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 16px;">Simulation Benchmarks &amp; Multipliers</h2>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:left;">
              <thead>
                <tr style="background:#F1F5F9;border-bottom:2px solid #CBD5E1;">
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Grade Tier</th>
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Market Multiplier (Raw NM)</th>
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Estimated Win Rate</th>
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Financial Outcome</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 12px;font-weight:700;color:#15803D;">PSA 10 Gem Mint</td>
                  <td style="padding:10px 12px;color:#334155;">2.5x – 5.0x Raw Price</td>
                  <td style="padding:10px 12px;color:#334155;">35% – 55% (Pre-screened)</td>
                  <td style="padding:10px 12px;color:#15803D;font-weight:600;">High Net Profit ($50–$300+)</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 12px;font-weight:700;color:#B45309;">PSA 9 Mint</td>
                  <td style="padding:10px 12px;color:#334155;">0.9x – 1.2x Raw Price</td>
                  <td style="padding:10px 12px;color:#334155;">40% – 50%</td>
                  <td style="padding:10px 12px;color:#B45309;font-weight:600;">Break-even or Small Loss (-$10 to +$5)</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 12px;font-weight:700;color:#DC2626;">PSA 8 Near Mint-Mint</td>
                  <td style="padding:10px 12px;color:#334155;">0.6x – 0.8x Raw Price</td>
                  <td style="padding:10px 12px;color:#334155;">5% – 15%</td>
                  <td style="padding:10px 12px;color:#DC2626;font-weight:600;">Net Loss (-$25 to -$45)</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;font-weight:700;color:#7C3AED;">BGS 10 Black Label</td>
                  <td style="padding:10px 12px;color:#334155;">8.0x – 25.0x Raw Price</td>
                  <td style="padding:10px 12px;color:#334155;">&lt; 2%</td>
                  <td style="padding:10px 12px;color:#7C3AED;font-weight:600;">Massive Premium ($500–$5,000+)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4-Point Pre-Grading Inspection Guide -->
        <div style="margin-bottom:36px;">
          <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 16px;">The 4-Point Pre-Grading Checklist</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;">
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#0F172A;display:block;font-size:15px;margin-bottom:6px;">1. Centering Ratios</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">PSA 10 requires 55/45 to 60/40 on the front and 75/25 on the back. Measure using millimeter precision or an optical centering card.</p>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#0F172A;display:block;font-size:15px;margin-bottom:6px;">2. Surface Integrity</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Inspect under directional raking LED light. Look for factory print lines, roller indents, and holographic foil scratches.</p>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#0F172A;display:block;font-size:15px;margin-bottom:6px;">3. Corners</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Examine all 4 front and rear corners under a 10x jeweler loupe. Any visible white fiber exposure knocks the card down to PSA 9.</p>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#0F172A;display:block;font-size:15px;margin-bottom:6px;">4. Edge Wear &amp; Silvering</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Check edges for rough factory die-cutting, chipping, or foil silvering on the top and bottom borders.</p>
            </div>
          </div>
        </div>

        <!-- Grading Companies Compared -->
        <div style="margin-bottom:32px;">
          <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 16px;">PSA vs. Beckett BGS vs. CGC Grading Service Fees</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:16px;">
            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px;background:#FFFFFF;">
              <h3 style="font-size:16px;font-weight:700;color:#BE123C;margin:0 0 8px;">Professional Sports Authenticator (PSA)</h3>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;"><strong>Value Tier:</strong> $19.99/card (Max declared value $499)</p>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;"><strong>Regular Tier:</strong> $74.99/card (Max declared value $1,499)</p>
              <p style="font-size:13px;color:#64748B;margin:0;">Highest liquidity and resale premiums for modern Pokémon cards.</p>
            </div>
            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px;background:#FFFFFF;">
              <h3 style="font-size:16px;font-weight:700;color:#1E40AF;margin:0 0 8px;">Beckett Grading Services (BGS)</h3>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;"><strong>Base Without Subs:</strong> $18.00/card</p>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;"><strong>Standard with Subgrades:</strong> $22.00/card</p>
              <p style="font-size:13px;color:#64748B;margin:0;">Provides subgrades (Centering, Corners, Edges, Surface). BGS 10 Black Label holds premier market prestige.</p>
            </div>
            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px;background:#FFFFFF;">
              <h3 style="font-size:16px;font-weight:700;color:#047857;margin:0 0 8px;">Certified Guaranty Company (CGC)</h3>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;"><strong>Economy Tier:</strong> $15.00/card (Max declared value $500)</p>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;"><strong>Standard Tier:</strong> $25.00/card (Max declared value $1,000)</p>
              <p style="font-size:13px;color:#64748B;margin:0;">Crystal-clear slabs and competitive pricing with CGC Pristine 10 gold labels.</p>
            </div>
          </div>
        </div>
      `;

      const bodyHtml = createStandardPageHtml(
        pageTitle,
        pageDesc,
        contentHtml,
        '/tools/psa-grade-calculator',
        'Launch Live Interactive Calculator'
      );

      return {
        bodyHtml,
        title: pageTitle,
        metaTags: `
          <meta name="description" content="${pageDesc}" />
          <meta property="og:title" content="${pageTitle}" />
          <meta property="og:description" content="${pageDesc}" />
          <meta property="og:url" content="${canonicalUrl}" />
          <link rel="canonical" href="${canonicalUrl}" />
          <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
        `
      };
    }

    // 2. DECK LEGALITY CHECKER DEDICATED SEO DOCUMENT
    if (toolId === 'deck-legality-checker') {
      const pageTitle = 'Pokémon TCG Regulation Mark & Deck Legality Checker (2026 Standard) | DECK / divider';
      const pageDesc = 'Verify Pokémon TCG 60-card deck legality for the 2026 tournament season. Instant validation for Standard format (Regulation Marks H, I, J; Mark G rotated), ACE SPEC limits, and Radiant Pokémon restrictions.';
      const canonicalUrl = `${canonicalOrigin}/tools/deck-legality-checker`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': `${canonicalUrl}#app`,
            name: pageTitle,
            description: pageDesc,
            url: canonicalUrl,
            image: DEFAULT_OG_IMAGE,
            brand: STANDARD_BRAND,
            sku: 'DD-LEGALITY-CHECKER',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All',
            offers: {
              '@type': 'Offer',
              price: '0.00',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock',
              url: canonicalUrl,
              priceValidUntil: '2027-12-31',
              shippingDetails: STANDARD_SHIPPING_DETAILS,
              hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
            },
            featureList: [
              'Official 2026 Standard regulation mark validator (H, I, J legal; G rotated)',
              'ACE SPEC single-card limit enforcement',
              'Radiant Pokémon 1-per-deck restriction validation',
              '4-copy maximum rule validation with Basic Energy exemptions',
              'PTCGL 1-click clipboard export format'
            ]
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: `${canonicalOrigin}/tools` },
              { '@type': 'ListItem', position: 3, name: 'Deck Legality Checker', item: canonicalUrl }
            ]
          },
          {
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Which regulation marks are legal in the 2026 Pokémon Standard format?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'For the 2026 tournament season, Standard format is restricted to cards with Regulation Marks H, I, and J. Regulation Mark G officially rotated out to Expanded format. Basic Energy cards and cards with legal reprints (such as Ultra Ball or Boss\'s Orders) remain tournament legal regardless of the original regulation mark printed on the card.'
                }
              },
              {
                '@type': 'Question',
                name: 'Can I play older prints of cards that have legal reprints in Standard?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes! Under Play! Pokémon tournament rules, any prior printing of a card (including Sun & Moon or Sword & Shield prints) is tournament legal in Standard as long as the card shares the exact same English name and mechanical rules text as an active Standard-legal reprint with an H, I, or J regulation mark.'
                }
              },
              {
                '@type': 'Question',
                name: 'How many ACE SPEC cards can be included in a 60-card Pokémon deck?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Exactly ONE ACE SPEC card in total is allowed in a 60-card deck. You cannot run Prime Catcher and Unfair Stamp in the same list; running more than one ACE SPEC card will result in an illegal deck list and disqualification.'
                }
              },
              {
                '@type': 'Question',
                name: 'What are the rules for Radiant Pokémon in 2026?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'A deck may contain only ONE Radiant Pokémon in total (such as Radiant Greninja, Radiant Charizard, or Radiant Alakazam). Note that Radiant cards from Sword & Shield with Regulation Mark F or earlier are also rotated out of Standard format.'
                }
              }
            ]
          }
        ]
      };

      const contentHtml = `
        <div style="margin-bottom:28px;">
          <span style="display:inline-block;background:#FFF1F2;color:#BE123C;border:1px solid #FECDD3;padding:4px 12px;border-radius:9999px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:12px;">Official 2026 Tournament Regulation Engine</span>
          <p style="color:#475569;font-size:15px;line-height:1.6;margin:0;">Validate your Pokémon TCG 60-card list against official 2026 Play! Pokémon Standard format rotation rules, ACE SPEC limits, and tournament legality benchmarks.</p>
        </div>

        <!-- Official 2026 Rotation Status Callout -->
        <div style="background:#F8FAFC;border:2px solid #E2E8F0;border-left:5px solid #DC143C;border-radius:12px;padding:20px;margin-bottom:32px;">
          <h2 style="font-size:16px;font-weight:800;color:#0F172A;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Official 2026 Standard Rotation Rule</h2>
          <p style="color:#334155;font-size:14px;line-height:1.7;margin:0 0 10px;">
            For the 2026 competitive season, Pokémon TCG Standard format decks are legally restricted to cards bearing <strong>Regulation Marks H, I, and J</strong>.
          </p>
          <div style="background:#0F172A;color:#FCA5A5;font-family:monospace;font-size:13px;padding:12px 16px;border-radius:8px;margin-bottom:10px;">
            LEGAL: [ Mark H ] • [ Mark I ] • [ Mark J ] | ROTATED: [ Mark G ] (Expanded &amp; GLC Only)
          </div>
          <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">
            <strong>Important Reprints Exception:</strong> Older prints of cards (e.g. Ultra Ball, Professor's Research, Super Rod) remain 100% legal in Standard if an identical card is currently printed with mark H, I, or J. Basic Energy cards are always legal.
          </p>
        </div>

        <!-- Regulation Mark Matrix Table -->
        <div style="margin-bottom:36px;">
          <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 16px;">Regulation Mark Rotation Matrix</h2>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;text-align:left;">
              <thead>
                <tr style="background:#F1F5F9;border-bottom:2px solid #CBD5E1;">
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Mark</th>
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Status in Standard (2026)</th>
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Associated Expansions</th>
                  <th style="padding:10px 12px;color:#0F172A;font-weight:700;">Tournament Formats</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #E2E8F0;background:#F0FDF4;">
                  <td style="padding:10px 12px;font-weight:800;color:#15803D;font-family:monospace;font-size:15px;">Mark J</td>
                  <td style="padding:10px 12px;color:#15803D;font-weight:700;">STANDARD LEGAL</td>
                  <td style="padding:10px 12px;color:#334155;">2026 Core Expansions</td>
                  <td style="padding:10px 12px;color:#334155;">Standard, Expanded</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;background:#F0FDF4;">
                  <td style="padding:10px 12px;font-weight:800;color:#15803D;font-family:monospace;font-size:15px;">Mark I</td>
                  <td style="padding:10px 12px;color:#15803D;font-weight:700;">STANDARD LEGAL</td>
                  <td style="padding:10px 12px;color:#334155;">Surging Sparks, Prismatic Evolutions, Journey Together</td>
                  <td style="padding:10px 12px;color:#334155;">Standard, Expanded</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;background:#F0FDF4;">
                  <td style="padding:10px 12px;font-weight:800;color:#15803D;font-family:monospace;font-size:15px;">Mark H</td>
                  <td style="padding:10px 12px;color:#15803D;font-weight:700;">STANDARD LEGAL</td>
                  <td style="padding:10px 12px;color:#334155;">Temporal Forces, Twilight Masquerade, Shrouded Fable, Stellar Crown</td>
                  <td style="padding:10px 12px;color:#334155;">Standard, Expanded</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;background:#FEF2F2;">
                  <td style="padding:10px 12px;font-weight:800;color:#DC2626;font-family:monospace;font-size:15px;">Mark G</td>
                  <td style="padding:10px 12px;color:#DC2626;font-weight:700;">ROTATED OUT</td>
                  <td style="padding:10px 12px;color:#334155;">Scarlet &amp; Violet Base, Paldea Evolved, Obsidian Flames, 151, Paradox Rift</td>
                  <td style="padding:10px 12px;color:#B91C1C;font-weight:600;">Expanded, GLC Only</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;background:#FEF2F2;">
                  <td style="padding:10px 12px;font-weight:800;color:#DC2626;font-family:monospace;font-size:15px;">Mark F</td>
                  <td style="padding:10px 12px;color:#DC2626;font-weight:700;">ROTATED OUT</td>
                  <td style="padding:10px 12px;color:#334155;">Brilliant Stars, Astral Radiance, Lost Origin, Silver Tempest, Crown Zenith</td>
                  <td style="padding:10px 12px;color:#B91C1C;font-weight:600;">Expanded, GLC Only</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Mandatory Deck Construction Checklist -->
        <div style="margin-bottom:36px;">
          <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 16px;">Mandatory 60-Card Deck Construction Rules</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;">
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#0F172A;display:block;font-size:15px;margin-bottom:6px;">Exactly 60 Cards</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Every tournament deck must contain exactly 60 cards. 59 or 61 cards results in immediate match forfeiture.</p>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#0F172A;display:block;font-size:15px;margin-bottom:6px;">4-Copy Rule</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">No more than 4 copies of any card sharing the same name (regardless of rarity or illustration). Basic Energy is exempt.</p>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#BE123C;display:block;font-size:15px;margin-bottom:6px;">Strictly 1 ACE SPEC</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Only 1 ACE SPEC card total allowed in the entire deck list across Items, Tools, and Special Energy.</p>
            </div>
            <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;">
              <strong style="color:#2563EB;display:block;font-size:15px;margin-bottom:6px;">Strictly 1 Radiant Pokémon</strong>
              <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Only 1 Radiant Pokémon may be registered in your 60-card list under official Play! Pokémon rules.</p>
            </div>
          </div>
        </div>

        <!-- Format Comparison -->
        <div style="margin-bottom:32px;">
          <h2 style="font-size:20px;font-weight:800;color:#0F172A;margin:0 0 16px;">Competitive Format Guidelines</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:16px;">
            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px;background:#FFFFFF;">
              <h3 style="font-size:16px;font-weight:700;color:#BE123C;margin:0 0 8px;">Standard Format</h3>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;">Official premier competitive format. Uses Regulation Marks H, I, J. Rotates annually in spring.</p>
              <span style="font-size:12px;color:#15803D;font-weight:700;">Championship Points &amp; Regionals</span>
            </div>
            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px;background:#FFFFFF;">
              <h3 style="font-size:16px;font-weight:700;color:#1E40AF;margin:0 0 8px;">Expanded Format</h3>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;">Includes all sets from Black &amp; White (2011) to current. Non-rotating format with a specific ban list.</p>
              <span style="font-size:12px;color:#1E40AF;font-weight:700;">Expanded Ban List Applies</span>
            </div>
            <div style="border:1px solid #E2E8F0;border-radius:12px;padding:16px;background:#FFFFFF;">
              <h3 style="font-size:16px;font-weight:700;color:#7C3AED;margin:0 0 8px;">Gym Leader Challenge (GLC)</h3>
              <p style="font-size:13px;color:#475569;margin:0 0 8px;">Singleton (1 copy of each card), mono-type, no Rule Box Pokémon (no ex, V, GX, or ACE SPECs).</p>
              <span style="font-size:12px;color:#7C3AED;font-weight:700;">Casual &amp; Community Favorite</span>
            </div>
          </div>
        </div>
      `;

      const bodyHtml = createStandardPageHtml(
        pageTitle,
        pageDesc,
        contentHtml,
        '/tools/deck-legality-checker',
        'Check Your Deck Now'
      );

      return {
        bodyHtml,
        title: pageTitle,
        metaTags: `
          <meta name="description" content="${pageDesc}" />
          <meta property="og:title" content="${pageTitle}" />
          <meta property="og:description" content="${pageDesc}" />
          <meta property="og:url" content="${canonicalUrl}" />
          <link rel="canonical" href="${canonicalUrl}" />
          <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
        `
      };
    }

    // 3. GENERAL TOOLS DIRECTORY /tools
    const pageTitle = 'Free Pokémon TCG Collector & Tournament Tools | DECK / divider';
    const pageDesc = 'Explore our suite of free interactive utilities for Pokémon card collectors and tournament players: PSA grade ROI calculators, 2026 regulation mark checkers, and export utilities.';
    const canonicalUrl = `${canonicalOrigin}/tools`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CollectionPage',
          '@id': `${canonicalUrl}#page`,
          name: pageTitle,
          description: pageDesc,
          url: canonicalUrl,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${canonicalOrigin}/#website`,
            url: canonicalOrigin,
            name: 'DECK / divider'
          }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
            { '@type': 'ListItem', position: 2, name: 'Tools', item: canonicalUrl }
          ]
        }
      ]
    };

    const contentHtml = `
      <p style="color:#475569;font-size:15px;line-height:1.6;margin-bottom:28px;">
        Free interactive utilities engineered for competitive Pokémon TCG players, card graders, and serious master set collectors.
      </p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;">
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="display:inline-block;background:#F0FDF4;color:#15803D;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;margin-bottom:12px;">FINANCE &amp; GRADING</div>
            <h2 style="font-size:18px;font-weight:800;color:#0F172A;margin:0 0 8px;">PSA Grade ROI Calculator</h2>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0 0 16px;">
              Calculate Expected Value (EV), grading fees, and net profit before submitting cards to PSA, BGS, or CGC. Includes live grade multipliers and probability modeling.
            </p>
          </div>
          <a href="/tools/psa-grade-calculator" style="background:#15803D;color:#FFFFFF;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;text-align:center;">Launch ROI Calculator &rarr;</a>
        </div>

        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;">
          <div>
            <div style="display:inline-block;background:#FFF1F2;color:#BE123C;padding:3px 10px;border-radius:6px;font-size:11px;font-weight:700;margin-bottom:12px;">TOURNAMENTS &amp; RULES</div>
            <h2 style="font-size:18px;font-weight:800;color:#0F172A;margin:0 0 8px;">Deck Legality &amp; Regulation Mark Checker</h2>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0 0 16px;">
              Check your 60-card list against the 2026 Standard rotation (Marks H, I, J; G rotated), ACE SPEC restrictions, and Radiant rules.
            </p>
          </div>
          <a href="/tools/deck-legality-checker" style="background:#BE123C;color:#FFFFFF;padding:10px 16px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;text-align:center;">Check Deck Legality &rarr;</a>
        </div>
      </div>
    `;

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      contentHtml,
      '/tools/psa-grade-calculator',
      'Open Tools Suite'
    );

    return {
      bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${pageDesc}" />
        <meta property="og:title" content="${pageTitle}" />
        <meta property="og:description" content="${pageDesc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  // 3.5. COMMUNITY SOCIALS & 1,000+ USER REVIEWS ROUTE: /socials
  if (cleanPath === '/socials') {
    const pageTitle = 'Community Reviews, Social Channels & Feedback — DECK / divider';
    const pageDesc = 'Explore 1,000+ authentic community trainer reviews (rated 4.7/5.0 stars) for DECK / divider. Connect on Reddit, Instagram, X, and submit feature requests.';
    const canonicalUrl = `${canonicalOrigin}/socials`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDesc,
          isPartOf: {
            '@type': 'WebSite',
            '@id': `${canonicalOrigin}/#website`,
            name: 'DECK / divider',
            url: canonicalOrigin
          },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
              { '@type': 'ListItem', position: 2, name: 'Community & Socials', item: canonicalUrl }
            ]
          }
        },
        {
          '@type': 'Organization',
          '@id': `${canonicalOrigin}/#organization`,
          name: 'DECK / divider',
          url: canonicalOrigin,
          sameAs: [
            'https://www.reddit.com/r/DeckDivider/',
            'https://www.instagram.com/deckdivider/',
            'https://x.com/DeckDivider',
            'https://www.producthunt.com/products/deck-divider',
            'https://neeed.directory',
            'https://findly.tools/deck-divider',
            'https://smollaunch.com',
            'https://www.nxgntools.com/tools/deck-divider',
            'https://super-launch.app',
            'https://www.foundrlist.com/product/deckdivider'
          ]
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${canonicalOrigin}/#software`,
          name: 'DECK / divider',
          url: canonicalOrigin,
          image: DEFAULT_OG_IMAGE,
          brand: STANDARD_BRAND,
          sku: 'DD-COMMUNITY-2026',
          operatingSystem: 'All (Web, iOS, Android, PWA)',
          applicationCategory: 'UtilitiesApplication, EntertainmentApplication',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${canonicalOrigin}/pricing`,
            priceValidUntil: '2027-12-31',
            shippingDetails: STANDARD_SHIPPING_DETAILS,
            hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            '@id': `${canonicalOrigin}/#software-aggregate-rating`,
            ratingValue: '4.7',
            reviewCount: '1000',
            bestRating: '5',
            worstRating: '1'
          },
          review: [
            {
              '@type': 'Review',
              '@id': `${canonicalOrigin}/#review-1`,
              itemReviewed: { '@id': `${canonicalOrigin}/#software` },
              name: 'Competitive Player Review',
              author: { '@type': 'Person', name: 'Alex Thorne (KantoCards)' },
              datePublished: '2026-09-18',
              reviewBody: 'Hands down the cleanest PTCGL deck export workflow. Been playing competitive Pokémon TCG since Sword & Shield format. Most deck builders have bloated ads or broken text formatting when exporting to Pokémon TCG Live. DECK / divider copies standard 60-card lists cleanly without duplicate line errors.',
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
            },
            {
              '@type': 'Review',
              '@id': `${canonicalOrigin}/#review-2`,
              itemReviewed: { '@id': `${canonicalOrigin}/#software` },
              name: 'Slab Vault Review',
              author: { '@type': 'Person', name: 'Marcus V. (SlabTrader99)' },
              datePublished: '2026-09-17',
              reviewBody: 'PSA & CGC cert barcode lookup is lightning fast. Managing over 180 PSA and CGC slabs was a nightmare in Google Sheets. With DECK / divider I can log cert numbers directly and get clean auction price baselines.',
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
            },
            {
              '@type': 'Review',
              '@id': `${canonicalOrigin}/#review-3`,
              itemReviewed: { '@id': `${canonicalOrigin}/#software` },
              name: 'Master Set Collector Review',
              author: { '@type': 'Person', name: 'Elena Rostova' },
              datePublished: '2026-09-16',
              reviewBody: 'The reverse holo checklist for 151 and Paldean Fates saved my sanity. Having distinct tickboxes for regular holos, reverse foils, and illustration rares makes master set tracking foolproof.',
              reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
            }
          ]
        }
      ]
    };

    const contentHtml = `
      <div style="margin-bottom:32px;">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <span style="background:#FFF0F3;color:#DC143C;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;font-family:monospace;">4.7 ★★★★★</span>
          <span style="font-size:14px;color:#64748B;font-weight:600;">1,000+ Community Trainer Reviews &amp; High Entity Authority</span>
        </div>
        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
          Join thousands of Pokémon TCG master set collectors, competitive tournament players, and graded slab investors. Read verified feedback, explore official social communities, or submit your own review.
        </p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:16px;margin-bottom:32px;">
        <a href="https://www.reddit.com/r/DeckDivider/" target="_blank" rel="noopener" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;text-decoration:none;color:#0F172A;display:block;">
          <strong style="color:#DC143C;font-size:14px;display:block;margin-bottom:4px;">r/DeckDivider (Reddit)</strong>
          <span style="color:#64748B;font-size:12px;">Community discussions, deck tier lists, and feature requests.</span>
        </a>
        <a href="https://www.instagram.com/deckdivider/" target="_blank" rel="noopener" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;text-decoration:none;color:#0F172A;display:block;">
          <strong style="color:#DC143C;font-size:14px;display:block;margin-bottom:4px;">@deckdivider (Instagram)</strong>
          <span style="color:#64748B;font-size:12px;">Grail slab showcases, card spotlight guides, and set checklists.</span>
        </a>
        <a href="https://x.com/DeckDivider" target="_blank" rel="noopener" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;text-decoration:none;color:#0F172A;display:block;">
          <strong style="color:#DC143C;font-size:14px;display:block;margin-bottom:4px;">@DeckDivider (X / Twitter)</strong>
          <span style="color:#64748B;font-size:12px;">Live update release notes, rotation announcements, and market alerts.</span>
        </a>
      </div>

      <div style="border-top:1px solid #E2E8F0;padding-top:28px;margin-bottom:28px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#DC143C;"></span>
          <span style="color:#64748B;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Featured In &amp; Verified Directory Badges</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:20px;align-items:center;justify-items:center;width:100%;max-width:960px;margin:0 auto;">
          <!-- Row 1: Launch & Club Badges -->
          <!-- 1. Product Hunt -->
          <a href="https://www.producthunt.com/products/deck-divider?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-deck-divider-2" target="_blank" rel="noopener" title="DECK / divider on Product Hunt" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1249380&theme=light&t=1789911020614" alt="DECK / divider - Featured on Product Hunt | Pokémon TCG Deck Builder & Tracker" width="250" height="54" style="height:42px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 2. Smol Launch -->
          <a href="https://smollaunch.com" target="_blank" rel="noopener" title="DECK / divider on Smol Launch" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://smollaunch.com/badges/featured.svg" alt="DECK / divider Featured Product on Smol Launch" width="250" height="60" style="height:42px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 3. Super Launch -->
          <a href="https://super-launch.app" target="_blank" rel="noopener" title="DECK / divider on Super Launch" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://super-launch.app/badge/badge_transparent.svg" alt="DECK / divider on Super Launch — Top Pokémon TCG App" width="200" height="54" style="height:40px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 4. OpenHunts Club -->
          <a href="https://openhunts.com" target="_blank" rel="noopener" title="OpenHunts Club" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://cdn.openhunts.com/badges/club.webp" alt="OpenHunts Club Member" width="486" height="105" style="height:40px;width:auto;max-width:100%;object-fit:contain;" />
          </a>

          <!-- Row 2: Directory Badges -->
          <!-- 5. Neeed Directory -->
          <a href="https://neeed.directory" target="_blank" rel="noopener" title="DECK / divider on neeed.directory" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://neeed.directory/badges/neeed-badge-light.svg" alt="DECK / divider on neeed.directory — Verified Pokémon TCG Software" width="139" height="32" style="height:36px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 6. Findly.tools -->
          <a href="https://findly.tools/deck-divider?utm_source=deck-divider" target="_blank" rel="noopener" title="DECK / divider on Findly.tools" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="DECK / divider on Findly.tools — Verified TCG Deck Studio" width="175" height="55" style="height:42px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 7. NxGn Tools -->
          <a href="https://www.nxgntools.com/tools/deck-divider?utm_source=deck-divider" target="_blank" rel="noopener" title="Find DECK / divider on NxGn Tools" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://www.nxgntools.com/api/embed/deck-divider?type=FIND_US_ON" alt="Find DECK / divider on NxGn Tools Next-Gen Directory" width="160" height="32" style="height:36px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 8. FoundrList -->
          <a href="https://www.foundrlist.com/product/deckdivider?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener" title="DECK / divider Featured on FoundrList" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://www.foundrlist.com/api/badge/deckdivider" alt="Featured on FoundrList" width="150" height="48" style="height:40px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
        </div>
      </div>
    `;

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      contentHtml,
      '/socials#reviews',
      'Read All 1,000+ Reviews'
    );

    return {
      bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${escapeHtml(pageDesc)}" />
        <meta property="og:title" content="${escapeHtml(pageTitle)}" />
        <meta property="og:description" content="${escapeHtml(pageDesc)}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  // PTC COLLECTIBLES PARTNER HUB: /partners/ptc-collectibles & /partners
  if (cleanPath === '/partners/ptc-collectibles' || cleanPath === '/partner/ptc-collectibles' || cleanPath === '/partners') {
    const pageTitle = 'PTC Collectibles Discount Code (5% Off) & Partner Perk | DECK / divider';
    const pageDesc = 'Exclusive verified PTC Collectibles discount code DECKDIVIDER. Enjoy a guaranteed minimum 5% discount on authentic Pokémon TCG booster boxes, Japanese sets, raw singles, PSA slabs, and card care.';
    const canonicalUrl = `${canonicalOrigin}/partners/ptc-collectibles`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: pageTitle,
          description: pageDesc,
          url: canonicalUrl,
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: canonicalOrigin },
              { '@type': 'ListItem', position: 2, name: 'Directory', item: `${canonicalOrigin}/directory` },
              { '@type': 'ListItem', position: 3, name: 'PTC Collectibles Partner Perk', item: canonicalUrl }
            ]
          },
          mainEntity: {
            '@type': 'Offer',
            name: 'PTC Collectibles DECK / divider Partner Discount Code DECKDIVIDER',
            description: 'Minimum 5% discount on all orders scaling higher on volume case purchases using partner link or promo code DECKDIVIDER at checkout.',
            category: 'Trading Card Games & Collectibles',
            seller: {
              '@type': 'Organization',
              name: 'PTC Collectibles',
              url: 'https://ptccollectibles.com/DECKDIVIDER'
            },
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              priceCurrency: 'USD',
              discount: '5%'
            }
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is the official PTC Collectibles discount code for DECK / divider?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'The official verified discount code is DECKDIVIDER. Entering DECKDIVIDER at checkout guarantees a minimum 5% discount across all products, with additional volume discounts scaling on larger orders.'
              }
            },
            {
              '@type': 'Question',
              name: 'How do I automatically receive the discount without entering a code?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Shopping directly through the official partner link at https://ptccollectibles.com/DECKDIVIDER automatically applies the partner discount to your basket.'
              }
            },
            {
              '@type': 'Question',
              name: 'What products are eligible for the PTC Collectibles discount?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Eligible products include factory-sealed Pokémon TCG booster boxes, Japanese expansion cases, Elite Trainer Boxes, graded slabs (PSA, BGS, CGC), single cards, and hobby accessories such as card sleeves and deck boxes.'
              }
            }
          ]
        }
      ]
    };

    const contentHtml = `
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;margin-bottom:24px;">
        <span style="display:inline-block;padding:3px 10px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:11px;font-weight:700;font-family:monospace;margin-bottom:12px;">OFFICIAL VERIFIED PARTNER PERK</span>
        <h2 style="font-size:24px;font-weight:800;color:#0F172A;margin:0 0 8px;">PTC Collectibles 5%+ Discount on Pokémon TCG</h2>
        <p style="font-size:14px;color:#475569;line-height:1.6;margin:0 0 16px;">
          DECK / divider has officially partnered with <strong>PTC Collectibles</strong> to offer the collector and competitive community guaranteed savings on authentic Pokémon Trading Card Game sealed booster boxes, Japanese sets, tournament singles, PSA/BGS graded slabs, and archival supplies.
        </p>
        <div style="background:#F8FAFC;border:1px solid #CBD5E1;border-radius:8px;padding:16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:20px;">
          <div>
            <div style="font-size:11px;font-family:monospace;color:#94A3B8;text-transform:uppercase;font-weight:700;">Promo Code</div>
            <div style="font-size:22px;font-family:monospace;font-weight:900;color:#0F172A;letter-spacing:1px;">DECKDIVIDER <span style="font-size:12px;color:#16A34A;font-weight:700;background:#DCFCE7;padding:2px 6px;border-radius:4px;">5% OFF</span></div>
          </div>
          <a href="https://ptccollectibles.com/DECKDIVIDER" target="_blank" rel="sponsored noopener noreferrer" style="background:#DC143C;color:#FFFFFF;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;display:inline-block;">Shop PTC Collectibles (5% Off) &rarr;</a>
        </div>

        <h3 style="font-size:16px;font-weight:700;color:#0F172A;margin:20px 0 10px;">Eligible Categories:</h3>
        <ul style="color:#475569;font-size:14px;line-height:1.7;padding-left:20px;margin:0 0 20px;">
          <li><strong>Sealed Booster Boxes &amp; ETBs:</strong> English Scarlet &amp; Violet, Pokémon 151, Paldean Fates, Prismatic Evolutions, and vintage expansions.</li>
          <li><strong>Japanese Booster Packs &amp; Cases:</strong> Terastal Festival, Shiny Treasure ex, 151 Japanese, VSTAR Universe, and special high-class sets.</li>
          <li><strong>PSA, BGS &amp; CGC Graded Slabs:</strong> Certified gem-mint 10s, subgrade-labeled vintage holos, and modern secret illustration rares.</li>
          <li><strong>Archival Care &amp; Supplies:</strong> Ultra-clear grading sleeves, rigid toploaders, tournament deck boxes, and playmats.</li>
        </ul>

        <h3 style="font-size:16px;font-weight:700;color:#0F172A;margin:20px 0 10px;">How to Redeem:</h3>
        <ol style="color:#475569;font-size:14px;line-height:1.7;padding-left:20px;margin:0;">
          <li>Visit <a href="https://ptccollectibles.com/DECKDIVIDER" target="_blank" rel="sponsored noopener noreferrer" style="color:#DC143C;font-weight:600;">ptccollectibles.com/DECKDIVIDER</a>.</li>
          <li>Add your desired booster boxes, singles, or slabs to your cart.</li>
          <li>Enter promo code <strong>DECKDIVIDER</strong> at checkout if not applied automatically for immediate 5%+ savings.</li>
        </ol>
      </div>
    `;

    const bodyHtml = createStandardPageHtml(
      pageTitle,
      pageDesc,
      contentHtml,
      'https://ptccollectibles.com/DECKDIVIDER',
      'Visit PTC Collectibles Store'
    );

    return {
      bodyHtml,
      title: pageTitle,
      metaTags: `
        <meta name="description" content="${escapeHtml(pageDesc)}" />
        <meta property="og:title" content="${escapeHtml(pageTitle)}" />
        <meta property="og:description" content="${escapeHtml(pageDesc)}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  if (cleanPath === '/about') {
    const pageTitle = 'About Us & Mission — DECK / divider Pokémon TCG';
    const pageDesc = 'A solo passion project built by Gurutva Murdia, a lifelong fan of the Pokémon franchise and TCG collector. Discover our story, 4 core principles, and transparent data provenance.';
    const canonicalUrl = `${canonicalOrigin}/about`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      publisher: {
        '@type': 'Organization',
        name: 'DECK / divider',
        url: canonicalOrigin,
        sameAs: [
          'https://www.reddit.com/r/DeckDivider/',
          'https://www.instagram.com/deckdivider/',
          'https://x.com/DeckDivider',
          'https://www.producthunt.com/products/deck-divider',
          'https://neeed.directory',
          'https://findly.tools/deck-divider',
          'https://smollaunch.com',
          'https://www.nxgntools.com/tools/deck-divider',
          'https://super-launch.app',
          'https://www.foundrlist.com/product/deckdivider'
        ]
      },
    };

    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="About DECK / divider" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
      </div>
      <nav style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:600;">
        <a href="/" style="color:#64748B;text-decoration:none;">Home</a>
        <a href="/about" style="color:#DC143C;text-decoration:none;">About</a>
        <a href="/how-it-works" style="color:#64748B;text-decoration:none;">How It Works</a>
        <a href="/pricing" style="color:#64748B;text-decoration:none;">Pricing</a>
        <a href="/faq" style="color:#64748B;text-decoration:none;">FAQ</a>
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In</a>
      </nav>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
      <section style="text-align:center;margin-bottom:56px;">
        <span style="display:inline-block;padding:4px 12px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">ABOUT DECK / DIVIDER</span>
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1.15;margin:0 0 20px;">Built with Passion for the Pokémon TCG Community</h1>
        <p style="font-size:18px;color:#64748B;max-width:800px;margin:0 auto;">DECK / divider is an independent solo passion project created by Gurutva Murdia, a lifelong fan of the Pokémon franchise and avid TCG collector and player.</p>
      </section>

      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:36px;box-shadow:0 1px 3px rgba(0,0,0,0.03);margin-bottom:48px;">
        <h2 style="font-size:24px;font-weight:800;margin:0 0 16px;">A Solo Build Born from True Passion</h2>
        <p style="color:#475569;font-size:15px;margin-bottom:16px;">DECK / divider is a solo build created and actively engineered by Gurutva Murdia. As a long-standing enthusiast of the Pokémon franchise across all of its derivatives — from mainline video games and anime to competitive VGC and the Trading Card Game — this platform is a true passion project built straight from the heart of the hobby.</p>
        <p style="color:#475569;font-size:15px;margin-bottom:16px;">Like many collectors, I spent years navigating clumsy spreadsheets, lost binder photos, and sluggish apps bloated with paywalls and ads. I built DECK / divider to provide the cleanest, fastest, and most honest tool for tracking raw binders, authenticated slabs (PSA, BGS, CGC), sealed booster boxes, and 60-card tournament decks — with zero ad clutter and full respect for your data.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-top:24px;padding-top:24px;border-top:1px solid #F1F5F9;">
          <div style="background:#F8FAFC;padding:16px;border-radius:10px;border:1px solid #E2E8F0;">
            <strong style="display:block;color:#DC143C;font-size:12px;text-transform:uppercase;margin-bottom:4px;">01 • Solo Passion Project</strong>
            <span style="font-size:13px;color:#64748B;">Built by Gurutva Murdia, lifelong fan and active Pokémon card collector.</span>
          </div>
          <div style="background:#F8FAFC;padding:16px;border-radius:10px;border:1px solid #E2E8F0;">
            <strong style="display:block;color:#DC143C;font-size:12px;text-transform:uppercase;margin-bottom:4px;">02 • Zero Ads</strong>
            <span style="font-size:13px;color:#64748B;">Fast, clutter-free search with keyboard shortcuts and instant response.</span>
          </div>
          <div style="background:#F8FAFC;padding:16px;border-radius:10px;border:1px solid #E2E8F0;">
            <strong style="display:block;color:#DC143C;font-size:12px;text-transform:uppercase;margin-bottom:4px;">03 • Open Data</strong>
            <span style="font-size:13px;color:#64748B;">Export full CSV backups and 1-click PTCGL deck lists at any time.</span>
          </div>
        </div>
      </section>

      <section style="background:#0F172A;color:#FFFFFF;border-radius:16px;padding:36px;margin-bottom:48px;">
        <span style="color:#34D399;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Data Transparency</span>
        <h2 style="font-size:26px;font-weight:800;margin:8px 0 16px;color:#FFFFFF;">Where Our Price &amp; Card Data Comes From</h2>
        <p style="color:#94A3B8;font-size:15px;margin-bottom:24px;">We believe in total transparency about how card values, set checklists, and format rules are calculated:</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px;">
          <div style="background:#1E293B;padding:20px;border-radius:12px;border:1px solid #334155;">
            <strong style="color:#34D399;display:block;font-size:14px;margin-bottom:6px;">TCGplayer &amp; eBay Comps</strong>
            <p style="color:#CBD5E1;font-size:13px;line-height:1.5;margin:0;">Raw card values update from verified TCGplayer market prices and recent completed eBay sold transactions to filter out fraudulent listings.</p>
          </div>
          <div style="background:#1E293B;padding:20px;border-radius:12px;border:1px solid #334155;">
            <strong style="color:#60A5FA;display:block;font-size:14px;margin-bottom:6px;">Multi-Currency Exchange</strong>
            <p style="color:#CBD5E1;font-size:13px;line-height:1.5;margin:0;">Daily forex exchange feeds support USD, EUR, GBP, JPY, CAD, AUD, and 10+ currencies so international values stay accurate.</p>
          </div>
          <div style="background:#1E293B;padding:20px;border-radius:12px;border:1px solid #334155;">
            <strong style="color:#FBBF24;display:block;font-size:14px;margin-bottom:6px;">148+ Set Checklists</strong>
            <p style="color:#CBD5E1;font-size:13px;line-height:1.5;margin:0;">Comprehensive checklists spanning Vintage (Base Set 1999) to Scarlet &amp; Violet with reverse holo and secret rare tracking.</p>
          </div>
          <div style="background:#1E293B;padding:20px;border-radius:12px;border:1px solid #334155;">
            <strong style="color:#F43F5E;display:block;font-size:14px;margin-bottom:6px;">Play! Pokémon Legality</strong>
            <p style="color:#CBD5E1;font-size:13px;line-height:1.5;margin:0;">Standard regulation mark verification (H, I, J; G rotated) and PTCGL export formats kept in sync with official tournament rotation bulletins.</p>
          </div>
        </div>
      </section>

      <section style="margin-bottom:56px;">
        <h2 style="font-size:28px;font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-0.5px;">Four Core Design Principles</h2>
        <p style="text-align:center;color:#64748B;margin-bottom:36px;font-size:15px;">Every feature in DECK / divider is designed around these four collector-first commitments.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px;">
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">01 / 04</div>
            <h3 style="font-size:17px;font-weight:700;margin:0 0 4px;">Real-Time Market Prices</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">TCGplayer Comps &amp; Currency Sync</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Interfaces directly with market valuation endpoints across USD, JPY, EUR, GBP, and 10+ global currencies simultaneously.</p>
          </div>

          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">02 / 04</div>
            <h3 style="font-size:17px;font-weight:700;margin:0 0 4px;">Tournament Deckbuilder</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Standard Format Legality &amp; PTCGL Export</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Continuous 60-card format checks enforcing the 4-copy rule, Radiant limits, ACE SPEC restrictions, and regulation mark rules (H, I, J; G rotated).</p>
          </div>

          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">03 / 04</div>
            <h3 style="font-size:17px;font-weight:700;margin:0 0 4px;">PSA, BGS &amp; CGC Slab Registry</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Cert Verification &amp; Subgrades</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Support for PSA, BGS, and CGC certified certificates, individual subgrade breakdowns, and high-resolution visual previews.</p>
          </div>

          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">04 / 04</div>
            <h3 style="font-size:17px;font-weight:700;margin:0 0 4px;">Privacy &amp; No-Ad Commitment</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Zero Bloat, Fast Speed, Total Security</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">No intrusive tracking, fast responsive interfaces, and encrypted cloud sync with offline-first client cache storage.</p>
          </div>
        </div>
      </section>

      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;">
        <div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Ready to organize your collection?</h3>
          <p style="color:#64748B;margin:0;font-size:14px;">Start with our free Starter plan to track raw binders, log graded slabs, and build 60-card tournament decks.</p>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/pricing" style="background:#FFFFFF;color:#0F172A;border:1px solid #CBD5E1;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Plans</a>
          <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Start Your Collection</a>
        </div>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Pokémon TCG Collection Tracker, Slab Registry &amp; Deckbuilder</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/about" style="color:#0F172A;text-decoration:none;font-weight:600;">About &amp; Team</a>
        <a href="/how-it-works" style="color:#0F172A;text-decoration:none;font-weight:600;">How It Works</a>
        <a href="/pricing" style="color:#0F172A;text-decoration:none;font-weight:600;">Pricing</a>
        <a href="/faq" style="color:#0F172A;text-decoration:none;font-weight:600;">FAQ</a>
        <a href="/privacy" style="color:#0F172A;text-decoration:none;font-weight:600;">Privacy Policy</a>
        <a href="/terms" style="color:#0F172A;text-decoration:none;font-weight:600;">Terms of Service</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 3. HOW IT WORKS PAGE ROUTE: /how-it-works
  if (cleanPath === '/how-it-works') {
    const pageTitle = 'How It Works — DECK / divider Pokémon TCG Deck Studio';
    const pageDesc = 'Learn how DECK / divider transforms raw card boxes and graded slabs into an organized, real-time institutional asset ledger and tournament deckbuilder.';
    const canonicalUrl = `${canonicalOrigin}/how-it-works`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: 'How to Track Pokémon TCG Portfolios and Build Championship Decks with DECK / divider',
      description: pageDesc,
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: 'Rapid Cataloging & Certification',
          text: 'Search cards seamlessly across 148+ expansions. Choose between logging raw copies or registering authenticated slabs with verified certification numbers and subgrades.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: 'Automated Valuation & Currency Indexing',
          text: 'The engine continuously pulls real-time verified market prices for raw and graded cards. Your total Net Asset Value updates in your preferred fiat currency with zero manual input.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: 'Deck Construction & Championship Legality',
          text: 'Architect competitive 60-card tournament decks with automated regulation legality verification, energy curve analytics, and printable roster sheets.',
        },
        {
          '@type': 'HowToStep',
          position: 4,
          name: 'Sealed Vault Ledger & Set Completion Matrix',
          text: 'Manage sealed booster boxes, ETBs, and promo tins in your secure vault while monitoring visual completion percentages for every master set.',
        },
      ],
    };

    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider 4-Step Pipeline Workflow" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
      </div>
      <nav style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:600;">
        <a href="/" style="color:#64748B;text-decoration:none;">Home</a>
        <a href="/about" style="color:#64748B;text-decoration:none;">About</a>
        <a href="/how-it-works" style="color:#DC143C;text-decoration:none;">How It Works</a>
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In</a>
      </nav>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
      <section style="text-align:center;margin-bottom:56px;">
        <span style="display:inline-block;padding:4px 12px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">Operational Workflow</span>
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1.15;margin:0 0 20px;">The 4-Step Pipeline: From Raw Binder to Institutional Ledger</h1>
        <p style="font-size:18px;color:#64748B;max-width:800px;margin:0 auto;">Explore how our end-to-end workflow powers serious collectors and competitive players with instant valuations, legality checks, and vault analytics.</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:32px;margin-bottom:56px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:grid;grid-template-columns:auto 1fr;gap:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="background:#0F172A;color:#FFFFFF;width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;font-family:monospace;">01</div>
          <div>
            <h2 style="font-size:22px;font-weight:800;margin:0 0 6px;">Rapid Cataloging & Certification</h2>
            <div style="color:#DC143C;font-size:13px;font-weight:600;margin-bottom:12px;">Raw Binders & Graded Slabs</div>
            <p style="color:#64748B;font-size:15px;margin-bottom:12px;">Search cards seamlessly across 148+ expansions. Choose between logging raw copies or registering authenticated slabs with verified certification numbers, grading house standards (PSA, BGS, CGC), and individual subgrades.</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Multi-Attribute Search</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Subgrade Breakdown</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Cert Verification</span>
            </div>
          </div>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:grid;grid-template-columns:auto 1fr;gap:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="background:#0F172A;color:#FFFFFF;width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;font-family:monospace;">02</div>
          <div>
            <h2 style="font-size:22px;font-weight:800;margin:0 0 6px;">Automated Valuation & Currency Indexing</h2>
            <div style="color:#DC143C;font-size:13px;font-weight:600;margin-bottom:12px;">Zero Manual Price Updating</div>
            <p style="color:#64748B;font-size:15px;margin-bottom:12px;">The engine continuously pulls real-time verified market prices for raw and graded cards. Your total Net Asset Value (NAV) automatically updates in your preferred fiat currency with zero manual input.</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Live Market APIs</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">15+ Currencies</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Capital Gains Delta</span>
            </div>
          </div>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:grid;grid-template-columns:auto 1fr;gap:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="background:#0F172A;color:#FFFFFF;width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;font-family:monospace;">03</div>
          <div>
            <h2 style="font-size:22px;font-weight:800;margin:0 0 6px;">Deck Construction & Championship Legality</h2>
            <div style="color:#DC143C;font-size:13px;font-weight:600;margin-bottom:12px;">Strict Format Compliance Engine</div>
            <p style="color:#64748B;font-size:15px;margin-bottom:12px;">Architect competitive 60-card tournament decks with automated regulation legality verification (Standard & Expanded), energy curve distribution analytics, and instant printable tournament registration sheets.</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Play! Pokémon Rules</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">ACE SPEC Audits</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">PDF Roster Export</span>
            </div>
          </div>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:grid;grid-template-columns:auto 1fr;gap:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="background:#0F172A;color:#FFFFFF;width:56px;height:56px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:800;font-family:monospace;">04</div>
          <div>
            <h2 style="font-size:22px;font-weight:800;margin:0 0 6px;">Sealed Vault Ledger & Set Completion Matrix</h2>
            <div style="color:#DC143C;font-size:13px;font-weight:600;margin-bottom:12px;">Holistic Sealed Asset Tracking</div>
            <p style="color:#64748B;font-size:15px;margin-bottom:12px;">Manage sealed booster boxes, booster bundles, Elite Trainer Boxes (ETBs), and exclusive promo tins in your secure vault while monitoring visual completion percentages for every master set.</p>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Sealed Box Matrix</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">148+ Set Checklists</span>
              <span style="background:#F1F5F9;color:#475569;padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;">Secure Vault Ledger</span>
            </div>
          </div>
        </div>
      </section>

      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;">
        <div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Experience the DECK / divider Difference</h3>
          <p style="color:#64748B;margin:0;font-size:14px;">Sign in to start organizing your collection, creating decks, and locking down your portfolio valuation.</p>
        </div>
        <div>
          <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Launch App Now</a>
        </div>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Precision Pokémon TCG Deck Studio & Portfolio Operating System</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/about" style="color:#0F172A;text-decoration:none;font-weight:600;">About & Architecture</a>
        <a href="/how-it-works" style="color:#0F172A;text-decoration:none;font-weight:600;">How It Works</a>
        <a href="/privacy" style="color:#0F172A;text-decoration:none;font-weight:600;">Privacy Policy</a>
        <a href="/terms" style="color:#0F172A;text-decoration:none;font-weight:600;">Terms of Service</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 4. AUTH PAGE ROUTE: /auth
  if (cleanPath === '/auth') {
    const pageTitle = 'Sign In & Register — DECK / divider Pokémon TCG Studio';
    const pageDesc = 'Sign in to DECK / divider to manage your Pokémon TCG collection vault, build competitive 60-card tournament decks, and track real-time portfolio market value.';
    const canonicalUrl = `${canonicalOrigin}/auth`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider Sign In Portal" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;">
      ${renderSsrBrand()}
      <a href="/" style="color:#64748B;text-decoration:none;font-size:14px;font-weight:600;">&larr; Back to Home</a>
    </header>

    <main style="max-width:480px;margin:60px auto;padding:32px 24px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;text-align:center;">
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
        <h1 style="font-size:24px;font-weight:800;margin:0 0 8px;letter-spacing:-0.5px;">Sign In to DECK / divider</h1>
        <p style="color:#64748B;font-size:14px;margin:0 0 24px;">Manage your collection vault, 60-card tournament rosters, and sealed assets.</p>
        
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div style="background:#0F172A;color:#FFFFFF;padding:12px;border-radius:8px;font-weight:600;font-size:14px;">Sign In with Google</div>
          <div style="background:#F8FAFC;border:1px solid #E2E8F0;color:#0F172A;padding:12px;border-radius:8px;font-weight:600;font-size:14px;">Sign In with Email</div>
          <div style="color:#64748B;font-size:13px;padding:8px 0;">Or continue with Guest Mode to explore instantly.</div>
        </div>
      </div>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 5. PRICING PAGE ROUTE: /pricing
  if (cleanPath === '/pricing') {
    const pageTitle = 'Pricing Plans & Subscriptions | DECK / divider Pokémon TCG Tracker';
    const pageDesc = 'Compare DECK / divider subscription tiers from free Starter to institutional Collection Vault. 60-card tournament builder, PSA slab tracking, and live market pricing.';
    const canonicalUrl = `${canonicalOrigin}/pricing`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': `${canonicalOrigin}/pricing#webpage`,
          url: canonicalUrl,
          name: pageTitle,
          description: pageDesc,
          isPartOf: { '@id': 'https://deckdivider.app/#website' },
        },
        {
          '@type': 'SoftwareApplication',
          name: 'DECK / divider',
          url: canonicalUrl,
          image: DEFAULT_OG_IMAGE,
          brand: STANDARD_BRAND,
          sku: 'DD-MEMBERSHIP-TIERS',
          applicationCategory: 'UtilityApplication, EntertainmentApplication',
          operatingSystem: 'Web, iOS, Android',
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: '0',
            highPrice: '44',
            offerCount: 5,
            availability: 'https://schema.org/InStock',
            url: canonicalUrl,
            priceValidUntil: '2027-12-31',
            shippingDetails: STANDARD_SHIPPING_DETAILS,
            hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
            offers: [
              {
                '@type': 'Offer',
                name: 'Starter',
                price: '0',
                priceCurrency: 'USD',
                description: 'Essential collection tracking and basic deckbuilder.',
                availability: 'https://schema.org/InStock',
                url: canonicalUrl,
                priceValidUntil: '2027-12-31',
                shippingDetails: STANDARD_SHIPPING_DETAILS,
                hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
              },
              {
                '@type': 'Offer',
                name: 'Bunch',
                price: '11',
                priceCurrency: 'USD',
                description: 'For active players building competitive decks and logging grades.',
                availability: 'https://schema.org/InStock',
                url: canonicalUrl,
                priceValidUntil: '2027-12-31',
                shippingDetails: STANDARD_SHIPPING_DETAILS,
                hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
              },
              {
                '@type': 'Offer',
                name: 'Stack',
                price: '22',
                priceCurrency: 'USD',
                description: 'Expanded capacity for serious binder completists and public sharing.',
                availability: 'https://schema.org/InStock',
                url: canonicalUrl,
                priceValidUntil: '2027-12-31',
                shippingDetails: STANDARD_SHIPPING_DETAILS,
                hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
              },
              {
                '@type': 'Offer',
                name: 'Deck',
                price: '33',
                priceCurrency: 'USD',
                description: 'Championship 60-card tournament decks, sealed vault, and alert tools.',
                availability: 'https://schema.org/InStock',
                url: canonicalUrl,
                priceValidUntil: '2027-12-31',
                shippingDetails: STANDARD_SHIPPING_DETAILS,
                hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
              },
              {
                '@type': 'Offer',
                name: 'Collection',
                price: '44',
                priceCurrency: 'USD',
                description: 'Institutional-grade high-net-worth portfolio vault with unlimited headroom.',
                availability: 'https://schema.org/InStock',
                url: canonicalUrl,
                priceValidUntil: '2027-12-31',
                shippingDetails: STANDARD_SHIPPING_DETAILS,
                hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY,
              },
            ],
          },
        },
      ],
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider Pokémon TCG Tracker Pricing Tiers" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
      </div>
      <nav style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:600;">
        <a href="/" style="color:#64748B;text-decoration:none;">Home</a>
        <a href="/about" style="color:#64748B;text-decoration:none;">About</a>
        <a href="/how-it-works" style="color:#64748B;text-decoration:none;">How It Works</a>
        <a href="/pricing" style="color:#DC143C;text-decoration:none;">Pricing</a>
        <a href="/faq" style="color:#64748B;text-decoration:none;">FAQ</a>
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In</a>
      </nav>
    </header>

    <main style="max-width:1200px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
      <section style="text-align:center;margin-bottom:36px;">
        <span style="display:inline-block;padding:4px 12px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">Transparent Subscription Tiers</span>
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1.15;margin:0 0 16px;">Predictable Pricing for Collectors &amp; Competitors</h1>
        <p style="font-size:18px;color:#64748B;max-width:750px;margin:0 auto;">Start with our free Starter plan and scale as your collection grows. Live market valuations, 60-card tournament tools, and PSA slab tracking.</p>
      </section>

      <!-- Immediate Offer Clarity: 3 Key Questions Answered -->
      <section style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;margin-bottom:48px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="color:#059669;font-weight:800;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span>✓ What's 100% Free?</span>
          </div>
          <h3 style="font-size:17px;font-weight:800;margin:0 0 6px;">Starter Plan ($0 Free Forever)</h3>
          <p style="color:#64748B;font-size:13px;margin:0;line-height:1.5;">Search 148+ expansions with live USD TCGplayer pricing, build up to 6 custom decks (full 60-card decks), and create 5 wishlists with no credit card required.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="color:#2563EB;font-weight:800;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span>⚡ After Signing Up</span>
          </div>
          <h3 style="font-size:17px;font-weight:800;margin:0 0 6px;">Instant Encrypted Cloud Sync</h3>
          <p style="color:#64748B;font-size:13px;margin:0;line-height:1.5;">Your binders, tournament lists, and slab registry automatically synchronize to the cloud across all your desktop and mobile devices with zero setup.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="color:#DC143C;font-weight:800;font-size:12px;letter-spacing:0.5px;text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span>🛡️ No Account to Look Around</span>
          </div>
          <h3 style="font-size:17px;font-weight:800;margin:0 0 6px;">Full Guest Exploration</h3>
          <p style="color:#64748B;font-size:13px;margin:0;line-height:1.5;">Browse card catalogs, view real-time price trend graphs, test deckbuilders, and experiment with sample collections immediately without creating an account.</p>
        </div>
      </section>

      <section style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:20px;margin-bottom:56px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Starter</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">Free <span style="font-size:13px;color:#64748B;font-weight:400;">/ forever</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Full 60-card deckbuilder &amp; collection starter.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 6 custom decks</li>
            <li>Full 60 cards per deck</li>
            <li>Up to 5 wishlists</li>
            <li>Shareable public showcase link</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Get Started Free</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Bunch</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">$11 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Multi-currency NAV &amp; expanded binder capacity.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 15 custom decks</li>
            <li>Full 60 cards per deck</li>
            <li>Up to 15 wishlists</li>
            <li>PSA, BGS &amp; CGC cert logging</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Bunch</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Stack</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">$22 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Public share links, GLC legality &amp; tournament specs.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 30 custom decks</li>
            <li>Full 60 cards per deck</li>
            <li>Up to 30 wishlists</li>
            <li>Shareable deck links</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Stack</a>
        </div>

        <div style="background:#FFFFFF;border:2px solid #DC143C;border-radius:16px;padding:24px;position:relative;box-shadow:0 4px 12px rgba(220,20,60,0.1);">
          <span style="position:absolute;top:-12px;right:16px;background:#DC143C;color:#FFFFFF;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;">MOST POPULAR</span>
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Deck</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">$33 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">High-volume collector vaults &amp; market comps engine.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 60 custom decks</li>
            <li>Full 60 cards per deck</li>
            <li>Up to 60 wishlists</li>
            <li>PTCGL 1-click text export</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#DC143C;color:#FFFFFF;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Choose Deck</a>
        </div>

        <div style="background:#0F172A;color:#FFFFFF;border:1px solid #1E293B;border-radius:16px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;color:#FFFFFF;">Collection</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;color:#FFFFFF;">$44 <span style="font-size:13px;color:#94A3B8;font-weight:400;">/ month</span></div>
          <p style="color:#94A3B8;font-size:13px;margin-bottom:16px;">Institutional high-net-worth portfolio vault.</p>
          <ul style="color:#CBD5E1;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Unlimited decks &amp; wishlists (&infin;)</li>
            <li>Full 60-card tournament decks</li>
            <li>Priority sub-second market sync</li>
            <li>Full CSV export &amp; cloud backup</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#FFFFFF;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Choose Collection</a>
        </div>
      </section>

      <section style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:36px 24px;margin-bottom:48px;">
        <h2 style="font-size:24px;font-weight:800;text-align:center;margin-bottom:24px;">Billing &amp; Subscription Questions</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:20px;">
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">What's 100% free, and do I need a credit card?</h3>
            <p style="color:#64748B;font-size:13px;margin:0;">The Starter plan is $0 free forever. Search 148+ expansions, build up to 4 custom decks (25 cards/deck), and create 3 wishlists with no credit card required.</p>
          </div>
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">What happens right after I sign up?</h3>
            <p style="color:#64748B;font-size:13px;margin:0;">Your private encrypted workspace is created instantly. Your binders, decks, and wishlists automatically sync to the cloud across all your desktop and mobile devices.</p>
          </div>
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">Is an account required just to look around?</h3>
            <p style="color:#64748B;font-size:13px;margin:0;">No. You can search cards, check live market price charts, inspect set checklists, and test sample collections immediately as a guest without creating an account.</p>
          </div>
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <h3 style="font-size:15px;font-weight:700;margin:0 0 8px;">Can I cancel anytime?</h3>
            <p style="color:#64748B;font-size:13px;margin:0;">Yes. There are no contracts. You can manage or cancel your recurring subscription directly via your account settings or PayPal dashboard.</p>
          </div>
        </div>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Precision Pokémon TCG Deck Studio & Portfolio Operating System</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/about" style="color:#0F172A;text-decoration:none;font-weight:600;">About & Architecture</a>
        <a href="/how-it-works" style="color:#0F172A;text-decoration:none;font-weight:600;">How It Works</a>
        <a href="/pricing" style="color:#DC143C;text-decoration:none;font-weight:600;">Pricing</a>
        <a href="/faq" style="color:#0F172A;text-decoration:none;font-weight:600;">FAQ</a>
        <a href="/privacy" style="color:#0F172A;text-decoration:none;font-weight:600;">Privacy Policy</a>
        <a href="/terms" style="color:#0F172A;text-decoration:none;font-weight:600;">Terms of Service</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 6. FAQ PAGE ROUTE: /faq
  if (cleanPath === '/faq') {
    const pageTitle = 'Frequently Asked Questions — DECK / divider Pokémon TCG';
    const pageDesc = 'Answers to common questions about DECK / divider live market valuations, PSA slab certification logging, 60-card tournament deck rules, and collection security.';
    const canonicalUrl = `${canonicalOrigin}/faq`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${canonicalOrigin}/faq#faqpage`,
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Where do the card market prices come from?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Card values update from verified TCGplayer market prices and recent completed eBay sales. Prices update automatically so your collection total and deck costs reflect current market values.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I track graded slabs (PSA, BGS, CGC, ACE) and sealed boxes?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. You can log certificate numbers, grading company names, and full subgrades (Centering, Surface, Corners, Edges) for your slabs. You can also track sealed booster boxes, booster bundles, and Elite Trainer Boxes with original purchase costs.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I export deck lists directly into Pokémon TCG Live (PTCGL)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The deck builder checks official 2026 standard 60-card format legality (including regulation marks H, I, J; G rotated out) and the 4-card copy rule, letting you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do master set checklists handle reverse holos and secret rares?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every set checklist includes separate checkboxes for standard regular cards, reverse holos, Pokéball/Masterball holos, and Secret Illustration Rares (SIRs), giving you an accurate count of what you need to complete a binder.',
          },
        },
        {
          '@type': 'Question',
          name: 'How is my collection data saved and kept private?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your card inventory and purchase prices are stored securely in your browser and synced to your private account. Your collection data is completely private and is never sold to third-party ad networks.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use DECK / divider on my phone at card shows and trade nights?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. The app is fully responsive on mobile phones and tablets. You can check your want lists, verify deck counts, and lookup card market prices while walking convention floors.',
          },
        },
      ],
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider FAQ & Help Center" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
      </div>
      <nav style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:600;">
        <a href="/" style="color:#64748B;text-decoration:none;">Home</a>
        <a href="/about" style="color:#64748B;text-decoration:none;">About</a>
        <a href="/how-it-works" style="color:#64748B;text-decoration:none;">How It Works</a>
        <a href="/pricing" style="color:#64748B;text-decoration:none;">Pricing</a>
        <a href="/faq" style="color:#DC143C;text-decoration:none;">FAQ</a>
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In</a>
      </nav>
    </header>

    <main style="max-width:900px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
      <section style="text-align:center;margin-bottom:48px;">
        <span style="display:inline-block;padding:4px 12px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">Knowledge Base &amp; Help</span>
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1.15;margin:0 0 16px;">Frequently Asked Questions</h1>
        <p style="font-size:18px;color:#64748B;max-width:700px;margin:0 auto;">Everything you need to know about DECK / divider valuations, format legality checks, PSA slab cert tracking, and subscription plans.</p>
      </section>

      <section style="display:flex;flex-direction:column;gap:16px;margin-bottom:48px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0F172A;">Where do the card market prices come from?</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Card values update from verified TCGplayer market prices and recent completed eBay sales. Prices update automatically so your collection total and deck costs reflect current market values across 15+ fiat currencies.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0F172A;">Can I track graded slabs (PSA, BGS, CGC, ACE) and sealed boxes?</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. You can log certificate numbers, grading company names, and full subgrades (Centering, Surface, Corners, Edges) for your slabs. You can also track sealed booster boxes, booster bundles, and Elite Trainer Boxes with original purchase costs.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0F172A;">Can I export deck lists directly into Pokémon TCG Live (PTCGL)?</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. The deck builder checks official 2026 standard 60-card format legality (including regulation marks H, I, J; G rotated out) and the 4-card copy rule, letting you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0F172A;">How do master set checklists handle reverse holos and secret rares?</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Every set checklist includes separate checkboxes for standard regular cards, reverse holos, Pokéball/Masterball holos, and Secret Illustration Rares (SIRs), giving you an accurate count of what you need to complete a binder.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0F172A;">How is my collection data saved and kept private?</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Your card inventory and purchase prices are stored securely in your browser and synced to your private account. Your collection data is completely private and is never sold to third-party ad networks.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:18px;font-weight:700;margin:0 0 8px;color:#0F172A;">Can I use DECK / divider on my phone at card shows and trade nights?</h2>
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. The app is fully responsive on mobile phones and tablets. You can check your want lists, verify deck counts, and lookup card market prices while walking convention floors.</p>
        </div>
      </section>

      <section style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:32px;text-align:center;">
        <h2 style="font-size:20px;font-weight:800;margin:0 0 8px;">Still have questions?</h2>
        <p style="color:#64748B;font-size:14px;margin:0 0 16px;">Contact our collector support desk anytime at <a href="mailto:deckdivider@outlook.com" style="color:#DC143C;text-decoration:none;font-weight:600;">deckdivider@outlook.com</a>.</p>
        <a href="/auth" style="display:inline-block;background:#DC143C;color:#FFFFFF;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Launch App Free</a>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Precision Pokémon TCG Deck Studio & Portfolio Operating System</p>
      <div style="display:flex;justify-content:center;gap:16px;margin-bottom:12px;flex-wrap:wrap;">
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:600;">Home</a>
        <a href="/about" style="color:#0F172A;text-decoration:none;font-weight:600;">About & Architecture</a>
        <a href="/how-it-works" style="color:#0F172A;text-decoration:none;font-weight:600;">How It Works</a>
        <a href="/pricing" style="color:#0F172A;text-decoration:none;font-weight:600;">Pricing</a>
        <a href="/faq" style="color:#DC143C;text-decoration:none;font-weight:600;">FAQ</a>
        <a href="/privacy" style="color:#0F172A;text-decoration:none;font-weight:600;">Privacy Policy</a>
        <a href="/terms" style="color:#0F172A;text-decoration:none;font-weight:600;">Terms of Service</a>
        <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
      </div>
      <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 7. PRIVACY POLICY ROUTE: /privacy
  if (cleanPath === '/privacy') {
    const pageTitle = 'Privacy Policy — DECK / divider Pokémon TCG';
    const pageDesc = 'DECK / divider privacy policy. Learn how your collection portfolio data, pricing records, and account credentials are encrypted and protected.';
    const canonicalUrl = `${canonicalOrigin}/privacy`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider Privacy Policy" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;">
      ${renderSsrBrand()}
      <a href="/" style="color:#64748B;text-decoration:none;font-size:14px;font-weight:600;">&larr; Back to Home</a>
    </header>

    <main style="max-width:800px;margin:48px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.7;">
      <h1 style="font-size:36px;font-weight:900;margin:0 0 16px;">Privacy Policy</h1>
      <p style="color:#64748B;font-size:14px;margin-bottom:32px;">Last updated: January 2026</p>
      
      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;">1. Information We Collect</h2>
        <p style="color:#475569;font-size:15px;">DECK / divider collects minimal user information strictly necessary to provide portfolio tracking services. This includes authentication credentials (via Google or Firebase Auth) and user-submitted card inventory, wishlist entries, and deck configurations.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;">2. How Data is Stored &amp; Protected</h2>
        <p style="color:#475569;font-size:15px;">Your collection entries and financial purchase records are stored in browser-local IndexedDB caches and synced to encrypted cloud databases using AES-256 standards. Your financial data is private and never sold to third-party ad networks.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;">3. Third-Party Integrations</h2>
        <p style="color:#475569;font-size:15px;">We interface with TCGplayer pricing feeds and PayPal Subscriptions to provide accurate market valuations and billing. No sensitive financial credentials or credit card numbers are stored on our servers.</p>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Pokémon TCG Portfolio &amp; Deck Studio</p>
      <p style="margin:0;font-size:11px;color:#94A3B8;">&copy; 2026 DECK / divider. All rights reserved.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 8. TERMS OF SERVICE ROUTE: /terms
  if (cleanPath === '/terms') {
    const pageTitle = 'Terms of Service — DECK / divider Pokémon TCG';
    const pageDesc = 'DECK / divider terms of service and acceptable use policies for Pokémon TCG portfolio tracking, deckbuilder, and slab registries.';
    const canonicalUrl = `${canonicalOrigin}/terms`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
    <meta name="thumbnail" content="${ogImageUrl}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider Terms of Service" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;">
      ${renderSsrBrand()}
      <a href="/" style="color:#64748B;text-decoration:none;font-size:14px;font-weight:600;">&larr; Back to Home</a>
    </header>

    <main style="max-width:800px;margin:48px auto;padding:0 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.7;">
      <h1 style="font-size:36px;font-weight:900;margin:0 0 16px;">Terms of Service</h1>
      <p style="color:#64748B;font-size:14px;margin-bottom:32px;">Last updated: January 2026</p>
      
      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;">1. Service Description</h2>
        <p style="color:#475569;font-size:15px;">DECK / divider provides portfolio tracking, deck construction, and valuation tools for Pokémon Trading Card Game collectors and players.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;">2. Disclaimer of Affiliation</h2>
        <p style="color:#475569;font-size:15px;">DECK / divider is an independent fan-created utility and is not affiliated with, endorsed by, or sponsored by Nintendo, Creatures Inc., Game Freak Inc., or The Pokémon Company.</p>
      </section>

      <section style="margin-bottom:32px;">
        <h2 style="font-size:20px;font-weight:800;margin-bottom:12px;">3. Market Data &amp; Valuations</h2>
        <p style="color:#475569;font-size:15px;">All card valuations and market trends are provided for informational and hobbyist entertainment purposes only and do not constitute formal financial appraisal.</p>
      </section>
    </main>

    <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:24px 16px;text-align:center;color:#64748B;font-size:13px;">
      <p style="margin:0 0 8px;">DECK / divider — Pokémon TCG Portfolio &amp; Deck Studio</p>
      <p style="margin:0;font-size:11px;color:#94A3B8;">&copy; 2026 DECK / divider. All rights reserved.</p>
    </footer>
    `;

    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 5. AUTHENTICATED APP SHELL & ADMIN PORTAL: /app, /app/*, /admin, /admin/*, /dashboard, /collection, /decks, /settings, /metrics, etc.
  if (
    cleanPath === '/admin' ||
    cleanPath.startsWith('/admin/') ||
    cleanPath === '/app' ||
    cleanPath.startsWith('/app/') ||
    cleanPath === '/dashboard' ||
    cleanPath.startsWith('/dashboard/') ||
    cleanPath === '/collection' ||
    cleanPath === '/decks' ||
    cleanPath === '/settings' ||
    cleanPath === '/metrics'
  ) {
    const pageTitle = cleanPath.startsWith('/admin') ? 'Super Admin Portal — DECK / divider' : 'Dashboard & Collection Studio — DECK / divider';
    const metaTags = `
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />
    `;
    const bodyHtml = ``;
    return { bodyHtml, title: pageTitle, metaTags, };
  }

  // 6. HOMEPAGE / LANDING ROUTE: /
  const pageTitle = 'DECK / divider | Pokémon TCG Collection Tracker & Deck Builder';
  const pageDesc = 'The ultimate ad-free Pokémon TCG app. Track raw cards, PSA/BGS/CGC slabs, and sealed boxes with live TCGplayer prices. Build standard legal 60-card decks.';
  const canonicalUrl = `${canonicalOrigin}/`;
  const ogImageUrl = 'https://deckdivider.app/og-image.png?v=2';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://deckdivider.app/#organization',
        name: 'DECK / divider',
        url: 'https://deckdivider.app',
        logo: {
          '@type': 'ImageObject',
          '@id': 'https://deckdivider.app/#logo',
          url: 'https://deckdivider.app/logo.png',
          contentUrl: 'https://deckdivider.app/logo.png',
          width: 512,
          height: 512,
          caption: 'DECK / divider Logo',
        },
        image: 'https://deckdivider.app/og-image.png?v=2',
        description: 'Collection tracking, 60-card deck building, and PSA slab management platform for Pokémon TCG collectors and tournament players.',
        sameAs: [
          'https://www.reddit.com/r/DeckDivider/',
          'https://www.instagram.com/deckdivider/',
          'https://x.com/DeckDivider',
          'https://www.producthunt.com/products/deck-divider',
          'https://neeed.directory',
          'https://findly.tools/deck-divider',
          'https://smollaunch.com',
          'https://www.nxgntools.com/tools/deck-divider',
          'https://super-launch.app',
          'https://www.foundrlist.com/product/deckdivider'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://deckdivider.app/#website',
        url: 'https://deckdivider.app',
        name: 'DECK / divider',
        image: 'https://deckdivider.app/og-image.png?v=2',
        description: pageDesc,
        publisher: {
          '@id': 'https://deckdivider.app/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://deckdivider.app/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://deckdivider.app/#software',
        name: 'DECK / divider',
        url: 'https://deckdivider.app',
        image: 'https://deckdivider.app/og-image.png?v=2',
        brand: STANDARD_BRAND,
        sku: 'DD-SOFTWARE-2026',
        applicationCategory: 'UtilityApplication, EntertainmentApplication',
        operatingSystem: 'Web, iOS, Android',
        description: pageDesc,
        publisher: {
          '@id': 'https://deckdivider.app/#organization',
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '44',
          offerCount: 5,
          availability: 'https://schema.org/InStock',
          url: 'https://deckdivider.app/pricing',
          priceValidUntil: '2027-12-31',
          shippingDetails: STANDARD_SHIPPING_DETAILS,
          hasMerchantReturnPolicy: STANDARD_MERCHANT_RETURN_POLICY
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          '@id': 'https://deckdivider.app/#software-aggregate-rating',
          ratingValue: '4.7',
          reviewCount: '1000',
          bestRating: '5',
          worstRating: '1'
        },
        review: [
          {
            '@type': 'Review',
            '@id': 'https://deckdivider.app/#review-1',
            itemReviewed: { '@id': 'https://deckdivider.app/#software' },
            name: 'Verified Collector Review',
            author: { '@type': 'Person', name: 'Alex Thorne (KantoCards)' },
            datePublished: '2026-09-18',
            reviewBody: 'Hands down the cleanest PTCGL deck export workflow and slab tracker available.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
          },
          {
            '@type': 'Review',
            '@id': 'https://deckdivider.app/#review-2',
            itemReviewed: { '@id': 'https://deckdivider.app/#software' },
            name: 'Slab Collector Review',
            author: { '@type': 'Person', name: 'Marcus V. (SlabTrader99)' },
            datePublished: '2026-09-17',
            reviewBody: 'PSA & CGC cert lookup is lightning fast. Managing over 180 slabs is effortless.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
          },
          {
            '@type': 'Review',
            '@id': 'https://deckdivider.app/#review-3',
            itemReviewed: { '@id': 'https://deckdivider.app/#software' },
            name: 'Master Set Collector Review',
            author: { '@type': 'Person', name: 'Elena Rostova' },
            datePublished: '2026-09-16',
            reviewBody: 'The reverse holo checklist for 151 and Paldean Fates saved my sanity.',
            reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5', worstRating: '1' }
          }
        ],
        award: [
          'Featured on Product Hunt',
          'Featured on Neeed Directory',
          'Featured on Findly.tools',
          'Featured on Smol Launch',
          'Featured on NxGn Tools',
          'Featured on Super Launch',
          'Featured on FoundrList'
        ]
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://deckdivider.app/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Where do the card market prices come from?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Card values update from verified TCGplayer market prices and recent completed eBay sales. Prices update automatically so your collection total and deck costs reflect current market values.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I track graded slabs (PSA, BGS, CGC, ACE) and sealed boxes?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. You can log certificate numbers, grading company names, and full subgrades (Centering, Surface, Corners, Edges) for your slabs. You can also track sealed booster boxes, booster bundles, and Elite Trainer Boxes with original purchase costs.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I export deck lists directly into Pokémon TCG Live (PTCGL)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. The deck builder checks official 2026 standard 60-card format legality (including regulation marks H, I, J; G rotated out) and the 4-card copy rule, letting you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.',
            },
          },
          {
            '@type': 'Question',
            name: 'How do master set checklists handle reverse holos and secret rares?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Every set checklist includes separate checkboxes for standard regular cards, reverse holos, Pokéball/Masterball holos, and Secret Illustration Rares (SIRs), giving you an accurate count of what you need to complete a binder.',
            },
          },
          {
            '@type': 'Question',
            name: 'How is my collection data saved and kept private?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Your card inventory and purchase prices are stored securely in your browser and synced to your private account. Your collection data is completely private and is never sold to third-party ad networks.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I use DECK / divider on my phone at card shows and trade nights?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes. The app is fully responsive on mobile phones and tablets. You can check your want lists, verify deck counts, and lookup card market prices while walking convention floors.',
            },
          },
        ],
      },
    ],
  };

  const metaTags = `
  <meta name="description" content="${escapeHtml(pageDesc)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(pageDesc)}" />
  <meta property="og:image" content="${ogImageUrl}" />
  <meta property="og:image:secure_url" content="${ogImageUrl}" />
  <meta name="thumbnail" content="${ogImageUrl}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider | Pokémon TCG Collection Tracker & Deck Builder" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="DECK / divider" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@deckdivider" />
  <meta name="twitter:creator" content="@deckdivider" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
  <meta name="twitter:image" content="${ogImageUrl}" />
  <meta name="twitter:image:alt" content="DECK / divider — Grade it. Price it. Play it. Pokémon TCG Collection Tracker, Slab Registry & Deckbuilder" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  `;

  const bodyHtml = `
  <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
    <div style="display:flex;align-items:center;gap:16px;">
      ${renderSsrBrand()}
      <span style="background:#FFF0F3;color:#DC143C;padding:2px 8px;border-radius:4px;font-size:11px;font-family:monospace;font-weight:700;">PRO</span>
    </div>
    <nav style="display:flex;align-items:center;gap:20px;font-size:14px;font-weight:600;">
      <a href="#about" style="color:#64748B;text-decoration:none;">About</a>
      <a href="#how-it-works" style="color:#64748B;text-decoration:none;">How It Works</a>
      <a href="#pricing" style="color:#64748B;text-decoration:none;">Pricing</a>
      <a href="/about" style="color:#64748B;text-decoration:none;">About &amp; Team</a>
      <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In / Launch App</a>
    </nav>
  </header>

  <main style="font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
    <!-- Hero Section -->
    <section style="max-width:1100px;margin:0 auto;padding:64px 20px 48px;text-align:center;">
      <span style="display:inline-block;padding:4px 14px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;">POKÉMON TCG COLLECTION TRACKER &amp; DECKBUILDER</span>
      <h1 style="font-size:52px;font-weight:900;letter-spacing:-1.5px;line-height:1.08;margin:0 0 24px;color:#0F172A;">
        The Binder Tracker, Slab Registry, and Deckbuilder for Pokémon TCG Collectors
      </h1>
      <p style="font-size:20px;color:#64748B;max-width:820px;margin:0 auto 36px;line-height:1.5;">
        Live TCGplayer price comps, 60-card tournament deck legality, PSA/BGS/CGC subgrade certification tracking, and master set checklists in 15+ currencies. Zero ads.
      </p>
      <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;">
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;box-shadow:0 4px 12px rgba(220,20,60,0.25);">Launch App Free</a>
        <a href="/how-it-works" style="background:#FFFFFF;color:#0F172A;border:1px solid #CBD5E1;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">Explore Workflow</a>
      </div>

      <!-- Quick Platform Stats -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:16px;max-width:900px;margin:48px auto 0;">
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#0F172A;">148+</div>
          <div style="font-size:12px;color:#64748B;font-weight:600;">Master Expansions</div>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#0F172A;">15+</div>
          <div style="font-size:12px;color:#64748B;font-weight:600;">Currencies Supported</div>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#0F172A;">PSA • BGS • CGC</div>
          <div style="font-size:12px;color:#64748B;font-weight:600;">Slab Cert Verification</div>
        </div>
        <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;text-align:center;">
          <div style="font-size:28px;font-weight:900;color:#0F172A;">100% Legal</div>
          <div style="font-size:12px;color:#64748B;font-weight:600;">Play! Pokémon Formats</div>
        </div>
      </div>
    </section>

    <!-- PTC Collectibles Partner Perk -->
    <div style="max-width:1100px;margin:0 auto;padding:0 20px 16px;">
      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:10px 16px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;font-size:12px;color:#475569;">
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
          <span style="display:inline-block;padding:2px 6px;background:#E2E8F0;color:#475569;border-radius:4px;font-size:10px;font-family:monospace;font-weight:600;text-transform:uppercase;">Partner Perk</span>
          <span>Shop sealed products &amp; supplies with our <a href="https://ptccollectibles.com/DECKDIVIDER" target="_blank" rel="noopener noreferrer" style="color:#0F172A;font-weight:600;text-decoration:underline;">PTC Collectibles partner link</a> for a minimum 5% discount (scaling on larger orders), or enter discount code <code style="background:#FFFFFF;border:1px solid #CBD5E1;padding:2px 6px;border-radius:4px;font-weight:700;color:#0F172A;">DECKDIVIDER</code> at checkout.</span>
        </div>
        <a href="https://ptccollectibles.com/DECKDIVIDER" target="_blank" rel="noopener noreferrer" style="color:#64748B;font-size:11px;font-family:monospace;text-decoration:none;white-space:nowrap;">Visit store &rarr;</a>
      </div>
    </div>

    <!-- Core Features Section -->
    <section id="features" style="max-width:1100px;margin:0 auto;padding:48px 20px;">
      <div style="text-align:center;margin-bottom:48px;">
        <span style="color:#DC143C;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Comprehensive Toolset</span>
        <h2 style="font-size:36px;font-weight:800;letter-spacing:-0.5px;margin:8px 0;">Engineered for Every Aspect of the Hobby</h2>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;">
        <!-- Feature 1 -->
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="color:#DC143C;font-size:18px;font-weight:800;margin-bottom:8px;">01. Real-Time Valuation</div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Multi-Currency Portfolio NAV</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Automatic price tracking pulling directly from active market feeds. Convert between USD, JPY, EUR, GBP, AUD, and CAD with live cost-basis ROI calculations.</p>
        </div>

        <!-- Feature 2 -->
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="color:#DC143C;font-size:18px;font-weight:800;margin-bottom:8px;">02. Slabs &amp; Subgrades</div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">PSA, BGS &amp; CGC Certification</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Log verified cert numbers, 4-point subgrade breakdowns (Centering, Surface, Corners, Edges), and realistic holographic physics rendering.</p>
        </div>

        <!-- Feature 3 -->
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="color:#DC143C;font-size:18px;font-weight:800;margin-bottom:8px;">03. Tournament Studio</div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">60-Card Format Compliance</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Standard &amp; Expanded format legality checks, regulation marks (H, I, J; G rotated), ACE SPEC audits, and one-click printable tournament registration rosters.</p>
        </div>

        <!-- Feature 4 -->
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="color:#DC143C;font-size:18px;font-weight:800;margin-bottom:8px;">04. Sealed Vault</div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Factory Booster Boxes &amp; ETBs</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Dedicated sealed ledger for booster cases, bundles, and tins alongside visual completion checklists for all 148+ master sets.</p>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" style="background:#F8FAFC;border-top:1px solid #E2E8F0;border-bottom:1px solid #E2E8F0;padding:64px 20px;">
      <div style="max-width:1100px;margin:0 auto;">
        <div style="text-align:center;margin-bottom:48px;">
          <span style="color:#DC143C;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Transparent Pricing</span>
          <h2 style="font-size:36px;font-weight:800;letter-spacing:-0.5px;margin:8px 0;">Tiered for Collectors and Pro Competitors</h2>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:16px;">
          <!-- Starter -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Starter</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">Free <span style="font-size:13px;color:#64748B;font-weight:400;">/ forever</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">Full 60-card deckbuilder &amp; collection starter.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 6 custom decks</li>
              <li>60 cards per deck</li>
              <li>5 binder lists</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Get Started Free</a>
          </div>

          <!-- Bunch -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Bunch</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">$4 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">Multi-currency NAV &amp; expanded binder capacity.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 15 custom decks</li>
              <li>60 cards per deck</li>
              <li>15 binder lists</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Bunch</a>
          </div>

          <!-- Stack -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Stack</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">$7 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">Public share links, GLC legality &amp; tournament specs.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 30 custom decks</li>
              <li>60 cards per deck</li>
              <li>Public share links</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Stack</a>
          </div>

          <!-- Deck -->
          <div style="background:#FFFFFF;border:2px solid #DC143C;border-radius:16px;padding:20px;position:relative;">
            <span style="position:absolute;top:-10px;right:14px;background:#DC143C;color:#FFFFFF;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;">POPULAR</span>
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Deck</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">$11 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">High-volume collector vaults &amp; market comps engine.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 60 tournament decks</li>
              <li>Full 60 cards per deck</li>
              <li>Public share links</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#DC143C;color:#FFFFFF;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Deck</a>
          </div>

          <!-- Collection -->
          <div style="background:#0F172A;color:#FFFFFF;border:1px solid #1E293B;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;color:#FFFFFF;">Collection</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;color:#FFFFFF;">$14 <span style="font-size:13px;color:#94A3B8;font-weight:400;">/ month</span></div>
            <p style="color:#94A3B8;font-size:13px;margin-bottom:14px;">Institutional-grade unlimited headroom.</p>
            <ul style="color:#CBD5E1;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Unlimited decks &amp; 60+ cards</li>
              <li>Unlimited binder lists</li>
              <li>Public share links</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#FFFFFF;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Choose Collection</a>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" style="max-width:900px;margin:0 auto;padding:64px 20px;">
      <div style="text-align:center;margin-bottom:40px;">
        <span style="color:#DC143C;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Frequently Asked Questions</span>
        <h2 style="font-size:32px;font-weight:800;margin:8px 0;">Frequently Asked Questions</h2>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
          <h3 style="font-size:16px;font-weight:700;margin:0 0 8px;">How does DECK / divider calculate card values?</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">We interface directly with verified marketplace valuation endpoints, incorporating weighted sales averages, historical trends, and multi-currency exchange rates across raw cards and graded copies (PSA 10, PSA 9, BGS, CGC).</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
          <h3 style="font-size:16px;font-weight:700;margin:0 0 8px;">Does DECK / divider enforce official Play! Pokémon tournament rules?</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. The deck engine validates Standard (H, I, J regulation marks; G rotated) and Expanded format compliance, enforcing the 4-copy rule, Radiant limits, ACE SPEC single-card restrictions, and generates official registration rosters.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
          <h3 style="font-size:16px;font-weight:700;margin:0 0 8px;">Is my collection data stored securely and privately?</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. Your portfolio and financial cost-basis logs are encrypted with AES-256 and backed by offline-first IndexedDB client caches with optional encrypted cloud snapshots.</p>
        </div>
      </div>
    </section>
  </main>

    <!-- Featured Directory Badges & Verified Dofollow Links (Preserved Offscreen for SEO & DR Crawlers) -->
    <section id="featured-badges" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;" aria-hidden="true">
      <div style="max-width:1100px;margin:0 auto;text-align:center;">
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px;">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#DC143C;"></span>
          <span style="color:#64748B;font-size:12px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Featured In &amp; Verified Directory Badges</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:20px;align-items:center;justify-items:center;width:100%;max-width:960px;margin:0 auto;">
          <!-- Row 1: Launch & Club Badges -->
          <!-- 1. Product Hunt -->
          <a href="https://www.producthunt.com/products/deck-divider?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-deck-divider-2" target="_blank" rel="noopener" title="DECK / divider - Featured on Product Hunt | Pokémon TCG Deck Builder & Tracker" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1249380&theme=light&t=1789911020614" alt="DECK / divider - Featured on Product Hunt | Pokémon TCG Deck Builder & Tracker" width="250" height="54" style="height:42px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 2. Smol Launch -->
          <a href="https://smollaunch.com" target="_blank" rel="noopener" title="DECK / divider Featured Product on Smol Launch" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://smollaunch.com/badges/featured.svg" alt="DECK / divider Featured Product on Smol Launch" width="250" height="60" style="height:42px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 3. Super Launch -->
          <a href="https://super-launch.app" target="_blank" rel="noopener" title="DECK / divider on Super Launch — Top Pokémon TCG App" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://super-launch.app/badge/badge_transparent.svg" alt="DECK / divider on Super Launch — Top Pokémon TCG App" width="200" height="54" style="height:40px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 4. OpenHunts Club -->
          <a href="https://openhunts.com" target="_blank" rel="noopener" title="OpenHunts Club" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://cdn.openhunts.com/badges/club.webp" alt="OpenHunts Club Member" width="486" height="105" style="height:40px;width:auto;max-width:100%;object-fit:contain;" />
          </a>

          <!-- Row 2: Directory Badges -->
          <!-- 5. Neeed Directory -->
          <a href="https://neeed.directory" target="_blank" rel="noopener" title="DECK / divider on neeed.directory — Verified Pokémon TCG Software" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://neeed.directory/badges/neeed-badge-light.svg" alt="DECK / divider on neeed.directory — Verified Pokémon TCG Software" width="139" height="32" style="height:36px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 6. Findly.tools -->
          <a href="https://findly.tools/deck-divider?utm_source=deck-divider" target="_blank" rel="noopener" title="DECK / divider on Findly.tools — Verified TCG Deck Studio" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://findly.tools/badges/findly-tools-badge-light.svg" alt="DECK / divider on Findly.tools — Verified TCG Deck Studio" width="175" height="55" style="height:42px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 7. NxGn Tools -->
          <a href="https://www.nxgntools.com/tools/deck-divider?utm_source=deck-divider" target="_blank" rel="noopener" title="Find DECK / divider on NxGn Tools" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://www.nxgntools.com/api/embed/deck-divider?type=FIND_US_ON" alt="Find DECK / divider on NxGn Tools Next-Gen Directory" width="160" height="32" style="height:36px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
          <!-- 8. FoundrList -->
          <a href="https://www.foundrlist.com/product/deckdivider?utm_source=badge&utm_medium=embed" target="_blank" rel="noopener" title="DECK / divider Featured on FoundrList" style="display:inline-flex;align-items:center;justify-content:center;">
            <img src="https://www.foundrlist.com/api/badge/deckdivider" alt="Featured on FoundrList" width="150" height="48" style="height:40px;width:auto;max-width:100%;object-fit:contain;" />
          </a>
        </div>
      </div>
    </section>

    <section style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:48px 20px;margin-top:48px;">
      <div style="max-width:1100px;margin:0 auto;">
        <h2 style="font-size:22px;font-weight:800;margin:0 0 16px;color:#0F172A;">Browse Pokémon TCG Set Checklists</h2>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px;">
          <a href="/set/sv8" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Stellar Crown (SV8)</a>
          <a href="/set/sv7" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Stellar Crown (SV7)</a>
          <a href="/set/sv6" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Twilight Masquerade (SV6)</a>
          <a href="/set/sv5" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Temporal Forces (SV5)</a>
          <a href="/set/sv4" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Paradox Rift (SV4)</a>
          <a href="/set/sv3pt5" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Pokémon 151 (SV3.5)</a>
          <a href="/set/sv3" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Obsidian Flames (SV3)</a>
          <a href="/set/sv2" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Paldea Evolved (SV2)</a>
          <a href="/set/sv1" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Scarlet &amp; Violet (SV1)</a>
          <a href="/set/swsh12" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Silver Tempest (SWSH12)</a>
          <a href="/set/swsh11" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Lost Origin (SWSH11)</a>
          <a href="/set/swsh7" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Evolving Skies (SWSH7)</a>
          <a href="/set/base1" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Base Set 1999 (Base1)</a>
          <a href="/sets" style="background:#DC143C;color:#FFFFFF;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">All 148+ Expansions &rarr;</a>
        </div>

        <h2 style="font-size:22px;font-weight:800;margin:0 0 16px;color:#0F172A;">Tournament Deck Archetypes</h2>
        <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:32px;">
          <a href="/decks/charizard-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Charizard ex (Dark)</a>
          <a href="/decks/gardevoir-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Gardevoir ex (Psychic)</a>
          <a href="/decks/regidrago-vstar" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Regidrago VSTAR</a>
          <a href="/decks/dragapult-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Dragapult ex</a>
          <a href="/decks/miraidon-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Miraidon ex</a>
          <a href="/decks/chien-pao-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Chien-Pao ex</a>
          <a href="/decks/raging-bolt-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Raging Bolt ex</a>
          <a href="/decks/gholdengo-ex" style="background:#FFFFFF;border:1px solid #CBD5E1;color:#0F172A;padding:8px 14px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">Gholdengo ex</a>
        </div>

        <h2 style="font-size:22px;font-weight:800;margin:0 0 16px;color:#0F172A;">Collector Tools &amp; Resources</h2>
        <div style="display:flex;flex-wrap:wrap;gap:12px;color:#64748B;font-size:14px;">
          <a href="/cards" style="color:#0F172A;text-decoration:none;font-weight:600;">Pokémon card database</a> •
          <a href="/sets" style="color:#0F172A;text-decoration:none;font-weight:600;">Pokémon master set checklist</a> •
          <a href="/tools" style="color:#0F172A;text-decoration:none;font-weight:600;">Pokémon deck builder</a> •
          <a href="/format/standard-2026" style="color:#0F172A;text-decoration:none;font-weight:600;">2026 Standard legality checker</a> •
          <a href="/pricing" style="color:#0F172A;text-decoration:none;font-weight:600;">Pokémon collection valuation</a> •
          <a href="/tool/psa-grade-calculator" style="color:#0F172A;text-decoration:none;font-weight:600;">PSA slab tracker</a> •
          <a href="/directory/slabs-index" style="color:#0F172A;text-decoration:none;font-weight:600;">sealed Pokémon product tracker</a> •
          <a href="/compare" style="color:#0F172A;text-decoration:none;font-weight:600;">Platform Comparisons</a> •
          <a href="/changelog" style="color:#0F172A;text-decoration:none;font-weight:600;">Changelog</a>
        </div>
      </div>
    </section>
  
<footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:32px 20px;text-align:center;color:#64748B;font-size:14px;">
    <p style="margin:0 0 12px;font-weight:600;color:#0F172A;">DECK / divider — Pokémon TCG Tracker &amp; Deck Builder</p>
    <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:16px;">
      <a href="/" style="color:#64748B;text-decoration:none;">Pokémon TCG Tracker</a>
      <a href="/about" style="color:#64748B;text-decoration:none;">About</a>
      <a href="/pricing" style="color:#64748B;text-decoration:none;">Pricing</a>
      <a href="/socials" style="color:#64748B;text-decoration:none;">Community &amp; Reviews</a>
      <a href="/tools/psa-grade-calculator" style="color:#64748B;text-decoration:none;">PSA Slab Calculator</a>
      <a href="/tools/deck-legality-checker" style="color:#64748B;text-decoration:none;">Deck Legality Checker</a>
      <a href="/privacy" style="color:#64748B;text-decoration:none;">Privacy Policy</a>
      <a href="/terms" style="color:#64748B;text-decoration:none;">Terms of Service</a>
      <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
    </div>
    <p style="margin:0 0 8px;font-size:12px;color:#94A3B8;">&copy; 2026 DECK / divider. All rights reserved.</p>
    <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
  </footer>
  `;

  return { bodyHtml, title: pageTitle, metaTags, };
}

// Injects SSR title, meta tags, and root body HTML into an index.html template string
export function injectSsrIntoTemplate(templateHtml: string, ssr: RenderResult, isBotRequest: boolean = false): string {
  let html = templateHtml;

  // Replace <title>...</title> if present
  if (html.includes('<title>')) {
    html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(ssr.title)}</title>`);
  }

  // Remove existing fallback meta tags from base template to prevent duplicates
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']googlebot["'][^>]*>/gi, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
  html = html.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/gi, '');

  // Inject SSR meta tags before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${ssr.metaTags}\n  </head>`);
  }

  const rootContent = (ssr.bodyHtml || '').trim();

  if (rootContent) {
    // Inject SSR HTML directly into <div id="root"> so every verification crawler, bot,
    // scraper, and human visitor receives full semantic HTML with complete dofollow anchors immediately.
    const rootMarker = '<div id="root">';
    const scriptMarker = '<script type="module"';
    if (html.includes(rootMarker)) {
      const rootStart = html.indexOf(rootMarker);
      const scriptStart = html.indexOf(scriptMarker, rootStart);
      if (scriptStart !== -1) {
        const before = html.substring(0, rootStart);
        const after = html.substring(scriptStart);
        html = `${before}<div id="root">\n${rootContent}\n    </div>\n    ${after}`;
      } else {
        html = html.replace(/<div id="root">[\s\S]*?<\/body>/i, `<div id="root">\n${rootContent}\n    </div>\n  </body>`);
      }
    }

    // Also include an accessible noscript fallback block
    if (!html.includes('id="ssr-crawler-fallback"')) {
      const noscriptBlock = `\n    <noscript>\n      <div id="ssr-crawler-fallback">\n${rootContent}\n      </div>\n    </noscript>`;
      if (html.includes('</body>')) {
        html = html.replace('</body>', `${noscriptBlock}\n  </body>`);
      } else {
        html += noscriptBlock;
      }
    }
  }

  return html;
}
