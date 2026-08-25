import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface DeckDividerBrandProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  onLogoClick?: () => void;
  collapsed?: boolean;
  showLogo?: boolean;
  fullWidth?: boolean;
}

export interface DeckDividersIconProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
}

/**
 * Fanned Deck Dividers Logo SVG
 * Captures the exact fan-like stack of 10 overlapping soft rectangular card dividers
 * arranged diagonally from lower-left to upper-right against a transparent background.
 * Ordered bottom-to-top:
 * 1. Dark Charcoal / Black (bottom-most)
 * 2. Frosted Translucent Milky White
 * 3. Opaque Pure White
 * 4. Vibrant Emerald Green (#00A651)
 * 5. Royal Blue (#0078D4)
 * 6. Deep Saturated Purple / Violet
 * 7. Hot Pink / Magenta
 * 8. Pure Red
 * 9. Bright Orange
 * 10. Bright Pure Yellow (top-most / frontmost)
 *
 * Each card features rounded corners, index tabs on the upper edge, horizontal scorelines,
 * soft inter-layer drop shadows, and soft-satin specular lighting.
 */
export const DeckDividersIcon: React.FC<DeckDividersIconProps> = ({ 
  className = "w-8 h-8",
  onClick,
  title,
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 overflow-visible ${onClick ? 'cursor-pointer' : ''}`}
      aria-label={title || "Deck Divider Stack Logo"}
      onClick={onClick}
      role={onClick ? "button" : "img"}
    >
      {title && <title>{title}</title>}
      <defs>
        {/* Soft Inter-layer Occlusion Drop Shadow */}
        <filter id="card-shadow" x="-30%" y="-30%" width="160%" height="160%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="-1.5" dy="2.5" stdDeviation="2" floodColor="#090D14" floodOpacity="0.38" />
        </filter>

        {/* Deeper Base Shadow */}
        <filter id="card-shadow-deep" x="-40%" y="-40%" width="180%" height="180%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="-2" dy="4" stdDeviation="3.5" floodColor="#090D14" floodOpacity="0.5" />
        </filter>

        {/* 1. Yellow (Top-most) */}
        <linearGradient id="g-yellow" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFF14D" />
          <stop offset="60%" stopColor="#FFD400" />
          <stop offset="100%" stopColor="#F5B800" />
        </linearGradient>

        {/* 2. Orange */}
        <linearGradient id="g-orange" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FF851B" />
          <stop offset="70%" stopColor="#F55A00" />
          <stop offset="100%" stopColor="#DD4300" />
        </linearGradient>

        {/* 3. Red */}
        <linearGradient id="g-red" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#ED2939" />
          <stop offset="70%" stopColor="#D61828" />
          <stop offset="100%" stopColor="#B30E1C" />
        </linearGradient>

        {/* 4. Magenta / Hot Pink */}
        <linearGradient id="g-pink" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#F43F9E" />
          <stop offset="70%" stopColor="#E01E7E" />
          <stop offset="100%" stopColor="#C00E65" />
        </linearGradient>

        {/* 5. Purple / Violet */}
        <linearGradient id="g-purple" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#7E22CE" />
          <stop offset="70%" stopColor="#6415B5" />
          <stop offset="100%" stopColor="#4C0D8E" />
        </linearGradient>

        {/* 6. Blue */}
        <linearGradient id="g-blue" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="70%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#005A9E" />
        </linearGradient>

        {/* 7. Green */}
        <linearGradient id="g-green" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="70%" stopColor="#00A651" />
          <stop offset="100%" stopColor="#057A3D" />
        </linearGradient>

        {/* 8. Pure White */}
        <linearGradient id="g-white" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* 9. Frosted Milky White / Light Gray */}
        <linearGradient id="g-frosted" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#94A3B8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#64748B" stopOpacity="0.8" />
        </linearGradient>

        {/* 10. Charcoal / Near-Black */}
        <linearGradient id="g-charcoal" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#272F3D" />
          <stop offset="70%" stopColor="#171D27" />
          <stop offset="100%" stopColor="#0C1017" />
        </linearGradient>

        {/* Reusable Tabbed Divider Card Geometry */}
        <clipPath id="tab-clip">
          <path d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z" />
        </clipPath>
      </defs>

      {/* Global Diagonal Fan Group: Center aligned and rotated ~33 degrees */}
      <g transform="translate(18, 14)">
        
        {/* Layer 10: Charcoal / Black Divider (Bottom-most) */}
        <g transform="translate(12, 104) rotate(-33.5)" filter="url(#card-shadow-deep)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-charcoal)"
          />
          {/* Subtle upper score line */}
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#3E4A5C" strokeWidth="0.8" opacity="0.6" />
          {/* Edge highlight */}
          <path d="M 1,2 L 1,68" stroke="#4B586E" strokeWidth="0.6" opacity="0.4" />
        </g>

        {/* Layer 9: Frosted Milky White / Light Gray */}
        <g transform="translate(20, 93) rotate(-32.8)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-frosted)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.5" />
          <path d="M 1,2 L 1,68" stroke="#FFFFFF" strokeWidth="0.6" opacity="0.6" />
        </g>

        {/* Layer 8: Pure White */}
        <g transform="translate(28, 82) rotate(-32.1)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-white)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.7" />
          <path d="M 1,2 L 1,68" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.9" />
        </g>

        {/* Layer 7: Emerald Green */}
        <g transform="translate(36, 71) rotate(-31.4)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-green)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#86EFAC" strokeWidth="0.8" opacity="0.6" />
          <path d="M 1,2 L 1,68" stroke="#BBF7D0" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Layer 6: Royal Blue */}
        <g transform="translate(44, 60) rotate(-30.7)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-blue)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#7DD3FC" strokeWidth="0.8" opacity="0.6" />
          <path d="M 1,2 L 1,68" stroke="#BAE6FD" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Layer 5: Deep Purple / Violet */}
        <g transform="translate(52, 49) rotate(-30)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-purple)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#C084FC" strokeWidth="0.8" opacity="0.6" />
          <path d="M 1,2 L 1,68" stroke="#E9D5FF" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Layer 4: Hot Pink / Magenta */}
        <g transform="translate(60, 38) rotate(-29.3)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-pink)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#F472B6" strokeWidth="0.8" opacity="0.6" />
          <path d="M 1,2 L 1,68" stroke="#FBCFE8" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Layer 3: Pure Red */}
        <g transform="translate(68, 27) rotate(-28.6)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-red)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#FCA5A5" strokeWidth="0.8" opacity="0.6" />
          <path d="M 1,2 L 1,68" stroke="#FEE2E2" strokeWidth="0.6" opacity="0.7" />
        </g>

        {/* Layer 2: Orange */}
        <g transform="translate(76, 16) rotate(-27.9)" filter="url(#card-shadow)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-orange)"
          />
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#FDBA74" strokeWidth="0.8" opacity="0.7" />
          <path d="M 1,2 L 1,68" stroke="#FFEDD5" strokeWidth="0.6" opacity="0.8" />
        </g>

        {/* Layer 1: Bright Yellow (Top-most Front Layer) */}
        <g transform="translate(84, 5) rotate(-27.2)" filter="url(#card-shadow-deep)">
          <path
            d="M 4,0 L 22,0 C 23.5,0 24.5,-1 25,-2.5 L 25.5,-5.5 C 26,-7 27.5,-8 29.5,-8 L 41.5,-8 C 43.5,-8 45,-7 45.5,-5.5 L 46,-2.5 C 46.5,-1 47.5,0 49,0 L 51,0 C 53.5,0 55,1.5 55,4 L 55,68 C 55,71 53,73 50,73 L 5,73 C 2,73 0,71 0,68 L 0,4 C 0,1.5 1.5,0 4,0 Z"
            fill="url(#g-yellow)"
          />
          {/* Subtle upper scoreline */}
          <line x1="2" y1="5.5" x2="53" y2="5.5" stroke="#FEF08A" strokeWidth="1" opacity="0.9" />
          {/* Top-left specular highlight */}
          <path d="M 1,2 L 1,68" stroke="#FEF9C3" strokeWidth="0.8" opacity="0.9" />
          {/* Gentle satin surface shimmer */}
          <path d="M 3,6 L 52,6 L 50,66 L 3,66 Z" fill="white" opacity="0.08" />
        </g>
      </g>
    </svg>
  );
};

/**
 * Global DECK / divider Brand Component
 * Strict Requirement:
 * - Logo Icon placed on the LEFT side of the wordmark (with fallback button behavior back to main web page)
 * - Solid black box background (#000000)
 * - Wordmark: "DECK / divider"
 *   - "DECK" in UPPERCASE and WHITE (#FFFFFF)
 *   - " / " in RED or accent
 *   - "divider" in LOWERCASE and RED (#DC143C)
 */
export const DeckDividerBrand: React.FC<DeckDividerBrandProps> = ({
  size = 'md',
  className = '',
  onClick,
  onLogoClick,
  collapsed = false,
  showLogo = true,
  fullWidth = false,
}) => {
  const navigate = useNavigate();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLogoClick) {
      onLogoClick();
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const gapSize = {
    xs: 'gap-1.5',
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-3',
    xl: 'gap-3.5',
  }[size];

  // Square dimensions for collapsed mode (1:1 ratio)
  const squareSizes = {
    xs: 'w-7 h-7 rounded-md text-[10px]',
    sm: 'w-9 h-9 rounded-lg text-xs',
    md: 'w-10 h-10 rounded-xl text-xs',
    lg: 'w-11 h-11 rounded-xl text-sm',
    xl: 'w-13 h-13 rounded-xl text-base',
  }[size];

  // Rectangular box padding and font styles for normal mode (crisp, single-line, calibrated tracking)
  const rectBoxStyles = {
    xs: 'px-2 py-1 rounded-md text-[10px]',
    sm: 'px-3 py-1.5 rounded-lg text-[12px]',
    md: 'px-4 py-2 rounded-lg text-[13px] sm:text-[14px]',
    lg: 'px-5 py-2.5 rounded-xl text-sm sm:text-base',
    xl: 'px-6 py-3 rounded-xl text-base sm:text-lg',
  }[size];

  const iconSizes = {
    xs: 'w-5 h-5',
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-9 h-9',
    xl: 'w-11 h-11',
  }[size];

  // Helper render for Logo Fallback Button
  const renderLogoButton = (iconClass: string) => (
    <button
      type="button"
      onClick={handleLogoClick}
      className="flex-shrink-0 flex items-center justify-center p-0.5 rounded-lg hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]"
      title="DECK / divider — Return to main page"
      aria-label="Deck Divider Home (Return to main page)"
    >
      <DeckDividersIcon className={`${iconClass} transition-transform duration-300 group-hover:scale-105`} />
    </button>
  );

  // Helper render for Collapsed Square wordmark ("D / d")
  const renderCollapsedWordmark = () => (
    <div className={`shrink-0 bg-[#111111] p-[1px] shadow-xs border border-[#262626] hover:border-[#DC143C]/60 transition-all ${squareSizes}`}>
      <div className="w-full h-full bg-black flex items-center justify-center rounded-[inherit]">
        <div className="font-heading font-black flex items-center justify-center leading-none select-none">
          <span className="text-white uppercase tracking-tight">D</span>
          <span className="text-[#DC143C] font-mono font-bold mx-[1px]">/</span>
          <span className="text-[#DC143C] lowercase font-bold tracking-tight">d</span>
        </div>
      </div>
    </div>
  );

  const isFull = fullWidth || className.includes('w-full');

  // Helper render for Normal Expanded Wordmark ("DECK / divider")
  const renderExpandedWordmark = () => (
    <div
      className={`${
        isFull ? 'w-full flex-1' : 'shrink-0 inline-flex'
      } bg-[#111111] p-[1px] shadow-xs border border-[#262626] hover:border-[#DC143C]/60 transition-all ${rectBoxStyles
        .split(' ')
        .filter((c) => c.startsWith('rounded-'))
        .join(' ')}`}
    >
      <div
        className={`${
          isFull ? 'w-full' : ''
        } bg-black flex items-center justify-center rounded-[inherit] whitespace-nowrap ${rectBoxStyles}`}
      >
        <div className="font-heading font-black flex items-center justify-center leading-none select-none">
          <span className="text-white tracking-[0.14em] uppercase">DECK</span>
          <span className="text-[#DC143C] font-mono font-bold opacity-90 text-[1.1em] mx-1.5">/</span>
          <span className="text-[#DC143C] font-semibold tracking-[0.08em] lowercase">divider</span>
        </div>
      </div>
    </div>
  );

  const containerClasses = `${
    isFull ? 'flex w-full' : 'inline-flex'
  } items-center select-none transition-all ${gapSize} ${
    onClick ? 'cursor-pointer hover:opacity-90 active:scale-[0.98]' : ''
  } ${className}`;

  if (collapsed) {
    return (
      <div onClick={onClick} className={containerClasses} title={onClick ? 'Expand Sidebar' : undefined}>
        {showLogo && renderLogoButton(iconSizes)}
        {renderCollapsedWordmark()}
      </div>
    );
  }

  return (
    <div onClick={onClick} className={containerClasses} title={onClick ? 'Collapse Sidebar' : undefined}>
      {showLogo && renderLogoButton(iconSizes)}
      {renderExpandedWordmark()}
    </div>
  );
};
