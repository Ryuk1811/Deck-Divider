import React from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { ArrowUp, Shield, Database, Cpu, Layers, Sparkles } from 'lucide-react';
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
              Institutional-grade portfolio valuation, championship deck engineering, master set matrix tracking, and encrypted sealed vault management for Pokémon Trading Card Game collectors and competitors worldwide.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-[#475569] font-mono">
              <span className="inline-flex items-center gap-1.5 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                Currency: {displayCurrency}
              </span>
              <span className="inline-flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1.5 rounded whitespace-nowrap">
                <Shield className="w-3 h-3 text-[#16A34A] shrink-0" />
                AES-256 Vault
              </span>
            </div>
          </div>

          {/* Column 2: How It Works & Navigation */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#DC143C]" />
              Platform Overview
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('about')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  About DECK / divider
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
                  Subscription Tiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('collection')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Asset Certification
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Core Modules */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#DC143C]" />
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('collection')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Slab & Raw Registry
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('metrics')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  NAV & Capital Gains
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('decks')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Tournament Deck Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('sets')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  148+ Master Set Matrix
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Architecture & Security */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#DC143C]" />
              Architecture
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#64748B]">
              <li>
                <button
                  onClick={() => scrollTo('search')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Multi-Vector Search
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('lists')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Acquisition Watchlists
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('sealed-vault')}
                  className="hover:text-[#DC143C] transition-colors cursor-pointer text-left block w-full py-0.5"
                >
                  Sealed Vault Ledger
                </button>
              </li>
              <li>
                <span className="text-[#94A3B8] inline-flex items-center gap-1 py-0.5">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Realtime Micro-Sync
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer & Bottom Copyright Row */}
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
