import React, { useState } from 'react';
import { ArrowUpRight, Activity } from 'lucide-react';
import { DisplayCurrency } from '../../../types';

interface MetricsMockupProps {
  currency?: DisplayCurrency;
}

export const MetricsMockup: React.FC<MetricsMockupProps> = ({ currency = 'USD' }) => {
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y' | 'ALL'>('30D');

  const eraBreakdown = [
    { era: 'Scarlet & Violet', percentage: 42, value: '$6,254.80', color: 'bg-[#DC143C]' },
    { era: 'Sword & Shield', percentage: 35, value: '$5,212.30', color: 'bg-blue-600' },
    { era: 'Sun & Moon', percentage: 14, value: '$2,084.90', color: 'bg-amber-500' },
    { era: 'Vintage (WOTC)', percentage: 9, value: '$1,340.40', color: 'bg-emerald-600' },
  ];

  const topGainers = [
    { name: 'Charizard ex #199', set: '151', price: '$245.50', change: '+34.2%', isUp: true },
    { name: 'Gengar VMAX #271', set: 'Fusion Strike', price: '$490.00', change: '+22.8%', isUp: true },
    { name: 'Moonbreon VMAX', set: 'Evolving Skies', price: '$1,120.00', change: '+18.4%', isUp: true },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden text-left select-none shadow-sm">
      {/* Mockup Header */}
      <div className="bg-white px-4 py-3 text-[#0F172A] flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          </div>
          <Activity className="w-4 h-4 text-[#DC143C] ml-1.5" />
          <span className="text-xs font-semibold font-mono">Portfolio Value & Performance</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Live Exchange Rates
          </span>
        </div>
      </div>

      <div className="p-3.5 sm:p-4 space-y-3.5 bg-[#F8FAFC]">
        {/* Main Chart Card */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B]">Total Portfolio Value</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono text-[#0F172A]">$14,892.40</span>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24.8% ($2,960)
                </span>
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center bg-[#F4F4F6] p-1 rounded-lg border border-[#E2E8F0] text-xs font-mono">
              {(['7D', '30D', '90D', '1Y', 'ALL'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                    timeframe === tf
                      ? 'bg-white text-[#0F172A] shadow-xs'
                      : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Smooth NAV Chart */}
          <div className="h-32 w-full pt-2">
            <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="metricsNavGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC143C" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#DC143C" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#F1F5F9" strokeWidth="1" />

              {/* Area */}
              <path
                d="M 0,110 L 0,85 C 40,80 80,95 120,70 C 160,50 200,65 240,45 C 280,30 320,55 360,35 C 400,20 450,25 500,10 L 500,110 Z"
                fill="url(#metricsNavGradient)"
              />
              {/* Line */}
              <path
                d="M 0,85 C 40,80 80,95 120,70 C 160,50 200,65 240,45 C 280,30 320,55 360,35 C 400,20 450,25 500,10"
                fill="none"
                stroke="#DC143C"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Interactive Endpoint marker */}
              <circle cx="500" cy="10" r="4" fill="#DC143C" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* 2-Column Split: Era Breakdown & Top Gainers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Era Allocation Card */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] font-heading">Era Asset Allocation</span>
              <span className="text-[10px] font-mono text-[#64748B]">4 Eras</span>
            </div>
            <div className="space-y-2">
              {eraBreakdown.map((era, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span className="text-[#64748B]">{era.era}</span>
                    <span className="font-semibold text-[#0F172A]">{era.percentage}% ({era.value})</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${era.percentage}%` }}
                      className={`h-full rounded-full ${era.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Gainers Card */}
          <div className="bg-white p-3.5 rounded-xl border border-[#E2E8F0] shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A] font-heading">Top Market Performers</span>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold">30-Day Window</span>
            </div>
            <div className="space-y-2">
              {topGainers.map((g, i) => (
                <div key={i} className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#0F172A] truncate text-[11px]">{g.name}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{g.set}</div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="font-bold text-[#0F172A]">{g.price}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold">{g.change}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
