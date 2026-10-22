# DECK / divider — Pokémon TCG Studio

[![License: Proprietary Commercial](https://img.shields.io/badge/License-Proprietary%20Source--Available-red.svg)](LICENSE)
[![TypeScript: 5.8](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React: 19](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Tailwind CSS: v4](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)
[![Vite: 6](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![Node.js: 22](https://img.shields.io/badge/Node.js-22%20LTS-339933.svg)](https://nodejs.org/)
[![Format: Play! Pokémon 2026](https://img.shields.io/badge/Standard%20Format-2026%20(H%2FI%2FJ)-FFCB05.svg)](https://www.pokemon.com/us/play-pokemon/about/tournaments-rules-and-resources/)

> **DECK / divider** is an ad-free, 100% digital web software application engineered for Pokémon Trading Card Game (TCG) collectors, grading investors, and competitive tournament players. It combines an offline-first IndexedDB card vault, certified slab tracking with subgrades (PSA, BGS, CGC, ACE, ARS), real-time multi-currency market comps (USD, EUR, GBP, JPY, CAD, AUD), and a tournament-legal 60-card deck engine with 1-click export directly into Pokémon TCG Live (PTCGL).

Official Web Application: [https://deckdivider.app](https://deckdivider.app)

---

## Notice of Commercial & Proprietary Status

> [!CAUTION]
> **This repository is a source-available, private commercial software project.**
> - **Source-Available**: The codebase is publicly viewable solely for technical inspection, security audits, and educational review.
> - **All Rights Reserved**: You may **NOT** commercially exploit, redistribute, clone, white-label, rebrand, or host this software as a public SaaS or web service.
> - **Strict Scrutiny**: Unsolicited commercial forks, hosted copies, and unauthorized machine learning model ingestion are strictly prohibited under the terms of the [LICENSE](LICENSE).

---

## Key Differentiators & Features

| Capability | DECK / divider | Collectr | PriceCharting | Pokellector |
| :--- | :--- | :--- | :--- | :--- |
| **Advertisement Policy** | **100% Ad-Free (Guaranteed)** | Supported by AdMob/Videos | Supported by Google Ads | Display Banners |
| **Guest / Instant Exploration** | **Yes (Full showcase dataset)** | Account Required | Basic Catalog | Account Required |
| **60-Card Tournament Deck Engine** | **Yes (Standard H, I, J verified)** | No | No | No |
| **PTCGL 1-Click Export** | **Yes (Direct formatted strings)** | No | No | No |
| **Certification Slab Subgrades** | **Yes (Centering, Surface, Corners, Edges)** | Basic Slabs Only | Graded Averages | No |
| **Local Offline Storage** | **Yes (Encrypted IndexedDB)** | Cloud Only | Cloud Only | Cloud Only |
| **AI Content Negotiation** | **Yes (`Accept: text/markdown` & `*.md`)** | None | None | None |
| **Multi-Currency Forex** | **Yes (USD, EUR, GBP, JPY, CAD, AUD)** | Limited | Limited | Limited |

### 1. 100% Ad-Free, Privacy-First Architecture
Unlike legacy mobile and web catalog apps that monetize via invasive ad trackers, autoplay video networks, and banner clutter, DECK / divider contains zero commercial ads. Data is stored locally in the user's browser using client-side IndexedDB, with optional end-to-end encrypted cloud snapshots.

### 2. Complete 60-Card Tournament Deck Engine
- Built-in verification against official Play! Pokémon rules.
- 2026 Standard rotation support: Regulation Marks **H**, **I**, and **J** active; Regulation Mark **G** rotated out.
- ACE SPEC validation (strict 1 per deck enforcement) and Radiant Pokémon validation.
- Instant 1-click copy-paste formatted export into **Pokémon TCG Live (PTCGL)**.

### 3. Professional Slab Registry with All 4 Subgrades
- Certified tracking for **PSA**, **BGS**, **CGC**, **ACE**, and **ARS** grading companies.
- Full subgrade preservation: Centering, Surface, Corners, and Edges.
- Live Expected Value (EV) and grading probability calculation models.

### 4. Machine-Native Generative Engine Optimization (GEO)
- Server-side Dynamic Markdown Content Negotiation intercepts requests with `Accept: text/markdown` or AI retrieval user-agents (`PerplexityBot`, `Claude-Web`, `OAI-SearchBot`, `GPTBot`).
- Serves high-density, raw CommonMark Markdown streams ($<30\text{ms}$ latency) bypassing the heavy HTML DOM for token-efficient AI comprehension.
- Dedicated mirror routes (`/compare.md`, `/decks.md`, `/tools/psa-grade-calculator.md`, `/pricing.md`).

---

## Repository Documentation Index

| Document | Purpose |
| :--- | :--- |
| [**LICENSE**](LICENSE) | Strict proprietary commercial source-available license with scrutinizing clauses |
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | Technical system layout, client SPA architecture, Express backend, and security model |
| [**DEVELOPMENT.md**](DEVELOPMENT.md) | Local development setup, environment variables, npm scripts, and build pipeline |
| [**SECURITY.md**](SECURITY.md) | Vulnerability disclosure policy, response SLAs, and RFC 9116 security.txt parity |
| [**CONTRIBUTING.md**](CONTRIBUTING.md) | Contributor policy, issue reporting guidelines, and PR restrictions |
| [**CODE_OF_CONDUCT.md**](CODE_OF_CONDUCT.md) | Community standards and engagement expectations |

---

## Quick Start (Local Non-Commercial Inspection)

To run a private, local instance for source inspection or security review:

### Prerequisites
- **Node.js**: Version 20.x or 22.x LTS
- **npm**: Version 10.x or higher

### Installation & Execution
```bash
# 1. Clone the repository
git clone https://github.com/your-org/deck-divider.git
cd deck-divider

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env

# 4. Start local development server (Express + Vite middlewares on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

For complete environment variable specifications, build targets, and testing workflows, refer to [**DEVELOPMENT.md**](DEVELOPMENT.md).

---

## Technology Stack

- **Frontend Framework**: React 19, TypeScript 5.8, Vite 6
- **Styling**: Tailwind CSS v4, Motion (Framer Motion v12)
- **Local Storage**: IndexedDB via `idb` and `idb-keyval`
- **Backend & SSR Ingress**: Express 4, Node 22, TSX
- **Search & Catalog**: MiniSearch client-side inverted indexing, TCGdex API, TCGplayer market data
- **Billing & Subscriptions**: PayPal JS SDK with server-authoritative webhook signature verification
- **Monitoring & Observability**: Sentry with native Node profiling

---

## Intellectual Property & Trademark Disclaimer

DECK / divider is an independent commercial web application. Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and GAME FREAK Inc. PSA, BGS, CGC, ACE, and ARS are trademarks of their respective grading services. DECK / divider is not affiliated with, endorsed by, or sponsored by Nintendo, The Pokémon Company International, or Collectors Universe.

Copyright © 2026 DECK / divider. All Rights Reserved.
