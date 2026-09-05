import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Swords, Layers } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';

export const formats = [
  {
    id: 'standard',
    name: 'Standard Format',
    description: 'The most popular tournament format. Allows only the most recent expansions, rotating annually to keep gameplay fresh.',
    regulationMarks: ['G', 'H'],
    icon: <Shield className="w-8 h-8 text-[#38BDF8]" />
  },
  {
    id: 'expanded',
    name: 'Expanded Format',
    description: 'A massive card pool stretching back to the Black & White series. High-powered combos and deep strategic options.',
    regulationMarks: ['All (Black & White onwards)'],
    icon: <Swords className="w-8 h-8 text-[#F43F5E]" />
  },
  {
    id: 'glc',
    name: 'Gym Leader Challenge (GLC)',
    description: 'A community-driven singleton format where decks can only use a single type of Pokémon and no Rule Box cards (ex, V, GX).',
    regulationMarks: ['All (Black & White onwards)'],
    icon: <Layers className="w-8 h-8 text-[#10B981]" />
  }
];

export const FormatLegalityDirectoryView: React.FC = () => {
  const navigate = useNavigate();

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
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Pokémon TCG Formats & Legality
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              Understand the rules, rotation schedules, and legal card pools for every major competitive and community format in the Pokémon Trading Card Game.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map(format => (
              <Link 
                key={format.id}
                to={`/formats/${format.id}`}
                className="bg-[#111827] border border-[#1E293B] hover:border-[#38BDF8]/50 rounded-2xl p-6 transition-all hover:-translate-y-1 group"
              >
                <div className="bg-[#1E293B] w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {format.icon}
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-[#38BDF8] transition-colors">{format.name}</h2>
                <p className="text-[#94A3B8] mb-6 leading-relaxed">
                  {format.description}
                </p>
                <div className="text-sm font-semibold text-[#E2E8F0] mb-4 bg-[#0B0F19] py-2 px-3 rounded-lg border border-[#334155]">
                  <span className="text-[#64748B]">Current Marks:</span> {format.regulationMarks.join(', ')}
                </div>
                <div className="flex items-center text-[#38BDF8] font-semibold text-sm">
                  View Legality Guide <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
