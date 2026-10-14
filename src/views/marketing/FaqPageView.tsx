import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  Layers,
  Database,
  Shield,
  Trophy,
  ArrowRight,
  Mail,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../../components/landing/LandingMotionDirectorate';
import { DisplayCurrency } from '../../types';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getFaqPageSchema } from '../../components/seo/schemaData';

interface FaqPageViewProps {
  onOpenAuth: () => void;
  onEnterApp?: () => void;
  displayCurrency: DisplayCurrency;
  user?: any;
}

interface FaqData {
  id: string;
  category: 'General' | 'Pricing & Data' | 'Decks & Formats' | 'Slabs & Grading' | 'Security & Sync';
  question: string;
  answer: string;
  highlights?: string[];
}

const FAQ_COLLECTION: FaqData[] = [
  {
    id: 'faq-1',
    category: 'Pricing & Data',
    question: 'Where do the card market prices come from?',
    answer:
      'Card values update from verified TCGplayer market prices and recent completed eBay sales. Prices update automatically so your collection total and deck costs reflect current market values.',
    highlights: [
      'Multi-currency conversions across 15+ fiat currencies (USD, EUR, GBP, JPY, CAD, AUD).',
      'Weighted averages for raw conditions (NM, LP, MP, HP, DMG) and graded slabs (PSA 10, PSA 9, BGS, CGC).',
      'Historical price delta trends over 7-day, 30-day, and all-time windows.',
    ],
  },
  {
    id: 'faq-2',
    category: 'Slabs & Grading',
    question: 'Can I track graded slabs (PSA, BGS, CGC, ACE) and sealed boxes?',
    answer:
      'Yes. You can log certificate numbers, grading company names, and full subgrades (Centering, Surface, Corners, Edges) for your slabs. You can also track sealed booster boxes, booster bundles, and Elite Trainer Boxes with original purchase costs.',
    highlights: [
      'Direct cert verification lookup links to grading company databases.',
      '4-point subgrade breakdown for authentic registry tracking.',
      'Dedicated Sealed Vault ledger for case, box, and tin investments.',
    ],
  },
  {
    id: 'faq-3',
    category: 'Decks & Formats',
    question: 'Can I export deck lists directly into Pokémon TCG Live (PTCGL)?',
    answer:
      'Yes. The deck builder checks 2026 Standard 60-card format legality based on published Play! Pokémon rules (including regulation marks H, I, J; G rotated out) and the 4-card copy rule, letting you copy standard text formatted for 1-click import into PTCGL or tournament deck sheets.',
    highlights: [
      'Format compliance audits for Standard (regulation marks H, I, J; G rotated) and Expanded formats.',
      'ACE SPEC single-card limit enforcement (and Expanded format Radiant Pokémon limits).',
      'One-click export string compatible with PTCGL, Limitless TCG, and tournament sheets.',
    ],
  },
  {
    id: 'faq-4',
    category: 'General',
    question: 'How do master set checklists handle reverse holos and secret rares?',
    answer:
      'Every set checklist includes separate checkboxes for standard regular cards, reverse holos, Pokéball/Masterball holos, and Secret Illustration Rares (SIRs), giving you an accurate count of what you need to complete a binder.',
    highlights: [
      'Coverage across all 218 catalogued sets & series (148+ master expansions) from Base Set through modern Scarlet & Violet.',
      'Missing cards list sorted by card number or lowest market price for efficient binder completion.',
      'Visual progress rings showing binder completion percentage by expansion.',
    ],
  },
  {
    id: 'faq-5',
    category: 'Security & Sync',
    question: 'How is my collection data saved and kept private?',
    answer:
      'Your card inventory and purchase prices are stored securely in your browser using offline-first IndexedDB caches and encrypted cloud synchronization to your private account. Your collection data is completely private and is never sold to third-party ad networks.',
    highlights: [
      'AES-256 cloud encryption with local client-side IndexedDB speed.',
      'Automated snapshot backups with point-in-time state recovery.',
      'Full CSV export capability to download your complete portfolio anytime.',
    ],
  },
  {
    id: 'faq-6',
    category: 'General',
    question: 'Can I use DECK / divider on my phone at card shows and trade nights?',
    answer:
      'Yes. The app is fully responsive on mobile phones and tablets. You can check your want lists, verify deck counts, and lookup card market prices while walking convention floors with zero lag.',
    highlights: [
      'Offline-capable cached card search for convention halls with spotty cell reception.',
      'Quick-lookup camera barcode & cert entry for rapid card evaluations.',
      'Instant trade value calculations comparing card-for-card market fair trade values.',
    ],
  },
  {
    id: 'faq-7',
    category: 'Pricing & Data',
    question: 'What are the limits of the free Starter tier?',
    answer:
      'The free Starter plan includes up to 6 custom decks (laddered 6-card mini, 30-card half, and 60-card standard decks), 5 wishlists (up to 100 items per list), 25 graded slabs, 15 sealed items, instant card search across all 218 catalogued sets & series, and daily USD market valuations. You can upgrade anytime to expand deck capacity (up to 75 on Bunch, 100 on Stack, 150 on Deck, and unlimited on Collection), unlock multi-currency conversion, and access advanced portfolio analytics.',
  },
  {
    id: 'faq-7b',
    category: 'Pricing & Data',
    question: 'How does the $250 Founder Lifetime Pass work?',
    answer:
      'The Founder Lifetime Pass is a single, one-time payment of $250 USD that grants permanent, non-expiring access to the top-tier Collection specifications (unlimited decks, unlimited cards per deck across all ladder sizes, unlimited lists, unlimited slabs, sealed vault, multi-currency live FX, and full CSV exports) with zero recurring subscription charges. It is strictly limited to the first 100 paying customers and includes live slot tracking.',
    highlights: [
      'Single $250 payment with zero recurring charges or subscription renewals forever.',
      'Permanent Collection tier with unlimited capacity across all features.',
      'Strictly capped at the first 100 customers with real-time registry slot accounting.',
    ],
  },
  {
    id: 'faq-8',
    category: 'Decks & Formats',
    question: 'Does DECK / divider calculate deck costs and energy ratios?',
    answer:
      'Yes. When constructing a deck, DECK / divider displays the total market cost to acquire all 60 cards, splits by Pokémon / Trainer / Energy percentages, and provides draw probability distributions for opening turn hands.',
  },
  {
    id: 'faq-9',
    category: 'Security & Sync',
    question: 'Can I share my decks with friends or social media?',
    answer:
      'Yes! Every deck in DECK / divider generates an encoded, shareable public link. Friends can view the card list, full card art, market price breakdown, and PTCGL import string without needing to log in.',
  },
];

export const FaqPageView: React.FC<FaqPageViewProps> = ({
  onOpenAuth,
  onEnterApp,
  displayCurrency,
  user,
}) => {
  const easeCurve = [0.16, 1, 0.3, 1] as const;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const categories = ['All', 'General', 'Pricing & Data', 'Decks & Formats', 'Slabs & Grading', 'Security & Sync'];

  const filteredFaqs = FAQ_COLLECTION.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
      <PageHead
        title="Frequently Asked Questions (FAQ) | DECK / divider"
        description="Got questions about DECK / divider? Discover answers regarding real-time TCGplayer market prices, PSA/BGS slab tracking, 60-card tournament deck rules, and data privacy."
        canonicalPath="/faq"
        keywords={[
          'pokemon card tracker faq',
          'deck divider questions',
          'tcgplayer price sync pokemon',
          'psa slab registry online',
          'pokemon card collection backup'
        ]}
        schema={getFaqPageSchema()}
      />
      {/* Navigation */}
      <LandingNav
        onOpenAuth={onOpenAuth}
        onEnterApp={onEnterApp}
        user={user}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-8 sm:space-y-12 relative z-10">
        <GeoBreadcrumbs items={[{ label: 'FAQ', path: '/faq' }]} />

        {/* Header Section */}
        <section className="text-center space-y-4 sm:space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-xs font-semibold shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="font-mono tracking-tight uppercase">HELP CENTER &amp; KNOWLEDGE BASE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] font-heading"
          >
            Frequently Asked Questions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
            className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto"
          >
            Everything you need to know about tracking your cards, evaluating PSA/BGS slabs, building tournament-ready decks, and securing your collection.
          </motion.p>
        </section>

        {/* PTC Collectibles Partner Offer */}
        <PtcPartnerBanner />

        <GeoExtractableBlock
          heading="Frequently Asked Questions: Key Facts & Platform Overview"
          summary="DECK / divider is an ad-free Pokémon TCG collection manager and tournament deck studio. It updates card valuations daily from verified TCGplayer market data and completed eBay sales across 15+ fiat currencies. Collections operate offline-first with AES-256 encrypted cloud backup, while the deck builder provides 1-click PTCGL export and published Play! Pokémon regulation mark legality verification."
          keyFacts={[
            { label: 'Market Comps', value: 'TCGplayer & eBay Daily Sync' },
            { label: 'Supported Grading', value: 'PSA, BGS, CGC, ACE, ARS' },
            { label: 'Deck Legality', value: 'Standard & Expanded (H, I, J)' },
            { label: 'Export Target', value: 'Pokémon TCG Live (PTCGL)' },
          ]}
        />

        {/* Search Bar */}
        <div className="max-w-xl mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions (e.g. market prices, PSA slabs, PTCGL export)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#DC143C] shadow-xs"
              />
            </div>
          </div>

        {/* Category Pills */}
        <section className="flex items-center justify-center gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#DC143C] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1]'
              }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* FAQ Accordion List */}
        <section className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-12 text-center space-y-3">
              <HelpCircle className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <h3 className="text-base font-bold text-[#0F172A]">No questions matched your search</h3>
              <p className="text-xs sm:text-sm text-[#64748B]">Try searching for different keywords or reset the category filter.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 bg-[#F1F5F9] text-[#0F172A] text-xs font-semibold rounded-lg hover:bg-[#E2E8F0] transition-colors"
              >
                Reset Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === faq.id;

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white border border-[#E2E8F0] rounded-2xl shadow-xs overflow-hidden transition-all hover:border-[#CBD5E1]"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DC143C] bg-[#FFF0F3] px-2 py-0.5 rounded-md inline-block">
                        {faq.category}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold text-[#0F172A] font-heading">
                        {faq.question}
                      </h2>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#64748B] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#DC143C]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: easeCurve }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-[#475569] space-y-4 border-t border-[#F8FAFC]">
                          <p className="leading-relaxed text-sm sm:text-base text-[#334155]">{faq.answer}</p>
                          {faq.highlights && faq.highlights.length > 0 && (
                            <div className="bg-[#F8FAFC] border border-[#E2E8F0]/80 rounded-xl p-4 space-y-2">
                              <span className="text-xs font-mono font-bold text-[#0F172A] uppercase tracking-wider block">
                                Key Highlights
                              </span>
                              <ul className="space-y-1.5">
                                {faq.highlights.map((h, hIdx) => (
                                  <li key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-[#475569]">
                                    <CheckCircle2 className="w-4 h-4 text-[#DC143C] shrink-0 mt-0.5" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </section>

        {/* Quick Help Channels */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-3 shadow-xs">
            <BookOpen className="w-5 h-5 text-[#DC143C]" />
            <h3 className="text-base font-bold text-[#0F172A]">Platform Architecture</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Read our engineering tenets and how we calculate anti-drift market valuations.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC143C] hover:underline"
            >
              <span>Explore Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-3 shadow-xs">
            <Layers className="w-5 h-5 text-[#DC143C]" />
            <h3 className="text-base font-bold text-[#0F172A]">How It Works</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Explore the 4-step workflow from raw card binder to master collection tracker.
            </p>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC143C] hover:underline"
            >
              <span>View Workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 space-y-3 shadow-xs">
            <Mail className="w-5 h-5 text-[#DC143C]" />
            <h3 className="text-base font-bold text-[#0F172A]">Direct Collector Support</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Have a question not answered here? Email our support desk directly anytime.
            </p>
            <a
              href="mailto:deckdivider@outlook.com"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC143C] hover:underline"
            >
              <span>deckdivider@outlook.com</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-white text-[#0F172A] border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
              Ready to organize your Pokémon TCG collection?
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm max-w-xl mx-auto">
              Launch the studio to start logging cards, building decks, and tracking daily updated market value with instant portfolio NAV recalculation.
            </p>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-6 py-3 rounded-xl bg-[#DC143C] text-white font-bold text-sm hover:bg-[#B01030] transition-colors cursor-pointer shadow-2xs"
          >
            Launch DECK / divider Free
          </button>
        </section>
      </main>

      <PublicInterlinkMesh currentPath="/faq" />

      <LandingFooter
        onEnterApp={onEnterApp || onOpenAuth}
        onOpenAuth={onOpenAuth}
        onNavigateSection={() => {}}
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
