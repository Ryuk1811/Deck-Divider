# Web Cache Purge Engine & Codebase Data Rotation Implementation Plan

A comprehensive architectural overhaul to directly invalidate and purge stale web caches across major search engines (Bing, Yandex, IndexNow consortium) and AI search crawlers (Perplexity, ChatGPT, Claude), paired with an on-demand server cache-purge endpoint, a CLI purge runner, and a systematic refresh and rotation of all outdated tournament rotation dates, competitive meta decks, catalog statistics, and platform truth statements.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during Phase 1 clarification:
> - **Web Cache Purge Strategy**: Automated IndexNow API batch submission across all canonical URLs paired with automated sitemap pings to Google and Bing.
> - **Codebase Data Refresh Priorities**: Rotate and refresh tournament rotation dates, competitive meta deck rosters, and expansion catalog statistics across all canonical data files.
> - **On-Demand Admin Purge**: Provide an active server-side admin endpoint (`POST /api/admin/cache/purge`) and standalone CLI command (`npm run purge:cache`) to flush server in-memory caches, rotate build hashes, and broadcast IndexNow invalidations on demand.

---

### 1. Overview & Core Concept

1. **The Stale Web Cache Problem**:
   Search engines, AI answer engines, and proxy caches retain stale snapshots of cards, old rotation rules (e.g. referencing pre-rotation Mark G or older pricing), and outdated tier pricing. Without active invalidation signals, search bots may take weeks or months to naturally re-crawl dynamic SPA or SSR routes.
2. **The Purge & Broadcast Solution**:
   - **IndexNow Batch Broadcaster**: Submit all ~500+ priority canonical routes (core landing pages, directory hubs, format legality checkers, tournament decks, and dynamic markdown mirrors) in parallel chunks to `api.indexnow.org`.
   - **Search Engine Sitemap Pinger**: Dispatch HTTP GET pings to Google and Bing sitemap notification endpoints with the fresh `/sitemap-index.xml` timestamp.
   - **Server-Side Cache Purge Engine**: Re-implement `POST /api/admin/cache/purge` to actually wipe in-memory catalog caches, rotate the `BUILD_HASH` and `BUILD_TIMESTAMP`, emit `Clear-Site-Data: "cache"` response headers, and broadcast IndexNow updates.
   - **Codebase-Wide Data Rotation**: Scan and synchronize all outdated data across:
     - `src/config/platformTruth.ts`: Align legacy tier names and pricing with canonical `CENTRAL_ENTITLEMENTS` (Starter $0, Bunch $4, Stack $7, Deck $11, Collection $14, Lifetime $149).
     - `src/data/formatLegalityCanon.ts`: Confirm 2026/2027 Play! Pokémon Standard format definitions (Regulation Marks H, I, J active; Mark G rotated out).
     - `src/data/catalogStatsCanon.ts`: Update expansion counts, latest 2026 sets (Prismatic Evolutions, Surging Sparks, Stellar Crown), and total card indices.
     - `src/data/tournamentDecks.ts`: Refresh championship meta tiers, card counts, estimated market values, and rotation statuses.

---

### 2. User Experience & Operational Touchpoints

- **Admin Operations**: Superusers calling `POST /api/admin/cache/purge` receive a detailed JSON payload displaying:
  - Timestamp of purge and new `buildHash`.
  - Number of canonical URLs dispatched to IndexNow.
  - Number of sitemaps submitted.
  - Memory caches evicted (TCG catalog, forex, markdown negotiator).
- **CLI Developer Tool**: Developers can execute `npm run purge:cache` locally or via CI/CD to broadcast cache invalidation without requiring a browser login session.
- **Visitor Experience**: Edge CDNs and user browsers receive dynamic cache-busting headers on the next request, guaranteeing that updated deck legality and pricing tables render immediately without lingering stale localStorage or browser cache.

---

### 3. Key Technical Decisions & Trade-Offs

- **Decision 1: Direct IndexNow Submission vs. Passive Sitemap Updates**
  - *Chosen Approach*: Active IndexNow batch push alongside sitemap pings.
  - *Why*: Standard sitemap updates require search engines to poll periodically. IndexNow immediately informs Bing, Yandex, Seznam, and participating AI crawlers that URLs have changed within seconds.
- **Decision 2: Dynamic In-Memory `BUILD_HASH` Rotation**
  - *Chosen Approach*: Allow `BUILD_HASH` and `BUILD_TIMESTAMP` in `server/publicFootprintManager.ts` to be dynamically rotated in memory upon purge.
  - *Why*: Enables immediate ETag and Cache-Control invalidation across all SSR and markdown endpoints without requiring a full container restart.
- **Decision 3: Canonical Truth Alignment across Configs**
  - *Chosen Approach*: Unify `platformTruth.ts` directly with `src/config/entitlements.ts`.
  - *Why*: Eliminates contradictions between public marketing copy and actual billing governor limits.

---

### 4. Step-by-Step Implementation Details

#### Step 1: Upgrade IndexNow Engine (`server/indexNow.ts`)
- Add multi-endpoint resilience (dispatching to `api.indexnow.org`, `www.bing.com/indexnow`, and `searchadvisor.yandex.ru/indexnow`).
- Add `pingSearchEngineSitemaps(sitemapUrl: string)` to notify Google and Bing search indexers.
- Add `broadcastFullSitePurge(origin: string)` helper gathering all core routes, format guides, meta decks, and markdown mirrors.

#### Step 2: Implement Real In-Memory Purge & Rotation in `server.ts`
- Upgrade `POST /api/admin/cache/purge`:
  - Reset and rotate `BUILD_HASH` and `BUILD_TIMESTAMP` via `rotateBuildFootprint()`.
  - Invalidate TCG catalog in-memory caches (`clearCatalogCache()`).
  - Execute `broadcastFullSitePurge()`.
  - Attach `Clear-Site-Data: "cache"` and `Cache-Control: no-cache, no-store, must-revalidate` to the admin response.
  - Log action to `adminAuditLogs`.

#### Step 3: Add CLI Purge Script & NPM Command
- Create `scripts/purgeWebCache.ts` that boots the lightweight footprint manager and dispatches IndexNow + sitemap pings.
- Add `"purge:cache": "tsx scripts/purgeWebCache.ts"` to `package.json`.

#### Step 4: Refresh & Rotate Stale Claims and Outdated Data
- **`src/config/platformTruth.ts`**:
  - Replace outdated tiers (`Stack`, `Deck`, `Binder`) with canonical tier entitlements (`Starter`, `Bunch`, `Stack`, `Deck`, `Collection`, `Lifetime`).
  - Update pricing figures to match live PayPal plans ($0, $4, $7, $11, $14, $149).
- **`src/data/catalogStatsCanon.ts`**:
  - Refresh catalog numbers to reflect latest 2026 expansions (Scarlet & Violet: Prismatic Evolutions, Surging Sparks, Stellar Crown, Shrouded Fable, Twilight Masquerade).
  - Clarify verified TCGplayer daily market syncs.
- **`src/data/tournamentDecks.ts`**:
  - Audit and refresh 2026 tournament deck archetypes, ensuring clean separation between active Standard rosters (Regulation Marks H, I, J) and Expanded rosters (Regulation Mark F/G).
- **`src/data/formatLegalityCanon.ts`**:
  - Ensure all references to rotation dates and active regulation marks are strictly synchronized.

---

### 5. Verification & Validation Plan

1. **Purge Endpoint Verification**:
   - Issue test requests to `POST /api/admin/cache/purge` with superuser credentials and verify the response reports URL counts and rotated build hashes.
2. **CLI Runner Verification**:
   - Run `npm run purge:cache` and verify clean execution with console progress logging.
3. **Data Parity & Lint Check**:
   - Run `npm run lint` (`tsc --noEmit`) to ensure complete type safety across all updated data files.
   - Run `compile_applet` (`npm run build`) to confirm clean build compilation.
4. **Header & Mirror Verification**:
   - Check `curl -I http://localhost:3000/robots.txt` and `curl -I http://localhost:3000/llms.txt`.
   - Verify that markdown mirrors (`/decks.md`, `/compare.md`, `/pricing.md`) reflect the refreshed canon.
