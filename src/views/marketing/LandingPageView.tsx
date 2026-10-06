import React, { useEffect, lazy, Suspense } from 'react';
import { trackLandingView, trackCtaClick } from '../../lib/analytics';
import { HeroWideSection } from '../../components/landing/HeroWideSection';
import { ZigZagSection } from '../../components/landing/ZigZagSection';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingMotionDirectorate } from '../../components/landing/LandingMotionDirectorate';
import { AccountTier, DisplayCurrency } from '../../types';
import { SectionHeaderLine } from '../../components/landing/SectionHeaderLine';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PageHead } from '../../components/seo/PageHead';
import { getHomepageSchema } from '../../components/seo/schemaData';

// Lazy load below-the-fold interactive mockups and marketing panels for instant initial paint
const CollectionMockup = lazy(() => import('../../components/landing/mockups/CollectionMockup').then(m => ({ default: m.CollectionMockup })));
const MetricsMockup = lazy(() => import('../../components/landing/mockups/MetricsMockup').then(m => ({ default: m.MetricsMockup })));
const DecksMockup = lazy(() => import('../../components/landing/mockups/DecksMockup').then(m => ({ default: m.DecksMockup })));
const SetsMockup = lazy(() => import('../../components/landing/mockups/SetsMockup').then(m => ({ default: m.SetsMockup })));
const SearchMockup = lazy(() => import('../../components/landing/mockups/SearchMockup').then(m => ({ default: m.SearchMockup })));
const ListsMockup = lazy(() => import('../../components/landing/mockups/ListsMockup').then(m => ({ default: m.ListsMockup })));
const SealedVaultMockup = lazy(() => import('../../components/landing/mockups/SealedVaultMockup').then(m => ({ default: m.SealedVaultMockup })));

const LandingFeatureGrid = lazy(() => import('../../components/landing/LandingFeatureGrid').then(m => ({ default: m.LandingFeatureGrid })));
const CollectorSocialProofSection = lazy(() => import('../../components/landing/CollectorSocialProofSection').then(m => ({ default: m.CollectorSocialProofSection })));
const VerifiedReviewsStrip = lazy(() => import('../../components/common/VerifiedReviewsStrip').then(m => ({ default: m.VerifiedReviewsStrip })));
const PlatformPhilosophySection = lazy(() => import('../../components/landing/PlatformPhilosophySection').then(m => ({ default: m.PlatformPhilosophySection })));
const PricingHeroSection = lazy(() => import('../../components/landing/PricingHeroSection').then(m => ({ default: m.PricingHeroSection })));
const LandingFaqAndBlogs = lazy(() => import('../../components/landing/LandingFaqAndBlogs').then(m => ({ default: m.LandingFaqAndBlogs })));
const LandingPrivacyPolicySection = lazy(() => import('../../components/landing/LandingPrivacyPolicySection').then(m => ({ default: m.LandingPrivacyPolicySection })));
const LandingSocialsSection = lazy(() => import('../../components/landing/LandingSocialsSection').then(m => ({ default: m.LandingSocialsSection })));
const LandingFooter = lazy(() => import('../../components/landing/LandingFooter').then(m => ({ default: m.LandingFooter })));

interface LandingPageViewProps {
  onOpenAuth: () => void;
  onEnterApp?: () => void;
  onNavigateAbout?: () => void;
  onNavigateHowItWorks?: () => void;
  currentTier?: AccountTier;
  onSelectTier: (tier: AccountTier) => void;
  displayCurrency: DisplayCurrency;
  onSelectCurrency?: (currency: DisplayCurrency) => void;
  user?: any;
  onImportCustomCards?: (entries: any[]) => void;
  onSelectCard?: (card: any) => void;
  onSelectLifetime?: () => void;
  isLifetime?: boolean;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenAuth,
  onEnterApp,
  onNavigateAbout,
  onNavigateHowItWorks,
  currentTier = 'Starter',
  onSelectTier,
  displayCurrency,
  user,
  onImportCustomCards,
  onSelectCard,
  onSelectLifetime,
  isLifetime = false,
}) => {
  // Track landing page view on mount
  useEffect(() => {
    trackLandingView();
  }, []);

  const handleOpenAuthWithAnalytics = (ctaSource?: string) => {
    trackCtaClick(ctaSource || 'landing_cta');
    onOpenAuth();
  };

  // Listen for hash in URL on initial mount or updates
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavClick = (id: string) => {
    if (id === 'about' && onNavigateAbout) {
      onNavigateAbout();
      return;
    }
    if (id === 'how-it-works' && onNavigateHowItWorks) {
      onNavigateHowItWorks();
      return;
    }
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative select-none">
      <PageHead
        title="DECK / divider — Institutional Pokémon TCG Collection Tracker, Slab Vault & Deck Studio"
        description="The ultimate Pokémon TCG collection tracker and tournament deck studio. Track raw cards, PSA/BGS/CGC slabs, and sealed booster boxes with live TCGplayer market prices and offline-first privacy."
        canonicalPath="/"
        keywords={[
          'pokemon card tracker',
          'pokemon collection tracker',
          'pokemon card value app',
          'pokemon deck builder',
          'psa slab registry',
          'tcgplayer market prices',
          'pokemon sealed vault',
          'ptcgl deck export',
          'master set tracker'
        ]}
        schema={getHomepageSchema()}
      />
      {/* Global Scroll Progress & Continuous Ambient Motion Directorate */}
      <LandingMotionDirectorate />

      {/* 1. Header Navigation */}
      <LandingNav
        onOpenAuth={onOpenAuth}
        onEnterApp={onEnterApp}
        onNavigateSection={handleNavClick}
        user={user}
      />

      <main className="flex-1 w-full flex flex-col">
        {/* Hero Section */}
        <div id="about" className="scroll-mt-16">
          <HeroWideSection
            onEnterApp={onEnterApp}
            onOpenAuth={onOpenAuth}
            user={user}
            displayCurrency={displayCurrency}
            onImportCustomCards={onImportCustomCards}
            onSelectCard={onSelectCard}
          />
        </div>

        {/* PTC Collectibles Official Partner Perk */}
        <div className="w-full py-2">
          <PtcPartnerBanner />
        </div>

        {/* Section 01 Header Line: Summary */}
        <SectionHeaderLine
          id="summary"
          index="01"
          badge="SUMMARY"
          title="Everything in one place"
          subtitle="A quick synthesis of all core modules and capabilities before diving deep into each workflow."
        />

        <Suspense fallback={<div className="w-full py-8 text-center text-slate-300 font-mono text-xs">Loading studio modules...</div>}>
          {/* Feature Discoverability Grid (Summary of features & propositions) */}
          <LandingFeatureGrid />

        {/* Section 02 Header Line: Features */}
        <SectionHeaderLine
          id="how-it-works"
          index="02"
          badge="CORE MODULES"
          title="Engineered for tournament play, binder organization & asset vaulting"
          subtitle="Detailed breakdown of all 7 dedicated tools designed for competitive players and serious collectors."
        />

        {/* Detailed 7 Feature Panels */}
        {/* Panel 1: Collection */}
        <div id="collection" className="scroll-mt-16">
          <ZigZagSection
            id="collection"
            index="01/07"
            badge="BINDER & SLABS"
            title="Raw cards. Graded slabs. One binder."
            description="Log raw conditions from Near Mint to Damaged. Record certified slabs from PSA, BGS, CGC, and ACE. Track purchase basis and cert numbers for accurate break-even valuation."
            bulletPoints={[
              {
                title: 'PSA, BGS & CGC Cert Logging',
                desc: 'Record cert numbers, grades, and subgrades (Centering, Surface, Corners, Edges) for every slab in your box.',
              },
              {
                title: 'Raw Condition Tracking',
                desc: 'Separate binder copies from mint gradable pulls using standard hobby condition tags (NM, LP, MP, HP, DMG).',
              },
              {
                title: 'Purchase Price Log',
                desc: 'Note down what you bought each card for, trade values, and grading submission costs to see your true break-even price.',
              },
            ]}
            mockup={<CollectionMockup currency={displayCurrency} />}
            reversed={false}
            ctaText="Track Your First Card"
            onCtaClick={onEnterApp || onOpenAuth}
          />
        </div>

        {/* Panel 2: Metrics */}
        <ZigZagSection
          id="metrics"
          index="02/07"
          badge="PORTFOLIO NAV"
          title="What's your binder worth right now?"
          description="Live collection valuation. Automatic updates using verified TCGplayer market prices and recent eBay sales."
          bulletPoints={[
            {
              title: 'Value History Charts',
              desc: 'Look at 7-day, 30-day, and all-time value trends for your entire collection or individual cards.',
            },
            {
              title: 'Era Breakdown',
              desc: 'See how much of your collection is Vintage (Base Set through Neo), Mid-Era (EX, Diamond & Pearl, BW), or Modern (Sword & Shield, Scarlet & Violet).',
            },
            {
              title: 'Currency Switcher',
              desc: 'Switch prices between USD ($), EUR (€), GBP (£), JPY (¥), CAD, and AUD with current exchange rates.',
            },
          ]}
          mockup={<MetricsMockup currency={displayCurrency} />}
          reversed={true}
          ctaText="Check Portfolio Value"
          onCtaClick={onEnterApp}
        />

        {/* Panel 3: Decks */}
        <ZigZagSection
          id="decks"
          index="03/07"
          badge="60-CARD STUDIO"
          title="Build a legal 60-card deck in minutes."
          description="Tournament-ready deck lists. Verifies 2026 Standard regulation marks (H, I, J blocks; G rotated) based on published Play! Pokémon rules and enforces card limits."
          bulletPoints={[
            {
              title: 'Standard & Expanded Format Checks',
              desc: 'Flags expired rotation blocks and banned cards before you register for a tournament or league night.',
            },
            {
              title: 'Card Count Ratios',
              desc: 'See your card splits at a glance — basic Pokémon, search items, draw supporters, stadium cards, and energy counts.',
            },
            {
              title: 'Export to PTCGL',
              desc: 'Copy your deck list in the standard format ready to paste directly into Pokémon TCG Live or tournament registration sheets.',
            },
          ]}
          mockup={<DecksMockup currency={displayCurrency} />}
          reversed={false}
          ctaText="Build 60-Card Deck"
          onCtaClick={onEnterApp}
        />

        {/* Panel 4: Sets */}
        <ZigZagSection
          id="sets"
          index="04/07"
          badge="SET TRACKER"
          title="Every set. Every card. Checked off."
          description="Master checklists for English and Japanese sets. Track regular prints, reverse holos, Secret Illustration Rares, Special Art Rares, and promos."
          bulletPoints={[
            {
              title: 'Complete Variant Tracking',
              desc: 'Separate checkboxes for regular cards, reverse holos, Pokéball/Masterball holos, and secret rares.',
            },
            {
              title: 'Missing Cards List',
              desc: 'See which cards you still need to finish a binder, sorted by card number or lowest market price.',
            },
            {
              title: 'Card Art & Details',
              desc: 'Full card scans with illustrator credits, set numbers, retreat costs, and rarity symbols.',
            },
          ]}
          mockup={<SetsMockup currency={displayCurrency} />}
          reversed={true}
          ctaText="Track Master Sets"
          onCtaClick={onEnterApp}
        />

        {/* Panel 5: Instant Search */}
        <div id="search" className="scroll-mt-16">
          <ZigZagSection
            id="search"
            index="05/07"
            badge="INSTANT SEARCH"
            title="Find any card in seconds. Filter by artist, HP, or attack."
            description="Instant search across complete TCG history. Multi-parameter indexing with illustrator filters, attack damage rules, and sub-5ms local lookups."
            bulletPoints={[
              {
                title: 'Search by Illustrator',
                desc: 'Find every card illustrated by Mitsuhiro Arita, Tomokazu Komiya, Ken Sugimori, or Naoki Saito.',
              },
              {
                title: 'Advanced Query Filters',
                desc: 'Combine set expansion, card rarity, HP thresholds, energy types, and regulation marks effortlessly.',
              },
              {
                title: 'Quick Keyboard Shortcut',
                desc: 'Press ⌘K on macOS or Ctrl+K on Windows from anywhere to jump immediately to any card in the catalog.',
              },
            ]}
            mockup={<SearchMockup currency={displayCurrency} />}
            reversed={false}
            ctaText="Search Card Catalog"
            onCtaClick={onEnterApp}
          />
        </div>

        {/* Panel 6: Lists */}
        <ZigZagSection
          id="lists"
          index="06/07"
          badge="WANT-LISTS"
          title="Chasing a grail? Get notified first."
          description="Custom wishlists for trades and purchases. Set target prices and receive instant alerts for market drops."
          bulletPoints={[
            {
              title: 'Price Target Notifications',
              desc: 'Set a target price on raw cards or PSA 10 slabs (e.g. notify if a raw Gengar Alt Art drops under $300).',
            },
            {
              title: 'Custom Wishlists',
              desc: 'Keep your chase cards separate — make lists for Personal Collection grails, trade binder targets, and deck upgrades.',
            },
            {
              title: 'Market Drops',
              desc: 'See which cards on your wishlist have dropped in price over the past week.',
            },
          ]}
          mockup={<ListsMockup currency={displayCurrency} />}
          reversed={true}
          ctaText="Create Grail List"
          onCtaClick={onEnterApp}
        />

        {/* Panel 7: Sealed Vault */}
        <ZigZagSection
          id="sealed-vault"
          index="07/07"
          badge="SEALED VAULT"
          title="Sealed boxes. Vintage slabs. One vault."
          description="Dedicated tracking for factory-sealed booster boxes, Elite Trainer Boxes, bundles, and premium vintage slabs."
          bulletPoints={[
            {
              title: 'Sealed Box Tracking',
              desc: 'Log sealed booster boxes, cases, Pokémon Center ETBs, and special collection tins with original purchase prices.',
            },
            {
              title: 'High-Value Slabs',
              desc: 'Keep records and high-resolution front/back scans of your most valuable cards.',
            },
            {
              title: 'Total Cost vs. Market Value',
              desc: 'Compare what you paid for sealed product versus current market prices.',
            },
          ]}
          mockup={<SealedVaultMockup currency={displayCurrency} />}
          reversed={false}
          ctaText="Vault Sealed Boxes"
          onCtaClick={onEnterApp}
        />

        {/* Collector Community Social Proof */}
        <CollectorSocialProofSection
          onOpenAuth={onOpenAuth}
          onEnterApp={onEnterApp}
        />

        {/* Top Verified Reviews Strip */}
        <section className="py-12 bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <VerifiedReviewsStrip maxItems={3} showStatsHeader={true} />
          </div>
        </section>

        {/* Section 03 Header Line: Platform Philosophy */}
        <SectionHeaderLine
          id="platform-philosophy"
          index="03"
          badge="PHILOSOPHY"
          title="Platform intention, audience & architecture"
          subtitle="Our mission, security standards, and design philosophy behind DECK / divider."
        />

        {/* Platform Philosophy Section */}
        <PlatformPhilosophySection />

        {/* Section 04 Header Line: Pricing */}
        <SectionHeaderLine
          id="pricing-section"
          index="04"
          badge="PRICING"
          title="Transparent tiers for every type of collector"
          subtitle="Start for free with essential logging, or unlock unrestricted portfolio power."
        />

        {/* Pricing Section */}
        <PricingHeroSection
          currentTier={currentTier}
          onSelectTier={onSelectTier}
          displayCurrency={displayCurrency}
          onSelectLifetime={onSelectLifetime}
          isLifetime={isLifetime}
        />

        {/* Section 05 Header Line: FAQ & Guides */}
        <SectionHeaderLine
          id="faq-section"
          index="05"
          badge="KNOWLEDGE"
          title="Frequently asked questions & collector guides"
          subtitle="Common questions on pricing data, grading slabs, deck legality, and collection safety."
        />

        {/* FAQ & Collector Insights */}
        <LandingFaqAndBlogs />

        {/* Section 06 Header Line: Privacy Policy */}
        <SectionHeaderLine
          id="privacy-section"
          index="06"
          badge="DATA PRIVACY"
          title="Data ownership & privacy commitment"
          subtitle="Zero data brokering, local encryption options, and complete user data sovereignty."
        />

        {/* Privacy Policy Section */}
        <LandingPrivacyPolicySection
          onNavigateFullPolicy={() => {
            const el = document.getElementById('privacy');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {/* Socials & Badges Strip */}
        <LandingSocialsSection />

        {/* 6. Page Footer */}
        <LandingFooter
          onEnterApp={onEnterApp}
          onOpenAuth={onOpenAuth}
          onNavigateSection={handleNavClick}
          displayCurrency={displayCurrency}
        />
      </Suspense>
    </div>
  );
};
