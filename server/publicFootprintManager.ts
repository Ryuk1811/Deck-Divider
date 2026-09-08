import fs from 'fs';
import path from 'path';
import { getExpansions, TCGSet } from './tcgCatalogManager.js';

// Global Build / Deployment Footprint Stamp
// Evaluated once at process startup or build time to ensure consistency across all endpoints
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

// 1. Core Platform & Directory Pages
export const CORE_PAGES: RouteEntry[] = [
  { path: '/', lastmod: BUILD_DATE, priority: '1.0', changefreq: 'daily' },
  { path: '/pricing', lastmod: BUILD_DATE, priority: '0.9', changefreq: 'weekly' },
  { path: '/features', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/how-it-works', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'monthly' },
  { path: '/sets', lastmod: BUILD_DATE, priority: '0.9', changefreq: 'daily' },
  { path: '/decks', lastmod: BUILD_DATE, priority: '0.9', changefreq: 'daily' },
  { path: '/formats', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/formats/standard', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/formats/expanded', lastmod: BUILD_DATE, priority: '0.7', changefreq: 'monthly' },
  { path: '/formats/glc', lastmod: BUILD_DATE, priority: '0.7', changefreq: 'monthly' },
  { path: '/compare', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/best', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/tools', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
  { path: '/about', lastmod: BUILD_DATE, priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', lastmod: BUILD_DATE, priority: '0.7', changefreq: 'monthly' },
  { path: '/leaderboard', lastmod: BUILD_DATE, priority: '0.7', changefreq: 'daily' },
  { path: '/changelog', lastmod: BUILD_DATE, priority: '0.6', changefreq: 'weekly' },
  { path: '/support', lastmod: BUILD_DATE, priority: '0.6', changefreq: 'monthly' },
  { path: '/contact', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/terms', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/cookie-policy', lastmod: BUILD_DATE, priority: '0.4', changefreq: 'monthly' },
  { path: '/security', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
  { path: '/media-kit', lastmod: BUILD_DATE, priority: '0.5', changefreq: 'monthly' },
];

// 2. Tournament Decks & Archetypes
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

// 5. Interactive Calculators & Tools
export const TOOL_SLUGS: string[] = [
  'psa-grade-calculator',
  'deck-legality-checker',
  'geo-inspector',
];

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Builds standard XML sitemap from a list of route entries
 */
export function buildUrlsetXml(entries: RouteEntry[]): string {
  const urls = entries
    .map(e => `  <url>
    <loc>${escapeXml(`${CANONICAL_ORIGIN}${e.path}`)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    ${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ''}
    ${e.priority ? `<priority>${e.priority}</priority>` : ''}
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

/**
 * Master Sitemap Index (/sitemap.xml)
 * Points to specialized sub-sitemaps for maximum crawl efficiency
 */
export function generateSitemapIndexXml(): string {
  const subSitemaps = [
    { loc: `${CANONICAL_ORIGIN}/sitemap-main.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-sets.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-topcards.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-decks.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-compare.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-best.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-tools.xml`, lastmod: BUILD_DATE },
    { loc: `${CANONICAL_ORIGIN}/sitemap-portfolios.xml`, lastmod: BUILD_DATE },
  ];

  const sitemapsXml = subSitemaps
    .map(s => `  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapsXml}
</sitemapindex>`;
}

/**
 * Main Core Platform Sitemap (/sitemap-main.xml)
 */
export function generateSitemapMainXml(): string {
  return buildUrlsetXml(CORE_PAGES);
}

/**
 * Expansion Set Checklists (/sitemap-sets.xml)
 * Points to all 218+ set checklists (/set/:id)
 */
export async function generateSitemapSetsXml(): Promise<string> {
  const sets: TCGSet[] = await getExpansions();
  const entries: RouteEntry[] = sets.map(s => ({
    path: `/set/${s.id}`,
    lastmod: BUILD_DATE,
    priority: s.releaseDate && s.releaseDate.startsWith('202') ? '0.9' : '0.8',
    changefreq: 'weekly',
  }));

  return buildUrlsetXml(entries);
}

/**
 * Expansion Set Top Chase Cards (/sitemap-topcards.xml)
 * Points to all 218+ set top cards pages (/set/:id/top-cards)
 */
export async function generateSitemapTopCardsXml(): Promise<string> {
  const sets: TCGSet[] = await getExpansions();
  const entries: RouteEntry[] = sets.map(s => ({
    path: `/set/${s.id}/top-cards`,
    lastmod: BUILD_DATE,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  return buildUrlsetXml(entries);
}

/**
 * Tournament Decks Sitemap (/sitemap-decks.xml)
 */
export function generateSitemapDecksXml(): string {
  const entries: RouteEntry[] = DECK_SLUGS.map(slug => ({
    path: `/decks/${slug}`,
    lastmod: BUILD_DATE,
    priority: '0.85',
    changefreq: 'weekly',
  }));

  return buildUrlsetXml(entries);
}

/**
 * Competitor Comparisons Sitemap (/sitemap-compare.xml)
 */
export function generateSitemapCompareXml(): string {
  const entries: RouteEntry[] = [
    { path: '/compare', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
    ...COMPETITOR_SLUGS.map(slug => ({
      path: `/compare/${slug}`,
      lastmod: BUILD_DATE,
      priority: '0.75',
      changefreq: 'weekly',
    })),
  ];

  return buildUrlsetXml(entries);
}

/**
 * Best-Of Guides Sitemap (/sitemap-best.xml)
 */
export function generateSitemapBestXml(): string {
  const entries: RouteEntry[] = [
    { path: '/best', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
    ...BEST_OF_SLUGS.map(slug => ({
      path: `/best/${slug}`,
      lastmod: BUILD_DATE,
      priority: '0.8',
      changefreq: 'weekly',
    })),
  ];

  return buildUrlsetXml(entries);
}

/**
 * Tools & Calculators Sitemap (/sitemap-tools.xml)
 */
export function generateSitemapToolsXml(): string {
  const entries: RouteEntry[] = [
    { path: '/tools', lastmod: BUILD_DATE, priority: '0.8', changefreq: 'weekly' },
    ...TOOL_SLUGS.map(slug => ({
      path: `/tools/${slug}`,
      lastmod: BUILD_DATE,
      priority: '0.75',
      changefreq: 'monthly',
    })),
  ];

  return buildUrlsetXml(entries);
}

/**
 * Retrieves ALL public canonical URLs across the entire domain
 * Used for batch IndexNow pings and automated audits
 */
export async function getAllPublicUrls(): Promise<string[]> {
  const sets: TCGSet[] = await getExpansions();

  const urls: string[] = [
    ...CORE_PAGES.map(p => `${CANONICAL_ORIGIN}${p.path}`),
    ...sets.map(s => `${CANONICAL_ORIGIN}/set/${s.id}`),
    ...sets.map(s => `${CANONICAL_ORIGIN}/set/${s.id}/top-cards`),
    ...DECK_SLUGS.map(slug => `${CANONICAL_ORIGIN}/decks/${slug}`),
    ...COMPETITOR_SLUGS.map(slug => `${CANONICAL_ORIGIN}/compare/${slug}`),
    ...BEST_OF_SLUGS.map(slug => `${CANONICAL_ORIGIN}/best/${slug}`),
    ...TOOL_SLUGS.map(slug => `${CANONICAL_ORIGIN}/tools/${slug}`),
  ];

  return Array.from(new Set(urls));
}

/**
 * Real-Time RSS / Atom Syndication Feed (/feed.xml & /rss.xml)
 * Enables immediate indexing by Google News, Feedly, and syndication aggregators
 */
export function generateRssFeedXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>DECK / divider — Pokémon TCG Intelligence, Slabs &amp; Deck Studio</title>
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
      <link>${CANONICAL_ORIGIN}/decks</link>
      <guid>${CANONICAL_ORIGIN}/decks?v=${BUILD_HASH}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Standard format tournament decklists updated with regulation marks (F, G, H), archetype costs, and 1-click PTCGL export strings.</description>
    </item>

    <item>
      <title>PSA Grade &amp; Expected Value ROI Calculator</title>
      <link>${CANONICAL_ORIGIN}/tools/psa-grade-calculator</link>
      <guid>${CANONICAL_ORIGIN}/tools/psa-grade-calculator?v=${BUILD_HASH}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Calculate expected submission value, PSA 10 vs 9 price spread, and profit margin before submitting raw cards to grading companies.</description>
    </item>
  </channel>
</rss>`;
}

/**
 * Standard-Compliant llms.txt (llmstxt.org)
 * Provides machine-readable domain architecture to Perplexity, ChatGPT, Claude, and Gemini
 */
export function generateLlmsTxt(): string {
  return `# DECK / divider

> DECK / divider is an institutional-grade Pokémon TCG collection tracker, PSA/BGS/CGC slab registry, and 60-card tournament deck studio with live TCGplayer market prices and offline-first IndexedDB privacy.

## Core Capabilities
- **Collection Tracker**: Multi-currency valuation (USD, EUR, GBP, JPY), master set checklists (Regular, Reverse Holo, Masterball Holo, SIRs), and sealed booster box tracking.
- **Slab Vault**: Log PSA, BGS, CGC, and ACE grading certs, subgrades (Centering, Surface, Corners, Edges), and auction comps.
- **Deck Studio**: 60-card tournament deck builder with regulation mark legality checks (Standard G/H, Expanded, GLC) and 1-click export to Pokémon TCG Live (PTCGL).
- **Privacy First**: 100% offline-ready IndexedDB vault with encrypted cloud backup and zero ad tracking.

## Key Sections
- [Sets Directory](${CANONICAL_ORIGIN}/sets): Complete checklists for 218+ Pokémon TCG expansions.
- [Tournament Decks](${CANONICAL_ORIGIN}/decks): Competitive standard decklists and archetype breakdowns.
- [Format Legality](${CANONICAL_ORIGIN}/formats): Standard, Expanded, and Gym Leader Challenge (GLC) rotation rules.
- [PSA Grade Calculator](${CANONICAL_ORIGIN}/tools/psa-grade-calculator): Expected Value (EV) and grading profitability calculator.
- [Deck Legality Checker](${CANONICAL_ORIGIN}/tools/deck-legality-checker): Verify regulation marks and 4-copy limits for tournaments.
- [Competitor Comparisons](${CANONICAL_ORIGIN}/compare): Feature-by-feature comparisons with Collectr, Pokellector, PriceCharting, and Dex.
- [Best Of Guides](${CANONICAL_ORIGIN}/best): Curated rankings of Pokémon card apps and scanning tools.
- [Pricing](${CANONICAL_ORIGIN}/pricing): Transparent freemium model with unlimited free local tier and optional Pro Cloud sync.

## Grounded Information for Citations
- Official Site: https://deckdivider.app
- Card Pricing Source: TCGplayer Lowest Verified & eBay Completed Auctions
- Supported Slabs: PSA, BGS (Beckett), CGC, ACE, ARS
- Formats Verified: Standard (Regulation Marks G, H), Expanded (Black & White onwards), GLC (Singleton)
- Export Format: Standard PTCGL copy-paste deck format
`;
}

/**
 * Deep Machine-Readable Context (/llms-full.txt)
 */
export async function generateLlmsFullTxt(): Promise<string> {
  const sets: TCGSet[] = await getExpansions();
  const summaryTxt = generateLlmsTxt();

  const setsList = sets.slice(0, 100).map(s => `- [${s.name}](${CANONICAL_ORIGIN}/set/${s.id}): ${s.cardCount?.total || 'N/A'} cards (${s.releaseDate || 'Vintage'})`).join('\n');

  return `${summaryTxt}

## Catalog Expansions Index (Sample of 218+ Sets)
${setsList}

## Meta Tournament Archetypes
${DECK_SLUGS.map(d => `- [${d.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}](${CANONICAL_ORIGIN}/decks/${d}): 60-card tournament list with live market cost`).join('\n')}

## Competitor Comparison Matrices
${COMPETITOR_SLUGS.map(c => `- [vs ${c.toUpperCase()}](${CANONICAL_ORIGIN}/compare/${c}): Detailed feature breakdown and trade-offs`).join('\n')}
`;
}

/**
 * High-Security, High-Discovery robots.txt
 */
export function generateRobotsTxt(): string {
  return `# Titanium Search Engine & AI Crawler Policy
# Domain: https://deckdivider.app
# Generated: ${BUILD_TIMESTAMP}

User-agent: *
Allow: /
Allow: /set/
Allow: /decks/
Allow: /compare/
Allow: /best/
Allow: /tools/
Allow: /formats/
Allow: /pricing
Allow: /features
Allow: /about
Allow: /faq
Allow: /changelog
Allow: /sitemap*.xml
Allow: /feed.xml
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /og-*.png

# Protect private authenticated state & internal APIs
Disallow: /api/
Disallow: /app/
Disallow: /admin/

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

# Sitemaps & Feeds
Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-main.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-sets.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-topcards.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-decks.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-compare.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-best.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-tools.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap-portfolios.xml

# Syndication Feed
# RSS: ${CANONICAL_ORIGIN}/feed.xml
# LLMs: ${CANONICAL_ORIGIN}/llms.txt
`;
}

/**
 * Writes all static footprint artifacts into the specified directory (e.g. /public or /dist)
 */
export async function writeAllFootprintFiles(targetDir: string) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const sitemapIndex = generateSitemapIndexXml();
  const sitemapMain = generateSitemapMainXml();
  const sitemapSets = await generateSitemapSetsXml();
  const sitemapTopCards = await generateSitemapTopCardsXml();
  const sitemapDecks = generateSitemapDecksXml();
  const sitemapCompare = generateSitemapCompareXml();
  const sitemapBest = generateSitemapBestXml();
  const sitemapTools = generateSitemapToolsXml();

  const rssFeed = generateRssFeedXml();
  const llms = generateLlmsTxt();
  const llmsFull = await generateLlmsFullTxt();
  const robots = generateRobotsTxt();

  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), sitemapIndex, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-main.xml'), sitemapMain, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-sets.xml'), sitemapSets, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-topcards.xml'), sitemapTopCards, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-decks.xml'), sitemapDecks, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-compare.xml'), sitemapCompare, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-best.xml'), sitemapBest, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-tools.xml'), sitemapTools, 'utf-8');

  fs.writeFileSync(path.join(targetDir, 'feed.xml'), rssFeed, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'rss.xml'), rssFeed, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms.txt'), llms, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms-full.txt'), llmsFull, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'robots.txt'), robots, 'utf-8');

  // IndexNow verification key file
  fs.writeFileSync(path.join(targetDir, '7392abcd.txt'), '7392abcd', 'utf-8');

  console.log(`[PublicFootprint] ✓ Successfully generated titanium footprint in ${targetDir}`);
}
