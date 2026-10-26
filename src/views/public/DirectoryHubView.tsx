import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Boxes,
  BookOpen,
  Trophy,
  ShieldCheck,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getExpansionsCatalog } from '../../lib/dataSyncEngine';
import { CardSet } from '../../types';
import { TOURNAMENT_DECKS } from '../../data/tournamentDecks';
import { GLOSSARY_TERMS, KEYWORD_CLUSTERS } from '../../../server/keywordCatalogManager';

type DirectorySection = 'overview' | 'sets-index' | 'decks-index' | 'slabs-index' | 'glossary';

export const DirectoryHubView: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { section } = useParams<{ section?: string }>();

  const currentSection: DirectorySection = useMemo(() => {
    const path = location.pathname.replace(/\/$/, '');
    if (path.endsWith('/sets-index')) return 'sets-index';
    if (path.endsWith('/decks-index')) return 'decks-index';
    if (path.endsWith('/slabs-index')) return 'slabs-index';
    if (path.endsWith('/glossary')) return 'glossary';
    return 'overview';
  }, [location.pathname]);

  const [sets, setSets] = useState<CardSet[]>([]);
  const [setsSearchQuery, setSetsSearchQuery] = useState('');
  const [glossarySearchQuery, setGlossarySearchQuery] = useState('');

  useEffect(() => {
    getExpansionsCatalog().then(data => {
      if (data && data.length > 0) setSets(data);
    });
  }, []);

  const filteredSets = useMemo(() => {
    if (!setsSearchQuery.trim()) return sets;
    const q = setsSearchQuery.toLowerCase();
    return sets.filter(s => s.name.toLowerCase().includes(q) || (s.series && s.series.toLowerCase().includes(q)));
  }, [sets, setsSearchQuery]);

  const filteredGlossary = useMemo(() => {
    if (!glossarySearchQuery.trim()) return GLOSSARY_TERMS;
    const q = glossarySearchQuery.toLowerCase();
    return GLOSSARY_TERMS.filter(g => g.term.toLowerCase().includes(q) || g.definition.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
  }, [glossarySearchQuery]);

  const getSectionTitle = () => {
    switch (currentSection) {
      case 'sets-index': return 'All Pokémon TCG Expansion Sets & Master Checklists Index';
      case 'decks-index': return 'Competitive 60-Card Tournament Meta Decks Index';
      case 'slabs-index': return 'Graded Slab Registry & Valuation Multipliers Guide';
      case 'glossary': return 'Pokémon TCG Terminology & Card Mechanics Glossary';
      default: return 'Pokémon TCG Directory & Knowledge Base';
    }
  };

  const getSectionDesc = () => {
    switch (currentSection) {
      case 'sets-index': return 'Complete catalog of 218 catalogued sets (148+ master expansions) across Scarlet & Violet, Sword & Shield, and Vintage eras with master set completion checklists.';
      case 'decks-index': return 'Standard format legal tournament decklists with 2026 regulation marks H/I/J compliance, energy curves, and 1-click PTCGL export strings.';
      case 'slabs-index': return 'PSA, BGS Beckett, CGC, and ACE condition standards, centering ratio rules, certificate registry tracking, and grade value spreads.';
      case 'glossary': return 'Definitive dictionary of Pokémon TCG terminology: ACE SPEC, Secret Illustration Rares, Regulation Marks, Lost Zone, and more.';
      default: return 'Comprehensive Pokémon TCG index of 218 catalogued sets (148+ master expansions), competitive 60-card meta decks, PSA/BGS slab valuations, and game mechanics glossary.';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans">
      <PageHead
        title={`${getSectionTitle()} | DECK / divider`}
        description={getSectionDesc()}
        canonicalPath={location.pathname}
        ogImage="https://deckdivider.app/og-image.png?v=2"
      />

      <LandingNav onOpenAuth={() => navigate('/auth')} onEnterApp={() => navigate('/app')} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <GeoBreadcrumbs
          items={[
            { label: 'Directory', path: '/directory' },
            ...(currentSection !== 'overview' ? [{ label: currentSection.replace('-index', '').toUpperCase(), path: location.pathname }] : []),
          ]}
        />

        {/* Hero Header */}
        <div className="mt-4 mb-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-[#DC143C] text-xs font-bold uppercase tracking-wider font-mono mb-3">
            Knowledge Base &amp; Discovery Hub
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            {getSectionTitle()}
          </h1>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {getSectionDesc()}
          </p>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none border-b border-slate-100">
            <Link
              to="/directory"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${currentSection === 'overview' ? 'bg-[#DC143C] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              Hub Overview
            </Link>
            <Link
              to="/directory/sets-index"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${currentSection === 'sets-index' ? 'bg-[#DC143C] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              Expansions ({sets.length > 0 ? sets.length : '100+'})
            </Link>
            <Link
              to="/directory/decks-index"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${currentSection === 'decks-index' ? 'bg-[#DC143C] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              Meta Decks ({Object.keys(TOURNAMENT_DECKS).length})
            </Link>
            <Link
              to="/directory/slabs-index"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${currentSection === 'slabs-index' ? 'bg-[#DC143C] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              Graded Slabs
            </Link>
            <Link
              to="/directory/glossary"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap ${currentSection === 'glossary' ? 'bg-[#DC143C] text-white shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
            >
              TCG Glossary ({GLOSSARY_TERMS.length})
            </Link>
          </div>
        </div>

        {/* 1. OVERVIEW HUB */}
        {currentSection === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-[#DC143C]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Boxes className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Expansions &amp; Set Checklists</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Complete card checklists, reverse holos, and masterball foils from Scarlet &amp; Violet, Sword &amp; Shield, Sun &amp; Moon, and vintage sets.
                </p>
                <Link to="/directory/sets-index" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#DC143C] hover:underline">
                  Browse Sets Index <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-[#DC143C]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">60-Card Meta Decks</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Standard format legal tournament deck lists with 2026 regulation marks H/I/J compliance and 1-click PTCGL export strings.
                </p>
                <Link to="/directory/decks-index" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#DC143C] hover:underline">
                  View Meta Decks <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-[#DC143C]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Graded Slabs &amp; Multipliers</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  PSA, BGS Beckett, CGC, and ACE condition standards, centering ratio rules, certificate registry tracking, and grade value spreads.
                </p>
                <Link to="/directory/slabs-index" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#DC143C] hover:underline">
                  Grading &amp; Slab Guides <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-[#DC143C]/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Terminology Glossary</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  Definitive dictionary of Pokémon TCG terminology: ACE SPEC, Secret Illustration Rares, Regulation Marks, Lost Zone, and more.
                </p>
                <Link to="/directory/glossary" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#DC143C] hover:underline">
                  Open TCG Glossary <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Keyword Deep Links */}
            <div className="bg-slate-100/80 border border-slate-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Core Search Categories &amp; Direct Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {KEYWORD_CLUSTERS.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{c.category}</h4>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{c.description}</p>
                    <a href={c.targetUrl} className="text-xs font-bold text-[#DC143C] hover:underline flex items-center gap-1">
                      {c.ctaText} &rarr;
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. SETS INDEX */}
        {currentSection === 'sets-index' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={setsSearchQuery}
                onChange={e => setSetsSearchQuery(e.target.value)}
                placeholder="Search expansions by name, era, or code (e.g. 151, Surging Sparks, Evolving Skies)..."
                className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSets.map(set => (
                <div key={set.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-[#DC143C]/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold font-mono text-slate-500 uppercase">{set.series || 'Pokémon TCG'}</span>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">{set.id.toUpperCase()}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{set.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">
                      {set.total || (set as any).cardCount?.total || 'Checklist'} cards • Released {set.releaseDate || 'Official'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <Link
                      to={`/set/${set.id}`}
                      className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-[#DC143C] hover:text-white rounded-lg text-xs font-semibold text-center transition-colors text-slate-800"
                    >
                      Checklist
                    </Link>
                    <Link
                      to={`/set/${set.id}/top-cards`}
                      className="flex-1 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-center transition-colors text-slate-700"
                    >
                      Top Cards
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. META DECKS INDEX */}
        {currentSection === 'decks-index' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(TOURNAMENT_DECKS).map(deck => (
                <div key={deck.slug} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs hover:border-[#DC143C]/40 transition-colors flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-red-50 text-[#DC143C] font-mono">{deck.tier}</span>
                      <span className="text-xs font-bold text-emerald-600 font-mono">Est. ${deck.estPrice.toFixed(2)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{deck.name}</h3>
                    <p className="text-xs font-semibold text-slate-500 mb-3">{deck.format}</p>
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{deck.description}</p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4">
                      <strong className="text-slate-900 block mb-0.5">Key Engine:</strong> {deck.keyPokemon}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <Link
                      to={`/deck/${deck.slug}`}
                      className="flex-1 py-2 px-4 bg-[#DC143C] hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center transition-colors shadow-xs"
                    >
                      View 60-Card Decklist
                    </Link>
                    <Link
                      to="/tools/deck-legality-checker"
                      className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center transition-colors"
                    >
                      Test Legality
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. GRADED SLABS INDEX */}
        {currentSection === 'slabs-index' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-[#DC143C] flex items-center justify-center mb-4 font-black">PSA</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">PSA (Professional Sports Authenticator)</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  The primary benchmark in trading card grading. Standard centering ratio is 55/45 to 60/40 on the front and 75/25 on the back for Gem Mint 10.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-4">
                  <div className="flex justify-between"><span>PSA 10 Multiplier:</span> <strong className="text-slate-900">3.5x – 6.0x raw</strong></div>
                  <div className="flex justify-between"><span>PSA 9 Multiplier:</span> <strong className="text-slate-900">1.0x – 1.3x raw</strong></div>
                </div>
                <Link to="/tools/psa-grade-calculator" className="text-xs font-bold text-[#DC143C] hover:underline flex items-center gap-1">
                  PSA Multiplier Calculator &rarr;
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 font-black">BGS</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">BGS (Beckett Grading Services)</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Renowned for subgrades: Centering, Corners, Edges, Surface. All four subgrades achieving 10 awards the coveted Beckett Black Label.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-4">
                  <div className="flex justify-between"><span>Black Label 10:</span> <strong className="text-slate-900">10x – 25x raw</strong></div>
                  <div className="flex justify-between"><span>BGS Pristine 10:</span> <strong className="text-slate-900">4.5x – 7.0x raw</strong></div>
                </div>
                <Link to="/tools/psa-grade-calculator" className="text-xs font-bold text-[#DC143C] hover:underline flex items-center gap-1">
                  BGS vs PSA Calculator &rarr;
                </Link>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 font-black">CGC</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">CGC Cards</h3>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  Crystal-clear slabs and automated imaging verification. CGC Pristine 10 gold labels command significant premium over standard Gem Mint.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 mb-4">
                  <div className="flex justify-between"><span>CGC Pristine 10:</span> <strong className="text-slate-900">4.0x – 6.5x raw</strong></div>
                  <div className="flex justify-between"><span>CGC Gem Mint 10:</span> <strong className="text-slate-900">2.5x – 3.8x raw</strong></div>
                </div>
                <Link to="/tools/psa-grade-calculator" className="text-xs font-bold text-[#DC143C] hover:underline flex items-center gap-1">
                  CGC Registry Tools &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 5. GLOSSARY */}
        {currentSection === 'glossary' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={glossarySearchQuery}
                onChange={e => setGlossarySearchQuery(e.target.value)}
                placeholder="Search Pokémon TCG terminology (e.g. ACE SPEC, SIR, Masterball, Regulation Marks)..."
                className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGlossary.map(term => (
                <div key={term.slug} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-bold text-slate-900">{term.term}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{term.definition}</p>
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg mb-3">
                      <strong>Examples:</strong> {term.example}
                    </div>
                  </div>
                  {term.relatedUrl && (
                    <a href={term.relatedUrl} className="text-xs font-bold text-[#DC143C] hover:underline inline-flex items-center gap-1 pt-2 border-t border-slate-100">
                      {term.relatedUrlLabel} &rarr;
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12">
          <PtcPartnerBanner />
        </div>

        <div className="mt-8">
          <PublicInterlinkMesh />
        </div>
      </main>

      <LandingFooter />
    </div>
  );
};
