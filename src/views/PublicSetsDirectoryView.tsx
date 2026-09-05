import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans text-white">
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
              Pokémon TCG Expansions
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-3xl">
              Browse our complete database of Pokémon Trading Card Game sets. View checklists, live TCGplayer market values, format legalities, and track your master sets.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#38BDF8]"></div>
            </div>
          ) : (
            <div className="space-y-16">
              {categorizedSets.map((category) => (
                <section key={category.id} id={category.id} className="scroll-mt-32">
                  <div className="flex items-center gap-3 mb-6 border-b border-[#1E293B] pb-4">
                    <span className="text-2xl">{category.icon}</span>
                    <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {category.sets.map((set) => (
                      <Link 
                        key={set.id}
                        to={`/set/${set.id}`}
                        className="group flex flex-col bg-[#111827] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-[#38BDF8]/5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                              {set.name}
                            </h3>
                            <p className="text-sm text-[#64748B] mt-1">{set.releaseDate}</p>
                          </div>
                          {set.symbolUrl && (
                            <img 
                              src={set.symbolUrl} 
                              alt={`${set.name} symbol`} 
                              className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity ml-3"
                              loading="lazy"
                            />
                          )}
                        </div>
                        
                        <div className="mt-auto pt-4 flex items-center justify-between text-sm">
                          <span className="text-[#94A3B8]">
                            {set.printedTotal} Cards
                          </span>
                          <span className="flex items-center text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                            Checklist <ArrowRight className="w-4 h-4 ml-1" />
                          </span>
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
