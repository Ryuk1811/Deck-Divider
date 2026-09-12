import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Shield, Loader2 } from 'lucide-react';
import {
  getOptimizedCardImageCandidates,
  getCachedWorkingUrl,
  markUrlWorking,
  markUrlFailed,
} from '../../utils/progressiveImageLoader';

interface CardImageProps {
  src?: string;
  alt: string;
  cardName?: string;
  cardNumber?: string | number;
  setName?: string;
  rarity?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  setId?: string;
  preferHighRes?: boolean;
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
  preferHighRes = false,
}) => {
  const cacheKey = `${setId || 'unknown'}-${cardNumber || '0'}-${preferHighRes ? 'high' : 'low'}-${src || ''}`;
  const initialResolved = getCachedWorkingUrl(cacheKey);

  const [candidateList, setCandidateList] = useState<string[]>(() =>
    initialResolved
      ? [initialResolved]
      : getOptimizedCardImageCandidates(src, setId, cardNumber, preferHighRes)
  );
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(Boolean(initialResolved));
  const [hasFailedAll, setHasFailedAll] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Update candidates if props change
  useEffect(() => {
    const cached = getCachedWorkingUrl(cacheKey);
    if (cached) {
      setCandidateList([cached]);
      setCandidateIndex(0);
      setIsLoaded(true);
      setHasFailedAll(false);
    } else {
      const candidates = getOptimizedCardImageCandidates(src, setId, cardNumber, preferHighRes);
      setCandidateList(candidates);
      setCandidateIndex(0);
      setIsLoaded(false);
      setHasFailedAll(candidates.length === 0);
    }
  }, [src, setId, cardNumber, preferHighRes, cacheKey]);

  const currentSrc = candidateList[candidateIndex];

  const handleLoadSuccess = () => {
    if (currentSrc) {
      markUrlWorking(cacheKey, currentSrc);
    }
    setIsLoaded(true);
  };

  const handleImageError = () => {
    if (currentSrc) {
      markUrlFailed(currentSrc);
    }

    if (candidateIndex < candidateList.length - 1) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll || !currentSrc) {
    // Dynamic TCG Stylized Card Fallback (rendered if CDNs have no artwork)
    return (
      <div
        className={`relative aspect-[0.718] w-full bg-[#F8FAFC] border-2 border-[#CBD5E1] rounded-lg p-3 flex flex-col justify-between overflow-hidden shadow-2xs ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#DC143C]/10 via-transparent to-transparent pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between text-[#0F172A] border-b border-[#E2E8F0] pb-1 z-10">
          <span className="font-heading font-bold text-[11px] truncate max-w-[80%] text-[#0F172A]">
            {cardName}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#DC143C] flex-shrink-0 animate-pulse" />
        </div>

        {/* Center Emblem Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-2 z-10 px-1">
          <div className="w-10 h-10 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center mb-1 shadow-xs">
            <Shield className="w-5 h-5 text-[#DC143C]" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#64748B] line-clamp-1 font-semibold">
            {setName || 'Official TCG'}
          </span>
          <span className="font-heading font-extrabold text-[10px] text-[#0F172A] truncate max-w-full">
            {cardName}
          </span>
        </div>

        {/* Bottom Footer Details */}
        <div className="flex items-center justify-between text-[9px] font-mono text-[#64748B] border-t border-[#E2E8F0] pt-1 z-10 font-semibold">
          <span className="truncate">{rarity || 'Common'}</span>
          <span>#{cardNumber || '---'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#F1F5F9]/60 flex items-center justify-center">
      {/* Progressive Shimmer placeholder while image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#E2E8F0] animate-pulse flex flex-col items-center justify-center p-2 text-center select-none">
          <div className="w-6 h-6 rounded-full bg-[#CBD5E1]/60 flex items-center justify-center mb-1">
            <Sparkles className="w-3 h-3 text-[#DC143C] opacity-70 animate-spin" />
          </div>
          <span className="font-mono text-[9px] text-[#64748B] font-semibold truncate max-w-[80%]">
            {cardName}
          </span>
        </div>
      )}

      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        loading={loading}
        decoding="async"
        referrerPolicy="no-referrer"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
        onLoad={handleLoadSuccess}
        onError={handleImageError}
        className={`${className} ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
      />
    </div>
  );
};
