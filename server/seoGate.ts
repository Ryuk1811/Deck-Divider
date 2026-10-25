import { getCardDetail, getSetDetail, getExpansions } from './tcgCatalogManager.js';
import { getTournamentDeckBySlug, TOURNAMENT_DECKS } from '../src/data/tournamentDecks.js';
import { SITE_CONFIG } from '../src/config/site.config.js';

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface SeoGateResult {
  statusCode: number; // 200, 301, 404, 410
  redirectTarget?: string;
  canonicalUrl: string;
  robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
  isSitemapEligible: boolean;
  isThinOrPlaceholder: boolean;
  pageType: 'core' | 'set' | 'card' | 'deck' | 'format' | 'tool' | 'compare' | 'directory' | 'private' | 'not_found';
  entityTitle?: string;
  entityDescription?: string;
  ogImage?: string;
  breadcrumbs: BreadcrumbItem[];
}

const CANONICAL_ORIGIN = SITE_CONFIG.canonicalOrigin;
const BRAND_TITLE_SUFFIX = ` | ${SITE_CONFIG.shortBrandName}`;

// Core Known Pages
const KNOWN_CORE_ROUTES = new Set([
  '/',
  '/cards',
  '/sets',
  '/directory',
  '/directory/sets-index',
  '/directory/decks-index',
  '/directory/slabs-index',
  '/directory/glossary',
  '/pricing',
  '/changelog',
  '/compare',
  '/best',
  '/tools',
  '/tools/grading-fee-calculator',
  '/tools/format-checker',
  '/tools/lot-calculator',
  '/leaderboard',
  '/about',
  '/how-it-works',
  '/faq',
  '/contact',
  '/founder',
  '/data-methodology',
  '/privacy',
  '/terms',
  '/security',
  '/formats',
  '/format/standard',
  '/format/expanded',
  '/format/glc',
  '/socials',
  '/partners/ptc-collectibles',
]);

const KNOWN_COMPARE_SLUGS = new Set([
  'collectr',
  'tcgplayer',
  'dex',
  'pokecardvalues',
  'pricecharting',
  'spreadsheets',
]);

/**
 * Universal SEO & Indexability Gate
 * Decides HTTP status code, robots directive, self-canonical URL, and sitemap eligibility.
 */
export async function evaluateRouteGate(
  rawPath: string,
  queryParams?: Record<string, any>
): Promise<SeoGateResult> {
  // 1. URL Normalization: Remove trailing slash (except root) and query/hash
  let normalized = (rawPath || '/').split('?')[0].split('#')[0];
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  // 2. Check Aliases & Legacy 301 Redirects
  if (SITE_CONFIG.seoGate.supportedAliases[normalized]) {
    const target = SITE_CONFIG.seoGate.supportedAliases[normalized];
    return {
      statusCode: 301,
      redirectTarget: target,
      canonicalUrl: `${CANONICAL_ORIGIN}${target}`,
      robots: 'noindex, follow',
      isSitemapEligible: false,
      isThinOrPlaceholder: false,
      pageType: 'core',
      breadcrumbs: [],
    };
  }

  // 3. Private / App Shell / Auth Routes (noindex, nofollow, out of sitemaps)
  if (
    normalized.startsWith('/app') ||
    normalized.startsWith('/dashboard') ||
    normalized === '/auth' ||
    normalized.startsWith('/api/')
  ) {
    return {
      statusCode: 200,
      canonicalUrl: `${CANONICAL_ORIGIN}${normalized}`,
      robots: 'noindex, nofollow',
      isSitemapEligible: false,
      isThinOrPlaceholder: false,
      pageType: 'private',
      breadcrumbs: [],
    };
  }

  // 4. Core Static Pages
  if (KNOWN_CORE_ROUTES.has(normalized)) {
    let title = `${SITE_CONFIG.brandName}`;
    let description = SITE_CONFIG.description;
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', item: CANONICAL_ORIGIN },
    ];

    if (normalized !== '/') {
      const pageName = normalized
        .split('/')
        .filter(Boolean)
        .map((p) => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' '))
        .join(' > ');
      title = `${pageName}${BRAND_TITLE_SUFFIX}`;
      breadcrumbs.push({ name: pageName, item: `${CANONICAL_ORIGIN}${normalized}` });
    }

    // Custom titles for key marketing tools & formats
    if (normalized === '/tools/grading-fee-calculator') {
      title = `PSA, BGS & CGC Grading Fee Calculator 2026${BRAND_TITLE_SUFFIX}`;
      description = 'Calculate exact submission fees, shipping costs, turnaround times, and estimated ROI across PSA, Beckett, CGC, and ACE grading services.';
    } else if (normalized === '/tools/format-checker') {
      title = `2026 Standard Legality Checker (H, I, J Marks)${BRAND_TITLE_SUFFIX}`;
      description = 'Check 60-card tournament deck legality against official 2026 Pokémon Standard rotation marks H, I, and J.';
    } else if (normalized === '/format/standard') {
      title = `Standard Format Legal Sets & Meta Decks (2026)${BRAND_TITLE_SUFFIX}`;
      description = 'Official Standard format regulation marks H, I, and J legal card list, rotated card rules, and competitive meta archetypes.';
    }

    return {
      statusCode: 200,
      canonicalUrl: `${CANONICAL_ORIGIN}${normalized}`,
      robots: 'index, follow',
      isSitemapEligible: true,
      isThinOrPlaceholder: false,
      pageType: 'core',
      entityTitle: title,
      entityDescription: description,
      ogImage: `${CANONICAL_ORIGIN}/og-image.png?v=2`,
      breadcrumbs,
    };
  }

  // 5. Compare Subroutes (/compare/:slug)
  if (normalized.startsWith('/compare/')) {
    const slug = normalized.replace('/compare/', '').toLowerCase();
    if (!KNOWN_COMPARE_SLUGS.has(slug)) {
      return create404Result(normalized, 'Competitor comparison');
    }

    const competitorNames: Record<string, string> = {
      collectr: 'Collectr',
      tcgplayer: 'TCGplayer App',
      dex: 'Dex',
      pokecardvalues: 'PokéCardValues',
      pricecharting: 'PriceCharting',
      spreadsheets: 'Spreadsheets',
    };
    const compName = competitorNames[slug] || slug;

    return {
      statusCode: 200,
      canonicalUrl: `${CANONICAL_ORIGIN}/compare/${slug}`,
      robots: 'index, follow',
      isSitemapEligible: true,
      isThinOrPlaceholder: false,
      pageType: 'compare',
      entityTitle: `DECK / divider vs ${compName} — Pokémon TCG Comparison (2026)${BRAND_TITLE_SUFFIX}`,
      entityDescription: `Detailed feature-by-feature comparison of DECK / divider vs ${compName}. Pricing transparency, slab registry, format legality, and offline sync.`,
      ogImage: `${CANONICAL_ORIGIN}/og-image.png?v=2`,
      breadcrumbs: [
        { name: 'Home', item: CANONICAL_ORIGIN },
        { name: 'Compare', item: `${CANONICAL_ORIGIN}/compare` },
        { name: `vs ${compName}`, item: `${CANONICAL_ORIGIN}/compare/${slug}` },
      ],
    };
  }

  // 6. Dynamic Set Route (/set/:setId)
  if (normalized.startsWith('/set/')) {
    const setId = normalized.replace('/set/', '').trim();
    if (!setId) {
      return create404Result(normalized, 'Set');
    }

    const setDetail = await getSetDetail(setId);
    if (!setDetail) {
      // Nonexistent set ID -> Hard 404
      return create404Result(normalized, 'Expansion Set');
    }

    const cardCount = setDetail.cards?.length || setDetail.cardCount?.total || 0;
    // Real set but 0 cards catalogued or placeholder -> 200 OK with noindex to prevent soft 404
    const isThin = cardCount === 0;

    const title = `${setDetail.name} (${setDetail.id.toUpperCase()}): ${cardCount > 0 ? `${cardCount} Cards Checklist` : 'Set Checklist'}${BRAND_TITLE_SUFFIX}`;
    const description = `Browse complete card checklist, reverse holo variants, secret illustration rares, and real-time market comps for ${setDetail.name}.`;

    return {
      statusCode: 200,
      canonicalUrl: `${CANONICAL_ORIGIN}/set/${setDetail.id}`,
      robots: isThin ? 'noindex, follow' : 'index, follow',
      isSitemapEligible: !isThin,
      isThinOrPlaceholder: isThin,
      pageType: 'set',
      entityTitle: title,
      entityDescription: description,
      ogImage: setDetail.logo || `${CANONICAL_ORIGIN}/og-image.png?v=2`,
      breadcrumbs: [
        { name: 'Home', item: CANONICAL_ORIGIN },
        { name: 'Sets', item: `${CANONICAL_ORIGIN}/sets` },
        { name: setDetail.name, item: `${CANONICAL_ORIGIN}/set/${setDetail.id}` },
      ],
    };
  }

  // 7. Dynamic Card Route (/card/:cardId)
  if (normalized.startsWith('/card/')) {
    const cardId = normalized.replace('/card/', '').trim();
    if (!cardId) {
      return create404Result(normalized, 'Card');
    }

    const cardDetail = await getCardDetail(cardId);
    if (!cardDetail) {
      // Nonexistent card ID -> Hard 404
      return create404Result(normalized, 'Pokémon Card');
    }

    const setName = cardDetail.set?.name || 'Pokémon TCG';
    const cardNum = cardDetail.localId ? `#${cardDetail.localId}` : '';
    const title = `${cardDetail.name} ${cardNum} — ${setName} Market Price & Legality${BRAND_TITLE_SUFFIX}`;
    const description = `View market pricing, grading values (PSA 10, 9), tournament legality marks, and card variants for ${cardDetail.name} (${setName}).`;

    return {
      statusCode: 200,
      canonicalUrl: `${CANONICAL_ORIGIN}/card/${cardDetail.id}`,
      robots: 'index, follow',
      isSitemapEligible: true,
      isThinOrPlaceholder: false,
      pageType: 'card',
      entityTitle: title,
      entityDescription: description,
      ogImage: cardDetail.image || `${CANONICAL_ORIGIN}/og-image.png?v=2`,
      breadcrumbs: [
        { name: 'Home', item: CANONICAL_ORIGIN },
        { name: 'Cards', item: `${CANONICAL_ORIGIN}/cards` },
        { name: setName, item: `${CANONICAL_ORIGIN}/set/${cardDetail.set?.id || ''}` },
        { name: cardDetail.name, item: `${CANONICAL_ORIGIN}/card/${cardDetail.id}` },
      ],
    };
  }

  // 8. Dynamic Tournament Deck Route (/deck/:slug)
  if (normalized.startsWith('/deck/')) {
    const slug = normalized.replace('/deck/', '').trim();
    const tournamentDeck = getTournamentDeckBySlug(slug);

    if (tournamentDeck) {
      const title = `${tournamentDeck.name} — Standard Tournament Deck List${BRAND_TITLE_SUFFIX}`;
      const description = `${tournamentDeck.name} 60-card tournament list. Regulation mark legality, estimated deck build price ($${tournamentDeck.estPrice}), and PTCGL export text.`;

      return {
        statusCode: 200,
        canonicalUrl: `${CANONICAL_ORIGIN}/deck/${tournamentDeck.slug}`,
        robots: 'index, follow',
        isSitemapEligible: true,
        isThinOrPlaceholder: false,
        pageType: 'deck',
        entityTitle: title,
        entityDescription: description,
        ogImage: `${CANONICAL_ORIGIN}/og-image.png?v=2`,
        breadcrumbs: [
          { name: 'Home', item: CANONICAL_ORIGIN },
          { name: 'Tournament Decks', item: `${CANONICAL_ORIGIN}/format/standard` },
          { name: tournamentDeck.name, item: `${CANONICAL_ORIGIN}/deck/${tournamentDeck.slug}` },
        ],
      };
    }

    // If it's a user-shared deck with encoded payload, return 200 with noindex to prevent thin indexing
    if (queryParams?.d) {
      return {
        statusCode: 200,
        canonicalUrl: `${CANONICAL_ORIGIN}${normalized}`,
        robots: 'noindex, follow',
        isSitemapEligible: false,
        isThinOrPlaceholder: true,
        pageType: 'deck',
        breadcrumbs: [{ name: 'Home', item: CANONICAL_ORIGIN }],
      };
    }

    // Nonexistent deck with no payload -> Hard 404
    return create404Result(normalized, 'Pokémon TCG Deck');
  }

  // 9. Default Fallback -> Hard 404 (Never return 200 OK home shells for invalid routes)
  return create404Result(normalized, 'Page');
}

/**
 * Creates an authoritative 404 response payload
 */
function create404Result(path: string, entityLabel: string): SeoGateResult {
  return {
    statusCode: 404,
    canonicalUrl: `${CANONICAL_ORIGIN}${path}`,
    robots: 'noindex, follow',
    isSitemapEligible: false,
    isThinOrPlaceholder: true,
    pageType: 'not_found',
    entityTitle: `404 Not Found — ${entityLabel} Does Not Exist${BRAND_TITLE_SUFFIX}`,
    entityDescription: `The requested ${entityLabel.toLowerCase()} could not be found in the DECK / divider catalogue. Search over 18,400+ Pokémon cards and expansions.`,
    breadcrumbs: [{ name: 'Home', item: CANONICAL_ORIGIN }],
  };
}

/**
 * Fast Sitemap Eligibility Checker for sitemap generators
 */
export async function isPathSitemapEligible(path: string): Promise<boolean> {
  const result = await evaluateRouteGate(path);
  return result.isSitemapEligible && result.statusCode === 200;
}
