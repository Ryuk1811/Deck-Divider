import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  ChevronDown,
  Search,
  ArrowRight,
  TrendingUp,
  Shield,
  Layers,
  Sparkles,
  Calendar,
  Clock,
  ExternalLink,
  X,
  Tag,
  CheckCircle2,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'General' | 'Pricing & Data' | 'Security & Cloud' | 'Decks & Tournaments';
  question: string;
  answer: string;
  highlight?: string;
}

interface BlogPost {
  id: string;
  category: 'Market Trends' | 'Deck Meta' | 'Grading & Slabs' | 'Security';
  title: string;
  excerpt: string;
  content: string[];
  readTime: string;
  date: string;
  author: string;
  tags: string[];
  featuredCard?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Pricing & Data',
    question: 'How accurate is the TCGplayer and Cardmarket pricing data?',
    answer:
      'We aggregate verified market pricing from official TCGplayer market data feeds, Cardmarket 7-day rolling averages, and completed sales indexes. Card valuations, holo variants, and graded slab multipliers update dynamically with automatic 5-minute client caching.',
    highlight: 'Real-time multi-currency conversions for USD, EUR, GBP, JPY, CAD, and AUD.',
  },
  {
    id: 'faq-2',
    category: 'Security & Cloud',
    question: 'How does client-side encryption and zero-knowledge cloud sync work?',
    answer:
      'Your card records, purchase costs, and custom binders are stored in your browser’s encrypted IndexedDB. When cloud backup is enabled, the data is compressed into a single compact binary payload before reaching Firestore, ensuring lightning-fast synchronization.',
    highlight: 'Your exact card collection holdings and purchase costs remain completely private to you.',
  },
  {
    id: 'faq-3',
    category: 'General',
    question: 'What are the differences between Starter, Collector, and Syndicate tiers?',
    answer:
      'Starter gives full access to search, standard portfolio tracking, and up to 3 custom decks/binders with 250 cards. Collector raises limits to 25 decks and 2,500 cards with CSV/PDF exports. Syndicate unlocks limitless decks, advanced grading sub-grade telemetry, and priority market indexing.',
    highlight: 'Upgrade or downgrade anytime without losing your saved cards or binder structures.',
  },
  {
    id: 'faq-4',
    category: 'Decks & Tournaments',
    question: 'Can I export official decklists for Pokémon Play! Regional championships?',
    answer:
      'Yes. The Deck Builder automatically validates standard 60-card legalities (including Rule of 4 copies, Basic Pokémon presence, and energy curves) and exports clean Play! Pokémon tournament text format, ready for immediate submission.',
    highlight: 'Includes one-click clipboard copying for LimitlessTCG and Pokémon TCG Live imports.',
  },
  {
    id: 'faq-5',
    category: 'Pricing & Data',
    question: 'Can I track graded slabs (PSA, BGS, CGC, ARS) and sealed booster boxes?',
    answer:
      'Yes. The portfolio features a dedicated Sealed Vault for booster boxes, booster bundles, and Elite Trainer Boxes with historical ROI tracking, as well as graded slab tracking with PSA/BGS 10 multipliers and cert verification logs.',
    highlight: 'Tracks both raw Near Mint values and custom graded slab premiums side by side.',
  },
  {
    id: 'faq-6',
    category: 'Security & Cloud',
    question: 'Can I use Deck Divider offline or on mobile devices?',
    answer:
      'Deck Divider is engineered as a responsive Progressive Web App with offline-first caching. You can audit your binders, view deck compositions, and check card stats on convention floors even when mobile cellular connectivity is limited.',
  },
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    category: 'Market Trends',
    title: 'The 2026 Modern Alt-Art & Special Illustration Rare Supercycle',
    excerpt:
      'Why Moonbreon, Gengar VMAX, and Scarlet & Violet 151 SIRs continue to outperform traditional vintage singles in secondary market liquidity.',
    content: [
      'The modern Pokémon TCG investment paradigm has shifted decisively from vintage Base Set nostalgia to the iconic Special Illustration Rares (SIR) and Alternate Art VMAX era.',
      'Unlike the 2020 speculative boom, modern liquidity is driven by player-collector crossover demand: cards like Charizard ex (151 SIR) and Umbreon VMAX (Evolving Skies) boast genuine cross-demographic prestige and high submission demand at PSA and CGC.',
      'When managing high-value modern singles, tracking pop reports alongside Near Mint raw price movement is critical to timing purchases before print runs dry up completely.',
    ],
    readTime: '4 min read',
    date: 'August 2026',
    author: 'Deck Divider Analytics Desk',
    tags: ['Alt Arts', 'Market Index', '151 & Evolving Skies'],
    featuredCard: 'Umbreon VMAX (Alt Art)',
  },
  {
    id: 'blog-2',
    category: 'Deck Meta',
    title: 'Constructing Tournament-Legal 60-Card Decks in Current Standard',
    excerpt:
      'Mastering search sequencing, supporter ratios, and prize-card math for competitive tournament players.',
    content: [
      'Top-tier competitive Pokémon TCG play demands ruthless consistency. A tournament-winning 60-card list isn’t just about heavy hitters—it relies on item search engines (Nest Ball, Ultra Ball, Buddy-Buddy Poffin) and draw support engines.',
      'Our built-in Deck Validator continuously tracks card legalities, warning you immediately if you exceed 4 copies of a unique card name (excluding Basic Energy) or fail standard 60-card deck minimums.',
      'Use the Deck Analytics tab to review your Energy curve, type coverage, and estimated total deck construction cost before ordering singles.',
    ],
    readTime: '6 min read',
    date: 'August 2026',
    author: 'Competitive Play Council',
    tags: ['Standard Meta', 'Deck Validation', 'Tournaments'],
    featuredCard: 'Charizard ex (#054)',
  },
  {
    id: 'blog-3',
    category: 'Grading & Slabs',
    title: 'Slab Valuation 101: Understanding PSA 10 vs. BGS 9.5 vs. Raw NM',
    excerpt:
      'How to calculate realistic grading ROI, factoring in centering standards, grading fees, and turnaround timelines.',
    content: [
      'A common pitfall in card collecting is assuming every raw pack-fresh card will grade a Gem Mint 10. Modern print defects—such as print lines, corner whiting, and 60/40 centering shifts—mean average gem rates often hover below 45% on demanding sets.',
      'Deck Divider allows you to record exact sub-conditions, grading company cert numbers, and custom grade multipliers to reflect realistic realized market values.',
      'Reviewing past sales on Cardmarket and TCGplayer reveals that while PSA 10 commands strong premiums, pristine raw Near Mint cards often provide superior liquidity during market volatility.',
    ],
    readTime: '5 min read',
    date: 'July 2026',
    author: 'Archival & Grading Group',
    tags: ['PSA 10', 'BGS', 'Slab ROI', 'Condition Guide'],
    featuredCard: 'Pikachu (Grey Felt Hat #085)',
  },
  {
    id: 'blog-4',
    category: 'Security',
    title: 'Zero-Knowledge Portfolio Management: Keeping Your Vault Private',
    excerpt:
      'Why client-side AES cryptography and single-document Firestore sync are essential for high-net-worth collectors.',
    content: [
      'Public card inventory sites often leak sensitive location and financial telemetry to third-party ad networks and open databases. High-value collectors need institutional privacy.',
      'Deck Divider implements a client-first security model: your cards and purchase cost data are stored in local IndexedDB. Cloud synchronization compresses your entire vault into an opaque document.',
      'Enjoy seamless cross-device synchronization without ever exposing your physical card storage locations or exact portfolio holdings to third parties.',
    ],
    readTime: '3 min read',
    date: 'July 2026',
    author: 'Engineering & Cryptography',
    tags: ['Security', 'Zero Knowledge', 'Encrypted Vault'],
  },
];

export const LandingFaqAndBlogs: React.FC = () => {
  // FAQ State
  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Blog State
  const [blogCategory, setBlogCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Filtered FAQs
  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = faqCategory === 'All' || item.category === faqCategory;
    const matchesSearch =
      faqSearch.trim() === '' ||
      item.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      item.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      (item.highlight && item.highlight.toLowerCase().includes(faqSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered Blogs
  const filteredBlogs = BLOG_POSTS.filter((post) => {
    return blogCategory === 'All' || post.category === blogCategory;
  });

  const faqCategories = ['All', 'Pricing & Data', 'Security & Cloud', 'Decks & Tournaments', 'General'];
  const blogCategories = ['All', 'Market Trends', 'Deck Meta', 'Grading & Slabs', 'Security'];

  return (
    <section id="faq-and-insights" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#DC143C]" />
            <span className="font-mono text-[11px] uppercase tracking-wider font-bold text-[#0F172A]">
              Knowledge Base & Market Intel
            </span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0F172A] tracking-tight">
            Frequently Asked Questions & Collector Insights
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#64748B] max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about pricing accuracy, encrypted backups, tournament deck validation, and modern market trends.
          </p>
        </div>

        {/* 2-Column Side-by-Side Scrolling Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT BOX: FAQ (Internal Scroll) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-[580px] overflow-hidden">
            {/* Box Header */}
            <div className="p-5 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center text-[#DC143C]">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F172A]">
                      Frequently Asked Questions
                    </h3>
                    <p className="font-mono text-[11px] text-[#64748B]">
                      Instant answers to common platform questions
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  {filteredFaqs.length} items
                </span>
              </div>

              {/* Search Bar & Category Filters */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={faqSearch}
                    onChange={(e) => setFaqSearch(e.target.value)}
                    placeholder="Search FAQ keywords..."
                    className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-xs font-mono text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                  />
                  {faqSearch && (
                    <button
                      onClick={() => setFaqSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFaqCategory(cat)}
                      className={`whitespace-nowrap px-2.5 py-1 rounded-md font-mono text-[10px] font-bold transition-colors cursor-pointer ${
                        faqCategory === cat
                          ? 'bg-[#0F172A] text-white'
                          : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable FAQ List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 divide-y-0 custom-scrollbar">
              {filteredFaqs.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="font-mono text-xs text-[#64748B]">No matching questions found.</p>
                  <button
                    onClick={() => {
                      setFaqSearch('');
                      setFaqCategory('All');
                    }}
                    className="font-mono text-[11px] font-bold text-[#DC143C] hover:underline"
                  >
                    Reset Search & Filters
                  </button>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? 'border-[#DC143C]/30 bg-[#FFFDFD] shadow-2xs ring-1 ring-[#DC143C]/10'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                        className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:bg-[#FFF0F3]/30"
                      >
                        <div className="space-y-0.5 flex-1 pr-2">
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-[#DC143C]">
                            {faq.category}
                          </span>
                          <h4 className="font-heading font-bold text-xs sm:text-sm text-[#0F172A] leading-snug">
                            {faq.question}
                          </h4>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                            isOpen ? 'bg-[#DC143C] text-white rotate-180' : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-3.5 sm:px-4 pb-4 pt-1 space-y-2 border-t border-[#F1F5F9]">
                          <p className="font-mono text-xs text-[#475569] leading-relaxed">
                            {faq.answer}
                          </p>
                          {faq.highlight && (
                            <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                              <span className="font-mono text-[11px] font-medium text-[#0F172A]">
                                {faq.highlight}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT BOX: BLOGS & COLLECTOR INTEL (Internal Scroll) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-[580px] overflow-hidden">
            {/* Box Header */}
            <div className="p-5 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F172A]">
                      Collector & Market Insights
                    </h3>
                    <p className="font-mono text-[11px] text-[#64748B]">
                      Deep dives on grading, deck meta, and asset valuation
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  {filteredBlogs.length} articles
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBlogCategory(cat)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-md font-mono text-[10px] font-bold transition-colors cursor-pointer ${
                      blogCategory === cat
                        ? 'bg-[#DC143C] text-white'
                        : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Blog Feed */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
              {filteredBlogs.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedArticle(post)}
                  className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#F8FAFC] hover:border-[#DC143C]/40 transition-all cursor-pointer shadow-2xs group flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-[#94A3B8]">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-[#0F172A] group-hover:text-[#DC143C] transition-colors leading-snug">
                      {post.title}
                    </h4>

                    <p className="font-mono text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {post.tags.slice(0, 2).map((t) => (
                        <span
                          key={t}
                          className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569]"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#DC143C] group-hover:translate-x-0.5 transition-transform shrink-0">
                      <span>Read article</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* ARTICLE READER MODAL */}
      {/* ========================================================================= */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-4 shrink-0">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20">
                  {selectedArticle.category}
                </span>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#64748B] pt-1">
                  <span>{selectedArticle.author}</span>
                  <span>•</span>
                  <span>{selectedArticle.date}</span>
                  <span>•</span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A] leading-snug">
                {selectedArticle.title}
              </h3>

              <div className="p-3.5 rounded-xl bg-[#FFF0F3]/50 border border-[#DC143C]/20 font-mono text-xs text-[#0F172A] font-semibold">
                "{selectedArticle.excerpt}"
              </div>

              <div className="space-y-4 font-mono text-xs sm:text-sm text-[#334155] leading-relaxed">
                {selectedArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {selectedArticle.featuredCard && (
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
                      Featured Subject Reference
                    </span>
                    <p className="font-heading font-bold text-sm text-[#0F172A]">
                      {selectedArticle.featuredCard}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs font-bold text-[#DC143C] shadow-2xs">
                    Market Tracked
                  </span>
                </div>
              )}

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#94A3B8]" />
                {selectedArticle.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[11px] px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#475569] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-white rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
