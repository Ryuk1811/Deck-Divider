import React from 'react';
import { Package, ArrowUpRight, Boxes } from 'lucide-react';
import { DisplayCurrency } from '../../../types';

interface SealedVaultMockupProps {
  currency?: DisplayCurrency;
}

export const SealedVaultMockup: React.FC<SealedVaultMockupProps> = ({ currency = 'USD' }) => {
  const sealedItems = [
    {
      name: 'Evolving Skies Booster Box Case (6x)',
      type: 'Sealed Case',
      units: 6,
      buyPrice: 840.0,
      currentMarket: 4500.0,
      gain: '+$3,660.00 (+435%)',
      isProfit: true,
    },
    {
      name: 'Scarlet & Violet 151 Ultra-Premium Collection',
      type: 'UPC Box',
      units: 4,
      buyPrice: 440.0,
      currentMarket: 720.0,
      gain: '+$280.00 (+63.6%)',
      isProfit: true,
    },
    {
      name: 'Crown Zenith Pokémon Center Elite Trainer Box',
      type: 'PC ETB',
      units: 3,
      buyPrice: 195.0,
      currentMarket: 360.0,
      gain: '+$165.00 (+84.6%)',
      isProfit: true,
    },
  ];

  return (
    <div className="w-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] overflow-hidden text-left select-none shadow-sm">
      {/* Window Header */}
      <div className="bg-white px-4 py-3 text-[#0F172A] flex items-center justify-between border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#DC143C]/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block"></span>
          </div>
          <Package className="w-4 h-4 text-[#DC143C] ml-1.5" />
          <span className="text-xs font-semibold font-mono">Sealed Vault & Inventory Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
            Unrealized ROI: +279%
          </span>
        </div>
      </div>

      {/* Vault Summary Bar (Depth 1) */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <span className="text-[10px] font-mono uppercase text-[#64748B]">Sealed Market NAV</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A] mt-0.5">$5,580.00</div>
          <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> +$4,105 Total Profit
          </span>
        </div>
        <div className="bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <span className="text-[10px] font-mono uppercase text-[#64748B]">Cost Basis</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#0F172A] mt-0.5">$1,475.00</div>
          <span className="text-[10px] font-mono text-[#64748B]">13 Sealed Units</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-white p-2.5 rounded-lg border border-[#E2E8F0]">
          <span className="text-[10px] font-mono uppercase text-[#64748B]">Storage Multiplier</span>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#DC143C] mt-0.5">3.78x</div>
          <span className="text-[10px] font-mono text-[#64748B]">Case Tracking Enabled</span>
        </div>
      </div>

      {/* Sealed Inventory Items (Depth 2) */}
      <div className="p-3.5 sm:p-4 space-y-2.5 bg-[#F8FAFC]">
        {sealedItems.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-[#E2E8F0] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#DC143C] transition-all shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 flex items-center justify-center shrink-0">
                <Boxes className="w-4 h-4 text-[#DC143C]" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#0F172A] font-heading">{item.name}</div>
                <div className="text-[10px] font-mono text-[#64748B]">
                  Type: {item.type} • Units: {item.units} • Cost: ${item.buyPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right pl-12 sm:pl-0">
              <div className="text-xs font-bold font-mono text-[#0F172A]">${item.currentMarket.toFixed(2)}</div>
              <div className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded inline-block">
                {item.gain}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
