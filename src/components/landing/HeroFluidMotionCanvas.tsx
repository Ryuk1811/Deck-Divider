import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, Crown } from 'lucide-react';

export const HeroFluidMotionCanvas: React.FC = () => {
  // Crisp, lightweight slab container with isolation and no backdrop-filter artifacts
  const slabOuterClasses = "w-full h-full bg-white/95 rounded-2xl p-2 sm:p-3 shadow-[0_10px_30px_-6px_rgba(15,23,42,0.12),0_4px_10px_-2px_rgba(15,23,42,0.06)] border border-slate-200/90 flex flex-col justify-between overflow-hidden relative isolate";
  
  // Smooth, lightweight glare animation using pure opacity
  const glareClasses = "absolute -inset-full w-[300%] h-[300%] bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none z-20 will-change-transform";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Fluid Ambient Studio Atmosphere - Static blur layer with lightweight opacity pulse */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div
          animate={{
            opacity: [0.22, 0.32, 0.22],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[80vw] max-w-[900px] h-[35vh] max-h-[480px] rounded-full bg-gradient-to-r from-[#DC143C]/10 via-amber-500/8 to-indigo-500/10 blur-[50px] transform-gpu"
        />
      </div>

      {/* 2. Tri-Slab Floating Collector Stage */}
      <div className="absolute inset-x-0 top-0 h-[460px] sm:h-[580px] md:h-[650px] lg:h-[720px] flex items-center justify-center pointer-events-none px-2 sm:px-6">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
          
          {/* ========================================================================= */}
          {/* SLAB 1 (LEFT): PSA 10 Gem Mint Red Label */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [-7, -5, -7],
            }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[-2%] sm:left-2 md:left-6 lg:left-8 top-[8%] sm:top-[10%] md:top-[12%] w-[34vw] min-w-[125px] max-w-[220px] h-[50vw] min-h-[180px] max-h-[320px] z-10 will-change-transform"
          >
            <div className={slabOuterClasses}>
              <motion.div 
                animate={{ x: ['-15%', '15%', '-15%'], y: ['-15%', '15%', '-15%'] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className={glareClasses} 
              />
              
              {/* PSA Header */}
              <div className="relative z-10 bg-white border border-slate-200 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shadow-xs">
                <div className="h-1.5 sm:h-2 w-10 sm:w-16 bg-[#DC143C]/20 rounded-full" />
                <div className="h-3 sm:h-4 px-1.5 bg-[#DC143C] rounded font-mono text-[8px] sm:text-[10px] font-bold text-white flex items-center justify-center shadow-inner">
                  10
                </div>
              </div>

              {/* Plain Central Card (No Texture) */}
              <div className="relative z-10 flex-1 my-1.5 sm:my-2.5 rounded-sm bg-slate-50 border border-slate-200 shadow-inner overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none will-change-transform"
                />
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-slate-200/70 mb-2 flex items-center justify-center shadow-xs border border-slate-300/50">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400" />
                </div>
                <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1 z-10" />
                <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-slate-200/60 rounded-full z-10" />
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 bg-white/90 border border-slate-200/60 rounded-md px-2 py-1 flex items-center justify-between shadow-xs">
                <div className="h-1 sm:h-1.5 w-8 sm:w-14 bg-slate-300 rounded-full" />
                <div className="h-2 sm:h-2.5 px-1 bg-emerald-50 rounded text-emerald-700 font-mono text-[7px] sm:text-[8px] font-bold">
                  $***.**
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SLAB 2 (MIDDLE): CGC Pristine 10 Black Label */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, 6, 0],
              rotate: [0, 1.5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[2%] sm:top-[4%] md:top-[6%] w-[32vw] min-w-[120px] max-w-[210px] h-[48vw] min-h-[175px] max-h-[310px] z-0 will-change-transform"
          >
            <div className={slabOuterClasses}>
              <motion.div 
                animate={{ x: ['-10%', '10%', '-10%'], y: ['-10%', '10%', '-10%'] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className={glareClasses} 
              />

              {/* CGC Header */}
              <div className="relative z-10 bg-slate-950 border border-amber-400/40 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Crown className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-amber-400" />
                  <div className="h-1.5 sm:h-2 w-8 sm:w-14 bg-amber-400/30 rounded-full" />
                </div>
                <div className="h-3.5 sm:h-4 px-1 bg-amber-400/20 border border-amber-400/40 rounded font-mono text-[7px] sm:text-[9px] font-black text-amber-300 flex items-center justify-center">
                  PRISTINE
                </div>
              </div>

              {/* Plain Central Card */}
              <div className="relative z-10 flex-1 my-1.5 sm:my-2 rounded-sm bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200/80 shadow-inner overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.5 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-amber-100/40 to-transparent skew-x-12 pointer-events-none will-change-transform"
                />
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-slate-200/80 border border-slate-300/50 mb-2 flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-500" />
                </div>
                <div className="w-14 sm:w-20 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1 z-10" />
                <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-slate-200/60 rounded-full z-10" />
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 bg-white/90 border border-slate-200/60 rounded-md px-2 py-1 flex items-center justify-between shadow-xs">
                <div className="h-1 sm:h-1.5 w-6 sm:w-12 bg-slate-300 rounded-full" />
                <div className="h-2 sm:h-2.5 px-1 bg-amber-50 rounded text-amber-700 font-mono text-[7px] sm:text-[8px] font-bold">
                  POP 1
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* SLAB 3 (RIGHT): BGS 9.5 Gem Mint Gold Label */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [7, 9, 7],
            }}
            transition={{ duration: 5.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[-2%] sm:right-2 md:right-6 lg:right-8 top-[10%] sm:top-[12%] md:top-[14%] w-[34vw] min-w-[125px] max-w-[220px] h-[50vw] min-h-[180px] max-h-[320px] z-10 will-change-transform"
          >
            <div className={slabOuterClasses}>
              <motion.div 
                animate={{ x: ['-12%', '12%', '-12%'], y: ['-12%', '12%', '-12%'] }}
                transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                className={glareClasses} 
              />

              {/* BGS Header */}
              <div className="relative z-10 bg-amber-500/10 border border-amber-500/20 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-amber-500" />
                  <div className="h-1.5 sm:h-2 w-10 sm:w-16 bg-amber-500/25 rounded-full" />
                </div>
                <div className="h-3.5 sm:h-4 px-1 bg-amber-500/20 rounded font-mono text-[8px] sm:text-[10px] font-black text-amber-700 flex items-center justify-center">
                  9.5
                </div>
              </div>

              {/* Plain Central Card */}
              <div className="relative z-10 flex-1 my-1.5 sm:my-2.5 rounded-sm bg-slate-50 border border-slate-200/80 shadow-inner overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.2 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none will-change-transform"
                />
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-slate-200/70 border border-slate-300/50 mb-2 flex items-center justify-center shadow-xs">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400" />
                </div>
                <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1 z-10" />
                <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-slate-200/60 rounded-full z-10" />
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 bg-white/90 border border-slate-200/60 rounded-md px-1.5 py-1 flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-slate-700 shadow-xs">
                <span>C:9.5</span>
                <span>S:10</span>
                <span>E:9.5</span>
                <span>C:9.5</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

