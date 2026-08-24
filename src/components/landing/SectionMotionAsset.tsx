import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Zap, CheckCircle2, Search, Bell, Award, Shield } from 'lucide-react';

interface SectionMotionAssetProps {
  sectionId: string;
  reversed?: boolean;
}

export const SectionMotionAsset: React.FC<SectionMotionAssetProps> = ({ sectionId }) => {
  switch (sectionId) {
    case 'collection':
      return (
        <motion.div
          animate={{
            y: [0, -8, 2, 0],
          }}
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-5 -right-3 sm:-top-7 sm:-right-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5 relative overflow-hidden">
            {/* Autonomous subtle laser scan line sweep */}
            <motion.div
              animate={{ x: ['-150%', '250%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-[#DC143C]/20 to-transparent skew-x-12 pointer-events-none"
            />
            <div className="w-7 h-7 rounded-lg bg-[#DC143C] text-white flex items-center justify-center font-black text-[11px] shadow-xs">
              10
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider flex items-center gap-1">
                PSA VERIFIED <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <div className="text-emerald-600 font-num text-[11px]">CERT #83921044</div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 ml-0.5" />
          </div>
        </motion.div>
      );

    case 'metrics':
      return (
        <motion.div
          animate={{
            y: [0, -10, 3, 0],
          }}
          transition={{
            duration: 7.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-5 -left-3 sm:-top-7 sm:-left-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider flex items-center justify-between">
                <span>TCGplayer Market Sold</span>
                <span className="text-[8px] text-emerald-600 font-bold ml-2">LIVE</span>
              </div>
              <div className="text-emerald-700 font-num font-extrabold text-[11px]">
                Charizard ex +34.2% ↑ $245.50
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'decks':
      return (
        <motion.div
          animate={{
            y: [0, -7, 4, 0],
          }}
          transition={{
            duration: 5.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Play! Pokémon Compliance
              </div>
              <div className="text-indigo-700 font-bold text-[11px] flex items-center gap-1.5">
                <span>STANDARD 60/60</span>
                <span className="text-[9px] bg-indigo-50 border border-indigo-200 px-1 rounded text-indigo-800">
                  BLOCK H
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'sets':
      return (
        <motion.div
          animate={{
            y: [0, -9, 2, 0],
          }}
          transition={{
            duration: 6.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-5 -right-3 sm:-top-7 sm:-right-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                151 Master Set Progress
              </div>
              <div className="text-purple-700 font-bold text-[11px] flex items-center gap-1.5">
                <span>151/165 (91.5%)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></span>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'search':
      return (
        <motion.div
          animate={{
            y: [0, -8, 3, 0],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-5 -left-3 sm:-bottom-6 sm:-left-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Database Index Matrix
              </div>
              <div className="text-slate-800 font-bold text-[11px] flex items-center gap-1.5">
                <span>18,420 CARDS</span>
                <span className="text-[9px] bg-slate-100 px-1 rounded text-emerald-600 font-mono font-bold">
                  0.04s
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'lists':
      return (
        <motion.div
          animate={{
            y: [0, -9, 4, 0],
            rotate: [0, -1, 1, 0],
          }}
          transition={{
            duration: 7.0,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-5 -left-3 sm:-top-7 sm:-left-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Grail Chase Alert Triggered
              </div>
              <div className="text-amber-700 font-bold text-[11px]">
                MOONBREON &lt; $820.00 NM
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'sealed-vault':
    case 'vault':
      return (
        <motion.div
          animate={{
            y: [0, -8, 2, 0],
          }}
          transition={{
            duration: 6.4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-5 z-20 pointer-events-none transform-gpu will-change-transform"
        >
          <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-200 shadow-xl flex items-center gap-2.5 text-xs font-mono font-bold text-slate-800 ring-1 ring-slate-900/5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-500 font-sans uppercase tracking-wider">
                Vault Storage & Backup
              </div>
              <div className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <span>UV 0% • 45% HUMIDITY</span>
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              </div>
            </div>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
};
