import React from 'react';
import { AccountTier, DisplayCurrency } from '../types';
import { LandingNav } from '../components/landing/LandingNav';
import { HeroWideSection } from '../components/landing/HeroWideSection';
import { ZigZagSection } from '../components/landing/ZigZagSection';
import { PricingHeroSection } from '../components/landing/PricingHeroSection';
import { LandingFooter } from '../components/landing/LandingFooter';

import { CollectionMockup } from '../components/landing/mockups/CollectionMockup';
import { MetricsMockup } from '../components/landing/mockups/MetricsMockup';
import { DecksMockup } from '../components/landing/mockups/DecksMockup';
import { SetsMockup } from '../components/landing/mockups/SetsMockup';
import { SearchMockup } from '../components/landing/mockups/SearchMockup';
import { ListsMockup } from '../components/landing/mockups/ListsMockup';
import { SealedVaultMockup } from '../components/landing/mockups/SealedVaultMockup';

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  onSelectTier: (tier: AccountTier) => void;
  currentTier?: AccountTier;
  displayCurrency: DisplayCurrency;
  onSelectCurrency: (c: DisplayCurrency) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterApp,
  onOpenAuth,
  onSelectTier,
  currentTier = 'Starter',
  displayCurrency,
  onSelectCurrency,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:16px_16px] text-[#0F172A] flex flex-col font-sans overflow-x-hidden">
      {/* 1. Header Navigation */}
      <LandingNav
        onEnterApp={onEnterApp}
        onOpenAuth={onOpenAuth}
        displayCurrency={displayCurrency}
        onSelectCurrency={onSelectCurrency}
      />

      {/* 2. Wide Hero Section */}
      <HeroWideSection
        onEnterApp={onEnterApp}
        onExploreFeatures={() => scrollTo('collection')}
        displayCurrency={displayCurrency}
      />

      {/* 3. Alternating Sections with Text & UI Mockups */}
      {/* Section 1: Collection */}
      <ZigZagSection
        id="collection"
        index="01/07"
        badge="SLAB & RAW COLLECTION"
        title="Interactive Slab Display & Grade Registry"
        description="Catalog your graded slabs (PSA, BGS, CGC) and raw binders with holographic tilt physics, authentic certification metadata, and continuous market price tracking."
        bulletPoints={[
          {
            title: 'Precision Slabs & Grades',
            desc: 'Track certificate numbers, subgrades (Centering, Surface, Corners, Edges), and graded population status.',
          },
          {
            title: 'Live TCG Market Valuation',
            desc: 'Continuous price sync with verified marketplace data and historical sales records.',
          },
          {
            title: 'Holographic Simulation',
            desc: 'Interactive card shimmer physics that replicate rainbow foil, secret rares, and textured gold cards.',
          },
        ]}
        mockup={<CollectionMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Explore Collection Studio"
        onCtaClick={onEnterApp}
      />

      {/* Section 2: Metrics */}
      <ZigZagSection
        id="metrics"
        index="02/07"
        badge="PORTFOLIO VALUATION & METRICS"
        title="Real-Time NAV Growth Curves & Era Allocation"
        description="Analyze your total collection value with institutional-grade financial intelligence. Track portfolio equity, cost basis, unrealized capital gains, and top market performers."
        bulletPoints={[
          {
            title: 'Portfolio Equity Growth',
            desc: 'Interactive 7D, 30D, 90D, 1Y, and all-time portfolio equity curves with performance metrics.',
          },
          {
            title: 'Era & Rarity Allocation',
            desc: 'Visual asset distribution breakdowns across Scarlet & Violet, Sword & Shield, Sun & Moon, and Vintage WOTC.',
          },
          {
            title: 'Multi-Currency Real-Time Exchange',
            desc: 'Automatic currency conversion across USD, EUR, GBP, JPY, CAD, AUD, and 20+ currencies with live rates.',
          },
        ]}
        mockup={<MetricsMockup currency={displayCurrency} />}
        reversed={true}
        ctaText="View Portfolio Analytics"
        onCtaClick={onEnterApp}
      />

      {/* Section 3: Decks */}
      <ZigZagSection
        id="decks"
        index="03/07"
        badge="TOURNAMENT STUDIO"
        title="60-Card Architecture & Legality Validation"
        description="Engineer tournament-grade 60-card decks with real-time regulation mark validation (Standard G/H, Expanded), Pokémon/Trainer/Energy composition balance, and one-click PTCGL export."
        bulletPoints={[
          {
            title: 'Regulation Mark Validator',
            desc: 'Automatic legality verification ensuring every card complies with current official tournament formats.',
          },
          {
            title: 'Ratio Health Monitor',
            desc: 'Visual distribution bars analyzing engine stability and optimal energy counts.',
          },
          {
            title: 'Export & Proxy Printing',
            desc: 'Export standard PTCGL deck codes, custom printable proxy sheets, and shareable public deck links.',
          },
        ]}
        mockup={<DecksMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Build Your First Deck"
        onCtaClick={onEnterApp}
      />

      {/* Section 4: Sets */}
      <ZigZagSection
        id="sets"
        index="04/07"
        badge="MASTER SET COMPLETION"
        title="148+ Expansions Matrix & Master Checklists"
        description="Track master set completion across every Pokémon TCG expansion ever printed. Automatically categorize regular, reverse holo, secret rare, and special illustration cards."
        bulletPoints={[
          {
            title: 'Master Checklist Tracker',
            desc: 'Visual progress rings and missing-card identifiers to quickly find the exact singles you need to complete each set.',
          },
          {
            title: 'Complete Era Catalog',
            desc: 'Full high-resolution artwork, card set numbers, and release dates from 1999 Base Set to latest Scarlet & Violet expansions.',
          },
          {
            title: 'Trophy Milestones',
            desc: 'Unlock milestone badges and mastery stats when completing 100% of an expansion checklist.',
          },
        ]}
        mockup={<SetsMockup currency={displayCurrency} />}
        reversed={true}
        ctaText="Track Master Sets"
        onCtaClick={onEnterApp}
      />

      {/* Section 5: Search */}
      <ZigZagSection
        id="search"
        index="05/07"
        badge="INSTANT CARD SEARCH"
        title="Instant Multi-Attribute Filter Matrix"
        description="Search through tens of thousands of Pokémon cards instantly without lag. Filter by HP, Illustrator, Attack damage, Card Type, Stage, Rarity, and Price bounds with instant responsiveness."
        bulletPoints={[
          {
            title: 'Instant Card Search',
            desc: 'Instant lookup and fuzzy matching allowing seamless browsing even with slow network connections.',
          },
          {
            title: 'Advanced Filter Matrix',
            desc: 'Combine filters with ease: match Fire types with 280+ HP and Special Illustration Rare status in one click.',
          },
          {
            title: 'Global ⌘K Command Palette',
            desc: 'Quick keyboard shortcut anywhere in the app to jump to cards, decks, sets, or fast actions.',
          },
        ]}
        mockup={<SearchMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Search Cards Now"
        onCtaClick={onEnterApp}
      />

      {/* Section 6: Lists */}
      <ZigZagSection
        id="lists"
        index="06/07"
        badge="CURATED WATCHLISTS"
        title="Custom Watchlists & Target Price Alerts"
        description="Create bespoke hunting lists, trade binders, and investment watchlists. Set target buy/sell price thresholds and get instant visual indicators when market prices hit your goal."
        bulletPoints={[
          {
            title: 'Target Price Triggers',
            desc: 'Define ideal entry prices for grail cards and monitor market dips in real time.',
          },
          {
            title: 'Multi-List Organization',
            desc: 'Organize cards into distinct lists for Trade Events, PSA Submissions, or Speculative Buys.',
          },
          {
            title: 'Data Portability',
            desc: 'Export watchlists into clean spreadsheet and backup formats for inventory audits and records.',
          },
        ]}
        mockup={<ListsMockup currency={displayCurrency} />}
        reversed={true}
        ctaText="Create Custom Watchlists"
        onCtaClick={onEnterApp}
      />

      {/* Section 7: Sealed Vault */}
      <ZigZagSection
        id="sealed-vault"
        index="07/07"
        badge="SEALED VAULT INVENTORY"
        title="Booster Box & Sealed Asset Management"
        description="Dedicated inventory management for booster boxes, Elite Trainer Boxes (ETB), Ultra-Premium Collections (UPC), and sealed cases. Track case multipliers, cost basis, and unrealized profits."
        bulletPoints={[
          {
            title: 'Sealed Unit Types',
            desc: 'Native tracking for booster boxes, sleeved booster packs, blister packs, ETBs, tins, and master cases.',
          },
          {
            title: 'Case Multipliers',
            desc: 'Automatically tracks 6x booster box cases or 10x ETB cases with individual and total valuations.',
          },
          {
            title: 'Profit & ROI Calculations',
            desc: 'Instant profit margin meters and ROI performance metrics across all sealed acquisitions.',
          },
        ]}
        mockup={<SealedVaultMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Open Sealed Vault"
        onCtaClick={onEnterApp}
      />

      {/* 4. Pricing Section */}
      <PricingHeroSection
        currentTier={currentTier}
        onSelectTier={onSelectTier}
        displayCurrency={displayCurrency}
      />

      {/* 5. Page Footer */}
      <LandingFooter
        onEnterApp={onEnterApp}
        onOpenAuth={onOpenAuth}
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
