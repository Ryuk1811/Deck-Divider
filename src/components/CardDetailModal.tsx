import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Plus,
  ShieldCheck,
  TrendingUp,
  Database,
  Info,
  Check,
  AlertTriangle,
  Award,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import {
  PokemonCard,
  Deck,
  CustomList,
  CardCondition,
  DisplayCurrency,
  GradingInfo,
  PortfolioCardEntry,
} from '../types';
import { formatCurrency, ENERGY_COLORS, convertUSDToCurrency, convertCurrencyToUSD, getCurrencySymbol } from '../utils/formatters';
import { generatePriceHistory, getCardByIdFromEngine, mapToPokemonCard } from '../lib/searchEngine';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

import { CardImage } from './CardImage';
import { GlassSlabFrame } from './GlassSlabFrame';

interface CardDetailModalProps {
  card: PokemonCard | null;
  onClose: () => void;
  decks: Deck[];
  lists: CustomList[];
  currency: DisplayCurrency;
  onAddCardToDeck: (
    deckId: string,
    entry: Omit<PortfolioCardEntry, 'id' | 'isSold'>,
    mode: 'increment' | 'separate'
  ) => void;
  onAddCardToList: (listId: string, cardId: string) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  decks,
  lists,
  currency,
  onAddCardToDeck,
  onAddCardToList,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'prices' | 'raw' | 'grades'>('overview');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'ALL'>('30D');

  // Add to Portfolio inline state
  const [targetType, setTargetType] = useState<'deck' | 'list'>('deck');
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [selectedListId, setSelectedListId] = useState<string>(lists[0]?.id || '');
  const [condition, setCondition] = useState<CardCondition>('NM');
  const [quantity, setQuantity] = useState<number>(1);
  const [purchasePrice, setPurchasePrice] = useState<number>(card?.prices.raw || 0);
  const [purchaseCurrency, setPurchaseCurrency] = useState<DisplayCurrency>(currency);
  const [purchaseDate, setPurchaseDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');

  // Manual Grading state (Grades tab)
  const [gradingCompany, setGradingCompany] = useState<GradingInfo['company']>('PSA');
  const [grade, setGrade] = useState<string>('10');
  const [certNumber, setCertNumber] = useState<string>('');

  // Graded market cheerio scraping state
  const [gradedMarketReport, setGradedMarketReport] = useState<any | null>(null);
  const [isScrapingGradedMarket, setIsScrapingGradedMarket] = useState<boolean>(false);
  const [gradedScrapeError, setGradedScrapeError] = useState<string | null>(null);

  const handleFetchGradedMarket = async () => {
    if (!fullCardData) return;
    setIsScrapingGradedMarket(true);
    setGradedScrapeError(null);
    try {
      const rawVal = fullCardData.prices?.raw || 25;
      const cleanCert = certNumber ? certNumber.trim().replace(/^#/, '') : '';
      const res = await fetch(
        `/api/v1/cert/graded-market?cardName=${encodeURIComponent(fullCardData.name)}&setName=${encodeURIComponent(fullCardData.set?.name || '')}&provider=${encodeURIComponent(gradingCompany)}&grade=${encodeURIComponent(grade)}&certId=${encodeURIComponent(cleanCert)}&rawPrice=${rawVal}`
      );
      if (!res.ok) {
        throw new Error(`Market fetch failed (${res.status})`);
      }
      const data = await res.json();
      if (data.success) {
        setGradedMarketReport(data);
      } else {
        setGradedScrapeError('No market listings found for this grade.');
      }
    } catch (err: any) {
      console.error('Error scraping graded market data:', err);
      setGradedScrapeError(err.message || 'Scraping request failed.');
    } finally {
      setIsScrapingGradedMarket(false);
    }
  };

  // Duplicate Check Modal State
  const [duplicateCheckPrompt, setDuplicateCheckPrompt] = useState<{
    deckId: string;
    existingQuantity: number;
    entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'>;
  } | null>(null);

  // Lazy fetch full card data
  const [fullCardData, setFullCardData] = useState<PokemonCard | null>(card);
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  React.useEffect(() => {
    if (!card) {
      setFullCardData(null);
      return;
    }

    // 1. Instantly construct initial fullCardData from card + local engine index so modal opens IMMEDIATELY
    const engineDoc = getCardByIdFromEngine(card.id);
    const enrichedLocal = engineDoc ? mapToPokemonCard(engineDoc) : null;
    
    const initialData: PokemonCard = {
      ...card,
      ...(enrichedLocal || {}),
      prices: {
        ...card.prices,
        ...(enrichedLocal?.prices || {}),
      },
    };

    setFullCardData(initialData);
    setPurchasePrice(convertUSDToCurrency(initialData.prices?.raw || 0, currency));
    setQuantity(1);
    setNotes('');
    setDuplicateCheckPrompt(null);
    setCertNumber('');

    // 2. Async background fetch with AbortController & 3s timeout
    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const fetchFullData = async () => {
      try {
        setIsFetchingFull(true);
        const res = await fetch(`/api/tcgdex/cards/${card.id}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;

          let extractedRawPrice = initialData.prices?.raw || 0;
          let cmData = data.pricing?.cardmarket;
          let tcgData = data.pricing?.tcgplayer;

          if (tcgData) {
            const variantPrice = tcgData.holofoil?.marketPrice || tcgData.normal?.marketPrice || tcgData['reverse-holofoil']?.marketPrice || tcgData.holofoil?.midPrice || tcgData.normal?.midPrice;
            if (variantPrice && variantPrice > 0) {
              extractedRawPrice = variantPrice;
            }
          } else if (cmData) {
            const cmPrice = cmData.trend || cmData.avg || cmData.avg1;
            if (cmPrice && cmPrice > 0) {
              extractedRawPrice = cmPrice;
            }
          }

          if (extractedRawPrice <= 0) {
            extractedRawPrice = initialData.prices?.raw || 1.50;
          }

          const psa10Est = Number((extractedRawPrice * 3.2).toFixed(2));
          const psa9Est = Number((extractedRawPrice * 1.6).toFixed(2));

          setFullCardData((prev) => {
            if (!prev || prev.id !== card.id) return prev;
            return {
              ...prev,
              supertype: data.category || prev.supertype,
              subtypes: data.stage ? [data.stage] : prev.subtypes,
              category: data.category,
              stage: data.stage,
              hp: data.hp || prev.hp,
              types: data.types || prev.types,
              attacks: data.attacks?.map((a: any) => ({
                name: a.name,
                cost: a.cost || [],
                damage: a.damage || '',
                text: a.effect || ''
              })) || prev.attacks,
              weaknesses: data.weaknesses?.map((w: any) => ({
                type: w.type,
                value: w.value
              })) || prev.weaknesses,
              retreatCost: data.retreat ? Array(data.retreat).fill('Colorless') : prev.retreatCost,
              dexId: data.dexId || prev.dexId,
              description: data.description || data.effect || prev.description,
              regulationMark: data.regulationMark || prev.regulationMark,
              legalities: data.legal ? {
                standard: Boolean(data.legal.standard),
                expanded: Boolean(data.legal.expanded)
              } : prev.legalities,
              variants: data.variants || prev.variants,
              cardmarket: cmData ? {
                url: cmData.url,
                updatedAt: cmData.updated,
                price: cmData.trend || cmData.avg,
                lowPrice: cmData.low,
                trendPrice: cmData.trend,
                avgSellPrice: cmData.avg,
              } : prev.cardmarket,
              tcgplayer: tcgData ? {
                url: tcgData.url,
                updatedAt: tcgData.updated,
              } : prev.tcgplayer,
              prices: {
                raw: extractedRawPrice,
                psa10Estimate: psa10Est,
                psa9Estimate: psa9Est,
                priceHistory: prev.prices?.priceHistory && prev.prices.priceHistory.length > 0
                  ? prev.prices.priceHistory
                  : generatePriceHistory(card.id, extractedRawPrice, 30)
              },
              set: {
                ...prev.set,
                name: data.set?.name || prev.set.name,
                series: data.set?.serie?.name || prev.set.series,
                printedTotal: data.set?.cardCount?.official || prev.set.printedTotal,
                total: data.set?.cardCount?.total || prev.set.total,
                logoUrl: data.set?.logo ? `/api/tcgdex/image${data.set.logo.replace('https://assets.tcgdex.net', '')}.png` : prev.set.logoUrl,
                symbolUrl: data.set?.symbol ? `/api/tcgdex/image${data.set.symbol.replace('https://assets.tcgdex.net', '')}.png` : prev.set.symbolUrl,
              }
            };
          });
        }
      } catch (e: any) {
        if (e.name !== 'AbortError') {
          console.warn('Network detail fetch bypassed, using local card metrics', e);
        }
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setIsFetchingFull(false);
      }
    };

    fetchFullData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [card]);

  const chartData = React.useMemo(() => {
    if (!fullCardData) return [];
    const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : timeRange === '90D' ? 90 : 180;
    return generatePriceHistory(fullCardData.id, fullCardData.prices.raw, days);
  }, [fullCardData, timeRange]);

  if (!card || !fullCardData) return null;

  const rawPrice = fullCardData.prices.raw;
  const psa10Price = fullCardData.prices.psa10Estimate;
  const spread = psa10Price - rawPrice;
  const spreadPercent = rawPrice > 0 ? ((spread / rawPrice) * 100).toFixed(1) : '0';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetType === 'list') {
      if (selectedListId) {
        onAddCardToList(selectedListId, fullCardData.id);
        onClose();
      }
      return;
    }

    if (!selectedDeckId) return;

    const targetDeck = decks.find((d) => d.id === selectedDeckId);
    const existingEntry = targetDeck?.entries.find(
      (e) => !e.isSold && e.cardId === fullCardData.id && e.condition === condition
    );

    const priceInUSD = convertCurrencyToUSD(purchasePrice, currency);

    const entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'> = {
      cardId: fullCardData.id,
      card: fullCardData,
      condition,
      quantity,
      purchasePrice: priceInUSD,
      purchaseCurrency: currency,
      purchaseDate,
      notes,
      gradingInfo: (certNumber || (gradingCompany && grade))
        ? {
            company: gradingCompany,
            grade: grade || '10',
            certNumber: certNumber ? certNumber.trim() : '',
            subgrades: gradedMarketReport?.certData?.subGrades || undefined,
          }
        : undefined,
    };

    if (existingEntry) {
      // Prompt user choice between quantity increment vs separate entry
      setDuplicateCheckPrompt({
        deckId: selectedDeckId,
        existingQuantity: existingEntry.quantity,
        entryData,
      });
    } else {
      onAddCardToDeck(selectedDeckId, entryData, 'separate');
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-5xl bg-white p-4 sm:p-6 md:p-8 border border-[#E2E8F0] shadow-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <span className="flex-shrink-0 whitespace-nowrap inline-block rounded-md bg-[#FFF0F3] text-[#DC143C] font-mono text-xs font-bold px-2.5 py-1 border border-[#DC143C]/20">
              {fullCardData.set.name} • #{fullCardData.number}
            </span>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A] truncate">
              {fullCardData.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] hover:text-[#DC143C] transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Flex */}
        <div className="py-4 flex flex-col lg:flex-row gap-4 lg:gap-6 overflow-hidden flex-1 min-h-0 w-full relative">
          {/* Left Column: Dead-Centered Tidally Locked Pokemon Card */}
          <div className="flex-shrink-0 w-full lg:w-[35%] xl:w-[40%] flex flex-col items-center justify-center p-3 sm:p-4 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/60 rounded-xl border border-[#E2E8F0] overflow-y-auto max-h-[35vh] lg:max-h-full">
            <GlassSlabFrame className="w-full max-w-[220px] sm:max-w-[245px] shadow-2xl my-auto">
              <CardImage
                src={fullCardData.images.large || fullCardData.images.small}
                alt={fullCardData.name}
                cardName={fullCardData.name}
                cardNumber={fullCardData.number}
                setName={fullCardData.set?.name}
                rarity={fullCardData.rarity}
                setId={fullCardData.set?.id}
                className="w-full h-full object-cover"
              />
            </GlassSlabFrame>

            <div className="mt-4 text-center space-y-1">
              <div className="font-mono text-xs text-[#64748B]">
                Illustrated by <span className="font-semibold text-[#0F172A]">{fullCardData.artist || 'Unknown'}</span>
              </div>

              {/* Energy Types & Rarity Badges */}
              <div className="flex items-center justify-center gap-1.5 pt-1 flex-wrap">
                {fullCardData.types?.map((type) => {
                  const style = ENERGY_COLORS[type] || ENERGY_COLORS['Colorless'];
                  return (
                    <span
                      key={type}
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {type}
                    </span>
                  );
                })}
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0F172A] text-white">
                  {fullCardData.rarity}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll View with Tidally Locked Major Details */}
          <div className="flex-1 min-w-0 w-full flex flex-col min-h-0 max-h-[45vh] lg:max-h-full relative bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-1 overflow-hidden">
            <div className="custom-scrollbar flex-1 overflow-y-auto relative">
              {/* Sticky/Tidally Locked Tab Navigation Bar */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-4 py-3 border-b border-[#E2E8F0] flex items-center gap-1.5 flex-wrap flex-shrink-0">
                {[
                  { id: 'overview', label: 'Overview', icon: Info },
                  { id: 'prices', label: 'Prices', icon: TrendingUp },
                  { id: 'raw', label: 'Raw Data', icon: Database },
                  { id: 'grades', label: 'Grades', icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold transition-all border rounded-md ${
                        isActive
                          ? 'bg-[#0F172A] text-white border-[#0F172A]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#0F172A] hover:text-[#0F172A]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Container */}
              <div className="p-4 space-y-4">
                {/* Tab 1: Overview */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    {/* Category, Stage, HP & Dex ID Panel - Inline, Symmetric, Justified */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
                      <div className="flex flex-col justify-center items-center py-1">
                        <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Category</div>
                        <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                          {fullCardData.category || fullCardData.supertype} {fullCardData.stage ? `• ${fullCardData.stage}` : ''}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center py-1 border-l border-[#E2E8F0]">
                        <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Hit Points</div>
                        <div className="font-num font-bold text-xs text-[#DC143C] mt-1">
                          {fullCardData.hp ? `${fullCardData.hp} HP` : 'N/A'}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center py-1 border-t sm:border-t-0 sm:border-l border-[#E2E8F0]">
                        <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Pokédex ID</div>
                        <div className="font-mono font-bold text-xs text-[#0F172A] mt-1">
                          {fullCardData.dexId ? `#${String(fullCardData.dexId[0]).padStart(4, '0')}` : 'N/A'}
                        </div>
                      </div>

                      <div className="flex flex-col justify-center items-center py-1 border-t border-l sm:border-t-0 border-[#E2E8F0]">
                        <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Regulation</div>
                        <div className="font-mono font-bold text-xs text-[#0F172A] mt-1">
                          {fullCardData.regulationMark ? `Mark ${fullCardData.regulationMark}` : 'Standard'}
                        </div>
                      </div>
                    </div>

                  {/* Format Legalities & Printings Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Format Legalities */}
                    <div className="p-3 bg-white border border-[#E2E8F0] space-y-1.5 rounded-lg">
                      <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Tournament Format Legalities</div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
                          fullCardData.legalities?.standard
                            ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                            : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                        }`}>
                          <Check className="w-3.5 h-3.5" /> Standard Legal
                        </span>

                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
                          fullCardData.legalities?.expanded
                            ? 'bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]'
                            : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                        }`}>
                          <Check className="w-3.5 h-3.5" /> Expanded Legal
                        </span>
                      </div>
                    </div>

                    {/* Available Printing Variants */}
                    <div className="p-3 bg-white border border-[#E2E8F0] space-y-1.5 rounded-lg">
                      <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Card Printing Variants</div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {fullCardData.variants?.normal && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-md">
                            Normal
                          </span>
                        )}
                        {fullCardData.variants?.holo && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 rounded-md">
                            Holo
                          </span>
                        )}
                        {fullCardData.variants?.reverse && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F0F9FF] text-[#0284C7] border border-[#7DD3FC] rounded-md">
                            Reverse Holo
                          </span>
                        )}
                        {fullCardData.variants?.firstEdition && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] rounded-md">
                            1st Edition
                          </span>
                        )}
                        {fullCardData.variants?.wPrerelease && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F3E8FF] text-[#7E22CE] border border-[#D8B4FE] rounded-md">
                            Prerelease
                          </span>
                        )}
                        {fullCardData.variants?.secret100 && (
                          <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FFD700]/20 text-[#854D0E] border border-[#FFD700] rounded-md">
                            Secret / Ultra
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Flavor Description / Card Effect */}
                  {fullCardData.description && (
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-1">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Card Text / Description</div>
                      <p className="font-mono text-xs text-[#334155] leading-relaxed italic">
                        "{fullCardData.description}"
                      </p>
                    </div>
                  )}

                  {/* Attacks List */}
                  {fullCardData.attacks && fullCardData.attacks.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-mono text-xs font-bold text-[#0F172A]">Attacks & Abilities</div>
                      {fullCardData.attacks.map((attack, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white border border-[#E2E8F0] space-y-1 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {attack.cost.map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-4 h-4 bg-[#0F172A] text-white font-mono text-[9px] flex items-center justify-center font-bold rounded-full"
                                  >
                                    {c[0]}
                                  </span>
                                ))}
                              </div>
                              <span className="font-heading font-bold text-xs text-[#0F172A]">
                                {attack.name}
                              </span>
                            </div>
                            {attack.damage && (
                              <span className="font-num font-bold text-xs text-[#DC143C]">
                                {attack.damage} DMG
                              </span>
                            )}
                          </div>
                          {attack.text && (
                            <p className="font-mono text-[11px] text-[#64748B] leading-relaxed">
                              {attack.text}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* External Market Links */}
                  {(fullCardData.cardmarket?.url || fullCardData.tcgplayer?.url) && (
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-lg space-y-2">
                      <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Direct Marketplace Records</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {fullCardData.cardmarket?.url && (
                          <a
                            href={fullCardData.cardmarket.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#DC143C] text-xs font-mono font-bold text-[#0F172A] rounded-md transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#DC143C]" />
                            <span>Cardmarket Europe</span>
                            {fullCardData.cardmarket.trendPrice && (
                              <span className="text-[#DC143C] font-num">
                                (€{fullCardData.cardmarket.trendPrice.toFixed(2)})
                              </span>
                            )}
                          </a>
                        )}

                        {fullCardData.tcgplayer?.url && (
                          <a
                            href={fullCardData.tcgplayer.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#DC143C] text-xs font-mono font-bold text-[#0F172A] rounded-md transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#DC143C]" />
                            <span>TCGplayer US</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Weakness & Retreat - Inline, Symmetric, Justified */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-center">
                    <div className="flex flex-col justify-center items-center py-1">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Weakness</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                        {fullCardData.weaknesses
                          ? fullCardData.weaknesses.map((w) => `${w.type} ${w.value}`).join(', ')
                          : 'None'}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center py-1 border-l border-[#E2E8F0]">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase">Retreat Cost</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                        {fullCardData.retreatCost ? `${fullCardData.retreatCost.length} Energy` : 'Free'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Prices */}
              {activeTab === 'prices' && (
                <div className="space-y-4">
                  {/* Price History Chart */}
                  <div className="p-3 bg-white border border-[#E2E8F0] space-y-2 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#0F172A]">
                        30-Day Market Trend
                      </span>
                      <div className="flex gap-1">
                        {['7D', '30D', '90D', 'ALL'].map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setTimeRange(r as any)}
                            className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md ${
                              timeRange === r
                                ? 'bg-[#DC143C] text-white'
                                : 'bg-[#F8FAFC] text-[#64748B]'
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-36 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <XAxis dataKey="date" hide />
                          <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="p-2 bg-[#0F172A] text-white font-num text-xs border border-[#0F172A] shadow-md rounded-md">
                                    <div>{payload[0].payload.date}</div>
                                    <div className="font-bold text-[#FFD700]">
                                      {formatCurrency(payload[0].value as number, currency)}
                                    </div>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#DC143C"
                            strokeWidth={2.5}
                            dot={{ fill: '#DC143C', r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Mandated Single Plain Line Text stating Raw vs Highest Graded Spread */}
                  <div className="p-3.5 bg-[#FFF0F3] border border-[#DC143C]/30 text-xs font-mono text-[#0F172A] rounded-lg">
                    Raw market price is {formatCurrency(rawPrice, currency)}. The current spread to highest PSA 10 estimated tier ({formatCurrency(psa10Price, currency)}) is +{formatCurrency(spread, currency)} (+{spreadPercent}%).
                  </div>
                </div>
              )}

              {/* Tab 3: Raw Data */}
              {activeTab === 'raw' && (
                <div className="space-y-3 text-xs font-mono">
                  {fullCardData.set.logoUrl && (
                    <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between rounded-lg">
                      <div>
                        <div className="text-[10px] text-[#64748B] font-bold">EXPANSION LOGO</div>
                        <div className="font-bold text-[#0F172A]">{fullCardData.set.name}</div>
                      </div>
                      <img src={fullCardData.set.logoUrl} alt={fullCardData.set.name} className="h-10 object-contain max-w-[120px]" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <div><span className="text-[#64748B]">Card ID:</span> <span className="font-bold">{fullCardData.id}</span></div>
                    <div><span className="text-[#64748B]">Set ID:</span> <span className="font-bold">{fullCardData.set.id}</span></div>
                    <div><span className="text-[#64748B]">Set Name:</span> <span className="font-bold">{fullCardData.set.name}</span></div>
                    <div><span className="text-[#64748B]">Series:</span> <span className="font-bold">{fullCardData.set.series}</span></div>
                    <div><span className="text-[#64748B]">Printed Total:</span> <span className="font-bold">{fullCardData.set.printedTotal || 'N/A'}</span></div>
                    <div><span className="text-[#64748B]">Total Count:</span> <span className="font-bold">{fullCardData.set.total || 'N/A'}</span></div>
                    <div><span className="text-[#64748B]">Category:</span> <span className="font-bold">{fullCardData.category || 'Pokémon'}</span></div>
                    <div><span className="text-[#64748B]">Stage:</span> <span className="font-bold">{fullCardData.stage || 'N/A'}</span></div>
                    <div><span className="text-[#64748B]">Regulation Mark:</span> <span className="font-bold">{fullCardData.regulationMark || 'N/A'}</span></div>
                    <div><span className="text-[#64748B]">Pokédex ID:</span> <span className="font-bold">{fullCardData.dexId ? `#${fullCardData.dexId.join(', #')}` : 'N/A'}</span></div>
                    <div><span className="text-[#64748B]">Artist / Illustrator:</span> <span className="font-bold">{fullCardData.artist}</span></div>
                    <div><span className="text-[#64748B]">Rarity Tier:</span> <span className="font-bold">{fullCardData.rarity}</span></div>
                  </div>

                  {fullCardData.flavorText && (
                    <div className="p-3 bg-white border border-[#E2E8F0] italic text-[#64748B] rounded-lg">
                      "{fullCardData.flavorText}"
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Grades */}
              {activeTab === 'grades' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border border-[#E2E8F0] space-y-3 rounded-xl shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#DC143C]" />
                        <span className="font-heading font-bold text-xs text-[#0F172A]">
                          Graded Card Authentication & Market Valuation
                        </span>
                      </div>
                      {(grade === '10' || grade === '9.5') && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-[#FFFBEB] border border-[#FFD700] text-[10px] font-mono font-bold text-[#854D0E] rounded-full">
                          <Award className="w-3 h-3 text-[#CA8A04]" />
                          <span>{grade === '10' ? 'Gem Mint 10' : 'Mint 9.5'}</span>
                        </div>
                      )}
                    </div>

                    <p className="font-mono text-[11px] text-[#64748B]">
                      Assign third-party grading provider, grade, and certification number to track verified slab values.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="flex flex-col">
                        <label className="font-mono text-[10px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                          Grading Provider
                        </label>
                        <select
                          value={gradingCompany}
                          onChange={(e) => {
                            setGradingCompany(e.target.value as any);
                            setGradedMarketReport(null);
                          }}
                          className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                        >
                          <option value="PSA">PSA (Professional Sports Authenticator)</option>
                          <option value="BGS">BGS (Beckett Grading Services)</option>
                          <option value="CGC">CGC (Certified Guaranty Company)</option>
                          <option value="TAG">TAG (Technical Authentication & Grading)</option>
                          <option value="SGC">SGC (Sportscard Guaranty)</option>
                          <option value="MGC">MGC (Majesty Grading Company)</option>
                          <option value="ACE">ACE (Ace Grading)</option>
                          <option value="ARS">ARS (ARISTOCRAT Grading)</option>
                          <option value="PGG">PGG (Platin Grading Service)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="font-mono text-[10px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                          Assigned Grade
                        </label>
                        <select
                          value={grade}
                          onChange={(e) => {
                            setGrade(e.target.value);
                            setGradedMarketReport(null);
                          }}
                          className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                        >
                          <option value="10">Gem Mint / Perfect 10</option>
                          <option value="9.5">Mint+ 9.5</option>
                          <option value="9">Mint 9</option>
                          <option value="8.5">NM-MT+ 8.5</option>
                          <option value="8">NM-MT 8</option>
                          <option value="7">Near Mint 7</option>
                          <option value="6">EX-MT 6</option>
                          <option value="5">EX 5</option>
                          <option value="4">VG-EX 4</option>
                          <option value="3">VG 3</option>
                          <option value="2">Good 2</option>
                          <option value="1">Fair/PR 1</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="font-mono text-[10px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                          Cert #
                        </label>
                        <input
                          type="text"
                          value={certNumber}
                          onChange={(e) => setCertNumber(e.target.value)}
                          placeholder="e.g. 69225215"
                          className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleFetchGradedMarket}
                        disabled={isScrapingGradedMarket}
                        className="flex items-center gap-2 px-4 py-2 bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#B01030] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        {isScrapingGradedMarket ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Fetching {gradingCompany} {grade} Market Value...</span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>Fetch Market Valuation ({gradingCompany} {grade})</span>
                          </>
                        )}
                      </button>
                    </div>

                    {gradedScrapeError && (
                      <div className="p-2.5 bg-[#FEF2F2] border border-[#FECDD3] text-xs font-mono text-[#991B1B] rounded-lg flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-[#DC143C] flex-shrink-0" />
                        <span>{gradedScrapeError}</span>
                      </div>
                    )}
                  </div>

                  {/* Scraped Market Data Results */}
                  {gradedMarketReport && (
                    <div className="space-y-3 animate-fade-in">
                      {/* Verified Registry Record Badge if Cert was found */}
                      {gradedMarketReport.certData && (
                        <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#16A34A]" />
                              <span className="font-mono font-bold text-xs text-[#166534]">
                                Verified Registry Record ({gradedMarketReport.certData.provider})
                              </span>
                            </div>
                            <span className="font-mono text-[10px] text-[#15803D] bg-white border border-[#BBF7D0] px-2 py-0.5 rounded-md">
                              Cert #{gradedMarketReport.certData.certId}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs pt-1 text-[#166534]">
                            <div>
                              <span className="text-[10px] text-[#86EFAC] block">Card</span>
                              <span className="font-bold truncate block">{gradedMarketReport.certData.cardName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#86EFAC] block">Set</span>
                              <span className="font-bold truncate block">{gradedMarketReport.certData.setName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#86EFAC] block">Grade</span>
                              <span className="font-bold block">{gradedMarketReport.certData.gradeLabel}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#86EFAC] block">Year</span>
                              <span className="font-bold block">{gradedMarketReport.certData.year || 'N/A'}</span>
                            </div>
                          </div>

                          {gradedMarketReport.certData.subGrades && (
                            <div className="pt-2 border-t border-[#BBF7D0]/60 grid grid-cols-4 gap-2 text-center font-mono text-[11px] text-[#15803D]">
                              <div className="bg-white/60 p-1 rounded-md">
                                <span className="text-[9px] text-[#166534] block">Centering</span>
                                <span className="font-bold">{gradedMarketReport.certData.subGrades.centering || '10'}</span>
                              </div>
                              <div className="bg-white/60 p-1 rounded-md">
                                <span className="text-[9px] text-[#166534] block">Corners</span>
                                <span className="font-bold">{gradedMarketReport.certData.subGrades.corners || '10'}</span>
                              </div>
                              <div className="bg-white/60 p-1 rounded-md">
                                <span className="text-[9px] text-[#166534] block">Edges</span>
                                <span className="font-bold">{gradedMarketReport.certData.subGrades.edges || '10'}</span>
                              </div>
                              <div className="bg-white/60 p-1 rounded-md">
                                <span className="text-[9px] text-[#166534] block">Surface</span>
                                <span className="font-bold">{gradedMarketReport.certData.subGrades.surface || '10'}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Market Valuation Summary */}
                      <div className="grid grid-cols-3 gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl font-mono">
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Fair Market Value</span>
                          <span className="font-bold text-sm text-[#DC143C]">
                            {formatCurrency(convertUSDToCurrency(gradedMarketReport.gradedMarketData.fairMarketValue, currency), currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Average Sale</span>
                          <span className="font-bold text-xs text-[#0F172A]">
                            {formatCurrency(convertUSDToCurrency(gradedMarketReport.gradedMarketData.averagePrice, currency), currency)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">Market Sales</span>
                          <span className="font-bold text-xs text-[#0F172A]">
                            {gradedMarketReport.gradedMarketData.salesCount} listings
                          </span>
                        </div>
                      </div>

                      {/* Scraped Listings Table */}
                      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
                        <div className="px-3 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between font-mono text-[11px] font-bold text-[#0F172A]">
                          <span>Recent Verified Sales ({gradingCompany} {grade})</span>
                          <span className="text-[#64748B] font-normal">Real-Time Market Listings</span>
                        </div>
                        <div className="divide-y divide-[#E2E8F0] max-h-48 overflow-y-auto">
                          {gradedMarketReport.gradedMarketData.salesHistory.map((item: any, idx: number) => (
                            <div key={idx} className="p-2.5 hover:bg-[#F8FAFC] transition-colors flex items-center justify-between gap-3 text-xs font-mono">
                              <div className="min-w-0 flex-1">
                                <span className="text-[#0F172A] font-medium truncate block">{item.title}</span>
                                <div className="flex items-center gap-2 text-[10px] text-[#64748B] mt-0.5">
                                  <span>{item.date}</span>
                                  <span>•</span>
                                  <span className="text-[#16A34A] font-bold">{item.platform}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="font-bold text-[#0F172A] font-num">
                                  {formatCurrency(convertUSDToCurrency(item.price, currency), currency)}
                                </span>
                                {item.url && (
                                  <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-[#64748B] hover:text-[#DC143C] transition-colors"
                                    title="View Market Listing"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

            {/* Inline Add-to-Portfolio Form */}
            <form onSubmit={handleAddSubmit} className="mt-4 pt-4 border-t border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-xs text-[#0F172A]">
                  Add to Portfolio / List
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetType('deck')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold border rounded-md ${
                      targetType === 'deck'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    }`}
                  >
                    Deck
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType('list')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold border rounded-md ${
                      targetType === 'list'
                        ? 'bg-[#0F172A] text-white border-[#0F172A]'
                        : 'bg-white text-[#64748B] border-[#E2E8F0]'
                    }`}
                  >
                    List
                  </button>
                </div>
              </div>

              {targetType === 'deck' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-[#64748B] mb-1">Deck Target</label>
                    <select
                      value={selectedDeckId}
                      onChange={(e) => setSelectedDeckId(e.target.value)}
                      className="w-full flex-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                    >
                      {decks.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-[#64748B] mb-1">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full flex-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                    >
                      <option value="NM">Near Mint (NM)</option>
                      <option value="LP">Lightly Played (LP)</option>
                      <option value="MP">Moderately Played (MP)</option>
                      <option value="HP">Heavily Played (HP)</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-[#64748B] mb-1">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full flex-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-num text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-mono text-[10px] text-[#64748B] mb-1">Purchase Price ({getCurrencySymbol(currency)} {currency})</label>
                    <input
                      type="number"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full flex-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-num text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <label className="font-mono text-[10px] text-[#64748B] mb-1">List Target</label>
                  <select
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] rounded-lg focus:outline-none focus:border-[#DC143C] transition-colors"
                  >
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button type="submit" className="w-full neo-btn-primary py-2.5 text-xs flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" />
                <span>Confirm & Add Entry</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
      </div>

      {/* Duplicate Check Confirmation Sub-Modal */}
      {duplicateCheckPrompt && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 chamfer-corner-lg">
            <div className="flex items-center gap-2 text-[#DC143C]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                Duplicate Copy Detected
              </h3>
            </div>
            <p className="font-mono text-xs text-[#64748B] leading-relaxed">
              This deck already contains <strong className="text-[#0F172A]">{duplicateCheckPrompt.existingQuantity}</strong> copy of{' '}
              <strong className="text-[#0F172A]">{card.name}</strong> in <strong className="text-[#0F172A]">{duplicateCheckPrompt.entryData.condition}</strong> condition.
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onAddCardToDeck(duplicateCheckPrompt.deckId, duplicateCheckPrompt.entryData, 'increment');
                  setDuplicateCheckPrompt(null);
                  onClose();
                }}
                className="w-full neo-btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Increment Existing Entry Quantity (+{duplicateCheckPrompt.entryData.quantity})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onAddCardToDeck(duplicateCheckPrompt.deckId, duplicateCheckPrompt.entryData, 'separate');
                  setDuplicateCheckPrompt(null);
                  onClose();
                }}
                className="w-full neo-btn-secondary py-2.5 text-xs flex items-center justify-center gap-2"
              >
                <span>Add as a Separate Entry Line</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};
