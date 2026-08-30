import React from 'react';
import { Link } from 'react-router-dom';
import { DeckDividerBrand } from '../DeckDividerBrand';

interface LandingFooterProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  onNavigateSection: (id: string) => void;
  displayCurrency: string;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onEnterApp,
  onOpenAuth,
  onNavigateSection,
  displayCurrency,
}) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 relative overflow-hidden">
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
            Track raw cards, graded slabs, sealed products, and build competitive decks with live market data.
          </div>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-px bg-slate-200" />

        {/* Middle Row: Expanded Chart Form */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full text-sm text-slate-600">
          {/* Navigation Chart */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
              Navigation
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <Link to="/" className="hover:text-cyan-600 transition-colors font-medium">Home</Link>
              <Link to="/about" className="hover:text-cyan-600 transition-colors font-medium">About</Link>
              <Link to="/how-it-works" className="hover:text-cyan-600 transition-colors font-medium">How It Works</Link>
              <Link to="/privacy" className="hover:text-cyan-600 transition-colors font-medium">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-cyan-600 transition-colors font-medium">Terms of Service</Link>
              <Link to="/auth" className="hover:text-cyan-600 transition-colors font-medium">Sign In</Link>
              <a 
                href="/#pricing" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('pricing');
                  }
                }} 
                className="text-left hover:text-cyan-600 transition-colors font-medium"
              >
                Pricing
              </a>
              <a 
                href="/#faq" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('faq');
                  }
                }} 
                className="text-left hover:text-cyan-600 transition-colors font-medium"
              >
                FAQ & Notes
              </a>
            </div>
          </div>

          {/* Features Chart */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="font-mono font-bold text-[10px] tracking-wider text-slate-400 uppercase mb-4 border-b border-slate-100 pb-2">
              Features
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-4">
              <a 
                href="/#collection" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('collection');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Raw & Slabs
              </a>
              <a 
                href="/#metrics" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('collection');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Collection Value
              </a>
              <a 
                href="/#decks" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('decks');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Deck Builder
              </a>
              <a 
                href="/#master-sets" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('master-sets');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Master Sets
              </a>
              <a 
                href="/#search" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('search');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Database Search
              </a>
              <a 
                href="/#lists" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('lists');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Wishlists
              </a>
              <a 
                href="/#sealed-vault" 
                onClick={(e) => {
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    onNavigateSection('sealed-vault');
                  }
                }} 
                className="text-left hover:text-slate-900 transition-colors flex items-center gap-2"
              >
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                Sealed Vault
              </a>
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
