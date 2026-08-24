import React, { useEffect } from 'react';
import { HeroWideSection } from '../components/landing/HeroWideSection';
import { ZigZagSection } from '../components/landing/ZigZagSection';
import { CollectionMockup } from '../components/landing/mockups/CollectionMockup';
import { MetricsMockup } from '../components/landing/mockups/MetricsMockup';
import { DecksMockup } from '../components/landing/mockups/DecksMockup';
import { SetsMockup } from '../components/landing/mockups/SetsMockup';
import { SearchMockup } from '../components/landing/mockups/SearchMockup';
import { ListsMockup } from '../components/landing/mockups/ListsMockup';
import { SealedVaultMockup } from '../components/landing/mockups/SealedVaultMockup';
import { PricingHeroSection } from '../components/landing/PricingHeroSection';
import { LandingFaqAndBlogs } from '../components/landing/LandingFaqAndBlogs';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingMotionDirectorate } from '../components/landing/LandingMotionDirectorate';
import { AccountTier, DisplayCurrency } from '../types';

interface LandingPageViewProps {
  onOpenAuth: () => void;
  onEnterApp?: () => void;
  onNavigateAbout?: () => void;
  onNavigateHowItWorks?: () => void;
  currentTier?: AccountTier;
  onSelectTier: (tier: AccountTier) => void;
  displayCurrency: DisplayCurrency;
  user?: any;
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
}) => {
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
      {/* Global Scroll Progress & Continuous Ambient Motion Directorate */}
      <LandingMotionDirectorate />

      {/* 1. Header Navigation */}
      <LandingNav
        onOpenAuth={onOpenAuth}
        onEnterApp={onEnterApp}
        onNavigateSection={handleNavClick}
        user={user}
      />

      {/* 2. Wide Hero Section / About Section */}
      <div id="about" className="scroll-mt-16">
        <HeroWideSection
          onEnterApp={onEnterApp}
          displayCurrency={displayCurrency}
        />
      </div>

      {/* 3. Alternating Sections with Text & UI Mockups */}
      {/* Section 1: Collection / How It Works Anchor */}
      <div id="how-it-works" className="scroll-mt-16">
        <ZigZagSection
          id="collection"
          index="01/07"
          badge="RAW CARDS & GRADED SLABS"
          title="Keep your binder copies and graded slabs organized in one place"
          description="Add raw cards by condition (Near Mint down to Damaged) or log your graded slabs with cert numbers, grading company, and subgrades. Keep track of what you paid for each card so you always know your cost basis."
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
          ctaText="Open Collection"
          onCtaClick={onOpenAuth}
        />
      </div>

      {/* Section 2: Metrics */}
      <ZigZagSection
        id="metrics"
        index="02/07"
        badge="PORTFOLIO VALUE & PRICE HISTORY"
        title="See what your Pokémon collection is worth based on live market sales"
        description="Stop updating spreadsheets by hand. Your collection total updates automatically using verified TCGplayer market prices and recent eBay sales."
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
        ctaText="View Collection Value"
        onCtaClick={onEnterApp}
      />

      {/* Section 3: Decks */}
      <ZigZagSection
        id="decks"
        index="03/07"
        badge="60-CARD TOURNAMENT DECKS"
        title="Build and test 60-card decks with current standard format legality"
        description="Put together your deck lists for local league cups or online testing. The builder verifies standard regulation marks (F, G, H, I blocks) and keeps your Pokémon, Trainer, and Energy counts balanced."
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
        ctaText="Build a 60-Card Deck"
        onCtaClick={onEnterApp}
      />

      {/* Section 4: Sets */}
      <ZigZagSection
        id="sets"
        index="04/07"
        badge="MASTER SET CHECKLISTS"
        title="Check off every card from Base Set to the latest expansion"
        description="Complete checklists for every English and Japanese set released. Track your progress across regular set numbers, parallel reverse holos, Secret Illustration Rares (SIRs), Special Art Rares (SARs), and black star promos."
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
        ctaText="Explore Set Checklists"
        onCtaClick={onEnterApp}
      />

      {/* Section 5: Search */}
      <ZigZagSection
        id="search"
        index="05/07"
        badge="CARD DATABASE SEARCH"
        title="Find any Pokémon card instantly by name, artist, type, or set"
        description="Search through the entire history of the Pokémon TCG without waiting for pages to load. Filter cards by Pokémon type, stage (Basic, Stage 1, Stage 2), illustrator, HP, attack damage, or price range."
        bulletPoints={[
          {
            title: 'Search by Illustrator',
            desc: 'Find every card drawn by your favorite artists like Mitsuhiro Arita, Tomokazu Komiya, or Ken Sugimori.',
          },
          {
            title: 'Fast Filter Combinations',
            desc: 'Combine set name, rarity, and card type to find exact prints in seconds.',
          },
          {
            title: 'Quick Keyboard Search',
            desc: 'Press ⌘K on Mac or Ctrl+K on Windows to open the search bar from any screen.',
          },
        ]}
        mockup={<SearchMockup currency={displayCurrency} />}
        reversed={false}
        ctaText="Search Cards"
        onCtaClick={onEnterApp}
      />

      {/* Section 6: Lists */}
      <ZigZagSection
        id="lists"
        index="06/07"
        badge="GRAIL LISTS & PRICE ALERTS"
        title="Set price alerts on cards you are chasing"
        description="Create wishlists for cards you want to buy at card shows or trade for at local meetups. Set price targets and get notified when a card drops into your price range."
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
        ctaText="Create a Wishlist"
        onCtaClick={onEnterApp}
      />

      {/* Section 7: Sealed Vault */}
      <ZigZagSection
        id="sealed-vault"
        index="07/07"
        badge="SEALED PRODUCT & HIGH-END CARDS"
        title="Keep a separate record for sealed boxes, cases, and high-value grails"
        description="Track factory-sealed booster boxes, Elite Trainer Boxes (ETBs), booster bundles, and collection boxes alongside your high-value vintage slabs."
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
        ctaText="Open Sealed Tracker"
        onCtaClick={onEnterApp}
      />

      {/* 4. Pricing Section */}
      <PricingHeroSection
        currentTier={currentTier}
        onSelectTier={onSelectTier}
        displayCurrency={displayCurrency}
      />

      {/* 5. FAQ & Collector Insights (Side-by-Side Internal Scrolling) */}
      <LandingFaqAndBlogs />

      {/* 6. Page Footer */}
      <LandingFooter
        onEnterApp={onEnterApp}
        onOpenAuth={onOpenAuth}
        onNavigateSection={handleNavClick}
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
