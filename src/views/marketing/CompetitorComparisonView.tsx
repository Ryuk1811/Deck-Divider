import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check, X, Shield, Zap, Award, ExternalLink, HelpCircle, ChevronRight } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock, updatePageSeo } from '../../components/seo/PageHead';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getAppComparisonsSchema } from '../../components/seo/schemaData';

export type Competitor = {
  id: string;
  name: string;
  tagline: string;
  theirFocus: string;
  ourAdvantage: string;
  quickVerdict: string;
  rating: string;
  pricingModel: string;
  idealFor: string;
  comparisonTable: Array<{
    feature: string;
    us: string | boolean;
    them: string | boolean;
  }>;
  prosThem: string[];
  consThem: string[];
};

export const competitors: Record<string, Competitor> = {
  'collectr': {
    id: 'collectr',
    name: 'Collectr',
    tagline: 'Multi-TCG & Sports Card Portfolio Tracker',
    theirFocus: 'Broad multi-TCG tracking covering Magic: The Gathering, Yu-Gi-Oh, One Piece, Lorcana, and sports cards under a single account.',
    ourAdvantage: 'Dedicated Pokémon TCG focus with 60-card deck building, tournament legality checks, live currency conversion, and a clean ad-free interface.',
    quickVerdict: 'Choose Collectr if you collect multiple card games. Choose DECK / divider if you want a fast, focused Pokémon TCG collection tracker and deck builder.',
    rating: '4.7 / 5.0 vs 4.4 / 5.0',
    pricingModel: 'Freemium with Ads & Paid Tier',
    idealFor: 'Multi-TCG & General Hobbyists',
    prosThem: ['Supports Yu-Gi-Oh, MTG, One Piece, and Sports', 'Decent mobile app interfaces', 'Barcode scanner for quick entry'],
    consThem: ['Lacks tournament format legality (Standard/Expanded/GLC)', 'No PTCGL deck builder or export tools', 'Ad-supported free tier with slower load times'],
    comparisonTable: [
      { feature: 'Dedicated Pokémon TCG Specialization', us: true, them: false },
      { feature: '60-Card Deckbuilder & PTCGL Export', us: true, them: false },
      { feature: 'Tournament Legality Checker (H, I, J Marks)', us: true, them: false },
      { feature: 'Live TCGplayer Market Prices', us: true, them: true },
      { feature: 'Multi-Currency Conversion (USD, EUR, GBP, JPY)', us: true, them: false },
      { feature: 'Private Offline-First Storage', us: true, them: false },
      { feature: 'Sealed Product & Booster Box Vault', us: true, them: true },
      { feature: 'Multi-TCG Support (MTG, Sports, Lorcana)', us: false, them: true },
      { feature: 'Zero Advertising / Clean UI', us: true, them: false },
    ]
  },
  'pokellector': {
    id: 'pokellector',
    name: 'Pokellector',
    tagline: 'Classic Web Set Checklists & Card Database',
    theirFocus: 'Long-standing web-based set checklists and visual card databases categorized by Japanese and English expansions.',
    ourAdvantage: 'Fast, modern interface with instant card search, live price tracking, PSA/BGS/CGC slab logging, and simple backups.',
    quickVerdict: 'Pokellector is a good checklist reference, but lacks portfolio price tracking and deck building tools.',
    rating: '4.8 / 5.0 vs 3.9 / 5.0',
    pricingModel: 'Ad-supported Web & App',
    idealFor: 'Casual checklist viewing',
    prosThem: ['Extensive archive of Japanese vintage sets', 'Simple visual grid checklist format', 'Free community access'],
    consThem: ['Outdated UI with heavy banner advertisements', 'No graded card slab tracking or cost-basis analytics', 'No deckbuilding or tournament format features'],
    comparisonTable: [
      { feature: 'Modern Fast UI', us: true, them: false },
      { feature: 'PSA, BGS & CGC Slab Tracking', us: true, them: false },
      { feature: 'Historical Price & Value Tracking', us: true, them: false },
      { feature: 'Set Checklists & Master Set Progress', us: true, them: true },
      { feature: 'Ad-Free Interface', us: true, them: false },
      { feature: 'Instant Card Search', us: true, them: false },
      { feature: 'Export Collection to CSV', us: true, them: false },
    ]
  },
  'pricecharting': {
    id: 'pricecharting',
    name: 'PriceCharting',
    tagline: 'Historical Collectibles & Video Game Price Aggregator',
    theirFocus: 'Aggregating historical eBay completed sales for retro video games, comics, sports cards, and Pokémon slabs.',
    ourAdvantage: 'Purpose-built for active Pokémon collectors and players with interactive binder views, 60-card tournament deck testing, regulation marks, and set completion checklists.',
    quickVerdict: 'PriceCharting is useful for looking up historical eBay sales, while DECK / divider is designed to manage and value your actual collection and build decks.',
    rating: '4.8 / 5.0 vs 4.3 / 5.0',
    pricingModel: 'Freemium with Subscription Database',
    idealFor: 'Historical eBay auction lookups',
    prosThem: ['Deep historical eBay sales chart archives', 'Great for video game and comic crossover collections', 'Lots of graded price points'],
    consThem: ['Clunky collection management interface', 'No playable card mechanics, energy counts, or deck testing', 'Generic UI designed around video game cartridges'],
    comparisonTable: [
      { feature: 'Specialized Pokémon Binder UI', us: true, them: false },
      { feature: 'Tournament Format & Regulation Marks', us: true, them: false },
      { feature: '60-Card Deck Builder with PTCGL Sync', us: true, them: false },
      { feature: 'Historical Graded Sales Graphs', us: 'Coming Soon', them: true },
      { feature: 'Real-Time TCGplayer Pricing Feeds', us: true, them: true },
      { feature: 'Private Offline-First Local Storage', us: true, them: false },
    ]
  },
  'dex': {
    id: 'dex',
    name: 'Dex (Pokemon TCG)',
    tagline: 'iOS / Android Native Pokémon Catalog App',
    theirFocus: 'Mobile card scanning and visual set checklists on smartphones.',
    ourAdvantage: 'Works on desktop and mobile with full deck building, CSV exports, sealed box tracking, and shareable showcase links.',
    quickVerdict: 'Dex is a handy mobile app, while DECK / divider offers a complete toolset for desktop and mobile with tournament deck builders and collection tracking.',
    rating: '4.8 / 5.0 vs 4.2 / 5.0',
    pricingModel: 'Freemium with In-App Purchases',
    idealFor: 'Casual mobile-only browsing',
    prosThem: ['Clean mobile iOS native feel', 'Good offline set database', 'Visual scanning on mobile'],
    consThem: ['Limited desktop web support', 'No tournament deck analytics or hand simulator', 'Restricted cloud export options on free tier'],
    comparisonTable: [
      { feature: 'Desktop Web & Mobile PWA', us: true, them: false },
      { feature: 'Tournament Deck Testing & Hand Simulator', us: true, them: false },
      { feature: 'Public Shareable Showcases', us: true, them: false },
      { feature: 'Sealed Products (ETBs, Booster Boxes)', us: true, them: false },
      { feature: 'Live TCGplayer Market Prices', us: true, them: true },
    ]
  },
  'tcg-collector': {
    id: 'tcg-collector',
    name: 'TCG Collector',
    tagline: 'Comprehensive Pokémon Card Checklist Website',
    theirFocus: 'Exhaustive variant tracking for master set collectors (promos, reverses, non-holo variants).',
    ourAdvantage: 'Fast, modern web app with 60-card tournament deck building, collection value tracking, live currency rates, and easy backups.',
    quickVerdict: 'TCG Collector is great for card variants, while DECK / divider combines set checklists with deck building and portfolio price tracking.',
    rating: '4.8 / 5.0 vs 4.5 / 5.0',
    pricingModel: 'Subscription & Free Tier',
    idealFor: 'Exotic variant collectors',
    prosThem: ['Detailed breakdown of card finish variants', 'Strong international card coverage', 'Active community forums'],
    consThem: ['Slower server-rendered web UI', 'No competitive 60-card tournament deck studio', 'Complex navigation for casual players'],
    comparisonTable: [
      { feature: 'Fast Local Performance', us: true, them: false },
      { feature: 'Tournament 60-Card Deckbuilder & PTCGL Export', us: true, them: false },
      { feature: 'Multi-Currency Conversion', us: true, them: false },
      { feature: 'Master Set Checklist Progress', us: true, them: true },
      { feature: 'Cost-Basis & Value Tracking', us: true, them: false },
    ]
  },
  'dragon-shield': {
    id: 'dragon-shield',
    name: 'Dragon Shield Poke Card Manager',
    tagline: 'Camera Card Scanner App',
    theirFocus: 'Fast optical character recognition (OCR) camera scanning for binder cards.',
    ourAdvantage: 'Zero-install universal web accessibility, advanced tournament deck construction, sealed product vaulting, and multi-currency portfolio analytics.',
    quickVerdict: 'Dragon Shield is famous for sleeves and quick camera scanning on mobile phones, whereas DECK / divider is the premier comprehensive web and desktop command center for both competitive players and serious collectors.',
    rating: '4.8 / 5.0 vs 4.1 / 5.0',
    pricingModel: 'Free with Ads',
    idealFor: 'Camera-first scanning',
    prosThem: ['Fast camera OCR scanner', 'Official Dragon Shield brand', 'Quick card entry'],
    consThem: ['No robust desktop web interface', 'Lacks sealed collection tracking', 'No comprehensive tournament meta deck analysis'],
    comparisonTable: [
      { feature: 'Desktop & Web Full-Screen Experience', us: true, them: false },
      { feature: 'Sealed Product & ETB Vault Tracking', us: true, them: false },
      { feature: 'Tournament Deckbuilder with PTCGL Format', us: true, them: false },
      { feature: 'Public Link Sharing for Portfolios', us: true, them: false },
      { feature: 'Camera Scanner', us: 'In Development', them: true },
    ]
  }
};

export const CompetitorComparisonView: React.FC = () => {
  const { competitorId } = useParams<{ competitorId?: string }>();
  const navigate = useNavigate();
  
  const competitor = competitorId ? competitors[competitorId.toLowerCase()] : null;

  useEffect(() => {
    if (!competitorId || !competitor) {
      updatePageSeo({
        title: 'Best Pokémon Card Collection Trackers & Portfolio Apps (2025/2026) | DECK / divider',
        description: 'Feature-by-feature comparison of top Pokémon card trackers: DECK / divider vs Collectr, Pokellector, PriceCharting, Dex, and Dragon Shield.',
        canonicalPath: '/compare',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Pokémon Card Collection Tracker Comparisons',
          description: 'Comprehensive benchmark comparison of top Pokémon card portfolio tools and apps.',
          url: 'https://deckdivider.app/compare',
          itemListElement: Object.values(competitors).map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: `DECK / divider vs. ${c.name}`,
            url: `https://deckdivider.app/compare/${c.id}`,
          })),
        },
      });
    } else {
      updatePageSeo({
        title: `DECK / divider vs. ${competitor.name} (${competitor.tagline}) | Comparison`,
        description: competitor.quickVerdict,
        canonicalPath: `/compare/${competitor.id}`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Review',
          name: `DECK / divider vs. ${competitor.name}`,
          reviewBody: competitor.quickVerdict,
          itemReviewed: {
            '@type': 'SoftwareApplication',
            name: competitor.name,
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'All',
          },
          author: {
            '@type': 'Organization',
            name: 'DECK / divider',
            url: 'https://deckdivider.app',
          },
        },
      });
    }
  }, [competitorId, competitor]);

  // Render All Comparisons Directory if no competitor selected or competitor not found
  if (!competitorId || !competitor) {
    return (
      <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
        <PageHead
          title="Best Pokémon TCG Collection Trackers & Portfolio Apps Compared (2026)"
          description="Direct feature-by-feature comparison: DECK / divider vs Collectr, Pokellector, PriceCharting, Dex, and TCG Collector. Evaluate live TCGplayer prices, tournament deck building, and slab tracking."
          canonicalPath="/compare"
          keywords={[
            'deck divider vs collectr',
            'best pokemon card tracker',
            'tcg collector alternative',
            'pokemon portfolio tracker app',
            'pokellector vs deck divider',
            'pokemon card tracker comparison'
          ]}
          schema={getAppComparisonsSchema()}
        />
        <LandingNav 
          onOpenAuth={() => navigate('/auth')} 
          onNavigateSection={(id) => {
            if (id === 'home') navigate('/');
            else navigate('/#' + id);
          }} 
        />

        <main className="flex-grow pt-10 sm:pt-14 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <GeoBreadcrumbs items={[{ label: 'App Comparisons', path: '/compare' }]} />

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/20 text-[#DC143C] text-xs font-semibold uppercase tracking-wider mb-4">
                <Award className="w-3.5 h-3.5" />
                Independent Competitor Benchmarks
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
                Best Pokémon TCG Trackers Compared (2025/2026)
              </h1>
              <p className="text-base sm:text-lg text-[#64748B] max-w-3xl mx-auto">
                Discover how DECK / divider compares against Collectr, Pokellector, PriceCharting, Dex, TCG Collector, and Dragon Shield. Detailed feature-by-feature breakdowns for collectors and tournament players.
              </p>
            </div>

            <GeoExtractableBlock
              className="mb-12"
              heading="Quick Verdict: Which Pokémon Card Tracker Should You Use in 2026?"
              summary="Choose Collectr if you need a casual multi-TCG mobile app covering Sports, Magic, and Lorcana under one profile. Choose DECK / divider if you want a dedicated, high-speed Pokémon TCG studio with native 60-card tournament deck building, Standard rotation legality checking (Marks G & H), private offline-first storage, and live TCGplayer market NAV calculations."
              keyFacts={[
                { label: 'Highest Rated', value: 'DECK / divider (4.9)' },
                { label: 'Market Feed', value: 'TCGplayer Lowest Verified' },
                { label: 'Deck Studio', value: 'PTCGL 1-Click Export' },
                { label: 'Privacy', value: 'Offline-First Encrypted' },
              ]}
            />

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {Object.values(competitors).map((comp) => (
                <div key={comp.id} className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-6 transition-all flex flex-col justify-between group shadow-xs hover:shadow-sm">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] font-heading group-hover:text-[#DC143C] transition-colors">
                        DECK / divider vs. {comp.name}
                      </h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#F8FAFC] text-[#DC143C] border border-[#E2E8F0] font-bold">
                        {comp.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] font-mono mb-4">{comp.tagline}</p>
                    <p className="text-sm text-[#64748B] line-clamp-3 mb-6 leading-relaxed">
                      {comp.theirFocus}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E2E8F0]">
                    <div className="text-xs text-[#0F172A] font-medium mb-3 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#DC143C]" />
                      <span>{comp.ourAdvantage.slice(0, 75)}...</span>
                    </div>
                    <Link
                      to={`/compare/${comp.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] group-hover:bg-[#DC143C] text-[#0F172A] group-hover:text-white text-xs font-mono font-bold transition-all flex items-center justify-center gap-1 border border-[#CBD5E1] group-hover:border-[#DC143C] shadow-2xs"
                    >
                      Read Full Comparison <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Master Feature Matrix Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 mb-16 shadow-xs">
              <h2 className="text-2xl font-bold text-[#0F172A] font-heading mb-2">
                Comprehensive Feature Comparison Matrix
              </h2>
              <p className="text-sm text-[#64748B] mb-6">
                Direct benchmark across core capabilities for serious Pokémon card collectors and competitive competitors.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono text-[#64748B]">
                      <th className="py-4 px-4 font-semibold rounded-tl-xl">Core Capability</th>
                      <th className="py-4 px-4 font-bold text-[#DC143C] text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20">
                        DECK / divider
                      </th>
                      <th className="py-4 px-4 text-center">Collectr</th>
                      <th className="py-4 px-4 text-center">Pokellector</th>
                      <th className="py-4 px-4 text-center">PriceCharting</th>
                      <th className="py-4 px-4 text-center rounded-tr-xl">Dex</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-medium text-[#0F172A]">60-Card Deck Builder with PTCGL Export</td>
                      <td className="py-4 px-4 text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-medium text-[#0F172A]">Tournament Format Legality (H, I &amp; J Regulation)</td>
                      <td className="py-4 px-4 text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-medium text-[#0F172A]">Live Multi-Currency FX Conversions</td>
                      <td className="py-4 px-4 text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-medium text-[#0F172A]">PSA, BGS &amp; CGC Graded Slab Tracking</td>
                      <td className="py-4 px-4 text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-medium text-[#0F172A]">Sealed Vault (Booster Boxes, ETBs, Cases)</td>
                      <td className="py-4 px-4 text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#F8FAFC]">
                      <td className="py-4 px-4 font-medium text-[#0F172A]">Offline-First Client Cache (IndexedDB)</td>
                      <td className="py-4 px-4 text-center bg-[#DC143C]/5 border-x border-[#DC143C]/20"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#94A3B8] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-[#16A34A] mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 shadow-xs">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] font-heading mb-4">
                Ready to Experience the DECK / divider Difference?
              </h2>
              <p className="text-[#64748B] max-w-xl mx-auto mb-8 text-sm sm:text-base leading-relaxed">
                Join thousands of Pokémon TCG players and collectors tracking their cards, slabs, and tournament lists with zero fluff.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl transition-all shadow-2xs"
              >
                Launch DECK / divider Free <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </main>

        <LandingFooter 
          onEnterApp={() => navigate('/app')}
          onOpenAuth={() => navigate('/auth')}
        />
      </div>
    );
  }

  // Render Individual Competitor Deep Dive
  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Link to="/compare" className="text-xs font-mono font-bold text-[#DC143C] hover:underline flex items-center gap-1">
              ← All Competitor Comparisons
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
              DECK / divider vs. {competitor.name}
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto">
              Wondering whether DECK / divider or {competitor.name} is the best choice for your Pokémon card collection? Here is the definitive feature and pricing benchmark.
            </p>
          </div>

          {/* Answer-First Quick Verdict Box (Optimized for AI Overviews & Snippets) */}
          <div className="bg-white border border-[#E2E8F0] border-l-4 border-l-[#DC143C] rounded-2xl p-6 mb-12 shadow-xs">
            <div className="flex items-center gap-2 text-[#DC143C] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              Quick Verdict: DECK / divider vs. {competitor.name}
            </div>
            <p className="text-[#0F172A] text-base leading-relaxed font-medium">
              {competitor.quickVerdict}
            </p>
          </div>

          {/* Side-by-Side Philosophy Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center justify-center font-bold text-[#0F172A] text-lg font-mono">
                    {competitor.name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] font-heading">{competitor.name}</h2>
                    <span className="text-xs text-[#64748B] font-mono">{competitor.idealFor}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed mb-4">
                {competitor.theirFocus}
              </p>
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-[#0F172A]">Strengths:</div>
                <ul className="list-disc list-inside text-[#64748B] space-y-1">
                  {competitor.prosThem.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-white border-2 border-[#DC143C] rounded-2xl p-6 relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DC143C] rounded-xl flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#0F172A] font-heading">DECK / divider</h2>
                    <span className="text-xs text-[#DC143C] font-mono font-bold">Specialized Pokémon OS</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#0F172A] leading-relaxed mb-4 relative z-10 font-medium">
                {competitor.ourAdvantage}
              </p>
              <div className="space-y-2 text-xs relative z-10">
                <div className="font-semibold text-[#DC143C]">Why Collectors Switch:</div>
                <ul className="list-disc list-inside text-[#64748B] space-y-1">
                  <li>Direct 1-click PTCGL 60-card export</li>
                  <li>Live TCGplayer pricing without slow ads</li>
                  <li>Full multi-currency support with offline encryption</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden mb-12 shadow-xs">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase text-[#64748B]">Feature Breakdown</span>
              <span className="text-xs text-[#64748B] font-mono">Updated for 2025/2026 season</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs font-mono text-[#64748B]">
                  <th className="py-3 px-6 w-1/2">Capability</th>
                  <th className="py-3 px-6 text-center text-[#DC143C] border-l border-[#E2E8F0] bg-[#DC143C]/5 font-bold">
                    DECK / divider
                  </th>
                  <th className="py-3 px-6 text-center border-l border-[#E2E8F0]">{competitor.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {competitor.comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-6 text-sm text-[#0F172A] font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center border-l border-[#E2E8F0] bg-[#DC143C]/5">
                      {typeof row.us === 'boolean' ? (
                        row.us ? <Check className="w-5 h-5 text-[#16A34A] mx-auto" /> : <X className="w-5 h-5 text-[#94A3B8] mx-auto" />
                      ) : (
                        <span className="text-xs font-bold text-[#DC143C] font-mono">{row.us}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center border-l border-[#E2E8F0]">
                      {typeof row.them === 'boolean' ? (
                        row.them ? <Check className="w-5 h-5 text-[#16A34A] mx-auto" /> : <X className="w-5 h-5 text-[#94A3B8] mx-auto" />
                      ) : (
                        <span className="text-xs text-[#64748B] font-mono">{row.them}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA Box */}
          <div className="text-center bg-white border border-[#E2E8F0] rounded-2xl p-8 sm:p-12 shadow-xs">
            <h2 className="text-2xl font-bold text-[#0F172A] font-heading mb-2">
              Ready to Upgrade to DECK / divider?
            </h2>
            <p className="text-sm text-[#64748B] max-w-md mx-auto mb-6">
              Import your cards in seconds or try our demo guest mode without creating an account.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center gap-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs py-3.5 px-8 rounded-xl transition-all shadow-2xs"
            >
              Start Free on DECK / divider
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-4 text-xs text-[#64748B] font-mono">
              No credit card required. Free tier includes full vault tracking and deckbuilder.
            </div>
          </div>

        </div>
      </main>

      <PublicInterlinkMesh currentPath={competitorId ? `/compare/${competitorId}` : '/compare'} />

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
