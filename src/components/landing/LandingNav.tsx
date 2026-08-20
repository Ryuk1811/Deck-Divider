import React from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { LogIn } from 'lucide-react';

interface LandingNavProps {
  onOpenAuth: () => void;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-3.5 transition-all">
      <div className="w-full max-w-[2200px] mx-auto flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <DeckDividerBrand size="md" />
        </div>

        {/* Action Zone */}
        <div className="flex items-center">
          {/* Sign In Button */}
          <button
            onClick={onOpenAuth}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0F172A] hover:bg-[#F4F4F6] rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F172A] focus-visible:ring-offset-2"
          >
            <LogIn className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};
