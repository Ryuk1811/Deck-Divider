import React, { useState } from 'react';
import { Sparkles, Shield, Cpu, Layers, Database, CheckCircle2, ChevronRight, BookOpen, Lock, Globe, ArrowRight } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { DeckDividerBrand } from '../components/DeckDividerBrand';
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

  const pillars = [
    {
      id: 0,
      icon: <Database className="w-5 h-5 text-[#DC143C]" />,
      title: 'Real-Time Valuation & Anti-Drift',
      tagline: 'Continuous Multi-Currency Aggregation',
      description: 'Traditional spreadsheets drift from reality within days. DECK / divider interfaces directly with market valuation endpoints, tracking price fluctuations, market shifts, and currency conversions across USD, JPY, EUR, GBP, and 10+ global currencies simultaneously.',
      highlight: 'Sub-second real-time currency recalculation and cost-basis delta analytics.',
    },
    {
      id: 1,
      icon: <Cpu className="w-5 h-5 text-[#DC143C]" />,
      title: 'Tournament-Grade Rules Engine',
      tagline: 'Championship Formats & Deck Legality',
      description: 'Engineered with strict regulation rules for official Pokémon TCG formats. Our engine performs continuous 60-card format checks, enforces the 4-copy rule (accounting for Radiant and ACE SPEC restrictions), and generates printable tournament registration rosters.',
      highlight: 'Standard (F, G, H regulation marks) & Expanded real-time rule verification.',
    },
    {
      id: 2,
      icon: <Layers className="w-5 h-5 text-[#DC143C]" />,
      title: 'Physical & Digital Twin Fidelity',
      tagline: 'Authentic Slabs & Shimmer Physics',
      description: 'Graded cards require more than a generic text row. We support PSA, BGS, and CGC certified certificates, individual subgrade breakdowns (Centering, Surface, Corners, Edges), and realistic holographic physics that recreate rainbow, secret rare, and gold foil textures.',
      highlight: 'Cryptographic cert log with grading company verification shortcuts.',
    },
    {
      id: 3,
      icon: <Shield className="w-5 h-5 text-[#DC143C]" />,
      title: 'Privacy & Architectural Restraint',
      tagline: 'Zero Bloat, High Density, Total Security',
      description: 'We believe professional software should be fast, dense, and distraction-free. No intrusive tracking, no sluggish decorative animations, and no hidden telemetry. Your personal inventory and financial logs remain encrypted and private.',
      highlight: 'AES-256 cloud encryption with offline-first client cache storage.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:16px_16px] text-[#0F172A] flex flex-col font-sans overflow-x-hidden selection:bg-[#DC143C] selection:text-white">
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

      <main className="flex-1 w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-12 sm:py-20 lg:py-24 space-y-20 lg:space-y-32">
        {/* Hero Section */}
        <section className="text-center space-y-6 sm:space-y-8 max-w-5xl mx-auto pt-4">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-[10px] sm:text-xs font-semibold shadow-xs text-center max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-pulse shrink-0"></span>
            <span className="truncate sm:whitespace-normal">THE ARCHITECTURE BEHIND DECK / DIVIDER</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#0F172A] tracking-tight leading-[1.04] font-heading text-balance">
            Engineered for Precision in the Modern <span className="text-[#DC143C]">Pokémon TCG</span> Ecosystem
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#64748B] leading-relaxed max-w-3xl mx-auto text-balance">
            DECK / divider bridges the gap between casual card tracking and institutional-grade portfolio intelligence. Built by players and collectors for high-net-worth vaults and tournament champions.
          </p>
        </section>

        {/* 3-Depth Light Studio Glass Slab Window Showcase - Full Width Scaling */}
        <div className="pt-8 w-full">
          {/* Depth 0: Glass Slab Shell */}
          <div className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-2xl rounded-2xl ring-1 ring-slate-900/[0.04] p-3 sm:p-5 lg:p-6 text-left">
            {/* Depth 1: Studio Floor Wrapper */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden">
              {/* Studio Window Header Bar */}
              <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <div className="h-3.5 w-px bg-[#E2E8F0] mx-1"></div>
                  <span className="text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest flex items-center gap-1.5">
                    <Shield className="w-3 h-3 text-[#DC143C]" />
                    Architecture Detail
                  </span>
                </div>
              </div>

              {/* Depth 2: Main Application Canvas */}
              <div className="p-8 sm:p-12 lg:p-20 space-y-20 lg:space-y-32">
                
                {/* The Origin / Problem & Solution Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                  <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-8 space-y-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="space-y-3 relative">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#94A3B8]">The Challenge</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">The Fragmentation of TCG Asset Tracking</h2>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        For years, Pokémon collectors and competitors have been forced to juggle disjointed tools: manual spreadsheets with stale market prices, clunky deckbuilders without format checks, and unverified binder photos without grading metadata.
                      </p>
                      <ul className="space-y-2 pt-2 text-xs sm:text-sm text-[#64748B]">
                        <li className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">×</span>
                          <span>Unreliable valuations caused by unindexed currency fluctuations and delayed market sync.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">×</span>
                          <span>Lack of subgrade and certificate audit trails for high-value PSA, BGS, and CGC slabs.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-rose-500 font-bold">×</span>
                          <span>Disconnected deck lists with no automatic championship legality or energy distribution analysis.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-[#F1F5F9] text-[11px] font-mono text-[#94A3B8] relative">
                      Status Quo: High maintenance overhead & zero unified visibility.
                    </div>
                  </div>

                  <div className="bg-[#0F172A] text-white border border-[#1E293B] rounded-2xl shadow-xl p-6 sm:p-8 space-y-4 flex flex-col justify-between relative overflow-hidden ring-1 ring-white/10 inset-0">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#DC143C]/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="space-y-3 relative">
                      <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#DC143C]">The Solution</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">The DECK / divider Unified Architecture</h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        A purpose-built suite bringing together live market valuation, slab certification validation, 60-card tournament deck engineering, and sealed vault asset management under a single, cohesive operating system.
                      </p>
                      <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>Real-time price reconciliation across major marketplace feeds and historical sales.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>Complete master set matrix covering 148+ expansions from Base Set to Scarlet & Violet.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>Instant exportable tournament rosters compliant with Play! Pokémon regulations.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-emerald-400 flex items-center justify-between relative">
                      <span>DECK / divider: Zero drift, zero guesswork.</span>
                      <span className="text-slate-400">Currencies: 15+ Live</span>
                    </div>
                  </div>
                </section>

        {/* Interactive 4 Pillars Architecture Grid */}
        <section className="space-y-10 lg:space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Core Engineering Tenets
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Explore the four foundational principles that govern every algorithm, database schema, and interface in DECK / divider.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {pillars.map((pillar) => {
              const isSelected = activePillar === pillar.id;
              return (
                <div
                  key={pillar.id}
                  onClick={() => setActivePillar(pillar.id)}
                  className={`rounded-xl p-5 border transition-all cursor-pointer flex flex-col justify-between text-left ${
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
                      <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">{pillar.title}</h3>
                      <span className="text-[11px] font-mono text-[#DC143C]">{pillar.tagline}</span>
                    </div>

                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[11px] text-[#0F172A] font-medium">
                    <span className="text-[#DC143C] font-bold">Key Spec: </span>
                    <span>{pillar.highlight}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* By The Numbers Grid */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-8 sm:p-12 lg:p-16 space-y-10">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC143C]">Platform Capacity</span>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A]">DECK / divider by the Numbers</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center">
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] font-heading">148+</div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Master Set Expansions</div>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] font-heading">3</div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Grading Scales (PSA/BGS/CGC)</div>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] font-heading">15+</div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Active Global Currencies</div>
            </div>
            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] font-heading">100%</div>
              <div className="text-xs text-[#64748B] font-medium mt-1">Championship Format Audit</div>
            </div>
          </div>
        </section>

              </div>
            </div>
          </div>
        </div>

        {/* CTA to How It Works */}
        <section className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-left max-w-5xl mx-auto">
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">Ready to see the workflow in action?</h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Learn how our 4-step pipeline transforms raw card boxes and graded slabs into an organized, real-time institutional asset ledger.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateHowItWorks}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Explore How It Works</span>
              <ArrowRight className="w-4 h-4 text-[#DC143C]" />
            </button>
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Sign In / Login</span>
            </button>
          </div>
        </section>
      </main>

      {/* Shared Footer */}
      <LandingFooter
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
