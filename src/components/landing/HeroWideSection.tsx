import React from 'react';
import { CheckCircle2, Zap, ArrowRight, Layers, LogIn } from 'lucide-react';
import { DisplayCurrency, PortfolioCardEntry, PokemonCard } from '../../types';
import { HeroFluidMotionCanvas } from './HeroFluidMotionCanvas';
import { motion } from 'motion/react';

interface HeroWideSectionProps {
  onEnterApp?: () => void;
  onOpenAuth?: () => void;
  onExploreFeatures?: () => void;
  displayCurrency: DisplayCurrency;
  onImportCustomCards?: (entries: PortfolioCardEntry[]) => void;
  onSelectCard?: (card: PokemonCard) => void;
  user?: any;
}

export const HeroWideSection: React.FC<HeroWideSectionProps> = ({
  onEnterApp,
  onOpenAuth,
  user,
}) => {
  return (
    <section className="relative w-full pt-10 sm:pt-14 md:pt-18 lg:pt-22 pb-16 sm:pb-24 lg:pb-32 px-3 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-24 overflow-hidden">
      {/* 0. Floating Fluid Motion Graphics Canvas (Underneath Text & Non-Obtrusive, Dynamically Scaled) */}
      <HeroFluidMotionCanvas />
      
      {/* Foreground Container with Guaranteed High-Contrast Readability */}
      <div className="relative z-10 w-full max-w-[2200px] mx-auto text-center space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Top Tagline Pill */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-[9px] sm:text-xs font-semibold shadow-xs text-center max-w-[95vw]"
        >
          <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#DC143C] animate-pulse shrink-0"></span>
          <span className="truncate sm:whitespace-normal font-mono tracking-tight uppercase">POKÉMON TCG COLLECTION TRACKER & DECK STUDIO</span>
        </motion.div>

        {/* Singular Punchy Identifier Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#0F172A] tracking-tight leading-[1.08] max-w-5xl mx-auto font-heading text-balance px-1"
        >
          Grade it. Price it. Play it.
        </motion.h1>

        {/* Subtitle with Grounded Hobby Precision */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1, ease: 'easeOut' }}
          className="text-xs sm:text-base md:text-lg lg:text-xl text-[#475569] max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-normal leading-relaxed text-balance px-2"
        >
          Log raw cards and graded certs, complete master sets, track live TCGplayer prices, and build tournament-legal 60-card decks for PTCGL. Connect with the global community of collectors and players, analyze meta trends in real-time, and manage your entire sealed portfolio securely in one unified platform designed for the ultimate Pokémon TCG enthusiast.
        </motion.p>

        {/* Quick Proof Chips */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:gap-6 pt-1 sm:pt-2 text-[10px] sm:text-xs md:text-sm font-medium text-[#475569] px-2"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            <span className="whitespace-nowrap">PSA, BGS & CGC Slab Certs</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            <span className="whitespace-nowrap">Live TCGplayer Market Comps</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            <span className="whitespace-nowrap">Standard 60-Card Deck Legality</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-[#E2E8F0] shadow-2xs hover:border-emerald-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A34A] shrink-0" />
            <span className="whitespace-nowrap">Advanced Sealed Portfolio Tracking</span>
          </div>
        </motion.div>

        {/* Primary Call to Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
          className="pt-2 flex flex-col items-center justify-center gap-3.5 px-2"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            {onEnterApp && (
              <button
                type="button"
                onClick={onEnterApp}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 fill-amber-300" />
                <span>{user ? 'Launch Studio' : 'Start Your Collection'}</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>
            )}

            {!user && onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-[#0F172A] bg-white hover:bg-slate-50 border border-[#CBD5E1] hover:border-[#DC143C]/50 rounded-xl transition-all shadow-xs cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]"
              >
                <LogIn className="w-4 h-4 text-[#DC143C]" />
                <span>Sign In / Login</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-600 bg-transparent hover:bg-slate-100/60 rounded-xl transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Explore Features</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
