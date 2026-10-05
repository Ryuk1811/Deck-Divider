import React, { useEffect, useRef, useState } from 'react';
import { X, Crown, Lock, AlertCircle, Loader2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

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

  paypalOneTimeScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      if (window.paypal && typeof window.paypal.Buttons === 'function') {
        resolve();
      } else {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error('Failed to load existing script')));
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&intent=capture&currency=USD`;
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        resolve();
      } else {
        reject(new Error('PayPal SDK loaded but window.paypal is undefined'));
      }
      paypalOneTimeScriptPromise = null;
    };

    script.onerror = () => {
      paypalOneTimeScriptPromise = null;
      reject(new Error('Failed to load PayPal SDK'));
    };

    document.body.appendChild(script);
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

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonInstanceRef = useRef<any>(null);

  const effectiveClientId =
    clientId || (import.meta.env.VITE_PAYPAL_CLIENT_ID as string) || '';

  const handleClose = () => {
    setErrorMessage(null);
    setIsProcessing(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      if (paypalButtonInstanceRef.current && typeof paypalButtonInstanceRef.current.close === 'function') {
        try {
          paypalButtonInstanceRef.current.close();
        } catch {
          // ignore
        }
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

    if (!effectiveClientId) {
      setIsSdkLoading(false);
      setErrorMessage('PayPal configuration is missing. Please contact support.');
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
          buttons.render(buttonContainerRef.current).catch((err: any) => {
            console.warn('Button render error (possibly unmounted):', err);
          });
        }

        setIsSdkLoading(false);
      })
      .catch((err: any) => {
        console.error('PayPal SDK loading error:', err);
        if (isSubscribed) {
          setIsSdkLoading(false);
          setErrorMessage('Unable to initialize PayPal checkout component. Please check your connection.');
        }
      });

    return () => {
      isSubscribed = false;
      if (paypalButtonInstanceRef.current && typeof paypalButtonInstanceRef.current.close === 'function') {
        try {
          paypalButtonInstanceRef.current.close();
        } catch {
          // ignore
        }
        paypalButtonInstanceRef.current = null;
      }
      if (buttonContainerRef.current) {
        buttonContainerRef.current.innerHTML = '';
      }
    };
  }, [isOpen, effectiveClientId]);

  if (!isOpen) return null;

  return (
    <div id="paypal-lifetime-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-all duration-300 animate-fade-in">
      <div className="w-full max-w-lg bg-white border border-[#E2E8F0] p-6 sm:p-7 shadow-2xl rounded-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C]">
              <Crown className="w-6 h-6 text-[#DC143C]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold text-[#DC143C] uppercase tracking-wider block">
                  One-Time Payment • No Subscriptions
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0F172A]">
                Founder Lifetime Pass
              </h3>
            </div>
          </div>
          <button
            id="close-paypal-lifetime-modal-btn"
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Summary Card */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#F8FAFC] via-[#FFF8F9] to-[#F8FAFC] border border-[#E2E8F0] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heading font-bold text-base text-[#0F172A]">
                Lifetime Collection Tier
              </div>
              <div className="font-mono text-xs text-[#64748B]">
                First 100 Founders Slot Reservation
              </div>
            </div>
            <div className="text-right font-num">
              <div className="font-extrabold text-3xl text-[#0F172A]">
                $250.00
              </div>
              <div className="text-[11px] text-emerald-700 font-mono font-bold">
                USD • Single Payment
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0]/80 space-y-1.5 text-xs text-[#334155] font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Recurring monthly charges:</span>
              <span className="font-bold text-emerald-600">$0.00 (Never renews)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Account limit:</span>
              <span className="font-bold text-[#0F172A]">Unlimited decks, slabs &amp; lists</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Future expansions &amp; updates:</span>
              <span className="font-bold text-emerald-600">Included for life</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PayPal Checkout Area */}
        <div className="space-y-3 min-h-[120px] relative flex flex-col justify-center">
          {isProcessing ? (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin mx-auto" />
              <div className="font-mono text-xs font-bold text-[#0F172A]">
                Authorizing $250 Lifetime Pass &amp; upgrading tier...
              </div>
              <div className="text-[11px] font-mono text-[#64748B]">
                Allocating your founder slot in the registry
              </div>
            </div>
          ) : (
            <>
              {isSdkLoading && (
                <div className="py-8 flex flex-col items-center justify-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Loader2 className="w-7 h-7 text-[#DC143C] animate-spin" />
                  <div className="font-mono text-xs text-slate-600 font-medium">
                    Connecting to PayPal Secure Checkout...
                  </div>
                </div>
              )}
              <div
                id="paypal-lifetime-button-container"
                ref={buttonContainerRef}
                className={`w-full transition-opacity duration-200 ${
                  isSdkLoading ? 'hidden' : 'block'
                }`}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>256-bit Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#DC143C]" />
                  <span>7-Day Money-Back Guarantee</span>
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
