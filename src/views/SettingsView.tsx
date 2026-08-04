import React from 'react';
import {
  DollarSign,
  Download,
  Shield,
  Check,
  Zap,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  DisplayCurrency,
  AccountTier,
  TIER_LIMITS,
  Deck,
  PortfolioCardEntry,
} from '../types';

interface SettingsViewProps {
  currency: DisplayCurrency;
  onSelectCurrency: (c: DisplayCurrency) => void;
  currentTier: AccountTier;
  onChangeTier: (tier: AccountTier) => void;
  decks: Deck[];
  soldEntries: PortfolioCardEntry[];
  exportDataSignal?: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currency,
  onSelectCurrency,
  currentTier,
  onChangeTier,
  decks,
  soldEntries,
  exportDataSignal,
}) => {
  const handleExportData = () => {
    const dataObj = {
      exportDate: new Date().toISOString(),
      currentTier,
      currencyPreference: currency,
      decks,
      soldEntries,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(dataObj, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `deck-divider-export-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  React.useEffect(() => {
    if (exportDataSignal && exportDataSignal > 0) {
      handleExportData();
    }
  }, [exportDataSignal]);

  const tiersList: AccountTier[] = ['Starter', 'Bunch', 'Stack', 'Deck', 'Collection'];

  return (
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* SECTION 1: DISPLAY CURRENCY PREFERENCE */}
      <div className="neo-card p-6 space-y-4 chamfer-corner-sm bg-white border border-[#E2E8F0]">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="p-2 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">
              Display Currency Preference
            </h2>
            <p className="font-mono text-xs text-[#64748B]">
              All portfolio prices, valuations, and market spreads adapt instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'USD', label: 'USD ($)', symbol: '$' },
            { id: 'EUR', label: 'EUR (€)', symbol: '€' },
            { id: 'GBP', label: 'GBP (£)', symbol: '£' },
            { id: 'JPY', label: 'JPY (¥)', symbol: '¥' },
          ].map((c) => {
            const isSelected = currency === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCurrency(c.id as DisplayCurrency)}
                className={`p-4 rounded-md border font-mono text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-sm'
                    : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <span>{c.label}</span>
                {isSelected && <Check className="w-4 h-4 text-[#DC143C]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: DATA EXPORT */}
      <div className="neo-card p-6 space-y-4 chamfer-corner-sm bg-white border border-[#E2E8F0]">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
          <div className="p-2 rounded-lg bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">
              Portfolio Data Export
            </h2>
            <p className="font-mono text-xs text-[#64748B]">
              Download your complete deck entries, purchase dates, and grading records as JSON.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-mono text-xs text-[#64748B]">
            Exporting {decks.length} decks with {soldEntries.length} logged sold cards.
          </p>
          <button
            type="button"
            onClick={handleExportData}
            className="neo-btn-secondary px-4 py-2.5 text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#DC143C]" />
            <span>Download Portfolio Backup</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: SUBSCRIPTION MANAGEMENT & TIER COMPARISON */}
      <div className="neo-card p-6 space-y-6 chamfer-corner-sm bg-white border border-[#E2E8F0]">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFFBEB] text-[#854D0E] border border-[#FFD700]">
              <Zap className="w-5 h-5 text-[#CA8A04]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-[#0F172A]">
                  Account Tier: {currentTier}
                </h2>
                <span className="font-mono text-[10px] font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded-md">
                  Current Plan
                </span>
              </div>
              <p className="font-mono text-xs text-[#64748B]">
                {TIER_LIMITS[currentTier].tagline}
              </p>
            </div>
          </div>

          <div className="text-right font-num">
            <span className="font-bold text-2xl text-[#0F172A]">
              ${TIER_LIMITS[currentTier].priceMonthly}
            </span>
            <span className="font-mono text-xs text-[#64748B]">/mo</span>
          </div>
        </div>

        {/* Note on Collection Top Tier Name Pun */}
        <div className="p-3.5 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 font-mono text-xs text-[#0F172A] leading-relaxed">
          <span className="font-bold text-[#DC143C]">Note on Top Tier "Collection":</span> The top tier removes every deck and per-deck card limit so you can finally hold your whole collection in one place!
        </div>

        {/* 5 TIERS COMPARISON CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {tiersList.map((tierName) => {
            const limit = TIER_LIMITS[tierName];
            const isCurrent = currentTier === tierName;

            return (
              <div
                key={tierName}
                className={`p-4 chamfer-corner-sm border flex flex-col justify-between space-y-4 transition-all ${
                  isCurrent
                    ? 'bg-white border-2 border-[#DC143C] shadow-sm'
                    : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-[#0F172A]">
                      {tierName}
                    </span>
                    {tierName === 'Collection' && (
                      <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                    )}
                  </div>

                  <div className="font-num">
                    <span className="font-bold text-xl text-[#0F172A]">
                      ${limit.priceMonthly}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B]">/mo</span>
                  </div>

                  <div className="space-y-1.5 pt-2 font-mono text-xs border-t border-[#E2E8F0]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Decks:</span>
                      <span className="font-bold text-[#0F172A]">
                        {limit.maxDecks === Infinity ? 'Unlimited' : limit.maxDecks}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Cards/Deck:</span>
                      <span className="font-bold text-[#0F172A]">
                        {limit.maxCardsPerDeck === Infinity ? 'Unlimited' : limit.maxCardsPerDeck}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B]">Public Link:</span>
                      <span className="font-bold text-[#0F172A]">
                        {limit.canSharePublicLinks ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {isCurrent ? (
                  <div className="w-full py-2 bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 font-mono text-xs font-bold text-center rounded-md">
                    Active Plan
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onChangeTier(tierName)}
                    className="w-full neo-btn-secondary py-2 text-xs text-center"
                  >
                    Switch to {tierName}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
