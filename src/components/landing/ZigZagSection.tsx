import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { SectionMotionAsset } from './SectionMotionAsset';

interface ZigZagSectionProps {
  id: string;
  index: string;
  badge: string;
  title: string;
  description: string;
  bulletPoints: { title: string; desc: string }[];
  mockup: React.ReactNode;
  reversed?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const ZigZagSection: React.FC<ZigZagSectionProps> = ({
  id,
  index,
  badge,
  title,
  description,
  bulletPoints,
  mockup,
  reversed = false,
  ctaText,
  onCtaClick,
}) => {
  return (
    <section
      id={id}
      className="w-full py-8 sm:py-12 md:py-14 lg:py-16 px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 scroll-mt-16 relative overflow-hidden"
      data-motion-zigzag
      data-reversed={reversed ? 'true' : 'false'}
    >
      <div className="w-full max-w-[2200px] mx-auto relative z-10">
        <div
          className={`flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center ${
            reversed ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* 1. Text Content Column with Dynamic Scroll-Linked Draw-In/Out */}
          <div
            className="w-full lg:w-5/12 xl:w-5/12 transform-gpu will-change-transform"
            data-motion-text
          >
            <div className="bg-white/95 border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-xs sm:shadow-sm hover:shadow-md transition-shadow p-5 sm:p-8 md:p-10 lg:p-12 space-y-4 sm:space-y-6 text-left w-full h-full flex flex-col justify-center min-h-[auto] sm:min-h-[440px] lg:min-h-[480px]">
              
              {/* Header Badge */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-num text-xs font-bold text-[#DC143C] tracking-wider">
                    [{index}]
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[10px] sm:text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C] animate-ping shrink-0" />
                    {badge}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight font-heading text-balance">
                  {title}
                </h2>
              </div>

              <p className="text-xs sm:text-sm md:text-base lg:text-lg text-[#64748B] leading-relaxed">
                {description}
              </p>

              {/* Bullet Points */}
              <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-3 border-t border-[#F1F5F9]">
                {bulletPoints.map((bp, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 sm:gap-3.5 group"
                  >
                    <div className="mt-0.5 w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm lg:text-base font-bold text-[#0F172A]">
                        {bp.title} —{' '}
                      </span>
                      <span className="text-xs sm:text-sm lg:text-base text-[#64748B] leading-relaxed">
                        {bp.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action CTA */}
              {ctaText && onCtaClick && (
                <div className="pt-3 sm:pt-4 border-t border-[#F1F5F9]">
                  <button
                    onClick={onCtaClick}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm md:text-base font-bold text-[#DC143C] hover:text-[#B01030] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-4 rounded-sm"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. UI Mockup Column with Opposite-Side Draw-In, Parallax & Interactive 3D Spring Tilt */}
          <div
            className="w-full lg:w-7/12 xl:w-7/12 flex h-full relative transform-gpu will-change-transform"
            data-motion-card
          >
            {/* Dedicated Floating Section Motion Asset (Positioned dynamically with parallax) */}
            <div data-motion-badge className="contents">
              <SectionMotionAsset sectionId={id} reversed={reversed} />
            </div>

            <div
              className="w-full h-full flex flex-col justify-center min-h-[auto] sm:min-h-[440px] lg:min-h-[480px] transform-gpu"
              data-motion-tilt
            >
              <div className="bg-white border border-[#E2E8F0] shadow-md hover:shadow-2xl transition-all duration-500 rounded-xl sm:rounded-2xl ring-1 ring-slate-900/[0.04] p-3 sm:p-5 lg:p-8 w-full h-full flex flex-col justify-center relative overflow-hidden group">
                {/* Subtle sheen highlight on card stage */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-slate-100/30 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                {mockup}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
