import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Layers, 
  ExternalLink, 
  TrendingUp, 
  Check, 
  Copy, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { PublicCardDetailModal } from '../../components/modals/PublicCardDetailModal';
import { RedditExportModal } from '../../components/modals/RedditExportModal';
import { getSpeciesBySlug, POPULAR_POKEMON_SPECIES, PopularSpeciesInfo } from '../../data/popularPokemonSpecies';
import { FALLBACK_CARDS } from '../../data/fallbackCards';
import { spoolCardsByName } from '../../lib/searchEngine';
import { PokemonCard, DisplayCurrency } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const PublicPokemonHubView: React.FC = () => {
  const { species } = useParams<{ species: string }>();
  const navigate = useNavigate();

  const speciesInfo: PopularSpeciesInfo = useMemo(() => {
    const found = getSpeciesBySlug(species || '');
    if (found) return found;
    const cleanName = (species || 'charizard').replace(/-/g, ' ');
    const titleCase = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    return {
      name: titleCase,
      slug: species || 'charizard',
      dexNumber: 1,
      category: `${titleCase} Pokémon`,
      types: ['Normal'],
      generation: 'Classic',
      searchVolumeTier: 'High',
      description: `Comprehensive database and collector price guide for all ${titleCase} cards released throughout Pokémon TCG history.`,
      keyCards: [],
      colorHex: '#DC143C',
    };
  }, [species]);

  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'set'>('price-desc');
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [isRedditExportOpen, setIsRedditExportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load cards for this species
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadSpeciesCards() {
      // 1. First get instant matches from local fallback catalog
      const localMatches: PokemonCard[] = FALLBACK_CARDS.filter(c => 
        c.name.toLowerCase().includes(speciesInfo.name.toLowerCase())
      ).map(c => {
        const rawPrice = (c.name.includes('ex') || c.name.includes('Gold')) ? 85.0 : 12.5;
        return {
          id: c.id,
          name: c.name,
          supertype: 'Pokémon',
          subtypes: c.rarity ? [c.rarity] : [],
          hp: Number(c.hp) || 100,
          types: (c.types || ['Normal']) as any,
          number: c.localId,
          artist: c.illustrator || 'Ken Sugimori',
          rarity: c.rarity as any,
          images: {
            small: c.image || '',
            large: c.image || '',
          },
          set: {
            id: c.set?.id || 'base',
            name: c.set?.name || 'Expansion',
            series: 'TCG',
            printedTotal: 100,
            total: 100,
            releaseDate: '2024-01-01',
          },
          prices: {
            raw: rawPrice,
            psa10Estimate: rawPrice * 2.5,
            psa9Estimate: rawPrice * 1.2,
            priceHistory: [],
          },
          cardmarket: {
            price: rawPrice,
          }
        };
      });

      if (isMounted) {
        setCards(localMatches);
      }

      // 2. Query dynamic spooling endpoint for full catalog
      try {
        const dynamicCards = await spoolCardsByName(speciesInfo.name);
        if (isMounted && Array.isArray(dynamicCards) && dynamicCards.length > 0) {
          const mapped: PokemonCard[] = dynamicCards.map(c => {
            const rawPrice = 15.0;
            return {
              id: c.id,
              name: c.name,
              supertype: 'Pokémon',
              subtypes: c.rarity ? [c.rarity] : [],
              hp: Number(c.hp) || 100,
              types: (c.types || ['Normal']) as any,
              number: c.localId,
              artist: c.illustrator || 'Ken Sugimori',
              rarity: c.rarity as any,
              images: {
                small: c.image || '',
                large: c.image || '',
              },
              set: {
                id: c.set?.id || 'tcg',
                name: c.set?.name || 'Pokémon TCG',
                series: 'Catalog',
                printedTotal: 100,
                total: 100,
                releaseDate: '2024-01-01',
              },
              prices: {
                raw: rawPrice,
                psa10Estimate: rawPrice * 2.5,
                psa9Estimate: rawPrice * 1.2,
                priceHistory: [],
              },
              cardmarket: {
                price: rawPrice,
              }
            };
          });

          // Merge without duplicates
          const seen = new Set<string>();
          const combined: PokemonCard[] = [];
          for (const card of [...localMatches, ...mapped]) {
            if (!seen.has(card.id)) {
              seen.add(card.id);
              combined.push(card);
            }
          }
          setCards(combined);
        }
      } catch (e) {
        // Fallback already set
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSpeciesCards();
    return () => { isMounted = false; };
  }, [speciesInfo.name]);

  // Filter and sort
  const filteredCards = useMemo(() => {
    let result = cards;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.set.name.toLowerCase().includes(q) ||
        (c.rarity && c.rarity.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      const priceA = a.prices?.raw || a.cardmarket?.price || 0;
      const priceB = b.prices?.raw || b.cardmarket?.price || 0;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'set') return a.set.name.localeCompare(b.set.name);
      return a.name.localeCompare(b.name);
    });
  }, [cards, searchQuery, sortBy]);

  const totalMarketNav = useMemo(() => {
    return filteredCards.reduce((acc, c) => acc + (c.prices?.raw || c.cardmarket?.price || 0), 0);
  }, [filteredCards]);

  const highestValueCard = useMemo(() => {
    if (filteredCards.length === 0) return null;
    return [...filteredCards].sort((a, b) => 
      (b.prices?.raw || b.cardmarket?.price || 0) - (a.prices?.raw || a.cardmarket?.price || 0)
    )[0];
  }, [filteredCards]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `All ${speciesInfo.name} Pokémon Cards List & Price Guide`,
    description: speciesInfo.description,
    url: `https://deckdivider.app/pokemon/${speciesInfo.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: filteredCards.length,
      itemListElement: filteredCards.slice(0, 30).map((card, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `${card.name} (${card.set.name} #${card.number})`,
        url: `https://deckdivider.app/card/${card.id}`,
      }))
    }
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-slate-900">
      <PageHead
        title={`All ${speciesInfo.name} Pokémon Cards List & Price Guide | DECK / divider`}
        description={`Complete checklist and market price guide for every ${speciesInfo.name} card printed in Pokémon TCG history. Track values, master sets, and graded slabs.`}
        canonicalPath={`/pokemon/${speciesInfo.slug}`}
        keywords={[
          `all ${speciesInfo.name.toLowerCase()} cards list`,
          `${speciesInfo.name.toLowerCase()} pokemon cards in order`,
          `${speciesInfo.name.toLowerCase()} card price guide`,
          `most expensive ${speciesInfo.name.toLowerCase()} cards`,
          `${speciesInfo.name.toLowerCase()} master set checklist`
        ]}
        schema={schemaJsonLd}
      />
      <LandingNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <GeoBreadcrumbs 
          items={[
            { label: 'Directory', path: '/directory' },
            { label: 'Pokémon Species', path: '/pokemon' },
            { label: speciesInfo.name, path: `/pokemon/${speciesInfo.slug}` }
          ]} 
        />

        {/* Hero Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold">National Dex #{speciesInfo.dexNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{speciesInfo.generation}</span>
                <span aria-hidden="true">·</span>
                <span>{speciesInfo.types.join(' / ')}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                All {speciesInfo.name} Pokémon Cards
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {speciesInfo.description}
              </p>

              {speciesInfo.keyCards && speciesInfo.keyCards.length > 0 && (
                <div className="pt-2 text-xs text-slate-600 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-slate-900">Iconic Chase Prints:</span>
                  {speciesInfo.keyCards.map((kc, i) => (
                    <span key={i} className="text-slate-500">
                      {kc}{i < speciesInfo.keyCards.length - 1 ? ' · ' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stats Panel */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 shrink-0 lg:w-72">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] font-mono text-slate-500 block uppercase">Total Indexed Cards</span>
                <span className="text-xl font-bold font-mono text-slate-900">{filteredCards.length} Cards</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] font-mono text-slate-500 block uppercase">Estimated Species NAV</span>
                <span className="text-xl font-bold font-mono text-emerald-600">
                  {formatCurrency(totalMarketNav, 'USD')}
                </span>
              </div>
              {highestValueCard && (
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-mono text-slate-500 block uppercase">Highest Value Card</span>
                  <span className="text-xs font-bold text-slate-900 truncate block">{highestValueCard.name}</span>
                  <span className="text-xs font-mono text-emerald-600 font-semibold">
                    {formatCurrency(highestValueCard.prices?.raw || highestValueCard.cardmarket?.price || 0, 'USD')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link 
                to="/pokemon" 
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Iconic Species
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRedditExportOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#DC143C]" />
                <span>Export to Reddit / Discord</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Hub'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Partner Offer */}
        <PtcPartnerBanner />

        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Filter ${speciesInfo.name} cards by set or rarity...`}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="price-desc">Highest Value First</option>
              <option value="price-asc">Lowest Value First</option>
              <option value="name">Card Name (A-Z)</option>
              <option value="set">Expansion Set</option>
            </select>
          </div>
        </div>

        {/* Cards Grid */}
        <div>
          {loading ? (
            <div className="py-20 text-center">
              <span className="text-xs font-mono text-slate-500">Indexing {speciesInfo.name} card records...</span>
            </div>
          ) : filteredCards.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Layers className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No cards matched your filter</h3>
              <p className="text-xs text-slate-500">Try clearing the search query to view all catalogued cards.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredCards.map((card) => (
                <div key={card.id} className="relative group">
                  <HolographicCard
                    card={card}
                    currency="USD"
                    showPrice={true}
                    onClick={() => setSelectedCard(card)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interlink Mesh for SEO Equity Distribution */}
        <PublicInterlinkMesh />
      </main>

      <LandingFooter />

      {/* Card Detail Modal */}
      {selectedCard && (
        <PublicCardDetailModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}

      {/* Reddit / Discord Table Export Modal */}
      {isRedditExportOpen && (
        <RedditExportModal
          isOpen={isRedditExportOpen}
          onClose={() => setIsRedditExportOpen(false)}
          title={`All ${speciesInfo.name} Cards Collection`}
          items={filteredCards.map(c => ({
            name: c.name,
            set: c.set.name,
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
