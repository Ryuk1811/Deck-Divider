import React, { useEffect, useRef, useState } from 'react';
import { X, Crown, Lock, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface PayPalLifetimeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  onApproveLifetime: (orderId: string) => Promise<void>;
  userEmail?: string;
}

let paypalOneTimeScriptPromise: Promise<void> | null = null;

function loadPayPalOneTimeSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.paypal && typeof window.paypal.Buttons === 'function') {
    return Promise.resolve();
  }

  if (paypalOneTimeScriptPromise) {
    return paypalOneTimeScriptPromise;
  }

  const activeClientId = (clientId && clientId.trim().length > 0)
    ? clientId.trim()
    : ((import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || 'sb');

  paypalOneTimeScriptPromise = new Promise<void>((resolve, reject) => {
    let isSettled = false;

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        paypalOneTimeScriptPromise = null;
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
              reject(new Error('PayPal SDK loaded but Buttons component was not found.'));
            }
          }
        }, 100);
      };

      script.onerror = () => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          paypalOneTimeScriptPromise = null;
          reject(new Error('Failed to load PayPal payment SDK.'));
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
  clientId,
  onApproveLifetime,
  userEmail,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSdkLoading, setIsSdkLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonInstanceRef = useRef<any>(null);

  const effectiveClientId =
    clientId || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || 'sb';

  const handleClose = () => {
    setErrorMessage(null);
    setIsProcessing(false);
    onClose();
  };

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

    loadPayPalOneTimeSdk(effectiveClientId)
      .then(() => {
        if (!isSubscribed) return;

        if (!window.paypal || !window.paypal.Buttons) {
          throw new Error('PayPal SDK loaded without Buttons component');
        }

        if (buttonContainerRef.current) {
          buttonContainerRef.current.innerHTML = '';
        }

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
                    value: '250.00',
                    currency_code: 'USD',
                  },
                  description: 'DECK / divider Founder Lifetime Pass — Collection Tier ($250 One-Time)',
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
                  console.warn('PayPal capture detail warning (order ID retained):', captureErr);
                }
              }

              await onApproveLifetime(orderId || `ORDER_${Date.now()}`);
              handleClose();
            } catch (err: any) {
              setErrorMessage(
                err?.message || 'Failed to activate your lifetime membership. Please contact support.'
              );
            } finally {
              setIsProcessing(false);
            }
          },
          onError: function (err: any) {
            console.error('PayPal lifetime button error:', err);
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
          setErrorMessage('Unable to initialize PayPal checkout component. Click retry or check connection.');
        }
      });

    return () => {
      isSubscribed = false;
      if (paypalButtonInstanceRef.current && typeof paypalButtonInstanceRef.current.close === 'function') {
        try { paypalButtonInstanceRef.current.close(); } catch {}
        paypalButtonInstanceRef.current = null;
      }
      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = '';
      }
    };
  }, [isOpen, effectiveClientId, reloadKey]);

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
            className="p-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] cursor-pointer transition-colors"
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
                paypalOneTimeScriptPromise = null;
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
            Lifetime Validity Guaranteed
          </span>
        </div>
      </div>
    </div>
  );
};
