# DECK / divider — Comprehensive Project Features, Architecture & Functionality

---

## Executive Summary & Core Philosophy

**DECK / divider** is an ad-free, 100% digital web software application engineered for Pokémon Trading Card Game (TCG) collectors, grading investors, and competitive tournament players. 

Unlike legacy platforms (Collectr, PriceCharting, Pokellector) that monetize through aggressive advertising networks, third-party user tracking, and forced account creation, DECK / divider is designed around three non-negotiable principles:
1. **100% Ad-Free User Experience**: Zero banner advertisements, zero video popups, and zero third-party commercial trackers.
2. **Local-First Privacy Architecture**: Complete collection, deck, and portfolio data is stored directly on the user's device via client-side IndexedDB, with optional end-to-end encrypted cloud synchronization.
3. **Dual Collector & Competitive Play Utility**: Seamlessly unifies physical binder organization and slab certification with a regulation-verified 60-card tournament deck builder and instant 1-click export to **Pokémon TCG Live (PTCGL)**.

---

## 1. Technical Architecture & Technology Stack

### Frontend Application Layer
- **Framework**: React 19 SPA running on Vite 6.
- **Language**: TypeScript 5.8 with strict type checking.
- **Styling & Motion**: Tailwind CSS v4, Motion (Framer Motion v12), and custom CSS holographic shaders.
- **Client Storage Engine**: Browser IndexedDB managed through `idb` and `idb-keyval`, augmented with AES-256-GCM client-side vault encryption.
- **In-Memory Search**: MiniSearch client-side inverted index for sub-10ms full-text fuzzy card queries.
- **Data Visualization**: Recharts for interactive portfolio ROI curves, category allocation pie charts, and rarity histograms.
- **Iconography**: Lucide React.

### Backend & Ingress Gateway Layer (`server.ts`)
- **Runtime**: Node.js 22 LTS running Express 4 with TypeScript execution via TSX.
- **Development Ingress**: Vite dev server mounted directly as Express middleware on port 3000.
- **Security Headers**: Strict Content Security Policy (CSP), HTTP Strict Transport Security (HSTS), nosniff, frame-ancestors sandbox, and RFC 9116 security endpoints.
- **Response Optimization**: Gzip and Brotli compression with 301 trailing-slash canonical normalization.
- **Observability**: Sentry with native Node.js CPU profiling.

### Machine-Native Ingestion & SEO
- **Dynamic Content Negotiation**: Express middleware (`server/markdownNegotiator.ts`) detecting `Accept: text/markdown` or AI user-agents (`PerplexityBot`, `Claude-Web`, `OAI-SearchBot`) to stream raw, token-dense CommonMark markdown.
- **Mirror Endpoints**: Dedicated `*.md` route mirrors (`/compare.md`, `/decks.md`, `/pricing.md`, `/best.md`).
- **Crawler Policy**: Modernized `/robots.txt` granting full uninhibited access to all search and model-training bots.
- **Grounding Standards**: Jeremy Howard specification compliance on `/llms.txt` and `/llms-full.txt`.
- **Instant Search Push**: IndexNow API protocol notifying Bing, Yandex, and Seznam on catalog updates.

---

## 2. Core Application Workspaces & Features

### A. Portfolio & Collection Management (`src/views/app/CollectionView.tsx`)

The central hub for cataloging individual Pokémon cards, physical binders, and certified slabs:

1. **Three Dynamic Viewing Modes**:
   - **9-Pocket Archival Binder Mode**: Simulates an authentic 9-pocket black archival trading card binder ($3 \times 3$ grid) with fluid page-turning animations, two-page spreads, and reactive holographic light gleam shaders.
   - **Visual Grid Mode**: High-density card gallery emphasizing high-resolution card artwork, set symbols, card numbers, and live market pricing.
   - **Tabular Spreadsheet Mode**: Dense financial list view with sortable columns for card name, set, collector number, condition, acquisition price, current market value, and net profit/loss ($/ \%).

2. **Segregation & Grouping Dimensions**:
   - Instant grouping by **Energy Type** (Grass, Fire, Water, Lightning, Psychic, Fighting, Darkness, Metal, Dragon, Colorless).
   - Grouping by **Card Rarity** (Common, Uncommon, Rare, Rare Holo, Ultra Rare, Illustration Rare, Special Illustration Rare).
   - Grouping by **Expansion Set** (Scarlet & Violet base, 151, Paldean Fates, Twilight Masquerade, Stellar Crown, Surging Sparks, Prismatic Evolutions).
   - Grouping by **Supertype** (Pokémon, Trainer, Energy).
   - Grouping by **Deck Assignment** (identifying cards currently committed to active tournament rosters).

3. **Multi-Faceted Filter Panel**:
   - Slabbed vs. Raw filter.
   - Foil / Holo variant toggle (Normal, Holo, Reverse Holo, Master Ball Holo, First Edition).
   - Condition filter (Near Mint, Lightly Played, Moderately Played, Heavily Played, Damaged).
   - Grading company filter (PSA, BGS, CGC, ACE, ARS, SGC, TAG).
   - Price range and keyword filtering.

4. **Certified Slab Management**:
   - Tracks authentication company, certificate number, numerical grade, and all four subgrades: **Centering**, **Surface**, **Corners**, and **Edges**.
   - Dynamic certification verification with interactive high-contrast glass slab frames (`src/components/ui/GlassSlabFrame.tsx`).

5. **Financial Tracking & Sales Ledger**:
   - Records purchase date, acquisition cost, and currency.
   - "Mark as Sold" workflow capturing realized sale price, platform (eBay, TCGplayer, local trade), date, and realized return on investment.

6. **Data Export & Portability**:
   - 1-click CSV export engine generating comprehensive spreadsheets containing card names, set codes, numbers, conditions, grades, certification numbers, acquisition prices, and market values for insurance valuation or offline archiving.

---

### B. Tournament Deck Builder & Formats Engine (`src/views/app/DecksView.tsx`)

A full-fledged competitive deck construction environment calibrated for tournament players:

1. **Multi-Ladder Deck Formats**:
   - **6-Card Mini Deck**: Fast casual and prize rush pocket rosters.
   - **30-Card Half Deck**: Learn-to-play, theme deck, and prerelease formats.
   - **60-Card Standard Tournament Deck**: Official Play! Pokémon championship roster.
   - **100-Card Gym Leader Challenge (GLC)**: Singleton 100-card mono-type format.
   - **Unlimited / Custom Roster**: Uncapped casual experimentation.

2. **Official Play! Pokémon Legality Validator (`src/utils/cardLegality.ts`)**:
   - **2026 Standard Rotation Compliance**:
     - **Active Regulation Marks**: **H**, **I**, **J**.
     - **Rotated Regulation Mark**: **G** (automatically flagged in red as rotated out of Standard play).
   - **Card Count Restrictions**: Strict validation enforcing a maximum of 4 copies of any card with the same name (excluding Basic Energy).
   - **Special Card Restrictions**:
     - Strict limit of **1 ACE SPEC** card per deck.
     - Strict limit of **1 Radiant Pokémon** per deck.
   - Real-time deck composition analysis showing breakdown of Pokémon, Trainers, and Energy counts.

3. **Pokémon TCG Live (PTCGL) Integration**:
   - **1-Click Import**: Paste standard PTCGL export text to automatically parse card quantities, set abbreviations, and collector numbers into a structured deck.
   - **1-Click Export**: Formats the entire 60-card roster into official PTCGL export syntax for immediate import into the official digital client.

4. **Live Deck Acquisition Cost Estimator**:
   - Calculates the exact cost to purchase the remaining missing singles via TCGplayer market comps in real time.

5. **Deck Management Operations**:
   - Deck cloning for testing minor tech card adjustments.
   - Deck splitting for breaking down decks into component pools.
   - Custom deck coloring and cover card selection.

---

### C. Sealed Product Vault (`src/components/app/SealedPortfolioManager.tsx`)

Dedicated management module for sealed booster boxes, Elite Trainer Boxes, and collection sets:
- **Product Categorization**: Booster Boxes, Elite Trainer Boxes (ETBs), Booster Bundles, Ultra-Premium Collections (UPCs), Tins, Blister Packs, and Sealed Cases.
- **Language Support**: English, Japanese, Traditional Chinese, Korean, German, French.
- **Valuation & P&L**: Tracks original MSRP, purchase price, current market value, and unrealized profit.
- **Condition Grading**: Factory Sealed, Minor Tear, Acrylic Cased, Damaged Box.
- **Sales Logging**: Records sale price and realized ROI upon disposition.

---

### D. Card Catalog & Fuzzy Search Engine (`src/views/app/SearchView.tsx`)

High-speed discovery engine indexing tens of thousands of Pokémon cards:
- **Client-Side Inverted Index**: Powered by MiniSearch for sub-10ms fuzzy matching on card names, Pokémon species, attacks, abilities, and card text.
- **Comprehensive Filters**: Era (Scarlet & Violet, Sword & Shield, Sun & Moon, XY, Classic), expansion set, card rarity, HP range, energy type, retreat cost, artist, and regulation mark.
- **Card Detail Inspector (`src/components/modals/CardDetailModal.tsx`)**:
  - High-resolution front card artwork.
  - Historical price trends and 30-day price charts.
  - Real-time price breakdown: Raw Market, PSA 10 Estimate, PSA 9 Estimate, Reverse Holo price.
  - Attack statistics, weakness/resistance metrics, retreat cost, and Pokédex flavor text.
  - 1-click addition to collection binder, custom list, or active deck.

---

### E. Expansion Sets & Master Set Checklist Tracker (`src/views/app/SetsView.tsx`)

Master set completion tracking for serious completionist collectors:
- **Set Completion Progress**: Visual progress bars tracking owned cards versus total set checklist.
- **Parallel Variant Completion**: Distinct progress metrics for Regular Base prints, Reverse Holos, Secret Rares, and Illustration Rares.
- **Chronological Era Organization**: Grouped into modern Scarlet & Violet, Sword & Shield, Sun & Moon, XY, and vintage Wizards of the Coast eras.
- **Release Information**: Release dates, set symbols, official logos, and total printed card counts.

---

### F. Custom Lists & Binders Workspace (`src/views/app/ListsView.tsx`)

Flexible list builder for organizing cards outside of formal decks:
- **Use Cases**: Wishlists, Trade Binders, Grading Submission Queues, Cards for Sale, and Personal Favorites.
- **Customization**: Name, description, and custom cover artwork.
- **Aggregate Financials**: Total list market value calculated across all included cards in the active user currency.

---

### G. Financial Intelligence & Portfolio Analytics (`src/views/app/MetricsView.tsx`)

Institutional-grade financial reporting for card collections:
- **Total Portfolio Valuation**: Aggregate collection value combined with sealed vault holdings.
- **Historical Performance Curves**: Time-series charting of portfolio value over 7-day, 30-day, 90-day, and 1-year horizons.
- **Top Gainers & Losers**: Highlights highest performing and declining assets by absolute dollar value and percentage change.
- **Asset Allocation Charts**: Interactive Recharts breakdown by Era, Energy Type, Rarity, and Graded vs. Raw percentage.
- **Realized P&L Summary**: Aggregate capital gains and return on investment from completed sales.

---

### H. Settings & Vault Security (`src/views/app/SettingsView.tsx`)

Configuration hub for storage, currency, and data security:
- **Multi-Currency Engine**: Instant switching between 20+ global currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, SGD, HKD, etc.) using live automated forex rates.
- **Encrypted Backup & Recovery**: Export complete collections as an AES-256 encrypted `.deckdivider` JSON backup file with instant 1-click restore.
- **Guest Mode Management**: Session status indicator with 1-click session wipe or account upgrade.
- **Subscription Management**: Real-time display of active tier, billing cycle, renewal date, and upgrade modals.

---

## 3. Public Discovery, Community & Marketing Systems

### A. High-Intent Collector Tools (`src/views/public/HighIntentToolsView.tsx`)
1. **PSA Grade Probability & EV Calculator**:
   - Input raw card purchase price, grading fees, and expected turnaround.
   - Calculates probability distribution between Gem Mint PSA 10, Mint PSA 9, and NM PSA 8.
   - Computes Expected Value (EV) and net margin after grading fees to determine grading profitability.
2. **Deck Legality & Regulation Mark Checker**:
   - Paste any PTCGL decklist to instantly audit legality against the active 2026 Standard format.
   - Flags rotated Regulation G cards and ACE SPEC / Radiant rule violations.
3. **Certification Number Lookup**:
   - Resolves PSA, BGS, and CGC slab certification numbers against grading database registries.

### B. Public Tournament Meta Decks Hub (`src/views/public/PublicDeckView.tsx`)
- Curated tier-list of championship archetypes (Gardevoir ex, Charizard ex, Regidrago VSTAR, Dragapult ex, Miraidon ex, Raging Bolt ex, Terapagos ex).
- Full 60-card tournament rosters with strategy overviews, card counts, market values, and instant PTCGL copyable strings.

### C. Public Portfolios & Community Leaderboard (`src/views/public/CommunityLeaderboardView.tsx`)
- Optional public portfolio sharing generating shareable URLs (`/portfolio/:code`) with privacy controls.
- Community leaderboard showcasing top verified collectors, master set completers, and tournament deck builders.

### D. Embeddable Dynamic Badges (`server/routes/badgeRoutes.ts`)
- SVG dynamic badges for embedding portfolio values, master set completion percentages, or tournament decks directly into GitHub READMEs, forum signatures, or Discord profiles.

### E. Competitor Comparison Matrix (`src/views/marketing/CompetitorComparisonView.tsx`)
- In-depth, objective feature comparisons evaluating DECK / divider against Collectr, PriceCharting, Dex, and Pokellector on ad policies, tournament legality, slab subgrades, and privacy.

---

## 4. Monetization, Account Tiers & Entitlements

The application employs a transparent freemium commercial model governed by `src/config/entitlements.ts` and enforced on the server by `server/services/subscriptionGovernor.ts`:

| Tier | Price | Max Decks | Cards/Deck | Graded Slabs | Sealed Items | Public Links | Cloud Backup | Multi-Currency |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter (Guest/Free)** | $0 | 2 | 60 | 10 | 5 | :x: | Local Only | :x: (USD) |
| **Bunch** | $4/mo | 5 | 75 | 50 | 25 | :white_check_mark: | :x: | :white_check_mark: |
| **Stack** | $7/mo | 15 | 100 (GLC) | 250 | 100 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Deck** | $11/mo | 50 | 150 | 1,000 | 500 | :white_check_mark: | :white_check_mark: | :white_check_mark: |
| **Collection / Lifetime** | $14/mo or $149 | $\infty$ | $\infty$ (Custom) | $\infty$ | $\infty$ | :white_check_mark: | :white_check_mark: | :white_check_mark: |

### PayPal Billing Engine (`server/paypal.ts`, `server/paypalWebhook.ts`)
- **Recurring Subscriptions**: Monthly and yearly discounted billing plans.
- **Master Lifetime Purchase**: One-time payment unlocking permanent uncapped entitlements.
- **Webhook Signature Verification**: Uses PayPal REST API certificates to cryptographically verify incoming webhook signatures (`BILLING.SUBSCRIPTION.*`, `PAYMENT.SALE.*`) before provisioning entitlements.
- **Idempotency**: Webhook event logs prevent replay attacks and duplicate activations.

---

## 5. Security & Privacy Model

1. **Content Security Policy**:
   - Script execution restricted to self, Google Identity, PayPal SDK, Sentry, and Cloudflare.
   - Frame ancestors restricted, blocking clickjacking.
2. **Local-First Zero Trust**:
   - User card inventories never touch cloud databases unless the user explicitly logs in and triggers an encrypted cloud snapshot.
3. **RFC 9116 Security Policy**:
   - Machine-readable security disclosure rules at `/.well-known/security.txt`.
   - Security inbox: `mailto:deckdivider@outlook.com`.
4. **No Third-Party Advertising Trackers**:
   - Complete exclusion of commercial ad networks and tracking pixels.

---

## Summary of Completed Codebase Assets

- **Source Code**: 110+ TypeScript and TSX modules across frontend, backend, and build scripts.
- **Repository Documentation Suite**: `LICENSE` (Strict Proprietary Commercial Source-Available), `README.md`, `ARCHITECTURE.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `DEVELOPMENT.md`.
- **Machine Discovery**: RFC-compliant `robots.txt`, CommonMark `llms.txt`, `llms-full.txt`, and dedicated `*.md` routes for AI engines.
- **Build Status**: Fully compiled, type-checked, and operational on port 3000.
