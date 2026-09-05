import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { formats } from './FormatLegalityDirectoryView';

export const FormatLegalityView: React.FC = () => {
  const { formatId } = useParams<{ formatId: string }>();
  const navigate = useNavigate();

  const format = formatId ? formats.find(f => f.id === formatId.toLowerCase()) : null;

  if (!format) {
    return (
      <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Format Not Found</h1>
          <button onClick={() => navigate('/formats')} className="text-[#38BDF8] hover:underline">View All Formats</button>
        </div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="mb-8">
            <Link to="/formats" className="inline-flex items-center text-sm text-[#94A3B8] hover:text-[#38BDF8] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Formats
            </Link>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-[#1E293B] rounded-2xl mb-6">
              {format.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              {format.name} Rules & Legality
            </h1>
            <p className="text-lg text-[#94A3B8] max-w-2xl mx-auto">
              {format.description}
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#1E293B] pb-4">Current Legal Regulation Marks</h2>
            <div className="flex flex-wrap gap-4">
              {format.regulationMarks.map(mark => (
                <div key={mark} className="flex items-center gap-3 bg-[#0B0F19] border border-[#334155] px-6 py-4 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-[#10B981]" />
                  <span className="text-xl font-bold text-white">[{mark}]</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[#94A3B8] text-sm">
              * Note: Some cards without regulation marks may be legal if they are reprints of cards that currently possess legal regulation marks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Deck Construction</h3>
              <ul className="space-y-3 text-[#94A3B8]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                  <span>Exactly 60 cards per deck.</span>
                </li>
                {format.id === 'glc' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>Only one of each card (excluding basic energy).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                      <span>All Pokémon must be of the same type.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-[#F43F5E] shrink-0 mt-0.5" />
                      <span>No Rule Box Pokémon allowed.</span>
                    </li>
                  </>
                ) : (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>Maximum 4 copies of any card with the same name (excluding basic energy).</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-4">Build a {format.name} Deck</h3>
              <p className="text-[#94A3B8] mb-6">
                Use our advanced deck builder to construct and validate your deck automatically against {format.name} legality rules.
              </p>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full bg-[#38BDF8] text-[#0B0F19] font-bold py-3 rounded-lg hover:bg-[#7DDBFF] transition-colors"
              >
                Launch Deck Builder
              </button>
            </div>
          </div>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
