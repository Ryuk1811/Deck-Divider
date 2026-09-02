import React from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Keyboard } from 'lucide-react';

export const SearchVolumeSection: React.FC = () => {
  const gridCards = Array.from({ length: 144 }, (_, i) => i);

  return (
    <section id="search" className="w-full py-24 sm:py-32 bg-slate-950 text-white relative overflow-hidden">
      {/* Dense Background Grid (Volume Representation) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden flex items-center justify-center [perspective:1000px]">
        <motion.div 
          animate={{ rotateX: [10, 15, 10], rotateZ: [0, 2, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-wrap gap-1.5 sm:gap-2 justify-center w-[120%] h-[120%] -translate-y-10"
        >
          {gridCards.map((i) => (
            <div 
              key={i} 
              className={`w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 rounded-[2px] sm:rounded-sm 
                ${i % 7 === 0 ? 'bg-amber-400' : i % 5 === 0 ? 'bg-emerald-400' : i % 3 === 0 ? 'bg-sky-400' : 'bg-slate-700'} 
                ${i % 11 === 0 ? 'animate-pulse' : ''}
              `}
              style={{ opacity: Math.random() * 0.5 + 0.3 }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md">
          <span className="font-mono text-[10px] sm:text-xs font-bold text-sky-400 tracking-widest">05/07</span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-300 tracking-widest">DISCOVERY</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl w-full"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 font-heading tracking-tighter drop-shadow-2xl"
            >
              18,400+
            </motion.div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight mb-6">
            Find yours in seconds.
          </h2>
          
          <p className="text-base sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-16">
            Instant search across TCG history. Filter by type, stage, illustrator, HP, attack damage, or exact price range.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Search by Illustrator</h3>
              <p className="text-sm text-slate-400">
                Find every card drawn by your favorite artists like Mitsuhiro Arita, Tomokazu Komiya, or Ken Sugimori.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Fast Filter Combinations</h3>
              <p className="text-sm text-slate-400">
                Combine set name, rarity, and card type to find exact prints in seconds.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Keyboard className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Quick Keyboard Search</h3>
              <p className="text-sm text-slate-400">
                Press ⌘K on Mac or Ctrl+K on Windows to open the search bar from any screen.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
