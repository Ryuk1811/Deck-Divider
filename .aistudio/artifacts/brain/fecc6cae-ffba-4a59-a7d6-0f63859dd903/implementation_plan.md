# Technical Remediation Plan: Legality Accuracy, Legal Policies & SEO Architecture

A unified engineering specification to resolve tournament legality inaccuracies, export discrepancies, privacy/terms gaps, encryption claim inconsistencies, robots.txt crawler misconfigurations, circular sitemap structures, and conflicting cross-page claims across **DECK / divider**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following strategic decisions were confirmed during the planning clarification phase and govern this implementation plan:

- **Confirmed Decision 1 (Deck Archetype Tiers)**: Retain competitive Tier classifications (e.g., Tier 1, Tier 1.5, Tier 2) on deck pages, but attribute each tier with an explicit date stamp and community meta source: `Tier 1 (Limitless TCG · 2026 Meta)`.
- **Confirmed Decision 2 (AI Search Crawlers in robots.txt)**: Allow major AI search and discovery crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`) to crawl public pages for organic indexation and AI overview citation, while strictly disallowing private and administrative routes (`/app/`, `/dashboard/`, `/admin/`, `/auth`).
- **Confirmed Decision 3 (Encryption Claims Standardization)**: Standardize all security copy to clearly delineate the two distinct security layers: **Provider-managed AES-256 encryption at rest** across all tiers (via Google Cloud / Firebase), and **Optional client-side AES-GCM 256-bit passphrase encryption** for Pro exported vault backups where passphrases are never sent to or recoverable by DECK / divider.

---

## 1. Overview & Core Concept

**DECK / divider** is an ad-free web platform for competitive Pokémon TCG players and collectors. This update resolves critical compliance, algorithmic SEO, and legal shortcomings:
- **Legality & Tournament Engine**: Enforce Play! Pokémon 2026 Standard regulation marks (**Marks H, I, J**; G rotated April 10, 2026). Display a per-card regulation mark and "Legal via Reprint" indicator with parenthetical H+ printings, dated rotation stamps, and aligned PTCG Live export strings.
- **Privacy & Terms Overhaul**: Upgrade privacy and terms policies to full GDPR, UK GDPR, and California CCPA/CPRA compliance with named data controller, retention limits, deletion rights, third-party sub-processors, children's protections (13+), and clear billing/refund rules.
- **Technical SEO & Crawlers**: Overhaul `robots.txt` under RFC 9309 rules, enable `/api/og/` dynamic preview image indexing for social bots, eliminate circular sitemap indexes, standardize trailing-slash redirects, and feed every page from a single configuration truth module.

---

## 2. Technical Architecture & System Flow

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SINGLE SOURCE OF TRUTH PLATFORM ARCHITECTURE                     │
└────────────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────┐          ┌─────────────────────────┐
    │  src/config/            │          │  src/config/            │
    │  platformTruth.ts       │          │  legalityRules.ts       │
    │  • 148+ Expansions      │          │  • Standard: Marks H,I,J│
    │  • 15+ Currencies       │          │  • Rotation: 2026-04-10 │
    │  • Daily TCGplayer Sync │          │  • Legal Reprints Index │
    │  • Tier Limits & Perks  │          │  • Banned Cards List    │
    └───────────┬─────────────┘          └───────────┬─────────────┘
                │                                    │
                ├─────────────────┬──────────────────┤
                ▼                 ▼                  ▼
      ┌──────────────────┐ ┌───────────────┐ ┌──────────────────┐
      │ Client UI Views  │ │ SSR Renderer  │ │ Footprint Engine │
      │ • LandingPage    │ │ • ssrRenderer │ │ • robots.txt     │
      │ • About / FAQ    │ │ • Deck Pages  │ │ • sitemap.xml    │
      │ • FormatLegality │ │ • Set Pages   │ │ • llms.txt       │
      │ • Privacy/Terms  │ │ • Meta Tags   │ │ • 301 Redirects  │
      └──────────────────┘ └───────────────┘ └──────────────────┘
```

---

## 3. Detailed Engineering Workstreams

### Workstream 1: Single Source of Truth & Standard Legality Accuracy
1. **Central Configuration Modules (`src/config/platformTruth.ts` & `src/config/legalityRules.ts`)**:
   - Define exact Standard regulation marks: `STANDARD_REGULATION_MARKS = ['H', 'I', 'J']`.
   - Define rotation effective date: `STANDARD_ROTATION_DATE = 'April 10, 2026'`.
   - Define canonical reprint dictionary for G-mark cards with legal H+ prints (e.g., *Ultra Ball (SVI)*, *Nest Ball (SVI)*, *Super Rod (PAL)*, *Arven (SVI)*, *Rare Candy (SVI)*, *Professor's Research (SVI)*, *Buddy-Buddy Poffin (TEF)*, *Counter Catcher (PAR)*, *Iono (PAL)*, *Boss's Orders (PAL)*).
   - Define canonical platform figures: `148+` expansions, `15+` currencies, `Daily sync` from verified TCGplayer market comps, tier limits (Free: 3 wishlists; Stack: 10 wishlists; Deck: unlimited wishlists + CSV; Pro: unlimited + client-encrypted vault snapshots).
2. **Standardize All Copy**:
   - Update `/about`, `/faq`, `/methodology`, `/changelog`, `llms.txt`, and `llms-keywords.txt` to strictly reference Marks H, I, J.
   - In `/format/standard`, prominently render:
     - Active Regulation Marks: **H, I, J**.
     - Status: `Standard Format (2026–2027 Season) · Effective April 10, 2026`.
     - Rule explanation: G-mark prints remain legal only if an identical-name card exists with Regulation Mark H or later.
     - Official Play! Pokémon Banned Cards list.
3. **Deck Page Tournament Accuracy (`/deck/:slug` & `tournamentDecks.ts`)**:
   - Update every card row in the deck table to display:
     - Card Name, Set, Number, Quantity, Category.
     - **Regulation Mark Badge** (e.g. `Mark H`, `Mark I`, `Mark G`).
     - **Reprint Legality Pill / Text**: For Mark G cards with legal H+ prints, display `Legal via H+ Reprint (SVI/TEF/PAL)` with verified status.
   - Source Tier labels: `Tier 1 (Limitless TCG · 2026 Meta)` or `Expanded Format (Rotated from Standard)`.
   - Update `llms-keywords.txt` and homepage archetype strip:
     - Change Regidrago VSTAR and Lugia VSTAR entries to explicit `Expanded Format Archetype (Rotated from Standard)`.
     - Ensure all homepage archetypes showcase 2026 Standard legal builds (*Charizard ex, Gardevoir ex, Dragapult ex, Miraidon ex, Raging Bolt ex, Gholdengo ex, Roaring Moon ex, Terapagos ex*).
4. **PTCG Live Export Bug Resolution**:
   - Align Gardevoir ex card set codes in table and export string:
     - *Buddy-Buddy Poffin*: `TEF 144` in both table and export block.
     - *Super Rod*: `PAL 188` in both table and export block.
     - *Unfair Stamp*: `TWM 165` in both table and export block.
     - *Arven*: `SVI 166` in both table and export block.
   - Verify export strings adhere to official PTCGL format: `4 Buddy-Buddy Poffin TEF 144`.

---

### Workstream 2: Privacy Policy & Terms of Service Overhaul
1. **Privacy Policy (`src/views/public/PrivacyPolicyView.tsx` & SSR in `server/ssrRenderer.ts`)**:
   - **Data Controller & Contact**: DECK / divider Ltd., privacy team contact at `privacy@deckdivider.app`.
   - **Data Retention**: Account collection data retained for the active account lifetime plus 30 days post-deletion; local cache data cleared on demand.
   - **User Rights (GDPR & CCPA/CPRA)**: Explicit Right of Access, Rectification, Erasure (Right to be Forgotten), Restriction of Processing, Data Portability (one-click JSON/CSV export), and California "Do Not Sell or Share My Personal Information" notices.
   - **Cookies & Analytics**: Disclose session storage, local storage authentication tokens, PayPal checkout session cookies, and Microsoft Clarity telemetry with user input and PII masking.
   - **International Transfers**: Cloud infrastructure hosted in US regions under Standard Contractual Clauses (SCCs).
   - **Named Third-Party Processors**:
     - *Google LLC / Firebase* (Authentication & Firestore Database, USA)
     - *Cloudflare, Inc.* (DNS & Edge Security, USA)
     - *PayPal Holdings, Inc.* (Payment processing & subscription billing, USA)
   - **Children's Privacy**: Explicit 13+ age requirement (COPPA / GDPR Art. 8); policy for parental deletion requests.
   - **Public Portfolios & Shared Links**: Clear disclosure that sharing a portfolio URL publishes that specific binder/deck list to a public URL crawlable by search engines.
2. **Terms of Service (`src/views/public/TermsOfServiceView.tsx` & SSR in `server/ssrRenderer.ts`)**:
   - **Billing, Cancellation & Refunds**: Subscriptions (Monthly $4/$8/$14 or Annual) renew automatically until canceled in Account Settings or PayPal. 14-day refund policy for initial payments upon request.
   - **Acceptable Use Policy**: Prohibits automated scrapers, denial-of-service attempts, reverse engineering, and abusive API calls.
   - **Termination & Governing Law**: Account termination rights for policy breaches; governing law and jurisdiction specified.
   - **Minimum Age**: 13 years of age or older required for account registration.
   - **User Content License**: Users retain ownership of deck lists and collection records; grant non-exclusive license to DECK / divider to host and display shared showcases.

---

### Workstream 3: Encryption & Security Messaging Alignment
1. **Standardized Three-Pillar Security Framework**:
   - **Pillar 1 (Data in Transit)**: Enforced TLS 1.3 / HTTPS encryption for all client-server communications.
   - **Pillar 2 (Cloud Data at Rest - Free & Pro)**: Enterprise AES-256 encryption at rest managed by Google Cloud / Firebase infrastructure. Google sign-in and password resets manage identity authentication.
   - **Pillar 3 (Pro Client-Side Encrypted Vault Snapshots)**: Optional user-passphrase encrypted backup export. The file is encrypted entirely in the browser using the Web Crypto API (AES-GCM 256-bit) before download. The passphrase is never transmitted to or stored by DECK / divider; lost passphrases cannot be recovered by support.
2. **Align Copy Across All Pages**:
   - Update `/security`, `/pricing`, `/faq`, `/about`, `LandingPageView.tsx`, and `server/ssrRenderer.ts` to strictly reflect this 3-pillar truth.

---

### Workstream 4: robots.txt & Social Preview Crawler Architecture
1. **RFC 9309 Compliant Structure**:
   - Define clean, non-conflicting user-agent groups:
     - `User-agent: *`:
       - `Allow: /`
       - `Allow: /api/og/` (explicitly unblock dynamic social card generation)
       - `Disallow: /api/`
       - `Disallow: /app/`
       - `Disallow: /dashboard/`
       - `Disallow: /admin/`
       - `Disallow: /auth`
     - Social Preview Bots (`Twitterbot`, `LinkedInBot`, `Slackbot`, `facebookexternalhit`, `Discordbot`):
       - `Allow: /`
       - `Allow: /api/og/`
     - AI Search Crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot-Extended`, `anthropic-ai`):
       - `Allow: /`
       - `Disallow: /api/`
       - `Disallow: /app/`
       - `Disallow: /admin/`
       - `Disallow: /auth`
2. **Sitemap Index Directives**:
   - Reference all sub-sitemaps in `robots.txt`:
     - `Sitemap: https://deckdivider.app/sitemap.xml`
     - `Sitemap: https://deckdivider.app/sitemap-core.xml`
     - `Sitemap: https://deckdivider.app/sitemap-sets.xml`
     - `Sitemap: https://deckdivider.app/sitemap-decks.xml`
     - `Sitemap: https://deckdivider.app/sitemap-tools.xml`
     - `Sitemap: https://deckdivider.app/sitemap-compare.xml`
     - `Sitemap: https://deckdivider.app/sitemap-portfolios.xml`

---

### Workstream 5: Sitemap Index Restructuring & Trailing Slash Redirection
1. **Proper `<sitemapindex>` Root (`/sitemap.xml`)**:
   - Remove circular `<url>` entries from `/sitemap.xml`.
   - Structure `/sitemap.xml` as a true `<sitemapindex>` containing `<sitemap>` elements pointing to sub-sitemaps.
   - Retain sub-sitemaps as valid `<urlset>` feeds with genuine `<lastmod>` timestamps based on set release dates or stable build versions.
2. **Set ID Lowercase Normalization**:
   - Ensure sitemap URLs use lowercase normalized paths (`/set/a1`, `/set/p-a`, `/set/a2a`) to match canonical tags.
3. **Strict 301 Trailing-Slash Normalization**:
   - In `server.ts`, enforce a global middleware: any path ending in `/` (length > 1) 301-redirects to its non-trailing slash equivalent (e.g. `/pricing/` $\rightarrow$ `/pricing`).
   - Sync all internal navigation links, canonical tags, and sitemaps to non-trailing slash URLs.

---

## 4. Verification & Validation Protocol

1. **Format Legality & Export Verification**:
   - Verify Gardevoir ex, Charizard ex, and Dragapult ex deck pages render regulation marks, reprint notices, and "as of April 10, 2026" stamps.
   - Test PTCGL export string formatting: copy deck text and verify valid syntax (`4 Buddy-Buddy Poffin TEF 144`).
2. **SEO & Crawler Validation**:
   - Test `curl -s http://localhost:3000/robots.txt` and verify RFC 9309 syntax, `/api/og/` allowance, and lack of duplicate rules.
   - Test `curl -s http://localhost:3000/sitemap.xml` and verify valid `<sitemapindex>` root without circular references.
   - Test `curl -I http://localhost:3000/pricing/` and verify `HTTP 301 Moved Permanently` to `/pricing`.
3. **Build & Linter Integrity**:
   - Execute `compile_applet` (`npm run build`) and `lint_applet` (`tsc --noEmit`) to verify 0 build and typing errors.
