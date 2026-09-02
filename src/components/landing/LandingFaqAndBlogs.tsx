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
    question: 'Where do the card market prices come from?',
    answer: 'Verified TCGplayer market prices and recent completed eBay sales. Automatic updates for collection and deck values.',
    highlight: 'Real-time conversions for USD, EUR, GBP, JPY, CAD, and AUD.',
  },
  {
    id: 'faq-2',
    category: 'General',
    question: 'Can I track graded slabs (PSA, BGS, CGC, ACE) and sealed boxes?',
    answer: 'Yes. Log certificate numbers, subgrades (Centering, Surface, Corners, Edges), and grading companies. Track sealed booster boxes, bundles, and Elite Trainer Boxes with purchase basis.',
    highlight: 'Track raw Near Mint binder cards and graded slab values side by side.',
  },
  {
    id: 'faq-3',
    category: 'Decks & Tournaments',
    question: 'Can I export deck lists directly into Pokémon TCG Live (PTCGL)?',
    answer: 'Yes. Deck lists export directly for 1-click PTCGL import. Built-in verification for standard format legality and regulation marks.',
    highlight: 'Compatible with PTCGL, LimitlessTCG, and official Play! Pokémon events.',
  },
  {
    id: 'faq-4',
    category: 'Pricing & Data',
    question: 'How do master set checklists handle reverse holos and secret rares?',
    answer: 'Separate independent checkboxes for regular cards, reverse holos, Masterball holos, and Secret Illustration Rares (SIRs).',
    highlight: 'Filter missing cards by lowest market price to finish binders efficiently.',
  },
  {
    id: 'faq-5',
    category: 'Security & Cloud',
    question: 'How is my collection data saved and kept private?',
    answer: 'Data is synced to your private account. Collections are completely private and never sold to third parties.',
    highlight: 'Export your complete card list and purchase logs to JSON anytime.',
  },
  {
    id: 'faq-6',
    category: 'Security & Cloud',
    question: 'Can I use DECK / divider on my phone at card shows and trade nights?',
    answer: 'Yes. Fully responsive on mobile phones and tablets. Check want lists, verify deck counts, and look up market prices on the go.',
  },
];

const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    category: 'Market Trends',
    title: 'Modern Special Illustration Rares (SIRs) vs. Vintage Singles',
    excerpt:
      'Why modern chase cards like Moonbreon, Gengar VMAX Alt Art, and 151 Charizard ex have high collector demand alongside classic WOTC prints.',
    content: [
      'In recent years, collector demand has expanded from classic vintage sets to modern Special Illustration Rares (SIRs) and Alternate Art cards.',
      'Unlike older sets where standard holos were the top pulls, modern sets feature full-art textured cards with detailed artwork by renowned illustrators.',
      'When building a modern collection, checking population reports and raw Near Mint condition before buying helps you get the best value for your binder.',
    ],
    readTime: '4 min read',
    date: 'August 2026',
    author: 'DECK / divider Team',
    tags: ['Alt Arts', 'SIRs', '151', 'Evolving Skies'],
    featuredCard: 'Charizard ex (#199)',
  },
  {
    id: 'blog-2',
    category: 'Deck Meta',
    title: 'Building Consistent 60-Card Standard Decks for League Nights',
    excerpt:
      'Balancing search items, supporter draw engines, and energy counts for standard format tournaments.',
    content: [
      'A consistent Pokémon deck needs reliable search items like Nest Ball, Ultra Ball, and Buddy-Buddy Poffin to find basic Pokémon on turn one.',
      'Our built-in deck checker tests your list against standard rotation blocks and confirms card count splits before you bring your deck box to a local event.',
      'Check your energy counts and average prize-card trade before trading for the singles needed to finish your deck.',
    ],
    readTime: '5 min read',
    date: 'August 2026',
    author: 'Tournament Players Group',
    tags: ['Standard Format', '60 Cards', 'PTCGL'],
    featuredCard: 'Charizard ex (#054)',
  },
  {
    id: 'blog-3',
    category: 'Grading & Slabs',
    title: 'Raw vs. Graded: Deciding When to Submit Cards to PSA or BGS',
    excerpt:
      'Evaluating centering, corner whiting, and print lines on raw cards before paying grading fees.',
    content: [
      'Before submitting raw pulls to grading companies, carefully inspect centering (aiming for 60/40 or better on the front) and check edges under good lighting.',
      'You can log subgrades and cert numbers directly in your collection tab to keep your slab boxes organized.',
      'Tracking both your purchase cost and grading submission fees gives you a clear picture of your total investment in every slab.',
    ],
    readTime: '5 min read',
    date: 'July 2026',
    author: 'Slab Collector Desk',
    tags: ['PSA 10', 'BGS', 'Grading Tips', 'Raw Cards'],
    featuredCard: 'Pikachu (#085)',
  },
  {
    id: 'blog-4',
    category: 'Security',
    title: 'Keeping Your High-Value Pokémon Card Collection Secure & Backed Up',
    excerpt:
      'Best practices for organizing binder insurance logs, purchase receipts, and digital backups.',
    content: [
      'Keeping accurate records of cert numbers, purchase dates, and condition photos is essential for protecting your collection.',
      'DECK / divider lets you back up your entire binder structure and export CSV spreadsheets anytime for your personal records.',
      'Your collection data stays private to your account, giving you a clean digital inventory of every card you own.',
    ],
    readTime: '3 min read',
    date: 'July 2026',
    author: 'Collector Security',
    tags: ['Backups', 'CSV Export', 'Inventory'],
  },
];

export const LandingFaqAndBlogs: React.FC = () => {
  // FAQ State
  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  // Blog State
  const [blogCategory, setBlogCategory] = useState<string>('All');
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

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
    <section id="faq-and-insights" className="py-6 sm:py-8 md:py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* 2-Column Side-by-Side Scrolling Containers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          
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
                    <p className="text-[11px] text-[#64748B]">
                      Quick answers to common questions
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
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {faqCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFaqCategory(cat)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                        faqCategory === cat
                          ? 'bg-[#DC143C] text-white font-bold'
                          : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable FAQ List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-[#F1F5F9]">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;
                  return (
                    <div key={faq.id} className="pt-3 first:pt-0">
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full flex items-center justify-between text-left gap-4 py-2 hover:text-[#DC143C] transition-colors cursor-pointer group"
                      >
                        <span className="font-heading font-bold text-sm text-[#0F172A] group-hover:text-[#DC143C] transition-colors leading-snug">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#94A3B8] group-hover:text-[#DC143C] shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#DC143C]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="mt-2 text-xs text-[#475569] leading-relaxed space-y-2.5 pb-2 pl-1 border-l-2 border-[#DC143C]/40">
                          <p>{faq.answer}</p>
                          {faq.highlight && (
                            <div className="p-2 bg-[#FFF0F3] rounded border border-[#DC143C]/15 text-[#DC143C] text-[11px] font-medium flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{faq.highlight}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-[#94A3B8]">
                  <HelpCircle className="w-8 h-8 mb-2 opacity-40" />
                  <p className="text-xs font-mono">No matching FAQ entries found.</p>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT BOX: COLLECTOR INSIGHTS & ARTICLES (Internal Scroll) */}
          {/* ========================================================================= */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col h-[580px] overflow-hidden">
            {/* Box Header */}
            <div className="p-5 border-b border-[#E2E8F0] bg-white sticky top-0 z-10 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] border border-blue-200 flex items-center justify-center text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[#0F172A]">
                      Collector Notes & Guides
                    </h3>
                    <p className="text-[11px] text-[#64748B]">
                      Market notes and deck building guides
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  {filteredBlogs.length} articles
                </span>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {blogCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBlogCategory(cat)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-colors cursor-pointer ${
                      blogCategory === cat
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-[#F8FAFC] text-[#64748B] hover:bg-[#F1F5F9] border border-[#E2E8F0]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Blog List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {filteredBlogs.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedBlog(post)}
                  className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-400 hover:bg-blue-50/20 transition-all cursor-pointer group space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E2E8F0] text-[10px] font-mono font-bold text-[#475569]">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-[#94A3B8] font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-heading font-bold text-sm text-[#0F172A] group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h4>

                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]/60">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.tags.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] font-mono text-[#64748B]">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Read article <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Blog Full Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#E2E8F0] flex items-start justify-between gap-4 bg-white sticky top-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-bold border border-blue-200">
                    {selectedBlog.category}
                  </span>
                  <span className="text-xs text-[#64748B] font-mono">
                    {selectedBlog.date} • {selectedBlog.readTime}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A] leading-tight">
                  {selectedBlog.title}
                </h3>
                <p className="text-xs text-[#64748B] font-mono">
                  By {selectedBlog.author}
                </p>
              </div>
              <button
                onClick={() => setSelectedBlog(null)}
                className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 text-sm text-[#334155] leading-relaxed">
              {selectedBlog.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}

              {/* Tags */}
              <div className="pt-4 border-t border-[#F1F5F9] flex items-center gap-2 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-[#94A3B8]" />
                {selectedBlog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-mono text-[#64748B]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
