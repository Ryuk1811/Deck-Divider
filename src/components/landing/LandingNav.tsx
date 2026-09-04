import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

        {/* Desktop Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 relative">
            <button
              onClick={() => {
                const el = document.getElementById('desktop-pages-dropdown');
                if (el) el.classList.toggle('hidden');
              }}
              onBlur={(e) => {
                // Delay hiding slightly to allow clicks to register
                setTimeout(() => {
                  const el = document.getElementById('desktop-pages-dropdown');
                  if (el) el.classList.add('hidden');
                }, 150);
              }}
              className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-[#F1F5F9] rounded-full hover:bg-[#E2E8F0] transition-colors flex items-center gap-1 cursor-pointer"
            >
              Pages
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <div
              id="desktop-pages-dropdown"
              className="hidden absolute top-full mt-2 left-0 w-48 bg-white border border-[#E2E8F0] rounded-xl shadow-xl overflow-hidden py-2 animate-fade-in z-50 flex flex-col"
            >
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">About</Link>
              <Link to="/how-it-works" className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">How it works</Link>
              <Link to="/pricing" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); handleNav('pricing'); } }} className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">Pricing</Link>
              <Link to="/faq" onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); handleNav('faq-and-insights'); } }} className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">FAQ</Link>
              <Link to="/privacy" className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">Terms of Service</Link>
              <Link to="/security" className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">Security</Link>
              <Link to="/contact" className="px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors">Contact Us</Link>
            </div>
          </nav>

          {/* Action Button: Show Launch Studio when signed in; Sign In and Launch App when not signed in */}
          {user ? (
            <Link
              to="/app"
              onClick={() => onEnterApp && onEnterApp()}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-lg transition-all border border-[#DC143C] cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC143C] focus-visible:ring-offset-2 whitespace-nowrap"
            >
              <span>Launch Studio</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                onClick={() => onOpenAuth && onOpenAuth()}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0F172A] hover:text-[#DC143C] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/app"
                onClick={() => onEnterApp && onEnterApp()}
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-lg transition-all border border-[#DC143C] cursor-pointer shadow-xs whitespace-nowrap"
              >
                <span>Launch App</span>
              </Link>
            </div>
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
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>About</span>
              </div>
            </Link>

            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>How It Works</span>
              </div>
            </Link>

            <Link
              to="/pricing"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  handleNav('pricing');
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>Pricing</span>
              </div>
            </Link>

            <Link
              to="/faq"
              onClick={(e) => {
                setMobileMenuOpen(false);
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  handleNav('faq-and-insights');
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>FAQ</span>
              </div>
            </Link>
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>Privacy Policy</span>
              </div>
            </Link>
            <Link
              to="/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>Terms of Service</span>
              </div>
            </Link>
            <Link
              to="/security"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>Security</span>
              </div>
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <span>Contact Us</span>
              </div>
            </Link>

            {user ? (
              <div className="pt-2 border-t border-slate-100">
                <Link
                  to="/app"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onEnterApp) onEnterApp();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Launch Studio</span>
                </Link>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/auth"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAuth) onOpenAuth();
                  }}
                  className="w-full py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/app"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onEnterApp) onEnterApp();
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#DC143C] hover:bg-[#B01030] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Launch App</span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
