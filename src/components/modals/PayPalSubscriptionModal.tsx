import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Lock, AlertCircle, Loader2, Check, ShieldCheck, Sparkles, Calendar, RefreshCw } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../../types';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: AccountTier;
  initialCycle?: 'monthly' | 'yearly';
  clientId: string;
  onApproveSubscription: (
    orderId: string,
    tier: AccountTier,
    cycle?: 'monthly' | 'yearly',
    provider?: 'paypal'
  ) => Promise<void>;
  getUserToken?: () => Promise<string | undefined>;
}

// Singleton failsafe script loader
let paypalOrderScriptPromise: Promise<void> | null = null;

function loadPayPalOrderSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  // 1. Instant check
  if (window.paypal && typeof window.paypal.Buttons === 'function') {
    return Promise.resolve();
  }

  // 2. Active promise check
  if (paypalOrderScriptPromise) {
    return paypalOrderScriptPromise;
  }

  const activeClientId = (clientId && clientId.trim().length > 0)
    ? clientId.trim()
    : ((import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || 'sb');

  paypalOrderScriptPromise = new Promise<void>((resolve, reject) => {
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        paypalOrderScriptPromise = null;
        reject(new Error('PayPal SDK connection timed out. Please check your connection or retry.'));
      }
    }, 9000);

    const checkReady = () => {
      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve();
        }
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    // Check existing script tags in DOM
    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (checkReady()) {
          clearInterval(interval);
        } else if (attempts >= 20) {
          clearInterval(interval);
          try { existingScript.remove(); } catch {}
          appendFreshScript();
        }
      }, 100);
      return;
    }

    function appendFreshScript() {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
        activeClientId
      )}&intent=capture&currency=USD`;
      script.async = true;

      script.onload = () => {
        let attempts = 0;
        const poll = setInterval(() => {
          attempts++;
          if (checkReady()) {
            clearInterval(poll);
          } else if (attempts >= 15) {
            clearInterval(poll);
            if (!isSettled) {
              isSettled = true;
              clearTimeout(timer);
              paypalOrderScriptPromise = null;
              reject(new Error('PayPal SDK loaded but Buttons component was not found.'));
            }
          }
        }, 100);
      };

      script.onerror = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          paypalOrderScriptPromise = null;
          reject(new Error('Failed to load PayPal payment SDK.'));
        }
      };

      document.body.appendChild(script);
    }

    appendFreshScript();
  });

  return paypalOrderScriptPromise;
}

export const PayPalSubscriptionModal: React.FC<PayPalSubscriptionModalProps> = ({
  isOpen,
  onClose,
  tierName,
  initialCycle = 'monthly',
  clientId,
  onApproveSubscription,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialCycle);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSdkLoading, setIsSdkLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonInstanceRef = useRef<any>(null);

  const effectiveClientId =
    clientId || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || 'sb';

  const tierLimit = TIER_LIMITS[tierName] || TIER_LIMITS.Bunch;
  const isYearly = billingCycle === 'yearly';
  const price = isYearly ? tierLimit.priceYearly : tierLimit.priceMonthly;
  const durationText = isYearly ? '365 Days Unlocked' : '30 Days Unlocked';

  const handleClose = () => {
    setErrorMessage(null);
    setIsProcessing(false);
    onClose();
  };

  useEffect(() => {
    setBillingCycle(initialCycle);
  }, [initialCycle, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      if (paypalButtonInstanceRef.current && typeof paypalButtonInstanceRef.current.close === 'function') {
        try { paypalButtonInstanceRef.current.close(); } catch {}
        paypalButtonInstanceRef.current = null;
      }
      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = '';
      }
      setIsSdkLoading(true);
      setErrorMessage(null);
      setIsProcessing(false);
      return;
    }

    let isSubscribed = true;
    setIsSdkLoading(true);
    setErrorMessage(null);

    // Clean up previous button instance if cycle or tier changed
    if (paypalButtonInstanceRef.current && typeof paypalButtonInstanceRef.current.close === 'function') {
      try { paypalButtonInstanceRef.current.close(); } catch {}
      paypalButtonInstanceRef.current = null;
    }
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '';
    }

    loadPayPalOrderSdk(effectiveClientId)
      .then(() => {
        if (!isSubscribed) return;

        if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
          throw new Error('PayPal Buttons component not available in SDK.');
        }

        if (!buttonContainerRef.current) return;
        buttonContainerRef.current.innerHTML = '';

        const buttons = window.paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'gold',
            layout: 'vertical',
            label: 'pay',
          },
          createOrder: function (_data: any, actions: any) {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: price.toFixed(2),
                    currency_code: 'USD',
                  },
                  description: `DECK / divider ${tierName} Tier Pass — ${durationText} ($${price} USD One-Time)`,
                },
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING',
              },
            });
          },
          onApprove: async function (data: any, actions: any) {
            try {
              setIsProcessing(true);
              setErrorMessage(null);

              let orderId = data.orderID;
              if (actions && actions.order && typeof actions.order.capture === 'function') {
                try {
                  const captureDetails = await actions.order.capture();
                  orderId = captureDetails?.id || orderId;
                } catch (captureErr) {
                  console.warn('PayPal capture notice (orderId preserved):', captureErr);
                }
              }

              await onApproveSubscription(orderId || `ORDER_${Date.now()}`, tierName, billingCycle, 'paypal');
              handleClose();
            } catch (err: any) {
              setErrorMessage(
                err?.message || 'Failed to activate your plan. Please contact support.'
              );
            } finally {
              setIsProcessing(false);
            }
          },
          onError: function (err: any) {
            console.error('PayPal button error:', err);
            setErrorMessage('An error occurred during payment processing. Please try again.');
          },
          onCancel: function () {
            // User cancelled
          },
        });

        paypalButtonInstanceRef.current = buttons;

        if (buttonContainerRef.current) {
          const renderPromise = buttons.render(buttonContainerRef.current);
          if (renderPromise && typeof renderPromise.then === 'function') {
            renderPromise
              .then(() => {
                if (isSubscribed) setIsSdkLoading(false);
              })
              .catch((err: any) => {
                console.warn('Button render error (possibly unmounted):', err);
                if (isSubscribed) setIsSdkLoading(false);
              });
          } else {
            if (isSubscribed) setIsSdkLoading(false);
          }
        } else {
          if (isSubscribed) setIsSdkLoading(false);
        }

        // Safety timeout to dismiss loading spinner after 1.5s
        setTimeout(() => {
          if (isSubscribed) setIsSdkLoading(false);
        }, 1500);
      })
      .catch((err: any) => {
        console.error('PayPal SDK loading error:', err);
        if (isSubscribed) {
          setIsSdkLoading(false);
          setErrorMessage('Unable to connect to PayPal. Click retry or check connection.');
        }
      });

    return () => {
      isSubscribed = false;
      if (paypalButtonInstanceRef.current && typeof paypalButtonInstanceRef.current.close === 'function') {
        try { paypalButtonInstanceRef.current.close(); } catch {}
        paypalButtonInstanceRef.current = null;
      }
    };
  }, [isOpen, tierName, billingCycle, price, effectiveClientId, reloadKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in font-mono">
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
                  One-Time Pass • No Auto-Renewal
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
            className="p-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] cursor-pointer transition-colors"
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
            Flexible pay-per-period access: You receive full access for your purchased duration with zero continuous forced mandates or locked recurring contracts. Renew or change plans whenever you choose.
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

        {/* Error Message & Retry */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed font-mono">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                paypalOrderScriptPromise = null;
                setReloadKey(k => k + 1);
              }}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        )}

        {/* PayPal Button Container */}
        <div className="space-y-3 min-h-[50px] relative">
          {isSdkLoading && (
            <div className="h-12 w-full rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-500 font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-[#DC143C]" />
              <span>Connecting to PayPal Secure Checkout...</span>
            </div>
          )}

          {isProcessing && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center gap-3 font-mono">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
              <span className="text-xs font-bold text-amber-800">
                Authorizing payment &amp; activating {tierName} pass...
              </span>
            </div>
          )}

          <div
            ref={buttonContainerRef}
            className={`w-full min-h-[48px] ${isProcessing ? 'hidden' : 'block'}`}
          />
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
