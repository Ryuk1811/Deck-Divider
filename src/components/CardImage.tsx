import React, { useState } from 'react';
import { Sparkles, Shield } from 'lucide-react';

interface CardImageProps {
  src?: string;
  alt: string;
  cardName?: string;
  cardNumber?: string;
  setName?: string;
  rarity?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  setId?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  cardName = 'Pokémon Card',
  cardNumber,
  setName,
  rarity,
  className = '',
  loading = 'lazy',
  setId,
}) => {
  const [attemptIndex, setAttemptIndex] = useState(0);

  // Generate candidate fallbacks array
  const buildFallbackSources = (): string[] => {
    const sources: string[] = [];
    if (src) sources.push(src);

    if (setId && cardNumber) {
      const cleanSet = setId.toLowerCase();
      const cleanNum = cardNumber.toString().replace(/^0+/, ''); // e.g., '001' -> '1'
      
      // Candidate: TCGdex high webp
      sources.push(`https://assets.tcgdex.net/en/${cleanSet}/${cardNumber}/high.webp`);
      // Candidate: TCGdex high png
      sources.push(`https://assets.tcgdex.net/en/${cleanSet}/${cardNumber}/high.png`);
      // Candidate: TCGdex low png
      sources.push(`https://assets.tcgdex.net/en/${cleanSet}/${cardNumber}/low.png`);
      
      // Candidate: PokemonTCG.io
      sources.push(`https://images.pokemontcg.io/${cleanSet}/${cardNumber}.png`);
      sources.push(`https://images.pokemontcg.io/${cleanSet}/${cleanNum}.png`);
      sources.push(`https://images.pokemontcg.io/${cleanSet}/${cardNumber}_hq.png`);
    }

    return Array.from(new Set(sources.filter(Boolean)));
  };

  const fallbacks = buildFallbackSources();
  const currentSrc = fallbacks[attemptIndex];

  const handleError = () => {
    if (attemptIndex < fallbacks.length - 1) {
      setAttemptIndex((prev) => prev + 1);
    } else {
      // Mark as fully failed to trigger dynamic graphic fallback
      setAttemptIndex(fallbacks.length);
    }
  };

  if (!currentSrc || attemptIndex >= fallbacks.length) {
    // Dynamic TCG Stylized Card Fallback (when artwork is absent across all CDNs)
    return (
      <div className={`relative aspect-[0.718] w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#CBD5E1] rounded-lg p-3 flex flex-col justify-between overflow-hidden shadow-inner ${className}`}>
        {/* Holographic Shimmer Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#DC143C]/20 via-transparent to-transparent pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between text-white border-b border-white/10 pb-1 z-10">
          <span className="font-heading font-bold text-[11px] truncate max-w-[80%] text-[#FFD700]">
            {cardName}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#FFD700] flex-shrink-0 animate-pulse" />
        </div>

        {/* Center Emblem Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-2 z-10 px-1">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/15 flex items-center justify-center mb-1.5 shadow-lg backdrop-blur-xs">
            <Shield className="w-6 h-6 text-[#DC143C]" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-white/70 line-clamp-1">
            {setName || 'Official TCG'}
          </span>
          <span className="font-heading font-extrabold text-[10px] text-white/90 truncate max-w-full">
            {cardName}
          </span>
        </div>

        {/* Bottom Footer Details */}
        <div className="flex items-center justify-between text-[9px] font-mono text-white/60 border-t border-white/10 pt-1 z-10">
          <span className="truncate">{rarity || 'Promo'}</span>
          <span>#{cardNumber || '---'}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      onError={handleError}
      className={className}
    />
  );
};
