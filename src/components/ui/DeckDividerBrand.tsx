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
    <div 
      className={`${className} flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
      role={onClick ? "button" : "img"}
      title={title}
    >
      <img
        src="/logo.png?v=6"
        alt={title || "DECK / divider"}
        className="w-full h-full object-contain pointer-events-none"
      />
    </div>
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
    xs: 'w-7 h-7',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  }[size];

  // Helper render for Logo Fallback Button
  const renderLogoButton = (iconClass: string) => (
    <button
      type="button"
      onClick={handleLogoClick}
      className="flex-shrink-0 flex items-center justify-center cursor-pointer group focus-visible:outline-none transition-transform duration-200 active:scale-95"
      title="DECK / divider — Return to main page"
      aria-label="Deck Divider Home (Return to main page)"
    >
      <DeckDividersIcon className={`${iconClass} transition-transform duration-200 group-hover:scale-105`} />
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
      <div 
        onClick={onClick} 
        className={`${containerClasses} justify-center cursor-pointer`} 
        title={onClick ? 'Expand Sidebar' : 'DECK / divider'}
      >
        {showLogo ? renderLogoButton(iconSizes) : renderCollapsedWordmark()}
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
