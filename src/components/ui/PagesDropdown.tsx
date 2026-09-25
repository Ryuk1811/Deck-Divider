import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layers,
  Search,
  BookOpen,
  Settings as SettingsIcon,
  TrendingUp,
  Package,
  Boxes,
  Trophy,
  ShieldCheck,
  Scale,
  Sparkles,
  Calculator,
  ShieldAlert,
  Info,
  HelpCircle,
  CreditCard,
  Lock,
  Mail,
  Home,
  ChevronDown,
  X,
  Compass,
  FileText
} from 'lucide-react';

export interface PageItem {
  name: string;
  path: string;
  category: 'Workspace' | 'Community' | 'Guides' | 'Tools' | 'Platform';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  isAppTab?: string; // e.g. 'collection', 'decks', etc.
}

export const ALL_PAGES: PageItem[] = [
  // Workspace (App Views)
  {
    name: 'Portfolio / Collection',
    path: '/app',
    category: 'Workspace',
    icon: Layers,
    description: 'Track owned cards, variants, and market values',
    isAppTab: 'collection',
  },
  {
    name: 'Tournament Deck Studio',
    path: '/app',
    category: 'Workspace',
    icon: BookOpen,
    description: '60-card tournament rosters with PTCGL export',
    isAppTab: 'decks',
  },
  {
    name: 'Card Database Search',
    path: '/app',
    category: 'Workspace',
    icon: Search,
    description: '14,800+ card SKUs with live market pricing',
    isAppTab: 'search',
  },
  {
    name: 'Set Checklists & Progress',
    path: '/app',
    category: 'Workspace',
    icon: Boxes,
    description: 'Master set completion trackers & variants',
    isAppTab: 'sets',
  },
  {
    name: 'Custom Lists & Wishlists',
    path: '/app',
    category: 'Workspace',
    icon: Layers,
    description: 'Organize trade binders and target purchases',
    isAppTab: 'lists',
  },
  {
    name: 'Sealed Products Vault',
    path: '/app',
    category: 'Workspace',
    icon: Package,
    description: 'Booster boxes, ETBs, and sealed collection',
    isAppTab: 'sealed_vault',
  },
  {
    name: 'Market Analytics & P&L',
    path: '/app',
    category: 'Workspace',
    icon: TrendingUp,
    description: 'Historical value charts & profit tracking',
    isAppTab: 'metrics',
  },
  {
    name: 'System & Account Settings',
    path: '/app',
    category: 'Workspace',
    icon: SettingsIcon,
    description: 'Currency, cloud backup, and data exports',
    isAppTab: 'settings',
  },

  // Community & Sets
  {
    name: 'Public Card Catalogue',
    path: '/cards',
    category: 'Community',
    icon: Search,
    description: 'Search cards with attributes, attacks, and legalities',
    badge: 'New',
  },
  {
    name: 'Expansions & Sets Directory',
    path: '/expansions',
    category: 'Community',
    icon: Boxes,
    description: 'All 148+ official Pokémon TCG expansions & checklists',
    badge: '148+ Sets',
  },
  {
    name: 'Socials & Trainer Reviews',
    path: '/socials',
    category: 'Community',
    icon: Sparkles,
    description: 'Official Discord, X, YouTube & trainer review ratings',
  },
  {
    name: 'Collector Leaderboard',
    path: '/leaderboard',
    category: 'Community',
    icon: Trophy,
    description: 'Top verified portfolios and meta decks',
    badge: 'Public',
  },
  {
    name: 'Format Legality Directory',
    path: '/formats',
    category: 'Community',
    icon: ShieldCheck,
    description: 'Standard, Expanded, and GLC rotation status',
  },

  // Guides & Comparisons
  {
    name: 'App Comparisons Matrix',
    path: '/compare',
    category: 'Guides',
    icon: Scale,
    description: 'DECK/divider vs Collectr, Pokellector, etc.',
  },
  {
    name: 'Best Trackers Guide',
    path: '/best/pokemon-card-trackers',
    category: 'Guides',
    icon: Sparkles,
    description: 'Objective ranking of 2026 TCG collection apps',
  },
  {
    name: 'Graded Slab Scanners Guide',
    path: '/best/slab-scanners',
    category: 'Guides',
    icon: ShieldCheck,
    description: 'PSA, BGS, CGC barcode and OCR scanner review',
  },
  {
    name: 'Deck Building Tools Ranked',
    path: '/best/deck-builders',
    category: 'Guides',
    icon: BookOpen,
    description: 'Top 60-card tournament roster builders',
  },

  // Tools & Calculators
  {
    name: 'PSA Grade ROI Calculator',
    path: '/tools/psa-grade-calculator',
    category: 'Tools',
    icon: Calculator,
    description: 'Financial profitability simulator for grading',
    badge: 'Popular',
  },
  {
    name: 'Deck Legality & Regulation Checker',
    path: '/tools/deck-legality-checker',
    category: 'Tools',
    icon: ShieldAlert,
    description: 'Validate 60-card rosters against H, I, J marks',
  },
  

  // Platform & Legal
  {
    name: 'Home / Overview',
    path: '/?landing=true',
    category: 'Platform',
    icon: Home,
    description: 'Official overview and feature breakdown',
  },
  {
    name: 'About DECK / divider',
    path: '/about',
    category: 'Platform',
    icon: Info,
    description: 'Origins, architecture, and ad-free pledge',
  },
  {
    name: 'How It Works',
    path: '/how-it-works',
    category: 'Platform',
    icon: Compass,
    description: 'Workflow from raw binder to certified slab',
  },
  {
    name: 'Pricing & Tiers',
    path: '/pricing',
    category: 'Platform',
    icon: CreditCard,
    description: 'Starter, Bunch, Binder, and Vault memberships',
  },
  {
    name: 'Frequently Asked Questions',
    path: '/faq',
    category: 'Platform',
    icon: HelpCircle,
    description: 'Answers on pricing data, imports, and security',
  },
  {
    name: 'PTC Collectibles Partner Perk',
    path: '/partners/ptc-collectibles',
    category: 'Platform',
    icon: Sparkles,
    description: 'Exclusive 5%+ discount code on booster boxes & singles',
    badge: '5% Off',
  },
  {
    name: 'Privacy Policy',
    path: '/privacy',
    category: 'Platform',
    icon: Lock,
    description: 'Zero third-party trackers or ad cookies',
  },
  {
    name: 'Terms of Service',
    path: '/terms',
    category: 'Platform',
    icon: FileText,
    description: 'User guidelines and platform agreement',
  },
  {
    name: 'Security Overview',
    path: '/security',
    category: 'Platform',
    icon: ShieldCheck,
    description: 'Local encryption and cloud snapshot protections',
  },
  {
    name: 'Contact & Support',
    path: '/contact',
    category: 'Platform',
    icon: Mail,
    description: 'Direct feedback and bug reports',
  },
];

interface PagesDropdownProps {
  activeTab?: string;
  onSelectTab?: (tab: any) => void;
  buttonClassName?: string;
  align?: 'left' | 'right';
  variant?: 'header' | 'landing';
}

export const PagesDropdown: React.FC<PagesDropdownProps> = ({
  activeTab,
  onSelectTab,
  buttonClassName,
  align = 'right',
  variant = 'header',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredPages = ALL_PAGES.filter((page) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      page.name.toLowerCase().includes(q) ||
      page.category.toLowerCase().includes(q) ||
      (page.description && page.description.toLowerCase().includes(q))
    );
  });

  const categories: Array<'Platform' | 'Workspace' | 'Community' | 'Guides' | 'Tools'> = ['Platform', 'Workspace', 'Community', 'Guides', 'Tools'];

  const handlePageClick = (page: PageItem) => {
    setIsOpen(false);
    if (page.isAppTab && onSelectTab) {
      onSelectTab(page.isAppTab);
    }
  };

  const isPageActive = (page: PageItem) => {
    if (page.isAppTab) {
      return location.pathname === '/app' && activeTab === page.isAppTab;
    }
    if (page.path === '/?landing=true') {
      return location.pathname === '/' && location.search.includes('landing=true');
    }
    if (page.path === '/expansions') {
      return (
        location.pathname === '/expansions' ||
        location.pathname === '/expansions/sets' ||
        location.pathname === '/sets'
      );
    }
    if (page.path === '/cards') {
      return location.pathname.toLowerCase() === '/cards';
    }
    return location.pathname === page.path;
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Pages navigation menu"
        className={
          buttonClassName ||
          (variant === 'landing'
            ? 'px-3 sm:px-3.5 py-1.5 text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0] transition-all flex items-center gap-1.5 cursor-pointer border border-[#E2E8F0] shadow-2xs'
            : 'h-8 sm:h-9 px-2.5 sm:px-3 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] flex items-center gap-1.5 text-xs font-semibold rounded-md shadow-2xs transition-colors cursor-pointer')
        }
      >
        <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />
        <span className="font-semibold text-xs sm:text-sm">Pages</span>
        <span className="hidden sm:inline-flex px-1.5 py-0.2 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 rounded">
          {ALL_PAGES.length}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#DC143C]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu Panel */}
      {isOpen && (
        <div
          className={`fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto ${
            align === 'left' ? 'sm:left-0' : 'sm:right-0'
          } sm:top-full sm:mt-2 w-auto sm:w-96 max-w-[calc(100vw-24px)] bg-white rounded-xl shadow-2xl border border-[#E2E8F0] z-50 overflow-hidden flex flex-col max-h-[82vh] sm:max-h-[75vh] animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {/* Header & Quick Search Bar */}
          <div className="p-3 border-b border-slate-100 bg-[#F8FAFC]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider font-mono">
                  Site Directory
                </span>
                <span className="text-[10px] font-mono text-slate-400">({ALL_PAGES.length} pages)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md sm:hidden"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search all pages, tools & guides..."
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#DC143C] focus:ring-1 focus:ring-[#DC143C]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Categorized Links List */}
          <div className="overflow-y-auto divide-y divide-slate-100 flex-1 p-1">
            {categories.map((category) => {
              const items = filteredPages.filter((p) => p.category === category);
              if (items.length === 0) return null;

              return (
                <div key={category} className="py-2 first:pt-1 last:pb-1">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {category === 'Workspace' ? 'App Workspace' : category}
                  </div>
                  <div className="space-y-0.5 mt-0.5">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const active = isPageActive(item);

                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => handlePageClick(item)}
                          className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors group ${
                            active
                              ? 'bg-[#FFF0F3] text-[#DC143C] font-semibold'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <div
                            className={`p-1 rounded-md shrink-0 mt-0.5 ${
                              active
                                ? 'bg-[#DC143C] text-white'
                                : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className="font-medium truncate">{item.name}</span>
                              {item.badge && (
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredPages.length === 0 && (
              <div className="py-8 px-4 text-center">
                <Search className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-600">No pages found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Try searching for &quot;calculator&quot;, &quot;leaderboard&quot;, or &quot;sets&quot;
                </p>
              </div>
            )}
          </div>

          {/* Quick Footer Links */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-500 px-3">
            
            <span className="font-mono text-[10px] text-slate-400">DECK / divider</span>
          </div>
        </div>
      )}
    </div>
  );
};
