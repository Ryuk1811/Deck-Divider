import React from 'react';
import { ShieldAlert, LogIn, Lock, X, ArrowRight, UserPlus, Sparkles } from 'lucide-react';
import { DeckDividerBrand } from './DeckDividerBrand';

interface GuestLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  actionTitle?: string;
  actionDescription?: string;
}

export const GuestLimitModal: React.FC<GuestLimitModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  actionTitle = 'Feature Restricted in Guest / Demo Mode',
  actionDescription = 'To create custom decks, log certified graded slabs, save custom lists, or sync your collection across devices, please sign in or create a free account.',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-all animate-fade-in">
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] shadow-2xl rounded-2xl p-6 space-y-5 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon & Alert Header */}
        <div className="flex items-center gap-3.5 pt-1">
          <div className="w-12 h-12 rounded-xl bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] flex items-center justify-center shrink-0 shadow-xs">
            <Lock className="w-6 h-6 text-[#DC143C]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DC143C] flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Authentication Required
            </span>
            <h3 className="font-heading font-extrabold text-lg text-[#0F172A] leading-snug">
              {actionTitle}
            </h3>
          </div>
        </div>

        {/* Description & Demo Limitations */}
        <div className="space-y-3">
          <p className="font-mono text-xs text-[#64748B] leading-relaxed">
            {actionDescription}
          </p>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <span className="font-heading font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DC143C]" />
              Free Starter Account Benefits:
            </span>
            <ul className="text-xs font-mono text-slate-600 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
                Permanent cloud storage & cross-device sync
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
                Full 60-card tournament deck builder
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
                PSA, BGS, CGC certified slab cert logging
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C]" />
                Export tournament decks to Pokémon TCG Live format
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Continue Browsing
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign In / Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
