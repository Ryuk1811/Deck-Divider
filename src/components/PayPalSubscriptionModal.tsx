import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../types';

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PaymentSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: AccountTier;
  planId: string;
  clientId: string;
  onApproveSubscription: (subscriptionId: string, tier: AccountTier, provider?: 'paypal') => Promise<void>;
  getUserToken?: () => Promise<string | undefined>;
}

// Singleton script loader to ensure PayPal SDK is only loaded once and shared across components
let paypalScriptPromise: Promise<void> | null = null;

function loadPayPalSdk(clientId: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  if (window.paypal && typeof window.paypal.Buttons === 'function') {
    return Promise.resolve();
  }

  if (paypalScriptPromise) {
    return paypalScriptPromise;
  }

  paypalScriptPromise = new Promise<void>((resolve, reject) => {
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
    )}&vault=true&intent=subscription`;
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        resolve();
      } else {
        reject(new Error('PayPal SDK loaded but window.paypal is not defined'));
      }
      paypalScriptPromise = null;
    };

    script.onerror = () => {
      paypalScriptPromise = null;
      reject(new Error('Failed to load PayPal SDK'));
    };

    document.body.appendChild(script);
  });

  return paypalScriptPromise;
}

export const PayPalSubscriptionModal: React.FC<PaymentSubscriptionModalProps> = ({
  isOpen,
  onClose,
  tierName,
  planId,
  clientId,
  onApproveSubscription,
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

    if (!effectiveClientId || !planId) {
      setIsSdkLoading(false);
      setErrorMessage('PayPal configuration is missing. Please contact administrator.');
      return;
    }

    let isSubscribed = true;
    setIsSdkLoading(true);
    setErrorMessage(null);

    loadPayPalSdk(effectiveClientId)
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
            label: 'subscribe',
          },
          createSubscription: function (_data: any, actions: any) {
            return actions.subscription.create({
              plan_id: planId,
            });
          },
          onApprove: async function (data: any) {
            try {
              setIsProcessing(true);
              setErrorMessage(null);
              await onApproveSubscription(data.subscriptionID, tierName, 'paypal');
              handleClose();
            } catch (err: any) {
              setErrorMessage(
                err?.message || 'Failed to activate your subscription. Please contact support.'
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
            // User cancelled modal
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
          setErrorMessage('Unable to initialize PayPal payment component. Please check your connection.');
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
  }, [isOpen, planId, effectiveClientId, tierName]);

  if (!isOpen) return null;

  const tierInfo = TIER_LIMITS[tierName];

  return (
    <div id="paypal-subscription-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] p-6 shadow-2xl rounded-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C]">
              <Zap className="w-6 h-6 text-[#DC143C]" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-[#DC143C] uppercase tracking-wider block">
                Subscription Upgrade
              </span>
              <h3 className="font-heading font-bold text-xl text-[#0F172A]">
                Subscribe to {tierName}
              </h3>
            </div>
          </div>
          <button
            id="close-paypal-subscription-modal-btn"
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <div className="font-heading font-bold text-sm text-[#0F172A]">
              {tierName} Tier
            </div>
            <div className="font-mono text-xs text-[#64748B]">
              {tierInfo?.tagline || 'Monthly access'}
            </div>
          </div>
          <div className="text-right font-num">
            <div className="font-bold text-2xl text-[#0F172A]">
              ${tierInfo?.priceMonthly}/mo
            </div>
            <div className="text-[11px] text-[#64748B] font-mono">
              Renews monthly • Cancel anytime
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
        <div className="space-y-3 min-h-[110px] relative flex flex-col justify-center">
          {isProcessing ? (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-[#DC143C] animate-spin mx-auto" />
              <div className="font-mono text-xs font-bold text-[#0F172A]">
                Activating your {tierName} plan...
              </div>
            </div>
          ) : (
            <>
              {isSdkLoading && (
                <div className="py-8 flex flex-col items-center justify-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Loader2 className="w-7 h-7 text-[#DC143C] animate-spin" />
                  <div className="font-mono text-xs text-slate-600 font-medium">
                    Connecting to PayPal...
                  </div>
                </div>
              )}
              <div
                id="paypal-button-container"
                ref={buttonContainerRef}
                className={`w-full transition-opacity duration-200 ${
                  isSdkLoading ? 'hidden' : 'block'
                }`}
              />
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Encrypted PayPal Checkout • USD Monthly Billing</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
