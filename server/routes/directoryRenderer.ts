/**
 * Server-Side Static HTML Renderer for Decoupled Directory Hub & Keyword Cluster Pages
 */

import { KEYWORD_CLUSTERS, GLOSSARY_TERMS, SEARCH_PARAMETERS } from '../keywordCatalogManager.js';
import { getExpansions } from '../tcgCatalogManager.js';
import { DECK_SLUGS, COMPETITOR_SLUGS } from '../publicFootprintManager.js';
import { renderSsrBrand } from '../ssrRenderer.js';

const CANONICAL_ORIGIN = 'https://deckdivider.app';
const OG_IMAGE_URL = 'https://deckdivider.app/og-image.png?v=2';

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function renderDirectoryPage(pathname: string): Promise<{ bodyHtml: string; title: string; metaTags: string } | null> {
  const cleanPath = pathname.split('?')[0].replace(/\/+$/, '');

  // 1. DIRECTORY MASTER HUB: /directory
  if (cleanPath === '/directory') {
    const pageTitle = 'Pokémon TCG Directory & Knowledge Base — DECK / divider';
    const pageDesc = 'Comprehensive Pokémon TCG index of 100+ expansion sets, competitive 60-card tournament decklists, PSA/BGS slab valuations, and card mechanics glossary.';
    const canonicalUrl = `${CANONICAL_ORIGIN}/directory`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${canonicalUrl}#collectionpage`,
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      isPartOf: {
        '@type': 'WebSite',
        name: 'DECK / divider',
        url: CANONICAL_ORIGIN
      }
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta name="thumbnail" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(pageTitle)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
        <nav style="display:flex;gap:12px;margin-left:24px;font-size:14px;">
          <a href="/directory" style="color:#DC143C;text-decoration:none;font-weight:700;">Directory Hub</a>
          <a href="/directory/sets-index" style="color:#64748B;text-decoration:none;font-weight:500;">Sets</a>
          <a href="/directory/decks-index" style="color:#64748B;text-decoration:none;font-weight:500;">Meta Decks</a>
          <a href="/directory/slabs-index" style="color:#64748B;text-decoration:none;font-weight:500;">Graded Slabs</a>
          <a href="/directory/glossary" style="color:#64748B;text-decoration:none;font-weight:500;">Glossary</a>
        </nav>
      </div>
      <div>
        <a href="/" style="background:#0F172A;color:#FFFFFF;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Open App</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 24px;">
      <div style="margin-bottom:40px;text-align:center;">
        <span style="background:#FFF0F3;color:#DC143C;padding:4px 12px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;">Knowledge Base &amp; Discovery Hub</span>
        <h1 style="font-size:36px;font-weight:800;color:#0F172A;margin:16px 0 12px;letter-spacing:-0.8px;">Pokémon TCG Knowledge &amp; Directory</h1>
        <p style="font-size:16px;color:#64748B;max-width:700px;margin:0 auto;line-height:1.6;">Explore structured indices of 100+ expansion sets, competitive 60-card meta decks, PSA slab certificate guides, and game mechanics.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:48px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:24px;margin-bottom:12px;">📦</div>
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:8px;">Expansions &amp; Set Checklists</h2>
          <p style="font-size:14px;color:#64748B;line-height:1.5;margin-bottom:16px;">Complete card checklists, reverse holos, and masterball foils from Scarlet &amp; Violet, Sword &amp; Shield, Sun &amp; Moon, and vintage sets.</p>
          <a href="/directory/sets-index" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">Browse All Sets &rarr;</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:24px;margin-bottom:12px;">⚔️</div>
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:8px;">60-Card Meta Decks</h2>
          <p style="font-size:14px;color:#64748B;line-height:1.5;margin-bottom:16px;">Standard format legal tournament deck lists with 2026 regulation marks H/I/J compliance and 1-click PTCGL export strings.</p>
          <a href="/directory/decks-index" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">View Meta Decks &rarr;</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:24px;margin-bottom:12px;">💎</div>
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:8px;">Graded Slabs &amp; Multipliers</h2>
          <p style="font-size:14px;color:#64748B;line-height:1.5;margin-bottom:16px;">PSA, BGS Beckett, and CGC condition standards, centering ratio rules, certificate registry tracking, and grade value spreads.</p>
          <a href="/directory/slabs-index" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">Grading &amp; Slab Guides &rarr;</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:24px;margin-bottom:12px;">📖</div>
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:8px;">Terminology Glossary</h2>
          <p style="font-size:14px;color:#64748B;line-height:1.5;margin-bottom:16px;">Definitive dictionary of Pokémon TCG terminology: ACE SPEC, Secret Illustration Rares, Regulation Marks, Lost Zone, and more.</p>
          <a href="/directory/glossary" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">Open TCG Glossary &rarr;</a>
        </div>
      </div>

      <div style="background:#F1F5F9;border-radius:12px;padding:32px;margin-bottom:48px;">
        <h2 style="font-size:22px;font-weight:700;color:#0F172A;margin-bottom:16px;">Core Keyword Clusters &amp; Deep-Links</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:16px;">
          ${KEYWORD_CLUSTERS.map(cluster => `
            <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:8px;padding:16px;">
              <h3 style="font-size:16px;font-weight:700;color:#0F172A;margin-bottom:6px;">${escapeHtml(cluster.category)}</h3>
              <p style="font-size:13px;color:#64748B;line-height:1.4;margin-bottom:10px;">${escapeHtml(cluster.description)}</p>
              <a href="${cluster.targetUrl}" style="font-size:13px;font-weight:600;color:#DC143C;text-decoration:none;">${escapeHtml(cluster.ctaText)} &rarr;</a>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="text-align:center;padding:32px 0;border-top:1px solid #E2E8F0;">
        <p style="font-size:14px;color:#94A3B8;">&copy; ${new Date().getFullYear()} DECK / divider. Live market data powered by TCGplayer. Not affiliated with Nintendo or The Pokémon Company.</p>
      </div>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  // 2. SETS INDEX: /directory/sets-index
  if (cleanPath === '/directory/sets-index') {
    const pageTitle = 'All Pokémon TCG Expansion Sets & Master Checklists Index — DECK / divider';
    const pageDesc = 'Complete catalog of 100+ Pokémon TCG expansions across Scarlet & Violet, Sword & Shield, Sun & Moon, XY, Black & White, and Vintage eras with binder completion checklists.';
    const canonicalUrl = `${CANONICAL_ORIGIN}/directory/sets-index`;
    const expansions = (await getExpansions()) || [];

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: expansions.slice(0, 30).map((set, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: set.name,
          url: `${CANONICAL_ORIGIN}/set/${set.id}`
        }))
      }
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta name="thumbnail" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(pageTitle)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
        <nav style="display:flex;gap:12px;margin-left:24px;font-size:14px;">
          <a href="/directory" style="color:#64748B;text-decoration:none;font-weight:500;">Directory Hub</a>
          <a href="/directory/sets-index" style="color:#DC143C;text-decoration:none;font-weight:700;">Sets</a>
          <a href="/directory/decks-index" style="color:#64748B;text-decoration:none;font-weight:500;">Meta Decks</a>
          <a href="/directory/slabs-index" style="color:#64748B;text-decoration:none;font-weight:500;">Graded Slabs</a>
          <a href="/directory/glossary" style="color:#64748B;text-decoration:none;font-weight:500;">Glossary</a>
        </nav>
      </div>
      <div>
        <a href="/sets" style="background:#0F172A;color:#FFFFFF;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Interactive Sets App</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 24px;">
      <div style="margin-bottom:32px;">
        <nav style="font-size:13px;color:#94A3B8;margin-bottom:12px;">
          <a href="/" style="color:#64748B;text-decoration:none;">Home</a> &gt; 
          <a href="/directory" style="color:#64748B;text-decoration:none;">Directory</a> &gt; 
          <span style="color:#0F172A;font-weight:600;">Expansions &amp; Sets Index</span>
        </nav>
        <h1 style="font-size:32px;font-weight:800;color:#0F172A;margin-bottom:8px;">Pokémon TCG Expansions Index (${expansions.length} Sets)</h1>
        <p style="font-size:15px;color:#64748B;line-height:1.5;">Direct directory of all expansion sets supported in DECK / divider. Select any set to open its full master checklist and top chase card price valuation guide.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(300px, 1fr));gap:16px;margin-bottom:48px;">
        ${expansions.map(set => `
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;padding:16px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px;">
                <h2 style="font-size:16px;font-weight:700;color:#0F172A;margin:0;">${escapeHtml(set.name)}</h2>
                <span style="font-size:11px;background:#F1F5F9;color:#64748B;padding:2px 6px;border-radius:4px;font-weight:600;">${escapeHtml(set.id.toUpperCase())}</span>
              </div>
              <p style="font-size:12px;color:#64748B;margin-bottom:12px;">Series: ${escapeHtml(set.series || 'Pokémon TCG')} &bull; ${set.cardCount?.total || set.cardCount?.official || 'Multiple'} cards</p>
            </div>
            <div style="display:flex;gap:8px;font-size:12px;">
              <a href="/set/${set.id}" style="background:#DC143C;color:#FFFFFF;padding:6px 12px;border-radius:6px;text-decoration:none;font-weight:600;flex:1;text-align:center;">Checklist</a>
              <a href="/set/${set.id}/top-cards" style="background:#F1F5F9;color:#0F172A;padding:6px 12px;border-radius:6px;text-decoration:none;font-weight:600;flex:1;text-align:center;">Top Cards</a>
            </div>
          </div>
        `).join('')}
      </div>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  // 3. DECKS INDEX: /directory/decks-index
  if (cleanPath === '/directory/decks-index') {
    const pageTitle = 'Competitive 60-Card Pokémon Meta Decks Index — DECK / divider';
    const pageDesc = 'Tournament-legal 60-card standard format meta deck lists with card counts, PTCGL import text strings, and live TCGplayer market prices.';
    const canonicalUrl = `${CANONICAL_ORIGIN}/directory/decks-index`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: DECK_SLUGS.map((slug, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          url: `${CANONICAL_ORIGIN}/deck/${slug}`
        }))
      }
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta name="thumbnail" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(pageTitle)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
        <nav style="display:flex;gap:12px;margin-left:24px;font-size:14px;">
          <a href="/directory" style="color:#64748B;text-decoration:none;font-weight:500;">Directory Hub</a>
          <a href="/directory/sets-index" style="color:#64748B;text-decoration:none;font-weight:500;">Sets</a>
          <a href="/directory/decks-index" style="color:#DC143C;text-decoration:none;font-weight:700;">Meta Decks</a>
          <a href="/directory/slabs-index" style="color:#64748B;text-decoration:none;font-weight:500;">Graded Slabs</a>
          <a href="/directory/glossary" style="color:#64748B;text-decoration:none;font-weight:500;">Glossary</a>
        </nav>
      </div>
      <div>
        <a href="/tools/deck-legality-checker" style="background:#0F172A;color:#FFFFFF;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Deck Legality Checker</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 24px;">
      <div style="margin-bottom:32px;">
        <nav style="font-size:13px;color:#94A3B8;margin-bottom:12px;">
          <a href="/" style="color:#64748B;text-decoration:none;">Home</a> &gt; 
          <a href="/directory" style="color:#64748B;text-decoration:none;">Directory</a> &gt; 
          <span style="color:#0F172A;font-weight:600;">Tournament Meta Decks</span>
        </nav>
        <h1 style="font-size:32px;font-weight:800;color:#0F172A;margin-bottom:8px;">Standard Format Meta Decks Index</h1>
        <p style="font-size:15px;color:#64748B;line-height:1.5;">Browse championship-level 60-card tournament deck lists with card counts, energy distributions, match-up strategies, and 1-click PTCGL copy strings.</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:20px;margin-bottom:48px;">
        ${DECK_SLUGS.map(slug => {
          const deckName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          return `
          <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;padding:20px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:11px;background:#FFF0F3;color:#DC143C;padding:2px 8px;border-radius:999px;font-weight:700;">Standard Legal</span>
                <span style="font-size:12px;color:#64748B;font-weight:600;">60 Cards</span>
              </div>
              <h2 style="font-size:18px;font-weight:700;color:#0F172A;margin:0 0 8px;">${escapeHtml(deckName)}</h2>
              <p style="font-size:13px;color:#64748B;line-height:1.4;margin-bottom:16px;">Verified competitive standard tournament build with full Pokémon, Trainer, and Energy counts.</p>
            </div>
            <a href="/deck/${slug}" style="background:#0F172A;color:#FFFFFF;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px;text-align:center;">View 60-Card List &amp; PTCGL String &rarr;</a>
          </div>
          `;
        }).join('')}
      </div>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  // 4. SLABS INDEX: /directory/slabs-index
  if (cleanPath === '/directory/slabs-index') {
    const pageTitle = 'Graded Slab Registry & Certification Guide — DECK / divider';
    const pageDesc = 'PSA, BGS Beckett, and CGC grading standards, centering ratios, certification number logging, subgrade modeling, and grade price multipliers.';
    const canonicalUrl = `${CANONICAL_ORIGIN}/directory/slabs-index`;

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta name="thumbnail" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(pageTitle)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
        <nav style="display:flex;gap:12px;margin-left:24px;font-size:14px;">
          <a href="/directory" style="color:#64748B;text-decoration:none;font-weight:500;">Directory Hub</a>
          <a href="/directory/sets-index" style="color:#64748B;text-decoration:none;font-weight:500;">Sets</a>
          <a href="/directory/decks-index" style="color:#64748B;text-decoration:none;font-weight:500;">Meta Decks</a>
          <a href="/directory/slabs-index" style="color:#DC143C;text-decoration:none;font-weight:700;">Graded Slabs</a>
          <a href="/directory/glossary" style="color:#64748B;text-decoration:none;font-weight:500;">Glossary</a>
        </nav>
      </div>
      <div>
        <a href="/tools/psa-grade-calculator" style="background:#DC143C;color:#FFFFFF;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Open Grade Calculator</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 24px;">
      <div style="margin-bottom:32px;">
        <nav style="font-size:13px;color:#94A3B8;margin-bottom:12px;">
          <a href="/" style="color:#64748B;text-decoration:none;">Home</a> &gt; 
          <a href="/directory" style="color:#64748B;text-decoration:none;">Directory</a> &gt; 
          <span style="color:#0F172A;font-weight:600;">Graded Slabs &amp; Multipliers</span>
        </nav>
        <h1 style="font-size:32px;font-weight:800;color:#0F172A;margin-bottom:8px;">Graded Slab Certification &amp; Multiplier Standards</h1>
        <p style="font-size:15px;color:#64748B;line-height:1.5;">Complete technical guide to grading tier standards across Professional Sports Authenticator (PSA), Beckett (BGS), and Certified Guaranty Company (CGC).</p>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:48px;">
        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:12px;">PSA (Professional Sports Authenticator)</h2>
          <ul style="font-size:14px;color:#475569;line-height:1.7;padding-left:20px;margin-bottom:20px;">
            <li><strong>PSA 10 (Gem Mint)</strong>: 55/45 to 60/40 centering, zero surface flaws, 2.5x–4.5x modern multiplier over raw NM.</li>
            <li><strong>PSA 9 (Mint)</strong>: 60/40 to 65/35 centering, microscopic edge wear, typically 1.0x–1.3x raw NM.</li>
            <li><strong>PSA 8 (NM-MT)</strong>: Minor print lines or slight corner softness.</li>
          </ul>
          <a href="/tools/psa-grade-calculator" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">Model PSA 10 Price Spread &rarr;</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:12px;">BGS (Beckett Grading Services)</h2>
          <ul style="font-size:14px;color:#475569;line-height:1.7;padding-left:20px;margin-bottom:20px;">
            <li><strong>BGS 10 Black Label</strong>: Quad 10.0 subgrades (Centering, Corners, Edges, Surface). High auction premium (5x–15x PSA 10).</li>
            <li><strong>BGS 10 Pristine (Gold)</strong>: Three 10.0s and one 9.5 subgrade.</li>
            <li><strong>BGS 9.5 Gem Mint</strong>: Baseline equivalent to standard PSA 10.</li>
          </ul>
          <a href="/pricing" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">Log BGS Subgrades in Vault &rarr;</a>
        </div>

        <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:12px;padding:24px;">
          <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin-bottom:12px;">CGC &amp; ACE Grading</h2>
          <ul style="font-size:14px;color:#475569;line-height:1.7;padding-left:20px;margin-bottom:20px;">
            <li><strong>CGC Pristine 10</strong>: Flawless card in a gold pristine label.</li>
            <li><strong>CGC Gem Mint 10</strong>: Standard gem mint tier.</li>
            <li><strong>ACE Grading</strong>: Custom thematic label presentation popular in UK and Europe.</li>
          </ul>
          <a href="/vault" style="color:#DC143C;font-weight:600;font-size:14px;text-decoration:none;">Track Custom Grading Companies &rarr;</a>
        </div>
      </div>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  // 5. GLOSSARY: /directory/glossary
  if (cleanPath === '/directory/glossary') {
    const pageTitle = 'Pokémon TCG Terminology & Game Mechanics Glossary — DECK / divider';
    const pageDesc = 'Definitive glossary of 50+ Pokémon Trading Card Game terms, rarities, card types, grading standards, and tournament format rules.';
    const canonicalUrl = `${CANONICAL_ORIGIN}/directory/glossary`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: pageTitle,
      description: pageDesc,
      url: canonicalUrl,
      hasDefinedTerm: GLOSSARY_TERMS.map(term => ({
        '@type': 'DefinedTerm',
        name: term.term,
        description: term.definition,
        url: `${canonicalUrl}#${term.slug}`
      }))
    };

    const metaTags = `
    <meta name="description" content="${escapeHtml(pageDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:title" content="${escapeHtml(pageTitle)}" />
    <meta property="og:description" content="${escapeHtml(pageDesc)}" />
    <meta property="og:image" content="${OG_IMAGE_URL}" />
    <meta property="og:image:secure_url" content="${OG_IMAGE_URL}" />
    <meta name="thumbnail" content="${OG_IMAGE_URL}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeHtml(pageTitle)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="DECK / divider" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
    <meta name="twitter:image" content="${OG_IMAGE_URL}" />
    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
    `;

    const bodyHtml = `
    <header style="background:#FFFFFF;border-bottom:1px solid #E2E8F0;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;">
      <div style="display:flex;align-items:center;gap:16px;">
        ${renderSsrBrand()}
        <nav style="display:flex;gap:12px;margin-left:24px;font-size:14px;">
          <a href="/directory" style="color:#64748B;text-decoration:none;font-weight:500;">Directory Hub</a>
          <a href="/directory/sets-index" style="color:#64748B;text-decoration:none;font-weight:500;">Sets</a>
          <a href="/directory/decks-index" style="color:#64748B;text-decoration:none;font-weight:500;">Meta Decks</a>
          <a href="/directory/slabs-index" style="color:#64748B;text-decoration:none;font-weight:500;">Graded Slabs</a>
          <a href="/directory/glossary" style="color:#DC143C;text-decoration:none;font-weight:700;">Glossary</a>
        </nav>
      </div>
      <div>
        <a href="/" style="background:#0F172A;color:#FFFFFF;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Open App</a>
      </div>
    </header>

    <main style="max-width:1100px;margin:0 auto;padding:48px 24px;">
      <div style="margin-bottom:32px;">
        <nav style="font-size:13px;color:#94A3B8;margin-bottom:12px;">
          <a href="/" style="color:#64748B;text-decoration:none;">Home</a> &gt; 
          <a href="/directory" style="color:#64748B;text-decoration:none;">Directory</a> &gt; 
          <span style="color:#0F172A;font-weight:600;">Glossary</span>
        </nav>
        <h1 style="font-size:32px;font-weight:800;color:#0F172A;margin-bottom:8px;">Pokémon TCG Terminology &amp; Mechanics Glossary</h1>
        <p style="font-size:15px;color:#64748B;line-height:1.5;">Definitive reference for competitive mechanics, card rarity classifications, and grading standards.</p>
      </div>

      <div style="display:flex;flex-direction:column;gap:20px;margin-bottom:48px;">
        ${GLOSSARY_TERMS.map(g => `
          <div id="${g.slug}" style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:10px;padding:24px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <h2 style="font-size:20px;font-weight:700;color:#0F172A;margin:0;">${escapeHtml(g.term)}</h2>
              <span style="font-size:12px;background:#F1F5F9;color:#64748B;padding:2px 8px;border-radius:4px;font-weight:600;">${escapeHtml(g.category)}</span>
            </div>
            <p style="font-size:14px;color:#334155;line-height:1.6;margin-bottom:10px;">${escapeHtml(g.definition)}</p>
            <div style="background:#F8FAFC;border-left:3px solid #DC143C;padding:8px 12px;margin-bottom:12px;font-size:13px;color:#64748B;">
              <strong>Examples:</strong> ${escapeHtml(g.example)}
            </div>
            <a href="${g.relatedUrl}" style="font-size:13px;font-weight:600;color:#DC143C;text-decoration:none;">${escapeHtml(g.relatedUrlLabel)} &rarr;</a>
          </div>
        `).join('')}
      </div>
    </main>
    `;

    return { bodyHtml, title: pageTitle, metaTags };
  }

  return null;
}
