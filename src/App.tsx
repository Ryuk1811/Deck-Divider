/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import { LandingPageView } from './views/LandingPageView';
import { SealedPortfolioManager } from './components/SealedPortfolioManager';
import { PortfolioSealedEntry, GradingInfo } from './types';
import { useAuth } from './lib/AuthContext';
import { initSearchEngine, searchCards, mapToPokemonCard, getAvailableSets } from './lib/searchEngine';
import { startFullCatalogBackgroundSync, getExpansionsCatalog } from './lib/dataSyncEngine';
import { idbGetSealedVault, idbSaveSealedVault, idbGetCustomLists, idbSaveCustomLists, idbGetUserDecks, idbSaveUserDecks } from './lib/indexedDB';
import { packageUserSnapshot, unpackUserSnapshot, CompressedSnapshotDoc } from './lib/snapshotEngine';
import { Loader2 } from 'lucide-react';
import { db, auth } from './lib/firebase';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const navigate = useNavigate();
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
  const effectiveCards = allCards;

  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('collection');
  const [authViewRequested, setAuthViewRequested] = useState(false);
  const [guestMode, setGuestMode] = useState(false);

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


  // Core Data Collections
  const [decks, setDecks] = useState<Deck[]>([]);
  const [soldEntries, setSoldEntries] = useState<PortfolioCardEntry[]>([]);
  const [customLists, setCustomLists] = useState<CustomList[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [sealedEntries, setSealedEntries] = useState<PortfolioSealedEntry[]>([]);

  // Encrypted Local Vault & Compressed Cloud Snapshot State
  const [lastSyncedTimestamp, setLastSyncedTimestamp] = useState<string | null>(null);
  const [snapshotMetrics, setSnapshotMetrics] = useState<{ rawSize: number; byteSize: number; compressionRatio: string } | null>(null);

  // Load from Local Encrypted Storage on initial mount
  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    idbGetUserDecks(activeUid).then((saved) => {
      if (saved && saved.length > 0) {
        setDecks(saved);
      }
    });
    idbGetCustomLists(activeUid).then((saved) => {
      if (saved && saved.length > 0) {
        setCustomLists(saved);
      }
    });
    idbGetSealedVault(activeUid).then((saved) => {
      if (saved && saved.length > 0) {
        setSealedEntries(saved);
      }
    });
  }, [user]);

  // Initial cloud restore if local database is empty and user signs in
  React.useEffect(() => {
    if (!user) return;
    const fetchLatestCloudSnapshot = async () => {
      try {
        const snapRef = doc(db, 'users', user.uid, 'snapshot', 'current');
        const snapDoc = await getDoc(snapRef);
        if (snapDoc.exists()) {
          const docData = snapDoc.data() as CompressedSnapshotDoc;
          setLastSyncedTimestamp(docData.updatedAt);
          setSnapshotMetrics({
            rawSize: docData.rawSize,
            byteSize: docData.byteSize,
            compressionRatio: docData.compressionRatio,
          });

          // Unpack if local state has no decks or lists
          const unpacked = await unpackUserSnapshot(docData);
          if (unpacked) {
            setDecks((prev) => (prev.length === 0 && unpacked.decks?.length > 0 ? unpacked.decks : prev));
            setCustomLists((prev) => (prev.length === 0 && unpacked.customLists?.length > 0 ? unpacked.customLists : prev));
            setSealedEntries((prev) => (prev.length === 0 && unpacked.sealedEntries?.length > 0 ? unpacked.sealedEntries : prev));
            setSoldEntries((prev) => (prev.length === 0 && unpacked.soldEntries?.length > 0 ? unpacked.soldEntries : prev));
          }
        }
      } catch (err) {
        console.warn('Snapshot fetch notice:', err);
      }
    };
    fetchLatestCloudSnapshot();
  }, [user]);

  // Push compressed single-document snapshot to Firestore (overwriting existing)
  const saveCompressedCloudSnapshot = React.useCallback(async () => {
    if (!user) return;
    try {
      const stateToCompress = {
        version: 2,
        userId: user.uid,
        updatedAt: new Date().toISOString(),
        profile: {
          displayName: profile?.displayName || user.displayName || '',
          email: user.email || '',
          tier: currentTier,
          currency: displayCurrency,
        },
        decks,
        customLists,
        sealedEntries,
        soldEntries,
        recentActivities,
      };

      const packed = await packageUserSnapshot(stateToCompress);
      const snapRef = doc(db, 'users', user.uid, 'snapshot', 'current');
      
      // Strict overwrite (merge: false) to prevent historical document bloat
      await setDoc(snapRef, packed, { merge: false });

      setLastSyncedTimestamp(packed.updatedAt);
      setSnapshotMetrics({
        rawSize: packed.rawSize,
        byteSize: packed.byteSize,
        compressionRatio: packed.compressionRatio,
      });
      triggerSyncPulse();
    } catch (err) {
      console.warn('Cloud snapshot overwrite warning:', err);
    }
  }, [user, profile, currentTier, displayCurrency, decks, customLists, sealedEntries, soldEntries, recentActivities]);

  // Debounced auto-snapshot when local data changes
  React.useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      saveCompressedCloudSnapshot();
    }, 6000);
    return () => clearTimeout(timer);
  }, [decks, customLists, sealedEntries, soldEntries, user, saveCompressedCloudSnapshot]);

  // Sync local changes to Encrypted Local Storage
  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    if (decks.length > 0) {
      idbSaveUserDecks(decks, activeUid);
    }
  }, [decks, user]);

  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    if (customLists.length > 0) {
      idbSaveCustomLists(customLists, activeUid);
    }
  }, [customLists, user]);

  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    if (sealedEntries.length > 0) {
      idbSaveSealedVault(sealedEntries, activeUid);
    }
  }, [sealedEntries, user]);

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
    search: { tag: 'Card Discovery', title: 'Global Search' },
    sets: { tag: 'Expansion Index', title: 'Sets & Trackers' },
    lists: { tag: 'Unlimited Groups', title: 'Lists & Want-Lists' },
    settings: { tag: 'System Specs', title: 'Settings & Specs' },
  };

  // Modal States
  const [selectedDetailCard, setSelectedDetailCard] = useState<PokemonCard | null>(null);
  const [quickLookCard, setQuickLookCard] = useState<PokemonCard | null>(null);
  const [quickLookCardList, setQuickLookCardList] = useState<PokemonCard[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [targetDeckIdForView, setTargetDeckIdForView] = useState<string | undefined>(undefined);

  // Limit Hit Modal State
  const [limitModalConfig, setLimitModalConfig] = useState<{
    isOpen: boolean;
    action: 'CREATE_DECK' | 'ADD_CARD_TO_DECK' | 'SHARE_PUBLIC_LINK' | 'CREATE_LIST' | 'ADD_TO_LIST';
    details?: any;
  }>({
    isOpen: false,
    action: 'CREATE_DECK',
  });

  const [verifiedCertsCount, setVerifiedCertsCount] = useState<number>(() => parseInt(localStorage.getItem('verifiedCertsCount') || '0', 10));

  React.useEffect(() => {
    localStorage.setItem('verifiedCertsCount', verifiedCertsCount.toString());
  }, [verifiedCertsCount]);

  // Trigger brief background sync indicator pulse
  const triggerSyncPulse = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  // Deck Management Handlers
  const handleCreateDeck = async (deckData: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => {
    const maxDecks = TIER_LIMITS[currentTier].maxDecks;
    if (decks.length >= maxDecks) {
      setLimitModalConfig({
        isOpen: true,
        action: 'CREATE_DECK',
        details: { currentCount: decks.length, limitCount: maxDecks },
      });
      return;
    }

    triggerSyncPulse();
    const newDeckId = `deck-${Date.now()}`;
    const newDeck: Deck = {
      id: newDeckId,
      ...deckData,
      entries: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDecks((prev) => [newDeck, ...prev]);
    idbSaveUserDecks([newDeck, ...decks]);
    setTargetDeckIdForView(newDeckId);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', newDeckId), newDeck);
      } catch (err) {
        console.warn('Firestore deck save notice:', err);
      }
    }
  };

  const handleUpdateDeck = async (updatedDeck: Deck) => {
    triggerSyncPulse();
    const newDecks = decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d));
    setDecks(newDecks);
    idbSaveUserDecks(newDecks);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', updatedDeck.id), updatedDeck, { merge: true });
      } catch (err) {
        console.warn('Firestore deck update notice:', err);
      }
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    triggerSyncPulse();
    const newDecks = decks.filter((d) => d.id !== deckId);
    setDecks(newDecks);
    idbSaveUserDecks(newDecks);

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'decks', deckId));
      } catch (err) {
        console.warn('Firestore deck delete notice:', err);
      }
    }
  };

  const handleSplitDeckGroup = async (
    sourceDeckId: string,
    cardIdsToSplit: string[],
    newDeckName: string
  ) => {
    triggerSyncPulse();
    const sourceDeck = decks.find((d) => d.id === sourceDeckId);
    if (!sourceDeck) return;

    const entriesToMove = sourceDeck.entries.filter((e) => cardIdsToSplit.includes(e.cardId));
    const remainingEntries = sourceDeck.entries.filter((e) => !cardIdsToSplit.includes(e.cardId));
    const newSplitDeckId = `deck-split-${Date.now()}`;
    const newSplitDeck: Deck = {
      id: newSplitDeckId,
      name: newDeckName,
      description: `Split group from ${sourceDeck.name}`,
      colorHex: sourceDeck.colorHex,
      isPublic: sourceDeck.isPublic,
      entries: entriesToMove,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedSourceDeck: Deck = {
      ...sourceDeck,
      entries: remainingEntries,
      updatedAt: new Date().toISOString(),
    };

    const newDecks = [
      ...decks.map((d) => (d.id === sourceDeckId ? updatedSourceDeck : d)),
      newSplitDeck,
    ];
    setDecks(newDecks);
    idbSaveUserDecks(newDecks);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', updatedSourceDeck.id), updatedSourceDeck);
        await setDoc(doc(db, 'users', user.uid, 'decks', newSplitDeckId), newSplitDeck);
      } catch (err) {
        console.warn('Firestore deck split save notice:', err);
      }
    }
  };

  const handleAddCardToDeck = async (
    deckId: string,
    entryData: Omit<PortfolioCardEntry, 'id' | 'isSold'>,
    mode: 'increment' | 'separate'
  ) => {
    triggerSyncPulse();
    let targetDeck: Deck | undefined;

    const newDecks = decks.map((deck) => {
      if (deck.id !== deckId) return deck;

      if (mode === 'increment') {
        const existing = deck.entries.find(
          (e) => !e.isSold && e.cardId === entryData.cardId && e.condition === entryData.condition
        );

        if (existing) {
          targetDeck = {
            ...deck,
            entries: deck.entries.map((e) =>
              e.id === existing.id ? { ...e, quantity: e.quantity + entryData.quantity } : e
            ),
            updatedAt: new Date().toISOString(),
          };
          return targetDeck;
        }
      }

      const newEntry: PortfolioCardEntry = {
        id: `entry-${Date.now()}`,
        ...entryData,
        isSold: false,
      };

      targetDeck = {
        ...deck,
        entries: [...deck.entries, newEntry],
        updatedAt: new Date().toISOString(),
      };
      return targetDeck;
    });

    setDecks(newDecks);
    idbSaveUserDecks(newDecks);

    if (user && targetDeck) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', targetDeck.id), targetDeck);
      } catch (err) {
        console.warn('Firestore deck add-card notice:', err);
      }
    }

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

  const handleMarkCardSold = async (
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
    let targetDeck: Deck | undefined;

    const newDecks = decks.map((deck) => {
      if (deck.id !== deckId) return deck;
      targetDeck = {
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
      return targetDeck;
    });

    setDecks(newDecks);
    idbSaveUserDecks(newDecks);

    if (user && targetDeck) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', targetDeck.id), targetDeck);
      } catch (err) {
        console.warn('Firestore deck mark-sold notice:', err);
      }
    }

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
  const handleCreateList = async (listData: Omit<CustomList, 'id' | 'createdAt'>) => {
    const maxLists = TIER_LIMITS[currentTier].maxLists;
    if (customLists.length >= maxLists) {
      setLimitModalConfig({
        isOpen: true,
        action: 'CREATE_LIST',
        details: { currentCount: customLists.length, limitCount: maxLists },
      });
      return;
    }

    triggerSyncPulse();
    const newListId = `list-${Date.now()}`;
    const newList: CustomList = {
      id: newListId,
      ...listData,
      createdAt: new Date().toISOString(),
    };

    const newLists = [newList, ...customLists];
    setCustomLists(newLists);
    idbSaveCustomLists(newLists);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'customLists', newListId), newList);
      } catch (err) {
        console.warn('Firestore list create notice:', err);
      }
    }
  };

  const handleDeleteList = async (listId: string) => {
    triggerSyncPulse();
    const newLists = customLists.filter((l) => l.id !== listId);
    setCustomLists(newLists);
    idbSaveCustomLists(newLists);

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'customLists', listId));
      } catch (err) {
        console.warn('Firestore list delete notice:', err);
      }
    }
  };

  const handleAddCardToList = async (listId: string, cardId: string) => {
    const targetList = customLists.find((l) => l.id === listId);
    const maxItems = TIER_LIMITS[currentTier].maxItemsPerList;
    if (targetList && targetList.cardIds.length >= maxItems) {
      setLimitModalConfig({
        isOpen: true,
        action: 'ADD_TO_LIST',
        details: { currentCount: targetList.cardIds.length, limitCount: maxItems, listName: targetList.name },
      });
      return;
    }

    triggerSyncPulse();
    let updatedList: CustomList | undefined;

    const newLists = customLists.map((l) => {
      if (l.id === listId && !l.cardIds.includes(cardId)) {
        updatedList = { ...l, cardIds: [...l.cardIds, cardId] };
        return updatedList;
      }
      return l;
    });

    setCustomLists(newLists);
    idbSaveCustomLists(newLists);

    if (user && updatedList) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'customLists', updatedList.id), updatedList);
      } catch (err) {
        console.warn('Firestore list add-card notice:', err);
      }
    }
  };

  const handleRemoveCardFromList = async (listId: string, cardId: string) => {
    triggerSyncPulse();
    let updatedList: CustomList | undefined;

    const newLists = customLists.map((l) => {
      if (l.id === listId) {
        updatedList = { ...l, cardIds: l.cardIds.filter((id) => id !== cardId) };
        return updatedList;
      }
      return l;
    });

    setCustomLists(newLists);
    idbSaveCustomLists(newLists);

    if (user && updatedList) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'customLists', updatedList.id), updatedList);
      } catch (err) {
        console.warn('Firestore list remove-card notice:', err);
      }
    }
  };

  // Sealed Vault Handlers
  const handleAddSealedEntry = async (entry: PortfolioSealedEntry) => {
    triggerSyncPulse();
    const newSealed = [entry, ...sealedEntries];
    setSealedEntries(newSealed);
    idbSaveSealedVault(newSealed);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'sealedVault', entry.id), entry);
      } catch (err) {
        console.warn('Firestore sealed entry save notice:', err);
      }
    }

    setRecentActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'ADDED',
        title: `Vaulted ${entry.product.name}`,
        subtitle: `${entry.condition} • Qty ${entry.quantity}`,
        timestamp: new Date().toISOString(),
        amount: entry.purchasePrice * entry.quantity,
        currency: entry.purchaseCurrency,
      },
      ...prev,
    ]);
  };

  const handleDeleteSealedEntry = async (id: string) => {
    triggerSyncPulse();
    const newSealed = sealedEntries.filter((e) => e.id !== id);
    setSealedEntries(newSealed);
    idbSaveSealedVault(newSealed);

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'sealedVault', id));
      } catch (err) {
        console.warn('Firestore sealed entry delete notice:', err);
      }
    }
  };

  const handleMarkSoldSealedEntry = async (id: string, salePrice: number) => {
    triggerSyncPulse();
    let updatedItem: PortfolioSealedEntry | null = null;
    const newSealed = sealedEntries.map((e) => {
      if (e.id === id) {
        updatedItem = { ...e, isSold: true, salePrice };
        return updatedItem;
      }
      return e;
    });

    setSealedEntries(newSealed);
    idbSaveSealedVault(newSealed);

    if (user && updatedItem) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'sealedVault', (updatedItem as PortfolioSealedEntry).id), updatedItem);
      } catch (err) {
        console.warn('Firestore sealed mark-sold notice:', err);
      }
    }

    if (updatedItem) {
      setRecentActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          type: 'SOLD',
          title: `Sold ${(updatedItem as PortfolioSealedEntry).product.name}`,
          subtitle: `Realized Sale @ $${salePrice.toLocaleString()}`,
          timestamp: new Date().toISOString(),
          amount: salePrice,
          currency: (updatedItem as PortfolioSealedEntry).purchaseCurrency,
        },
        ...prev,
      ]);
    }
  };

  // Unified sold entries aggregating across decks & historical sales
  const allSoldEntries = useMemo(() => {
    const deckSolds = decks.flatMap((d) => d.entries.filter((e) => e.isSold));
    const ids = new Set(deckSolds.map((s) => s.id));
    const extraSolds = soldEntries.filter((s) => !ids.has(s.id));
    return [...deckSolds, ...extraSolds];
  }, [decks, soldEntries]);

  const renderDashboard = () => {
    if (authLoading) {
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-dot-grid bg-[#F8FAFC]">
          <Loader2 className="w-8 h-8 animate-spin text-[#DC143C]" />
        </div>
      );
    }

    if (!user && !guestMode) {
      return <Navigate to="/auth" replace />;
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
              onAddCardToList={handleAddCardToList}
            />
          )}

          {activeTab === 'metrics' && (
            <MetricsView
              decks={decks}
              soldEntries={allSoldEntries}
              customLists={customLists}
              sealedEntries={sealedEntries}
              liveSets={liveSets}
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
                onAddSealedEntry={handleAddSealedEntry}
                onDeleteSealedEntry={handleDeleteSealedEntry}
                onMarkSoldSealedEntry={handleMarkSoldSealedEntry}
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
              currentTier={currentTier}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onRemoveCardFromList={handleRemoveCardFromList}
              onSelectCard={(card) => setSelectedDetailCard(card)}
              onQuickLookCard={(card) => {
                setQuickLookCard(card);
                setQuickLookCardList(effectiveCards);
              }}
              onTriggerLimitModal={(action, details) =>
                setLimitModalConfig({ isOpen: true, action, details })
              }
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
              soldEntries={allSoldEntries}
              customLists={customLists}
              exportDataSignal={exportDataSignal}
              onTriggerCloudSnapshot={saveCompressedCloudSnapshot}
              lastSyncedTimestamp={lastSyncedTimestamp}
              snapshotMetrics={snapshotMetrics}
            />
          )}
        </main>
      </div>
    </div>
  );
};

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPageView
              onEnterApp={() => {
                if (user || guestMode) {
                  navigate('/app');
                } else {
                  navigate('/auth');
                }
              }}
              onOpenAuth={() => navigate('/auth')}
              onSelectTier={(tier) => {
                if (user) {
                  if (tier !== 'Starter') {
                    setPaypalModalTier(tier);
                  }
                  navigate('/app');
                } else {
                  navigate('/auth');
                }
              }}
              currentTier={currentTier}
              displayCurrency={displayCurrency}
              onSelectCurrency={setDisplayCurrency}
            />
          }
        />

        <Route
          path="/auth"
          element={
            <AuthView
              onBack={() => navigate('/')}
              onGuestAccess={() => {
                setGuestMode(true);
                navigate('/app');
              }}
            />
          }
        />

        <Route path="/app/*" element={renderDashboard()} />
        <Route path="/app" element={renderDashboard()} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
          navigate('/app');
        }}
        onNavigate={(tab) => {
          setActiveTab(tab);
          navigate('/app');
        }}
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
    </>
  );
}
