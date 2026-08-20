import React, { useState, useEffect, useMemo } from 'react';
import { Plus, ListOrdered, Trash2, X, Sparkles, FolderPlus, Layers } from 'lucide-react';
import { CustomList, PokemonCard, DisplayCurrency, AccountTier, TIER_LIMITS } from '../types';
import { HolographicCard } from '../components/HolographicCard';
import { getCardByIdFromEngine, mapToPokemonCard } from '../lib/searchEngine';

interface ListsViewProps {
  lists: CustomList[];
  cards: PokemonCard[];
  currency: DisplayCurrency;
  currentTier?: AccountTier;
  onCreateList: (list: Omit<CustomList, 'id' | 'createdAt'>) => void;
  onDeleteList: (listId: string) => void;
  onRemoveCardFromList: (listId: string, cardId: string) => void;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
  onTriggerLimitModal?: (action: 'CREATE_LIST' | 'ADD_TO_LIST', details?: any) => void;
  createListSignal?: number;
}

export const ListsView: React.FC<ListsViewProps> = ({
  lists,
  cards,
  currency,
  currentTier = 'Starter',
  onCreateList,
  onDeleteList,
  onRemoveCardFromList,
  onSelectCard,
  onQuickLookCard,
  onTriggerLimitModal,
  createListSignal,
}) => {
  const [selectedListId, setSelectedListId] = useState<string>(
    lists[0]?.id || ''
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const prevSignalRef = React.useRef(createListSignal);

  const tierLimit = TIER_LIMITS[currentTier];

  const handleOpenCreateModal = () => {
    if (lists.length >= tierLimit.maxLists) {
      if (onTriggerLimitModal) {
        onTriggerLimitModal('CREATE_LIST', {
          currentCount: lists.length,
          limitCount: tierLimit.maxLists,
        });
      }
      return;
    }
    setNewListName('');
    setNewListDesc('');
    setIsCreateModalOpen(true);
  };

  useEffect(() => {
    if (createListSignal !== undefined && createListSignal !== prevSignalRef.current) {
      if (createListSignal > 0) {
        handleOpenCreateModal();
      }
      prevSignalRef.current = createListSignal;
    }
  }, [createListSignal]);

  const currentList = lists.find((l) => l.id === selectedListId) || lists[0];

  const listCards = useMemo(() => {
    if (!currentList || !currentList.cardIds) return [];
    
    return currentList.cardIds.map((cardId) => {
      // 1. Check passed-in cards 
      const foundInProps = cards.find((c) => c.id === cardId);
      if (foundInProps) return foundInProps;

      // 2. Check search engine index cache
      const engineDoc = getCardByIdFromEngine(cardId);
      if (engineDoc) {
        return mapToPokemonCard(engineDoc);
      }

      // 3. Fallback placeholder so card never vanishes from list
      const setCode = cardId.includes('-') ? cardId.split('-')[0] : 'sv3';
      const numberCode = cardId.includes('-') ? cardId.split('-')[1] : '1';
      return {
        id: cardId,
        name: cardId.toUpperCase().replace('-', ' #'),
        supertype: 'Pokémon',
        types: ['Colorless'],
        rarity: 'Rare',
        set: { id: setCode, name: 'Pokémon TCG', series: 'Scarlet & Violet' },
        images: {
          small: `https://images.pokemontcg.io/${setCode}/${numberCode}.png`,
          large: `https://images.pokemontcg.io/${setCode}/${numberCode}_hires.png`,
        },
        prices: { raw: 4.50, psa10Estimate: 15.00, psa9Estimate: 7.50 },
      } as PokemonCard;
    });
  }, [currentList, cards]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    onCreateList({
      name: newListName.trim(),
      description: newListDesc.trim(),
      cardIds: [],
    });
    setNewListName('');
    setNewListDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="app-view-container space-y-8 animate-fade-in">
      {/* LISTS SELECTOR AND HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-[#0F172A]">My Custom Lists</h2>
          <p className="font-mono text-xs text-[#64748B] mt-0.5">
            Organize want-lists, trade targets, and custom card binders
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
            <span className="font-mono text-xs text-[#64748B]">Lists Usage:</span>
            <span className="font-mono text-xs font-bold text-[#0F172A]">
              {lists.length} / {tierLimit.maxLists === Infinity ? '∞' : tierLimit.maxLists}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="h-9 px-4 bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#B01030] transition-colors flex items-center justify-center gap-1.5 shadow-xs whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            <span>New Custom List</span>
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {lists.length === 0 && (
        <div className="p-12 text-center glass-slab space-y-4 rounded-xl border border-[#E2E8F0] shadow-sm">
          <ListOrdered className="w-10 h-10 text-[#CBD5E1] mx-auto" />
          <div className="space-y-1">
            <h3 className="font-heading font-bold text-base text-[#0F172A]">No Custom Lists Created Yet</h3>
            <p className="font-mono text-xs text-[#64748B] max-w-md mx-auto">
              Create your first custom want-list or targeted binder group to curate cards across any Pokémon TCG expansion.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg hover:bg-[#B01030] transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Custom List</span>
          </button>
        </div>
      )}

      {/* LIST TABS */}
      {lists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => {
            const isSelected = list.id === currentList?.id;
            return (
              <div
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                className={`p-4 cursor-pointer transition-all glass-slab flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#DC143C] bg-gradient-to-r from-[#FFF0F3]/40 to-white shadow-sm ring-1 ring-[#DC143C]'
                    : 'shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-[#DC143C]" />
                      <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                        {list.name}
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded-md">
                      {list.cardIds.length} / {tierLimit.maxItemsPerList === Infinity ? '∞' : tierLimit.maxItemsPerList}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#64748B] mt-2 line-clamp-1">
                    {list.description || 'No description added'}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="font-mono text-[11px] text-[#64748B]">
                    {list.cardIds.length} cards tracked
                  </div>
                  {list.coverImageUrl && (
                    <div className="w-10 h-10 rounded-sm overflow-hidden border border-[#E2E8F0] shadow-2xs">
                      <img src={list.coverImageUrl} alt="List Cover" className="w-full h-full object-cover object-top" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SELECTED LIST CONTENTS */}
      {currentList && (
        <div className="space-y-4">
          {/* List Title & Action Header Strip */}
          <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-xs flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-2xl text-[#0F172A]">
                {currentList.name}
              </h2>
              <p className="font-mono text-xs text-[#64748B] mt-0.5">
                {currentList.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onDeleteList(currentList.id)}
              className="p-2 rounded-md bg-white border border-[#E2E8F0] text-[#FF4500] hover:bg-[#FEF2F2] flex items-center gap-1.5 text-xs font-mono font-bold"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete List</span>
            </button>
          </div>

          {listCards.length === 0 ? (
            <div className="p-12 text-center glass-slab space-y-3">
              <Layers className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <div className="font-heading font-bold text-sm text-[#0F172A]">This Custom List is Empty</div>
              <p className="font-mono text-xs text-[#64748B] max-w-sm mx-auto">
                Search for any Pokémon card or click on a card in your collection to add it to "{currentList.name}".
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cards Count Status Strip */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#E2E8F0] rounded-xl shadow-xs text-xs font-mono text-[#666666]">
                <span className="font-bold text-[#0F172A]">{listCards.length} Saved Cards in "{currentList.name}"</span>
                <span>Click card to inspect details</span>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 p-4 rounded-xl bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:16px_16px] bg-[#F8FAFC]/50 border border-[#E2E8F0]">
                {listCards.map((card) => (
                  <div key={card.id} className="relative group">
                    <HolographicCard
                      card={card}
                      currency={currency}
                      onClick={() => onSelectCard(card)}
                      onQuickLook={() => onQuickLookCard(card)}
                    />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveCardFromList(currentList.id, card.id);
                      }}
                      className="absolute top-2 right-2 hidden group-hover:flex items-center p-1 rounded-full bg-[#0F172A] text-white hover:bg-[#FF4500] z-10 shadow-md"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE LIST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 rounded-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                New Custom List
              </h3>
              <button 
                type="button" 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-md text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">List Name</label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Trade Night Targets"
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-semibold text-[#0F172A] mb-1">Description (Optional)</label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Purpose, priority notes, or trade goals..."
                  rows={3}
                  className="w-full p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:bg-white"
                />
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
                  <span>Create Custom List</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
