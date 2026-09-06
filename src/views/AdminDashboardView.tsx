import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/AuthContext';
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
  Sparkles
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
  const [activeTab, setActiveTab] = useState<'financials' | 'traffic' | 'users' | 'system'>('financials');
  
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // Diagnostics State
  const [diagnosticsData, setDiagnosticsData] = useState<DiagnosticsResponse | null>(null);
  const [loadingDiagnostics, setLoadingDiagnostics] = useState<boolean>(false);

  // User management search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  const [newTierChoice, setNewTierChoice] = useState<string>('Starter');
  const [updatingTier, setUpdatingTier] = useState(false);
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState<string | null>(null);

  const isSuperUser = (user?.email || '').toLowerCase() === SUPER_USER_EMAIL;

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
        const data = await res.json();
        setDiagnosticsData(data);
      }
    } catch (err) {
      console.error('Failed to fetch system diagnostics:', err);
    } finally {
      setLoadingDiagnostics(false);
    }
  };

  useEffect(() => {
    if (user && isSuperUser && activeTab === 'system') {
      fetchDiagnostics();
    }
  }, [user, isSuperUser, activeTab]);

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

  useEffect(() => {
    if (user && isSuperUser) {
      fetchAdminMetrics();
    }
  }, [user, isSuperUser]);

  const handleUpdateUserTier = async () => {
    if (!selectedUserForEdit || !user) return;
    setUpdatingTier(true);
    setUpdateSuccessMsg(null);
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

      setUpdateSuccessMsg(`Successfully updated tier for ${selectedUserForEdit.email} to ${newTierChoice}`);
      setSelectedUserForEdit(null);
      fetchAdminMetrics();
    } catch (err: any) {
      alert(err.message || 'Failed to update tier.');
    } finally {
      setUpdatingTier(false);
    }
  };

  // Auth Guard 1: Loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
        <div className="flex flex-col items-center gap-3">
          <Shield className="w-10 h-10 text-[#DC143C] animate-pulse" />
          <p className="text-sm font-semibold tracking-wide text-slate-300">Authenticating Admin Gateway...</p>
        </div>
      </div>
    );
  }

  // Auth Guard 2: Unauthenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 text-slate-100">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center"
        >
          <div className="w-14 h-14 bg-red-950/50 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-[#DC143C]" />
          </div>

          <span className="inline-block px-3 py-1 bg-red-950/60 border border-red-500/30 rounded-full text-xs font-mono font-bold text-red-400 uppercase tracking-widest mb-3">
            Gated Admin Gateway
          </span>

          <h1 className="text-2xl font-black tracking-tight text-white mb-2">
            Super Admin Access
          </h1>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            This dashboard contains confidential platform metrics, user data, and financial performance. Sign in with Google to verify credentials.
          </p>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google OAuth
          </button>
        </motion.div>
      </div>
    );
  }

  // Auth Guard 3: Non-Super-User
  if (!isSuperUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-4 text-slate-100">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl text-center"
        >
          <div className="w-14 h-14 bg-red-950 border border-red-500/50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-500">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-300 text-sm mb-6">
            <span className="text-red-400 font-bold block mb-1">Unauthorized Email</span>
            Signed in as <strong className="text-white">{user.email}</strong>. This account does not have authorization to access the admin gateway.
          </p>

          <button
            onClick={() => signOutUser()}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out & Switch Account
          </button>
        </motion.div>
      </div>
    );
  }

  // Calculate tier distributions for charts
  const tierDistributionData = metrics ? [
    { name: 'Starter ($0)', value: metrics.usersByTier.Starter, revenue: 0, color: TIER_COLORS.Starter },
    { name: 'Bunch ($11)', value: metrics.usersByTier.Bunch, revenue: metrics.revenueByTier.Bunch, color: TIER_COLORS.Bunch },
    { name: 'Stack ($22)', value: metrics.usersByTier.Stack, revenue: metrics.revenueByTier.Stack, color: TIER_COLORS.Stack },
    { name: 'Deck ($33)', value: metrics.usersByTier.Deck, revenue: metrics.revenueByTier.Deck, color: TIER_COLORS.Deck },
    { name: 'Collection ($44)', value: metrics.usersByTier.Collection, revenue: metrics.revenueByTier.Collection, color: TIER_COLORS.Collection },
  ] : [];

  const filteredUsers = (metrics?.recentUsers || []).filter(u => {
    const matchesSearch = u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || u.tierName.toLowerCase() === tierFilter.toLowerCase();
    return matchesSearch && matchesTier;
  });

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans antialiased selection:bg-[#DC143C] selection:text-white pb-16">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-950/80 border border-red-500/40 rounded-xl text-[#DC143C]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">DECK / divider</h1>
                <span className="px-2 py-0.5 bg-red-950 border border-red-500/40 text-[#DC143C] text-[10px] font-mono font-bold uppercase rounded">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-slate-400">Institutional SaaS Executive Panel</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={fetchAdminMetrics}
              disabled={loadingMetrics}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? 'animate-spin' : ''}`} />
              {loadingMetrics ? 'Refreshing...' : 'Refresh Metrics'}
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-300">{user.email}</span>
            </div>

            <button
              onClick={() => signOutUser()}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="max-w-7xl mx-auto mt-4 border-t border-slate-800/80 pt-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('financials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'financials'
                ? 'bg-[#DC143C] text-white shadow-lg shadow-red-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Financials &amp; Revenue ($0-$44)
          </button>

          <button
            onClick={() => setActiveTab('traffic')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'traffic'
                ? 'bg-[#DC143C] text-white shadow-lg shadow-red-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Web Traffic &amp; Funnel Analytics
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-[#DC143C] text-white shadow-lg shadow-red-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            User Directory &amp; Tier Controls
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'system'
                ? 'bg-[#DC143C] text-white shadow-lg shadow-red-900/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Server className="w-4 h-4" />
            System Diagnostics &amp; Webhooks
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-500/40 rounded-2xl flex items-center gap-3 text-red-200 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div>
              <p className="font-semibold">Metrics Load Issue</p>
              <p className="text-xs text-red-300">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* TAB 1: FINANCIALS & REVENUE */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* Top SaaS KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block mb-1">Total Users</span>
                <span className="text-2xl font-black text-white">{metrics?.totalUsers ?? '—'}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Registered Accounts</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block mb-1">MRR (Monthly)</span>
                <span className="text-2xl font-black text-emerald-400">${metrics?.mrr?.toLocaleString() ?? '0'}</span>
                <span className="text-[10px] text-emerald-500/80 block mt-1">Recurring Run Rate</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block mb-1">ARR (Annualized)</span>
                <span className="text-2xl font-black text-emerald-300">${metrics?.arr?.toLocaleString() ?? '0'}</span>
                <span className="text-[10px] text-slate-500 block mt-1">MRR &times; 12</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block mb-1">ARPU</span>
                <span className="text-2xl font-black text-indigo-400">${metrics?.arpu?.toFixed(2) ?? '0.00'}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Avg / All Users</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block mb-1">ARPPU</span>
                <span className="text-2xl font-black text-purple-400">${metrics?.arppu?.toFixed(2) ?? '0.00'}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Avg / Paid Users</span>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                <span className="text-xs text-slate-400 font-medium block mb-1">Conversion Rate</span>
                <span className="text-2xl font-black text-[#DC143C]">{metrics?.conversionRate?.toFixed(1) ?? '0.0'}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">Paid / Total Ratio</span>
              </div>
            </div>

            {/* 5 Tiers Detailed Revenue Matrix */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#DC143C]" />
                    5-Tier Pricing Matrix &amp; Revenue Breakdown
                  </h2>
                  <p className="text-xs text-slate-400">User distribution and MRR generation across Starter ($0), Bunch ($11), Stack ($22), Deck ($33), and Collection ($44)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Starter Tier */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
                  <div className="w-1.5 h-full bg-slate-500 absolute left-0 top-0" />
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">Starter Tier</span>
                  <span className="text-xs text-slate-500 block mb-2">$0 / mo (Free)</span>
                  <span className="text-2xl font-black text-white">{metrics?.usersByTier.Starter ?? 0}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Users</span>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-slate-500">MRR Share:</span>
                    <span className="font-bold text-slate-300">$0</span>
                  </div>
                </div>

                {/* Bunch Tier */}
                <div className="bg-slate-950 border border-blue-500/30 rounded-xl p-4 relative overflow-hidden">
                  <div className="w-1.5 h-full bg-blue-500 absolute left-0 top-0" />
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider block">Bunch Tier</span>
                  <span className="text-xs text-blue-300/80 block mb-2">$11 / mo</span>
                  <span className="text-2xl font-black text-white">{metrics?.usersByTier.Bunch ?? 0}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Paying Subscribers</span>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-slate-500">MRR Generated:</span>
                    <span className="font-bold text-blue-400">${metrics?.revenueByTier.Bunch ?? 0}</span>
                  </div>
                </div>

                {/* Stack Tier */}
                <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-4 relative overflow-hidden">
                  <div className="w-1.5 h-full bg-purple-500 absolute left-0 top-0" />
                  <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">Stack Tier</span>
                  <span className="text-xs text-purple-300/80 block mb-2">$22 / mo</span>
                  <span className="text-2xl font-black text-white">{metrics?.usersByTier.Stack ?? 0}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Paying Subscribers</span>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-slate-500">MRR Generated:</span>
                    <span className="font-bold text-purple-400">${metrics?.revenueByTier.Stack ?? 0}</span>
                  </div>
                </div>

                {/* Deck Tier */}
                <div className="bg-slate-950 border border-pink-500/30 rounded-xl p-4 relative overflow-hidden">
                  <div className="w-1.5 h-full bg-pink-500 absolute left-0 top-0" />
                  <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider block">Deck Tier</span>
                  <span className="text-xs text-pink-300/80 block mb-2">$33 / mo</span>
                  <span className="text-2xl font-black text-white">{metrics?.usersByTier.Deck ?? 0}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Paying Subscribers</span>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-slate-500">MRR Generated:</span>
                    <span className="font-bold text-pink-400">${metrics?.revenueByTier.Deck ?? 0}</span>
                  </div>
                </div>

                {/* Collection Tier */}
                <div className="bg-slate-950 border border-red-500/40 rounded-xl p-4 relative overflow-hidden">
                  <div className="w-1.5 h-full bg-[#DC143C] absolute left-0 top-0" />
                  <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider block">Collection Tier</span>
                  <span className="text-xs text-red-300/80 block mb-2">$44 / mo</span>
                  <span className="text-2xl font-black text-white">{metrics?.usersByTier.Collection ?? 0}</span>
                  <span className="text-[11px] text-slate-400 block mt-1">Paying Subscribers</span>
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs">
                    <span className="text-slate-500">MRR Generated:</span>
                    <span className="font-bold text-red-400">${metrics?.revenueByTier.Collection ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recharts Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">User Count Comparison Across 5 Tiers</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tierDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                      <YAxis stroke="#64748B" fontSize={11} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} 
                        formatter={(val: any) => [val, 'Users']}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {tierDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Monthly Recurring Revenue Share by Tier</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tierDistributionData.filter(d => d.revenue > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="revenue"
                        label={(entry: any) => `${entry.name ? entry.name.split(' ')[0] : ''}: $${entry.revenue || 0}`}
                      >
                        {tierDistributionData.map((entry, index) => (
                          <Cell key={`cell-pie-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WEB TRAFFIC & FUNNEL ANALYTICS */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            {/* Conversion Funnel Bar Chart & Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  7-Stage Conversion Funnel
                </h2>
                <p className="text-xs text-slate-400">Step-by-step visitor progression from initial landing to core feature action</p>
              </div>

              <div className="h-72 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics?.funnelData || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis type="number" stroke="#64748B" fontSize={11} />
                    <YAxis dataKey="label" type="category" stroke="#94A3B8" fontSize={11} width={130} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="#3B82F6" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Step Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-3">Stage #</th>
                      <th className="p-3">Funnel Step</th>
                      <th className="p-3 text-right">Unique Sessions</th>
                      <th className="p-3 text-right">Conversion from Prev</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {(metrics?.funnelData || []).map((step, idx) => (
                      <tr key={step.stepKey} className="hover:bg-slate-800/40">
                        <td className="p-3 font-mono font-bold text-slate-500">Step {idx + 1}</td>
                        <td className="p-3 font-semibold text-white">{step.label}</td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-400">{step.count}</td>
                        <td className="p-3 text-right font-mono text-slate-300">
                          {idx === 0 ? '100%' : `${step.conversionFromPrev}%`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Chatbot & Crawler Traffic Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-emerald-400" />
                  AI Chatbot &amp; Search Engine Crawler Activity
                </h2>
                <p className="text-xs text-slate-400">Hits detected from AI agents and search indexing bots requesting SSR HTML</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-400 block">Googlebot</span>
                  <span className="text-xl font-bold text-white">{metrics?.crawlerStats.googlebot ?? 0}</span>
                </div>

                <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-emerald-400 font-bold block">Gemini / Google-Ext</span>
                  <span className="text-xl font-bold text-emerald-400">{metrics?.crawlerStats.gemini ?? 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-400 block">Bingbot</span>
                  <span className="text-xl font-bold text-white">{metrics?.crawlerStats.bingbot ?? 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-400 block">ClaudeBot</span>
                  <span className="text-xl font-bold text-white">{metrics?.crawlerStats.claude ?? 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-400 block">GPTBot</span>
                  <span className="text-xl font-bold text-white">{metrics?.crawlerStats.gptbot ?? 0}</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                  <span className="text-[11px] text-slate-400 block">Total Crawls</span>
                  <span className="text-xl font-bold text-[#DC143C]">{metrics?.crawlerStats.totalCrawls ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: USER DIRECTORY & TIER CONTROLS */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {updateSuccessMsg && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-emerald-200 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{updateSuccessMsg}</span>
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    User Directory &amp; Tier Management
                  </h2>
                  <p className="text-xs text-slate-400">Filter, inspect accounts, and promote/demote subscription tiers</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search email or name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#DC143C]"
                    />
                  </div>

                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-[#DC143C]"
                  >
                    <option value="all">All Tiers</option>
                    <option value="starter">Starter ($0)</option>
                    <option value="bunch">Bunch ($11)</option>
                    <option value="stack">Stack ($22)</option>
                    <option value="deck">Deck ($33)</option>
                    <option value="collection">Collection ($44)</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-3">User</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3">Current Tier</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          No users matched your query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-800/40">
                          <td className="p-3 font-semibold text-white flex items-center gap-2">
                            {u.isSuperUser && (
                              <span title="Super User">
                                <Crown className="w-3.5 h-3.5 text-[#DC143C]" />
                              </span>
                            )}
                            {u.displayName || 'Collector'}
                          </td>
                          <td className="p-3 font-mono text-slate-300">{u.email}</td>
                          <td className="p-3 text-slate-400">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="p-3">
                            <span 
                              className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold"
                              style={{ 
                                backgroundColor: `${TIER_COLORS[u.tierName as keyof typeof TIER_COLORS] || '#94A3B8'}20`, 
                                color: TIER_COLORS[u.tierName as keyof typeof TIER_COLORS] || '#94A3B8',
                                border: `1px solid ${TIER_COLORS[u.tierName as keyof typeof TIER_COLORS] || '#94A3B8'}40`
                              }}
                            >
                              {u.tierName} (${TIER_PRICES[u.tierName as keyof typeof TIER_PRICES] || 0})
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedUserForEdit(u);
                                setNewTierChoice(u.tierName || 'Starter');
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold transition"
                            >
                              Edit Tier
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal for Editing Tier */}
            <AnimatePresence>
              {selectedUserForEdit && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">Update Account Tier</h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Set subscription level for <strong className="text-slate-200">{selectedUserForEdit.email}</strong>
                    </p>

                    <div className="space-y-3 mb-6">
                      {Object.keys(TIER_PRICES).map((tierKey) => (
                        <label 
                          key={tierKey} 
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            newTierChoice === tierKey 
                              ? 'bg-slate-800 border-[#DC143C]' 
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input 
                              type="radio" 
                              name="tier" 
                              value={tierKey} 
                              checked={newTierChoice === tierKey}
                              onChange={() => setNewTierChoice(tierKey)}
                              className="accent-[#DC143C]"
                            />
                            <span className="font-bold text-white text-sm">{tierKey}</span>
                          </div>
                          <span className="font-mono text-xs text-emerald-400 font-bold">
                            ${TIER_PRICES[tierKey as keyof typeof TIER_PRICES]} / mo
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedUserForEdit(null)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateUserTier}
                        disabled={updatingTier}
                        className="px-4 py-2 bg-[#DC143C] hover:bg-red-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                      >
                        {updatingTier ? 'Saving...' : 'Apply Tier Change'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 4: SYSTEM DIAGNOSTICS & LIVE DEPENDENCY PINGS */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Top Diagnostics Header Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                  <h2 className="text-xl font-bold text-white">Live Application Connections &amp; Dependency Health</h2>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time roundtrip ping latencies, API statuses, database document counts, and Node.js container health.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {diagnosticsData && (
                  <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-300">
                    Total Ping Time: <strong className="text-emerald-400">{diagnosticsData.totalCheckTimeMs} ms</strong>
                  </div>
                )}
                <button
                  onClick={fetchDiagnostics}
                  disabled={loadingDiagnostics}
                  className="flex items-center gap-2 bg-[#DC143C] hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDiagnostics ? 'animate-spin' : ''}`} />
                  {loadingDiagnostics ? 'Pinging Services...' : 'Re-Ping All Connections'}
                </button>
              </div>
            </div>

            {/* Grid of Dependencies */}
            {loadingDiagnostics && !diagnosticsData ? (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 font-mono text-sm">
                <RefreshCw className="w-8 h-8 text-[#DC143C] animate-spin mx-auto mb-3" />
                Executing live roundtrip network pings to Firestore, PayPal, TCGdex, PokemonTCG.io, ExchangeRate API &amp; Gemini...
              </div>
            ) : diagnosticsData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Object.entries(diagnosticsData.dependencies).map(([key, dep]) => {
                  const isHealthy = dep.status === 'healthy';
                  const isDegraded = dep.status === 'degraded';
                  const isDown = dep.status === 'down';

                  return (
                    <div key={key} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition">
                      <div>
                        {/* Header & Status Pill */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block mb-1">
                              {dep.category}
                            </span>
                            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                              {dep.name}
                            </h3>
                          </div>

                          {/* Status Badge */}
                          <div className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold border flex items-center gap-1 ${
                            isHealthy ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30' :
                            isDegraded ? 'bg-amber-950/60 text-amber-400 border-amber-500/30' :
                            isDown ? 'bg-red-950/60 text-red-400 border-red-500/30' :
                            'bg-blue-950/60 text-blue-400 border-blue-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              isHealthy ? 'bg-emerald-400' :
                              isDegraded ? 'bg-amber-400' :
                              isDown ? 'bg-red-400' :
                              'bg-blue-400'
                            }`} />
                            {dep.status.toUpperCase()}
                            {dep.latencyMs !== undefined && (
                              <span className="text-slate-400 font-normal">({dep.latencyMs}ms)</span>
                            )}
                          </div>
                        </div>

                        {/* Details Key-Value List */}
                        <div className="space-y-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-xs font-mono">
                          {Object.entries(dep.details).map(([dKey, dVal]) => (
                            <div key={dKey} className="flex justify-between items-center text-[11px]">
                              <span className="text-slate-400 capitalize">
                                {dKey.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <span className="font-bold text-slate-200 truncate max-w-[180px]">
                                {typeof dVal === 'boolean' ? (dVal ? 'TRUE' : 'FALSE') :
                                 typeof dVal === 'object' && dVal !== null ? JSON.stringify(dVal) :
                                 String(dVal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>Connection Target: #{key}</span>
                        <span className="text-emerald-400 font-bold">LIVE OK</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
};
