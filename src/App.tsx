/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
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
import { initSnapshotMetronome, recordSnapshotCompleted } from './utils/cloudSnapshotMetronome';
import { queueCardsForProgressivePrewarm } from './utils/progressiveImageLoader';
import { Sidebar, ActiveTab } from './components/ui/Sidebar';
import { DeckDividerBrand, DeckDividersIcon } from './components/ui/DeckDividerBrand';
import { CommandPalette } from './components/ui/CommandPalette';
import { CardDetailModal } from './components/modals/CardDetailModal';
import { QuickLookModal } from './components/modals/QuickLookModal';
import { LimitReachedModal } from './components/modals/LimitReachedModal';
import { GuestLimitModal } from './components/modals/GuestLimitModal';
import { PayPalSubscriptionModal } from './components/modals/PayPalSubscriptionModal';
import { PayPalSuccessModal } from './components/modals/PayPalSuccessModal';
import { PayPalCancelModal } from './components/modals/PayPalCancelModal';
import { PagesDropdown } from './components/ui/PagesDropdown';

import { CollectionView } from './views/app/CollectionView';
import { MetricsView } from './views/app/MetricsView';
import { DecksView } from './views/app/DecksView';
import { SearchView } from './views/app/SearchView';
import { SetsView } from './views/app/SetsView';
import { PublicSetsDirectoryView } from './views/public/PublicSetsDirectoryView';
import { PublicSetView } from './views/public/PublicSetView';
import { PublicSetTopCardsView } from './views/public/PublicSetTopCardsView';
import { PublicSocialsView } from './views/public/PublicSocialsView';
import { FormatLegalityDirectoryView } from './views/public/FormatLegalityDirectoryView';
import { FormatLegalityView } from './views/public/FormatLegalityView';
import { CompetitorComparisonView } from './views/marketing/CompetitorComparisonView';
import { CommunityLeaderboardView } from './views/public/CommunityLeaderboardView';
import { BestOfGuidesView } from './views/marketing/BestOfGuidesView';
import { HighIntentToolsView } from './views/public/HighIntentToolsView';
import { ListsView } from './views/app/ListsView';
import { SettingsView } from './views/app/SettingsView';
import { AuthView } from './views/auth/AuthView';
import { LandingPageView } from './views/marketing/LandingPageView';
import { AboutPageView } from './views/marketing/AboutPageView';
import { HowItWorksPageView } from './views/marketing/HowItWorksPageView';
import { PrivacyPolicyView } from './views/legal/PrivacyPolicyView';
import { TermsOfServiceView } from './views/legal/TermsOfServiceView';
import { PricingPageView } from './views/marketing/PricingPageView';
import { FaqPageView } from './views/marketing/FaqPageView';
import { NotFoundView } from './views/app/NotFoundView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { 
  ContactPageView, 
  SecurityPageView 
} from './views/legal/AdditionalPages';
import { AnalyticsFunnelModal } from './components/modals/AnalyticsFunnelModal';
import { trackDashboardView, trackFirstMeaningfulAction } from './lib/analytics';
import { SealedPortfolioManager } from './components/app/SealedPortfolioManager';
import { PortfolioSealedEntry, GradingInfo } from './types';
import { useAuth } from './lib/AuthContext';
import { initSearchEngine, searchCards, mapToPokemonCard, getAvailableSets } from './lib/searchEngine';
import { startFullCatalogBackgroundSync, getExpansionsCatalog } from './lib/dataSyncEngine';
import { idbGetSealedVault, idbSaveSealedVault, idbGetCustomLists, idbSaveCustomLists, idbGetUserDecks, idbSaveUserDecks } from './lib/indexedDB';
import { safeGetItem, safeSetItem } from './utils/safeStorage';
import { packageUserSnapshot, unpackUserSnapshot, CompressedSnapshotDoc, UserCompressedSnapshotState } from './lib/snapshotEngine';
import { createCloudBackupPoint } from './lib/backupEngine';
import { reconcileFullCollectionState } from './lib/syncDeduplicationEngine';
import { BackupRecoveryModal } from './components/modals/BackupRecoveryModal';
import {
  generateShowcaseDecks,
  generateShowcaseSealed,
  generateShowcaseCustomLists,
  isMockDeck,
  isMockCardEntry,
  isMockCustomList,
  isMockSealedEntry,
} from './lib/showcaseSeeder';
import { Loader2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, deleteDoc, updateDoc, collection, getDocs, onSnapshot } from 'firebase/firestore';
import { PublicDeckView } from './views/public/PublicDeckView';
import { useParams, useSearchParams } from 'react-router-dom';

import { PublicPortfolioView } from './views/public/PublicPortfolioView';

const PublicDeckViewRoute = ({ displayCurrency, setDisplayCurrency }: { displayCurrency: string, setDisplayCurrency: (c: string) => void }) => {
  const { deckId } = useParams<{ deckId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  return (
    <PublicDeckView 
      deckId={deckId}
      encodedData={searchParams.get('d') || undefined}
      onOpenFullApp={() => navigate('/')}
      activeCurrency={displayCurrency}
      onCurrencyChange={setDisplayCurrency}
    />
  );
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, subscription, loading: authLoading, refreshSubscription, updateUserProfile, signOutUser } = useAuth();
  const [guestPublicProfile, setGuestPublicProfile] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dd_guest_is_public') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [engineReady, setEngineReady] = useState(false);
  const [liveSets, setLiveSets] = useState<CardSet[]>([]);

  const handleSignOut = async () => {
    try {
      if (signOutUser) {
        await signOutUser();
      } else {
        await signOut(auth);
      }
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    handleSetGuestMode(false);
    try {
      localStorage.removeItem('dd_guest_mode');
      localStorage.removeItem('dd_guest_is_public');
    } catch (e) {}
    setDecks([]);
    setCustomLists([]);
    setSealedEntries([]);
    setSoldEntries([]);
    navigate('/');
  };

  // Dynamically manage robots meta tag on route transitions
  React.useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
    }

    if (location.pathname.startsWith('/app') || location.pathname.startsWith('/dashboard')) {
      robotsMeta.content = 'noindex, nofollow';
    } else {
      robotsMeta.content = 'index, follow';
    }
  }, [location.pathname]);

  React.useEffect(() => {
    initSearchEngine()
      .then(() => setEngineReady(true))
      .catch((err) => console.warn('initSearchEngine non-fatal warning:', err));
    getExpansionsCatalog()
      .then((sets) => {
        if (sets && sets.length > 0) setLiveSets(sets);
      })
      .catch((err) => console.warn('getExpansionsCatalog non-fatal warning:', err));
    startFullCatalogBackgroundSync().catch((err) =>
      console.warn('startFullCatalogBackgroundSync non-fatal warning:', err)
    );
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
  const [guestMode, setGuestMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dd_guest_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  const handleSetGuestMode = (val: boolean) => {
    setGuestMode(val);
    try {
      if (val) {
        localStorage.setItem('dd_guest_mode', 'true');
      } else {
        localStorage.removeItem('dd_guest_mode');
      }
    } catch (e) {}
  };

  const handleOpenAuth = React.useCallback(() => {
    handleSetGuestMode(false);
    navigate('/auth');
  }, [navigate]);

  // Account State & Currency Configuration
  const currentTier = subscription?.tierName || 'Starter';
  const canSharePublicLinks = TIER_LIMITS[currentTier]?.canSharePublicLinks ?? false;
  const effectiveIsPublicProfile = canSharePublicLinks && Boolean(profile?.isPublicProfile ?? guestPublicProfile);
  const [selectedCurrency, setSelectedCurrency] = useState<DisplayCurrency>(() => {
    return (safeGetItem('displayCurrency') as DisplayCurrency) || profile?.displayCurrency || 'USD';
  });
  
  const displayCurrency = selectedCurrency;

  const setDisplayCurrency = (c: DisplayCurrency) => {
    setSelectedCurrency(c);
    safeSetItem('displayCurrency', c);
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
  const [isFunnelModalOpen, setIsFunnelModalOpen] = useState(false);

  // Track dashboard views when entering /app routes
  React.useEffect(() => {
    if (location.pathname.startsWith('/app')) {
      trackDashboardView();
    }
  }, [location.pathname]);

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

  const handleApproveSubscription = async (subscriptionId: string, tier: AccountTier, provider: 'paypal' = 'paypal') => {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('/api/billing/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ subscriptionId, tier, provider }),
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
    try {
      if (typeof window !== 'undefined' && window.opener) {
        let isClosed = false;
        try { isClosed = window.opener.closed; } catch (e) { isClosed = true; }
        if (!isClosed) {
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
      }
    } catch (e) {
      console.warn('window.opener check failed:', e);
    }

    // Direct window processing (when user is ready)
    if (paypalSuccess) {
      if (user) {
        const targetSubId = rawSubId || 'LIVE_APPROVED_' + Date.now();
        handleApproveSubscription(targetSubId, rawTier);
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (e) {
          console.warn('replaceState failed:', e);
        }
      }
    } else if (paypalCancel) {
      setIsCancelModalOpen(true);
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.warn('replaceState failed:', e);
      }
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
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Maintain a stable stateRef to prevent saveCompressedCloudSnapshot from changing reference on every state update
  const stateRef = React.useRef({
    decks,
    customLists,
    sealedEntries,
    soldEntries,
    recentActivities,
    profile,
    currentTier,
    displayCurrency,
    user,
  });

  React.useEffect(() => {
    stateRef.current = {
      decks,
      customLists,
      sealedEntries,
      soldEntries,
      recentActivities,
      profile,
      currentTier,
      displayCurrency,
      user,
    };
  });

  // Push compressed single-document snapshot to Firestore (overwriting existing)
  const saveCompressedCloudSnapshot = React.useCallback(async (overrideState?: {
    decks?: Deck[];
    customLists?: CustomList[];
    sealedEntries?: PortfolioSealedEntry[];
    isPublicProfile?: boolean;
  }) => {
    const curUser = stateRef.current.user;
    if (!curUser) return;
    try {
      const isPublicProfile = overrideState?.isPublicProfile !== undefined
        ? overrideState.isPublicProfile
        : Boolean(stateRef.current.profile?.isPublicProfile ?? localStorage.getItem('dd_guest_is_public') === 'true');

      const rawDecks = overrideState?.decks ?? stateRef.current.decks;
      const rawLists = overrideState?.customLists ?? stateRef.current.customLists;
      const rawSealed = overrideState?.sealedEntries ?? stateRef.current.sealedEntries;

      const sanitizedDecks = curUser
        ? rawDecks
            .filter((d) => !isMockDeck(d))
            .map((deck) => ({
              ...deck,
              entries: (deck.entries || []).filter((e) => !isMockCardEntry(e)),
            }))
        : rawDecks;
      const sanitizedLists = curUser ? rawLists.filter((l) => !isMockCustomList(l)) : rawLists;
      const sanitizedSealed = curUser ? rawSealed.filter((s) => !isMockSealedEntry(s)) : rawSealed;

      const stateToCompress = {
        version: 2,
        userId: curUser.uid,
        updatedAt: new Date().toISOString(),
        profile: {
          displayName: stateRef.current.profile?.displayName || curUser.displayName || '',
          email: curUser.email || '',
          tier: stateRef.current.currentTier,
          currency: stateRef.current.displayCurrency,
          isPublicProfile: isPublicProfile,
          publicProfileShareCode: stateRef.current.profile?.publicProfileShareCode,
        },
        decks: sanitizedDecks,
        customLists: sanitizedLists,
        sealedEntries: sanitizedSealed,
        soldEntries: stateRef.current.soldEntries,
        recentActivities: stateRef.current.recentActivities,
      };

      const packed = await packageUserSnapshot(stateToCompress);
      packed.isPublicProfile = isPublicProfile;
      const snapRef = doc(db, 'users', curUser.uid, 'snapshot', 'current');
      
      // Strict overwrite (merge: false) to prevent historical document bloat
      await setDoc(snapRef, packed, { merge: false });

      // Save rolling timestamped point-in-time cloud and local backup
      await createCloudBackupPoint(stateToCompress);

      // Async multi-tier subcollection redundancy sync (guarantees cross-device durability)
      Promise.all([
        ...sanitizedDecks.map((d) => setDoc(doc(db, 'users', curUser.uid, 'decks', d.id), d).catch(() => {})),
        ...sanitizedLists.map((l) => setDoc(doc(db, 'users', curUser.uid, 'customLists', l.id), l).catch(() => {})),
        ...sanitizedSealed.map((s) => setDoc(doc(db, 'users', curUser.uid, 'sealedVault', s.id), s).catch(() => {})),
      ]).catch(() => {});

      setLastSyncedTimestamp(packed.updatedAt);
      recordSnapshotCompleted();
      setSnapshotMetrics({
        rawSize: packed.rawSize,
        byteSize: packed.byteSize,
        compressionRatio: packed.compressionRatio,
      });
      triggerSyncPulse();
    } catch (err) {
      console.warn('Cloud snapshot overwrite warning:', err);
    }
  }, []);

  // Restore state from a point-in-time cloud or local backup
  const handleRestoreState = React.useCallback(async (restoredState: UserCompressedSnapshotState) => {
    const targetUid = user?.uid || 'guest_user';
    const rawDecks = restoredState.decks || [];
    const rawLists = restoredState.customLists || [];
    const rawSealed = restoredState.sealedEntries || [];
    const newSold = restoredState.soldEntries || [];

    const newDecks = user
      ? rawDecks
          .filter((d) => !isMockDeck(d))
          .map((deck) => ({
            ...deck,
            entries: (deck.entries || []).filter((e) => !isMockCardEntry(e)),
          }))
      : rawDecks;
    const newLists = user ? rawLists.filter((l) => !isMockCustomList(l)) : rawLists;
    const newSealed = user ? rawSealed.filter((s) => !isMockSealedEntry(s)) : rawSealed;

    setDecks(newDecks);
    setCustomLists(newLists);
    setSealedEntries(newSealed);
    setSoldEntries(newSold);

    await Promise.all([
      idbSaveUserDecks(newDecks, targetUid),
      idbSaveCustomLists(newLists, targetUid),
      idbSaveSealedVault(newSealed, targetUid),
    ]);

    if (user) {
      await saveCompressedCloudSnapshot({
        decks: newDecks,
        customLists: newLists,
        sealedEntries: newSealed,
      });
    }
  }, [user, saveCompressedCloudSnapshot]);

  // Helper to load complete Showcase / Starter Sample Suite (Guest / Demo Mode ONLY)
  const handleLoadShowcaseData = React.useCallback(async () => {
    // Strictly tied to demo mode only - prohibited on authenticated user accounts
    if (user) return;
    const targetUid = 'guest_user';
    const sampleDecks = generateShowcaseDecks(targetUid);
    const sampleLists = generateShowcaseCustomLists(targetUid);
    const sampleSealed = generateShowcaseSealed(targetUid);

    setDecks(sampleDecks);
    setCustomLists(sampleLists);
    setSealedEntries(sampleSealed);

    await Promise.all([
      idbSaveUserDecks(sampleDecks, targetUid),
      idbSaveCustomLists(sampleLists, targetUid),
      idbSaveSealedVault(sampleSealed, targetUid),
    ]);
  }, [user]);

  // Helper to load standard competitive sample deck (Guest / Demo Mode ONLY)
  const handleLoadSampleDeck = React.useCallback(async () => {
    // Strictly tied to demo mode only - prohibited on authenticated user accounts
    if (user) return;
    const targetUid = 'guest_user';
    const sampleDecks = generateShowcaseDecks(targetUid).slice(0, 1); // Charizard Championship 60
    
    setDecks((prev) => {
      const merged = [...sampleDecks, ...prev.filter(d => d.id !== sampleDecks[0].id)];
      idbSaveUserDecks(merged, targetUid);
      return merged;
    });
  }, [user]);

  // Load from Local Encrypted Storage on initial mount & Seed Sample data for demo guests if empty
  React.useEffect(() => {
    if (authLoading) return;
    const activeUid = user?.uid || 'guest_user';

    const initializeAppState = async () => {
      // Reset collection state to prevent state bleed between user accounts
      setDecks([]);
      setCustomLists([]);
      setSealedEntries([]);
      setSoldEntries([]);

      try {
        const [savedDecks, savedLists, savedSealed] = await Promise.all([
          idbGetUserDecks(activeUid),
          idbGetCustomLists(activeUid),
          idbGetSealedVault(activeUid),
        ]);

        let currentDecks = savedDecks || [];
        let currentLists = savedLists || [];
        let currentSealed = savedSealed || [];

        // If authenticated, check Firestore snapshot AND query subcollections to guarantee cross-device persistence
        if (user) {
          let remoteSnapshotState: UserCompressedSnapshotState | null = null;
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

              remoteSnapshotState = await unpackUserSnapshot(docData);
            }

            // Subcollection multi-tier query fallback (guarantees items added on mobile/desktop exist across devices)
            const [subDecksSnap, subListsSnap, subSealedSnap] = await Promise.all([
              getDocs(collection(db, 'users', user.uid, 'decks')).catch((e) => {
                handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/decks`);
                return null;
              }),
              getDocs(collection(db, 'users', user.uid, 'customLists')).catch((e) => {
                handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/customLists`);
                return null;
              }),
              getDocs(collection(db, 'users', user.uid, 'sealedVault')).catch((e) => {
                handleFirestoreError(e, OperationType.LIST, `users/${user.uid}/sealedVault`);
                return null;
              }),
            ]);

            const subDecks = subDecksSnap && !subDecksSnap.empty ? (subDecksSnap.docs.map((d) => d.data() as Deck)) : [];
            const subLists = subListsSnap && !subListsSnap.empty ? (subListsSnap.docs.map((d) => d.data() as CustomList)) : [];
            const subSealed = subSealedSnap && !subSealedSnap.empty ? (subSealedSnap.docs.map((d) => d.data() as PortfolioSealedEntry)) : [];

            // Combine remote snapshot and remote subcollections first
            const remoteConsolidated = reconcileFullCollectionState(
              {
                decks: remoteSnapshotState?.decks || [],
                customLists: remoteSnapshotState?.customLists || [],
                sealedEntries: remoteSnapshotState?.sealedEntries || [],
                soldEntries: remoteSnapshotState?.soldEntries || [],
              },
              {
                decks: subDecks,
                customLists: subLists,
                sealedEntries: subSealed,
                soldEntries: [],
              },
              true
            );

            // Now reconcile local IDB state with the remote consolidated state
            const reconciled = reconcileFullCollectionState(
              {
                decks: currentDecks,
                customLists: currentLists,
                sealedEntries: currentSealed,
                soldEntries: [],
              },
              remoteConsolidated,
              true
            );

            currentDecks = reconciled.decks;
            currentLists = reconciled.customLists;
            currentSealed = reconciled.sealedEntries;
            if (reconciled.soldEntries && reconciled.soldEntries.length > 0) {
              setSoldEntries(reconciled.soldEntries);
            }
          } catch (cloudErr) {
            console.warn('Snapshot/Subcollection cloud fetch warning:', cloudErr);
          }

          // Strict user account purification: eliminate all mock/showcase/sample data from user accounts
          const cleanedDecks = currentDecks
            .filter((d) => !isMockDeck(d))
            .map((deck) => ({
              ...deck,
              entries: (deck.entries || []).filter((e) => !isMockCardEntry(e)),
            }));
          const cleanedLists = currentLists.filter((l) => !isMockCustomList(l));
          const cleanedSealed = currentSealed.filter((s) => !isMockSealedEntry(s));

          currentDecks = cleanedDecks;
          currentLists = cleanedLists;
          currentSealed = cleanedSealed;

          // Save sanitized collection to local user storage
          await Promise.all([
            idbSaveUserDecks(currentDecks, user.uid),
            idbSaveCustomLists(currentLists, user.uid),
            idbSaveSealedVault(currentSealed, user.uid),
          ]);

          // Immediately sync back unified consolidated snapshot to Cloud
          await saveCompressedCloudSnapshot({
            decks: currentDecks,
            customLists: currentLists,
            sealedEntries: currentSealed,
          });
        } else {
          // Automatic showcase seeding ONLY for Guest / Demo mode when collection is empty
          if (currentDecks.length === 0 && currentLists.length === 0 && currentSealed.length === 0) {
            currentDecks = generateShowcaseDecks(activeUid);
            currentLists = generateShowcaseCustomLists(activeUid);
            currentSealed = generateShowcaseSealed(activeUid);

            await Promise.all([
              idbSaveUserDecks(currentDecks, activeUid),
              idbSaveCustomLists(currentLists, activeUid),
              idbSaveSealedVault(currentSealed, activeUid),
            ]);
          }
        }

        setDecks(currentDecks);
        setCustomLists(currentLists);
        setSealedEntries(currentSealed);
      } catch (err) {
        console.error('Data initialization error:', err);
        if (!user) {
          const fallbackDecks = generateShowcaseDecks(activeUid);
          const fallbackLists = generateShowcaseCustomLists(activeUid);
          const fallbackSealed = generateShowcaseSealed(activeUid);
          setDecks(fallbackDecks);
          setCustomLists(fallbackLists);
          setSealedEntries(fallbackSealed);
        } else {
          setDecks([]);
          setCustomLists([]);
          setSealedEntries([]);
        }
      }
    };

    initializeAppState();
  }, [user?.uid, authLoading, saveCompressedCloudSnapshot]);

  // Live Firestore Snapshot listener for real-time cross-device (mobile <-> desktop) sync
  React.useEffect(() => {
    if (!user) return;

    const snapRef = doc(db, 'users', user.uid, 'snapshot', 'current');
    const unsubscribe = onSnapshot(
      snapRef,
      async (snapDoc) => {
        if (!snapDoc.exists()) return;
        const docData = snapDoc.data() as CompressedSnapshotDoc;
        if (!docData || !docData.updatedAt) return;

        // Skip if remote timestamp is not newer than our local lastSyncedTimestamp
        if (lastSyncedTimestamp && docData.updatedAt <= lastSyncedTimestamp) return;

        try {
          const unpacked = await unpackUserSnapshot(docData);
          if (unpacked) {
            setLastSyncedTimestamp(docData.updatedAt);
            setSnapshotMetrics({
              rawSize: docData.rawSize,
              byteSize: docData.byteSize,
              compressionRatio: docData.compressionRatio,
            });

            if (unpacked.decks && Array.isArray(unpacked.decks)) {
              const cleaned = unpacked.decks.filter((d) => !isMockDeck(d));
              setDecks(cleaned);
              idbSaveUserDecks(cleaned, user.uid);
            }
            if (unpacked.customLists && Array.isArray(unpacked.customLists)) {
              const cleaned = unpacked.customLists.filter((l) => !isMockCustomList(l));
              setCustomLists(cleaned);
              idbSaveCustomLists(cleaned, user.uid);
            }
            if (unpacked.sealedEntries && Array.isArray(unpacked.sealedEntries)) {
              const cleaned = unpacked.sealedEntries.filter((s) => !isMockSealedEntry(s));
              setSealedEntries(cleaned);
              idbSaveSealedVault(cleaned, user.uid);
            }
            if (unpacked.soldEntries && Array.isArray(unpacked.soldEntries)) {
              setSoldEntries(unpacked.soldEntries);
            }
          }
        } catch (e) {
          console.warn('Realtime snapshot sync warning:', e);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/snapshot/current`);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, lastSyncedTimestamp]);

  // Debounced Auto-Save Cloud Sync whenever user collection state updates on authenticated accounts
  const isInitialMount = React.useRef(true);
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!user) return;

    const timer = setTimeout(() => {
      saveCompressedCloudSnapshot();
    }, 1000);

    return () => clearTimeout(timer);
  }, [decks, customLists, sealedEntries, soldEntries, user, saveCompressedCloudSnapshot]);

  // 6-Hour Automated Snapshot Metronome
  React.useEffect(() => {
    if (!user) return;
    const cleanupMetronome = initSnapshotMetronome(() => {
      saveCompressedCloudSnapshot();
    });
    return cleanupMetronome;
  }, [user, saveCompressedCloudSnapshot]);

  // Progressive background prewarm of user's active collection cards
  React.useEffect(() => {
    if (decks.length > 0) {
      const allCards = decks.flatMap((d) => d.entries.map((e) => e.card));
      queueCardsForProgressivePrewarm(allCards, 'normal');
    }
  }, [decks]);

  // Sync local changes to Encrypted Local Storage
  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    if (decks.length > 0) {
      idbSaveUserDecks(decks, activeUid);
    }
  }, [decks, user?.uid]);

  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    if (customLists.length > 0) {
      idbSaveCustomLists(customLists, activeUid);
    }
  }, [customLists, user?.uid]);

  React.useEffect(() => {
    const activeUid = user?.uid || 'guest_user';
    if (sealedEntries.length > 0) {
      idbSaveSealedVault(sealedEntries, activeUid);
    }
  }, [sealedEntries, user?.uid]);

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

  // Guest Restriction Modal State
  const [guestModalConfig, setGuestModalConfig] = useState<{
    isOpen: boolean;
    title?: string;
    description?: string;
  }>({
    isOpen: false,
  });

  const triggerGuestRestriction = (title?: string, description?: string) => {
    setGuestModalConfig({
      isOpen: true,
      title: title || 'Authentication Required',
      description: description || 'Guest / Demo mode is read-only. Please create a free account or sign in to build tournament decks, add graded slabs, and customize lists.',
    });
  };

  const [verifiedCertsCount, setVerifiedCertsCount] = useState<number>(() => parseInt(safeGetItem('verifiedCertsCount') || '0', 10));

  React.useEffect(() => {
    safeSetItem('verifiedCertsCount', verifiedCertsCount.toString());
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

    const newDecks = [newDeck, ...decks];
    setDecks(newDecks);
    idbSaveUserDecks(newDecks, user?.uid || 'guest_user');
    setTargetDeckIdForView(newDeckId);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', newDeckId), newDeck);
        saveCompressedCloudSnapshot({ decks: newDecks });
      } catch (err) {
        console.warn('Firestore deck save notice:', err);
      }
    }
  };

  const handleUpdateDeck = async (updatedDeck: Deck) => {
    triggerSyncPulse();
    const newDecks = decks.map((d) => (d.id === updatedDeck.id ? updatedDeck : d));
    setDecks(newDecks);
    idbSaveUserDecks(newDecks, user?.uid || 'guest_user');

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', updatedDeck.id), updatedDeck, { merge: true });
        saveCompressedCloudSnapshot({ decks: newDecks });
      } catch (err) {
        console.warn('Firestore deck update notice:', err);
      }
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    triggerSyncPulse();
    const newDecks = decks.filter((d) => d.id !== deckId);
    setDecks(newDecks);
    idbSaveUserDecks(newDecks, user?.uid || 'guest_user');

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'decks', deckId));
        await saveCompressedCloudSnapshot({ decks: newDecks });
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
    idbSaveUserDecks(newDecks, user?.uid || 'guest_user');

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', updatedSourceDeck.id), updatedSourceDeck);
        await setDoc(doc(db, 'users', user.uid, 'decks', newSplitDeckId), newSplitDeck);
        saveCompressedCloudSnapshot({ decks: newDecks });
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
    const targetDeckRef = decks.find((d) => d.id === deckId);
    const maxCards = TIER_LIMITS[currentTier].maxCardsPerDeck;
    const currentCardCount = targetDeckRef ? targetDeckRef.entries.reduce((a, b) => a + b.quantity, 0) : 0;
    if (currentCardCount + entryData.quantity > maxCards) {
      setLimitModalConfig({
        isOpen: true,
        action: 'ADD_CARD_TO_DECK',
        details: { currentCount: currentCardCount, limitCount: maxCards, deckName: targetDeckRef?.name },
      });
      return;
    }

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
    idbSaveUserDecks(newDecks, user?.uid || 'guest_user');

    if (user && targetDeck) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', targetDeck.id), targetDeck);
        saveCompressedCloudSnapshot({ decks: newDecks });
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
    idbSaveUserDecks(newDecks, user?.uid || 'guest_user');

    if (user && targetDeck) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'decks', targetDeck.id), targetDeck);
        saveCompressedCloudSnapshot({ decks: newDecks });
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
    idbSaveCustomLists(newLists, user?.uid || 'guest_user');

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'customLists', newListId), newList);
        saveCompressedCloudSnapshot({ customLists: newLists });
      } catch (err) {
        console.warn('Firestore list create notice:', err);
      }
    }
  };

  const handleDeleteList = async (listId: string) => {
    triggerSyncPulse();
    const newLists = customLists.filter((l) => l.id !== listId);
    setCustomLists(newLists);
    idbSaveCustomLists(newLists, user?.uid || 'guest_user');

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'customLists', listId));
        await saveCompressedCloudSnapshot({ customLists: newLists });
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
    idbSaveCustomLists(newLists, user?.uid || 'guest_user');

    if (user && updatedList) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'customLists', updatedList.id), updatedList);
        saveCompressedCloudSnapshot({ customLists: newLists });
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
    idbSaveCustomLists(newLists, user?.uid || 'guest_user');

    if (user && updatedList) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'customLists', updatedList.id), updatedList);
        saveCompressedCloudSnapshot({ customLists: newLists });
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
    idbSaveSealedVault(newSealed, user?.uid || 'guest_user');

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'sealedVault', entry.id), entry);
        saveCompressedCloudSnapshot({ sealedEntries: newSealed });
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
    idbSaveSealedVault(newSealed, user?.uid || 'guest_user');

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'sealedVault', id));
        await saveCompressedCloudSnapshot({ sealedEntries: newSealed });
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
    idbSaveSealedVault(newSealed, user?.uid || 'guest_user');

    if (user && updatedItem) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'sealedVault', (updatedItem as PortfolioSealedEntry).id), updatedItem);
        saveCompressedCloudSnapshot({ sealedEntries: newSealed });
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
          subtitle: `Realized Sale @ $${(salePrice ?? 0).toLocaleString()}`,
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

  const handleTogglePublicProfile = async (isPublic: boolean) => {
    if (!user) {
      triggerGuestRestriction('Public Links Restricted', 'Public profile showcase links require an active account.');
      return;
    }
    if (isPublic && !canSharePublicLinks) {
      setLimitModalConfig({
        isOpen: true,
        action: 'SHARE_PUBLIC_LINK',
        details: { currentCount: 0, limitCount: 0 },
      });
      return;
    }
    triggerSyncPulse();
    setGuestPublicProfile(isPublic);
    try {
      localStorage.setItem('dd_guest_is_public', isPublic ? 'true' : 'false');
    } catch (e) {}

    try {
      if (updateUserProfile) {
        await updateUserProfile({ isPublicProfile: isPublic });
      }
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, { isPublicProfile: isPublic }, { merge: true });
        } catch (e) {
          console.warn('Firestore user doc public flag update:', e);
        }
        await saveCompressedCloudSnapshot({ isPublicProfile: isPublic });
      }
    } catch (err) {
      console.warn('Profile sync notice:', err);
    }
  };

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

    const isModalActiveWithBlur = !!paypalModalTier || limitModalConfig.isOpen || isCancelModalOpen || !!paypalSuccessData;

    return (
      <div className={`flex h-[100dvh] w-[100vw] overflow-hidden bg-dot-grid text-[#0F172A] transition-all duration-300 ${
        isModalActiveWithBlur ? 'filter blur-[5px] brightness-95 pointer-events-none select-none' : ''
      }`}>
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
        onSignOut={handleSignOut}
        onOpenAuth={() => navigate('/auth')}
      />

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Panel Top Header Bar (Continuously aligns with Sidebar's top border line h-16) */}
        <header className="h-16 flex items-center justify-between px-3 md:px-6 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] flex-shrink-0 z-20 shadow-xs gap-2 sm:gap-4">
          {/* Left: Mobile/Tablet Drawer Trigger + Section Header Tag & Title */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 -ml-1 rounded-lg text-[#0F172A] hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer flex items-center justify-center shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-[#0F172A]" />
            </button>
            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#DC143C] uppercase tracking-wider bg-[#FFF0F3] px-2 sm:px-2.5 py-1 rounded-md border border-[#DC143C]/20 flex-shrink-0">
              {sectionMeta[activeTab].tag}
            </span>
            <span className="text-[#CBD5E1] font-mono text-sm flex-shrink-0">/</span>
            <h1 className="font-heading font-bold text-sm sm:text-base md:text-lg text-[#0F172A] truncate">
              {sectionMeta[activeTab].title}
            </h1>
          </div>

          {/* Right: Dynamic Metric Badge & Pages Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs flex-shrink-0">
            <div className="hidden sm:flex h-8 sm:h-9 px-2.5 sm:px-3.5 bg-white border border-[#E2E8F0] text-[#0F172A] items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono font-bold rounded-md shadow-xs max-w-[150px] md:max-w-[220px] truncate">
              {activeTab === 'collection' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'decks' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'sets' && <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'lists' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'sealed_vault' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'metrics' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'search' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              {activeTab === 'settings' && <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DC143C] shrink-0" />}
              
              <span className="truncate">
                {activeTab === 'collection' && `Portfolio: ${decks.reduce((acc, d) => acc + (d.entries || []).reduce((sum, c) => sum + (c.quantity || 1), 0), 0)} Cards`}
                {activeTab === 'decks' && `Decks: ${decks.length}`}
                {activeTab === 'sets' && `${allSets.length} Expansions`}
                {activeTab === 'lists' && `Lists: ${customLists.length}`}
                {activeTab === 'sealed_vault' && `Vault: ${sealedEntries.length}`}
                {activeTab === 'metrics' && 'Market Stats'}
                {activeTab === 'search' && 'Card Database'}
                {activeTab === 'settings' && 'System Config'}
              </span>
            </div>
          </div>
        </header>

        {/* Scrollable View Area (Infinite Scrolling inside Panel) */}
        <main className="flex-1 overflow-y-auto flex flex-col min-h-0">
          <div className="flex-1">
            {activeTab === 'collection' && (
            <CollectionView
              decks={decks}
              allCards={effectiveCards}
              currency={displayCurrency}
              customLists={customLists}
              userEmail={user?.email || undefined}
              userId={user?.uid}
              currentTier={currentTier}
              onTriggerLimitModal={(action) => {
                setLimitModalConfig({
                  isOpen: true,
                  action,
                  details: { currentCount: 0, limitCount: 0 },
                });
              }}
              isPublicProfile={effectiveIsPublicProfile}
              onTogglePublicProfile={handleTogglePublicProfile}
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
              onNavigateToSearch={() => setActiveTab('search')}
              onLoadShowcase={!user ? handleLoadShowcaseData : undefined}
              onAddSampleDeck={!user ? handleLoadSampleDeck : undefined}
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
              userEmail={user?.email || undefined}
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
              onLoadShowcase={!user ? handleLoadShowcaseData : undefined}
              onAddSampleDeck={!user ? handleLoadSampleDeck : undefined}
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
              onTriggerLimitModal={(action) => {
                setLimitModalConfig({
                  isOpen: true,
                  action,
                  details: { currentCount: 0, limitCount: 0 },
                });
              }}
              decks={decks}
              soldEntries={allSoldEntries}
              customLists={customLists}
              exportDataSignal={exportDataSignal}
              onTriggerCloudSnapshot={saveCompressedCloudSnapshot}
              lastSyncedTimestamp={lastSyncedTimestamp}
              snapshotMetrics={snapshotMetrics}
              userEmail={user?.email}
              userId={user?.uid}
              isPublicProfile={effectiveIsPublicProfile}
              onTogglePublicProfile={handleTogglePublicProfile}
              onOpenBackupModal={() => {
                if (!user) {
                  triggerGuestRestriction(
                    'Backup & Cloud Restore Restricted',
                    'Cloud snapshot backups, automated restore points, and local encryption keys require signing in.'
                  );
                  return;
                }
                setIsBackupModalOpen(true);
              }}
              onSignOut={handleSignOut}
              onOpenAuth={() => navigate('/auth')}
            />
          )}

          </div>
 
          {/* Authenticated Workspace Footer Disclaimer */}
          <footer className="mt-auto pt-8 pb-6 border-t border-slate-200 text-center flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <Link to="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
              <span className="text-slate-300">•</span>
              <Link to="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 max-w-2xl text-center">
              DECK/divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

  return (
    <>
      <Routes>
        {/* === CORE MARKETING === */}
        <Route
          path="/"
          element={
            authLoading ? (
              <div className="flex h-screen w-screen items-center justify-center bg-dot-grid bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-3">
                  <DeckDividerBrand size="md" showLogo={true} />
                  <Loader2 className="w-5 h-5 animate-spin text-[#DC143C]" />
                </div>
              </div>
            ) : user && !location.search.includes('landing=true') ? (
              <Navigate to="/app" replace />
            ) : (
              <LandingPageView
                onEnterApp={() => {
                  if (user) {
                    navigate('/app');
                  } else {
                    handleSetGuestMode(true);
                    navigate('/app');
                  }
                }}
                onOpenAuth={handleOpenAuth}
                onNavigateAbout={() => navigate('/about')}
                onNavigateHowItWorks={() => navigate('/how-it-works')}
                onSelectTier={(tier) => {
                  if (user) {
                    if (tier !== 'Starter') {
                      setPaypalModalTier(tier);
                    }
                    navigate('/app');
                  } else {
                    handleOpenAuth();
                  }
                }}
                currentTier={currentTier}
                displayCurrency={displayCurrency}
                onSelectCurrency={setDisplayCurrency}
                user={user}
              />
            )
          }
        />
        <Route path="/about" element={<AboutPageView onOpenAuth={handleOpenAuth} onNavigateHome={() => navigate('/')} onNavigateHowItWorks={() => navigate('/how-it-works')} displayCurrency={displayCurrency} />} />
        <Route path="/how-it-works" element={<HowItWorksPageView onOpenAuth={handleOpenAuth} onNavigateHome={() => navigate('/')} onNavigateAbout={() => navigate('/about')} displayCurrency={displayCurrency} />} />
        <Route path="/pricing" element={<PricingPageView onOpenAuth={handleOpenAuth} onEnterApp={() => navigate('/app')} currentTier={currentTier} onSelectTier={(tier) => { if (!user) { handleOpenAuth(); } else { handleChangeTier(tier); } }} displayCurrency={displayCurrency} user={user} />} />
        <Route path="/faq" element={<FaqPageView onOpenAuth={handleOpenAuth} onEnterApp={() => navigate('/app')} displayCurrency={displayCurrency} user={user} />} />
        <Route path="/contact" element={<ContactPageView onOpenAuth={handleOpenAuth} onNavigateHome={() => navigate('/')} onNavigateHowItWorks={() => navigate('/how-it-works')} />} />

        {/* === LEGAL & TRUST === */}
        <Route path="/privacy" element={<PrivacyPolicyView onOpenAuth={handleOpenAuth} onNavigateHome={() => navigate('/')} onNavigateHowItWorks={() => navigate('/how-it-works')} />} />
        <Route path="/terms" element={<TermsOfServiceView onOpenAuth={handleOpenAuth} onNavigateHome={() => navigate('/')} onNavigateHowItWorks={() => navigate('/how-it-works')} />} />
        <Route path="/security" element={<SecurityPageView onOpenAuth={handleOpenAuth} onNavigateHome={() => navigate('/')} onNavigateHowItWorks={() => navigate('/how-it-works')} />} />

        {/* === PUBLIC DIRECTORIES === */}
        <Route path="/sets" element={<PublicSetsDirectoryView />} />
        <Route path="/formats" element={<FormatLegalityDirectoryView />} />
        <Route path="/compare" element={<CompetitorComparisonView />} />
        <Route path="/best" element={<BestOfGuidesView />} />
        <Route path="/leaderboard" element={<CommunityLeaderboardView />} />
        <Route path="/tools" element={<HighIntentToolsView />} />
        <Route path="/socials" element={<PublicSocialsView />} />
        <Route path="/reviews" element={<PublicSocialsView />} />

        {/* === PUBLIC ENTITIES (Singular Canonical Paths) === */}
        <Route path="/set/:setId" element={<PublicSetView />} />
        <Route path="/set/:setId/top-cards" element={<PublicSetTopCardsView />} />
        <Route path="/format/:formatId" element={<FormatLegalityView />} />
        <Route path="/compare/:competitorId" element={<CompetitorComparisonView />} />
        <Route path="/best/:slug" element={<BestOfGuidesView />} />
        <Route path="/tool/:toolId" element={<HighIntentToolsView />} />
        <Route path="/deck/:deckId" element={<PublicDeckViewRoute displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} />} />
        <Route path="/portfolio/:shareId" element={<PublicPortfolioView />} />

        {/* === ALIASES FOR LEGACY & PLURALS === */}
        <Route path="/formats/:formatId" element={<FormatLegalityView />} />
        <Route path="/tools/:toolId" element={<HighIntentToolsView />} />
        <Route path="/decks/:deckId" element={<PublicDeckViewRoute displayCurrency={displayCurrency} setDisplayCurrency={setDisplayCurrency} />} />
        <Route path="/portfolios/:shareId" element={<PublicPortfolioView />} />
        <Route path="/support" element={<Navigate to="/contact" replace />} />
        <Route path="/features" element={<Navigate to="/" replace />} />
        <Route path="/changelog" element={<Navigate to="/" replace />} />
        <Route path="/cookie-policy" element={<Navigate to="/privacy" replace />} />
        <Route path="/media-kit" element={<Navigate to="/about" replace />} />
        <Route path="/community" element={<Navigate to="/leaderboard" replace />} />

        {/* === AUTH & ADMIN === */}
        <Route path="/auth" element={<AuthView onBack={() => navigate('/')} onGuestAccess={() => { handleSetGuestMode(true); navigate('/app'); }} />} />
        <Route path="/admin/*" element={<AdminDashboardView />} />

        {/* === AUTHENTICATED APP === */}
        <Route path="/app/*" element={renderDashboard()} />
        <Route path="/app" element={renderDashboard()} />
        <Route path="*" element={<NotFoundView />} />
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

      <GuestLimitModal
        isOpen={guestModalConfig.isOpen}
        onClose={() => setGuestModalConfig({ ...guestModalConfig, isOpen: false })}
        onOpenAuth={() => {
          setGuestModalConfig({ ...guestModalConfig, isOpen: false });
          navigate('/auth');
        }}
        actionTitle={guestModalConfig.title}
        actionDescription={guestModalConfig.description}
      />

      <PayPalSubscriptionModal
        isOpen={!!paypalModalTier}
        onClose={() => setPaypalModalTier(null)}
        tierName={paypalModalTier || 'Bunch'}
        planId={
          (paypalModalTier && paypalConfig?.planIds?.[paypalModalTier]) || ''
        }
        clientId={
          paypalConfig?.clientId || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || ''
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

      <AnalyticsFunnelModal
        isOpen={isFunnelModalOpen}
        onClose={() => setIsFunnelModalOpen(false)}
      />

      <BackupRecoveryModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        userId={user?.uid || 'guest_user'}
        userEmail={user?.email || undefined}
        activeState={{
          version: 2,
          userId: user?.uid || 'guest_user',
          updatedAt: new Date().toISOString(),
          profile: {
            displayName: profile?.displayName || user?.displayName || '',
            email: user?.email || '',
            tier: currentTier,
            currency: displayCurrency,
          },
          decks,
          customLists,
          sealedEntries,
          soldEntries: allSoldEntries,
          recentActivities,
        }}
        onRestoreState={handleRestoreState}
        onTriggerNewBackup={() => saveCompressedCloudSnapshot()}
      />
    </>
  );
}
