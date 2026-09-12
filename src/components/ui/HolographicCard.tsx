import React, { useEffect, useRef, memo } from 'react';
import { PokemonCard, DisplayCurrency } from '../../types';
import { holographicEngine } from '../../utils/holographicEngine';
import { formatCurrency, RARITY_BADGE_STYLE, ENERGY_COLORS } from '../../utils/formatters';
import { Sparkles, Eye } from 'lucide-react';
import { CardImage } from './CardImage';

interface HolographicCardProps {
  card: PokemonCard;
  currency?: DisplayCurrency;
  quantity?: number;
  deckName?: string;
  deckColor?: string;
  onClick?: () => void;
  onQuickLook?: () => void;
  showPrice?: boolean;
  className?: string;
  isFocused?: boolean;
}

export const HolographicCard: React.FC<HolographicCardProps> = memo(({
  card,
  currency = 'USD',
  quantity,
  deckName,
  deckColor,
  onClick,
  onQuickLook,
  showPrice = true,
  className = '',
  isFocused = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      holographicEngine.register(el);
    }
    return () => {
      if (el) holographicEngine.unregister(el);
    };
  }, []);

  const isHolo =
    card.rarity === 'Rare Holo' ||
    card.rarity === 'Ultra Rare' ||
    card.rarity === 'Secret Rare' ||
    card.rarity === 'Illustration Rare' ||
    card.rarity === 'Special Illustration Rare';

  const isGlitter = card.rarity === 'Ultra Rare' || card.rarity === 'Secret Rare' || card.rarity === 'Special Illustration Rare';
  const rarityBadge = (card.rarity && RARITY_BADGE_STYLE[card.rarity]) || RARITY_BADGE_STYLE['Common'];

  return (
    <div
      ref={cardRef}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === ' ' && onQuickLook) {
          e.preventDefault();
          onQuickLook();
        } else if (e.key === 'Enter' && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        transform: 'perspective(1000px) scale(var(--card-scale, 1)) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transition: 'var(--card-transition, transform 180ms ease-out)',
        willChange: 'transform',
      }}
      className={`group relative bg-white px-3 pt-3 pb-3.5 border border-slate-200/90 ring-1 ring-[#0F172A]/5 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_12px_28px_-6px_rgba(220,20,60,0.14),inset_0_1px_1px_rgba(255,255,255,1)] cursor-pointer select-none overflow-hidden rounded-2xl ${
        isFocused ? 'ring-2 ring-[#DC143C] ring-offset-2' : ''
      } ${className}`}
    >
      {/* Glass Slab Edge Bevel Reflection */}
      <div className="absolute top-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-90 pointer-events-none z-10" />

      {/* Card Header Info */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="font-heading font-semibold text-xs text-[#0F172A] truncate max-w-[120px]">
          {card.name || 'Card'}
        </span>
        {card.hp && (
          <span className="font-num font-bold text-xs text-[#DC143C] flex-shrink-0">
            {card.hp} HP
          </span>
        )}
      </div>

      {/* Card Image Container with Holographic Shimmer and Glare */}
      <div className="relative aspect-[0.718] w-full overflow-hidden rounded-xl bg-[#F8FAFC] border border-[#CBD5E1]/60 shadow-inner">
        <CardImage
          src={card.images?.small || card.images?.large}
          alt={card.name || 'Card'}
          cardName={card.name}
          cardNumber={card.number}
          setName={card.set?.name}
          rarity={card.rarity}
          setId={card.set?.id}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        />

        {/* Glare Layer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-150"
          style={{
            background:
              'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)',
          }}
        />

        {/* Standard Shimmer Layer */}
        {isHolo && (
          <div
            className="pointer-events-none absolute inset-0 mix-blend-color-dodge opacity-30 group-hover:opacity-80 transition-opacity duration-200 holo-shimmer animate-holo-idle"
            style={{
              backgroundPosition: 'var(--shimmer-x, 0%) center',
            }}
          />
        )}

        {/* Glitter Layer */}
        {isGlitter && (
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-200 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:12px_12px]" />
        )}

        {/* Quantity Badge - Continuous State */}
        {quantity !== undefined && quantity > 1 && (
          <div className="absolute top-2 right-2 rounded-md bg-[#0F172A] px-2 py-0.5 font-num text-xs font-bold text-white shadow-xs">
            x{quantity}
          </div>
        )}

        {/* Quick Look hover prompt - Continuous State */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickLook) onQuickLook();
          }}
          className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-1 rounded-md bg-white/95 backdrop-blur-md px-2 py-1 text-[10px] font-mono font-medium text-[#0F172A] border border-[#E2E8F0] shadow-xs hover:bg-[#FFF0F3] hover:text-[#DC143C]"
        >
          <Eye className="w-3 h-3" />
          Space
        </button>
      </div>

      {/* Card Footer: Set, Rarity & Price - Continuous Detail State */}
      <div className="mt-2.5 flex items-center justify-between gap-1.5 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
          <span
            className={`inline-block rounded-md px-1.5 py-0.5 text-[10px] font-mono font-semibold border flex-shrink-0 ${rarityBadge.style}`}
          >
            {rarityBadge.label}
          </span>
          <span className="font-mono text-[11px] text-[#64748B] truncate">
            {card.set.name}
          </span>
        </div>

        {showPrice && (
          <div className="font-num font-bold text-xs text-[#0F172A] flex-shrink-0 pl-1">
            {formatCurrency(card.prices.raw, currency as DisplayCurrency)}
          </div>
        )}
      </div>

      {/* Energy Types, Category & Stage Row & Deck Badge - Continuous Detail State */}
      <div className="mt-1.5 flex items-center justify-between gap-1 flex-wrap">
        <div className="flex flex-wrap items-center gap-1">
          {card.category && card.category !== 'Pokemon' && card.category !== 'Pokémon' && (
            <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#F1F5F9] text-[#0F172A] border border-[#CBD5E1]">
              {card.category}
            </span>
          )}

          {card.stage && (
            <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20">
              {card.stage}
            </span>
          )}

          {card.types && card.types.length > 0 && card.types.map((type, idx) => {
            const displayTypeName = type === 'Lightning' ? 'Electric' : type === 'Metal' ? 'Steel' : type === 'Darkness' ? 'Dark' : type;
            const style = ENERGY_COLORS[displayTypeName] || ENERGY_COLORS[type] || ENERGY_COLORS['Colorless'];
            return (
              <span
                key={`${type}-${idx}`}
                className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-mono font-semibold border ${style.bg} ${style.text} ${style.border}`}
              >
                {displayTypeName}
              </span>
            );
          })}

          {card.legalities?.standard && (
            <span className="inline-flex items-center rounded-md px-1 py-0.5 text-[8px] font-mono font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]" title="Standard Format Legal">
              STD
            </span>
          )}
        </div>

        {deckName && (
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[9px] font-mono text-[#64748B] max-w-[110px] truncate">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: deckColor || '#0F172A' }}
            />
            <span className="truncate font-semibold">{deckName}</span>
          </div>
        )}
      </div>
    </div>
  );
});

HolographicCard.displayName = 'HolographicCard';
