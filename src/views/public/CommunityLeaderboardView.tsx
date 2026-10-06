import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Trophy, 
  Flame, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  TrendingUp, 
  Layers, 
  Award, 
  Sparkles, 
  ChevronRight,
  Code2
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getCommunityLeaderboardSchema } from '../../components/seo/schemaData';

interface PublicCollector {
  rank: number;
  collectionName: string;
  ownerName: string;
  handle: string;
  badge: string;
  totalValue: number;
  totalCards: number;
  slabCount: number;
  completionPercentage: string;
  verificationDate: string;
  verificationHash: string;
  featuredCards: Array<{ name: string; grade: string; value: number }>;
  shareId: string;
  portfolioUrl: string;
}

const TOP_COLLECTORS: PublicCollector[] = [
  {
    rank: 1,
    collectionName: 'Pallet Town Vault',
    ownerName: 'Marcus Vance',
    handle: '@kanto_archivist',
    badge: 'Verified Master Archivist',
    totalValue: 28450,
    totalCards: 102,
    slabCount: 42,
    completionPercentage: '100% Base Set Master (102/102 Cards)',
    verificationDate: 'September 2026',
    verificationHash: 'sha256:7f9a2b8c4d1e90fa',
    featuredCards: [
      { name: 'Charizard (1st Edition Shadowless #4)', grade: 'PSA 10', value: 12500 },
      { name: 'Blastoise (Shadowless #2)', grade: 'PSA 10', value: 4200 },
      { name: 'Venusaur (1st Edition #15)', grade: 'PSA 10', value: 3800 },
    ],
    shareId: 'pallet-town-vault',
    portfolioUrl: '/portfolio/pallet-town-vault',
  },
  {
    rank: 2,
    collectionName: 'Crown Zenith Archivist',
    ownerName: 'Elena Rostova',
    handle: '@crown_curator',
    badge: 'Verified Galarian Master',
    totalValue: 14820,
    totalCards: 230,
    slabCount: 46,
    completionPercentage: '98.4% Master (Galarian Gallery 70/70)',
    verificationDate: 'September 2026',
    verificationHash: 'sha256:3a1c8e9f2b5d4e11',
    featuredCards: [
      { name: 'Giratina VSTAR (Galarian Gallery GG69)', grade: 'PSA 10', value: 185 },
      { name: 'Arceus VSTAR (Galarian Gallery GG70)', grade: 'PSA 10', value: 140 },
      { name: 'Mewtwo VSTAR (Galarian Gallery GG44)', grade: 'PSA 10', value: 125 },
    ],
    shareId: 'crown-zenith-vault',
    portfolioUrl: '/portfolio/crown-zenith-vault',
  },
  {
    rank: 3,
    collectionName: 'Sinnoh League Champion',
    ownerName: 'Julian Thorne',
    handle: '@tournament_ace',
    badge: 'Play! Pokémon Competitor',
    totalValue: 6940,
    totalCards: 360,
    slabCount: 18,
    completionPercentage: '100% 2026 Standard Legal (Marks H, I, J)',
    verificationDate: 'September 2026',
    verificationHash: 'sha256:9c4d2e1a8f7b530c',
    featuredCards: [
      { name: 'Gardevoir ex (Special Illustration #245)', grade: 'PSA 10', value: 95 },
      { name: 'Prime Catcher (ACE SPEC #157)', grade: 'PSA 10', value: 85 },
      { name: 'Iono (Special Illustration Rare #269)', grade: 'PSA 10', value: 145 },
    ],
    shareId: 'sinnoh-champion',
    portfolioUrl: '/decks/gardevoir-ex',
  },
];

const TOP_TRENDING_DECKS: any[] = [
  {
    id: 'gardevoir-ex',
    name: 'Gardevoir ex Control',
    tier: 'Tier 1 Meta',
    format: 'Standard (H, I, J Marks)',
    topFinish: '1st Place — Regional Championships 2026',
    avgCost: 85.50,
    ptcglExport: `Pokémon: 18\n3 Ralts SVI 84\n1 Ralts ASR 60\n3 Kirlia SIT 68\n2 Gardevoir ex SVI 86\n1 Scream Tail PAR 86\n1 Drifloon SVI 89\n1 Flutter Mane TEF 78\n1 Munkidori TWM 95\n1 Fezandipiti ex SFA 38\n1 Radiant Greninja ASR 46\n1 Cleffa OBF 80\n2 Klefki SVI 96\n\nTrainer: 31\n4 Iono PAL 185\n4 Professor's Research SVI 189\n2 Boss's Orders PAL 172\n2 Arven SVI 166\n4 Ultra Ball SVI 196\n4 Buddy-Buddy Poffin TEF 144\n2 Super Rod PAL 188\n2 Earthen Vessel PAR 163\n2 Counter Catcher PAR 160\n1 Unfair Stamp TWM 165\n2 Bravery Charm PAL 173\n2 Artazon PAL 171\n\nEnergy: 11\n9 Basic Psychic Energy SVE 5\n2 Darkness Energy SVE 7`,
  },
  {
    id: 'charizard-ex',
    name: 'Charizard ex / Pidgeot ex',
    tier: 'Tier 1 Meta',
    format: 'Standard (H, I, J Marks)',
    topFinish: 'Top 4 — International Championships 2026',
    avgCost: 110.00,
    ptcglExport: `Pokémon: 17\n3 Charmander MEW 4\n1 Charmander OBF 26\n1 Charmeleon MEW 5\n2 Charizard ex OBF 125\n2 Pidgey MEW 16\n2 Pidgeot ex OBF 164\n1 Duskull SFA 18\n1 Dusclops SFA 19\n1 Dusknoir SFA 20\n1 Rotom V LOR 58\n1 Lumineon V BRS 40\n1 Fezandipiti ex SFA 38\n\nTrainer: 37\n4 Arven SVI 166\n3 Iono PAL 185\n2 Boss's Orders PAL 172\n1 Professor's Research SVI 189\n1 Briar SCR 132\n4 Ultra Ball SVI 196\n4 Buddy-Buddy Poffin TEF 144\n4 Rare Candy SVI 191\n2 Super Rod PAL 188\n2 Nest Ball SVI 181\n1 Counter Catcher PAR 160\n1 Prime Catcher TEF 157\n1 Forest Seal Stone SIT 156\n1 Maximum Belt TEF 154\n2 Collapsed Stadium BRS 137\n\nEnergy: 6\n6 Basic Fire Energy SVE 2`,
  },
  {
    id: 'regidrago-vstar',
    name: 'Regidrago VSTAR / Ogerpon',
    tier: 'Tier 1.5 Meta',
    format: 'Standard (H, I, J Marks)',
    topFinish: '2nd Place — Special Event 2026',
    avgCost: 145.00,
    ptcglExport: `Pokémon: 18\n3 Regidrago V SIT 135\n3 Regidrago VSTAR SIT 136\n4 Teal Mask Ogerpon ex TWM 25\n1 Dragapult ex TWM 130\n1 Giratina VSTAR LOR 131\n1 Kyurem SFA 47\n1 Hawlucha SVI 118\n1 Radiant Charizard PGO 11\n1 Fezandipiti ex SFA 38\n1 Mew ex MEW 151\n1 Squawkabilly ex PAL 169\n\nTrainer: 31\n4 Professor's Research SVI 189\n3 Iono PAL 185\n2 Boss's Orders PAL 172\n4 Ultra Ball SVI 196\n4 Nest Ball SVI 181\n3 Earthen Vessel PAR 163\n2 Energy Switch SVI 173\n2 Super Rod PAL 188\n1 Prime Catcher TEF 157\n1 Night Stretcher SFA 61\n3 PokéStop PGO 68\n2 Energy Retrieval SVI 171\n\nEnergy: 11\n7 Basic Grass Energy SVE 1\n4 Basic Fire Energy SVE 2`,
  },
];

const MOST_TRACKED_GRAILS: any[] = [
  {
    rank: 1,
    name: 'Charizard (1st Edition Holo #4)',
    set: 'Base Set (1999)',
    rawPrice: 3200,
    psa10Price: 245000,
    totalTracked: 1420,
  },
  {
    rank: 2,
    name: 'Lugia V (Alternate Art #186)',
    set: 'Silver Tempest',
    rawPrice: 195,
    psa10Price: 380,
    totalTracked: 2840,
  },
  {
    rank: 3,
    name: 'Giratina V (Alternate Art #186)',
    set: 'Lost Origin',
    rawPrice: 320,
    psa10Price: 650,
    totalTracked: 2190,
  },
  {
    rank: 4,
    name: 'Gengar VMAX (Alternate Art #271)',
    set: 'Fusion Strike',
    rawPrice: 280,
    psa10Price: 560,
    totalTracked: 1950,
  },
  {
    rank: 5,
    name: 'Moonbreon / Umbreon VMAX (Alt Art #215)',
    set: 'Evolving Skies',
    rawPrice: 720,
    psa10Price: 1350,
    totalTracked: 3410,
  },
];

export const CommunityLeaderboardView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'portfolios' | 'decks' | 'grails' | 'badge'>('portfolios');
  const [copiedDeckId, setCopiedDeckId] = useState<string | null>(null);
  const [collectorIdInput, setCollectorIdInput] = useState('your-username');
  const [badgeCopiedFormat, setBadgeCopiedFormat] = useState<string | null>(null);

  const handleCopyDeck = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDeckId(id);
    setTimeout(() => setCopiedDeckId(null), 2000);
  };

  const badgeMarkdown = `[![Tracked with DECK / divider](https://deckdivider.app/api/badge/collector/${collectorIdInput || 'demo'}.svg)](https://deckdivider.app/portfolio/${collectorIdInput || 'demo'}?utm_source=embed_badge&utm_medium=markdown_embed)`;
  const badgeHtml = `<a href="https://deckdivider.app/portfolio/${collectorIdInput || 'demo'}?utm_source=embed_badge&utm_medium=html_embed" target="_blank" rel="noopener" title="Verified Pokémon TCG Collection on DECK / divider"><img src="https://deckdivider.app/api/badge/collector/${collectorIdInput || 'demo'}.svg" alt="Tracked on DECK / divider" width="340" height="74" loading="lazy" decoding="async" /></a>`;
  const badgeBBCode = `[url=https://deckdivider.app/portfolio/${collectorIdInput || 'demo'}?utm_source=embed_badge&utm_medium=forum_bbcode][img]https://deckdivider.app/api/badge/collector/${collectorIdInput || 'demo'}.svg[/img][/url]`;

  const copyBadgeText = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setBadgeCopiedFormat(format);
    setTimeout(() => setBadgeCopiedFormat(null), 2000);
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title="Pokémon TCG Community Leaderboard — Top Portfolios & Tournament Decks"
        description="Live leaderboards for verified high-value Pokémon card collections, trending 60-card tournament decklists, and rare holy grails. Join thousands of verified collectors."
        canonicalPath="/leaderboard"
        keywords={[
          'pokemon card leaderboard',
          'top pokemon card collections',
          'pokemon card portfolio showcase',
          'trending pokemon tournament decks',
          'most expensive pokemon card portfolios',
          'pokemon tcg community'
        ]}
        schema={getCommunityLeaderboardSchema()}
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
          <GeoBreadcrumbs items={[{ label: 'Community Leaderboards', path: '/leaderboard' }]} />

          {/* Header Banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DC143C]/10 border border-[#DC143C]/20 text-[#DC143C] text-xs font-semibold uppercase tracking-wider mb-4">
              <Trophy className="w-3.5 h-3.5" />
              Community Destination &amp; Hall of Fame
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
              Pokémon TCG Collector Leaderboard
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-3xl mx-auto">
              Explore verified high-net-worth collections, tournament-winning 60-card decklists, and the most actively tracked holy grails on DECK / divider.
            </p>
          </div>

          {/* PTC Collectibles Partner Offer */}
          <div className="mb-8">
            <PtcPartnerBanner />
          </div>

          <GeoExtractableBlock
            className="mb-8"
            heading="Public Collection Verification & Community Leaderboards"
            summary="The DECK / divider Hall of Fame highlights verified public showcases and tournament decks tracked by the global community. Valuations are synchronized in real time against TCGplayer market low and authenticated auction records, with verifiable embeddable markdown badges."
            keyFacts={[
              { label: 'Active Vaults', value: '24,500+ Decks' },
              { label: 'Graded Inventory', value: '148,000+ Slabs' },
              { label: 'Tracked Assets', value: '$4.8M+ Market Cap' },
              { label: 'Verification', value: 'Cryptographic Share Links' },
            ]}
          />

            {/* Live Metrics Ticker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto text-left">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-[#64748B] font-mono">TRACKED VALUE</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1 font-mono">$4,820,000+</div>
                <div className="text-xs text-[#16A34A] flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> Live Market Feed
                </div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-[#64748B] font-mono">GRADED SLABS</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1 font-mono">148,000+</div>
                <div className="text-xs text-[#DC143C] mt-1 font-medium font-mono">PSA, BGS &amp; CGC</div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-[#64748B] font-mono">ACTIVE DECKS</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1 font-mono">24,500+</div>
                <div className="text-xs text-amber-600 mt-1 font-medium font-mono">PTCGL Compliant</div>
              </div>
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-xs">
                <div className="text-xs text-[#64748B] font-mono">DATA LATENCY</div>
                <div className="text-xl sm:text-2xl font-bold text-[#0F172A] mt-1 font-mono">&lt; 15 Mins</div>
                <div className="text-xs text-[#2563EB] mt-1 font-medium font-mono">Hourly Sync Cycle</div>
              </div>
            </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <div className="bg-white p-1.5 rounded-2xl border border-[#E2E8F0] inline-flex gap-1 shadow-xs">
              <button
                onClick={() => setActiveTab('portfolios')}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'portfolios'
                    ? 'bg-[#DC143C] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Top Portfolios
              </button>
              <button
                onClick={() => setActiveTab('decks')}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'decks'
                    ? 'bg-[#DC143C] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-500" />
                Tournament Decks
              </button>
              <button
                onClick={() => setActiveTab('grails')}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'grails'
                    ? 'bg-[#DC143C] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Tracked Grails
              </button>
              <button
                onClick={() => setActiveTab('badge')}
                className={`px-5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'badge'
                    ? 'bg-[#DC143C] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-600" />
                Verified Badge
              </button>
            </div>
          </div>

          {/* TAB 1: Top Portfolios */}
          {activeTab === 'portfolios' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-[#0F172A] font-heading flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      Global High-Net-Worth Portfolios
                    </h2>
                    <p className="text-sm text-[#64748B] mt-1">
                      Ranked by verified catalog valuation with real-time TCGplayer market prices.
                    </p>
                  </div>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold rounded-xl transition-colors shadow-2xs self-start sm:self-auto"
                  >
                    Submit Your Portfolio
                  </Link>
                </div>

                {TOP_COLLECTORS.length === 0 ? (
                  <div className="text-center py-12 text-[#64748B] font-mono text-sm">
                    No public portfolios available. Submit your portfolio to be featured!
                  </div>
                ) : (
                <div className="divide-y divide-[#E2E8F0]">
                  {TOP_COLLECTORS.map((collector) => (
                    <div key={collector.rank} className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#F8FAFC] rounded-2xl px-4 transition-colors">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 font-mono ${
                          collector.rank === 1 ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          collector.rank === 2 ? 'bg-slate-100 text-slate-700 border border-slate-300' :
                          collector.rank === 3 ? 'bg-amber-50 text-amber-900 border border-amber-200' :
                          'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                        }`}>
                          #{collector.rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-lg text-[#0F172A] font-heading">{collector.collectionName}</h3>
                            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-[#DC143C]/10 text-[#DC143C] border border-[#DC143C]/20 font-medium font-mono">
                              <ShieldCheck className="w-3 h-3 text-[#16A34A]" /> {collector.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#0F172A] mt-1 font-mono">
                            <span className="font-semibold">{collector.ownerName}</span>
                            <span className="text-[#64748B]">({collector.handle})</span>
                            <span className="text-[#94A3B8]">•</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {collector.completionPercentage}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1.5 font-mono">
                            <span>{collector.totalCards.toLocaleString()} Cards</span>
                            <span>•</span>
                            <span>{collector.slabCount} Graded Slabs</span>
                            <span>•</span>
                            <span className="text-slate-500 font-sans" title={collector.verificationHash}>
                              Audit: {collector.verificationDate} ({collector.verificationHash.slice(0, 15)}...)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Featured Cards */}
                      <div className="flex-1 max-w-xl">
                        <div className="text-xs text-[#64748B] font-mono mb-2 uppercase tracking-wider font-semibold">Grail Highlights</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {collector.featuredCards.map((card, idx) => (
                            <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-2.5 text-xs">
                              <div className="text-[#0F172A] font-medium truncate" title={card.name}>{card.name}</div>
                              <div className="flex items-center justify-between text-[#64748B] mt-1">
                                <span className="text-[#DC143C] font-mono font-bold">{card.grade}</span>
                                <span className="text-[#16A34A] font-semibold font-mono">${card.value.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total Value & Link */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0]">
                        <div className="text-left lg:text-right">
                          <div className="text-xs text-[#64748B] font-mono uppercase font-semibold">Portfolio Value</div>
                          <div className="text-2xl font-black text-[#16A34A] font-mono">
                            ${collector.totalValue.toLocaleString()}
                          </div>
                        </div>
                        <Link
                          to={collector.portfolioUrl}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#DC143C] text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-[#CBD5E1] shadow-2xs"
                        >
                          View Vault <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Trending Tournament Decks */}
          {activeTab === 'decks' && (
            TOP_TRENDING_DECKS.length === 0 ? (
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center text-[#64748B] font-mono text-sm shadow-xs">
                No trending tournament decks available at this time. Check back later!
              </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {TOP_TRENDING_DECKS.map((deck) => (
                <div key={deck.id} className="bg-white border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] border border-[#86EFAC] font-semibold">
                        {deck.tier}
                      </span>
                      <span className="text-xs text-[#64748B] font-mono">{deck.format}</span>
                    </div>

                    <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-2">{deck.name}</h3>
                    <p className="text-xs text-[#64748B] mb-4 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" /> {deck.topFinish}
                    </p>

                    <div className="bg-[#F8FAFC] rounded-xl p-3.5 border border-[#E2E8F0] mb-6">
                      <div className="text-xs text-[#64748B] font-mono font-semibold">ESTIMATED SINGLES COST</div>
                      <div className="text-2xl font-black text-[#16A34A] font-mono mt-0.5">
                        ${deck.avgCost.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-1">Based on TCGplayer Market Lowest Verified</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
                    <button
                      onClick={() => handleCopyDeck(deck.id, deck.ptcglExport)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#F8FAFC] hover:bg-white text-[#0F172A] text-xs font-mono font-bold transition-colors flex items-center justify-center gap-2 border border-[#CBD5E1] shadow-2xs"
                    >
                      {copiedDeckId === deck.id ? (
                        <>
                          <Check className="w-4 h-4 text-[#16A34A]" /> Copied PTCGL List!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#DC143C]" /> Copy PTCGL Export Code
                        </>
                      )}
                    </button>
                    <Link
                      to={`/decks/${deck.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#DC143C]/10 hover:bg-[#DC143C]/20 text-[#DC143C] text-xs font-mono font-bold transition-colors flex items-center justify-center gap-1 border border-[#DC143C]/30"
                    >
                      View Deck Guide &amp; Tech Cards <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            )
          )}

          {/* TAB 3: Most Tracked Grails */}
          {activeTab === 'grails' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-[#0F172A] font-heading flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Most Tracked Holy Grails &amp; Slabs
                </h2>
                <p className="text-sm text-[#64748B] mt-1">
                  The highest-volume grail singles and graded cards held across verified DECK / divider vaults.
                </p>
              </div>

              {MOST_TRACKED_GRAILS.length === 0 ? (
                <div className="text-center py-12 text-[#64748B] font-mono text-sm">
                  No grails tracked yet.
                </div>
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] text-xs font-mono text-[#64748B] uppercase bg-[#F8FAFC]">
                      <th className="py-3 px-4 rounded-l-lg">Rank</th>
                      <th className="py-3 px-4">Card Name</th>
                      <th className="py-3 px-4">Expansion</th>
                      <th className="py-3 px-4 text-right">Raw Market</th>
                      <th className="py-3 px-4 text-right">PSA 10 Value</th>
                      <th className="py-3 px-4 text-right rounded-r-lg">Vaults Holding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {MOST_TRACKED_GRAILS.map((item) => (
                      <tr key={item.rank} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-amber-600">#{item.rank}</td>
                        <td className="py-4 px-4 font-semibold text-[#0F172A]">{item.name}</td>
                        <td className="py-4 px-4 text-[#64748B]">{item.set}</td>
                        <td className="py-4 px-4 text-right font-mono text-[#0F172A]">${item.rawPrice.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-[#16A34A]">${item.psa10Price.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-mono text-[#DC143C] font-semibold">{item.totalTracked.toLocaleString()} vaults</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          )}

          {/* TAB 4: Verified Badge Generator */}
          {activeTab === 'badge' && (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto shadow-xs">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <Award className="w-12 h-12 text-[#DC143C] mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-[#0F172A] font-heading">Embed Your "Verified Collector" Badge</h2>
                <p className="text-sm text-[#64748B] mt-2">
                  Display your verified collection credentials and live deck portfolio on Reddit, GitHub, Discord, PokéBeach, or your personal blog.
                </p>
              </div>

              {/* Badge Preview */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 mb-8 text-center">
                <div className="text-xs text-[#64748B] font-mono mb-4 uppercase tracking-wider font-semibold">Live Badge Preview</div>
                <div className="inline-block p-4 bg-white border border-[#CBD5E1] rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#E2E8F0]">
                    <ShieldCheck className="w-5 h-5 text-[#DC143C]" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono tracking-wider text-[#64748B] uppercase font-bold">VERIFIED ON</div>
                      <div className="text-xs font-black text-[#0F172A] tracking-wide">DECK / divider</div>
                    </div>
                    <div className="w-px h-6 bg-[#CBD5E1] mx-1" />
                    <div className="text-xs font-mono font-bold text-[#16A34A]">
                      @{collectorIdInput || 'username'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input for custom username */}
              <div className="mb-6 max-w-md mx-auto">
                <label className="block text-xs font-mono font-semibold text-[#64748B] mb-2 uppercase">
                  Your DECK / divider Username or Profile ID
                </label>
                <input
                  type="text"
                  value={collectorIdInput}
                  onChange={(e) => setCollectorIdInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="e.g. kanto-master"
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-2.5 text-[#0F172A] font-mono text-sm focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                />
              </div>

              {/* Snippet Code Boxes */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#64748B] font-mono mb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Markdown (Reddit, GitHub, Discord)</span>
                    <button
                      onClick={() => copyBadgeText(badgeMarkdown, 'md')}
                      className="text-[#DC143C] hover:underline flex items-center gap-1 font-bold"
                    >
                      {badgeCopiedFormat === 'md' ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                      {badgeCopiedFormat === 'md' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-[#F8FAFC] p-3 rounded-xl text-xs font-mono text-[#0F172A] overflow-x-auto border border-[#E2E8F0]">
                    {badgeMarkdown}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#64748B] font-mono mb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> HTML (Forums, Blogs, Websites)</span>
                    <button
                      onClick={() => copyBadgeText(badgeHtml, 'html')}
                      className="text-[#DC143C] hover:underline flex items-center gap-1 font-bold"
                    >
                      {badgeCopiedFormat === 'html' ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                      {badgeCopiedFormat === 'html' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-[#F8FAFC] p-3 rounded-xl text-xs font-mono text-[#0F172A] overflow-x-auto border border-[#E2E8F0]">
                    {badgeHtml}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#64748B] font-mono mb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> BBCode (PokéBeach, PokéGym, TCG Forums)</span>
                    <button
                      onClick={() => copyBadgeText(badgeBBCode, 'bbcode')}
                      className="text-[#DC143C] hover:underline flex items-center gap-1 font-bold"
                    >
                      {badgeCopiedFormat === 'bbcode' ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                      {badgeCopiedFormat === 'bbcode' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-[#F8FAFC] p-3 rounded-xl text-xs font-mono text-[#0F172A] overflow-x-auto border border-[#E2E8F0]">
                    {badgeBBCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* AI Overview & Featured Snippet FAQ Section */}
          <section className="mt-20 border-t border-[#E2E8F0] pt-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-[#0F172A] font-heading mb-2 text-center">
                Frequently Asked Questions: Portfolios &amp; Leaderboards
              </h2>
              <p className="text-sm text-[#64748B] text-center mb-8">
                Direct answers to common questions about Pokémon card valuation, verification, and tournament tracking.
              </p>

              <div className="space-y-6">
                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
                  <h3 className="font-bold text-[#0F172A] font-heading text-base mb-2">
                    How are Pokémon card portfolios ranked on DECK / divider?
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Portfolios are ranked strictly by <strong className="text-[#0F172A]">verified market valuation</strong> calculated using real-time lowest verified TCGplayer pricing for raw cards and recent historical auction records for graded PSA, BGS, and CGC slabs. User accounts must have verified email credentials and public profile sharing enabled.
                  </p>
                </div>

                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
                  <h3 className="font-bold text-[#0F172A] font-heading text-base mb-2">
                    How do I get my Pokémon collection verified on the leaderboard?
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    To qualify for the DECK / divider Hall of Fame, create a free account, import or catalog your collection with condition and grading certificates, and toggle <strong className="text-[#0F172A]">Public Profile</strong> in your Vault settings. The verification engine automatically audits card counts and valuation accuracy.
                  </p>
                </div>

                <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
                  <h3 className="font-bold text-[#0F172A] font-heading text-base mb-2">
                    Can I export tournament decks directly to Pokémon TCG Live (PTCGL)?
                  </h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">
                    Yes. Every tournament deck on DECK / divider includes standard PTCGL-compliant formatting with expansion set codes and collector numbers. Click "Copy PTCGL Export Code" and paste directly into the PTCGL deck builder without manual card searching.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <PublicInterlinkMesh currentPath="/leaderboard" />

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
