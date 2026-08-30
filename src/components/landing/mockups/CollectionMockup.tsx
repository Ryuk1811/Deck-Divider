import React, { useState } from 'react';
import { Shield, Sparkles, Filter, ArrowUpRight, CheckCircle2, Layers } from 'lucide-react';
import { DisplayCurrency } from '../../../types';
import { CardImage } from '../../CardImage';

interface CollectionMockupProps {
  currency?: DisplayCurrency;
}

export const CollectionMockup: React.FC<CollectionMockupProps> = ({ currency = 'USD' }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'slabs' | 'raw'>('all');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const sampleCards = [
    {
      id: 1,
      name: 'Charizard ex',
      set: '151 (Special Illustration)',
      num: '199/165',
      grade: 'PSA 10',
      gradeCompany: 'PSA',
      gradeScore: 10,
      certNumber: '83921044',
      price: 245.5,
      gain: '+32.4%',
      image: 'https://images.pokemontcg.io/sv3pt5/199_hires.png',
      rarity: 'Special Illustration Rare',
      isGraded: true,
    },
    {
      id: 2,
      name: 'Umbreon VMAX',
      set: 'Evolving Skies (Moonbreon)',
      num: '215/203',
      grade: 'BGS 9.5',
      gradeCompany: 'BGS',
      gradeScore: 9.5,
      certNumber: '001482910',
      price: 1120.0,
      gain: '+48.1%',
      image: 'https://images.pokemontcg.io/swsh7/215_hires.png',
      rarity: 'Secret Rare',
      isGraded: true,
    },
    {
      id: 3,
      name: 'Giratina V',
      set: 'Lost Origin (Alt Art)',
      num: '186/196',
      grade: 'Raw (Near Mint)',
      gradeCompany: 'RAW',
      gradeScore: null,
      certNumber: null,
      price: 430.0,
      gain: '+15.2%',
      image: 'https://images.pokemontcg.io/swsh11/186_hires.png',
      rarity: 'Alternate Art',
      isGraded: false,
    },
    {
      id: 4,
      name: 'Gengar VMAX',
      set: 'Fusion Strike (Alt Art)',
      num: '271/264',
      grade: 'CGC 10',
      gradeCompany: 'CGC',
      gradeScore: 10,
      certNumber: '40918230',
      price: 490.0,
      gain: '+22.8%',
      image: 'https://images.pokemontcg.io/swsh8/271_hires.png',
      rarity: 'Secret Rare',
      isGraded: true,
    },
  ];

  const filteredCards = sampleCards.filter((card) => {
    if (activeFilter === 'slabs') return card.isGraded;
    if (activeFilter === 'raw') return !card.isGraded;
    return true;
  });

  return (
    <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden text-left select-none shadow-sm">
      {/* Mockup Top Window Bar */}
      <div className="bg-white px-4 py-3 text-[#0F172A] flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          </div>
          <span className="text-[11px] font-mono text-[#64748B] ml-2">My Collection Vault</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-mono text-emerald-700 flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            Live Market Sync
          </span>
        </div>
      </div>

      {/* Collection Stats Bar */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">Total Value</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A]">$14,892.40</div>
          <div className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +$2,340 (30d)
          </div>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">Total Cards</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A]">342</div>
          <div className="text-[10px] font-mono text-[#64748B]">88 Graded Slabs</div>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">PSA 10 Ratio</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#DC143C]">64.2%</div>
          <div className="text-[10px] font-mono text-[#64748B]">56 Gem Mint</div>
        </div>

        <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <div className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider">Average Card</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A]">$43.54</div>
          <div className="text-[10px] font-mono text-emerald-600">Top: Umbreon</div>
        </div>
      </div>

      {/* Control / Filter Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#DC143C] text-white shadow-xs'
                : 'bg-[#F4F4F6] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            All Cards (342)
          </button>
          <button
            onClick={() => setActiveFilter('slabs')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeFilter === 'slabs'
                ? 'bg-[#DC143C] text-white shadow-xs'
                : 'bg-[#F4F4F6] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Graded Slabs (88)
          </button>
          <button
            onClick={() => setActiveFilter('raw')}
            className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors cursor-pointer ${
              activeFilter === 'raw'
                ? 'bg-[#DC143C] text-white shadow-xs'
                : 'bg-[#F4F4F6] text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Raw Binder (254)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
          <span className="hidden sm:inline">Sort: Value (High to Low)</span>
        </div>
      </div>

      {/* Cards Display Grid */}
      <div className="p-3.5 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8FAFC] relative overflow-hidden">
        {/* Continuous Active Laser Scan Line */}
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#DC143C]/80 to-transparent pointer-events-none z-10 animate-[bounce_4s_infinite_ease-in-out]" />
        
        {filteredCards.map((card) => {
          const isSlab = card.isGraded;
          return (
            <div
              key={card.id}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative rounded-xl transition-all duration-200 cursor-pointer overflow-hidden border ${
                hoveredCard === card.id
                  ? 'border-[#DC143C] shadow-md -translate-y-1 bg-white ring-1 ring-[#DC143C]/20'
                  : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] shadow-2xs'
              }`}
            >
              {/* Slab Header if Graded */}
              {isSlab && (
                <div
                  className={`px-2.5 py-1 flex items-center justify-between text-[10px] font-mono font-bold text-white ${
                    card.gradeCompany === 'PSA'
                      ? 'bg-[#DC143C]'
                      : card.gradeCompany === 'BGS'
                      ? 'bg-[#B45309]'
                      : 'bg-[#2563EB]'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    {card.gradeCompany}
                  </span>
                  <span className="bg-white/25 px-1.5 py-0.2 rounded text-[10px] font-bold">
                    {card.gradeScore}
                  </span>
                </div>
              )}

              {/* Card Image Container */}
              <div className="p-2 pb-1 relative aspect-[3/4] flex items-center justify-center bg-[#F8FAFC]">
                <CardImage
                  src={card.image}
                  alt={card.name}
                  cardName={card.name}
                  loading="lazy"
                  className="w-full h-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
                />
                {hoveredCard === card.id && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/40 pointer-events-none rounded-lg mix-blend-overlay"></div>
                )}
              </div>

              {/* Card Metadata */}
              <div className="p-2.5 pt-1.5 border-t border-[#F1F5F9] bg-white">
                <div className="font-bold text-xs text-[#0F172A] truncate font-heading">{card.name}</div>
                <div className="text-[10px] text-[#64748B] truncate font-mono">{card.num} • {card.set}</div>
                <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-[#F8FAFC]">
                  <div className="text-xs font-bold font-mono text-[#0F172A]">
                    ${card.price.toFixed(2)}
                  </div>
                  <div className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 py-0.5 rounded">
                    {card.gain}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
