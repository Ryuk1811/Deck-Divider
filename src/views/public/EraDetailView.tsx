import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Shield, ArrowRight, Sparkles } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { eras } from './EraDirectoryView';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock, updatePageSeo } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';

export const EraDetailView: React.FC = () => {
  const { formatId } = useParams<{ formatId: string }>();
  const navigate = useNavigate();

  const era = formatId ? eras.find(e => e.id === formatId) : null;

  useEffect(() => {
    if (era) {
      updatePageSeo({
        title: `${era.name} Collection Guide & Art History | Pokémon TCG Studio`,
        description: `Deep dive into the ${era.name} of Pokémon TCG. Explore historical sets, regulation marks (${era.marks.join(', ')}), and rare art variants for collectors.`,
        canonicalPath: `/format/${era.id}`,
      });
    }
  }, [era]);

  if (!era) {
    return (
      <div className="min-h-screen bg-dot-grid text-[#0F172A] flex items-center justify-center font-sans">
        <div className="text-center bg-white border border-[#E2E8F0] p-8 rounded-2xl shadow-xs">
          <h1 className="text-2xl font-bold font-heading mb-4 text-[#0F172A]">Era Not Found</h1>
          <button onClick={() => navigate('/formats')} className="text-[#DC143C] font-mono font-bold text-sm hover:underline">View All Eras</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title={`${era.name} Collection Guide & Art History | Pokémon TCG`}
        description={`Historical sets and art variants for the ${era.name}. Regulation marks: ${era.marks.join(', ')}.`}
        canonicalPath={`/format/${era.id}`}
        keywords={[
          `${era.name.toLowerCase()} history`,
          `${era.name.toLowerCase()} card guide`,
          'pokemon art variants',
          'pokemon collection guide'
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
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <GeoBreadcrumbs 
            items={[
              { label: 'Set Eras Directory', path: '/formats' },
              { label: era.name, path: `/format/${era.id}` },
            ]} 
          />

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-white border border-[#E2E8F0] rounded-2xl mb-6 shadow-xs">
              {era.icon}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-[#0F172A] font-heading">
              {era.name} Collection Guide
            </h1>
            <p className="text-base sm:text-lg text-[#64748B] max-w-2xl mx-auto">
              {era.description}
            </p>
          </div>

          <div className="mb-8">
            <PtcPartnerBanner context="era" />
          </div>

          <GeoExtractableBlock
            className="mb-8"
            heading={`What defines the ${era.name}?`}
            summary={`The ${era.name} represents a distinct period in the Pokémon Trading Card Game history. Collectors focus on the unique art styles and printing technologies introduced during this time, including regulation marks ${era.marks.join(', ')} for modern sets.`}
            keyFacts={[
              { label: 'Era Name', value: era.name },
              { label: 'Primary Marks', value: era.marks.join(', ') },
              { label: 'Focus', value: 'Art Curation & deck Building' },
              { label: 'Valuation', value: 'TCGplayer Market Data' },
            ]}
          />

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 mb-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading mb-6 border-b border-[#E2E8F0] pb-4">Key Characteristics</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {era.marks.map(mark => (
                <div key={mark} className="flex items-center gap-3 bg-[#F8FAFC] border border-[#E2E8F0] px-6 py-4 rounded-xl">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A]" />
                  <span className="text-xl font-bold text-[#0F172A] font-mono">[{mark}]</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[#64748B] text-xs font-mono italic">
              * Note: Regulation marks were introduced in the Sword & Shield era to help categorize sets by print cycle.
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#DC143C]/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#DC143C]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] font-heading">Ready to organize your {era.name} collection?</h3>
                <p className="text-xs text-[#64748B]">Build thematic art decks and track your binder progress in the Studio.</p>
              </div>
            </div>
            <Link
              to="/app"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold rounded-xl transition-colors whitespace-nowrap shadow-2xs"
            >
              Launch Studio Workspace <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs">
              <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-4">Collection Guidelines</h3>
              <ul className="space-y-3 text-[#64748B] text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                  <span>Verify set symbols and regulation marks for era consistency.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                  <span>Log card condition NM-DMG for accurate valuation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#DC143C] shrink-0 mt-0.5" />
                  <span>Note special foil treatments like Masterball Holos or SIRs.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A] font-heading mb-4">Master Set Progress</h3>
                <p className="text-xs text-[#64748B] leading-relaxed mb-4">
                  Track every card in the {era.name} using our master checklists. Compare your owned cards against the full catalog and see your completion percentage in real-time.
                </p>
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                   <Shield className="w-4 h-4" /> Live Market Pricing Active
                </div>
              </div>
              <button 
                onClick={() => navigate('/app')}
                className="w-full mt-4 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs py-3 rounded-xl transition-colors shadow-2xs cursor-pointer"
              >
                Launch Collection Studio &rarr;
              </button>
            </div>
          </div>

        </div>
      </main>

      <PublicInterlinkMesh currentPath={formatId ? `/format/${formatId}` : '/formats'} />

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
