import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, Zap, Lock, AlertCircle } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../types';

interface PayPalSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: AccountTier;
  planId: string;
  clientId: string;
  onApproveSubscription: (subscriptionId: string, tier: AccountTier) => Promise<void>;
  getUserToken?: () => Promise<string | undefined>;
}

export const PayPalSubscriptionModal: React.FC<PayPalSubscriptionModalProps> = ({
  isOpen,
  onClose,
  tierName,
  planId,
  clientId,
  onApproveSubscription,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const tierInfo = TIER_LIMITS[tierName];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
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
                Subscribe to {tierName} Plan
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
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
              {tierInfo?.tagline || 'Monthly subscription'}
            </div>
          </div>
          <div className="text-right font-num">
            <div className="font-bold text-2xl text-[#0F172A]">
              ${tierInfo?.priceMonthly}/mo
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PayPal Smart Buttons directly inside the plan modal */}
        <div className="space-y-3">
          <div className="min-h-[160px] flex flex-col justify-center">
            {isProcessing ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-8 h-8 border-4 border-[#DC143C] border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="font-mono text-xs font-bold text-[#0F172A]">
                  Activating your {tierName} plan...
                </div>
              </div>
            ) : (
              <PayPalScriptProvider
                options={{
                  clientId: clientId || 'BAAART0wdN_LoLV8d5vHUpcdNm7Nz9OAzCEnhJtMzH34baRvl3oYJrwuoy6cy9w1UFF_6fy7kvkOKHURTQ',
                  vault: true,
                  intent: 'subscription',
                  currency: 'USD',
                  components: 'buttons',
                }}
              >
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    color: 'gold',
                    shape: 'rect',
                    label: 'subscribe',
                  }}
                  createSubscription={(_data, actions) => {
                    return actions.subscription.create({
                      plan_id: planId,
                      application_context: {
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'SUBSCRIBE_NOW',
                        return_url: window.location.href,
                        cancel_url: window.location.href,
                      },
                    });
                  }}
                  onApprove={async (data) => {
                    if (!data.subscriptionID) {
                      setErrorMessage('No subscription ID received from PayPal');
                      return;
                    }
                    setIsProcessing(true);
                    try {
                      await onApproveSubscription(data.subscriptionID, tierName);
                      onClose();
                    } catch (err: any) {
                      setErrorMessage(err.message || 'Failed to complete subscription activation');
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  onError={(err) => {
                    console.error('PayPal Subscription Error:', err);
                    setErrorMessage('PayPal Checkout issue. Please try again.');
                  }}
                />
              </PayPalScriptProvider>
            )}
          </div>
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0]">
          <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Encrypted PayPal Checkout • Cancel anytime</span>
        </div>
      </div>
    </div>
  );
};
