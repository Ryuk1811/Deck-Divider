import React from 'react';
import { Check, Sparkles, Zap, Shield } from 'lucide-react';
import { AccountTier, DisplayCurrency, TIER_LIMITS } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface PricingHeroSectionProps {
  currentTier?: AccountTier;
  onSelectTier: (tier: AccountTier) => void;
  displayCurrency: DisplayCurrency;
}

export const PricingHeroSection: React.FC<PricingHeroSectionProps> = ({
  currentTier = 'Starter',
  onSelectTier,
  displayCurrency,
}) => {
  const tiers: {
    tier: AccountTier;
    popular?: boolean;
    features: string[];
  }[] = [
    {
      tier: 'Starter',
      popular: false,
      features: [
        'Up to 4 custom decks',
        'Max 25 cards per deck',
        'Up to 3 card wishlists',
        'Max 20 items per list',
        'Instant card search',
        'Live TCGplayer prices',
      ],
    },
    {
      tier: 'Bunch',
      popular: false,
      features: [
        'Up to 9 custom decks',
        'Max 40 cards per deck',
        'Up to 8 card wishlists',
        'Max 50 items per list',
        'PSA, BGS & CGC grade logging',
        'Historical price trends',
      ],
    },
    {
      tier: 'Stack',
      popular: false,
      features: [
        'Up to 15 custom decks',
        'Max 50 cards per deck',
        'Up to 15 card wishlists',
        'Max 100 items per list',
        'Shareable deck links',
        'Master set checklist tracking',
      ],
    },
    {
      tier: 'Deck',
      popular: true,
      features: [
        'Up to 18 custom decks',
        'Full 60-card tournament decks',
        'Up to 25 card wishlists',
        'Max 200 items per list',
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
              Search 148+ expansions with live USD TCGplayer pricing, build up to 4 custom decks (max 25 cards each), and create 3 wishlists with no credit card required.
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
              Browse card catalogs, view real-time price trend graphs, test deckbuilders, and experiment with sample collections immediately without creating an account.
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid (All 5 Tiers) */}
        <div className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl ring-1 ring-slate-900/[0.04] p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 text-left">
            {tiers.map(({ tier, popular, features }) => {
              const limit = TIER_LIMITS[tier];
              const priceMonthly = limit.priceMonthly;
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
                          {formatCurrency(priceMonthly, displayCurrency)}
                        </span>
                        <span className="text-xs text-[#64748B] font-mono">/ mo</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#94A3B8] block mt-0.5">
                        {priceMonthly === 0 ? 'Free forever' : 'Billed monthly'}
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
                      onClick={() => onSelectTier(tier)}
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
        </div>
      </div>
    </section>
  );
};
