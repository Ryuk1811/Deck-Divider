import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  CheckCircle2, 
  Circle, 
  Check, 
  Copy, 
  Share2, 
  Printer, 
  TrendingUp, 
  Layers, 
  Sparkles,
  Percent,
  Download
} from 'lucide-react';
import { CardSet, PokemonCard } from '../../types';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { getExpansionsCatalog, getCardsBySetCatalog } from '../../lib/dataSyncEngine';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { RedditExportModal } from '../../components/modals/RedditExportModal';
import { formatCurrency } from '../../utils/formatters';

export const PublicSetChecklistView: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();

  const [set, setSet] = useState<CardSet | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'owned' | 'secret'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRedditExportOpen, setIsRedditExportOpen] = useState(false);

  // Local storage master checklist tracking state
  const storageKey = `dd_checklist_${setId || 'set'}`;
  const [checkedMap, setCheckedMap] = useState<Record<string, { regular?: boolean; reverse?: boolean }>>(() => {
    try {
      const saved = localStorage.getItem(`dd_checklist_${setId || 'set'}`);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    if (setId) {
      try {
        localStorage.setItem(`dd_checklist_${setId}`, JSON.stringify(checkedMap));
      } catch (e) {}
    }
  }, [checkedMap, setId]);

  // Load Set and Cards Catalog
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      if (!setId) return;
      const cleanSetId = setId.toLowerCase().trim();
      const allSets = await getExpansionsCatalog();
      const current = allSets.find(s => s.id.toLowerCase() === cleanSetId);
      if (current && isMounted) {
        setSet(current);
      }

      const loadedCards = await getCardsBySetCatalog(cleanSetId);
      if (isMounted) {
        setCards(loadedCards);
        setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [setId]);

  const toggleCheck = (cardId: string, type: 'regular' | 'reverse') => {
    setCheckedMap(prev => {
      const current = prev[cardId] || {};
      return {
        ...prev,
        [cardId]: {
          ...current,
          [type]: !current[type]
        }
      };
    });
  };

  // Completion stats
  const totalCardsCount = cards.length || set?.total || 0;
  const ownedCardsCount = useMemo(() => {
    return cards.filter(c => checkedMap[c.id]?.regular || checkedMap[c.id]?.reverse).length;
  }, [cards, checkedMap]);

  const completionPercent = totalCardsCount > 0 
    ? Math.round((ownedCardsCount / totalCardsCount) * 100) 
    : 0;

  const missingCards = useMemo(() => {
    return cards.filter(c => !checkedMap[c.id]?.regular && !checkedMap[c.id]?.reverse);
  }, [cards, checkedMap]);

  const missingEstCost = useMemo(() => {
    return missingCards.reduce((acc, c) => acc + (c.prices?.raw || c.cardmarket?.price || 2.5), 0);
  }, [missingCards]);

  // Filtered Cards
  const displayedCards = useMemo(() => {
    let result = cards;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.number.toLowerCase().includes(q) ||
        (c.rarity && c.rarity.toLowerCase().includes(q))
      );
    }

    if (filterMode === 'missing') {
      result = result.filter(c => !checkedMap[c.id]?.regular && !checkedMap[c.id]?.reverse);
    } else if (filterMode === 'owned') {
      result = result.filter(c => checkedMap[c.id]?.regular || checkedMap[c.id]?.reverse);
    } else if (filterMode === 'secret') {
      const officialTotal = set?.printedTotal || 100;
      result = result.filter(c => {
        const num = parseInt(c.number, 10);
        return !isNaN(num) && num > officialTotal;
      });
    }

    return result;
  }, [cards, searchQuery, filterMode, checkedMap, set?.printedTotal]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${set?.name || 'Pokémon'} Master Set Binder Checklist & Reverse Holo Tracker`,
    description: `Interactive printable checklist for ${set?.name || ''} with reverse holo checkboxes, completion meter, and missing card price calculator.`,
    url: `https://deckdivider.app/set/${setId}/checklist`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: cards.length,
      itemListElement: cards.slice(0, 30).map((card, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `${card.name} (${set?.name} #${card.number})`,
        url: `https://deckdivider.app/card/${card.id}`,
      }))
    }
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-slate-900">
      <PageHead
        title={`${set?.name || 'Pokémon'} Master Set Binder Checklist | DECK / divider`}
        description={`Interactive master set binder checklist for Pokémon ${set?.name || ''}. Check off normal and reverse holos, track completion %, and calculate missing card costs.`}
        canonicalPath={`/set/${setId}/checklist`}
        keywords={[
          `${set?.name?.toLowerCase() || ''} master set checklist`,
          `${set?.name?.toLowerCase() || ''} binder checklist printable`,
          `${set?.name?.toLowerCase() || ''} reverse holo checklist`,
          `${set?.name?.toLowerCase() || ''} complete card list`
        ]}
        schema={schemaJsonLd}
      />
      <LandingNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <GeoBreadcrumbs 
          items={[
            { label: 'Directory', path: '/directory' },
            { label: 'Expansions', path: '/sets' },
            { label: set?.name || 'Set', path: `/set/${setId}` },
            { label: 'Master Checklist', path: `/set/${setId}/checklist` }
          ]} 
        />

        {/* Set Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold">{set?.series || 'Pokémon TCG'}</span>
                <span aria-hidden="true">·</span>
                <span>{totalCardsCount} Total Cards</span>
                <span aria-hidden="true">·</span>
                <span>Released {set?.releaseDate || '2024'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                {set?.name || 'Expansion'} Master Set Binder Checklist
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Track your binder progress card by card. Check off regular and reverse holo prints to calculate your master set completion percentage in real time.
              </p>
            </div>

            {/* Completion Meter Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 shrink-0 lg:w-80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 uppercase">Binder Completion</span>
                <span className="text-xl font-extrabold font-mono text-[#DC143C]">{completionPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#DC143C] transition-all duration-300 rounded-full" 
                  style={{ width: `${Math.min(100, Math.max(0, completionPercent))}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1">
                <span>{ownedCardsCount} / {totalCardsCount} Collected</span>
                <span>{totalCardsCount - ownedCardsCount} Missing</span>
              </div>
              {missingEstCost > 0 && (
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Est. to Complete:</span>
                  <span className="font-mono font-bold text-emerald-600">{formatCurrency(missingEstCost, 'USD')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Sub-Navigation Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                to={`/set/${setId}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors"
              >
                <Layers className="w-3.5 h-3.5" /> Full Card Gallery
              </Link>
              <Link
                to={`/set/${setId}/top-cards`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Top Chase Cards
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Checklist
              </button>
              <button
                type="button"
                onClick={() => setIsRedditExportOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#DC143C]" /> Export for Reddit
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Partner Offer */}
        <PtcPartnerBanner />

        {/* Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search card by name, number, or rarity..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {(['all', 'missing', 'owned', 'secret'] as const).map(mode => (
              <button
                key={mode}
                type="button"
                onClick={() => setFilterMode(mode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer capitalize whitespace-nowrap ${
                  filterMode === mode
                    ? 'bg-[#DC143C] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {mode === 'all' ? 'All Cards' : mode === 'secret' ? 'Secret Rares' : mode}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Checklist Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {/* Mobile Card Row List (< 640px) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {displayedCards.map((card) => {
              const isRegularChecked = Boolean(checkedMap[card.id]?.regular);
              const isReverseChecked = Boolean(checkedMap[card.id]?.reverse);
              const isFullyComplete = isRegularChecked && isReverseChecked;
              const price = card.prices?.raw || card.cardmarket?.price || 0;

              return (
                <div 
                  key={card.id} 
                  className={`p-3.5 flex flex-col space-y-2.5 ${isFullyComplete ? 'bg-emerald-50/40' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">#{card.number}</span>
                      <Link to={`/card/${card.id}`} className="font-medium text-sm text-slate-900 hover:text-[#DC143C] line-clamp-1">
                        {card.name}
                      </Link>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-700 shrink-0">
                      {price > 0 ? formatCurrency(price, 'USD') : '—'}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-mono">{card.rarity || 'Common'}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCheck(card.id, 'regular')}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isRegularChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100'
                        }`}
                      >
                        {isRegularChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span>Reg</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleCheck(card.id, 'reverse')}
                        className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-medium font-mono flex items-center gap-1.5 border transition-all cursor-pointer ${
                          isReverseChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 active:bg-slate-100'
                        }`}
                      >
                        {isReverseChecked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                        )}
                        <span>Rev Holo</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (>= 640px) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-mono uppercase text-slate-500">
                  <th className="py-3 px-4 w-16"># No.</th>
                  <th className="py-3 px-4">Card Name</th>
                  <th className="py-3 px-4">Rarity</th>
                  <th className="py-3 px-4 text-center w-24">Regular</th>
                  <th className="py-3 px-4 text-center w-28">Reverse Holo</th>
                  <th className="py-3 px-4 text-right">Market Est.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {displayedCards.map((card) => {
                  const isRegularChecked = Boolean(checkedMap[card.id]?.regular);
                  const isReverseChecked = Boolean(checkedMap[card.id]?.reverse);
                  const isFullyComplete = isRegularChecked && isReverseChecked;
                  const price = card.prices?.raw || card.cardmarket?.price || 0;

                  return (
                    <tr 
                      key={card.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${isFullyComplete ? 'bg-emerald-50/30' : ''}`}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">
                        #{card.number}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <Link to={`/card/${card.id}`} className="hover:text-[#DC143C] transition-colors">
                          {card.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">
                        {card.rarity || 'Common'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCheck(card.id, 'regular')}
                          className="inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Toggle regular print"
                        >
                          {isRegularChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCheck(card.id, 'reverse')}
                          className="inline-flex items-center justify-center p-1 rounded-md text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Toggle reverse holo print"
                        >
                          {isReverseChecked ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-slate-700">
                        {price > 0 ? formatCurrency(price, 'USD') : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interlink Mesh */}
        <PublicInterlinkMesh />
      </main>

      <LandingFooter />

      {/* Reddit Export Modal */}
      {isRedditExportOpen && (
        <RedditExportModal
          isOpen={isRedditExportOpen}
          onClose={() => setIsRedditExportOpen(false)}
          title={`${set?.name || 'Set'} Master Checklist`}
          items={cards.map(c => ({
            name: c.name,
            set: set?.name || 'Expansion',
            number: c.number,
            rarity: c.rarity,
            price: c.prices?.raw || c.cardmarket?.price || 0,
            quantity: 1,
          }))}
          currency="USD"
        />
      )}
    </div>
  );
};
