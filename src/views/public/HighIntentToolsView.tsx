import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calculator, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  DollarSign, 
  Layers, 
  Sparkles, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Percent,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { PageHead, GeoBreadcrumbs, GeoExtractableBlock, updatePageSeo } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { getPsaCalculatorSchema, getDeckLegalityCheckerSchema } from '../../components/seo/schemaData';

export const HighIntentToolsView: React.FC = () => {
  const { toolId } = useParams<{ toolId?: string }>();
  const navigate = useNavigate();

  const currentTool = toolId || 'psa-grade-calculator';

  useEffect(() => {
    if (currentTool === 'deck-legality-checker') {
      updatePageSeo({
        title: 'Pokémon TCG Regulation Mark & Standard Legality Checker | DECK / divider',
        description: 'Verify Pokémon TCG regulation marks (H, I, J) and tournament legality across Standard, Expanded, and GLC formats with official deck construction rules.',
        canonicalPath: '/tools/deck-legality-checker',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Pokémon TCG Regulation Mark & Legality Checker',
          description: 'Tournament legality inspector for Pokémon TCG regulation marks and competitive formats.',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'All',
          url: 'https://deckdivider.app/tools/deck-legality-checker',
          image: 'https://deckdivider.app/og-image.png?v=2',
          brand: {
            '@type': 'Brand',
            name: 'DECK / divider'
          },
          sku: 'DD-LEGALITY-CHECKER',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://deckdivider.app/tools/deck-legality-checker',
            priceValidUntil: '2027-12-31',
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0.00',
                currency: 'USD'
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'US'
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 0,
                  unitCode: 'DAY'
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 0,
                  unitCode: 'DAY'
                }
              }
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
            }
          },
        },
      });
    } else {
      updatePageSeo({
        title: 'Pokémon Card Grading ROI & Value Calculator (PSA/BGS/CGC) | DECK / divider',
        description: 'Calculate expected value (EV), grading fees, and net profit before submitting cards to PSA, BGS, or CGC. Live grade multipliers and probability simulator.',
        canonicalPath: '/tools/psa-grade-calculator',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Pokémon Card Grading ROI & Value Calculator',
          description: 'Calculates expected return and grading profitability for PSA, BGS, and CGC submissions.',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'All',
          url: 'https://deckdivider.app/tools/psa-grade-calculator',
          image: 'https://deckdivider.app/og-image.png?v=2',
          brand: {
            '@type': 'Brand',
            name: 'DECK / divider'
          },
          sku: 'DD-PSA-CALC',
          offers: {
            '@type': 'Offer',
            price: '0.00',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: 'https://deckdivider.app/tools/psa-grade-calculator',
            priceValidUntil: '2027-12-31',
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: {
                '@type': 'MonetaryAmount',
                value: '0.00',
                currency: 'USD'
              },
              shippingDestination: {
                '@type': 'DefinedRegion',
                addressCountry: 'US'
              },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 0,
                  unitCode: 'DAY'
                },
                transitTime: {
                  '@type': 'QuantitativeValue',
                  minValue: 0,
                  maxValue: 0,
                  unitCode: 'DAY'
                }
              }
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'US',
              returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted'
            }
          },
        },
      });
    }
  }, [currentTool]);

  // Calculator State
  const [rawPrice, setRawPrice] = useState<number>(45);
  const [gradingFee, setGradingFee] = useState<number>(25);
  const [shippingCost, setShippingCost] = useState<number>(10);
  const [psa10Prob, setPsa10Prob] = useState<number>(40);
  const [psa9Prob, setPsa9Prob] = useState<number>(50);
  const [psa10Value, setPsa10Value] = useState<number>(190);
  const [psa9Value, setPsa9Value] = useState<number>(55);
  const [psa8Value, setPsa8Value] = useState<number>(35);

  // Deck Legality State
  const [selectedMark, setSelectedMark] = useState<string>('H');
  const [cardSearchQuery, setCardSearchQuery] = useState<string>('');

  // Calculations
  const totalCost = rawPrice + gradingFee + shippingCost;
  const psa8Prob = Math.max(0, 100 - psa10Prob - psa9Prob);
  const expectedValue = 
    (psa10Value * (psa10Prob / 100)) + 
    (psa9Value * (psa9Prob / 100)) + 
    (psa8Value * (psa8Prob / 100));
  const netProfit = expectedValue - totalCost;
  const roiPercentage = totalCost > 0 ? (netProfit / totalCost) * 100 : 0;
  const isWorthIt = netProfit > 15;

  const isDeckChecker = currentTool === 'deck-legality-checker';

  return (
    <div className="min-h-screen bg-dot-grid flex flex-col font-sans text-[#0F172A]">
      <PageHead
        title={
          isDeckChecker
            ? 'Pokémon TCG Deck Builder & Standard Legality Checker | DECK / divider'
            : 'Pokémon Card PSA Grade ROI & Value Calculator | DECK / divider'
        }
        description={
          isDeckChecker
            ? 'Check Pokémon card regulation marks (H, I, J) and tournament legality across Standard, Expanded, and GLC formats with live rule validation.'
            : 'Calculate net ROI, grading costs, and expected value (EV) before submitting cards to PSA, BGS, or CGC. Includes Gem Mint probability simulator.'
        }
        canonicalPath={isDeckChecker ? '/tools/deck-legality-checker' : '/tools/psa-grade-calculator'}
        keywords={
          isDeckChecker
            ? [
                'pokemon deck legality checker',
                'pokemon regulation mark checker',
                'pokemon standard legal cards 2026',
                'regulation mark h i j',
                'ptcgl deck builder validator'
              ]
            : [
                'pokemon card grading calculator',
                'psa 10 profit calculator',
                'is it worth grading pokemon cards',
                'pokemon grading roi calculator',
                'psa bgs cgc grading costs'
              ]
        }
        schema={isDeckChecker ? getDeckLegalityCheckerSchema() : getPsaCalculatorSchema()}
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
              { label: 'Tools & Calculators', path: '/tools/psa-grade-calculator' },
              { 
                label: isDeckChecker ? 'Regulation Mark Checker' : 'PSA Grade ROI Calculator', 
                path: isDeckChecker ? '/tools/deck-legality-checker' : '/tools/psa-grade-calculator' 
              }
            ]} 
          />

          {/* Navigation Pill Switcher */}
          <div className="flex flex-wrap gap-2 mb-6 bg-white border border-[#E2E8F0] p-1.5 rounded-2xl shadow-xs inline-flex">
            <Link
              to="/tools/psa-grade-calculator"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                currentTool === 'psa-grade-calculator'
                  ? 'bg-[#DC143C] text-white shadow-2xs'
                  : 'bg-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              PSA / BGS Grade ROI Calculator
            </Link>
            <Link
              to="/tools/deck-legality-checker"
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                currentTool === 'deck-legality-checker'
                  ? 'bg-[#DC143C] text-white shadow-2xs'
                  : 'bg-transparent text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Regulation Mark &amp; Legality Checker
            </Link>
          </div>

          {/* PTC Collectibles Partner Offer */}
          <div className="mb-8">
            <PtcPartnerBanner />
          </div>

          <GeoExtractableBlock
            className="mb-8"
            heading={
              isDeckChecker
                ? 'Standard Format Rotation 2026: Regulation Marks H, I & J Legal'
                : 'Formula: When Is It Mathematically Profitable to Grade Pokémon Cards?'
            }
            summary={
              isDeckChecker
                ? 'Based on published 2026 Play! Pokémon tournament rules, Standard format legal cards must display Regulation Mark H, I, or J (found in the lower-left corner). Regulation Mark G rotated out on Pokémon TCG Live on March 26, 2026, and for in-person Play! Pokémon events on April 10, 2026. Cards printed with Mark G or older are prohibited unless reprinted in an active H/I/J set with the exact same card title and mechanic text.'
                : 'Submitting a raw Pokémon card to PSA or CGC is profitable only when Expected Value (EV) exceeds the total cost (Raw Card Purchase Price + Grading Tier Fee + Roundtrip Shipping/Insurance). Standard modern raw cards have a 35% to 55% PSA 10 gem mint rate based on population reports.'
            }
            keyFacts={
              isDeckChecker
                ? [
                    { label: 'Active Marks', value: 'Marks H, I & J' },
                    { label: 'Rotated', value: 'Mark G & Older' },
                    { label: 'Banned Cards', value: 'Zero in Standard' },
                    { label: 'Deck Limit', value: 'Strictly 60 Cards' },
                  ]
                : [
                    { label: 'PSA 10 Rate', value: '35% - 55% Avg' },
                    { label: 'Value Tier', value: '$15 - $25 / Card' },
                    { label: 'Break-Even EV', value: 'Net Profit > $15' },
                    { label: 'Major Slabs', value: 'PSA, BGS, CGC' },
                  ]
            }
          />

          {/* TOOL 1: PSA Grade ROI Calculator */}
          {currentTool === 'psa-grade-calculator' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] font-heading mb-3 tracking-tight">
                  Pokémon Card Grading ROI &amp; Value Calculator (2026)
                </h1>
                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  Evaluate whether submitting your raw card to PSA, BGS, or CGC is mathematically profitable based on expected grade probabilities, submission tiers, and historical sales spreads.
                </p>
              </div>

              {/* Direct Answer Box for AI Overviews & Snippets */}
              <div className="bg-white border-l-4 border-[#DC143C] border-y border-r border-[#E2E8F0] rounded-2xl p-6 sm:p-7 mb-8 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#DC143C] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Is Grading Pokémon Cards Worth It?
                  </div>
                  <span className="text-[11px] font-mono text-[#16A34A] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#86EFAC]">
                    Source: PSA APR &amp; TCGplayer Market Comps
                  </span>
                </div>
                <p className="text-[#0F172A] text-sm sm:text-base leading-relaxed font-medium">
                  Grading a Pokémon card is financially worth it when the <strong className="text-[#DC143C]">expected value (EV) exceeds the raw card market price plus grading and shipping fees by at least 25%</strong>. If a card only achieves break-even at a gem mint PSA 10 while dropping below submission cost at PSA 9, keeping the card raw or selling in near-mint condition is mathematically the safer financial decision.
                </p>
              </div>

              {/* Interactive Calculator Matrix */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] font-heading mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#DC143C]" />
                  Grading Cost &amp; Expected Value Simulator
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#64748B] mb-1 uppercase">
                        Raw Card Near-Mint Market Price ($)
                      </label>
                      <input
                        type="number"
                        value={rawPrice}
                        onChange={(e) => setRawPrice(Number(e.target.value))}
                        className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-mono text-sm focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-[#64748B] mb-1 uppercase">
                          Grading Fee ($)
                        </label>
                        <select
                          value={gradingFee}
                          onChange={(e) => setGradingFee(Number(e.target.value))}
                          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-mono text-xs focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                        >
                          <option value={15}>PSA Value Tier ($15)</option>
                          <option value={25}>PSA Regular / Bulk ($25)</option>
                          <option value={40}>PSA Express ($40)</option>
                          <option value={75}>PSA Super Express ($75)</option>
                          <option value={20}>CGC Standard ($20)</option>
                          <option value={22}>BGS Regular ($22)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-semibold text-[#64748B] mb-1 uppercase">
                          Shipping &amp; Ins. ($)
                        </label>
                        <input
                          type="number"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(Number(e.target.value))}
                          className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3 py-2 text-[#0F172A] font-mono text-sm focus:outline-none focus:border-[#DC143C] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E2E8F0]">
                      <div className="text-xs font-mono text-[#0F172A] mb-3 uppercase font-bold">Grade Market Values &amp; Odds</div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-600 w-16">PSA 10:</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={psa10Value}
                            onChange={(e) => setPsa10Value(Number(e.target.value))}
                            className="w-24 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-mono focus:border-[#DC143C] focus:bg-white"
                          />
                          <span className="text-xs text-[#64748B]">$</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={psa10Prob}
                            onChange={(e) => setPsa10Prob(Number(e.target.value))}
                            className="flex-1 accent-[#DC143C]"
                          />
                          <span className="text-xs font-mono font-bold text-[#DC143C] w-10 text-right">{psa10Prob}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#475569] w-16">PSA 9:</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={psa9Value}
                            onChange={(e) => setPsa9Value(Number(e.target.value))}
                            className="w-24 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-mono focus:border-[#DC143C] focus:bg-white"
                          />
                          <span className="text-xs text-[#64748B]">$</span>
                          <input
                            type="range"
                            min="0"
                            max={100 - psa10Prob}
                            value={psa9Prob}
                            onChange={(e) => setPsa9Prob(Number(e.target.value))}
                            className="flex-1 accent-[#DC143C]"
                          />
                          <span className="text-xs font-mono font-bold text-[#DC143C] w-10 text-right">{psa9Prob}%</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <span className="font-bold text-[#64748B] w-16">PSA 8/Lower:</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={psa8Value}
                            onChange={(e) => setPsa8Value(Number(e.target.value))}
                            className="w-24 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg px-2 py-1 text-xs text-[#0F172A] font-mono focus:border-[#DC143C] focus:bg-white"
                          />
                          <span className="text-xs text-[#64748B]">$</span>
                          <div className="flex-1 text-right font-mono text-[#64748B]">
                            {psa8Prob}% Remaining
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Results & Verdict */}
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#64748B] uppercase mb-4">Financial Projections</div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#64748B]">Total Cost Basis:</span>
                          <span className="font-mono text-[#0F172A] font-bold">${totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#64748B]">Expected Value (EV):</span>
                          <span className="font-mono text-[#2563EB] font-bold">${expectedValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-base border-t border-[#E2E8F0] pt-3">
                          <span className="text-[#0F172A] font-semibold">Net Profit / Loss:</span>
                          <span className={`font-mono font-black text-xl ${netProfit >= 0 ? 'text-[#16A34A]' : 'text-[#DC143C]'}`}>
                            {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)} ({roiPercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      {/* Decision Banner */}
                      <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
                        isWorthIt 
                          ? 'bg-[#F0FDF4] border-[#86EFAC] text-[#166534]' 
                          : 'bg-[#FEF2F2] border-[#FECACA] text-[#991B1B]'
                      }`}>
                        {isWorthIt ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#16A34A]" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-[#DC143C]" />}
                        <div>
                          <div className="font-bold text-sm">
                            {isWorthIt ? 'Mathematically Favorable to Grade' : 'High Risk — Keep Raw or Sell Ungraded'}
                          </div>
                          <div className="text-xs mt-1 text-[#64748B] leading-relaxed">
                            {isWorthIt 
                              ? 'Your projected expected return comfortably covers grading submission fees and shipping buffer.' 
                              : 'The spread between raw price and grade 9 does not justify grading fees unless you are confident in a PSA 10.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
                      <button
                        onClick={() => navigate('/auth')}
                        className="w-full py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        Track Graded Slabs in DECK / divider Vault <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extraction Table: Average Price Multipliers */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
                <h3 className="text-lg font-bold text-[#0F172A] font-heading mb-2">
                  Average Pokémon Card Grade Multipliers (Historical Benchmark)
                </h3>
                <p className="text-xs text-[#64748B] mb-4">
                  Standard market multipliers comparing raw near-mint value to certified grades across modern expansions.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] text-[#64748B] font-mono bg-[#F8FAFC]">
                        <th className="py-2.5 px-3 rounded-l-lg">Grade Level</th>
                        <th className="py-2.5 px-3">Typical Multiplier vs. Raw NM</th>
                        <th className="py-2.5 px-3 rounded-r-lg">Grading Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-amber-600">PSA 10 / BGS 10 / CGC Pristine</td>
                        <td className="py-2.5 px-3 font-mono text-[#16A34A] font-bold">2.5x - 5.0x</td>
                        <td className="py-2.5 px-3 text-[#64748B]">Always submit if centering and edges are pristine</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#0F172A]">PSA 9 / BGS 9.5 / CGC 9.5</td>
                        <td className="py-2.5 px-3 font-mono text-[#0F172A] font-bold">1.0x - 1.3x</td>
                        <td className="py-2.5 px-3 text-[#64748B]">Often breaks even with grading fees on modern cards</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-[#64748B]">PSA 8 / BGS 8.5 / CGC 8.5</td>
                        <td className="py-2.5 px-3 font-mono text-[#DC143C] font-bold">0.7x - 0.9x</td>
                        <td className="py-2.5 px-3 text-[#64748B]">Net loss on modern cards; only worthwhile on vintage</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <span className="text-[#64748B]">Want to check live market prices of raw chase cards before grading?</span>
                  <Link
                    to="/sets"
                    className="inline-flex items-center gap-1.5 text-[#DC143C] hover:text-[#0F172A] transition-colors font-mono font-bold"
                  >
                    Browse All Expansions &amp; Cards <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: Regulation Mark & Legality Checker */}
          {currentTool === 'deck-legality-checker' && (
            <div>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] font-heading mb-3 tracking-tight">
                  Pokémon TCG Tournament Legality &amp; Rotation Checker (2026)
                </h1>
                <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
                  Verify the tournament legality of any card or regulation mark across the official Pokémon Standard, Expanded, and Gym Leader Challenge (GLC) formats.
                </p>
              </div>

              {/* Direct Answer Box for AI Overviews & Snippets */}
              <div className="bg-white border-l-4 border-[#16A34A] border-y border-r border-[#E2E8F0] rounded-2xl p-6 sm:p-7 mb-10 shadow-xs">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Legal Regulation Marks in Standard 2026
                </div>
                <p className="text-[#0F172A] text-sm sm:text-base leading-relaxed font-medium">
                  For the 2026 tournament cycle, cards with <strong className="text-[#0F172A]">regulation marks "H", "I", and "J"</strong> are fully legal in official Pokémon TCG Standard format tournaments. Cards bearing regulation mark "G" (along with "E" and "F") have officially rotated out (effective March 26, 2026 on Pokémon TCG Live and April 10, 2026 for Play! Pokémon in-person events), unless a card has received an identical text reprint in a legal expansion.
                </p>
              </div>

              {/* Interactive Regulation Mark Inspector */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 mb-10 shadow-xs">
                <h2 className="text-lg sm:text-xl font-bold text-[#0F172A] font-heading mb-4">
                  Select a Regulation Mark to Inspect Legality
                </h2>

                <div className="flex flex-wrap gap-3 mb-8">
                  {['E', 'F', 'G', 'H', 'I', 'J'].map((mark) => (
                    <button
                      key={mark}
                      onClick={() => setSelectedMark(mark)}
                      className={`w-14 h-14 rounded-2xl font-mono font-black text-2xl transition-all border ${
                        selectedMark === mark
                          ? 'bg-[#DC143C] text-white border-[#DC143C] shadow-md scale-105'
                          : 'bg-[#F8FAFC] text-[#64748B] border-[#CBD5E1] hover:text-[#0F172A] hover:border-[#94A3B8]'
                      }`}
                    >
                      {mark}
                    </button>
                  ))}
                </div>

                {/* Mark Details */}
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#E2E8F0]">
                    <div>
                      <div className="text-xs text-[#64748B] font-mono uppercase">REGULATION MARK</div>
                      <div className="text-2xl font-black text-[#0F172A]">Mark "{selectedMark}"</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                      ['H', 'I', 'J'].includes(selectedMark)
                        ? 'bg-[#F0FDF4] text-[#16A34A] border-[#86EFAC]'
                        : 'bg-[#FEF2F2] text-[#DC143C] border-[#FECACA]'
                    }`}>
                      {['H', 'I', 'J'].includes(selectedMark) ? 'LEGAL IN STANDARD' : 'ROTATED OUT OF STANDARD'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <Link 
                      to="/formats/standard"
                      className="bg-white p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all hover:shadow-sm group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[#64748B] block mb-1">Standard Format</span>
                        <span className={`font-bold flex items-center gap-1 ${['H', 'I', 'J'].includes(selectedMark) ? 'text-[#16A34A]' : 'text-[#DC143C]'}`}>
                          {['H', 'I', 'J'].includes(selectedMark) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {['H', 'I', 'J'].includes(selectedMark) ? 'Allowed (2026 Standard)' : 'Rotated (Illegal in Standard)'}
                        </span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-[11px] font-mono text-[#DC143C] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Format Rules <ChevronRight className="w-3 h-3" />
                      </div>
                    </Link>

                    <Link 
                      to="/formats/expanded"
                      className="bg-white p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all hover:shadow-sm group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[#64748B] block mb-1">Expanded Format</span>
                        <span className="font-bold text-[#16A34A] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Always Legal (BW-Present)
                        </span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-[11px] font-mono text-[#DC143C] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Format Rules <ChevronRight className="w-3 h-3" />
                      </div>
                    </Link>

                    <Link 
                      to="/formats/glc"
                      className="bg-white p-4 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all hover:shadow-sm group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[#64748B] block mb-1">Gym Leader Challenge (GLC)</span>
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Legal (No Rulebox cards)
                        </span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-[11px] font-mono text-[#DC143C] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        Format Rules <ChevronRight className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Tournament Deck Construction Rules Table */}
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 mb-12 shadow-xs">
                <h3 className="text-lg font-bold text-[#0F172A] font-heading mb-2">
                  Official Standard Deckbuilding Restrictions
                </h3>
                <p className="text-xs text-[#64748B] mb-4">
                  Mandatory card limits enforced in competitive play:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[#0F172A] font-semibold">Deck Size:</span>
                    <span className="font-mono text-[#DC143C] font-bold">Exactly 60 Cards</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[#0F172A] font-semibold">Same-Name Card Limit:</span>
                    <span className="font-mono text-[#DC143C] font-bold">Max 4 Copies (excluding Basic Energy)</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[#0F172A] font-semibold">ACE SPEC Cards:</span>
                    <span className="font-mono text-amber-600 font-bold">Strictly 1 ACE SPEC Card per Deck</span>
                  </div>
                  <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-[#0F172A] font-semibold">Radiant Pokémon:</span>
                    <span className="font-mono text-amber-600 font-bold">Strictly 1 Radiant Pokémon per Deck</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/app')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-mono font-bold text-xs rounded-xl transition-colors shadow-2xs"
                  >
                    Build a Legal Deck in DECK / divider Studio <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <PublicInterlinkMesh currentPath={toolId ? `/tools/${toolId}` : '/tools'} />

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
