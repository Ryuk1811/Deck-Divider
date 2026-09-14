import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  Flame, 
  RefreshCw,
  Lock,
  Search,
  ExternalLink
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { DisplayCurrency } from '../../types';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';

interface ChangelogPageViewProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateAbout?: () => void;
  displayCurrency?: DisplayCurrency;
}

interface ReleaseEntry {
  version: string;
  date: string;
  badge: string;
  badgeColor: string;
  title: string;
  summary: string;
  highlights: {
    category: string;
    items: string[];
  }[];
}

export const ChangelogPageView: React.FC<ChangelogPageViewProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateAbout,
  displayCurrency = 'USD',
}) => {
  const releases: ReleaseEntry[] = [
    {
      version: 'v2.5.0',
      date: 'September 2026',
      badge: 'Latest Release',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      title: '2026 Standard Rotation & High-Intent SEO Architecture',
      summary: 'Comprehensive platform update implementing the official 2026 Pokémon TCG Standard rotation rules, canonical /tools/ URL restructuring, and dedicated crawler-ready SSR documents.',
      highlights: [
        {
          category: 'Tournament Legality & Deck Studio',
          items: [
            'Enforced 2026 Standard rotation: Regulation Marks H, I, and J are legal; Regulation Mark G has rotated to Expanded format.',
            'ACE SPEC single-card deck limit and Radiant Pokémon restrictions strictly validated with instant visual alerts.',
            'Updated PTCGL (Pokémon TCG Live) export parser to ensure 100% compatibility with the latest client version.',
            'Direct legality status badges on all card detail views with rotation countdown indicators.'
          ]
        },
        {
          category: 'Routing & SEO Infrastructure',
          items: [
            'Unified tools routing under canonical /tools/psa-grade-calculator and /tools/deck-legality-checker paths.',
            'Eliminated 301 redirect loops for crawlers and edge bots, achieving instant HTTP 200 responses.',
            'Deployed high-intent semantic HTML server-side rendering (SSR) documents for search indexing.',
            'Integrated structured FAQPage and WebApplication schema markup on all tool endpoints.'
          ]
        }
      ]
    },
    {
      version: 'v2.4.0',
      date: 'August 2026',
      badge: 'Security & Cloud',
      badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      title: 'Zero-Knowledge AES-GCM Encryption & Conflict-Free Cloud Sync',
      summary: 'Pro users now benefit from end-to-end encrypted cloud vault synchronization with zero-knowledge architecture, ensuring card collections and tournament decks remain private.',
      highlights: [
        {
          category: 'Data Privacy & Vault Protection',
          items: [
            'Added client-side AES-GCM 256-bit encryption for all cloud portfolio snapshots.',
            'Implemented automated SHA-256 integrity verification across local IndexedDB and cloud storage.',
            'One-click encrypted backup exports and instant cross-device snapshot restore.',
            'Zero data siphoning guarantee: unencrypted card counts and financial balances never touch external servers.'
          ]
        }
      ]
    },
    {
      version: 'v2.3.0',
      date: 'June 2026',
      badge: 'Grading & Analytics',
      badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      title: 'PSA, BGS & CGC Subgrade Tracking with Live Multi-Currency Engine',
      summary: 'Introduced comprehensive slab certification logging with individual subgrades, historical grade multipliers, and real-time currency conversion across 15+ global currencies.',
      highlights: [
        {
          category: 'Slab Registry & Expected Value (EV)',
          items: [
            'Beckett BGS quad-subgrade tracking: Centering, Corners, Edges, and Surface breakdown.',
            'Grading Expected Value (EV) calculator modeling break-even submission costs against PSA 10/9 market premiums.',
            'Live currency exchange engine supporting USD, EUR, GBP, JPY, CAD, and AUD with automated rate refreshes.'
          ]
        }
      ]
    },
    {
      version: 'v2.2.0',
      date: 'April 2026',
      badge: 'Master Sets',
      badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      title: 'Scarlet & Violet Master Set Trackers & 1-Click PTCGL Export',
      summary: 'Deep binder tracking for modern collector chases including Master Ball Holos, Special Illustration Rares, and competitive tournament decklists.',
      highlights: [
        {
          category: 'Collection Management',
          items: [
            'Visual binder checklists supporting Regular, Reverse Holo, Pokeball Holo, Masterball Holo, and Secret Illustration Rares.',
            'Instant 1-click export to Pokémon TCG Live clipboard format.',
            'Automatic set completion percentage analytics with remaining cost estimation.'
          ]
        }
      ]
    },
    {
      version: 'v2.1.0',
      date: 'February 2026',
      badge: 'Core Engine',
      badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
      title: 'Sub-15ms Orama Vector Search & Offline Catalog Architecture',
      summary: 'Overhauled the local search index with an embedded in-memory database, delivering instant search across 15,000+ cards even without an active internet connection.',
      highlights: [
        {
          category: 'Performance & Offline Mode',
          items: [
            'In-memory inverted index yielding sub-15ms query times across card names, abilities, and attacks.',
            'Offline-first IndexedDB persistence: manage your binder and build decks anywhere.',
            'Automated background catalog updates with differential delta patching.'
          ]
        }
      ]
    }
  ];

  const changelogSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Platform Changelog & Release Notes | DECK / divider',
    description: 'Chronological release log of DECK / divider updates: Pokémon TCG 2026 format rotation, PSA grading calculations, AES-256 cloud vault encryption, and performance improvements.',
    url: 'https://deckdivider.app/changelog',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://deckdivider.app/'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Changelog',
          item: 'https://deckdivider.app/changelog'
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white">
      <PageHead
        title="Platform Changelog & Release Notes | DECK / divider"
        description="Official release history of DECK / divider: 2026 Pokémon Standard rotation updates, PSA grading ROI calculators, AES-GCM vault security, and deck studio improvements."
        canonicalPath="/changelog"
        schema={changelogSchema}
      />

      <LandingNav
        onOpenAuth={onOpenAuth}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <GeoBreadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Changelog', path: '/changelog' }
          ]}
        />

        {/* Hero Section */}
        <div className="mt-8 mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            Continuous Development
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Platform Changelog &amp; Release Notes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Stay updated with every enhancement, tournament legality adjustment, slab valuation tool, and security upgrade released on DECK / divider.
          </p>
        </div>

        {/* Quick Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">2026 Standard</div>
            <div className="text-xs text-slate-500 leading-normal">
              Regulation Marks H, I, J active; Mark G officially rotated out.
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">AES-256 Vault</div>
            <div className="text-xs text-slate-500 leading-normal">
              Zero-knowledge client-side encrypted cloud backup and sync.
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Calculator className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">PSA / BGS EV</div>
            <div className="text-xs text-slate-500 leading-normal">
              Expected value grading profitability and break-even calculators.
            </div>
          </div>
        </div>

        {/* Release Timeline */}
        <div className="relative border-l-2 border-slate-200 pl-6 sm:pl-8 ml-3 sm:ml-4 space-y-12 mb-16">
          {releases.map((release, idx) => (
            <motion.article 
              key={release.version}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative"
            >
              {/* Timeline Marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-4 border-slate-50 bg-rose-600 shadow-xs" />

              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                      {release.version}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${release.badgeColor}`}>
                      {release.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{release.date}</span>
                  </div>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                  {release.title}
                </h2>

                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  {release.summary}
                </p>

                <div className="space-y-6 pt-4 border-t border-slate-100">
                  {release.highlights.map((highlight, hIdx) => (
                    <div key={hIdx}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        {highlight.category}
                      </h3>
                      <ul className="space-y-2.5">
                        {highlight.items.map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2.5 text-sm text-slate-700 leading-normal">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Direct Action Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Ready to test the latest features?</h3>
            <p className="text-sm text-slate-300 max-w-lg">
              Experience the 2026 deck legality validator, model PSA grading break-even values, or start tracking your collection with offline privacy.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              Get Started Free
            </button>
            <a
              href="/tools"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors border border-white/10"
            >
              Explore Tools
            </a>
          </div>
        </div>
      </main>

      <LandingFooter
        onOpenAuth={onOpenAuth}
        displayCurrency={displayCurrency}
      />
    </div>
  );
};
