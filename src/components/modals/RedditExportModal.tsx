import React, { useState } from 'react';
import { X, Check, Copy, Share2, MessageSquare, Terminal } from 'lucide-react';
import { DisplayCurrency } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export interface ExportableCardItem {
  name: string;
  set: string;
  number?: string;
  rarity?: string;
  price?: number;
  quantity?: number;
}

interface RedditExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: ExportableCardItem[];
  currency?: DisplayCurrency;
}

export const RedditExportModal: React.FC<RedditExportModalProps> = ({
  isOpen,
  onClose,
  title,
  items,
  currency = 'USD',
}) => {
  const [copiedFormat, setCopiedFormat] = useState<'reddit' | 'discord' | null>(null);

  if (!isOpen) return null;

  const totalValue = items.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0);
  const totalCards = items.reduce((acc, i) => acc + (i.quantity || 1), 0);

  // Generate Reddit Markdown Table
  const generateRedditMarkdown = (): string => {
    let md = `### ${title}\n\n`;
    md += `| Qty | Card Name | Expansion Set | Number | Est. Value |\n`;
    md += `| :---: | :--- | :--- | :---: | :---: |\n`;
    
    items.slice(0, 100).forEach(item => {
      const priceStr = item.price && item.price > 0 ? formatCurrency(item.price, currency) : '—';
      md += `| ${item.quantity || 1} | **${item.name}** | ${item.set} | #${item.number || '—'} | ${priceStr} |\n`;
    });

    if (items.length > 100) {
      md += `| ... | *+ ${items.length - 100} more cards in collection* | ... | ... | ... |\n`;
    }

    md += `\n**Total Estimated Value:** ${formatCurrency(totalValue, currency)} • **Cards Count:** ${totalCards}\n\n`;
    md += `*Tracked using [DECK / divider](https://deckdivider.app) — Free, private Pokémon TCG binder studio & master set tracker.*`;
    return md;
  };

  // Generate Discord Markdown List
  const generateDiscordMarkdown = (): string => {
    let dc = `**__${title}__** (Total: ${formatCurrency(totalValue, currency)} • ${totalCards} cards)\n`;
    dc += `\`\`\`prolog\n`;
    items.slice(0, 25).forEach(item => {
      const priceStr = item.price && item.price > 0 ? formatCurrency(item.price, currency) : '—';
      dc += `${item.quantity || 1}x ${item.name} [${item.set} #${item.number || '—'}] - ${priceStr}\n`;
    });
    if (items.length > 25) {
      dc += `...and ${items.length - 25} more items.\n`;
    }
    dc += `\`\`\`\n`;
    dc += `Tracked with DECK / divider: <https://deckdivider.app>`;
    return dc;
  };

  const handleCopyReddit = () => {
    navigator.clipboard.writeText(generateRedditMarkdown());
    setCopiedFormat('reddit');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(generateDiscordMarkdown());
    setCopiedFormat('discord');
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-xl space-y-4 sm:space-y-5 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export for Reddit &amp; Discord</h3>
              <p className="text-xs text-slate-500">Copy pre-formatted tables for r/PokemonTCG, r/pkmntcgcollections, or trade servers.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview box */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-semibold text-slate-700 block">Preview (Reddit Markdown):</span>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 max-h-56 overflow-y-auto whitespace-pre leading-relaxed select-all">
            {generateRedditMarkdown()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyReddit}
            className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copiedFormat === 'reddit'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FF4500] hover:bg-[#E03D00] text-white shadow-xs'
            }`}
          >
            {copiedFormat === 'reddit' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedFormat === 'reddit' ? 'Reddit Table Copied!' : 'Copy for Reddit (r/PokemonTCG)'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyDiscord}
            className={`py-2.5 px-4 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              copiedFormat === 'discord'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#5865F2] hover:bg-[#4752C4] text-white shadow-xs'
            }`}
          >
            {copiedFormat === 'discord' ? <Check className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
            <span>{copiedFormat === 'discord' ? 'Discord Text Copied!' : 'Copy for Discord'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
