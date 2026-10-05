import React, { useState } from 'react';
import { Check, Sparkles, Zap, Shield, Calendar } from 'lucide-react';
import { AccountTier, DisplayCurrency, TIER_LIMITS } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { LifetimePricingBanner } from '../pricing/LifetimePricingBanner';

interface PricingHeroSectionProps {
  currentTier?: AccountTier;
  onSelectTier: (tier: AccountTier, cycle?: 'monthly' | 'yearly') => void;
  displayCurrency: DisplayCurrency;
  onSelectLifetime?: () => void;
  isLifetime?: boolean;
}

export const PricingHeroSection: React.FC<PricingHeroSectionProps> = ({
  currentTier = 'Starter',
  onSelectTier,
  displayCurrency,
  onSelectLifetime,
  isLifetime = false,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const tiers: {
    tier: AccountTier;
    popular?: boolean;
    features: string[];
  }[] = [
    {
      tier: 'Starter',
      popular: false,
      features: [
        'Up to 6 custom decks',
        'Full 60-card tournament decks',
        'Up to 5 card wishlists',
        'Max 100 items per list',
        'Instant card search',
        'Shareable public showcase link',
      ],
    },
    {
      tier: 'Bunch',
      popular: false,
      features: [
        'Up to 15 custom decks',
        'Full 60-card tournament decks',
        'Up to 15 card wishlists',
        'Max 300 items per list',
        'PSA, BGS & CGC grade logging',
        'Multi-currency NAV converter',
      ],
    },
    {
      tier: 'Stack',
      popular: false,
      features: [
        'Up to 30 custom decks',
        'Full 60-card tournament decks',
        'Up to 30 card wishlists',
        'Max 750 items per list',
        'Shareable public deck links',
        'Master set checklist tracking',
      ],
    },
    {
      tier: 'Deck',
      popular: true,
      features: [
        'Up to 60 custom decks',
        'Full 60-card tournament decks',
        'Up to 60 card wishlists',
        'Max 1,500 items per list',
        'PTCGL text export',
        'Sealed booster box tracker',
        'Price drop alerts',
      ],
    },
    {
      tier: 'Collection',
      popular: false,
      features: [
        'Unlimited custom decks (∞)',
        'Full 60-card tournament decks (∞)',
        'Unlimited card wishlists (∞)',
        'Unlimited items per list (∞)',
        'Shareable public deck links',
        'Priority price updates',
        'Full CSV collection export',
      ],
    },
  ];

  return (
    <section id="pricing" className="relative w-full py-6 sm:py-8 md:py-10 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 scroll-mt-16">
      <div className="w-full max-w-[2200px] mx-auto space-y-6 sm:space-y-8">
        {/* Immediate Offer Clarity: 3 Key Questions Answered */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs font-mono uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <Check className="w-4 h-4" />
              </div>
              <span>What's 100% Free?</span>
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-heading">
              Starter Plan ($0 Free Forever)
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Search all 218 catalogued sets &amp; series (148+ master checklists) with daily USD TCGplayer pricing, build up to 6 custom decks (full 60-card decks), log 25 slabs, and create 5 wishlists with no credit card required.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs font-mono uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
                <Zap className="w-4 h-4" />
              </div>
              <span>After Signing Up</span>
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-heading">
              Instant Encrypted Cloud Sync
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Your binders, tournament lists, and slab registry automatically synchronize to the cloud across all your desktop and mobile devices with zero setup.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-[#DC143C] font-bold text-xs font-mono uppercase tracking-wider">
              <div className="p-1.5 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20">
                <Shield className="w-4 h-4" />
              </div>
              <span>No Account to Look Around</span>
            </div>
            <h3 className="text-base font-bold text-[#0F172A] font-heading">
              Full Guest Exploration
            </h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Browse card catalogs, view daily market price trend graphs, test deckbuilders, and experiment with sample collections immediately without creating an account.
            </p>
          </div>
        </div>

        {/* Billing Cycle Switcher with Whole Number Yearly Savings */}
        <div className="flex flex-col items-center justify-center gap-2 max-w-md mx-auto my-2">
          <div className="bg-white p-1.5 rounded-xl border border-[#CBD5E1] shadow-xs flex items-center w-full max-w-sm">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#DC143C] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              30-Day Monthly Pass
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer relative flex items-center justify-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#DC143C] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <span>365-Day Pass</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase ${
                billingCycle === 'yearly'
                  ? 'bg-[#FFD700] text-[#0F172A]'
                  : 'bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20'
              }`}>
                Save ~11%
              </span>
            </button>
          </div>
          <p className="text-[11px] font-mono text-[#64748B] text-center">
            Flexible pay-per-period subscription • Opt out or renew anytime with zero continuous mandates
          </p>
        </div>

        {/* Pricing Cards Grid (All 5 Tiers) */}
        <div className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl ring-1 ring-slate-900/[0.04] p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 text-left">
            {tiers.map(({ tier, popular, features }) => {
              const limit = TIER_LIMITS[tier];
              const isYearly = billingCycle === 'yearly';
              const price = isYearly ? limit.priceYearly : limit.priceMonthly;
              const isCurrent = currentTier === tier;

              return (
                <div
                  key={tier}
                  className={`relative flex flex-col justify-between rounded-xl p-5 sm:p-6 transition-all duration-300 ${
                    popular
                      ? 'bg-white border-2 border-[#DC143C] shadow-lg z-10 hover:-translate-y-1 hover:shadow-xl'
                      : 'bg-white border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  {popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#DC143C] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      Most Popular
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#0F172A] font-heading">{tier}</h3>
                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 min-h-[32px]">{limit.tagline}</p>

                    {/* Price display */}
                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] pb-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-extrabold font-mono text-[#0F172A]">
                          {formatCurrency(price, displayCurrency)}
                        </span>
                        <span className="text-xs text-[#64748B] font-mono">
                          {isYearly ? '/ 365 days' : '/ 30 days'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                        {price === 0
                          ? 'Free forever'
                          : isYearly
                          ? `Save ${limit.yearlyDiscountPercent}% with bulk annual pass`
                          : 'One-time 30-day pass'}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="mt-3 space-y-2 pt-3 border-t border-[#F1F5F9]">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#64748B] tracking-wider block">
                        Included:
                      </span>
                      {features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs">
                          <Check className="w-3.5 h-3.5 text-[#DC143C] shrink-0 mt-0.5" />
                          <span className="text-[#475569] leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tier Action Button */}
                  <div className="mt-5 pt-3 border-t border-[#F1F5F9]">
                    <button
                      onClick={() => onSelectTier(tier, billingCycle)}
                      className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                        popular
                          ? 'bg-[#DC143C] hover:bg-[#B01030] text-white shadow-xs focus-visible:ring-[#DC143C]'
                          : 'bg-[#F8FAFC] hover:bg-[#FFF0F3] hover:text-[#DC143C] text-[#0F172A] border border-[#E2E8F0] focus-visible:ring-[#0F172A]'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : tier === 'Starter' ? 'Start Free' : `Select ${tier}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Horizontal Lifetime Access Element */}
          <div className="mt-8">
            <LifetimePricingBanner
              onSelectLifetime={() => {
                if (onSelectLifetime) onSelectLifetime();
                else onSelectTier('Collection');
              }}
              isCurrentLifetime={isLifetime || currentTier === 'Collection'}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
