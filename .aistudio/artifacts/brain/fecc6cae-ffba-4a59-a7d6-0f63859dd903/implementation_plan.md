# Public Pages & Global Site Mobile Responsive Optimization Plan

Comprehensive mobile responsive redesign and layout overhaul for **all public pages and global site layouts** in **DECK / divider**, bringing the public user experience (`/`, `/cards`, `/sets`, `/pokemon`, `/pokemon/:species`, `/rarity`, `/rarity/:raritySlug`, `/set/:setId`, `/set/:setId/checklist`, `/tools`, `/tools/:toolId`, `/compare`, `/best`, `/leaderboard`, `/pricing`, `/about`, `/founder`, `/data-methodology`, `/changelog`, `/contact`, `/privacy`, `/terms`) to the high responsive standards of the internal `/app` workspace.

> [!IMPORTANT] Scope & Confirmed Directives
> - **Scope Target**: Public pages and global public layout wrappers. The internal workspace `/app` already has a strong mobile layout and will remain untouched.
> - **Mobile Navigation**: Sticky bottom navigation tab bar for mobile viewports (< 768px) on public pages (`Home`, `Cards`, `Sets`, `Tools`, `Decks`), matching `/app`'s smooth touch navigation.
> - **Card Grids**: 2-column mobile card grid (`grid-cols-2` on mobile, scaling to 3–6 columns on tablet/desktop) with tap-to-open card detail modals.
> - **Interactive Tools & Calculators**: Vertical stacked input cards with a sticky summary bottom sheet for calculators, trade fair equity tools, and binder planners.

---

## 1. Overview & Core Concept

### Goal
Bring all public marketing, directory, entity, and tool pages to 100% mobile responsiveness. Ensure zero horizontal overflowing text/tables, zero misaligned buttons, smooth touch hitboxes (≥ 44px), and seamless navigation across smartphones (320px–430px), tablets (768px), and foldables.

### Public Pages Responsive Audit & Solutions

1. **Global Public Navigation (`LandingNav.tsx` & `PublicMobileNav.tsx`)**:
   - *Issue*: Top header links currently wrap into multiple lines or overflow horizontally on narrow mobile screens.
   - *Fix*: Maintain a compact, single-line 52px top bar (logo + search trigger + enter app button) and introduce a mobile bottom navigation bar (`fixed bottom-0 z-40 h-16`) on public routes for viewports < 768px.

2. **Public Card Catalog & Species / Rarity Hubs (`/cards`, `/pokemon`, `/pokemon/:species`, `/rarity`, `/rarity/:raritySlug`)**:
   - *Issue*: Fixed grid widths cause horizontal scrolling or clipping on small devices.
   - *Fix*: 2-column mobile grid (`grid-cols-2 gap-2.5 sm:gap-4`) with 44px touch targets and full-screen slide-up card detail modals.

3. **High-Intent Tools Hub (`/tools`, `/tools/:toolId`)**:
   - *Issue*: Multi-column comparison sides in `TradeFairnessCalculator` and complex options in `BinderLayoutPlanner` stack awkwardly or force horizontal scroll on mobile.
   - *Fix*: Stack offer sides vertically on mobile (`flex-col lg:flex-row`), convert binder planner grids to auto-scaling mobile preview sheets, and anchor real-time trade/binder totals in a sticky bottom summary drawer.

4. **Master Set Binder Checklists (`/set/:setId/checklist`) & Entity Views**:
   - *Issue*: Wide 6-column tables (`#`, `Name`, `Rarity`, `Regular`, `Reverse`, `Market Est.`) cause horizontal page overflow on mobile.
   - *Fix*: Render responsive mobile row cards with 44px check targets on mobile (< 640px), maintaining the full table format for tablet/desktop screens.

5. **Public Marketing & Directory Views (`/compare`, `/best`, `/leaderboard`, `/pricing`, `/about`, `/founder`, `/data-methodology`, `/changelog`)**:
   - *Issue*: Multi-column grid cards, comparison matrix tables, and long prose blocks clip on smaller devices.
   - *Fix*: Refactor layout grids to single-column stack on mobile (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), make competitor comparison matrices horizontally scrollable within container cards, and apply balanced typographic line lengths (`max-w-prose`).

6. **Modals & Overlays (`PublicCardDetailModal`, `RedditExportModal`, `QuickLookModal`)**:
   - *Issue*: Fixed desktop modal dialog widths exceed mobile screen boundaries.
   - *Fix*: Convert modals to slide-up bottom sheets on mobile viewports (`w-full max-h-[90vh] rounded-t-3xl sm:rounded-2xl sm:max-w-lg`).

---

## 2. Technical Architecture & Component Scope

### Public Pages Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PUBLIC VIEWPORT CONTAINER (< 768px)                   │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Compact Public Header (Logo, Search, Enter App CTA) (52px, z-30)   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Public Content Area (Responsive Flex/Grid, pb-24 padding)          │ │
│ │                                                                    │ │
│ │  • Catalog/Hubs: grid-cols-2 (mobile) -> grid-cols-3..6 (desktop)  │ │
│ │  • Tools: Single-column vertical stack -> Multi-column (desktop)   │ │
│ │  • Checklists: Responsive touch cards (mobile) -> Table (desktop)  │ │
│ │  • Marketing/Directory: 1-col stack -> 2-3 col grid (desktop)      │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Sticky Bottom Tool Summary Drawer (Contextual, z-35)               │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ Public Mobile Bottom Nav Bar (Fixed bottom-0, 64px height, z-40)   │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Components Being Refactored

1. `src/components/landing/LandingNav.tsx`: Compact single-line mobile header.
2. `src/components/navigation/PublicMobileNav.tsx`: New mobile bottom navigation bar for public routes.
3. `src/views/public/PublicCardsCatalogueView.tsx`: Responsive 2-column mobile grid & horizontal scrollable filter pills.
4. `src/views/public/PublicPokemonDirectoryView.tsx` & `PublicPokemonHubView.tsx`: Responsive species directory & 2-col species card hub.
5. `src/views/public/PublicRarityHubView.tsx`: Responsive rarity selector pills & 2-col card grid.
6. `src/views/public/PublicSetChecklistView.tsx`: Responsive touch row cards for set checklists on mobile.
7. `src/views/public/HighIntentToolsView.tsx`: Mobile stacked layouts for trade fairness calculator and binder layout planner.
8. `src/views/marketing/*` & `src/views/public/*` (Compare, Best, Leaderboard, Pricing, About, Founder, Methodology, Socials): Responsive flex/grid containment and mobile table wrappers.
9. `src/components/modals/*` (PublicCardDetailModal, RedditExportModal): Touch bottom sheet overlays for mobile viewports.

---

## 3. Implementation Steps

1. **Step 1: Public Mobile Navigation Infrastructure**
   - Create `PublicMobileNav.tsx` for mobile viewports on all public routes.
   - Update `LandingNav.tsx` to maintain a single-line compact header.
   - Add bottom padding (`pb-20 md:pb-0`) to public layout wrappers.
2. **Step 2: Public Card Catalog & Species/Rarity Hubs Optimization**
   - Refactor grid containers to `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6`.
   - Update filter pills to horizontal scrolling containers (`overflow-x-auto no-scrollbar`).
3. **Step 3: Public Tools & Calculators Mobile Overhaul**
   - Stack `TradeFairnessCalculator` offers vertically on mobile screens.
   - Scale `BinderLayoutPlanner` pocket preview sheet dynamically on mobile.
   - Add sticky bottom summary sheet for real-time tool metrics.
4. **Step 4: Public Checklists & Directory Table Conversion**
   - Implement responsive mobile row cards for set checklists on screens < 640px.
   - Enforce 44px touch target hitboxes.
5. **Step 5: Marketing & Secondary Public Pages Refinement**
   - Update `/compare`, `/best`, `/leaderboard`, `/pricing`, `/about`, `/founder`, `/data-methodology`, `/changelog` to single-column mobile stacks with horizontally scrollable table wrappers.
   - Convert public modals to slide-up bottom sheets on mobile.
6. **Step 6: Build & Verification**
   - Run `compile_applet` and `lint_applet` to verify clean build with zero TypeScript or syntax errors.
