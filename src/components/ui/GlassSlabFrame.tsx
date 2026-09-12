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
      className={`relative inline-flex flex-col items-center justify-center bg-white border border-slate-200/90 ring-1 ring-[#0F172A]/5 rounded-2xl p-2.5 sm:p-3 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,1)] transition-all duration-200 hover:shadow-[0_12px_28px_-6px_rgba(220,20,60,0.12),inset_0_1px_1px_rgba(255,255,255,1)] ${className}`}
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

