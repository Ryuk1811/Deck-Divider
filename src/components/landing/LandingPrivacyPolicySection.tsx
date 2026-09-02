import React, { useState } from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, ChevronDown, ChevronUp, Download, Trash2, CheckCircle2 } from 'lucide-react';

interface LandingPrivacyPolicySectionProps {
  onNavigateFullPolicy?: () => void;
}

export const LandingPrivacyPolicySection: React.FC<LandingPrivacyPolicySectionProps> = ({
  onNavigateFullPolicy,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="privacy" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 mb-6 sm:mb-10 scroll-mt-20">
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-5">
        {/* Header Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-emerald-700 text-xs font-mono font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Data Sovereignty & Security
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Your collection data is private. We never monetize your portfolio.
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
              Last updated: September 2026
            </span>
          </div>
        </div>

        {/* 4 Core Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <EyeOff className="w-4 h-4 text-slate-600" />
              <span>Zero Data Brokering</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never sell or distribute your portfolio value, transaction history, or want-lists to third-party ad networks.
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Local Encryption</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sensitive financial basis and custom acquisition logs can be stored with client-side AES-GCM encryption.
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Download className="w-4 h-4 text-slate-600" />
              <span>Total Portability</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Export your entire card binder, decks, and logs in universal JSON/CSV format at any point with one click.
            </p>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Trash2 className="w-4 h-4 text-slate-600" />
              <span>Instant Deletion</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you delete your account or cards, your records are completely purged from all active database replicas.
            </p>
          </div>
        </div>

        {/* Expandable Extended Summary */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>{isExpanded ? 'Hide Complete Policy Details' : 'Read On-Page Privacy Summary'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <div className="mt-4 p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">1. Information We Collect</h5>
                <p>
                  We collect account authentication information (such as your email if you choose to create a cloud backup profile), and card entries you explicitly save to your binder, decks, or wishlists. We do not track biometric data or external financial account credentials.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">2. How We Use Data</h5>
                <p>
                  Your card lists are used solely to calculate live market pricing comps via TCGplayer APIs, verify deck tournament legality, and synchronize state across your registered devices.
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 text-sm mb-1">3. Cookies and Local Storage</h5>
                <p>
                  We utilize standard browser IndexedDB and localized session caching to allow lightning-fast offline queries. No cross-site advertising tracking cookies are placed on your device.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
