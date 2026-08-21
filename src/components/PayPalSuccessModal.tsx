import React from 'react';
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../types';

interface PayPalSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: AccountTier;
  subscriptionId?: string | null;
}

export const PayPalSuccessModal: React.FC<PayPalSuccessModalProps> = ({
  isOpen,
  onClose,
  tierName,
  subscriptionId,
}) => {
  if (!isOpen) return null;

  const limits = TIER_LIMITS[tierName];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] p-6 shadow-2xl rounded-2xl space-y-5 relative text-center">
        {/* Animated Success Icon */}
        <div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[#F0FDF4] border-2 border-[#16A34A] text-[#16A34A] shadow-inner">
          <CheckCircle2 className="w-10 h-10 text-[#16A34A] animate-bounce" />
          <Sparkles className="w-5 h-5 text-[#FFD700] absolute -top-1 -right-1" />
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#16A34A]/30 text-[#16A34A] font-mono text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAYPAL LIVE SUBSCRIPTION ACTIVATED</span>
          </div>
          <h2 className="font-heading font-bold text-2xl text-[#0F172A] pt-2">
            Welcome to {tierName} Tier!
          </h2>
          <p className="font-mono text-xs text-[#64748B]">
            Your PayPal subscription has been verified and applied to your account.
          </p>
        </div>

        {/* Plan Details Card */}
        <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-left space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#64748B]">Active Tier:</span>
            <span className="font-bold text-[#DC143C]">{tierName} Plan</span>
          </div>

          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <span className="text-[#64748B]">Billing Amount:</span>
            <span className="font-bold text-[#0F172A]">${limits.priceMonthly} / month</span>
          </div>

          {subscriptionId && (
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
              <span className="text-[#64748B]">PayPal Sub ID:</span>
              <span className="font-bold text-[#0F172A] text-[10px] select-all font-mono">
                {subscriptionId}
              </span>
            </div>
          )}

          <div className="space-y-1 pt-1">
            <span className="text-[#64748B] text-[11px] font-bold">Unlocked Capabilities:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="p-2 bg-white border border-[#E2E8F0] rounded flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#DC143C]" />
                <span>
                  <strong>{limits.maxDecks === Infinity ? 'Unlimited' : limits.maxDecks}</strong> Decks
                </span>
              </div>
              <div className="p-2 bg-white border border-[#E2E8F0] rounded flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#DC143C]" />
                <span>
                  <strong>{limits.maxCardsPerDeck === Infinity ? 'Unlimited' : limits.maxCardsPerDeck}</strong> Cards/Deck
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 rounded-lg shadow-md cursor-pointer transition-all"
        >
          <span>Continue to Portfolio</span>
          <ArrowRight className="w-4 h-4 text-[#DC143C]" />
        </button>
      </div>
    </div>
  );
};
