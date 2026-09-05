import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Check, X, Shield, Zap, Award, ExternalLink, HelpCircle, ChevronRight } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';

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
    ourAdvantage: 'Laser-focused Pokémon TCG engineering with native PTCGL 60-card deck building, regulation mark tournament legality, real-time multi-currency FX conversions, and zero multi-game bloat.',
    quickVerdict: 'Choose Collectr if you collect multiple card games (MTG + Sports + Pokemon). Choose DECK / divider if you want the definitive, fastest, and most precise dedicated Pokémon TCG collection manager and tournament deck studio.',
    rating: '4.7 / 5.0 vs 4.4 / 5.0',
    pricingModel: 'Freemium with Ads & Paid Tier',
    idealFor: 'Multi-TCG & General Hobbyists',
    prosThem: ['Supports Yu-Gi-Oh, MTG, One Piece, and Sports', 'Decent mobile app interfaces', 'Barcode scanner for quick entry'],
    consThem: ['Lacks tournament format legality (Standard/Expanded/GLC)', 'No PTCGL deck builder or export tools', 'Ad-supported free tier with slower load times'],
    comparisonTable: [
      { feature: 'Dedicated Pokémon TCG Specialization', us: true, them: false },
      { feature: '60-Card Deckbuilder & PTCGL Export', us: true, them: false },
      { feature: 'Tournament Legality Checker (G & H Marks)', us: true, them: false },
      { feature: 'Live TCGplayer Market Lowest Verified', us: true, them: true },
      { feature: 'Multi-Currency Live FX (USD, EUR, GBP, JPY)', us: true, them: false },
      { feature: 'Offline-First IndexedDB Privacy Architecture', us: true, them: false },
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
    ourAdvantage: 'Modernized high-contrast studio interface with sub-second search, institutional portfolio valuation, graded slab tracking (PSA/BGS/CGC), and cloud/offline backup.',
    quickVerdict: 'Pokellector is an iconic checklist utility from the early 2010s, but lacks modern portfolio financial analytics, real-time market value graphs, and deck construction features.',
    rating: '4.8 / 5.0 vs 3.9 / 5.0',
    pricingModel: 'Ad-supported Web & App',
    idealFor: 'Casual checklist viewing',
    prosThem: ['Extensive archive of Japanese vintage sets', 'Simple visual grid checklist format', 'Free community access'],
    consThem: ['Outdated UI with aggressive banner advertisements', 'No graded card slab tracking or cost-basis analytics', 'No deckbuilding or tournament format features'],
    comparisonTable: [
      { feature: 'Modern High-Speed Dark UI', us: true, them: false },
      { feature: 'PSA, BGS & CGC Slab Vault Tracking', us: true, them: false },
      { feature: 'Historical Portfolio Profit/Loss Tracking', us: true, them: false },
      { feature: 'Set Checklists & Master Set Progress', us: true, them: true },
      { feature: 'Ad-Free Interface', us: true, them: false },
      { feature: 'Sub-Second Client-Side Instant Filter', us: true, them: false },
      { feature: 'Export Portfolio to CSV / Spreadsheet', us: true, them: false },
    ]
  },
  'pricecharting': {
    id: 'pricecharting',
    name: 'PriceCharting',
    tagline: 'Historical Collectibles & Video Game Price Aggregator',
    theirFocus: 'Aggregating historical eBay completed sales for retro video games, comics, sports cards, and Pokémon slabs.',
    ourAdvantage: 'Purpose-built for active Pokémon collectors and players with interactive binder views, 60-card tournament deck testing, regulation marks, and set completion trackers.',
    quickVerdict: 'PriceCharting is an essential price discovery database for eBay sales, but poorly suited as a daily collection organizer or deck builder. DECK / divider provides a complete operating system for managing what you own.',
    rating: '4.8 / 5.0 vs 4.3 / 5.0',
    pricingModel: 'Freemium with Subscription Database',
    idealFor: 'Historical eBay auction lookups',
    prosThem: ['Deep historical eBay sales chart archives', 'Great for video game and comic crossover collections', 'Lots of graded price points'],
    consThem: ['Clunky collection management interface', 'No playable card mechanics, energy counts, or deck testing', 'Generic UI designed around video game cartridges'],
    comparisonTable: [
      { feature: 'Specialized Pokémon Binder & Vault UI', us: true, them: false },
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
    ourAdvantage: 'Cross-platform progressive web desktop & mobile studio with deep deck building, CSV bulk exports, sealed booster box vaulting, and sharable portfolio showcases.',
    quickVerdict: 'Dex is a handy mobile pocket app, but DECK / divider is an institutional desktop + mobile operating system with advanced analytics and tournament deck tools.',
    rating: '4.8 / 5.0 vs 4.2 / 5.0',
    pricingModel: 'Freemium with In-App Purchases',
    idealFor: 'Casual mobile-only browsing',
    prosThem: ['Clean mobile iOS native feel', 'Good offline set database', 'Visual scanning on mobile'],
    consThem: ['Limited desktop web support', 'No tournament deck analytics or hands simulators', 'Restricted cloud export options on free tier'],
    comparisonTable: [
      { feature: 'Cross-Platform Desktop Web & Mobile PWA', us: true, them: false },
      { feature: 'Tournament Deck Testing & Hand Simulators', us: true, them: false },
      { feature: 'Public Shareable Portfolio Showcases', us: true, them: false },
      { feature: 'Sealed Vault (ETBs, Booster Boxes, Cases)', us: true, them: false },
      { feature: 'Live TCGplayer Market Lowest Verified', us: true, them: true },
    ]
  },
  'tcg-collector': {
    id: 'tcg-collector',
    name: 'TCG Collector',
    tagline: 'Comprehensive Pokémon Card Checklist Website',
    theirFocus: 'Exhaustive variant tracking for master set collectors (promos, reverses, non-holo variants).',
    ourAdvantage: 'Modern high-speed application with comprehensive deck construction, financial portfolio ROI tracking, live currency FX, and encrypted offline backup.',
    quickVerdict: 'TCG Collector excels at identifying obscure card variants, while DECK / divider combines variant master set tracking with institutional-grade financial portfolio management and tournament deck building.',
    rating: '4.8 / 5.0 vs 4.5 / 5.0',
    pricingModel: 'Subscription & Free Tier',
    idealFor: 'Exotic variant collectors',
    prosThem: ['Detailed breakdown of card finish variants', 'Strong international card coverage', 'Active community forums'],
    consThem: ['Slower server-rendered web UI', 'No competitive 60-card tournament deck studio', 'Complex navigation for casual players'],
    comparisonTable: [
      { feature: 'Sub-Second Local Client Performance', us: true, them: false },
      { feature: 'Tournament 60-Card Deckbuilder & PTCGL Export', us: true, them: false },
      { feature: 'Multi-Currency Live FX Calculations', us: true, them: false },
      { feature: 'Master Set Checklist Progress', us: true, them: true },
      { feature: 'Cost-Basis & Realized Profit/Loss Tracking', us: true, them: false },
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

  // Render All Comparisons Directory if no competitor selected or competitor not found
  if (!competitorId || !competitor) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans text-white">
        <LandingNav 
          onOpenAuth={() => navigate('/auth')} 
          onNavigateSection={(id) => {
            if (id === 'home') navigate('/');
            else navigate('/#' + id);
          }} 
        />

        <main className="flex-grow pt-24 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-semibold uppercase tracking-wider mb-4">
                <Award className="w-3.5 h-3.5" />
                Independent Competitor Benchmarks
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                Best Pokémon TCG Trackers Compared (2025/2026)
              </h1>
              <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl mx-auto">
                Discover how DECK / divider compares against Collectr, Pokellector, PriceCharting, Dex, TCG Collector, and Dragon Shield. Detailed feature-by-feature breakdowns for collectors and tournament players.
              </p>
            </div>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {Object.values(competitors).map((comp) => (
                <div key={comp.id} className="bg-[#111827] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-2xl p-6 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">
                        DECK / divider vs. {comp.name}
                      </h2>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1E293B] text-[#38BDF8] border border-[#334155]">
                        {comp.rating}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] font-mono mb-4">{comp.tagline}</p>
                    <p className="text-sm text-[#94A3B8] line-clamp-3 mb-6">
                      {comp.theirFocus}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#1E293B]">
                    <div className="text-xs text-white font-medium mb-3 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>{comp.ourAdvantage.slice(0, 75)}...</span>
                    </div>
                    <Link
                      to={`/compare/${comp.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1E293B] group-hover:bg-[#38BDF8] text-white group-hover:text-[#0B0F19] text-xs font-bold transition-all flex items-center justify-center gap-1 border border-[#334155] group-hover:border-[#38BDF8]"
                    >
                      Read Full Comparison <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Master Feature Matrix Table */}
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-16">
              <h2 className="text-2xl font-bold text-white mb-2">
                Comprehensive Feature Comparison Matrix
              </h2>
              <p className="text-sm text-[#94A3B8] mb-6">
                Direct benchmark across core capabilities for serious Pokémon card collectors and competitive competitors.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E293B] bg-[#0F172A] text-xs font-mono text-[#94A3B8]">
                      <th className="py-4 px-4 font-semibold">Core Capability</th>
                      <th className="py-4 px-4 font-bold text-white text-center bg-[#38BDF8]/10 border-x border-[#38BDF8]/30">
                        DECK / divider
                      </th>
                      <th className="py-4 px-4 text-center">Collectr</th>
                      <th className="py-4 px-4 text-center">Pokellector</th>
                      <th className="py-4 px-4 text-center">PriceCharting</th>
                      <th className="py-4 px-4 text-center">Dex</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    <tr className="hover:bg-[#1E293B]/30">
                      <td className="py-4 px-4 font-medium text-white">60-Card Deck Builder with PTCGL Export</td>
                      <td className="py-4 px-4 text-center bg-[#38BDF8]/5 border-x border-[#38BDF8]/20"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#1E293B]/30">
                      <td className="py-4 px-4 font-medium text-white">Tournament Format Legality (G &amp; H Regulation)</td>
                      <td className="py-4 px-4 text-center bg-[#38BDF8]/5 border-x border-[#38BDF8]/20"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#1E293B]/30">
                      <td className="py-4 px-4 font-medium text-white">Live Multi-Currency FX Conversions</td>
                      <td className="py-4 px-4 text-center bg-[#38BDF8]/5 border-x border-[#38BDF8]/20"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#1E293B]/30">
                      <td className="py-4 px-4 font-medium text-white">PSA, BGS &amp; CGC Graded Slab Tracking</td>
                      <td className="py-4 px-4 text-center bg-[#38BDF8]/5 border-x border-[#38BDF8]/20"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#1E293B]/30">
                      <td className="py-4 px-4 font-medium text-white">Sealed Vault (Booster Boxes, ETBs, Cases)</td>
                      <td className="py-4 px-4 text-center bg-[#38BDF8]/5 border-x border-[#38BDF8]/20"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                    </tr>
                    <tr className="hover:bg-[#1E293B]/30">
                      <td className="py-4 px-4 font-medium text-white">Offline-First Client Cache (IndexedDB)</td>
                      <td className="py-4 px-4 text-center bg-[#38BDF8]/5 border-x border-[#38BDF8]/20"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><X className="w-5 h-5 text-[#64748B] mx-auto" /></td>
                      <td className="py-4 px-4 text-center"><Check className="w-5 h-5 text-emerald-400 mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center bg-gradient-to-b from-[#111827] to-[#0B0F19] border border-[#1E293B] rounded-2xl p-8 sm:p-12">
              <h2 className="text-3xl font-black text-white mb-4">
                Ready to Experience the DECK / divider Difference?
              </h2>
              <p className="text-[#94A3B8] max-w-xl mx-auto mb-8">
                Join thousands of Pokémon TCG players and collectors tracking their cards, slabs, and tournament lists with zero fluff.
              </p>
              <button
                onClick={() => navigate('/auth')}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold rounded-xl transition-all shadow-lg hover:scale-105"
              >
                Launch DECK / divider Free <ArrowRight className="w-5 h-5" />
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
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans text-white">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-8">
            <Link to="/compare" className="text-xs font-mono text-[#38BDF8] hover:underline flex items-center gap-1">
              ← All Competitor Comparisons
            </Link>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              DECK / divider vs. {competitor.name}
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Wondering whether DECK / divider or {competitor.name} is the best choice for your Pokémon card collection? Here is the definitive feature and pricing benchmark.
            </p>
          </div>

          {/* Answer-First Quick Verdict Box (Optimized for AI Overviews & Snippets) */}
          <div className="bg-[#111827] border-l-4 border-[#38BDF8] rounded-xl p-6 mb-12 shadow-md">
            <div className="flex items-center gap-2 text-[#38BDF8] font-mono text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              Quick Verdict: DECK / divider vs. {competitor.name}
            </div>
            <p className="text-white text-base leading-relaxed font-medium">
              {competitor.quickVerdict}
            </p>
          </div>

          {/* Side-by-Side Philosophy Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1E293B] rounded-xl flex items-center justify-center font-bold text-white text-lg">
                    {competitor.name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{competitor.name}</h2>
                    <span className="text-xs text-[#64748B] font-mono">{competitor.idealFor}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-4">
                {competitor.theirFocus}
              </p>
              <div className="space-y-2 text-xs">
                <div className="font-semibold text-slate-300">Strengths:</div>
                <ul className="list-disc list-inside text-[#94A3B8] space-y-1">
                  {competitor.prosThem.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="bg-[#111827] border border-[#38BDF8]/40 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#38BDF8]/10 rounded-full blur-3xl"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#38BDF8] rounded-xl flex items-center justify-center text-[#0B0F19]">
                    <Zap className="w-5 h-5 text-[#0B0F19]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">DECK / divider</h2>
                    <span className="text-xs text-[#38BDF8] font-mono">Specialized Pokémon OS</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-[#E2E8F0] leading-relaxed mb-4 relative z-10 font-medium">
                {competitor.ourAdvantage}
              </p>
              <div className="space-y-2 text-xs relative z-10">
                <div className="font-semibold text-[#38BDF8]">Why Collectors Switch:</div>
                <ul className="list-disc list-inside text-slate-200 space-y-1">
                  <li>Direct 1-click PTCGL 60-card export</li>
                  <li>Live TCGplayer pricing without slow ads</li>
                  <li>Full multi-currency support with offline encryption</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl overflow-hidden mb-12">
            <div className="p-4 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#94A3B8]">Feature Breakdown</span>
              <span className="text-xs text-[#64748B]">Updated for 2025/2026 season</span>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E293B] bg-[#0F172A] text-xs font-mono text-[#94A3B8]">
                  <th className="py-3 px-6 w-1/2">Capability</th>
                  <th className="py-3 px-6 text-center text-white border-l border-[#1E293B] bg-[#38BDF8]/10">
                    DECK / divider
                  </th>
                  <th className="py-3 px-6 text-center border-l border-[#1E293B]">{competitor.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {competitor.comparisonTable.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#1E293B]/30 transition-colors">
                    <td className="py-4 px-6 text-sm text-[#E2E8F0] font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center border-l border-[#1E293B] bg-[#38BDF8]/5">
                      {typeof row.us === 'boolean' ? (
                        row.us ? <Check className="w-5 h-5 text-emerald-400 mx-auto" /> : <X className="w-5 h-5 text-[#64748B] mx-auto" />
                      ) : (
                        <span className="text-xs font-bold text-[#38BDF8] font-mono">{row.us}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center border-l border-[#1E293B]">
                      {typeof row.them === 'boolean' ? (
                        row.them ? <Check className="w-5 h-5 text-[#94A3B8] mx-auto" /> : <X className="w-5 h-5 text-[#64748B] mx-auto" />
                      ) : (
                        <span className="text-xs text-[#94A3B8] font-mono">{row.them}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CTA Box */}
          <div className="text-center bg-[#111827] border border-[#1E293B] rounded-2xl p-8 sm:p-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Ready to Upgrade to DECK / divider?
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-md mx-auto mb-6">
              Import your cards in seconds or try our demo guest mode without creating an account.
            </p>
            <button 
              onClick={() => navigate('/auth')}
              className="inline-flex items-center justify-center gap-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:scale-105"
            >
              Start Free on DECK / divider
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="mt-4 text-xs text-[#64748B]">
              No credit card required. Free tier includes full vault tracking and deckbuilder.
            </div>
          </div>

        </div>
      </main>

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
