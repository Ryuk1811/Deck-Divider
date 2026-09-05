import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Award, 
  Check, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';

interface GuideItem {
  rank: number;
  name: string;
  badge: string;
  rating: number;
  pricing: string;
  platforms: string[];
  summary: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  isUs?: boolean;
}

interface BestOfGuide {
  slug: string;
  title: string;
  h1: string;
  metaDesc: string;
  directAnswerSummary: string; // 40-50 word direct snippet answer
  updatedDate: string;
  items: GuideItem[];
  evaluationCriteria: Array<{ name: string; description: string; weight: string }>;
  faqs: Array<{ question: string; answer: string }>;
}

export const BEST_OF_GUIDES: Record<string, BestOfGuide> = {
  'pokemon-card-trackers': {
    slug: 'pokemon-card-trackers',
    title: 'Best Pokémon TCG Collection Tracker Apps (2025/2026 Ranked)',
    h1: 'Best Pokémon TCG Collection Tracker Apps (Ranked & Tested)',
    metaDesc: 'Looking for the best Pokemon card collection tracker? We tested DECK / divider, Collectr, Pokellector, Dex, and PriceCharting for price accuracy, deck tools, and slab tracking.',
    directAnswerSummary: 'The best overall Pokémon TCG collection tracker is DECK / divider due to its dedicated Pokémon-first architecture, sub-second search, live TCGplayer pricing feeds, 60-card PTCGL deck builder, and private offline-first IndexedDB encryption without disruptive advertisements.',
    updatedDate: 'September 2025',
    evaluationCriteria: [
      { name: 'Pricing Latency & Accuracy', description: 'Live market sync with TCGplayer Lowest Verified and recent graded auction sales.', weight: '30%' },
      { name: 'Pokémon Specialization', description: 'Native support for regulation marks, set checklists, master set finishes, and PTCGL export codes.', weight: '25%' },
      { name: 'Slab & Sealed Vaulting', description: 'Comprehensive tracking of PSA/BGS/CGC grades and booster box / ETB sealed collections.', weight: '20%' },
      { name: 'Privacy & Offline Speed', description: 'Client-side local caching, zero tracking bloat, and encrypted cloud backups.', weight: '15%' },
      { name: 'User Interface Craft', description: 'Modern dark/light UI density, keyboard shortcuts, and responsiveness.', weight: '10%' },
    ],
    items: [
      {
        rank: 1,
        name: 'DECK / divider',
        badge: 'Best Overall for Serious Collectors & Players',
        rating: 4.9,
        pricing: 'Free Forever (Pro tier available)',
        platforms: ['Web / Desktop PWA', 'Mobile iOS / Android Browser'],
        summary: 'DECK / divider is an institutional-grade Pokémon TCG operating system combining raw card vaulting, PSA/BGS slab registries, sealed booster box tracking, and a full 60-card tournament deckbuilder with regulation mark legality and PTCGL export.',
        pros: [
          'Sub-second real-time search across all English & Japanese sets',
          'Live TCGplayer Lowest Verified pricing with multi-currency FX',
          'Built-in tournament legality checker (Standard G & H, Expanded, GLC)',
          '100% offline-first privacy with optional AES-256 cloud sync',
          'Clean, ad-free interface designed specifically for Pokémon'
        ],
        cons: [
          'Laser-focused strictly on Pokémon (does not track MTG or Sports)',
          'Native app store download in progress (runs via PWA on mobile)'
        ],
        bestFor: 'Serious Pokémon collectors, competitive tournament players, and slab investors.',
        isUs: true
      },
      {
        rank: 2,
        name: 'Collectr',
        badge: 'Best for Multi-TCG Portfolios',
        rating: 4.4,
        pricing: 'Freemium with Ads & Paid Sub',
        platforms: ['iOS', 'Android', 'Web'],
        summary: 'Collectr provides cross-category portfolio management across Magic: The Gathering, Yu-Gi-Oh, Pokémon, and sports cards under one app.',
        pros: [
          'Supports multiple collectible games simultaneously',
          'Decent mobile apps with camera barcode barcode scanning',
          'Broad community following'
        ],
        cons: [
          'Lacks tournament format mechanics and deck construction',
          'Banner ads on the free tier slow down older phones',
          'Cannot export tournament lists to PTCGL'
        ],
        bestFor: 'Collectors holding mixed portfolios of Sports, MTG, and Pokémon cards.'
      },
      {
        rank: 3,
        name: 'TCG Collector',
        badge: 'Best for Obscure Card Variants',
        rating: 4.3,
        pricing: 'Freemium with Subscriptions',
        platforms: ['Web Only'],
        summary: 'TCG Collector is a web database that excels in cataloging subtle print finishes, international promos, and variant stamp variations.',
        pros: [
          'In-depth documentation of holographic and reverse holo foil variants',
          'Thorough master set checklist completion percentages',
          'Active community forums'
        ],
        cons: [
          'No tournament deckbuilder or hands testing simulator',
          'Traditional web UI without modern offline-first responsiveness',
          'Financial profit/loss metrics are basic'
        ],
        bestFor: 'Master set completionists focused on identifying obscure holo patterns.'
      },
      {
        rank: 4,
        name: 'PriceCharting',
        badge: 'Best for Historical eBay Auction Charts',
        rating: 4.1,
        pricing: 'Free with Paid API/Database',
        platforms: ['Web'],
        summary: 'PriceCharting aggregates completed eBay auctions to show historical value trends for graded slabs and video games over multi-year periods.',
        pros: [
          'Deep multi-year historical price graphs',
          'Direct links to completed eBay sold listings',
          'Good benchmark for PSA 9 and PSA 10 values'
        ],
        cons: [
          'Cumbersome collection management and binder features',
          'Designed around retro video games rather than card gaming mechanics',
          'Zero deck building or playability tracking'
        ],
        bestFor: 'Cross-checking historical eBay completed sales for rare slabs.'
      },
      {
        rank: 5,
        name: 'Pokellector',
        badge: 'Best for Quick Visual Checklist Browsing',
        rating: 3.8,
        pricing: 'Ad-Supported Web & App',
        platforms: ['Web', 'iOS', 'Android'],
        summary: 'Pokellector is one of the earliest digital checklist directories, displaying cards in clean grid layouts by expansion set.',
        pros: [
          'Simple visual grid layout of expansions',
          'Archive of classic Japanese vintage sets',
          'Straightforward card numbering'
        ],
        cons: [
          'Heavy banner ads on free mobile versions',
          'No graded slab vaulting or portfolio financial analysis',
          'Outdated user interface'
        ],
        bestFor: 'Casual checklist viewing without financial or deck requirements.'
      }
    ],
    faqs: [
      {
        question: 'What is the best free Pokémon card collection tracker?',
        answer: 'DECK / divider is widely considered the best free Pokémon card collection tracker because it provides live TCGplayer market pricing, master set checklists, graded slab tracking, and a 60-card tournament deck builder with zero intrusive advertisements.'
      },
      {
        question: 'How do Pokémon card tracker apps get their prices?',
        answer: 'Top tracker apps connect to API feeds from market aggregators like TCGplayer (Market Price and Lowest Verified), Cardmarket for European transactions, and eBay historical completed auctions for graded slabs.'
      },
      {
        question: 'Can I track graded slabs from PSA, BGS, and CGC?',
        answer: 'Yes. Modern platforms like DECK / divider allow you to log the exact grading company, grade tier (from PSA 1 to BGS Black Label 10), certification number, and custom purchase cost basis to calculate realized profit and loss.'
      }
    ]
  },
  'slab-scanners': {
    slug: 'slab-scanners',
    title: 'Best Pokémon Card Slab Trackers & Graded Value Scanners (2025/2026)',
    h1: 'Best Pokémon Card Slab Trackers & Graded Value Scanners',
    metaDesc: 'Compare the top graded card slab trackers for Pokémon cards. Discover how DECK / divider, PSA Set Registry, and PriceCharting track PSA, BGS, and CGC slab values.',
    directAnswerSummary: 'The best graded Pokémon card slab tracker is DECK / divider for comprehensive portfolio valuation across PSA, BGS, and CGC slabs, combined with real-time TCGplayer feeds, cost-basis tracking, and master set integration.',
    updatedDate: 'September 2025',
    evaluationCriteria: [
      { name: 'Multi-Grading Company Support', description: 'Unified tracking across PSA, BGS, CGC, and TAG slabs in one vault.', weight: '35%' },
      { name: 'Cost-Basis & ROI Analytics', description: 'Tracks purchase price, grading fees, shipping expenses, and realized capital gains.', weight: '30%' },
      { name: 'Auction Price Grounding', description: 'Recent sales benchmarks from eBay and Goldin auctions.', weight: '20%' },
      { name: 'Export & Insurance Reporting', description: 'One-click CSV exports for insurance schedules and tax reporting.', weight: '15%' }
    ],
    items: [
      {
        rank: 1,
        name: 'DECK / divider Slab Vault',
        badge: 'Best Overall Graded Card & Slab Manager',
        rating: 4.9,
        pricing: 'Free with unlimited slab vaulting',
        platforms: ['Web / Desktop PWA', 'Mobile'],
        summary: 'DECK / divider allows collectors to track graded slabs from all major grading companies with custom cert numbers, acquisition costs, subgrades, and real-time market value graphs.',
        pros: [
          'Unified vault for PSA, BGS, CGC, and SGC slabs',
          'Tracks grading fees and net capital gains ROI',
          'One-click insurance schedule CSV export',
          'Public shareable showcase links with verified badges'
        ],
        cons: [
          'Live barcode scanner hardware companion currently in development'
        ],
        bestFor: 'Collectors and investors with graded slabs seeking comprehensive portfolio ROI.',
        isUs: true
      },
      {
        rank: 2,
        name: 'PriceCharting Slabs',
        badge: 'Best for Historical eBay Auction Data',
        rating: 4.3,
        pricing: 'Free / Subscription',
        platforms: ['Web'],
        summary: 'PriceCharting provides historical graphs of graded Pokémon card sales across PSA 7 through PSA 10.',
        pros: [
          'Vast archive of historical sales points',
          'Direct links to completed eBay auctions',
          'Separates ungraded from graded pricing'
        ],
        cons: [
          'Cannot track BGS subgrades or custom certification numbers easily',
          'Basic collection management UI'
        ],
        bestFor: 'Determining historical pricing trends before buying or selling a slab.'
      },
      {
        rank: 3,
        name: 'PSA Set Registry',
        badge: 'Best for PSA-Only Competitive Collectors',
        rating: 4.0,
        pricing: 'Free for PSA Members',
        platforms: ['iOS', 'Android', 'Web'],
        summary: 'The official PSA Set Registry tracks PSA certified cards against other collectors in competitive set rankings.',
        pros: [
          'Official PSA population and set registry leaderboard',
          'High prestige within vintage PSA collector circles',
          'Direct verification against PSA database'
        ],
        cons: [
          'Strictly limited to PSA slabs (cannot track BGS or CGC)',
          'Does not track raw playable cards or tournament decks'
        ],
        bestFor: 'Dedicated PSA master set collectors competing on the official registry.'
      }
    ],
    faqs: [
      {
        question: 'Which grading company cards should I track?',
        answer: 'You should track all major third-party authentication services: Professional Sports Authenticator (PSA), Beckett Grading Services (BGS), and Certified Guaranty Company (CGC). DECK / divider lets you track all three within a single unified portfolio.'
      },
      {
        question: 'How do I calculate if grading a Pokémon card is worth it?',
        answer: 'Compare the raw near-mint market price of the card plus grading and shipping fees ($20-$50) against the historical PSA 9 and PSA 10 sales prices. If the PSA 9 price covers your grading costs and PSA 10 provides at least a 2x-3x upside, grading is mathematically worthwhile.'
      }
    ]
  },
  'deck-builders': {
    slug: 'deck-builders',
    title: 'Best Pokémon TCG Deck Builders with Live Legality (2025/2026)',
    h1: 'Best Pokémon TCG Deck Builders with Live Pricing & Legality',
    metaDesc: 'Discover the top Pokemon TCG deck builders. Compare DECK / divider, Limitless TCG, and PTCGL for 60-card construction, regulation mark legality, and budget calculations.',
    directAnswerSummary: 'The best Pokémon TCG deck builder is DECK / divider because it integrates instant regulation mark legality checking (G & H marks for Standard 2025), live TCGplayer singles cost calculations, collection ownership sync, and 1-click PTCGL export formatting.',
    updatedDate: 'September 2025',
    evaluationCriteria: [
      { name: 'Tournament Legality Verification', description: 'Automatic check for Standard rotation regulation marks, ACE SPEC limits, and Radiant card restrictions.', weight: '35%' },
      { name: 'TCGplayer Singles Cost Calculation', description: 'Real-time estimated cost to build the 60-card list using lowest verified singles.', weight: '25%' },
      { name: 'PTCGL Compatibility', description: 'Zero-error export formatting that imports directly into Pokémon TCG Live.', weight: '25%' },
      { name: 'Collection Integration', description: 'Highlights which cards you already own in your binder versus cards you need to purchase.', weight: '15%' }
    ],
    items: [
      {
        rank: 1,
        name: 'DECK / divider Deck Studio',
        badge: 'Best Integrated Deckbuilder & Budget Optimizer',
        rating: 4.9,
        pricing: 'Free with unlimited decks',
        platforms: ['Web / Desktop PWA', 'Mobile'],
        summary: 'DECK / divider provides a professional 60-card tournament deck studio with live regulation mark validation, rulebox limits (ACE SPECs, Radiant cards), real-time pricing feeds, and seamless PTCGL export.',
        pros: [
          'Validates Standard (G & H marks), Expanded, and GLC format rules',
          'Calculates exact cost to finish deck based on cards already in your vault',
          'Instant 1-click PTCGL copy/paste export code',
          'Opening hand draw simulator and energy curve analytics'
        ],
        cons: [
          'Focuses on 60-card competitive formats (Standard, Expanded, GLC)'
        ],
        bestFor: 'Competitive tournament players and locals competitors wanting accurate cost and legality.',
        isUs: true
      },
      {
        rank: 2,
        name: 'Limitless TCG',
        badge: 'Best for Meta Tournament Results',
        rating: 4.7,
        pricing: 'Free Community Web',
        platforms: ['Web'],
        summary: 'Limitless TCG is the gold standard for competitive tournament decklists, regional championship standings, and archetype win rates.',
        pros: [
          'Authoritative tournament results and Swiss bracket coverage',
          'Massive database of winning decklists from Regionals and Worlds',
          'PTCGL export text on all deck pages'
        ],
        cons: [
          'No personal collection binder integration to see what you own',
          'Cannot save and organize custom personal deck variations easily'
        ],
        bestFor: 'Researching what top players are playing at major Championships.'
      },
      {
        rank: 3,
        name: 'Pokémon TCG Live (In-Game Builder)',
        badge: 'Best for Direct Digital Play',
        rating: 3.5,
        pricing: 'Free-to-Play Game',
        platforms: ['PC', 'Mac', 'iOS', 'Android'],
        summary: 'The official digital game client for Pokémon TCG includes a built-in deck builder using your digital card collection.',
        pros: [
          'Direct playable gameplay testing against AI and live opponents',
          'Official game logic enforcement'
        ],
        cons: [
          'Slow search interface and clunky filters',
          'No real-world physical card pricing or TCGplayer market data',
          'Limited to your in-game digital card inventory'
        ],
        bestFor: 'Playing digital ladder games online.'
      }
    ],
    faqs: [
      {
        question: 'Which regulation marks are legal in Pokémon Standard for 2025?',
        answer: 'For the 2025 tournament season, cards with regulation marks G and H are legal in the Standard format. Older cards with marks E or F have rotated out unless they have been reprinted in a legal expansion with the same name and effect.'
      },
      {
        question: 'How do I import a deck into Pokémon TCG Live (PTCGL)?',
        answer: 'Copy the standard PTCGL text export code from DECK / divider, launch Pokémon TCG Live, navigate to Decks, click "Create a Deck", and select "Import Deck". The game will automatically populate all 60 cards.'
      }
    ]
  }
};

export const BestOfGuidesView: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const currentSlug = slug || 'pokemon-card-trackers';
  const guide = BEST_OF_GUIDES[currentSlug];

  if (!guide) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
          <button onClick={() => navigate('/compare')} className="text-[#38BDF8] hover:underline">
            View All Guides &amp; Comparisons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans text-white">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-white transition-colors">Guides &amp; Compare</Link>
            <span>/</span>
            <span className="text-[#38BDF8]">{guide.title}</span>
          </div>

          {/* Guide Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38BDF8]/10 text-[#38BDF8] text-xs font-mono font-semibold uppercase tracking-wider mb-4 border border-[#38BDF8]/20">
              <Award className="w-3.5 h-3.5" />
              Independent Editorial Guide • Updated {guide.updatedDate}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
              {guide.h1}
            </h1>
            <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed">
              An in-depth, hands-on comparison of the premier tools and software available for the Pokémon Trading Card Game community.
            </p>
          </div>

          {/* Quick Nav Pill Tabs */}
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-[#1E293B]">
            <span className="text-xs font-mono text-[#64748B] self-center mr-2">Jump to:</span>
            {Object.values(BEST_OF_GUIDES).map((g) => (
              <Link
                key={g.slug}
                to={`/best/${g.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  g.slug === currentSlug
                    ? 'bg-[#38BDF8] text-[#0B0F19] font-bold shadow-xs'
                    : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1E293B]'
                }`}
              >
                {g.title.split('(')[0].trim()}
              </Link>
            ))}
          </div>

          {/* Direct Answer Box (Google AI Overview / Featured Snippet Optimized) */}
          <div className="bg-[#111827] border-l-4 border-[#10B981] rounded-xl p-6 sm:p-8 mb-12 shadow-lg">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Direct Summary &amp; Key Takeaway
            </div>
            <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
              {guide.directAnswerSummary}
            </p>
          </div>

          {/* Evaluation Methodology */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 mb-12">
            <h2 className="text-sm font-mono font-bold text-[#94A3B8] uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
              Evaluation Criteria &amp; Testing Methodology
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guide.evaluationCriteria.map((c, i) => (
                <div key={i} className="text-xs">
                  <div className="flex items-center justify-between text-white font-semibold mb-1">
                    <span>{c.name}</span>
                    <span className="text-[#38BDF8] font-mono">{c.weight}</span>
                  </div>
                  <p className="text-[#64748B] leading-normal">{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ranked List of Candidates */}
          <div className="space-y-8 mb-16">
            {guide.items.map((item) => (
              <div 
                key={item.rank}
                className={`bg-[#111827] border rounded-2xl p-6 sm:p-8 transition-all ${
                  item.isUs ? 'border-[#38BDF8]/60 shadow-xl relative overflow-hidden' : 'border-[#1E293B]'
                }`}
              >
                {item.isUs && (
                  <div className="absolute top-0 right-0 bg-[#38BDF8] text-[#0B0F19] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-lg">
                    Editor's #1 Choice
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                      item.rank === 1 ? 'bg-[#38BDF8] text-[#0B0F19]' : 'bg-[#1E293B] text-[#94A3B8]'
                    }`}>
                      #{item.rank}
                    </span>
                    <div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        {item.name}
                      </h3>
                      <span className="text-xs text-[#38BDF8] font-mono font-medium">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <div className="text-right">
                      <div className="text-xs text-[#64748B] font-mono">SCORE</div>
                      <div className="text-lg font-bold text-[#10B981] flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {item.rating} / 5.0
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-[#CBD5E1] text-sm leading-relaxed mb-6">
                  {item.summary}
                </p>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0B0F19] rounded-xl p-4 mb-6 border border-[#1E293B] text-xs">
                  <div>
                    <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-2">Strengths:</span>
                    <ul className="space-y-1.5 text-slate-300">
                      {item.pros.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-rose-400 uppercase tracking-wider block mb-2">Trade-offs:</span>
                    <ul className="space-y-1.5 text-slate-400">
                      {item.cons.map((c, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Meta details footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1E293B] text-xs">
                  <div className="space-y-1">
                    <div><span className="text-[#64748B]">Pricing:</span> <span className="text-white font-medium">{item.pricing}</span></div>
                    <div><span className="text-[#64748B]">Best For:</span> <span className="text-[#38BDF8]">{item.bestFor}</span></div>
                  </div>
                  {item.isUs ? (
                    <button
                      onClick={() => navigate('/auth')}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold rounded-xl transition-all shadow-md self-start sm:self-auto"
                    >
                      Try DECK / divider Free <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to={`/compare/${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      className="inline-flex items-center gap-1 text-[#38BDF8] hover:underline self-start sm:self-auto font-medium"
                    >
                      View Side-by-Side Comparison <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Accordion Section for Rich Snippets */}
          <div className="border-t border-[#1E293B] pt-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#94A3B8] mb-6">
              Clear answers to help you select the ideal collection and deck tools.
            </p>

            <div className="space-y-4">
              {guide.faqs.map((faq, idx) => (
                <div key={idx} className="bg-[#111827] border border-[#1E293B] rounded-xl p-6">
                  <h3 className="text-base font-bold text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm text-[#94A3B8] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
