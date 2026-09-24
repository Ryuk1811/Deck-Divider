import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Info,
  Check,
  Shield,
  Layers,
  Sparkles,
  Loader2,
  Calendar,
  Hash,
} from 'lucide-react';
import { PokemonCard, EnergyType } from '../../types';
import { ENERGY_COLORS } from '../../utils/formatters';
import { getPokemonSpeciesTypes } from '../../data/pokemonSpeciesTypes';
import { getCardByIdFromEngine, mapToPokemonCard } from '../../lib/searchEngine';
import { CardImage } from '../ui/CardImage';
import { GlassSlabFrame } from '../ui/GlassSlabFrame';

interface PublicCardDetailModalProps {
  card: PokemonCard | null;
  onClose: () => void;
}

export const PublicCardDetailModal: React.FC<PublicCardDetailModalProps> = ({
  card,
  onClose,
}) => {
  const [fullCardData, setFullCardData] = useState<PokemonCard | null>(card);
  const [isFetchingFull, setIsFetchingFull] = useState(false);

  useEffect(() => {
    if (!card) {
      setFullCardData(null);
      return;
    }

    // 1. Initial hydration from local engine data
    const engineDoc = getCardByIdFromEngine(card.id);
    const enrichedLocal = engineDoc ? mapToPokemonCard(engineDoc) : null;

    const initialData: PokemonCard = {
      ...card,
      ...(enrichedLocal || {}),
    };

    setFullCardData(initialData);

    // 2. Fetch full card details from API in background (attacks, legalities, weaknesses, retreat cost)
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
        // Fallback gracefully on existing enriched card data
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
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl overflow-hidden font-sans text-[#0F172A]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E2E8F0] bg-[#F8FAFC]/90 backdrop-blur-xs flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20 flex-shrink-0">
              <Sparkles className="w-3 h-3" />
              <span>Card Details</span>
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

        {/* Modal Content Flex */}
        <div className="flex flex-col lg:flex-row gap-5 p-4 sm:p-6 overflow-hidden flex-1 min-h-0 w-full bg-white">
          {/* Left Column: Dead-Centered Card Presentation */}
          <div className="flex-shrink-0 w-full lg:w-[38%] flex flex-col items-center justify-center p-4 bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/70 rounded-xl border border-[#E2E8F0] overflow-y-auto max-h-[36vh] lg:max-h-full">
            <GlassSlabFrame className="w-full max-w-[220px] sm:max-w-[250px] shadow-xl my-auto">
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

            <div className="mt-3.5 text-center space-y-1.5 w-full">
              <div className="font-mono text-xs text-[#64748B]">
                Illustrated by <span className="font-bold text-[#0F172A]">{fullCardData.artist || 'Unknown Artist'}</span>
              </div>

              {/* Energy Types & Rarity Badges */}
              <div className="flex items-center justify-center gap-1.5 pt-0.5 flex-wrap">
                {displayTypes && displayTypes.length > 0 && displayTypes.map((type, idx) => {
                  const style = ENERGY_COLORS[type as EnergyType] || ENERGY_COLORS['Normal'] || ENERGY_COLORS['Colorless'];
                  return (
                    <span
                      key={`${type}-${idx}`}
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border ${style.bg} ${style.text} ${style.border}`}
                    >
                      {type}
                    </span>
                  );
                })}
                <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#0F172A] text-white">
                  {fullCardData.rarity || 'Common'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Scrollable Card Attributes Only (Strictly No Prices, No Grades, No Actions) */}
          <div className="flex-1 min-w-0 w-full flex flex-col min-h-0 h-full relative bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="custom-scrollbar flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* Expansion Header & Set Meta */}
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

              {/* Major Attributes Matrix */}
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

              {/* Tournament Legalities & Variants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Legalities */}
                <div className="p-3.5 bg-white border border-[#E2E8F0] space-y-1.5 rounded-xl shadow-2xs">
                  <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Format Legalities
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
                        fullCardData.legalities?.standard
                          ? 'bg-[#DCFCE7] text-[#15803D] border-[#86EFAC]'
                          : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Standard Legal
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold rounded-md border ${
                        fullCardData.legalities?.expanded
                          ? 'bg-[#E0F2FE] text-[#0369A1] border-[#7DD3FC]'
                          : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> Expanded Legal
                    </span>
                  </div>
                </div>

                {/* Regulation & Variants */}
                <div className="p-3.5 bg-white border border-[#E2E8F0] space-y-1.5 rounded-xl shadow-2xs">
                  <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                    Regulation & Print Variants
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {fullCardData.regulationMark && (
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-md">
                        Mark {fullCardData.regulationMark}
                      </span>
                    )}
                    {fullCardData.variants?.normal && (
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-md">
                        Normal
                      </span>
                    )}
                    {fullCardData.variants?.holo && (
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 rounded-md">
                        Holo
                      </span>
                    )}
                    {fullCardData.variants?.reverse && (
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F0F9FF] text-[#0284C7] border border-[#7DD3FC] rounded-md">
                        Reverse Holo
                      </span>
                    )}
                    {fullCardData.variants?.firstEdition && (
                      <span className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] rounded-md">
                        1st Edition
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Flavor Text / Card Effect */}
              {fullCardData.description && (
                <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-xl space-y-1 shadow-2xs">
                  <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
                    Card Text / Flavor
                  </div>
                  <p className="font-mono text-xs text-[#334155] leading-relaxed italic">
                    "{fullCardData.description}"
                  </p>
                </div>
              )}

              {/* Attacks & Abilities */}
              {fullCardData.attacks && fullCardData.attacks.length > 0 && (
                <div className="space-y-2">
                  <div className="font-mono text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                    Attacks & Abilities ({fullCardData.attacks.length})
                  </div>
                  {fullCardData.attacks.map((attack, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white border border-[#E2E8F0] space-y-1.5 rounded-xl shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {attack.cost && attack.cost.length > 0 && (
                            <div className="flex gap-1">
                              {attack.cost.map((c, i) => (
                                <span
                                  key={i}
                                  className="w-4 h-4 bg-[#0F172A] text-white font-mono text-[9px] flex items-center justify-center font-bold rounded-full"
                                  title={c}
                                >
                                  {c[0]}
                                </span>
                              ))}
                            </div>
                          )}
                          <span className="font-heading font-bold text-xs sm:text-sm text-[#0F172A]">
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
                        <p className="font-mono text-xs text-[#64748B] leading-relaxed">
                          {attack.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Weakness, Resistance & Retreat Cost */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-white border border-[#E2E8F0] rounded-xl text-center shadow-2xs">
                <div className="flex flex-col justify-center items-center py-1">
                  <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Weakness</div>
                  <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                    {fullCardData.weaknesses && fullCardData.weaknesses.length > 0
                      ? fullCardData.weaknesses.map((w) => `${w.type} ${w.value}`).join(', ')
                      : 'None'}
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center py-1 border-l border-[#E2E8F0]">
                  <div className="font-mono text-[10px] text-[#64748B] font-bold uppercase tracking-wider">Retreat Cost</div>
                  <div className="font-mono font-bold text-xs text-[#0F172A] mt-1 truncate max-w-full">
                    {fullCardData.retreatCost && fullCardData.retreatCost.length > 0
                      ? `${fullCardData.retreatCost.length} Energy`
                      : 'Free Retreat'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
