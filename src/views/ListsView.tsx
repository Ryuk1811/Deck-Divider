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
    if (!newListName) return;
    onCreateList({
      name: newListName,
      description: newListDesc,
      cardIds: [],
    });
    setNewListName('');
    setNewListDesc('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="app-view-container space-y-8 animate-fade-in">
      {/* LISTS SELECTOR AND GRID */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        <h2 className="font-heading font-bold text-lg text-[#0F172A]">My Custom Lists</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F1F5F9] rounded-lg border border-[#E2E8F0]">
          <span className="font-mono text-xs text-[#64748B]">Lists Usage:</span>
          <span className="font-mono text-xs font-bold text-[#0F172A]">
            {lists.length} / {tierLimit.maxLists === Infinity ? '∞' : tierLimit.maxLists}
          </span>
        </div>
      </div>

      {/* LIST TABS */}
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
                  {list.description}
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
          <div className="w-full max-w-md bg-white p-6 border border-[#E2E8F0] shadow-xl space-y-4 chamfer-corner-lg">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-heading font-bold text-lg text-[#0F172A]">
                New Custom List
              </h3>
              <button type="button" onClick={() => setIsCreateModalOpen(false)}>
                <X className="w-4 h-4 text-[#0F172A]" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="font-mono text-xs text-[#64748B]">List Name</label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Trade Night Targets"
                  className="w-full mt-1 p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs font-semibold text-[#0F172A]"
                />
              </div>

              <div>
                <label className="font-mono text-xs text-[#64748B]">Description</label>
                <textarea
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="Purpose or notes..."
                  rows={2}
                  className="w-full mt-1 p-2.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] font-mono text-xs text-[#0F172A]"
                />
              </div>

              <button
                type="submit"
                className="w-full neo-btn-primary py-3 text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Custom List</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
