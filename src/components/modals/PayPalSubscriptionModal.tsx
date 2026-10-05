import React, { useState } from 'react';
import { X, Zap, Lock, AlertCircle, Loader2, Check, ShieldCheck, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../../types';
import { auth } from '../../lib/firebase';

interface PayPalSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: AccountTier;
  initialCycle?: 'monthly' | 'yearly';
  clientId?: string;
  onApproveSubscription: (
    orderId: string,
    tier: AccountTier,
    cycle?: 'monthly' | 'yearly',
    provider?: 'paypal'
  ) => Promise<void>;
  getUserToken?: () => Promise<string | undefined>;
}

export const PayPalSubscriptionModal: React.FC<PayPalSubscriptionModalProps> = ({
  isOpen,
  onClose,
  tierName,
  initialCycle = 'monthly',
  onApproveSubscription,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialCycle);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tierLimit = TIER_LIMITS[tierName] || TIER_LIMITS.Bunch;
  const isYearly = billingCycle === 'yearly';
  const price = isYearly ? tierLimit.priceYearly : tierLimit.priceMonthly;
  const durationText = isYearly ? '365 Days Unlocked' : '30 Days Unlocked';

  React.useEffect(() => {
    setBillingCycle(initialCycle);
  }, [initialCycle, isOpen]);

  const handleClose = () => {
    if (isProcessing) return;
    setErrorMessage(null);
    setIsProcessing(false);
    onClose();
  };

  const handleProceedWithPayPal = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const token = await auth.currentUser?.getIdToken();
      const returnUrl = `${window.location.origin}/app?paypal_success=true&tier=${encodeURIComponent(tierName)}&cycle=${encodeURIComponent(billingCycle)}`;
      const cancelUrl = `${window.location.origin}/app?paypal_cancel=true`;

      const response = await fetch('/api/billing/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tier: tierName,
          cycle: billingCycle,
          returnUrl,
          cancelUrl,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Unable to initiate PayPal checkout. Please try again.');
      }

      const orderData = await response.json();
      const approvalUrl = orderData.approvalUrl;

      if (!approvalUrl) {
        // Direct local capture fallback if no approval url is returned
        if (orderData.orderId) {
          await onApproveSubscription(orderData.orderId, tierName, billingCycle, 'paypal');
          handleClose();
          return;
        }
        throw new Error('PayPal approval URL was not returned. Please try again.');
      }

      // Open PayPal Checkout in an optimized window or redirect
      const width = 500;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2.5;

      const popup = window.open(
        approvalUrl,
        'PayPalCheckout',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,status=no`
      );

      if (!popup || popup.closed || typeof popup.closed === 'undefined') {
        // If popup blocker intercepted, redirect directly
        window.location.href = approvalUrl;
      }
    } catch (err: any) {
      console.error('[PayPal Checkout Error]', err);
      setErrorMessage(err.message || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in font-mono">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl overflow-hidden relative animate-scale-up space-y-5 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C]">
              <Zap className="w-6 h-6 text-[#DC143C]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-[#DC143C] uppercase tracking-wider block">
                  Flexible Pass • No Forced Contracts
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A]">
                {tierName} Plan Pass
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="p-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] cursor-pointer transition-colors disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Monthly vs Yearly Billing Cycle Switcher */}
        <div className="bg-[#F8FAFC] p-1.5 rounded-xl border border-[#CBD5E1] grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            disabled={isProcessing}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#DC143C] shadow-xs border-2 border-[#DC143C]'
                : 'bg-white/60 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <span className="font-mono text-[10px] uppercase text-[#64748B]">30-Day Monthly Pass</span>
            <span className="font-num text-sm font-bold text-[#0F172A]">
              ${tierLimit.priceMonthly} / month
            </span>
          </button>

          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            disabled={isProcessing}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center relative cursor-pointer ${
              billingCycle === 'yearly'
                ? 'bg-white text-[#DC143C] shadow-xs border-2 border-[#DC143C]'
                : 'bg-white/60 text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <div className="absolute -top-2.5 right-2 bg-emerald-600 text-white font-mono text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase shadow-xs">
              Save {tierLimit.yearlyDiscountPercent}%
            </div>
            <span className="font-mono text-[10px] uppercase text-[#64748B] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#DC143C]" />
              365-Day Annual Pass
            </span>
            <span className="font-num text-sm font-bold text-[#0F172A]">
              ${tierLimit.priceYearly} / year
            </span>
          </button>
        </div>

        {/* Pricing Summary Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#F8FAFC] via-[#FFF8F9] to-[#F8FAFC] border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-[#DC143C] uppercase tracking-wider block">
                Total Charge ({billingCycle === 'yearly' ? '365 Days' : '30 Days'})
              </span>
              <span className="text-xs font-mono text-[#475569] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#DC143C]" />
                {durationText} of {tierName} Features
              </span>
            </div>
            <div className="text-right font-num">
              <div className="font-extrabold text-3xl text-[#0F172A]">
                ${price}.00
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-bold">
                USD • Flexible Pass (Opt out anytime)
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] text-[11px] font-mono text-[#64748B] leading-relaxed">
            Pay-per-period subscription: Instant upgrade upon payment with zero locked obligations. You can opt out or renew at your convenience.
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#334155] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#DC143C] shrink-0" />
            <span>{tierLimit.maxDecks === Infinity ? 'Unlimited' : tierLimit.maxDecks} Custom Decks</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#DC143C] shrink-0" />
            <span>{tierLimit.maxGradedSlabs === Infinity ? 'Unlimited' : `${tierLimit.maxGradedSlabs} Graded Slabs`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#DC143C] shrink-0" />
            <span>{tierLimit.maxSealedItems === Infinity ? 'Unlimited' : `${tierLimit.maxSealedItems} Sealed Vault`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-[#DC143C] shrink-0" />
            <span>{tierLimit.hasMultiCurrency ? 'Multi-Currency Live FX' : 'USD Native Rates'}</span>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 leading-relaxed font-mono">{errorMessage}</p>
          </div>
        )}

        {/* Official PayPal Checkout Button */}
        <div className="space-y-2.5 pt-1">
          <button
            type="button"
            onClick={handleProceedWithPayPal}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] active:scale-[0.99] text-[#003087] font-bold text-sm transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed select-none"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#003087]" />
                <span>Connecting to PayPal Secure Checkout...</span>
              </>
            ) : (
              <>
                {/* Official PayPal Icon SVG */}
                <svg className="h-5 w-auto" viewBox="0 0 100 32" fill="currentColor">
                  <path d="M12.2 4.1h-7c-.5 0-.9.4-1 .9L1.4 23.4c0 .3.2.6.5.6h3.4c.5 0 .9-.4 1-.9l.7-4.5c.1-.5.5-.9 1-.9h2.3c4.7 0 7.4-2.3 8.1-6.8.3-2-.1-3.6-1.1-4.7-1.1-1.3-3-2.1-5.1-2.1zm.8 6.6c-.4 2.8-2.3 2.8-4.5 2.8h-1.2l.9-5.7c0-.2.2-.4.4-.4h.8c1.5 0 2.9 0 3.4.9.4.6.4 1.4.2 2.4z" fill="#003087"/>
                  <path d="M31.2 11.2h-3.4c-.4 0-.8.3-.9.7l-.1.9-.3-.4c-.8-1.2-2.6-1.6-4.4-1.6-4.1 0-7.7 3.1-8.3 7.3-.4 2.1.1 4.2 1.3 5.6 1.1 1.3 2.8 1.9 4.7 1.9 3.3 0 5.2-2.1 5.2-2.1l-.1.9c0 .3.2.6.5.6h3.1c.5 0 .9-.4 1-.9l1.8-11.7c-.1-.7-.5-1.2-1.1-1.2zm-4.3 6.9c-.3 2-2 3.4-4 3.4-1.1 0-2-.4-2.5-1.1-.5-.7-.7-1.7-.5-2.7.3-2 2-3.4 4.1-3.4 1 0 1.9.4 2.4 1.1.5.7.7 1.7.5 2.7z" fill="#0079C1"/>
                  <path d="M48.2 11.2h-3.5c-.3 0-.6.2-.8.5l-4.7 6.9-2-6.7c-.1-.4-.5-.7-.9-.7h-3.5c-.4 0-.7.4-.5.8l4.1 12-3.5 4.9c-.3.4 0 1 .5 1h3.5c.3 0 .6-.2.8-.5l11.4-16.9c.3-.5 0-1.4-.4-1.4z" fill="#0079C1"/>
                  <path d="M60.2 4.1h-7c-.5 0-.9.4-1 .9L49.4 23.4c0 .3.2.6.5.6h3.6c.4 0 .7-.3.8-.7l.8-5c.1-.5.5-.9 1-.9h2.3c4.7 0 7.4-2.3 8.1-6.8.3-2-.1-3.6-1.1-4.7-1.1-1.3-3-2.1-5.2-2.1zm.8 6.6c-.4 2.8-2.3 2.8-4.5 2.8h-1.2l.9-5.7c0-.2.2-.4.4-.4h.8c1.5 0 2.9 0 3.4.9.4.6.4 1.4.2 2.4z" fill="#003087"/>
                  <path d="M79.2 11.2h-3.4c-.4 0-.8.3-.9.7l-.1.9-.3-.4c-.8-1.2-2.6-1.6-4.4-1.6-4.1 0-7.7 3.1-8.3 7.3-.4 2.1.1 4.2 1.3 5.6 1.1 1.3 2.8 1.9 4.7 1.9 3.3 0 5.2-2.1 5.2-2.1l-.1.9c0 .3.2.6.5.6h3.1c.5 0 .9-.4 1-.9l1.8-11.7c-.1-.7-.5-1.2-1.1-1.2zm-4.3 6.9c-.3 2-2 3.4-4 3.4-1.1 0-2-.4-2.5-1.1-.5-.7-.7-1.7-.5-2.7.3-2 2-3.4 4.1-3.4 1 0 1.9.4 2.4 1.1.5.7.7 1.7.5 2.7z" fill="#0079C1"/>
                  <path d="M84.2 4.6l-2.8 18.3c0 .3.2.6.5.6h3.1c.5 0 .9-.4 1-.9l2.8-17.7c0-.3-.2-.6-.5-.6h-3.6c-.3.1-.5.2-.5.3z" fill="#0079C1"/>
                </svg>
                <span>Pay with PayPal • ${price}.00 USD</span>
                <ArrowRight className="w-4 h-4 text-[#003087]" />
              </>
            )}
          </button>
        </div>

        {/* Guarantee */}
        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#64748B]" />
            Encrypted 256-bit TLS
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Flexible access • Opt out or renew anytime
          </span>
        </div>
      </div>
    </div>
  );
};
