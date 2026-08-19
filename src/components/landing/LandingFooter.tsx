import React from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { ArrowUp } from 'lucide-react';
import { DisplayCurrency } from '../../types';

interface LandingFooterProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  displayCurrency: DisplayCurrency;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onEnterApp,
  onOpenAuth,
  displayCurrency,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white text-[#0F172A] border-t border-[#E2E8F0] pt-14 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
          {/* Brand & Description Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <DeckDividerBrand size="md" />
            </div>
            <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
              DECK / divider is an institutional-grade portfolio tracker, tournament deck studio, master set matrix, and sealed vault asset management system for Pokémon Trading Card Game collectors and competitors worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#64748B] font-mono">
              <span className="flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Multi-Currency Live Exchange
              </span>
              <span>•</span>
              <span className="bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1 rounded">
                Real-Time Cloud Sync
              </span>
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('collection')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Slab & Raw Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('metrics')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Portfolio Valuation
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('decks')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Tournament Deck Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('sets')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Master Set Completion
                </button>
              </li>
            </ul>
          </div>

          {/* Advanced Features Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Advanced Tools
            </h4>
            <ul className="space-y-2 text-xs text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('search')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Multi-Attribute Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('lists')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Custom Watchlists
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('sealed-vault')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Sealed Vault Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('pricing')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left"
                >
                  Tier Plans & Pricing
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Launch / Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              Get Started
            </h4>
            <div className="space-y-2">
              <button
                onClick={onEnterApp}
                className="w-full py-2.5 px-3 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-lg transition-colors text-center cursor-pointer shadow-xs"
              >
                Launch Studio Free
              </button>
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 px-3 bg-[#F8FAFC] hover:bg-slate-100 text-[#0F172A] text-xs font-semibold rounded-lg transition-colors text-center border border-[#E2E8F0] cursor-pointer"
              >
                Sign In / Register
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Line */}
        <div className="pt-6 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-3">
          <p className="leading-relaxed">
            <strong>Disclaimer:</strong> Pokémon and Pokémon character names are trademarks of Nintendo, Creatures Inc., and GAME FREAK inc. DECK / divider is an independent fan-made analytical software tool and is not affiliated with, endorsed by, sponsored by, or associated with Nintendo, The Pokémon Company International, or GAME FREAK inc. All card images and trademarks are property of their respective owners.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              © {new Date().getFullYear()} DECK / divider. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-[#DC143C] flex items-center gap-1 cursor-pointer font-mono font-semibold"
              >
                <ArrowUp className="w-3.5 h-3.5" /> Back to Top
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
