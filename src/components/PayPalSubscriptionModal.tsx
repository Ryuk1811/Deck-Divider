import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { X, Shield, Zap, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { AccountTier, TIER_LIMITS } from '../types';

interface PayPalSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  tierName: AccountTier;
  planId: string;
  clientId: string;
  onApproveSubscription: (subscriptionId: string, tier: AccountTier) => Promise<void>;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-white border-2 border-[#0F172A] p-6 shadow-2xl rounded-xl space-y-5 chamfer-corner-lg relative">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C]">
              <Zap className="w-6 h-6 text-[#DC143C]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-[#DC143C] uppercase tracking-wider">
                  Live PayPal Subscription
                </span>
                <span className="text-[10px] bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 px-2 py-0.5 rounded-full font-bold">
                  LIVE MODE
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl text-[#0F172A]">
                Subscribe to {tierName} Plan
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#FFF0F3]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
          <div>
            <div className="font-heading font-bold text-sm text-[#0F172A]">
              {tierName} Tier Subscription
            </div>
            <div className="font-mono text-xs text-[#64748B]">
              {tierInfo?.tagline || 'Monthly subscription'}
            </div>
            <div className="font-mono text-[10px] text-[#DC143C] pt-1">
              PayPal Plan ID: <code className="font-bold">{planId}</code>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-2xl text-[#0F172A]">
              ${tierInfo?.priceMonthly}/mo
            </div>
            <div className="font-mono text-[10px] text-[#16A34A] font-bold">
              Recurring Monthly
            </div>
          </div>
        </div>

        {/* Guest Checkout & Card Option Banner */}
        <div className="p-3 bg-[#FFF0F3] border border-[#DC143C]/30 rounded-lg flex items-start gap-2.5 text-xs text-[#0F172A] font-mono">
          <CreditCard className="w-4 h-4 text-[#DC143C] flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#DC143C]">PayPal & Debit/Credit Card Guest Checkout Supported:</span>
            <span className="block text-[11px] text-[#64748B] pt-0.5">
              Pay using your PayPal account OR complete guest checkout using Debit / Credit Card without creating a PayPal password.
            </span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-mono rounded-lg">
            {errorMessage}
          </div>
        )}

        {/* PayPal SDK Script Provider & Buttons */}
        <div className="pt-2 min-h-[160px] flex flex-col justify-center">
          {isProcessing ? (
            <div className="py-8 text-center space-y-2">
              <div className="w-8 h-8 border-4 border-[#DC143C] border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="font-mono text-xs font-bold text-[#0F172A]">
                Activating your {tierName} plan subscription...
              </div>
            </div>
          ) : (
            <PayPalScriptProvider
              options={{
                clientId: clientId || 'BAAART0wdN_LoLV8d5vHUpcdNm7Nz9OAzCEnhJtMzH34baRvl3oYJrwuoy6cy9w1UFF_6fy7kvkOKHURTQ',
                vault: true,
                intent: 'subscription',
                currency: 'USD',
              }}
            >
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'black',
                  shape: 'rect',
                  label: 'subscribe',
                }}
                createSubscription={(_data, actions) => {
                  return actions.subscription.create({
                    plan_id: planId,
                    application_context: {
                      shipping_preference: 'NO_SHIPPING',
                      user_action: 'SUBSCRIBE_NOW',
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
                  setErrorMessage('PayPal checkout encountered an issue. Please retry.');
                }}
              />
            </PayPalScriptProvider>
          )}
        </div>

        {/* Security Footer */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#64748B] pt-2 border-t border-[#E2E8F0]">
          <Lock className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Encrypted Live PayPal SSL Checkout • Cancel anytime in Settings</span>
        </div>
      </div>
    </div>
  );
};
