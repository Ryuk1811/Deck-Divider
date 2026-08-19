import React from 'react';
import { ListOrdered, Bell, CheckCircle2 } from 'lucide-react';
import { DisplayCurrency } from '../../../types';

interface ListsMockupProps {
  currency?: DisplayCurrency;
}

export const ListsMockup: React.FC<ListsMockupProps> = ({ currency = 'USD' }) => {
  const customLists = [
    {
      id: 'list-1',
      title: 'Grail Targets (PSA 10)',
      itemCount: 8,
      targetBudget: '$4,500.00',
      totalMarket: '$3,920.00',
      status: 'Target Price Hit',
      color: 'border-l-[#DC143C]',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'list-2',
      title: 'Tournament Staples 2026',
      itemCount: 18,
      targetBudget: '$320.00',
      totalMarket: '$285.40',
      status: 'Ready to buy (-11%)',
      color: 'border-l-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'list-3',
      title: 'Vintage Sealed & Slabs',
      itemCount: 5,
      targetBudget: '$8,200.00',
      totalMarket: '$9,100.00',
      status: 'Above target (+11%)',
      color: 'border-l-amber-500',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
          <ListOrdered className="w-4 h-4 text-[#DC143C] ml-1.5" />
          <span className="text-xs font-semibold font-mono">Custom Curated Watchlists & Targets</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#64748B] bg-[#F8FAFC] px-2 py-0.5 rounded border border-[#E2E8F0] flex items-center gap-1">
            <Bell className="w-3 h-3 text-[#DC143C]" />
            Price Alerts Active
          </span>
        </div>
      </div>

      {/* Lists Content */}
      <div className="p-3.5 sm:p-4 bg-[#F8FAFC] space-y-3">
        {customLists.map((list) => (
          <div
            key={list.id}
            className={`p-3.5 sm:p-4 bg-white rounded-xl border border-[#E2E8F0] border-l-4 ${list.color} shadow-xs hover:border-[#CBD5E1] transition-all`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0F172A] font-heading">{list.title}</h4>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                    {list.itemCount} items
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] font-mono mt-0.5">
                  Target Budget: <span className="font-semibold text-[#0F172A]">{list.targetBudget}</span> • Market: <span className="font-semibold text-emerald-600">{list.totalMarket}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold flex items-center gap-1 border ${list.badgeColor}`}>
                  <CheckCircle2 className="w-3 h-3" />
                  {list.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
