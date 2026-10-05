import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Calendar, 
  Tag, 
  ArrowRight, 
  CheckCircle2, 
  Calculator, 
  Search, 
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Database,
  RefreshCw,
  FileCode2,
  Terminal,
  Activity
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { DisplayCurrency } from '../../types';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { ALL_RELEASES, ReleaseEntry } from '../../data/changelogHistory';

interface ChangelogPageViewProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateAbout?: () => void;
  displayCurrency?: DisplayCurrency;
}

export const ChangelogPageView: React.FC<ChangelogPageViewProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateAbout,
  displayCurrency = 'USD',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const tags = ['All', 'Major', 'Catalog', 'Tools', 'SEO', 'Tournament', 'Performance', 'Security'];

  const filteredReleases = useMemo(() => {
    return ALL_RELEASES.filter((rel) => {
      const matchesTag = selectedTag === 'All' || rel.tag === selectedTag;
      if (!matchesTag) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inTitle = rel.title.toLowerCase().includes(q);
      const inVersion = rel.version.toLowerCase().includes(q);
      const inSummary = rel.summary.toLowerCase().includes(q);
      const inIteration = `iteration ${rel.iteration}`.includes(q) || `${rel.iteration}` === q;
      const inHighlights = rel.highlights.some(h => 
        h.category.toLowerCase().includes(q) || 
        h.items.some(item => item.toLowerCase().includes(q))
      );

      return inTitle || inVersion || inSummary || inIteration || inHighlights;
    });
  }, [searchQuery, selectedTag]);

  // JSON-LD Schema for SoftwareApplication + ItemList of Releases
  const changelogSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'DECK / divider',
    'operatingSystem': 'Web, iOS, Android',
    'applicationCategory': 'UtilitiesApplication',
    'softwareVersion': '1.59',
    'releaseNotes': 'https://deckdivider.app/changelog',
    'description': 'Continuous release log and iteration history of DECK / divider from v1.01 to the landmark 59th release v1.59.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title="Changelog & Platform Iterations (v1.01 – v1.59) — DECK / divider"
        description="Comprehensive changelog tracking all 59 product iterations of DECK / divider. Explore feature releases from v1.01 Genesis to v1.59 Universal Canonical SEO Metadata & Dynamic Provisioning."
        canonicalPath="/changelog"
        keywords={[
          'pokemon card changelog',
          'deck divider release notes',
          'tcg platform updates',
          'iteration 59',
          'v1.59 release',
          'pokemon card catalogue updates',
          'ptcgl export updates'
        ]}
        schema={changelogSchema}
      />

      <LandingNav onOpenAuth={onOpenAuth} />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <GeoBreadcrumbs
            items={[
              { label: 'Home', path: '/' },
              { label: 'Changelog (59 Iterations)', path: '/changelog' }
            ]}
          />

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mt-6 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-xs mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Current Release: Version 1.59 (59th Iteration)</span>
              <span className="text-emerald-300">•</span>
              <span className="font-mono text-emerald-600">All 59 Versions Archived</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Platform Engineering & Iteration Log
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Every single deployment, architectural enhancement, card engine upgrade, and rule validation improvement from <span className="font-semibold text-slate-900">v1.01 Genesis</span> to the <span className="font-semibold text-emerald-600">59th Iteration (v1.59)</span>.
            </p>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-left">
              <div className="p-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Total Iterations</span>
                <span className="text-2xl font-black text-slate-900 font-mono">59</span>
              </div>
              <div className="p-2 border-l border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Active Release</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">v1.59</span>
              </div>
              <div className="p-2 border-l border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Public Page Web</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">100% Crawlable</span>
              </div>
              <div className="p-2 border-l border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Sitemap Priority</span>
                <span className="text-2xl font-black text-indigo-600 font-mono">1.0 Max</span>
              </div>
            </div>
          </div>

          {/* PTC Collectibles Partner Perk */}
          <div className="mb-6">
            <PtcPartnerBanner />
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs mb-10 sticky top-20 z-20 backdrop-blur-md bg-white/95">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search 58 releases, features, cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Tag Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedTag === tag
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {tag} {tag === 'All' ? `(${ALL_RELEASES.length})` : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count indicator */}
            {(searchQuery || selectedTag !== 'All') && (
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Showing {filteredReleases.length} of {ALL_RELEASES.length} releases</span>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          {/* Timeline of 58 Releases */}
          <div className="relative border-l-2 border-slate-200/80 ml-3 sm:ml-6 space-y-10">
            {filteredReleases.length === 0 ? (
              <div className="pl-6 py-12 text-center bg-white rounded-2xl border border-slate-200/80">
                <Search className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-semibold text-slate-800 text-base">No matching release iterations found</h3>
                <p className="text-xs text-slate-500 mt-1">Try refining your search keyword or clearing the tag filter.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
                  className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100"
                >
                  View All 58 Iterations
                </button>
              </div>
            ) : (
              filteredReleases.map((rel) => {
                const isLatest = rel.iteration === 58;
                return (
                  <div
                    key={rel.version}
                    id={rel.version}
                    className="relative pl-6 sm:pl-10 group"
                  >
                    {/* Timeline Node Icon */}
                    <div className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isLatest
                        ? 'bg-blue-600 border-white shadow-md text-white ring-4 ring-blue-100'
                        : 'bg-white border-slate-300 text-slate-500 group-hover:border-blue-400 group-hover:text-blue-600'
                    }`}>
                      {isLatest ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-bold font-mono">{rel.iteration}</span>
                      )}
                    </div>

                    {/* Release Card */}
                    <div className={`rounded-2xl border transition-all ${
                      isLatest 
                        ? 'bg-white border-blue-200/80 shadow-md ring-1 ring-blue-500/10' 
                        : 'bg-white/90 border-slate-200/80 hover:border-slate-300 shadow-xs'
                    } p-6 sm:p-7`}>
                      {/* Header Row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-mono ${rel.badgeColor}`}>
                            {rel.version}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            Iteration #{rel.iteration}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {rel.date}
                          </span>
                        </div>

                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                          {rel.tag}
                        </span>
                      </div>

                      {/* Title & Summary */}
                      <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight mb-2">
                        {rel.title}
                      </h2>
                      <p className="text-sm text-slate-600 leading-relaxed mb-6">
                        {rel.summary}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        {rel.highlights.map((highlight, hIdx) => (
                          <div key={hIdx}>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              {highlight.category}
                            </h3>
                            <ul className="space-y-1.5 pl-3.5">
                              {highlight.items.map((item, iIdx) => (
                                <li key={iIdx} className="text-xs sm:text-sm text-slate-600 flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-1" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Related Links if any */}
                      {rel.relatedUrls && rel.relatedUrls.length > 0 && (
                        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-medium text-slate-400">Jump to feature:</span>
                          {rel.relatedUrls.map((link, lIdx) => (
                            <Link
                              key={lIdx}
                              to={link.url}
                              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/70 px-2 py-1 rounded-md transition-colors"
                            >
                              <span>{link.label}</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      {/* Universal Page Web Interlinking Section */}
      <PublicInterlinkMesh currentPath="/changelog" />

      <LandingFooter />
    </div>
  );
};
