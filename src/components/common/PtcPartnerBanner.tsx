import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Copy, Check, Sparkles, Tag, ShoppingBag } from 'lucide-react';

export type PtcBannerContext = 'general' | 'set' | 'decks' | 'slabs' | 'sealed' | 'format';

interface PtcPartnerBannerProps {
  className?: string;
  context?: PtcBannerContext;
  queryParam?: string;
  customLabel?: string;
}

export const PtcPartnerBanner: React.FC<PtcPartnerBannerProps> = ({
  className = '',
  context = 'general',
  queryParam,
  customLabel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator.clipboard.writeText('DECKDIVIDER');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.warn('Failed to copy to clipboard', err);
    }
  };

  // Compute targeted outbound URL with Google-compliant sponsored attribution
  const partnerUrl = queryParam
    ? `https://ptccollectibles.com/DECKDIVIDER?q=${encodeURIComponent(queryParam)}`
    : 'https://ptccollectibles.com/DECKDIVIDER';

  const getContextualContent = () => {
    if (context === 'set' && queryParam) {
      return {
        badge: customLabel || 'Expansion Partner Perk',
        title: `Collecting ${queryParam}?`,
        description: (
          <span>
            Get 5% off authentic factory-sealed booster boxes, ETBs, and singles at our partner{' '}
            <strong className="text-slate-900 font-semibold">PTC Collectibles</strong> with code{' '}
            <span className="font-mono font-bold text-[#DC143C]">DECKDIVIDER</span>.
          </span>
        ),
      };
    }

    if (context === 'decks' || context === 'format') {
      return {
        badge: customLabel || 'Tournament Player Perk',
        title: 'Building this deck in paper?',
        description: (
          <span>
            Pick up tournament-legal singles, deck boxes, and protective sleeves with guaranteed 5%+ savings at{' '}
            <strong className="text-slate-900 font-semibold">PTC Collectibles</strong> using code{' '}
            <span className="font-mono font-bold text-[#DC143C]">DECKDIVIDER</span>.
          </span>
        ),
      };
    }

    if (context === 'slabs') {
      return {
        badge: customLabel || 'Grading & Slabs Perk',
        title: 'Sourcing graded cards or archival care?',
        description: (
          <span>
            Browse certified PSA 10 gem-mint slabs, BGS grades, and ultra-clear sleeves with 5% off at{' '}
            <strong className="text-slate-900 font-semibold">PTC Collectibles</strong> using code{' '}
            <span className="font-mono font-bold text-[#DC143C]">DECKDIVIDER</span>.
          </span>
        ),
      };
    }

    if (context === 'sealed') {
      return {
        badge: customLabel || 'Sealed Vault Perk',
        title: 'Expanding your sealed booster collection?',
        description: (
          <span>
            Save 5%+ on English &amp; Japanese Pokémon TCG booster boxes, bundles, and cases at{' '}
            <strong className="text-slate-900 font-semibold">PTC Collectibles</strong> with code{' '}
            <span className="font-mono font-bold text-[#DC143C]">DECKDIVIDER</span>.
          </span>
        ),
      };
    }

    return {
      badge: customLabel || 'Verified Collector Perk',
      title: 'Partner Discount at PTC Collectibles',
      description: (
        <span>
          DECK / divider members receive an exclusive 5%+ discount on authentic booster boxes, Japanese sets, raw singles, and PSA slabs with code{' '}
          <span className="font-mono font-bold text-[#DC143C]">DECKDIVIDER</span>.
        </span>
      ),
    };
  };

  const content = getContextualContent();

  return (
    <aside
      aria-label="PTC Collectibles Partner Perk"
      className={`w-full max-w-[2200px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 my-4 ${className}`}
      data-testid="ptc-partner-banner"
    >
      <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-red-50/20 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Left Content Column */}
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100/80 text-[#DC143C] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Sparkles className="w-4 h-4 text-[#DC143C]" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                  <Tag className="w-2.5 h-2.5 text-[#DC143C]" />
                  {content.badge}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 font-heading">
                  {content.title}
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {content.description}
              </p>
            </div>
          </div>

          {/* Right Action Column */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pt-1 md:pt-0 self-end md:self-center">
            {/* Promo Code Pill with Copy Action */}
            <button
              type="button"
              onClick={handleCopyCode}
              className={`px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 border shadow-2xs cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300'
              }`}
              title="Click to copy promo code DECKDIVIDER"
            >
              <span>DECKDIVIDER</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Direct Link to Partner */}
            <a
              href={partnerUrl}
              target="_blank"
              rel="sponsored noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold transition-all shadow-2xs inline-flex items-center gap-1.5 shrink-0"
              title="Visit PTC Collectibles with 5% discount applied"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-white" />
              <span>Shop 5% Off</span>
              <ExternalLink className="w-3 h-3 text-white/80" />
            </a>

            {/* Subdued link to full perk page */}
            <Link
              to="/partners/ptc-collectibles"
              className="hidden lg:inline-block text-[11px] font-mono text-slate-500 hover:text-slate-900 underline underline-offset-2 decoration-slate-300 transition-colors ml-1"
              title="Read full partner details, volume tiers and FAQ"
            >
              Perk Details
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
