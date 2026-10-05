import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../../types';

export type LimitAttemptedAction =
  | 'CREATE_DECK'
  | 'ADD_CARD_TO_DECK'
  | 'SHARE_PUBLIC_LINK'
  | 'CREATE_LIST'
  | 'ADD_TO_LIST'
  | 'LOG_CERT_SLAB'
  | 'ADD_SEALED_VAULT'
  | 'MULTI_CURRENCY'
  | 'GLC_FORMAT'
  | 'EXPORT_CSV'
  | 'CLOUD_BACKUP'
  | 'LIVE_GRADED_COMPS';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: AccountTier;
  attemptedAction: LimitAttemptedAction;
  attemptedDetails?: {
    currentCount?: number;
    limitCount?: number;
    deckName?: string;
    listName?: string;
    currencyCode?: string;
    formatName?: string;
  };
  onUpgradeToTier: (tier: AccountTier) => void;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  attemptedAction,
  attemptedDetails,
  onUpgradeToTier,
}) => {
  if (!isOpen) return null;

  const currentLimit = TIER_LIMITS[currentTier];

  const getNextTier = (tier: AccountTier, action: LimitAttemptedAction): AccountTier => {
    if (action === 'EXPORT_CSV') {
      return (tier === 'Deck' || tier === 'Collection') ? 'Collection' : 'Deck';
    }
    if (action === 'GLC_FORMAT') {
      return (tier === 'Stack' || tier === 'Deck' || tier === 'Collection') ? 'Deck' : 'Stack';
    }
    if (action === 'MULTI_CURRENCY' || action === 'CLOUD_BACKUP' || action === 'LIVE_GRADED_COMPS') {
      return tier === 'Starter' ? 'Bunch' : 'Stack';
    }

    switch (tier) {
      case 'Starter':
        return 'Bunch';
      case 'Bunch':
        return 'Stack';
      case 'Stack':
        return 'Deck';
      case 'Deck':
        return 'Collection';
      default:
        return 'Collection';
    }
  };

  const nextTierName = getNextTier(currentTier, attemptedAction);
  const nextLimit = TIER_LIMITS[nextTierName];

  let title = 'Tier Limit Reached';
  let description = '';
  let unlockHighlight = '';

  if (attemptedAction === 'CREATE_DECK') {
    title = `Deck Creation Limit Hit (${currentLimit.maxDecks} Decks)`;
    description = `You attempted to create deck #${(attemptedDetails?.currentCount || 0) + 1}. Your current ${currentTier} plan allows up to ${currentLimit.maxDecks} decks.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) instantly unlocks ${nextLimit.maxDecks === Infinity ? 'Unlimited' : nextLimit.maxDecks} total decks!`;
  } else if (attemptedAction === 'ADD_CARD_TO_DECK') {
    title = `Per-Deck Card Limit Hit (${currentLimit.maxCardsPerDeck} Cards)`;
    description = `You attempted to add a card to "${attemptedDetails?.deckName || 'Deck'}". Your current ${currentTier} plan caps cards per deck at ${currentLimit.maxCardsPerDeck}.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands your per-deck capacity!`;
  } else if (attemptedAction === 'SHARE_PUBLIC_LINK') {
    title = 'Custom Link Slugs & Watermark Removal';
    description = `Your ${currentTier} plan includes public share links with standard DECK / divider badges. Custom handles and ad-free branding are unlocked on Stack tier ($7/mo) and above.`;
    unlockHighlight = 'Upgrade to Stack tier ($7/mo) to unlock custom share handles and premium branding!';
  } else if (attemptedAction === 'CREATE_LIST') {
    title = `Custom List Limit Hit (${currentLimit.maxLists} Lists)`;
    description = `You attempted to create list #${(attemptedDetails?.currentCount || 0) + 1}. Your current ${currentTier} plan allows up to ${currentLimit.maxLists} custom lists.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands your limit to ${nextLimit.maxLists === Infinity ? 'Unlimited' : nextLimit.maxLists} lists!`;
  } else if (attemptedAction === 'ADD_TO_LIST') {
    title = `Per-List Item Limit Hit (${currentLimit.maxItemsPerList} Cards)`;
    description = `You attempted to add a card to "${attemptedDetails?.listName || 'List'}". Your current ${currentTier} plan caps items per list at ${currentLimit.maxItemsPerList}.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands capacity to ${nextLimit.maxItemsPerList === Infinity ? 'Unlimited' : nextLimit.maxItemsPerList} cards per list!`;
  } else if (attemptedAction === 'LOG_CERT_SLAB') {
    title = `Certified Graded Slab Limit Hit (${currentLimit.maxGradedSlabs} Slabs)`;
    description = `You currently have ${attemptedDetails?.currentCount || currentLimit.maxGradedSlabs} verified slabs. Your ${currentTier} tier supports up to ${currentLimit.maxGradedSlabs} certified slabs across PSA, BGS, and CGC.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands your slab registry to ${nextLimit.maxGradedSlabs === Infinity ? 'Unlimited' : nextLimit.maxGradedSlabs} certified slabs!`;
  } else if (attemptedAction === 'ADD_SEALED_VAULT') {
    title = `Sealed Product Vault Limit Hit (${currentLimit.maxSealedItems} Items)`;
    description = `Your ${currentTier} plan supports up to ${currentLimit.maxSealedItems} sealed boxes, ETBs, and blisters in your private vault.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands vault capacity to ${nextLimit.maxSealedItems === Infinity ? 'Unlimited' : nextLimit.maxSealedItems} sealed items!`;
  } else if (attemptedAction === 'MULTI_CURRENCY') {
    title = 'Multi-Currency Conversion Required';
    description = `Displaying real-time valuations in ${attemptedDetails?.currencyCode || 'foreign currencies'} (EUR, GBP, JPY, AUD, CAD) with automatic FX rate conversion requires the Bunch tier ($4/mo) or above.`;
    unlockHighlight = `Upgrade to Bunch ($4/mo) to unlock instant multi-currency conversion across all your decks, binders, and analytics!`;
  } else if (attemptedAction === 'GLC_FORMAT') {
    title = `${attemptedDetails?.formatName || 'Gym Leader Challenge'} Legality Engine`;
    description = `Specialized tournament format rule validation (Gym Leader Challenge singleton rules, Retro formats, and vintage rotation marks) is unlocked on the Stack tier ($7/mo) and above.`;
    unlockHighlight = `Upgrade to Stack ($7/mo) for full GLC singleton validation and classic retro tournament specs!`;
  } else if (attemptedAction === 'EXPORT_CSV') {
    title = 'Portfolio CSV Export for Tax & Insurance';
    description = `Generating one-click CSV inventory spreadsheets formatted for tax schedules, CPA audits, and insurance appraisal schedules is available on the Deck tier ($11/mo) and above.`;
    unlockHighlight = `Upgrade to Deck ($11/mo) to download comprehensive CSV records with cert numbers, purchase basis, and live market comps!`;
  } else if (attemptedAction === 'CLOUD_BACKUP') {
    title = 'Encrypted Cloud Snapshots & Cross-Device Restore';
    description = `Point-in-time cloud snapshots and multi-device automated restore are available starting on the Bunch tier ($4/mo). Starter plan includes unlimited local browser backups.`;
    unlockHighlight = `Upgrade to Bunch ($4/mo) for automated encrypted cloud backups synchronized across all your devices!`;
  } else if (attemptedAction === 'LIVE_GRADED_COMPS') {
    title = 'Live Verified Graded Auction Comps';
    description = `Fetching real-time verified eBay and PWCC auction sales comps for PSA 10, BGS 9.5, and CGC slabs is available on Bunch tier ($4/mo) and above.`;
    unlockHighlight = `Upgrade to Bunch ($4/mo) to fetch real-time slab sales records and population comps!`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-all duration-300 animate-fade-in">
      <div className="w-full max-w-lg bg-white p-6 border border-[#E2E8F0] shadow-2xl rounded-2xl space-y-5 relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C]">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#DC143C] uppercase tracking-wider">
                {currentTier} Plan Capacity
              </span>
              <h3 className="font-heading font-bold text-lg text-[#0F172A] leading-tight">
                {title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="font-mono text-xs text-[#64748B] leading-relaxed">
            {description}
          </p>

          <div className="p-3.5 bg-[#FFF0F3] border border-[#DC143C]/20 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-[#DC143C] font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Recommended Upgrade: {nextTierName} Tier</span>
            </div>
            <p className="font-mono text-[11px] text-[#64748B]">
              {unlockHighlight}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="neo-btn-secondary px-4 py-2 text-xs"
          >
            Stay on {currentTier}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onUpgradeToTier(nextTierName);
            }}
            className="neo-btn-primary px-4 py-2 text-xs flex items-center gap-1.5 shadow-md"
          >
            <span>Upgrade to {nextTierName} (${nextLimit.priceMonthly}/mo)</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
