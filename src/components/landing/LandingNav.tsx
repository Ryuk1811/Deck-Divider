import React, { useState } from 'react';
import { DeckDividerBrand } from '../DeckDividerBrand';
import { LogIn, Menu, X, ArrowRight, Shield, Layers, HelpCircle, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-2.5 sm:py-3.5 transition-all">
      <div className="w-full max-w-[2200px] mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Zone */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => {
            setMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <DeckDividerBrand size="md" />
        </div>

        {/* Desktop Navigation Links */}
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

          {/* Action Button: Sign In / Studio Launch */}
          {user ? (
            <button
              onClick={onEnterApp}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-lg transition-all border border-[#DC143C] cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <span>Launch Studio</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-[#0F172A] hover:text-[#DC143C] bg-[#F8FAFC] hover:bg-[#F1F5F9] rounded-lg transition-all border border-[#E2E8F0] hover:border-[#DC143C]/40 cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />
              <span>Sign In <span className="hidden sm:inline">/ Login</span></span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
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

      {/* Mobile Drawer Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden border-t border-slate-200 mt-2.5 pt-3 pb-4 bg-white space-y-1.5"
          >
            <button
              type="button"
              onClick={() => handleNav('about')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-[#DC143C]" />
                <span>About Platform</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleNav('how-it-works')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-[#DC143C]" />
                <span>How It Works (Workflow)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleNav('pricing')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-[#DC143C]" />
                <span>Pricing Tiers</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleNav('faq-and-insights')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#DC143C]" />
                <span>FAQ & Knowledge</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Free Account</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
