import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center font-sans relative selection:bg-[#DC143C] selection:text-white p-4">
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeCurve }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg bg-white border border-[#E2E8F0] p-8 md:p-12 rounded-2xl shadow-xs"
      >
        <span className="text-xs font-mono font-bold text-[#DC143C] bg-[#DC143C]/10 border border-[#DC143C]/20 px-3 py-1 rounded-full mb-4">
          ERROR 404
        </span>
        <h1 className="text-7xl font-extrabold text-[#0F172A] font-heading tracking-tight mb-2">Signal Lost</h1>
        <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
          The page or checklist transmission you are looking for has been dropped, moved, or does not exist.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#DC143C] hover:bg-[#B01030] text-white rounded-xl font-mono font-bold text-xs shadow-2xs transition-all active:scale-[0.98]"
        >
          <Home className="w-4 h-4" />
          Return to Tracker
        </Link>
      </motion.div>
    </div>
  );
};
