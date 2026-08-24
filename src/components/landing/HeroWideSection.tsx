import React from 'react';
import { Sparkles, Shield, Layers, TrendingUp, Zap, CheckCircle2, Activity, ArrowRight } from 'lucide-react';
import { DisplayCurrency } from '../../types';
import { HeroFluidMotionCanvas } from './HeroFluidMotionCanvas';
import { motion } from 'motion/react';

interface HeroWideSectionProps {
  onEnterApp?: () => void;
  onExploreFeatures?: () => void;
  displayCurrency: DisplayCurrency;
}

export const HeroWideSection: React.FC<HeroWideSectionProps> = ({
  onEnterApp,
  onExploreFeatures,
  displayCurrency,
}) => {
  return (
    <section className="relative w-full pt-12 sm:pt-16 lg:pt-20 xl:pt-24 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 overflow-hidden">
      {/* 0. Floating Fluid Motion Graphics Canvas (Underneath Text & Non-Obtrusive) */}
      <HeroFluidMotionCanvas />

      {/* Foreground Container with Guaranteed High-Contrast Readability */}
      <div className="relative z-10 w-full max-w-[2200px] mx-auto text-center space-y-8 lg:space-y-12">
        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-[10px] sm:text-xs font-semibold shadow-xs text-center max-w-full"
        >
          <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-pulse shrink-0"></span>
          <span className="truncate sm:whitespace-normal font-mono tracking-tight">POKÉMON CARD COLLECTOR & PLAYER WORKBENCH</span>
        </motion.div>

        {/* Singular Wide Hero Title with High Contrast */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#0F172A] tracking-tight leading-[1.05] max-w-6xl mx-auto font-heading text-balance"
        >
          Keep track of your Pokémon binders, graded slabs, and tournament decks.
        </motion.h1>

        {/* Subtitle with Grounded Hobby Voice */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="text-base sm:text-lg lg:text-xl text-[#475569] max-w-3xl lg:max-w-4xl mx-auto font-normal leading-relaxed text-balance"
        >
          Log raw cards and graded certs, check off complete master sets, monitor TCGplayer market prices, and build 60-card standard decks for PTCGL and local league nights.
        </motion.p>

        {/* Quick Proof Chips */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 pt-2 text-[11px] sm:text-sm font-medium text-[#475569]"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A]" />
            <span>PSA, BGS & CGC Slab Certs</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A]" />
            <span>Live TCGplayer Market Comps</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A]" />
            <span>Standard 60-Card Deck Legality</span>
          </div>
        </motion.div>

        {/* Primary Call to Action Button */}
        {onEnterApp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
            className="pt-2 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-300" />
              <span>Open Collection</span>
              <ArrowRight className="w-4 h-4 text-white/80" />
            </button>
          </motion.div>
        )}

        {/* 3-Depth Light Studio Glass Slab Window Showcase - Full Width Scaling */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
          className="pt-8 w-full"
        >
          {/* Depth 0: Glass Slab Shell */}
          <div className="bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl ring-1 ring-slate-900/[0.04] p-3 sm:p-5 lg:p-6 text-left relative overflow-hidden">
            {/* Ambient subtle light sweep */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#DC143C]/5 rounded-full blur-3xl pointer-events-none" />

            {/* Depth 1: Studio Floor Wrapper */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl overflow-hidden relative">
              {/* Studio Window Header Bar */}
              <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-[#0F172A] ml-2">
                    DECK / divider Binder
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#64748B]">
                  <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    TCGplayer Market Live
                  </span>
                  <span className="hidden sm:inline bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-[#0F172A]">
                    Currency: {displayCurrency}
                  </span>
                </div>
              </div>

              {/* Studio Window Body: Live 3-Panel 3-Depth Showcase */}
              <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                {/* Panel 1 (Depth 2): PSA 10 Gem Mint Slab with Laser Shimmer */}
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:border-[#DC143C] hover:shadow-md transition-all group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-[#DC143C] font-bold uppercase tracking-wider">
                        Graded Slab
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#FFF0F3] text-[#DC143C] text-[10px] font-bold font-mono border border-[#DC143C]/30">
                        PSA 10
                      </span>
                    </div>
                    <div className="aspect-[3/4] max-h-48 mx-auto rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center p-2 relative">
                      <img
                        src="https://images.pokemontcg.io/sv3pt5/199_hires.png"
                        alt="Charizard ex"
                        className="h-full object-contain drop-shadow transition-transform group-hover:scale-105 duration-300"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="mt-3">
                      <div className="text-sm font-bold text-[#0F172A]">Charizard ex #199</div>
                      <div className="text-xs text-[#64748B]">Scarlet & Violet 151 • Special Illustration Rare</div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-sm font-bold font-mono text-[#0F172A]">$245.50</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      +34.2% (30d)
                    </span>
                  </div>
                </div>

                {/* Panel 2 (Depth 2): Collection Value HUD */}
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                      Collection Value
                    </span>
                    <div className="text-2xl font-bold font-mono text-[#0F172A] mt-1">$14,892.40</div>
                    <div className="text-xs font-mono text-emerald-600 mt-0.5 flex items-center gap-1 font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +24.8% over buy cost
                    </div>

                    <div className="mt-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between text-[#64748B] pb-1 border-b border-[#F1F5F9]">
                        <span>Total Cards Logged</span>
                        <span className="text-[#0F172A] font-bold">342</span>
                      </div>
                      <div className="flex justify-between text-[#64748B] pb-1 border-b border-[#F1F5F9]">
                        <span>Graded Slabs</span>
                        <span className="text-[#0F172A] font-bold">88</span>
                      </div>
                      <div className="flex justify-between text-[#64748B] pb-1 border-b border-[#F1F5F9]">
                        <span>Tournament Decks</span>
                        <span className="text-emerald-600 font-bold">6 Standard Legal</span>
                      </div>
                      <div className="flex justify-between text-[#64748B]">
                        <span>151 Master Set Progress</span>
                        <span className="text-[#DC143C] font-bold">91.3% (151/165)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748B]">Market Price Sync:</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Up to Date
                      </span>
                    </div>
                  </div>
                </div>

                {/* Panel 3 (Depth 2): Tournament Deck & Expansion Status */}
                <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">
                        Active 60-Card Deck
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200">
                        Standard Legal
                      </span>
                    </div>

                    <div className="text-sm font-bold text-[#0F172A]">Charizard ex / Pidgeot Control</div>
                    <div className="text-xs text-[#64748B] mt-0.5">Tournament Ready • 60/60 Cards</div>

                    {/* Ratio Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="h-2 w-full rounded-full bg-slate-100 flex overflow-hidden">
                        <div style={{ width: '30%' }} className="bg-[#DC143C] h-full" />
                        <div style={{ width: '56.6%' }} className="bg-blue-600 h-full" />
                        <div style={{ width: '13.4%' }} className="bg-amber-500 h-full" />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-[#64748B]">
                        <span>Pkmn 18</span>
                        <span>Trnr 34</span>
                        <span>Enrg 8</span>
                      </div>
                    </div>

                    {/* Mini Card Row */}
                    <div className="mt-4 grid grid-cols-4 gap-1.5">
                      {['sv3pt5/199', 'sv3pt5/4', 'sv3/164', 'sv1/191'].map((id, idx) => (
                        <div key={idx} className="aspect-[3/4] rounded bg-[#F8FAFC] border border-[#E2E8F0] p-0.5 overflow-hidden flex items-center justify-center">
                          <img
                            src={`https://images.pokemontcg.io/${id}_hires.png`}
                            alt="Card"
                            className="h-full object-contain"
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748B]">Sealed Boxes:</span>
                      <span className="text-emerald-600 font-bold">+$4,105 (+279%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
