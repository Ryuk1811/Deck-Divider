# Public Repository Documentation & Strict Commercial Licensing Suite

A complete repository governance and documentation suite for **DECK / divider** following its public repository release, establishing a strict proprietary commercial source-available legal framework with scrutinizing protective clauses alongside comprehensive technical, architectural, security, and developer documentation.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during Phase 1 clarification:
> - **Commercial License Structure**: Strict Proprietary Source-Available with All Rights Reserved. Includes explicit scrutinizing clauses against commercial exploitation, unauthorized SaaS hosting, white-label distribution, proprietary trademark infringement, and unpermitted AI/LLM model training.
> - **Contribution Governance**: Issues welcome for structured bug reports and reproducible defects; external code Pull Requests are restricted and closed unless pre-authorized under written agreement.
> - **Governance Document Scope**: Full documentation suite encompassing:
>   1. `LICENSE` (Strict Proprietary Commercial Source-Available License with Scrutinizing Clauses)
>   2. `README.md` (Flagship public overview, architecture highlights, quick start, feature matrix)
>   3. `ARCHITECTURE.md` (Full-stack architecture, client-side IndexedDB vault, Express SSR & dynamic markdown pipeline, PayPal webhook sync, and threat model)
>   4. `SECURITY.md` (Vulnerability disclosure policy, RFC 9116 alignment, response SLAs, scope)
>   5. `CONTRIBUTING.md` (Issue submission guidelines, environment disclosure, PR policy)
>   6. `CODE_OF_CONDUCT.md` (Contributor Covenant v2.1 community standard adapted for commercial source-available repositories)
>   7. `DEVELOPMENT.md` (Local reproduction manual, environment variable configurations, build scripts, linting and verification commands)

---

### 1. Document Architecture & Scope

```
┌────────────────────────────────────────────────────────────────────────┐
│               Public GitHub / Git Repository Root                      │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Legal & Rights    │ Project & Features│ Engineering & Governance       │
│ • LICENSE         │ • README.md       │ • ARCHITECTURE.md              │
│   (All Rights     │   (Master Guide & │ • SECURITY.md                  │
│    Reserved)      │    Quickstart)    │ • CONTRIBUTING.md              │
│                   │                   │ • CODE_OF_CONDUCT.md           │
│                   │                   │ • DEVELOPMENT.md               │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

#### Document Details

1. **`LICENSE` (Strict Proprietary Commercial Source-Available)**
   - **Legal Posture**: Copyright © 2026 DECK / divider. All Rights Reserved.
   - **Limited License**: Source-available for private inspection, educational study, and security auditing only.
   - **Scrutinizing Restrictive Clauses**:
     - *No Commercial Exploitation*: Strict prohibition against selling, leasing, sublicensing, or using any part of the codebase to power a commercial product or service.
     - *No Hosted Service / SaaS Cloning*: Prohibition on hosting public or private web deployments for third-party access (no "Collectr clones" or hosted instances).
     - *Anti-Scraping & AI Training Restrictions*: Explicit prohibition on feeding proprietary source code, internal schemas, or pricing logic into public AI models, generative training corpora, or synthetic code generators without express authorization.
     - *No Circumvention of Entitlement Logic*: Prohibition on altering, bypassing, or stripping subscription checks, PayPal webhook handlers, or local tier limits.
     - *Trademark & Trade Dress Reservation*: Exclusive ownership of the "DECK / divider" brand, visual themes, holographic card shaders, and design assets.
     - *Disclaimer of Warranty & Limitation of Liability*: Comprehensive statutory disclaimers.

2. **`README.md` (Flagship Public Documentation)**
   - High-contrast visual badges: License (Proprietary / Source-Available), React 19, Vite 6, Tailwind CSS v4, TypeScript 5.8, Node.js 22, Express, Play! Pokémon 2026.
   - Executive Pitch: The #1 ad-free digital web application for Pokémon TCG collection valuation, PSA/BGS/CGC slab tracking, and 60-card tournament deck building with 1-click PTCGL export.
   - Core Features:
     - 100% Ad-Free & Privacy-First IndexedDB Card Vault.
     - 2026 Standard Tournament Engine (Regulation Marks H, I, J verified; Mark G rotation).
     - Real-Time Market Comps & Multi-Currency Forex Metronome (USD, EUR, GBP, JPY, CAD, AUD).
     - PSA / BGS / CGC / ACE / ARS Certification Registry with all 4 subgrades.
     - Machine-Native AI Content Negotiation (`Accept: text/markdown` and `*.md` mirrors).
   - System Prerequisites & 3-Step Quick Start.
   - Repository Navigation & Document Index.

3. **`ARCHITECTURE.md` (Technical Deep Dive & System Topology)**
   - Component Architecture diagram (Client SPA, Express Ingress, In-Memory Caches, IndexedDB Vault, Firebase Admin).
   - Storage Model: Local-first persistence (`idb-keyval` / IndexedDB) with optional encrypted cloud snapshot sync.
   - Edge & SEO Subsystem: SSR meta tag hydration, IndexNow push engine, dynamic markdown negotiator (`server/markdownNegotiator.ts`), and sitemap generators.
   - Monetization & Entitlements: PayPal SDK integration, webhook event idempotency, and server-side subscription governor (`subscriptionGovernor.ts`).

4. **`SECURITY.md` (Vulnerability Disclosure Policy)**
   - Supported versions and continuous deployment posture.
   - Reporting channels: `mailto:deckdivider@outlook.com` and RFC 9116 `.well-known/security.txt` parity.
   - Vulnerability response timeline (24-hour acknowledgement, 7-day triage, 90-day coordinated disclosure).
   - Scope: In-scope services, out-of-scope third-party dependencies, and safe harbor policy for ethical security researchers.

5. **`CONTRIBUTING.md` (Contribution & Issue Guidelines)**
   - Clear statement of project model: Proprietary commercial application with open source-available code.
   - Issue reporting workflow: Bug report template, minimum reproduction criteria, console logs, and environment details.
   - PR Restrictions: Explaining why unsolicited pull requests cannot be accepted or merged without legal assignment.

6. **`CODE_OF_CONDUCT.md` (Community Standards)**
   - Based on Contributor Covenant v2.1.
   - Clear standards for respectful interaction on public issues and discussions.
   - Reporting and enforcement guidelines.

7. **`DEVELOPMENT.md` (Developer & Reproduction Guide)**
   - Local environment setup (Node 20+, npm 10+).
   - `.env` configuration breakdown with explanations of public vs. secret variables.
   - NPM scripts reference (`npm run dev`, `npm run build`, `npm run lint`, `npm run icons`).
   - Testing & linting procedures.

---

### Verification & Validation Plan

1. **Compilation & Linting**:
   - Run `lint_applet` (`tsc --noEmit`) and `compile_applet` (`npm run build`) to ensure repository documentation additions do not disrupt the build system.
2. **Document Link & Anchor Consistency**:
   - Verify all cross-references across `README.md`, `LICENSE`, `ARCHITECTURE.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `DEVELOPMENT.md` match exact relative paths.
3. **Legal Text Audit**:
   - Inspect `LICENSE` to confirm all scrutinizing clauses (commercial bar, anti-cloning, anti-scraping/AI training, entitlement protection) are fully formulated and legally enforceable.
