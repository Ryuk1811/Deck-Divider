import React, { useState } from 'react';
import { BookOpen, Trophy } from 'lucide-react';
import { DisplayCurrency } from '../../../types';

interface SetsMockupProps {
  currency?: DisplayCurrency;
}

export const SetsMockup: React.FC<SetsMockupProps> = ({ currency = 'USD' }) => {
  const sets = [
    {
      id: 'sv3pt5',
      name: 'Scarlet & Violet — 151',
      series: 'Scarlet & Violet',
      totalCards: 207,
      ownedCards: 189,
      secretRaresOwned: 14,
      totalSecretRares: 16,
      logo: 'https://images.pokemontcg.io/sv3pt5/logo.png',
      releaseDate: 'Sep 2023',
      completionPercentage: 91.3,
    },
    {
      id: 'swsh12pt5',
      name: 'Crown Zenith',
      series: 'Sword & Shield',
      totalCards: 230,
      ownedCards: 214,
      secretRaresOwned: 28,
      totalSecretRares: 30,
      logo: 'https://images.pokemontcg.io/swsh12pt5/logo.png',
      releaseDate: 'Jan 2023',
      completionPercentage: 93.0,
    },
    {
      id: 'sv4pt5',
      name: 'Paldean Fates',
      series: 'Scarlet & Violet',
      totalCards: 245,
      ownedCards: 198,
      secretRaresOwned: 42,
      totalSecretRares: 54,
      logo: 'https://images.pokemontcg.io/sv4pt5/logo.png',
      releaseDate: 'Jan 2024',
      completionPercentage: 80.8,
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden text-left select-none shadow-sm">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 text-[#0F172A] flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          </div>
          <BookOpen className="w-4 h-4 text-[#DC143C] ml-1.5" />
          <span className="text-xs font-semibold font-mono">Master Set Tracker</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
            148+ Expansions Cataloged
          </span>
        </div>
      </div>

      {/* Sets List */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] space-y-3">
        {sets.map((set) => (
          <div
            key={set.id}
            className="p-3.5 sm:p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-xs hover:border-[#DC143C] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#0F172A] font-heading">{set.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {set.series}
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                  {set.ownedCards} of {set.totalCards} cards collected • {set.secretRaresOwned}/{set.totalSecretRares} Secret Rares
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-[#0F172A]">{set.completionPercentage}%</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-semibold">
                    {set.totalCards - set.ownedCards} to Complete
                  </div>
                </div>
                {set.completionPercentage > 90 ? (
                  <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                    <Trophy className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono text-xs font-bold border border-slate-200">
                    {Math.round(set.completionPercentage)}%
                  </div>
                )}
              </div>
            </div>

            {/* Set Progress Bar */}
            <div className="space-y-1">
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${set.completionPercentage}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#DC143C] to-rose-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
