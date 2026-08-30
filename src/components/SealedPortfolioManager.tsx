import React, { useState, useMemo } from 'react';
import { Package, Plus, Trash2, DollarSign, Calendar, Layers, ShieldCheck, Tag, ExternalLink, Search } from 'lucide-react';
import { PortfolioSealedEntry, DisplayCurrency, SealedProduct, CardSet } from '../types';
import { generateSealedProductsFromSets } from '../data/sealedAndMarketData';
import { formatCurrency, getCurrencySymbol, convertUSDToCurrency, convertCurrencyToUSD } from '../utils/formatters';

interface SealedPortfolioManagerProps {
  entries: PortfolioSealedEntry[];
  currency?: DisplayCurrency;
  availableSets?: CardSet[];
  onAddSealedEntry: (entry: PortfolioSealedEntry) => void;
  onDeleteSealedEntry: (id: string) => void;
  onMarkSoldSealedEntry: (id: string, salePrice: number) => void;
}

export const SealedPortfolioManager: React.FC<SealedPortfolioManagerProps> = ({
  entries,
  currency = 'USD',
  availableSets = [],
  onAddSealedEntry,
  onDeleteSealedEntry,
  onMarkSoldSealedEntry,
}) => {
  const catalogProducts = useMemo(() => {
    return generateSealedProductsFromSets(availableSets);
  }, [availableSets]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [isCustomEntry, setIsCustomEntry] = useState(false);

  // Custom Product State
  const [customName, setCustomName] = useState('');
  const [customType, setCustomType] = useState<SealedProduct['type']>('Booster Box');
  const [customLanguage, setCustomLanguage] = useState('English');
  const [customMarketPrice, setCustomMarketPrice] = useState<number>(150);

  const [selectedProductId, setSelectedProductId] = useState<string>(catalogProducts[0]?.id || 'none');
  const [quantity, setQuantity] = useState<number>(1);
  const [purchasePrice, setPurchasePrice] = useState<number>(
    convertUSDToCurrency(catalogProducts[0]?.marketPrice || 150, currency)
  );
  const [condition, setCondition] = useState<PortfolioSealedEntry['condition']>('Factory Sealed');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'SOLD'>('ACTIVE');

  // Filtered catalog products for selector
  const filteredCatalog = useMemo(() => {
    if (!productSearch.trim()) return catalogProducts.slice(0, 80);
    const query = productSearch.toLowerCase();
    return catalogProducts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.set.name.toLowerCase().includes(query) ||
      p.type.toLowerCase().includes(query)
    ).slice(0, 100);
  }, [catalogProducts, productSearch]);

  const activeProduct = useMemo(() => {
    return catalogProducts.find((p) => p.id === selectedProductId) || catalogProducts[0];
  }, [catalogProducts, selectedProductId]);

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = catalogProducts.find((p) => p.id === prodId);
    if (prod) {
      setPurchasePrice(convertUSDToCurrency(prod.marketPrice, currency));
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceInUSD = convertCurrencyToUSD(purchasePrice, currency);

    let productToUse: SealedProduct;

    if (isCustomEntry) {
      const customUsdMarket = convertCurrencyToUSD(customMarketPrice, currency);
      productToUse = {
        id: `custom-sealed-${Date.now()}`,
        name: customName.trim() || 'Custom Sealed Product',
        type: customType,
        language: customLanguage,
        set: {
          id: 'custom-set',
          name: 'Custom / Unclassified Set',
          series: 'Vault',
          printedTotal: 0,
          total: 0,
          releaseDate: purchaseDate,
        },
        releaseDate: purchaseDate,
        msrp: priceInUSD,
        marketPrice: customUsdMarket,
        imageUrl: undefined,
        packCount: customType === 'Booster Box' ? 36 : customType === 'Elite Trainer Box' ? 9 : 6,
      };
    } else {
      productToUse = activeProduct;
    }

    const newEntry: PortfolioSealedEntry = {
      id: `sealed-entry-${Date.now()}`,
      productId: productToUse.id,
      product: productToUse,
      quantity,
      purchasePrice: priceInUSD,
      purchaseCurrency: currency,
      purchaseDate,
      condition,
      notes: notes.trim() || undefined,
      isSold: false,
    };

    onAddSealedEntry(newEntry);
    setIsModalOpen(false);
    setNotes('');
    setCustomName('');
  };

  const activeEntries = entries.filter((e) => !e.isSold);
  const soldEntries = entries.filter((e) => e.isSold);

  const displayedEntries = activeTab === 'ACTIVE' ? activeEntries : soldEntries;

  // Portfolio Totals
  const totalCostBasisUSD = activeEntries.reduce((acc, curr) => acc + curr.purchasePrice * curr.quantity, 0);
  const totalMarketValueUSD = activeEntries.reduce((acc, curr) => acc + curr.product.marketPrice * curr.quantity, 0);
  const totalPnlUSD = totalMarketValueUSD - totalCostBasisUSD;
  const pnlPercent = totalCostBasisUSD > 0 ? (totalPnlUSD / totalCostBasisUSD) * 100 : 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 shadow-xs">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">
              Sealed Product Vault & Portfolio
            </h2>
            <p className="font-mono text-xs text-[#64748B]">
              Track Booster Boxes, ETBs, Bundles & Cases with real-time market value & cost-basis analytics
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Sealed Product
        </button>
      </div>

      {/* Analytics Summary Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Total Vault Value</span>
          <div className="text-xl font-bold text-[#0F172A]">
            {formatCurrency(totalMarketValueUSD, currency)}
          </div>
          <span className="text-[11px] text-[#64748B]">{activeEntries.length} Items Vaulted</span>
        </div>

        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Total Cost Basis</span>
          <div className="text-xl font-bold text-[#0F172A]">
            {formatCurrency(totalCostBasisUSD, currency)}
          </div>
          <span className="text-[11px] text-[#64748B]">Invested Capital</span>
        </div>

        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-1">
          <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-bold">Unrealized Profit / Loss</span>
          <div className={`text-xl font-bold ${totalPnlUSD >= 0 ? 'text-[#16A34A]' : 'text-[#FF4500]'}`}>
            {totalPnlUSD >= 0 ? '+' : ''}
            {formatCurrency(totalPnlUSD, currency)} ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%)
          </div>
          <span className="text-[11px] text-[#64748B]">Holdings Performance</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ACTIVE'
              ? 'bg-[#0F172A] text-white font-bold'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Active Vault Items ({activeEntries.length})
        </button>
        <button
          onClick={() => setActiveTab('SOLD')}
          className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'SOLD'
              ? 'bg-[#0F172A] text-white font-bold'
              : 'bg-[#F8FAFC] text-[#64748B] hover:text-[#0F172A]'
          }`}
        >
          Realized Sales ({soldEntries.length})
        </button>
      </div>

      {/* List Table */}
      {displayedEntries.length === 0 ? (
        <div className="p-8 text-center bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl font-mono text-xs text-[#64748B] space-y-2">
          <Package className="w-8 h-8 mx-auto text-[#94A3B8]" />
          <p>No sealed products logged in this view yet.</p>
          <p className="text-[11px] text-[#94A3B8]">
            Click "Add Sealed Product" to start building your booster box and ETB portfolio.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Product Name & Type</th>
                <th className="py-2.5 px-3">Language</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Cost Basis</th>
                <th className="py-2.5 px-3 text-right">Market Price</th>
                <th className="py-2.5 px-3 text-right">Total Gain / Loss</th>
                <th className="py-2.5 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {displayedEntries.map((entry) => {
                const costUSD = entry.purchasePrice * entry.quantity;
                const currentUSD = entry.product.marketPrice * entry.quantity;
                const pnl = currentUSD - costUSD;

                return (
                  <tr key={entry.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {entry.product.imageUrl && (
                          <div className="w-10 h-10 flex-shrink-0 bg-white border border-[#E2E8F0] rounded p-1 shadow-2xs">
                            <img src={entry.product.imageUrl} alt={entry.product.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-[#0F172A]">{entry.product.name}</div>
                          <div className="text-[10px] text-[#64748B] flex items-center gap-2 mt-1">
                            <span className="px-1.5 py-0.5 bg-[#E2E8F0] rounded text-[#0F172A] font-bold">
                              {entry.product.type}
                            </span>
                            {entry.product.set.logoUrl && (
                              <img src={entry.product.set.logoUrl} alt={entry.product.set.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="h-3 object-contain" />
                            )}
                            <span>{entry.product.set.name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[#F1F5F9] border border-[#CBD5E1] text-[#334155]">
                        {entry.product.language}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#0F172A]">
                      {entry.quantity}x
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#334155]">
                      {formatCurrency(entry.purchasePrice, currency)} / unit
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#0F172A]">
                      {formatCurrency(entry.product.marketPrice, currency)}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold ${pnl >= 0 ? 'text-[#16A34A]' : 'text-[#FF4500]'}`}>
                      {pnl >= 0 ? '+' : ''}
                      {formatCurrency(pnl, currency)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onDeleteSealedEntry(entry.id)}
                        className="p-1.5 text-[#94A3B8] hover:text-[#DC143C] hover:bg-[#FFF0F3] rounded transition-colors cursor-pointer"
                        title="Delete from Vault"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl max-w-lg w-full p-6 space-y-5 animate-fade-in font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="font-heading font-bold text-base text-[#0F172A] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#DC143C]" /> Add Sealed Product to Vault
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#0F172A] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#E2E8F0] pb-2">
                <span className="font-bold text-[#0F172A]">Entry Mode:</span>
                <div className="flex bg-[#F1F5F9] p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setIsCustomEntry(false)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      !isCustomEntry ? 'bg-white text-[#DC143C] shadow-2xs' : 'text-[#64748B]'
                    }`}
                  >
                    Set Catalog ({catalogProducts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCustomEntry(true)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                      isCustomEntry ? 'bg-white text-[#DC143C] shadow-2xs' : 'text-[#64748B]'
                    }`}
                  >
                    Custom Product
                  </button>
                </div>
              </div>

              {!isCustomEntry ? (
                <div className="space-y-2">
                  <label className="block text-[#0F172A] font-bold">Search Catalog Product:</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Filter by set or product (e.g. 151, Prismatic, Booster Box)..."
                      className="w-full pl-8 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>
                  <div className="flex gap-4">
                    {activeProduct?.imageUrl && (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-white border border-[#E2E8F0] rounded-xl p-2 shadow-sm flex items-center justify-center">
                        <img src={activeProduct.imageUrl} alt={activeProduct.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain" />
                      </div>
                    )}
                    <select
                      value={selectedProductId}
                      onChange={(e) => handleProductChange(e.target.value)}
                      className="flex-1 h-fit p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-xs focus:outline-none focus:border-[#DC143C]"
                    >
                      {filteredCatalog.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.language}) - Market: ${p.marketPrice}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1">Custom Product Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Special Pin Collection / Japanese Deck Box..."
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      required
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#0F172A] font-bold mb-1">Type:</label>
                      <select
                        value={customType}
                        onChange={(e) => setCustomType(e.target.value as any)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#DC143C]"
                      >
                        <option value="Booster Box">Booster Box</option>
                        <option value="Elite Trainer Box">Elite Trainer Box</option>
                        <option value="Booster Bundle">Booster Bundle</option>
                        <option value="Tin / Collection">Tin / Collection</option>
                        <option value="Case">Case</option>
                        <option value="Packs">Loose Packs</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#0F172A] font-bold mb-1">Language:</label>
                      <select
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#DC143C]"
                      >
                        <option value="English">English</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Korean">Korean</option>
                        <option value="Traditional Chinese">Traditional Chinese</option>
                        <option value="German">German</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#0F172A] font-bold mb-1">
                      Estimated Market Price ({getCurrencySymbol(currency)}):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={customMarketPrice}
                      onChange={(e) => setCustomMarketPrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#DC143C]"
                  />
                </div>

                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">
                    Purchase Price ({getCurrencySymbol(currency)}):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#DC143C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Box / Seal Condition:</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#DC143C]"
                  >
                    <option value="Factory Sealed">Factory Sealed</option>
                    <option value="Acrylic Cased">Acrylic Cased</option>
                    <option value="Minor Tear">Minor Tear in Foil</option>
                    <option value="Damaged Box">Damaged Outer Box</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#0F172A] font-bold mb-1">Purchase Date:</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#DC143C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#0F172A] font-bold mb-1">Notes / Vault Location:</label>
                <input
                  type="text"
                  placeholder="e.g. Acrylic case on shelf #3..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl focus:outline-none focus:border-[#DC143C]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#F1F5F9] text-[#334155] rounded-xl hover:bg-[#E2E8F0] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold rounded-xl cursor-pointer shadow-xs"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
