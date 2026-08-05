import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { PokemonCard, DisplayCurrency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CardImage } from './CardImage';
import { GlassSlabFrame } from './GlassSlabFrame';

interface QuickLookModalProps {
  card: PokemonCard | null;
  cardList: PokemonCard[];
  onClose: () => void;
  onNavigateCard: (newCard: PokemonCard) => void;
  currency: DisplayCurrency;
}

export const QuickLookModal: React.FC<QuickLookModalProps> = ({
  card,
  cardList,
  onClose,
  onNavigateCard,
  currency,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!card) return;
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const currIdx = cardList.findIndex((c) => c.id === card.id);
        if (currIdx > 0) {
          onNavigateCard(cardList[currIdx - 1]);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const currIdx = cardList.findIndex((c) => c.id === card.id);
        if (currIdx >= 0 && currIdx < cardList.length - 1) {
          onNavigateCard(cardList[currIdx + 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [card, cardList, onClose, onNavigateCard]);

  if (!card) return null;

  const currIdx = cardList.findIndex((c) => c.id === card.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-6 border border-[#E2E8F0] shadow-xl max-w-md w-full relative space-y-4 chamfer-corner-lg">
        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#DC143C]" />
            <span className="font-heading font-bold text-sm text-[#0F172A]">
              Quick Look Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md bg-white border border-[#E2E8F0] hover:bg-[#FFF0F3] text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Artwork & Details */}
        <div className="relative flex flex-col items-center">
          {/* Left / Right Nav Arrows */}
          {currIdx > 0 && (
            <button
              type="button"
              onClick={() => onNavigateCard(cardList[currIdx - 1])}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 border border-[#E2E8F0] shadow-md text-[#0F172A] hover:bg-[#FFF0F3] hover:text-[#DC143C] transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {currIdx < cardList.length - 1 && (
            <button
              type="button"
              onClick={() => onNavigateCard(cardList[currIdx + 1])}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 border border-[#E2E8F0] shadow-md text-[#0F172A] hover:bg-[#FFF0F3] hover:text-[#DC143C] transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <GlassSlabFrame className="w-56 sm:w-60 shadow-2xl">
            <CardImage
              src={card.images.large || card.images.small}
              alt={card.name}
              cardName={card.name}
              cardNumber={card.number}
              setName={card.set?.name}
              rarity={card.rarity}
              setId={card.set?.id}
              className="w-full h-full object-cover"
            />
          </GlassSlabFrame>

          <div className="mt-4 text-center space-y-2">
            <h3 className="font-heading font-bold text-lg text-[#0F172A]">
              {card.name}
            </h3>
            <div className="font-mono text-xs text-[#64748B]">
              {card.set.name} • #{card.number}
            </div>

            <div className="flex items-center justify-center gap-1.5 flex-wrap pt-0.5">
              {card.category && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] rounded-md">
                  {card.category}
                </span>
              )}
              {card.stage && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 rounded-md">
                  {card.stage}
                </span>
              )}
              {card.regulationMark && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#475569] border border-[#CBD5E1] rounded-md">
                  Mark {card.regulationMark}
                </span>
              )}
            </div>

            <div className="font-num font-bold text-base text-[#DC143C] pt-0.5">
              {formatCurrency(card.prices.raw, currency)}
            </div>
          </div>
        </div>

        {/* Keyboard hints */}
        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
          <span>← → Navigate adjacent</span>
          <span>Space / Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
