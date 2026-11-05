import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Sparkles, 
  Scale, 
  ShieldCheck, 
  AlertTriangle,
  Share2
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface TradeCardItem {
  id: string;
  name: string;
  set: string;
  price: number;
  qty: number;
}

export const TradeFairnessCalculator: React.FC = () => {
  const [sideAItems, setSideAItems] = useState<TradeCardItem[]>([
    { id: '1', name: 'Charizard ex #199', set: '151', price: 125.0, qty: 1 },
    { id: '2', name: 'Charmander #168', set: '151', price: 32.0, qty: 1 },
  ]);

  const [sideBItems, setSideBItems] = useState<TradeCardItem[]>([
    { id: '3', name: 'Giratina V Alt Art #186', set: 'Lost Origin', price: 155.0, qty: 1 },
  ]);

  const [newCardA, setNewCardA] = useState({ name: '', set: '', price: '' });
  const [newCardB, setNewCardB] = useState({ name: '', set: '', price: '' });
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const totalA = sideAItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const totalB = sideBItems.reduce((acc, i) => acc + i.price * i.qty, 0);
  const diffValue = totalA - totalB;
  const absDiff = Math.abs(diffValue);
  const maxTotal = Math.max(totalA, totalB, 1);
  const percentDiff = Math.round((absDiff / maxTotal) * 100);

  // Fairness evaluation
  let fairnessVerdict = 'Fair Trade';
  let fairnessColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let fairnessDescription = 'Both sides are within 5% of equal market value. This is a balanced trade.';

  if (percentDiff > 15) {
    fairnessVerdict = diffValue > 0 ? 'Heavy Advantage Side A' : 'Heavy Advantage Side B';
    fairnessColor = 'text-red-700 bg-red-50 border-red-200';
    fairnessDescription = `One side is offering ${percentDiff}% more market value (${formatCurrency(absDiff, 'USD')} gap). Consider adding sweetener cards or cash to balance the trade.`;
  } else if (percentDiff > 5) {
    fairnessVerdict = diffValue > 0 ? 'Slight Advantage Side A' : 'Slight Advantage Side B';
    fairnessColor = 'text-amber-700 bg-amber-50 border-amber-200';
    fairnessDescription = `Value difference is ${percentDiff}% (${formatCurrency(absDiff, 'USD')}). Common in trading high-demand chase cards for multiple smaller cards.`;
  }

  const handleAddA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardA.name.trim()) return;
    const priceNum = parseFloat(newCardA.price) || 0;
    setSideAItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newCardA.name.trim(),
        set: newCardA.set.trim() || 'Pokémon TCG',
        price: priceNum,
        qty: 1,
      }
    ]);
    setNewCardA({ name: '', set: '', price: '' });
  };

  const handleAddB = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardB.name.trim()) return;
    const priceNum = parseFloat(newCardB.price) || 0;
    setSideBItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newCardB.name.trim(),
        set: newCardB.set.trim() || 'Pokémon TCG',
        price: priceNum,
        qty: 1,
      }
    ]);
    setNewCardB({ name: '', set: '', price: '' });
  };

  const removeA = (id: string) => setSideAItems(prev => prev.filter(i => i.id !== id));
  const removeB = (id: string) => setSideBItems(prev => prev.filter(i => i.id !== id));

  const copyTradeReceipt = () => {
    let text = `🤝 **Pokémon TCG Trade Summary — DECK / divider**\n\n`;
    text += `**Side A (Your Offer) Total: ${formatCurrency(totalA, 'USD')}**\n`;
    sideAItems.forEach(i => {
      text += `• ${i.qty}x ${i.name} (${i.set}) — ${formatCurrency(i.price * i.qty, 'USD')}\n`;
    });
    text += `\n**Side B (Their Offer) Total: ${formatCurrency(totalB, 'USD')}**\n`;
    sideBItems.forEach(i => {
      text += `• ${i.qty}x ${i.name} (${i.set}) — ${formatCurrency(i.price * i.qty, 'USD')}\n`;
    });
    text += `\n**Verdict:** ${fairnessVerdict} (Diff: ${formatCurrency(absDiff, 'USD')} · ${percentDiff}%)\n`;
    text += `Calculated at: https://deckdivider.app/tools/trade-fairness-calculator`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 font-heading mb-2 tracking-tight">
          Pokémon Card Trade Fairness Calculator
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          Compare market values card-for-card to calculate trade fairness before swapping cards at local tournaments, conventions, or online communities.
        </p>
      </div>

      {/* Fairness Gauge Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border ${fairnessColor}`}>
                {fairnessVerdict}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {percentDiff}% Value Delta ({formatCurrency(absDiff, 'USD')})
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{fairnessDescription}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={copyTradeReceipt}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              {copiedReceipt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReceipt ? 'Receipt Copied!' : 'Copy Trade Receipt'}</span>
            </button>
          </div>
        </div>

        {/* Visual Balance Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-900">Side A: {formatCurrency(totalA, 'USD')}</span>
            <span className="text-slate-400">vs</span>
            <span className="font-bold text-slate-900">Side B: {formatCurrency(totalB, 'USD')}</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${Math.round((totalA / (totalA + totalB || 1)) * 100)}%` }} 
              className="bg-[#DC143C] h-full transition-all duration-300"
              title={`Side A: ${Math.round((totalA / (totalA + totalB || 1)) * 100)}%`}
            />
            <div 
              style={{ width: `${Math.round((totalB / (totalA + totalB || 1)) * 100)}%` }} 
              className="bg-blue-600 h-full transition-all duration-300"
              title={`Side B: ${Math.round((totalB / (totalA + totalB || 1)) * 100)}%`}
            />
          </div>
        </div>
      </div>

      {/* Two Column Trade Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Side A (Your Offer) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]" />
                <h3 className="text-base font-bold text-slate-900">Side A (Your Offer)</h3>
              </div>
              <span className="text-sm font-bold font-mono text-[#DC143C]">{formatCurrency(totalA, 'USD')}</span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-slate-100 min-h-[140px]">
              {sideAItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono">
                  No cards added to Side A yet.
                </div>
              ) : (
                sideAItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-slate-900 block">{item.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.set} · {formatCurrency(item.price, 'USD')} ea</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-700">{formatCurrency(item.price * item.qty, 'USD')}</span>
                      <button 
                        type="button" 
                        onClick={() => removeA(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddA} className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase block">Add Card to Side A:</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Card name (e.g. Mew ex)"
                value={newCardA.name}
                onChange={e => setNewCardA(prev => ({ ...prev, name: e.target.value }))}
                className="sm:col-span-5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#DC143C]"
              />
              <input
                type="text"
                placeholder="Set"
                value={newCardA.set}
                onChange={e => setNewCardA(prev => ({ ...prev, set: e.target.value }))}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#DC143C]"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Value ($)"
                value={newCardA.price}
                onChange={e => setNewCardA(prev => ({ ...prev, price: e.target.value }))}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-[#DC143C]"
              />
              <button
                type="submit"
                className="sm:col-span-1 min-h-[44px] sm:min-h-0 bg-[#DC143C] text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer font-bold text-xs gap-1"
                title="Add card"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:hidden font-mono text-xs">Add Card</span>
              </button>
            </div>
          </form>
        </div>

        {/* Side B (Their Offer) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Side B (Their Offer)</h3>
              </div>
              <span className="text-sm font-bold font-mono text-blue-600">{formatCurrency(totalB, 'USD')}</span>
            </div>

            {/* Items List */}
            <div className="divide-y divide-slate-100 min-h-[140px]">
              {sideBItems.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono">
                  No cards added to Side B yet.
                </div>
              ) : (
                sideBItems.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-medium text-slate-900 block">{item.name}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.set} · {formatCurrency(item.price, 'USD')} ea</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-700">{formatCurrency(item.price * item.qty, 'USD')}</span>
                      <button 
                        type="button" 
                        onClick={() => removeB(item.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddB} className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-mono font-semibold text-slate-500 uppercase block">Add Card to Side B:</span>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Card name (e.g. Giratina V)"
                value={newCardB.name}
                onChange={e => setNewCardB(prev => ({ ...prev, name: e.target.value }))}
                className="sm:col-span-5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
              />
              <input
                type="text"
                placeholder="Set"
                value={newCardB.set}
                onChange={e => setNewCardB(prev => ({ ...prev, set: e.target.value }))}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Value ($)"
                value={newCardB.price}
                onChange={e => setNewCardB(prev => ({ ...prev, price: e.target.value }))}
                className="sm:col-span-3 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="sm:col-span-1 min-h-[44px] sm:min-h-0 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer font-bold text-xs gap-1"
                title="Add card"
              >
                <Plus className="w-4 h-4" />
                <span className="sm:hidden font-mono text-xs">Add Card</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Trade Strategy Guidelines */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-xs text-slate-600 space-y-2">
        <span className="font-mono font-bold uppercase text-slate-900 block">Trading Rule of Thumb in 2026:</span>
        <p className="leading-relaxed">
          When trading multiple lower-value raw cards ($5 - $20) for a single high-tier grail ($100+), the collector giving up the grail generally expects a <strong>10% to 15% value premium</strong> in exchange for consolidating liquidity. In single-card 1:1 swaps of equal rarity tiers, trades within 5% are universally considered fair.
        </p>
      </div>
    </div>
  );
};
