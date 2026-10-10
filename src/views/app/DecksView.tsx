import React, { useState, useEffect } from 'react';
import {
  Plus,
  Share2,
  Grid,
  Table,
  FolderTree,
  Scissors,
  Check,
  X,
  AlertTriangle,
  Lock,
  Copy,
  DollarSign,
  Tag,
  Sparkles,
  Calendar,
  Layers,
  Eye,
  Settings2,
  Trash2,
  ExternalLink,
  Crown
} from 'lucide-react';
import {
  Deck,
  AccountTier,
  TIER_LIMITS,
  DisplayCurrency,
  PortfolioCardEntry,
  PokemonCard,
  CardSet,
  DECK_SIZE_LADDER,
  DeckSizeOption,
} from '../../types';
import { CardImage } from '../../components/ui/CardImage';
import { formatCurrency } from '../../utils/formatters';
import { HolographicCard } from '../../components/ui/HolographicCard';
import { DropdownMenu } from '../../components/ui/DropdownMenu';
import { queueCardsForProgressivePrewarm } from '../../utils/progressiveImageLoader';
import { encodeDeckToUrlParam } from '../../utils/deckUrlEncoder';
import { PublicShareLinkBox } from '../../components/ui/PublicShareLinkBox';
import { LimitAttemptedAction } from '../../components/modals/LimitReachedModal';

interface DecksViewProps {
  decks: Deck[];
  currentTier: AccountTier;
  currency: DisplayCurrency;
  userEmail?: string;
  onCreateDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'entries'>) => void;
  onUpdateDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void;
  onSplitDeckGroup: (sourceDeckId: string, cardIdsToSplit: string[], newDeckName: string) => void;
  onMarkCardSold: (
    deckId: string,
    entryId: string,
    saleDetails: { salePrice: number; saleCurrency: DisplayCurrency; saleDate: string; salePlatform: string }
  ) => void;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
  onTriggerLimitModal: (
    action: LimitAttemptedAction,
    details?: any
  ) => void;
  initialSelectedDeckId?: string;
  createDeckSignal?: number;
  onLoadShowcase?: () => void;
  onAddSampleDeck?: () => void;
}

export const DecksView: React.FC<DecksViewProps> = ({
  decks,
  currentTier,
  currency,
  userEmail,
  onCreateDeck,
  onUpdateDeck,
  onDeleteDeck,
  onSplitDeckGroup,
  onMarkCardSold,
  onSelectCard,
  onQuickLookCard,
  onTriggerLimitModal,
  initialSelectedDeckId,
  createDeckSignal,
  onLoadShowcase,
  onAddSampleDeck,
}) => {
  const isSuperUser = userEmail?.toLowerCase() === 'deckdivider@outlook.com' || userEmail?.toLowerCase() === 'gurutvamurdia@gmail.com';
  const [selectedDeckId, setSelectedDeckId] = useState<string>(
    initialSelectedDeckId || decks[0]?.id || ''
  );

  // Browse View mode: 'binder' | 'table' | 'segregation' | 'sold'
  const [viewMode, setViewMode] = useState<'binder' | 'table' | 'segregation' | 'sold'>('binder');

  // Create Deck Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newDeckColor, setNewDeckColor] = useState('#DC143C');
  const [newDeckTargetSize, setNewDeckTargetSize] = useState<number>(60);
  const [newDeckFormat, setNewDeckFormat] = useState<string>('60-Card Tournament Deck');
  const [newDeckIsPublic, setNewDeckIsPublic] = useState(false);

  // Edit Deck Properties Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDeckName, setEditDeckName] = useState('');
  const [editDeckDesc, setEditDeckDesc] = useState('');
  const [editDeckColor, setEditDeckColor] = useState('#DC143C');
  const [editDeckTargetSize, setEditDeckTargetSize] = useState<number>(60);
  const [editDeckFormat, setEditDeckFormat] = useState<string>('60-Card Tournament Deck');

  // Split Group State
  const [splitGroupSetId, setSplitGroupSetId] = useState<string | null>(null);
  const [splitNewDeckName, setSplitNewDeckName] = useState('');

  // Mark Sold Modal State
  const [soldTargetEntry, setSoldTargetEntry] = useState<PortfolioCardEntry | null>(null);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [saleCurrency, setSaleCurrency] = useState<DisplayCurrency>(currency);
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [salePlatform, setSalePlatform] = useState<string>('TCGPlayer');

  // Share Copy feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Custom Delete Deck Confirmation State (replaces blocked window.confirm)
  const [deckPendingDelete, setDeckPendingDelete] = useState<Deck | null>(null);

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const tierLimit = TIER_LIMITS[currentTier];

  // Keep selectedDeckId in sync with existing decks
  useEffect(() => {
    if (initialSelectedDeckId && decks.some((d) => d.id === initialSelectedDeckId)) {
      setSelectedDeckId(initialSelectedDeckId);
    } else if (!decks.some((d) => d.id === selectedDeckId) && decks.length > 0) {
      setSelectedDeckId(decks[0].id);
    }
  }, [initialSelectedDeckId, decks, selectedDeckId]);

  const handleOpenCreateModal = () => {
    if (decks.length >= tierLimit.maxDecks) {
      onTriggerLimitModal('CREATE_DECK', {
        currentCount: decks.length,
        limitCount: tierLimit.maxDecks,
      });
      return;
    }
    setNewDeckName('');
    setNewDeckDesc('');
    setNewDeckColor('#DC143C');
    setNewDeckTargetSize(60);
    setNewDeckFormat('60-Card Tournament Deck');
    setNewDeckIsPublic(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!currentDeck) return;
    setEditDeckName(currentDeck.name);
    setEditDeckDesc(currentDeck.description || '');
    setEditDeckColor(currentDeck.colorHex || '#DC143C');
    setEditDeckTargetSize(currentDeck.targetSize || 60);
    setEditDeckFormat(currentDeck.deckFormat || '60-Card Tournament Deck');
    setIsEditModalOpen(true);
  };

  const handleDeleteDeckConfirm = (deckToDelete: Deck, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDeckPendingDelete(deckToDelete);
  };

  const handleExecuteDeckDelete = () => {
    if (!deckPendingDelete) return;
    const deletedId = deckPendingDelete.id;
    onDeleteDeck(deletedId);
    const remaining = decks.filter((d) => d.id !== deletedId);
    if (remaining.length > 0) {
      setSelectedDeckId(remaining[0].id);
    } else {
      setSelectedDeckId('');
    }
    setDeckPendingDelete(null);
  };

  // Progressive background prewarm of current deck card images
  useEffect(() => {
    if (currentDeck?.entries && currentDeck.entries.length > 0) {
      queueCardsForProgressivePrewarm(
        currentDeck.entries.map((e) => e.card),
        'high'
      );
    }
  }, [currentDeck]);

  useEffect(() => {
    if (createDeckSignal && createDeckSignal > 0) {
      handleOpenCreateModal();
    }
  }, [createDeckSignal]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    if (newDeckTargetSize === Infinity && currentTier !== 'Collection' && !isSuperUser) {
      onTriggerLimitModal('UNLIMITED_ROSTER');
      return;
    }

    if (newDeckTargetSize !== Infinity && newDeckTargetSize > tierLimit.maxCardsPerDeck) {
      onTriggerLimitModal('ADD_CARD_TO_DECK', { deckName: newDeckName.trim() });
      return;
    }

    if (newDeckIsPublic && !tierLimit.canSharePublicLinks) {
      onTriggerLimitModal('SHARE_PUBLIC_LINK');
      return;
    }

    onCreateDeck({
      name: newDeckName.trim(),
      description: newDeckDesc.trim(),
      colorHex: newDeckColor,
      targetSize: newDeckTargetSize,
      deckFormat: newDeckFormat,
      isPublic: newDeckIsPublic,
      publicShareCode: newDeckIsPublic
        ? `DD-${Math.floor(1000 + Math.random() * 9000)}`
        : undefined,
    });

    setNewDeckName('');
    setNewDeckDesc('');
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDeck || !editDeckName) return;

    if (editDeckTargetSize === Infinity && currentTier !== 'Collection' && !isSuperUser) {
      onTriggerLimitModal('UNLIMITED_ROSTER');
      return;
    }

    if (editDeckTargetSize !== Infinity && editDeckTargetSize > tierLimit.maxCardsPerDeck) {
      onTriggerLimitModal('ADD_CARD_TO_DECK', { deckName: editDeckName.trim() });
      return;
    }

    onUpdateDeck({
      ...currentDeck,
      name: editDeckName,
      description: editDeckDesc,
      colorHex: editDeckColor,
      targetSize: editDeckTargetSize,
      deckFormat: editDeckFormat,
      updatedAt: new Date().toISOString(),
    });

    setIsEditModalOpen(false);
  };

  const handleTogglePublic = () => {
    if (!currentDeck) return;
    const newIsPublic = !currentDeck.isPublic;
    onUpdateDeck({
      ...currentDeck,
      isPublic: newIsPublic,
      publicShareCode: newIsPublic
        ? (currentDeck.publicShareCode || `DD-${Math.floor(1000 + Math.random() * 9000)}`)
        : currentDeck.publicShareCode,
    });
  };

  const handleCopyPublicLink = async () => {
    if (!currentDeck) return;
    
    const isProd = window.location.hostname.includes('deckdivider.app');
    const origin = window.location.origin;
    
    const encoded = encodeDeckToUrlParam(currentDeck);
    const link = isProd
      ? `https://deckdivider.app/deck/${currentDeck.id}?d=${encoded}`
      : `${origin}/deck/${currentDeck.id}?d=${encoded}`;
      
    try {
      if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(link);
      }
    } catch (err) {
      console.warn('Clipboard writeText failed or blocked by iframe permissions:', err);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmSplit = () => {
    if (!currentDeck || !splitGroupSetId || !splitNewDeckName) return;

    if (decks.length >= tierLimit.maxDecks) {
      onTriggerLimitModal('CREATE_DECK', {
        currentCount: decks.length,
        limitCount: tierLimit.maxDecks,
      });
      return;
    }

    const entriesInSet = currentDeck.entries.filter(
      (e) => e.card.set.id === splitGroupSetId
    );
    const cardIdsToSplit = entriesInSet.map((e) => e.cardId);

    onSplitDeckGroup(currentDeck.id, cardIdsToSplit, splitNewDeckName);
    setSplitGroupSetId(null);
    setSplitNewDeckName('');
  };

  const handleSoldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDeck || !soldTargetEntry) return;

    onMarkCardSold(currentDeck.id, soldTargetEntry.id, {
      salePrice,
      saleCurrency,
      saleDate,
      salePlatform,
    });

    setSoldTargetEntry(null);
  };

  // Group deck entries by set for Segregation View
  const entriesBySet: Record<string, { set: CardSet; entries: PortfolioCardEntry[] }> = currentDeck
    ? currentDeck.entries.reduce((acc, entry) => {
        const setKey = entry.card.set.name;
        if (!acc[setKey]) acc[setKey] = { set: entry.card.set, entries: [] };
        acc[setKey].entries.push(entry);
        return acc;
      }, {} as Record<string, { set: CardSet; entries: PortfolioCardEntry[] }>)
    : {};

  const activeEntries = currentDeck ? currentDeck.entries.filter((e) => !e.isSold) : [];
  const soldEntries = currentDeck ? currentDeck.entries.filter((e) => e.isSold) : [];

  return (
    <div className="app-view-container space-y-6 animate-fade-in">
      {/* 1. TOP HEADED DECK FUNCTION PANEL */}
      <div className="p-3 sm:p-4 md:p-5 glass-slab shadow-md space-y-5">
        {/* Header Row: Title & Function Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className="w-4 h-4 rounded-full border border-black/10 shadow-xs flex-shrink-0 mt-1 sm:mt-1.5"
              style={{ backgroundColor: currentDeck?.colorHex || '#DC143C' }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-heading font-bold text-lg sm:text-xl text-[#0F172A] truncate">
                  {currentDeck?.name || 'Decks Studio'}
                </h2>
                <span className="font-mono text-[10px] sm:text-xs font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded flex-shrink-0">
                  {decks.length} Active Decks
                </span>
                {currentDeck && (
                  <span className={`font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 border ${
                    currentDeck.targetSize === 6
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : currentDeck.targetSize === 30
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : currentDeck.targetSize === 100
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : currentDeck.targetSize === Infinity
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {currentDeck.targetSize === 6
                      ? '6-Card Mini'
                      : currentDeck.targetSize === 30
                      ? '30-Card Half'
                      : currentDeck.targetSize === 100
                      ? '100-Card GLC'
                      : currentDeck.targetSize === Infinity
                      ? 'Unlimited ∞'
                      : '60-Card Standard'}
                  </span>
                )}
              </div>
              <p className="font-mono text-[11px] sm:text-xs text-[#64748B] mt-0.5 max-w-xl truncate">
                {currentDeck?.description || 'Manage deck structures, custom colors, and binder pages'}
              </p>
            </div>
          </div>

          {/* Function Actions Toolbar - Clean wrapping flex row on all screens */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
            {/* New Deck Button */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="h-9 px-4 bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#B01030] transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
              title="Configure New Deck"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">New Deck</span>
            </button>

            {currentDeck && (
              <button
                type="button"
                onClick={handleOpenEditModal}
                className="h-9 px-4 bg-white text-[#0F172A] border border-[#E2E8F0] hover:border-[#DC143C] hover:text-[#DC143C] font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
              >
                <Settings2 className="w-3.5 h-3.5 text-[#DC143C] flex-shrink-0" />
                <span className="truncate">Assign Name & Color</span>
              </button>
            )}

            {currentDeck && (
              <button
                type="button"
                onClick={(e) => handleDeleteDeckConfirm(currentDeck, e)}
                className="h-9 px-4 bg-white text-[#EF4444] border border-[#E2E8F0] hover:bg-[#FEF2F2] hover:border-[#EF4444] font-mono text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
                title={`Delete ${currentDeck.name}`}
              >
                <Trash2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">Delete Deck</span>
              </button>
            )}

            {/* Public Share Controls */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] sm:text-xs font-bold text-[#64748B]">
                {currentDeck?.isPublic ? 'Public Active' : 'Make Public'}
              </span>
              <button
                type="button"
                onClick={handleTogglePublic}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#DC143C]/20 ${
                  currentDeck?.isPublic ? 'bg-[#16A34A]' : 'bg-slate-300'
                }`}
                aria-label="Toggle Public Deck"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentDeck?.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {currentDeck?.isPublic && (
              <PublicShareLinkBox
                isPublic={Boolean(currentDeck.isPublic)}
                url={`${window.location.origin}/deck/${currentDeck.id}?d=${encodeDeckToUrlParam(currentDeck)}`}
              />
            )}
          </div>
        </div>

        {/* Deck Switcher Grid (NO SIDE-TAB BORDERS AS PER DESIGN SYSTEM) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[#64748B]">
              Select Active Deck Location:
            </span>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-[#F1F5F9] rounded-md border border-[#E2E8F0]">
              <span className="font-mono text-[11px] text-[#64748B]">Decks Usage:</span>
              <span className="font-mono text-[11px] font-bold text-[#0F172A]">
                {decks.length} / {tierLimit.maxDecks === Infinity ? '∞' : tierLimit.maxDecks}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {decks.map((deck) => {
              const isSelected = deck.id === currentDeck?.id;
              const totalCards = deck.entries.reduce((acc, e) => acc + e.quantity, 0);
              const totalVal = deck.entries.reduce((acc, e) => acc + e.card.prices.raw * e.quantity, 0);

              return (
                <div
                  key={deck.id}
                  onClick={() => setSelectedDeckId(deck.id)}
                  className={`group p-3.5 cursor-pointer transition-all duration-200 relative overflow-hidden glass-slab shadow-sm ${
                    isSelected
                      ? 'border-[#DC143C] ring-1 ring-[#DC143C] bg-[#FFF0F3]/10 shadow-xs'
                      : 'shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: deck.colorHex }}
                      />
                      <h3 className="font-heading font-bold text-xs text-[#0F172A] truncate">
                        {deck.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {deck.isPublic && (
                        <span className="font-mono text-[9px] font-bold bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/30 px-1 py-0.2 rounded">
                          Public
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDeckConfirm(deck, e)}
                        title={`Delete ${deck.name}`}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#FEF2F2] hover:text-[#EF4444] text-[#94A3B8] rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between font-mono text-[11px] pt-1.5 border-t border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[#64748B] truncate">
                        {totalCards}{deck.targetSize && deck.targetSize !== Infinity ? `/${deck.targetSize}` : ''} cards
                      </span>
                      {deck.targetSize === 6 && (
                        <span className="text-[9px] font-bold px-1 rounded bg-purple-100 text-purple-700 flex-shrink-0">
                          6-Mini
                        </span>
                      )}
                    </div>
                    <strong className="font-num text-[#0F172A] font-bold flex-shrink-0">
                      {formatCurrency(totalVal, currency)}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CURRENT DECK CAPACITY & LADDER STATUS BAR */}
        {currentDeck && (() => {
          const targetSize = currentDeck.targetSize || 60;
          const isUnlimited = targetSize === Infinity;
          const cardCount = activeEntries.length;
          const isComplete = !isUnlimited && cardCount === targetSize;
          const isOver = !isUnlimited && cardCount > targetSize;
          const pct = isUnlimited ? 100 : Math.min(100, Math.round((cardCount / targetSize) * 100));
          const tierDeckCap = tierLimit.maxCardsPerDeck;

          return (
            <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#0F172A]">
                    Ladder Format: {targetSize === Infinity ? 'Unlimited / Custom Roster' : `${targetSize}-Card Deck`}
                  </span>
                  {isComplete ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                      ✓ Complete ({cardCount}/{targetSize} Cards)
                    </span>
                  ) : isOver ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200">
                      ⚠ Exceeds Target ({cardCount}/{targetSize})
                    </span>
                  ) : isUnlimited ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold border border-purple-200">
                      Open Unlimited ({cardCount} Cards)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-semibold">
                      {targetSize - cardCount} card{targetSize - cardCount === 1 ? '' : 's'} to target ({cardCount}/{targetSize})
                    </span>
                  )}
                </div>
                <div className="text-[#64748B] text-[11px] font-mono">
                  Plan Deck Capacity: <strong className="text-[#0F172A]">{tierDeckCap === Infinity ? 'Unlimited (∞)' : `${tierDeckCap} Cards Max`}</strong>
                </div>
              </div>

              <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isComplete
                      ? 'bg-emerald-500'
                      : isOver
                      ? 'bg-amber-500'
                      : targetSize === 6
                      ? 'bg-purple-600'
                      : 'bg-[#DC143C]'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })()}

        {/* View Mode Switcher Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
            <span className="font-mono text-xs font-bold text-[#64748B] flex-shrink-0">Display Mode:</span>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 w-full sm:w-auto">
              {[
                { id: 'binder', label: 'Binder View', icon: Grid },
                { id: 'table', label: 'Ledger Table', icon: Table },
                { id: 'segregation', label: 'By Expansion', icon: FolderTree },
                { id: 'sold', label: 'Sales Log', icon: DollarSign },
              ].map((mode) => {
                const isActive = viewMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id as any)}
                    className={`h-9 px-3 text-xs font-mono font-bold rounded-lg border flex items-center justify-center gap-1.5 transition-all cursor-pointer w-full sm:w-auto text-center ${
                      isActive
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#DC143C]' : 'text-[#64748B]'}`} />
                    <span className="truncate">{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="font-mono text-xs text-[#64748B] text-right sm:text-left flex-shrink-0">
            {activeEntries.length} Active • {soldEntries.length} Sold
          </div>
        </div>
      </div>

      {/* EMPTY STATE WHEN NO DECKS EXIST */}
      {decks.length === 0 && (
        <div className="p-12 text-center glass-slab space-y-5 rounded-2xl border border-[#E2E8F0] shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center mx-auto text-[#DC143C] shadow-xs">
            <Layers className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-heading font-extrabold text-lg text-[#0F172A]">No Decks or Binders Created Yet</h3>
            <p className="font-mono text-xs text-[#64748B] leading-relaxed">
              Construct tournament-grade 60-card decks or organized binder segregations with custom colors, labels, and market valuations.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC143C] text-white font-mono text-xs font-bold rounded-xl hover:bg-[#B01030] transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create First Deck</span>
            </button>
            {onLoadShowcase && (
              <button
                type="button"
                onClick={onLoadShowcase}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer border border-[#E2E8F0]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span>Load Sample Decks</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. MAIN ACTIVE DECK CARDS CANVAS */}
      {currentDeck && (
        <div className="space-y-6">
          {/* VIEW MODE 1: BINDER VIEW (SINGULAR ENTITY CARDS ON DOTTED BACKGROUND) */}
          {viewMode === 'binder' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                <span>Showing {activeEntries.length} active cards in "{currentDeck.name}"</span>
                <span>3D Holographic Canvas</span>
              </div>

              {activeEntries.length === 0 ? (
                <div className="text-center py-12 space-y-2 glass-slab shadow-md">
                  <Layers className="w-8 h-8 text-[#CBD5E1] mx-auto" />
                  <p className="font-heading font-bold text-sm text-[#0F172A]">
                    This deck has no active cards yet
                  </p>
                  <p className="font-mono text-xs text-[#64748B]">
                    Navigate to Global Search or Sets to add cards into this deck.
                  </p>
                </div>
              ) : (
                /* SINGULAR ENTITY CARDS AGAINST DOTTED CANVAS BACKGROUND */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5 p-2.5 sm:p-5 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                  {activeEntries.map((entry) => (
                    <div key={entry.id} className="relative group">
                      <HolographicCard
                        card={entry.card}
                        currency={currency}
                        quantity={entry.quantity}
                        deckName={currentDeck.name}
                        deckColor={currentDeck.colorHex}
                        onClick={() => onSelectCard(entry.card)}
                        onQuickLook={() => onQuickLookCard(entry.card)}
                      />
                      {/* Mark Sold Quick Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSoldTargetEntry(entry);
                          setSalePrice(entry.card.prices.raw);
                        }}
                        className="absolute top-2 left-2 hidden group-hover:flex items-center gap-1 bg-[#0F172A] text-white text-[10px] font-mono font-bold px-2 py-1 rounded-md shadow-md hover:bg-[#DC143C] transition-colors"
                      >
                        <DollarSign className="w-3 h-3" />
                        Mark Sold
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW MODE 2: DATA TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="overflow-x-auto glass-slab shadow-md">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B]">
                  <tr>
                    <th className="p-3">Card Name</th>
                    <th className="p-3">Set</th>
                    <th className="p-3">Condition</th>
                    <th className="p-3">Qty</th>
                    <th className="p-3">Purchase Price</th>
                    <th className="p-3">Current Raw</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0]">
                  {activeEntries.map((entry) => {
                    return (
                      <tr key={entry.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="p-3 font-heading font-semibold text-[#0F172A]">
                          {entry.card.name}
                        </td>
                        <td className="p-3 text-[#64748B]">{entry.card.set.name}</td>
                        <td className="p-3 font-semibold">{entry.condition}</td>
                        <td className="p-3 font-num font-bold">{entry.quantity}</td>
                        <td className="p-3 font-num">
                          {formatCurrency(entry.purchasePrice, currency)}
                        </td>
                        <td className="p-3 font-num font-bold text-[#DC143C]">
                          {formatCurrency(entry.card.prices.raw, currency)}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSoldTargetEntry(entry);
                              setSalePrice(entry.card.prices.raw);
                            }}
                            className="px-2.5 py-1 rounded-md bg-[#0F172A] text-white text-[10px] font-mono font-bold hover:bg-[#DC143C] transition-colors"
                          >
                            Mark Sold
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW MODE 3: EXPANSION SEGREGATION VIEW */}
          {viewMode === 'segregation' && (
            <div className="space-y-6">
              {Object.entries(entriesBySet).map(([setName, group]) => (
                <div
                  key={setName}
                  className="p-4 glass-slab shadow-md space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                    <div className="flex items-center gap-2">
                      <FolderTree className="w-4 h-4 text-[#DC143C]" />
                      <h4 className="font-heading font-bold text-sm text-[#0F172A]">
                        {setName} Expansion Group ({group.entries.length} cards)
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSplitGroupSetId(group.set.id);
                        setSplitNewDeckName(`${setName} Collection`);
                      }}
                      className="px-3 py-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono font-bold text-[#0F172A] hover:bg-[#FFF0F3] hover:text-[#DC143C] hover:border-[#DC143C] flex items-center gap-1.5 transition-colors"
                    >
                      <Scissors className="w-3 h-3" />
                      <span>Split Group into New Deck</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {group.entries.map((entry) => (
                      <HolographicCard
                        key={entry.id}
                        card={entry.card}
                        currency={currency}
                        quantity={entry.quantity}
                        deckName={currentDeck.name}
                        deckColor={currentDeck.colorHex}
                        onClick={() => onSelectCard(entry.card)}
                        onQuickLook={() => onQuickLookCard(entry.card)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VIEW MODE 4: SOLD CARDS LOG */}
          {viewMode === 'sold' && (
            <div className="p-3 sm:p-4 md:p-5 glass-slab shadow-md space-y-4">
              <h3 className="font-heading font-bold text-base text-[#0F172A]">
                Marked Sold Cards
              </h3>
              {soldEntries.length === 0 ? (
                <p className="font-mono text-xs text-[#64748B]">
                  No cards have been marked sold in this deck yet.
                </p>
              ) : (
                <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                      <tr>
                        <th className="p-3">Card Name</th>
                        <th className="p-3">Sale Date</th>
                        <th className="p-3">Platform</th>
                        <th className="p-3">Sale Price</th>
                        <th className="p-3">Realized Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {soldEntries.map((entry) => {
                        const profit = (entry.salePrice || 0) - entry.purchasePrice;
                        return (
                          <tr key={entry.id}>
                            <td className="p-3 font-heading font-semibold text-[#0F172A]">
                              {entry.card.name}
                            </td>
                            <td className="p-3 text-[#64748B]">{entry.saleDate}</td>
                            <td className="p-3">{entry.salePlatform || 'N/A'}</td>
                            <td className="p-3 font-num font-bold">
                              {formatCurrency(entry.salePrice || 0, currency)}
                            </td>
                            <td
                              className={`p-3 font-num font-bold ${
                                profit >= 0 ? 'text-[#16A34A]' : 'text-[#FF4500]'
                              }`}
                            >
                              {formatCurrency(profit, currency)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* CREATE DECK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E2E8F0] bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center text-[#DC143C]">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#0F172A] leading-tight">
                    Configure New Deck
                  </h3>
                  <p className="font-mono text-[11px] text-[#64748B]">
                    Define format rule, size cap, and color styling
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                <div>
                  <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">
                    Deck Name <span className="text-[#DC143C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    placeholder="e.g. Lost Zone Box or Binder #1"
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">
                    Description <span className="font-normal text-[#64748B]">(Optional)</span>
                  </label>
                  <textarea
                    value={newDeckDesc}
                    onChange={(e) => setNewDeckDesc(e.target.value)}
                    placeholder="Strategy breakdown or archetype tags..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Deck Size & Format Ladder Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="block font-mono text-xs font-semibold text-[#0F172A]">
                      Deck Size &amp; Format Ladder
                    </label>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Plan Cap: {tierLimit.maxCardsPerDeck === Infinity ? 'Unlimited (∞)' : `${tierLimit.maxCardsPerDeck} Cards`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DECK_SIZE_LADDER.map((opt) => {
                      const isSelected = newDeckTargetSize === opt.size;
                      const isUnlimitedOpt = opt.size === Infinity;
                      const canAccessUnlimited = currentTier === 'Collection' || isSuperUser;
                      const isLocked = isUnlimitedOpt
                        ? !canAccessUnlimited
                        : opt.size > tierLimit.maxCardsPerDeck;

                      return (
                        <button
                          key={String(opt.size)}
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              if (isUnlimitedOpt) {
                                onTriggerLimitModal('UNLIMITED_ROSTER');
                              } else if (opt.size === 100) {
                                onTriggerLimitModal('GLC_FORMAT');
                              } else {
                                onTriggerLimitModal('ADD_CARD_TO_DECK', { deckName: newDeckName || 'New Deck' });
                              }
                              return;
                            }
                            setNewDeckTargetSize(opt.size);
                            setNewDeckFormat(opt.label);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[#DC143C] bg-[#FFF0F3] ring-1 ring-[#DC143C]'
                              : isLocked
                              ? 'border-slate-200 bg-slate-50 opacity-60 hover:opacity-100 hover:border-slate-300'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-[#DC143C]' : 'text-[#0F172A]'}`}>
                              {opt.badge}
                            </span>
                            {isLocked ? (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono px-1 py-0.5 rounded bg-slate-200/80 text-slate-600 font-bold uppercase shrink-0">
                                <Lock className="w-2.5 h-2.5" />
                                {isUnlimitedOpt ? 'Collection' : 'Locked'}
                              </span>
                            ) : opt.size === 6 ? (
                              <span className="text-[8px] font-mono px-1 rounded bg-purple-100 text-purple-700 font-bold uppercase shrink-0">
                                ★ Mini
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5 font-sans">
                            {isLocked && isUnlimitedOpt ? 'Collection Tier (∞) Only' : opt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Palette Swatches & Manual Input */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-semibold text-[#0F172A]">Deck Color Accent</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Crimson', hex: '#DC143C' },
                      { name: 'Indigo', hex: '#4F46E5' },
                      { name: 'Emerald', hex: '#10B981' },
                      { name: 'Amber', hex: '#F59E0B' },
                      { name: 'Violet', hex: '#8B5CF6' },
                      { name: 'Cyan', hex: '#06B6D4' },
                      { name: 'Rose', hex: '#E11D48' },
                      { name: 'Obsidian', hex: '#0F172A' },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setNewDeckColor(color.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          newDeckColor.toLowerCase() === color.hex.toLowerCase()
                            ? 'border-[#0F172A] scale-110 shadow-sm ring-2 ring-[#0F172A]/20'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      value={newDeckColor}
                      onChange={(e) => setNewDeckColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E2E8F0] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newDeckColor}
                      onChange={(e) => setNewDeckColor(e.target.value)}
                      className="w-28 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-bold uppercase text-[#0F172A]"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <label className="flex items-center gap-2 font-mono text-xs text-[#0F172A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newDeckIsPublic}
                      onChange={(e) => setNewDeckIsPublic(e.target.checked)}
                      className="w-4 h-4 accent-[#DC143C] rounded cursor-pointer"
                    />
                    <span>Allow Public Link Sharing</span>
                  </label>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-2 px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-[#E2E8F0] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC143C] text-white hover:bg-[#B01030] text-xs font-mono font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Deck</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DECK PROPERTIES MODAL */}
      {isEditModalOpen && currentDeck && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#E2E8F0] bg-white shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center text-[#DC143C]">
                  <Settings2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#0F172A] leading-tight">
                    Assign Custom Name & Color
                  </h3>
                  <p className="font-mono text-[11px] text-[#64748B]">
                    Modify deck label, format rules, and marker color
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleEditSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
                <div>
                  <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">
                    Custom Deck Name <span className="text-[#DC143C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editDeckName}
                    onChange={(e) => setEditDeckName(e.target.value)}
                    placeholder="e.g. Master Tournament Deck"
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">
                    Description <span className="font-normal text-[#64748B]">(Optional)</span>
                  </label>
                  <textarea
                    value={editDeckDesc}
                    onChange={(e) => setEditDeckDesc(e.target.value)}
                    placeholder="Strategy notes..."
                    rows={2}
                    className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors resize-none"
                  />
                </div>

                {/* Deck Size & Format Ladder Selector */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <label className="block font-mono text-xs font-semibold text-[#0F172A]">
                      Deck Size &amp; Format Ladder
                    </label>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Plan Cap: {tierLimit.maxCardsPerDeck === Infinity ? 'Unlimited (∞)' : `${tierLimit.maxCardsPerDeck} Cards`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DECK_SIZE_LADDER.map((opt) => {
                      const isSelected = editDeckTargetSize === opt.size;
                      const isUnlimitedOpt = opt.size === Infinity;
                      const canAccessUnlimited = currentTier === 'Collection' || isSuperUser;
                      const isLocked = isUnlimitedOpt
                        ? !canAccessUnlimited
                        : opt.size > tierLimit.maxCardsPerDeck;

                      return (
                        <button
                          key={String(opt.size)}
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              if (isUnlimitedOpt) {
                                onTriggerLimitModal('UNLIMITED_ROSTER');
                              } else if (opt.size === 100) {
                                onTriggerLimitModal('GLC_FORMAT');
                              } else {
                                onTriggerLimitModal('ADD_CARD_TO_DECK', { deckName: editDeckName || 'Deck' });
                              }
                              return;
                            }
                            setEditDeckTargetSize(opt.size);
                            setEditDeckFormat(opt.label);
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer relative ${
                            isSelected
                              ? 'border-[#DC143C] bg-[#FFF0F3] ring-1 ring-[#DC143C]'
                              : isLocked
                              ? 'border-slate-200 bg-slate-50 opacity-60 hover:opacity-100 hover:border-slate-300'
                              : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[11px] font-mono font-bold ${isSelected ? 'text-[#DC143C]' : 'text-[#0F172A]'}`}>
                              {opt.badge}
                            </span>
                            {isLocked ? (
                              <span className="inline-flex items-center gap-0.5 text-[8px] font-mono px-1 py-0.5 rounded bg-slate-200/80 text-slate-600 font-bold uppercase shrink-0">
                                <Lock className="w-2.5 h-2.5" />
                                {isUnlimitedOpt ? 'Collection' : 'Locked'}
                              </span>
                            ) : opt.size === 6 ? (
                              <span className="text-[8px] font-mono px-1 rounded bg-purple-100 text-purple-700 font-bold uppercase shrink-0">
                                ★ Mini
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[10px] text-[#64748B] line-clamp-1 mt-0.5 font-sans">
                            {isLocked && isUnlimitedOpt ? 'Collection Tier (∞) Only' : opt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Swatches Palette & Hex Input */}
                <div className="space-y-2">
                  <label className="block font-mono text-xs font-semibold text-[#0F172A]">Deck Marker Color</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Crimson', hex: '#DC143C' },
                      { name: 'Indigo', hex: '#4F46E5' },
                      { name: 'Emerald', hex: '#10B981' },
                      { name: 'Amber', hex: '#F59E0B' },
                      { name: 'Violet', hex: '#8B5CF6' },
                      { name: 'Cyan', hex: '#06B6D4' },
                      { name: 'Rose', hex: '#E11D48' },
                      { name: 'Obsidian', hex: '#0F172A' },
                    ].map((color) => (
                      <button
                        key={color.hex}
                        type="button"
                        onClick={() => setEditDeckColor(color.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          editDeckColor.toLowerCase() === color.hex.toLowerCase()
                            ? 'border-[#0F172A] scale-110 shadow-sm ring-2 ring-[#0F172A]/20'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="color"
                      value={editDeckColor}
                      onChange={(e) => setEditDeckColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-[#E2E8F0] cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editDeckColor}
                      onChange={(e) => setEditDeckColor(e.target.value)}
                      className="w-28 p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-bold uppercase text-[#0F172A]"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Footer */}
              <div className="flex items-center justify-end gap-2 px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-[#E2E8F0] shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 neo-btn-primary text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save Deck Customizations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM SPLIT GROUP MODAL */}
      {splitGroupSetId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 rounded-xl">
            <div className="flex items-center gap-2 text-[#DC143C]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                Confirm Structural Group Split
              </h3>
            </div>
            <p className="font-mono text-xs text-[#64748B] leading-relaxed">
              Splitting this set group will move all matching cards from "{currentDeck?.name}" into a brand new deck.
            </p>

            <div>
              <label className="font-mono text-xs text-[#64748B]">New Split Deck Name</label>
              <input
                type="text"
                value={splitNewDeckName}
                onChange={(e) => setSplitNewDeckName(e.target.value)}
                className="w-full mt-1 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmSplit}
                className="flex-1 neo-btn-primary py-2.5 text-xs"
              >
                Confirm & Split Group
              </button>
              <button
                type="button"
                onClick={() => setSplitGroupSetId(null)}
                className="px-4 py-2.5 neo-btn-secondary text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK CARD SOLD FORM MODAL */}
      {soldTargetEntry && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                Mark Card Sold
              </h3>
              <button type="button" onClick={() => setSoldTargetEntry(null)}>
                <X className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>

            <form onSubmit={handleSoldSubmit} className="space-y-4">
              <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] flex items-center gap-3">
                <div className="w-8 h-11 border border-[#0F172A] rounded overflow-hidden shrink-0">
                  <CardImage
                    src={soldTargetEntry.card.images.small}
                    alt={soldTargetEntry.card.name}
                    cardName={soldTargetEntry.card.name}
                    cardNumber={soldTargetEntry.card.number}
                    setId={soldTargetEntry.card.set?.id}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-heading font-bold text-xs text-[#0F172A]">
                    {soldTargetEntry.card.name}
                  </div>
                  <div className="font-mono text-[10px] text-[#64748B]">
                    Bought for {formatCurrency(soldTargetEntry.purchasePrice, currency)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-mono text-xs text-[#64748B]">Sale Price</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-bold font-num"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-[#64748B]">Sale Date</label>
                  <input
                    type="date"
                    required
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                    className="w-full mt-1 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-mono text-xs text-[#64748B]">Platform</label>
                <select
                  value={salePlatform}
                  onChange={(e) => setSalePlatform(e.target.value)}
                  className="w-full mt-1 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold"
                >
                  <option value="TCGPlayer">TCGPlayer</option>
                  <option value="eBay">eBay</option>
                  <option value="Local Trade Event">Local Trade Event</option>
                  <option value="Cardmarket">Cardmarket</option>
                  <option value="Private Sale">Private Sale</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full neo-btn-primary py-3 text-xs font-bold"
              >
                Log Realized Sale
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DECK MODAL */}
      {deckPendingDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-2xl space-y-4 rounded-xl">
            <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-3">
              <div className="w-10 h-10 rounded-full bg-[#FEF2F2] border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#0F172A]">
                  Delete Deck Structure
                </h3>
                <p className="font-mono text-xs text-[#64748B]">
                  Confirm deletion for "{deckPendingDelete.name}"
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] font-mono text-xs text-[#64748B] leading-relaxed">
              <span className="font-bold text-[#0F172A]">Notice:</span> Deleting this deck will remove the binder categorization and list structure ({deckPendingDelete.entries?.length || 0} card slots). All cards and logs remain securely preserved in your primary vault.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeckPendingDelete(null)}
                className="px-4 py-2 text-xs font-mono font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteDeckDelete}
                className="px-5 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-mono text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Deck</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
