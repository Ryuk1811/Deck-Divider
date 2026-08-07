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
  CardSet,
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
  Menu,
} from 'lucide-react';
import { initForexMetronome } from './utils/forexMetronome';
import {
  MOCK_CARDS,
  MOCK_SETS,
  INITIAL_DECKS,
  INITIAL_SOLD_ENTRIES,
  INITIAL_LISTS,
  INITIAL_ACTIVITIES,
} from './data/mockData';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DeckDividerBrand } from './components/DeckDividerBrand';
import { CommandPalette } from './components/CommandPalette';
import { CardDetailModal } from './components/CardDetailModal';
import { QuickLookModal } from './components/QuickLookModal';
import { LimitReachedModal } from './components/LimitReachedModal';
import { PayPalSubscriptionModal } from './components/PayPalSubscriptionModal';
import { PayPalSuccessModal } from './components/PayPalSuccessModal';
import { PayPalCancelModal } from './components/PayPalCancelModal';

import { CollectionView } from './views/CollectionView';
import { MetricsView } from './views/MetricsView';
import { DecksView } from './views/DecksView';
import { SearchView } from './views/SearchView';
import { SetsView } from './views/SetsView';
import { ListsView } from './views/ListsView';
import { SettingsView } from './views/SettingsView';
import { AuthView } from './views/AuthView';
import { SealedPortfolioManager } from './components/SealedPortfolioManager';
import { PSACertVerifier } from './components/PSACertVerifier';
import { PortfolioSealedEntry, GradingInfo, PSAPopReport } from './types';
import { useAuth } from './lib/AuthContext';
import { initSearchEngine, searchCards, mapToPokemonCard, getAvailableSets } from './lib/searchEngine';
import { startFullCatalogBackgroundSync, getExpansionsCatalog } from './lib/dataSyncEngine';
import { idbGetSealedVault, idbSaveSealedVault } from './lib/indexedDB';
import { Loader2 } from 'lucide-react';
import { db, auth } from './lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function App() {
  const { user, profile, subscription, loading: authLoading, refreshSubscription } = useAuth();
  const [engineReady, setEngineReady] = useState(false);
  const [liveSets, setLiveSets] = useState<CardSet[]>([]);

  React.useEffect(() => {
    initSearchEngine().then(() => setEngineReady(true));
    getExpansionsCatalog().then((sets) => {
      if (sets && sets.length > 0) setLiveSets(sets);
    });
    startFullCatalogBackgroundSync();
  }, []);

  const allCards = React.useMemo(
    () => (engineReady ? searchCards({}).slice(0, 300).map(mapToPokemonCard) : []),
    [engineReady]
  );
  const allSets = React.useMemo(
    () => (liveSets.length > 0 ? liveSets : engineReady ? getAvailableSets() : []),
    [engineReady, liveSets]
  );
  const effectiveCards = allCards.length > 0 ? allCards : MOCK_CARDS;

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('collection');

  // Account State & Currency Configuration
  const currentTier = subscription?.tierName || 'Starter';
  const [selectedCurrency, setSelectedCurrency] = useState<DisplayCurrency>(() => {
    return (localStorage.getItem('displayCurrency') as DisplayCurrency) || profile?.displayCurrency || 'USD';
  });
  
  const displayCurrency = selectedCurrency;

  const setDisplayCurrency = (c: DisplayCurrency) => {
    setSelectedCurrency(c);
    localStorage.setItem('displayCurrency', c);
    triggerSyncPulse();
  };

  const [isSyncing, setIsSyncing] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState<{
    clientId: string;
    mode: string;
    planIds: Record<string, string>;
  } | null>(null);
  const [paypalModalTier, setPaypalModalTier] = useState<AccountTier | null>(null);
  const [paypalSuccessData, setPaypalSuccessData] = useState<{ tier: AccountTier; subId: string } | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isLaunchingPayPal, setIsLaunchingPayPal] = useState(false);

  React.useEffect(() => {
    fetch('/api/billing/paypal-config')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.planIds) {
          setPaypalConfig(data);
        }
      })
      .catch((err) => console.warn('Failed to load PayPal config:', err));
  }, []);

  const handleApproveSubscription = async (subscriptionId: string, tier: AccountTier) => {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('/api/billing/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscriptionId, tier }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to process subscription');
    }
    await refreshSubscription();
    setPaypalSuccessData({ tier, subId: subscriptionId });
  };

  const handleChangeTier = async (newTier: AccountTier) => {
    if (!user) return alert("Must be logged in to upgrade");
    triggerSyncPulse();

    if (newTier === 'Starter') {
      window.open('https://www.paypal.com/myaccount/autopay/', '_blank');
      alert("To cancel your active subscription or manage recurring billing, visit your PayPal dashboard.");
      return;
    }

    setPaypalModalTier(newTier);
  };

  // HANDLE POP-UP MESSAGES AND REDIRECTS
  React.useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'PAYPAL_SUCCESS') {
        const { subscriptionId, tier } = event.data;
        const targetTier: AccountTier = tier || 'Bunch';
        const targetSubId = subscriptionId || 'LIVE_APPROVED_' + Date.now();
        await handleApproveSubscription(targetSubId, targetTier);
      } else if (event.data?.type === 'PAYPAL_CANCEL') {
        setIsCancelModalOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);

    const urlParams = new URLSearchParams(window.location.search);
    const paypalSuccess = urlParams.get('paypal_success') === 'true' || urlParams.has('subscription_id') || urlParams.has('ba_token');
    const paypalCancel = urlParams.get('paypal_cancel') === 'true';
    const rawSubId = urlParams.get('subscription_id') || 
                     urlParams.get('subscriptionId') || 
                     urlParams.get('ba_token') || 
                     urlParams.get('token');
    const rawTier = (urlParams.get('tier') || 'Bunch') as AccountTier;

    // Inside popup window: notify opener and close self
    if (window.opener && !window.opener.closed) {
      if (paypalSuccess) {
        try {
          window.opener.postMessage({ 
            type: 'PAYPAL_SUCCESS', 
            subscriptionId: rawSubId, 
            tier: rawTier 
          }, '*');
          window.close();
          return;
        } catch (e) {
          console.warn('postMessage to window.opener failed:', e);
        }
      }
      if (paypalCancel) {
        try {
          window.opener.postMessage({ type: 'PAYPAL_CANCEL' }, '*');
          window.close();
          return;
        } catch (e) {
          console.warn('postMessage to window.opener failed:', e);
        }
      }
    }

    // Direct window processing (when user is ready)
    if (paypalSuccess) {
      if (user) {
        const targetSubId = rawSubId || 'LIVE_APPROVED_' + Date.now();
        handleApproveSubscription(targetSubId, rawTier);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (paypalCancel) {
      setIsCancelModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [user]);

  const setCurrentTier = (t: AccountTier) => {};

  // Initialize 4-times-a-day forex metronome timer
  React.useEffect(() => {
    initForexMetronome();
  }, []);


  React.useEffect(() => {
    if (!user) {
      setDecks(INITIAL_DECKS);
      setSoldEntries(INITIAL_SOLD_ENTRIES);
      setCustomLists(INITIAL_LISTS);
      return;
    }
    const unsubDecks = onSnapshot(collection(db, 'users', user.uid, 'decks'), (snap) => {
      const liveDecks = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setDecks(liveDecks.length > 0 ? liveDecks : INITIAL_DECKS);
    });
    return () => {
      unsubDecks();
    };
  }, [user]);

  // Core Data Collections
  const [decks, setDecks] = useState<Deck[]>(INITIAL_DECKS);
  const [soldEntries, setSoldEntries] = useState<PortfolioCardEntry[]>(INITIAL_SOLD_ENTRIES);
  const [customLists, setCustomLists] = useState<CustomList[]>(INITIAL_LISTS);
  const [recentActivities, setRecentActivities] = useState(INITIAL_ACTIVITIES);
  const [sealedEntries, setSealedEntries] = useState<PortfolioSealedEntry[]>([]);

  // Load sealed entries from IndexedDB on initial mount
  React.useEffect(() => {
    idbGetSealedVault().then((saved) => {
      if (saved && saved.length > 0) {
        setSealedEntries(saved);
      }
    });
  }, []);

  // Sync sealed entries to IndexedDB on change
  React.useEffect(() => {
    if (sealedEntries.length > 0) {
      idbSaveSealedVault(sealedEntries);
    }
  }, [sealedEntries]);

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
  const [exportDataSignal, setExportDataSignal] = useState(0);

  // Responsive Collapsible Sidebar States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const sectionMeta: Record<ActiveTab, { tag: string; title: string }> = {
    collection: { tag: 'Global Inventory', title: 'Global Collection' },
    metrics: { tag: 'Portfolio Analytics', title: 'Metrics & Performance' },
    decks: { tag: 'Deck Command', title: 'Decks & Binder Studio' },
    sealed_vault: { tag: 'Vault Inventory', title: 'Sealed Product Vault' },
    psa_verify: { tag: 'Cert & Pop Hub', title: 'Grading Cert & Pop Report' },
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
  
  const handleCreateDeck = async (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {
    triggerSyncPulse();
    if (user) {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(deckData)
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to create deck');
      }
    } else {
      const newDeck: Deck = {
        id: `deck-${Date.now()}`,
        ...deckData,
        entries: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDecks([newDeck, ...decks]);
    }
  };



  
  const handleUpdateDeck = (updatedDeck: Deck) => {
    setDecks(prev => prev.map(d => d.id === updatedDeck.id ? updatedDeck : d));
    triggerSyncPulse();
  };

  const handleDeleteDeck = (deckId: string) => {
    triggerSyncPulse();
    setDecks(decks.filter((d) => d.id !== deckId));
  };

  
  const handleSplitDeckGroup = async (
    sourceDeckId: string,
    cardIdsToSplit: string[],
    newDeckName: string
  ) => {
    triggerSyncPulse();
    if (user) {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch(`/api/decks/${sourceDeckId}/split`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ cardIdsToSplit, newDeckName })
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to split deck');
      }
    } else {
      // Local fallback
      const sourceDeck = decks.find((d) => d.id === sourceDeckId);
      if (!sourceDeck) return;
      const entriesToMove = sourceDeck.entries.filter((e) => cardIdsToSplit.includes(e.cardId));
      const remainingEntries = sourceDeck.entries.filter((e) => !cardIdsToSplit.includes(e.cardId));
      const newSplitDeck: Deck = {
        id: `deck-split-${Date.now()}`,
        name: newDeckName,
        description: `Split group from ${sourceDeck.name}`,
        colorHex: sourceDeck.colorHex,
        isPublic: sourceDeck.isPublic,
        entries: entriesToMove,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDecks([
        ...decks.map((d) => (d.id === sourceDeckId ? { ...d, entries: remainingEntries } : d)),
        newSplitDeck,
      ]);
    }
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
      {/* Sidebar Navigation (Collapsible Desktop Rail & Mobile Drawer) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentTier={currentTier}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isSyncing={isSyncing}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Panel Top Header Bar (Continuously aligns with Sidebar's top border line h-16) */}
        <header className="h-16 flex items-center justify-between px-3 md:px-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex-shrink-0 z-20 shadow-xs gap-2">
          {/* Left: Mobile Drawer Trigger + Section Header Tag & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <DeckDividerBrand
              size="xs"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="md:hidden flex-shrink-0 cursor-pointer mr-1"
            />
            <span className="hidden sm:inline-flex font-mono text-[11px] font-bold text-[#DC143C] uppercase tracking-wider bg-[#FFF0F3] px-2.5 py-1 rounded-md border border-[#DC143C]/20 flex-shrink-0">
              {sectionMeta[activeTab].tag}
            </span>
            <span className="hidden sm:inline text-[#CBD5E1] font-mono text-sm flex-shrink-0">/</span>
            <h1 className="font-heading font-bold text-sm sm:text-base md:text-lg text-[#0F172A] truncate">
              {sectionMeta[activeTab].title}
            </h1>
          </div>

          {/* Right: Symmetrical Inline Actions & Status Badges */}
          <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
            {activeTab === 'collection' && (
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C]" />
                <span className="hidden sm:inline">Add Cards to Portfolio</span>
                <span className="sm:hidden text-[11px]">Add Cards</span>
              </button>
            )}

            {activeTab === 'metrics' && (
              <button
                type="button"
                onClick={() => setActiveTab('collection')}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#0F172A] text-white hover:bg-[#1E293B] flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C]" />
                <span className="hidden sm:inline">View Inventory</span>
                <span className="sm:hidden text-[11px]">Inventory</span>
              </button>
            )}

            {activeTab === 'decks' && (
              <button
                type="button"
                onClick={() => setCreateDeckSignal((s) => s + 1)}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#DC143C] text-white hover:bg-[#B01030] flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">
                  Create New Deck ({decks.length}/
                  {TIER_LIMITS[currentTier].maxDecks === Infinity
                    ? '∞'
                    : TIER_LIMITS[currentTier].maxDecks}
                  )
                </span>
                <span className="sm:hidden text-[11px]">New Deck</span>
              </button>
            )}

            {activeTab === 'sets' && (
              <div className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono font-bold rounded-md shadow-xs">
                <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C]" />
                <span>{allSets.length} Sets</span>
              </div>
            )}

            {activeTab === 'lists' && (
              <button
                type="button"
                onClick={() => setCreateListSignal((s) => s + 1)}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-[#DC143C] text-white hover:bg-[#B01030] flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Custom List</span>
                <span className="sm:hidden text-[11px]">New List</span>
              </button>
            )}

            {activeTab === 'settings' && (
              <button
                type="button"
                onClick={() => setExportDataSignal((s) => s + 1)}
                className="h-8 sm:h-9 px-2.5 sm:px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#DC143C] flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold rounded-md transition-all shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C]" />
                <span className="hidden sm:inline">Export Collection Data</span>
                <span className="sm:hidden text-[11px]">Export</span>
              </button>
            )}
          </div>
        </header>

        {/* Scrollable View Area (Infinite Scrolling inside Panel) */}
        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'collection' && (
            <CollectionView
              decks={decks}
              allCards={effectiveCards}
              currency={displayCurrency}
              customLists={customLists}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(effectiveCards);
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
              customLists={customLists}
              currency={displayCurrency}
              recentActivities={recentActivities}
              allCards={effectiveCards}
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
                setQuickLookCardList(effectiveCards);
              }}
              onTriggerLimitModal={(action, details) =>
                setLimitModalConfig({ isOpen: true, action, details })
              }
              initialSelectedDeckId={targetDeckIdForView}
              createDeckSignal={createDeckSignal}
            />
          )}

          {activeTab === 'sealed_vault' && (
            <div className="app-view-container space-y-6">
              <SealedPortfolioManager
                entries={sealedEntries}
                currency={displayCurrency}
                availableSets={liveSets}
                onAddSealedEntry={(entry) => setSealedEntries((prev) => [entry, ...prev])}
                onDeleteSealedEntry={(id) => setSealedEntries((prev) => prev.filter((e) => e.id !== id))}
                onMarkSoldSealedEntry={(id, salePrice) =>
                  setSealedEntries((prev) =>
                    prev.map((e) => (e.id === id ? { ...e, isSold: true, salePrice } : e))
                  )
                }
              />
            </div>
          )}

          {activeTab === 'psa_verify' && (
            <div className="app-view-container space-y-6">
              <PSACertVerifier
                currency={displayCurrency}
                onAddGradedCardToCollection={(certReport: PSAPopReport) => {
                  triggerSyncPulse();
                  const targetDeck = decks[0];
                  if (!targetDeck) return;

                  const cardMatch: PokemonCard = {
                    id: `graded-${certReport.certNumber}`,
                    name: certReport.cardName,
                    supertype: 'Pokémon',
                    subtypes: [certReport.variety || 'Secret Rare'],
                    hp: 280,
                    types: ['Colorless'],
                    set: {
                      id: certReport.specNumber || 'graded-set',
                      name: certReport.setName,
                      series: certReport.year || '2024',
                      printedTotal: 100,
                      total: 100,
                      releaseDate: `${certReport.year}-01-01`,
                    },
                    number: certReport.certNumber,
                    artist: `${certReport.gradingCompany || 'PSA'} Certified Registry`,
                    rarity: certReport.variety || 'Special Illustration Rare',
                    prices: {
                      raw: 150,
                      psa10Estimate: 280,
                      psa9Estimate: 190,
                      priceHistory: [],
                    },
                    images: {
                      small: certReport.labelImages?.front || 'https://images.pokemontcg.io/symbol.png',
                      large: certReport.labelImages?.front || 'https://images.pokemontcg.io/symbol.png',
                    },
                  };

                  const gradingInfo: GradingInfo = {
                    company: certReport.gradingCompany || 'PSA',
                    certNumber: certReport.certNumber,
                    grade: certReport.grade || '10',
                    subgrades: certReport.subgrades,
                  };

                  const updatedCards = [
                    ...targetDeck.cards,
                    {
                      card: cardMatch,
                      quantity: 1,
                      condition: 'Graded' as const,
                      gradingInfo,
                    },
                  ];

                  handleUpdateDeck({ ...targetDeck, cards: updatedCards });
                }}
              />
            </div>
          )}

          {activeTab === 'search' && (
            <SearchView
              sets={allSets}
              currency={displayCurrency}
              savedFilters={savedFilters}
              onUpdateFilters={setSavedFilters}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(effectiveCards);
              }}
            />
          )}

          {activeTab === 'sets' && (
            <SetsView
              sets={allSets}
              cards={effectiveCards}
              decks={decks}
              currency={displayCurrency}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(effectiveCards);
              }}
            />
          )}

          {activeTab === 'lists' && (
            <ListsView
              lists={customLists}
              cards={effectiveCards}
              currency={displayCurrency}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onRemoveCardFromList={handleRemoveCardFromList}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(effectiveCards);
              }}
              createListSignal={createListSignal}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              currency={displayCurrency}
              onSelectCurrency={setDisplayCurrency}
              currentTier={currentTier}
              onChangeTier={handleChangeTier}
              decks={decks}
              soldEntries={soldEntries}
              customLists={customLists}
              exportDataSignal={exportDataSignal}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        cards={effectiveCards}
        decks={decks}
        sets={allSets}
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
          handleChangeTier(tier as AccountTier);
          triggerSyncPulse();
        }}
      />

      <PayPalSubscriptionModal
        isOpen={!!paypalModalTier}
        onClose={() => setPaypalModalTier(null)}
        tierName={paypalModalTier || 'Bunch'}
        planId={
          (paypalModalTier && paypalConfig?.planIds?.[paypalModalTier]) ||
          'P-86F48638UK390893LNJY5FHQ'
        }
        clientId={
          paypalConfig?.clientId ||
          'BAAART0wdN_LoLV8d5vHUpcdNm7Nz9OAzCEnhJtMzH34baRvl3oYJrwuoy6cy9w1UFF_6fy7kvkOKHURTQ'
        }
        onApproveSubscription={handleApproveSubscription}
        getUserToken={async () => auth.currentUser?.getIdToken()}
      />

      <PayPalSuccessModal
        isOpen={!!paypalSuccessData}
        onClose={() => setPaypalSuccessData(null)}
        tierName={paypalSuccessData?.tier || 'Bunch'}
        subscriptionId={paypalSuccessData?.subId}
      />

      <PayPalCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onRetry={() => {
          setIsCancelModalOpen(false);
          if (paypalModalTier) handleChangeTier(paypalModalTier);
        }}
      />
    </div>
  );
}
