import React, { useState } from 'react';
import { X, Copy, Check, Code2, Sparkles, ExternalLink, Globe, LayoutTemplate, MessageSquare, Terminal } from 'lucide-react';
import {
  EmbedBadgeOptions,
  generateHtmlEmbedSnippet,
  generateMarkdownEmbedSnippet,
  generateBBCodeEmbedSnippet,
  generateIframeEmbedSnippet,
  generateBadgeSvg
} from '../../utils/embedBadgeGenerator';

interface EmbedBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: EmbedBadgeOptions;
}

export const EmbedBadgeModal: React.FC<EmbedBadgeModalProps> = ({
  isOpen,
  onClose,
  options
}) => {
  const [format, setFormat] = useState<'html' | 'markdown' | 'bbcode' | 'iframe'>('html');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOptions: EmbedBadgeOptions = {
    ...options,
    theme
  };

  let snippet = '';
  switch (format) {
    case 'html':
      snippet = generateHtmlEmbedSnippet(currentOptions);
      break;
    case 'markdown':
      snippet = generateMarkdownEmbedSnippet(currentOptions);
      break;
    case 'bbcode':
      snippet = generateBBCodeEmbedSnippet(currentOptions);
      break;
    case 'iframe':
      snippet = generateIframeEmbedSnippet(currentOptions);
      break;
  }

  const svgContent = generateBadgeSvg(currentOptions);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(snippet);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy embed snippet', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#DC143C]/10 text-[#DC143C] flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[#0F172A] text-base">Embed Live Badge &amp; Widget</h3>
              <p className="text-xs text-[#64748B] font-mono">Create an interactive badge with verified backlink</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Badge Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#64748B]">
              <span>LIVE BADGE PREVIEW</span>
              <div className="flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded-md border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                    theme === 'light' ? 'bg-white text-[#0F172A] shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-2 py-0.5 text-[10px] rounded font-bold transition-all cursor-pointer ${
                    theme === 'dark' ? 'bg-[#0F172A] text-white shadow-2xs' : 'text-[#64748B]'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            <div className={`p-4 rounded-xl border flex items-center justify-center ${theme === 'dark' ? 'bg-[#090D16] border-[#1E293B]' : 'bg-[#F8FAFC] border-[#E2E8F0]'}`}>
              <div
                dangerouslySetInnerHTML={{ __html: svgContent }}
                className="pointer-events-none drop-shadow-xs max-w-full overflow-hidden"
              />
            </div>
          </div>

          {/* Format Selector: 4-way tab grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-[#64748B]">
              <span>DISTRIBUTION PLATFORM / FORMAT</span>
              <span className="text-[11px] text-[#16A34A] flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Zero-CLS &amp; SEO-Optimized
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFormat('html')}
                className={`py-2 px-2 text-xs font-mono font-bold rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  format === 'html'
                    ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>HTML</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('markdown')}
                className={`py-2 px-2 text-xs font-mono font-bold rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  format === 'markdown'
                    ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Reddit / MD</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('bbcode')}
                className={`py-2 px-2 text-xs font-mono font-bold rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  format === 'bbcode'
                    ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Forums (BBCode)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormat('iframe')}
                className={`py-2 px-2 text-xs font-mono font-bold rounded-lg border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  format === 'iframe'
                    ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-xs'
                    : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}
              >
                <LayoutTemplate className="w-3.5 h-3.5" />
                <span>iFrame Card</span>
              </button>
            </div>
          </div>

          {/* Snippet Code Box */}
          <div className="space-y-2">
            <div className="relative">
              <textarea
                readOnly
                value={snippet}
                rows={3}
                className="w-full p-3 font-mono text-[11px] leading-relaxed bg-[#0F172A] text-[#F8FAFC] border border-[#334155] rounded-xl focus:outline-none resize-none selection:bg-[#DC143C] selection:text-white"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 px-3 py-1.5 text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-1.5 backdrop-blur-xs transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#22C55E]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Explanatory Footer */}
          <p className="text-[11px] font-mono text-[#64748B] leading-normal flex items-start gap-1.5">
            <ExternalLink className="w-3.5 h-3.5 text-[#DC143C] flex-shrink-0 mt-0.5" />
            <span>
              Embedding this live badge on your blog, GitHub, Reddit post, or forum signature generates a verifiable, real-time backlink to your showcase on DECK / divider.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
