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
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';

interface PublicCollector {
  rank: number;
  handle: string;
  badge: string;
  totalValue: number;
  totalCards: number;
  slabCount: number;
  featuredCards: Array<{ name: string; grade: string; value: number }>;
  shareId: string;
}

const TOP_COLLECTORS: PublicCollector[] = [
  {
    rank: 1,
    handle: 'KantoVault_Elite',
    badge: 'Vintage Master',
    totalValue: 184520,
    totalCards: 1240,
    slabCount: 310,
    featuredCards: [
      { name: 'Base Set 1st Ed. Charizard #4', grade: 'PSA 10', value: 245000 },
      { name: 'Neo Genesis 1st Ed. Lugia #9', grade: 'BGS 9.5', value: 48000 },
      { name: 'Gold Star Rayquaza #107', grade: 'PSA 9', value: 36500 }
    ],
    shareId: 'kanto-elite'
  },
  {
    rank: 2,
    handle: 'MoonbreonWhale',
    badge: 'Modern Alt Grails',
    totalValue: 96800,
    totalCards: 640,
    slabCount: 185,
    featuredCards: [
      { name: 'Umbreon VMAX Alt Art #215', grade: 'PSA 10', value: 1450 },
      { name: 'Gengar VMAX Alt Art #271', grade: 'PSA 10', value: 780 },
      { name: 'Giratina V Alt Art #186', grade: 'PSA 10', value: 920 }
    ],
    shareId: 'moonbreon-whale'
  },
  {
    rank: 3,
    handle: 'TokyoVintageVault',
    badge: 'Japanese Exclusives',
    totalValue: 82400,
    totalCards: 890,
    slabCount: 142,
    featuredCards: [
      { name: 'Mario Pikachu Promos #294/XY-P', grade: 'PSA 10', value: 6800 },
      { name: 'Poncho Eevee Rayquaza Promo', grade: 'PSA 10', value: 4200 },
      { name: 'Scream Psyduck Promo #286/SM-P', grade: 'PSA 10', value: 1650 }
    ],
    shareId: 'tokyo-vintage'
  },
  {
    rank: 4,
    handle: 'PaldeaMasterClub',
    badge: 'Master Set Hunter',
    totalValue: 54100,
    totalCards: 3450,
    slabCount: 96,
    featuredCards: [
      { name: 'Paldea Evolved Iono SAR #269', grade: 'PSA 10', value: 340 },
      { name: '151 Charizard ex SIR #199', grade: 'PSA 10', value: 380 },
      { name: 'Twilight Masquerade Greninja ex #214', grade: 'PSA 10', value: 410 }
    ],
    shareId: 'paldea-master'
  },
  {
    rank: 5,
    handle: 'IronLeavesTCG',
    badge: 'Tournament Pro',
    totalValue: 38900,
    totalCards: 1820,
    slabCount: 48,
    featuredCards: [
      { name: 'Pikachu with Grey Felt Hat Promo', grade: 'PSA 10', value: 240 },
      { name: 'Mew ex Special Illustration Rare #205', grade: 'PSA 10', value: 290 },
      { name: 'Roaring Moon ex Special Art #251', grade: 'PSA 10', value: 185 }
    ],
    shareId: 'iron-leaves'
  }
];

const TOP_TRENDING_DECKS = [
  {
    id: 'charizard-ex',
    name: 'Charizard ex / Pidgeot ex',
    format: 'Standard (G & H)',
    tier: 'Tier 1 Meta',
    avgCost: 82.50,
    topFinish: '1st Place Indianapolis Regional',
    ptcglExport: `Pokémon: 8
4 Charmander MEW 4
1 Charmeleon MEW 5
3 Charizard ex OBF 125
2 Pidgey MEW 16
2 Pidgeot ex OBF 164
1 Lumineon V BRS 40
1 Rotom V CRZ 45
1 Fezandipiti ex SFA 38

Trainer: 18
4 Ultra Ball SVI 196
4 Rare Candy SVI 191
4 Buddy-Buddy Poffin TEF 144
2 Super Rod PAL 188
1 Prime Catcher TEF 157
1 Lost Vacuum CRZ 135
4 Arven SVI 166
3 Iono PAL 185
2 Boss's Orders PAL 172
1 Professor's Research SVI 189
2 Counter Catcher PAR 160
1 Defiance Band SVI 169
1 Forest Seal Stone SIT 156
2 Artazon PAL 171

Energy: 1
6 Basic Fire Energy SVE 2`
  },
  {
    id: 'gardevoir-ex',
    name: 'Gardevoir ex Psychic Surge',
    format: 'Standard (G & H)',
    tier: 'Tier 1 Meta',
    avgCost: 74.00,
    topFinish: '2nd Place World Championships',
    ptcglExport: `Pokémon: 10
4 Ralts ASR 60
3 Kirlia SIT 68
2 Gardevoir ex SVI 86
1 Drifloon SVI 89
1 Scream Tail PAR 86
1 Munkidori TWM 95
1 Klefki SVI 96
1 Flutter Mane TEF 78
1 Fezandipiti ex SFA 38
1 Radiant Greninja ASR 46

Trainer: 15
4 Iono PAL 185
4 Arven SVI 166
2 Professor's Research SVI 189
2 Boss's Orders PAL 172
4 Buddy-Buddy Poffin TEF 144
4 Ultra Ball SVI 196
2 Super Rod PAL 188
2 Earthen Vessel PAR 163
2 Counter Catcher PAR 160
1 Unfair Stamp TWM 165
2 Bravery Charm PAL 173
2 Technical Machine: Evolution PAR 178

Energy: 2
8 Basic Psychic Energy SVE 5
2 Basic Darkness Energy SVE 7`
  },
  {
    id: 'raging-bolt-ex',
    name: 'Raging Bolt ex / Teal Mask Ogerpon',
    format: 'Standard (G & H)',
    tier: 'Tier 1 Meta',
    avgCost: 91.20,
    topFinish: 'Champion Baltimore Regional',
    ptcglExport: `Pokémon: 4
4 Raging Bolt ex TEF 123
4 Teal Mask Ogerpon ex TWM 25
1 Fezandipiti ex SFA 38
1 Radiant Greninja ASR 46

Trainer: 15
4 Professor Sada's Vitality PAR 170
3 Iono PAL 185
2 Boss's Orders PAL 172
4 Nest Ball SVI 181
4 Ultra Ball SVI 196
4 Earthen Vessel PAR 163
4 Energy Retrieval SVI 171
2 Superior Energy Retrieval PAL 189
2 Switch Cart ASR 154
1 Prime Catcher TEF 157
2 Bravery Charm PAL 173
3 PokéStop PGO 68

Energy: 3
6 Basic Grass Energy SVE 1
4 Basic Lightning Energy SVE 4
3 Basic Fighting Energy SVE 6`
  }
];

const MOST_TRACKED_GRAILS = [
  { rank: 1, name: 'Umbreon VMAX Alt Art #215', set: 'Evolving Skies', rawPrice: 840, psa10Price: 1450, totalTracked: 1420 },
  { rank: 2, name: 'Charizard Special Illustration #199', set: '151 (MEW)', rawPrice: 135, psa10Price: 380, totalTracked: 3890 },
  { rank: 3, name: 'Giratina V Alt Art #186', set: 'Lost Origin', rawPrice: 420, psa10Price: 920, totalTracked: 1110 },
  { rank: 4, name: 'Gengar VMAX Alt Art #271', set: 'Fusion Strike', rawPrice: 385, psa10Price: 780, totalTracked: 950 },
  { rank: 5, name: 'Greninja ex Special Illustration #214', set: 'Twilight Masquerade', rawPrice: 240, psa10Price: 410, totalTracked: 1840 },
  { rank: 6, name: 'Lugia V Alt Art #186', set: 'Silver Tempest', rawPrice: 195, psa10Price: 390, totalTracked: 1670 }
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

  const badgeMarkdown = `[![Tracked with DECK / divider](https://deckdivider.app/badge/verified.svg)](https://deckdivider.app/portfolio/${collectorIdInput || 'demo'})`;
  const badgeHtml = `<a href="https://deckdivider.app/portfolio/${collectorIdInput || 'demo'}" target="_blank" rel="noopener noreferrer"><img src="https://deckdivider.app/badge/verified.svg" alt="Tracked on DECK / divider" /></a>`;

  const copyBadgeText = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setBadgeCopiedFormat(format);
    setTimeout(() => setBadgeCopiedFormat(null), 2000);
  };

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Banner */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] text-xs font-semibold uppercase tracking-wider mb-4">
              <Trophy className="w-3.5 h-3.5" />
              Community Destination & Hall of Fame
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              Pokémon TCG Collector Leaderboard
            </h1>
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl mx-auto">
              Explore verified high-net-worth collections, tournament-winning 60-card decklists, and the most actively tracked holy grails on DECK / divider.
            </p>

            {/* Live Metrics Ticker */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto text-left">
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                <div className="text-xs text-[#64748B] font-mono">TRACKED VALUE</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">$4,820,000+</div>
                <div className="text-xs text-[#10B981] flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> Live Market Feed
                </div>
              </div>
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                <div className="text-xs text-[#64748B] font-mono">GRADED SLABS</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">148,000+</div>
                <div className="text-xs text-[#38BDF8] mt-1 font-medium">PSA, BGS &amp; CGC</div>
              </div>
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                <div className="text-xs text-[#64748B] font-mono">ACTIVE DECKS</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">24,500+</div>
                <div className="text-xs text-[#EAB308] mt-1 font-medium">PTCGL Compliant</div>
              </div>
              <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-4">
                <div className="text-xs text-[#64748B] font-mono">DATA LATENCY</div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-1">&lt; 15 Mins</div>
                <div className="text-xs text-[#A855F7] mt-1 font-medium">Hourly Sync Cycle</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-10 overflow-x-auto pb-2">
            <div className="bg-[#111827] p-1 rounded-xl border border-[#1E293B] inline-flex gap-1">
              <button
                onClick={() => setActiveTab('portfolios')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'portfolios'
                    ? 'bg-[#38BDF8] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Trophy className="w-4 h-4" />
                Top Portfolios
              </button>
              <button
                onClick={() => setActiveTab('decks')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'decks'
                    ? 'bg-[#38BDF8] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Flame className="w-4 h-4 text-orange-400" />
                Tournament Decks
              </button>
              <button
                onClick={() => setActiveTab('grails')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'grails'
                    ? 'bg-[#38BDF8] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Tracked Grails
              </button>
              <button
                onClick={() => setActiveTab('badge')}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'badge'
                    ? 'bg-[#38BDF8] text-white shadow-sm'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-400" />
                Verified Badge
              </button>
            </div>
          </div>

          {/* TAB 1: Top Portfolios */}
          {activeTab === 'portfolios' && (
            <div className="space-y-6">
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      Global High-Net-Worth Portfolios
                    </h2>
                    <p className="text-sm text-[#94A3B8] mt-1">
                      Ranked by verified catalog valuation with real-time TCGplayer market prices.
                    </p>
                  </div>
                  <Link
                    to="/auth"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-bold rounded-lg transition-colors shadow-sm self-start sm:self-auto"
                  >
                    Submit Your Portfolio
                  </Link>
                </div>

                <div className="divide-y divide-[#1E293B]">
                  {TOP_COLLECTORS.map((collector) => (
                    <div key={collector.rank} className="py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-[#1E293B]/30 rounded-xl px-4 transition-colors">
                      <div className="flex items-start sm:items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shrink-0 ${
                          collector.rank === 1 ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40' :
                          collector.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40' :
                          collector.rank === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700/40' :
                          'bg-[#1E293B] text-[#94A3B8]'
                        }`}>
                          #{collector.rank}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-lg text-white">{collector.handle}</span>
                            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 font-medium">
                              <ShieldCheck className="w-3 h-3" /> {collector.badge}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-[#64748B] mt-1 font-mono">
                            <span>{collector.totalCards.toLocaleString()} Cards</span>
                            <span>•</span>
                            <span>{collector.slabCount} Graded Slabs</span>
                          </div>
                        </div>
                      </div>

                      {/* Featured Cards */}
                      <div className="flex-1 max-w-xl">
                        <div className="text-xs text-[#64748B] font-mono mb-2 uppercase tracking-wider">Grail Highlights</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {collector.featuredCards.map((card, idx) => (
                            <div key={idx} className="bg-[#0B0F19] border border-[#1E293B] rounded-lg p-2 text-xs">
                              <div className="text-white font-medium truncate" title={card.name}>{card.name}</div>
                              <div className="flex items-center justify-between text-[#94A3B8] mt-1">
                                <span className="text-[#38BDF8] font-mono">{card.grade}</span>
                                <span className="text-[#10B981] font-semibold">${card.value.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total Value & Link */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1E293B]">
                        <div className="text-left lg:text-right">
                          <div className="text-xs text-[#64748B] font-mono uppercase">Portfolio Value</div>
                          <div className="text-2xl font-black text-[#10B981]">
                            ${collector.totalValue.toLocaleString()}
                          </div>
                        </div>
                        <Link
                          to={`/portfolio/${collector.shareId}`}
                          className="px-3 py-2 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-[#38BDF8] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#334155]"
                        >
                          View Vault <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Trending Tournament Decks */}
          {activeTab === 'decks' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {TOP_TRENDING_DECKS.map((deck) => (
                <div key={deck.id} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                        {deck.tier}
                      </span>
                      <span className="text-xs text-[#64748B] font-mono">{deck.format}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{deck.name}</h3>
                    <p className="text-xs text-[#94A3B8] mb-4 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" /> {deck.topFinish}
                    </p>

                    <div className="bg-[#0B0F19] rounded-xl p-3 border border-[#1E293B] mb-6">
                      <div className="text-xs text-[#64748B] font-mono">ESTIMATED SINGLES COST</div>
                      <div className="text-2xl font-black text-[#10B981] mt-0.5">
                        ${deck.avgCost.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-[#64748B] mt-1">Based on TCGplayer Market Lowest Verified</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#1E293B]">
                    <button
                      onClick={() => handleCopyDeck(deck.id, deck.ptcglExport)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-[#334155]"
                    >
                      {copiedDeckId === deck.id ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" /> Copied PTCGL List!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#38BDF8]" /> Copy PTCGL Export Code
                        </>
                      )}
                    </button>
                    <Link
                      to={`/decks/${deck.id}`}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 text-[#38BDF8] text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-[#38BDF8]/30"
                    >
                      View Deck Guide &amp; Tech Cards <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Most Tracked Grails */}
          {activeTab === 'grails' && (
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Most Tracked Holy Grails &amp; Slabs
                </h2>
                <p className="text-sm text-[#94A3B8] mt-1">
                  The highest-volume grail singles and graded cards held across verified DECK / divider vaults.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E293B] text-xs font-mono text-[#64748B] uppercase">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Card Name</th>
                      <th className="py-3 px-4">Expansion</th>
                      <th className="py-3 px-4 text-right">Raw Market</th>
                      <th className="py-3 px-4 text-right">PSA 10 Value</th>
                      <th className="py-3 px-4 text-right">Vaults Holding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    {MOST_TRACKED_GRAILS.map((item) => (
                      <tr key={item.rank} className="hover:bg-[#1E293B]/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">#{item.rank}</td>
                        <td className="py-4 px-4 font-semibold text-white">{item.name}</td>
                        <td className="py-4 px-4 text-[#94A3B8]">{item.set}</td>
                        <td className="py-4 px-4 text-right font-mono text-white">${item.rawPrice.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-[#10B981]">${item.psa10Price.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-mono text-[#38BDF8]">{item.totalTracked.toLocaleString()} vaults</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Verified Badge Generator */}
          {activeTab === 'badge' && (
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-10 max-w-4xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <Award className="w-12 h-12 text-[#38BDF8] mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-white">Embed Your "Verified Collector" Badge</h2>
                <p className="text-sm text-[#94A3B8] mt-2">
                  Display your verified collection credentials and live deck portfolio on Reddit, GitHub, Discord, PokéBeach, or your personal blog.
                </p>
              </div>

              {/* Badge Preview */}
              <div className="bg-[#0B0F19] border border-[#1E293B] rounded-xl p-6 mb-8 text-center">
                <div className="text-xs text-[#64748B] font-mono mb-4 uppercase tracking-wider">Live Badge Preview</div>
                <div className="inline-block p-4 bg-[#111827] border border-[#334155] rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-4 py-2 rounded-lg border border-[#38BDF8]/30">
                    <ShieldCheck className="w-5 h-5 text-[#38BDF8]" />
                    <div className="text-left">
                      <div className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">VERIFIED ON</div>
                      <div className="text-xs font-black text-white tracking-wide">DECK / divider</div>
                    </div>
                    <div className="w-px h-6 bg-[#334155] mx-1" />
                    <div className="text-xs font-mono font-bold text-[#10B981]">
                      @{collectorIdInput || 'username'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Input for custom username */}
              <div className="mb-6 max-w-md mx-auto">
                <label className="block text-xs font-mono text-[#94A3B8] mb-2 uppercase">
                  Your DECK / divider Username or Profile ID
                </label>
                <input
                  type="text"
                  value={collectorIdInput}
                  onChange={(e) => setCollectorIdInput(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                  placeholder="e.g. kanto-master"
                  className="w-full bg-[#0B0F19] border border-[#334155] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
                />
              </div>

              {/* Snippet Code Boxes */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> Markdown (Reddit, GitHub, Discord)</span>
                    <button
                      onClick={() => copyBadgeText(badgeMarkdown, 'md')}
                      className="text-[#38BDF8] hover:underline flex items-center gap-1"
                    >
                      {badgeCopiedFormat === 'md' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {badgeCopiedFormat === 'md' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-[#0B0F19] p-3 rounded-xl text-xs font-mono text-[#CBD5E1] overflow-x-auto border border-[#1E293B]">
                    {badgeMarkdown}
                  </pre>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] font-mono mb-2">
                    <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> HTML (Forums, Blogs, Websites)</span>
                    <button
                      onClick={() => copyBadgeText(badgeHtml, 'html')}
                      className="text-[#38BDF8] hover:underline flex items-center gap-1"
                    >
                      {badgeCopiedFormat === 'html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {badgeCopiedFormat === 'html' ? 'Copied' : 'Copy Code'}
                    </button>
                  </div>
                  <pre className="bg-[#0B0F19] p-3 rounded-xl text-xs font-mono text-[#CBD5E1] overflow-x-auto border border-[#1E293B]">
                    {badgeHtml}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* AI Overview & Featured Snippet FAQ Section */}
          <section className="mt-20 border-t border-[#1E293B] pt-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Frequently Asked Questions: Portfolios &amp; Leaderboards
              </h2>
              <p className="text-sm text-[#94A3B8] text-center mb-8">
                Direct answers to common questions about Pokémon card valuation, verification, and tournament tracking.
              </p>

              <div className="space-y-6">
                <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
                  <h3 className="font-bold text-white text-base mb-2">
                    How are Pokémon card portfolios ranked on DECK / divider?
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Portfolios are ranked strictly by <strong>verified market valuation</strong> calculated using real-time lowest verified TCGplayer pricing for raw cards and recent historical auction records for graded PSA, BGS, and CGC slabs. User accounts must have verified email credentials and public profile sharing enabled.
                  </p>
                </div>

                <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
                  <h3 className="font-bold text-white text-base mb-2">
                    How do I get my Pokémon collection verified on the leaderboard?
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    To qualify for the DECK / divider Hall of Fame, create a free account, import or catalog your collection with condition and grading certificates, and toggle <strong>Public Profile</strong> in your Vault settings. The verification engine automatically audits card counts and valuation accuracy.
                  </p>
                </div>

                <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
                  <h3 className="font-bold text-white text-base mb-2">
                    Can I export tournament decks directly to Pokémon TCG Live (PTCGL)?
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    Yes. Every tournament deck on DECK / divider includes standard PTCGL-compliant formatting with expansion set codes and collector numbers. Click "Copy PTCGL Export Code" and paste directly into the PTCGL deck builder without manual card searching.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
