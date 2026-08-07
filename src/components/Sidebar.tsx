import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Search,
  BookOpen,
  ListOrdered,
  Settings as SettingsIcon,
  Command,
  LogOut,
  TrendingUp,
  Package,
  ShieldCheck,
  ChevronRight,
  X,
} from 'lucide-react';
import { AccountTier } from '../types';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { subscribeToSyncProgress, SyncProgressState } from '../lib/dataSyncEngine';
import { DeckDividerBrand, DeckDividersIcon } from './DeckDividerBrand';

export type ActiveTab =
  | 'collection'
  | 'metrics'
  | 'decks'
  | 'sealed_vault'
  | 'psa_verify'
  | 'search'
  | 'sets'
  | 'lists'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentTier: AccountTier;
  onOpenCommandPalette: () => void;
  isSyncing?: boolean;
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentTier,
  onOpenCommandPalette,
  isSyncing = false,
  isCollapsed: propIsCollapsed,
  setIsCollapsed: propSetIsCollapsed,
  isMobileOpen: propIsMobileOpen,
  setIsMobileOpen: propSetIsMobileOpen,
}) => {
  const { user, profile } = useAuth();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isCollapsed = propIsCollapsed ?? internalCollapsed;
  const setIsCollapsed = propSetIsCollapsed ?? setInternalCollapsed;

  const isMobileOpen = propIsMobileOpen ?? internalMobileOpen;
  const setIsMobileOpen = propSetIsMobileOpen ?? setInternalMobileOpen;

  const [syncState, setSyncState] = useState<SyncProgressState>({
    isSyncing: false,
    progress: 100,
    message: 'Local IndexedDB Active',
    cardCount: 0,
    expansionCount: 0,
  });

  useEffect(() => {
    const unsubscribe = subscribeToSyncProgress((state) => {
      setSyncState(state);
    });
    return unsubscribe;
  }, []);

  const navItems = [
    { id: 'collection', label: 'Collection', icon: LayoutDashboard },
    { id: 'metrics', label: 'Metrics', icon: TrendingUp },
    { id: 'decks', label: 'Decks', icon: Layers },
    { id: 'sealed_vault', label: 'Sealed Vault', icon: Package },
    { id: 'psa_verify', label: 'Cert & Pop Report', icon: ShieldCheck },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'sets', label: 'Sets', icon: BookOpen },
    { id: 'lists', label: 'Lists', icon: ListOrdered },
  ];

  const handleSignOut = () => {
    auth.signOut();
  };

  const displayName = user?.displayName || profile?.displayName || user?.email?.split('@')[0] || 'Collector';
  const avatarUrl = profile?.avatar || user?.photoURL || user?.providerData?.find(p => p.photoURL)?.photoURL || '';
  const initials = displayName.substring(0, 2).toUpperCase();

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-950/60 z-[60] md:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Main Sidebar Component */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-[70] flex flex-col h-screen bg-white border-r border-[#E2E8F0] select-none transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-72 max-w-[85vw] md:w-64'
        } ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* 1. Header Section - Height exactly h-16 to perfectly align inline with Top Bar */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-[#E2E8F0] flex-shrink-0 bg-[#F8FAFC]">
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full">
              {/* Wordmark functions directly as drawer opener and closer */}
              <DeckDividerBrand
                size="sm"
                collapsed={false}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setIsMobileOpen(false);
                  } else {
                    setIsCollapsed(true);
                  }
                }}
              />
            </div>
          ) : (
            <div className="w-full flex items-center justify-center">
              {/* Collapsed wordmark displays "D / d" and expands drawer on click */}
              <DeckDividerBrand
                size="sm"
                collapsed={true}
                onClick={() => setIsCollapsed(false)}
              />
            </div>
          )}
        </div>

        {/* 2. Middle Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {/* Quick Search Shortcut Trigger */}
          {!isCollapsed ? (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all text-xs font-mono group chamfer-corner-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-[#64748B] group-hover:text-[#DC143C] transition-colors" />
                <span>Quick Find...</span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-[#E2E8F0] px-1.5 py-0.5 rounded-md text-[10px] font-num text-[#0F172A]">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="w-10 h-10 mx-auto flex items-center justify-center bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#DC143C] hover:border-[#DC143C] transition-all rounded-lg group"
              title="Quick Find (Cmd + K)"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Items */}
          <div>
            {!isCollapsed && (
              <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 block mb-2">
                System Redirects
              </span>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (isCollapsed) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id as ActiveTab)}
                      title={item.label}
                      className={`w-10 h-10 mx-auto flex items-center justify-center text-xs font-mono font-semibold transition-all duration-200 border rounded-lg ${
                        isActive
                          ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C] font-bold shadow-xs'
                          : 'bg-transparent text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? 'text-[#DC143C]' : 'text-[#64748B]'
                        }`}
                      />
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavClick(item.id as ActiveTab)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono font-semibold transition-all duration-200 border chamfer-corner-sm ${
                      isActive
                        ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C] font-bold shadow-sm'
                        : 'bg-transparent text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#DC143C]' : 'text-[#64748B]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 3. Footer Settings & Account */}
        <div className="p-3 border-t border-[#E2E8F0] flex-shrink-0 bg-white">
          {!isCollapsed ? (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleNavClick('settings')}
                className={`w-full flex items-center gap-3 px-3.5 py-2 text-xs font-mono font-semibold transition-all duration-200 border chamfer-corner-sm ${
                  activeTab === 'settings'
                    ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C] font-bold shadow-sm'
                    : 'bg-transparent text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                <span>System Settings</span>
              </button>

              <div className="flex items-center justify-between p-2 bg-[#F8FAFC] border border-[#E2E8F0] chamfer-corner-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex-shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-7 h-7 rounded-full object-cover border border-[#CBD5E1]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-heading font-bold text-xs">
                        {initials}
                      </div>
                    )}
                    <div
                      title={isSyncing ? 'Background server sync in progress' : 'Synced'}
                      className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                        isSyncing ? 'bg-[#DC143C] animate-sync-pulse' : 'bg-[#16A34A]'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-semibold text-xs text-[#0F172A] truncate">
                      {displayName}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block rounded-md px-1.5 py-0.2 text-[9px] font-mono font-bold bg-[#0F172A] text-white">
                        {currentTier}
                      </span>
                      <span className="font-mono text-[9px] text-[#64748B]">Tier</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-1.5 text-[#64748B] hover:text-[#DC143C] hover:bg-[#FFF0F3] rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => handleNavClick('settings')}
                title="System Settings"
                className={`w-10 h-10 flex items-center justify-center text-xs font-mono font-semibold transition-all duration-200 border rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C] font-bold shadow-xs'
                    : 'bg-transparent text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
              </button>

              <div
                className="relative group cursor-pointer"
                onClick={() => handleNavClick('settings')}
                title={`${displayName} (${currentTier} Tier)`}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-heading font-bold text-xs">
                    {initials}
                  </div>
                )}
                <div
                  title={isSyncing ? 'Syncing...' : 'Synced'}
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-white ${
                    isSyncing ? 'bg-[#DC143C] animate-sync-pulse' : 'bg-[#16A34A]'
                  }`}
                />
              </div>

              <button
                onClick={handleSignOut}
                className="p-1.5 text-[#64748B] hover:text-[#DC143C] hover:bg-[#FFF0F3] rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
