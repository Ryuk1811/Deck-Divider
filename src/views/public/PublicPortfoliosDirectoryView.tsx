import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';

export const PublicPortfoliosDirectoryView: React.FC = () => {
  const navigate = useNavigate();

  const samplePortfolios = [
    {
      id: 'kanto-vault-99',
      title: 'Kanto & Vintage Master Vault',
      collector: 'Alex T. (Verified Pro)',
      cardsCount: 420,
      slabsCount: 48,
      netWorth: 18450,
      highlight: 'Base Set Shadowless 1st Edition Charizard PSA 9 & PSA 10 Gengar',
    },
    {
      id: 'modern-sir-collection',
      title: 'Scarlet & Violet Special Illustration Vault',
      collector: 'Elena R.',
      cardsCount: 650,
      slabsCount: 22,
      netWorth: 9280,
      highlight: 'Complete 151 & Paldean Fates SIR master checklist completed',
    },
    {
      id: 'competitive-tourney-deck-vault',
      title: 'Championship Play! Roster Vault',
      collector: 'Marcus V.',
      cardsCount: 360,
      slabsCount: 15,
      netWorth: 6150,
      highlight: 'Standard Regulation H/I/J tournament decklists in max rarity',
    },
    {
      id: 'eeveelutions-alt-art-haven',
      title: 'Evolving Skies Eeveelution Sanctuary',
      collector: 'Chloe S.',
      cardsCount: 180,
      slabsCount: 35,
      netWorth: 24500,
      highlight: 'Umbreon VMAX Moonbreon BGS 9.5 & Rayquaza VMAX Alt Art PSA 10',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <PageHead
        title="Public Pokémon Card Collections & Slab Vaults | DECK / divider"
        description="Explore verified Pokémon card portfolios, graded slab vaults, and master sets shared by collectors worldwide with real-time TCGplayer market valuations."
        canonicalPath="/portfolios"
        ogImage="https://deckdivider.app/og-image.png?v=2"
      />

      <LandingNav onOpenAuth={() => navigate('/auth')} onEnterApp={() => navigate('/app')} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <GeoBreadcrumbs
          items={[
            { label: 'Portfolios', path: '/portfolios' },
          ]}
        />

        <div className="mt-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#DC143C] text-xs font-bold uppercase tracking-wider font-mono mb-3">
            Public Showcase Directory
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Trainer Collection Vaults &amp; Slabs
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            Discover verified Pokémon TCG collections, sealed booster box investments, and PSA/BGS graded slab portfolios tracked in real time.
          </p>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/auth')}
              className="py-2.5 px-5 bg-[#DC143C] hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-xs transition-colors"
            >
              Publish Your Public Portfolio
            </button>
            <Link
              to="/leaderboard"
              className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              View Community Leaderboard
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {samplePortfolios.map(vault => (
            <div key={vault.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-[#DC143C]/40 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-500 font-mono">{vault.collector}</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">NAV ${vault.netWorth.toLocaleString()}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{vault.title}</h3>
                <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900 block mb-0.5">Key Highlights:</strong> {vault.highlight}
                </p>

                <div className="grid grid-cols-2 gap-3 text-center mb-6">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-lg font-black text-slate-900 font-mono block">{vault.cardsCount}</span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Vault Cards</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-lg font-black text-slate-900 font-mono block">{vault.slabsCount}</span>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">Graded Slabs</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified TCGplayer Comps
                </span>
                <Link
                  to={`/portfolio/${vault.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 bg-slate-100 hover:bg-[#DC143C] hover:text-white text-slate-800 rounded-xl transition-colors"
                >
                  View Showcase <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

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
