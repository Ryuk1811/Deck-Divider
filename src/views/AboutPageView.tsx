import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Shield, Layers, Database, CheckCircle2, BookOpen, Lock, Globe, ArrowRight, Award, Zap, TrendingUp, Users, HeartHandshake, ExternalLink, HelpCircle } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { HeroFluidMotionCanvas } from '../components/landing/HeroFluidMotionCanvas';
import { LandingMotionDirectorate } from '../components/landing/LandingMotionDirectorate';
import { DisplayCurrency } from '../types';

interface AboutPageViewProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
  displayCurrency: DisplayCurrency;
}

export const AboutPageView: React.FC<AboutPageViewProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateHowItWorks,
  displayCurrency,
}) => {
  const [activePillar, setActivePillar] = useState<number>(0);
  const easeCurve = [0.16, 1, 0.3, 1];

  const pillars = [
    {
      id: 0,
      icon: <Database className="w-5 h-5 text-[#DC143C]" />,
      title: 'Real-Time Market Prices',
      tagline: 'TCGplayer Comps & Currency Sync',
      description: 'Traditional spreadsheets become outdated within days. DECK / divider updates prices daily from verified TCGplayer market averages and completed eBay sales, with instant currency conversion across USD, EUR, GBP, JPY, CAD, and 10+ global currencies.',
      highlight: 'Live card prices, raw vs graded value comparison, and purchase break-even tracking.',
    },
    {
      id: 1,
      icon: <Award className="w-5 h-5 text-[#DC143C]" />,
      title: 'Tournament Deckbuilder',
      tagline: 'Standard Format Legality & PTCGL Export',
      description: 'Engineered specifically for official Pokémon TCG formats. Our builder checks standard 60-card format legality (regulation marks F, G, H, I), validates the 4-card copy rule, Radiant restrictions, and ACE SPEC limits, and generates 1-click PTCGL export lists.',
      highlight: 'Standard & Expanded rule validation with instant printable tournament rosters.',
    },
    {
      id: 2,
      icon: <Layers className="w-5 h-5 text-[#DC143C]" />,
      title: 'PSA, BGS & CGC Slab Registry',
      tagline: 'Cert Verification & Subgrades',
      description: 'Graded cards require more than a generic text row. We support PSA, BGS, and CGC certified certificates, individual subgrade breakdowns (Centering, Surface, Corners, Edges), and high-resolution visual previews for your prize slabs.',
      highlight: 'Full certificate logging with quick links to official grading house registries.',
    },
    {
      id: 3,
      icon: <Shield className="w-5 h-5 text-[#DC143C]" />,
      title: 'Privacy & No-Ad Commitment',
      tagline: 'Zero Bloat, Fast Speed, Total Security',
      description: 'We believe collector software should be fast, clean, and distraction-free. No intrusive third-party ads, no paywalled card searches, and no hidden tracking. Your personal binder inventories and purchase logs remain private and encrypted.',
      highlight: 'Encrypted cloud sync with complete CSV export capabilities anytime.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
      {/* Global Scroll Progress & Continuous Ambient Motion Directorate */}
      <LandingMotionDirectorate />

      {/* Shared Header Navigation */}
      <LandingNav
        onOpenAuth={onOpenAuth}
        onNavigateSection={(id) => {
          if (id === 'about') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (id === 'how-it-works') {
            onNavigateHowItWorks();
          } else {
            onNavigateHome();
          }
        }}
      />

      <main className="flex-1 w-full max-w-[2200px] mx-auto px-3 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-24 py-8 sm:py-16 lg:py-24 space-y-12 sm:space-y-20 lg:space-y-28 relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl mx-auto pt-2 sm:pt-4 rounded-3xl">
          {/* Tri-Slab Floating Collector Motion Canvas scoped to Hero */}
          <HeroFluidMotionCanvas />
          <div className="relative z-10 space-y-4 sm:space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-[9px] sm:text-xs font-semibold shadow-xs text-center max-w-[95vw]"
            >
              <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#DC143C] animate-pulse shrink-0"></span>
              <span className="truncate sm:whitespace-normal font-mono tracking-tight uppercase">ABOUT DECK / DIVIDER</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-[#0F172A] tracking-tight leading-[1.08] font-heading text-balance px-1"
            >
              Built by Collectors, Crafted for the <span className="text-[#DC143C]">Pokémon TCG</span> Community
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
              className="text-xs sm:text-base md:text-lg lg:text-xl text-[#64748B] leading-relaxed max-w-3xl mx-auto text-balance px-2"
            >
              DECK / divider is an independent fan project built by lifelong Pokémon card collectors and competitive tournament players. Here is why we built it, who is behind it, and where our data comes from.
            </motion.p>
          </div>
        </section>

        {/* 1. Who We Are & Why We Built This */}
        <section className="max-w-5xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-xs space-y-8 relative overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-[#DC143C] font-mono text-xs font-bold uppercase tracking-wider">
              <HeartHandshake className="w-4 h-4" />
              <span>Our Story &amp; Purpose</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
              Why We Built DECK / divider
            </h2>
            <div className="space-y-4 text-xs sm:text-base text-[#475569] leading-relaxed">
              <p>
                Like many collectors and players in the Pokémon TCG community, we spent years managing our cards across messy Google Sheets, taking photos of binder pages that we constantly lost track of, and juggling slow apps cluttered with paywalled search features and full-screen banner ads.
              </p>
              <p>
                Whenever a new expansion dropped — from vintage reprints to modern Special Illustration Rares — keeping track of what we owned, what we paid, and what our decks actually cost was frustrating. At local card shows and trade nights, calculating currency conversions for international cards was even worse.
              </p>
              <p>
                We built <strong>DECK / divider</strong> to fix that. Our mission is simple: provide the cleanest, fastest, and most honest tool for tracking raw binders, authenticated slabs, sealed booster boxes, and 60-card tournament decks — with zero ad bloat and total respect for your data.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#F1F5F9]">
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="text-xs font-mono font-bold text-[#DC143C] uppercase">01 • Independent &amp; Fan-Led</div>
              <div className="text-sm font-bold text-[#0F172A]">Community First</div>
              <div className="text-xs text-[#64748B]">Built by players who open packs, grade cards, and play at local leagues.</div>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="text-xs font-mono font-bold text-[#DC143C] uppercase">02 • Fast &amp; Ad-Free</div>
              <div className="text-sm font-bold text-[#0F172A]">Zero Distractions</div>
              <div className="text-xs text-[#64748B]">No popup ads or sluggish scripts. Instant search with ⌘K keyboard shortcuts.</div>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
              <div className="text-xs font-mono font-bold text-[#DC143C] uppercase">03 • Open &amp; Exportable</div>
              <div className="text-sm font-bold text-[#0F172A]">Your Data is Yours</div>
              <div className="text-xs text-[#64748B]">Export complete CSV backups and 1-click PTCGL deck lists at any time.</div>
            </div>
          </div>
        </section>

        {/* 2. Plain, Visible Statement of Price Data & Provenance */}
        <section className="max-w-5xl mx-auto bg-slate-900 text-white rounded-2xl p-6 sm:p-10 lg:p-12 border border-slate-800 space-y-8 relative overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Database className="w-4 h-4" />
              <span>Data Provenance &amp; Verification</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white font-heading">
              Where Our Price &amp; Card Data Comes From
            </h2>
            <p className="text-xs sm:text-base text-slate-300 leading-relaxed">
              We believe in total transparency about how card values, set checklists, and format rules are calculated. Here is the exact provenance of all information inside DECK / divider:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Market Prices: TCGplayer &amp; eBay Comps</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Raw card values, reverse holos, and special art cards update continuously from verified <strong>TCGplayer Market Prices</strong> and completed <strong>eBay sold transactions</strong>. Prices are averaged to filter out fraudulent or anomalous listings.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Globe className="w-4 h-4 shrink-0" />
                <span>Currency Exchange: European Central Bank</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Whether you view your collection in USD ($), EUR (€), GBP (£), JPY (¥), CAD ($), or AUD ($), conversion rates are updated daily from official European Central Bank and international forex feeds.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Layers className="w-4 h-4 shrink-0" />
                <span>Expansions &amp; Checklist Matrix</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our database covers 148+ expansions spanning Vintage (Base Set through Neo and e-Reader), Mid-Era (EX, Diamond &amp; Pearl, Platinum, Black &amp; White, XY, Sun &amp; Moon), and Modern (Sword &amp; Shield, Scarlet &amp; Violet) with full illustrator credits and rarity symbols.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <Award className="w-4 h-4 shrink-0" />
                <span>Tournament Rules: Play! Pokémon Standard</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Regulation marks (F, G, H, I) and format legality are kept synchronized with official Play! Pokémon championship rotation bulletins and Pokémon TCG Live export specifications.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Core Principles Grid */}
        <section className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Four Core Design Principles
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Every feature in DECK / divider is designed around these four collector-first commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {pillars.map((pillar, pIdx) => {
              const isSelected = activePillar === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between text-left ${
                    isSelected
                      ? 'bg-white border-[#DC143C] shadow-md ring-1 ring-[#DC143C]'
                      : 'bg-white/80 hover:bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center">
                        {pillar.icon}
                      </div>
                      <span className="text-[11px] font-mono text-[#94A3B8] font-semibold">
                        0{pillar.id + 1} / 04
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#0F172A]">{pillar.title}</h3>
                      <span className="text-xs font-mono text-[#DC143C]">{pillar.tagline}</span>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-xs text-[#0F172A] font-medium">
                    <span className="text-[#DC143C] font-bold">Key Feature: </span>
                    <span>{pillar.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Community & Support Channels */}
        <section className="max-w-5xl mx-auto bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-lg sm:text-2xl font-bold text-[#0F172A]">Join the Collector Community &amp; Get in Touch</h3>
            <p className="text-xs sm:text-sm text-[#64748B]">Have a suggestion, noticed a missing promo card, or want to say hi? We’d love to hear from you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="mailto:deckdivider@outlook.com"
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-[#DC143C]/40 transition-all space-y-1 block group"
            >
              <div className="text-xs font-mono font-bold text-[#DC143C] uppercase">Direct Email</div>
              <div className="text-sm font-bold text-[#0F172A] group-hover:text-[#DC143C] transition-colors">deckdivider@outlook.com</div>
              <div className="text-xs text-[#64748B]">For bug reports, missing cards, and tier inquiries.</div>
            </a>

            <a
              href="https://discord.gg/pokemon-tcg"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-indigo-300 transition-all space-y-1 block group"
            >
              <div className="text-xs font-mono font-bold text-indigo-600 uppercase">Community Discord</div>
              <div className="text-sm font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors">Join the Discord Server</div>
              <div className="text-xs text-[#64748B]">Chat with collectors, share pulls, and test deck lists.</div>
            </a>

            <a
              href="https://www.reddit.com/r/pkmntcgcollections/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:border-orange-300 transition-all space-y-1 block group"
            >
              <div className="text-xs font-mono font-bold text-orange-600 uppercase">Reddit Community</div>
              <div className="text-sm font-bold text-[#0F172A] group-hover:text-orange-600 transition-colors">r/pkmntcgcollections</div>
              <div className="text-xs text-[#64748B]">Discuss binder collections, trade logs, and card care.</div>
            </a>
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left max-w-5xl mx-auto relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-bold text-[#0F172A]">Ready to organize your collection?</h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Start with our free Starter plan to track raw binders, log graded slabs, and build 60-card tournament decks.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>View Free &amp; Paid Plans</span>
              <ArrowRight className="w-4 h-4 text-[#DC143C]" />
            </Link>
            <Link
              to="/auth"
              onClick={() => onOpenAuth && onOpenAuth()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Start Your Collection</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <LandingFooter
        onEnterApp={onOpenAuth}
        onOpenAuth={onOpenAuth}
        displayCurrency={displayCurrency}
        onNavigateSection={(id) => {
          if (id === 'about') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (id === 'how-it-works') {
            onNavigateHowItWorks();
          } else {
            onNavigateHome();
          }
        }}
      />
    </div>
  );
};
