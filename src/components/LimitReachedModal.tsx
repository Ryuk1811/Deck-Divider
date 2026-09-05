import React from 'react';
import { AlertCircle, ArrowUpRight, CheckCircle2, X } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../types';

interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: AccountTier;
  attemptedAction: 'CREATE_DECK' | 'ADD_CARD_TO_DECK' | 'SHARE_PUBLIC_LINK' | 'CREATE_LIST' | 'ADD_TO_LIST';
  attemptedDetails?: {
    currentCount?: number;
    limitCount?: number;
    deckName?: string;
    listName?: string;
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

  const getNextTier = (tier: AccountTier): AccountTier => {
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

  const nextTierName = getNextTier(currentTier);
  const nextLimit = TIER_LIMITS[nextTierName];

  let title = 'Tier Limit Reached';
  let description = '';
  let unlockHighlight = '';

  if (attemptedAction === 'CREATE_DECK') {
    title = `Deck Creation Limit Hit (${currentLimit.maxDecks} Decks)`;
    description = `You attempted to create deck #${(attemptedDetails?.currentCount || 0) + 1}. Your current ${currentTier} plan allows up to ${currentLimit.maxDecks} decks.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) instantly unlocks ${nextLimit.maxDecks} total decks!`;
  } else if (attemptedAction === 'ADD_CARD_TO_DECK') {
    title = `Per-Deck Card Limit Hit (${currentLimit.maxCardsPerDeck} Cards)`;
    description = `You attempted to add a card to "${attemptedDetails?.deckName || 'Deck'}". Your current ${currentTier} plan caps cards per deck at ${currentLimit.maxCardsPerDeck}.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands your per-deck capacity to ${nextLimit.maxCardsPerDeck} cards per deck!`;
  } else if (attemptedAction === 'SHARE_PUBLIC_LINK') {
    title = 'Public Link Sharing Restricted';
    description = `Sharing public deck links, custom lists, and your portfolio showcase is available starting at the Stack tier ($22/mo) and above. Your ${currentTier} tier items are kept private to your account.`;
    unlockHighlight = 'Upgrade to Stack tier ($22/mo) to generate viewable public links for your items!';
  } else if (attemptedAction === 'CREATE_LIST') {
    title = `Custom List Limit Hit (${currentLimit.maxLists} Lists)`;
    description = `You attempted to create list #${(attemptedDetails?.currentCount || 0) + 1}. Your current ${currentTier} plan allows up to ${currentLimit.maxLists} custom lists.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands your limit to ${nextLimit.maxLists} lists!`;
  } else if (attemptedAction === 'ADD_TO_LIST') {
    title = `Per-List Item Limit Hit (${currentLimit.maxItemsPerList} Cards)`;
    description = `You attempted to add a card to "${attemptedDetails?.listName || 'List'}". Your current ${currentTier} plan caps items per list at ${currentLimit.maxItemsPerList}.`;
    unlockHighlight = `Upgrading to ${nextTierName} ($${nextLimit.priceMonthly}/mo) expands capacity to ${nextLimit.maxItemsPerList} cards per list!`;
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
