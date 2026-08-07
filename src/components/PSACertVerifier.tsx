import React, { useState } from 'react';
import { Search, ShieldCheck, Award, AlertCircle, Sparkles, CheckCircle2, Plus } from 'lucide-react';
import { PSAPopReport, DisplayCurrency, GradingCompany } from '../types';
import { MOCK_PSA_REPORTS, fetchOrVerifyCert } from '../data/sealedAndMarketData';

interface PSACertVerifierProps {
  initialCertNumber?: string;
  currency?: DisplayCurrency;
  onSelectCard?: (cardName: string) => void;
  onAddGradedCardToCollection?: (certReport: PSAPopReport) => void;
}

export const PSACertVerifier: React.FC<PSACertVerifierProps> = ({
  initialCertNumber = '',
  currency = 'USD',
  onSelectCard,
  onAddGradedCardToCollection,
}) => {
  const [selectedCompany, setSelectedCompany] = useState<GradingCompany>('PSA');
  const [certInput, setCertInput] = useState(initialCertNumber);
  const [result, setResult] = useState<PSAPopReport | null>(
    initialCertNumber ? fetchOrVerifyCert(initialCertNumber, 'PSA') : fetchOrVerifyCert('81923049', 'PSA')
  );
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCert = certInput.trim();
    if (!cleanCert) return;

    setIsSearching(true);
    setErrorMessage('');
    setAddedSuccess(false);

    try {
      const res = await fetch(`/api/cert/verify?certNumber=${encodeURIComponent(cleanCert)}&company=${encodeURIComponent(selectedCompany)}`);
      if (res.ok) {
        const report = await res.json();
        setResult(report);
      } else {
        const fallback = fetchOrVerifyCert(cleanCert, selectedCompany);
        setResult(fallback);
      }
    } catch (err) {
      console.warn('API cert verify request failed, falling back to local calculation:', err);
      try {
        const fallback = fetchOrVerifyCert(cleanCert, selectedCompany);
        setResult(fallback);
      } catch (fallbackErr) {
        setErrorMessage(`Certification verification failed for ${selectedCompany}. Please check cert # format.`);
        setResult(null);
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sm:p-6 space-y-6">
      {/* Header without hype badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-[#0F172A]">
              Grading Certification & Population Report Hub
            </h2>
            <p className="font-mono text-xs text-[#64748B]">
              Verify certification numbers & population distributions for PSA, BGS, CGC, TAG, MGC, SGC, ACE, ARS & PGG
            </p>
          </div>
        </div>
      </div>

      {/* Form with Company Selector */}
      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedCompany}
          onChange={(e) => setSelectedCompany(e.target.value as GradingCompany)}
          className="px-3 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
        >
          <option value="PSA">PSA</option>
          <option value="BGS">BGS (Beckett)</option>
          <option value="CGC">CGC</option>
          <option value="TAG">TAG</option>
          <option value="MGC">MGC</option>
          <option value="ACE">ACE</option>
          <option value="SGC">SGC</option>
          <option value="ARS">ARS</option>
          <option value="PGG">PGG</option>
          <option value="Other">Other</option>
        </select>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
          <input
            type="text"
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            placeholder={`Enter ${selectedCompany} Cert # (e.g. 81923049, 001482930, 4029104001, TAG-802918)...`}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl font-mono text-xs text-[#0F172A] focus:outline-none focus:border-[#DC143C] focus:ring-2 focus:ring-[#DC143C]/20 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2.5 bg-[#0F172A] hover:bg-[#DC143C] text-white font-mono text-xs font-bold rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isSearching ? (
            <span className="animate-pulse">Verifying...</span>
          ) : (
            <>
              <Award className="w-4 h-4" /> Verify Cert & Pop
            </>
          )}
        </button>
      </form>

      {/* Quick Sample Chips for Global Grading Services */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        <span className="text-[#64748B] flex-shrink-0">Sample Certs:</span>
        <button
          type="button"
          onClick={() => {
            setSelectedCompany('PSA');
            setCertInput('81923049');
            setResult(MOCK_PSA_REPORTS['81923049']);
          }}
          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#DC143C]/10 hover:text-[#DC143C] text-[#334155] rounded-md transition-colors cursor-pointer flex-shrink-0"
        >
          PSA 81923049 (Umbreon 10)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCompany('BGS');
            setCertInput('001482930');
            setResult(MOCK_PSA_REPORTS['001482930']);
          }}
          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#DC143C]/10 hover:text-[#DC143C] text-[#334155] rounded-md transition-colors cursor-pointer flex-shrink-0"
        >
          BGS 001482930 (Umbreon 9.5)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCompany('CGC');
            setCertInput('4029104001');
            setResult(MOCK_PSA_REPORTS['4029104001']);
          }}
          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#DC143C]/10 hover:text-[#DC143C] text-[#334155] rounded-md transition-colors cursor-pointer flex-shrink-0"
        >
          CGC 4029104001 (Zard Pristine 10)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCompany('TAG');
            setCertInput('TAG-802918');
            setResult(MOCK_PSA_REPORTS['TAG-802918']);
          }}
          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#DC143C]/10 hover:text-[#DC143C] text-[#334155] rounded-md transition-colors cursor-pointer flex-shrink-0"
        >
          TAG-802918 (Eevee 10)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedCompany('MGC');
            setCertInput('MGC-910284');
            setResult(MOCK_PSA_REPORTS['MGC-910284']);
          }}
          className="px-2.5 py-1 bg-[#F1F5F9] hover:bg-[#DC143C]/10 hover:text-[#DC143C] text-[#334155] rounded-md transition-colors cursor-pointer flex-shrink-0"
        >
          MGC-910284 (Zard 10)
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl font-mono text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Verification Results Panel */}
      {result && (
        <div className="space-y-6 animate-fade-in border-t border-[#E2E8F0] pt-5">
          {/* Status Badge Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <span className="font-mono text-xs font-bold text-emerald-900 block">
                  {result.gradingCompany || selectedCompany} CERTIFICATION VERIFIED • #{result.certNumber}
                </span>
                <span className="font-mono text-[11px] text-emerald-700">
                  Spec ID: {result.specNumber} | Release Year: {result.year}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-white border border-emerald-300 rounded-lg shadow-2xs font-mono text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Grade: <span className="text-[#DC143C]">{result.grade}</span>
              </div>

              {onAddGradedCardToCollection && (
                <button
                  type="button"
                  onClick={() => {
                    onAddGradedCardToCollection(result);
                    setAddedSuccess(true);
                  }}
                  disabled={addedSuccess}
                  className="px-3 py-1 bg-[#0F172A] hover:bg-[#DC143C] text-white font-mono text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:bg-emerald-600"
                >
                  {addedSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Added to Collection
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" /> Add Slab to Collection
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-bold">Item Metadata</span>
              <div className="text-sm font-bold text-[#0F172A]">{result.cardName}</div>
              <div className="text-[#334155]">{result.setName}</div>
              {result.variety && <div className="text-[#64748B]">Variety: {result.variety}</div>}
              {result.subgrades && (
                <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-1 text-[11px]">
                  <span>Centering: <b>{result.subgrades.centering}</b></span>
                  <span>Corners: <b>{result.subgrades.corners}</b></span>
                  <span>Edges: <b>{result.subgrades.edges}</b></span>
                  <span>Surface: <b>{result.subgrades.surface}</b></span>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider block font-bold">
                {result.gradingCompany || selectedCompany} Population Report Summary
              </span>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Total Population Graded:</span>
                <span className="font-bold text-[#0F172A]">{result.totalGraded.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#E2E8F0]">
                <span className="text-[#64748B]">Gem Mint / Pristine Count:</span>
                <span className="font-bold text-[#16A34A]">{result.popPsa10.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#64748B]">Gem Mint Rate %:</span>
                <span className="font-bold text-[#DC143C]">{result.gemMintRate}%</span>
              </div>
            </div>
          </div>

          {/* Visual Bar Distribution Chart */}
          <div className="p-4 bg-white border border-[#E2E8F0] rounded-xl space-y-3">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="font-bold text-[#0F172A]">
                Grade Population Distribution ({result.gradingCompany || selectedCompany})
              </span>
              <span className="text-[#64748B]">Gem Rate: {result.gemMintRate}%</span>
            </div>
            
            <div className="h-4 w-full bg-[#E2E8F0] rounded-full overflow-hidden flex">
              <div
                style={{ width: `${(result.popPsa10 / result.totalGraded) * 100}%` }}
                className="bg-[#16A34A] h-full"
                title={`Gem Mint / Pristine: ${result.popPsa10}`}
              />
              <div
                style={{ width: `${(result.popPsa9 / result.totalGraded) * 100}%` }}
                className="bg-[#3B82F6] h-full"
                title={`Mint 9: ${result.popPsa9}`}
              />
              <div
                style={{ width: `${(result.popPsa8AndLower / result.totalGraded) * 100}%` }}
                className="bg-[#94A3B8] h-full"
                title={`8 & Lower: ${result.popPsa8AndLower}`}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-[#64748B]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                <span>Gem Mint / Pristine ({result.popPsa10})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                <span>Mint 9 ({result.popPsa9})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]" />
                <span>8 & Lower ({result.popPsa8AndLower})</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
