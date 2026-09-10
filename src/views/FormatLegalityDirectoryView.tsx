import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Swords, Layers, Sparkles } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { updatePageSeo } from '../utils/seo';

export const formats = [
  {
    id: 'standard',
    name: 'Standard Format',
    description: 'The most popular tournament format. Allows only the most recent expansions, rotating annually to keep gameplay fresh.',
    regulationMarks: ['G', 'H'],
    icon: <Shield className="w-8 h-8 text-[#DC143C]" />
  },
  {
    id: 'expanded',
    name: 'Expanded Format',
    description: 'A massive card pool stretching back to the Black & White series. High-powered combos and deep strategic options.',
    regulationMarks: ['All (Black & White onwards)'],
    icon: <Swords className="w-8 h-8 text-[#2563EB]" />
  },
  {
    id: 'glc',
    name: 'Gym Leader Challenge (GLC)',
    description: 'A community-driven singleton format where decks can only use a single type of Pokémon and no Rule Box cards (ex, V, GX).',
    regulationMarks: ['All (Black & White onwards)'],
    icon: <Layers className="w-8 h-8 text-[#16A34A]" />
  }
];

export const FormatLegalityDirectoryView: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSeo({
      title: 'Official Pokémon TCG Formats & Rotation Legality Directory | DECK / divider',
      description: 'Directory of official Pokémon TCG tournament formats: Standard, Expanded, and Gym Leader Challenge (GLC). Learn legal regulation marks, rotation rules, and card restrictions.',
      canonicalPath: '/formats',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Pokémon TCG Formats & Legality Directory',
        description: 'Complete rules and regulation mark guidelines for Pokémon TCG competitive formats.',
        url: 'https://deckdivider.app/formats',
        itemListElement: formats.map((f, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: f.name,
          url: `https://deckdivider.app/formats/${f.id}`,
        })),
      },
    });
  }, []);

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
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
              Pokémon TCG Formats &amp; Legality
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto">
              Understand the rules, rotation schedules, and legal card pools for every major competitive and community format in the Pokémon Trading Card Game.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {formats.map(format => (
              <Link 
                key={format.id}
                to={`/formats/${format.id}`}
                className="bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col justify-between shadow-xs hover:shadow-sm"
              >
                <div>
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    {format.icon}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading mb-3 group-hover:text-[#DC143C] transition-colors">{format.name}</h2>
                  <p className="text-[#64748B] mb-6 leading-relaxed text-sm">
                    {format.description}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#0F172A] mb-4 bg-[#F8FAFC] py-2 px-3 rounded-xl border border-[#E2E8F0] font-mono">
                    <span className="text-[#64748B]">Current Marks:</span> {format.regulationMarks.join(', ')}
                  </div>
                  <div className="flex items-center text-[#DC143C] font-mono font-bold text-xs">
                    View Legality Guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Interactive Tool Cross-Promo Card */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#DC143C]/10 rounded-2xl shrink-0 mt-1">
                <Sparkles className="w-6 h-6 text-[#DC143C]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading mb-1">
                  Interactive Regulation Mark &amp; Legality Checker
                </h3>
                <p className="text-sm text-[#64748B]">
                  Not sure which cards are legal in Standard right now? Test Regulation Marks G, H, and I with live format breakdown and deckbuilding limits.
                </p>
              </div>
            </div>
            <Link
              to="/tools/deck-legality-checker"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl transition-colors whitespace-nowrap shadow-2xs"
            >
              Open Legality Inspector <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </main>

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
