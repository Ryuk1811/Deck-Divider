import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, ChevronDown, Layers, Database, Shield, Zap, Search, SlidersHorizontal, Trophy, Package, Award } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { HeroFluidMotionCanvas } from '../components/landing/HeroFluidMotionCanvas';
import { LandingMotionDirectorate } from '../components/landing/LandingMotionDirectorate';
import { DisplayCurrency } from '../types';

interface HowItWorksPageViewProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateAbout: () => void;
  displayCurrency: DisplayCurrency;
}

export const HowItWorksPageView: React.FC<HowItWorksPageViewProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateAbout,
  displayCurrency,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const easeCurve = [0.16, 1, 0.3, 1];

  const steps = [
    {
      stepNumber: '01',
      title: 'Rapid Cataloging & Certification',
      subtitle: 'Raw Binders & Graded Slabs',
      description: 'Search cards seamlessly across 148+ expansions. Choose between logging raw copies or registering authenticated slabs with verified certification numbers, grading house standards (PSA, BGS, CGC), and individual subgrades.',
      tags: ['Multi-Attribute Search', 'Subgrade Breakdown', 'Cert Verification'],
      details: [
        'Instant multi-field search by card name, collector number, set, rarity, and artist.',
        'Record PSA, BGS, and CGC certified certificates with exact subgrade values (Centering, Surface, Corners, Edges).',
        'Input custom purchase cost basis and dates for accurate ROI calculations.',
      ],
      previewContent: {
        badge: 'SLAB REGISTRATION',
        title: 'Charizard ex #199 - 151 (MEW)',
        certNumber: 'PSA 10 GEM MINT #83921049',
        estValue: '$485.00 USD',
        status: 'Authenticated',
      },
    },
    {
      stepNumber: '02',
      title: 'Automated Valuation & Currency Indexing',
      subtitle: 'Zero Manual Price Updating',
      description: 'The engine continuously pulls real-time verified market prices for raw and graded cards. Your total Net Asset Value (NAV) automatically updates in your preferred fiat currency with zero manual input.',
      tags: ['Live Market APIs', '15+ Currencies', 'Capital Gains Delta'],
      details: [
        'Real-time aggregation from verified marketplace APIs with weighted historical averages.',
        'Instant multi-currency exchange rate conversions across 15+ fiat currencies.',
        'Breakdown of unrealized capital gains, daily delta shifts, and highest-appreciating assets.',
      ],
      previewContent: {
        badge: 'REAL-TIME VALUATION',
        title: 'Total Portfolio NAV',
        certNumber: '1,420 Certified Cards Logged',
        estValue: '$42,850.00 USD (+14.2%)',
        status: 'Live Synced',
      },
    },
    {
      stepNumber: '03',
      title: 'Deck Construction & Championship Legality',
      subtitle: 'Strict Format Compliance Engine',
      description: 'Architect competitive 60-card tournament decks with automated regulation legality verification (Standard & Expanded), energy curve distribution analytics, and instant printable tournament registration sheets.',
      tags: ['Play! Pokémon Rules', 'ACE SPEC Audits', 'PDF Roster Export'],
      details: [
        'Automatic checks for regulation marks (F, G, H for Standard format) and banlist compliance.',
        'Strict validation of 4-copy limits, 1-copy Radiant restrictions, and single ACE SPEC rules.',
        'Export ready-to-print deck registration sheets for official Regional and International Championships.',
      ],
      previewContent: {
        badge: 'TOURNAMENT DECK STUDIO',
        title: 'Gardevoir ex Championship 60',
        certNumber: 'Standard Format (2025/2026)',
        estValue: '60 / 60 Legal Cards',
        status: 'Tournament Ready',
      },
    },
    {
      stepNumber: '04',
      title: 'Sealed Vault Ledger & Set Completion Matrix',
      subtitle: 'Holistic Sealed Asset Tracking',
      description: 'Manage sealed booster boxes, booster bundles, Elite Trainer Boxes (ETBs), and exclusive promo tins in your secure vault while monitoring visual completion percentages for every master set.',
      tags: ['Sealed Box Matrix', '148+ Set Checklists', 'Secure Vault Ledger'],
      details: [
        'Categorize sealed booster cases, vintage boxes, and modern ETBs with acquisition prices.',
        'Visual matrix grid highlighting owned vs missing variants (Normal, Reverse Holo, Secret Rare).',
        'Historical appreciation curves specifically calibrated for sealed factory inventory.',
      ],
      previewContent: {
        badge: 'SEALED VAULT LEDGER',
        title: 'Scarlet & Violet: 151 Booster Bundle Display',
        certNumber: 'Factory Sealed Case (10 Bundles)',
        estValue: '$480.00 USD (Cost: $270.00)',
        status: 'Vault Secured',
      },
    },
  ];

  const faqs = [
    {
      q: 'How frequently are card market prices updated?',
      a: 'Card prices are reconciled continuously via low-latency price feeds and marketplace aggregators. Whenever sales data or verified exchange prices fluctuate, our indexing engine updates active portfolio valuations automatically.',
    },
    {
      q: 'How does tournament legality checking work?',
      a: 'The deck validation engine cross-references every card’s regulation mark (e.g. F, G, H for current Standard) against official Play! Pokémon championship criteria. It automatically flags illegal cards, over-the-limit copies, and misconfigured ACE SPEC or Radiant card combinations.',
    },
    {
      q: 'Can I export my cards and deck rosters?',
      a: 'Yes. You can export complete collection databases to standard CSV format at any time, or generate one-click printable tournament registration rosters compliant with official tournament organizing software (RK9 / TOM).',
    },
    {
      q: 'How do the different tier limits work?',
      a: 'DECK / divider offers five scaling tiers (Starter, Bunch, Stack, Deck, and Collection) designed to support everyone from beginning collectors to institutional high-volume vault managers. Upgrading your tier expands your card limits, custom watchlists, and sealed box slots.',
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
            onNavigateAbout();
          } else if (id === 'how-it-works') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <span className="truncate sm:whitespace-normal font-mono tracking-tight uppercase">SYSTEM WORKFLOW & LIFECYCLE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-extrabold text-[#0F172A] tracking-tight leading-[1.08] font-heading text-balance px-1"
          >
            From Raw Binders to Real-Time Ledger in <span className="text-[#DC143C]">Four Simple Steps</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
            className="text-xs sm:text-base md:text-lg lg:text-xl text-[#64748B] leading-relaxed max-w-3xl mx-auto text-balance px-2"
          >
            Explore how DECK / divider streamlines asset intake, valuation indexing, championship deck validation, and sealed vault management into a seamless, high-density workflow.
          </motion.p>
        </section>

        {/* 3-Depth Light Studio Glass Slab Window Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: easeCurve }}
          className="pt-2 sm:pt-6 w-full max-w-6xl mx-auto relative z-10"
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
                    <Layers className="w-3 h-3 text-[#DC143C]" />
                    Interactive Workflow
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono text-[#64748B]">
                  <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Pipeline Ready</span>
                </div>
              </div>

              {/* Depth 2: Main Application Canvas */}
              <div className="p-4 sm:p-8 md:p-12 lg:p-16 space-y-12 sm:space-y-16 lg:space-y-24">
                
                {/* 4-Step Interactive Pipeline Showcase */}
                <section className="space-y-8 sm:space-y-12">
                  {/* Step Selector Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    {steps.map((s, idx) => {
                      const isCurrent = activeStep === idx;
                      return (
                        <button
                          key={s.stepNumber}
                          onClick={() => setActiveStep(idx)}
                          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-[#DC143C] text-white shadow-md'
                              : 'bg-white text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 border border-[#E2E8F0]'
                          }`}
                        >
                          <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] font-mono ${
                            isCurrent ? 'bg-white text-[#DC143C]' : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}>
                            {s.stepNumber}
                          </span>
                          <span className="truncate max-w-[120px] sm:max-w-none">{s.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Step Showcase Glass Card */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.4, ease: easeCurve }}
                      className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-12 relative"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
                        {/* Left Details Column */}
                        <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
                          <div className="space-y-1.5 sm:space-y-2">
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#DC143C]">
                              <span>Step {steps[activeStep].stepNumber}</span>
                              <span>•</span>
                              <span className="text-[#64748B]">{steps[activeStep].subtitle}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A]">
                              {steps[activeStep].title}
                            </h2>
                          </div>

                          <p className="text-xs sm:text-sm md:text-base text-[#64748B] leading-relaxed">
                            {steps[activeStep].description}
                          </p>

                          {/* Feature Chips */}
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                            {steps[activeStep].tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[10px] sm:text-xs font-medium text-[#475569]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Bullet Points with cascading checkmarks */}
                          <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-[#F1F5F9]">
                            {steps[activeStep].details.map((d, dIdx) => (
                              <motion.div
                                key={dIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: dIdx * 0.06, ease: easeCurve }}
                                className="flex items-start gap-2 sm:gap-2.5 text-xs sm:text-sm text-[#475569]"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                                <span>{d}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Right Live Simulation Mockup Column */}
                        <div className="lg:col-span-5 relative">
                          {/* Floating Non-Intrusive Workflow Indicator */}
                          <motion.div
                            animate={{ y: [0, -6, 2, 0] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -top-3 -right-3 z-20 pointer-events-none hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800 shadow-md font-mono text-[9px] sm:text-[10px]"
                          >
                            <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span>VERIFIED {steps[activeStep].stepNumber}/04</span>
                          </motion.div>

                          <div className="bg-[#0F172A] text-white rounded-xl p-4 sm:p-6 border border-slate-800 shadow-2xl space-y-3 sm:space-y-4 text-left transform-gpu">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 sm:pb-3">
                              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-[#DC143C]/20 text-[#DC143C] text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase border border-[#DC143C]/40">
                                {steps[activeStep].previewContent.badge}
                              </span>
                              <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                                <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                {steps[activeStep].previewContent.status}
                              </span>
                            </div>

                            <div className="space-y-0.5 sm:space-y-1">
                              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">Asset Identifier</span>
                              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-snug">
                                {steps[activeStep].previewContent.title}
                              </h3>
                            </div>

                            <div className="bg-[#1E293B] rounded-lg p-2.5 sm:p-3.5 border border-slate-700 space-y-1">
                              <div className="text-[10px] sm:text-xs text-slate-400 font-mono">Certification Standard</div>
                              <div className="text-[11px] sm:text-xs font-semibold text-slate-200 truncate">
                                {steps[activeStep].previewContent.certNumber}
                              </div>
                            </div>

                            <div className="pt-1.5 sm:pt-2 flex items-center justify-between">
                              <div>
                                <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono block">Indexed Value</span>
                                <span className="text-xs sm:text-base font-extrabold text-white font-mono">
                                  {steps[activeStep].previewContent.estValue}
                                </span>
                              </div>
                              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono bg-slate-800/80 px-2 py-0.5 sm:py-1 rounded">
                                Sync: Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </section>

                {/* Interactive FAQ Section */}
                <section className="bg-white border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-xs p-5 sm:p-8 md:p-12 lg:p-16 space-y-6 sm:space-y-10 max-w-4xl mx-auto">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#DC143C]">Architecture FAQ</span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                      Frequently Asked Questions
                    </h2>
                    <p className="text-xs sm:text-sm text-[#64748B]">
                      Everything you need to know about cataloging, valuation data feeds, and championship rules.
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 text-left">
                    {faqs.map((faq, fIdx) => {
                      const isOpen = openFaq === fIdx;
                      return (
                        <div
                          key={fIdx}
                          className="border border-[#E2E8F0] rounded-lg sm:rounded-xl overflow-hidden transition-all"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                            className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-[#F8FAFC] hover:bg-slate-100 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                          >
                            <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{faq.q}</span>
                            <ChevronDown className={`w-4 h-4 text-[#64748B] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#DC143C]' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="px-4 sm:px-5 py-3 sm:py-4 bg-white border-t border-[#E2E8F0] text-xs sm:text-sm text-[#64748B] leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Callout */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: easeCurve }}
          className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-xl sm:rounded-2xl p-5 sm:p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-left max-w-5xl mx-auto relative z-10"
        >
          <div className="space-y-1.5 sm:space-y-2 text-center md:text-left">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#0F172A]">Experience the platform firsthand</h3>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-xl">
              Sign in or create your account to begin cataloging cards, verifying slabs, and tracking real-time portfolio valuations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onNavigateAbout}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>About Platform</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C]" />
            </button>
            <button
              onClick={onOpenAuth}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Sign In / Login</span>
            </button>
          </div>
        </motion.section>
      </main>

      {/* Shared Footer */}
      <LandingFooter
        displayCurrency={displayCurrency}
        onNavigateSection={(id) => {
          if (id === 'about') {
            onNavigateAbout();
          } else if (id === 'how-it-works') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            onNavigateHome();
          }
        }}
      />
    </div>
  );
};
