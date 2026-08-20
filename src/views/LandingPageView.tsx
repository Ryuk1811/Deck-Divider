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
  onNavigateAbout?: () => void;
  onNavigateHowItWorks?: () => void;
  onSelectTier: (tier: AccountTier) => void;
  currentTier?: AccountTier;
  displayCurrency: DisplayCurrency;
  onSelectCurrency: (c: DisplayCurrency) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onEnterApp,
  onOpenAuth,
  onNavigateAbout,
  onNavigateHowItWorks,
  onSelectTier,
  currentTier = 'Starter',
  displayCurrency,
  onSelectCurrency,
}) => {
  const scrollTo = (id: string) => {
    if (id === 'about' && onNavigateAbout) {
      onNavigateAbout();
      return;
    }
    if (id === 'how-it-works' && onNavigateHowItWorks) {
      onNavigateHowItWorks();
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:16px_16px] text-[#0F172A] flex flex-col font-sans overflow-x-hidden">
      {/* 1. Header Navigation */}
      <LandingNav
        onOpenAuth={onOpenAuth}
        onNavigateSection={scrollTo}
      />

      {/* 2. Wide Hero Section / About Section */}
      <div id="about" className="scroll-mt-16">
        <HeroWideSection
          displayCurrency={displayCurrency}
        />
      </div>

      {/* 3. Alternating Sections with Text & UI Mockups */}
      {/* Section 1: Collection / How It Works Anchor */}
      <div id="how-it-works" className="scroll-mt-16">
        <ZigZagSection
          id="collection"
          index="01/07"
          badge="SLAB & RAW ASSET REGISTRY"
          title="Cryptographic-Grade Slab & Binder Management"
          description="Maintain a flawless ledger of your graded slabs (PSA, BGS, CGC) and raw inventory. Features include authentic certification metadata parsing, real-time market price syncing, and interactive holographic physics."
          bulletPoints={[
            {
              title: 'Certification Integrity',
              desc: 'Log and verify unique certificate numbers, grading company metadata, and detailed subgrades (Centering, Surface, Corners, Edges).',
            },
            {
              title: 'Continuous Valuation Sync',
              desc: 'Live price aggregation from verified marketplace APIs and historical sales data to determine true asset net worth.',
            },
            {
              title: 'Digital Twin Physics',
              desc: 'Immersive interactive card shimmer that accurately replicates rainbow foil, secret rare textures, and gold finishes.',
            },
          ]}
          mockup={<CollectionMockup currency={displayCurrency} />}
          reversed={false}
          ctaText="Explore Asset Registry"
          onCtaClick={onOpenAuth}
        />
      </div>

      {/* Section 2: Metrics */}
      <ZigZagSection
        id="metrics"
        index="02/07"
        badge="FINANCIAL INTELLIGENCE"
        title="Real-Time NAV Curves & Asset Allocation"
        description="Monitor your collection's financial health with terminal-grade analytics. Track aggregate portfolio equity, absolute cost basis, unrealized capital gains, and segmented market performance."
        bulletPoints={[
          {
            title: 'Equity Growth Trajectories',
            desc: 'Visualize 7D, 30D, 90D, and All-Time portfolio equity curves against baseline market performance.',
          },
          {
            title: 'Era & Rarity Segmentation',
            desc: 'Break down asset distribution across modern expansions (Scarlet & Violet) to Vintage WOTC with precision charting.',
          },
          {
            title: 'Live FX Conversion',
            desc: 'Seamless multi-currency settlement and real-time exchange rates across USD, EUR, GBP, JPY, and 20+ global fiat currencies.',
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
        badge="TOURNAMENT ARCHITECTURE"
        title="Championship-Grade 60-Card Engineering"
        description="Construct optimal tournament decks with strict regulation mark validation (Standard/Expanded). Analyze Pokémon, Trainer, and Energy distribution metrics before exporting directly to PTCGL."
        bulletPoints={[
          {
            title: 'Automated Format Validation',
            desc: 'Real-time legality enforcement ensuring complete compliance with the latest official Play! Pokémon tournament rulesets.',
          },
          {
            title: 'Engine Stability Metrics',
            desc: 'Visual distribution histograms detailing optimal card ratios, draw power probabilities, and energy counts.',
          },
          {
            title: 'Seamless PTCGL Export',
            desc: 'Generate standardized deck strings for immediate import into Pokémon TCG Live or print high-fidelity proxy sheets.',
          },
        ]}
        mockup={<DecksMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Architect Your First Deck"
        onCtaClick={onEnterApp}
      />

      {/* Section 4: Sets */}
      <ZigZagSection
        id="sets"
        index="04/07"
        badge="MASTER EXPANSION TRACKING"
        title="Complete Matrix of 148+ Printed Expansions"
        description="Execute comprehensive master set tracking across the entire history of the Pokémon TCG. Automatically isolate regular prints, reverse holos, secret rares, and illustration rares."
        bulletPoints={[
          {
            title: 'Definitive Checklist Ledgers',
            desc: 'Granular progress rings and missing-asset identifiers designed to streamline the acquisition of exact singles needed.',
          },
          {
            title: 'Historical Era Catalogs',
            desc: 'Access high-resolution archival scans and metadata from the 1999 Base Set through the current generation.',
          },
          {
            title: 'Completion Milestones',
            desc: 'Cryptographic badges and mastery statistics awarded upon achieving 100% completion of any official expansion.',
          },
        ]}
        mockup={<SetsMockup currency={displayCurrency} />}
        reversed={true}
        ctaText="View Expansion Ledgers"
        onCtaClick={onEnterApp}
      />

      {/* Section 5: Search */}
      <ZigZagSection
        id="search"
        index="05/07"
        badge="LOW-LATENCY INDEXING"
        title="High-Frequency Multi-Vector Search Matrix"
        description="Query tens of thousands of printed cards with zero-latency response times. Combine complex filters for HP, Artist, Attack metrics, Rarity, and Live Price boundaries instantly."
        bulletPoints={[
          {
            title: 'Sub-Millisecond Querying',
            desc: 'Optimized local indexing and fuzzy string matching for instantaneous browsing, even under heavy network latency.',
          },
          {
            title: 'Advanced Parameter Stacking',
            desc: 'Chain complex queries: isolate Fire-type Pokémon with 280+ HP and Special Illustration Rare status in a single keystroke.',
          },
          {
            title: 'Global Command Architecture',
            desc: 'Utilize the ⌘K command palette from anywhere in the workspace to instantly traverse to assets, decks, or tools.',
          },
        ]}
        mockup={<SearchMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Execute a Query"
        onCtaClick={onEnterApp}
      />

      {/* Section 6: Lists */}
      <ZigZagSection
        id="lists"
        index="06/07"
        badge="ALGORITHMIC WATCHLISTS"
        title="Bespoke Targeting & Price Action Alerts"
        description="Structure targeted acquisition lists, trade binders, and speculative watchlists. Define exact buy/sell price thresholds and monitor real-time market action against your goals."
        bulletPoints={[
          {
            title: 'Threshold Triggers',
            desc: 'Establish definitive entry points for grail assets and monitor market retracements with visual price indicators.',
          },
          {
            title: 'Categorical Organization',
            desc: 'Segment targeted cards into isolated lists for Trade Show Events, Bulk PSA Submissions, or Long-Term Holds.',
          },
          {
            title: 'Data Portability',
            desc: 'Export curated watchlists into standardized CSV formats for external inventory audits, ledgers, and institutional records.',
          },
        ]}
        mockup={<ListsMockup currency={displayCurrency} />}
        reversed={true}
        ctaText="Build Target Parameters"
        onCtaClick={onEnterApp}
      />

      {/* Section 7: Sealed Vault */}
      <ZigZagSection
        id="sealed-vault"
        index="07/07"
        badge="SEALED ASSET VAULT"
        title="Institutional Sealed Inventory Management"
        description="Manage high-value sealed inventory including Booster Boxes, Elite Trainer Boxes, and Ultra-Premium Collections. Track wholesale case multipliers and compound ROI."
        bulletPoints={[
          {
            title: 'Comprehensive Unit Taxonomy',
            desc: 'Native infrastructure for tracking sleeved booster packs, blister packs, ETBs, tins, and master cases.',
          },
          {
            title: 'Wholesale Case Multipliers',
            desc: 'Automatic aggregation of 6x booster box cases or 10x ETB cases, mapping individual unit costs to total case valuation.',
          },
          {
            title: 'ROI & Margin Analytics',
            desc: 'Instantaneous profit margin visualizations and compound return performance metrics across your entire sealed position.',
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
        onNavigateSection={scrollTo}
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
