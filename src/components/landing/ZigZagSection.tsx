import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

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
      className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 border-b border-[#E2E8F0] scroll-mt-16 relative"
    >
      <div className="w-full max-w-[2200px] mx-auto">
        <div
          className={`flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center ${
            reversed ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Text Content Column - Depth 2 White Card */}
          <div className="w-full lg:w-5/12 xl:w-5/12">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-10 lg:p-12 space-y-6 text-left w-full h-full flex flex-col justify-center min-h-[480px]">
              {/* Header Badge */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-num text-xs font-bold text-[#DC143C] tracking-wider">
                    [{index}]
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[11px] font-semibold">
                    {badge}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight font-heading text-balance">
                  {title}
                </h2>
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed">
                {description}
              </p>

              {/* Bullet Points */}
              <div className="space-y-4 pt-3 border-t border-[#F1F5F9]">
                {bulletPoints.map((bp, i) => (
                  <div key={i} className="flex items-start gap-3.5">
                    <div className="mt-0.5 w-5 h-5 rounded-md bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5" />
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
                <div className="pt-4 border-t border-[#F1F5F9]">
                  <button
                    onClick={onCtaClick}
                    className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-[#DC143C] hover:text-[#B01030] transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-4 rounded-sm"
                  >
                    <span>{ctaText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* UI Mockup Column - Glass Slab Container */}
          <div className="w-full lg:w-7/12 xl:w-7/12 flex h-full">
            <div className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl ring-1 ring-slate-900/[0.04] p-4 sm:p-6 lg:p-8 w-full h-full flex flex-col justify-center min-h-[480px]">
              {mockup}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
