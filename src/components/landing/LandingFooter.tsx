import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeckDividerBrand } from '../ui/DeckDividerBrand';
import {
  Layers,
  Users,
  BookOpen,
  Compass,
  ShieldCheck,
  Mail,
  Check
} from 'lucide-react';

interface LandingFooterProps {
  onEnterApp?: () => void;
  onOpenAuth?: () => void;
  onNavigateSection?: (id: string) => void;
  displayCurrency?: string;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onEnterApp,
  onOpenAuth,
  onNavigateSection,
  displayCurrency = 'USD',
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const supportEmail = 'deckdivider@outlook.com';

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(supportEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleHashNav = (sectionId: string) => (e: React.MouseEvent) => {
    if (window.location.pathname === '/' && onNavigateSection) {
      e.preventDefault();
      onNavigateSection(sectionId);
    }
  };

  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto relative z-10 select-none">
      <div className="w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-10 sm:py-12 lg:py-14 space-y-10">
        
        {/* Top Zone: Brand Overview, Direct Support & System Metric */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          <div className="space-y-2 max-w-xl">
            <Link
              to="/"
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] rounded-lg"
              aria-label="DECK / divider Home"
            >
              <DeckDividerBrand size="md" />
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-sans">
              Pokémon TCG collection tracker, PSA/BGS/CGC slab registry, and 60-card tournament deck builder with live market pricing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Direct Support Pill */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2">
              <Mail className="w-4 h-4 text-[#DC143C]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Direct Support
                </span>
                <a
                  href={`mailto:${supportEmail}`}
                  className="text-xs font-mono font-semibold text-slate-800 hover:text-[#DC143C] transition-colors"
                >
                  {supportEmail}
                </a>
              </div>
              <button
                onClick={handleCopyEmail}
                title="Copy Support Email"
                className="ml-2 p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Copy support email"
              >
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className="text-[10px] font-mono font-bold text-slate-600">COPY</span>
                )}
              </button>
            </div>

            {/* Offline-First & Realtime Badge */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-mono font-semibold text-slate-700">
                18,400+ Cards • Live Market Prices
              </span>
            </div>

            {/* Official Socials Discovery Badges */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-xl p-1.5">
              <a
                href="https://www.reddit.com/r/DeckDivider/"
                target="_blank"
                rel="noopener noreferrer"
                title="r/DeckDivider on Reddit"
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-[#FF4500]/50 hover:bg-[#FF4500]/5 text-slate-600 hover:text-[#FF4500] text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                aria-label="DECK divider Reddit community r/DeckDivider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500]"></span>
                <span>Reddit</span>
              </a>
              <a
                href="https://www.instagram.com/deckdivider/"
                target="_blank"
                rel="noopener noreferrer"
                title="@deckdivider on Instagram"
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-[#E1306C]/50 hover:bg-[#E1306C]/5 text-slate-600 hover:text-[#E1306C] text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                aria-label="DECK divider Instagram @deckdivider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]"></span>
                <span>Instagram</span>
              </a>
              <a
                href="https://x.com/DeckDivider"
                target="_blank"
                rel="noopener noreferrer"
                title="@DeckDivider on X (Twitter)"
                className="px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 hover:border-slate-900/50 hover:bg-slate-900/5 text-slate-600 hover:text-slate-900 text-[11px] font-mono font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                aria-label="DECK divider X profile @DeckDivider"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span>𝕏 / Twitter</span>
              </a>
            </div>
          </div>
        </div>

        {/* Middle Zone: Strict 5-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-8 xl:gap-10 text-xs sm:text-[13px]">
          
          {/* Column 1: Workspace & Studio */}
          <div className="space-y-3.5">
            <div className="font-mono font-bold text-[11px] tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Layers className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>Workspace</span>
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <a
                  href="/#collection"
                  onClick={handleHashNav('collection')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Raw &amp; Graded Slabs
                </a>
              </li>
              <li>
                <a
                  href="/#decks"
                  onClick={handleHashNav('decks')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  60-Card Deck Builder
                </a>
              </li>
              <li>
                <a
                  href="/#master-sets"
                  onClick={handleHashNav('master-sets')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Master Set Checklists
                </a>
              </li>
              <li>
                <a
                  href="/#search"
                  onClick={handleHashNav('search')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Card Database Search
                </a>
              </li>
              <li>
                <a
                  href="/#lists"
                  onClick={handleHashNav('lists')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Wishlists &amp; Binders
                </a>
              </li>
              <li>
                <a
                  href="/#sealed-vault"
                  onClick={handleHashNav('sealed-vault')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Sealed Collection
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Community & Directories */}
          <div className="space-y-3.5">
            <div className="font-mono font-bold text-[11px] tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              <span>Community</span>
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  to="/socials"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Socials &amp; Reviews
                </Link>
              </li>
              <li>
                <a
                  href="https://www.reddit.com/r/DeckDivider/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#FF4500] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF4500]"></span>
                  Reddit: r/DeckDivider
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/deckdivider/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#E1306C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E1306C]"></span>
                  Instagram: @deckdivider
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/DeckDivider"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                  𝕏 / Twitter: @DeckDivider
                </a>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Collector Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/sets"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  All Expansions
                </Link>
              </li>
              <li>
                <Link
                  to="/formats"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Format Legality
                </Link>
              </li>
              <li>
                <Link
                  to="/format/standard"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Standard Format Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Guides & Calculators */}
          <div className="space-y-3.5">
            <div className="font-mono font-bold text-[11px] tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>Guides &amp; Tools</span>
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  to="/best/pokemon-card-trackers"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Best Card Trackers
                </Link>
              </li>
              <li>
                <Link
                  to="/best/slab-scanners"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Graded Slab Scanners
                </Link>
              </li>
              <li>
                <Link
                  to="/best/deck-builders"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Deck Builders Ranked
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  App Comparisons
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/psa-grade-calculator"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  PSA Grade Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/tools/deck-legality-checker"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Format Legality Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform & Support */}
          <div className="space-y-3.5">
            <div className="font-mono font-bold text-[11px] tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Compass className="w-3.5 h-3.5 text-sky-500" />
              <span>Platform</span>
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  to="/about"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  onClick={handleHashNav('pricing')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  onClick={handleHashNav('faq-and-insights')}
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Contact &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Trust & Legal */}
          <div className="space-y-3.5">
            <div className="font-mono font-bold text-[11px] tracking-wider text-slate-400 uppercase flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Trust &amp; Legal</span>
            </div>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link
                  to="/privacy"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/security"
                  className="text-slate-600 hover:text-[#DC143C] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  Security
                </Link>
              </li>
              <li>
                <div className="pt-2 text-[11px] text-slate-400 leading-relaxed font-sans">
                  No ads or tracking cookies. Export and backup your data anytime.
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Simple Fan-Made Project Disclaimer */}
        <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 whitespace-nowrap font-medium text-slate-500">
            <span>© {new Date().getFullYear()} DECK / divider.</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="text-[11px] font-mono text-slate-400">All rights reserved.</span>
          </div>

          <div className="text-center md:text-right text-[11px] leading-relaxed text-slate-400 max-w-2xl font-sans">
            This is an independent fan-made project and is not affiliated with, endorsed by, or sponsored by Nintendo, Creatures Inc., GAME FREAK, or The Pokémon Company.
          </div>
        </div>

      </div>
    </footer>
  );
};
