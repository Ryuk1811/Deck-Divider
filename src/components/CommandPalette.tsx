import React, { useState, useEffect } from 'react';
import { Search, Layers, BookOpen, X, ArrowRight } from 'lucide-react';
import { PokemonCard, Deck, CardSet } from '../types';
import { formatCurrency } from '../utils/formatters';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cards: PokemonCard[];
  decks: Deck[];
  sets: CardSet[];
  onSelectCard: (card: PokemonCard) => void;
  onSelectDeck: (deckId: string) => void;
  onNavigate: (tab: 'collection' | 'decks' | 'search' | 'sets' | 'lists' | 'settings') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  cards,
  decks,
  sets,
  onSelectCard,
  onSelectDeck,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredCards = query
    ? cards.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.set.name.toLowerCase().includes(query.toLowerCase())
      )
    : cards.slice(0, 4);

  const filteredDecks = query
    ? decks.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : decks.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel p-4 overflow-hidden border border-[#E2E8F0] shadow-2xl chamfer-corner-lg">
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border border-[#E2E8F0] shadow-xs">
          <Search className="w-5 h-5 text-[#DC143C]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cards, decks, sets, or jump to section..."
            className="w-full bg-transparent font-mono text-sm text-[#0F172A] focus:outline-none placeholder:text-[#64748B]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[#64748B] hover:text-[#0F172A]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="mt-4 max-h-[380px] overflow-y-auto space-y-4 pr-1">
          {/* Quick Section Shortcuts */}
          {!query && (
            <div>
              <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
                Quick Navigation
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Collection Portfolio', tab: 'collection' },
                  { label: 'Decks Hub', tab: 'decks' },
                  { label: 'Global Card Search', tab: 'search' },
                ].map((item) => (
                  <button
                    key={item.tab}
                    type="button"
                    onClick={() => {
                      onNavigate(item.tab as any);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-md bg-white border border-[#E2E8F0] hover:border-[#DC143C] text-xs font-mono text-[#0F172A] transition-all hover:bg-[#FFF0F3]"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3 h-3 text-[#DC143C]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cards Section */}
          <div>
            <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
              Cards ({filteredCards.length})
            </div>
            <div className="space-y-1">
              {filteredCards.map((card) => (
                <div
                  key={card.id}
                  onClick={() => {
                    onSelectCard(card);
                    onClose();
                  }}
                  className="flex items-center justify-between p-2 rounded-md bg-white hover:bg-[#FFF0F3] border border-transparent hover:border-[#DC143C] cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={card.images.small || 'https://images.pokemontcg.io/cardback.png'}
                      alt={card.name}
                      className="w-8 h-11 object-cover rounded-md border border-[#E2E8F0]"
                    />
                    <div>
                      <div className="font-heading font-semibold text-xs text-[#0F172A]">
                        {card.name}
                      </div>
                      <div className="font-mono text-[10px] text-[#64748B]">
                        {card.set.name} • #{card.number}
                      </div>
                    </div>
                  </div>
                  <div className="font-num font-bold text-xs text-[#0F172A]">
                    {formatCurrency(card.prices.raw)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decks Section */}
          {filteredDecks.length > 0 && (
            <div>
              <div className="font-mono text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2 px-2">
                Decks ({filteredDecks.length})
              </div>
              <div className="space-y-1">
                {filteredDecks.map((deck) => (
                  <div
                    key={deck.id}
                    onClick={() => {
                      onSelectDeck(deck.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-md bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: deck.colorHex }}
                      />
                      <span className="font-heading font-semibold text-xs text-[#0F172A]">
                        {deck.name}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#64748B]">
                      {deck.entries.reduce((acc, e) => acc + e.quantity, 0)} cards
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
          <span>Use Esc to close</span>
          <span>Deterministic search index</span>
        </div>
      </div>
    </div>
  );
};
