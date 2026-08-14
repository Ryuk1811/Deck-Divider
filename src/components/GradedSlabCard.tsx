import React, { useRef, useEffect } from 'react';
import { PokemonCard, GradingInfo, DisplayCurrency } from '../types';
import { holographicEngine } from '../utils/holographicEngine';
import { formatCurrency } from '../utils/formatters';
import { Eye, Shield, Award } from 'lucide-react';
import { CardImage } from './CardImage';

interface GradedSlabCardProps {
  card: PokemonCard;
  gradingInfo: GradingInfo;
  currency?: DisplayCurrency;
  quantity?: number;
  onClick?: () => void;
  onQuickLook?: () => void;
  showPrice?: boolean;
  className?: string;
  isFocused?: boolean;
}

export const GradedSlabCard: React.FC<GradedSlabCardProps> = ({
  card,
  gradingInfo,
  currency = 'USD',
  quantity,
  onClick,
  onQuickLook,
  showPrice = true,
  className = '',
  isFocused = false,
}) => {
  const slabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = slabRef.current;
    if (el) {
      holographicEngine.register(el);
    }
    return () => {
      if (el) holographicEngine.unregister(el);
    };
  }, []);

  const company = (gradingInfo.company || 'PSA').toUpperCase();
  const gradeStr = gradingInfo.grade || '10';
  const certNumber = gradingInfo.certNumber || '10849204';
  const subgrades = gradingInfo.subgrades;

  // Authentic label design tokens for PSA / BGS / CGC / SGC
  const isPSA = company === 'PSA';
  const isBGS = company === 'BGS';
  const isCGC = company === 'CGC';
  const isSGC = company === 'SGC';

  // Estimated graded value if available or calculated based on grade
  const gradeNum = parseFloat(gradeStr.replace(/[^0-9.]/g, '')) || 10;
  const gradedPrice =
    gradeNum >= 10
      ? card.prices.psa10Estimate || card.prices.raw * 3.2
      : gradeNum >= 9
      ? card.prices.psa9Estimate || card.prices.raw * 1.6
      : card.prices.raw * 1.1;

  const isHolo =
    card.rarity === 'Rare Holo' ||
    card.rarity === 'Ultra Rare' ||
    card.rarity === 'Secret Rare' ||
    card.rarity === 'Illustration Rare' ||
    card.rarity === 'Special Illustration Rare';

  return (
    <div
      ref={slabRef}
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
        transform: 'perspective(1100px) scale(var(--card-scale, 1)) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transition: 'var(--card-transition, transform 220ms cubic-bezier(0.4, 0, 0.2, 1))',
      }}
      className={`group relative flex flex-col bg-gradient-to-b from-white/98 via-[#F8FAFC]/90 to-white/95 backdrop-blur-xl border border-white/90 ring-1 ring-[#0F172A]/15 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.18),0_4px_12px_-2px_rgba(15,23,42,0.08),inset_0_2px_1px_rgba(255,255,255,1)] hover:shadow-[0_20px_48px_-8px_rgba(220,20,60,0.22),0_6px_18px_-4px_rgba(15,23,42,0.12),inset_0_2px_1px_rgba(255,255,255,1)] cursor-pointer select-none overflow-hidden rounded-2xl p-2 sm:p-2.5 transition-all duration-200 ${
        isFocused ? 'ring-2 ring-[#DC143C] ring-offset-2' : ''
      } ${className}`}
    >
      {/* Top Acrylic Bevel Specular Reflection */}
      <div className="absolute top-0 left-2 right-2 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent opacity-95 pointer-events-none z-20" />

      {/* SLAB HEADER LABEL */}
      <div className="relative w-full rounded-lg overflow-hidden border border-[#CBD5E1]/80 shadow-xs mb-2 bg-white flex flex-col">
        {/* PSA Label Style */}
        {isPSA && (
          <>
            <div className="bg-[#DC143C] h-2 w-full flex items-center justify-between px-1.5">
              <span className="font-heading font-black text-[7px] text-white tracking-widest leading-none">
                PSA
              </span>
              <span className="font-mono text-[6px] text-white/90 uppercase tracking-tighter">
                AUTHENTIC
              </span>
            </div>
            <div className="p-1.5 bg-white flex items-center justify-between gap-1">
              <div className="min-w-0 flex-1">
                <p className="font-heading font-bold text-[9px] text-[#0F172A] truncate leading-tight">
                  {card.set?.name || 'POKÉMON'}
                </p>
                <p className="font-mono text-[8px] text-[#64748B] truncate">
                  #{card.number} {card.name}
                </p>
                <p className="font-num text-[7px] text-[#94A3B8] tracking-wider">
                  #{certNumber}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center pl-1 border-l border-[#E2E8F0] flex-shrink-0 min-w-[32px]">
                <span className="font-num font-black text-sm text-[#DC143C] leading-none">
                  {gradeStr}
                </span>
                <span className="font-mono text-[6px] font-bold text-[#0F172A] uppercase">
                  {gradeNum >= 10 ? 'GEM MT' : gradeNum >= 9 ? 'MINT' : 'NM'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* BGS Label Style (Beckett Gold/Silver plaque) */}
        {isBGS && (
          <div className="p-1.5 bg-gradient-to-r from-[#FEF08A]/40 via-[#FEF9C3] to-[#FEF08A]/40 border-b border-[#CA8A04]/40 flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-heading font-black text-[8px] text-[#854D0E] tracking-wider">
                  BECKETT
                </span>
                <span className="font-num text-[6.5px] text-[#A16207]">#{certNumber}</span>
              </div>
              <p className="font-mono text-[8px] text-[#0F172A] font-semibold truncate leading-tight">
                {card.name}
              </p>
              {subgrades && (
                <div className="flex items-center gap-1 font-num text-[6.5px] text-[#854D0E] mt-0.5">
                  <span>C:{subgrades.centering || '10'}</span>
                  <span>K:{subgrades.corners || '10'}</span>
                  <span>E:{subgrades.edges || '10'}</span>
                  <span>S:{subgrades.surface || '10'}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center justify-center pl-1.5 border-l border-[#CA8A04]/30 flex-shrink-0 min-w-[32px]">
              <span className="font-num font-black text-sm text-[#854D0E] leading-none">
                {gradeStr}
              </span>
              <span className="font-mono text-[6px] font-bold text-[#854D0E] uppercase">
                {gradeNum >= 10 ? 'PRISTINE' : 'GEM MINT'}
              </span>
            </div>
          </div>
        )}

        {/* CGC Label Style */}
        {isCGC && (
          <>
            <div className="bg-[#0F172A] h-2 w-full flex items-center justify-between px-1.5">
              <span className="font-heading font-black text-[7px] text-[#38BDF8] tracking-widest">
                CGC CARDS
              </span>
              <span className="font-mono text-[6px] text-white/80">CERTIFIED</span>
            </div>
            <div className="p-1.5 bg-white flex items-center justify-between gap-1">
              <div className="min-w-0 flex-1">
                <p className="font-heading font-bold text-[9px] text-[#0F172A] truncate">
                  {card.name}
                </p>
                <p className="font-mono text-[8px] text-[#64748B] truncate">
                  {card.set?.name} • #{card.number}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center pl-1 border-l border-[#E2E8F0] flex-shrink-0 min-w-[32px]">
                <span className="font-num font-black text-sm text-[#0F172A] leading-none">
                  {gradeStr}
                </span>
                <span className="font-mono text-[6px] font-bold text-[#2563EB] uppercase">
                  {gradeNum >= 10 ? 'PRISTINE' : 'GEM MINT'}
                </span>
              </div>
            </div>
          </>
        )}

        {/* SGC / Other Label Style */}
        {!isPSA && !isBGS && !isCGC && (
          <div className="p-1.5 bg-[#0F172A] text-white flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-[#DC143C]" />
                <span className="font-heading font-bold text-[8px] text-white tracking-wide">
                  {company}
                </span>
              </div>
              <p className="font-mono text-[8px] text-white/80 truncate">
                {card.name}
              </p>
            </div>
            <div className="flex flex-col items-center justify-center pl-1.5 border-l border-white/20 flex-shrink-0 min-w-[28px]">
              <span className="font-num font-black text-sm text-[#DC143C] leading-none">
                {gradeStr}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* RECESSED OPTICAL CARD WELL */}
      <div className="relative aspect-[0.718] w-full overflow-hidden rounded-xl bg-[#0F172A]/5 border border-[#CBD5E1]/80 shadow-[inset_0_2px_4px_rgba(15,23,42,0.1)] p-0.5">
        <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[#F8FAFC]">
          <CardImage
            src={card.images.small || card.images.large}
            alt={card.name}
            cardName={card.name}
            cardNumber={card.number}
            setName={card.set?.name}
            rarity={card.rarity}
            setId={card.set?.id}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />

          {/* Glare Layer */}
          <div
            className="pointer-events-none fixed inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-200"
            style={{
              background:
                'radial-gradient(circle at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)',
            }}
          />

          {/* Standard Shimmer Layer */}
          {isHolo && (
            <div
              className="pointer-events-none fixed inset-0 mix-blend-color-dodge opacity-25 group-hover:opacity-75 transition-opacity duration-300 holo-shimmer animate-holo-idle"
              style={{
                backgroundPosition: 'var(--shimmer-x, 0%) center',
              }}
            />
          )}

          {/* Quantity Badge */}
          {quantity !== undefined && quantity > 1 && (
            <div className="absolute top-2 right-2 rounded-md bg-[#0F172A] px-2 py-0.5 font-num text-xs font-bold text-white shadow-xs">
              x{quantity}
            </div>
          )}

          {/* Quick Look Prompt */}
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
      </div>

      {/* SLAB FOOTER: Graded Price & Auth Marker */}
      <div className="mt-2 flex items-center justify-between gap-1 pt-1.5 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3 text-[#DC143C]" />
          <span className="font-mono text-[9px] font-bold text-[#0F172A]">
            {company} {gradeStr}
          </span>
        </div>

        {showPrice && (
          <div className="font-num font-bold text-xs text-[#DC143C]">
            {formatCurrency(gradedPrice, currency)}
          </div>
        )}
      </div>

      {/* Bottom Acrylic Bevel Reflection */}
      <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#0F172A]/10 to-transparent pointer-events-none z-20" />
    </div>
  );
};
