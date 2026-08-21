import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Download,
  Shield,
  Check,
  Zap,
  Layers,
  Sparkles,
  Globe,
  Search,
  ChevronDown,
} from 'lucide-react';
import {
  DisplayCurrency,
  AccountTier,
  TIER_LIMITS,
  Deck,
  PortfolioCardEntry,
  CURRENCY_SYMBOLS,
  CURRENCY_RATES,
} from '../types';
import { setLiveExchangeRates } from '../utils/formatters';

interface SettingsViewProps {
  currency: DisplayCurrency;
  onSelectCurrency: (c: DisplayCurrency) => void;
  currentTier: AccountTier;
  onChangeTier: (tier: AccountTier) => void;
  decks: Deck[];
  soldEntries: PortfolioCardEntry[];
  exportDataSignal?: number;
  customLists?: any[];
  onTriggerCloudSnapshot?: () => Promise<void>;
  lastSyncedTimestamp?: string | null;
  snapshotMetrics?: { rawSize: number; byteSize: number; compressionRatio: string } | null;
  userEmail?: string | null;
  onResetShowcaseData?: () => void;
}

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  currency,
  onSelectCurrency,
  currentTier,
  onChangeTier,
  decks,
  soldEntries,
  customLists = [],
  exportDataSignal,
  onTriggerCloudSnapshot,
  lastSyncedTimestamp,
  snapshotMetrics,
  userEmail,
  onResetShowcaseData,
}) => {
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [showcaseResetSuccess, setShowcaseResetSuccess] = useState(false);
  const isShowcaseUser = userEmail?.toLowerCase() === 'gurutvamurdia@gmail.com';

  const handleManualSnapshot = async () => {
    if (!onTriggerCloudSnapshot) return;
    setIsSnapshotting(true);
    try {
      await onTriggerCloudSnapshot();
      setSnapshotSuccess(true);
      setTimeout(() => setSnapshotSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSnapshotting(false);
    }
  };
  const [forexInfo, setForexInfo] = useState<{
    rates: Record<string, number>;
    provider: string;
    updated: string;
    loading: boolean;
  }>({
    rates: CURRENCY_RATES,
    provider: 'ExchangeRate API',
    updated: new Date().toISOString(),
    loading: false,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tiersList: AccountTier[] = ['Starter', 'Bunch', 'Stack', 'Deck', 'Collection'];

  const fetchExchangeRates = async (force: boolean = false) => {
    try {
      setForexInfo((prev) => ({ ...prev, loading: true }));
      const url = force ? '/api/exchange-rates?force=true' : '/api/exchange-rates';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          setLiveExchangeRates(data.rates);
          setForexInfo({
            rates: data.rates,
            provider: data.provider || 'ExchangeRate API',
            updated: data.updated || new Date().toISOString(),
            loading: false,
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load exchange rates', e);
      setForexInfo((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleExportData = () => {
    const dataObj = {
      exportDate: new Date().toISOString(),
      currentTier,
      currencyPreference: currency,
      decks,
      soldEntries,
      customLists,
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

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(
    (c) =>
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCurrencyObj =
    SUPPORTED_CURRENCIES.find((c) => c.code === currency) || {
      code: currency,
      name: currency,
      symbol: CURRENCY_SYMBOLS[currency] || '$',
      flag: '🌐',
    };

  const activeRate = forexInfo.rates[currency] ?? 1.0;

  return (
    <div className="app-view-container space-y-8 animate-fade-in">
      {/* SECTION 0: BANNER AND ACTIONS */}
      <div className="p-5 glass-slab shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 flex items-center justify-center text-[#DC143C]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-xl text-[#0F172A]">
                System Configuration
              </h2>
              <p className="font-mono text-xs text-[#64748B] mt-0.5">
                Manage global settings, currency preferences, and export your data.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleExportData}
            className="h-9 px-4 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center justify-center gap-1.5 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-[#DC143C]" />
            <span>Export Collection Data</span>
          </button>
        </div>
      </div>
      {/* SECTION 1: GLOBAL DISPLAY CURRENCY */}
      <div className="p-6 space-y-6 glass-slab shadow-md relative z-30 overflow-visible">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="p-2.5 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 shadow-sm">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">
              Global Display Currency
            </h2>
            <p className="font-mono text-xs text-[#64748B]">
              Select your preferred currency for portfolio valuations and market calculations.
            </p>
          </div>
        </div>

        {/* Currency Selector */}
        <div className="space-y-3 relative z-40">
          <label className="block font-mono text-xs font-bold text-[#0F172A]">
            Active Display Currency Selection:
          </label>
          
          {/* Custom Dropdown Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full p-3 bg-white border-2 border-[#0F172A] rounded-lg font-mono text-sm font-bold text-[#0F172A] flex items-center justify-between shadow-xs hover:border-[#DC143C] focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{activeCurrencyObj.flag}</span>
                <span className="text-[#DC143C] font-extrabold">{activeCurrencyObj.code}</span>
                <span className="text-[#64748B] font-normal">({activeCurrencyObj.name})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] rounded font-mono text-xs font-bold">
                  {activeCurrencyObj.symbol}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#0F172A] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Dropdown Menu Overlay */}
            {isDropdownOpen && (
              <div className="mt-2 bg-white border-2 border-[#0F172A] rounded-xl shadow-2xl p-4 space-y-3 max-h-80 overflow-y-auto relative z-50 animate-fade-in">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search currency code, country, or symbol..."
                    className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-mono focus:outline-none focus:border-[#DC143C]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {filteredCurrencies.map((c) => {
                    const isSelected = currency === c.code;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => {
                          onSelectCurrency(c.code as DisplayCurrency);
                          setIsDropdownOpen(false);
                        }}
                        className={`p-2.5 rounded-lg border text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0F172A] text-white border-[#0F172A] font-bold shadow-xs'
                            : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#FFF0F3] hover:border-[#DC143C]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span>{c.flag}</span>
                          <span className={isSelected ? 'text-[#FFD700]' : 'text-[#DC143C] font-bold'}>{c.code}</span>
                          <span className="truncate opacity-80">{c.name}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#DC143C]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: CLOUD SNAPSHOT & BACKUP */}
      <div className="p-6 space-y-5 glass-slab shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#F0FDF4] text-[#16A34A] border border-[#BBF7D0] shadow-sm">
              <Shield className="w-5 h-5 text-[#16A34A]" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[#0F172A]">
                Cloud Storage & Backup
              </h2>
              <p className="font-mono text-xs text-[#64748B]">
                Automated continuous synchronization for decks, custom lists, and collection inventory.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F0FDF4] border border-[#86EFAC] rounded-md text-emerald-800 font-mono text-xs font-bold">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Automatic Sync Active (6h Interval)</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div className="space-y-1 font-mono text-xs">
            <div className="text-[#0F172A] font-semibold">
              Last Cloud Snapshot:{' '}
              <span className="font-bold text-[#DC143C]">
                {lastSyncedTimestamp
                  ? new Date(lastSyncedTimestamp).toLocaleString()
                  : 'Current Session Active'}
              </span>
            </div>
            <p className="text-[#64748B]">
              Your data automatically backs up in the background every 6 hours. You can also save a snapshot anytime.
            </p>
          </div>

          <button
            type="button"
            onClick={handleManualSnapshot}
            disabled={isSnapshotting}
            className="neo-btn-primary px-5 py-2.5 text-xs flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer self-start sm:self-auto shadow-xs"
          >
            {isSnapshotting ? (
              <span>Saving to Cloud...</span>
            ) : snapshotSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Cloud Backup Saved!</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-white" />
                <span>Save Snapshot to Cloud</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SECTION 3: DATA EXPORT */}
      <div className="p-6 space-y-4 glass-slab shadow-md">
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

      {/* SHOWCASE DEMO MANAGEMENT (Visible exclusively for gurutvamurdia@gmail.com) */}
      {isShowcaseUser && (
        <div className="p-6 space-y-4 glass-slab border-2 border-[#DC143C]/40 shadow-md bg-[#FFF5F5]">
          <div className="flex items-center gap-3 border-b border-[#FECDD3] pb-3">
            <div className="p-2 rounded-lg bg-[#DC143C] text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-[#9F1239]">
                  Showcase Suite Management
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DC143C] text-white">
                  VIP EXCLUSIVE
                </span>
              </div>
              <p className="font-mono text-xs text-[#9F1239]/80">
                Logged in as <span className="font-bold">{userEmail}</span>. Re-seed or restore pristine demonstration portfolio, grail slabs, competitive tournament decks, and sealed products.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="font-mono text-xs text-[#9F1239]">
              Re-populates all graded slabs (BGS 9.5 Moonbreon, PSA 10 Grey Felt Hat), Sealed Evolving Skies & 151 UPC cases, and tournament decks.
            </p>
            <button
              type="button"
              onClick={() => {
                if (onResetShowcaseData) {
                  onResetShowcaseData();
                  setShowcaseResetSuccess(true);
                  setTimeout(() => setShowcaseResetSuccess(false), 3000);
                }
              }}
              className="neo-btn-primary px-4 py-2.5 text-xs flex items-center gap-2 whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              {showcaseResetSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Showcase Data Re-seeded!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Re-seed Showcase Suite</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 3: SUBSCRIPTION MANAGEMENT & TIER COMPARISON */}
      <div className="p-6 space-y-6 glass-slab shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2E8F0] pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FFFBEB] text-[#854D0E] border border-[#FFD700]">
              <Zap className="w-5 h-5 text-[#CA8A04]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-lg text-[#0F172A]">
                  Account Tier: {currentTier}
                </h2>
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

        {/* 5 TIERS COMPARISON CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-2">
          {tiersList.map((tierName) => {
            const limit = TIER_LIMITS[tierName];
            const isCurrent = currentTier === tierName;

            return (
              <div
                key={tierName}
                className={`p-4 border flex flex-col justify-between space-y-4 transition-all glass-slab ${
                  isCurrent
                    ? 'border-2 border-[#DC143C] shadow-md ring-1 ring-[#DC143C]'
                    : 'shadow-xs hover:shadow-md'
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
                      <span className="text-[#64748B]">Lists:</span>
                      <span className="font-bold text-[#0F172A]">
                        {limit.maxLists === Infinity ? 'Unlimited' : limit.maxLists}
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
