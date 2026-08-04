import React, { useState, useEffect, useMemo } from 'react';
import { Plus, ListOrdered, Trash2, X, Sparkles, FolderPlus, Layers } from 'lucide-react';
import { CustomList, PokemonCard, DisplayCurrency } from '../types';
import { HolographicCard } from '../components/HolographicCard';
import { getCardByIdFromEngine, mapToPokemonCard } from '../lib/searchEngine';

interface ListsViewProps {
  lists: CustomList[];
  cards: PokemonCard[];
  currency: DisplayCurrency;
  onCreateList: (list: Omit<CustomList, 'id' | 'createdAt'>) => void;
  onDeleteList: (listId: string) => void;
  onRemoveCardFromList: (listId: string, cardId: string) => void;
  onSelectCard: (card: PokemonCard) => void;
  onQuickLookCard: (card: PokemonCard) => void;
  createListSignal?: number;
}

export const ListsView: React.FC<ListsViewProps> = ({
  lists,
  cards,
  currency,
  onCreateList,
  onDeleteList,
  onRemoveCardFromList,
  onSelectCard,
  onQuickLookCard,
  createListSignal,
}) => {
  const [selectedListId, setSelectedListId] = useState<string>(
    lists[0]?.id || ''
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');

  useEffect(() => {
    if (createListSignal && createListSignal > 0) {
      setIsCreateModalOpen(true);
    }
  }, [createListSignal]);

  const currentList = lists.find((l) => l.id === selectedListId) || lists[0];

  const listCards = useMemo(() => {
    if (!currentList || !currentList.cardIds) return [];
    
    return currentList.cardIds.map((cardId) => {
      // 1. Check passed-in cards (MOCK_CARDS / Collection)
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
          small: `https://assets.tcgdex.net/en/${setCode}/${numberCode}/low.png`,
          large: `https://assets.tcgdex.net/en/${setCode}/${numberCode}/high.png`,
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
    <div className="space-y-8 animate-fade-in p-6 max-w-7xl mx-auto">
      {/* LISTS SELECTOR AND GRID */}

      {/* LIST TABS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lists.map((list) => {
          const isSelected = list.id === currentList?.id;
          return (
            <div
              key={list.id}
              onClick={() => setSelectedListId(list.id)}
              className={`p-4 bg-white border cursor-pointer transition-all chamfer-corner-sm ${
                isSelected
                  ? 'border-[#DC143C] bg-gradient-to-r from-[#FFF0F3]/40 to-white shadow-sm'
                  : 'border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-[#DC143C]" />
                  <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                    {list.name}
                  </h3>
                </div>
                <span className="font-mono text-[10px] font-bold bg-[#0F172A] text-white px-2 py-0.5 rounded-md">
                  Unlimited
                </span>
              </div>
              <p className="font-mono text-xs text-[#64748B] mt-2 line-clamp-1">
                {list.description}
              </p>
              <div className="mt-3 font-mono text-xs text-[#64748B]">
                {list.cardIds.length} cards tracked
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED LIST CONTENTS */}
      {currentList && (
        <div className="neo-card p-6 space-y-6 chamfer-corner-sm bg-white border border-[#E2E8F0]">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="font-heading font-bold text-2xl text-[#0F172A]">
                {currentList.name}
              </h2>
              <p className="font-mono text-xs text-[#64748B]">
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
            <div className="p-12 text-center bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-md space-y-3">
              <Layers className="w-8 h-8 text-[#94A3B8] mx-auto" />
              <div className="font-heading font-bold text-sm text-[#0F172A]">This Custom List is Empty</div>
              <p className="font-mono text-xs text-[#64748B] max-w-sm mx-auto">
                Search for any Pokémon card or click on a card in your collection to add it to "{currentList.name}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
          )}
        </div>
      )}

      {/* CREATE LIST MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
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
