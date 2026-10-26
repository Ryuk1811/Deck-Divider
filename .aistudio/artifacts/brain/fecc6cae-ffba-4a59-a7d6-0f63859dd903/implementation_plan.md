# Implementation Plan: Permanent Deletion Sync, Metrics Calculation Fix, Public Card Parity & Master Set Binder Engine

## 1. Problem Diagnosis & Scope

### Bug 1: Stale State & Deleted Items Resurfacing on Login / Updates
- **Root Cause**: During authentication in `src/App.tsx`, `initializeAppState` performs a naive bidirectional merge between local IndexedDB and remote Firestore (`users/{uid}/snapshot/current` and subcollections `users/{uid}/decks`, `customLists`, `sealedVault`) using `reconcileFullCollectionState`. When an item or card is deleted locally, it is omitted from the local array. However, because there is no persistent tombstone record, the remote subcollections or stale snapshot re-inject the deleted items as "missing local items" and resurrect them. Furthermore, version/timestamp collisions during updates cause old Firestore documents to overwrite newer local mutations.
- **Solution**: Implement a permanent tombstone synchronization system (`src/lib/tombstoneEngine.ts`). When an item or card entry is deleted, an immutable tombstone is recorded both in local IndexedDB and Firestore (`users/{uid}/sync/tombstones`). The reconciliation engine (`src/lib/syncDeduplicationEngine.ts`) will strictly filter out any tombstoned item across all devices, and automatically purge tombstoned documents from remote subcollections.

### Bug 2: 10-Digit Card Value Becoming a 1000-Digit Overflow in Metrics Tab
- **Root Cause**: In `src/views/app/MetricsView.tsx`:
  1. Financial aggregation lines (`totalHoldingsValue += val`, `totalCostBasis += cost`) do not coerce inputs to `Number`, allowing potential string concatenation (e.g. `"0" + "1000000000"` accumulating repeating digit strings).
  2. `unrealizedGainPercent = totalCostBasis > 0 ? (unrealizedGainLoss / totalCostBasis) * 100 : 0` produces astronomical percentage values when `totalCostBasis` is fractional or near-zero, causing visual overflow in `formatPercent`.
  3. Recharts `YAxis` in `MetricsView.tsx` uses a naive string formatter `tickFormatter={(v) => '$' + v}`, which prints 10+ raw digits (e.g. `$1000000000.0000000000...`) across the screen without compact notation.
  4. Holdings valuation in `MetricsView` hardcodes `entry.card.prices.raw * entry.quantity`, completely ignoring graded slab multipliers (PSA 10: 3.2x, PSA 9: 1.6x) and custom acquisition pricing, creating huge inconsistencies with `CollectionView.tsx`.
- **Solution**:
  - Enforce strict numeric coercion `Number(val) || 0` on every arithmetic operation.
  - Implement compact currency formatting (`formatCompactCurrency`: `$1.2B`, `$450M`, `$25.4K`) for chart axes and KPI cards.
  - Align card valuation logic between `MetricsView.tsx` and `CollectionView.tsx` to account for graded slabs and market comps.
  - Cap `unrealizedGainPercent` calculations and handle edge cases gracefully.

### UI Parity: Public-Facing Cards Locked Down Like In-App Modal
- **Objective**: Match `CardDetailModal.tsx` in `PublicCardDetailModal.tsx` and `PublicCardView.tsx` with:
  - Interactive Holographic foil preview with tilt physics.
  - Raw market price, PSA 10 and PSA 9 estimates, and spread delta.
  - 30-day interactive price history chart.
  - Certified grading company selector (PSA, BGS, CGC, ACE) with grade ladder and verified sales history.
  - Attacks, abilities, regulation marks, weakness, and retreat cost.
  - Locked portfolio action controls ("Add to Binder", "Track Slab", "Add to Wishlist") that display an interactive preview and trigger an instant signup modal.

### New Pro Feature: Master Set Binder & Pokédex Completion Engine
- **Pokémon Domain Focus**: Authentic collector joy, avoiding finance/spreadsheet aesthetics.
- **Features**:
  - Virtual 9-Pocket & 12-Pocket Interactive Binder Simulator with black-matte sleeves and realistic page flipping.
  - Missing card silhouette slots with set numbers to hunt.
  - Realistic holographic foil simulation (Cosmos Holo, Rainbow Holo, Reverse Holo shimmer) on hover.
  - Master Set Checklist & Gap Hunter tracking regular cards, reverse holos, and secret illustration rares.
  - Free tier: 1 basic 9-pocket binder (up to 50 cards).
  - Pro tiers (Bunch / Stack / Collection): Unlimited custom virtual binders, full set completion tracking, 12-pocket Japanese binder mode, and foil texture simulator.
  - **Pricing strictly unchanged**: Starter ($0), Bunch ($6/mo), Stack ($14/mo), Collection ($89 lifetime).

---

## 2. Proposed Changes & Technical Architecture

### 1. Tombstone Engine (`src/lib/tombstoneEngine.ts`)
- `Tombstone` interface: `{ id: string; type: 'deck' | 'card_entry' | 'list' | 'sealed'; deletedAt: string }`.
- `recordTombstone(id, type, uid)`: Writes to IndexedDB and Firestore `users/{uid}/sync/tombstones/{id}`.
- `getActiveTombstones(uid)`: Retrieves all active tombstones.
- `isTombstoned(id, tombstonesSet)`: O(1) lookup.
- `purgeRemoteTombstonedDocs(uid, tombstones)`: Deletes any lingering Firestore subcollection documents.

### 2. Synchronization Hardening (`src/lib/syncDeduplicationEngine.ts` & `src/App.tsx`)
- Update `reconcileDecks`, `reconcileCustomLists`, `reconcileSealedEntries`, and `reconcileFullCollectionState` to accept `tombstonesSet: Set<string>`.
- Any item or entry matching a tombstone is strictly excluded.
- In `src/App.tsx`:
  - In `handleDeleteDeck`, `handleDeleteList`, `handleDeleteSealedEntry`, and card removal handlers, record the tombstone before updating state and saving snapshots.
  - In `initializeAppState`, load tombstones first, apply them during reconciliation, and purge any resurrecting documents from Firestore subcollections.

### 3. Metrics Calculation & Formatter Fixes (`src/views/app/MetricsView.tsx` & `src/utils/formatters.ts`)
- In `src/utils/formatters.ts`:
  - Add `formatCompactCurrency(amountInUSD, targetCurrency)`: outputs `$1.2B`, `$450M`, `$25.4K`, `$120.00`.
  - Fix `formatCurrency` to handle large numbers and NaN safely.
  - Fix `formatPercent` to guard against `Infinity` and cap extreme ratios at `+999.9%` with proper badges.
- In `src/views/app/MetricsView.tsx`:
  - Calculate `val` using effective card market price (including slab multiplier: PSA 10 = 3.2x, PSA 9 = 1.6x, BGS/CGC equivalents).
  - Enforce `Number(...) || 0` on every accumulation variable.
  - Update `AreaChart` `YAxis` to use `formatCompactCurrency`.
  - Ensure KPI cards use tabular numerals and compact formatting for 9+ digit values.

### 4. Public Card Parity (`src/components/modals/PublicCardDetailModal.tsx` & `src/views/public/PublicCardView.tsx`)
- Port the rich card inspection engine from `CardDetailModal.tsx` to `PublicCardDetailModal.tsx`:
  - Holographic foil card canvas with mouse tracking.
  - Price metrics (Raw, PSA 10, PSA 9, Market Spread).
  - 30-day interactive price trend chart with Recharts.
  - Graded market comps and cert verification badge lookup.
  - Locked portfolio actions that open the signup modal when clicked.
- Align `PublicCardView.tsx` to use the same visual layout and interactive preview components.

### 5. Master Set Binder & Pokédex Completion Engine (`src/components/app/MasterSetBinderView.tsx`)
- New collector view accessible via navigation tabs:
  - 9-Pocket (3x3) and 12-Pocket (4x4) virtual binder page layouts.
  - Binder cover selector (Ultra-Pro matte black, Pokéball Crimson, Master Ball Purple).
  - Set completion progress meter (Base cards + Reverse Holo + Secret Rares).
  - Card slotting: Owned cards appear with vibrant art and holographic tilt effects; unowned cards appear as dark silhouette card slots with card numbers and names.
  - Missing Card Gap Checklist: 1-click filter showing only missing cards to complete the set.
  - Tier gating: Free tier allows 1 basic binder; Pro tiers unlock unlimited binders and 12-pocket Master Set mode with high-converting upgrade prompt.

---

## 3. Verification Plan

1. **Deletion & Sync Durability**:
   - Add cards, decks, and lists. Delete an item. Refresh the page and re-login to verify zero resurrection.
   - Verify Firestore `users/{uid}/sync/tombstones` and subcollections are cleaned up.
2. **Metrics Tab & Large Numbers**:
   - Add a card with a 10-digit acquisition value ($1,000,000,000).
   - Verify Metrics tab displays clean `$1.00B` compact value without overflowing the KPI card or chart Y-axis.
   - Verify percentage gain/loss does not display astronomical digits or NaN.
3. **Public Card Modal & View**:
   - Navigate to `/card/base1-4` and `/card/sv3pt5-199`.
   - Verify high-resolution holographic preview, PSA 10/9 comparison, 30-day chart, and graded comps render identically to the in-app modal.
   - Click locked portfolio actions and verify the interactive preview and instant signup modal appear.
4. **Master Set Binder Engine**:
   - Open the Master Set Binder view for an expansion (e.g. 151 or Base Set).
   - Verify owned cards slot into the virtual binder with holographic effects while missing cards show silhouettes.
   - Verify upgrade modal prompts for Pro features with pricing strictly unchanged.
5. **Compilation & Health**:
   - Run `compile_applet` and verify 0 errors.
   - Verify dev server returns 200 OK.
