import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Code2,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Github,
  Twitter,
  Mail,
  Award,
  CheckCircle2,
  Terminal,
  Database,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { CATALOG_STATS } from '../../data/catalogStatsCanon';

export const FounderPageView: React.FC = () => {
  const navigate = useNavigate();
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A] selection:bg-[#DC143C] selection:text-white">
      <PageHead
        title="Meet the Founder: Gurutva Murdia — The Story Behind DECK / divider"
        description="The story of DECK / divider: Built by solo engineer and lifelong Pokémon collector Gurutva Murdia to deliver an ad-free, fast, and accurate operating system for serious cards and tournament decks."
        canonicalPath="/founder"
        keywords={[
          'gurutva murdia',
          'deck divider founder',
          'pokemon tcg developer',
          'deck divider creator',
          'indie pokemon developer story'
        ]}
      />

      <LandingNav
        onOpenAuth={() => navigate('/auth')}
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }}
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <GeoBreadcrumbs
            items={[
              { label: 'About', path: '/about' },
              { label: 'Founder Story', path: '/founder' },
            ]}
          />

          {/* Hero Profile Block */}
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-[#F1F5F9] pb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white flex items-center justify-center font-heading font-extrabold text-3xl sm:text-4xl shadow-md border-2 border-[#DC143C]/20 shrink-0">
                GM
              </div>
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[11px] font-mono font-bold uppercase tracking-wider">
                  <Terminal className="w-3.5 h-3.5" />
                  Solo Founder &amp; Engineer
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading">
                  Gurutva Murdia
                </h1>
                <p className="text-sm font-mono text-[#64748B]">
                  Lifelong Pokémon collector • Full-stack software engineer • Creator of DECK / divider
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs font-mono">
                  <a
                    href="https://x.com/DeckDivider"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:border-[#DC143C] hover:text-[#DC143C] transition-all"
                  >
                    <Twitter className="w-3.5 h-3.5 text-[#1DA1F2]" />
                    @DeckDivider
                  </a>
                  <a
                    href="mailto:deckdivider@outlook.com"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] hover:border-[#DC143C] hover:text-[#DC143C] transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#DC143C]" />
                    deckdivider@outlook.com
                  </a>
                </div>
              </div>
            </div>

            {/* Founder Narrative */}
            <div className="space-y-6 text-sm sm:text-base text-[#334155] leading-relaxed">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
                Why I Built DECK / divider
              </h2>
              <p>
                I have collected Pokémon cards for over a decade. From opening vintage packs in the mid-2000s to sleuthing for modern Special Illustration Rares, I have experienced every phase of this hobby. But as my collection grew and I began playing locally, I hit a frustrating wall that almost every serious collector encounters:
              </p>
              <blockquote className="border-l-4 border-l-[#DC143C] pl-4 sm:pl-6 italic text-[#475569] bg-[#FFF0F3]/40 py-3 rounded-r-xl">
                “Every existing card app was either stuffed with unskippable video ads, locked basic search behind heavy paywalls, lagged painfully on mobile browsers, or couldn't handle 60-card tournament deckbuilding with official Play! Pokémon regulation marks.”
              </blockquote>
              <p>
                Generic multi-TCG apps treat Pokémon cards like stock tickers or baseball cards. They miss the nuances that matter most to players and binder completionists: reverse holo variants, ACE SPEC restrictions, Radiant Pokémon rules, tournament regulation mark rotations (H, I, J), and clean 1-click PTCGL export.
              </p>
              <p>
                So I decided to build the tool I personally needed. As a solo software engineer, I coded DECK / divider from scratch with three non-negotiable principles:
              </p>
            </div>

            {/* 3 Core Principles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="font-bold text-[#0F172A] text-sm">1. Sub-Second Speed</div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  In-memory browser caching and client-side IndexedDB speed. Search {CATALOG_STATS.totalCardsIndexed} cards in less than 5 milliseconds without waiting on bloated server round-trips.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="font-bold text-[#0F172A] text-sm">2. Zero Ad Tracking</div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  No third-party ad brokers, behavioral profiling pixels, or popups. Your collection data and purchase prices belong exclusively to you.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-[#E2E8F0] space-y-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="font-bold text-[#0F172A] text-sm">3. Full Portability</div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Complete CSV portfolio export and 1-click PTCGL deck copy anytime. You never get locked into our platform.
                </p>
              </div>
            </div>

            {/* Technical Transparency */}
            <div className="space-y-4 pt-6 border-t border-[#F1F5F9]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
                Engineering &amp; Architecture
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed">
                DECK / divider is built on a modern TypeScript stack: React with Vite, Tailwind CSS, offline-first IndexedDB storage, client-side AES-GCM snapshot encryption, and Google Firebase Firestore security rules for multi-device sync.
              </p>
              <div className="bg-[#0F172A] text-white p-5 rounded-2xl font-mono text-xs space-y-2">
                <div className="text-emerald-400 font-bold">// System Specifications</div>
                <div className="text-slate-300">• Database: {CATALOG_STATS.totalSetsLabel} ({CATALOG_STATS.mainlineMasterExpansionsLabel})</div>
                <div className="text-slate-300">• Card Index: {CATALOG_STATS.totalCardsLabel}</div>
                <div className="text-slate-300">• Tournament Engine: 2026 Play! Pokémon Standard (Marks H, I, J legal; Mark G rotated)</div>
                <div className="text-slate-300">• Pricing Feed: Daily TCGplayer Lowest Verified sales &amp; completed eBay comps</div>
                <div className="text-slate-300">• Direct Contact: deckdivider@outlook.com</div>
              </div>
            </div>

            {/* Personal Signoff */}
            <div className="pt-6 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#0F172A]">
                  Thank you for being part of this journey.
                </p>
                <p className="text-xs font-mono text-[#64748B]">
                  — Gurutva Murdia, Founder of DECK / divider
                </p>
              </div>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold transition-all shadow-xs"
              >
                Open Collection Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <PtcPartnerBanner />

          <GeoExtractableBlock
            heading="Who is the creator of DECK / divider?"
            summary="DECK / divider was created and solo-engineered by Gurutva Murdia, a lifelong Pokémon collector and full-stack software developer. The platform was built to replace ad-heavy, sluggish card tracker apps with an ad-free, high-precision tool featuring instant ⌘K search, 60-card tournament deck rules, and slab collection management."
            keyFacts={[
              { label: 'Creator', value: 'Gurutva Murdia' },
              { label: 'Role', value: 'Solo Founder & Engineer' },
              { label: 'Contact', value: 'deckdivider@outlook.com' },
              { label: 'Origin', value: 'Independent Collector Project' },
            ]}
          />

          <PublicInterlinkMesh currentPath="/founder" />
        </div>
      </main>

      <LandingFooter
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
