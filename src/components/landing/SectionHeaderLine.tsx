import React from 'react';

interface SectionHeaderLineProps {
  id?: string;
  index: string;
  badge: string;
  title: string;
  subtitle?: string;
}

export const SectionHeaderLine: React.FC<SectionHeaderLineProps> = ({
  id,
  index,
  badge,
  title,
  subtitle,
}) => {
  return (
    <div
      id={id}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 sm:mt-20 lg:mt-24 mb-6 sm:mb-8 md:mb-10 scroll-mt-20 transform-gpu"
      data-motion-reveal
      data-motion-delay="0.02"
    >
      <div className="relative flex items-center justify-center">
        {/* Horizontal dividing line across container */}
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
        </div>

        {/* Center Pill / Section Index Marker */}
        <div className="relative flex items-center gap-2 bg-[#FAFAFA] border border-slate-200/90 px-3 py-1 rounded-full shadow-2xs">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-[#DC143C] tracking-wider uppercase">
            {index}
          </span>
          <span className="text-slate-300 text-xs">/</span>
          <span className="text-[10px] sm:text-xs font-semibold text-slate-700 uppercase tracking-wide">
            {badge}
          </span>
        </div>
      </div>

      {/* Section Header Text */}
      <div className="text-center mt-3 sm:mt-4 max-w-3xl mx-auto space-y-1">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
