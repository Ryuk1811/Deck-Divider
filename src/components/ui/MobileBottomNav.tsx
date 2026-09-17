import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Package,
  Boxes,
  MoreHorizontal,
  TrendingUp,
  ListOrdered,
  Settings as SettingsIcon,
  Search,
  X,
  ChevronRight,
  Shield,
  FileText,
  Sparkles,
  Cloud,
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPricing?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenPricing,
}) => {
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  // Primary 4 Tabs + More Hub Trigger
  const primaryTabs: { id: ActiveTab; label: string; icon: React.ElementType }[] = [
    { id: 'collection', label: 'Portfolio', icon: LayoutDashboard },
    { id: 'sets', label: 'Sets', icon: Boxes },
    { id: 'decks', label: 'Studio', icon: Layers },
    { id: 'sealed_vault', label: 'Vault', icon: Package },
  ];

  const isMoreActive = ['metrics', 'lists', 'settings', 'search'].includes(activeTab);

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMoreSheetOpen(false);
  };

  return (
    <>
      {/* iOS Bottom Navigation Bar */}
      <nav
        id="mobile-bottom-nav"
        aria-label="iOS Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[calc(env(safe-area-inset-bottom,0px)+6px)] transition-all"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                type="button"
                id={`mobile-tab-${tab.id}`}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer relative ${
                  isActive ? 'text-[#DC143C]' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                    isActive ? 'bg-[#FFF0F3]' : 'bg-transparent'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                    }`}
                  />
                  {isActive && (
                    <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-sans tracking-tight mt-0.5 transition-all ${
                    isActive ? 'font-bold text-[#DC143C]' : 'font-medium text-slate-500'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* 5th Tab: More / Utilities */}
          <button
            type="button"
            id="mobile-tab-more"
            onClick={() => setIsMoreSheetOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer relative ${
              isMoreActive || isMoreSheetOpen ? 'text-[#DC143C]' : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200 ${
                isMoreActive || isMoreSheetOpen ? 'bg-[#FFF0F3]' : 'bg-transparent'
              }`}
            >
              <MoreHorizontal
                className={`w-5 h-5 transition-transform duration-200 ${
                  isMoreActive || isMoreSheetOpen ? 'scale-110 stroke-[2.25]' : 'stroke-[1.75]'
                }`}
              />
              {isMoreActive && (
                <span className="absolute -top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
              )}
            </div>
            <span
              className={`text-[10px] font-sans tracking-tight mt-0.5 transition-all ${
                isMoreActive || isMoreSheetOpen ? 'font-bold text-[#DC143C]' : 'font-medium text-slate-500'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>

      {/* iOS Native Slide-up Action Sheet for "More" */}
      {isMoreSheetOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={() => setIsMoreSheetOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Sheet Container */}
          <div className="relative z-10 bg-slate-50 rounded-t-3xl border-t border-slate-200/90 shadow-2xl p-4 max-h-[85vh] overflow-y-auto space-y-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]">
            {/* Grabber */}
            <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />

            {/* Sheet Header */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  More Features & Views
                </h3>
                <p className="font-mono text-[11px] text-slate-500">
                  Access complete analytics, custom lists, and sync settings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMoreSheetOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Navigation Cards Group */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              <button
                type="button"
                onClick={() => handleSelectTab('metrics')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-slate-900">
                      Performance Metrics
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      Holdings ROI, set distributions & gain trajectory
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTab === 'metrics' && (
                    <span className="font-mono text-[10px] font-bold text-[#DC143C] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('lists')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ListOrdered className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-slate-900">
                      Custom Lists & Want-Lists
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      Curate custom trade binders and wishlist targets
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTab === 'lists' && (
                    <span className="font-mono text-[10px] font-bold text-[#DC143C] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('search')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-slate-900">
                      Card Catalog & Search
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      Browse all Pokémon cards with market pricing
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTab === 'search' && (
                    <span className="font-mono text-[10px] font-bold text-[#DC143C] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('settings')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-slate-900">
                      App Settings & Cloud Sync
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      Currency, cloud snapshots, public link & account
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeTab === 'settings' && (
                    <span className="font-mono text-[10px] font-bold text-[#DC143C] bg-[#FFF0F3] px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              </button>
            </div>

            {/* Legal Information Group */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              <a
                href="/terms"
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span className="font-heading font-medium text-xs text-slate-700">
                    Terms of Service
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </a>

              <a
                href="/privacy"
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span className="font-heading font-medium text-xs text-slate-700">
                    Privacy Policy
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
