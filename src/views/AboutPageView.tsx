import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Shield, Cpu, Layers, Database, CheckCircle2, ChevronRight, BookOpen, Lock, Globe, ArrowRight, Award, Zap, TrendingUp } from 'lucide-react';
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
        {/* 0. Tri-Slab Floating Collector Motion Canvas */}
        <HeroFluidMotionCanvas />

        {/* Hero Section */}
        <section className="text-center space-y-4 sm:space-y-6 md:space-y-8 max-w-5xl mx-auto pt-2 sm:pt-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-[9px] sm:text-xs font-semibold shadow-xs text-center max-w-[95vw]"
          >
            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#DC143C] animate-pulse shrink-0"></span>
            <span className="truncate sm:whitespace-normal font-mono tracking-tight uppercase">THE ARCHITECTURE BEHIND DECK / DIVIDER</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-[#0F172A] tracking-tight leading-[1.08] font-heading text-balance px-1"
          >
            Engineered for Precision in the Modern <span className="text-[#DC143C]">Pokémon TCG</span> Ecosystem
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
            className="text-xs sm:text-base md:text-lg lg:text-xl text-[#64748B] leading-relaxed max-w-3xl mx-auto text-balance px-2"
          >
            DECK / divider bridges the gap between casual card tracking and institutional-grade portfolio intelligence. Built by players and collectors for high-net-worth vaults and tournament champions.
          </motion.p>
        </section>

        {/* 3-Depth Light Studio Glass Slab Window Showcase - Full Width Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: easeCurve }}
          className="pt-2 sm:pt-6 w-full relative z-10"
        >
          {/* Depth 0: Glass Slab Shell */}
          <div className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl sm:shadow-2xl rounded-xl sm:rounded-2xl ring-1 ring-slate-900/[0.04] p-2 sm:p-4 lg:p-6 text-left relative overflow-hidden">
            {/* Ambient subtle light sweep */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#DC143C]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Depth 1: Studio Floor Wrapper */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg sm:rounded-xl overflow-hidden relative">
              {/* Studio Window Header Bar */}
              <div className="px-3 sm:px-6 py-2.5 sm:py-3.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <div className="flex gap-1 sm:gap-1.5">
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                  </div>
                  <div className="h-3.5 w-px bg-[#E2E8F0] mx-1"></div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-[#64748B] uppercase tracking-widest flex items-center gap-1 sm:gap-1.5">
                    <Shield className="w-3 h-3 text-[#DC143C]" />
                    Architecture Detail
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono text-[#64748B]">
                  <span className="flex items-center gap-1 sm:gap-1.5 text-emerald-700 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    Active Matrix
                  </span>
                </div>
              </div>

              {/* Depth 2: Main Application Canvas */}
              <div className="p-4 sm:p-8 md:p-12 lg:p-16 space-y-12 sm:space-y-16 lg:space-y-24">
                
                {/* The Origin / Problem & Solution Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-stretch">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: easeCurve }}
                    className="bg-white border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-xs p-5 sm:p-7 md:p-8 space-y-3 sm:space-y-4 flex flex-col justify-between relative overflow-hidden transform-gpu"
                  >
                    <div className="space-y-2.5 sm:space-y-3 relative">
                      <span className="text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-widest text-[#94A3B8]">The Challenge</span>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A] tracking-tight">The Fragmentation of TCG Asset Tracking</h2>
                      <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                        For years, Pokémon collectors and competitors have been forced to juggle disjointed tools: manual spreadsheets with stale market prices, clunky deckbuilders without format checks, and unverified binder photos without grading metadata.
                      </p>
                      <ul className="space-y-2 pt-1 sm:pt-2 text-xs sm:text-sm text-[#64748B]">
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
                    <div className="pt-3 sm:pt-4 border-t border-[#F1F5F9] text-[10px] sm:text-[11px] font-mono text-[#94A3B8] relative">
                      Status Quo: High maintenance overhead & zero unified visibility.
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
                    className="bg-[#0F172A] text-white border border-[#1E293B] rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-7 md:p-8 space-y-3 sm:space-y-4 flex flex-col justify-between relative overflow-hidden ring-1 ring-white/10 inset-0 transform-gpu"
                  >
                    {/* Non-Intrusive Floating Architecture Badge */}
                    <motion.div
                      animate={{ y: [0, -6, 2, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none flex items-center gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] sm:text-[10px]"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>ZERO DRIFT</span>
                    </motion.div>

                    <div className="space-y-2.5 sm:space-y-3 relative">
                      <span className="text-[9px] sm:text-[10px] font-bold font-mono uppercase tracking-widest text-[#DC143C]">The Solution</span>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">The DECK / divider Unified Architecture</h2>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        A purpose-built suite bringing together live market valuation, slab certification validation, 60-card tournament deck engineering, and sealed vault asset management under a single, cohesive operating system.
                      </p>
                      <ul className="space-y-2 pt-1 sm:pt-2 text-xs sm:text-sm text-slate-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>Real-time price reconciliation across major marketplace feeds and historical sales.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>Complete master set matrix covering 148+ expansions from Base Set to modern sets.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span>Instant exportable tournament rosters compliant with Play! Pokémon regulations.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="pt-3 sm:pt-4 border-t border-slate-800 text-[10px] sm:text-[11px] font-mono text-emerald-400 flex items-center justify-between relative">
                      <span>DECK / divider: Zero drift.</span>
                      <span className="text-slate-400">15+ Currencies</span>
                    </div>
                  </motion.div>
                </section>

                {/* Interactive 4 Pillars Architecture Grid */}
                <section className="space-y-6 sm:space-y-8 lg:space-y-10">
                  <div className="text-center space-y-2 max-w-2xl mx-auto">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      Core Engineering Tenets
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Explore the four foundational principles that govern every algorithm, database schema, and interface in DECK / divider.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {pillars.map((pillar, pIdx) => {
                      const isSelected = activePillar === pillar.id;
                      return (
                        <motion.div
                          key={pillar.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: '-50px' }}
                          transition={{ duration: 0.5, delay: pIdx * 0.08, ease: easeCurve }}
                          onClick={() => setActivePillar(pillar.id)}
                          className={`rounded-xl p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between text-left transform-gpu ${
                            isSelected
                              ? 'bg-white border-[#DC143C] shadow-md ring-1 ring-[#DC143C]'
                              : 'bg-white/80 hover:bg-white border-[#E2E8F0] hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="space-y-2.5 sm:space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center">
                                {pillar.icon}
                              </div>
                              <span className="text-[10px] sm:text-[11px] font-mono text-[#94A3B8] font-semibold">
                                0{pillar.id + 1} / 04
                              </span>
                            </div>

                            <div>
                              <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">{pillar.title}</h3>
                              <span className="text-[10px] sm:text-[11px] font-mono text-[#DC143C]">{pillar.tagline}</span>
                            </div>

                            <p className="text-xs text-[#64748B] leading-relaxed">
                              {pillar.description}
                            </p>
                          </div>

                          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#F1F5F9] text-[10px] sm:text-[11px] text-[#0F172A] font-medium">
                            <span className="text-[#DC143C] font-bold">Key Spec: </span>
                            <span>{pillar.highlight}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* By The Numbers Grid with Stagger & Live Metrics Chip */}
                <section className="bg-white border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-xs p-5 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-8 relative overflow-hidden">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#DC143C]">Platform Capacity</span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0F172A]">DECK / divider by the Numbers</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 text-center">
                    {[
                      { num: '148+', label: 'Master Expansions' },
                      { num: '3', label: 'Grading Scales (PSA/BGS/CGC)' },
                      { num: '15+', label: 'Active Currencies' },
                      { num: '100%', label: 'Championship Formats' },
                    ].map((stat, sIdx) => (
                      <motion.div
                        key={sIdx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: sIdx * 0.08, ease: easeCurve }}
                        className="p-3 sm:p-4 bg-[#F8FAFC] rounded-lg sm:rounded-xl border border-[#E2E8F0] transform-gpu hover:border-[#DC143C]/40 transition-colors"
                      >
                        <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] font-heading">{stat.num}</div>
                        <div className="text-[10px] sm:text-xs text-[#64748B] font-medium mt-0.5 sm:mt-1">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA to How It Works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeCurve }}
          className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-left max-w-5xl mx-auto relative z-10"
        >
          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0F172A]">Ready to see the workflow in action?</h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Learn how our 4-step pipeline transforms raw card boxes and graded slabs into an organized, real-time institutional asset ledger.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/how-it-works"
              onClick={() => onNavigateHowItWorks && onNavigateHowItWorks()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Explore How It Works</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C]" />
            </Link>
            <Link
              to="/auth"
              onClick={() => onOpenAuth && onOpenAuth()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Sign In / Login</span>
            </Link>
          </div>
        </motion.section>
      </main>

      {/* Shared Footer */}
      <LandingFooter
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
