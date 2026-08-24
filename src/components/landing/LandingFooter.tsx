import React from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { ArrowUp, Shield, Database, Layers } from 'lucide-react';
import { DisplayCurrency } from '../../types';

interface LandingFooterProps {
  onEnterApp?: () => void;
  onOpenAuth?: () => void;
  onNavigateSection?: (id: string) => void;
  displayCurrency: DisplayCurrency;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  displayCurrency,
  onNavigateSection,
}) => {
  const scrollTo = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white text-[#0F172A] border-t border-[#E2E8F0] pt-12 lg:pt-16 pb-12 px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24">
      <div className="w-full max-w-[2200px] mx-auto space-y-8 lg:space-y-10">
        {/* Main Grid: Structured 4-column layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-10 text-left">
          {/* Column 1: Brand & Platform Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <DeckDividerBrand size="md" />
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] max-w-sm leading-relaxed">
              Track raw cards, graded slabs, master sets, and tournament deck lists for the Pokémon Trading Card Game.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#475569] font-mono">
              <span className="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                Currency: {displayCurrency}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded whitespace-nowrap">
                <Shield className="w-3 h-3 text-[#16A34A] shrink-0" />
                Private Backups
              </span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('pricing')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Plans & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('faq-and-insights')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  FAQ & Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('collection')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Raw & Slabs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Features */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Features
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('metrics')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Collection Value
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('decks')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  60-Card Deck Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('sets')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Master Set Checklists
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('search')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Card Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('lists')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Wishlists & Alerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('sealed-vault')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Sealed Boxes
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Disclaimer */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Disclaimer
            </h4>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and Game Freak. DECK / divider is an independent tool and is not affiliated with, endorsed by, or sponsored by Nintendo or The Pokémon Company.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} DECK / divider. Built for Pokémon card collectors.</span>
          </div>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#DC143C] transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
