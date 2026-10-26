import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  Infinity as InfinityIcon,
  ArrowRight,
  Flame,
  Clock,
  Lock,
  Crown
} from 'lucide-react';
import { LifetimeTierStatus } from '../../types';

interface LifetimePricingBannerProps {
  onSelectLifetime: () => void;
  isCurrentLifetime?: boolean;
  className?: string;
}

export const LifetimePricingBanner: React.FC<LifetimePricingBannerProps> = ({
  onSelectLifetime,
  isCurrentLifetime = false,
  className = '',
}) => {
  const [status, setStatus] = useState<LifetimeTierStatus>({
    totalSlots: 100,
    claimedSlots: 0,
    remainingSlots: 100,
    isAvailable: true,
    priceUsd: 250,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/billing/lifetime-status');
        if (res.ok) {
          const data: LifetimeTierStatus = await res.json();
          if (isMounted && data && typeof data.totalSlots === 'number') {
            setStatus(data);
          }
        }
      } catch (err) {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // refresh every 30s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const percentageClaimed = Math.min(100, Math.round((status.claimedSlots / status.totalSlots) * 100));

  return (
    <div
      className={`w-full relative overflow-hidden rounded-3xl border-2 border-[#DC143C]/40 bg-gradient-to-r from-white via-[#FFF8F9] to-white shadow-xl shadow-[#DC143C]/5 p-6 sm:p-8 lg:p-10 transition-all ${className}`}
    >
      {/* Background Accent Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#DC143C]/10 via-[#DC143C]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8">
        
        {/* Left Column: Value Proposition & Pricing Header */}
        <div className="space-y-4 max-w-2xl flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DC143C] text-white text-[11px] font-mono font-bold uppercase tracking-wider shadow-xs">
              <Crown className="w-3.5 h-3.5" />
              Founder Lifetime Pass
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[11px] font-mono font-semibold">
              <Flame className="w-3 h-3 text-[#DC143C]" />
              Limited to First 100 Customers Only
            </span>
            {isCurrentLifetime && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold">
                ✓ YOUR ACTIVE PLAN
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight font-heading leading-tight">
              $250, lifetime access, no reoccurring charges
            </h3>
            <p className="text-sm text-[#475569] leading-relaxed">
              Permanent, unrestricted access to the complete <strong>Collection Tier</strong>. Never pay another monthly subscription fee. Includes all future expansions, advanced binder analytics, and tournament features for life.
            </p>
          </div>

          {/* Core Feature Bullet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-[#1E293B]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#DC143C] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#DC143C]" />
              </div>
              <span className="font-medium">Unlimited custom decks &amp; exclusive unlimited cards per deck (Collection tier: 6, 30, 60, 100, &infin;)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#DC143C] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#DC143C]" />
              </div>
              <span className="font-medium">Unlimited custom wishlists &amp; binder completion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#DC143C] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#DC143C]" />
              </div>
              <span className="font-medium">Unlimited PSA, BGS, CGC &amp; ACE graded slabs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#DC143C] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#DC143C]" />
              </div>
              <span className="font-medium">Unlimited sealed booster boxes, cases &amp; ETBs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#DC143C] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#DC143C]" />
              </div>
              <span className="font-medium">20 global fiat currencies FX conversion &amp; CSV export</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FFF0F3] text-[#DC143C] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#DC143C]" />
              </div>
              <span className="font-medium">Encrypted multi-device cloud sync snapshots forever</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Counter Meter & Action Card */}
        <div className="w-full lg:w-80 bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5 shrink-0">
          
          {/* Price & Savings Pill */}
          <div className="border-b border-[#F1F5F9] pb-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-num">
                  $250
                </span>
                <span className="text-xs font-mono text-[#64748B] block mt-0.5">
                  One-time single payment
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                  Save $168/yr
                </span>
                <span className="text-[11px] font-mono text-[#64748B] block mt-1">
                  vs $14/mo tier (Pays off in 18 mo)
                </span>
              </div>
            </div>
          </div>

          {/* Live Valid Counter */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Slot Counter:
              </span>
              <span className="text-[#DC143C] font-bold">
                {status.remainingSlots} slots remaining
              </span>
            </div>

            {/* Scarcity Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[#F1F5F9] overflow-hidden p-0.5 border border-[#E2E8F0]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-[#DC143C] to-[#B01030]"
                initial={{ width: 0 }}
                animate={{ width: `${percentageClaimed}%` }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
              <span>{status.claimedSlots} claimed</span>
              <span>100 total capacity</span>
            </div>
          </div>

          {/* CTA Action Button */}
          <div className="pt-2">
            <button
              id="claim-lifetime-pass-btn"
              type="button"
              disabled={isCurrentLifetime || !status.isAvailable}
              onClick={onSelectLifetime}
              className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold font-heading transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                isCurrentLifetime
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                  : !status.isAvailable
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-[#DC143C] text-white hover:bg-[#B01030] hover:shadow-lg hover:shadow-[#DC143C]/20 active:scale-[0.98]'
              }`}
            >
              <span>
                {isCurrentLifetime
                  ? 'Active Lifetime Member'
                  : !status.isAvailable
                  ? 'Sold Out (100/100 Claimed)'
                  : 'Claim Lifetime Pass ($250)'}
              </span>
              {!isCurrentLifetime && status.isAvailable && (
                <ArrowRight className="w-4 h-4 shrink-0" />
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#64748B] text-center mt-2.5">
              <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Standard PayPal Checkout • 7-day guarantee</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
