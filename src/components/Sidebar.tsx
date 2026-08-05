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
  Database,
} from 'lucide-react';
import { AccountTier } from '../types';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { subscribeToSyncProgress, SyncProgressState } from '../lib/dataSyncEngine';

export type ActiveTab = 'collection' | 'metrics' | 'decks' | 'search' | 'sets' | 'lists' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentTier: AccountTier;
  onOpenCommandPalette: () => void;
  isSyncing?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentTier,
  onOpenCommandPalette,
  isSyncing = false,
}) => {
  const { user, profile } = useAuth();
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
    { id: 'search', label: 'Search', icon: Search },
    { id: 'sets', label: 'Sets', icon: BookOpen },
    { id: 'lists', label: 'Lists', icon: ListOrdered },
  ];

  const handleSignOut = () => {
    auth.signOut();
  };

  const displayName = user?.displayName || profile?.displayName || user?.email?.split('@')[0] || 'Collector';
  const avatarUrl = user?.photoURL || profile?.avatar || '';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-[#E2E8F0] flex flex-col h-screen select-none">
      {/* 1. Header Section with Locked Horizontal Across Line */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#E2E8F0] flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 chamfer-corner-sm bg-gradient-to-br from-[#DC143C] to-[#B01030] flex items-center justify-center text-white font-heading font-bold text-sm shadow-sm">
            DD
          </div>
          <div>
            <h1 className="font-heading font-bold text-sm text-[#0F172A] leading-none tracking-tight">
              DECK DIVIDER
            </h1>
            <p className="font-mono text-[9px] text-[#64748B] mt-0.5 font-semibold">
              PANEL SYSTEM MK6
            </p>
          </div>
        </div>
      </div>

      {/* 2. Middle Scrollable Nav List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Quick Search Shortcut Trigger */}
        <button
          type="button"
          onClick={onOpenCommandPalette}
          className="w-full flex items-center justify-between px-3 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all text-xs font-mono group chamfer-corner-sm"
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

        {/* Navigation Tabs (Sidebar Redirects) */}
        <div>
          <span className="font-mono text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider px-2 block mb-2">
            System Redirects
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as ActiveTab)}
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
      <div className="p-4 border-t border-[#E2E8F0] space-y-3 flex-shrink-0 bg-white">
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3.5 py-2 text-xs font-mono font-semibold transition-all duration-200 border chamfer-corner-sm ${
            activeTab === 'settings'
              ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C] font-bold shadow-sm'
              : 'bg-transparent text-[#64748B] border-transparent hover:bg-[#F8FAFC] hover:text-[#0F172A]'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>System Settings</span>
        </button>

        <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] chamfer-corner-sm">
          <div className="flex items-center gap-2.5 min-w-0">
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
                <span className="font-mono text-[9px] text-[#64748B]">
                  Tier
                </span>
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
    </aside>
  );
};
