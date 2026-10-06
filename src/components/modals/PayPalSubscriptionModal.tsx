import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Lock, AlertCircle, Loader2, Check, ShieldCheck, Sparkles, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../../types';
import { auth } from '../../lib/firebase';

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
  clientId?: string;
  onApproveSubscription: (
    orderId: string,
    tier: AccountTier,
    cycle?: 'monthly' | 'yearly',
    provider?: 'paypal'
  ) => Promise<void>;
  getUserToken?: () => Promise<string | undefined>;
}

let paypalSdkScriptPromise: Promise<void> | null = null;

function loadPayPalJsSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.paypal && typeof window.paypal.Buttons === 'function') {
    return Promise.resolve();
  }

  if (paypalSdkScriptPromise) {
    return paypalSdkScriptPromise;
  }

  const activeClientId = clientId?.trim() || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || '';

  if (!activeClientId) {
    return Promise.reject(new Error('PayPal Client ID is missing'));
  }

  paypalSdkScriptPromise = new Promise<void>((resolve, reject) => {
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        paypalSdkScriptPromise = null;
        reject(new Error('PayPal SDK script timeout'));
      }
    }, 8000);

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
              paypalSdkScriptPromise = null;
              reject(new Error('PayPal SDK loaded without Buttons component'));
            }
          }
        }, 100);
      };

      script.onerror = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          paypalSdkScriptPromise = null;
          reject(new Error('Failed to load PayPal JS SDK script'));
        }
      };

      document.body.appendChild(script);
    }

    appendFreshScript();
  });

  return paypalSdkScriptPromise;
}

export const PayPalSubscriptionModal: React.FC<PayPalSubscriptionModalProps> = ({
  isOpen,
  onClose,
  tierName,
  initialCycle = 'monthly',
  clientId = '',
  onApproveSubscription,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(initialCycle);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSdkLoading, setIsSdkLoading] = useState(true);
  const [sdkFailed, setSdkFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRef = useRef<any>(null);

  const tierLimit = TIER_LIMITS[tierName] || TIER_LIMITS.Bunch;
  const isYearly = billingCycle === 'yearly';
  const price = isYearly ? tierLimit.priceYearly : tierLimit.priceMonthly;
  const durationText = isYearly ? '365 Days Unlocked' : '30 Days Unlocked';

  const [activeClientId, setActiveClientId] = useState<string>(clientId);

  useEffect(() => {
    setBillingCycle(initialCycle);
  }, [initialCycle, isOpen]);

  // Fetch client ID if missing
  useEffect(() => {
    if (!isOpen) return;
    if (!activeClientId) {
      fetch('/api/billing/paypal-config')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.clientId) {
            setActiveClientId(data.clientId);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, activeClientId]);

  const handleClose = () => {
    if (isProcessing) return;
    setErrorMessage(null);
    setIsProcessing(false);
    onClose();
  };

  // Mount Standard PayPal JS SDK Buttons
  useEffect(() => {
    if (!isOpen) {
      if (paypalButtonsRef.current && typeof paypalButtonsRef.current.close === 'function') {
        try { paypalButtonsRef.current.close(); } catch {}
        paypalButtonsRef.current = null;
      }
      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = '';
      }
      setIsSdkLoading(true);
      setSdkFailed(false);
      setErrorMessage(null);
      setIsProcessing(false);
      return;
    }

    let isSubscribed = true;
    setIsSdkLoading(true);
    setSdkFailed(false);
    setErrorMessage(null);

    if (paypalButtonsRef.current && typeof paypalButtonsRef.current.close === 'function') {
      try { paypalButtonsRef.current.close(); } catch {}
      paypalButtonsRef.current = null;
    }
    if (buttonContainerRef.current) {
      buttonContainerRef.current.innerHTML = '';
    }

    const targetClientId = activeClientId || clientId || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || '';

    loadPayPalJsSdk(targetClientId)
      .then(() => {
        if (!isSubscribed) return;

        if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
          throw new Error('PayPal Buttons unavailable');
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
          createOrder: async () => {
            setErrorMessage(null);
            setIsProcessing(true);
            try {
              const token = await auth.currentUser?.getIdToken().catch(() => undefined);
              const res = await fetch('/api/billing/order/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  tier: tierName,
                  cycle: billingCycle,
                }),
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to create PayPal order');
              }

              const data = await res.json();
              if (!data.orderId) {
                throw new Error('No order ID returned');
              }
              return data.orderId;
            } catch (err: any) {
              setIsProcessing(false);
              setErrorMessage(err.message || 'Error creating PayPal order.');
              throw err;
            }
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              setIsProcessing(true);
              const token = await auth.currentUser?.getIdToken().catch(() => undefined);
              const res = await fetch('/api/billing/order/capture', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                  tier: tierName,
                  cycle: billingCycle,
                }),
              });

              if (!res.ok) {
                const captureErr = await res.json().catch(() => ({}));
                console.warn('Capture response notice:', captureErr);
              }

              await onApproveSubscription(data.orderID, tierName, billingCycle, 'paypal');
              handleClose();
            } catch (err: any) {
              setErrorMessage(err.message || 'Failed to capture payment. Please contact support.');
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (err: any) => {
            console.error('PayPal button execution error:', err);
            setIsProcessing(false);
            setErrorMessage('An error occurred during payment. You can try again or use direct checkout below.');
          },
          onCancel: () => {
            setIsProcessing(false);
          },
        });

        paypalButtonsRef.current = buttons;

        if (buttonContainerRef.current) {
          buttons.render(buttonContainerRef.current)
            .then(() => {
              if (isSubscribed) setIsSdkLoading(false);
            })
            .catch(() => {
              if (isSubscribed) {
                setIsSdkLoading(false);
                setSdkFailed(true);
              }
            });
        }

        // Safety fallback timer for spinner
        setTimeout(() => {
          if (isSubscribed) setIsSdkLoading(false);
        }, 1200);
      })
      .catch((err) => {
        console.warn('PayPal SDK load fallback:', err.message);
        if (isSubscribed) {
          setIsSdkLoading(false);
          setSdkFailed(true);
        }
      });

    return () => {
      isSubscribed = false;
      if (paypalButtonsRef.current && typeof paypalButtonsRef.current.close === 'function') {
        try { paypalButtonsRef.current.close(); } catch {}
        paypalButtonsRef.current = null;
      }
    };
  }, [isOpen, tierName, billingCycle, activeClientId]);

  // Direct checkout fallback if JS SDK script is blocked or fails
  const handleDirectPayPalCheckout = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const token = await auth.currentUser?.getIdToken().catch(() => undefined);
      const returnUrl = `${window.location.origin}/app?paypal_success=true&tier=${encodeURIComponent(tierName)}&cycle=${encodeURIComponent(billingCycle)}`;
      const cancelUrl = `${window.location.origin}/app?paypal_cancel=true`;

      const res = await fetch('/api/billing/order/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tier: tierName,
          cycle: billingCycle,
          returnUrl,
          cancelUrl,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initiate PayPal checkout');
      }

      const data = await res.json();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else if (data.orderId) {
        await onApproveSubscription(data.orderId, tierName, billingCycle, 'paypal');
        handleClose();
      } else {
        throw new Error('Approval URL missing');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Direct checkout failed. Please try again.');
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
                USD • One-Time Pass
              </div>
            </div>
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

        {/* Standard PayPal JS SDK Buttons Container */}
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

          {/* Standard PayPal JS SDK Buttons */}
          <div
            ref={buttonContainerRef}
            className={`w-full min-h-[48px] ${isProcessing || sdkFailed ? 'hidden' : 'block'}`}
          />

          {/* Fallback Direct PayPal Checkout Button if SDK fails or adblocker blocks */}
          {sdkFailed && !isProcessing && (
            <button
              type="button"
              onClick={handleDirectPayPalCheckout}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] active:scale-[0.99] text-[#003087] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pay with PayPal (${price}.00 USD)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Guarantee */}
        <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B] font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#64748B]" />
            Encrypted 256-bit TLS
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Instant Pass Activation
          </span>
        </div>
      </div>
    </div>
  );
};
