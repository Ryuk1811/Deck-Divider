import React from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { DisplayCurrency } from '../../types';
import { ArrowRight, Sparkles, LogIn, DollarSign } from 'lucide-react';

interface LandingNavProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
  displayCurrency: DisplayCurrency;
  onSelectCurrency: (c: DisplayCurrency) => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onEnterApp,
  onOpenAuth,
  displayCurrency,
  onSelectCurrency,
}) => {
  const currencies: DisplayCurrency[] = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <DeckDividerBrand size="md" />
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F4F4F6] border border-[#E2E8F0] text-[10px] font-num text-[#64748B]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            LIVE CATALOG v3.2
          </div>
        </div>

        {/* Nav Links Zone */}
        <nav className="hidden lg:flex items-center gap-6 text-[13px] font-medium text-[#64748B]">
          <button
            onClick={() => scrollTo('collection')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Collection
          </button>
          <button
            onClick={() => scrollTo('metrics')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Metrics
          </button>
          <button
            onClick={() => scrollTo('decks')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Decks
          </button>
          <button
            onClick={() => scrollTo('sets')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Sets
          </button>
          <button
            onClick={() => scrollTo('search')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={() => scrollTo('lists')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Lists
          </button>
          <button
            onClick={() => scrollTo('sealed-vault')}
            className="hover:text-[#0F172A] transition-colors whitespace-nowrap cursor-pointer"
          >
            Sealed Vault
          </button>
          <button
            onClick={() => scrollTo('pricing')}
            className="text-[#DC143C] font-semibold hover:text-[#B01030] transition-colors whitespace-nowrap cursor-pointer"
          >
            Pricing
          </button>
        </nav>

        {/* Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={displayCurrency}
              onChange={(e) => onSelectCurrency(e.target.value as DisplayCurrency)}
              className="appearance-none bg-[#F4F4F6] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-num font-semibold py-2 pl-3 pr-7 rounded-lg border border-[#E2E8F0] cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
            >
              {currencies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <DollarSign className="w-3 h-3 text-[#64748B] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sign In Button */}
          <button
            onClick={onOpenAuth}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F4F4F6] rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0] cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Sign In</span>
          </button>

          {/* Enter App Primary CTA */}
          <button
            onClick={onEnterApp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
