import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  Search, 
  ShieldCheck, 
  Calculator, 
  BarChart3, 
  Trophy, 
  Compass, 
  BookOpen, 
  HelpCircle, 
  FileText, 
  ArrowUpRight,
  Zap,
  Tag
} from 'lucide-react';

interface PublicInterlinkMeshProps {
  currentPath?: string;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const PublicInterlinkMesh: React.FC<PublicInterlinkMeshProps> = ({
  currentPath = '',
  className = '',
  title = 'Explore the DECK / divider TCG Network',
  subtitle = 'Traverse complete card databases, official expansion checklists, competitive format legality, and professional grading calculators.',
}) => {
  const categories = [
    {
      title: 'Databases & Checklists',
      icon: Search,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/60 dark:text-indigo-400 dark:bg-indigo-950/40 dark:border-indigo-800/40',
      description: 'Public catalogue scans, master set lists, and expansion registries.',
      links: [
        { path: '/cards', label: 'Public Card Catalogue', badge: 'v1.57' },
        { path: '/expansions', label: 'Expansions & Sets Master Checklist', badge: 'v1.56' },
        { path: '/expansions/sets', label: 'Series & Set Directory', badge: 'Live' },
        { path: '/sets', label: 'Master Expansions Hub', badge: 'Popular' },
      ],
    },
    {
      title: 'Competitive & Rules',
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200/60 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800/40',
      description: 'Official Pokémon TCG tournament legality and rotation guides.',
      links: [
        { path: '/formats', label: 'Tournament Formats Hub', badge: '2026' },
        { path: '/format/standard', label: 'Standard Format (Marks H, I, J)', badge: 'Official' },
        { path: '/format/expanded', label: 'Expanded Format Checklists', badge: 'Legacy' },
        { path: '/format/glc', label: 'Gym Leader Challenge (GLC)', badge: 'Popular' },
      ],
    },
    {
      title: 'Grading & Utility Tools',
      icon: Calculator,
      color: 'text-blue-600 bg-blue-50 border-blue-200/60 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-800/40',
      description: 'Mathematical grade modeling and algorithmic validation engines.',
      links: [
        { path: '/tools', label: 'All High-Intent TCG Tools', badge: 'Hub' },
        { path: '/tools/psa-grade-calculator', label: 'PSA Grade Probability Calculator', badge: 'AI Model' },
        { path: '/tools/deck-legality-checker', label: 'Deck Legality & ACE SPEC Checker', badge: 'Instant' },
        { path: '/leaderboard', label: 'Global Collector Leaderboards', badge: 'Realtime' },
      ],
    },
    {
      title: 'Market Intelligence & Comparisons',
      icon: BarChart3,
      color: 'text-amber-600 bg-amber-50 border-amber-200/60 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800/40',
      description: 'Objective feature matrices and curated collector software guides.',
      links: [
        { path: '/compare', label: 'Competitor Comparison Index', badge: 'Verified' },
        { path: '/compare/collectr', label: 'DECK/divider vs Collectr', badge: 'Matrix' },
        { path: '/compare/pricecharting', label: 'DECK/divider vs PriceCharting', badge: 'Matrix' },
        { path: '/best', label: 'Curated Buyer Guides & Software Picks', badge: '2026' },
      ],
    },
    {
      title: 'Platform Architecture & History',
      icon: Zap,
      color: 'text-purple-600 bg-purple-50 border-purple-200/60 dark:text-purple-400 dark:bg-purple-950/40 dark:border-purple-800/40',
      description: 'Continuous deployment logs, enterprise security, and guides.',
      links: [
        { path: '/changelog', label: '58-Iteration Changelog (v1.01 – v1.58)', badge: '58th Iteration' },
        { path: '/pricing', label: 'Transparent Tiered Pricing', badge: 'Plans' },
        { path: '/how-it-works', label: 'Architecture & How It Works', badge: 'Guide' },
        { path: '/about', label: 'Mission & Engineering Standards', badge: 'About' },
        { path: '/partners/ptc-collectibles', label: 'PTC Collectibles Partner Perk (5% Off)', badge: 'Partner' },
      ],
    },
    {
      title: 'Support, Legal & Compliance',
      icon: FileText,
      color: 'text-slate-600 bg-slate-50 border-slate-200/60 dark:text-slate-400 dark:bg-slate-900/60 dark:border-slate-800/40',
      description: 'Privacy protections, data integrity policies, and technical help.',
      links: [
        { path: '/faq', label: 'Frequently Asked Questions', badge: 'FAQ' },
        { path: '/contact', label: 'Engineering & Support Dispatch', badge: 'Contact' },
        { path: '/security', label: 'Zero-Telemetry Security Protocol', badge: 'Shield' },
        { path: '/privacy', label: 'GDPR & CCPA Privacy Policy', badge: 'Legal' },
      ],
    },
  ];

  return (
    <section 
      aria-label="DECK / divider Page Web & Internal Cross-Linking Directory"
      className={`border-t border-slate-200/80 bg-white/70 backdrop-blur-md py-14 px-4 sm:px-6 lg:px-8 mt-12 ${className}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 mb-3">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Universal Discovery Mesh</span>
              <span className="text-slate-400">•</span>
              <span className="text-blue-600 font-mono">58 Active Hubs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              {subtitle}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <Link
              to="/changelog"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>v1.58 Changelog</span>
            </Link>
            <Link
              to="/cards"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200/70 hover:bg-blue-100 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Browse All Cards</span>
            </Link>
          </div>
        </div>

        {/* 6-Column Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all hover:border-slate-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className={`p-2 rounded-xl border ${cat.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <h3 className="font-semibold text-slate-900 text-base">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-2 border-t border-slate-100">
                  {cat.links.map((link, lIdx) => {
                    const isCurrent = currentPath === link.path;
                    return (
                      <li key={lIdx}>
                        <Link
                          to={link.path}
                          className={`group flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors ${
                            isCurrent 
                              ? 'bg-blue-50 text-blue-700 font-semibold pointer-events-none' 
                              : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-blue-600' : 'bg-slate-300 group-hover:bg-blue-500'}`} />
                            <span className="truncate">{link.label}</span>
                          </span>
                          <span className="flex items-center gap-1 shrink-0 ml-2">
                            {link.badge && (
                              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                                {link.badge}
                              </span>
                            )}
                            <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Global Bot Discovery Sub-links */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-semibold text-slate-700">Quick Deep Links:</span>
            <Link to="/cards?q=Charizard" className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2">Charizard Cards</Link>
            <Link to="/cards?q=Pikachu" className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2">Pikachu Scans</Link>
            <Link to="/expansions?series=Scarlet+%26+Violet" className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2">Scarlet & Violet Sets</Link>
            <Link to="/expansions?series=Sword+%26+Shield" className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2">Sword & Shield Sets</Link>
            <Link to="/deck/gardevoir-ex" className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2">Gardevoir ex Deck</Link>
            <Link to="/deck/charizard-ex" className="hover:text-blue-600 underline decoration-slate-300 underline-offset-2">Charizard ex Deck</Link>
          </div>
          <div className="flex items-center gap-3">
            <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 text-[11px] font-mono">
              XML Sitemap
            </a>
            <span>•</span>
            <a href="/robots.txt" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 text-[11px] font-mono">
              Robots.txt
            </a>
            <span>•</span>
            <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-slate-800 text-[11px] font-mono">
              LLMs.txt
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
