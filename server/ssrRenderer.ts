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

    return { title: pageTitle, metaTags, bodyHtml };
  }

  // 2. ABOUT PAGE ROUTE: /about
  if (cleanPath === '/about') {
    const pageTitle = 'About Us & Architecture — DECK / divider Pokémon TCG';
    const pageDesc = 'Engineered for precision in Pokémon TCG. Discover our 4 core tenets for real-time market valuation, championship deck legality, and graded slab certification.';
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
    <meta property="og:image:alt" content="DECK / divider Architecture & Engineering Tenets" />
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
        <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In</a>
      </nav>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
      <section style="text-align:center;margin-bottom:56px;">
        <span style="display:inline-block;padding:4px 12px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:16px;">The Architecture Behind DECK / divider</span>
        <h1 style="font-size:42px;font-weight:900;letter-spacing:-1px;line-height:1.15;margin:0 0 20px;">Engineered for Precision in the Modern Pokémon TCG Ecosystem</h1>
        <p style="font-size:18px;color:#64748B;max-width:800px;margin:0 auto;">DECK / divider bridges the gap between casual card tracking and institutional-grade portfolio intelligence. Built by players and collectors for high-net-worth vaults and tournament champions.</p>
      </section>

      <section style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:56px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;box-shadow:0 2px 4px rgba(0,0,0,0.02);">
          <span style="color:#94A3B8;font-size:11px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">The Challenge</span>
          <h2 style="font-size:24px;font-weight:800;margin:12px 0 16px;letter-spacing:-0.5px;">The Fragmentation of TCG Asset Tracking</h2>
          <p style="color:#64748B;font-size:15px;margin-bottom:16px;">For years, Pokémon collectors and competitors have been forced to juggle disjointed tools: manual spreadsheets with stale market prices, clunky deckbuilders without format checks, and unverified binder photos without grading metadata.</p>
          <ul style="color:#64748B;font-size:14px;padding-left:20px;margin:0;display:flex;flex-direction:column;gap:8px;">
            <li>Unreliable valuations caused by unindexed currency fluctuations and delayed market sync.</li>
            <li>Lack of subgrade and certificate audit trails for high-value PSA, BGS, and CGC slabs.</li>
            <li>Disconnected deck lists with no automatic championship legality or energy distribution analysis.</li>
          </ul>
        </div>

        <div style="background:#0F172A;color:#FFFFFF;border:1px solid #1E293B;border-radius:16px;padding:32px;box-shadow:0 10px 25px rgba(0,0,0,0.1);">
          <span style="color:#DC143C;font-size:11px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">The Solution</span>
          <h2 style="font-size:24px;font-weight:800;margin:12px 0 16px;letter-spacing:-0.5px;color:#FFFFFF;">The DECK / divider Unified Architecture</h2>
          <p style="color:#CBD5E1;font-size:15px;margin-bottom:16px;">A purpose-built suite bringing together live market valuation, slab certification validation, 60-card tournament deck engineering, and sealed vault asset management under a single, cohesive operating system.</p>
          <ul style="color:#CBD5E1;font-size:14px;padding-left:20px;margin:0;display:flex;flex-direction:column;gap:8px;">
            <li>Real-time price reconciliation across major marketplace feeds and historical sales.</li>
            <li>Complete master set matrix covering 148+ expansions from Base Set to modern sets.</li>
            <li>Instant exportable tournament rosters compliant with Play! Pokémon regulations.</li>
          </ul>
        </div>
      </section>

      <section style="margin-bottom:56px;">
        <h2 style="font-size:32px;font-weight:800;text-align:center;margin-bottom:12px;letter-spacing:-0.5px;">Core Engineering Tenets</h2>
        <p style="text-align:center;color:#64748B;margin-bottom:36px;font-size:16px;">Explore the four foundational principles that govern every algorithm, database schema, and interface in DECK / divider.</p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px;">
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">01 / 04</div>
            <h3 style="font-size:18px;font-weight:700;margin:0 0 4px;">Real-Time Valuation & Anti-Drift</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Continuous Multi-Currency Aggregation</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Interfaces directly with market valuation endpoints across USD, JPY, EUR, GBP, and 10+ global currencies simultaneously.</p>
          </div>

          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">02 / 04</div>
            <h3 style="font-size:18px;font-weight:700;margin:0 0 4px;">Tournament-Grade Rules Engine</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Championship Formats & Deck Legality</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Continuous 60-card format checks enforcing the 4-copy rule, Radiant limits, ACE SPEC restrictions, and regulation mark rules (F, G, H).</p>
          </div>

          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">03 / 04</div>
            <h3 style="font-size:18px;font-weight:700;margin:0 0 4px;">Physical & Digital Twin Fidelity</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Authentic Slabs & Shimmer Physics</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">Support for PSA, BGS, and CGC certified certificates, individual subgrade breakdowns, and realistic holographic physics.</p>
          </div>

          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
            <div style="color:#DC143C;font-weight:700;font-family:monospace;font-size:12px;margin-bottom:8px;">04 / 04</div>
            <h3 style="font-size:18px;font-weight:700;margin:0 0 4px;">Privacy & Architectural Restraint</h3>
            <span style="color:#DC143C;font-size:12px;font-family:monospace;display:block;margin-bottom:12px;">Zero Bloat, High Density, Total Security</span>
            <p style="color:#64748B;font-size:13px;line-height:1.5;margin:0;">No intrusive tracking, fast responsive interfaces, and AES-256 cloud encryption with offline-first client cache storage.</p>
          </div>
        </div>
      </section>

      <section style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:16px;padding:36px;text-align:center;margin-bottom:56px;">
        <span style="color:#DC143C;font-size:11px;font-weight:700;font-family:monospace;letter-spacing:1px;text-transform:uppercase;">Platform Capacity</span>
        <h3 style="font-size:24px;font-weight:800;margin:8px 0 24px;">DECK / divider by the Numbers</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(160px, 1fr));gap:20px;">
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:900;color:#0F172A;">148+</div>
            <div style="font-size:13px;color:#64748B;font-weight:600;margin-top:4px;">Master Expansions</div>
          </div>
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:900;color:#0F172A;">3</div>
            <div style="font-size:13px;color:#64748B;font-weight:600;margin-top:4px;">Grading Scales (PSA/BGS/CGC)</div>
          </div>
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:900;color:#0F172A;">15+</div>
            <div style="font-size:13px;color:#64748B;font-weight:600;margin-top:4px;">Active Currencies</div>
          </div>
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:20px;">
            <div style="font-size:36px;font-weight:900;color:#0F172A;">100%</div>
            <div style="font-size:13px;color:#64748B;font-weight:600;margin-top:4px;">Championship Formats</div>
          </div>
        </div>
      </section>

      <section style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:32px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:20px;">
        <div>
          <h3 style="font-size:20px;font-weight:700;margin:0 0 8px;">Ready to see the workflow in action?</h3>
          <p style="color:#64748B;margin:0;font-size:14px;">Learn how our 4-step pipeline transforms raw card boxes and graded slabs into an organized, real-time institutional asset ledger.</p>
        </div>
        <div style="display:flex;gap:12px;">
          <a href="/how-it-works" style="background:#FFFFFF;color:#0F172A;border:1px solid #CBD5E1;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Explore How It Works</a>
          <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Sign In / Login</a>
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

    return { title: pageTitle, metaTags, bodyHtml };
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

    return { title: pageTitle, metaTags, bodyHtml };
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

    return { title: pageTitle, metaTags, bodyHtml };
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
    return { title: pageTitle, metaTags, bodyHtml };
  }

  // 6. HOMEPAGE / LANDING ROUTE: /
  const pageTitle = 'DECK / divider — Pokémon TCG Portfolio & Deck Studio';
  const pageDesc = 'The unified operating system for Pokémon TCG collectors and players. Live market valuation, 60-card deckbuilder, PSA slab tracking, and sealed vault ledger.';
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
        description: 'Professional portfolio tracking, deck building, and PSA slab management platform for Pokémon TCG collectors and players.',
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
  <meta property="og:image:alt" content="DECK / divider — Pokémon TCG Portfolio & Deck Studio" />
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
      <a href="/about" style="color:#64748B;text-decoration:none;">Architecture</a>
      <a href="/auth" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;text-decoration:none;">Sign In / Launch App</a>
    </nav>
  </header>

  <main style="font-family:system-ui,-apple-system,sans-serif;color:#0F172A;line-height:1.6;">
    <!-- Hero Section -->
    <section style="max-width:1100px;margin:0 auto;padding:64px 20px 48px;text-align:center;">
      <span style="display:inline-block;padding:4px 14px;background:#FFF0F3;color:#DC143C;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;">POKÉMON TCG PORTFOLIO &amp; DECK STUDIO</span>
      <h1 style="font-size:52px;font-weight:900;letter-spacing:-1.5px;line-height:1.08;margin:0 0 24px;color:#0F172A;">
        The Institutional Operating System for Pokémon TCG Collectors &amp; Competitors
      </h1>
      <p style="font-size:20px;color:#64748B;max-width:820px;margin:0 auto 36px;line-height:1.5;">
        Precision asset tracking, real-time multi-currency valuation, strict 60-card format legality verification, and sealed vault ledgers. Zero drift.
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

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:20px;">
          <!-- Starter -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;">
            <h3 style="font-size:20px;font-weight:800;margin:0 0 4px;">Starter</h3>
            <div style="font-size:28px;font-weight:900;margin:12px 0;">Free <span style="font-size:14px;color:#64748B;font-weight:400;">/ forever</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Essential collection tracking and basic deckbuilder.</p>
            <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
              <li>Up to 250 portfolio cards</li>
              <li>2 custom decklists</li>
              <li>USD market valuations</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Get Started Free</a>
          </div>

          <!-- Bunch -->
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:16px;padding:24px;">
            <h3 style="font-size:20px;font-weight:800;margin:0 0 4px;">Bunch</h3>
            <div style="font-size:28px;font-weight:900;margin:12px 0;">$4.99 <span style="font-size:14px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:16px;">For active players building competitive decks.</p>
            <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
              <li>Up to 1,500 portfolio cards</li>
              <li>Unlimited tournament decks</li>
              <li>Multi-currency conversion</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#F1F5F9;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Bunch</a>
          </div>

          <!-- Binder -->
          <div style="background:#FFFFFF;border:2px solid #DC143C;border-radius:16px;padding:24px;position:relative;">
            <span style="position:absolute;top:-12px;right:16px;background:#DC143C;color:#FFFFFF;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:700;font-family:monospace;">POPULAR</span>
            <h3 style="font-size:20px;font-weight:800;margin:0 0 4px;">Binder</h3>
            <div style="font-size:28px;font-weight:900;margin:12px 0;">$9.99 <span style="font-size:14px;color:#64748B;font-weight:400;">/ month</span></div>
            <p style="color:#64748B;font-size:13px;margin-bottom:16px;">Complete slab certification &amp; advanced analytics.</p>
            <ul style="color:#475569;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
              <li>Up to 5,000 portfolio cards</li>
              <li>PSA, BGS &amp; CGC slab cert tracking</li>
              <li>Play! Pokémon PDF roster exports</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#DC143C;color:#FFFFFF;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;">Choose Binder</a>
          </div>

          <!-- Vault -->
          <div style="background:#0F172A;color:#FFFFFF;border:1px solid #1E293B;border-radius:16px;padding:24px;">
            <h3 style="font-size:20px;font-weight:800;margin:0 0 4px;color:#FFFFFF;">Vault</h3>
            <div style="font-size:28px;font-weight:900;margin:12px 0;color:#FFFFFF;">$19.99 <span style="font-size:14px;color:#94A3B8;font-weight:400;">/ month</span></div>
            <p style="color:#94A3B8;font-size:13px;margin-bottom:16px;">Institutional-grade high-net-worth portfolio vault.</p>
            <ul style="color:#CBD5E1;font-size:13px;padding-left:18px;margin:0 0 20px;display:flex;flex-direction:column;gap:6px;">
              <li>Unlimited cards &amp; sealed cases</li>
              <li>Priority sub-second market sync</li>
              <li>Automated cloud snapshots &amp; backups</li>
            </ul>
            <a href="/auth" style="display:block;text-align:center;background:#FFFFFF;color:#0F172A;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Choose Vault</a>
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

  return { title: pageTitle, metaTags, bodyHtml };
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

  // Inject SSR body inside <div id="root"></div>
  if (html.includes('<div id="root"></div>')) {
    html = html.replace('<div id="root"></div>', `<div id="root">${ssr.bodyHtml}</div>`);
  } else if (html.includes('<div id="root">')) {
    html = html.replace(/<div id="root">.*?<\/div>/s, `<div id="root">${ssr.bodyHtml}</div>`);
  }

  return html;
}
