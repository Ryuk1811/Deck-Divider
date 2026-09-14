import React from 'react';
import { motion } from 'motion/react';
import {
  Database,
  Zap,
  ShieldCheck,
  Coins,
  Layers,
  Award,
  Box,
  FileSpreadsheet,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CollectorSocialProofSectionProps {
  onOpenAuth?: () => void;
  onEnterApp?: () => void;
}

export const CollectorSocialProofSection: React.FC<CollectorSocialProofSectionProps> = ({
  onOpenAuth,
  onEnterApp,
}) => {
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  const primaryMetrics = [
    {
      stat: '18,400+',
      label: 'Cards Indexed',
      sub: 'Base Set (1999) through SV Expansions',
      icon: <Database className="w-5 h-5 text-[#DC143C]" />,
    },
    {
      stat: '< 5ms',
      label: 'Search Latency',
      sub: 'Client-side in-memory query engine',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      stat: '100%',
      label: 'Format Verification',
      sub: 'H, I, J Standard regulation mark checks',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    },
    {
      stat: '15+',
      label: 'Fiat Currencies',
      sub: 'Daily forex market exchange sync',
      icon: <Coins className="w-5 h-5 text-sky-500" />,
    },
  ];

  const coreCapabilities = [
    {
      title: 'Verified Market Pricing Engine',
      desc: 'Market values synced daily from verified TCGplayer sales and completed eBay sold comps. Tracks raw condition spreads (NM, LP, MP, HP, DMG) and graded slab premiums.',
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      badge: 'Live Data',
    },
    {
      title: 'Graded Slab Registry (PSA, BGS, CGC, ACE)',
      desc: 'First-class certificate number tracking with full quad-subgrade recording (Centering, Surface, Corners, Edges) and historical graded price trendlines.',
      icon: <Award className="w-5 h-5 text-fuchsia-600" />,
      badge: 'Certified',
    },
    {
      title: 'Factory-Sealed Product Vault',
      desc: 'Dedicated acquisition basis tracking for booster boxes, cases, Pokémon Center Elite Trainer Boxes, and bundles to monitor true profit/loss and break-even points.',
      icon: <Box className="w-5 h-5 text-amber-600" />,
      badge: 'Sealed Assets',
    },
    {
      title: 'Open Data Export & Zero Vendor Lock-in',
      desc: 'Your collection data belongs to you. Full CSV and JSON export/import anytime, with optional local client-side AES-GCM encryption for complete privacy.',
      icon: <FileSpreadsheet className="w-5 h-5 text-emerald-600" />,
      badge: '100% Portable',
    },
  ];

  return (
    <section className="w-full py-12 sm:py-16 md:py-20 lg:py-24 my-8 sm:my-12 lg:my-16 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 bg-[#FAFAFA] border-y border-slate-200/80 relative overflow-hidden">
      <div className="w-full max-w-[2200px] mx-auto space-y-8 sm:space-y-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[11px] font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Systems Offering</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Systems Offering &amp; Platform Metrics
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Real data coverage, zero-lag client architecture, and tournament-grade validation built into every module.
          </p>
        </div>

        {/* 4 Primary Tangible Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {primaryMetrics.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.06, ease: easeCurve }}
              className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                  Verified
                </span>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-heading">
                  {item.stat}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {item.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Capabilities Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {coreCapabilities.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: easeCurve }}
              className="bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                      {cap.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 font-heading">
                      {cap.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/80 shrink-0">
                    {cap.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technical Data Transparency Banner */}
        <div className="bg-slate-900 text-white rounded-xl sm:rounded-2xl p-5 sm:p-7 max-w-6xl mx-auto border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>Zero-Tracker &amp; Open Portability Standard</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Complete data sovereignty with no third-party ad brokers
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Every binder entry, deck list, and acquisition price remains your private asset. Export your complete catalog in standardized CSV format at any time.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/socials"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Socials &amp; Reviews</span>
            </Link>
            <button
              onClick={onEnterApp || onOpenAuth}
              className="px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
