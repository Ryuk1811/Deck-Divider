import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DeckDividerBrand } from '../ui/DeckDividerBrand';
import { Menu, X, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PagesDropdown, ALL_PAGES } from '../ui/PagesDropdown';

interface LandingNavProps {
  onOpenAuth?: () => void;
  onEnterApp?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  user?: any;
}

export const LandingNav: React.FC<LandingNavProps> = ({
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
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
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-2.5 sm:py-3.5 transition-all">
      <div className="w-full max-w-[2200px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone: Real anchor navigation to homepage */}
        <Link
          to="/"
          className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] rounded-lg"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="DECK / divider Home"
        >
          <DeckDividerBrand size="md" />
        </Link>

        {/* Topbar Right Navigation: Single Pages Dropdown (Desktop & Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <PagesDropdown variant="landing" />

          {/* Mobile Hamburger Button for Full Drawer */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Sheet (No Signin or Launch buttons) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-slate-200 mt-2.5 pt-3 pb-4 bg-white space-y-3 max-h-[80vh] overflow-y-auto"
          >
            <div className="px-2 pb-1 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#DC143C]" />
                All Directory Pages
              </span>
              <span className="text-[10px] font-mono text-slate-400">{ALL_PAGES.length} pages</span>
            </div>

            <div className="space-y-1 px-1">
              {ALL_PAGES.map((page) => {
                const Icon = page.icon;
                return (
                  <Link
                    key={page.name}
                    to={page.path}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (page.path.startsWith('/#') || (page.path === '/faq' && window.location.pathname === '/')) {
                        handleNav(page.path === '/faq' ? 'faq-and-insights' : 'pricing');
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded-md bg-slate-100 text-slate-600">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{page.name}</span>
                        {page.description && (
                          <span className="text-[10px] text-slate-400 leading-tight">{page.description}</span>
                        )}
                      </div>
                    </div>
                    {page.badge && (
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold shrink-0">
                        {page.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
