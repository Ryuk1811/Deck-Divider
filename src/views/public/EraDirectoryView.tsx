import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Layers, Sparkles, Box } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';

export const eras = [
  {
    id: 'modern',
    name: 'Modern Era (S&V)',
    description: 'The latest generation of Pokémon TCG. Features Scarlet & Violet expansions with high-definition art and textured secret rares.',
    marks: ['H', 'I', 'J'],
    icon: <Sparkles className="w-8 h-8 text-[#DC143C]" />
  },
  {
    id: 'mid-era',
    name: 'Classic Era (SWSH/SM)',
    description: 'A massive collection of cards from Sword & Shield and Sun & Moon. Includes Alternate Arts, VMAX, and Tag Team GX grails.',
    marks: ['D', 'E', 'F', 'Pre-Mark'],
    icon: <Layers className="w-8 h-8 text-[#2563EB]" />
  },
  {
    id: 'vintage',
    name: 'Vintage Heritage',
    description: 'The foundation of the hobby. From Base Set through the Nintendo e-Reader era. Rare holos and 1st Edition classics.',
    marks: ['Original / WotC'],
    icon: <Box className="w-8 h-8 text-[#16A34A]" />
  }
];

export const EraDirectoryView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title="Pokémon TCG Set Eras & Art Variants Guide | DECK / divider"
        description="Comprehensive guide to Pokémon TCG historical eras, regulation marks, and artistic variants. Track your collection across Modern, Mid-Era, and Vintage sets."
        canonicalPath="/formats"
        keywords={[
          'pokemon tcg eras',
          'pokemon set history',
          'pokemon card variants',
          'pokemon regulation marks h i j',
          'pokemon vintage card guide',
          'pokemon tcg collection guide'
        ]}
      />
      <LandingNav 
        onOpenAuth={() => navigate('/auth')} 
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }} 
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <GeoBreadcrumbs items={[{ label: 'Set Eras Directory', path: '/formats' }]} />

          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
              Pokémon TCG Eras &amp; Evolution
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto">
              Explore the rich history of the Pokémon Trading Card Game through distinct eras of art, design, and card mechanics.
            </p>
          </div>

          <div className="mb-6">
            <PtcPartnerBanner />
          </div>

          <GeoExtractableBlock
            className="mb-10"
            heading="Understanding TCG Eras & Regulation Marks"
            summary="The Pokémon TCG is categorized into Eras that align with the core video game generations. Each era introduces new art styles, foil treatments, and rarity tiers. Modern cards (2020+) feature Regulation Marks to help collectors identify print cycles and set legality. From the early hand-painted art of the WotC era to the high-tech textured illustration rares of today, every era offers unique value for collectors."
            keyFacts={[
              { label: 'Modern Era', value: 'Scarlet & Violet Series' },
              { label: 'Mid-Era', value: 'XY, Sun & Moon, SWSH' },
              { label: 'Vintage Era', value: 'Base Set to EX Series' },
              { label: 'Tracking', value: 'Regulation Marks H, I, J' },
            ]}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {eras.map(era => (
              <Link 
                key={era.id}
                to={`/format/${era.id}`}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {era.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading mb-3 group-hover:text-[#DC143C] transition-colors">{era.name}</h2>
                  <p className="text-[#64748B] mb-6 leading-relaxed text-sm">
                    {era.description}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#0F172A] mb-4 bg-[#F8FAFC] py-2 px-3 rounded-xl border border-[#E2E8F0] font-mono">
                    <span className="text-[#64748B]">Primary Marks:</span> {era.marks.join(', ')}
                  </div>
                  <div className="flex items-center text-[#DC143C] font-mono font-bold text-xs">
                    Explore Era History <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#DC143C]/10 rounded-2xl shrink-0 mt-1">
                <Shield className="w-6 h-6 text-[#DC143C]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading mb-1">
                  Art deck &amp; Collection Manager
                </h3>
                <p className="text-sm text-[#64748B]">
                  Organize your cards into thematic decks and artistic showcases. Track condition, market value, and era mastery with zero ads.
                </p>
              </div>
            </div>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-2xs"
            >
              Launch Studio Workspace <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <PublicInterlinkMesh currentPath="/formats" />

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
