import React, { useEffect, useRef, useState } from 'react';
import { X, Crown, Lock, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { auth } from '../../lib/firebase';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalLifetimeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  onApproveLifetime: (orderId: string) => Promise<void>;
  userEmail?: string;
}

let paypalOneTimeScriptPromise: Promise<void> | null = null;

function loadPayPalOneTimeJsSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.paypal && typeof window.paypal.Buttons === 'function') {
    return Promise.resolve();
  }

  if (paypalOneTimeScriptPromise) {
    return paypalOneTimeScriptPromise;
  }

  const activeClientId = clientId?.trim() || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || '';

  if (!activeClientId) {
    return Promise.reject(new Error('PayPal Client ID missing'));
  }

  paypalOneTimeScriptPromise = new Promise<void>((resolve, reject) => {
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        paypalOneTimeScriptPromise = null;
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
              paypalOneTimeScriptPromise = null;
              reject(new Error('PayPal SDK loaded without Buttons component'));
            }
          }
        }, 100);
      };

      script.onerror = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          paypalOneTimeScriptPromise = null;
          reject(new Error('Failed to load PayPal JS SDK script'));
        }
      };

      document.body.appendChild(script);
    }

    appendFreshScript();
  });

  return paypalOneTimeScriptPromise;
}

export const PayPalLifetimeCheckoutModal: React.FC<PayPalLifetimeCheckoutModalProps> = ({
  isOpen,
  onClose,
  clientId = '',
  onApproveLifetime,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSdkLoading, setIsSdkLoading] = useState(true);
  const [sdkFailed, setSdkFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRef = useRef<any>(null);

  const [activeClientId, setActiveClientId] = useState<string>(clientId);

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

    loadPayPalOneTimeJsSdk(targetClientId)
      .then(() => {
        if (!isSubscribed) return;

        if (!window.paypal || !window.paypal.Buttons) {
          throw new Error('PayPal SDK loaded without Buttons component');
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
              const res = await fetch('/api/billing/lifetime/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
              });

              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to create lifetime order');
              }

              const data = await res.json();
              if (!data.orderId) {
                throw new Error('No order ID returned');
              }
              return data.orderId;
            } catch (err: any) {
              setIsProcessing(false);
              setErrorMessage(err.message || 'Error creating lifetime order');
              throw err;
            }
          },
          onApprove: async (data: { orderID: string }) => {
            try {
              setIsProcessing(true);
              const token = await auth.currentUser?.getIdToken().catch(() => undefined);
              const res = await fetch('/api/billing/lifetime/capture', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                  orderId: data.orderID,
                }),
              });

              if (!res.ok) {
                const captureErr = await res.json().catch(() => ({}));
                console.warn('Lifetime capture notice:', captureErr);
              }

              await onApproveLifetime(data.orderID);
              handleClose();
            } catch (err: any) {
              setErrorMessage(err.message || 'Failed to activate lifetime pass.');
            } finally {
              setIsProcessing(false);
            }
          },
          onError: (err: any) => {
            console.error('PayPal lifetime button error:', err);
            setIsProcessing(false);
            setErrorMessage('An error occurred during payment processing.');
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

        setTimeout(() => {
          if (isSubscribed) setIsSdkLoading(false);
        }, 1200);
      })
      .catch((err) => {
        console.warn('PayPal lifetime SDK load notice:', err.message);
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
  }, [isOpen, activeClientId]);

  const handleDirectPayPalCheckout = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const token = await auth.currentUser?.getIdToken().catch(() => undefined);
      const returnUrl = `${window.location.origin}/app?paypal_success=true&tier=Collection&lifetime=true`;
      const cancelUrl = `${window.location.origin}/app?paypal_cancel=true`;

      const res = await fetch('/api/billing/lifetime/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ returnUrl, cancelUrl }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to initiate lifetime checkout');
      }

      const data = await res.json();
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else if (data.orderId) {
        await onApproveLifetime(data.orderId);
        handleClose();
      } else {
        throw new Error('Approval URL missing');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Direct lifetime checkout failed.');
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="paypal-lifetime-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-all duration-300 animate-fade-in font-mono">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl overflow-hidden relative animate-scale-up space-y-5 p-6 sm:p-7 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Limited Founder Registry • 100 Pass Cap
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A]">
                Founder Lifetime Pass
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

        {/* Pricing Card */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50/60 via-amber-100/30 to-amber-50/60 border border-amber-200/80 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-wider block">
                Permanent Collection Tier Access
              </span>
              <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Never Pay Renewal Fees Again
              </span>
            </div>
            <div className="text-right font-num">
              <div className="font-extrabold text-3xl text-[#0F172A]">
                $250.00
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-bold">
                USD • One-Time Lifetime Payment
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#334155] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Unlimited Decks (60-Card)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Unlimited Graded Slabs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Unlimited Sealed Vault</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Lifetime Founder Badge</span>
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
              <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              <span>Connecting to PayPal Secure Checkout...</span>
            </div>
          )}

          {isProcessing && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-center gap-3 font-mono">
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
              <span className="text-xs font-bold text-amber-800">
                Authorizing payment &amp; issuing Founder Lifetime Pass...
              </span>
            </div>
          )}

          <div
            ref={buttonContainerRef}
            className={`w-full min-h-[48px] ${isProcessing || sdkFailed ? 'hidden' : 'block'}`}
          />

          {sdkFailed && !isProcessing && (
            <button
              type="button"
              onClick={handleDirectPayPalCheckout}
              className="w-full py-3.5 px-6 rounded-xl bg-[#FFC439] hover:bg-[#F2BA36] active:scale-[0.99] text-[#003087] font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Pay with PayPal ($250.00 USD)</span>
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
            Lifetime Validity Guaranteed
          </span>
        </div>
      </div>
    </div>
  );
};
