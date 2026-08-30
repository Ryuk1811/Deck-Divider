import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center font-sans relative selection:bg-[#DC143C] selection:text-white p-4">
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeCurve }}
        className="relative z-10 flex flex-col items-center text-center max-w-lg"
      >
        <h1 className="text-9xl font-extrabold text-[#0F172A] tracking-tighter mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">Signal Lost</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          The transmission you are looking for has been dropped, or the portfolio index does not exist.
        </p>
        
        <Link 
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F172A] text-white rounded-full font-medium shadow-xl shadow-slate-900/10 hover:bg-[#1E293B] hover:shadow-2xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-slate-900/10"
        >
          <Home className="w-4 h-4" />
          Return to Base
        </Link>
      </motion.div>
    </div>
  );
};
