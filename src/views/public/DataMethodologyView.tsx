import React from 'react';
import {
  Database,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Coins,
  FileSpreadsheet,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { CATALOG_STATS } from '../../data/catalogStatsCanon';
import { CANONICAL_FORMATS } from '../../data/formatLegalityCanon';

export const DataMethodologyView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A] selection:bg-[#DC143C] selection:text-white">
      <PageHead
        title="Data & Valuation Methodology: How DECK / divider Tracks Pokémon Card Prices & Legality"
        description="Comprehensive technical disclosure on how DECK / divider indexes 18,400+ cards, calculates daily TCGplayer & eBay market values, applies condition spreads, and enforces 2026 Play! Pokémon tournament legality."
        canonicalPath="/data-methodology"
        keywords={[
          'pokemon card pricing methodology',
          'deck divider data sources',
          'how tcgplayer prices work',
          'pokemon card condition multipliers',
          'pokemon tournament legality rules 2026',
          'slab tracking accuracy'
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <GeoBreadcrumbs
            items={[
              { label: 'Documentation', path: '/how-it-works' },
              { label: 'Data Methodology', path: '/data-methodology' },
            ]}
          />

          {/* Section Header */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-[11px] font-mono font-bold uppercase tracking-wider">
              <Database className="w-3.5 h-3.5" />
              <span>Technical Standards &amp; Provenance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight font-heading">
              Data &amp; Pricing Methodology
            </h1>
            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed">
              We believe collector applications must be held to high evidentiary standards. Here is the full disclosure of where our card data, market valuations, condition multipliers, and tournament rules come from.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
              <div className="text-xs font-mono text-[#64748B]">Catalogued Sets</div>
              <div className="text-2xl font-bold font-heading text-[#0F172A]">{CATALOG_STATS.totalSetsAndProducts}</div>
              <div className="text-[11px] font-mono text-[#DC143C]">148+ Mainline Master Sets</div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
              <div className="text-xs font-mono text-[#64748B]">Total Card Records</div>
              <div className="text-2xl font-bold font-heading text-[#0F172A]">{CATALOG_STATS.totalCardsIndexed}</div>
              <div className="text-[11px] font-mono text-[#16A34A]">Base Set to Present</div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
              <div className="text-xs font-mono text-[#64748B]">Price Update Cadence</div>
              <div className="text-2xl font-bold font-heading text-[#0F172A]">24 Hours</div>
              <div className="text-[11px] font-mono text-indigo-600">Daily Sync Cycle</div>
            </div>

            <div className="bg-white border border-[#E2E8F0] p-4 sm:p-5 rounded-2xl shadow-xs space-y-1">
              <div className="text-xs font-mono text-[#64748B]">Portfolio NAV Recalc</div>
              <div className="text-2xl font-bold font-heading text-[#0F172A]">Instant</div>
              <div className="text-[11px] font-mono text-amber-600">In-Browser Calculation</div>
            </div>
          </div>

          {/* Section 1: Card Database Pipeline */}
          <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <div className="p-2.5 rounded-xl bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
                  1. Card Cataloging &amp; Expansion Coverage
                </h2>
                <p className="text-xs font-mono text-[#64748B]">Ingestion pipelines, numbering schemas, and variant resolution</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <p>
                DECK / divider catalogs <strong>{CATALOG_STATS.totalSetsAndProducts} sets and series</strong>, comprising <strong>148 mainline master expansions</strong> (from 1999 Base Set through modern Scarlet &amp; Violet series) and <strong>70 promotional and subset releases</strong> (including Black Star Promos, McDonald's Collections, Trainer Kits, and special commemorative series).
              </p>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-3 font-mono text-xs">
                <div className="font-bold text-[#0F172A]">Card Normalization Protocol:</div>
                <ul className="space-y-2 text-[#64748B]">
                  <li>• <strong>Unique Card Identifiers:</strong> Every card record is indexed with a deterministic compound key (Set ID + Card Collector Number + Variant Stamp).</li>
                  <li>• <strong>Reverse Holo &amp; Parallel Finishes:</strong> Separate checklist states are maintained for Regular, Reverse Holofoil, Pokéball Holo, and Masterball Holofoil cards to prevent accidental completion overcounting.</li>
                  <li>• <strong>Rarity Classification:</strong> Standardized according to official manufacturer classifications: Common, Uncommon, Rare, Double Rare (RR), Ultra Rare, Special Illustration Rare (SIR), and Hyper Rare (Gold).</li>
                  <li>• <strong>Card Imagery:</strong> High-resolution front card photography cached locally via progressive prewarming to minimize bandwidth consumption.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Market Pricing Engine */}
          <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
                  2. Pricing Engine &amp; Market Valuation Methodology
                </h2>
                <p className="text-xs font-mono text-[#64748B]">TCGplayer sales comps, condition mapping, and statistical outlier pruning</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <p>
                To provide honest, defensible portfolio tracking, DECK / divider relies on verified market transaction data rather than speculative asking prices.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                  <div className="font-bold text-[#0F172A] text-xs font-mono uppercase text-emerald-700">Daily Price Feeds</div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Card values are synchronized every 24 hours from verified marketplace transaction feeds (TCGplayer Market Price and Lowest Verified Seller comps). Outlier spikes (e.g. artificial single-transaction buyouts) are filtered using 7-day interquartile range (IQR) trimming.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                  <div className="font-bold text-[#0F172A] text-xs font-mono uppercase text-indigo-700">Instant Portfolio NAV Recalculation</div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    While market price feeds update daily, your collection's Net Asset Value (NAV) recalculates <strong>instantly in-browser</strong> whenever you add cards, change conditions, log slabs, or toggle among 15+ live fiat currencies.
                  </p>
                </div>
              </div>

              <h3 className="font-bold text-base text-[#0F172A] pt-2">Raw Condition Multipliers</h3>
              <p className="text-xs text-[#64748B]">
                When collectors log raw cards in non-Near Mint conditions, DECK / divider applies industry standard condition depreciation formulas based on historical trading spreads:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[#64748B]">
                      <th className="py-2.5 px-3">Condition Code</th>
                      <th className="py-2.5 px-3">Standard Definition</th>
                      <th className="py-2.5 px-3">Value Baseline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">Near Mint (NM)</td>
                      <td className="py-2.5 px-3">Minimal to no wear, sharp corners, pristine surface</td>
                      <td className="py-2.5 px-3 font-bold">100% of Market Value</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-blue-700">Lightly Played (LP)</td>
                      <td className="py-2.5 px-3">Minor edge whitening or light handling marks</td>
                      <td className="py-2.5 px-3 font-bold">85% of Market Value</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-amber-700">Moderately Played (MP)</td>
                      <td className="py-2.5 px-3">Noticeable edge wear, scuffing, or light creasing</td>
                      <td className="py-2.5 px-3 font-bold">70% of Market Value</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-orange-700">Heavily Played (HP)</td>
                      <td className="py-2.5 px-3">Major whitening, corner damage, or surface creasing</td>
                      <td className="py-2.5 px-3 font-bold">50% of Market Value</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-red-700">Damaged (DMG)</td>
                      <td className="py-2.5 px-3">Severe bends, tears, liquid exposure, or ink marks</td>
                      <td className="py-2.5 px-3 font-bold">30% of Market Value</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: Graded Slabs & Cert Verification Distinction */}
          <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
                  3. Graded Slabs: Logging vs. Live Verification
                </h2>
                <p className="text-xs font-mono text-[#64748B]">Clear technical distinction across certification tracking tiers</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <p>
                We maintain strict transparency about what “cert tracking” means across DECK / divider:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-2">
                  <div className="font-bold text-[#0F172A] text-sm">Certificate Logging &amp; Format Validation</div>
                  <div className="text-[11px] font-mono text-[#DC143C]">All Tiers (Starter through Collection)</div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Users can log PSA, BGS, CGC, and ACE certificate numbers, grades, acquisition cost basis, and subgrades. The system validates certificate number syntax and barcode formats to protect against typo errors.
                  </p>
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-2">
                  <div className="font-bold text-[#0F172A] text-sm">Live Auction Market Comps</div>
                  <div className="text-[11px] font-mono text-emerald-700">Bunch, Stack, Deck &amp; Collection Tiers</div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    Queries completed eBay sold auctions and PWCC comps matching the exact grading company, grade (e.g. PSA 10, BGS 9.5), and cert specs to display recent realized sales prices.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Tournament Legality Engine */}
          <section className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-3 border-b border-[#F1F5F9] pb-4">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] font-heading">
                  4. 2026 Tournament Legality Engine
                </h2>
                <p className="text-xs font-mono text-[#64748B]">Official Play! Pokémon rotation rules, regulation marks, and errata</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#334155] leading-relaxed">
              <p>
                Our deckbuilder validates format rules against published Play! Pokémon tournament bulletins:
              </p>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 space-y-3 font-mono text-xs">
                <div className="font-bold text-[#0F172A]">Current 2026 Standard Rotation Rules:</div>
                <ul className="space-y-2 text-[#64748B]">
                  <li>• <strong>Active Regulation Marks:</strong> All cards with mark <strong>H, I, or J</strong> are legal for Play! Pokémon tournament play.</li>
                  <li>• <strong>Rotated Regulation Mark G:</strong> Officially rotated out on March 26, 2026 for Pokémon TCG Live, and April 10, 2026 for in-person Play! Pokémon events.</li>
                  <li>• <strong>Reprint Exception Rule:</strong> Cards with older regulation marks or vintage prints are legal IF and only if the exact card title and mechanic text has been reprinted in an active H/I/J expansion (e.g. Switch, Rare Candy, Ultra Ball, Boss\'s Orders).</li>
                  <li>• <strong>Rulebox Restrictions:</strong> Maximum 1 Radiant Pokémon and 1 ACE SPEC card per 60-card tournament deck.</li>
                </ul>
              </div>
            </div>
          </section>

          <PtcPartnerBanner />

          <GeoExtractableBlock
            heading="Where does DECK / divider get its Pokémon card pricing and legality data?"
            summary="DECK / divider sources pricing data from verified TCGplayer marketplace transactions and completed eBay auctions, synchronized daily with statistical IQR outlier pruning. Tournament legality is verified directly against official Play! Pokémon championship rotation bulletins (Standard 2026: Regulation Marks H, I & J legal; Mark G rotated)."
            keyFacts={[
              { label: 'Pricing Source', value: 'TCGplayer & eBay Sold Comps' },
              { label: 'Update Frequency', value: 'Daily 24-Hour Cycle' },
              { label: 'Catalog Size', value: '218 Sets / 18,400+ Cards' },
              { label: 'Standard 2026', value: 'Marks H, I, J Legal' },
            ]}
          />

          <PublicInterlinkMesh currentPath="/data-methodology" />
        </div>
      </main>

      <LandingFooter
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
