import React, { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  Zap,
  Download,
  AlertTriangle,
  ChevronLeft,
  PieChart as PieIcon,
  Layers,
  Swords,
  Grid3X3,
  List as ListIcon
} from 'lucide-react';
import { Deck, PortfolioCardEntry, PokemonCard } from '../types';
import { decodeUrlParamToDeck } from '../utils/deckUrlEncoder';
import { getCardById, mapToPokemonCard } from '../lib/searchEngine';
import { HolographicCard } from '../components/HolographicCard';
import { CardImage } from '../components/CardImage';
import { formatCurrency } from '../utils/formatters';

interface PublicDeckViewProps {
  deckId?: string;
  encodedData?: string;
  onOpenFullApp: () => void;
  activeCurrency: string;
  onCurrencyChange: (currency: string) => void;
}

// Function to format deck as PTCGL text
function formatPTCGL(entries: PortfolioCardEntry[]): string {
  const pokemon: string[] = [];
  const trainers: string[] = [];
  const energy: string[] = [];

  entries.forEach(entry => {
    const sup = (entry.card.supertype || '').toLowerCase();
    const line = `${entry.quantity} ${entry.card.name} ${entry.card.set?.name || ''} ${entry.card.number || ''}`;
    
    if (sup.includes('pokémon') || sup.includes('pokemon')) {
      pokemon.push(line);
    } else if (sup.includes('energy')) {
      energy.push(line);
    } else {
      trainers.push(line);
    }
  });

  return [
    `Pokémon: ${pokemon.length}`,
    ...pokemon,
    '',
    `Trainer: ${trainers.length}`,
    ...trainers,
    '',
    `Energy: ${energy.length}`,
    ...energy,
    '',
    `Total Cards: ${entries.reduce((acc, c) => acc + c.quantity, 0)}`
  ].join('\n');
}

export const PublicDeckView: React.FC<PublicDeckViewProps> = ({
  deckId,
  encodedData,
  onOpenFullApp,
  activeCurrency,
  onCurrencyChange
}) => {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'stack' | 'list'>('stack');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPtcgl, setCopiedPtcgl] = useState(false);
  
  // Hydrate card data with search engine
  const hydrateDeck = (partialDeck: Partial<Deck>) => {
    if (!partialDeck.entries) return partialDeck as Deck;
    
    const hydratedCards: PortfolioCardEntry[] = partialDeck.entries.map(entry => {
      const tcgdexId = entry.card.id;
      const fullCardData = tcgdexId ? getCardById(tcgdexId) : null;
      
      if (fullCardData) {
        return {
          ...entry,
          card: mapToPokemonCard(fullCardData)
        };
      }
      return entry;
    });
    
    return { ...partialDeck, entries: hydratedCards } as Deck;
  };

  useEffect(() => {
    let isMounted = true;
    
    const loadDeck = async () => {
      setIsLoading(true);
      setError(null);
      
      let loadedDeck: Partial<Deck> | null = null;
      
      if (encodedData) {
        loadedDeck = decodeUrlParamToDeck(encodedData);
      }
      
      if (!isMounted) return;
      
      if (loadedDeck) {
        // Hydrate and set immediately since App.tsx already initialized searchEngine
        setDeck(hydrateDeck(loadedDeck));
        setIsLoading(false);
      } else {
        setError('Deck not found or is not public.');
        setIsLoading(false);
      }
    };
    
    loadDeck();
    
    return () => {
      isMounted = false;
    };
  }, [deckId, encodedData]);

  // Statistics
  const totalCardsCount = useMemo(() => deck?.entries.reduce((acc, c) => acc + c.quantity, 0) || 0, [deck]);
  
  const stats = useMemo(() => {
    if (!deck) return { pokemon: 0, trainer: 0, energy: 0, totalValue: 0 };
    let pokemon = 0;
    let trainer = 0;
    let energy = 0;
    let totalValue = 0;
    
    deck.entries.forEach(entry => {
      const sup = (entry.card.supertype || '').toLowerCase();
      if (sup.includes('pokémon') || sup.includes('pokemon')) pokemon += entry.quantity;
      else if (sup.includes('energy')) energy += entry.quantity;
      else trainer += entry.quantity;
      
      const price = (entry.card.prices?.raw || 1.5) * entry.quantity;
      totalValue += price;
    });
    
    return { pokemon, trainer, energy, totalValue };
  }, [deck]);
  
  const isStandardLegal = totalCardsCount === 60; // Simplified check for public view

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPtcgl = async () => {
    if (!deck) return;
    try {
      await navigator.clipboard.writeText(formatPTCGL(deck.entries));
      setCopiedPtcgl(true);
      setTimeout(() => setCopiedPtcgl(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-slate-900 font-bold text-xl">Loading Deck...</h2>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full shadow-xl text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-500 mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-slate-900 font-bold text-2xl">Deck Not Found</h2>
          <p className="text-slate-500">{error || 'This link may be invalid or the deck was made private.'}</p>
          <button
            onClick={onOpenFullApp}
            className="w-full mt-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
          >
            Go to DECK / divider
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-y-auto">
      {/* Top Banner (Header) */}
      <div className="bg-slate-900 text-white sticky top-0 z-40 shadow-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenFullApp}
              className="flex items-center gap-2 hover:bg-slate-800 p-2 rounded-lg transition text-slate-300 hover:text-white"
            >
              <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-inner">
                <span className="font-black text-[10px] text-white">D</span>
              </div>
              <span className="font-bold text-sm tracking-wide hidden sm:block">DECK / divider</span>
            </button>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <select
              value={activeCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-slate-800 border-none text-xs text-slate-300 rounded-lg py-1.5 px-2 focus:ring-1 focus:ring-cyan-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 pb-24">
        {/* Deck Header Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: deck.colorHex || '#06B6D4' }} />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    isStandardLegal ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    Format
                  </span>
                  <span className="text-slate-400 text-xs">
                    {totalCardsCount}/60 Cards
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">{deck.name}</h1>
                {deck.description && (
                  <p className="text-slate-500 mt-2 text-sm max-w-2xl">{deck.description}</p>
                )}
              </div>
              
              {/* Stats Bar */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-600 font-medium">
                  <Zap className="w-4 h-4 text-cyan-500" />
                  <span>{stats.pokemon} Pokémon</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-600 font-medium">
                  <Layers className="w-4 h-4 text-blue-500" />
                  <span>{stats.trainer} Trainer</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-600 font-medium">
                  <PieIcon className="w-4 h-4 text-emerald-500" />
                  <span>{stats.energy} Energy</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-slate-600 font-bold ml-auto md:ml-0">
                  <span className="text-slate-400 font-normal mr-1">Est. Value</span>
                  {formatCurrency(stats.totalValue, activeCurrency as any)}
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={handleCopyPtcgl}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition"
              >
                {copiedPtcgl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedPtcgl ? 'Exported!' : 'Export PTCGL'}</span>
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition shadow-sm"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Toggles */}
        <div className="flex items-center justify-end mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
            <button
              onClick={() => setViewMode('stack')}
              className={`p-2 rounded-lg flex items-center gap-2 transition ${viewMode === 'stack' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              title="Stacked View"
            >
              <Layers className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Stacks</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg flex items-center gap-2 transition ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg flex items-center gap-2 transition ${viewMode === 'list' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-700'}`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">List</span>
            </button>
          </div>
        </div>

        {/* Deck Contents */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {deck.entries.map(entry => (
              <div key={entry.card.id} className="relative group">
                <HolographicCard card={entry.card} className="w-full">
                  <div className="absolute top-2 right-2 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-xl border border-slate-700 z-10 pointer-events-none">
                    {entry.quantity}
                  </div>
                  <CardImage card={entry.card} className="w-full h-auto rounded-xl shadow-lg" />
                </HolographicCard>
              </div>
            ))}
          </div>
        )}

        {viewMode === 'stack' && (
          <div className="space-y-12">
            {[
              { label: 'Pokémon', count: stats.pokemon, icon: Zap, filter: (c: PokemonCard) => (c.supertype || '').toLowerCase().includes('pokémon') },
              { label: 'Trainer', count: stats.trainer, icon: Layers, filter: (c: PokemonCard) => { const sup = (c.supertype || '').toLowerCase(); return sup.includes('trainer') || sup.includes('supporter') || sup.includes('item'); } },
              { label: 'Energy', count: stats.energy, icon: PieIcon, filter: (c: PokemonCard) => (c.supertype || '').toLowerCase().includes('energy') }
            ].map((section, idx) => {
              if (section.count === 0) return null;
              const sectionCards = deck.entries.filter(e => section.filter(e.card));
              
              return (
                <div key={idx} className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <section.icon className="w-5 h-5 text-slate-400" />
                    <h3 className="font-bold text-lg text-slate-800">{section.label}</h3>
                    <span className="text-slate-400 font-mono text-sm ml-2 bg-slate-100 px-2 py-0.5 rounded-md">{section.count}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {sectionCards.map(entry => (
                      <div key={entry.card.id} className="relative group">
                        <HolographicCard card={entry.card} className="w-full">
                          <div className="absolute top-2 right-2 bg-slate-900 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm shadow-xl border border-slate-700 z-10 pointer-events-none">
                            {entry.quantity}
                          </div>
                          <CardImage card={entry.card} className="w-full h-auto rounded-xl shadow-md" />
                        </HolographicCard>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold w-16">Qty</th>
                    <th className="px-6 py-4 font-semibold">Card Name</th>
                    <th className="px-6 py-4 font-semibold">Set</th>
                    <th className="px-6 py-4 font-semibold">Number</th>
                    <th className="px-6 py-4 font-semibold text-right">Unit Value</th>
                    <th className="px-6 py-4 font-semibold text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deck.entries.map((entry) => {
                    const price = entry.card.prices?.raw || 1.5;
                    return (
                      <tr key={entry.card.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{entry.quantity}</td>
                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 rounded border border-slate-200 overflow-hidden shrink-0 bg-white">
                            <CardImage card={entry.card} className="w-full h-full object-cover" />
                          </div>
                          {entry.card.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{entry.card.set?.name}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{entry.card.number}</td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(price, activeCurrency as any)}
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">
                          {formatCurrency((price * entry.quantity), activeCurrency as any)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
