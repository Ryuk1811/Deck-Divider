import React from 'react';

interface DeckDividerBrandProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  collapsed?: boolean;
  showLogo?: boolean;
}

/**
 * Fanned Deck Dividers Logo SVG
 * Captures the central foreground stack of 10 vibrant card deck dividers
 * (Yellow, Orange, Red, Pink, Purple, Blue, Green, Frosted White, Dark Grey, Black)
 * with top index tabs, realistic overlapping depth, and gradient reflections.
 */
export const DeckDividersIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Deck Divider Icon"
    >
      <defs>
        {/* Soft Drop Shadows between layers */}
        <filter id="shadow-soft" x="-10%" y="-10%" width="130%" height="130%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="2" dy="3" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
        </filter>
        
        <filter id="shadow-deep" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Rich Color Gradients for 10 Dividers */}
        <linearGradient id="div-yellow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFEE33" />
          <stop offset="100%" stopColor="#FACC15" />
        </linearGradient>

        <linearGradient id="div-orange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF8800" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>

        <linearGradient id="div-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>

        <linearGradient id="div-pink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#BE185D" />
        </linearGradient>

        <linearGradient id="div-purple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>

        <linearGradient id="div-blue" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        <linearGradient id="div-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>

        <linearGradient id="div-white" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <linearGradient id="div-grey" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        <linearGradient id="div-black" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Stacked Fanned Card Dividers - Diagonally Arrayed */}
      <g transform="translate(10, 10)">
        
        {/* 10. Black Divider (Bottom Layer) */}
        <g transform="translate(20, 110) rotate(-32)" filter="url(#shadow-deep)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 30,7 L 27,0 L 5,0 C 2,0 0,2 0,5 Z" fill="url(#div-black)" />
          <path d="M 1,8 L 64,8" stroke="#475569" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 9. Dark Grey Divider */}
        <g transform="translate(30, 98) rotate(-30)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 35,7 L 32,0 L 10,0 C 7,0 5,2 5,5 Z" fill="url(#div-grey)" />
          <path d="M 1,8 L 64,8" stroke="#94A3B8" strokeWidth="0.8" opacity="0.5" />
        </g>

        {/* 8. Frosted White Divider */}
        <g transform="translate(40, 86) rotate(-28)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 40,7 L 37,0 L 15,0 C 12,0 10,2 10,5 Z" fill="url(#div-white)" />
          <path d="M 1,8 L 64,8" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.8" />
        </g>

        {/* 7. Green Divider */}
        <g transform="translate(50, 74) rotate(-26)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 42,7 L 39,0 L 18,0 C 15,0 13,2 13,5 Z" fill="url(#div-green)" />
          <path d="M 1,8 L 64,8" stroke="#86EFAC" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 6. Royal Blue Divider */}
        <g transform="translate(60, 62) rotate(-24)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 45,7 L 42,0 L 22,0 C 19,0 17,2 17,5 Z" fill="url(#div-blue)" />
          <path d="M 1,8 L 64,8" stroke="#7DD3FC" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 5. Purple Divider */}
        <g transform="translate(70, 50) rotate(-22)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 48,7 L 45,0 L 25,0 C 22,0 20,2 20,5 Z" fill="url(#div-purple)" />
          <path d="M 1,8 L 64,8" stroke="#C084FC" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 4. Hot Pink Divider */}
        <g transform="translate(80, 38) rotate(-20)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 50,7 L 47,0 L 28,0 C 25,0 23,2 23,5 Z" fill="url(#div-pink)" />
          <path d="M 1,8 L 64,8" stroke="#F472B6" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 3. Red Divider */}
        <g transform="translate(90, 26) rotate(-18)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 53,7 L 50,0 L 32,0 C 29,0 27,2 27,5 Z" fill="url(#div-red)" />
          <path d="M 1,8 L 64,8" stroke="#FCA5A5" strokeWidth="0.8" opacity="0.6" />
        </g>

        {/* 2. Orange Divider */}
        <g transform="translate(100, 14) rotate(-16)" filter="url(#shadow-soft)">
          <path d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 56,7 L 53,0 L 35,0 C 32,0 30,2 30,5 Z" fill="url(#div-orange)" />
          <path d="M 1,8 L 64,8" stroke="#FDBA74" strokeWidth="0.8" opacity="0.7" />
        </g>

        {/* 1. Yellow Divider (Topmost Foreground Layer) */}
        <g transform="translate(110, 2) rotate(-14)" filter="url(#shadow-deep)">
          {/* Card outline with tab on top right */}
          <path
            d="M 0,12 L 0,100 C 0,103 2,105 5,105 L 60,105 C 63,105 65,103 65,100 L 65,12 C 65,9 63,7 60,7 L 58,7 L 55,0 L 38,0 C 35,0 33,2 33,5 L 33,7 Z"
            fill="url(#div-yellow)"
          />
          {/* Subtle top divider line feature */}
          <path d="M 1,8 L 64,8" stroke="#FEF08A" strokeWidth="1" opacity="0.9" />
          {/* Front glossy highlight sweep */}
          <path d="M 4,14 L 61,14 L 58,95 L 4,95 Z" fill="white" opacity="0.12" />
        </g>
      </g>
    </svg>
  );
};

/**
 * Global DECK / divider Brand Component
 * Strict Requirement:
 * - Solid black box background (#000000)
 * - Logo and Wordmark side by side
 * - Wordmark: "DECK / divider"
 *   - "DECK" in UPPERCASE and WHITE (#FFFFFF)
 *   - " / " in WHITE or light border accent
 *   - "divider" in LOWERCASE and RED (#DC143C)
 */
export const DeckDividerBrand: React.FC<DeckDividerBrandProps> = ({
  size = 'md',
  className = '',
  onClick,
  collapsed = false,
  showLogo = false,
}) => {
  const gapSize = {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-3.5',
    lg: 'gap-4',
    xl: 'gap-5',
  }[size];

  // Square dimensions for collapsed mode (1:1 ratio)
  const squareSizes = {
    xs: 'w-7 h-7 rounded-md text-[10px]',
    sm: 'w-9 h-9 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-xs sm:text-sm',
    lg: 'w-12 h-12 rounded-xl text-sm sm:text-base',
    xl: 'w-14 h-14 rounded-2xl text-base sm:text-lg',
  }[size];

  // Rectangular box padding and radius for normal mode (defined sides, rounded corners, NOT pill)
  const rectBoxPadding = {
    xs: 'px-2.5 py-1 rounded-md text-[11px]',
    sm: 'px-3 py-1.5 rounded-lg text-xs',
    md: 'px-3.5 py-2 rounded-lg text-xs sm:text-sm',
    lg: 'px-5 py-2.5 rounded-xl text-sm sm:text-base',
    xl: 'px-6 py-3 rounded-xl text-lg sm:text-xl',
  }[size];

  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`${className.includes('w-full') ? 'flex w-full' : 'inline-flex'} items-center justify-center select-none transition-all ${gapSize} ${
        onClick ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : ''
      } ${className}`}
      title={onClick ? (collapsed ? 'Expand Sidebar' : 'Collapse Sidebar') : undefined}
    >
      {collapsed ? (
        /* Collapsed Mode: Perfectly Square 1:1 Box with rounded corners containing "D / d" */
        <div className={`bg-[#111111] p-[1px] shadow-sm border border-[#262626] hover:border-[#DC143C]/60 transition-all ${squareSizes}`}>
          <div className="w-full h-full bg-black flex items-center justify-center rounded-[inherit]">
            <div className="font-heading font-black flex items-center justify-center leading-none">
              <span className="text-white uppercase tracking-tight">D</span>
              <span className="text-[#DC143C] font-mono font-bold mx-[1px]">/</span>
              <span className="text-[#DC143C] lowercase font-bold tracking-tight">d</span>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Mode: Defined Rectangular Box with rounded corners containing "DECK / divider" */
        <div className={`${className.includes('w-full') ? 'w-full' : ''} bg-[#111111] p-[1px] shadow-sm border border-[#262626] hover:border-[#DC143C]/60 transition-all ${rectBoxPadding.split(' ').filter(c => c.startsWith('rounded-')).join(' ')}`}>
          <div className={`${className.includes('w-full') ? 'w-full' : ''} bg-black flex items-center justify-center rounded-[inherit] ${rectBoxPadding}`}>
            <div className="font-heading font-black flex items-center justify-center leading-none">
              <span className="text-white tracking-[0.16em] uppercase">DECK</span>
              <span className="text-[#DC143C] font-mono font-bold opacity-90 text-[1.1em] mx-1">/</span>
              <span className="text-[#DC143C] font-semibold tracking-[0.12em] lowercase">divider</span>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Logo Icon (Rendered when showLogo is true) */}
      {showLogo && (
        <div className="flex-shrink-0 flex items-center justify-center">
          <DeckDividersIcon className={`${iconSizes} transition-transform duration-300 hover:scale-105`} />
        </div>
      )}
    </div>
  );
};
