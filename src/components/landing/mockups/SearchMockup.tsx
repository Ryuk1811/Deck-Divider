import React, { useState } from 'react';
import { Search, Flame } from 'lucide-react';
import { DisplayCurrency } from '../../../types';

interface SearchMockupProps {
  currency?: DisplayCurrency;
}

export const SearchMockup: React.FC<SearchMockupProps> = ({ currency = 'USD' }) => {
  const [query, setQuery] = useState('Charizard');

  const sampleResults = [
    {
      name: 'Charizard ex',
      set: 'Scarlet & Violet 151',
      number: '199/165',
      rarity: 'Special Illustration Rare',
      type: 'Fire',
      hp: 330,
      price: '$245.50',
      image: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
    },
    {
      name: 'Charizard ex',
      set: 'Obsidian Flames',
      number: '223/197',
      rarity: 'Hyper Rare (Gold)',
      type: 'Darkness',
      hp: 330,
      price: '$68.00',
      image: 'https://images.pokemontcg.io/sv3/223_hires.png',
    },
    {
      name: 'Radiant Charizard',
      set: 'Crown Zenith',
      number: '020/159',
      rarity: 'Radiant Rare',
      type: 'Fire',
      hp: 160,
      price: '$8.50',
      image: 'https://images.pokemontcg.io/swsh12pt5/20_hires.png',
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden text-left select-none shadow-sm">
      {/* Top Window */}
      <div className="bg-white px-4 py-3 text-[#0F172A] flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          </div>
          <Search className="w-4 h-4 text-[#DC143C] ml-1.5" />
          <span className="text-xs font-semibold font-mono">Card Database Search</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0]">
          <span>Instant Real-Time Search</span>
        </div>
      </div>

      {/* Search Input and Filter Chips */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by card name, illustrator, attack, set..."
            className="w-full bg-white text-xs font-mono text-[#0F172A] pl-9 pr-20 py-2.5 rounded-lg border border-[#CBD5E1] focus:outline-none focus:border-[#DC143C] shadow-2xs"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-600 font-semibold border border-slate-200">
              ⌘K
            </span>
          </div>
        </div>

        {/* Multi-attribute Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="px-2 py-1 rounded-md bg-[#FFF0F3] text-[#DC143C] font-semibold border border-[#DC143C]/20 flex items-center gap-1">
            <Flame className="w-3 h-3" /> Type: Fire
          </span>
          <span className="px-2 py-1 rounded-md bg-white text-[#0F172A] border border-[#E2E8F0] font-medium shadow-2xs">
            HP ≥ 150
          </span>
          <span className="px-2 py-1 rounded-md bg-white text-[#0F172A] border border-[#E2E8F0] font-medium shadow-2xs">
            Rarity: Special Illustration / Secret
          </span>
          <span className="px-2 py-1 rounded-md bg-white text-[#0F172A] border border-[#E2E8F0] font-medium shadow-2xs">
            Format: Standard Legal
          </span>
        </div>
      </div>

      {/* Results Matrix */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sampleResults.map((card, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#DC143C] transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center p-2 mb-2">
                <img
                  src={card.image}
                  alt={card.name}
                  className="h-full object-contain hover:scale-105 transition-transform duration-200"
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />
              </div>

              <div className="font-bold text-xs text-[#0F172A] font-heading">{card.name}</div>
              <div className="text-[10px] font-mono text-[#64748B]">{card.set} • {card.number}</div>
              <div className="text-[10px] text-[#DC143C] font-semibold mt-0.5">{card.rarity}</div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between font-mono">
              <span className="text-xs font-bold text-[#0F172A]">{card.price}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                HP {card.hp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
