import React, { useEffect, useState } from 'react';
import { useAuth } from '../../lib/AuthContext';
import { 
  Shield, 
  ShieldAlert, 
  Lock, 
  LogOut, 
  RefreshCw, 
  DollarSign, 
  Users, 
  TrendingUp, 
  BarChart3, 
  Bot, 
  Activity, 
  Database, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Crown, 
  Server, 
  ArrowUpRight, 
  CreditCard,
  Sliders,
  Send,
  Sparkles,
  MousePointer,
  Eye,
  Zap,
  Globe,
  Ban,
  Trash2,
  UserCheck,
  Check,
  ExternalLink,
  Flame,
  Clock,
  HardDrive
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

const SUPER_USER_EMAIL = 'gurutvamurdia@gmail.com';

export interface AdminMetrics {
  totalUsers: number;
  usersByTier: {
    Starter: number;
    Bunch: number;
    Stack: number;
    Deck: number;
    Collection: number;
  };
  revenueByTier: {
    Starter: number;
    Bunch: number;
    Stack: number;
    Deck: number;
    Collection: number;
  };
  mrr: number;
  arr: number;
  arpu: number;
  arppu: number;
  conversionRate: number;
  subscriptionStatuses: {
    active: number;
    past_due: number;
    canceled: number;
    expired: number;
  };
  funnelData: Array<{
    stepKey: string;
    label: string;
    count: number;
    conversionFromPrev: number;
  }>;
  crawlerStats: {
    googlebot: number;
    gemini: number;
    bingbot: number;
    claude: number;
    gptbot: number;
    otherBots: number;
    totalCrawls: number;
  };
  recentUsers: Array<{
    id: string;
    displayName: string;
    email: string;
    tierName: string;
    createdAt: string;
    isSuperUser?: boolean;
    status?: 'active' | 'suspended';
  }>;
  system: {
    uptimeSeconds: number;
    memoryUsageMB: {
      rss: number;
      heapTotal: number;
      heapUsed: number;
    };
    tcgCatalogStatus: {
      totalCardsCached: number;
      totalExpansions: number;
      isSyncing: boolean;
    };
    recentWebhookCount: number;
  };
}

export interface CloudflareAnalytics {
  provider: string;
  domain: string;
  timeframe: string;
  status: string;
  metrics: {
    totalRequests: number;
    uniqueVisitors: number;
    bandwidthBytes: number;
    edgeCacheHitRatio: number;
    threatBlocks: number;
    statusCodes: Record<string, number>;
    topCountries: Array<{ country: string; code: string; requests: number; share: number }>;
    botCrawlerVisits: Record<string, number>;
  };
}

export interface ClarityAnalytics {
  provider: string;
  projectId: string;
  dashboardUrl: string;
  status: string;
  insights: {
    activeSessionsToday: number;
    avgSessionDurationSeconds: number;
    pagesPerSession: number;
    scrollDepthPercent: number;
    userFriction: {
      deadClicks: number;
      rageClicks: number;
      quickBacks: number;
      excessiveScrolling: number;
    };
    deviceBreakdown: {
      desktop: number;
      mobile: number;
      tablet: number;
    };
    topHeatmapPages: Array<{ path: string; title: string; clicks: number; scrollPct: number }>;
  };
}

export interface DiagnosticDependency {
  name: string;
  category: string;
  status: 'healthy' | 'degraded' | 'down' | 'configured';
  latencyMs?: number;
  details: Record<string, any>;
}

export interface DiagnosticsResponse {
  timestamp: string;
  totalCheckTimeMs: number;
  dependencies: Record<string, DiagnosticDependency>;
}

const TIER_PRICES = {
  Starter: 0,
  Bunch: 11,
  Stack: 22,
  Deck: 33,
  Collection: 44,
};

const TIER_COLORS = {
  Starter: '#94A3B8',
  Bunch: '#3B82F6',
  Stack: '#8B5CF6',
  Deck: '#EC4899',
  Collection: '#DC143C',
};

export const AdminDashboardView: React.FC = () => {
  const { user, profile, loading: authLoading, signInWithGoogle, signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'financials' | 'analytics' | 'users' | 'sync' | 'seo' | 'system'>('financials');
  
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Cloudflare & Clarity Analytics State
  const [cfData, setCfData] = useState<CloudflareAnalytics | null>(null);
  const [clarityData, setClarityData] = useState<ClarityAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Feature Flags & Audit Logs State
  const [featureFlags, setFeatureFlags] = useState({
    maintenanceMode: false,
    aiFeaturesEnabled: true,
    paypalLiveMode: true,
    strictRateLimiting: true,
    publicRegistrations: true,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Diagnostics State
  const [diagnosticsData, setDiagnosticsData] = useState<DiagnosticsResponse | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState<boolean>(false);

  // User Management State
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  const [newTierChoice, setNewTierChoice] = useState<string>('Starter');
  const [updatingTier, setUpdatingTier] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // SEO IndexNow state
  const [indexNowStatus, setIndexNowStatus] = useState<string | null>(null);
  const [pingingIndexNow, setPingingIndexNow] = useState(false);

  const isSuperUser = (user?.email || '').toLowerCase() === SUPER_USER_EMAIL;

  const fetchAdminMetrics = async () => {
    if (!user || !isSuperUser) return;
    setLoadingMetrics(true);
    setErrorMsg(null);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/metrics', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Failed to fetch admin metrics (${res.status})`);
      }

      const data: AdminMetrics = await res.json();
      setMetrics(data);
      setLastRefreshed(new Date());
    } catch (err: any) {
      console.error('Error fetching admin metrics:', err);
      setErrorMsg(err.message || 'Error loading dashboard metrics.');
    } finally {
      setLoadingMetrics(false);
    }
  };

  const fetchAnalytics = async () => {
    if (!user || !isSuperUser) return;
    setLoadingAnalytics(true);
    try {
      const idToken = await user.getIdToken();
      const [cfRes, clarityRes] = await Promise.all([
        fetch('/api/admin/analytics/cloudflare', { headers: { Authorization: `Bearer ${idToken}` } }),
        fetch('/api/admin/analytics/clarity', { headers: { Authorization: `Bearer ${idToken}` } })
      ]);
      if (cfRes.ok) setCfData(await cfRes.json());
      if (clarityRes.ok) setClarityData(await clarityRes.json());
    } catch (e) {
      console.error('Failed to fetch analytics:', e);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchFeatureFlagsAndLogs = async () => {
    if (!user || !isSuperUser) return;
    try {
      const idToken = await user.getIdToken();
      const [flagsRes, logsRes] = await Promise.all([
        fetch('/api/admin/feature-flags', { headers: { Authorization: `Bearer ${idToken}` } }),
        fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${idToken}` } })
      ]);
      if (flagsRes.ok) setFeatureFlags(await flagsRes.json());
      if (logsRes.ok) setAuditLogs(await logsRes.json());
    } catch (e) {
      console.error('Failed to fetch flags/logs:', e);
    }
  };

  const fetchDiagnostics = async () => {
    if (!user || !isSuperUser) return;
    setLoadingDiagnostics(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/diagnostics', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        setDiagnosticsData(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch system diagnostics:', err);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    if (user && isSuperUser) {
      fetchAdminMetrics();
      fetchAnalytics();
      fetchFeatureFlagsAndLogs();
    }
  }, [user, isSuperUser]);

  useEffect(() => {
    if (user && isSuperUser && activeTab === 'system') {
      fetchDiagnostics();
    }
  }, [user, isSuperUser, activeTab]);

  // Admin Control Handlers
  const handleUpdateUserTier = async () => {
    if (!selectedUserForEdit || !user) return;
    setUpdatingTier(true);
    setActionSuccessMsg(null);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/user/tier', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUid: selectedUserForEdit.id,
          tierName: newTierChoice,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update user tier');
      }

      setActionSuccessMsg(`Updated tier for ${selectedUserForEdit.email} to ${newTierChoice}`);
      setSelectedUserForEdit(null);
      fetchAdminMetrics();
      fetchFeatureFlagsAndLogs();
    } catch (err: any) {
      alert(err.message || 'Failed to update tier.');
    } finally {
      setUpdatingTier(false);
    }
  };

  const handleToggleUserStatus = async (targetUid: string, currentStatus?: string) => {
    if (!user) return;
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/user/status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUid, status: nextStatus }),
      });
      if (res.ok) {
        setActionSuccessMsg(`User status changed to ${nextStatus}`);
        fetchAdminMetrics();
        fetchFeatureFlagsAndLogs();
      }
    } catch (e: any) {
      alert('Error changing user status');
    }
  };

  const handleDeleteUser = async (targetUid: string, email: string) => {
    if (!user || !window.confirm(`Are you sure you want to delete user ${email}?`)) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/user/delete', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUid }),
      });
      if (res.ok) {
        setActionSuccessMsg(`User ${email} deleted.`);
        fetchAdminMetrics();
        fetchFeatureFlagsAndLogs();
      }
    } catch (e: any) {
      alert('Error deleting user');
    }
  };

  const handleToggleFlag = async (flagKey: keyof typeof featureFlags) => {
    if (!user) return;
    const updated = { ...featureFlags, [flagKey]: !featureFlags[flagKey] };
    setFeatureFlags(updated);
    try {
      const idToken = await user.getIdToken();
      await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      });
      fetchFeatureFlagsAndLogs();
    } catch (e) {
      console.error('Failed to update flag:', e);
    }
  };

  const handleManualSync = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/manual-sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        setActionSuccessMsg('Catalog price sync task queued successfully.');
      }
    } catch (e) {
      alert('Sync trigger failed');
    }
  };

  const handlePurgeCache = async () => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/cache/purge', {
        method: 'POST',
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        setActionSuccessMsg('Server RAM & Exchange Rate cache invalidated.');
        fetchAdminMetrics();
      }
    } catch (e) {
      alert('Cache purge failed');
    }
  };

  const handlePingIndexNow = async () => {
    setPingingIndexNow(true);
    setIndexNowStatus(null);
    try {
      const res = await fetch('/api/admin/ping-indexnow', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setIndexNowStatus(`IndexNow Ping Success! (${json.submittedCount} URLs submitted to Bing & Yandex)`);
      } else {
        setIndexNowStatus(`IndexNow response: ${json.message || 'Complete'}`);
      }
    } catch (e: any) {
      setIndexNowStatus('Failed to send IndexNow ping.');
    } finally {
      setPingingIndexNow(false);
    }
  };

  // Auth Guard 1: Loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dot-grid text-[#0F172A]">
        <div className="flex flex-col items-center gap-3">
          <Shield className="w-10 h-10 text-[#DC143C] animate-pulse" />
          <p className="text-sm font-semibold tracking-wide text-[#64748B] font-mono">Authenticating Admin Gateway...</p>
        </div>
      </div>
    );
  }

  // Auth Guard 2: Unauthenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dot-grid p-4 text-[#0F172A]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-xl text-center"
        >
          <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-[#DC143C]" />
          </div>

          <span className="inline-block px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-mono font-bold text-[#DC143C] uppercase tracking-widest mb-3">
            Gated Admin Gateway
          </span>

          <h1 className="text-2xl font-black tracking-tight text-[#0F172A] font-heading mb-2">
            Super Admin Access
          </h1>
          <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
            This dashboard contains confidential platform metrics, user controls, and live analytics. Sign in with Google to verify credentials.
          </p>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 bg-[#0F172A] hover:bg-[#1E293B] text-white font-mono font-bold text-xs py-3.5 px-6 rounded-xl shadow-xs transition-all active:scale-[0.98]"
          >
            <Shield className="w-4 h-4 text-[#DC143C]" />
            Sign in as Super Admin
          </button>
        </motion.div>
      </div>
    );
  }

  // Auth Guard 3: Non-SuperUser
  if (!isSuperUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dot-grid p-4 text-[#0F172A]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white border border-red-200 rounded-2xl p-8 shadow-xl text-center"
        >
          <div className="w-14 h-14 bg-red-100 border border-red-300 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-7 h-7 text-red-600" />
          </div>

          <h1 className="text-xl font-bold tracking-tight text-[#0F172A] font-heading mb-2">
            Access Denied
          </h1>
          <p className="text-xs font-mono text-[#64748B] bg-slate-50 p-3 rounded-lg border border-slate-200 mb-6 break-all">
            Authenticated: {user.email}
          </p>
          <p className="text-xs text-[#64748B] mb-6">
            Only <span className="font-bold text-[#DC143C]">{SUPER_USER_EMAIL}</span> holds primary administrative credentials for this system.
          </p>

          <button
            onClick={() => signOutUser()}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] font-mono font-bold text-xs py-3 px-6 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Switch Account
          </button>
        </motion.div>
      </div>
    );
  }

  // Filtered users for User Management tab
  const filteredUsers = (metrics?.recentUsers || []).filter(u => {
    const matchesQuery = 
      (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || u.tierName === tierFilter;
    return matchesQuery && matchesTier;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Top Header Control Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#DC143C] text-white rounded-xl flex items-center justify-center shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-[#0F172A] font-heading">
                  Super Admin Command Gateway
                </h1>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Live Controls
                </span>
              </div>
              <p className="text-xs font-mono text-[#64748B]">
                Authenticated as: <span className="font-bold text-[#0F172A]">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastRefreshed && (
              <span className="hidden sm:inline-block text-[11px] font-mono text-[#64748B]">
                Synced: {lastRefreshed.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => {
                fetchAdminMetrics();
                fetchAnalytics();
                fetchFeatureFlagsAndLogs();
              }}
              disabled={loadingMetrics}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
            <button
              onClick={() => signOutUser()}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-[#DC143C] border border-red-200 rounded-lg text-xs font-mono font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Success Action Banner */}
        {actionSuccessMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs font-mono text-emerald-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{actionSuccessMsg}</span>
            </div>
            <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E2E8F0] scrollbar-none">
          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'financials'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Financials & MRR
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Cloudflare & Clarity Analytics
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'users'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Users className="w-4 h-4" />
            User Management & Access
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'sync'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Database className="w-4 h-4" />
            Catalog & Cache Ops
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'seo'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Globe className="w-4 h-4" />
            SEO & IndexNow
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'system'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Feature Flags & Audit Logs
          </button>
        </div>

        {/* TAB 1: FINANCIALS */}
        {activeTab === 'financials' && metrics && (
          <div className="space-y-8">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">Monthly Recurring Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-[#0F172A] font-heading">${metrics.mrr.toLocaleString()}</div>
                <p className="text-xs text-[#64748B] mt-1 font-mono">ARR: ${(metrics.arr).toLocaleString()}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">Active Collectors</span>
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-[#0F172A] font-heading">{metrics.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-[#64748B] mt-1 font-mono">Registered accounts in DB</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">ARPU / ARPPU</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-[#0F172A] font-heading">${metrics.arpu}</div>
                <p className="text-xs text-[#64748B] mt-1 font-mono">ARPPU: ${metrics.arppu}</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase text-[#64748B]">Paid Conversion</span>
                  <Activity className="w-4 h-4 text-[#DC143C]" />
                </div>
                <div className="text-3xl font-black text-[#0F172A] font-heading">{metrics.conversionRate}%</div>
                <p className="text-xs text-[#64748B] mt-1 font-mono">Active paid subscriber share</p>
              </div>
            </div>

            {/* Revenue Breakdown Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <h2 className="text-base font-bold text-[#0F172A] font-heading mb-4">Collectors by Tier</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(metrics.usersByTier).map(([tier, count]) => ({ tier, count }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="tier" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#0F172A" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <h2 className="text-base font-bold text-[#0F172A] font-heading mb-4">Monthly Revenue by Tier</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(metrics.revenueByTier).map(([tier, rev]) => ({ name: tier, value: rev }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {Object.keys(metrics.revenueByTier).map((tier, idx) => (
                          <Cell key={tier} fill={Object.values(TIER_COLORS)[idx % 5]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMBINED REALTIME ANALYTICS (Cloudflare + Microsoft Clarity) */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h2 className="text-lg font-black font-heading tracking-tight">Combined Realtime Edge & Behavior Studio</h2>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl font-sans">
                  Integrating low-latency <span className="text-amber-300 font-bold">Cloudflare Edge Web Analytics</span> with <span className="text-cyan-300 font-bold">Microsoft Clarity Session Recording & Heatmaps</span>. Zero mock data.
                </p>
              </div>

              <a
                href="https://clarity.ms/projects/view/ydjpckkq0v/dashboard"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Launch Microsoft Clarity
              </a>
            </div>

            {/* Cloudflare Edge Metrics Row */}
            {cfData && (
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-base text-[#0F172A] font-heading">Cloudflare Edge Web Analytics</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-mono font-bold rounded-md">
                    Edge Cache Hit: {cfData.metrics.edgeCacheHitRatio}%
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Edge Requests (24h)</span>
                    <div className="text-2xl font-black text-[#0F172A] font-heading mt-1">{cfData.metrics.totalRequests.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Unique Visitors</span>
                    <div className="text-2xl font-black text-[#0F172A] font-heading mt-1">{cfData.metrics.uniqueVisitors.toLocaleString()}</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Edge Bandwidth</span>
                    <div className="text-2xl font-black text-[#0F172A] font-heading mt-1">{(cfData.metrics.bandwidthBytes / (1024 * 1024)).toFixed(1)} MB</div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Threat Blocks</span>
                    <div className="text-2xl font-black text-emerald-600 font-heading mt-1">{cfData.metrics.threatBlocks}</div>
                  </div>
                </div>

                {/* HTTP Status Code Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-600 mb-3">HTTP Response Status Codes</h4>
                    <div className="space-y-2 text-xs font-mono">
                      {Object.entries(cfData.metrics.statusCodes).map(([code, count]) => (
                        <div key={code} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="font-bold text-slate-700">{code} Responses</span>
                          <span className="text-slate-900 font-bold">{count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono font-bold text-slate-600 mb-3">Top Country Visitor Demographics</h4>
                    <div className="space-y-2 text-xs font-mono">
                      {cfData.metrics.topCountries.map((c) => (
                        <div key={c.code} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-700">{c.country} ({c.code})</span>
                          <span className="font-bold text-slate-900">{c.share}% ({c.requests.toLocaleString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Microsoft Clarity Insights Section */}
            {clarityData && (
              <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-bold text-base text-[#0F172A] font-heading">Microsoft Clarity Session Recording & Friction</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-cyan-50 border border-cyan-200 text-cyan-800 text-[10px] font-mono font-bold rounded-md">
                    Tag ID: {clarityData.projectId}
                  </span>
                </div>

                {/* Friction Indicators Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-red-700 uppercase">Rage Clicks</span>
                    <div className="text-2xl font-black text-red-900 font-heading mt-1">{clarityData.insights.userFriction.rageClicks}</div>
                    <span className="text-[10px] text-red-600 font-mono">Repeated rapid clicks</span>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Dead Clicks</span>
                    <div className="text-2xl font-black text-amber-900 font-heading mt-1">{clarityData.insights.userFriction.deadClicks}</div>
                    <span className="text-[10px] text-amber-600 font-mono">Clicks with zero outcome</span>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">Quick Backs</span>
                    <div className="text-2xl font-black text-blue-900 font-heading mt-1">{clarityData.insights.userFriction.quickBacks}</div>
                    <span className="text-[10px] text-blue-600 font-mono">Immediate page bounce</span>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                    <span className="text-[10px] font-mono font-bold text-purple-700 uppercase">Avg Session Duration</span>
                    <div className="text-2xl font-black text-purple-900 font-heading mt-1">{clarityData.insights.avgSessionDurationSeconds}s</div>
                    <span className="text-[10px] text-purple-600 font-mono">Pages/Session: {clarityData.insights.pagesPerSession}</span>
                  </div>
                </div>

                {/* Top Heatmap Click Pages */}
                <div>
                  <h4 className="text-xs font-mono font-bold text-slate-600 mb-3">Top Heatmap Clicked Viewports</h4>
                  <div className="space-y-2">
                    {clarityData.insights.topHeatmapPages.map((hp) => (
                      <div key={hp.path} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                        <div>
                          <p className="font-bold text-[#0F172A]">{hp.title}</p>
                          <p className="font-mono text-slate-500 text-[11px]">{hp.path}</p>
                        </div>
                        <div className="text-right font-mono">
                          <span className="font-bold text-cyan-700">{hp.clicks.toLocaleString()} clicks</span>
                          <p className="text-[10px] text-slate-500">{hp.scrollPct}% scroll depth</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT & ACCESS RIGHTS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-[#0F172A] font-heading">User Directory & Operational Access</h2>
                  <p className="text-xs text-[#64748B] font-mono">Inspect, update tiers, suspend, or manage collector accounts.</p>
                </div>

                {/* Search & Filter Controls */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search email, name or UID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F172A] w-64"
                    />
                  </div>

                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F172A]"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Starter">Starter</option>
                    <option value="Bunch">Bunch ($11)</option>
                    <option value="Stack">Stack ($22)</option>
                    <option value="Deck">Deck ($33)</option>
                    <option value="Collection">Collection ($44)</option>
                  </select>
                </div>
              </div>

              {/* User List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px]">
                      <th className="p-3">User / Identity</th>
                      <th className="p-3">Current Tier</th>
                      <th className="p-3">Created</th>
                      <th className="p-3">Account Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <p className="font-bold text-[#0F172A]">{u.displayName || 'Collector'}</p>
                          <p className="text-[#64748B] text-[11px]">{u.email}</p>
                          <p className="text-[10px] text-slate-400 font-mono">UID: {u.id}</p>
                        </td>

                        <td className="p-3">
                          <span
                            className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider"
                            style={{ backgroundColor: TIER_COLORS[u.tierName as keyof typeof TIER_COLORS] || '#64748B' }}
                          >
                            {u.tierName || 'Starter'}
                          </span>
                        </td>

                        <td className="p-3 text-slate-600">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="p-3">
                          {u.status === 'suspended' ? (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded text-[10px] font-bold">
                              Suspended
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUserForEdit(u);
                              setNewTierChoice(u.tierName || 'Starter');
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-[11px] font-bold transition-all"
                          >
                            Edit Tier
                          </button>

                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                              u.status === 'suspended'
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            }`}
                          >
                            {u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-[11px] font-bold transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for Edit User Tier */}
            <AnimatePresence>
              {selectedUserForEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl border border-slate-200 p-6 max-w-md w-full shadow-2xl"
                  >
                    <h3 className="text-base font-bold text-[#0F172A] font-heading mb-1">
                      Modify User Tier
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mb-4">
                      Target User: <span className="font-bold text-[#0F172A]">{selectedUserForEdit.email}</span>
                    </p>

                    <div className="space-y-3 mb-6">
                      {['Starter', 'Bunch', 'Stack', 'Deck', 'Collection'].map((tier) => (
                        <label
                          key={tier}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                            newTierChoice === tier
                              ? 'border-[#0F172A] bg-slate-50 font-bold'
                              : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="tierRadio"
                              checked={newTierChoice === tier}
                              onChange={() => setNewTierChoice(tier)}
                            />
                            <span>{tier}</span>
                          </div>
                          <span className="text-slate-500">${TIER_PRICES[tier as keyof typeof TIER_PRICES]}/mo</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setSelectedUserForEdit(null)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateUserTier}
                        disabled={updatingTier}
                        className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-mono font-bold rounded-xl shadow-xs disabled:opacity-50"
                      >
                        {updatingTier ? 'Saving...' : 'Confirm Tier Upgrade'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 4: CATALOG & CACHE OPERATIONAL CONTROLS */}
        {activeTab === 'sync' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-base font-bold text-[#0F172A] font-heading mb-1">TCG Catalog & Cache Control Center</h2>
              <p className="text-xs text-slate-500 font-mono mb-6">Trigger on-demand market price syncs or clear stale memory caches.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-sm text-[#0F172A]">TCGplayer & Pokemon TCG Sync</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">
                    Re-indexes all expansion set checklists, variant card IDs, and live market prices.
                  </p>
                  <button
                    onClick={handleManualSync}
                    className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Trigger Catalog Price Sync
                  </button>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <HardDrive className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-sm text-[#0F172A]">Server RAM & Forex Cache Purge</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-4">
                    Clears server memory caches, active search index buffers, and currency conversion rate tables.
                  </p>
                  <button
                    onClick={handlePurgeCache}
                    className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Purge All Server Memory Caches
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SEO & INDEXNOW */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-[#0F172A] font-heading">IndexNow Direct Search Engine Pings</h2>
                  <p className="text-xs text-slate-500 font-mono">Submit footprint URLs directly to Bing, Yandex, Seznam, and Naver.</p>
                </div>

                <button
                  onClick={handlePingIndexNow}
                  disabled={pingingIndexNow}
                  className="flex items-center gap-2 bg-[#0F172A] hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 ${pingingIndexNow ? 'animate-bounce' : ''}`} />
                  Push All URLs to IndexNow
                </button>
              </div>

              {indexNowStatus && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs font-mono text-blue-900 mb-6">
                  {indexNowStatus}
                </div>
              )}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-2">
                <p className="font-bold text-slate-700">Footprint Key URL:</p>
                <p className="text-slate-600">https://deckdivider.app/7392abcd.txt</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FEATURE FLAGS & SYSTEM AUDIT LOGS */}
        {activeTab === 'system' && (
          <div className="space-y-8">
            {/* Feature Flags Section */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-base font-bold text-[#0F172A] font-heading mb-4">System Operational Feature Flags</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(featureFlags).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                      <p className="font-mono text-xs font-bold text-[#0F172A] uppercase">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-[10px] text-slate-500 font-mono">Current state: {value ? 'ENABLED' : 'DISABLED'}</p>
                    </div>
                    <button
                      onClick={() => handleToggleFlag(key as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        value ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {value ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
              <h2 className="text-base font-bold text-[#0F172A] font-heading mb-4">Admin Audit Trail Logs</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[10px]">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Admin Email</th>
                      <th className="p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-3 font-bold text-[#0F172A]">{log.action}</td>
                        <td className="p-3 text-slate-600">{log.adminEmail}</td>
                        <td className="p-3 text-[#64748B] font-mono text-[11px]">{JSON.stringify(log.details)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
