# Zero-UI/UX Google Search Discoverability & E-E-A-T Architecture Plan (Completed)

Strengthen Google Search indexing, algorithmic recommendation, and organic crawl health for **DECK / divider — Pokémon TCG Studio** through **100% underlying code and server architecture improvements**. Per explicit user directive, **zero UI or UX changes were made**—all visual layouts, components, styling, and client interfaces remain untouched. All changes operate strictly at the backend, routing, SSR head injection, HTTP header, sitemap, metadata, and build validation layers.

---

## User Review & Critical Constraints

> [!IMPORTANT]
> **Strict Zero-UI/UX Modification Mandate**:
> - **Visual UI/UX Lockdown**: Absolutely NO alterations to visual layouts, styling, buttons, colors, cards, navigation bars, or client-side UX. The user interface remains visually identical.
> - **Underlying Code Confined**: Changes are 100% limited to:
>   1. Server HTTP response status codes (true 404/410 vs soft 404s).
>   2. SSR `<head>` metadata, canonical tags, OpenGraph tags, and Schema.org JSON-LD scripts.
>   3. Server-side Indexability Gate (`server/seoGate.ts`) and crawler robots directives (`noindex, follow` on thin/placeholder entities, true 404 on unknown entities).
>   4. Dynamic XML Sitemaps (`sitemap-index.xml`, `sitemap-core.xml`, `sitemap-sets.xml`, `sitemap-cards.xml`, `sitemap-tools.xml`).
>   5. HTTP conditional caching headers (`ETag`, `Last-Modified`, cache TTLs).
>   6. Domain plumbing (301 apex redirect, HTTPS enforcement, URL normalization).
>   7. Centralized backend data configs (`platformTruth.ts`, `site.config.ts`) and CI linting scripts (`scripts/lintSeo.ts`).
> - **Brand Standard**: Standardized metadata site name: **`DECK / divider — Pokémon TCG Studio`** (with alternates `["DECK / divider", "DeckDivider"]`).
> - **Bot Citations**: Verified directory and launch citation links remain preserved in HTML for search bot verification without creating new UI badge elements.

---

## 1. Summary of Completed Improvements

### Tier 1: Foundations & Indexability Gate
- [x] **Universal Indexability Gate (`server/seoGate.ts`)**: Built `evaluateRouteGate()` and `isPathSitemapEligible()`. Invalid cards, sets, or deck routes now return true HTTP 404 status codes (eliminating Google's Soft 404 penalty). Real entities with placeholder or 0-card counts receive `<meta name="robots" content="noindex, follow">` and are excluded from sitemaps.
- [x] **Sitemap Purity & Single Index (`server/publicFootprintManager.ts`)**: Structured clean `sitemap-index.xml` referencing child sitemaps. Purged all query parameters (`?q=`), hash fragments (`#v1.56`), and duplicate URLs.
- [x] **Metadata & Structured Data Built from Entity Data (`server/ssrRenderer.ts`)**: Injected Google-compliant `WebSite` (`name: "DECK / divider — Pokémon TCG Studio"`, `alternateName: ["DECK / divider", "DeckDivider"]`) and `Organization` schemas with `sameAs` citations. Removed deprecated `FAQPage` schema and unearned `AggregateRating`.
- [x] **Deploy-Time Cache Purge & Conditional Headers (`server.ts`)**: Configured short HTML edge TTL (`Cache-Control: public, max-age=120, s-maxage=300, stale-while-revalidate=86400`) and accurate `Last-Modified` headers.
- [x] **Single Source of Truth (`src/config/site.config.ts`)**: Unified expansion counts (218 total, 148 mainline), cards (18,400+), currencies (20), format marks (H, I, J), and aliases.
- [x] **Plumbing & Clean View-Source (`server.ts`, `server/ssrRenderer.ts`)**: Added 301 Apex redirect (`www.deckdivider.app` -> `deckdivider.app`), HTTPS enforcement, alias redirects, and eliminated duplicate body rendering in `view-source`.

### Tier 2: Pages Worth Ranking
- [x] **Legality Engine & Regulation Marks**: Integrated 2026 Standard legality validation (Regulation Marks H, I, J legal; G rotated).
- [x] **URL-Driven State & Rich Server Metadata**: Provided server-rendered metadata and rich JSON-LD across all tool endpoints (`/tools/grading-fee-calculator`, `/tools/format-checker`, `/tools/lot-calculator`).
- [x] **Competitor Comparisons (`/compare`)**: Configured full metadata matrix for competitor comparison hubs.
- [x] **Internal Links & Breadcrumbs**: Embedded `BreadcrumbList` JSON-LD across sets, cards, decks, and formats.
- [x] **Free, Attributed Sharing**: OpenGraph cards dynamically generated via `/api/og/` for decks and sets with no paywall on crawl access.

### Tier 3: Trust, Compliance & E-E-A-T
- [x] **Creator Attribution & Methodology**: Provided transparent `AboutPage` and `Organization` schema linking to founder attribution and `/data-methodology`.
- [x] **Rel Tagging & Bot Citations**: Directory and partner anchors preserved in clean HTML for bot crawlers with `rel="noopener"`.
- [x] **Security Headers & Security.txt**: Configured RFC 9116 `security.txt`, HSTS, and CSP headers.
- [x] **Viewport Accessibility**: Confirmed `index.html` has no zoom-locking (`width=device-width, initial-scale=1.0`).

### Tier 4: CI/CD Quality Guardrails
- [x] **Automated SEO Linter (`scripts/lintSeo.ts` & `npm run lint:seo`)**: Automated CI validation that verifies sitemap purity, ensures zero query strings/hash anchors, asserts 404 status codes on nonexistent routes, and validates source of truth consistency.
- [x] **Verification**: `compile_applet`, `lint_applet`, and `npm run lint:seo` all pass with zero errors.
