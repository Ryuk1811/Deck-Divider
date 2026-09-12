import React, { useState } from 'react';
import { ExternalLink, Copy, Check } from 'lucide-react';

interface PublicShareLinkBoxProps {
  isPublic: boolean;
  url: string;
  className?: string;
}

export const PublicShareLinkBox: React.FC<PublicShareLinkBoxProps> = ({
  isPublic,
  url,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isPublic || !url) return null;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy link:', err);
    }
  };

  return (
    <div className={`flex items-center gap-2 max-w-full ${className}`}>
      {/* Internal Scroll View Container for the Public Link */}
      <div 
        className="max-w-[180px] sm:max-w-[260px] md:max-w-[340px] overflow-x-auto whitespace-nowrap bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 select-all cursor-text transition-colors shadow-2xs scrollbar-thin"
        title="Scroll horizontally or select to view full public URL"
      >
        <span className="inline-block select-all">{url}</span>
      </div>

      {/* Copy Button */}
      <button
        type="button"
        onClick={handleCopy}
        className={`h-8 px-2.5 rounded-lg border font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs ${
          copied
            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
        }`}
        title="Copy public link to clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px]">Copied</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-[11px] hidden sm:inline">Copy</span>
          </>
        )}
      </button>

      {/* Open in New Tab Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="h-8 px-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
        title="Open public link in new tab"
      >
        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[11px] hidden sm:inline">Open</span>
      </a>
    </div>
  );
};
