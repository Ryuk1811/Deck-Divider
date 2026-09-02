import React, { useEffect, useRef, useState } from 'react';
import { X, Zap, Lock, AlertCircle, Loader2, Globe, MapPin } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../types';
import { loadRazorpaySdk } from '../utils/razorpayLoader';

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
  onApproveSubscription: (subscriptionId: string, tier: AccountTier, provider?: 'paypal' | 'razorpay') => Promise<void>;
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
  getUserToken
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSdkLoading, setIsSdkLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'global' | 'india'>('global');
  
  const [razorpayRateInfo, setRazorpayRateInfo] = useState<{ amountINR: number } | null>(null);

  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const paypalButtonInstanceRef = useRef<any>(null);

  const effectiveClientId =
    clientId || 'BAAART0wdN_LoLV8d5vHUpcdNm7Nz9OAzCEnhJtMzH34baRvl3oYJrwuoy6cy9w1UFF_6fy7kvkOKHURTQ';

  const handleClose = () => {
    setErrorMessage(null);
    setIsProcessing(false);
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !planId || activeTab !== 'global') return;

    let isSubscribed = true;
    setIsSdkLoading(true);
    setErrorMessage(null);

    // Clean up any existing button instance
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

    loadPayPalSdk(effectiveClientId)
      .then(() => {
        if (!isSubscribed || !buttonContainerRef.current) return;
        if (!window.paypal || typeof window.paypal.Buttons !== 'function') {
          throw new Error('PayPal Buttons constructor unavailable');
        }

        const buttons = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'subscribe',
            height: 45,
          },
          createSubscription: (_data: any, actions: any) => {
            return actions.subscription.create({
              plan_id: planId,
              application_context: {
                shipping_preference: 'NO_SHIPPING',
                user_action: 'SUBSCRIBE_NOW',
              },
            });
          },
          onApprove: async (data: any) => {
            if (!data.subscriptionID) {
              setErrorMessage('No subscription ID received from PayPal');
              return;
            }
            setIsProcessing(true);
            try {
              await onApproveSubscription(data.subscriptionID, tierName, 'paypal');
              handleClose();
            } catch (err: any) {
              setErrorMessage(err.message || 'Failed to complete subscription activation');
            } finally {
              setIsProcessing(false);
            }
          },
          onCancel: () => {
            setIsProcessing(false);
          },
          onError: (err: any) => {
            const errMsg = String(err?.message || err || '');
            const isWindowClosed =
              errMsg.toLowerCase().includes('window is closed') ||
              errMsg.toLowerCase().includes('can not determine type') ||
              errMsg.toLowerCase().includes('window_closed') ||
              errMsg.toLowerCase().includes('popup_closed') ||
              errMsg.toLowerCase().includes('closed');

            if (isWindowClosed) {
              setIsProcessing(false);
              return;
            }
            console.warn('PayPal Checkout notice:', errMsg);
            setErrorMessage('PayPal checkout encountered an issue. Please try again.');
            setIsProcessing(false);
          },
        });

        paypalButtonInstanceRef.current = buttons;

        if (buttonContainerRef.current) {
          buttonContainerRef.current.innerHTML = '';
          buttons.render(buttonContainerRef.current).then(() => {
            if (isSubscribed) {
              setIsSdkLoading(false);
            }
          }).catch((renderErr: any) => {
            console.warn('PayPal button render error:', renderErr);
            if (isSubscribed) {
              setIsSdkLoading(false);
            }
          });
        }
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
  }, [isOpen, planId, effectiveClientId, tierName, activeTab]);

  useEffect(() => {
    if (activeTab === 'india' && isOpen) {
      // Pre-load SDK in background so checkout opens immediately when clicked
      loadRazorpaySdk().catch((e) => console.warn('Preloading Razorpay SDK:', e));

      // Fetch dynamic INR price calculation to show the user
      const pricesUSD: Record<string, number> = {
        'Starter': 0, 'Bunch': 11, 'Stack': 22, 'Deck': 33, 'Collection': 44
      };
      const usdAmount = pricesUSD[tierName] || 0;
      
      fetch('/api/exchange-rates')
        .then(res => res.json())
        .then(data => {
          const inrRate = data.rates['INR'] || 83.5;
          setRazorpayRateInfo({ amountINR: Math.round(usdAmount * inrRate) });
        })
        .catch(() => setRazorpayRateInfo({ amountINR: Math.round(usdAmount * 83.5) }));
    }
  }, [activeTab, isOpen, tierName]);

  const handleRazorpayPayment = async () => {
    if (!getUserToken) return;
    try {
      setIsProcessing(true);
      setErrorMessage(null);

      const token = await getUserToken();
      if (!token) throw new Error('Not authenticated');

      // 1. Create order on backend
      const orderRes = await fetch('/api/v1/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tier: tierName,
          userId: 'me' // Backend will extract from token
        })
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 2. Load SDK
      const rzp = await loadRazorpaySdk();
      if (!rzp) throw new Error('Razorpay SDK failed to load');

      // 3. Open Razorpay Checkout modal
      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Deck Divider',
        description: `${tierName} Plan Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verification handles via Webhook, but we'll optimisticly trigger success for UX
          // We can call onApproveSubscription with razorpay_payment_id
          await onApproveSubscription(response.razorpay_payment_id, tierName, 'razorpay');
          handleClose();
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#DC143C'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const razorpayInstance = new rzp(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        setErrorMessage(response.error.description || 'Payment failed');
        setIsProcessing(false);
      });
      razorpayInstance.open();

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Payment initiation failed');
      setIsProcessing(false);
    }
  };

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

        {/* Region Selector */}
        <div className="flex bg-[#F1F5F9] p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              activeTab === 'global' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Globe className="w-4 h-4" /> Global (USD)
          </button>
          <button
            onClick={() => setActiveTab('india')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-all ${
              activeTab === 'india' ? 'bg-white shadow-sm text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <MapPin className="w-4 h-4" /> India (INR)
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
            {activeTab === 'india' && razorpayRateInfo && (
              <div className="text-xs text-[#64748B] font-medium mt-0.5">
                ≈ ₹{razorpayRateInfo.amountINR}/mo
              </div>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Content */}
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
              {activeTab === 'global' ? (
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
                    <span>Encrypted PayPal Checkout • USD Billing</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="bg-[#FFF8F1] border border-[#FFDDB8] p-3 rounded-lg text-[11px] text-[#A65B1C]">
                    For our Indian users, pay conveniently via UPI, Google Pay, PhonePe, and major Debit/Credit cards. The USD price is automatically converted to INR using current real-time rates.
                  </div>
                  <button
                    onClick={handleRazorpayPayment}
                    className="w-full flex items-center justify-center gap-2 bg-[#3395FF] hover:bg-[#2081E2] text-white py-3.5 px-4 rounded-xl font-bold transition-all shadow-sm"
                  >
                    Pay with Razorpay
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0]">
                    <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Secure Razorpay Checkout • INR Billing</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
