import React, { useState } from 'react';
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
import { formatCurrency, ENERGY_COLORS } from '../utils/formatters';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

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
    if (!card) return;
    
    // We already have the card basic info from the index, but let's fetch the full record from TCGdex
    const fetchFullData = async () => {
      try {
        setIsFetchingFull(true);
        const res = await fetch(`/api/tcgdex/cards/${card.id}`);
        if (res.ok) {
          const data = await res.json();
          setFullCardData({
            ...card,
            supertype: data.category || card.supertype,
            subtypes: data.stage ? [data.stage] : card.subtypes,
            category: data.category,
            stage: data.stage,
            hp: data.hp || card.hp,
            types: data.types || card.types,
            attacks: data.attacks?.map((a: any) => ({
              name: a.name,
              cost: a.cost || [],
              damage: a.damage || '',
              text: a.effect || ''
            })),
            weaknesses: data.weaknesses?.map((w: any) => ({
              type: w.type,
              value: w.value
            })),
            retreatCost: Array(data.retreat || 0).fill('Colorless'),
            dexId: data.dexId,
            description: data.description || data.effect,
            regulationMark: data.regulationMark,
            legalities: data.legal ? {
              standard: Boolean(data.legal.standard),
              expanded: Boolean(data.legal.expanded)
            } : card.legalities,
            variants: data.variants || card.variants,
            cardmarket: data.cardmarket ? {
              url: data.cardmarket.url,
              updatedAt: data.cardmarket.updatedAt,
              price: data.cardmarket.prices?.trendPrice || data.cardmarket.prices?.averageSellPrice,
              lowPrice: data.cardmarket.prices?.lowPrice,
              trendPrice: data.cardmarket.prices?.trendPrice,
              avgSellPrice: data.cardmarket.prices?.averageSellPrice,
            } : undefined,
            tcgplayer: data.tcgplayer ? {
              url: data.tcgplayer.url,
              updatedAt: data.tcgplayer.updatedAt,
            } : undefined,
            set: {
              ...card.set,
              name: data.set?.name || card.set.name,
              series: data.set?.serie?.name || card.set.series,
              printedTotal: data.set?.cardCount?.official || card.set.printedTotal,
              total: data.set?.cardCount?.total || card.set.total,
              logoUrl: data.set?.logo ? `/api/tcgdex/image${data.set.logo.replace('https://assets.tcgdex.net', '')}.png` : card.set.logoUrl,
              symbolUrl: data.set?.symbol ? `/api/tcgdex/image${data.set.symbol.replace('https://assets.tcgdex.net', '')}.png` : card.set.symbolUrl,
            }
          });
        }
      } catch (e) {
        console.error('Failed to fetch full card details', e);
      } finally {
        setIsFetchingFull(false);
      }
    };

    fetchFullData();
  }, [card]);

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

    const entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'> = {
      cardId: fullCardData.id,
      card: fullCardData,
      condition,
      quantity,
      purchasePrice,
      purchaseCurrency,
      purchaseDate,
      notes,
      gradingInfo: certNumber ? { company: gradingCompany, grade, certNumber } : undefined,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-white p-6 border border-[#E2E8F0] shadow-2xl my-6 max-h-[90vh] flex flex-col overflow-hidden rounded-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="inline-block rounded-md bg-[#FFF0F3] text-[#DC143C] font-mono text-xs font-bold px-2.5 py-1 border border-[#DC143C]/20">
              {fullCardData.set.name} • #{fullCardData.number}
            </span>
            <h2 className="font-heading font-bold text-xl text-[#0F172A]">
              {fullCardData.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] hover:text-[#DC143C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Grid */}
        <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-6 overflow-hidden flex-1 min-h-0">
          {/* Left Column: Dead-Centered Tidally Locked Pokemon Card */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/60 rounded-xl border border-[#E2E8F0] flex-shrink-0">
            <div className="w-full max-w-[260px] aspect-[0.718] rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-lg relative group bg-white flex items-center justify-center transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={fullCardData.images.large || 'https://images.pokemontcg.io/cardback.png'}
                alt={fullCardData.name}
                className="w-full h-full object-cover"
              />
            </div>

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
          <div className="md:col-span-7 flex flex-col overflow-y-auto pr-2 space-y-4 max-h-[68vh] custom-scrollbar">
            {/* Sticky/Tidally Locked Tab Navigation Bar */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 py-2 border-b border-[#E2E8F0] flex items-center gap-1.5 flex-wrap">
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

              {/* Tab 1: Overview */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Category, Stage, HP & Dex ID Panel */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                    <div>
                      <div className="font-mono text-[10px] text-[#64748B]">Category / Stage</div>
                      <div className="font-heading font-semibold text-xs text-[#0F172A] mt-0.5">
                        {fullCardData.category || fullCardData.supertype} {fullCardData.stage ? `• ${fullCardData.stage}` : ''}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] text-[#64748B]">Hit Points (HP)</div>
                      <div className="font-num font-bold text-sm text-[#DC143C] mt-0.5">
                        {fullCardData.hp ? `${fullCardData.hp} HP` : 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] text-[#64748B]">Pokédex ID</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-0.5">
                        {fullCardData.dexId ? `#${String(fullCardData.dexId[0]).padStart(4, '0')}` : 'N/A'}
                      </div>
                    </div>

                    <div>
                      <div className="font-mono text-[10px] text-[#64748B]">Regulation Mark</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-0.5">
                        {fullCardData.regulationMark ? `Mark ${fullCardData.regulationMark}` : 'Standard'}
                      </div>
                    </div>
                  </div>

                  {/* Format Legalities & Printings Showcase */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Format Legalities */}
                    <div className="p-3 bg-white border border-[#E2E8F0] space-y-1.5 rounded-lg">
                      <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Tournament Format Legalities</div>
                      <div className="flex items-center gap-2 pt-1">
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

                  {/* Weakness & Retreat */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg">
                      <span className="font-mono text-[10px] text-[#64748B]">Weakness</span>
                      <div className="font-mono text-xs font-semibold text-[#0F172A] mt-0.5">
                        {fullCardData.weaknesses
                          ? fullCardData.weaknesses.map((w) => `${w.type} ${w.value}`).join(', ')
                          : 'None'}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg">
                      <span className="font-mono text-[10px] text-[#64748B]">Retreat Cost</span>
                      <div className="font-mono text-xs font-semibold text-[#0F172A] mt-0.5">
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
                        <LineChart data={fullCardData.prices.priceHistory}>
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
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-[#E2E8F0] space-y-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#DC143C]" />
                      <span className="font-heading font-bold text-xs text-[#0F172A]">
                        Manual Grading Record (AI-Free)
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-[#64748B]">
                      Store third-party grading information for cards certified by PSA, BGS, CGC, ACE, or SGC.
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-2">
                      <div>
                        <label className="font-mono text-[10px] text-[#64748B]">Company</label>
                        <select
                          value={gradingCompany}
                          onChange={(e) => setGradingCompany(e.target.value as any)}
                          className="w-full mt-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] rounded-md"
                        >
                          <option value="PSA">PSA</option>
                          <option value="BGS">BGS</option>
                          <option value="CGC">CGC</option>
                          <option value="ACE">ACE</option>
                          <option value="SGC">SGC</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-mono text-[10px] text-[#64748B]">Grade</label>
                        <input
                          type="text"
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          placeholder="e.g. 10"
                          className="w-full mt-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] rounded-md"
                        />
                      </div>

                      <div>
                        <label className="font-mono text-[10px] text-[#64748B]">Cert #</label>
                        <input
                          type="text"
                          value={certNumber}
                          onChange={(e) => setCertNumber(e.target.value)}
                          placeholder="8-digit cert"
                          className="w-full mt-1 p-2 bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] rounded-md"
                        />
                      </div>
                    </div>

                    {grade === '10' && (
                      <div className="mt-2 flex items-center gap-2 p-2 bg-[#FFFBEB] border border-[#FFD700] text-xs font-mono font-bold text-[#854D0E] rounded-md">
                        <Award className="w-4 h-4 text-[#CA8A04]" />
                        <span>Gold Tier Gem Mint Badge Awarded!</span>
                      </div>
                    )}
                  </div>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="font-mono text-[10px] text-[#64748B]">Deck Target</label>
                    <select
                      value={selectedDeckId}
                      onChange={(e) => setSelectedDeckId(e.target.value)}
                      className="w-full mt-0.5 p-2 bg-white border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] rounded-md"
                    >
                      {decks.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[#64748B]">Condition</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as any)}
                      className="w-full mt-0.5 p-2 bg-white border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] rounded-md"
                    >
                      <option value="NM">Near Mint (NM)</option>
                      <option value="LP">Lightly Played (LP)</option>
                      <option value="MP">Moderately Played (MP)</option>
                      <option value="HP">Heavily Played (HP)</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[#64748B]">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-full mt-0.5 p-2 bg-white border border-[#E2E8F0] font-mono text-xs font-semibold font-num text-[#0F172A] rounded-md"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-[#64748B]">Purchase Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full mt-0.5 p-2 bg-white border border-[#E2E8F0] font-mono text-xs font-semibold font-num text-[#0F172A] rounded-md"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-mono text-[10px] text-[#64748B]">List Target</label>
                  <select
                    value={selectedListId}
                    onChange={(e) => setSelectedListId(e.target.value)}
                    className="w-full mt-0.5 p-2 bg-white border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] rounded-md"
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

      {/* Duplicate Check Confirmation Sub-Modal */}
      {duplicateCheckPrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
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
    </div>
  );
};
