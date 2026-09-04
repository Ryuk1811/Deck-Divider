import React, { useState, useEffect, useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft,
  PieChart as PieIcon,
  Layers,
  Swords,
  Grid,
  Zap,
  Activity,
  AlertTriangle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { unpackUserSnapshot } from '../lib/snapshotEngine';
import { SharedPortfolioSnapshot, PortfolioCardEntry } from '../types';
import { DeckDividerBrand } from '../components/DeckDividerBrand';
import { formatCurrency } from '../utils/formatters';
import { decodeUrlParamToPortfolio } from '../utils/portfolioUrlEncoder';
import { CardImage } from '../components/CardImage';

export const PublicPortfolioView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SharedPortfolioSnapshot | null>(null);
  const [activeTab, setActiveTab] = useState<'collection' | 'decks' | 'sealed' | 'lists'>('collection');

  useEffect(() => {
    const fetchPortfolio = async () => {
      // 1. Check URL-encoded snapshot param first for instant, zero-latency loading
      const urlParam = searchParams.get('d') || searchParams.get('data');
      if (urlParam) {
        const decoded = decodeUrlParamToPortfolio(urlParam);
        if (decoded) {
          setSnapshot(decoded);
          setLoading(false);
          return;
        }
      }

      if (!shareId) {
        setError('No portfolio identifier provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 2. Try fetching the compressed cloud snapshot from Firestore
        let docSnap = null;
        try {
          const docRef = doc(db, 'users', shareId, 'snapshot', 'current');
          docSnap = await getDoc(docRef);
        } catch (readErr) {
          console.warn('Snapshot fetch notice:', readErr);
        }

        if (docSnap && docSnap.exists()) {
          const data = docSnap.data();
          const isExplicitlyPublic = Boolean(
            data.isPublicProfile ||
            (data as any).isPublic ||
            (data as any).profile?.isPublicProfile
          );

          if (isExplicitlyPublic) {
            const unpacked = await unpackUserSnapshot(data);
            if (unpacked) {
              setSnapshot(unpacked);
              setLoading(false);
              return;
            }
          }

          // If snapshot doc is present but isPublicProfile is not set directly, check user doc
          try {
            const userRef = doc(db, 'users', shareId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && (userSnap.data().isPublicProfile || userSnap.data().isPublic)) {
              const unpacked = await unpackUserSnapshot(data);
              if (unpacked) {
                setSnapshot(unpacked);
                setLoading(false);
                return;
              }
            }
          } catch (userErr) {
            console.warn('User doc check notice:', userErr);
          }

          setError('This portfolio is set to private.');
          setLoading(false);
          return;
        }

        // 3. Check user document directly
        try {
          const userRef = doc(db, 'users', shareId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && (userSnap.data().isPublicProfile || userSnap.data().isPublic)) {
            const userData = userSnap.data();
            setSnapshot({
              version: 2,
              userId: shareId,
              updatedAt: new Date().toISOString(),
              profile: {
                displayName: userData.displayName || 'Collector',
                email: userData.email,
                tier: userData.tier || 'Starter',
                currency: userData.currency || 'USD',
                isPublicProfile: true,
              },
              decks: [],
              customLists: [],
              sealedEntries: [],
              soldEntries: [],
              recentActivities: [],
            });
            setLoading(false);
            return;
          }
        } catch (userErr) {
          console.warn('Direct user doc fetch notice:', userErr);
        }

        // 4. Fallback for guest mode or local browser testing
        if (shareId === 'guest' || shareId === 'guest_user' || localStorage.getItem('dd_guest_is_public') === 'true') {
          const isGuestPublic = localStorage.getItem('dd_guest_is_public') === 'true' || shareId === 'guest';
          if (isGuestPublic) {
            try {
              const { idbGetUserDecks, idbGetCustomLists, idbGetSealedVault } = await import('../lib/indexedDB');
              const localDecks = await idbGetUserDecks(shareId);
              const localLists = await idbGetCustomLists(shareId);
              const localSealed = await idbGetSealedVault(shareId);

              if (localDecks.length > 0 || localLists.length > 0 || localSealed.length > 0) {
                setSnapshot({
                  version: 2,
                  userId: shareId,
                  updatedAt: new Date().toISOString(),
                  profile: {
                    displayName: 'Guest Collector',
                    tier: 'Starter',
                    currency: 'USD',
                    isPublicProfile: true,
                  },
                  decks: localDecks,
                  customLists: localLists,
                  sealedEntries: localSealed,
                  soldEntries: [],
                  recentActivities: [],
                });
                setLoading(false);
                return;
              }
            } catch (localErr) {
              console.warn('Local guest fallback notice:', localErr);
            }
          }
        }

        setError('Portfolio not found or is set to private.');
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Could not load portfolio.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [shareId, searchParams]);

  const currency = (snapshot?.profile?.currency as any) || 'USD';

  // Aggregate all unique cards across all decks
  const allCardsList = useMemo(() => {
    if (!snapshot) return [];
    const map = new Map<string, PortfolioCardEntry>();
    snapshot.decks.forEach((deck) => {
      deck.entries.forEach((entry) => {
        const cardId = entry.card?.id || entry.id;
        if (!map.has(cardId)) {
          map.set(cardId, { ...entry });
        } else {
          const existing = map.get(cardId)!;
          map.set(cardId, { ...existing, quantity: existing.quantity + entry.quantity });
        }
      });
    });
    return Array.from(map.values());
  }, [snapshot]);

  // Calculate total market valuation
  const totalValuation = useMemo(() => {
    if (!snapshot) return 0;
    const cardsVal = allCardsList.reduce((sum, item) => {
      const price = item.purchasePrice || item.card?.prices?.raw || 0;
      return sum + price * item.quantity;
    }, 0);
    const sealedVal = snapshot.sealedEntries.reduce((sum, s) => {
      const price = s.product?.marketPrice || s.purchasePrice || 0;
      return sum + price * s.quantity;
    }, 0);
    return cardsVal + sealedVal;
  }, [snapshot, allCardsList]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-8 h-8 rounded-full border-2 border-[#DC143C] border-t-transparent animate-spin mb-4"></div>
        <p className="text-sm font-medium text-slate-500">Loading Portfolio...</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 font-heading mb-2">Unavailable</h2>
        <p className="text-sm text-slate-600 mb-6">{error || 'Something went wrong'}</p>
        <Link to="/" className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <DeckDividerBrand size="sm" showLogo={true} />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span>PUBLIC SHOWCASE</span>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-slate-900 pt-12 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#DC143C]" />
            <span>Verified Collector Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {snapshot.profile?.displayName || 'Collector'}'s Portfolio
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Viewing a public read-only collection tracking {snapshot.decks.length} decks, {allCardsList.length} distinct cards, and sealed vault assets.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-slate-100 px-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('collection')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'collection' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Cards Gallery ({allCardsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('decks')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'decks' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Decks ({snapshot.decks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sealed')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'sealed' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Sealed Vault ({snapshot.sealedEntries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'lists' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Custom Lists ({snapshot.customLists.length})</span>
            </button>
          </div>

          <div className="p-6 min-h-[400px]">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Valuation</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  {formatCurrency(totalValuation, currency)}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Cards</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  {allCardsList.reduce((acc, c) => acc + c.quantity, 0)}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Active Decks</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">{snapshot.decks.length}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Sealed Vault</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">{snapshot.sealedEntries.length}</span>
              </div>
            </div>

            {activeTab === 'collection' && (
              <div>
                {allCardsList.length === 0 ? (
                  <div className="py-16 text-center text-slate-400">
                    <Grid className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium">No cards currently in this collection showcase.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {allCardsList.map((entry) => (
                      <div
                        key={entry.id}
                        className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#DC143C]/50 hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="relative aspect-[63/88] w-full bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                          {entry.card ? (
                            <CardImage
                              src={entry.card.images?.small || entry.card.images?.large}
                              alt={entry.card.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-xs font-mono text-slate-400">Card {entry.id}</div>
                          )}
                          {entry.quantity > 1 && (
                            <div className="absolute top-2 right-2 bg-slate-900/90 text-white text-[11px] font-black px-2 py-0.5 rounded-md font-mono shadow-xs">
                              x{entry.quantity}
                            </div>
                          )}
                          {entry.notes?.includes('Foil') && (
                            <div className="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <Sparkles className="w-2.5 h-2.5" /> Foil
                            </div>
                          )}
                          {entry.gradingInfo && (
                            <div className="absolute bottom-2 left-2 bg-[#DC143C] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md font-mono shadow-xs">
                              {entry.gradingInfo.company} {entry.gradingInfo.grade}
                            </div>
                          )}
                        </div>

                        <div className="p-2.5 flex flex-col justify-between flex-1 border-t border-slate-100 bg-white">
                          <div>
                            <div className="text-xs font-bold text-slate-900 truncate" title={entry.card?.name}>
                              {entry.card?.name || 'Pokemon Card'}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate font-mono">
                              {entry.card?.set?.name || 'Set'} · {entry.card?.number || ''}
                            </div>
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-mono text-[10px]">Market</span>
                            <span className="font-bold text-slate-900 font-mono">
                              {formatCurrency(entry.purchasePrice || entry.card?.prices?.raw || 0, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'decks' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {snapshot.decks.map(deck => (
                  <div key={deck.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: deck.colorHex || '#DC143C' }}></div>
                      <h3 className="font-bold text-slate-900 truncate">{deck.name}</h3>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
                      <span>{deck.entries.reduce((a, b) => a + b.quantity, 0)} Cards</span>
                      <Link to={`/deck/${deck.id}`} className="text-[#DC143C] font-semibold hover:underline">
                        View Deck →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'sealed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {snapshot.sealedEntries.map(entry => (
                  <div key={entry.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 truncate">
                      {entry.product?.name || (entry as unknown as { name?: string }).name || 'Sealed Item'}
                    </h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Qty: {entry.quantity}</span>
                      <span className="font-semibold text-slate-700">
                        {entry.product?.type || (entry as unknown as { productType?: string }).productType || 'Sealed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'lists' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {snapshot.customLists.map(list => (
                  <div key={list.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{list.name}</h3>
                    <span className="text-xs text-slate-500">{list.cardIds.length} Items</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
