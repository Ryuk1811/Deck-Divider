import React, { useState } from 'react';

interface SetLogoBadgeProps {
  setId?: string;
  setName: string;
  series?: string;
  logoUrl?: string;
  symbolUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export const SetLogoBadge: React.FC<SetLogoBadgeProps> = ({
  setId,
  setName,
  series,
  logoUrl,
  symbolUrl,
  size = 'md',
  className = '',
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);

  // Clean ID for pokemontcg.io and fallback emblem
  const cleanId = (setId || '').trim().toLowerCase();
  
  // Array of image candidate URLs in order of preference
  const candidates: string[] = [];
  
  if (logoUrl) candidates.push(logoUrl);
  if (cleanId) candidates.push(`https://images.pokemontcg.io/${cleanId}/logo.png`);
  if (symbolUrl) candidates.push(symbolUrl);
  if (cleanId) candidates.push(`https://images.pokemontcg.io/${cleanId}/symbol.png`);

  const currentImage = candidateIndex < candidates.length ? candidates[candidateIndex] : null;

  // Shorthand initials fallback only if all 4 candidates fail
  const initials =
    cleanId.length > 0 && cleanId.length <= 4
      ? cleanId.toUpperCase()
      : setName
          .split(' ')
          .filter((w) => !['the', 'of', 'and', '&', 'set', 'series'].includes(w.toLowerCase()))
          .map((w) => w[0])
          .join('')
          .slice(0, 4)
          .toUpperCase() || 'SET';

  const sizeClasses = {
    sm: 'w-6 h-6 text-[9px]',
    md: 'w-10 h-10 text-[11px]',
    lg: 'w-12 h-12 text-xs',
    hero: 'w-16 h-16 text-sm',
  };

  const imgContainerClasses = {
    sm: 'w-8 h-7',
    md: 'w-12 h-9',
    lg: 'w-16 h-11',
    hero: 'w-24 h-14',
  };

  const imgMaxClasses = {
    sm: 'max-h-6 max-w-[32px]',
    md: 'max-h-8 max-w-[48px]',
    lg: 'max-h-10 max-w-[64px]',
    hero: 'max-h-14 max-w-[96px]',
  };

  if (currentImage) {
    return (
      <div
        className={`flex items-center justify-center flex-shrink-0 select-none ${imgContainerClasses[size]} ${className}`}
      >
        <img
          src={currentImage}
          alt={`${setName} logo`}
          className={`${imgMaxClasses[size]} w-auto h-auto object-contain drop-shadow-2xs`}
          loading="lazy"
          onError={() => {
            // Advance to next image fallback
            setCandidateIndex((prev) => prev + 1);
          }}
        />
      </div>
    );
  }

  // Refined Geometric Fallback if no images exist on servers
  return (
    <div
      className={`flex-shrink-0 rounded-lg bg-[#0F172A] border border-[#334155] text-white flex flex-col items-center justify-center font-mono font-bold tracking-wider shadow-2xs select-none ${sizeClasses[size]} ${className}`}
      title={setName}
    >
      <span className="text-[#FFD700] leading-none">{initials}</span>
    </div>
  );
};
