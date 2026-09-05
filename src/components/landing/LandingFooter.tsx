import React from 'react';
import { Link } from 'react-router-dom';
import { DeckDividerBrand } from '../DeckDividerBrand';

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
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto relative z-10 w-full overflow-hidden">
      <div className="w-full px-6 lg:px-12 py-8 flex flex-col gap-6">
        {/* Top Row: Inline Config */}
        <div className="flex items-center gap-4 w-full overflow-hidden">
          <div className="flex-shrink-0">
            <DeckDividerBrand />
          </div>
          <div className="flex-shrink-0 px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-md flex items-center justify-center">
            <span className="font-mono text-[11px] font-bold text-slate-700 tracking-wider">SUPPORT: deckdivider@outlook.com</span>
          </div>
          <div className="text-slate-500 text-sm truncate flex-grow">
            Raw cards, graded slabs, sealed product, and competitive decks — tracked live.
          </div>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-px bg-slate-200" />

        {/* Middle Row: Expanded Chart Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full text-sm text-slate-600">
          
          <div className="md:col-span-12 lg:col-span-4 space-y-6">
            <div>
              <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
                About the Platform
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                DECK / divider is an advanced analytics and portfolio management tool designed specifically for the Pokémon TCG community. We aggregate live market data and provide institutional-grade tools to collectors and competitive players worldwide.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-2">
            <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
              Platform
            </div>
            <div className="flex flex-col gap-y-3">
              <Link to="/about" className="hover:text-cyan-600 transition-colors font-medium">About Us</Link>
              <Link to="/how-it-works" className="hover:text-cyan-600 transition-colors font-medium">How It Works</Link>
              <Link to="/pricing" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('pricing'); } }} className="text-left hover:text-cyan-600 transition-colors font-medium">Pricing</Link>
              <Link to="/features" className="hover:text-cyan-600 transition-colors font-medium">All Features</Link>
              <Link to="/changelog" className="hover:text-cyan-600 transition-colors font-medium">Changelog</Link>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
              Resources & Legal
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Link to="/faq" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('faq-and-insights'); } }} className="text-left hover:text-cyan-600 transition-colors font-medium">FAQ</Link>
              <Link to="/support" className="hover:text-cyan-600 transition-colors font-medium">Support Center</Link>
              <Link to="/contact" className="hover:text-cyan-600 transition-colors font-medium">Contact Us</Link>
              <Link to="/media-kit" className="hover:text-cyan-600 transition-colors font-medium">Media Kit</Link>
              <Link to="/privacy" className="hover:text-cyan-600 transition-colors font-medium">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-cyan-600 transition-colors font-medium">Terms of Service</Link>
              <Link to="/cookie-policy" className="hover:text-cyan-600 transition-colors font-medium">Cookie Policy</Link>
              <Link to="/security" className="hover:text-cyan-600 transition-colors font-medium">Security</Link>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
              Community &amp; Data
            </div>
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <Link to="/leaderboard" className="hover:text-cyan-600 transition-colors font-medium">Leaderboard</Link>
              <Link to="/sets" className="hover:text-cyan-600 transition-colors font-medium">Expansions</Link>
              <Link to="/formats" className="hover:text-cyan-600 transition-colors font-medium">Format Legality</Link>
              <Link to="/compare" className="hover:text-cyan-600 transition-colors font-medium">App Comparisons</Link>
              <Link to="/best/pokemon-card-trackers" className="hover:text-cyan-600 transition-colors font-medium">Best Trackers</Link>
              <Link to="/best/slab-scanners" className="hover:text-cyan-600 transition-colors font-medium">Slab Trackers</Link>
              <Link to="/tools/psa-grade-calculator" className="hover:text-cyan-600 transition-colors font-medium">PSA Calculator</Link>
              <Link to="/tools/deck-legality-checker" className="hover:text-cyan-600 transition-colors font-medium">Legality Tool</Link>
              <Link to="/tools/geo-inspector" className="hover:text-cyan-600 transition-colors font-medium">AI Citation Hub</Link>
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
              Core Engine
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
              <a href="/#collection" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('collection'); } }} className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span>Raw & Slabs</a>
              <a href="/#decks" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('decks'); } }} className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span>Deck Builder</a>
              <a href="/#master-sets" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('master-sets'); } }} className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span>Master Sets</a>
              <a href="/#search" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('search'); } }} className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span>Search</a>
              <a href="/#lists" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('lists'); } }} className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span>Wishlists</a>
              <a href="/#sealed-vault" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); onNavigateSection('sealed-vault'); } }} className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-slate-300"></span>Sealed Vault</a>
            </div>
          </div>
        </div>

        {/* Divider 2 */}
        <div className="w-full h-px bg-slate-200 mt-2" />

        {/* Bottom Row: Inline Legal & Disclaimer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full text-xs text-slate-400">
          <div className="flex-shrink-0 whitespace-nowrap font-medium">
            © {new Date().getFullYear()} DECK / divider. All rights reserved.
          </div>
          <div className="text-center md:text-right flex-grow text-[11px] leading-relaxed text-slate-400">
            DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.
          </div>
        </div>
      </div>
    </footer>
  );
};
