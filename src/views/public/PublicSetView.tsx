import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Layers, Calendar, ChevronLeft, ChevronRight, TrendingUp, Share2, Check } from 'lucide-react';
import { CardSet, PokemonCard } from '../../types';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { getExpansionsCatalog, getCardsBySetCatalog } from '../../lib/dataSyncEngine';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { getSetDetailSchema } from '../../components/seo/schemaData';
import { generateSetSeoMetadata, updateDocumentMetaTags } from '../../utils/keywordDatabase';

const PAGE_SIZE = 60;

/**
 * Helper function to dynamically update document <meta> tags (canonical, description, and keywords)
 * based on the specific set currently being viewed, leveraging the keyword database.
 */
export function updateSetDocumentMeta(set: CardSet | null, cards: PokemonCard[] = [], page: number = 1) {
  const seo = generateSetSeoMetadata(set, cards, page);
  updateDocumentMetaTags({
    title: seo.title,
    description: seo.description,
    canonicalPath: seo.canonicalPath,
    keywords: seo.keywords,
    ogImage: set
      ? `https://deckdivider.app/api/og/set/${set.id}.png?title=${encodeURIComponent(set.name)}&series=${encodeURIComponent(set.series || 'Pokémon TCG')}&count=${set.total || cards.length}`
      : 'https://deckdivider.app/og-image.png?v=2',
    jsonLd: set ? {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `${set.name} Card Checklist`,
      description: `Full Pokémon card checklist for ${set.name} (${set.series})`,
      numberOfItems: set.total || cards.length,
      url: seo.canonical,
    } : undefined
  });
  return seo;
}

export const PublicSetView: React.FC = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [set, setSet] = useState<CardSet | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Failed to copy set link:', err);
    }
  };

  const currentPage = parseInt(searchParams.get('page') || '1', 10) || 1;

  const setCurrentPage = (newPage: number | ((p: number) => number)) => {
    const finalPage = typeof newPage === 'function' ? newPage(currentPage) : newPage;
    const params = new URLSearchParams(searchParams);
    params.set('page', finalPage.toString());
    setSearchParams(params);
  };

  useEffect(() => {
    if (!setId) return;
    
    setLoading(true);
    Promise.all([
      getExpansionsCatalog(),
      getCardsBySetCatalog(setId)
    ]).then(([sets, fetchedCards]) => {
      const foundSet = sets.find(s => s.id === setId) || null;
      setSet(foundSet);
      
      const sorted = [...fetchedCards].sort((a, b) => {
        const numA = parseInt(a.number.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.number.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
      setCards(sorted);
      setLoading(false);
    });
  }, [setId]);

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.number.includes(q) ||
      (c.rarity && c.rarity.toLowerCase().includes(q))
    );
  }, [cards, searchQuery]);

  const totalPages = Math.ceil(filteredCards.length / PAGE_SIZE);
  const paginatedCards = filteredCards.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const seoMetadata = useMemo(() => {
    return generateSetSeoMetadata(set, cards, currentPage);
  }, [set, cards, currentPage]);

  useEffect(() => {
    if (set) {
      updateSetDocumentMeta(set, cards, currentPage);
    }
  }, [set, cards, currentPage]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title={seoMetadata.title}
        description={seoMetadata.description}
        canonicalPath={seoMetadata.canonicalPath}
        ogImage={
          set
            ? `https://deckdivider.app/api/og/set/${set.id}.png?title=${encodeURIComponent(set.name)}&series=${encodeURIComponent(set.series || 'Pokémon TCG')}&count=${set.total || cards.length}`
            : 'https://deckdivider.app/og-image.png?v=2'
        }
        keywords={seoMetadata.keywords}
        schema={
          set
            ? getSetDetailSchema(set.name, set.id, set.total || cards.length, set.releaseDate || '2024')
            : undefined
        }
      />
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GeoBreadcrumbs 
            items={[
              { label: 'Sets Directory', path: '/sets' },
              { label: set ? set.name : 'Expansion', path: set ? `/set/${set.id}` : '/sets' }
            ]} 
          />

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E2E8F0] border-t-[#DC143C]"></div>
            </div>
          ) : !set ? (
            <div className="text-center py-20 bg-white border border-[#E2E8F0] rounded-2xl p-8 max-w-md mx-auto shadow-xs">
              <h2 className="text-2xl font-bold text-[#0F172A] font-heading mb-2">Expansion Not Found</h2>
              <p className="text-[#64748B] text-sm">The requested set could not be located in our database.</p>
            </div>
          ) : (
            <>
              {/* Set Header */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 md:p-8 mb-6 shadow-xs flex flex-col md:flex-row gap-6 items-start md:items-center">
                {set.logoUrl && (
                  <div className="w-48 h-24 flex-shrink-0 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 flex items-center justify-center">
                    <img src={set.logoUrl} alt={`${set.name} logo`} className="max-w-full max-h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] font-heading">{set.name}</h1>
                    {set.symbolUrl && (
                      <img src={set.symbolUrl} alt="Symbol" className="w-7 h-7 object-contain" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                    <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full text-[#0F172A] font-semibold">
                      <Layers className="w-3.5 h-3.5 text-[#DC143C]" />
                      {set.series} Series
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full text-[#0F172A]">
                      <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
                      {set.releaseDate}
                    </span>
                    <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full text-[#0F172A]">
                      {set.printedTotal} Cards (Total: {set.total})
                    </span>
                    <Link
                      to={`/set/${set.id}/top-cards`}
                      className="inline-flex items-center gap-1.5 bg-[#DC143C]/10 hover:bg-[#DC143C]/20 border border-[#DC143C]/30 text-[#DC143C] px-3.5 py-1 rounded-full text-xs font-bold transition-colors shadow-2xs"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      Top 20 Chase Cards
                    </Link>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] px-3.5 py-1 rounded-full text-xs font-mono font-bold transition-colors shadow-2xs cursor-pointer"
                      title="Share link to set checklist"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Share2 className="w-3.5 h-3.5 text-[#64748B]" />}
                      <span>{copiedLink ? 'Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <GeoExtractableBlock
                className="mb-8"
                heading={`${set.name} (${set.series}) Expansion Information`}
                summary={`${set.name} is an expansion of the Pokémon Trading Card Game featuring ${set.printedTotal || set.total} cards in its main set and ${set.total ? set.total - (set.printedTotal || 0) : 0} secret illustration rares. Released on ${set.releaseDate || 'official schedule'}, all card prices are updated in real time with TCGplayer lowest verified and market pricing.`}
                keyFacts={[
                  { label: 'Expansion Name', value: set.name },
                  { label: 'Series', value: `${set.series} Era` },
                  { label: 'Total Cards', value: `${set.total || cards.length} Cards` },
                  { label: 'Release Date', value: set.releaseDate || 'Official' },
                ]}
              />

              {/* Toolbar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search cards in this expansion..."
                    className="w-full bg-white border border-[#CBD5E1] rounded-xl py-2 pl-9 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C] transition-colors shadow-2xs"
                  />
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] disabled:opacity-40 hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-2xs"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono font-medium text-[#64748B]">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] disabled:opacity-40 hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-2xs"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Grid */}
              {paginatedCards.length === 0 ? (
                <div className="text-center py-20 text-[#64748B] bg-white border border-[#E2E8F0] rounded-2xl shadow-xs">
                  No cards match your search criteria.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {paginatedCards.map((card) => (
                    <div key={card.id} className="flex flex-col group bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-3 transition-all hover:shadow-md hover:-translate-y-0.5">
                      <div className="relative aspect-[63/88] rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] shadow-2xs">
                        <HolographicCard
                          card={card}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <div className="text-[11px] text-[#64748B] font-mono mb-0.5">
                          {card.number} / {set.printedTotal}
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight line-clamp-1 group-hover:text-[#DC143C] transition-colors" title={card.name}>
                          {card.name}
                        </h3>
                        {(card.tcgplayer?.price || card.tcgplayer?.trendPrice) ? (
                          <div className="text-xs text-[#16A34A] mt-1 font-num font-bold">
                            ${(card.tcgplayer.price || card.tcgplayer.trendPrice || 0).toFixed(2)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] disabled:opacity-40 hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-2xs"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-colors ${
                            currentPage === i + 1
                              ? 'bg-[#DC143C] text-white border border-[#DC143C] shadow-2xs'
                              : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setCurrentPage(p => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] disabled:opacity-40 hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors shadow-2xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
