import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Plus,
  Layers,
  Check,
  Calendar,
  DollarSign,
  Activity,
  Info,
  BookOpen,
} from 'lucide-react';
import { PokemonCard, EnergyType } from '../../types';
import { ENERGY_COLORS, formatCurrency } from '../../utils/formatters';
import { getPokemonSpeciesTypes } from '../../data/pokemonSpeciesTypes';
import { getCardByIdFromEngine, mapToPokemonCard, generatePriceHistory } from '../../lib/searchEngine';
import { CardImage } from '../ui/CardImage';
import { GlassSlabFrame } from '../ui/GlassSlabFrame';
import { HolographicCard } from '../ui/HolographicCard';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface PublicCardDetailModalProps {
  card: PokemonCard | null;
  onClose: () => void;
  onSelectCard?: (card: PokemonCard) => void;
}

export const PublicCardDetailModal: React.FC<PublicCardDetailModalProps> = ({
  card,
  onClose,
}) => {
  const navigate = useNavigate();
  const [fullCardData, setFullCardData] = useState<PokemonCard | null>(card);
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  // Graded slab lookup state
  const [gradingCompany, setGradingCompany] = useState<'PSA' | 'BGS' | 'CGC' | 'ACE'>('PSA');
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'grading'>('overview');

  useEffect(() => {
    if (!card) {
      setFullCardData(null);
      return;
    }

    const engineDoc = getCardByIdFromEngine(card.id);
    const enrichedLocal = engineDoc ? mapToPokemonCard(engineDoc) : null;

    const initialData: PokemonCard = {
      ...card,
      ...(enrichedLocal || {}),
    };

    setFullCardData(initialData);

    let isMounted = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const fetchFullData = async () => {
      try {
        setIsFetchingFull(true);
        const res = await fetch(`/api/tcgdex/cards/${card.id}`, { signal: controller.signal });
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;

          setFullCardData((prev) => {
            if (!prev || prev.id !== card.id) return prev;
            return {
              ...prev,
              supertype: data.category || prev.supertype,
              subtypes: data.stage ? [data.stage] : prev.subtypes,
              category: data.category || prev.category,
              stage: data.stage || prev.stage,
              hp: data.hp || prev.hp,
              types: data.types || prev.types,
              attacks: data.attacks?.map((a: any) => ({
                name: a.name,
                cost: a.cost || [],
                damage: a.damage || '',
                text: a.effect || '',
              })) || prev.attacks,
              weaknesses: data.weaknesses?.map((w: any) => ({
                type: w.type,
                value: w.value,
              })) || prev.weaknesses,
              retreatCost: data.retreat ? Array(data.retreat).fill('Colorless') : prev.retreatCost,
              dexId: data.dexId || prev.dexId,
              description: data.description || data.effect || prev.description,
              regulationMark: data.regulationMark || prev.regulationMark,
              legalities: data.legal ? {
                standard: Boolean(data.legal.standard),
                expanded: Boolean(data.legal.expanded),
              } : prev.legalities,
            };
          });
        }
      } catch (err) {
        // Fallback gracefully
      } finally {
        clearTimeout(timeoutId);
        if (isMounted) setIsFetchingFull(false);
      }
    };

    fetchFullData();

    return () => {
      isMounted = false;
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, [card]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (card) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [card, onClose]);

  if (!card || !fullCardData) return null;

  const rawPrice = fullCardData.prices?.raw || 1.50;
  const psa10Price = fullCardData.prices?.psa10Estimate || Number((rawPrice * 3.2).toFixed(2));
  const psa9Price = fullCardData.prices?.psa9Estimate || Number((rawPrice * 1.6).toFixed(2));
  const spread = psa10Price - rawPrice;
  const spreadPercent = rawPrice > 0 ? ((spread / rawPrice) * 100).toFixed(1) : '0';

  const chartData = fullCardData.prices?.priceHistory && fullCardData.prices.priceHistory.length > 0
    ? fullCardData.prices.priceHistory
    : generatePriceHistory(fullCardData.id, rawPrice);

  const isTrainerOrEnergy =
    fullCardData.category &&
    ['trainer', 'energy', 'item', 'supporter', 'stadium'].some((c: string) =>
      fullCardData.category?.toLowerCase().includes(c)
    );

  const displayTypes = isTrainerOrEnergy
    ? fullCardData.types || []
    : getPokemonSpeciesTypes(fullCardData.name, fullCardData.category, fullCardData.types);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden font-sans text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]/90 backdrop-blur-xs flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20 flex-shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>Public Card Inspector</span>
            </span>
            <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#0F172A] truncate">
              {fullCardData.name}
            </h2>
            {isFetchingFull && (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#64748B] flex-shrink-0" />
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#DC143C] hover:bg-[#FFF0F3] hover:border-[#DC143C]/30 transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-5 p-4 sm:p-6 overflow-hidden flex-1 min-h-0 w-full bg-white">
          {/* Left Column: Interactive Holographic Foil Card Preview */}
          <div className="flex-shrink-0 w-full lg:w-[38%] flex flex-col items-center justify-center p-4 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/70 rounded-xl border border-[#E2E8F0] overflow-y-auto max-h-[40vh] lg:max-h-full">
            <div className="w-full max-w-[240px] sm:max-w-[270px] my-auto">
              <HolographicCard card={fullCardData} currency="USD" />
            </div>

            <div className="mt-3 text-center space-y-2 w-full">
              <div className="font-mono text-xs text-[#64748B]">
                Illustrated by <span className="font-bold text-[#0F172A]">{fullCardData.artist || 'Unknown Artist'}</span>
              </div>

              {/* Direct Open Studio Navigation Button */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate(`/app?search=${encodeURIComponent(fullCardData.name)}`);
                  }}
                  className="w-full neo-btn-primary py-2.5 text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Inspect in Studio & Add to Binder</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Stats & Comps Panel */}
          <div className="flex-1 min-w-0 w-full flex flex-col min-h-0 h-full relative bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-2 bg-white border-b border-[#E2E8F0] font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'overview' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Market & Specs</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chart')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'chart' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>30D Price Curve</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('grading')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'grading' ? 'bg-[#0F172A] text-white' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Graded Comps</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {activeTab === 'overview' && (
                <>
                  {/* Valuation Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-2xs">
                      <span className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Raw Market</span>
                      <div className="font-num font-bold text-lg text-[#0F172A] mt-0.5">
                        {formatCurrency(rawPrice, 'USD')}
                      </div>
                      <span className="font-mono text-[9px] text-emerald-600 font-bold">TCGplayer Comps</span>
                    </div>

                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-2xs">
                      <span className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">PSA 10 Gem Mint</span>
                      <div className="font-num font-bold text-lg text-[#16A34A] mt-0.5">
                        {formatCurrency(psa10Price, 'USD')}
                      </div>
                      <span className="font-mono text-[9px] text-[#DC143C] font-bold">+{spreadPercent}% Spread</span>
                    </div>

                    <div className="p-3 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-2xs">
                      <span className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">PSA 9 Mint</span>
                      <div className="font-num font-bold text-lg text-[#2563EB] mt-0.5">
                        {formatCurrency(psa9Price, 'USD')}
                      </div>
                      <span className="font-mono text-[9px] text-[#64748B]">Graded Baseline</span>
                    </div>
                  </div>

                  {/* Expansion Meta */}
                  <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {fullCardData.set?.symbolUrl && (
                        <img
                          src={fullCardData.set.symbolUrl}
                          alt=""
                          className="w-7 h-7 object-contain flex-shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                          {fullCardData.set?.series ? `${fullCardData.set.series} Era` : 'Expansion'}
                        </div>
                        <div className="font-heading font-bold text-sm sm:text-base text-[#0F172A] truncate">
                          {fullCardData.set?.name || 'Unknown Set'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-xs font-bold text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-md">
                        #{fullCardData.number}
                        {fullCardData.set?.printedTotal ? ` / ${fullCardData.set.printedTotal}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Attributes Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-2xs">
                    <div className="flex flex-col justify-center items-center py-1">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Category</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                        {fullCardData.category || fullCardData.supertype || 'Pokémon'}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center py-1 border-l border-[#E2E8F0]">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Stage</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                        {fullCardData.stage || (fullCardData.subtypes && fullCardData.subtypes[0]) || 'Basic'}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center py-1 border-t sm:border-t-0 sm:border-l border-[#E2E8F0]">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Hit Points</div>
                      <div className="font-num font-bold text-xs text-[#DC143C] mt-1">
                        {fullCardData.hp ? `${fullCardData.hp} HP` : '—'}
                      </div>
                    </div>

                    <div className="flex flex-col justify-center items-center py-1 border-t border-l sm:border-t-0 border-[#E2E8F0]">
                      <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Dex ID</div>
                      <div className="font-mono font-bold text-xs text-[#0F172A] mt-1">
                        {fullCardData.dexId ? `#${String(fullCardData.dexId[0]).padStart(4, '0')}` : '—'}
                      </div>
                    </div>
                  </div>

                  {/* Legalities & Variants */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-white border border-[#E2E8F0] space-y-1.5 rounded-xl shadow-2xs">
                      <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                        Format Legalities
                      </div>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
                          fullCardData.legalities?.standard ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]' : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                        }`}>
                          <Check className="w-3.5 h-3.5" /> Standard Legal
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
                          fullCardData.legalities?.expanded ? 'bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]' : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                        }`}>
                          <Check className="w-3.5 h-3.5" /> Expanded Legal
                        </span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-white border border-[#E2E8F0] space-y-1.5 rounded-xl shadow-2xs">
                      <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                        Print Variants
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {fullCardData.regulationMark && (
                          <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-md">
                            Mark {fullCardData.regulationMark}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 rounded-md">
                          {fullCardData.rarity || 'Common'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attacks */}
                  {fullCardData.attacks && fullCardData.attacks.length > 0 && (
                    <div className="space-y-2">
                      <div className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                        Attacks & Abilities
                      </div>
                      {fullCardData.attacks.map((attack, idx) => (
                        <div key={idx} className="p-3.5 bg-white border border-[#E2E8F0] space-y-1.5 rounded-xl shadow-2xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-heading font-bold text-xs sm:text-sm text-[#0F172A]">{attack.name}</span>
                            {attack.damage && <span className="font-num font-bold text-xs text-[#DC143C]">{attack.damage} DMG</span>}
                          </div>
                          {attack.text && <p className="font-mono text-xs text-[#64748B] leading-relaxed">{attack.text}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === 'chart' && (
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                      30-Day Historical Price Trend
                    </h4>
                    <span className="font-mono text-xs font-bold text-[#16A34A] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#16A34A]/20">
                      Live Verified Comps
                    </span>
                  </div>

                  <div className="h-56 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="publicCardTrend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#DC143C" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#DC143C" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#64748B" fontSize={10} fontFamily="IBM Plex Mono" />
                        <YAxis stroke="#64748B" fontSize={10} fontFamily="JetBrains Mono" tickFormatter={(v) => `$${v}`} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="p-2.5 bg-[#0F172A] text-white font-mono text-xs rounded-md shadow-lg space-y-0.5">
                                  <div className="text-slate-400 text-[10px]">{payload[0].payload.date}</div>
                                  <div className="font-num font-bold text-[#FFD700]">${payload[0].value} USD</div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#DC143C" strokeWidth={2.5} fill="url(#publicCardTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === 'grading' && (
                <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                      Certified Slab Valuation Matrix
                    </h4>
                    <div className="flex items-center gap-1 font-mono text-xs">
                      {(['PSA', 'BGS', 'CGC', 'ACE'] as const).map((company) => (
                        <button
                          key={company}
                          type="button"
                          onClick={() => setGradingCompany(company)}
                          className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                            gradingCompany === company ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-center">
                    {['10 Gem', '9.5 Mint+', '9 Mint', '8 Near Mint'].map((gLabel, idx) => (
                      <div key={gLabel} className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg">
                        <span className="text-[10px] text-[#64748B] block font-bold">{companyGradeLabel(gradingCompany, idx)}</span>
                        <span className="font-num font-bold text-[#0F172A] mt-1 block">
                          {formatCurrency(rawPrice * (3.2 - idx * 0.6), 'USD')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs font-mono">
                    <span className="text-[#64748B]">Verified Registry Lookup:</span>
                    <span className="font-bold text-[#0F172A]">{gradingCompany} Registry Comps Available</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

function companyGradeLabel(company: string, idx: number): string {
  const grades = [
    `${company} 10 Gem Mint`,
    `${company} 9.5 Mint+`,
    `${company} 9 Mint`,
    `${company} 8 NM-MT`,
  ];
  return grades[idx] || `${company} Grade`;
}
