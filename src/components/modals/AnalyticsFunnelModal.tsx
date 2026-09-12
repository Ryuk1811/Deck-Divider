import React, { useState, useEffect } from 'react';
import { X, RefreshCw, Filter, TrendingDown, Users, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

interface FunnelStepMetric {
  stepKey: string;
  label: string;
  count: number;
  rawEventCount: number;
  conversionFromPrev: number;
  dropoffFromPrev: number;
  overallConversion: number;
}

interface FunnelData {
  summary: {
    totalLandings: number;
    totalFirstActions: number;
    overallFunnelConversion: number;
    privacyMode: string;
  };
  funnel: FunnelStepMetric[];
  timestamp: string;
}

interface AnalyticsFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsFunnelModal: React.FC<AnalyticsFunnelModalProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFunnelMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics/funnel-metrics');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error('[Funnel Telemetry]', err);
      setError('Unable to load real-time funnel telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFunnelMetrics();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const maxCount = data?.funnel?.[0]?.count || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0F172A] text-white rounded-xl shadow-md">
              <Filter className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Signup & Activation Funnel
              </h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                Privacy-Preserving Telemetry (Zero PII / Anonymized Sessions)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchFunnelMetrics}
              disabled={loading}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
              {error}
            </div>
          )}

          {data && (
            <>
              {/* Summary Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Landings</div>
                  <div className="text-2xl font-black text-slate-900 font-mono">{data.summary.totalLandings}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Unique session visits</div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Activated Users</div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">{data.summary.totalFirstActions}</div>
                  <div className="text-[11px] text-slate-400 mt-1">Added 1st card, deck, or vault entry</div>
                </div>

                <div className="p-4 bg-slate-900 text-white border border-slate-800 rounded-xl">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Overall Conversion</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {data.summary.overallFunnelConversion}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">Landing → Activation completion</div>
                </div>
              </div>

              {/* Visual Funnel Step Bars */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                  <span>Funnel Lifecycle Stage</span>
                  <div className="flex items-center gap-6">
                    <span>Sessions</span>
                    <span className="w-16 text-right">Conversion</span>
                    <span className="w-16 text-right text-rose-500">Drop-off</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {data.funnel.map((step, idx) => {
                    const barWidthPct = maxCount > 0 ? Math.max(8, Math.round((step.count / maxCount) * 100)) : 8;
                    const isLast = idx === data.funnel.length - 1;

                    return (
                      <div key={step.stepKey} className="group relative">
                        <div className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-all space-y-2 shadow-xs">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-800 flex items-center gap-2">
                              {step.label}
                              {isLast && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                                  Goal Reached
                                </span>
                              )}
                            </span>
                            <div className="flex items-center gap-6 text-xs font-mono">
                              <span className="font-bold text-slate-900">{step.count}</span>
                              <span className="w-16 text-right font-medium text-emerald-600">
                                {idx === 0 ? '100%' : `${step.conversionFromPrev}%`}
                              </span>
                              <span className="w-16 text-right font-medium text-rose-500">
                                {idx === 0 ? '0%' : `-${step.dropoffFromPrev}%`}
                              </span>
                            </div>
                          </div>

                          {/* Horizontal Bar Visualizer */}
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                            <div
                              className={`h-full transition-all duration-500 ${
                                isLast
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                  : 'bg-gradient-to-r from-slate-800 to-slate-700'
                              }`}
                              style={{ width: `${barWidthPct}%` }}
                            />
                          </div>
                        </div>

                        {/* Transition dropoff indicator between steps */}
                        {!isLast && (
                          <div className="flex items-center justify-end pr-4 py-0.5 text-[10px] font-mono text-slate-400">
                            <TrendingDown className="w-3 h-3 text-rose-400 inline mr-1" />
                            {step.dropoffFromPrev}% drop-off to next step
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Privacy Footer Notice */}
              <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-700">Privacy-First Architecture:</strong> Metrics are recorded without cookies, IP addresses, or personal identity tags. Step counts rely on ephemeral session identifiers that expire when user tabs close.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-colors shadow-sm"
          >
            Close Telemetry View
          </button>
        </div>
      </div>
    </div>
  );
};
