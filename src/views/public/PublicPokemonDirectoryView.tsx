import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, ArrowRight, Layers, Trophy } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { POPULAR_POKEMON_SPECIES, PopularSpeciesInfo } from '../../data/popularPokemonSpecies';

export const PublicPokemonDirectoryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGen, setSelectedGen] = useState<string>('all');

  const generations = useMemo(() => {
    const gens = new Set(POPULAR_POKEMON_SPECIES.map(s => s.generation));
    return ['all', ...Array.from(gens)];
  }, []);

  const filteredSpecies = useMemo(() => {
    return POPULAR_POKEMON_SPECIES.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        s.types.some(t => t.toLowerCase().includes(searchQuery.toLowerCase().trim()));
      
      const matchesGen = selectedGen === 'all' || s.generation === selectedGen;
      return matchesSearch && matchesGen;
    });
  }, [searchQuery, selectedGen]);

  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Iconic Pokémon TCG Species & Character Price Guide Hubs',
    description: 'Browse complete historical card lists, market values, and master binder checklists for iconic Pokémon including Charizard, Pikachu, Mewtwo, Eevee, Gengar, and Umbreon.',
    url: 'https://deckdivider.app/pokemon',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: POPULAR_POKEMON_SPECIES.length,
      itemListElement: POPULAR_POKEMON_SPECIES.map((s, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: `All ${s.name} Cards List & Checklist`,
        url: `https://deckdivider.app/pokemon/${s.slug}`,
      }))
    }
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-slate-900">
      <PageHead
        title="All Pokémon Cards by Species & Character | DECK / divider"
        description="Explore complete Pokémon card lists and market values sorted by character: Charizard, Pikachu, Mewtwo, Umbreon, Eevee, Gengar, and more. Track your favorite species."
        canonicalPath="/pokemon"
        keywords={[
          'all pokemon cards by character',
          'pokemon card lists by species',
          'charizard cards checklist',
          'pikachu cards price guide',
          'umbreon card collection'
        ]}
        schema={schemaJsonLd}
      />
      <LandingNav />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <GeoBreadcrumbs 
          items={[
            { label: 'Directory', path: '/directory' },
            { label: 'Pokémon Species', path: '/pokemon' }
          ]} 
        />

        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Character Directory</span>
            <span aria-hidden="true">·</span>
            <span>All 218 Sets Indexed</span>
            <span aria-hidden="true">·</span>
            <span>Live TCGplayer Market Comps</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Pokémon Character Hubs &amp; Species Checklists
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            Collectors don't just collect sets; they collect by favorite Pokémon. Explore comprehensive historical checklists, vintage holos, modern secret illustration rares, and live market pricing for iconic Pokémon franchise legends.
          </p>
        </div>

        {/* Partner Offer */}
        <PtcPartnerBanner />

        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Pokémon name, type, or region..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#DC143C]"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {generations.map(gen => (
              <button
                key={gen}
                type="button"
                onClick={() => setSelectedGen(gen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedGen === gen
                    ? 'bg-[#DC143C] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {gen === 'all' ? 'All Generations' : gen}
              </button>
            ))}
          </div>
        </div>

        {/* Species Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSpecies.map(sp => (
            <Link
              key={sp.slug}
              to={`/pokemon/${sp.slug}`}
              className="bg-white border border-slate-200 hover:border-[#DC143C]/40 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-400">#{sp.dexNumber}</span>
                  <span className="text-xs font-mono text-slate-500">{sp.types.join(' · ')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#DC143C] transition-colors font-heading">
                    {sp.name}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono block mt-0.5">{sp.category}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {sp.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-semibold text-[#DC143C] group-hover:translate-x-0.5 transition-transform">
                <span>View All {sp.name} Cards</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Interlink Mesh */}
        <PublicInterlinkMesh />
      </main>

      <LandingFooter />
    </div>
  );
};
