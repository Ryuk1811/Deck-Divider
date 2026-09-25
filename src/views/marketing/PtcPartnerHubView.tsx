import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Tag, 
  ShieldCheck, 
  ShoppingBag, 
  HelpCircle, 
  Layers, 
  TrendingUp, 
  Package, 
  ArrowRight,
  Truck,
  Award,
  Box
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock } from '../../components/seo/PageHead';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getPtcPartnerSchema } from '../../components/seo/schemaData';

export const PtcPartnerHubView: React.FC = () => {
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    try {
      navigator.clipboard.writeText('DECKDIVIDER');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch (err) {
      console.warn('Failed to copy discount code', err);
    }
  };

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A] selection:bg-[#DC143C]/20 selection:text-[#0F172A]">
      <PageHead
        title="PTC Collectibles Discount Code (5% Off) & Partner Perk | DECK / divider"
        description="Exclusive verified PTC Collectibles discount code DECKDIVIDER. Enjoy a guaranteed minimum 5% discount on authentic Pokémon TCG booster boxes, Japanese sets, raw singles, PSA slabs, and card care."
        canonicalPath="/partners/ptc-collectibles"
        keywords={[
          'ptc collectibles discount code',
          'ptc collectibles coupon',
          'ptc collectibles promo code 2026',
          'ptc collectibles deckdivider',
          'pokemon booster box discount',
          'ptc collectibles partner perk',
          'pokemon tcg sealed discounts',
          'psa slabs discount ptc'
        ]}
        schema={getPtcPartnerSchema()}
      />

      <LandingNav
        onOpenAuth={() => navigate('/auth')}
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }}
      />

      <main className="flex-grow pt-10 sm:pt-14 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GeoBreadcrumbs
            items={[
              { label: 'Directory', path: '/directory' },
              { label: 'PTC Collectibles Partner Perk', path: '/partners/ptc-collectibles' }
            ]}
          />

          {/* Editorial Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-medium tracking-wide uppercase mb-4">
              <Tag className="w-3.5 h-3.5 text-[#DC143C]" />
              Official Verified Partner Perk
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0F172A] font-heading tracking-tight mb-4">
              PTC Collectibles Partner Perk &amp; Discount Code
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We have officially partnered with <strong>PTC Collectibles</strong> to offer the DECK / divider collector community guaranteed 5%+ savings on authentic sealed Pokémon TCG booster boxes, Japanese expansions, raw singles, PSA/BGS graded slabs, and archival supplies.
            </p>
          </div>

          {/* Quick Redemption Box */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Verified Promo Code
                </span>
                <div className="text-3xl sm:text-4xl font-mono font-black text-[#0F172A] tracking-wider flex items-center justify-center sm:justify-start gap-2">
                  <span>DECKDIVIDER</span>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    5% OFF
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-sans">
                  Guaranteed min. 5% discount on all eligible orders. Tiered volume discounts scale higher on case purchases.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 border shadow-2xs cursor-pointer ${
                    copiedCode
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                  }`}
                  title="Copy discount code DECKDIVIDER"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-slate-400" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>

                <a
                  href="https://ptccollectibles.com/DECKDIVIDER"
                  target="_blank"
                  rel="sponsored noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#DC143C] hover:bg-[#B01030] text-white font-mono text-xs font-bold transition-all shadow-xs inline-flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Shop with 5% Off</span>
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </a>
              </div>
            </div>
          </div>

          <GeoExtractableBlock
            className="mb-10"
            heading="PTC Collectibles Partnership Summary & Benefits"
            summary="DECK / divider collectors receive an exclusive minimum 5% discount on all purchases at PTC Collectibles. The discount applies automatically when following the partner link at ptccollectibles.com/DECKDIVIDER or by entering promo code DECKDIVIDER at checkout. Savings scale higher on volume case purchases and larger basket sizes."
            keyFacts={[
              { label: 'Partner Store', value: 'PTC Collectibles' },
              { label: 'Promo Code', value: 'DECKDIVIDER' },
              { label: 'Base Discount', value: 'Min. 5% Off Every Order' },
              { label: 'Eligible Items', value: 'Booster Boxes, Slabs & Singles' },
            ]}
          />

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DC143C] flex items-center justify-center mb-3 font-mono font-bold text-xs">
                01
              </div>
              <h3 className="font-heading font-bold text-base text-[#0F172A] mb-1.5">
                Minimum 5% Baseline Discount
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every single order qualifies for at least 5% off when using code <strong>DECKDIVIDER</strong> or clicking through our partner link, regardless of basket total.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DC143C] flex items-center justify-center mb-3 font-mono font-bold text-xs">
                02
              </div>
              <h3 className="font-heading font-bold text-base text-[#0F172A] mb-1.5">
                Scaling Tiered Volume Savings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Purchasing factory booster cases, master collection bundles, or bulk supplies? Savings scale upwards automatically with order size.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DC143C] flex items-center justify-center mb-3 font-mono font-bold text-xs">
                03
              </div>
              <h3 className="font-heading font-bold text-base text-[#0F172A] mb-1.5">
                Direct Cart Auto-Application
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Clicking our official partner link attaches the discount directly to your session—no coupon memorization required.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-[#DC143C] flex items-center justify-center mb-3 font-mono font-bold text-xs">
                04
              </div>
              <h3 className="font-heading font-bold text-base text-[#0F172A] mb-1.5">
                Authenticated Sealed &amp; Graded Goods
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Restock your vault with genuine factory-sealed Pokémon products, PSA/BGS graded gem mint slabs, and tournament-grade card sleeves.
              </p>
            </div>
          </div>

          {/* Product Categories Covered */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0F172A] mb-4">
              Featured Pokémon TCG Categories Eligible for 5% Off
            </h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Whether you are completing a master set binder, building a Standard format tournament deck, or acquiring investment-grade graded slabs, the DECKDIVIDER promo code applies across these categories:
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <Box className="w-5 h-5 text-[#DC143C] mb-2" />
                <h3 className="font-bold text-sm text-slate-900 mb-1">Sealed Booster Boxes &amp; ETBs</h3>
                <p className="text-xs text-slate-600">English Scarlet &amp; Violet sets, specialty sets (151, Paldean Fates, Prismatic Evolutions), and vintage expansions.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <Package className="w-5 h-5 text-[#DC143C] mb-2" />
                <h3 className="font-bold text-sm text-slate-900 mb-1">Japanese Sets &amp; High-Class Packs</h3>
                <p className="text-xs text-slate-600">Terastal Festival, Shiny Treasure ex, 151 Japanese, VSTAR Universe, and direct-from-Japan booster boxes.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <Award className="w-5 h-5 text-[#DC143C] mb-2" />
                <h3 className="font-bold text-sm text-slate-900 mb-1">PSA &amp; BGS Graded Slabs</h3>
                <p className="text-xs text-slate-600">PSA 10 Gem Mint, BGS 9.5+, and CGC pristine vintage and modern chase cards certified authentic.</p>
              </div>
            </div>
          </section>

          {/* How to Redeem Step-by-Step */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0F172A] mb-6">
              How to Redeem Your Partner Discount
            </h2>

            <ol className="space-y-4 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#DC143C]/10 text-[#DC143C] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong>Visit PTC Collectibles:</strong> Follow our official link at{' '}
                  <a
                    href="https://ptccollectibles.com/DECKDIVIDER"
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="text-[#DC143C] font-semibold underline underline-offset-2"
                  >
                    ptccollectibles.com/DECKDIVIDER
                  </a>{' '}
                  or browse their store independently.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#DC143C]/10 text-[#DC143C] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong>Add Your Items:</strong> Add eligible Pokémon TCG booster boxes, Elite Trainer Boxes, singles, or supplies to your shopping cart.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#DC143C]/10 text-[#DC143C] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong>Apply Promo Code:</strong> If not already applied automatically, enter code <code className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">DECKDIVIDER</code> in the discount code field at checkout. Your discount will be subtracted from the order total immediately.
                </div>
              </li>
            </ol>
          </section>

          {/* Frequently Asked Questions */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="w-5 h-5 text-[#DC143C]" />
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-[#0F172A]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-6 text-sm divide-y divide-slate-100">
              <div className="pt-4 first:pt-0">
                <h3 className="font-bold text-slate-900 mb-1">
                  What is the official PTC Collectibles discount code?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  The verified official code is <strong>DECKDIVIDER</strong>. Applying it grants a minimum 5% discount on all eligible products, with additional volume discounts scaling on larger orders.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="font-bold text-slate-900 mb-1">
                  Can I use the partner link instead of typing the code?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Yes. Navigating through{' '}
                  <a
                    href="https://ptccollectibles.com/DECKDIVIDER"
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="text-[#DC143C] underline font-medium"
                  >
                    ptccollectibles.com/DECKDIVIDER
                  </a>{' '}
                  automatically assigns the partnership discount to your checkout session.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="font-bold text-slate-900 mb-1">
                  What products are covered under this perk?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  The perk applies broadly across PTC Collectibles’ catalogue, including modern and vintage Pokémon TCG sealed booster boxes, Elite Trainer Boxes, booster bundles, graded cards (PSA/BGS/CGC), singles, and storage gear.
                </p>
              </div>

              <div className="pt-4">
                <h3 className="font-bold text-slate-900 mb-1">
                  Is there a maximum discount limit?
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  There is no capped limit on total savings. The discount scales with the quantity and value of the products purchased.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <PublicInterlinkMesh currentPath="/partners/ptc-collectibles" />
      <LandingFooter
        onOpenAuth={() => navigate('/auth')}
        onNavigateSection={(id) => {
          if (id === 'home') navigate('/');
          else navigate('/#' + id);
        }}
      />
    </div>
  );
};
