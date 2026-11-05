import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowLeft, 
  Search, 
  Layers, 
  Check, 
  Copy, 
  Share2,
  Info,
  DollarSign
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { PublicCardDetailModal } from '../../components/modals/PublicCardDetailModal';
import { RedditExportModal } from '../../components/modals/RedditExportModal';
import { getRarityBySlug, POPULAR_RARITIES, RarityHubInfo } from '../../data/popularRarities';
import { FALLBACK_CARDS } from '../../data/fallbackCards';
import { PokemonCard } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const PublicRarityHubView: React.FC = () => {
  const { raritySlug } = useParams<{ raritySlug?: string }>();
  const navigate = useNavigate();

  const activeRarity: RarityHubInfo = useMemo(() => {
    const found = getRarityBySlug(raritySlug || 'special-illustration-rare');
    return found || POPULAR_RARITIES[0];
  }, [raritySlug]);

  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price-desc' | 'price-asc' | 'name' | 'set'>('price-desc');
  const [selectedCard, setSelectedCard] = useState<PokemonCard | null>(null);
  const [isRedditExportOpen, setIsRedditExportOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Load cards matching this rarity category
  useEffect(() => {
    const matched = FALLBACK_CARDS.filter(c => {
      const cardRarity = (c.rarity || '').toLowerCase();
      if (activeRarity.slug === 'special-illustration-rare') {
        return cardRarity.includes('special illustration') || cardRarity.includes('sar');
      }
      if (activeRarity.slug === 'illustration-rare') {
        return (cardRarity.includes('illustration rare') || cardRarity.includes('ar')) && !cardRarity.includes('special');
      }
      if (activeRarity.slug === 'secret-rare') {
        return cardRarity.includes('secret') || cardRarity.includes('hyper') || cardRarity.includes('gold');
      }
      if (activeRarity.slug === 'trainer-gallery') {
        return cardRarity.includes('gallery') || (c.localId && (c.localId.startsWith('TG') || c.localId.startsWith('GG')));
      }
      if (activeRarity.slug === 'ultra-rare') {
        return cardRarity.includes('ultra') || cardRarity.includes('double rare') || c.name.includes(' ex');
      }
      return true;
    }).map(c => {
      const rawPrice = (c.name.includes('Charizard') || c.name.includes('Greninja')) ? 125.0 : (c.name.includes('Mew') ? 85.0 : 25.0);
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
      } as PokemonCard;
    });

    setCards(matched);
  }, [activeRarity.slug]);

  // Filter and sort
  const filteredCards = useMemo(() => {
    let result = cards;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.set.name.toLowerCase().includes(q)
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `All Pokémon ${activeRarity.name} Cards List & Checklist`,
    description: activeRarity.description,
    url: `https://deckdivider.app/rarity/${activeRarity.slug}`,
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
        title={`All Pokémon ${activeRarity.name} Cards Checklist & Price Guide | DECK / divider`}
        description={`Complete checklist of every Pokémon ${activeRarity.name} (${activeRarity.acronym || ''}) card. Estimated pull rates, market pricing, distinguishing foil features, and master set tracking.`}
        canonicalPath={`/rarity/${activeRarity.slug}`}
        keywords={[
          `all ${activeRarity.name.toLowerCase()} cards list`,
          `pokemon ${activeRarity.slug.replace(/-/g, ' ')} checklist`,
          `${activeRarity.acronym || activeRarity.name} pull rate`,
          `most expensive ${activeRarity.name.toLowerCase()}`
        ]}
        schema={schemaJsonLd}
      />
      <LandingNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <GeoBreadcrumbs 
          items={[
            { label: 'Directory', path: '/directory' },
            { label: 'Rarities & Art', path: '/rarity' },
            { label: activeRarity.name, path: `/rarity/${activeRarity.slug}` }
          ]} 
        />

        {/* Rarity Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {POPULAR_RARITIES.map(r => (
            <Link
              key={r.slug}
              to={`/rarity/${r.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeRarity.slug === r.slug
                  ? 'bg-[#DC143C] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {r.name} {r.acronym ? `(${r.acronym})` : ''}
            </Link>
          ))}
        </div>

        {/* Header Hero */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold">{activeRarity.era}</span>
                <span aria-hidden="true">·</span>
                <span>Introduced in {activeRarity.introductionYear}</span>
                {activeRarity.acronym && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{activeRarity.acronym}</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                All Pokémon {activeRarity.name} Cards
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeRarity.description}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 shrink-0 lg:w-72">
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] font-mono text-slate-500 block uppercase">Estimated Pull Rate</span>
                <span className="text-sm font-bold font-mono text-slate-900">{activeRarity.pullRateEstimate}</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <span className="text-[11px] font-mono text-slate-500 block uppercase">Typical Market Price</span>
                <span className="text-sm font-bold font-mono text-emerald-600">{activeRarity.typicalMarketRange}</span>
              </div>
            </div>
          </div>

          {/* Distinguishing Features Checklist */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-xs font-mono font-semibold text-slate-900 block mb-2 uppercase tracking-wide">
              How to Identify {activeRarity.name} Cards:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
              {activeRarity.distinguishingFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#DC143C] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredCards.length} featured {activeRarity.name} records
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsRedditExportOpen(true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#DC143C]" />
                <span>Export for Reddit</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Guide'}</span>
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
              placeholder={`Search ${activeRarity.name} by card name...`}
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
          {filteredCards.length === 0 ? (
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

        {/* Interlink Mesh */}
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
          title={`All ${activeRarity.name} Cards`}
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
