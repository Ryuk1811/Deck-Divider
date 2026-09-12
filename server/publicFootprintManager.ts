import fs from 'fs';
import path from 'path';
import { getExpansions, TCGSet } from './tcgCatalogManager.js';
import { generateLlmsKeywordsTxt, generateSearchMatrixJson } from './keywordCatalogManager.js';

// Global Build / Deployment Footprint Stamp
export const BUILD_TIMESTAMP = new Date().toISOString();
export const BUILD_DATE = BUILD_TIMESTAMP.split('T')[0]; // YYYY-MM-DD
export const BUILD_HASH = Math.random().toString(36).substring(2, 10);
export const CANONICAL_ORIGIN = 'https://deckdivider.app';

export interface RouteEntry {
  path: string;
  lastmod: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | string;
  priority?: string;
}

// 1. Core Platform & Directory Pages (Aligned with Phase 1 rewrite)
export const CORE_PAGES: RouteEntry[] = [
  { path: '/', lastmod: BUILD_DATE, priority: '1.0', changefreq: 'daily' },
  { path: '/directory', lastmod: BUILD_DATE, priority: '0.9', changefreq: 'daily' },
  { path: '/directory/sets-index', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/directory/decks-index', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/directory/slabs-index', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/directory/glossary', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/pricing', lastmod: BUILD_DATE, priority: '0.9', changefreq: 'weekly' },
  { path: '/sets', lastmod: BUILD_DATE, priority: '0.9', changefreq: 'daily' },
  { path: '/compare', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/best', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/tools', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/leaderboard', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/about', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/how-it-works', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'monthly' },
  { path: '/faq', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/security', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/formats', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/format/standard', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/format/expanded', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/format/glc', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
];

// 2. Tournament Decks & Archetypes (Singular)
export const DECK_SLUGS: string[] = [
  'gardevoir-ex',
  'charizard-ex',
  'regidrago-vstar',
  'dragapult-ex',
  'miraidon-ex',
  'lugia-vstar',
  'raging-bolt-ex',
  'terapagos-ex',
  'gholdengo-ex',
  'roaring-moon-ex',
  'iron-thorns-ex',
  'pao-chien-ex',
  'snorlax-stall',
  'ancient-box',
  'dialga-vstar',
  'giratina-vstar',
];

// 3. Competitor Comparison Matrices
export const COMPETITOR_SLUGS: string[] = [
  'collectr',
  'pokellector',
  'pricecharting',
  'dex',
  'tcg-collector',
  'dragon-shield',
];

// 4. Curated "Best Of" Ranking Guides
export const BEST_OF_SLUGS: string[] = [
  'pokemon-card-trackers',
  'slab-scanners',
  'deck-builders',
];

// 5. Tools
export const TOOL_SLUGS: string[] = [
  'psa-grade-calculator',
  'deck-legality-checker',
];

export async function getAllPublicUrls(): Promise<string[]> {
  const urls: string[] = [];
  
  // Static Core
  CORE_PAGES.forEach(page => {
    urls.push(`${CANONICAL_ORIGIN}${page.path}`);
  });

  // Decks
  DECK_SLUGS.forEach(slug => {
    urls.push(`${CANONICAL_ORIGIN}/deck/${slug}`);
  });

  // Compare
  COMPETITOR_SLUGS.forEach(slug => {
    urls.push(`${CANONICAL_ORIGIN}/compare/${slug}`);
  });

  // Best
  BEST_OF_SLUGS.forEach(slug => {
    urls.push(`${CANONICAL_ORIGIN}/best/${slug}`);
  });

  // Tools
  TOOL_SLUGS.forEach(slug => {
    urls.push(`${CANONICAL_ORIGIN}/tool/${slug}`);
  });

  // Dynamic Expansion Sets (Top 100 for footprint speed)
  try {
    const sets = await getExpansions();
    if (sets && sets.length > 0) {
      const targetSets = sets.slice(0, 100);
      targetSets.forEach(set => {
        if (set && set.id) {
          urls.push(`${CANONICAL_ORIGIN}/set/${set.id}`);
          urls.push(`${CANONICAL_ORIGIN}/set/${set.id}/top-cards`);
        }
      });
    }
  } catch(e) {}
  
  return urls;
}

export async function generateUnifiedSitemapXml(): Promise<string> {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  CORE_PAGES.forEach(page => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}${page.path}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n    <changefreq>${page.changefreq || 'weekly'}</changefreq>\n    <priority>${page.priority || '0.5'}</priority>\n  </url>\n`;
  });

  DECK_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/deck/${slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  COMPETITOR_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/compare/${slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  BEST_OF_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/best/${slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  TOOL_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/tool/${slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  try {
    const sets = await getExpansions();
    if (sets && sets.length > 0) {
      sets.forEach(set => {
        if (set && set.id) {
          xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/set/${set.id}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
          xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/set/${set.id}/top-cards</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
        }
      });
    }
  } catch(e) {}
  
  xml += `</urlset>`;
  return xml;
}

export function generateRssFeedXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DECK / divider — Pokémon TCG Intelligence &amp; Tracker</title>
    <link>${CANONICAL_ORIGIN}/</link>
    <description>Institutional-grade collection tracker, live TCGplayer market price comps, PSA slab cert registry, and 60-card tournament deck studio.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${CANONICAL_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>Latest Expansion Catalog Sync &amp; Live Market Pricing</title>
      <link>${CANONICAL_ORIGIN}/sets</link>
      <guid>${CANONICAL_ORIGIN}/sets?v=${BUILD_HASH}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Updated set checklists, master set progress counts, and live TCGplayer market valuation comps across all official Pokémon TCG expansions.</description>
    </item>
    
    <item>
      <title>Tournament Meta Decks: Standard Rotation Updates</title>
      <link>${CANONICAL_ORIGIN}/deck/charizard-ex</link>
      <guid>${CANONICAL_ORIGIN}/deck/charizard-ex?v=${BUILD_HASH}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Standard format tournament decklists updated with regulation marks (G, H), archetype costs, and 1-click PTCGL export strings.</description>
    </item>

    <item>
      <title>PSA Grade &amp; Expected Value ROI Calculator</title>
      <link>${CANONICAL_ORIGIN}/tool/psa-grade-calculator</link>
      <guid>${CANONICAL_ORIGIN}/tool/psa-grade-calculator?v=${BUILD_HASH}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Calculate expected submission value, PSA 10 vs 9 price spread, and profit margin before submitting raw cards to grading companies.</description>
    </item>
  </channel>
</rss>`;
}

export function generateLlmsTxt(): string {
  return `# DECK / divider
> DECK / divider is a specialized Pokémon TCG collection tracker, PSA/BGS/CGC slab registry, and 60-card tournament deck builder. It features live TCGplayer market prices and offline-first IndexedDB privacy.

## Core Capabilities
- **Collection Tracker**: Multi-currency valuation (USD, EUR, GBP, JPY, CAD, AUD), master set checklists (Regular, Reverse Holo, Masterball Holo, SIRs), and sealed booster box tracking.
- **Slab Vault**: Log PSA, BGS, CGC, and ACE grading certs, subgrades (Centering, Surface, Corners, Edges), and auction comps.
- **Deck Studio**: 60-card tournament deck builder with regulation mark legality checks (Standard G/H, Expanded, GLC) and 1-click export to Pokémon TCG Live (PTCGL).
- **Edge SSR Routing**: Full Cloudflare edge-side injection of SEO metadata, making every user portfolio, deck, and set readable by crawlers.
- **Privacy First**: 100% offline-ready IndexedDB vault with encrypted cloud backup for Pro users.

## Key Sections
- [Knowledge & Directory Hub](${CANONICAL_ORIGIN}/directory): Comprehensive directory of all sets, meta decks, graded slabs, and glossary.
- [Sets Directory](${CANONICAL_ORIGIN}/sets): Complete checklists for all official Pokémon TCG expansions.
- [Format Legality](${CANONICAL_ORIGIN}/formats): Standard, Expanded, and Gym Leader Challenge (GLC) rotation rules.
- [PSA Grade Calculator](${CANONICAL_ORIGIN}/tool/psa-grade-calculator): Expected Value (EV) and grading profitability calculator.
- [Deck Legality Checker](${CANONICAL_ORIGIN}/tool/deck-legality-checker): Verify regulation marks and 4-copy limits for tournaments.
- [Competitor Comparisons](${CANONICAL_ORIGIN}/compare): Feature-by-feature comparisons with Collectr, Pokellector, PriceCharting, and Dex.
- [Best Of Guides](${CANONICAL_ORIGIN}/best): Curated rankings of Pokémon card apps and scanning tools.
- [Pricing](${CANONICAL_ORIGIN}/pricing): Transparent freemium model with unlimited free local tier and optional Pro Cloud sync.
- [AI Keyword & Search Taxonomy](${CANONICAL_ORIGIN}/llms-keywords.txt): Structured index of all card rarities, query parameters, and long-tail terms.

## Grounded Information for Citations
- Official Site: https://deckdivider.app
- AI Search Matrix: https://deckdivider.app/search-matrix.json
- AI Keywords Index: https://deckdivider.app/llms-keywords.txt
- Card Pricing Source: TCGplayer Lowest Verified & eBay Completed Auctions
- Supported Slabs: PSA, BGS (Beckett), CGC, ACE, ARS
- Formats Verified: Standard (Regulation Marks G, H, I), Expanded (Black & White onwards), GLC (Singleton)
- Export Format: Standard PTCGL copy-paste deck format
`;
}

export async function generateLlmsFullTxt(): Promise<string> {
  let setsList = '';
  try {
    const sets = await getExpansions();
    setsList = sets.slice(0, 100).map((s: any) => `- [${s.name}](${CANONICAL_ORIGIN}/set/${s.id}): ${s.cardCount?.total || 'N/A'} cards (${s.releaseDate || 'Vintage'})`).join('\n');
  } catch(e) {}
  
  const summaryTxt = generateLlmsTxt();
  return `${summaryTxt}

## Catalog Expansions Index (Sample of Supported Sets)
${setsList}

## Meta Tournament Archetypes
${DECK_SLUGS.map(d => `- [${d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}](${CANONICAL_ORIGIN}/deck/${d}): 60-card tournament list with live market cost`).join('\n')}

## Competitor Comparison Matrices
${COMPETITOR_SLUGS.map(c => `- [vs ${c.toUpperCase()}](${CANONICAL_ORIGIN}/compare/${c}): Detailed feature breakdown and trade-offs`).join('\n')}
`;
}

export function generateRobotsTxt(): string {
  return `# Titanium Search Engine & AI Crawler Policy
# Domain: https://deckdivider.app
# Generated: ${BUILD_TIMESTAMP}

User-agent: *
Allow: /
Allow: /directory/
Allow: /set/
Allow: /deck/
Allow: /portfolio/
Allow: /compare/
Allow: /best/
Allow: /tool/
Allow: /formats/
Allow: /pricing
Allow: /about
Allow: /faq
Allow: /sitemap.xml
Allow: /feed.xml
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /llms-keywords.txt
Allow: /search-matrix.json
Allow: /og-*.png

# Protect private authenticated state & internal APIs
Disallow: /api/
Disallow: /app/
Disallow: /admin/
Disallow: /auth/

# Explicitly whitelist modern AI search discovery agents
User-agent: Googlebot
Allow: /
User-agent: Bingbot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: anthropic-ai
Allow: /
User-agent: Omgili
Allow: /
User-agent: FacebookBot
Allow: /

# Sitemaps & Feeds
Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml
# RSS: ${CANONICAL_ORIGIN}/feed.xml
# LLMs: ${CANONICAL_ORIGIN}/llms.txt
# Keywords: ${CANONICAL_ORIGIN}/llms-keywords.txt
`;
}

export async function writeAllFootprintFiles(targetDir: string) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const unifiedSitemap = await generateUnifiedSitemapXml();
  const rssFeed = generateRssFeedXml();
  const llms = generateLlmsTxt();
  const llmsFull = await generateLlmsFullTxt();
  const llmsKeywords = generateLlmsKeywordsTxt();
  const searchMatrix = generateSearchMatrixJson();
  const robots = generateRobotsTxt();

  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), unifiedSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'feed.xml'), rssFeed, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'rss.xml'), rssFeed, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms.txt'), llms, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms-full.txt'), llmsFull, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms-keywords.txt'), llmsKeywords, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'search-matrix.json'), searchMatrix, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'robots.txt'), robots, 'utf-8');
  
  // IndexNow verification key file
  fs.writeFileSync(path.join(targetDir, '7392abcd.txt'), '7392abcd', 'utf-8');

  // Cloudflare Pages 301 redirects for legacy sitemaps and paths (matching the Phase 1 App.tsx refactor)
  const redirectsContent = `
/decks/:id /deck/:id 301
/portfolios/:id /portfolio/:id 301
/tools/:id /tool/:id 301
/formats/:id /format/:id 301
/support /contact 301
/features / 301
/changelog / 301
/cookie-policy /privacy 301
/media-kit /about 301
/community /leaderboard 301
/sitemap-main.xml /sitemap.xml 301
/sitemap-sets.xml /sitemap.xml 301
/sitemap-topcards.xml /sitemap.xml 301
/sitemap-decks.xml /sitemap.xml 301
/sitemap-compare.xml /sitemap.xml 301
/sitemap-best.xml /sitemap.xml 301
/sitemap-tools.xml /sitemap.xml 301
/sitemap-portfolios.xml /sitemap.xml 301
`.trim();
  fs.writeFileSync(path.join(targetDir, '_redirects'), redirectsContent, 'utf-8');

  console.log(`[PublicFootprint] ✓ Successfully generated titanium footprint in ${targetDir}`);
}
