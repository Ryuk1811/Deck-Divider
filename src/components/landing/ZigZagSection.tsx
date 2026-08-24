import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
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
  // Kinetic Staging Constants using Apple/Linear easeOutQuint [0.16, 1, 0.3, 1]
  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <section
      id={id}
      className="w-full py-10 sm:py-16 md:py-24 lg:py-32 px-3 sm:px-6 md:px-10 lg:px-14 xl:px-18 2xl:px-24 scroll-mt-16 relative overflow-hidden"
    >
      <div className="w-full max-w-[2200px] mx-auto relative z-10">
        <div
          className={`flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center ${
            reversed ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* 1. Text Content Column - Viewport-Triggered Stagger Cascade */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px 0px -60px 0px' }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="w-full lg:w-5/12 xl:w-5/12 transform-gpu"
          >
            <div className="bg-white/95 border border-[#E2E8F0] rounded-xl sm:rounded-2xl shadow-xs sm:shadow-sm hover:shadow-md transition-shadow p-5 sm:p-8 md:p-10 lg:p-12 space-y-4 sm:space-y-6 text-left w-full h-full flex flex-col justify-center min-h-[auto] sm:min-h-[440px] lg:min-h-[480px]">
              
              {/* Header Badge with Instant Reveal */}
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

              {/* Bullet Points with Staggered Cascading Reveal */}
              <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-3 border-t border-[#F1F5F9]">
                {bulletPoints.map((bp, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.12 + i * 0.06, ease: easeCurve }}
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
                  </motion.div>
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
          </motion.div>

          {/* 2. UI Mockup Column - Structured Elevation Stage */}
          <div className="w-full lg:w-7/12 xl:w-7/12 flex h-full relative">
            {/* Dedicated Floating Section Motion Asset (Positioned dynamically) */}
            <SectionMotionAsset sectionId={id} reversed={reversed} />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-60px 0px -60px 0px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: easeCurve }}
              className="w-full h-full flex flex-col justify-center min-h-[auto] sm:min-h-[440px] lg:min-h-[480px] transform-gpu"
            >
              <div className="bg-white border border-[#E2E8F0] shadow-md hover:shadow-xl transition-shadow duration-500 rounded-xl sm:rounded-2xl ring-1 ring-slate-900/[0.04] p-3 sm:p-5 lg:p-8 w-full h-full flex flex-col justify-center relative overflow-hidden">
                {mockup}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
