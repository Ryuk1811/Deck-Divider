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
} from 'lucide-react';
import {
  Deck,
  AccountTier,
  TIER_LIMITS,
  DisplayCurrency,
  PortfolioCardEntry,
  PokemonCard,
  CardSet,
} from '../types';
import { formatCurrency } from '../utils/formatters';
import { HolographicCard } from '../components/HolographicCard';
import { DropdownMenu } from '../components/DropdownMenu';
import { queueCardsForProgressivePrewarm } from '../utils/progressiveImageLoader';

interface DecksViewProps {
  decks: Deck[];
  currentTier: AccountTier;
  currency: DisplayCurrency;
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
    action: 'CREATE_DECK' | 'ADD_CARD_TO_DECK' | 'SHARE_PUBLIC_LINK',
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
  const [newDeckIsPublic, setNewDeckIsPublic] = useState(false);

  // Edit Deck Properties Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDeckName, setEditDeckName] = useState('');
  const [editDeckDesc, setEditDeckDesc] = useState('');
  const [editDeckColor, setEditDeckColor] = useState('#DC143C');

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

  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const tierLimit = TIER_LIMITS[currentTier];

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
    setNewDeckIsPublic(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEditModal = () => {
    if (!currentDeck) return;
    setEditDeckName(currentDeck.name);
    setEditDeckDesc(currentDeck.description || '');
    setEditDeckColor(currentDeck.colorHex || '#DC143C');
    setIsEditModalOpen(true);
  };

  const handleDeleteDeckConfirm = (deckToDelete: Deck, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to delete deck "${deckToDelete.name}"? The deck structure will be removed. All cards remain safely stored in your collection.`
      )
    ) {
      onDeleteDeck(deckToDelete.id);
      const remaining = decks.filter((d) => d.id !== deckToDelete.id);
      if (remaining.length > 0) {
        setSelectedDeckId(remaining[0].id);
      } else {
        setSelectedDeckId('');
      }
    }
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

    if (newDeckIsPublic && !tierLimit.canSharePublicLinks) {
      onTriggerLimitModal('SHARE_PUBLIC_LINK');
      return;
    }

    onCreateDeck({
      name: newDeckName.trim(),
      description: newDeckDesc.trim(),
      colorHex: newDeckColor,
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

    onUpdateDeck({
      ...currentDeck,
      name: editDeckName,
      description: editDeckDesc,
      colorHex: editDeckColor,
      updatedAt: new Date().toISOString(),
    });

    setIsEditModalOpen(false);
  };

  const handleTogglePublic = () => {
    if (!currentDeck) return;
    if (!currentDeck.isPublic && !tierLimit.canSharePublicLinks) {
      onTriggerLimitModal('SHARE_PUBLIC_LINK');
      return;
    }

    onUpdateDeck({
      ...currentDeck,
      isPublic: !currentDeck.isPublic,
      publicShareCode: !currentDeck.isPublic
        ? `DD-${Math.floor(1000 + Math.random() * 9000)}`
        : currentDeck.publicShareCode,
    });
  };

  const handleCopyPublicLink = () => {
    if (!currentDeck?.publicShareCode) return;
    const link = `https://deckdivider.app/share/${currentDeck.publicShareCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleConfirmSplit = () => {
    if (!currentDeck || !splitGroupSetId || !splitNewDeckName) return;
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
      <div className="p-5 glass-slab shadow-md space-y-5">
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
              </div>
              <p className="font-mono text-[11px] sm:text-xs text-[#64748B] mt-0.5 max-w-xl truncate">
                {currentDeck?.description || 'Manage deck structures, custom colors, and binder pages'}
              </p>
            </div>
          </div>

          {/* Function Actions Toolbar - Clean wrapping flex row on all screens */}
          <div className="flex flex-wrap items-center justify-start lg:justify-end gap-2 w-full lg:w-auto">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="h-9 px-4 bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#B01030] transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
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
            <button
              type="button"
              onClick={handleTogglePublic}
              className={`h-9 px-4 text-xs font-mono font-bold border transition-all rounded-lg flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer ${
                currentDeck?.isPublic
                  ? 'bg-[#FFF0F3] text-[#DC143C] border-[#DC143C]'
                  : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#DC143C] hover:text-[#DC143C]'
              }`}
            >
              {currentDeck?.isPublic ? (
                <Share2 className="w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="truncate">
                {currentDeck?.isPublic ? 'Public Active' : 'Make Public'}
              </span>
            </button>

            {currentDeck?.isPublic && (
              <button
                type="button"
                onClick={handleCopyPublicLink}
                className="h-9 px-4 bg-[#0F172A] text-white font-mono text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#1E293B] rounded-lg transition-colors shadow-xs whitespace-nowrap cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">
                  {copiedLink ? 'Copied Link!' : 'Copy Link'}
                </span>
              </button>
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
                    <span className="text-[#64748B]">{totalCards} cards</span>
                    <strong className="font-num text-[#0F172A] font-bold">
                      {formatCurrency(totalVal, currency)}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Showcase Suite (3 Decks & Grails)</span>
              </button>
            )}
            {onAddSampleDeck && (
              <button
                type="button"
                onClick={onAddSampleDeck}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#DC143C] font-mono text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#DC143C]" />
                <span>Add Charizard Championship Deck</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-5 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
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
            <div className="p-5 glass-slab shadow-md space-y-4">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                Configure New Deck
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">Deck Name</label>
                <input
                  type="text"
                  required
                  value={newDeckName}
                  onChange={(e) => setNewDeckName(e.target.value)}
                  placeholder="e.g. Lost Zone Box or Binder #1"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">Description (Optional)</label>
                <textarea
                  value={newDeckDesc}
                  onChange={(e) => setNewDeckDesc(e.target.value)}
                  placeholder="Strategy breakdown or archetype tags..."
                  rows={2}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white"
                />
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
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        newDeckColor.toLowerCase() === color.hex.toLowerCase()
                          ? 'border-[#0F172A] scale-110 shadow-sm'
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

              <div className="pt-2">
                <label className="flex items-center gap-2 font-mono text-xs text-[#0F172A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDeckIsPublic}
                    onChange={(e) => setNewDeckIsPublic(e.target.checked)}
                    className="w-4 h-4 accent-[#DC143C]"
                  />
                  <span>Allow Public Link Sharing</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 rounded-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                Assign Custom Name & Color
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-[#64748B]">Custom Deck Name</label>
                <input
                  type="text"
                  required
                  value={editDeckName}
                  onChange={(e) => setEditDeckName(e.target.value)}
                  placeholder="e.g. Master Tournament Deck"
                  className="w-full mt-1 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#64748B]">Description</label>
                <textarea
                  value={editDeckDesc}
                  onChange={(e) => setEditDeckDesc(e.target.value)}
                  placeholder="Strategy notes..."
                  rows={2}
                  className="w-full mt-1 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A]"
                />
              </div>

              {/* Color Swatches Palette & Hex Input */}
              <div className="space-y-2">
                <label className="font-mono text-xs text-[#64748B]">Deck Marker Color</label>
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
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        editDeckColor.toLowerCase() === color.hex.toLowerCase()
                          ? 'border-[#0F172A] scale-110 shadow-sm'
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

              <button
                type="submit"
                className="w-full neo-btn-primary py-3 text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Deck Customizations</span>
              </button>
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
                <img
                  src={soldTargetEntry.card.images.small || 'https://images.pokemontcg.io/cardback.png'}
                  alt={soldTargetEntry.card.name}
                  className="w-8 h-11 object-cover rounded border border-[#0F172A]"
                />
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
    </div>
  );
};
