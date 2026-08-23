import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Zap, CheckCircle2, Search, Bell, Award } from 'lucide-react';

interface SectionMotionAssetProps {
  sectionId: string;
  reversed?: boolean;
}

export const SectionMotionAsset: React.FC<SectionMotionAssetProps> = ({ sectionId }) => {
  switch (sectionId) {
    case 'collection':
      return (
        <div className="absolute -top-5 -right-3 sm:-top-7 sm:-right-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-[#DC143C] text-white flex items-center justify-center font-black text-[10px]">
              10
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">PSA Verified</div>
              <div className="text-emerald-600 font-num">GEM MINT #83921044</div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 ml-1" />
          </div>
        </div>
      );

    case 'metrics':
      return (
        <div className="absolute -top-5 -left-3 sm:-top-7 sm:-left-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Unrealized Capital Gain</div>
              <div className="text-emerald-700 font-num font-extrabold">+34.2% (+$1,840.50)</div>
            </div>
          </div>
        </div>
      );

    case 'decks':
      return (
        <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Format Engine</div>
              <div className="text-indigo-700 font-bold">STANDARD 60/60 LEGAL</div>
            </div>
          </div>
        </div>
      );

    case 'sets':
      return (
        <div className="absolute -top-5 -right-3 sm:-top-7 sm:-right-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center">
              <Award className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Master Set Completion</div>
              <div className="text-purple-700 font-bold">151/165 (91.5% COMPLETE)</div>
            </div>
          </div>
        </div>
      );

    case 'search':
      return (
        <div className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Search className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Instant Filter Matrix</div>
              <div className="text-slate-800 font-bold">0.04s LATENCY INDEX</div>
            </div>
          </div>
        </div>
      );

    case 'lists':
      return (
        <div className="absolute -top-5 -left-3 sm:-top-7 sm:-left-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Live Buy Alert Trigger</div>
              <div className="text-amber-700 font-bold">TARGET HIT: $820.00</div>
            </div>
          </div>
        </div>
      );

    case 'vault':
      return (
        <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-5 z-20 pointer-events-none">
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-lg flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-sans uppercase tracking-wider">Storage Insurance</div>
              <div className="text-emerald-700 font-bold">LLOYD'S UNDERWRITTEN</div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
