import React, { useRef } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
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
  const sectionRef = useRef<HTMLElement>(null);

  // High-performance scroll tracking directly mapped to GPU transforms
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // --- 1. Text Card Transformations (Smooth GPU interpolated slide in / out) ---
  const textX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    reversed ? ['40px', '0px', '0px', '-40px'] : ['-40px', '0px', '0px', '40px']
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    [0.2, 1, 1, 0.2]
  );
  const textScale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [0.96, 1, 1, 0.96]
  );

  // --- 2. Mockup Glass Slab Transformations (Clean GPU slide without CPU spring drag) ---
  const mockupX = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    reversed ? ['-50px', '0px', '0px', '50px'] : ['50px', '0px', '0px', '-50px']
  );
  const mockupY = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    ['25px', '0px', '0px', '-25px']
  );
  const mockupOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.78, 1],
    [0.25, 1, 1, 0.25]
  );
  const mockupScale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.72, 1],
    [0.95, 1, 1, 0.95]
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 scroll-mt-16 relative overflow-hidden"
    >
      <div className="w-full max-w-[2200px] mx-auto relative z-10">
        <div
          className={`flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16 items-center ${
            reversed ? 'lg:flex-row-reverse' : ''
          }`}
        >
          {/* Text Content Column with GPU accelerated hardware-composed slide in / out */}
          <motion.div
            style={{
              x: textX,
              opacity: textOpacity,
              scale: textScale,
              willChange: 'transform, opacity',
            }}
            className="w-full lg:w-5/12 xl:w-5/12 transform-gpu"
          >
            <div className="bg-white/95 border border-[#E2E8F0] rounded-2xl shadow-sm p-6 sm:p-10 lg:p-12 space-y-6 text-left w-full h-full flex flex-col justify-center min-h-[480px]">
              {/* Header Badge */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-num text-xs font-bold text-[#DC143C] tracking-wider">
                    [{index}]
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[11px] font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C] animate-ping shrink-0" />
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
                  <div key={i} className="flex items-start gap-3.5 group">
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
          </motion.div>

          {/* UI Mockup Column with Fluid Hardware GPU Acceleration */}
          <div className="w-full lg:w-7/12 xl:w-7/12 flex h-full relative">
            {/* Dedicated Floating Section Motion Asset */}
            <SectionMotionAsset sectionId={id} reversed={reversed} />

            <motion.div
              style={{
                x: mockupX,
                y: mockupY,
                opacity: mockupOpacity,
                scale: mockupScale,
                willChange: 'transform, opacity',
              }}
              className="w-full h-full flex flex-col justify-center min-h-[480px] transform-gpu"
            >
              <div className="bg-white border border-[#E2E8F0] shadow-md rounded-2xl ring-1 ring-slate-900/[0.04] p-4 sm:p-6 lg:p-8 w-full h-full flex flex-col justify-center relative overflow-hidden">
                {mockup}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
