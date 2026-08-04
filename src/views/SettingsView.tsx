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
  RefreshCw,
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
}) => {
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
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* SECTION 1: GLOBAL DISPLAY CURRENCY & LIVE FOREX CONVERSIONS */}
      <div className="neo-card p-6 space-y-6 chamfer-corner-sm bg-white border border-[#E2E8F0]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-[#0F172A] flex items-center gap-2">
                <span>Global Display Currency & Forex Rates</span>
              </h2>
              <p className="font-mono text-xs text-[#64748B]">
                Select your preferred currency for live portfolio valuations and market calculations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchExchangeRates(true)}
            disabled={forexInfo.loading}
            className="neo-btn-secondary text-xs px-3 py-2 flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#DC143C] ${forexInfo.loading ? 'animate-spin' : ''}`} />
            <span>{forexInfo.loading ? 'Syncing...' : 'Refresh Forex Rates'}</span>
          </button>
        </div>

        {/* Currency Dropdown Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <label className="block font-mono text-xs font-bold text-[#0F172A]">
              Active Display Currency Selection:
            </label>
            
            {/* Custom Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-3 bg-white border-2 border-[#0F172A] rounded-md font-mono text-sm font-bold text-[#0F172A] flex items-center justify-between shadow-sm hover:border-[#DC143C] transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{activeCurrencyObj.flag}</span>
                  <span className="text-[#DC143C] font-extrabold">{activeCurrencyObj.code}</span>
                  <span className="text-[#64748B] font-normal">({activeCurrencyObj.name})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] rounded text-xs">
                    {activeCurrencyObj.symbol}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#0F172A] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Dropdown Menu Overlay */}
              {isDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border-2 border-[#0F172A] rounded-md shadow-xl z-50 p-3 space-y-3 max-h-80 overflow-y-auto">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search currency code, country, or symbol..."
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-mono focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {filteredCurrencies.map((c) => {
                      const isSelected = currency === c.code;
                      const rateVal = forexInfo.rates[c.code] ?? 1.0;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => {
                            onSelectCurrency(c.code as DisplayCurrency);
                            setIsDropdownOpen(false);
                          }}
                          className={`p-2.5 rounded border text-left font-mono text-xs flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-[#0F172A] text-white border-[#0F172A] font-bold'
                              : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#FFF0F3] hover:border-[#DC143C]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span>{c.flag}</span>
                            <span className={isSelected ? 'text-[#FFD700]' : 'text-[#DC143C] font-bold'}>{c.code}</span>
                            <span className="truncate opacity-80">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="opacity-60 text-[10px]">1$ = {rateVal.toFixed(rateVal > 10 ? 1 : 2)}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#DC143C]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Select Buttons for Popular Currencies */}
            <div className="pt-2 space-y-1.5">
              <span className="font-mono text-[11px] text-[#64748B]">Quick Select Major Forex Markets:</span>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_CURRENCIES.slice(0, 8).map((c) => {
                  const isSelected = currency === c.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => onSelectCurrency(c.code as DisplayCurrency)}
                      className={`px-3 py-1.5 rounded-md border font-mono text-xs transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-[#DC143C] text-white border-[#DC143C] font-bold shadow-sm'
                          : 'bg-[#F8FAFC] text-[#0F172A] border-[#E2E8F0] hover:border-[#DC143C]'
                      }`}
                    >
                      <span>{c.flag}</span>
                      <span>{c.code}</span>
                      <span className="opacity-70">({c.symbol})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Exchange Rate Status Card */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md space-y-3 font-mono text-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                <span className="font-bold text-[#0F172A]">Live Forex Conversion</span>
                <span className="inline-flex items-center gap-1.5 text-[10px] bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                  LIVE
                </span>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-[#64748B] text-[11px]">Active Conversion Pair:</div>
                <div className="text-base font-bold text-[#0F172A] flex items-center gap-1">
                  <span>1 USD =</span>
                  <span className="text-[#DC143C]">{activeRate.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                  <span>{currency}</span>
                </div>
              </div>

              <div className="text-[10px] text-[#64748B] space-y-0.5 pt-2 border-t border-[#E2E8F0]">
                <div>Provider: {forexInfo.provider}</div>
                <div>Last Sync: {new Date(forexInfo.updated).toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="p-2 bg-[#FFF0F3] border border-[#DC143C]/20 rounded text-[10px] text-[#0F172A]">
              💡 Changing currency immediately updates all deck values, portfolio charts, and market calculations across the app.
            </div>
          </div>
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
