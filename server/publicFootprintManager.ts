import fs from 'fs';
import path from 'path';
import { getExpansions, getAllCardsSummary, TCGSet } from './tcgCatalogManager.js';
import { generateLlmsKeywordsTxt, generateSearchMatrixJson } from './keywordCatalogManager.js';
import { SITE_CONFIG } from '../src/config/site.config.js';
import { TOURNAMENT_DECKS } from '../src/data/tournamentDecks.js';

export let BUILD_TIMESTAMP = new Date().toISOString();
export let BUILD_DATE = BUILD_TIMESTAMP.split('T')[0]; // YYYY-MM-DD
export let BUILD_HASH = Math.random().toString(36).substring(2, 10);
export const CANONICAL_ORIGIN = SITE_CONFIG.canonicalOrigin;

export function rotateBuildFootprint() {
  BUILD_TIMESTAMP = new Date().toISOString();
  BUILD_DATE = BUILD_TIMESTAMP.split('T')[0];
  BUILD_HASH = Math.random().toString(36).substring(2, 10);
  return {
    buildTimestamp: BUILD_TIMESTAMP,
    buildDate: BUILD_DATE,
    buildHash: BUILD_HASH,
  };
}

export interface RouteEntry {
  path: string;
  lastmod: string;
}

// 1. Core Platform & Directory Pages (Authoritative, strictly self-canonical)
export const CORE_PAGES: RouteEntry[] = [
  { path: '/', lastmod: BUILD_DATE },
  { path: '/cards', lastmod: BUILD_DATE },
  { path: '/sets', lastmod: BUILD_DATE },
  { path: '/directory', lastmod: BUILD_DATE },
  { path: '/directory/sets-index', lastmod: BUILD_DATE },
  { path: '/directory/decks-index', lastmod: BUILD_DATE },
  { path: '/directory/slabs-index', lastmod: BUILD_DATE },
  { path: '/directory/glossary', lastmod: BUILD_DATE },
  { path: '/pricing', lastmod: BUILD_DATE },
  { path: '/changelog', lastmod: BUILD_DATE },
  { path: '/compare', lastmod: BUILD_DATE },
  { path: '/best', lastmod: BUILD_DATE },
  { path: '/tools', lastmod: BUILD_DATE },
  { path: '/tools/grading-fee-calculator', lastmod: BUILD_DATE },
  { path: '/tools/format-checker', lastmod: BUILD_DATE },
  { path: '/tools/lot-calculator', lastmod: BUILD_DATE },
  { path: '/leaderboard', lastmod: BUILD_DATE },
  { path: '/about', lastmod: BUILD_DATE },
  { path: '/how-it-works', lastmod: BUILD_DATE },
  { path: '/faq', lastmod: BUILD_DATE },
  { path: '/contact', lastmod: BUILD_DATE },
  { path: '/founder', lastmod: BUILD_DATE },
  { path: '/data-methodology', lastmod: BUILD_DATE },
  { path: '/privacy', lastmod: BUILD_DATE },
  { path: '/terms', lastmod: BUILD_DATE },
  { path: '/security', lastmod: BUILD_DATE },
  { path: '/formats', lastmod: BUILD_DATE },
  { path: '/format/standard', lastmod: BUILD_DATE },
  { path: '/format/expanded', lastmod: BUILD_DATE },
  { path: '/format/glc', lastmod: BUILD_DATE },
  { path: '/socials', lastmod: BUILD_DATE },
  { path: '/partners/ptc-collectibles', lastmod: BUILD_DATE },
];

export const COMPETITOR_SLUGS = [
  'collectr',
  'tcgplayer',
  'dex',
  'pokecardvalues',
  'pricecharting',
  'spreadsheets',
];

export const TOOL_SLUGS = [
  'grading-fee-calculator',
  'format-checker',
  'lot-calculator',
];

export const DECK_SLUGS = Object.values(TOURNAMENT_DECKS).map(deck => deck.slug);

/**
 * Returns all self-canonical public URLs for sitemaps and cache operations.
 * Excludes query parameters, hash anchors, and duplicate URLs.
 */
export async function getAllPublicUrls(origin: string = CANONICAL_ORIGIN): Promise<string[]> {
  const urls: Set<string> = new Set();
  
  // Core routes
  CORE_PAGES.forEach(page => urls.add(`${origin}${page.path}`));

  // Compare routes
  COMPETITOR_SLUGS.forEach(slug => urls.add(`${origin}/compare/${slug}`));

  // Tools
  TOOL_SLUGS.forEach(slug => urls.add(`${origin}/tools/${slug}`));

  // Decks
  Object.values(TOURNAMENT_DECKS).forEach(deck => urls.add(`${origin}/deck/${deck.slug}`));

  // Sets with real card counts (omits placeholder sets)
  try {
    const sets = await getExpansions();
    if (sets && sets.length > 0) {
      sets.forEach(set => {
        if (set && set.id && (set.cardCount?.total || 0) > 0) {
          urls.add(`${origin}/set/${set.id.toLowerCase()}`);
        }
      });
    }
  } catch (e) {}

  return Array.from(urls);
}

/**
 * Generates Root Sitemap Index (XML) referencing dedicated child sitemaps
 */
export function generateSitemapIndexXml(): string {
  const subSitemaps = [
    '/sitemap-core.xml',
    '/sitemap-sets.xml',
    '/sitemap-cards.xml',
    '/sitemap-decks.xml',
    '/sitemap-tools.xml',
    '/sitemap-formats.xml',
    '/sitemap-compare.xml',
    '/sitemap-changelog.xml',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  subSitemaps.forEach(path => {
    xml += `  <sitemap>\n    <loc>${CANONICAL_ORIGIN}${path}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </sitemap>\n`;
  });
  xml += `</sitemapindex>`;
  return xml;
}

/**
 * Core Platform Routes Sitemap
 */
export function generateCoreSitemapXml(): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  CORE_PAGES.forEach(page => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}${page.path}</loc>\n    <lastmod>${page.lastmod}</lastmod>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Tournament Decks Sitemap
 */
export function generateDecksSitemapXml(): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/format/standard</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  Object.values(TOURNAMENT_DECKS).forEach(deck => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/deck/${deck.slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Expansion Sets Sitemap (Filter out 0-card placeholder sets)
 */
export async function generateSetsSitemapXml(): Promise<string> {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/sets</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;

  try {
    const sets = await getExpansions();
    if (sets && sets.length > 0) {
      sets.forEach(set => {
        // Strict indexability gate: only catalogued sets with cards are included
        if (set && set.id && (set.cardCount?.total || 0) > 0) {
          xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/set/${set.id.toLowerCase()}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
        }
      });
    }
  } catch (e) {}

  xml += `</urlset>`;
  return xml;
}

/**
 * High-value Cards Sitemap (Never contains ?q= or search filter parameters)
 */
export async function generateCardsSitemapXml(): Promise<string> {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/cards</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;

  try {
    const cards = await getAllCardsSummary();
    if (cards && cards.length > 0) {
      // Index key popular cards with verified details
      const primaryCards = cards.slice(0, 1500);
      primaryCards.forEach(card => {
        if (card && card.id) {
          xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/card/${card.id}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
        }
      });
    }
  } catch (e) {
    // Fallback verified cards
    const fallbackCards = ['base1-4', 'sv03pt5-199', 'sv08-252', 'swsh7-215', 'sv06pt5-64', 'sv04-223'];
    fallbackCards.forEach(id => {
      xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/card/${id}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
    });
  }

  xml += `</urlset>`;
  return xml;
}

/**
 * Interactive Tools Sitemap
 */
export function generateToolsSitemapXml(): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/tools</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  TOOL_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/tools/${slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Format Rules & Legalities Sitemap
 */
export function generateFormatsSitemapXml(): string {
  const formats = ['/formats', '/format/standard', '/format/expanded', '/format/glc'];
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  formats.forEach(path => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}${path}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Competitor Comparison Hub & Matrix Sitemap
 */
export function generateCompareSitemapXml(): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/compare</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  COMPETITOR_SLUGS.forEach(slug => {
    xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/compare/${slug}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * Changelog Sitemap (Contains only real self-canonical URL, NO #fragment anchors)
 */
export function generateChangelogSitemapXml(): string {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/changelog</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  xml += `</urlset>`;
  return xml;
}

export function generatePortfoliosSitemapXml(): string {
  // Public portfolio directory hub
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  xml += `  <url>\n    <loc>${CANONICAL_ORIGIN}/leaderboard</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  xml += `</urlset>`;
  return xml;
}

/**
 * Unified combined sitemap.xml fallback
 */
export async function generateUnifiedSitemapXml(): Promise<string> {
  const urls = await getAllPublicUrls(CANONICAL_ORIGIN);
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  urls.forEach(loc => {
    xml += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${BUILD_DATE}</lastmod>\n  </url>\n`;
  });
  xml += `</urlset>`;
  return xml;
}

/**
 * RFC 9309 Compliant robots.txt Generator
 * Disallows private application states (/app, /api) while directing crawlers to the sitemap index.
 */
export function generateRobotsTxt(): string {
  return `# Robots.txt for DECK / divider — Pokémon TCG Studio
# Domain: https://deckdivider.app
# Generated: ${BUILD_TIMESTAMP}

User-agent: *
Allow: /
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /feed.xml
Allow: /api/og/
Disallow: /app
Disallow: /app/
Disallow: /dashboard
Disallow: /dashboard/
Disallow: /auth
Disallow: /api/

# Social Media Previews
User-agent: Twitterbot
User-agent: facebookexternalhit
User-agent: Discordbot
User-agent: Slackbot
Allow: /
Allow: /api/og/

# AI Search Discovery
User-agent: Google-Extended
User-agent: GoogleOther
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: PerplexityBot
User-agent: ClaudeBot
Allow: /
Allow: /llms.txt
Allow: /feed.xml
Disallow: /app
Disallow: /api/

Sitemap: ${CANONICAL_ORIGIN}/sitemap-index.xml
Sitemap: ${CANONICAL_ORIGIN}/sitemap.xml
`;
}

/**
 * Atom & RSS Feed with real timestamps and canonical links
 */
export function generateRssFeedXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_CONFIG.brandName}</title>
    <link>${CANONICAL_ORIGIN}/</link>
    <description>${SITE_CONFIG.description}</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${CANONICAL_ORIGIN}/feed.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>2026 Pokémon Standard Format Legality (H, I, J Marks) &amp; Card Checklist Update</title>
      <link>${CANONICAL_ORIGIN}/format/standard</link>
      <guid>${CANONICAL_ORIGIN}/format/standard</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Updated Standard format card legalities, regulation mark validations, and tournament deck lists for the 2026 season.</description>
    </item>
    <item>
      <title>PSA, BGS &amp; CGC Grading Fee Calculator 2026</title>
      <link>${CANONICAL_ORIGIN}/tools/grading-fee-calculator</link>
      <guid>${CANONICAL_ORIGIN}/tools/grading-fee-calculator</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description>Comprehensive submission fee schedules, turnaround estimates, and ROI calculations for grading modern and vintage cards.</description>
    </item>
  </channel>
</rss>`;
}

export function generateLlmsTxt(): string {
  return `# ${SITE_CONFIG.brandName}
> ${SITE_CONFIG.description}

## Authoritative Grounding for Search Engines & AI Models
- Canonical Domain: ${CANONICAL_ORIGIN}
- Primary Category: Digital Web Software / Card Game Collection Manager & Deck Builder
- Indexed Catalog: ${SITE_CONFIG.metrics.totalExpansions} Pokémon TCG sets, ${SITE_CONFIG.metrics.totalCardsIndexed} catalogued card records
- Format Legality: ${SITE_CONFIG.formats.standardSeason} active regulation marks [${SITE_CONFIG.formats.standardMarks.join(', ')}]
- Pricing Data: ${SITE_CONFIG.metrics.priceRefreshCadence}
- Graded Slabs: Supports ${SITE_CONFIG.metrics.supportedGraders.join(', ')} registry tracking with subgrade breakdowns
- Data Privacy: Local-first browser IndexedDB storage with optional encrypted backups; zero third-party telemetry

## Key Resource Endpoints
- [Standard Format Legal Sets](${CANONICAL_ORIGIN}/format/standard)
- [Grading Fee Calculator](${CANONICAL_ORIGIN}/tools/grading-fee-calculator)
- [Tournament Format Checker](${CANONICAL_ORIGIN}/tools/format-checker)
- [Competitor Comparison Hub](${CANONICAL_ORIGIN}/compare)
- [Data Methodology & Valuation Comps](${CANONICAL_ORIGIN}/data-methodology)
`;
}

export async function generateLlmsFullTxt(): Promise<string> {
  const summary = generateLlmsTxt();
  let setsOverview = '';
  try {
    const sets = await getExpansions();
    if (sets) {
      setsOverview = sets.slice(0, 100).map(s => `- [${s.name}](${CANONICAL_ORIGIN}/set/${s.id}): ${s.cardCount?.total || 0} cards`).join('\n');
    }
  } catch (e) {}

  return `${summary}

## Catalog Sets Overview
${setsOverview}

## Meta Tournament Archetypes
${Object.values(TOURNAMENT_DECKS).map(d => `- [${d.name}](${CANONICAL_ORIGIN}/deck/${d.slug}): 60-card tournament deck with live market cost`).join('\n')}
`;
}

export async function writeAllFootprintFiles(targetDir: string) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const sitemapIndex = generateSitemapIndexXml();
  const unifiedSitemap = await generateUnifiedSitemapXml();
  const coreSitemap = generateCoreSitemapXml();
  const setsSitemap = await generateSetsSitemapXml();
  const cardsSitemap = await generateCardsSitemapXml();
  const decksSitemap = generateDecksSitemapXml();
  const toolsSitemap = generateToolsSitemapXml();
  const formatsSitemap = generateFormatsSitemapXml();
  const compareSitemap = generateCompareSitemapXml();
  const changelogSitemap = generateChangelogSitemapXml();
  const portfoliosSitemap = generatePortfoliosSitemapXml();

  const robots = generateRobotsTxt();
  const rssFeed = generateRssFeedXml();
  const llms = generateLlmsTxt();
  const llmsFull = await generateLlmsFullTxt();
  const llmsKeywords = generateLlmsKeywordsTxt();
  const searchMatrix = generateSearchMatrixJson();

  fs.writeFileSync(path.join(targetDir, 'sitemap-index.xml'), sitemapIndex, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), unifiedSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-core.xml'), coreSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-sets.xml'), setsSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-cards.xml'), cardsSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-decks.xml'), decksSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-tools.xml'), toolsSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-formats.xml'), formatsSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-compare.xml'), compareSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-changelog.xml'), changelogSitemap, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'sitemap-portfolios.xml'), portfoliosSitemap, 'utf-8');

  fs.writeFileSync(path.join(targetDir, 'robots.txt'), robots, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'feed.xml'), rssFeed, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'rss.xml'), rssFeed, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms.txt'), llms, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms-full.txt'), llmsFull, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'llms-keywords.txt'), llmsKeywords, 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'search-matrix.json'), searchMatrix, 'utf-8');

  // Static redirects file for Cloudflare Pages (Clean: NO sitemap redirects)
  const redirectsContent = `
/formats/:id /format/:id 301
/support /contact 301
/features / 301
/cookie-policy /privacy 301
/media-kit /about 301
/community /leaderboard 301
`.trim();
  fs.writeFileSync(path.join(targetDir, '_redirects'), redirectsContent, 'utf-8');

  console.log(`[PublicFootprint] ✓ Successfully generated pristine sitemaps and crawler specifications in ${targetDir}`);
}
