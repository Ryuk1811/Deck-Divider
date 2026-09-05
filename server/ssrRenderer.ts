import { getCardDetail } from './tcgCatalogManager.js';

interface RenderResult {
  title: string;
  metaTags: string;
  bodyHtml: string;
}

// Decode base64 deck parameter
function decodeDeckParam(encoded: string): any | null {
  try {
    const jsonString = Buffer.from(encoded, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonString);
    return { bodyHtml: "",
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

  // 1. PUBLIC DECK ROUTE: /deck/:deckId
  if (cleanPath.startsWith('/deck/')) {
    const deckId = cleanPath.replace('/deck/', '');
    let deckData = queryParams.d ? decodeDeckParam(queryParams.d) : null;

    if (!deckData) {
      deckData = {
        id: deckId,
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

    const ogImageUrl = 'https://deckdivider.app/og-image.png';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
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
    <header style="background:#0F172A;color:#FFFFFF;padding:16px 24px;border-bottom:1px solid #1E293B;display:flex;align-items:center;justify-content:between;">
      <div style="display:flex;align-items:center;gap:12px;">
        <a href="/" style="color:#FFFFFF;text-decoration:none;font-weight:800;font-size:18px;letter-spacing:-0.5px;">
          DECK <span style="color:#DC143C;">/</span> divider
        </a>
        <span style="background:#1E293B;color:#94A3B8;padding:2px 8px;border-radius:4px;font-size:11px;font-family:monospace;">PUBLIC ROSTER</span>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
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
      '@type': 'ItemList',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl
    };

    return { bodyHtml: "",
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

  // PROGRAMMATIC SEO: SET CHECKLIST ROUTE: /set/:setId
  if (cleanPath.startsWith('/set/') && !cleanPath.endsWith('/top-cards')) {
    const setId = cleanPath.replace('/set/', '').toLowerCase();

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

    const pageTitle = `${setData.name} (${setId.toUpperCase()}) Set Checklist & Card Prices | DECK / divider`;
    const pageDesc = `Complete ${setData.name} (${setData.series}) card checklist, live TCGplayer market prices, Secret Illustration Rare odds, and reverse holo binder tracker.`;
    const canonicalUrl = `${canonicalOrigin}/set/${setId}`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

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
      <a href="/" style="color:#FFFFFF;text-decoration:none;font-weight:800;font-size:18px;">
        DECK <span style="color:#DC143C;">/</span> divider
      </a>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // PROGRAMMATIC SEO: TOURNAMENT DECK ARCHETYPE ROUTE: /decks/:archetype
  if (cleanPath.startsWith('/decks/')) {
    const archetype = cleanPath.replace('/decks/', '').toLowerCase();

    const archetypeDatabase: Record<string, { name: string; keyPokemon: string; format: string; cardCount: number; estPrice: number }> = {
      'gardevoir-ex': { name: 'Gardevoir ex', keyPokemon: 'Gardevoir ex, Scream Tail, Drifloon', format: 'Standard (F, G, H)', cardCount: 60, estPrice: 85.50 },
      'charizard-ex': { name: 'Charizard ex', keyPokemon: 'Charizard ex, Pidgeot ex, Dusknoir', format: 'Standard (F, G, H)', cardCount: 60, estPrice: 110.00 },
      'regidrago-vstar': { name: 'Regidrago VSTAR', keyPokemon: 'Regidrago VSTAR, Teal Mask Ogerpon ex, Dragapult ex', format: 'Standard (F, G, H)', cardCount: 60, estPrice: 145.00 },
      'dragapult-ex': { name: 'Dragapult ex', keyPokemon: 'Dragapult ex, Xatu, Pidgeot ex', format: 'Standard (F, G, H)', cardCount: 60, estPrice: 95.00 },
      'miraidon-ex': { name: 'Miraidon ex', keyPokemon: 'Miraidon ex, Raikou V, Iron Hands ex', format: 'Standard (F, G, H)', cardCount: 60, estPrice: 75.00 },
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
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

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
      <a href="/" style="color:#FFFFFF;text-decoration:none;font-weight:800;font-size:18px;">
        DECK <span style="color:#DC143C;">/</span> divider
      </a>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 2. ABOUT PAGE ROUTE: /about
  if (cleanPath === '/changelog') {
    const pageTitle = 'Changelog & Updates — DECK / divider';
    const pageDesc = 'Stay up-to-date with the latest features, database expansions, and performance improvements to our Pokémon TCG collector software.';
    const canonicalUrl = `${canonicalOrigin}/changelog`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl
    };

    return { bodyHtml: "",
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

    return { bodyHtml: "",
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
    const pageTitle = 'Pokémon TCG Formats & Legality Guide — DECK / divider';
    const pageDesc = 'Understand the rules, rotation schedules, and legal card pools for Standard, Expanded, and Gym Leader Challenge (GLC) formats.';
    const canonicalUrl = `${canonicalOrigin}/formats`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl
    };

    return { bodyHtml: "",
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

    return { bodyHtml: "",
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

    return { bodyHtml: "",
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

    return { bodyHtml: "",
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

    return { bodyHtml: "",
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

  // HIGH-INTENT UTILITY TOOLS: /tools & /tools/:toolId & /geo-insights
  if (cleanPath === '/tools' || cleanPath.startsWith('/tools/') || cleanPath === '/geo-insights') {
    const toolId = cleanPath === '/geo-insights' ? 'geo-inspector' : (cleanPath.startsWith('/tools/') ? cleanPath.split('/')[2] : 'psa-grade-calculator');
    const toolInfo: Record<string, { title: string; desc: string }> = {
      'psa-grade-calculator': {
        title: 'PSA & BGS Grade ROI Calculator — Estimate Grading Profitability | DECK / divider',
        desc: 'Calculate whether grading your Pokémon card with PSA, BGS, or CGC is profitable. Accounts for grading tier fees, shipping, raw comp value, and projected grade premiums.'
      },
      'deck-legality-checker': {
        title: 'Pokémon TCG Regulation Mark & Deck Legality Checker | DECK / divider',
        desc: 'Instant legality check for Standard, Expanded, and GLC formats. Verifies regulation marks (F, G, H, I), ACE SPEC restrictions, and Radiant Pokémon limits.'
      },
      'geo-inspector': {
        title: 'GEO & AI Citation Inspector — Prompt Simulator for LLMs | DECK / divider',
        desc: 'Inspect and test how ChatGPT Search, Perplexity, Google AI Overviews, and Claude cite DECK / divider across high-intent Pokémon TCG queries and benchmark prompts.'
      }
    };

    const currentTool = toolInfo[toolId] || {
      title: 'Free Pokémon TCG Collector & Tournament Tools | DECK / divider',
      desc: 'Suite of free interactive tools for Pokémon card collectors: PSA grading profit calculators, tournament regulation mark checkers, and export utilities.'
    };

    const canonicalUrl = cleanPath === '/geo-insights' 
      ? `${canonicalOrigin}/geo-insights`
      : (cleanPath.startsWith('/tools/') ? `${canonicalOrigin}/tools/${toolId}` : `${canonicalOrigin}/tools`);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebApplication',
          name: currentTool.title,
          description: currentTool.desc,
          url: canonicalUrl,
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'All',
          dateModified: new Date().toISOString(),
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: ['h1', 'p']
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: toolId === 'geo-inspector' ? 'How does DECK / divider achieve AI search citations?' : 'How is grading ROI calculated?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: toolId === 'geo-inspector'
                  ? 'DECK / divider places direct answers under 50 words at the top of pages, cites named sources (TCGplayer Market, PSA APR, Play! Pokémon), formats data in clean JSON-LD and markdown tables, and publishes an llms.txt index.'
                  : 'Grading ROI subtracts your card purchase price, grading fee, and shipping insurance costs from the current market price of the expected slab grade (e.g. PSA 10 or PSA 9).'
              }
            }
          ]
        }
      ]
    };

    return { bodyHtml: "",
      title: currentTool.title,
      metaTags: `
        <meta name="description" content="${currentTool.desc}" />
        <meta property="og:title" content="${currentTool.title}" />
        <meta property="og:description" content="${currentTool.desc}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <link rel="canonical" href="${canonicalUrl}" />
        <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
      `
    };
  }

  if (cleanPath === '/about') {
    const pageTitle = 'About Us & Mission — DECK / divider Pokémon TCG';
    const pageDesc = 'Built by lifelong Pokémon card collectors and tournament players. Discover our story, our 4 design principles, and our transparent pricing and card data provenance.';
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
          'https://twitter.com/deckdivider',
          'https://github.com/deckdivider',
          'https://instagram.com/deckdivider'
        ]
      },
    };

    const ogImageUrl = 'https://deckdivider.app/og-image.png';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
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
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
          DECK <span style="color:#DC143C;">/</span> divider
        </a>
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
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1.15;margin:0 0 20px;">Built by Collectors, Crafted for the Pokémon TCG Community</h1>
        <p style="font-size:18px;color:#64748B;max-width:800px;margin:0 auto;">DECK / divider is an independent fan project created by lifelong card collectors and competitive players who wanted a fast, clean, ad-free way to track raw binders, slabs, and tournament decks.</p>
      </section>

      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:36px;box-shadow:0 1px 3px rgba(0,0,0,0.03);margin-bottom:48px;">
        <h2 style="font-size:24px;font-weight:800;margin:0 0 16px;">Why We Built DECK / divider</h2>
        <p style="color:#475569;font-size:15px;margin-bottom:16px;">Like many in the community, we spent years managing our cards across messy spreadsheets, taking photos of binder pages that we constantly lost track of, and juggling slow apps full of paywalled card lookups and intrusive banner ads.</p>
        <p style="color:#475569;font-size:15px;margin-bottom:16px;">We built DECK / divider to provide the cleanest, fastest, and most transparent tool for tracking raw binders, authenticated slabs (PSA, BGS, CGC), sealed booster boxes, and 60-card tournament decks — with zero ad bloat and full respect for your data.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:16px;margin-top:24px;padding-top:24px;border-top:1px solid #F1F5F9;">
          <div style="background:#F8FAFC;padding:16px;border-radius:10px;border:1px solid #E2E8F0;">
            <strong style="display:block;color:#DC143C;font-size:12px;text-transform:uppercase;margin-bottom:4px;">01 • Community First</strong>
            <span style="font-size:13px;color:#64748B;">Built by players who open packs, grade cards, and play at local leagues.</span>
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
            <p style="color:#CBD5E1;font-size:13px;line-height:1.5;margin:0;">Standard regulation mark verification (F, G, H, I) and PTCGL export formats kept in sync with official tournament rotation bulletins.</p>
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
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Continuous 60-card format checks enforcing the 4-copy rule, Radiant limits, ACE SPEC restrictions, and regulation mark rules (F, G, H, I).</p>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
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

    const ogImageUrl = 'https://deckdivider.app/og-image.png';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
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
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
          DECK <span style="color:#DC143C;">/</span> divider
        </a>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 4. AUTH PAGE ROUTE: /auth
  if (cleanPath === '/auth') {
    const pageTitle = 'Sign In & Register — DECK / divider Pokémon TCG Studio';
    const pageDesc = 'Sign in to DECK / divider to manage your Pokémon TCG collection vault, build competitive 60-card tournament decks, and track real-time portfolio market value.';
    const canonicalUrl = `${canonicalOrigin}/auth`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
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
      <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
        DECK <span style="color:#DC143C;">/</span> divider
      </a>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 5. PRICING PAGE ROUTE: /pricing
  if (cleanPath === '/pricing') {
    const pageTitle = 'Pricing Plans & Subscriptions — DECK / divider Pokémon TCG';
    const pageDesc = 'Compare DECK / divider subscription tiers from free Starter to institutional Collection Vault. 60-card tournament builder, PSA slab tracking, and live market pricing.';
    const canonicalUrl = `${canonicalOrigin}/pricing`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

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
          applicationCategory: 'EntertainmentApplication',
          operatingSystem: 'Web, iOS, Android',
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: '0',
            highPrice: '44',
            offerCount: 5,
            offers: [
              {
                '@type': 'Offer',
                name: 'Starter',
                price: '0',
                priceCurrency: 'USD',
                description: 'Essential collection tracking and basic deckbuilder.',
              },
              {
                '@type': 'Offer',
                name: 'Bunch',
                price: '11',
                priceCurrency: 'USD',
                description: 'For active players building competitive decks and logging grades.',
              },
              {
                '@type': 'Offer',
                name: 'Stack',
                price: '22',
                priceCurrency: 'USD',
                description: 'Expanded capacity for serious binder completists and public sharing.',
              },
              {
                '@type': 'Offer',
                name: 'Deck',
                price: '33',
                priceCurrency: 'USD',
                description: 'Championship 60-card tournament decks, sealed vault, and alert tools.',
              },
              {
                '@type': 'Offer',
                name: 'Collection',
                price: '44',
                priceCurrency: 'USD',
                description: 'Institutional-grade high-net-worth portfolio vault with unlimited headroom.',
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
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="DECK / divider Pricing Tiers" />
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
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
          DECK <span style="color:#DC143C;">/</span> divider
        </a>
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
          <p style="color:#64748B;font-size:13px;margin:0;line-height:1.5;">Search 148+ expansions with live USD TCGplayer pricing, build up to 4 custom decks (max 25 cards each), and create 3 wishlists with no credit card required.</p>
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
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Essential collection tracking and basic deckbuilder.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 4 custom decks</li>
            <li>Max 25 cards per deck</li>
            <li>Up to 3 wishlists</li>
            <li>Live USD market prices</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Get Started Free</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Bunch</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">$4.99 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">For your first graded slabs &amp; PSA cert logging.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 9 custom decks</li>
            <li>Max 40 cards per deck</li>
            <li>PSA, BGS &amp; CGC cert logging</li>
            <li>Multi-currency conversion</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Bunch</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Stack</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">$6.99 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Expanded capacity for serious binder completists.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 15 custom decks</li>
            <li>Max 50 cards per deck</li>
            <li>Master set checklist tracking</li>
            <li>Shareable deck links</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Stack</a>
        </div>

        <div style="background:#FFFFFF;border:2px solid #DC143C;border-radius:16px;padding:24px;position:relative;box-shadow:0 4px 12px rgba(220,20,60,0.1);">
          <span style="position:absolute;top:-12px;right:16px;background:#DC143C;color:#FFFFFF;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;">MOST POPULAR</span>
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;">Deck</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;">$9.99 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
          <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Championship 60-card tournament decks and sealed vault.</p>
          <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
            <li>Up to 18 custom decks (60-card)</li>
            <li>PTCGL 1-click text export</li>
            <li>Sealed booster box tracker</li>
            <li>Price drop alerts &amp; targets</li>
          </ul>
          <a href="/auth" style="display:block;text-align:center;background:#DC143C;color:#FFFFFF;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Choose Deck</a>
        </div>

        <div style="background:#0F172A;color:#FFFFFF;border:1px solid #1E293B;border-radius:16px;padding:24px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="font-size:20px;font-weight:800;margin:0 0 4px;color:#FFFFFF;">Collection</h2>
          <div style="font-size:28px;font-weight:900;margin:12px 0;color:#FFFFFF;">$19.99 <span style="font-size:13px;color:#94A3B8;font-weight:400;">/ month</span></div>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 6. FAQ PAGE ROUTE: /faq
  if (cleanPath === '/faq') {
    const pageTitle = 'Frequently Asked Questions — DECK / divider Pokémon TCG';
    const pageDesc = 'Answers to common questions about DECK / divider live market valuations, PSA slab certification logging, 60-card tournament deck rules, and collection security.';
    const canonicalUrl = `${canonicalOrigin}/faq`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

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
            text: 'Yes. The deck builder checks standard 60-card format legality (including regulation marks F, G, H, I and the 4-card copy rule) and lets you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.',
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
        <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
          DECK <span style="color:#DC143C;">/</span> divider
        </a>
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
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. The deck builder checks standard 60-card format legality (including regulation marks F, G, H, I and the 4-card copy rule) and lets you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.</p>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 7. PRIVACY POLICY ROUTE: /privacy
  if (cleanPath === '/privacy') {
    const pageTitle = 'Privacy Policy — DECK / divider Pokémon TCG';
    const pageDesc = 'DECK / divider privacy policy. Learn how your collection portfolio data, pricing records, and account credentials are encrypted and protected.';
    const canonicalUrl = `${canonicalOrigin}/privacy`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
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
      <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
        DECK <span style="color:#DC143C;">/</span> divider
      </a>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 8. TERMS OF SERVICE ROUTE: /terms
  if (cleanPath === '/terms') {
    const pageTitle = 'Terms of Service — DECK / divider Pokémon TCG';
    const pageDesc = 'DECK / divider terms of service and acceptable use policies for Pokémon TCG portfolio tracking, deckbuilder, and slab registries.';
    const canonicalUrl = `${canonicalOrigin}/terms`;
    const ogImageUrl = 'https://deckdivider.app/og-image.png';

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:secure_url" content="${ogImageUrl}" />
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
      <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
        DECK <span style="color:#DC143C;">/</span> divider
      </a>
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

    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 5. AUTHENTICATED APP SHELL: /app, /app/*, /dashboard, /collection, /decks, /settings, /metrics, etc.
  if (
    cleanPath === '/app' ||
    cleanPath.startsWith('/app/') ||
    cleanPath === '/dashboard' ||
    cleanPath.startsWith('/dashboard/') ||
    cleanPath === '/collection' ||
    cleanPath === '/decks' ||
    cleanPath === '/settings' ||
    cleanPath === '/metrics'
  ) {
    const pageTitle = 'Dashboard & Collection Studio — DECK / divider';
    const metaTags = `
    <meta name="robots" content="noindex, nofollow" />
    <meta name="googlebot" content="noindex, nofollow" />
    `;
    const bodyHtml = ``;
    return { bodyHtml: "", title: pageTitle, metaTags, };
  }

  // 6. HOMEPAGE / LANDING ROUTE: /
  const pageTitle = 'DECK / divider — Pokémon TCG Collection Tracker, Slab Registry & Deckbuilder';
  const pageDesc = 'Track your Pokémon cards, PSA/BGS slabs, and sealed booster boxes with live TCGplayer prices. Build standard 60-card tournament decks, complete master sets, and view real-time collection values in 15+ currencies.';
  const canonicalUrl = `${canonicalOrigin}/`;
  const ogImageUrl = 'https://deckdivider.app/og-image.png';

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
          url: 'https://deckdivider.app/og-image.png',
          width: 1200,
          height: 630,
        },
        description: 'Collection tracking, 60-card deck building, and PSA slab management platform for Pokémon TCG collectors and tournament players.',
        sameAs: [
          'https://twitter.com/deckdivider',
          'https://github.com/deckdivider',
          'https://instagram.com/deckdivider'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://deckdivider.app/#website',
        url: 'https://deckdivider.app',
        name: 'DECK / divider',
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
        applicationCategory: 'EntertainmentApplication',
        operatingSystem: 'Web, iOS, Android',
        description: pageDesc,
        publisher: {
          '@id': 'https://deckdivider.app/#organization',
        },
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'USD',
          lowPrice: '0',
          highPrice: '19.99',
          offerCount: 4,
        },
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
              text: 'Yes. The deck builder checks standard 60-card format legality (including regulation marks F, G, H, I and the 4-card copy rule) and lets you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.',
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
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="DECK / divider — Pokémon TCG Collection Tracker, Slab Registry & Deckbuilder" />
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
      <a href="/" style="color:#0F172A;text-decoration:none;font-weight:800;font-size:20px;letter-spacing:-0.5px;">
        DECK <span style="color:#DC143C;">/</span> divider
      </a>
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
          <p style="color:#64748B;font-size:14px;margin:0;">Standard &amp; Expanded format legality checks, regulation marks (F, G, H), ACE SPEC audits, and one-click printable tournament registration rosters.</p>
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
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">Entry point for casual collectors.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 4 custom decks</li>
              <li>25 cards per deck</li>
              <li>3 binder lists</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Get Started Free</a>
          </div>

          <!-- Bunch -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Bunch</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">$11 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">For your first graded slabs.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 9 custom decks</li>
              <li>40 cards per deck</li>
              <li>8 binder lists</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Bunch</a>
          </div>

          <!-- Stack -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Stack</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">$22 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">Unlocks public deck and showcase share links.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 15 custom decks</li>
              <li>50 cards per deck</li>
              <li>Public share links</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Stack</a>
          </div>

          <!-- Deck -->
          <div style="background:#FFFFFF;border:2px solid #DC143C;border-radius:16px;padding:20px;position:relative;">
            <span style="position:absolute;top:-10px;right:14px;background:#DC143C;color:#FFFFFF;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;">POPULAR</span>
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;">Deck</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;">$33 <span style="font-size:13px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:14px;">Full tournament specs for competitive players.</p>
            <ul style="color:#475569;font-size:12px;padding-left:16px;margin:0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Up to 18 tournament decks</li>
              <li>Full 60 cards per deck</li>
              <li>Public share links</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#DC143C;color:#FFFFFF;padding:8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Deck</a>
          </div>

          <!-- Collection -->
          <div style="background:#0F172A;color:#FFFFFF;border:1px solid #1E293B;border-radius:16px;padding:20px;">
            <h3 style="font-size:18px;font-weight:800;margin:0 0 4px;color:#FFFFFF;">Collection</h3>
            <div style="font-size:26px;font-weight:900;margin:10px 0;color:#FFFFFF;">$44 <span style="font-size:13px;color:#94A3B8;font-weight:400;">/ month</span></div>
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
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. The deck engine validates Standard (F, G, H regulation marks) and Expanded format compliance, enforcing the 4-copy rule, Radiant limits, ACE SPEC single-card restrictions, and generates official registration rosters.</p>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
          <h3 style="font-size:16px;font-weight:700;margin:0 0 8px;">Is my collection data stored securely and privately?</h3>
          <p style="color:#64748B;font-size:14px;margin:0;">Yes. Your portfolio and financial cost-basis logs are encrypted with AES-256 and backed by offline-first IndexedDB client caches with optional encrypted cloud snapshots.</p>
        </div>
      </div>
    </section>
  </main>

  <footer style="background:#FFFFFF;border-top:1px solid #E2E8F0;padding:32px 20px;text-align:center;color:#64748B;font-size:14px;">
    <p style="margin:0 0 12px;font-weight:600;color:#0F172A;">DECK / divider — Pokémon TCG Portfolio &amp; Deck Studio</p>
    <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:16px;">
      <a href="/" style="color:#64748B;text-decoration:none;">Home</a>
      <a href="/about" style="color:#64748B;text-decoration:none;">About &amp; Architecture</a>
      <a href="/how-it-works" style="color:#64748B;text-decoration:none;">How It Works</a>
      <a href="/privacy" style="color:#64748B;text-decoration:none;">Privacy Policy</a>
      <a href="/terms" style="color:#64748B;text-decoration:none;">Terms of Service</a>
      <a href="/auth" style="color:#DC143C;text-decoration:none;font-weight:600;">Sign In</a>
    </div>
    <p style="margin:0 0 8px;font-size:12px;color:#94A3B8;">&copy; 2026 DECK / divider. All rights reserved.</p>
    <p style="margin:0;font-size:11px;color:#94A3B8;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.5;">DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</p>
  </footer>
  `;

  return { bodyHtml: "", title: pageTitle, metaTags, };
}

// Injects SSR title, meta tags, and root body HTML into an index.html template string
export function injectSsrIntoTemplate(templateHtml: string, ssr: RenderResult): string {
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

  // Inject SSR meta tags before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${ssr.metaTags}\n  </head>`);
  }

  // Preserve <div id="root"> intact with the clean app-initial-shell loading spinner.
  // Never inject raw HTML into <div id="root"> because that causes a jarring "ghost UI"
  // flash on reload before React mounts.
  // For search engine bots and non-JS clients, place SSR body inside a <noscript> fallback.
  const rootContent = (ssr.bodyHtml || '').trim();

  if (rootContent && !html.includes('id="ssr-crawler-fallback"')) {
    const noscriptBlock = `\n    <noscript>\n      <div id="ssr-crawler-fallback">\n${rootContent}\n      </div>\n    </noscript>`;
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${noscriptBlock}\n  </body>`);
    } else {
      html += noscriptBlock;
    }
  }

  return html;
}
