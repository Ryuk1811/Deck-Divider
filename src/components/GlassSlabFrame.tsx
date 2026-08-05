import React from 'react';

interface GlassSlabFrameProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

/**
 * GlassSlabFrame provides a defined acrylic/glass slab enclosure
 * with sharp, distinct borders, specular highlights, and backdrop blur
 * to elevate Pokémon cards across the entire application.
 */
export const GlassSlabFrame: React.FC<GlassSlabFrameProps> = ({
  children,
  className = '',
  innerClassName = '',
}) => {
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center bg-gradient-to-b from-white/95 via-white/85 to-white/90 backdrop-blur-md border border-white/80 ring-1 ring-[#0F172A]/10 rounded-2xl p-2.5 sm:p-3 shadow-[0_10px_30px_-6px_rgba(15,23,42,0.12),0_4px_10px_-2px_rgba(15,23,42,0.06),inset_0_1.5px_1px_rgba(255,255,255,0.9)] transition-all duration-300 hover:shadow-[0_16px_40px_-8px_rgba(220,20,60,0.15),0_6px_16px_-4px_rgba(15,23,42,0.1),inset_0_1.5px_1px_rgba(255,255,255,1)] ${className}`}
    >
      {/* Top Glass Reflection Edge */}
      <div className="absolute top-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80 pointer-events-none z-10" />
      
      {/* Defined Card Well */}
      <div className={`relative w-full aspect-[0.718] rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#CBD5E1]/60 shadow-inner flex items-center justify-center ${innerClassName}`}>
        {children}
      </div>

      {/* Bottom Glass Bevel Border */}
      <div className="absolute bottom-0 left-3 right-3 h-[1px] bg-gradient-to-r from-transparent via-[#0F172A]/10 to-transparent pointer-events-none z-10" />
    </div>
  );
};

