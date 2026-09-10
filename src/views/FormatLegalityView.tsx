import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Shield, ArrowRight } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { formats } from './FormatLegalityDirectoryView';
import { updatePageSeo } from '../utils/seo';

export const FormatLegalityView: React.FC = () => {
  const { formatId } = useParams<{ formatId: string }>();
  const navigate = useNavigate();

  const format = formatId ? formats.find(f => f.id === formatId.toLowerCase()) : null;

  useEffect(() => {
    if (format) {
      updatePageSeo({
        title: `${format.name} Rules & Regulation Mark Legality | DECK / divider`,
        description: `Complete ${format.name} tournament rules, legal regulation marks, rotation schedule, and 60-card deck restrictions for Pokémon TCG competitive play.`,
        canonicalPath: `/formats/${format.id}`,
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${format.name} Rules & Regulation Mark Legality`,
          description: format.description,
          url: `https://deckdivider.app/formats/${format.id}`,
        },
      });
    }
  }, [format]);

  if (!format) {
    return (
      <div className="min-h-screen bg-dot-grid text-[#0F172A] flex items-center justify-center font-sans">
        <div className="text-center bg-white border border-[#E2E8F0] p-8 rounded-2xl shadow-xs">
          <h1 className="text-2xl font-bold font-heading mb-4 text-[#0F172A]">Format Not Found</h1>
          <button onClick={() => navigate('/formats')} className="text-[#DC143C] font-mono font-bold text-sm hover:underline">View All Formats</button>
        </div>
      </div>
    );
  }

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
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          
          <div className="mb-8">
            <Link to="/formats" className="inline-flex items-center text-xs font-mono font-bold text-[#64748B] hover:text-[#0F172A] transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Formats
            </Link>
          </div>

          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-4 bg-white border border-[#E2E8F0] rounded-2xl mb-6 shadow-xs">
              {format.icon}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
              {format.name} Rules &amp; Legality
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto">
              {format.description}
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 mb-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading mb-6 border-b border-[#E2E8F0] pb-4">Current Legal Regulation Marks</h2>
            <div className="flex flex-wrap gap-4">
              {format.regulationMarks.map(mark => (
                <div key={mark} className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-4 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
                  <span className="text-xl font-bold text-[#0F172A] font-mono">[{mark}]</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[#64748B] text-xs font-mono">
              * Note: Some cards without regulation marks may be legal if they are reprints of cards that currently possess legal regulation marks.
            </p>
          </div>

          {/* Reciprocal Interactive Tool Banner */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#DC143C]/10 rounded-xl">
                <Shield className="w-5 h-5 text-[#DC143C]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] font-heading">Need to check a specific card or regulation mark?</h3>
                <p className="text-xs text-[#64748B]">Inspect marks G, H, and I with our interactive regulation mark simulator.</p>
              </div>
            </div>
            <Link
              to="/tools/deck-legality-checker"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold rounded-xl transition-colors whitespace-nowrap shadow-2xs"
            >
              Open Legality Inspector <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs">
              <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-4">Deck Construction</h3>
              <ul className="space-y-3 text-[#64748B] text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                  <span>Exactly 60 cards per deck.</span>
                </li>
                {format.id === 'glc' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                      <span>Only one of each card (excluding basic energy).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                      <span>All Pokémon must be of the same type.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                      <span>No Rule Box Pokémon allowed.</span>
                    </li>
                  </>
                ) : (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                    <span>Maximum 4 copies of any card with the same name (excluding basic energy).</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-4">Build a {format.name} Deck</h3>
                <p className="text-[#64748B] text-sm mb-6 leading-relaxed">
                  Use our advanced deck builder to construct and validate your deck automatically against {format.name} legality rules.
                </p>
              </div>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs py-3 rounded-xl transition-colors shadow-2xs"
              >
                Launch Deck Builder
              </button>
            </div>
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
