import React from 'react';
import { AlertTriangle, ShieldX, RefreshCw } from 'lucide-react';

interface PayPalCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export const PayPalCancelModal: React.FC<PayPalCancelModalProps> = ({
  isOpen,
  onClose,
  onRetry,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl transition-all duration-300 animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] p-6 shadow-2xl rounded-2xl space-y-5 relative text-center">
        {/* Warning Icon */}
        <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-[#FFF0F3] border-2 border-[#DC143C] text-[#DC143C]">
          <AlertTriangle className="w-8 h-8 text-[#DC143C]" />
        </div>

        {/* Header Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/30 text-[#DC143C] font-mono text-xs font-bold">
            <ShieldX className="w-3.5 h-3.5" />
            <span>PAYPAL CHECKOUT CANCELED</span>
          </div>
          <h2 className="font-heading font-bold text-xl text-[#0F172A] pt-2">
            Subscription Request Closed
          </h2>
          <p className="font-mono text-xs text-[#64748B] leading-relaxed">
            The PayPal subscription checkout process was closed before completion. No charges were made to your PayPal account.
          </p>
        </div>

        {/* Info Card */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-left font-mono text-xs text-[#64748B] space-y-1">
          <div className="font-bold text-[#0F172A]">Need assistance with PayPal?</div>
          <div>You can try again anytime from Settings or upgrade directly using live PayPal.</div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="w-full py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 rounded-lg shadow-md cursor-pointer transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry PayPal Checkout</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] font-mono text-xs font-bold flex items-center justify-center gap-2 rounded-lg cursor-pointer transition-all border border-[#CBD5E1]"
          >
            <span>Close Window</span>
          </button>
        </div>
      </div>
    </div>
  );
};
