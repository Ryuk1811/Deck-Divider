# Strategic Pivot: Collection & Art-Style Focus

This project is shifting away from competitive tournament play to focus exclusively on **Collection Management, Art-Style Deck Building, and Master Set Completion**. We are removing all competitive jargon (Standard, Expanded, Win/Loss, Tournament) and refactoring tier limits to provide maximum value for serious collectors.

## 1. Core Aesthetic & Language Pivot
- **Competitive Erasure**: Complete removal of "Tournament", "Battle", "Versus", "VS", "Ladder", "Rank", "Meta", "Championship", and "Format Legality" across the codebase.
- **New Positioning**: Reframing the app as a "Master Collection Vault & Art-Style Roster Builder".
- **Visual Cleanup**: Removing legality badges (Standard/Expanded/GLC) from card details and deck previews.

## 2. Refactored Tier Entitlements
We are increasing value for collectors by expanding capacity while strictly gating advanced features to premium tiers.

| Feature | Starter (Free) | Bunch ($4/mo) | Stack ($7/mo) | Deck ($11/mo) | Collection ($14/mo) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cards per Deck** | 60 (Cap) | 100 (Cap) | 140 (Cap) | 220 (Cap) | **Unlimited (∞)** |
| **Wishlists/Lists** | 0 | 25 (500 items) | 50 (1000 items) | 100 (2500 items) | **Unlimited (∞)** |
| **Sealed Products**| 0 | 100 Items | 300 Items | 750 Items | **Unlimited (∞)** |
| **Graded Slabs** | 0 | 0 | 500 Slabs | 1000 Slabs | **Unlimited (∞)** |

## 3. Feature Gate Adjustments
- **Graded Slab Registry**: Now exclusive to **Stack** tier and above. Starter and Bunch tiers will be prompted to upgrade to access the "Grades" tab and cert logging.
- **Wishlist & Sealed Vault**: Now exclusive to **Bunch** tier and above (removed from free tier).
- **Format Legality Engine**: Completely removed. Replaced by "Master Set Progress" indicators where applicable.
- **PTCGL Export**: Removed in favor of "Artistic Roster Export" (high-res image/PDF sharing).

## 4. Technical Architecture Changes

```unicode
┌─────────────────────────────────────────────────────────┐
│                   App Configuration                     │
│  (src/config/entitlements.ts, src/types.ts)            │
│  - Update TIER_LIMITS with new numeric caps             │
│  - Redefine DECK_SIZE_LADDER (remove competitive labels) │
└───────────────┬─────────────────────────────┬───────────┘
                │                             │
┌───────────────▼───────────────┐  ┌──────────▼───────────┐
│      LimitReachedModal.tsx    │  │  CardDetailModal.tsx │
│  - Update upgrade paths       │  │  - Hide Grades Tab < Stack│
│  - Update feature descriptions│  │  - Remove Legality UI│
└───────────────┬───────────────┘  └──────────┬───────────┘
                │                             │
┌───────────────▼─────────────────────────────▼───────────┐
│                   Global Language Sweep                 │
│  (Landing pages, DecksView, MetricsView, Footers)       │
│  - Delete "Tournament", "Battle", "VS", "Ladder"       │
│  - Replace with "Collection", "Art Style", "Vault"     │
└─────────────────────────────────────────────────────────┘
```

## 5. User Experience Flow
1. **Collector Entry**: Hero text focuses on "Preserving TCG Art & Value" rather than "Building Winning Decks".
2. **Feature Access**: Users on free tier attempting to log a Slab or Sealed item will see a high-value upgrade modal highlighting the "Collector Vault" benefits.
3. **Deck Building**: Decks are labeled as "Art Rosters" or "Item-Specific Sets", removing the pressure of "Standard Format" compliance.
