import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, Crown } from 'lucide-react';

export const HeroFluidMotionCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Fluid Ambient Studio Atmosphere (GPU Composited Layer, Viewport-Relative Scaled) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.08, 0.96, 1],
            opacity: [0.3, 0.45, 0.32, 0.3],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[85vw] max-w-[950px] h-[40vh] max-h-[520px] rounded-full bg-gradient-to-r from-[#DC143C]/15 via-amber-500/10 to-indigo-500/15 blur-[80px] sm:blur-[120px] transform-gpu will-change-transform"
        />
      </div>

      {/* 2. Tri-Slab Floating Collector Stage (Left, Middle & Right Slabs with Dynamic Viewport Relative Bounds) */}
      <div className="absolute inset-x-0 top-0 h-[500px] sm:h-[650px] md:h-[720px] lg:h-[800px] flex items-center justify-center pointer-events-none px-2 sm:px-6">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">

          {/* ========================================================================= */}
          {/* SLAB 1 (LEFT): PSA 10 Gem Mint Red Label (Adaptive Size & Viewport Safe)   */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -14, 3, 0],
              x: [0, 4, -2, 0],
              rotate: [-10, -8, -11, -10],
            }}
            transition={{
              duration: 8.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-[-2%] sm:left-2 md:left-6 lg:left-8 top-[18%] sm:top-[20%] md:top-[22%] w-[36vw] min-w-[130px] max-w-[240px] h-[52vw] min-h-[190px] max-h-[350px] bg-white/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-3.5 shadow-lg sm:shadow-xl border border-slate-200 ring-1 ring-slate-900/5 flex flex-col justify-between transform-gpu will-change-transform opacity-70 sm:opacity-85"
          >
            {/* PSA Red Label Header */}
            <div className="bg-[#DC143C]/10 border border-[#DC143C]/20 rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-[#DC143C] animate-pulse" />
                <div className="h-1.5 sm:h-2 w-10 sm:w-16 md:w-20 bg-[#DC143C]/25 rounded-full" />
              </div>
              <div className="h-3.5 sm:h-4 px-1 bg-[#DC143C]/20 rounded font-mono text-[8px] sm:text-[9px] font-bold text-[#DC143C] flex items-center justify-center">
                10
              </div>
            </div>

            {/* Central Holographic Inset with Shimmer */}
            <div className="relative flex-1 my-1.5 sm:my-2.5 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
              <motion.div
                animate={{ x: ['-160%', '260%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.2 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none transform-gpu"
              />
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-200/70 mb-1 sm:mb-2 md:mb-3 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400" />
              </div>
              <div className="w-16 sm:w-24 md:w-28 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1" />
              <div className="w-10 sm:w-16 md:w-20 h-1 sm:h-1.5 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between">
              <div className="h-1 sm:h-1.5 w-8 sm:w-14 bg-slate-300 rounded-full" />
              <div className="h-2 sm:h-2.5 px-1 bg-emerald-500/20 rounded text-emerald-600 font-mono text-[7px] sm:text-[8px] font-bold flex items-center justify-center">
                $***.**
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SLAB 2 (MIDDLE): CGC Pristine 10 Black Label (Adaptive Scale & Depth)      */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -18, 3, 0],
              rotate: [0, -2, 2, 0],
              scale: [0.95, 0.98, 0.94, 0.95],
            }}
            transition={{
              duration: 11.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[4%] sm:top-[6%] md:top-[10%] w-[34vw] min-w-[125px] max-w-[225px] h-[50vw] min-h-[180px] max-h-[330px] bg-white/90 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-3.5 shadow-xl sm:shadow-2xl border border-slate-300/80 ring-1 ring-slate-900/10 flex flex-col justify-between transform-gpu will-change-transform opacity-50 sm:opacity-75 z-0"
          >
            {/* CGC Pristine Black & Gold Header */}
            <div className="bg-slate-950 border border-amber-400/40 rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Crown className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-400" />
                <div className="h-1.5 sm:h-2 w-8 sm:w-14 bg-amber-400/30 rounded-full" />
              </div>
              <div className="h-3.5 sm:h-4 px-1 bg-amber-400/20 border border-amber-400/40 rounded font-mono text-[7px] sm:text-[9px] font-black text-amber-300 flex items-center justify-center">
                PRISTINE
              </div>
            </div>

            {/* Central Holographic Inset */}
            <div className="relative flex-1 my-1.5 sm:my-2 rounded-lg sm:rounded-xl bg-gradient-to-b from-slate-900/5 to-slate-900/10 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
              <motion.div
                animate={{ x: ['-160%', '260%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent skew-x-12 pointer-events-none transform-gpu"
              />
              <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-200/80 mb-1 sm:mb-2 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-500" />
              </div>
              <div className="w-14 sm:w-20 md:w-24 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1" />
              <div className="w-10 sm:w-14 md:w-16 h-1 sm:h-1.5 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between">
              <div className="h-1 sm:h-1.5 w-6 sm:w-12 bg-slate-300 rounded-full" />
              <div className="h-2 sm:h-2.5 px-1 bg-amber-500/20 rounded text-amber-700 font-mono text-[7px] sm:text-[8px] font-bold flex items-center justify-center">
                POP 1
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SLAB 3 (RIGHT): BGS 9.5 Gem Mint Gold Label (Adaptive Size & Viewport Safe) */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -12, 4, 0],
              x: [0, -5, 3, 0],
              rotate: [10, 12, 9, 10],
            }}
            transition={{
              duration: 9.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute right-[-2%] sm:right-2 md:right-6 lg:right-8 top-[18%] sm:top-[20%] md:top-[22%] w-[36vw] min-w-[130px] max-w-[240px] h-[52vw] min-h-[190px] max-h-[350px] bg-white/95 backdrop-blur-xs rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-3.5 shadow-lg sm:shadow-xl border border-slate-200 ring-1 ring-slate-900/5 flex flex-col justify-between transform-gpu will-change-transform opacity-70 sm:opacity-85"
          >
            {/* BGS Gold Label Header */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-md sm:rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <div className="h-1.5 sm:h-2 w-10 sm:w-16 md:w-20 bg-amber-500/25 rounded-full" />
              </div>
              <div className="h-3.5 sm:h-4 px-1 bg-amber-500/20 rounded font-mono text-[8px] sm:text-[9px] font-bold text-amber-700 flex items-center justify-center">
                9.5
              </div>
            </div>

            {/* Central Holographic Inset */}
            <div className="relative flex-1 my-1.5 sm:my-2.5 rounded-lg sm:rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
              <motion.div
                animate={{ x: ['-160%', '260%'] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.6 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none transform-gpu"
              />
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-slate-200/70 mb-1 sm:mb-2 md:mb-3 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-400" />
              </div>
              <div className="w-16 sm:w-24 md:w-28 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1" />
              <div className="w-10 sm:w-16 md:w-20 h-1 sm:h-1.5 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-md sm:rounded-lg px-1.5 py-1 flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-slate-600">
              <span>C:9.5</span>
              <span>S:10</span>
              <span>E:9.5</span>
              <span>C:9.5</span>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
