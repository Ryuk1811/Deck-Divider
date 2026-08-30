import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  Grid,
  Table,
} from 'lucide-react';
import { Deck, PortfolioCardEntry, PokemonCard } from '../types';
import { decodeUrlParamToDeck } from '../utils/deckUrlEncoder';
import { getCardById, mapToPokemonCard } from '../lib/searchEngine';
import { HolographicCard } from '../components/HolographicCard';
import { CardImage } from '../components/CardImage';
import { QuickLookModal } from '../components/QuickLookModal';
import { DeckDividerBrand } from '../components/DeckDividerBrand';
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
  const [viewMode, setViewMode] = useState<'binder' | 'table'>('binder');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPtcgl, setCopiedPtcgl] = useState(false);
  const [quickLookCard, setQuickLookCard] = useState<PokemonCard | null>(null);
  
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
          <Link
            to="/"
            onClick={() => onOpenFullApp && onOpenFullApp()}
            className="w-full mt-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition inline-block text-center"
          >
            Go to DECK / divider
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-y-auto">
      {/* Top Banner (Header) */}
      <div className="bg-white sticky top-0 z-40 border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3" aria-label="DECK / divider Home">
              <DeckDividerBrand />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={activeCurrency}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono font-bold text-[#0F172A] rounded-lg py-2 px-3 focus:ring-1 focus:ring-[#DC143C] outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
            <Link 
              to="/auth"
              onClick={() => onOpenFullApp && onOpenFullApp()}
              className="bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center"
            >
              Create Your Own Deck
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 pb-24 space-y-6">
        {/* Deck Header Info */}
        <div className="p-5 glass-slab shadow-md space-y-5">
          {/* Header Row: Title & Function Buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <div
                className="w-4 h-4 rounded-full border border-black/10 shadow-xs flex-shrink-0 mt-1 sm:mt-1.5"
                style={{ backgroundColor: deck.colorHex || '#DC143C' }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A] truncate">
                    {deck.name}
                  </h2>
                  <span className="font-mono text-[10px] sm:text-xs font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded flex-shrink-0">
                    {totalCardsCount}/60 Cards
                  </span>
                  <span className={`font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border ${
                    isStandardLegal ? 'bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/30' : 'bg-[#FFFBEB] text-[#D97706] border-[#D97706]/30'
                  }`}>
                    {isStandardLegal ? 'Standard Legal' : 'Standard Illegal'}
                  </span>
                </div>
                {deck.description && (
                  <p className="font-mono text-[11px] sm:text-xs text-[#64748B] mt-0.5 max-w-xl truncate">
                    {deck.description}
                  </p>
                )}
              </div>
            </div>

            {/* Function Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleCopyPtcgl}
                className="h-9 px-3 text-xs font-mono font-bold rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedPtcgl ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#64748B]" />}
                <span>{copiedPtcgl ? 'Exported' : 'PTCGL'}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyLink}
                className="h-9 px-3 text-xs font-mono font-bold rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white text-[#0F172A] flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Share2 className="w-3.5 h-3.5 text-[#64748B]" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* View Mode Switcher Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {[
                { id: 'binder', label: 'Binder View', icon: Grid },
                { id: 'table', label: 'Data Table', icon: Table },
              ].map((mode) => {
                const isActive = viewMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id as any)}
                    className={`h-9 px-3 text-xs font-mono font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer w-full sm:w-auto text-center ${
                      isActive
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#DC143C]' : 'text-[#64748B]'}`} />
                    <span className="truncate">{mode.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="font-mono text-xs text-[#0F172A] font-bold text-right sm:text-left flex-shrink-0 flex items-center gap-2 bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
              <span className="text-[#64748B]">Est. Value:</span>
              {formatCurrency(stats.totalValue, activeCurrency as any)}
            </div>
          </div>
        </div>

        {/* Deck Contents */}
        {viewMode === 'binder' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>Showing {deck.entries.length} unique cards in "{deck.name}"</span>
              <span>3D Holographic Canvas</span>
            </div>

            {deck.entries.length === 0 ? (
              <div className="text-center py-12 space-y-2 glass-slab shadow-md">
                <Layers className="w-8 h-8 text-[#CBD5E1] mx-auto" />
                <p className="font-heading font-bold text-sm text-[#0F172A]">
                  This deck has no active cards yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                {deck.entries.map((entry) => (
                  <div key={entry.card.id} className="relative group cursor-pointer">
                    <HolographicCard
                      card={entry.card}
                      currency={activeCurrency as any}
                      quantity={entry.quantity}
                      deckName={deck.name}
                      deckColor={deck.colorHex}
                      onClick={() => setQuickLookCard(entry.card)}
                      onQuickLook={() => setQuickLookCard(entry.card)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="overflow-x-auto glass-slab shadow-md">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                <tr>
                  <th className="p-3">Card Name</th>
                  <th className="p-3">Set</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit Value</th>
                  <th className="p-3">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {deck.entries.map((entry) => {
                  const price = entry.card.prices?.raw || 1.5;
                  return (
                    <tr key={entry.card.id} className="hover:bg-[#F8FAFC] transition-colors cursor-pointer" onClick={() => setQuickLookCard(entry.card)}>
                      <td className="p-3 font-heading font-semibold text-[#0F172A]">
                        {entry.card.name}
                      </td>
                      <td className="p-3 text-[#64748B]">{entry.card.set?.name}</td>
                      <td className="p-3 font-num font-bold">{entry.quantity}</td>
                      <td className="p-3 font-num">
                        {formatCurrency(price, activeCurrency as any)}
                      </td>
                      <td className="p-3 font-num font-bold text-[#DC143C]">
                        {formatCurrency((price * entry.quantity), activeCurrency as any)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {quickLookCard && (
        <QuickLookModal
          card={quickLookCard}
          cardList={deck.entries.map(e => e.card)}
          onClose={() => setQuickLookCard(null)}
          onNavigateCard={setQuickLookCard}
          currency={activeCurrency as any}
        />
      )}

      {/* Footer Disclaimer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="font-medium flex items-center gap-4">
            <span>© {new Date().getFullYear()} DECK / divider. All rights reserved.</span>
            <span className="hidden md:inline text-slate-300">|</span>
            <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
            <span className="hidden md:inline text-slate-300">|</span>
            <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
          </div>
          <div className="text-center md:text-right text-[11px] leading-relaxed text-slate-400">
            DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.
          </div>
        </div>
      </footer>
    </div>
  );
};
