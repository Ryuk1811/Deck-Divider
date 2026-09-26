import React from 'react';
import { Sparkles, TrendingUp, Zap, CheckCircle2, Search, Bell, Award, Shield } from 'lucide-react';

interface SectionMotionAssetProps {
  sectionId: string;
  reversed?: boolean;
}

export const SectionMotionAsset: React.FC<SectionMotionAssetProps> = ({ sectionId }) => {
  switch (sectionId) {
    case 'collection':
      return (
        <div className="absolute -top-3 sm:-top-5 -right-1 sm:-right-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5 relative overflow-hidden">
            {/* Autonomous subtle laser scan line sweep */}
            <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#DC143C]/20 to-transparent skew-x-12 pointer-events-none transform-gpu animate-dd-sweep" />
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-[#DC143C] text-white flex items-center justify-center font-black text-[9px] sm:text-[11px] shadow-xs">
              10
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1">
                PSA VERIFIED <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="text-emerald-600 font-num text-[9px] sm:text-[11px]">CERT #83921044</div>
            </div>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 ml-0.5" />
          </div>
        </div>
      );

    case 'metrics':
      return (
        <div className="absolute -top-3 sm:-top-5 -left-1 sm:-left-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider flex items-center justify-between">
                <span>TCGplayer Sold</span>
                <span className="text-[7px] sm:text-[8px] text-emerald-600 font-bold ml-1">LIVE</span>
              </div>
              <div className="text-emerald-700 font-num font-extrabold text-[9px] sm:text-[11px] truncate max-w-[150px] sm:max-w-none">
                Charizard +34% ↑ $245.50
              </div>
            </div>
          </div>
        </div>
      );

    case 'decks':
      return (
        <div className="absolute -bottom-3 sm:-bottom-5 -right-1 sm:-right-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Play! Pokémon Format
              </div>
              <div className="text-indigo-700 font-bold text-[9px] sm:text-[11px] flex items-center gap-1">
                <span>STANDARD 60/60</span>
                <span className="text-[8px] bg-indigo-50 border border-indigo-200 px-1 rounded text-indigo-800">
                  H
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'sets':
      return (
        <div className="absolute -top-3 sm:-top-5 -right-1 sm:-right-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                151 Master Set
              </div>
              <div className="text-purple-700 font-bold text-[9px] sm:text-[11px] flex items-center gap-1">
                <span>151/165 (91%)</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'search':
      return (
        <div className="absolute -bottom-3 sm:-bottom-5 -left-1 sm:-left-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Index Matrix
              </div>
              <div className="text-slate-800 font-bold text-[9px] sm:text-[11px] flex items-center gap-1">
                <span>18.4K CARDS</span>
                <span className="text-[8px] bg-slate-100 px-1 rounded text-emerald-600 font-mono font-bold">
                  0.04s
                </span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'lists':
      return (
        <div className="absolute -top-3 sm:-top-5 -left-1 sm:-left-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Grail Alert
              </div>
              <div className="text-amber-700 font-bold text-[9px] sm:text-[11px] truncate max-w-[140px] sm:max-w-none">
                MOONBREON &lt; $820 NM
              </div>
            </div>
          </div>
        </div>
      );

    case 'sealed-vault':
    case 'vault':
      return (
        <div className="absolute -bottom-3 sm:-bottom-5 -right-1 sm:-right-4 z-20 pointer-events-none transform-gpu animate-dd-float backface-hidden max-w-[90vw]">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-slate-200 shadow-md sm:shadow-lg flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-5 h-5 sm:w-7 sm:h-7 rounded sm:rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div>
              <div className="text-[8px] sm:text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Vault Security
              </div>
              <div className="text-emerald-700 font-bold text-[9px] sm:text-[11px] flex items-center gap-1">
                <span>UV 0% • 45% HUMID</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
