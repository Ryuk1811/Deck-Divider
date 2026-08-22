import React from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { LogIn } from 'lucide-react';

interface LandingNavProps {
  onOpenAuth: () => void;
  onEnterApp?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  user?: any;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenAuth,
  onEnterApp,
  onNavigateSection,
  user,
}) => {
  const handleNav = (id: string) => {
    if (onNavigateSection) {
      onNavigateSection(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-3.5 transition-all">
      <div className="w-full max-w-[2200px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <DeckDividerBrand size="md" />
        </div>

        {/* Right Navigation & Action Zone */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => handleNav('about')}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F1F5F9] cursor-pointer whitespace-nowrap"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F1F5F9] cursor-pointer whitespace-nowrap"
            >
              How it works
            </button>
            <button
              type="button"
              onClick={() => handleNav('pricing')}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F1F5F9] cursor-pointer whitespace-nowrap"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => handleNav('faq-and-insights')}
              className="px-3 py-1.5 text-xs sm:text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors rounded-lg hover:bg-[#F1F5F9] cursor-pointer whitespace-nowrap"
            >
              FAQ & Insights
            </button>
          </nav>

          {/* Sign In / Dashboard Button */}
          {user ? (
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-lg transition-all border border-[#DC143C] cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <span>Launch Studio</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:text-[#DC143C] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg transition-all border border-[#E2E8F0] hover:border-[#DC143C]/40 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />
              <span>Sign In <span className="hidden sm:inline">/ Login</span></span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
