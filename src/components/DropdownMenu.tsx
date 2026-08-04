import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

interface DropdownProps {
  triggerIcon?: React.ReactNode;
  triggerLabel?: string;
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

export function DropdownMenu({
  triggerIcon,
  triggerLabel,
  children,
  className = '',
  align = 'left',
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentClasses =
    align === 'right'
      ? 'right-0 origin-top-right'
      : 'left-0 origin-top-left';

  return (
    <div className="relative inline-block text-left z-50" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-md border transition-all shadow-xs cursor-pointer ${
          isOpen
            ? 'bg-[#0F172A] text-white border-[#0F172A]'
            : 'bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]'
        } ${className}`}
      >
        {triggerIcon || <MoreVertical className="w-4 h-4" />}
        {triggerLabel && <span>{triggerLabel}</span>}
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute ${alignmentClasses} mt-2 w-max min-w-[220px] bg-white border border-[#E2E8F0] rounded-lg shadow-xl overflow-hidden animate-fade-in z-50`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
