import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Check, ArrowRight, Shield, Zap, Layers, DollarSign, HelpCircle, Calendar } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../../components/landing/LandingMotionDirectorate';
import { AccountTier, DisplayCurrency, TIER_LIMITS } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getPricingSchema } from '../../components/seo/schemaData';
import { LifetimePricingBanner } from '../../components/pricing/LifetimePricingBanner';

interface PricingPageViewProps {
  onOpenAuth: () => void;
  onEnterApp?: () => void;
  currentTier?: AccountTier;
  onSelectTier: (tier: AccountTier, cycle?: 'monthly' | 'yearly') => void;
  displayCurrency: DisplayCurrency;
  user?: any;
  onSelectLifetime?: () => void;
  isLifetime?: boolean;
}

export const PricingPageView: React.FC<PricingPageViewProps> = ({
  onOpenAuth,
  onEnterApp,
  currentTier = 'Starter',
  onSelectTier,
  displayCurrency,
  user,
  onSelectLifetime,
  isLifetime = false,
}) => {
  const easeCurve = [0.16, 1, 0.3, 1] as const;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const tiers: {
    tier: AccountTier;
    popular?: boolean;
    description: string;
    features: string[];
    ctaText: string;
  }[] = [
    {
      tier: 'Starter',
      popular: false,
      description: 'Essential collection tracking and full 60-card deckbuilder for casual collectors.',
      features: [
        'Up to 6 custom decks',
        'Full 60-card tournament decks',
        'Up to 5 card wishlists',
        'Max 100 items per list',
        'Instant card search across 218 catalogued sets & series',
        'Daily TCGplayer market prices (USD)',
        'Log up to 25 graded slabs & 15 sealed items',
        'Shareable public showcase link',
      ],
      ctaText: 'Get Started Free',
    },
    {
      tier: 'Bunch',
      popular: false,
      description: 'For your first graded slabs — unlocks PSA, BGS, and CGC cert logging plus expanded binder decks.',
      features: [
        'Up to 15 custom decks',
        'Full 60-card tournament decks',
        'Up to 15 card wishlists',
        'Max 300 items per list',
        'PSA, BGS & CGC grade and cert logging',
        'Historical price trends & multi-currency conversion',
      ],
      ctaText: 'Choose Bunch',
    },
    {
      tier: 'Stack',
      popular: false,
      description: 'Expanded capacity for serious binder completists and league participants.',
      features: [
        'Up to 30 custom decks',
        'Full 60-card tournament decks',
        'Up to 30 card wishlists',
        'Max 750 items per list',
        'Shareable deck links with dynamic previews',
        'Publicly shareable custom lists',
        'Public Collection Showcase mode',
        'Master set checklist progress tracking',
      ],
      ctaText: 'Choose Stack',
    },
    {
      tier: 'Deck',
      popular: true,
      description: 'Championship-ready 60-card tournament decks, sealed vault, and alert tools.',
      features: [
        'Up to 60 custom decks',
        'Full 60-card tournament decks with format legality',
        'Up to 60 card wishlists',
        'Max 1,500 items per list',
        'Shareable deck links with dynamic previews',
        'Publicly shareable custom lists',
        'Public Collection Showcase mode',
        'PTCGL 1-click text import/export',
        'Sealed booster box & ETB ledger',
        'Price drop notifications & target alerts',
      ],
      ctaText: 'Choose Deck',
    },
    {
      tier: 'Collection',
      popular: false,
      description: 'Institutional-grade high-net-worth portfolio vault with unlimited headroom.',
      features: [
        'Unlimited custom decks (∞)',
        'Full 60-card tournament decks (∞)',
        'Unlimited card wishlists (∞)',
        'Unlimited items per list (∞)',
        'Shareable deck links with dynamic previews',
        'Publicly shareable custom lists',
        'Public Collection Showcase mode',
        'Priority sub-second market sync',
        'Full CSV portfolio export & cloud backups',
        'Advanced subgrade delta analytics',
      ],
      ctaText: 'Choose Collection',
    },
  ];

  const pricingFaqs = [
    {
      q: "What's completely free, and do I need a credit card?",
      a: "The Starter plan ($0) is free forever with no credit card required. You get full access to card search across 218 catalogued sets & series (148+ master checklists), daily USD TCGplayer market prices, up to 6 custom decks (full 60-card decks), 25 graded slabs, 15 sealed items, and 5 wishlists (100 items/list).",
    },
    {
      q: 'What happens right after I sign up or log in?',
      a: 'Your private encrypted workspace is created instantly. Your binders, decks, and wishlists automatically sync to the cloud across all your desktop and mobile devices with instant portfolio NAV recalculations.',
    },
    {
      q: 'Is an account required just to look around?',
      a: 'No account is needed to explore. You can search cards, check daily market price trend charts, inspect set checklists, and test sample collections immediately as a guest without creating an account or entering an email.',
    },
    {
      q: 'Can I cancel or change my plan at any time?',
      a: 'Yes. All subscriptions are managed without lock-in contracts. You can upgrade, downgrade, or cancel recurring billing at any time through your account settings or PayPal dashboard.',
    },
    {
      q: 'What payment methods do you support?',
      a: 'We accept all major credit and debit cards, PayPal balances, and linked bank accounts securely via PayPal Subscriptions with 256-bit encryption.',
    },
    {
      q: 'What happens to my data if I downgrade?',
      a: 'Your cards and deck lists are never deleted. If your collection exceeds the limits of a lower tier, your existing cards remain viewable in read-only mode until you bring your count back within the limit or re-upgrade.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'If you are unsatisfied with DECK / divider for any reason within the first 7 days of subscribing, contact our support team at deckdivider@outlook.com for a full refund.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
      <PageHead
        title="Pokémon Card Prices &amp; Collection Value Tracker | DECK / divider"
        description="Transparent membership plans for Pokémon TCG collectors and tournament players. Free forever Starter plan, graded slab tracking, 60-card tournament deck builders, and sealed vault."
        canonicalPath="/pricing"
        keywords={[
          'pokemon card tracker pricing',
          'deck divider subscription',
          'free pokemon collection tracker',
          'psa slab tracker membership',
          'pokemon deck builder app price'
        ]}
        schema={getPricingSchema()}
      />
      <LandingMotionDirectorate />

      {/* Shared Navigation */}
      <LandingNav
        onOpenAuth={onOpenAuth}
        onEnterApp={onEnterApp}
        user={user}
      />

      <main className="flex-1 w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 py-8 sm:py-12 lg:py-16 space-y-12 lg:space-y-16 relative z-10">
        <div className="max-w-5xl mx-auto w-full">
          <GeoBreadcrumbs items={[{ label: 'Pricing Plans', path: '/pricing' }]} />
        </div>

        {/* Page Hero Header */}
        <section className="text-center space-y-4 sm:space-y-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-mono tracking-tight uppercase">TRANSPARENT SUBSCRIPTION TIERS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] font-heading"
          >
            Predictable Pricing for Collectors &amp; Competitors
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
            className="text-base sm:text-lg lg:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed"
          >
            Start with our generous free Starter plan and scale as your collection grows. Live market valuations, 60-card tournament tools, and PSA slab tracking.
          </motion.p>
        </section>

        {/* PTC Collectibles Partner Offer */}
        <PtcPartnerBanner />

        <div className="max-w-5xl mx-auto w-full">
          <GeoExtractableBlock
            heading="Is DECK / divider free to use?"
            summary="Yes. DECK / divider offers a free forever Starter plan requiring no credit card. The Starter plan provides full access to instant card search across 218 catalogued sets & series (148+ master checklists), daily TCGplayer market prices in USD, up to 6 custom decks (full 60-card decks), 25 graded slabs, 15 sealed items, and 5 wishlists. Paid tiers expand capacity up to unlimited collections with multi-currency FX and CSV export."
            keyFacts={[
              { label: 'Free Plan', value: 'Starter ($0 Forever)' },
              { label: 'Credit Card', value: 'Not Required' },
              { label: 'Decks (Free)', value: '6 (Full 60 Cards)' },
              { label: 'Money-Back', value: '7-Day Guarantee' },
            ]}
          />
        </div>

        {/* Immediate Offer Clarity: 3 Key Questions Answered */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: easeCurve }}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5 relative overflow-hidden"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeCurve }}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5 relative overflow-hidden"
          >
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
              Your binders, tournament lists, and slab registry automatically synchronize to the cloud across all your desktop and mobile devices with zero configuration.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: easeCurve }}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2.5 relative overflow-hidden"
          >
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
          </motion.div>
        </section>

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

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-[2000px] mx-auto">
          {tiers.map((t, idx) => {
            const limitConfig = TIER_LIMITS[t.tier];
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? limitConfig.priceYearly : limitConfig.priceMonthly;
            const isCurrent = currentTier === t.tier;

            return (
              <motion.div
                key={t.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx, ease: easeCurve }}
                className={`relative flex flex-col justify-between rounded-2xl p-6 sm:p-7 transition-all ${
                  t.popular
                    ? 'bg-white border-2 border-[#DC143C] shadow-lg shadow-[#DC143C]/10 ring-1 ring-[#DC143C]/20'
                    : 'bg-white border border-[#E2E8F0] shadow-xs hover:border-[#CBD5E1] hover:shadow-sm'
                }`}
              >
                {t.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DC143C] text-white text-[11px] font-bold font-mono px-3 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    MOST POPULAR
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="text-xl font-bold text-[#0F172A] font-heading">{t.tier}</h2>
                    {isCurrent && (
                      <span className="text-[10px] font-mono font-bold bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded-md">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#64748B] min-h-[36px] mb-4 leading-relaxed">
                    {t.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-[#F1F5F9]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-heading">
                        {price === 0 ? 'Free' : formatCurrency(price, displayCurrency)}
                      </span>
                      {price > 0 && (
                        <span className="text-xs text-[#64748B] font-medium">
                          {isYearly ? '/ 365 days' : '/ 30 days'}
                        </span>
                      )}
                    </div>
                    {isYearly && limitConfig.yearlyDiscountPercent > 0 && (
                      <p className="text-[11px] font-mono font-bold text-emerald-700 mt-1">
                        Save {limitConfig.yearlyDiscountPercent}% with bulk annual pass
                      </p>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 mb-8">
                    {t.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#334155]">
                        <Check className="w-4 h-4 text-[#DC143C] shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectTier(t.tier, billingCycle)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    t.popular
                      ? 'bg-[#DC143C] text-white hover:bg-[#B01030] shadow-sm'
                      : 'bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1]'
                  }`}
                >
                  <span>{isCurrent ? 'Current Plan' : t.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </section>

        {/* Horizontal Founder Lifetime Pass Element ($250, lifetime access, no reoccurring charges) */}
        <section className="max-w-[2000px] mx-auto w-full">
          <LifetimePricingBanner
            onSelectLifetime={() => {
              if (onSelectLifetime) {
                onSelectLifetime();
              } else if (onSelectTier) {
                onSelectTier('Collection');
              }
            }}
            isCurrentLifetime={isLifetime || (currentTier === 'Collection' && (user?.isLifetime || user?.subscription?.isLifetime))}
          />
        </section>

        {/* Feature Comparison Matrix */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-10 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
              Plan Comparison Breakdown
            </h2>
            <p className="text-sm text-[#64748B]">
              Detailed feature limits across deck sizes, slab management, and portfolio tools.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-[#334155]">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono text-[11px] uppercase">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-2 text-center">Starter</th>
                  <th className="py-3 px-2 text-center">Bunch</th>
                  <th className="py-3 px-2 text-center">Stack</th>
                  <th className="py-3 px-2 text-center bg-[#FFF0F3]/50 text-[#DC143C] font-bold">Deck</th>
                  <th className="py-3 px-2 text-center">Collection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Custom Decks</td>
                  <td className="py-3 px-2 text-center font-mono">4</td>
                  <td className="py-3 px-2 text-center font-mono">9</td>
                  <td className="py-3 px-2 text-center font-mono">15</td>
                  <td className="py-3 px-2 text-center font-mono font-bold bg-[#FFF0F3]/30 text-[#DC143C]">18</td>
                  <td className="py-3 px-2 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Cards per Deck</td>
                  <td className="py-3 px-2 text-center font-mono">25</td>
                  <td className="py-3 px-2 text-center font-mono">40</td>
                  <td className="py-3 px-2 text-center font-mono">50</td>
                  <td className="py-3 px-2 text-center font-mono font-bold bg-[#FFF0F3]/30 text-[#DC143C]">60 (Tournament)</td>
                  <td className="py-3 px-2 text-center font-mono">60 (Tournament)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Wishlists</td>
                  <td className="py-3 px-2 text-center font-mono">3</td>
                  <td className="py-3 px-2 text-center font-mono">8</td>
                  <td className="py-3 px-2 text-center font-mono">15</td>
                  <td className="py-3 px-2 text-center font-mono font-bold bg-[#FFF0F3]/30 text-[#DC143C]">25</td>
                  <td className="py-3 px-2 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Items per List</td>
                  <td className="py-3 px-2 text-center font-mono">20</td>
                  <td className="py-3 px-2 text-center font-mono">50</td>
                  <td className="py-3 px-2 text-center font-mono">100</td>
                  <td className="py-3 px-2 text-center font-mono font-bold bg-[#FFF0F3]/30 text-[#DC143C]">200</td>
                  <td className="py-3 px-2 text-center font-mono">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Slab Cert Logging (PSA/BGS/CGC)</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold">&check;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold">&check;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold bg-[#FFF0F3]/30">&check;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold">&check;</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">PTCGL 1-Click Export</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold bg-[#FFF0F3]/30">&check;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold">&check;</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-[#0F172A]">Sealed Vault Tracker</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#94A3B8]">&mdash;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold bg-[#FFF0F3]/30">&check;</td>
                  <td className="py-3 px-2 text-center text-[#DC143C] font-bold">&check;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing FAQs Section */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs p-6 sm:p-10 max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>BILLING QUESTIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] font-heading">
              Frequently Asked Billing Questions
            </h2>
          </div>

          <div className="space-y-4">
            {pricingFaqs.map((faq, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-white text-[#0F172A] border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-6 max-w-5xl mx-auto shadow-xl relative overflow-hidden">
          <div className="space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading">
              Ready to take your Pokémon collection to the next level?
            </h2>
            <p className="text-[#64748B] text-sm sm:text-base max-w-2xl mx-auto">
              Create your account in seconds and unlock live market tracking, PSA slab logging, and tournament deckbuilding.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <button
              onClick={onOpenAuth}
              className="px-6 py-3.5 rounded-xl bg-[#DC143C] text-white font-bold text-sm hover:bg-[#B01030] transition-colors shadow-lg shadow-[#DC143C]/20 cursor-pointer"
            >
              Get Started Free
            </button>
            <button
              onClick={() => onSelectTier('Deck')}
              className="px-6 py-3.5 rounded-xl bg-white text-[#0F172A] font-bold text-sm hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Explore Deck Plan
            </button>
          </div>
        </section>
      </main>

      <PublicInterlinkMesh currentPath="/pricing" />

      <LandingFooter
        onEnterApp={onEnterApp || onOpenAuth}
        onOpenAuth={onOpenAuth}
        onNavigateSection={() => {}}
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
