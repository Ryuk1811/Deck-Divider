import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, Crown } from 'lucide-react';

export const HeroFluidMotionCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Fluid Ambient Studio Atmosphere (GPU Composited Layer) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.06, 0.96, 1],
            opacity: [0.35, 0.5, 0.38, 0.35],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[700px] lg:w-[950px] h-[400px] lg:h-[520px] rounded-full bg-gradient-to-r from-[#DC143C]/15 via-amber-500/10 to-indigo-500/15 blur-[120px] transform-gpu will-change-transform"
        />
      </div>

      {/* 2. Tri-Slab Floating Collector Stage (Left, Middle & Right Slabs with Asynchronous Kinematics) */}
      <div className="absolute inset-x-0 top-0 h-[650px] sm:h-[720px] lg:h-[800px] flex items-center justify-center pointer-events-none">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">

          {/* ========================================================================= */}
          {/* SLAB 1 (LEFT): PSA 10 Gem Mint Red Label (Asymmetric 8.4s Sine-Wave Loop) */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -16, 4, 0],
              x: [0, 6, -3, 0],
              rotate: [-12, -10, -13, -12],
            }}
            transition={{
              duration: 8.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-2 sm:left-6 lg:left-10 top-[20%] sm:top-[22%] lg:top-[24%] w-48 sm:w-56 lg:w-64 h-70 sm:h-80 lg:h-92 bg-white/95 rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-200 ring-1 ring-slate-900/5 flex flex-col justify-between transform-gpu will-change-transform opacity-75 sm:opacity-85"
          >
            {/* Minimalist PSA Red Label Header */}
            <div className="bg-[#DC143C]/10 border border-[#DC143C]/20 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DC143C] animate-pulse" />
                <div className="h-2 w-16 sm:w-20 bg-[#DC143C]/25 rounded-full" />
              </div>
              <div className="h-4 w-7 bg-[#DC143C]/20 rounded font-mono text-[9px] font-bold text-[#DC143C] flex items-center justify-center">
                10
              </div>
            </div>

            {/* Central Holographic Inset with Autonomous Shimmer Sweep */}
            <div className="relative flex-1 my-2.5 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-3">
              <motion.div
                animate={{ x: ['-160%', '260%'] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.2 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none transform-gpu"
              />
              <div className="w-12 h-12 rounded-xl bg-slate-200/70 mb-3 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-400" />
              </div>
              <div className="w-24 sm:w-28 h-2 bg-slate-200/80 rounded-full mb-1.5" />
              <div className="w-16 sm:w-20 h-1.5 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <div className="h-1.5 w-14 bg-slate-300 rounded-full" />
              <div className="h-2.5 w-12 bg-emerald-500/20 rounded text-emerald-600 font-mono text-[8px] font-bold flex items-center justify-center">
                $***.**
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SLAB 2 (MIDDLE): CGC Pristine 10 Black Label (Asymmetric 11.2s Deep Breath) */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -20, 3, 0],
              rotate: [1, -2, 2, 1],
              scale: [0.95, 0.98, 0.94, 0.95],
            }}
            transition={{
              duration: 11.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[8%] sm:top-[10%] lg:top-[12%] w-44 sm:w-52 lg:w-60 h-68 sm:h-76 lg:h-88 bg-white/90 rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-slate-300/80 ring-1 ring-slate-900/10 flex flex-col justify-between transform-gpu will-change-transform opacity-60 sm:opacity-75 z-0"
          >
            {/* Minimalist CGC Pristine Black & Gold Header */}
            <div className="bg-slate-950 border border-amber-400/40 rounded-lg px-2.5 py-1.5 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-1.5">
                <Crown className="w-3 h-3 text-amber-400" />
                <div className="h-2 w-14 bg-amber-400/30 rounded-full" />
              </div>
              <div className="h-4 px-1.5 bg-amber-400/20 border border-amber-400/40 rounded font-mono text-[9px] font-black text-amber-300 flex items-center justify-center">
                PRISTINE 10
              </div>
            </div>

            {/* Central Holographic Inset */}
            <div className="relative flex-1 my-2 rounded-xl bg-gradient-to-b from-slate-900/5 to-slate-900/10 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-3">
              <motion.div
                animate={{ x: ['-160%', '260%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300/40 to-transparent skew-x-12 pointer-events-none transform-gpu"
              />
              <div className="w-10 h-10 rounded-xl bg-slate-200/80 mb-2 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-slate-500" />
              </div>
              <div className="w-20 sm:w-24 h-2 bg-slate-200/80 rounded-full mb-1" />
              <div className="w-14 sm:w-16 h-1.5 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Footer Bar */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <div className="h-1.5 w-12 bg-slate-300 rounded-full" />
              <div className="h-2.5 w-10 bg-amber-500/20 rounded text-amber-700 font-mono text-[8px] font-bold flex items-center justify-center">
                POPR 1
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SLAB 3 (RIGHT): BGS 9.5 Gem Mint Gold Label (Asymmetric 9.6s Sine-Wave Loop) */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -14, 5, 0],
              x: [0, -8, 4, 0],
              rotate: [12, 14, 11, 12],
            }}
            transition={{
              duration: 9.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute right-2 sm:right-6 lg:right-10 top-[20%] sm:top-[22%] lg:top-[24%] w-48 sm:w-56 lg:w-64 h-70 sm:h-80 lg:h-92 bg-white/95 rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-200 ring-1 ring-slate-900/5 flex flex-col justify-between transform-gpu will-change-transform opacity-75 sm:opacity-85"
          >
            {/* Minimalist BGS Gold Label Header with Subgrades */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <div className="h-2 w-16 sm:w-20 bg-amber-500/25 rounded-full" />
              </div>
              <div className="h-4 w-7 bg-amber-500/20 rounded font-mono text-[9px] font-bold text-amber-700 flex items-center justify-center">
                9.5
              </div>
            </div>

            {/* Central Holographic Inset with Autonomous Shimmer Sweep */}
            <div className="relative flex-1 my-2.5 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-3">
              <motion.div
                animate={{ x: ['-160%', '260%'] }}
                transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.6 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none transform-gpu"
              />
              <div className="w-12 h-12 rounded-xl bg-slate-200/70 mb-3 flex items-center justify-center">
                <Award className="w-5 h-5 text-slate-400" />
              </div>
              <div className="w-24 sm:w-28 h-2 bg-slate-200/80 rounded-full mb-1.5" />
              <div className="w-16 sm:w-20 h-1.5 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Footer Bar with Subgrade Scores */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg px-2 py-1 flex items-center justify-between text-[7px] font-mono text-slate-600">
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
