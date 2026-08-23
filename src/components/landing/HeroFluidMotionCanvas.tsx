import React, { useEffect, useState } from 'react';
import { Sparkles, Award } from 'lucide-react';

export const HeroFluidMotionCanvas: React.FC = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          const x = (e.clientX / innerWidth - 0.5) * 20;
          const y = (e.clientY / innerHeight - 0.5) * 15;
          setMouseOffset({ x, y });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* 1. Soft Ambient Fluid Glow Aura (Hardware CSS filter) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div
          className="w-[600px] lg:w-[800px] h-[350px] lg:h-[450px] rounded-full bg-gradient-to-r from-[#DC143C]/10 via-amber-500/8 to-indigo-500/10 blur-[100px]"
          style={{ transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)` }}
        />
      </div>

      {/* 2. Blank White Slabs Behind Hero Opening Text Mid Lines */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
          transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
        className="absolute inset-x-0 top-0 h-[650px] sm:h-[720px] lg:h-[800px] flex items-center justify-center pointer-events-none transform-gpu"
      >
        <div className="relative w-full max-w-6xl h-full flex items-center justify-center">

          {/* Left Midline Blank White Slab (Angled sideways behind left text) */}
          <div
            className="absolute left-2 sm:left-6 lg:left-10 top-[20%] sm:top-[22%] lg:top-[24%] w-48 sm:w-56 lg:w-64 h-70 sm:h-80 lg:h-92 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-200 ring-1 ring-slate-900/5 opacity-80 sm:opacity-90 flex flex-col justify-between -rotate-12 transform-gpu"
          >
            {/* Minimalist Top PSA Header Label */}
            <div className="bg-[#DC143C]/10 border border-[#DC143C]/20 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DC143C]" />
                <div className="h-2 w-16 sm:w-20 bg-[#DC143C]/25 rounded-full" />
              </div>
              <div className="h-4 w-7 bg-[#DC143C]/20 rounded font-mono text-[9px] font-bold text-[#DC143C] flex items-center justify-center">
                10
              </div>
            </div>

            {/* Central Blank White Inset */}
            <div className="relative flex-1 my-2.5 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-3">
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
          </div>

          {/* Right Midline Blank White Slab (Angled sideways behind right text) */}
          <div
            className="absolute right-2 sm:right-6 lg:right-10 top-[20%] sm:top-[22%] lg:top-[24%] w-48 sm:w-56 lg:w-64 h-70 sm:h-80 lg:h-92 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-200 ring-1 ring-slate-900/5 opacity-80 sm:opacity-90 flex flex-col justify-between rotate-12 transform-gpu"
          >
            {/* Minimalist Top BGS Gold Header Label */}
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="h-2 w-16 sm:w-20 bg-amber-500/25 rounded-full" />
              </div>
              <div className="h-4 w-7 bg-amber-500/20 rounded font-mono text-[9px] font-bold text-amber-700 flex items-center justify-center">
                9.5
              </div>
            </div>

            {/* Central Blank White Inset */}
            <div className="relative flex-1 my-2.5 rounded-xl bg-slate-50 border border-slate-200/80 overflow-hidden flex flex-col items-center justify-center p-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200/70 mb-3 flex items-center justify-center">
                <Award className="w-5 h-5 text-slate-400" />
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
          </div>

        </div>
      </div>
    </div>
  );
};
