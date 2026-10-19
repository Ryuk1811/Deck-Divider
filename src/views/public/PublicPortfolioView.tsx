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
  ShieldCheck,
  Code2,
  Share2,
  Check,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { unpackUserSnapshot } from '../../lib/snapshotEngine';
import { SharedPortfolioSnapshot, PortfolioCardEntry, TIER_LIMITS, PokemonCard } from '../../types';
import { DeckDividerBrand } from '../../components/ui/DeckDividerBrand';
import { formatCurrency } from '../../utils/formatters';
import { decodeUrlParamToPortfolio } from '../../utils/portfolioUrlEncoder';
import { encodeDeckToUrlParam } from '../../utils/deckUrlEncoder';
import { CardImage } from '../../components/ui/CardImage';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { getPublicPortfolioSchema } from '../../components/seo/schemaData';
import { EmbedBadgeModal } from '../../components/modals/EmbedBadgeModal';
import { PublicCardDetailModal } from '../../components/modals/PublicCardDetailModal';
import { BragShareModal } from '../../components/modals/BragShareModal';

export const PublicPortfolioView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<SharedPortfolioSnapshot | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [showBragModal, setShowBragModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'collection' | 'decks' | 'sealed' | 'lists'>('collection');

  // Interactive Binder & Inspection state
  const [collectionDisplayMode, setCollectionDisplayMode] = useState<'binder' | 'grid' | 'masterset'>('binder');
  const [binderPage, setBinderPage] = useState(1);
  const [selectedCardForModal, setSelectedCardForModal] = useState<PokemonCard | null>(null);
  const [wantListOnly, setWantListOnly] = useState(false);

  const CARDS_PER_BINDER_PAGE = 9; // Authentic 3x3 9-pocket archival sleeve

  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Failed to copy public link:', err);
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      // 1. Check URL-encoded snapshot param first for instant, zero-latency loading
      const urlParam = searchParams.get('d') || searchParams.get('data');
      if (urlParam) {
        const decoded = decodeUrlParamToPortfolio(urlParam);
        if (decoded) {
          const ownerTier = decoded.profile?.tier || 'Stack';
          if (ownerTier !== 'Starter' || decoded.profile?.isPublicProfile) {
            setSnapshot(decoded);
            setLoading(false);
            return;
          }
          if (!TIER_LIMITS[ownerTier]?.canSharePublicLinks) {
            setError('Public link sharing is restricted to Stack tier ($7/mo) and above.');
            setLoading(false);
            return;
          }
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

      if (shareId === 'guest' || shareId === 'guest_user') {
        setError('Guest portfolios cannot be shared publicly. Upgrade to Stack tier to generate shareable links.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 2. Fetch compressed cloud snapshot from Firestore
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
              const ownerTier = unpacked.profile?.tier || 'Stack';
              if (!TIER_LIMITS[ownerTier]?.canSharePublicLinks) {
                setError('This portfolio is private or the user tier does not support public sharing.');
                setLoading(false);
                return;
              }
              setSnapshot(unpacked);
              setLoading(false);
              return;
            }
          }

          try {
            const userRef = doc(db, 'users', shareId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists() && (userSnap.data().isPublicProfile || userSnap.data().isPublic)) {
              const unpacked = await unpackUserSnapshot(data);
              if (unpacked) {
                const ownerTier = unpacked.profile?.tier || userSnap.data().tier || 'Stack';
                if (!TIER_LIMITS[ownerTier]?.canSharePublicLinks) {
                  setError('This portfolio is private or the user tier does not support public sharing.');
                  setLoading(false);
                  return;
                }
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

        // 3. Fallback check user document directly
        try {
          const userRef = doc(db, 'users', shareId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists() && (userSnap.data().isPublicProfile || userSnap.data().isPublic)) {
            const userData = userSnap.data();
            const ownerTier = userData.tier || 'Stack';
            if (!TIER_LIMITS[ownerTier]?.canSharePublicLinks) {
              setError('This portfolio is private or the user tier does not support public sharing.');
              setLoading(false);
              return;
            }
            setSnapshot({
              version: 2,
              userId: shareId,
              updatedAt: new Date().toISOString(),
              profile: {
                displayName: userData.displayName || 'Collector',
                email: userData.email,
                tier: userData.tier || 'Stack',
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
  const decksList = Array.isArray(snapshot?.decks) ? snapshot.decks : [];
  const sealedList = Array.isArray(snapshot?.sealedEntries) ? snapshot.sealedEntries : [];
  const listsList = Array.isArray(snapshot?.customLists) ? snapshot.customLists : [];

  // Aggregate all unique cards across all decks and portfolio collections
  const allCardsList = useMemo(() => {
    if (!snapshot || !Array.isArray(snapshot.decks)) return [];
    const map = new Map<string, PortfolioCardEntry>();
    snapshot.decks.forEach((deck) => {
      (deck?.entries || []).forEach((entry) => {
        const cardId = entry?.card?.id || (entry as any)?.cardId || entry?.id;
        if (!cardId) return;
        if (!map.has(cardId)) {
          map.set(cardId, { ...entry, quantity: entry.quantity || 1 });
        } else {
          const existing = map.get(cardId)!;
          map.set(cardId, { ...existing, quantity: (existing.quantity || 1) + (entry.quantity || 1) });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => {
      const priceA = a.purchasePrice || a.card?.prices?.raw || 0;
      const priceB = b.purchasePrice || b.card?.prices?.raw || 0;
      return priceB - priceA;
    });
  }, [snapshot]);

  // Total market valuation
  const totalValuation = useMemo(() => {
    if (!snapshot) return 0;
    const cardsVal = allCardsList.reduce((sum, item) => {
      const price = item.purchasePrice || item.card?.prices?.raw || 1.5;
      return sum + price * (item.quantity || 1);
    }, 0);
    const sealedVal = sealedList.reduce((sum, item) => {
      const p = item.product?.marketPrice || item.purchasePrice || 45;
      return sum + p * (item.quantity || 1);
    }, 0);
    return cardsVal + sealedVal;
  }, [snapshot, allCardsList, sealedList]);

  // Master Set Progress breakdown
  const masterSetProgress = useMemo(() => {
    const setGroups = new Map<string, { setName: string; cards: PortfolioCardEntry[]; totalEstimate: number }>();
    allCardsList.forEach((entry) => {
      const sName = entry.card?.set?.name || 'Expansion';
      if (!setGroups.has(sName)) {
        setGroups.set(sName, { setName: sName, cards: [], totalEstimate: 165 });
      }
      setGroups.get(sName)!.cards.push(entry);
    });

    return Array.from(setGroups.values()).sort((a, b) => b.cards.length - a.cards.length);
  }, [allCardsList]);

  // Binder Pagination
  const totalBinderPages = Math.max(1, Math.ceil(allCardsList.length / CARDS_PER_BINDER_PAGE));
  const currentBinderCards = useMemo(() => {
    const startIndex = (binderPage - 1) * CARDS_PER_BINDER_PAGE;
    return allCardsList.slice(startIndex, startIndex + CARDS_PER_BINDER_PAGE);
  }, [allCardsList, binderPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dot-grid flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-4 border-[#DC143C]/20 border-t-[#DC143C] rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-heading font-black text-slate-800">Opening Collector Vault...</h2>
        <p className="text-sm font-mono text-slate-500 mt-1">Retrieving 9-pocket archival sleeve cards</p>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen bg-dot-grid flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#DC143C] border border-red-200 flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-heading font-black text-slate-900 mb-2">Vault Unavailable</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          {error || 'The requested Pokémon card portfolio could not be found or has not been made public by its owner.'}
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          Return to DECK / divider Home
        </Link>
      </div>
    );
  }

  const collectorName = snapshot.profile?.displayName || 'Collector';

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title={`${collectorName}'s Pokémon TCG Binder & Slabs | DECK / divider`}
        description={`Interactive 9-pocket web binder and graded slab vault for ${collectorName}. Holds ${allCardsList.length} cards, ${decksList.length} tournament decks, and live TCGplayer market NAV valuation.`}
        canonicalPath={`/portfolio/${shareId || 'showcase'}`}
        ogImage={`https://deckdivider.app/api/og/portfolio/${shareId || 'showcase'}.png?title=${encodeURIComponent(collectorName)}&cards=${allCardsList.length}&value=${Math.round(totalValuation)}`}
        keywords={[
          'pokemon card portfolio',
          'pokemon collection showcase',
          'pokemon card binder online',
          'interactive 9-pocket binder',
          'tcgplayer portfolio tracker'
        ]}
        schema={getPublicPortfolioSchema(collectorName, allCardsList.length, totalValuation)}
      />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <DeckDividerBrand size="sm" showLogo={true} />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share Showcase Button */}
            <button
              type="button"
              onClick={() => setShowBragModal(true)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-mono font-bold text-white bg-[#DC143C] hover:bg-[#B01030] rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Share Showcase</span>
            </button>

            {/* Embed Badge */}
            <button
              type="button"
              onClick={() => setShowEmbedModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[#0F172A] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl shadow-2xs transition-all cursor-pointer"
              title="Embed live portfolio badge"
            >
              <Code2 className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Badge</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-[#0F172A] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-xl shadow-2xs transition-all cursor-pointer"
              title="Copy link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Share2 className="w-3.5 h-3.5 text-[#64748B]" />}
              <span className="hidden sm:inline">{copiedLink ? 'Copied' : 'Link'}</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#16A34A] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span className="text-[11px]">VERIFIED VAULT</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-white border-b border-[#E2E8F0] pt-6 pb-8 px-4 shadow-xs">
        <div className="max-w-5xl mx-auto space-y-4">
          <GeoBreadcrumbs
            items={[
              { label: 'Leaderboard', path: '/leaderboard' },
              { label: `${collectorName}'s Vault`, path: `/portfolio/${shareId || 'showcase'}` },
            ]}
          />
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DC143C]" />
              <span>Public Web Binder &amp; Slab Showcase</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] font-heading tracking-tight">
              {collectorName}'s Pokémon Binder
            </h1>
            <p className="text-[#64748B] text-sm sm:text-base max-w-2xl mx-auto">
              Interactive 9-pocket archival sleeve binder tracking {allCardsList.length} cards, {decksList.length} tournament decks, and certified PSA/BGS slabs.
            </p>
          </div>
        </div>
      </div>

      {/* PTC Partner Offer */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 pt-6">
        <PtcPartnerBanner />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <GeoExtractableBlock
          className="mb-6"
          heading={`Verified Collector Vault: ${collectorName}`}
          summary={`This public showcase represents a verified Pokémon TCG portfolio tracked on DECK / divider. It holds ${allCardsList.length} unique card entries across ${decksList.length} decks and ${sealedList.length} sealed items, with an aggregate market valuation of ${formatCurrency(totalValuation, currency)}.`}
          keyFacts={[
            { label: 'Collector', value: collectorName },
            { label: 'Unique Cards', value: `${allCardsList.length} Cards` },
            { label: 'Custom Decks', value: `${decksList.length} Decks` },
            { label: 'Total Valuation', value: formatCurrency(totalValuation, currency) },
          ]}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Main Tabs */}
          <div className="flex items-center border-b border-slate-100 px-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('collection')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'collection' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Binder &amp; Collection ({allCardsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('decks')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'decks' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Decks ({decksList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sealed')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'sealed' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Sealed Vault ({sealedList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('lists')}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'lists' ? 'border-[#DC143C] text-[#DC143C]' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Custom Lists ({listsList.length})</span>
            </button>
          </div>

          <div className="p-6 min-h-[400px]">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Valuation</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 font-heading">
                  {formatCurrency(totalValuation, currency)}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Cards</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  {allCardsList.reduce((acc, c) => acc + (c.quantity || 1), 0)}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Active Decks</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 font-heading">{decksList.length}</span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Top Card Value</span>
                <span className="text-xl sm:text-2xl font-black text-[#DC143C] font-heading">
                  {formatCurrency(allCardsList[0]?.purchasePrice || allCardsList[0]?.card?.prices?.raw || 0, currency)}
                </span>
              </div>
            </div>

            {/* TAB 1: COLLECTION / BINDER */}
            {activeTab === 'collection' && (
              <div className="space-y-6">
                {/* Mode Switcher Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setCollectionDisplayMode('binder')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                        collectionDisplayMode === 'binder'
                          ? 'bg-[#DC143C] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>9-Pocket Binder</span>
                    </button>
                    <button
                      onClick={() => setCollectionDisplayMode('grid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                        collectionDisplayMode === 'grid'
                          ? 'bg-[#DC143C] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>Gallery Grid</span>
                    </button>
                    <button
                      onClick={() => setCollectionDisplayMode('masterset')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                        collectionDisplayMode === 'masterset'
                          ? 'bg-[#DC143C] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Master Set Progress</span>
                    </button>
                  </div>

                  {collectionDisplayMode === 'binder' && (
                    <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
                      <button
                        onClick={() => setBinderPage((p) => Math.max(1, p - 1))}
                        disabled={binderPage <= 1}
                        className="p-1 rounded bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-100"
                        title="Previous Binder Page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-slate-800">
                        Page {binderPage} / {totalBinderPages}
                      </span>
                      <button
                        onClick={() => setBinderPage((p) => Math.min(totalBinderPages, p + 1))}
                        disabled={binderPage >= totalBinderPages}
                        className="p-1 rounded bg-white border border-slate-200 disabled:opacity-30 hover:bg-slate-100"
                        title="Next Binder Page"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {collectionDisplayMode === 'masterset' && (
                    <button
                      onClick={() => setWantListOnly(!wantListOnly)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border ${
                        wantListOnly
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Filter className="w-3.5 h-3.5" />
                      <span>{wantListOnly ? 'Showing Want-List Only' : 'Toggle Want-List Mode'}</span>
                    </button>
                  )}
                </div>

                {/* VIEW MODE 1: THE AUTHENTIC 9-POCKET BINDER */}
                {collectionDisplayMode === 'binder' && (
                  <div>
                    {allCardsList.length === 0 ? (
                      <div className="py-16 text-center text-slate-400">
                        <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-40" />
                        <p className="text-sm font-medium">This binder is currently empty.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Archival Binder Sleeve Surface */}
                        <div className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black rounded-3xl p-4 sm:p-7 shadow-2xl border-4 border-slate-800">
                          {/* Binder Rings on Left Border */}
                          <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-around pointer-events-none hidden sm:flex">
                            {[1, 2, 3].map((r) => (
                              <div
                                key={r}
                                className="w-3 h-10 rounded-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 shadow-md border border-slate-500/50"
                              />
                            ))}
                          </div>

                          {/* 3x3 9-Pocket Sleeve Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5 sm:ml-4">
                            {Array.from({ length: 9 }).map((_, slotIdx) => {
                              const entry = currentBinderCards[slotIdx];
                              if (!entry || !entry.card) {
                                return (
                                  <div
                                    key={`empty-${slotIdx}`}
                                    className="aspect-[63/88] rounded-xl border-2 border-dashed border-slate-800/80 bg-slate-900/40 flex flex-col items-center justify-center p-3 text-slate-700 select-none"
                                  >
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-700">
                                      Pocket #{slotIdx + 1}
                                    </span>
                                    <span className="text-xs text-slate-800 mt-1">Empty Slot</span>
                                  </div>
                                );
                              }

                              const card = entry.card;
                              const hasGrading = Boolean(entry.gradingInfo);
                              const isFoil = Boolean(entry.notes?.includes('Foil'));

                              return (
                                <div
                                  key={entry.id}
                                  onClick={() => setSelectedCardForModal(card)}
                                  className="group relative aspect-[63/88] rounded-2xl p-1.5 sm:p-2 bg-gradient-to-b from-slate-800/60 to-slate-900/80 border border-slate-700/60 hover:border-amber-400/80 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between overflow-hidden"
                                >
                                  {/* Holographic foil glimmer effect on foil cards */}
                                  {isFoil && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-75 transition-opacity" />
                                  )}

                                  {/* Pocket Sleeving Header Badges */}
                                  <div className="flex items-center justify-between gap-1 z-10">
                                    {hasGrading ? (
                                      <span className="px-1.5 py-0.5 rounded bg-[#DC143C] text-white text-[9px] sm:text-[10px] font-black font-mono shadow-xs">
                                        {entry.gradingInfo?.company} {entry.gradingInfo?.grade}
                                      </span>
                                    ) : (
                                      <span className="px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-300 text-[9px] font-mono">
                                        {entry.condition || 'NM'}
                                      </span>
                                    )}

                                    {(entry.quantity || 1) > 1 && (
                                      <span className="px-1.5 py-0.5 rounded bg-white text-slate-900 text-[10px] font-mono font-black shadow-xs">
                                        x{entry.quantity}
                                      </span>
                                    )}
                                  </div>

                                  {/* Card Image */}
                                  <div className="relative flex-1 w-full flex items-center justify-center p-1 overflow-hidden">
                                    <CardImage
                                      src={card.images?.small || card.images?.large}
                                      alt={card.name}
                                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                                    />
                                    {/* Inspection overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                                      <span className="px-2.5 py-1 bg-white/90 text-slate-900 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs">
                                        <Eye className="w-3 h-3 text-[#DC143C]" /> Inspect
                                      </span>
                                    </div>
                                  </div>

                                  {/* Pocket Card Info Footprint */}
                                  <div className="pt-1 z-10 flex items-center justify-between text-[11px] font-mono border-t border-slate-700/60 text-slate-300">
                                    <span className="truncate max-w-[90px] font-bold text-slate-200">
                                      {card.name}
                                    </span>
                                    <span className="text-amber-400 font-bold">
                                      {formatCurrency(entry.purchasePrice || card.prices?.raw || 1.5, currency)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Binder Footprint Ribbon */}
                          <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 font-mono gap-2">
                            <span>
                              Showing Archival Page {binderPage} of {totalBinderPages} • {allCardsList.length} Total Cards
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setBinderPage((p) => Math.max(1, p - 1))}
                                disabled={binderPage <= 1}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30"
                              >
                                ← Prev
                              </button>
                              <button
                                onClick={() => setBinderPage((p) => Math.min(totalBinderPages, p + 1))}
                                disabled={binderPage >= totalBinderPages}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-30"
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* VIEW MODE 2: GALLERY GRID */}
                {collectionDisplayMode === 'grid' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {allCardsList.map((entry) => (
                      <div
                        key={entry.id}
                        onClick={() => entry.card && setSelectedCardForModal(entry.card)}
                        className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-[#DC143C]/50 hover:shadow-md transition-all flex flex-col cursor-pointer"
                      >
                        <div className="relative aspect-[63/88] w-full bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                          {entry.card ? (
                            <CardImage
                              src={entry.card.images?.small || entry.card.images?.large}
                              alt={entry.card.name || 'Card'}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="text-xs font-mono text-slate-400">Card {entry.id}</div>
                          )}
                          {(entry.quantity || 1) > 1 && (
                            <div className="absolute top-2 right-2 bg-white text-[#0F172A] border border-[#CBD5E1] text-[11px] font-black px-2 py-0.5 rounded-md font-mono shadow-xs">
                              x{entry.quantity}
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
                              {formatCurrency(entry.purchasePrice || entry.card?.prices?.raw || 1.5, currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* VIEW MODE 3: MASTER SET PROGRESS & WANT-LIST */}
                {collectionDisplayMode === 'masterset' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-xs font-mono font-bold uppercase text-amber-400 mb-1 flex items-center gap-1.5">
                          <Layers className="w-4 h-4" /> Master Set Completion Tracker
                        </div>
                        <p className="text-xs text-slate-200">
                          Track progress towards complete master binders. Share your want-list with local card trade groups!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowBragModal(true)}
                        className="px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold rounded-xl transition-colors shrink-0"
                      >
                        Share Want-List
                      </button>
                    </div>

                    <div className="space-y-4">
                      {masterSetProgress.map((group) => {
                        const collectedCount = group.cards.length;
                        const totalCardsTarget = group.totalEstimate;
                        const pct = Math.min(100, Math.round((collectedCount / totalCardsTarget) * 100));

                        return (
                          <div
                            key={group.setName}
                            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <h3 className="font-heading font-black text-slate-900 text-base">
                                  {group.setName}
                                </h3>
                                <div className="text-xs font-mono text-slate-500">
                                  {collectedCount} of {totalCardsTarget} Cards Collected ({pct}% Complete)
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                  {totalCardsTarget - collectedCount} Cards Missing
                                </span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#DC143C] h-full rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            {/* Cards in this set */}
                            <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 pt-2">
                              {group.cards.slice(0, 16).map((c) => (
                                <div
                                  key={c.id}
                                  onClick={() => c.card && setSelectedCardForModal(c.card)}
                                  className="aspect-[63/88] rounded-lg overflow-hidden bg-slate-50 border border-slate-200 hover:border-[#DC143C] cursor-pointer p-1 transition-all"
                                  title={`${c.card?.name} #${c.card?.number}`}
                                >
                                  {c.card && (
                                    <CardImage
                                      src={c.card.images.small}
                                      alt={c.card.name}
                                      className="w-full h-full object-contain"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: DECKS */}
            {activeTab === 'decks' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {decksList.map((deck) => (
                  <div key={deck.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: deck.colorHex || '#DC143C' }}></div>
                      <h3 className="font-bold text-slate-900 truncate">{deck.name}</h3>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 font-mono">
                      <span>{(deck.entries || []).reduce((a, b) => a + (b.quantity || 1), 0)} Cards</span>
                      <Link
                        to={`/deck/${deck.id}?d=${encodeDeckToUrlParam(deck)}`}
                        className="text-[#DC143C] font-semibold hover:underline"
                      >
                        View Deck →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: SEALED */}
            {activeTab === 'sealed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sealedList.map((entry) => (
                  <div key={entry.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 truncate">
                      {entry.product?.name || (entry as unknown as { name?: string }).name || 'Sealed Item'}
                    </h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Qty: {entry.quantity || 1}</span>
                      <span className="font-semibold text-slate-700">
                        {entry.product?.type || (entry as unknown as { productType?: string }).productType || 'Sealed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: LISTS */}
            {activeTab === 'lists' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listsList.map((list) => (
                  <div key={list.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{list.name}</h3>
                    <span className="text-xs text-slate-500">{(list.cardIds || []).length} Items</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Interactive Card Inspection Modal */}
      {selectedCardForModal && (
        <PublicCardDetailModal
          card={selectedCardForModal}
          onClose={() => setSelectedCardForModal(null)}
        />
      )}

      {/* Brag & Share Modal */}
      {snapshot && (
        <BragShareModal
          isOpen={showBragModal}
          onClose={() => setShowBragModal(false)}
          collectorName={collectorName}
          totalCards={allCardsList.length}
          totalValuation={totalValuation}
          currency={currency}
          topCards={allCardsList}
          shareUrl={window.location.href}
        />
      )}

      {/* Embed Badge Modal */}
      {snapshot && (
        <EmbedBadgeModal
          isOpen={showEmbedModal}
          onClose={() => setShowEmbedModal(false)}
          options={{
            type: 'portfolio',
            idOrSlug: shareId || 'collector',
            title: `${collectorName}'s Vault`,
            subtitle: `${allCardsList.length} Cards • ${decksList.length} Decks`,
            count: allCardsList.length,
            value: Math.round(totalValuation),
            currency: currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$',
          }}
        />
      )}
    </div>
  );
};
