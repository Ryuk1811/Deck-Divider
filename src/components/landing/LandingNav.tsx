import React from 'react';
import { Link } from 'react-router-dom';
import { DeckDividerBrand } from '../ui/DeckDividerBrand';
import { PagesDropdown } from '../ui/PagesDropdown';

interface LandingNavProps {
  onOpenAuth?: () => void;
  onEnterApp?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  user?: any;
}

export const LandingNav: React.FC<LandingNavProps> = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-2.5 sm:py-3.5 transition-all">
      <div className="w-full max-w-[2200px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone: Real anchor navigation to homepage */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] rounded-lg"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="DECK / divider Home"
        >
          <DeckDividerBrand size="md" />
        </Link>

        {/* Topbar Right Navigation: Single Pages Dropdown (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PagesDropdown variant="landing" />
        </div>
      </div>
    </header>
  );
};

