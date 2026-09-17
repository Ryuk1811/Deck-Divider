import React from 'react';
import { Search, Sparkles, User } from 'lucide-react';
import { ActiveTab } from './Sidebar';
import { DisplayCurrency } from '../../types';

interface MobileTopBarProps {
  activeTab: ActiveTab;
  currency: DisplayCurrency;
  userEmail?: string;
  onOpenSearch: () => void;
  onOpenAuth?: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle?: string }> = {
  collection: { title: 'Portfolio', subtitle: 'Live Holdings & Valuation' },
  sets: { title: 'Expansions', subtitle: 'Sets & Master Checklists' },
  decks: { title: 'Studio', subtitle: 'Deck Builder & Testing' },
  sealed_vault: { title: 'Sealed Vault', subtitle: 'Boxes, Cases & ETBs' },
  search: { title: 'Card Database', subtitle: 'Live Price & Card Search' },
  metrics: { title: 'Performance', subtitle: 'ROI & Analytics' },
  lists: { title: 'Custom Lists', subtitle: 'Want-lists & Binders' },
  settings: { title: 'Settings', subtitle: 'Preferences & Billing' },
};

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  activeTab,
  currency,
  userEmail,
  onOpenSearch,
  onOpenAuth,
}) => {
  const meta = TAB_TITLES[activeTab] || { title: 'Deck Divider', subtitle: 'TCG Portfolio' };

  return (
    <header
      id="mobile-top-bar"
      className="md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 py-2.5 flex items-center justify-between transition-all"
    >
      {/* Left: View Title (iOS Large Navigation Title style) */}
      <div className="flex flex-col min-w-0 pr-2">
        <h1 className="font-heading font-extrabold text-lg text-slate-900 tracking-tight leading-tight truncate">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <span className="font-mono text-[10px] text-slate-400 font-medium tracking-tight truncate">
            {meta.subtitle}
          </span>
        )}
      </div>

      {/* Right: Instant Search Trigger + Currency Pill / Avatar */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Search Cards (⌘K)"
          aria-label="Search Cards"
        >
          <Search className="w-4 h-4" />
        </button>

        <div className="px-2 py-1 rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-700">
          {currency}
        </div>

        {userEmail ? (
          <div
            className="w-7 h-7 rounded-full bg-slate-900 text-white font-heading font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs"
            title={userEmail}
          >
            {userEmail.charAt(0).toUpperCase()}
          </div>
        ) : (
          onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
              title="Sign In"
            >
              <User className="w-3.5 h-3.5" />
            </button>
          )
        )}
      </div>
    </header>
  );
};
