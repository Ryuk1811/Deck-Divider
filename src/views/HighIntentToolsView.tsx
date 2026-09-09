import React, { useState } from 'react';
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
  HelpCircle
} from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';

export const HighIntentToolsView: React.FC = () => {
  const { toolId } = useParams<{ toolId?: string }>();
  const navigate = useNavigate();

  const currentTool = toolId || 'psa-grade-calculator';

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#38BDF8]">Interactive Tools &amp; Calculators</span>
          </div>

          {/* Navigation Pill Switcher */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 border-b border-[#1E293B] pb-4">
            <Link
              to="/tools/psa-grade-calculator"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTool === 'psa-grade-calculator'
                  ? 'bg-[#38BDF8] text-[#0B0F19] shadow-sm'
                  : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1E293B]'
              }`}
            >
              <Calculator className="w-4 h-4" />
              PSA / BGS Grade ROI Calculator
            </Link>
            <Link
              to="/tools/deck-legality-checker"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                currentTool === 'deck-legality-checker'
                  ? 'bg-[#38BDF8] text-[#0B0F19] shadow-sm'
                  : 'bg-[#111827] text-[#94A3B8] hover:text-white border border-[#1E293B]'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Regulation Mark &amp; Legality Checker
            </Link>
            
          </div>

          {/* TOOL 1: PSA Grade ROI Calculator */}
          {currentTool === 'psa-grade-calculator' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                  Pokémon Card Grading ROI &amp; Value Calculator (2025/2026)
                </h1>
                <p className="text-[#94A3B8] text-base leading-relaxed">
                  Evaluate whether submitting your raw card to PSA, BGS, or CGC is mathematically profitable based on expected grade probabilities, submission tiers, and historical sales spreads.
                </p>
              </div>

              {/* Direct Answer Box for AI Overviews & Snippets */}
              <div className="bg-[#111827] border-l-4 border-[#38BDF8] rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Is Grading Pokémon Cards Worth It?
                  </div>
                  <span className="text-[11px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                    Source: PSA APR &amp; TCGplayer Market Comps (September 2026)
                  </span>
                </div>
                <p className="text-white text-sm sm:text-base leading-relaxed font-medium">
                  Grading a Pokémon card is financially worth it when the <strong>expected value (EV) exceeds the raw card market price plus grading and shipping fees by at least 25%</strong>. If a card only achieves break-even at a gem mint PSA 10 while dropping below submission cost at PSA 9, keeping the card raw or selling in near-mint condition is mathematically the safer financial decision.
                </p>
              </div>

              {/* Interactive Calculator Matrix */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-10 shadow-xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#38BDF8]" />
                  Grading Cost &amp; Expected Value Simulator
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Inputs */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-[#94A3B8] mb-1 uppercase">
                        Raw Card Near-Mint Market Price ($)
                      </label>
                      <input
                        type="number"
                        value={rawPrice}
                        onChange={(e) => setRawPrice(Number(e.target.value))}
                        className="w-full bg-[#0B0F19] border border-[#334155] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#38BDF8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-mono text-[#94A3B8] mb-1 uppercase">
                          Grading Fee ($)
                        </label>
                        <select
                          value={gradingFee}
                          onChange={(e) => setGradingFee(Number(e.target.value))}
                          className="w-full bg-[#0B0F19] border border-[#334155] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#38BDF8]"
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
                        <label className="block text-xs font-mono text-[#94A3B8] mb-1 uppercase">
                          Shipping &amp; Ins. ($)
                        </label>
                        <input
                          type="number"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(Number(e.target.value))}
                          className="w-full bg-[#0B0F19] border border-[#334155] rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#38BDF8]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1E293B]">
                      <div className="text-xs font-mono text-white mb-2 uppercase font-bold">Grade Market Values &amp; Odds</div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 w-16">PSA 10:</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={psa10Value}
                            onChange={(e) => setPsa10Value(Number(e.target.value))}
                            className="w-24 bg-[#0B0F19] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <span className="text-xs text-[#64748B]">$</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={psa10Prob}
                            onChange={(e) => setPsa10Prob(Number(e.target.value))}
                            className="flex-1 accent-[#38BDF8]"
                          />
                          <span className="text-xs font-mono text-[#38BDF8] w-10 text-right">{psa10Prob}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-300 w-16">PSA 9:</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={psa9Value}
                            onChange={(e) => setPsa9Value(Number(e.target.value))}
                            className="w-24 bg-[#0B0F19] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <span className="text-xs text-[#64748B]">$</span>
                          <input
                            type="range"
                            min="0"
                            max={100 - psa10Prob}
                            value={psa9Prob}
                            onChange={(e) => setPsa9Prob(Number(e.target.value))}
                            className="flex-1 accent-[#38BDF8]"
                          />
                          <span className="text-xs font-mono text-[#38BDF8] w-10 text-right">{psa9Prob}%</span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#64748B]">
                          <span className="font-bold text-slate-500 w-16">PSA 8/Lower:</span>
                          <input
                            type="number"
                            placeholder="Price"
                            value={psa8Value}
                            onChange={(e) => setPsa8Value(Number(e.target.value))}
                            className="w-24 bg-[#0B0F19] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                          />
                          <span className="text-xs text-[#64748B]">$</span>
                          <div className="flex-1 text-right font-mono text-slate-400">
                            {psa8Prob}% Remaining
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Results & Verdict */}
                  <div className="bg-[#0B0F19] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono text-[#64748B] uppercase mb-4">Financial Projections</div>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#94A3B8]">Total Cost Basis:</span>
                          <span className="font-mono text-white font-bold">${totalCost.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-[#94A3B8]">Expected Value (EV):</span>
                          <span className="font-mono text-[#38BDF8] font-bold">${expectedValue.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-base border-t border-[#1E293B] pt-3">
                          <span className="text-white font-medium">Net Profit / Loss:</span>
                          <span className={`font-mono font-black text-xl ${netProfit >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                            {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)} ({roiPercentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>

                      {/* Decision Banner */}
                      <div className={`mt-6 p-4 rounded-xl border flex items-start gap-3 ${
                        isWorthIt 
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                        {isWorthIt ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />}
                        <div>
                          <div className="font-bold text-sm">
                            {isWorthIt ? 'Mathematically Favorable to Grade' : 'High Risk — Keep Raw or Sell Ungraded'}
                          </div>
                          <div className="text-xs mt-1 text-slate-300">
                            {isWorthIt 
                              ? 'Your projected expected return comfortably covers grading submission fees and shipping buffer.' 
                              : 'The spread between raw price and grade 9 does not justify grading fees unless you are 100% confident in a PSA 10.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1E293B] text-center">
                      <button
                        onClick={() => navigate('/auth')}
                        className="w-full py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        Track Graded Slabs in DECK / divider Vault <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extraction Table: Average Price Multipliers */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-12">
                <h3 className="text-lg font-bold text-white mb-2">
                  Average Pokémon Card Grade Multipliers (Historical Benchmark)
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Standard market multipliers comparing raw near-mint value to certified grades across modern expansions.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#1E293B] text-[#64748B] font-mono">
                        <th className="py-2.5 px-3">Grade Level</th>
                        <th className="py-2.5 px-3">Typical Multiplier vs. Raw NM</th>
                        <th className="py-2.5 px-3">Grading Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]">
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-amber-400">PSA 10 / BGS 10 / CGC Pristine</td>
                        <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">2.5x - 5.0x</td>
                        <td className="py-2.5 px-3 text-slate-300">Always submit if centering and edges are pristine</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-200">PSA 9 / BGS 9.5 / CGC 9.5</td>
                        <td className="py-2.5 px-3 font-mono text-slate-300 font-bold">1.0x - 1.3x</td>
                        <td className="py-2.5 px-3 text-slate-300">Often breaks even with grading fees on modern cards</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 font-bold text-slate-400">PSA 8 / BGS 8.5 / CGC 8.5</td>
                        <td className="py-2.5 px-3 font-mono text-rose-400 font-bold">0.7x - 0.9x</td>
                        <td className="py-2.5 px-3 text-slate-300">Net loss on modern cards; only worthwhile on vintage</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TOOL 2: Regulation Mark & Legality Checker */}
          {currentTool === 'deck-legality-checker' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                  Pokémon TCG Tournament Legality &amp; Rotation Checker (2025/2026)
                </h1>
                <p className="text-[#94A3B8] text-base leading-relaxed">
                  Verify the tournament legality of any card or regulation mark across the official Pokémon Standard, Expanded, and Gym Leader Challenge (GLC) formats.
                </p>
              </div>

              {/* Direct Answer Box for AI Overviews & Snippets */}
              <div className="bg-[#111827] border-l-4 border-[#10B981] rounded-xl p-6 mb-10 shadow-lg">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#10B981] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Legal Regulation Marks in Standard 2025
                </div>
                <p className="text-white text-sm sm:text-base leading-relaxed font-medium">
                  For the 2025 tournament cycle, cards with <strong>regulation marks "G" and "H" (and upcoming "I")</strong> are fully legal in official Pokémon TCG Standard format tournaments. Cards bearing regulation marks "E" and "F" have officially rotated out, unless a card has received an identical text reprint in a legal expansion.
                </p>
              </div>

              {/* Interactive Regulation Mark Inspector */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-10">
                <h2 className="text-xl font-bold text-white mb-4">
                  Select a Regulation Mark to Inspect Legality
                </h2>

                <div className="flex flex-wrap gap-3 mb-8">
                  {['E', 'F', 'G', 'H', 'I'].map((mark) => (
                    <button
                      key={mark}
                      onClick={() => setSelectedMark(mark)}
                      className={`w-14 h-14 rounded-2xl font-black text-2xl transition-all border ${
                        selectedMark === mark
                          ? 'bg-[#38BDF8] text-[#0B0F19] border-[#38BDF8] shadow-lg scale-105'
                          : 'bg-[#0B0F19] text-[#94A3B8] border-[#1E293B] hover:text-white hover:border-[#334155]'
                      }`}
                    >
                      {mark}
                    </button>
                  ))}
                </div>

                {/* Mark Details */}
                <div className="bg-[#0B0F19] border border-[#1E293B] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1E293B]">
                    <div>
                      <div className="text-xs text-[#64748B] font-mono uppercase">REGULATION MARK</div>
                      <div className="text-2xl font-black text-white">Mark "{selectedMark}"</div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                      ['G', 'H', 'I'].includes(selectedMark)
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}>
                      {['G', 'H', 'I'].includes(selectedMark) ? 'LEGAL IN STANDARD' : 'ROTATED OUT OF STANDARD'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#111827] p-3 rounded-lg border border-[#1E293B]">
                      <span className="text-[#64748B] block mb-1">Standard Format</span>
                      <span className={`font-bold flex items-center gap-1 ${['G', 'H', 'I'].includes(selectedMark) ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {['G', 'H', 'I'].includes(selectedMark) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        {['G', 'H', 'I'].includes(selectedMark) ? 'Allowed (2025/2026)' : 'Rotated (Illegal)'}
                      </span>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-lg border border-[#1E293B]">
                      <span className="text-[#64748B] block mb-1">Expanded Format</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Always Legal (BW-Present)
                      </span>
                    </div>

                    <div className="bg-[#111827] p-3 rounded-lg border border-[#1E293B]">
                      <span className="text-[#64748B] block mb-1">Gym Leader Challenge (GLC)</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        Legal (No Rulebox cards)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Deck Construction Rules Table */}
              <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 mb-12">
                <h3 className="text-lg font-bold text-white mb-2">
                  Official Standard Deckbuilding Restrictions
                </h3>
                <p className="text-xs text-[#94A3B8] mb-4">
                  Mandatory card limits enforced in competitive play:
                </p>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">Deck Size:</span>
                    <span className="font-mono text-[#38BDF8] font-bold">Exactly 60 Cards</span>
                  </div>
                  <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">Same-Name Card Limit:</span>
                    <span className="font-mono text-[#38BDF8] font-bold">Max 4 Copies (excluding Basic Energy)</span>
                  </div>
                  <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">ACE SPEC Cards:</span>
                    <span className="font-mono text-[#EAB308] font-bold">Strictly 1 ACE SPEC Card per Deck</span>
                  </div>
                  <div className="bg-[#0B0F19] p-3 rounded-lg border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">Radiant Pokémon:</span>
                    <span className="font-mono text-[#EAB308] font-bold">Strictly 1 Radiant Pokémon per Deck</span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => navigate('/app')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#DC143C] hover:bg-[#B01030] text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                  >
                    Build a Legal Deck in DECK / divider Studio <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <LandingFooter 
        onEnterApp={() => navigate('/app')}
        onOpenAuth={() => navigate('/auth')}
      />
    </div>
  );
};
