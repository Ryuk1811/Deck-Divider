import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { PokemonCard, PortfolioCardEntry, Deck, CardCondition } from '../../types';
import { searchCards } from '../../lib/searchEngine';
import { formatCurrency } from '../../utils/formatters';

interface BulkCollectionImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  allCards: PokemonCard[];
  decks: Deck[];
  onImportCards: (entries: PortfolioCardEntry[], targetDeckId?: string, newDeckName?: string) => void;
}

interface ParsedCardRow {
  rawLine: string;
  cardName: string;
  setCode?: string;
  number?: string;
  quantity: number;
  condition: CardCondition;
  matchedCard?: PokemonCard;
  status: 'matched' | 'unmatched';
}

const SAMPLE_MODERN_LIST = `1 Umbreon VMAX EVS 215 NM
1 Charizard ex MEW 199 NM
2 Gengar VMAX FST 271 NM
1 Giratina V LOR 186 NM
1 Pikachu ex SSP 057 NM
4 Nest Ball PAF 084 NM`;

const SAMPLE_VINTAGE_LIST = `1 Charizard base1 4 LP
1 Blastoise base1 2 MP
1 Venusaur base1 15 LP
1 Lugia neo1 9 MP
1 Gengar fossil 5 NM`;

export const BulkCollectionImporterModal: React.FC<BulkCollectionImporterModalProps> = ({
  isOpen,
  onClose,
  allCards,
  decks,
  onImportCards,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'csv'>('text');
  const [textInput, setTextInput] = useState('');
  const [targetMode, setTargetMode] = useState<'collection' | 'existing_deck' | 'new_deck'>('collection');
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');
  const [newDeckName, setNewDeckName] = useState('Imported Theme Deck');
  const [parsedRows, setParsedRows] = useState<ParsedCardRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [importSuccessCount, setImportSuccessCount] = useState<number | null>(null);

  if (!isOpen) return null;

  const parseTextList = (text: string) => {
    setIsParsing(true);
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const results: ParsedCardRow[] = [];

    for (const line of lines) {
      // Common formats:
      // "1 Umbreon VMAX EVS 215 NM"
      // "4x Charizard ex (OBF 125)"
      // "Charizard, Base Set, 4, 1, NM"
      let qty = 1;
      let name = '';
      let setCode = '';
      let number = '';
      let condition: CardCondition = 'NM';

      const mapCond = (raw: string): CardCondition => {
        const upper = (raw || '').toUpperCase();
        if (upper === 'DMG' || upper === 'DAMAGED') return 'Damaged';
        if (['NM', 'LP', 'MP', 'HP'].includes(upper)) return upper as CardCondition;
        return 'NM';
      };

      if (line.includes(',')) {
        // CSV formatted line
        const parts = line.split(',').map((p) => p.trim());
        name = parts[0] || '';
        setCode = parts[1] || '';
        number = parts[2] || '';
        const rawQty = parseInt(parts[3] || '1', 10);
        if (!isNaN(rawQty) && rawQty > 0) qty = rawQty;
        condition = mapCond(parts[4] || 'NM');
      } else {
        // Standard deckstring line: "1 Card Name SET NUMBER COND"
        const regex = /^(\d+)[xX]?\s+(.+)$/;
        const match = line.match(regex);
        let remaining = line;
        if (match) {
          qty = parseInt(match[1], 10) || 1;
          remaining = match[2].trim();
        }

        // Check if trailing condition exists
        const condMatch = remaining.match(/\b(NM|LP|MP|HP|DMG|DAMAGED)\b$/i);
        if (condMatch) {
          condition = mapCond(condMatch[1]);
          remaining = remaining.substring(0, condMatch.index).trim();
        }

        // Check for set code and number pattern: "Card Name EVS 215" or "Card Name (EVS 215)"
        const setNumMatch = remaining.match(/[\(\[]?([A-Za-z0-9\.\-]+)\s+(\d+)[\)\]]?$/);
        if (setNumMatch) {
          setCode = setNumMatch[1];
          number = setNumMatch[2];
          name = remaining.substring(0, setNumMatch.index).trim();
        } else {
          name = remaining;
        }
      }

      // Fuzzy match against allCards or search engine
      let matched = allCards.find((c) => {
        const nameMatch = c.name.toLowerCase() === name.toLowerCase();
        if (nameMatch && number) {
          return c.number === number || c.number.replace(/\D/g, '') === number;
        }
        return nameMatch;
      });

      if (!matched && name) {
        // Fallback to search query
        const queryMatches = searchCards({ query: name });
        if (queryMatches.length > 0) {
          matched = allCards.find((c) => c.id === queryMatches[0].id) || (queryMatches[0] as any);
        }
      }

      results.push({
        rawLine: line,
        cardName: name || line,
        setCode,
        number,
        quantity: qty,
        condition,
        matchedCard: matched,
        status: matched ? 'matched' : 'unmatched',
      });
    }

    setParsedRows(results);
    setIsParsing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setTextInput(content);
        parseTextList(content);
      }
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    const validRows = parsedRows.filter((r) => r.matchedCard);
    if (validRows.length === 0) return;

    const newEntries: PortfolioCardEntry[] = validRows.map((r, i) => ({
      id: `imported-${Date.now()}-${i}`,
      cardId: r.matchedCard!.id,
      card: r.matchedCard!,
      quantity: r.quantity,
      condition: r.condition,
      purchasePrice: r.matchedCard!.prices?.raw || 1,
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseCurrency: 'USD',
      notes: 'Imported via Bulk Collection Importer',
      isSold: false,
    }));

    onImportCards(
      newEntries,
      targetMode === 'existing_deck' ? selectedDeckId : undefined,
      targetMode === 'new_deck' ? newDeckName : undefined
    );

    setImportSuccessCount(newEntries.length);
    setTimeout(() => {
      onClose();
      setImportSuccessCount(null);
    }, 1500);
  };

  const matchedCount = parsedRows.filter((r) => r.status === 'matched').length;
  const totalValuation = parsedRows.reduce((acc, r) => {
    return acc + (r.matchedCard?.prices?.raw || 0) * r.quantity;
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DC143C]/10 text-[#DC143C] flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#0F172A]">
                Bulk Collection &amp; Deck Importer
              </h2>
              <p className="font-mono text-[11px] text-[#64748B]">
                Import CSV spreadsheets or paste card lists directly into your collection
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {importSuccessCount !== null ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Successfully Imported {importSuccessCount} Cards!
              </h3>
              <p className="font-mono text-xs text-slate-500 max-w-sm">
                Your portfolio NAV has been updated with real-time TCGplayer market prices.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Sample Presets */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#DC143C]" />
                  <span>Test with sample data:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTextInput(SAMPLE_MODERN_LIST);
                      parseTextList(SAMPLE_MODERN_LIST);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:border-[#DC143C] hover:text-[#DC143C] transition-colors"
                  >
                    Modern Chase
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTextInput(SAMPLE_VINTAGE_LIST);
                      parseTextList(SAMPLE_VINTAGE_LIST);
                    }}
                    className="px-2.5 py-1 text-[11px] font-mono font-semibold bg-white border border-slate-200 rounded-md text-slate-700 hover:border-[#DC143C] hover:text-[#DC143C] transition-colors"
                  >
                    Vintage Base
                  </button>
                </div>
              </div>

              {/* Input Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                    Paste Card List or Drop CSV
                  </label>
                  <div className="text-[11px] font-mono text-slate-400">
                    Format: Quantity Name Set Number Condition
                  </div>
                </div>

                <textarea
                  rows={5}
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    parseTextList(e.target.value);
                  }}
                  placeholder={`1 Umbreon VMAX EVS 215 NM\n2 Charizard ex OBF 125 NM\n1 Pikachu SSP 057 NM`}
                  className="w-full p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none focus:border-[#DC143C] transition-colors resize-none placeholder:text-slate-400"
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 cursor-pointer font-mono text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-[#DC143C]" />
                    <span>Or upload a .csv file</span>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {textInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setTextInput('');
                        setParsedRows([]);
                      }}
                      className="text-slate-400 hover:text-slate-600 font-mono text-[11px]"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Target Destination Choice */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
                  Import Destination
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTargetMode('collection')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      targetMode === 'collection'
                        ? 'bg-[#FFF0F3] border-[#DC143C] text-[#DC143C] font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Main Portfolio
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMode('new_deck')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      targetMode === 'new_deck'
                        ? 'bg-[#FFF0F3] border-[#DC143C] text-[#DC143C] font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    New Display Deck
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMode('existing_deck')}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                      targetMode === 'existing_deck'
                        ? 'bg-[#FFF0F3] border-[#DC143C] text-[#DC143C] font-bold shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    Existing Deck
                  </button>
                </div>

                {targetMode === 'new_deck' && (
                  <div className="pt-2">
                    <input
                      type="text"
                      value={newDeckName}
                      onChange={(e) => setNewDeckName(e.target.value)}
                      placeholder="Display Deck Title (e.g. Modern Grails Showcase)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>
                )}

                {targetMode === 'existing_deck' && decks.length > 0 && (
                  <div className="pt-2">
                    <select
                      value={selectedDeckId}
                      onChange={(e) => setSelectedDeckId(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-[#DC143C]"
                    >
                      {decks.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.entries?.length || 0} cards)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Parsed Preview Table */}
              {parsedRows.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-600 font-semibold">
                      Parsed Preview: {matchedCount} of {parsedRows.length} Matched
                    </span>
                    {totalValuation > 0 && (
                      <span className="text-emerald-700 font-bold">
                        Est. NAV: {formatCurrency(totalValuation)}
                      </span>
                    )}
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
                    {parsedRows.map((row, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-2 flex items-center justify-between text-xs bg-white hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="font-mono font-bold text-slate-400 text-[11px] w-5">
                            {row.quantity}x
                          </span>
                          <div className="min-w-0">
                            <div className="font-heading font-semibold text-slate-900 truncate">
                              {row.matchedCard ? row.matchedCard.name : row.cardName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {row.matchedCard ? (
                                <span>
                                  {row.matchedCard.set?.name} · #{row.matchedCard.number} · {row.condition}
                                </span>
                              ) : (
                                <span className="text-amber-600 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> No match found
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="font-mono text-xs font-bold text-slate-700 shrink-0">
                          {row.matchedCard?.prices?.raw ? formatCurrency(row.matchedCard.prices.raw * row.quantity) : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {importSuccessCount === null && (
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteImport}
              disabled={matchedCount === 0}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold text-white rounded-xl shadow-xs transition-all ${
                matchedCount > 0
                  ? 'bg-[#DC143C] hover:bg-[#B01030] cursor-pointer'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <span>Import {matchedCount} Cards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
