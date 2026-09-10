import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Calendar } from 'lucide-react';
import { CardSet } from '../types';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { getExpansionsCatalog } from '../lib/dataSyncEngine';
import { getDynamicSeriesCategories, sortSetsChronologically, normalizeSet } from '../utils/setCategorizer';

export const PublicSetsDirectoryView: React.FC = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExpansionsCatalog().then(data => {
      setSets(data);
      setLoading(false);
    });
  }, []);

  const categorizedSets = useMemo(() => {
    const categories: Array<{ id: string; name: string; icon: string; sets: CardSet[] }> = getDynamicSeriesCategories(sets)
      .filter(c => c !== 'All')
      .map(name => {
        let icon = '🎴';
        if (name.includes('Scarlet & Violet')) icon = '🌟';
        else if (name.includes('Sword & Shield')) icon = '⚔️';
        else if (name.includes('Sun & Moon')) icon = '🌙';
        else if (name.includes('XY')) icon = '🧬';
        else if (name.includes('Black & White')) icon = '⚫';
        
        return { 
          id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'), 
          name, 
          icon,
          sets: [] 
        };
      });
      
    const otherCat = { id: 'other', name: 'Other', icon: '📦', sets: [] as CardSet[] };
    categories.push(otherCat);
    
    sets.forEach(rawSet => {
      const s = normalizeSet(rawSet);
      const cat = categories.find(c => c.name === s.series);
      if (cat) {
        cat.sets.push(s);
      } else {
        otherCat.sets.push(s);
      }
    });

    categories.forEach(cat => {
      cat.sets = sortSetsChronologically(cat.sets);
    });

    return categories.filter(cat => cat.sets.length > 0);
  }, [sets]);

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-xs font-mono font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Official Expansion Catalog</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#0F172A] font-heading">
              Pokémon TCG Expansions
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#64748B] max-w-3xl leading-relaxed">
              Browse our complete database of Pokémon Trading Card Game sets. View checklists, live TCGplayer market values, format legalities, and track your master sets.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#E2E8F0] border-t-[#DC143C]"></div>
            </div>
          ) : (
            <div className="space-y-12 sm:space-y-16">
              {categorizedSets.map((category) => (
                <section key={category.id} id={category.id} className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#E2E8F0] pb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">{category.name}</h2>
                    <span className="text-xs font-mono font-semibold text-[#64748B] bg-white border border-[#E2E8F0] px-2.5 py-0.5 rounded-full">
                      {category.sets.length} {category.sets.length === 1 ? 'Set' : 'Sets'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {category.sets.map((set) => (
                      <Link 
                        key={set.id}
                        to={`/set/${set.id}`}
                        className="group flex flex-col bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
                      >
                        {/* Expansion Logo Container */}
                        <div className="h-28 w-full bg-[#F8FAFC] border-b border-[#E2E8F0] p-4 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-50 transition-colors">
                          {set.logoUrl ? (
                            <img 
                              src={set.logoUrl} 
                              alt={`${set.name} logo`} 
                              className="max-w-[85%] max-h-[85%] object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-200"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.currentTarget;
                                if (target.src.endsWith('.webp')) {
                                  target.src = target.src.replace('.webp', '.png');
                                } else if (set.symbolUrl && target.src !== set.symbolUrl) {
                                  target.src = set.symbolUrl;
                                } else {
                                  target.style.display = 'none';
                                }
                              }}
                            />
                          ) : (
                            <span className="font-heading font-bold text-sm text-[#64748B]">{set.name}</span>
                          )}
                          {set.symbolUrl && (
                            <img 
                              src={set.symbolUrl} 
                              alt="" 
                              className="absolute top-2.5 right-2.5 w-5 h-5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                              loading="lazy"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                          )}
                        </div>

                        {/* Set Information */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-sm sm:text-base text-[#0F172A] group-hover:text-[#DC143C] transition-colors line-clamp-1 font-heading">
                              {set.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-mono mt-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                              <span>{set.releaseDate}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs font-mono">
                            <span className="text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-0.5 rounded-md font-medium">
                              {set.printedTotal} Cards
                            </span>
                            <span className="flex items-center text-[#DC143C] font-semibold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 transform duration-200">
                              Checklist <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
