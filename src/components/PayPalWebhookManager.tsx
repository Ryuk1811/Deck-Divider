import React, { useState, useEffect } from 'react';
import { 
  Webhook, 
  Copy, 
  Check, 
  RefreshCw, 
  Play, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Radio, 
  ChevronDown, 
  ChevronUp, 
  Globe, 
  Sparkles,
  Zap,
  Clock,
  Send
} from 'lucide-react';

interface WebhookLog {
  id: string;
  eventId: string;
  eventType: string;
  timestamp: string;
  status: 'PROCESSED' | 'WARNING' | 'FAILED' | 'SIMULATED';
  summary: string;
  targetUid: string | null;
  subscriptionId: string | null;
  planId?: string | null;
  tierName?: string | null;
  rawEvent?: any;
}

interface WebhookInfo {
  webhookUrl: string;
  webhookPath: string;
  hostname: string;
  mode: string;
  webhookId: string | null;
  hasWebhookId: boolean;
  supportedEvents: Array<{ name: string; description: string }>;
  stats: {
    totalEventsLogged: number;
    processedCount: number;
    warningCount: number;
    failedCount: number;
    lastEventAt: string | null;
  };
  recentLogs: WebhookLog[];
}

export const PayPalWebhookManager: React.FC = () => {
  const [info, setInfo] = useState<WebhookInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [simEventType, setSimEventType] = useState('BILLING.SUBSCRIPTION.ACTIVATED');
  const [simTier, setSimTier] = useState('Stack');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [paypalRegisteredWebhooks, setPaypalRegisteredWebhooks] = useState<any[] | null>(null);
  const [queryingPayPal, setQueryingPayPal] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Compute fallback webhook URL dynamically from browser window if needed
  const resolvedBrowserWebhookUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/v1/paypal/webhook`
    : '/api/v1/paypal/webhook';

  const fetchManagerInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/paypal/webhook-manager/info');
      if (res.ok) {
        const data = await res.json();
        setInfo(data);
      }
    } catch (err) {
      console.warn('Failed to load webhook info:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagerInfo();
    const interval = setInterval(fetchManagerInfo, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleCopyUrl = () => {
    const urlToCopy = info?.webhookUrl || resolvedBrowserWebhookUrl;
    navigator.clipboard.writeText(urlToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestSimulate = async () => {
    try {
      setSimulating(true);
      const res = await fetch('/api/v1/paypal/webhook-manager/test-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: simEventType,
          tier: simTier,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ type: 'success', message: `Test webhook executed: ${simEventType}` });
        await fetchManagerInfo();
      } else {
        setNotification({ type: 'error', message: data.error || 'Test event failed' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Simulation request failed' });
    } finally {
      setSimulating(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleClearLogs = async () => {
    try {
      await fetch('/api/v1/paypal/webhook-manager/clear-logs', { method: 'POST' });
      await fetchManagerInfo();
      setNotification({ type: 'info', message: 'Webhook event logs cleared' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleQueryPayPalApi = async () => {
    try {
      setQueryingPayPal(true);
      const res = await fetch('/api/v1/paypal/webhook-manager/paypal-registered');
      const data = await res.json();
      if (res.ok) {
        setPaypalRegisteredWebhooks(data.webhooks || []);
        setNotification({ 
          type: 'success', 
          message: `Found ${data.webhooks?.length || 0} registered webhooks on your PayPal account.` 
        });
      } else {
        setNotification({ type: 'error', message: data.error || 'Failed to query PayPal API' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Could not query PayPal' });
    } finally {
      setQueryingPayPal(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleAutoRegisterWebhook = async () => {
    try {
      setRegistering(true);
      const targetUrl = info?.webhookUrl || resolvedBrowserWebhookUrl;
      const res = await fetch('/api/v1/paypal/webhook-manager/register-paypal-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webhookUrl: targetUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({ 
          type: 'success', 
          message: `Webhook successfully registered on PayPal! Webhook ID: ${data.webhook?.id || 'Created'}` 
        });
        await handleQueryPayPalApi();
      } else {
        setNotification({ type: 'error', message: data.error || 'Registration failed' });
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Registration failed' });
    } finally {
      setRegistering(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const activeWebhookUrl = info?.webhookUrl || resolvedBrowserWebhookUrl;

  return (
    <div id="paypal-webhook-manager" className="glass-slab shadow-sm border border-[#E2E8F0] rounded-xl overflow-hidden bg-white/95 space-y-0">
      {/* Top Banner Header */}
      <div className="p-5 sm:p-6 bg-slate-50/80 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#FFF0F3] text-[#DC143C] border border-[#DC143C]/20 flex items-center justify-center shrink-0 shadow-xs">
            <Webhook className="w-5 h-5 text-[#DC143C]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading font-bold text-base sm:text-lg text-[#0F172A]">
                PayPal Webhooks Manager
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVE LISTENER
              </span>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 border border-slate-200 text-slate-700 uppercase">
                {info?.mode || 'LIVE'} GATEWAY
              </span>
            </div>
            <p className="font-mono text-xs text-[#64748B] mt-0.5">
              Receives real-time subscription lifecycle updates, recurring payments, renewals, and cancellations from PayPal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={fetchManagerInfo}
            disabled={loading}
            className="h-9 px-3 neo-btn-secondary text-xs font-mono font-bold flex items-center gap-1.5 rounded-lg cursor-pointer shadow-xs"
            title="Refresh Webhook Manager Status"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#DC143C] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`px-5 py-3 border-b text-xs font-mono font-bold flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
          notification.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' :
          'bg-blue-50 text-blue-800 border-blue-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="p-5 sm:p-6 space-y-6">
        {/* ========================================================================= */}
        {/* 1. PRIMARY WEBHOOK BINDING URL CARD */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0F172A] text-white space-y-3 shadow-md border border-slate-800 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#DC143C]" />
              <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                PayPal Webhook Binding URL (Endpoint)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-emerald-400 font-bold">
                POST Route
              </span>
              <span>Port 3000 Ingress</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex-1 bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 font-mono text-xs text-amber-300 select-all overflow-x-auto whitespace-nowrap shadow-inner flex items-center">
              <span>{activeWebhookUrl}</span>
            </div>

            <button
              type="button"
              onClick={handleCopyUrl}
              className="h-10 px-4 bg-[#DC143C] hover:bg-[#B01030] active:scale-98 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow transition-all shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Webhook URL</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-slate-400 pt-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Signature Verification: {info?.hasWebhookId ? 'Secured (Webhook ID Active)' : 'Active (Development Mode Enabled)'}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>Path: <code className="text-slate-200">/api/v1/paypal/webhook</code></span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. STATS & QUICK ACTIONS GRID */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
            <span className="font-mono text-[11px] text-[#64748B]">Total Events</span>
            <div className="font-num font-bold text-xl text-[#0F172A]">
              {info?.stats.totalEventsLogged || 0}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#F0FDF4] border border-emerald-200 space-y-1">
            <span className="font-mono text-[11px] text-emerald-700">Processed</span>
            <div className="font-num font-bold text-xl text-emerald-700">
              {info?.stats.processedCount || 0}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-amber-200 space-y-1">
            <span className="font-mono text-[11px] text-amber-700">Warnings</span>
            <div className="font-num font-bold text-xl text-amber-700">
              {info?.stats.warningCount || 0}
            </div>
          </div>
          <div className="p-3.5 rounded-lg bg-[#FFF0F3] border border-[#DC143C]/20 space-y-1">
            <span className="font-mono text-[11px] text-[#DC143C]">Failures</span>
            <div className="font-num font-bold text-xl text-[#DC143C]">
              {info?.stats.failedCount || 0}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SIMULATOR & PAYPAL API ACTIONS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Test Event Simulator */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#E2E8F0] bg-white space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#CA8A04]" />
                <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                  Webhook Simulator & Test Runner
                </h3>
              </div>
              <span className="font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-bold">
                Test Dispatcher
              </span>
            </div>

            <p className="font-mono text-xs text-[#64748B]">
              Simulate an incoming PayPal subscription event to verify that your application updates account tiers, renewal states, and database logs instantly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs">
              <div>
                <label className="block text-[11px] text-[#64748B] mb-1 font-bold">Event Type:</label>
                <select
                  value={simEventType}
                  onChange={(e) => setSimEventType(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                >
                  <option value="BILLING.SUBSCRIPTION.ACTIVATED">BILLING.SUBSCRIPTION.ACTIVATED</option>
                  <option value="PAYMENT.SALE.COMPLETED">PAYMENT.SALE.COMPLETED</option>
                  <option value="BILLING.SUBSCRIPTION.CANCELLED">BILLING.SUBSCRIPTION.CANCELLED</option>
                  <option value="BILLING.SUBSCRIPTION.SUSPENDED">BILLING.SUBSCRIPTION.SUSPENDED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-[#64748B] mb-1 font-bold">Plan Tier:</label>
                <select
                  value={simTier}
                  onChange={(e) => setSimTier(e.target.value)}
                  className="w-full h-9 px-2.5 bg-white border border-[#CBD5E1] rounded-lg text-[#0F172A] focus:outline-none focus:border-[#DC143C]"
                >
                  <option value="Bunch">Bunch ($11/mo)</option>
                  <option value="Stack">Stack ($22/mo)</option>
                  <option value="Deck">Deck ($33/mo)</option>
                  <option value="Collection">Collection ($44/mo)</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestSimulate}
              disabled={simulating}
              className="w-full h-9 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 rounded-lg cursor-pointer shadow-xs transition-colors"
            >
              {simulating ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
              ) : (
                <Send className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Dispatch Test Webhook Event</span>
            </button>
          </div>

          {/* PayPal Account Webhook Sync & Registration */}
          <div className="p-4 sm:p-5 rounded-xl border border-[#E2E8F0] bg-white space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#DC143C]" />
                <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                  PayPal Account Direct Registration
                </h3>
              </div>
              <span className="font-mono text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-bold">
                REST API Integration
              </span>
            </div>

            <p className="font-mono text-xs text-[#64748B]">
              Query your live PayPal account to inspect existing registered webhooks or register this app's endpoint directly via PayPal REST API.
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                type="button"
                onClick={handleQueryPayPalApi}
                disabled={queryingPayPal}
                className="flex-1 h-9 px-3 neo-btn-secondary text-xs font-mono font-bold flex items-center justify-center gap-1.5 rounded-lg cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#DC143C] ${queryingPayPal ? 'animate-spin' : ''}`} />
                <span>Query PayPal Account</span>
              </button>

              <button
                type="button"
                onClick={handleAutoRegisterWebhook}
                disabled={registering}
                className="flex-1 h-9 px-3 bg-[#DC143C] hover:bg-[#B01030] text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 rounded-lg cursor-pointer shadow-xs transition-colors"
              >
                {registering ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                <span>Auto-Register Webhook</span>
              </button>
            </div>

            {paypalRegisteredWebhooks && (
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg font-mono text-[11px] space-y-1.5 max-h-32 overflow-y-auto">
                <div className="font-bold text-[#0F172A]">PayPal Registered Webhooks ({paypalRegisteredWebhooks.length}):</div>
                {paypalRegisteredWebhooks.length === 0 ? (
                  <div className="text-slate-400">No webhooks registered yet on your PayPal dashboard. Click Auto-Register to bind this endpoint.</div>
                ) : (
                  paypalRegisteredWebhooks.map((wh) => (
                    <div key={wh.id} className="p-1.5 bg-white border border-slate-200 rounded flex items-center justify-between">
                      <span className="truncate max-w-[200px] text-slate-700">{wh.url}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">{wh.id}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. LIVE WEBHOOK EVENT LOGS FEED */}
        {/* ========================================================================= */}
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden bg-white">
          <div className="p-4 bg-slate-50/80 border-b border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#DC143C]" />
              <h3 className="font-heading font-bold text-sm text-[#0F172A]">
                Recent Ingested Webhook Events ({info?.recentLogs.length || 0})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {(info?.recentLogs?.length || 0) > 0 && (
                <button
                  type="button"
                  onClick={handleClearLogs}
                  className="px-2.5 py-1 text-slate-500 hover:text-[#DC143C] font-mono text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  title="Clear event logs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </button>
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
            {!info?.recentLogs || info.recentLogs.length === 0 ? (
              <div className="p-8 text-center font-mono text-xs text-[#64748B] space-y-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Webhook className="w-4 h-4" />
                </div>
                <div>No webhook events logged yet.</div>
                <div className="text-[11px] text-slate-400">
                  Use the Simulator above or trigger an upgrade/payment to see live events stream here in real-time.
                </div>
              </div>
            ) : (
              info.recentLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <div key={log.id} className="p-3.5 hover:bg-slate-50/70 transition-colors">
                    <div 
                      className="flex items-start sm:items-center justify-between gap-3 cursor-pointer"
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                            log.status === 'PROCESSED' || log.status === 'SIMULATED'
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                              : log.status === 'WARNING'
                              ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {log.status}
                          </span>
                          <span className="font-mono text-xs font-bold text-[#0F172A] truncate">
                            {log.eventType}
                          </span>
                          {log.tierName && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-700 font-bold">
                              Tier: {log.tierName}
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-xs text-[#64748B] line-clamp-1">
                          {log.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 text-right font-mono text-xs text-[#64748B]">
                        <span className="text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3 p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] space-y-2 overflow-x-auto shadow-inner">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-slate-400">
                          <span>Event ID: <code className="text-amber-300">{log.eventId}</code></span>
                          <span>Timestamp: {log.timestamp}</span>
                        </div>
                        {log.subscriptionId && (
                          <div className="text-slate-300">
                            Subscription ID: <span className="text-emerald-400 font-bold">{log.subscriptionId}</span>
                          </div>
                        )}
                        {log.targetUid && (
                          <div className="text-slate-300">
                            Target User UID: <span className="text-sky-300">{log.targetUid}</span>
                          </div>
                        )}
                        <div className="pt-1">
                          <span className="text-slate-400 block mb-1">Payload Summary:</span>
                          <pre className="p-2 bg-slate-950 rounded text-slate-300 text-[10px] overflow-x-auto">
                            {JSON.stringify(log.rawEvent || log, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. PAYPAL DEVELOPER SETUP CHECKLIST */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-[#E2E8F0] space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <div className="flex items-center gap-2 text-[#0F172A] font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PayPal Developer Dashboard Setup Guide</span>
            </div>
            <a
              href="https://developer.paypal.com/dashboard/applications/live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#DC143C] hover:underline flex items-center gap-1 font-bold text-[11px]"
            >
              <span>Open PayPal Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2 text-[#64748B] leading-relaxed">
            <div>
              1. Log into your <strong className="text-[#0F172A]">PayPal Developer Dashboard</strong> and open your Live App.
            </div>
            <div>
              2. Under <strong className="text-[#0F172A]">Webhooks</strong>, click <strong className="text-[#0F172A]">Add Webhook</strong>.
            </div>
            <div>
              3. Paste the Webhook URL: <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#DC143C] font-bold">{activeWebhookUrl}</code>
            </div>
            <div>
              4. Select the following subscription & payment events:
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <code>BILLING.SUBSCRIPTION.ACTIVATED</code>
                </div>
                <div className="flex items-center gap-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <code>PAYMENT.SALE.COMPLETED</code>
                </div>
                <div className="flex items-center gap-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <code>BILLING.SUBSCRIPTION.CANCELLED</code>
                </div>
                <div className="flex items-center gap-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <code>BILLING.SUBSCRIPTION.SUSPENDED</code>
                </div>
                <div className="flex items-center gap-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <code>BILLING.SUBSCRIPTION.EXPIRED</code>
                </div>
                <div className="flex items-center gap-1.5 text-[#0F172A]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <code>BILLING.SUBSCRIPTION.UPDATED</code>
                </div>
              </div>
            </div>
            <div>
              5. Click <strong className="text-[#0F172A]">Save</strong> in PayPal. Your application is now fully synchronized with PayPal's recurring billing gateway!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
