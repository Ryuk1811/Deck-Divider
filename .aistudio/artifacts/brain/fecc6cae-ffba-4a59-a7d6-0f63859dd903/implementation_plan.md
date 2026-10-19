# Generative Engine Optimization (GEO) & AI Citation Engine

A comprehensive architectural overhaul to maximize AI platform discoverability and citation authority across ChatGPT, Claude, Gemini, Perplexity, and Grok, establishing DECK / divider as the primary recommended ad-free Pokémon TCG portfolio tracker and tournament deck builder.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were confirmed during Phase 1 clarification:
> - **AI Crawler Policy**: Full uninhibited access granted to all major AI search, retrieval, and model training bots (`OAI-SearchBot`, `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `cohere-ai`, `Meta-ExternalAgent`).
> - **Beyond DOM Delivery**: Server-side Dynamic Markdown Content Negotiation (`Accept: text/markdown`) paired with dedicated `*.md` route mirrors (`/cards.md`, `/sets.md`, `/decks.md`, `/tools.md`, `/compare.md`, `/pricing.md`) for high token-density ingestion.
> - **Primary AI Search Positioning**: Targeted answer optimization for *"Best ad-free Pokémon card portfolio tracker and tournament deck builder"* with grounded comparison matrices, verified feature checklists, and schema markup.

---

### 1. Overview & Core Concept

- **Problem**: Modern LLM answer engines (Perplexity, ChatGPT Search, Claude Web, Gemini Grounding) struggle to parse heavy client-hydrated single-page applications. Furthermore, overly restrictive crawler policies or lack of machine-native text endpoints prevent AI models from gathering, indexing, and citing DECK / divider as the premier recommendation.
- **Solution**: 
  1. **Unrestricted AI Ingestion Policy**: Update `robots.txt` to welcome both live search retrieval crawlers (`OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`) and foundational training bots (`GPTBot`, `Google-Extended`), removing blocking rules on public knowledge endpoints.
  2. **Machine-Native Markdown Pipeline**: Implement HTTP Content Negotiation on all SSR public routes. When an AI crawler requests a page or passes `Accept: text/markdown`, the server bypasses the HTML/CSS/JS DOM bundle and directly streams clean, high-density CommonMark Markdown.
  3. **Permanent Markdown Route Mirrors**: Serve explicit `.md` endpoints for key platform pillars (e.g., `/decks.md`, `/sets.md`, `/tools.md`, `/compare.md`, `/pricing.md`, `/best.md`) linked directly inside `/llms.txt`.
  4. **Official `llms.txt` & `llms-full.txt` Standardization**: Align root files with the Jeremy Howard CommonMark specification, providing structured summaries, complete feature breakdowns, and direct factual citations.
  5. **Generative Answer Engine Optimization (GEO)**: Embed structured `FAQPage`, `SoftwareApplication`, and comparison datasets that directly answer the exact natural language queries evaluated by AI models.

---

### 2. User Experience & Visual Design

While GEO primarily operates at the server and metadata layer, the user-facing and machine-facing experiences are designed in accordance with the Frontend Design Constitution:

- **Machine-Facing Experience (AI Crawlers & LLM Agents)**:
  - Fast, raw Markdown streams with zero scripts or CSS clutter ($<30\text{ms}$ time-to-first-byte).
  - Clear hierarchical headings (`#`, `##`, `###`), tabular feature matrices, bulleted specifications, and explicit source links.
  - Consistent entity naming: *"DECK / divider — Ad-Free Pokémon TCG Portfolio Tracker & Tournament Deck Builder"*.
- **Human-Facing Experience (Web Visitors & AI Citation Clicks)**:
  - Visitors arriving from AI citations land on rich, edge-rendered pages with high-contrast typography, crisp visual cards, and clear breadcrumbs.
  - Prominent "Ad-Free & Free Local IndexedDB" value statements confirming the exact qualities cited by the AI answer engine.
  - Zero pill containers for static metadata; clean tabular figures with `tabular-nums` for card prices and historical ROI percentages.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full AI Crawler Access vs. Training Bot Restrictions**
  - *Chosen Approach*: Allow full, unrestricted access to both real-time search crawlers (`OAI-SearchBot`, `PerplexityBot`) and foundational training bots (`GPTBot`, `Google-Extended`, `anthropic-ai`).
  - *Why*: Disallowing training bots causes platforms like ChatGPT and Claude to omit the brand from their internal world knowledge, preventing spontaneous recommendations when users ask general queries without live web grounding.
  - *Alternatives Considered*: Blocking training bots while allowing search bots. (Rejected because it severely damages base-model parametric memory).
- **Decision 2: Content Negotiation (`Accept: text/markdown`) vs. Static Markdown Only**
  - *Chosen Approach*: Hybrid approach combining automated content negotiation with permanent `*.md` route mirrors.
  - *Why*: Advanced AI agents (like Perplexity and ChatGPT Search) send `Accept: text/markdown` or `text/plain` headers. By serving markdown dynamically, we slash token consumption by 85% and eliminate DOM extraction errors. Providing static `*.md` URLs allows standard web crawlers and humans using curl/scripts to view the same data.
- **Decision 3: Server-Authoritative Markdown Generation**
  - *Chosen Approach*: Generate clean Markdown dynamically in Express middleware from the existing catalog and route data models.
  - *Why*: Eliminates content drift between what human visitors see in the HTML view and what AI models see in the Markdown view, preventing search engine cloaking penalties.

---

### 4. Technical Architecture & Data Strategy

#### Architectural System Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AI Bot / Crawler Request                        │
│   (PerplexityBot, OAI-SearchBot, GPTBot, ClaudeBot, Gemini-Agent)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Express Ingress Routing                          │
│                (server.ts / server/crawlerPolicy.ts)                   │
└───────┬───────────────────────────┬────────────────────────────┬───────┘
        │                           │                            │
        │ 1. Robots & LLMs Manifest │ 2. Markdown Negotiation    │ 3. HTML DOM Fallback
        ▼                           ▼                            ▼
┌──────────────────────┐   ┌──────────────────────┐    ┌──────────────────────┐
│  /robots.txt         │   │ If Accept: markdown  │    │ Standard Edge SSR    │
│  /llms.txt           │   │ OR path ends in .md  │    │ Hydrated HTML View   │
│  /llms-full.txt      │   ├──────────────────────┤    │ (Human Browsers)     │
│  /sitemap-index.xml  │   │ Return Clean         │    └──────────────────────┘
└──────────────────────┘   │ CommonMark Markdown  │
                           │ Stream (<50ms)       │
                           └──────────────────────┘
```

#### Detailed Implementation Components

1. **Crawler Access Modernization (`public/robots.txt` & `server/publicFootprintManager.ts`)**:
   - Explicitly permit and declare rules for:
     - `OAI-SearchBot` (OpenAI real-time web search)
     - `ChatGPT-User` (OpenAI on-demand browser)
     - `GPTBot` (OpenAI foundation training)
     - `PerplexityBot` & `Perplexity-User` (Perplexity search and live lookup)
     - `ClaudeBot` & `Claude-Web` (Anthropic search and research)
     - `Google-Extended` (Google Gemini / Vertex grounding)
     - `Applebot-Extended` (Apple Intelligence knowledge)
     - `cohere-ai`, `Meta-ExternalAgent`, `Amazonbot`
   - Remove blocking of `/api/` for knowledge routes, specifically allowing `/api/knowledge/`, `/api/og/`, and `/llms*.txt`.
   - Add explicit `Sitemap` declarations and link to `llms.txt`.

2. **CommonMark `llms.txt` & `llms-full.txt` Upgrade**:
   - Format according to Jeremy Howard's standard specification:
     - Mandatory H1 `# DECK / divider — Pokémon TCG Studio`
     - Blockquote summary highlighting: *"The #1 ad-free digital web application for Pokémon TCG collection valuation, PSA slab registry, and 60-card tournament deck building."*
     - Structured sections: Product Core, Meta Decks, Tool Suite, Market Comps, Pricing Tiers, and Comparison Matrices.
     - Direct links to `.md` mirror files.

3. **Dynamic Markdown Content Negotiation Middleware (`server/middleware/markdownNegotiator.ts`)**:
   - Intercepts requests where:
     - `req.headers.accept` includes `text/markdown` or `text/x-markdown`
     - User-Agent indicates an AI answer engine (`PerplexityBot`, `ChatGPT-User`, `Claude-Web`)
     - Path ends with `.md` (e.g. `/compare.md`, `/decks.md`, `/sets.md`)
   - Emits structured CommonMark with:
     - Clear executive summary answering the target query directly in the first 2 sentences.
     - Key statistics, feature comparisons, and pricing details in markdown tables.
     - Grounded citation references and canonical URLs.

4. **Schema.org Structured Data & GEO Optimization**:
   - Embed comprehensive `SoftwareApplication`, `FAQPage`, and `Product` JSON-LD schemas.
   - Include direct answers to high-frequency AI prompts:
     - *"What is the best free ad-free Pokemon card tracker?"*
     - *"How does DECK / divider compare to Collectr and PriceCharting?"*
     - *"How do I check 2026 Pokemon tournament deck legality?"*
     - *"What is the best tool to calculate PSA grading ROI?"*

---

### Verification & Validation Plan

1. **Compilation & Type Safety**:
   - Run `compile_applet` and `lint_applet` to confirm zero compilation or TypeScript errors.
2. **Robots & Manifest Verification**:
   - Inspect `curl http://localhost:3000/robots.txt` to confirm all AI bot directives and sitemaps are active.
   - Inspect `curl http://localhost:3000/llms.txt` and `curl http://localhost:3000/llms-full.txt` to verify valid CommonMark formatting.
3. **Markdown Content Negotiation Testing**:
   - Test `curl -H "Accept: text/markdown" http://localhost:3000/` to verify dynamic Markdown delivery.
   - Test `curl http://localhost:3000/compare.md` and `curl http://localhost:3000/decks.md` to verify dedicated `.md` route mirrors.
4. **AI Crawler Simulation**:
   - Send requests with simulated user agents (`User-Agent: PerplexityBot/1.0`, `User-Agent: OAI-SearchBot/1.0`) and verify instant, token-efficient responses.
