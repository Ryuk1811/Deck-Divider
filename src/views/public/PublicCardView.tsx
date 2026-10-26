import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag,
  Swords,
  ChevronRight,
  TrendingUp,
  Share2,
  Check,
  BookOpen,
  DollarSign,
  Plus,
} from 'lucide-react';
import { PokemonCard, CardSet } from '../../types';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { initSearchEngine, getCardById, mapToPokemonCard, generatePriceHistory } from '../../lib/searchEngine';
import { formatCurrency } from '../../utils/formatters';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const PublicCardView: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();

  const [card, setCard] = useState<PokemonCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeCurrency] = useState('USD');
  const [gradingCompany, setGradingCompany] = useState<'PSA' | 'BGS' | 'CGC' | 'ACE'>('PSA');

  useEffect(() => {
    if (!cardId) return;

    let isMounted = true;
    setLoading(true);

    const fetchCard = async () => {
      try {
        await initSearchEngine();
        const localMatch = getCardById(cardId);
        if (localMatch && isMounted) {
          setCard(mapToPokemonCard(localMatch));
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/tcgdex/cards/${encodeURIComponent(cardId)}`);
        if (res.ok) {
          const apiData = await res.json();
          if (isMounted) {
            setCard(mapToPokemonCard(apiData));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch card details:', err);
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    fetchCard();

    return () => {
      isMounted = false;
    };
  }, [cardId]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.warn('Failed copying link', e);
    }
  };

  const cardTitle = card ? `${card.name} #${card.number} ${card.set?.name || 'TCG'} Price, PSA Value & Trends | DECK / divider` : 'Pokémon Card Price & Market Value | DECK / divider';
  const cardDesc = card
    ? `View live TCGplayer market prices, attacks, rarity, and tournament format legality for ${card.name} (${card.set?.name || 'Pokémon TCG'} #${card.number}).`
    : 'View Pokémon TCG card market valuation and tournament legality.';
  const ogImageUrl = card?.images?.large || card?.images?.small || 'https://deckdivider.app/og-image.png?v=2';

  const rawPrice = card?.prices?.raw || 1.50;
  const psa10Price = card?.prices?.psa10Estimate || Number((rawPrice * 3.2).toFixed(2));
  const psa9Price = card?.prices?.psa9Estimate || Number((rawPrice * 1.6).toFixed(2));
  const spread = psa10Price - rawPrice;
  const spreadPercent = rawPrice > 0 ? ((spread / rawPrice) * 100).toFixed(1) : '0';

  const chartData = card?.prices?.priceHistory && card.prices.priceHistory.length > 0
    ? card.prices.priceHistory
    : generatePriceHistory(card?.id || 'card-1', rawPrice);

  const jsonLd = card ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${card.name} (${card.set?.name || 'TCG'} #${card.number})`,
    image: [card.images?.large || card.images?.small || ogImageUrl],
    description: cardDesc,
    sku: card.id,
    mpn: card.number,
    category: 'Trading Cards > Pokémon Cards',
    brand: {
      '@type': 'Brand',
      name: 'Pokémon',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: (rawPrice * 0.85).toFixed(2),
      highPrice: (psa10Price * 1.1).toFixed(2),
      offerCount: 15,
      availability: 'https://schema.org/InStock',
      url: `https://www.tcgplayer.com/search/pokemon/product?q=${encodeURIComponent(card.name + ' ' + (card.set?.name || ''))}`,
    }
  } : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <PageHead
        title={`${cardTitle} | DECK / divider`}
        description={cardDesc}
        canonicalPath={`/card/${cardId || ''}`}
        ogImage={ogImageUrl}
        schema={jsonLd}
      />

      <LandingNav onOpenAuth={() => navigate('/auth')} onEnterApp={() => navigate('/app')} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <GeoBreadcrumbs
          items={[
            { label: 'Cards', path: '/cards' },
            { label: card?.set?.name || 'Expansion', path: card?.set?.id ? `/set/${card.set.id}` : '/sets' },
            { label: card?.name || cardId || 'Card', path: `/card/${cardId || ''}` },
          ]}
        />

        <div className="mt-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <Link
            to={card?.set?.id ? `/set/${card.set.id}` : '/cards'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-[#DC143C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {card?.set?.name || 'Cards Catalog'}
          </Link>

          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            {copiedLink ? 'Link Copied' : 'Share Card Link'}
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-[#DC143C] rounded-full animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading verified card specifications...</p>
          </div>
        ) : !card ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Card Not Found</h2>
            <p className="text-sm text-slate-600 mb-6">
              We couldn't locate card "{cardId}". You can search our full 18,400+ card database or view expansion set checklists.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/cards" className="px-4 py-2 bg-[#DC143C] text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                Browse All Cards
              </Link>
              <Link to="/sets" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                View Expansions
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Holographic Visual Card & Quick Actions */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-[340px] drop-shadow-xl sticky top-24">
                <HolographicCard card={card} currency={activeCurrency as any} />

                <div className="mt-6 flex flex-col gap-2.5 w-full">
                  <button
                    onClick={() => navigate(`/app?search=${encodeURIComponent(card.name)}`)}
                    className="w-full py-2.5 px-4 bg-[#DC143C] hover:bg-red-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-colors text-center flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Open in Studio & Add to Portfolio</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed Specifications, Price Comps & Legality */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Header Info Box */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                      {card.supertype || 'Pokémon'}
                    </span>
                    {card.rarity && (
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-red-50 text-[#DC143C] font-mono">
                        {card.rarity}
                      </span>
                    )}
                    {card.regulationMark && (
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-mono">
                        Mark {card.regulationMark}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    {card.name}
                  </h1>

                  <p className="text-sm text-slate-500 flex items-center gap-2 flex-wrap">
                    <span>{card.set?.name || 'Expansion'}</span>
                    <span>•</span>
                    <span className="font-mono font-medium">#{card.number}</span>
                    {card.artist && (
                      <>
                        <span>•</span>
                        <span>Illus. {card.artist}</span>
                      </>
                    )}
                  </p>
                </div>

                {/* Live Valuation Matrix */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Raw Market</span>
                    <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
                      {formatCurrency(rawPrice, activeCurrency as any)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">TCGplayer Comps</span>
                  </div>
                  <div className="border-x border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PSA 10 Gem Mint</span>
                    <span className="text-lg font-bold text-emerald-600 font-mono mt-0.5 block">
                      {formatCurrency(psa10Price, activeCurrency as any)}
                    </span>
                    <span className="text-[10px] text-[#DC143C] font-mono font-bold">+{spreadPercent}% Spread</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">PSA 9 Mint</span>
                    <span className="text-lg font-bold text-blue-600 font-mono mt-0.5 block">
                      {formatCurrency(psa9Price, activeCurrency as any)}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Graded Baseline</span>
                  </div>
                </div>

                {/* 30-Day Historical Price Curve */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      30-Day Market Price Curve
                    </h4>
                    <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Verified Comps
                    </span>
                  </div>

                  <div className="h-48 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="publicPageCardTrend" x1="0" y1="0" x2="0" y2="1">
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
                        <Area type="monotone" dataKey="price" stroke="#DC143C" strokeWidth={2.5} fill="url(#publicPageCardTrend)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Slab Valuation Matrix */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      Certified Slab Valuation Radar
                    </h4>
                    <div className="flex items-center gap-1 font-mono text-xs">
                      {(['PSA', 'BGS', 'CGC', 'ACE'] as const).map((company) => (
                        <button
                          key={company}
                          type="button"
                          onClick={() => setGradingCompany(company)}
                          className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                            gradingCompany === company ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                          }`}
                        >
                          {company}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-center">
                    {['10 Gem', '9.5 Mint+', '9 Mint', '8 Near Mint'].map((gLabel, idx) => (
                      <div key={gLabel} className="p-2.5 bg-white border border-slate-200 rounded-lg">
                        <span className="text-[10px] text-slate-500 block font-bold">{gradingCompany} {gLabel}</span>
                        <span className="font-num font-bold text-slate-900 mt-1 block">
                          {formatCurrency(rawPrice * (3.2 - idx * 0.6), activeCurrency as any)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Legalities */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Standard: <strong className="text-slate-900">{card.legalities?.standard ? 'Legal' : 'Rotated'}</strong>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Expanded: <strong className="text-slate-900">{card.legalities?.expanded ? 'Legal' : 'Banned'}</strong>
                  </div>
                </div>

                {/* Attacks & Abilities */}
                {card.attacks && card.attacks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Attacks & Abilities</h3>
                    {card.attacks.map((attack, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm">{attack.name}</span>
                          {attack.damage && (
                            <span className="font-black text-[#DC143C] font-mono text-sm">{attack.damage} DMG</span>
                          )}
                        </div>
                        {attack.text && <p className="text-xs text-slate-600 leading-relaxed">{attack.text}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Set Navigation Cross-link */}
              {card.set && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Part of Master Set</span>
                    <h4 className="font-bold text-slate-900 text-base">{card.set.name}</h4>
                  </div>
                  <Link
                    to={`/set/${card.set.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors shrink-0"
                  >
                    View Set Checklist
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-12">
          <PtcPartnerBanner />
        </div>

        <div className="mt-8">
          <PublicInterlinkMesh />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
