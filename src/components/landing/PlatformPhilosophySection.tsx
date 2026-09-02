import React from 'react';
import { Target, Shield, Compass, Sparkles, Database, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const PlatformPhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 scroll-mt-20">
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-6 sm:space-y-8">
        {/* Top Mission Statement */}
        <div className="max-w-3xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-[11px] font-mono font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#DC143C]" />
            Purpose & Architecture
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading tracking-tight leading-tight">
            Built with institutional precision. Designed for pure collectors.
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            DECK / divider was created out of frustration with clunky, ad-stuffed tracking apps and slow marketplaces. Our mission is to provide an ultra-responsive, distraction-free operating system for Pokémon TCG collectors and competitive players.
          </p>
        </div>

        {/* 3 Columns: Usage, Intention, Aim */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4 border-t border-slate-100">
          {/* Column 1: Who It's Built For */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Usage & Audience
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tailored for competitive players needing 60-card format legality, master set purists tracking every variant stamp, and high-value vault collectors verifying certification numbers.
            </p>
          </div>

          {/* Column 2: Intention & Privacy */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Core Intention
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Zero ad networks, zero data brokering, and zero intrusive popups. Your collection size, cost bases, and deck strategies remain private and device-encrypted.
            </p>
          </div>

          {/* Column 3: The Long-Term Aim */}
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              The Platform Aim
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              To unite cataloging, live price discovery, and tournament deck validation into a unified, high-speed workstation backed by offline-first caching and instant sync.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
