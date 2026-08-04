/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AccountTier,
  DisplayCurrency,
  Deck,
  CustomList,
  PortfolioCardEntry,
  PokemonCard,
  SearchFilters,
  TIER_LIMITS,
} from './types';
import {
  Layers,
  Plus,
  SlidersHorizontal,
  Boxes,
  Download,
  DollarSign,
  Zap,
} from 'lucide-react';
import {
  MOCK_CARDS,
  MOCK_SETS,
  INITIAL_DECKS,
  INITIAL_SOLD_ENTRIES,
  INITIAL_LISTS,
  INITIAL_ACTIVITIES,
} from './data/mockData';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { CardDetailModal } from './components/CardDetailModal';
import { QuickLookModal } from './components/QuickLookModal';
import { LimitReachedModal } from './components/LimitReachedModal';

import { CollectionView } from './views/CollectionView';
import { MetricsView } from './views/MetricsView';
import { DecksView } from './views/DecksView';
import { SearchView } from './views/SearchView';
import { SetsView } from './views/SetsView';
import { ListsView } from './views/ListsView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';
import { useAuth } from './lib/AuthContext';
import { initSearchEngine, searchCards, mapToPokemonCard, getAvailableSets } from './lib/searchEngine';
import { startFullCatalogBackgroundSync } from './lib/dataSyncEngine';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { user, profile, subscription, loading: authLoading } = useAuth();
  const [engineReady, setEngineReady] = useState(false);

  React.useEffect(() => {
    initSearchEngine().then(() => setEngineReady(true));
    startFullCatalogBackgroundSync();
  }, []);

  const allCards = React.useMemo(() => engineReady ? searchCards({}).slice(0, 300).map(mapToPokemonCard) : [], [engineReady]);
  const allSets = React.useMemo(() => engineReady ? getAvailableSets() : [], [engineReady]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('collection');

  // Account State
  const currentTier = subscription?.tierName || 'Starter';
  const displayCurrency = profile?.displayCurrency || 'USD';
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Stub functions for phase 1 components until they are connected
  const setDisplayCurrency = (c: DisplayCurrency) => {};
  const setCurrentTier = (t: AccountTier) => {};

  // Core Data Collections
  const [decks, setDecks] = useState<Deck[]>(INITIAL_DECKS);
  const [soldEntries, setSoldEntries] = useState<PortfolioCardEntry[]>(INITIAL_SOLD_ENTRIES);
  const [customLists, setCustomLists] = useState<CustomList[]>(INITIAL_LISTS);
  const [recentActivities, setRecentActivities] = useState(INITIAL_ACTIVITIES);

  // Persistent Search Filters
  const [savedFilters, setSavedFilters] = useState<SearchFilters>({
    query: '',
    types: [],
    rarities: [],
    sortBy: 'price-desc',
  });

  // Top Bar Action Signals
  const [createDeckSignal, setCreateDeckSignal] = useState(0);
  const [createListSignal, setCreateListSignal] = useState(0);
  const [toggleSearchFilterSignal, setToggleSearchFilterSignal] = useState(0);
  const [isSearchFilterOpen, setIsSearchFilterOpen] = useState(true);
  const [exportDataSignal, setExportDataSignal] = useState(0);

  const sectionMeta: Record<ActiveTab, { tag: string; title: string }> = {
    collection: { tag: 'Global Inventory', title: 'Global Collection' },
    metrics: { tag: 'Portfolio Analytics', title: 'Metrics & Performance' },
    decks: { tag: 'Deck Command', title: 'Decks & Binder Studio' },
    search: { tag: 'Card Discovery', title: 'Global Search' },
    sets: { tag: 'Expansion Index', title: 'Sets & Trackers' },
    lists: { tag: 'Unlimited Groups', title: 'Lists & Want-Lists' },
    settings: { tag: 'System Specs', title: 'Settings & Specs' },
  };

  // Modal States
  const [selectedDetailCard, setSelectedDetailCard] = useState<PokemonCard | null>(null);
  const [quickLookCard, setQuickLookCard] = useState<PokemonCard | null>(null);
  const [quickLookCardList, setQuickLookCardList] = useState<PokemonCard[]>(MOCK_CARDS);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [targetDeckIdForView, setTargetDeckIdForView] = useState<string | undefined>(undefined);

  // Limit Hit Modal State
  const [limitModalConfig, setLimitModalConfig] = useState<{
    isOpen: boolean;
    action: 'CREATE_DECK' | 'ADD_CARD_TO_DECK' | 'SHARE_PUBLIC_LINK';
    details?: any;
  }>({
    isOpen: false,
    action: 'CREATE_DECK',
  });

  // Trigger brief background sync indicator pulse
  const triggerSyncPulse = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  // Deck Management Handlers
  const handleCreateDeck = (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {
    triggerSyncPulse();
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      ...deckData,
      entries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDecks([newDeck, ...decks]);
    setRecentActivities([
      {
        id: `act-${Date.now()}`,
        type: 'DECK_CREATED',
        title: `Created "${newDeck.name}"`,
        subtitle: `New deck configured with color ${newDeck.colorHex}`,
        timestamp: new Date().toISOString(),
      },
      ...recentActivities,
    ]);
  };

  const handleUpdateDeck = (updatedDeck: Deck) => {
    triggerSyncPulse();
    setDecks(decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d)));
  };

  const handleDeleteDeck = (deckId: string) => {
    triggerSyncPulse();
    setDecks(decks.filter((d) => d.id !== deckId));
  };

  const handleSplitDeckGroup = (
    sourceDeckId: string,
    cardIdsToSplit: string[],
    newDeckName: string
  ) => {
    triggerSyncPulse();
    const sourceDeck = decks.find((d) => d.id === sourceDeckId);
    if (!sourceDeck) return;

    const entriesToMove = sourceDeck.entries.filter((e) => cardIdsToSplit.includes(e.cardId));
    const remainingEntries = sourceDeck.entries.filter((e) => !cardIdsToSplit.includes(e.cardId));

    const newSplitDeck: Deck = {
      id: `deck-split-${Date.now()}`,
      name: newDeckName,
      description: `Split group from ${sourceDeck.name}`,
      colorHex: sourceDeck.colorHex,
      isPublic: false,
      entries: entriesToMove,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDecks([
      newSplitDeck,
      ...decks.map((d) => (d.id === sourceDeckId ? { ...d, entries: remainingEntries } : d)),
    ]);
  };

  const handleAddCardToDeck = (
    deckId: string,
    entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'>,
    mode: 'increment' | 'separate'
  ) => {
    triggerSyncPulse();
    setDecks(
      decks.map((deck) => {
        if (deck.id !== deckId) return deck;

        if (mode === 'increment') {
          const existing = deck.entries.find(
            (e) => !e.isSold && e.cardId === entryData.cardId && e.condition === entryData.condition
          );

          if (existing) {
            return {
              ...deck,
              entries: deck.entries.map((e) =>
                e.id === existing.id ? { ...e, quantity: e.quantity + entryData.quantity } : e
              ),
              updatedAt: new Date().toISOString(),
            };
          }
        }

        const newEntry: PortfolioCardEntry = {
          id: `entry-${Date.now()}`,
          ...entryData,
          isSold: false,
        };

        return {
          ...deck,
          entries: [...deck.entries, newEntry],
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setRecentActivities([
      {
        id: `act-${Date.now()}`,
        type: 'ADDED',
        title: `Added ${entryData.card.name}`,
        subtitle: `Added to deck`,
        timestamp: new Date().toISOString(),
        amount: entryData.purchasePrice,
        currency: entryData.purchaseCurrency,
        cardImage: entryData.card.images.small,
      },
      ...recentActivities,
    ]);
  };

  const handleMarkCardSold = (
    deckId: string,
    entryId: string,
    saleDetails: {
      salePrice: number;
      saleCurrency: DisplayCurrency;
      saleDate: string;
      salePlatform: string;
    }
  ) => {
    triggerSyncPulse();
    let soldItem: PortfolioCardEntry | null = null;

    setDecks(
      decks.map((deck) => {
        if (deck.id !== deckId) return deck;
        return {
          ...deck,
          entries: deck.entries.map((e) => {
            if (e.id === entryId) {
              soldItem = {
                ...e,
                isSold: true,
                ...saleDetails,
              };
              return soldItem;
            }
            return e;
          }),
        };
      })
    );

    if (soldItem) {
      setSoldEntries([soldItem, ...soldEntries]);
      setRecentActivities([
        {
          id: `act-${Date.now()}`,
          type: 'SOLD',
          title: `Sold ${(soldItem as PortfolioCardEntry).card.name}`,
          subtitle: `Sold via ${saleDetails.salePlatform}`,
          timestamp: new Date().toISOString(),
          amount: saleDetails.salePrice,
          currency: saleDetails.saleCurrency,
          cardImage: (soldItem as PortfolioCardEntry).card.images.small,
        },
        ...recentActivities,
      ]);
    }
  };

  // Custom List Handlers
  const handleCreateList = (listData: Omit<CustomList, 'id' | 'createdAt'>) => {
    triggerSyncPulse();
    const newList: CustomList = {
      id: `list-${Date.now()}`,
      ...listData,
      createdAt: new Date().toISOString(),
    };
    setCustomLists([...customLists, newList]);
  };

  const handleDeleteList = (listId: string) => {
    triggerSyncPulse();
    setCustomLists(customLists.filter((l) => l.id !== listId));
  };

  const handleAddCardToList = (listId: string, cardId: string) => {
    triggerSyncPulse();
    setCustomLists(
      customLists.map((l) =>
        l.id === listId && !l.cardIds.includes(cardId)
          ? { ...l, cardIds: [...l.cardIds, cardId] }
          : l
      )
    );
  };

  const handleRemoveCardFromList = (listId: string, cardId: string) => {
    triggerSyncPulse();
    setCustomLists(
      customLists.map((l) =>
        l.id === listId ? { ...l, cardIds: l.cardIds.filter((id) => id !== cardId) } : l
      )
    );
  };

  if (authLoading || !engineReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-dot-grid bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#DC143C]" />
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dot-grid text-[#0F172A] select-none">
      {/* Sidebar Navigation (Static Locked, 2 Solid Dividers) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTier={currentTier}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isSyncing={isSyncing}
      />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Panel Top Header Bar (Continuously aligns with Sidebar's top border line) */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex-shrink-0 z-20 shadow-xs">
          {/* Left: Section Header Tag & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-mono text-[11px] font-bold text-[#DC143C] uppercase tracking-wider bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#DC143C]/20 flex-shrink-0">
              {sectionMeta[activeTab].tag}
            </span>
            <span className="text-[#CBD5E1] font-mono text-sm flex-shrink-0">/</span>
            <h1 className="font-heading font-bold text-lg text-[#0F172A] truncate">
              {sectionMeta[activeTab].title}
            </h1>
          </div>

          {/* Right: Symmetrical Inline Actions & Status Badges */}
          <div className="flex items-center gap-2.5 font-mono text-xs flex-shrink-0">
            {activeTab === 'collection' && (
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="h-9 px-3.5 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#DC143C]" />
                <span>Add Cards to Portfolio</span>
              </button>
            )}

            {activeTab === 'metrics' && (
              <button
                type="button"
                onClick={() => setActiveTab('collection')}
                className="h-9 px-3.5 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#DC143C]" />
                <span>View Inventory</span>
              </button>
            )}

            {activeTab === 'decks' && (
              <button
                type="button"
                onClick={() => setCreateDeckSignal((s) => s + 1)}
                className="h-9 px-3.5 bg-[#DC143C] text-white hover:bg-[#B01030] flex items-center gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  Create New Deck ({decks.length}/
                  {TIER_LIMITS[currentTier].maxDecks === Infinity
                    ? '∞'
                    : TIER_LIMITS[currentTier].maxDecks}
                  )
                </span>
              </button>
            )}

            {activeTab === 'search' && (
              <button
                type="button"
                onClick={() => setToggleSearchFilterSignal((s) => s + 1)}
                className="h-9 px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#DC143C] flex items-center gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#DC143C]" />
                <span>{isSearchFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
              </button>
            )}

            {activeTab === 'sets' && (
              <div className="h-9 px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] flex items-center gap-2 text-xs font-mono font-bold rounded-md shadow-xs">
                <Boxes className="w-4 h-4 text-[#DC143C]" />
                <span>{MOCK_SETS.length} Sets Tracked</span>
              </div>
            )}

            {activeTab === 'lists' && (
              <button
                type="button"
                onClick={() => setCreateListSignal((s) => s + 1)}
                className="h-9 px-3.5 bg-[#DC143C] text-white hover:bg-[#B01030] flex items-center gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Custom List</span>
              </button>
            )}

            {activeTab === 'settings' && (
              <button
                type="button"
                onClick={() => setExportDataSignal((s) => s + 1)}
                className="h-9 px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#DC143C] flex items-center gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#DC143C]" />
                <span>Export Collection Data</span>
              </button>
            )}

            {/* Valuation and Tier Badges - Identical Height (h-9) & Symmetric */}
            <div className="h-9 px-3 bg-white border border-[#E2E8F0] text-[#0F172A] font-mono text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>Valuation: {displayCurrency}</span>
            </div>

            <div className="h-9 px-3 bg-[#0F172A] text-white font-mono text-xs font-bold rounded-md flex items-center gap-1.5 shadow-xs">
              <Zap className="w-3.5 h-3.5 text-[#FFD700]" />
              <span>Tier: {currentTier}</span>
            </div>
          </div>
        </header>

        {/* Scrollable View Area (Infinite Scrolling inside Panel) */}
        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'collection' && (
            <CollectionView
              decks={decks}
              allCards={MOCK_CARDS}
              currency={displayCurrency}
              customLists={customLists}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(MOCK_CARDS);
              }}
              onSelectDeck={(deckId) => {
                setTargetDeckIdForView(deckId);
                setActiveTab('decks');
              }}
              onAddCardToDeck={handleAddCardToDeck}
            />
          )}

          {activeTab === 'metrics' && (
            <MetricsView
              decks={decks}
              soldEntries={soldEntries}
              currency={displayCurrency}
              recentActivities={recentActivities}
              allCards={MOCK_CARDS}
              onSelectDeck={(deckId) => {
                setTargetDeckIdForView(deckId);
                setActiveTab('decks');
              }}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onNavigateToDecks={() => setActiveTab('decks')}
            />
          )}

          {activeTab === 'decks' && (
            <DecksView
              decks={decks}
              currentTier={currentTier}
              currency={displayCurrency}
              onCreateDeck={handleCreateDeck}
              onUpdateDeck={handleUpdateDeck}
              onDeleteDeck={handleDeleteDeck}
              onSplitDeckGroup={handleSplitDeckGroup}
              onMarkCardSold={handleMarkCardSold}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(MOCK_CARDS);
              }}
              onTriggerLimitModal={(action, details) =>
                setLimitModalConfig({ isOpen: true, action, details })
              }
              initialSelectedDeckId={targetDeckIdForView}
              createDeckSignal={createDeckSignal}
            />
          )}

          {activeTab === 'search' && (
            <SearchView
              sets={MOCK_SETS}
              currency={displayCurrency}
              savedFilters={savedFilters}
              onUpdateFilters={setSavedFilters}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(MOCK_CARDS);
              }}
              toggleFilterSignal={toggleSearchFilterSignal}
              onFilterStateChange={setIsSearchFilterOpen}
            />
          )}

          {activeTab === 'sets' && (
            <SetsView
              sets={MOCK_SETS}
              cards={MOCK_CARDS}
              decks={decks}
              currency={displayCurrency}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(MOCK_CARDS);
              }}
            />
          )}

          {activeTab === 'lists' && (
            <ListsView
              lists={customLists}
              cards={MOCK_CARDS}
              currency={displayCurrency}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onRemoveCardFromList={handleRemoveCardFromList}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(MOCK_CARDS);
              }}
              createListSignal={createListSignal}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currency={displayCurrency}
              onSelectCurrency={setDisplayCurrency}
              currentTier={currentTier}
              onChangeTier={(t) => {
                setCurrentTier(t);
                triggerSyncPulse();
              }}
              decks={decks}
              soldEntries={soldEntries}
              exportDataSignal={exportDataSignal}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        cards={MOCK_CARDS}
        decks={decks}
        sets={MOCK_SETS}
        onSelectCard={(card) => setSelectedDetailCard(card)}
        onSelectDeck={(deckId) => {
          setTargetDeckIdForView(deckId);
          setActiveTab('decks');
        }}
        onNavigate={(tab) => setActiveTab(tab)}
      />

      <CardDetailModal
        card={selectedDetailCard}
        onClose={() => setSelectedDetailCard(null)}
        decks={decks}
        lists={customLists}
        currency={displayCurrency}
        onAddCardToDeck={handleAddCardToDeck}
        onAddCardToList={handleAddCardToList}
      />

      <QuickLookModal
        card={quickLookCard}
        cardList={quickLookCardList}
        onClose={() => setQuickLookCard(null)}
        onNavigateCard={(c) => setQuickLookCard(c)}
        currency={displayCurrency}
      />

      <LimitReachedModal
        isOpen={limitModalConfig.isOpen}
        onClose={() => setLimitModalConfig({ ...limitModalConfig, isOpen: false })}
        currentTier={currentTier}
        attemptedAction={limitModalConfig.action}
        attemptedDetails={limitModalConfig.details}
        onUpgradeToTier={(tier) => {
          setCurrentTier(tier);
          triggerSyncPulse();
        }}
      />
    </div>
  );
}
