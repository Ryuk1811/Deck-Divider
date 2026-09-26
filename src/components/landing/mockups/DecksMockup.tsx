import React, { useState } from 'react';
import { Layers, ShieldCheck, Download } from 'lucide-react';
import { DisplayCurrency } from '../../../types';
import { CardImage } from '../../ui/CardImage';

interface DecksMockupProps {
  currency?: DisplayCurrency;
}

export const DecksMockup: React.FC<DecksMockupProps> = ({ currency = 'USD' }) => {
  const [selectedTab, setSelectedTab] = useState<'all' | 'pokemon' | 'trainers' | 'energy'>('all');

  const deckCards = [
    { name: 'Charizard ex', count: 3, type: 'pokemon', num: '199/165', image: 'https://images.pokemontcg.io/sv3pt5/199.png' },
    { name: 'Charmander', count: 4, type: 'pokemon', num: '004/165', image: 'https://images.pokemontcg.io/sv3pt5/4.png' },
    { name: 'Pidgeot ex', count: 2, type: 'pokemon', num: '164/197', image: 'https://images.pokemontcg.io/sv3/164.png' },
    { name: 'Pidgey', count: 2, type: 'pokemon', num: '162/197', image: 'https://images.pokemontcg.io/sv3/162.png' },
    { name: 'Radiant Charizard', count: 1, type: 'pokemon', num: '020/159', image: 'https://images.pokemontcg.io/swsh12pt5/20.png' },
    { name: 'Rotom V', count: 1, type: 'pokemon', num: '058/196', image: 'https://images.pokemontcg.io/swsh11/58.png' },
    { name: 'Rare Candy', count: 4, type: 'trainers', num: '191/198', image: 'https://images.pokemontcg.io/sv1/191.png' },
    { name: "Boss's Orders", count: 3, type: 'trainers', num: '172/193', image: 'https://images.pokemontcg.io/sv2/172.png' },
    { name: "Professor's Research", count: 4, type: 'trainers', num: '189/198', image: 'https://images.pokemontcg.io/sv1/189.png' },
    { name: 'Ultra Ball', count: 4, type: 'trainers', num: '196/198', image: 'https://images.pokemontcg.io/sv1/196.png' },
    { name: 'Fire Energy (Basic)', count: 6, type: 'energy', num: '002/SVE', image: 'https://images.pokemontcg.io/sve/2.png' },
  ];

  const filteredCards = deckCards.filter((c) => {
    if (selectedTab === 'all') return true;
    return c.type === selectedTab;
  });

  return (
    <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden text-left select-none shadow-sm">
      {/* Top Window Bar */}
      <div className="bg-white px-4 py-3 text-[#0F172A] flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          </div>
          <Layers className="w-4 h-4 text-[#DC143C] ml-1.5" />
          <span className="text-xs font-semibold font-mono">Tournament Deck Builder</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Standard Legal
          </span>
        </div>
      </div>

      {/* Deck Header & Overview */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-[#0F172A] font-heading">Charizard ex / Pidgeot Control</h4>
              <span className="px-2 py-0.5 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[10px] font-bold font-mono">
                Tier 1 Meta
              </span>
            </div>
            <p className="text-xs font-mono text-[#64748B] mt-0.5">Estimated Deck Value: $142.80 • 60 / 60 Cards Complete</p>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#0F172A] rounded-lg text-xs font-semibold font-mono flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
              <Download className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Export PTCGL List</span>
            </button>
          </div>
        </div>

        {/* 60 Card Ratio Bar */}
        <div className="bg-white p-3 rounded-lg border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#64748B]">Deck Composition: 60/60 Cards</span>
            <span className="font-semibold text-[#0F172A]">Pokémon (18) • Trainers (34) • Energy (8)</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100 flex overflow-hidden">
            <div style={{ width: '30%' }} className="bg-[#DC143C] h-full" title="Pokémon: 18 Cards" />
            <div style={{ width: '56.6%' }} className="bg-blue-600 h-full" title="Trainers: 34 Cards" />
            <div style={{ width: '13.4%' }} className="bg-amber-500 h-full" title="Energy: 8 Cards" />
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-[#64748B] pt-0.5">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#DC143C]"></span> Pokémon 18 (30%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600"></span> Trainers 34 (56.6%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Energy 8 (13.4%)</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2 bg-white border-b border-[#E2E8F0] flex items-center gap-2">
        {(['all', 'pokemon', 'trainers', 'energy'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-2.5 py-1 rounded-md text-xs font-mono capitalize transition-colors cursor-pointer ${
              selectedTab === tab
                ? 'bg-[#DC143C] text-white font-bold shadow-xs'
                : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Visual Deck Matrix */}
      <div className="p-3.5 sm:p-4 grid grid-cols-3 sm:grid-cols-6 gap-2.5 bg-[#F8FAFC]">
        {filteredCards.slice(0, 6).map((card, idx) => (
          <div key={idx} className="group relative rounded-xl border border-[#E2E8F0] p-1.5 bg-white hover:border-[#DC143C] transition-all shadow-2xs">
            <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-1">
              <CardImage
                src={card.image}
                alt={card.name}
                cardName={card.name}
                loading="lazy"
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
              <span className="absolute top-1 right-1 bg-[#0F172A] text-white text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shadow">
                x{card.count}
              </span>
            </div>
            <div className="mt-1.5 text-[11px] font-bold text-[#0F172A] truncate font-heading">
              {card.name}
            </div>
            <div className="text-[9px] font-mono text-[#64748B] truncate">
              {card.num}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
