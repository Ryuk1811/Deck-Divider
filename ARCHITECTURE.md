# DECK / divider — System Architecture & Technical Specifications

This document outlines the end-to-end architecture, technical topology, data pipelines, and security model of **DECK / divider**.

---

## 1. System Topology Overview

```
                                  ┌────────────────────────┐
                                  │   Browser / Client     │
                                  │   React 19 + IndexedDB │
                                  └───────────┬────────────┘
                                              │ HTTP / WS
                                              ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               Express Ingress Gateway (server.ts)                      │
├─────────────────────────┬─────────────────────────┬────────────────────────────────────┤
│   Security & Routing    │   Ingestion & SEO       │   Business Logic & APIs            │
│   • CSP & HSTS Headers  │   • Content Negotiation │   • TCG Catalog Service            │
│   • Trailing Slash Norm │     (Markdown / HTML)   │   • Forex Metronome (6 Currencies) │
│   • Rate Limiters       │   • SSR Meta Injection  │   • Subscription Governor          │
│   • RFC 9116 security   │   • IndexNow Pinger     │   • PayPal Webhook Verifier        │
└───────────┬─────────────┴───────────┬─────────────┴──────────────────┬─────────────────┘
            │                         │                                │
            ▼                         ▼                                ▼
┌──────────────────────┐  ┌──────────────────────┐       ┌──────────────────────────────┐
│ Third-Party Comps    │  │ Firebase Firestore   │       │ PayPal REST Engine           │
│ • TCGdex Catalog API │  │ • User Entitlements  │       │ • Subscription Webhooks      │
│ • TCGplayer Comps    │  │ • Encrypted Backups  │       │ • Idempotent Event Log       │
│ • Open Exchange Rates│  │ • Firebase Admin SDK │       │ • Tier Upgrades & Downgrades │
└──────────────────────┘  └──────────────────────┘       └──────────────────────────────┘
```

---

## 2. Client Application Architecture (SPA)

The user-facing client is a high-performance Single Page Application built on **React 19**, **TypeScript 5.8**, and **Vite 6**.

### Key Client Subsystems

1. **Local-First Encrypted Vault (`src/lib/indexedDB.ts`, `src/lib/encryptedVault.ts`)**
   - Collections, custom binders, tournament decks, and sealed inventory are stored locally in the browser's IndexedDB using `idb` and `idb-keyval`.
   - **Zero Latency**: Reads and writes occur instantly without waiting for network round-trips.
   - **Offline Resilience**: Users can manage their portfolios, edit deck lists, and review slabs with no internet connection.

2. **Full-Text Inverted Search Engine (`src/lib/searchEngine.ts`)**
   - Employs **MiniSearch** directly in client memory to index thousands of Pokémon cards, sets, and regulation marks.
   - Enables fuzzy multi-token searching, subtype filtering, and instant card suggestions with sub-10ms query times.

3. **Tournament Legality & Deck Validator (`src/utils/cardLegality.ts`, `src/config/legalityRules.ts`)**
   - Automatically audits 60-card decks against official Play! Pokémon rules.
   - Validates **2026 Standard Rotation**:
     - Active Regulation Marks: **H**, **I**, **J**.
     - Rotated Regulation Mark: **G** (prohibited in Standard format).
   - Validates card counts (maximum 4 identical card names, except Basic Energy) and special card restrictions (maximum 1 ACE SPEC card, maximum 1 Radiant Pokémon).
   - Formats instant 1-click import/export strings for **Pokémon TCG Live (PTCGL)**.

4. **Multi-Currency Portfolio Metronome (`src/utils/forexMetronome.ts`, `src/utils/formatters.ts`)**
   - Supports 6 primary global currencies: USD ($), EUR (€), GBP (£), JPY (¥), CAD ($), and AUD ($).
   - Daily automated forex sync converts live TCGplayer market comps into accurate local currencies.

---

## 3. Server Architecture & SSR Ingress (`server.ts`)

The backend is an **Express** service running on **Node.js 22 LTS**, serving as the ingress gateway for both human web visitors and machine crawlers.

### Key Server Subsystems

1. **Dynamic Markdown Content Negotiation (`server/markdownNegotiator.ts`)**
   - When an AI retrieval crawler or user requests a route with `Accept: text/markdown` or visits a `*.md` path (e.g. `/compare.md`, `/decks.md`), the server halts the HTML rendering pipeline and directly streams clean, high-density CommonMark Markdown.
   - Token efficiency is improved by ~85% compared to HTML DOM scraping, preventing client-side hydration scraping failures on AI answer engines like Perplexity, ChatGPT Search, and Claude.

2. **Edge SSR Meta Tag Injection (`server/ssrRenderer.ts`)**
   - Injects canonical URLs, OpenGraph card images (`/api/og/card/:cardId`, `/api/og/deck/:slug`), Twitter card tags, and Schema.org JSON-LD microdata before the HTML document reaches the browser.

3. **TCG Catalog & Market Comps Engine (`server/tcgCatalogManager.ts`)**
   - Maintains an in-memory cache of expansion sets, card entries, and recent market prices fetched from TCGdex and verified market providers.
   - Supports background delta syncs with retry backoff to avoid rate limits.

4. **Instant Discovery Push (`server/indexNow.ts`)**
   - Automatically notifies search engines (Bing, Yandex, IndexNow consortium) whenever new tournament decks, card prices, or expansion sets are published.

---

## 4. Monetization & Entitlements Engine

The application operates on a sustainable commercial model with clear tier boundaries:

### Account Tiers
- **Starter (Free)**: Unlimited local IndexedDB storage, complete 60-card deck building, ad-free experience, up to 100 cards and 2 decks.
- **Pro Tier**: Expanded storage (up to 5,000 cards, 50 decks), certified slab registry with all 4 subgrades, CSV/JSON data export, and automated encrypted cloud backup.
- **Master Lifetime**: One-time purchase providing permanent, uncapped cloud storage and VIP early access.

### Server-Authoritative Subscription Governor (`server/services/subscriptionGovernor.ts`)
- Client requests that attempt tier-restricted operations (cloud backup, massive deck imports, slab subgrade tracking) are strictly audited on the server.
- PayPal Webhook Events (`BILLING.SUBSCRIPTION.ACTIVATED`, `PAYMENT.SALE.COMPLETED`, `BILLING.SUBSCRIPTION.CANCELLED`) are cryptographically verified using PayPal's public certificates, ensuring zero unauthorized entitlement escalation.
- Idempotent webhook logs prevent duplicate transaction processing.

---

## 5. Security & Privacy Architecture

1. **Strict Content Security Policy (CSP)**
   - Hardened CSP headers restrict script execution strictly to verified sources (Google Auth, PayPal SDK, Sentry, Cloudflare Challenges).
   - `object-src: 'none'`, `base-uri: 'self'`, and `frame-ancestors: *` with strict sandbox rules.

2. **RFC 9116 Security Policy**
   - Canonical security disclosure policy published at `/.well-known/security.txt` and `/security.txt`.
   - Contact: `mailto:deckdivider@outlook.com`.

3. **Zero Third-Party Advertising Trackers**
   - No Google AdSense, no Taboola/Outbrain, no Facebook tracking pixels, and no data broker telemetry.
   - Telemetry is restricted solely to operational error monitoring via **Sentry**.

---

## 6. Build & Deployment Pipeline

- **Local Development**: `npm run dev` invokes `tsx server.ts`, mounting Vite dev middleware directly into Express.
- **Production Build**: `npm run build` runs:
  1. Icon generator (`scripts/generateAllIcons.ts`).
  2. Vite production asset bundling (`vite build`).
  3. Static pre-rendering (`scripts/prerender.ts`).
  4. Server compilation via **esbuild** into `dist/server.cjs`.
- **Production Execution**: `npm start` executes `NODE_ENV=production node dist/server.cjs`.
