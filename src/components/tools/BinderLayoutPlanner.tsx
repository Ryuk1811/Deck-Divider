import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Grid, 
  Layers, 
  Sparkles, 
  Share2, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Info,
  Maximize2,
  FileSpreadsheet,
  Palette
} from 'lucide-react';

interface PresetSet {
  id: string;
  name: string;
  series: string;
  cardCount: number;
}

const PRESET_SETS: PresetSet[] = [
  { id: 'sv3pt5', name: 'Scarlet & Violet: 151', series: 'Scarlet & Violet', cardCount: 165 },
  { id: 'sv08', name: 'Surging Sparks', series: 'Scarlet & Violet', cardCount: 191 },
  { id: 'sv08pt5', name: 'Prismatic Evolutions', series: 'Scarlet & Violet', cardCount: 175 },
  { id: 'sv07', name: 'Stellar Crown', series: 'Scarlet & Violet', cardCount: 142 },
  { id: 'sv06', name: 'Twilight Masquerade', series: 'Scarlet & Violet', cardCount: 167 },
  { id: 'sv05', name: 'Temporal Forces', series: 'Scarlet & Violet', cardCount: 162 },
  { id: 'sv04pt5', name: 'Paldean Fates', series: 'Scarlet & Violet', cardCount: 91 },
  { id: 'swsh12pt5', name: 'Crown Zenith', series: 'Sword & Shield', cardCount: 160 },
  { id: 'swsh7', name: 'Evolving Skies', series: 'Sword & Shield', cardCount: 203 },
  { id: 'base1', name: 'Base Set (1999)', series: 'Original Era', cardCount: 102 },
];

interface PocketConfig {
  type: '4-pocket' | '9-pocket' | '12-pocket' | '16-pocket';
  label: string;
  cols: number;
  rows: number;
  capacityPerSide: number;
  capacityPerSheet: number; // double sided
  description: string;
}

const POCKET_CONFIGS: PocketConfig[] = [
  {
    type: '4-pocket',
    label: '4-Pocket (2×2)',
    cols: 2,
    rows: 2,
    capacityPerSide: 4,
    capacityPerSheet: 8,
    description: 'Compact travel mini-binders & Ultra Pro 4-up portfolios'
  },
  {
    type: '9-pocket',
    label: '9-Pocket (3×3)',
    cols: 3,
    rows: 3,
    capacityPerSide: 9,
    capacityPerSheet: 18,
    description: 'Standard competitive & collector standard 3-ring & side-loading binders'
  },
  {
    type: '12-pocket',
    label: '12-Pocket (4×3)',
    cols: 4,
    rows: 3,
    capacityPerSide: 12,
    capacityPerSheet: 24,
    description: 'Playset binders — ideal for 4x card playsets across a single horizontal row'
  },
  {
    type: '16-pocket',
    label: '16-Pocket (4×4)',
    cols: 4,
    rows: 4,
    capacityPerSide: 16,
    capacityPerSheet: 32,
    description: 'Master collection giant binders & complete Pokédex display vaults'
  }
];

export const BinderLayoutPlanner: React.FC = () => {
  const [selectedFormat, setSelectedFormat] = useState<PocketConfig['type']>('9-pocket');
  const [targetSetId, setTargetSetId] = useState<string>('sv3pt5'); // 151 default
  const [customCardCount, setCustomCardCount] = useState<number>(165);
  const [includeSecretRares, setIncludeSecretRares] = useState<boolean>(true);
  const [includeReverseHolos, setIncludeReverseHolos] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [doubleSided, setDoubleSided] = useState<boolean>(true);
  const [customName, setCustomName] = useState<string>('My Collection Binder');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const activeConfig = useMemo(() => {
    return POCKET_CONFIGS.find(c => c.type === selectedFormat) || POCKET_CONFIGS[1];
  }, [selectedFormat]);

  // If a preset set is chosen, calculate its card counts
  const selectedSet = useMemo(() => {
    return PRESET_SETS.find(s => s.id === targetSetId);
  }, [targetSetId]);

  // Calculate total cards to binder
  const effectiveCardCount = useMemo(() => {
    if (targetSetId === 'custom') {
      return Math.max(1, Math.min(1500, customCardCount));
    }
    if (!selectedSet) return 165;
    
    let base = selectedSet.cardCount;
    if (includeSecretRares) {
      // Secret rares estimate
      const secretEstimate = Math.round(base * 0.25);
      base += secretEstimate;
    }
    if (includeReverseHolos) {
      // Reverse holo slots (roughly 80% of main set has reverse holos)
      base += Math.round(selectedSet.cardCount * 0.8);
    }
    return base;
  }, [targetSetId, selectedSet, customCardCount, includeSecretRares, includeReverseHolos]);

  // Mathematical binder calculations
  const stats = useMemo(() => {
    const slotsPerPage = activeConfig.capacityPerSide;
    const slotsPerSheet = doubleSided ? activeConfig.capacityPerSheet : slotsPerPage;
    
    const totalPagesNeeded = Math.ceil(effectiveCardCount / slotsPerPage);
    const totalSheetsNeeded = Math.ceil(effectiveCardCount / slotsPerSheet);
    
    // Total slot capacity of the sheets used
    const totalSlotsProvided = totalSheetsNeeded * slotsPerSheet;
    const fillerSlotsNeeded = totalSlotsProvided - effectiveCardCount;
    
    // Number of playsets (for 12-pocket)
    const playsetsCount = Math.floor(effectiveCardCount / 4);

    return {
      slotsPerPage,
      slotsPerSheet,
      totalPagesNeeded,
      totalSheetsNeeded,
      totalSlotsProvided,
      fillerSlotsNeeded,
      playsetsCount,
      percentageFilled: Math.round((effectiveCardCount / totalSlotsProvided) * 100) || 100
    };
  }, [effectiveCardCount, activeConfig, doubleSided]);

  // Clamp activePageIndex
  const safePageIndex = Math.min(activePageIndex, Math.max(0, stats.totalPagesNeeded - 1));

  // Generate slots for the active preview page
  const pageSlots = useMemo(() => {
    const startCardNum = safePageIndex * activeConfig.capacityPerSide + 1;
    const slots = [];
    for (let i = 0; i < activeConfig.capacityPerSide; i++) {
      const cardNum = startCardNum + i;
      const isFilled = cardNum <= effectiveCardCount;
      slots.push({
        slotNumber: i + 1,
        cardNumber: isFilled ? cardNum : null,
        isFilled,
        isFiller: !isFilled
      });
    }
    return slots;
  }, [safePageIndex, activeConfig, effectiveCardCount]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/tools/binder-layout-planner?format=${selectedFormat}&set=${targetSetId}&cards=${effectiveCardCount}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Intro Header */}
      <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              Master Set Binder Architecture
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Pokémon Binder Layout Planner
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl leading-relaxed">
              Calculate exact page counts, eliminate blank trailing pockets, and preview 4, 9, 12, and 16-pocket layouts for master sets and playset collections.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-gray-400" />}
              {copiedLink ? 'Link Copied!' : 'Share Plan'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Format Selection */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-5 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center justify-between">
              <span>1. Select Binder Format</span>
              <span className="text-amber-400 font-mono text-[11px]">{activeConfig.cols}×{activeConfig.rows} Grid</span>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {POCKET_CONFIGS.map((cfg) => {
                const isSelected = cfg.type === selectedFormat;
                return (
                  <button
                    key={cfg.type}
                    onClick={() => {
                      setSelectedFormat(cfg.type);
                      setActivePageIndex(0);
                    }}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500/50 text-white ring-1 ring-amber-500/30'
                        : 'bg-[#181d28] border-white/5 text-gray-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{cfg.label}</span>
                      <Grid className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-gray-500'}`} />
                    </div>
                    <span className="text-[11px] text-gray-400 mt-2 font-mono">
                      {cfg.capacityPerSide} slots/page
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-[12px] text-gray-400 italic">
              {activeConfig.description}
            </p>
          </div>

          {/* 2. Target Set or Custom Count */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-5 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              2. Select Target Set or Card Volume
            </label>

            <select
              value={targetSetId}
              onChange={(e) => {
                setTargetSetId(e.target.value);
                setActivePageIndex(0);
              }}
              className="w-full bg-[#181d28] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
            >
              <optgroup label="Popular Master Sets">
                {PRESET_SETS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.series} · {s.cardCount} cards)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Custom Allocation">
                <option value="custom">Custom Card Count...</option>
              </optgroup>
            </select>

            {targetSetId === 'custom' ? (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Custom Card Total:</span>
                  <span className="font-mono text-white font-bold">{customCardCount} Cards</span>
                </div>
                <input
                  type="range"
                  min="9"
                  max="1200"
                  step="1"
                  value={customCardCount}
                  onChange={(e) => setCustomCardCount(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-400 bg-white/10 rounded-lg h-2 cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max="2000"
                  value={customCardCount}
                  onChange={(e) => setCustomCardCount(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#181d28] border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono mt-2"
                />
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeSecretRares}
                    onChange={(e) => setIncludeSecretRares(e.target.checked)}
                    className="rounded border-white/20 bg-[#181d28] text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="text-gray-200 font-semibold group-hover:text-white transition">Include Secret Rares (SIR / Hyper / Gold)</span>
                    <p className="text-[11px] text-gray-500">+~25% card capacity for full art Chase cards</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={includeReverseHolos}
                    onChange={(e) => setIncludeReverseHolos(e.target.checked)}
                    className="rounded border-white/20 bg-[#181d28] text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="text-gray-200 font-semibold group-hover:text-white transition">Include Parallel Reverse Holos (True Master Set)</span>
                    <p className="text-[11px] text-gray-500">Pairs each common/uncommon/rare with reverse version</p>
                  </div>
                </label>
              </div>
            )}

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-gray-400">Total Cards in Plan:</span>
              <span className="text-amber-400 font-bold font-mono text-sm">{effectiveCardCount} cards</span>
            </div>
          </div>

          {/* 3. Sheet Properties */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-5 space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
              3. Pocket Sheet Type
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setDoubleSided(true)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  doubleSided
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : 'bg-[#181d28] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Double-Sided Pages ({activeConfig.capacityPerSheet}/sheet)
              </button>
              <button
                onClick={() => setDoubleSided(false)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                  !doubleSided
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                    : 'bg-[#181d28] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Single-Sided ({activeConfig.capacityPerSide}/sheet)
              </button>
            </div>
          </div>
        </div>

        {/* Output & Visual Binder Simulation */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#12161f] border border-white/10 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Sheets Needed</span>
              <span className="text-2xl font-black text-white font-mono mt-1 block">
                {stats.totalSheetsNeeded}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5 block">{doubleSided ? 'Double-sided' : 'Single-sided'}</span>
            </div>

            <div className="bg-[#12161f] border border-white/10 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Page Sides</span>
              <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                {stats.totalPagesNeeded}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5 block">{activeConfig.capacityPerSide} pockets each</span>
            </div>

            <div className="bg-[#12161f] border border-white/10 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Empty Pockets</span>
              <span className={`text-2xl font-black font-mono mt-1 block ${stats.fillerSlotsNeeded === 0 ? 'text-emerald-400' : 'text-orange-400'}`}>
                {stats.fillerSlotsNeeded}
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Filler art recommended</span>
            </div>

            <div className="bg-[#12161f] border border-white/10 rounded-xl p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">Page Efficiency</span>
              <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
                {stats.percentageFilled}%
              </span>
              <span className="text-[11px] text-gray-400 mt-0.5 block">Capacity utilized</span>
            </div>
          </div>

          {/* Visual Binder Sheet Preview */}
          <div className="bg-[#12161f] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Interactive Sheet Preview — Page {safePageIndex + 1} of {stats.totalPagesNeeded}
                </h3>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePageIndex(p => Math.max(0, p - 1))}
                  disabled={safePageIndex === 0}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-gray-400 px-1">
                  {safePageIndex + 1} / {stats.totalPagesNeeded}
                </span>
                <button
                  onClick={() => setActivePageIndex(p => Math.min(stats.totalPagesNeeded - 1, p + 1))}
                  disabled={safePageIndex >= stats.totalPagesNeeded - 1}
                  className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
                  aria-label="Next page"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Simulated Binder Sheet Interior */}
            <div className="mt-6 p-4 sm:p-6 bg-[#0a0d14] rounded-xl border border-white/5 shadow-inner">
              <div 
                className="grid gap-3 max-w-md mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${activeConfig.cols}, minmax(0, 1fr))`
                }}
              >
                {pageSlots.map((slot) => {
                  return (
                    <div
                      key={slot.slotNumber}
                      className={`aspect-[2.5/3.5] rounded-lg border flex flex-col items-center justify-center p-2 relative group transition ${
                        slot.isFilled
                          ? 'bg-gradient-to-br from-[#1a2130] to-[#121620] border-amber-500/30 shadow-md hover:border-amber-400/60'
                          : 'bg-black/30 border-dashed border-white/10 text-gray-600'
                      }`}
                    >
                      {slot.isFilled ? (
                        <>
                          <span className="text-[10px] font-mono font-bold text-amber-400/90">
                            #{String(slot.cardNumber).padStart(3, '0')}
                          </span>
                          <span className="text-[9px] text-gray-400 mt-1 uppercase font-semibold tracking-wider text-center line-clamp-1">
                            Card Slot
                          </span>
                          <div className="w-6 h-1 bg-amber-500/30 rounded-full mt-2" />
                        </>
                      ) : (
                        <div className="text-center p-1">
                          <span className="text-[9px] font-mono text-gray-600 block">Blank</span>
                          <span className="text-[8px] text-gray-700 block mt-0.5">Filler</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span>Slots on this page: {pageSlots.filter(s => s.isFilled).length} active</span>
                <span>{pageSlots.filter(s => s.isFiller).length} empty fillers</span>
              </div>
            </div>

            {/* Master Set Organization Pro-Tips */}
            <div className="mt-6 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Collector Placement Strategy</span>
              </div>
              <p className="text-gray-300 leading-relaxed text-[12px]">
                {selectedFormat === '12-pocket' ? (
                  <><strong>Playset Synergy:</strong> 12-pocket binders display 4 cards across one horizontal row. This enables 3 complete playsets per page without page breaks.</>
                ) : selectedFormat === '9-pocket' ? (
                  <><strong>Standard Flow:</strong> With 9 slots per side, 3x3 grids mirror the Pokédex trio evolution lines (e.g. Charmander, Charmeleon, Charizard in a single row).</>
                ) : selectedFormat === '16-pocket' ? (
                  <><strong>High Capacity:</strong> 16-pocket vaults display 4 evolution lines or 4 playsets per sheet, minimizing binder spine strain on 1000+ card master collections.</>
                ) : (
                  <><strong>Compact Presentation:</strong> 4-pocket binders are ideal for single evolution families, top 10 chase cards, or graded slab mini-exhibitions.</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BinderLayoutPlanner;
