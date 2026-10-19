import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Share2,
  Check,
  Copy,
  Download,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Twitter,
  Image as ImageIcon,
} from 'lucide-react';
import { PortfolioCardEntry, DisplayCurrency } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface BragShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectorName: string;
  totalCards: number;
  totalValuation: number;
  currency: DisplayCurrency;
  topCards: PortfolioCardEntry[];
  shareUrl: string;
}

export const BragShareModal: React.FC<BragShareModalProps> = ({
  isOpen,
  onClose,
  collectorName,
  totalCards,
  totalValuation,
  currency,
  topCards,
  shareUrl,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const formattedVal = formatCurrency(totalValuation, currency);
  const topCardsSummary = topCards
    .slice(0, 3)
    .map(
      (c) =>
        `${c.card?.name || 'Card'} ${
          c.gradingInfo ? `(${c.gradingInfo.company} ${c.gradingInfo.grade})` : ''
        }`.trim()
    )
    .join(', ');

  const redditText = `**[DECK / divider] My Pokémon TCG Binder & Collection Showcase**\n\n• **Collector**: ${collectorName}\n• **Total Cards**: ${totalCards} Cards\n• **Portfolio Valuation**: ${formattedVal}\n• **Key Chase Cards**: ${topCardsSummary || 'Full Vault'}\n\n👉 **Inspect My Interactive 9-Pocket Binder**: ${shareUrl}\n\n*(Tracked ad-free on DECK / divider — Pokémon TCG Studio)*`;

  const discordText = `**✨ Pokémon TCG Binder Showcase — ${collectorName}**\n📊 **Portfolio Value**: ${formattedVal} • **Total Cards**: ${totalCards}\n🔥 **Featured**: ${topCardsSummary || 'Graded Slabs & Master Sets'}\n🔗 **Inspect interactive 9-pocket web binder**: ${shareUrl}`;

  const tweetText = `Check out my verified Pokémon TCG collection binder on @deckdivider! 🎴✨\n\nValuation: ${formattedVal} (${totalCards} cards)\nInspect the interactive 9-pocket binder here:`;
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async (text: string, type: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleDownloadBragCard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGeneratingImage(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingImage(false);
      return;
    }

    // Set resolution (1200 x 630)
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Subtle red glow on top right
    const glow = ctx.createRadialGradient(1000, 100, 50, 1000, 100, 500);
    glow.addColorStop(0, 'rgba(220, 20, 60, 0.25)');
    glow.addColorStop(1, 'rgba(220, 20, 60, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative border
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 1152, 582);

    // Brand Header
    ctx.fillStyle = '#DC143C';
    ctx.font = '900 24px monospace';
    ctx.fillText('DECK / divider', 60, 80);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 16px sans-serif';
    ctx.fillText('POKÉMON TCG STUDIO • VERIFIED BINDER SHOWCASE', 260, 78);

    // Collector Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 48px sans-serif';
    ctx.fillText(`${collectorName}'s Vault`, 60, 150);

    // Metrics Pill
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(60, 180, 480, 120, 16);
    ctx.fill();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 14px monospace';
    ctx.fillText('PORTFOLIO MARKET VALUATION', 85, 215);

    ctx.fillStyle = '#22C55E';
    ctx.font = '900 42px sans-serif';
    ctx.fillText(formattedVal, 85, 270);

    // Count Pill
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(60, 320, 480, 90, 16);
    ctx.fill();

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 14px monospace';
    ctx.fillText('COLLECTION STATS', 85, 355);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 24px sans-serif';
    ctx.fillText(`${totalCards} Tracked Cards • Standard Legal`, 85, 390);

    // Watermark / Link
    ctx.fillStyle = '#64748B';
    ctx.font = '500 18px monospace';
    ctx.fillText(`deckdivider.app/portfolio`, 60, 560);

    // Draw card covers (up to 3)
    const cardImagesToLoad = topCards.slice(0, 3).map((c) => c.card?.images?.small);
    let loadedCount = 0;

    const renderCardImages = () => {
      topCards.slice(0, 3).forEach((entry, i) => {
        const xOffset = 580 + i * 190;
        const yOffset = 160;

        // Draw card placeholder
        ctx.fillStyle = '#1E293B';
        ctx.beginPath();
        ctx.roundRect(xOffset, yOffset, 175, 245, 12);
        ctx.fill();
        ctx.strokeStyle = '#DC143C';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 14px sans-serif';
        const cardTitle = (entry.card?.name || 'Card').slice(0, 18);
        ctx.fillText(cardTitle, xOffset + 10, yOffset + 270);

        if (entry.gradingInfo) {
          ctx.fillStyle = '#DC143C';
          ctx.beginPath();
          ctx.roundRect(xOffset + 10, yOffset + 285, 120, 26, 6);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '900 12px monospace';
          ctx.fillText(
            `${entry.gradingInfo.company} ${entry.gradingInfo.grade}`,
            xOffset + 18,
            yOffset + 302
          );
        }
      });

      // Trigger download
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `deckdivider-${collectorName.toLowerCase().replace(/\s+/g, '-')}-vault.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (e) {
        console.warn('Canvas export failed:', e);
      }
      setIsGeneratingImage(false);
    };

    renderCardImages();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DC143C]/10 text-[#DC143C] flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-slate-900 text-lg flex items-center gap-2">
                Share Portfolio Showcase
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Share your binder showcase and collection statistics to Reddit, Discord, and Twitter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Quick Copy Link */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
            <div className="truncate font-mono text-xs text-slate-700">{shareUrl}</div>
            <button
              onClick={() => handleCopy(shareUrl, 'link')}
              className="px-3 py-1.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
            >
              {copiedType === 'link' ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy URL
                </>
              )}
            </button>
          </div>

          {/* Social Platforms */}
          <div className="space-y-4">
            {/* Reddit Option */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-[#DC143C]/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FF4500] text-white flex items-center justify-center font-black text-xs">
                    r/
                  </div>
                  <span className="font-bold text-sm text-slate-900">
                    Reddit (r/PokemonTCG &amp; r/PokemonCardValue)
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(redditText, 'reddit')}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  {copiedType === 'reddit' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'reddit' ? 'Copied Markdown' : 'Copy Markdown'}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-mono line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {redditText}
              </p>
            </div>

            {/* Discord Option */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-[#DC143C]/40 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#5865F2] text-white flex items-center justify-center">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-bold text-sm text-slate-900">Discord Server Embed</span>
                </div>
                <button
                  onClick={() => handleCopy(discordText, 'discord')}
                  className="px-2.5 py-1 text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-1"
                >
                  {copiedType === 'discord' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedType === 'discord' ? 'Copied Text' : 'Copy Text'}
                </button>
              </div>
              <p className="text-xs text-slate-500 font-mono line-clamp-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                {discordText}
              </p>
            </div>

            {/* Twitter / X Option */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white hover:border-[#DC143C]/40 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center">
                  <Twitter className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">Post on X / Twitter</div>
                  <div className="text-xs text-slate-500">1-click tweet with preview link</div>
                </div>
              </div>
              <a
                href={twitterIntentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-black hover:bg-slate-800 text-white font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                Post Tweet <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Canvas Social Card Generator */}
            <div className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm">Download HD Social Card (1200×630)</div>
                  <div className="text-xs text-slate-300">
                    High-res image of your top slabs &amp; valuation for Instagram/Reddit
                  </div>
                </div>
              </div>
              <button
                onClick={handleDownloadBragCard}
                disabled={isGeneratingImage}
                className="px-3.5 py-2 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" /> Download PNG
              </button>
            </div>
          </div>
        </div>

        {/* Hidden Canvas for Generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 flex items-center justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-mono text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
