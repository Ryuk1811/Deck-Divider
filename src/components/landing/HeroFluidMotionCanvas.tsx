import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, ShieldCheck, Crown } from 'lucide-react';

export const HeroFluidMotionCanvas: React.FC = () => {
  // Depth-heavy slab container classes
  const slabOuterClasses = "w-full h-full bg-white/40 backdrop-blur-md rounded-2xl p-2 sm:p-3 shadow-[10px_20px_40px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.1)] border border-white/60 flex flex-col justify-between overflow-hidden relative";
  
  // Slow moving automated glare instead of mouse-tracked
  const glareClasses = "absolute inset-0 w-[200%] h-[200%] bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none z-20 mix-blend-overlay";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none [perspective:1000px]">
      {/* 1. Fluid Ambient Studio Atmosphere */}
      <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.08, 0.96, 1],
            opacity: [0.3, 0.45, 0.32, 0.3],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[85vw] max-w-[950px] h-[40vh] max-h-[520px] rounded-full bg-gradient-to-r from-[#DC143C]/15 via-amber-500/10 to-indigo-500/15 blur-[80px] sm:blur-[120px] transform-gpu will-change-transform"
        />
      </div>

      {/* 2. Tri-Slab Floating Collector Stage */}
      <div className="absolute inset-x-0 top-0 h-[460px] sm:h-[580px] md:h-[650px] lg:h-[720px] flex items-center justify-center pointer-events-none px-2 sm:px-6">
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center [transform-style:preserve-3d]">
          
          {/* ========================================================================= */}
          {/* SLAB 1 (LEFT): PSA 10 Gem Mint Red Label */}
          {/* ========================================================================= */}
          <motion.div
            animate={{
              y: [0, -16, 8, -4, 12, 0],
              x: [0, 12, -8, 6, -10, 0],
              rotateZ: [-10, -13, -7, -12, -8, -10],
              rotateX: [5, 12, 2, 10, 4, 5],
              rotateY: [-5, -12, -2, -10, -4, -5],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-[-2%] sm:left-2 md:left-6 lg:left-8 top-[8%] sm:top-[10%] md:top-[12%] w-[34vw] min-w-[125px] max-w-[220px] h-[50vw] min-h-[180px] max-h-[320px] z-10"
          >
            <div className={slabOuterClasses}>
              <motion.div 
                animate={{ top: ['-50%', '0%', '-50%'], left: ['-50%', '0%', '-50%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                className={glareClasses} 
              />
              
              {/* PSA Header */}
              <div className="relative z-10 bg-white border-2 border-slate-200 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shadow-sm">
                <div className="h-1.5 sm:h-2 w-10 sm:w-16 bg-[#DC143C]/20 rounded-full" />
                <div className="h-3 sm:h-4 px-1.5 bg-[#DC143C] rounded font-mono text-[8px] sm:text-[10px] font-bold text-white flex items-center justify-center shadow-inner">
                  10
                </div>
              </div>

              {/* Plain Central Card (No Texture) */}
              <div className="relative z-10 flex-1 my-1.5 sm:my-2.5 rounded-sm bg-slate-50 border border-slate-200 shadow-inner overflow-hidden flex flex-col items-center justify-center p-1.5 sm:p-3">
                <motion.div
                  animate={{ x: ['-200%', '200%'] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.2 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none"
                />
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-slate-200/70 mb-2 flex items-center justify-center shadow-sm border border-slate-300/50">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400" />
                </div>
                <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1 z-10" />
                <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-slate-200/60 rounded-full z-10" />
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 bg-white/90 border border-slate-200/60 rounded-md px-2 py-1 flex items-center justify-between shadow-sm">
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
              y: [0, 12, -10, 6, -14, 0],
              x: [0, -10, 8, -12, 6, 0],
              rotateZ: [0, -4, 3, -2, 4, 0],
              rotateX: [0, 8, -5, 10, -2, 0],
              rotateY: [0, -8, 5, -10, 2, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[2%] sm:top-[4%] md:top-[6%] w-[32vw] min-w-[120px] max-w-[210px] h-[48vw] min-h-[175px] max-h-[310px] z-0"
          >
            <div className={slabOuterClasses}>
              <motion.div 
                animate={{ top: ['-20%', '-60%', '-20%'], left: ['-20%', '-60%', '-20%'] }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                className={glareClasses} 
              />

              {/* CGC Header */}
              <div className="relative z-10 bg-slate-950 border border-amber-400/40 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shadow-sm">
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
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 3 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-amber-100/40 to-transparent skew-x-12 pointer-events-none"
                />
                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-slate-200/80 border border-slate-300/50 mb-2 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-slate-500" />
                </div>
                <div className="w-14 sm:w-20 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1 z-10" />
                <div className="w-10 sm:w-14 h-1 sm:h-1.5 bg-slate-200/60 rounded-full z-10" />
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 bg-white/90 border border-slate-200/60 rounded-md px-2 py-1 flex items-center justify-between shadow-sm">
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
              y: [0, -12, 10, -6, 14, 0],
              x: [0, -8, 12, -10, 8, 0],
              rotateZ: [10, 14, 8, 13, 9, 10],
              rotateX: [5, 10, 2, 12, 4, 5],
              rotateY: [5, 12, 2, 10, 4, 5],
            }}
            transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[-2%] sm:right-2 md:right-6 lg:right-8 top-[10%] sm:top-[12%] md:top-[14%] w-[34vw] min-w-[125px] max-w-[220px] h-[50vw] min-h-[180px] max-h-[320px] z-10"
          >
            <div className={slabOuterClasses}>
              <motion.div 
                animate={{ top: ['-40%', '-10%', '-40%'], left: ['-40%', '-10%', '-40%'] }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                className={glareClasses} 
              />

              {/* BGS Header */}
              <div className="relative z-10 bg-amber-500/10 border border-amber-500/20 rounded-md sm:rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 rounded-full bg-amber-500 animate-pulse" />
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
                  transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2.6 }}
                  className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 pointer-events-none"
                />
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-slate-200/70 border border-slate-300/50 mb-2 flex items-center justify-center shadow-sm">
                  <Award className="w-4 h-4 sm:w-6 sm:h-6 text-slate-400" />
                </div>
                <div className="w-16 sm:w-24 h-1.5 sm:h-2 bg-slate-200/80 rounded-full mb-1 z-10" />
                <div className="w-10 sm:w-16 h-1 sm:h-1.5 bg-slate-200/60 rounded-full z-10" />
              </div>

              {/* Bottom Footer */}
              <div className="relative z-10 bg-white/90 border border-slate-200/60 rounded-md px-1.5 py-1 flex items-center justify-between text-[6px] sm:text-[7px] font-mono text-slate-700 shadow-sm">
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
