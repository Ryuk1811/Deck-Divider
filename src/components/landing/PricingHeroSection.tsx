import React from 'react';
import { Check, Sparkles } from 'lucide-react';
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
        'Up to 3 curated watchlists',
        'Max 20 items per list',
        'Instant real-time search',
        'Multi-currency valuations',
      ],
    },
    {
      tier: 'Bunch',
      popular: false,
      features: [
        'Up to 9 custom decks',
        'Max 40 cards per deck',
        'Up to 8 curated watchlists',
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
        'Up to 15 curated watchlists',
        'Max 100 items per list',
        'Shareable public deck links',
        'Master set checklist tracking',
      ],
    },
    {
      tier: 'Deck',
      popular: true,
      features: [
        'Up to 18 custom decks',
        'Full 60-card tournament decks',
        'Up to 25 curated watchlists',
        'Max 200 items per list',
        'Shareable public deck links',
        'PTCGL deck export',
        'Sealed vault box & case tracker',
      ],
    },
    {
      tier: 'Collection',
      popular: false,
      features: [
        'Unlimited custom decks (∞)',
        'Unlimited cards per deck (∞)',
        'Unlimited curated watchlists (∞)',
        'Unlimited items per list (∞)',
        'Shareable public deck links',
        'Priority real-time price sync',
        'Complete portfolio backup export',
      ],
    },
  ];

  return (
    <section id="pricing" className="relative w-full py-16 sm:py-24 lg:py-32 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 border-b border-[#E2E8F0] scroll-mt-16">
      <div className="w-full max-w-[2200px] mx-auto space-y-12 lg:space-y-16">
        {/* Section Header Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-10 lg:p-12 text-center space-y-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>TRANSPARENT PLANS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight font-heading text-balance">
            Scale Your Operations
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#64748B] max-w-3xl mx-auto">
            Engineered for casual collectors, tournament champions, and institutional vault investors. Simple monthly pricing, unparalleled scale.
          </p>
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
