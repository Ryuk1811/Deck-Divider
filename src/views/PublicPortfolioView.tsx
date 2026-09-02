import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  PieChart as PieIcon,
  Layers,
  Swords,
  Grid,
  Zap,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { unpackUserSnapshot } from '../lib/snapshotEngine';
import { UserCompressedSnapshotState, CompressedSnapshotDoc } from '../lib/snapshotEngine';
import { DeckDividerBrand } from '../components/DeckDividerBrand';
import { formatCurrency } from '../utils/formatters';

export const PublicPortfolioView: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<UserCompressedSnapshotState | null>(null);
  const [activeTab, setActiveTab] = useState<'collection' | 'decks' | 'sealed'>('collection');

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!shareId) return;
      try {
        setLoading(true);
        // In this implementation, shareId is simply the userId.
        const docRef = doc(db, 'users', shareId, 'snapshot', 'current');
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as CompressedSnapshotDoc;
          if (data.isPublicProfile) {
            const unpacked = await unpackUserSnapshot(data);
            setSnapshot(unpacked);
          } else {
            setError('This portfolio is not public.');
          }
        } else {
          setError('Portfolio not found.');
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Could not load portfolio.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [shareId]);

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

  const allCards = snapshot.decks.flatMap(d => d.entries); // In a real app we'd combine properly, but this gives a taste

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-500">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <DeckDividerBrand />
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth" className="px-4 py-2 bg-[#DC143C] text-white text-xs font-bold rounded-lg hover:bg-[#B01030] transition-colors shadow-sm">
              Create Your Own
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-slate-900 pt-12 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {snapshot.profile?.displayName || 'Collector'}'s Portfolio
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Viewing a public read-only collection tracking {snapshot.decks.length} decks, {snapshot.sealedEntries.length} sealed items, and custom want-lists.
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
              <span>Overview</span>
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
          </div>

          <div className="p-6 min-h-[400px]">
            {activeTab === 'collection' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Decks</span>
                  <span className="text-3xl font-black text-slate-900 font-heading">{snapshot.decks.length}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Sealed Assets</span>
                  <span className="text-3xl font-black text-slate-900 font-heading">{snapshot.sealedEntries.length}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 uppercase">Custom Lists</span>
                  <span className="text-3xl font-black text-slate-900 font-heading">{snapshot.customLists.length}</span>
                </div>
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
                    <span className="text-xs text-slate-500">{deck.entries.reduce((a, b) => a + b.quantity, 0)} Cards</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'sealed' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {snapshot.sealedEntries.map(entry => (
                  <div key={entry.id} className="p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 truncate">{entry.name}</h3>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500">Qty: {entry.quantity}</span>
                      <span className="font-semibold text-slate-700">{entry.productType}</span>
                    </div>
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
