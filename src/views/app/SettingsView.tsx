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
  Share2,
  Copy,
  Sliders,
  Cloud,
  ExternalLink,
  LogOut,
  LogIn,
  UserCheck,
  Lock,
  Crown,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  DisplayCurrency,
  AccountTier,
  TIER_LIMITS,
  Deck,
  PortfolioCardEntry,
  CURRENCY_SYMBOLS,
  CURRENCY_RATES,
} from '../../types';
import { setLiveExchangeRates } from '../../utils/formatters';
import { useAuth } from '../../lib/AuthContext';
import { PublicShareLinkBox } from '../../components/ui/PublicShareLinkBox';
import { LimitAttemptedAction } from '../../components/modals/LimitReachedModal';

interface SettingsViewProps {
  currency: DisplayCurrency;
  onSelectCurrency: (c: DisplayCurrency) => void;
  currentTier: AccountTier;
  onChangeTier: (tier: AccountTier) => void;
  onSelectLifetime?: () => void;
  isLifetime?: boolean;
  onTriggerLimitModal?: (action: LimitAttemptedAction, details?: any) => void;
  decks: Deck[];
  soldEntries: PortfolioCardEntry[];
  exportDataSignal?: number;
  customLists?: any[];
  onTriggerCloudSnapshot?: () => Promise<void>;
  lastSyncedTimestamp?: string | null;
  snapshotMetrics?: { rawSize: number; byteSize: number; compressionRatio: string } | null;
  userEmail?: string | null;
  userId?: string;
  isPublicProfile?: boolean;
  onTogglePublicProfile?: (isPublic: boolean) => void;
  onResetShowcaseData?: () => void;
  onOpenFunnelMetrics?: () => void;
  onOpenBackupModal?: () => void;
  onSignOut?: () => void;
  onOpenAuth?: () => void;
  onExportCSV?: () => void;
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
  onSelectLifetime,
  isLifetime = false,
  decks,
  soldEntries,
  customLists = [],
  exportDataSignal,
  onTriggerCloudSnapshot,
  lastSyncedTimestamp,
  snapshotMetrics,
  userEmail,
  userId,
  isPublicProfile,
  onTogglePublicProfile,
  onTriggerLimitModal,
  onOpenBackupModal,
  onSignOut,
  onOpenAuth,
  onExportCSV,
}) => {
  const { user, profile, subscription } = useAuth();
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [snapshotSuccess, setSnapshotSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  useEffect(() => {
    if (exportDataSignal && exportDataSignal > 0) {
      handleExportData();
    }
  }, [exportDataSignal]);

  const handleCopyPublicLink = () => {
    if (!userId) return;
    const url = `${window.location.origin}/portfolio/${userId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

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

  return (
    <div className="app-view-container space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
            Settings
          </h1>
          <p className="font-mono text-xs text-[#64748B] mt-0.5">
            Configure application preferences, cloud synchronization, and subscription tiers.
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANEL 1: UNIFIED APP SETTINGS (All App-Based Options in One Panel) */}
      {/* ========================================================================= */}
      <div className="glass-slab shadow-sm border border-[#E2E8F0] rounded-xl overflow-hidden bg-white/90">
        {/* Panel Header */}
        <div className="p-5 bg-slate-50/80 border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 flex items-center justify-center shrink-0 shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#0F172A]">
                Application Preferences
              </h2>
              <p className="font-mono text-xs text-[#64748B] mt-0.5">
                Currency formatting, real-time cloud sync, public portfolio link, and data exports.
              </p>
            </div>
          </div>
        </div>

        {/* Panel Content: Symmetrical, Structured Rows with Dividers */}
        <div className="divide-y divide-[#E2E8F0]">
          {/* SECTION A: GLOBAL DISPLAY CURRENCY */}
          <div className="p-5 sm:p-6 relative z-30">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-[#DC143C]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                      Display Currency
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-600">
                      {activeCurrencyObj.code} • {activeCurrencyObj.symbol}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#64748B] mt-1 leading-relaxed">
                    Select your primary currency for portfolio valuations, price trends, and automated conversion rates.
                  </p>
                </div>
              </div>

              {/* Currency Selector Dropdown */}
              <div className="w-full lg:w-80 shrink-0">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full h-11 px-3.5 bg-white border border-[#CBD5E1] hover:border-[#DC143C] rounded-lg font-mono text-xs font-bold text-[#0F172A] flex items-center justify-between shadow-xs focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-lg leading-none">{activeCurrencyObj.flag}</span>
                      <span className="text-[#DC143C] font-extrabold">{activeCurrencyObj.code}</span>
                      <span className="text-[#64748B] font-normal truncate">({activeCurrencyObj.name})</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Dropdown Menu Overlay */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-full sm:w-96 bg-white border-2 border-[#0F172A] rounded-xl shadow-2xl p-3 space-y-2.5 max-h-80 overflow-y-auto z-50 animate-fade-in">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#94A3B8]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search currency code or country..."
                          className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-mono focus:outline-none focus:border-[#DC143C]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-56 overflow-y-auto pr-1">
                        {filteredCurrencies.map((c) => {
                          const isSelected = currency === c.code;
                          const isCurrencyLocked = c.code !== 'USD' && !TIER_LIMITS[currentTier]?.hasMultiCurrency;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                if (isCurrencyLocked) {
                                  onTriggerLimitModal?.('MULTI_CURRENCY', { currencyCode: c.code });
                                  return;
                                }
                                onSelectCurrency(c.code as DisplayCurrency);
                                setIsDropdownOpen(false);
                              }}
                              className={`p-2 rounded-lg border text-left font-mono text-xs flex items-center justify-between transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#0F172A] text-white border-[#0F172A] font-bold shadow-xs'
                                  : 'bg-white text-[#0F172A] border-[#E2E8F0] hover:bg-[#FFF0F3] hover:border-[#DC143C]'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span>{c.flag}</span>
                                <span className={isSelected ? 'text-[#FFD700]' : 'text-[#DC143C] font-bold'}>{c.code}</span>
                                <span className="truncate opacity-80 text-[11px]">{c.name}</span>
                              </div>
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-[#DC143C]" />
                              ) : isCurrencyLocked ? (
                                <span className="text-[10px] px-1 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono font-bold flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" /> Bunch
                                </span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION B: CLOUD STORAGE & BACKUP */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Cloud className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                      Cloud Storage & Backup
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded font-mono text-[10px] font-bold">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Auto-Sync Active
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#64748B] mt-1 leading-relaxed">
                    Automated background persistence for decks, custom lists, slab records, and collection inventory.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start lg:self-auto">
                {onExportCSV && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!TIER_LIMITS[currentTier]?.hasCsvExport) {
                        onTriggerLimitModal?.('EXPORT_CSV');
                        return;
                      }
                      onExportCSV();
                    }}
                    className="h-10 px-4 neo-btn-secondary text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-xs"
                    title={TIER_LIMITS[currentTier]?.hasCsvExport ? 'Export portfolio to CSV' : 'Export CSV (Deck Tier required)'}
                  >
                    <Download className="w-3.5 h-3.5 text-[#DC143C]" />
                    <span>Export CSV</span>
                    {!TIER_LIMITS[currentTier]?.hasCsvExport && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded font-mono font-bold flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Deck
                      </span>
                    )}
                  </button>
                )}

                {onOpenBackupModal && (
                  <button
                    type="button"
                    onClick={onOpenBackupModal}
                    className="h-10 px-4 neo-btn-secondary text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-xs"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#DC143C]" />
                    <span>Point-in-Time Backups</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleManualSnapshot}
                  disabled={isSnapshotting}
                  className="h-10 px-4 neo-btn-primary text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-xs"
                >
                  {isSnapshotting ? (
                    <span>Saving...</span>
                  ) : snapshotSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Snapshot Saved!</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-white" />
                      <span>Save Snapshot Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sync Timestamp Metadata Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
              <div className="text-[#64748B] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Last Cloud Sync:</span>
                <span className="font-bold text-[#0F172A]">
                  {lastSyncedTimestamp
                    ? new Date(lastSyncedTimestamp).toLocaleString()
                    : 'Active Continuous Session'}
                </span>
              </div>
              <span className="text-[11px] text-[#94A3B8]">
                Auto-saved every 6 hours and upon portfolio modifications
              </span>
            </div>
          </div>

          {/* SECTION C: PUBLIC PORTFOLIO SHARING */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                      Public Portfolio Link
                    </h3>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      isPublicProfile 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-slate-100 border-slate-200 text-slate-600'
                    }`}>
                      {isPublicProfile ? 'PUBLIC' : 'PRIVATE'}
                    </span>
                    {!TIER_LIMITS[currentTier]?.canSharePublicLinks && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Lock className="w-3 h-3 text-amber-600" />
                        Stack Tier Required
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs text-[#64748B] mt-1 leading-relaxed">
                    Generate a read-only showcase link to share your graded slabs, binders, and collection statistics.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                <span className="font-mono text-xs font-bold text-slate-500">
                  {isPublicProfile ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPublicProfile && !TIER_LIMITS[currentTier]?.canSharePublicLinks) {
                      if (onTriggerLimitModal) {
                        onTriggerLimitModal('SHARE_PUBLIC_LINK');
                      } else {
                        onChangeTier('Stack');
                      }
                      return;
                    }
                    onTogglePublicProfile?.(!isPublicProfile);
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 ${
                    isPublicProfile ? 'bg-[#16A34A]' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle Public Profile"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublicProfile ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {isPublicProfile && (
              <div className="pt-2">
                <PublicShareLinkBox
                  isPublic={Boolean(isPublicProfile)}
                  url={`${window.location.origin}/portfolio/${userId || 'guest'}`}
                />
              </div>
            )}
          </div>

          {/* SECTION D: DATA EXPORT */}
          <div className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Download className="w-4 h-4 text-[#0F172A]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                      Portfolio Data Export
                    </h3>
                    <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px] font-bold text-slate-600">
                      JSON Format
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#64748B] mt-1 leading-relaxed">
                    Download a full JSON backup including {decks.length} deck configurations, {soldEntries.length} sales logs, and custom lists.
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={handleExportData}
                  className="h-10 px-4 neo-btn-secondary text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-lg whitespace-nowrap cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#DC143C]" />
                  <span>Download Backup JSON</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION E: ACCOUNT & SESSION MANAGEMENT */}
          <div className="p-5 sm:p-6 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 max-w-xl">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                      Account & Active Session
                    </h3>
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      user 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {user ? 'AUTHENTICATED' : 'GUEST SESSION'}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#64748B] mt-1 leading-relaxed">
                    {user
                      ? `Signed in as ${user.email || profile?.displayName || 'Collector'} (${user.providerData?.[0]?.providerId === 'google.com' ? 'Google Account' : 'Email/Password'})`
                      : 'Running in temporary local browser storage. Sign in or register to sync your slabs and decks across all devices.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                {user ? (
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="h-10 px-4 bg-white hover:bg-[#FFF0F3] border border-[#CBD5E1] hover:border-[#DC143C] text-[#DC143C] text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-lg whitespace-nowrap cursor-pointer shadow-xs transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="h-10 px-4 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 rounded-lg whitespace-nowrap cursor-pointer shadow-xs transition-colors"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In / Create Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PANEL 2: ACCOUNT TIERS & SUBSCRIPTION MANAGEMENT (Distinct Panel) */}
      {/* ========================================================================= */}
      <div className="glass-slab shadow-sm border border-[#E2E8F0] rounded-xl overflow-hidden bg-white/90">
        {/* Panel Header */}
        <div className="p-5 bg-slate-50/80 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] text-[#854D0E] border border-[#FFD700] flex items-center justify-center shrink-0 shadow-xs">
              <Zap className="w-5 h-5 text-[#CA8A04]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading font-bold text-base sm:text-lg text-[#0F172A]">
                  Account Tier: {currentTier}
                </h2>
                {isLifetime || subscription?.isLifetime || subscription?.isSuperUser ? (
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-600" />
                    Lifetime Collection Member #{subscription?.lifetimeOrderNumber || 1}
                  </span>
                ) : subscription?.daysRemaining !== undefined && subscription?.daysRemaining !== Infinity && currentTier !== 'Starter' ? (
                  <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border flex items-center gap-1 ${
                    subscription.daysRemaining <= 7
                      ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]/30 animate-pulse'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {subscription.daysRemaining} Days Left
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Free Starter Plan
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-[#64748B] mt-0.5">
                {subscription?.governorNote || TIER_LIMITS[currentTier].tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {currentTier !== 'Starter' && !isLifetime && !subscription?.isLifetime && (
              <button
                type="button"
                onClick={() => onChangeTier(currentTier)}
                className="px-3 py-1.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Extend / Renew</span>
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-lg border border-[#E2E8F0] shadow-xs">
              <span className="font-mono text-xs text-[#64748B]">Rate:</span>
              <span className="font-num font-bold text-lg text-[#0F172A]">
                ${TIER_LIMITS[currentTier].priceMonthly}
              </span>
              <span className="font-mono text-[11px] text-[#64748B]">/mo</span>
            </div>
          </div>
        </div>

        {/* Real-time Expiration / Countdown Warning Banner */}
        {subscription?.daysRemaining !== undefined && subscription?.daysRemaining <= 7 && !isLifetime && !subscription?.isLifetime && currentTier !== 'Starter' && (
          <div className="bg-[#FFF0F3] border-b border-[#DC143C]/20 px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#DC143C]">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#DC143C]" />
              <span>
                <strong>Subscription Governor Notice:</strong> Your {currentTier} pass expires in {subscription.daysRemaining} day{subscription.daysRemaining === 1 ? '' : 's'}. Renew now to keep your expanded vaults.
              </span>
            </div>
            <button
              type="button"
              onClick={() => onChangeTier(currentTier)}
              className="px-3 py-1 bg-[#DC143C] text-white rounded font-bold text-xs hover:bg-[#B01030] cursor-pointer shrink-0 self-start sm:self-auto"
            >
              Renew Plan Now
            </button>
          </div>
        )}

        {/* 5 TIERS COMPARISON CARDS - Symmetrical, Aligned Grid */}
        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
            {tiersList.map((tierName) => {
              const limit = TIER_LIMITS[tierName];
              const isCurrent = currentTier === tierName;

              return (
                <div
                  key={tierName}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all relative ${
                    isCurrent
                      ? 'border-2 border-[#DC143C] bg-[#FFF0F3]/30 shadow-md ring-1 ring-[#DC143C]'
                      : 'border-[#E2E8F0] bg-white shadow-xs hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                      <span className="font-heading font-bold text-sm text-[#0F172A]">
                        {tierName}
                      </span>
                      {tierName === 'Collection' ? (
                        <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-[#DC143C]"></span>
                      ) : null}
                    </div>

                    <div>
                      <div className="font-num flex items-baseline gap-1">
                        <span className="font-bold text-2xl text-[#0F172A]">
                          ${limit.priceMonthly}
                        </span>
                        <span className="font-mono text-[11px] text-[#64748B]">/mo</span>
                      </div>
                      {limit.priceYearly > 0 && (
                        <div className="text-[11px] font-mono text-emerald-700 font-bold mt-0.5">
                          ${limit.priceYearly}/yr (${limit.yearlyDiscountPercent}% off)
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-1 font-mono text-xs">
                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Decks</span>
                        <span className="font-bold text-[#0F172A]">
                          {limit.maxDecks === Infinity ? 'Unlimited' : limit.maxDecks}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Cards / Deck</span>
                        <span className="font-bold text-[#0F172A]">
                          {limit.maxCardsPerDeck === Infinity ? 'Unlimited (∞)' : `${limit.maxCardsPerDeck} Cards`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Custom Lists</span>
                        <span className="font-bold text-[#0F172A]">
                          {limit.maxLists === Infinity ? 'Unlimited' : limit.maxLists}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Certified Slabs</span>
                        <span className="font-bold text-[#0F172A]">
                          {limit.maxGradedSlabs === Infinity ? 'Unlimited' : `${limit.maxGradedSlabs} Slabs`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Sealed Vault</span>
                        <span className="font-bold text-[#0F172A]">
                          {limit.maxSealedItems === Infinity ? 'Unlimited' : `${limit.maxSealedItems} Items`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Currencies</span>
                        <span className={`font-bold ${limit.hasMultiCurrency ? 'text-emerald-700' : 'text-slate-500'}`}>
                          {limit.hasMultiCurrency ? 'FX Live' : 'USD Native'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-100">
                        <span className="text-[#64748B]">Tax CSV Export</span>
                        <span className={`font-bold ${limit.hasCsvExport ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {limit.hasCsvExport ? 'Enabled' : 'Locked'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-[#64748B]">Public Link</span>
                        <span className={`font-bold ${limit.canSharePublicLinks ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {limit.canSharePublicLinks ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-auto">
                    {isCurrent ? (
                      currentTier === 'Starter' ? (
                        <div className="w-full h-9 flex items-center justify-center bg-slate-100 text-slate-600 font-mono text-xs font-bold rounded-lg shadow-xs">
                          Active Plan
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onChangeTier(tierName)}
                          className="w-full h-9 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold flex items-center justify-center rounded-lg cursor-pointer shadow-xs transition-colors"
                        >
                          Extend / Renew
                        </button>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => onChangeTier(tierName)}
                        className="w-full h-9 neo-btn-secondary text-xs font-mono font-bold flex items-center justify-center rounded-lg cursor-pointer shadow-xs"
                      >
                        Switch Plan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact $250 Founder Lifetime Pass Card inside Settings */}
          <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-amber-50/90 via-[#FFFDF5] to-amber-50/90 border-2 border-amber-300 text-[#0F172A] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-amber-100/80 border border-amber-300 text-[#CA8A04] flex items-center justify-center shrink-0 shadow-xs">
                <Crown className="w-5 h-5 text-[#B45309]" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-[#0F172A]">
                    Founder Lifetime Pass
                  </h4>
                  <span className="font-mono text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-200 text-amber-900 border border-amber-300">
                    $250 ONE-TIME
                  </span>
                  <span className="font-mono text-[10px] font-bold text-[#64748B]">
                    • 100 Slots Cap
                  </span>
                </div>
                <p className="font-mono text-xs text-[#475569]">
                  Permanent Collection Tier access forever. Zero renewals, zero monthly invoices, and all future expansions included.
                </p>
              </div>
            </div>

            <div className="shrink-0 self-start sm:self-auto">
              {isLifetime || subscription?.isLifetime ? (
                <div className="px-3.5 py-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Active Founder #{subscription?.lifetimeOrderNumber || 1}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onSelectLifetime}
                  className="px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Claim Founder Pass ($250)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

