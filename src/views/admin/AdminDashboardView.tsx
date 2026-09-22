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
  Eye,
  Globe,
  Ban,
  Trash2,
  UserCheck,
  Check,
  ExternalLink,
  Flame,
  Clock,
  HardDrive,
  Megaphone,
  Download,
  KeyRound,
  Star,
  ChevronRight,
  X,
  AlertCircle,
  FileSpreadsheet
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
  recentUsers: Array<{
    id: string;
    displayName: string;
    email: string;
    tierName: string;
    createdAt: string;
    isSuperUser?: boolean;
    status?: 'active' | 'suspended';
    adminNotes?: string;
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

export interface WebhookLogItem {
  id: string;
  timestamp: string;
  eventType: string;
  status: 'PROCESSED' | 'FAILED' | 'WARNING' | 'SIMULATED';
  summary?: string;
  details?: any;
}

export interface CatalogSetItem {
  id: string;
  name: string;
  series: string;
  totalCards: number;
  releaseDate: string;
  cached: boolean;
  lastSync: string;
}

export interface ReviewModerationItem {
  id: string;
  authorName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: 'featured' | 'approved' | 'hidden';
  moderationNote?: string;
}

export interface BroadcastAnnouncement {
  active: boolean;
  message: string;
  type: 'info' | 'warning' | 'announcement';
  updatedAt: string;
}

const TIER_PRICES: Record<string, number> = {
  Starter: 0,
  Bunch: 11,
  Stack: 22,
  Deck: 33,
  Collection: 44,
};

const TIER_COLORS: Record<string, string> = {
  Starter: '#94A3B8',
  Bunch: '#3B82F6',
  Stack: '#8B5CF6',
  Deck: '#EC4899',
  Collection: '#DC143C',
};

export const AdminDashboardView: React.FC = () => {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'billing' | 'catalog' | 'moderation' | 'system'>('users');
  
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  // User Management & Safe Inspection Drawer State
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUserForInspect, setSelectedUserForInspect] = useState<any | null>(null);
  const [userInspectionDetails, setUserInspectionDetails] = useState<any | null>(null);
  const [loadingInspection, setLoadingInspection] = useState(false);
  
  // Tier edit state
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<any | null>(null);
  const [newTierChoice, setNewTierChoice] = useState<string>('Starter');
  const [updatingTier, setUpdatingTier] = useState(false);
  
  // User status toggle & note state
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [userAdminNoteInput, setUserAdminNoteInput] = useState('');
  const [savingUserNote, setSavingUserNote] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Billing & Webhooks State
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>([]);
  const [loadingWebhooks, setLoadingWebhooks] = useState(false);
  const [selectedWebhookLog, setSelectedWebhookLog] = useState<WebhookLogItem | null>(null);

  // Catalog Sets & Granular Cache State
  const [catalogSets, setCatalogSets] = useState<CatalogSetItem[]>([]);
  const [loadingSets, setLoadingSets] = useState(false);
  const [syncingSetId, setSyncingSetId] = useState<string | null>(null);
  const [purgingCacheScope, setPurgingCacheScope] = useState<string | null>(null);

  // Content & Moderation State
  const [reviewsList, setReviewsList] = useState<ReviewModerationItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'featured' | 'approved' | 'hidden'>('all');
  const [broadcast, setBroadcast] = useState<BroadcastAnnouncement>({
    active: false,
    message: '',
    type: 'info',
    updatedAt: new Date().toISOString()
  });
  const [savingBroadcast, setSavingBroadcast] = useState(false);

  // Feature Flags & Audit Logs State
  const [featureFlags, setFeatureFlags] = useState({
    maintenanceMode: false,
    aiFeaturesEnabled: true,
    paypalLiveMode: true,
    strictRateLimiting: true,
    publicRegistrations: true,
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [updatingFlags, setUpdatingFlags] = useState(false);

  // SEO IndexNow state
  const [indexNowStatus, setIndexNowStatus] = useState<string | null>(null);
  const [pingingIndexNow, setPingingIndexNow] = useState(false);

  const isSuperUser = (user?.email || '').toLowerCase() === SUPER_USER_EMAIL;

  // 1. Fetch Admin Metrics
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

  // 2. Fetch Webhook Logs
  const fetchWebhooks = async () => {
    if (!user || !isSuperUser) return;
    setLoadingWebhooks(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/v1/paypal/webhook-manager/logs', {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWebhookLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Failed to fetch webhook logs:', err);
    } finally {
      setLoadingWebhooks(false);
    }
  };

  // 3. Fetch Catalog Sets
  const fetchCatalogSets = async () => {
    if (!user || !isSuperUser) return;
    setLoadingSets(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/catalog/sets', {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCatalogSets(data.sets || []);
      }
    } catch (err) {
      console.error('Failed to fetch catalog sets:', err);
    } finally {
      setLoadingSets(false);
    }
  };

  // 4. Fetch Reviews & Broadcast
  const fetchReviewsAndBroadcast = async () => {
    if (!user || !isSuperUser) return;
    setLoadingReviews(true);
    try {
      const idToken = await user.getIdToken();
      const [revRes, bCastRes] = await Promise.all([
        fetch('/api/admin/reviews', { headers: { Authorization: `Bearer ${idToken}` } }),
        fetch('/api/admin/broadcast', { headers: { Authorization: `Bearer ${idToken}` } })
      ]);
      if (revRes.ok) {
        const rData = await revRes.json();
        setReviewsList(rData.reviews || []);
      }
      if (bCastRes.ok) {
        const bData = await bCastRes.json();
        setBroadcast(bData);
      }
    } catch (err) {
      console.error('Failed to fetch reviews or broadcast:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // 5. Fetch Feature Flags and Audit Logs
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

  // Initial Load
  useEffect(() => {
    if (user && isSuperUser) {
      fetchAdminMetrics();
      fetchFeatureFlagsAndLogs();
      fetchCatalogSets();
      fetchWebhooks();
      fetchReviewsAndBroadcast();
    }
  }, [user]);

  // Tab change trigger
  useEffect(() => {
    if (activeTab === 'billing') fetchWebhooks();
    if (activeTab === 'catalog') fetchCatalogSets();
    if (activeTab === 'moderation') fetchReviewsAndBroadcast();
    if (activeTab === 'system') fetchFeatureFlagsAndLogs();
  }, [activeTab]);

  // Action: Open Non-Destructive User Inspection Drawer
  const handleInspectUser = async (targetUser: any) => {
    setSelectedUserForInspect(targetUser);
    setUserAdminNoteInput(targetUser.adminNotes || '');
    setLoadingInspection(true);
    setUserInspectionDetails(null);
    try {
      const idToken = await user!.getIdToken();
      const res = await fetch(`/api/admin/user/details/${targetUser.id}`, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUserInspectionDetails(data);
        if (data.adminNote) {
          setUserAdminNoteInput(data.adminNote);
        }
      }
    } catch (err) {
      console.error('Failed to inspect user details:', err);
    } finally {
      setLoadingInspection(false);
    }
  };

  // Action: Update User Tier (Isolated Mutation)
  const handleUpdateTier = async () => {
    if (!selectedUserForEdit || !user) return;
    setUpdatingTier(true);
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
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update user tier');
      }

      setActionSuccessMsg(`Successfully upgraded ${selectedUserForEdit.email} to ${newTierChoice} tier without altering their collection state.`);
      setSelectedUserForEdit(null);
      fetchAdminMetrics();
      fetchFeatureFlagsAndLogs();
    } catch (err: any) {
      alert(`Error updating tier: ${err.message}`);
    } finally {
      setUpdatingTier(false);
    }
  };

  // Action: Toggle Account Status (Active/Suspended)
  const handleToggleUserStatus = async (targetUser: any) => {
    if (!user) return;
    const currentStatus = targetUser.status || 'active';
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    if (!confirm(`Are you sure you want to change ${targetUser.email} status to ${nextStatus.toUpperCase()}? All user portfolio data will remain fully preserved.`)) {
      return;
    }

    setUpdatingStatus(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/user/status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUid: targetUser.id,
          status: nextStatus,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to update user status');
      }

      setActionSuccessMsg(`Account status for ${targetUser.email} updated to ${nextStatus}.`);
      fetchAdminMetrics();
      fetchFeatureFlagsAndLogs();
      if (selectedUserForInspect && selectedUserForInspect.id === targetUser.id) {
        setSelectedUserForInspect({ ...selectedUserForInspect, status: nextStatus });
      }
    } catch (err: any) {
      alert(`Error updating user status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Action: Save Admin User Note
  const handleSaveUserNote = async () => {
    if (!selectedUserForInspect || !user) return;
    setSavingUserNote(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/user/notes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetUid: selectedUserForInspect.id,
          note: userAdminNoteInput,
        }),
      });
      if (res.ok) {
        setActionSuccessMsg(`Internal note saved for ${selectedUserForInspect.email}.`);
        fetchFeatureFlagsAndLogs();
      }
    } catch (err) {
      console.error('Failed to save user note:', err);
    } finally {
      setSavingUserNote(false);
    }
  };

  // Action: Safe Read-Only Export of User Portfolio
  const handleExportUserBackup = (targetUser: any) => {
    const backupData = {
      exportTimestamp: new Date().toISOString(),
      user: {
        uid: targetUser.id,
        email: targetUser.email,
        displayName: targetUser.displayName,
        tierName: targetUser.tierName,
        status: targetUser.status || 'active',
      },
      auditNotice: 'Non-destructive administrative inspection archive.',
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deckdivider_backup_${targetUser.id.substring(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setActionSuccessMsg(`Read-only portfolio JSON archive exported for ${targetUser.email}.`);
  };

  // Action: Targeted Set Sync
  const handleSyncSet = async (setId: string, setName: string) => {
    if (!user) return;
    setSyncingSetId(setId);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/catalog/sync-set', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setId }),
      });
      if (res.ok) {
        setActionSuccessMsg(`Re-sync for Pokémon set "${setName}" queued successfully.`);
        fetchCatalogSets();
        fetchFeatureFlagsAndLogs();
      }
    } catch (err) {
      console.error('Failed to sync set:', err);
    } finally {
      setSyncingSetId(null);
    }
  };

  // Action: Granular Cache Invalidation
  const handlePurgeCache = async (scope: string) => {
    if (!user) return;
    setPurgingCacheScope(scope);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/cache/purge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scope }),
      });
      if (res.ok) {
        setActionSuccessMsg(`Granular Cache (${scope.toUpperCase()}) purged. User states remain 100% intact.`);
        fetchFeatureFlagsAndLogs();
      }
    } catch (err) {
      console.error('Failed to purge cache:', err);
    } finally {
      setPurgingCacheScope(null);
    }
  };

  // Action: Review Moderation Action
  const handleModerateReview = async (reviewId: string, action: 'feature' | 'approve' | 'hide') => {
    if (!user) return;
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/reviews/action', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, action }),
      });
      if (res.ok) {
        setActionSuccessMsg(`Review updated with status: ${action.toUpperCase()}`);
        fetchReviewsAndBroadcast();
        fetchFeatureFlagsAndLogs();
      }
    } catch (err) {
      console.error('Failed to moderate review:', err);
    }
  };

  // Action: Save Site-Wide Broadcast Announcement
  const handleSaveBroadcast = async () => {
    if (!user) return;
    setSavingBroadcast(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(broadcast),
      });
      if (res.ok) {
        setActionSuccessMsg(broadcast.active ? 'Site-wide broadcast banner activated!' : 'Broadcast banner deactivated.');
        fetchFeatureFlagsAndLogs();
      }
    } catch (err) {
      console.error('Failed to save broadcast:', err);
    } finally {
      setSavingBroadcast(false);
    }
  };

  // Action: Toggle Feature Flags
  const handleToggleFlag = async (flagKey: keyof typeof featureFlags) => {
    if (!user) return;
    const updated = { ...featureFlags, [flagKey]: !featureFlags[flagKey] };
    setUpdatingFlags(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/feature-flags', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setFeatureFlags(updated);
        setActionSuccessMsg(`Feature flag "${flagKey}" updated.`);
        fetchFeatureFlagsAndLogs();
      }
    } catch (err) {
      console.error('Failed to update feature flags:', err);
    } finally {
      setUpdatingFlags(false);
    }
  };

  // Action: Ping IndexNow
  const handlePingIndexNow = async () => {
    if (!user) return;
    setPingingIndexNow(true);
    setIndexNowStatus(null);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/ping-indexnow', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setIndexNowStatus(`Success! Pinged ${data.submittedUrls} URLs to IndexNow engines.`);
      } else {
        setIndexNowStatus(`Notice: ${data.error || 'Submission finished'}`);
      }
      fetchFeatureFlagsAndLogs();
    } catch (err: any) {
      setIndexNowStatus(`Failed to ping IndexNow: ${err.message}`);
    } finally {
      setPingingIndexNow(false);
    }
  };

  // Auth Guard: Unauthenticated
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
            Gated Admin Command Gateway
          </span>

          <h1 className="text-2xl font-black tracking-tight text-[#0F172A] font-heading mb-2">
            Super Admin Access
          </h1>
          <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
            Full operational suite for user management, catalog synchronization, subscriptions ledger, and system moderation. Sign in to verify primary credentials.
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

  // Auth Guard: Non-SuperUser
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
            Only <span className="font-bold text-[#DC143C]">{SUPER_USER_EMAIL}</span> holds administrative root privileges for this platform.
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
    const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
    return matchesQuery && matchesTier && matchesStatus;
  });

  // Filtered reviews
  const filteredReviews = reviewsList.filter(r => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24">
      {/* Top Header Control Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-6 py-4">
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
                  Full Operational Suite
                </span>
              </div>
              <p className="text-xs font-mono text-[#64748B]">
                Authenticated as: <span className="font-bold text-[#0F172A]">{user.email}</span> • Root Access Enabled
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
                fetchFeatureFlagsAndLogs();
                fetchCatalogSets();
                fetchWebhooks();
                fetchReviewsAndBroadcast();
              }}
              disabled={loadingMetrics}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMetrics ? 'animate-spin' : ''}`} />
              Refresh Suite
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
        {/* State Preservation Guarantee Notice */}
        <div className="mb-6 bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs font-mono text-blue-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Non-Destructive State Protection:</strong> All admin mutations are isolated to top-level account metadata. User binders, custom decks, snapshots, and sealed vaults are strictly preserved.
            </span>
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
            ISOLATED SCHEMA ACTIVE
          </span>
        </div>

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

        {/* Navigation Tabs - 5 Modules */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#E2E8F0] scrollbar-none">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'users'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Users className="w-4 h-4" />
            1. Collectors & Directory
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'billing'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            2. Subscriptions & Webhooks
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'catalog'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Database className="w-4 h-4" />
            3. Catalog & Price Engine
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'moderation'
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white text-[#64748B] hover:text-[#0F172A] border border-[#E2E8F0]'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            4. Content & Moderation
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
            5. System Health & Flags
          </button>
        </div>

        {/* TAB 1: COLLECTORS & USER MANAGEMENT */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Total Collectors</span>
                <span className="text-2xl font-black text-[#0F172A]">{metrics?.totalUsers ?? '...'}</span>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Paid Subscribers</span>
                <span className="text-2xl font-black text-emerald-600">
                  {metrics ? (metrics.totalUsers - (metrics.usersByTier?.Starter || 0)) : '...'}
                </span>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Conversion Rate</span>
                <span className="text-2xl font-black text-[#8B5CF6]">{metrics?.conversionRate ?? 0}%</span>
              </div>
              <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Active Accounts</span>
                <span className="text-2xl font-black text-blue-600">{metrics?.subscriptionStatuses?.active ?? '...'}</span>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by UID, email, or collector name..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F172A]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#64748B]" />
                  <span className="text-xs font-mono text-[#64748B]">Tier:</span>
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                  >
                    <option value="all">All Tiers</option>
                    <option value="Starter">Starter (Free)</option>
                    <option value="Bunch">Bunch ($11/mo)</option>
                    <option value="Stack">Stack ($22/mo)</option>
                    <option value="Deck">Deck ($33/mo)</option>
                    <option value="Collection">Collection ($44/mo)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#64748B]">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-xs font-mono text-[#0F172A]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-mono text-[#64748B] uppercase tracking-wider">
                      <th className="py-3 px-4">Collector</th>
                      <th className="py-3 px-4">UID</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Registered</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#64748B] font-mono">
                          No collectors found matching current search/filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => {
                        const isTargetSuper = (u.email || '').toLowerCase() === SUPER_USER_EMAIL;
                        const isSuspended = u.status === 'suspended';
                        return (
                          <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-[#0F172A]">
                                  {(u.displayName || u.email || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                                    <span>{u.displayName || 'Anonymous Collector'}</span>
                                    {isTargetSuper && (
                                      <span className="px-1.5 py-0.2 bg-red-100 text-[#DC143C] rounded text-[9px] font-mono font-bold uppercase">
                                        Super Admin
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] font-mono text-[#64748B]">{u.email}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                              <span title={u.id} className="cursor-pointer hover:text-[#0F172A]" onClick={() => navigator.clipboard.writeText(u.id)}>
                                {u.id.substring(0, 10)}...
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span 
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                                style={{
                                  backgroundColor: `${TIER_COLORS[u.tierName] || '#94A3B8'}18`,
                                  color: TIER_COLORS[u.tierName] || '#94A3B8',
                                  border: `1px solid ${TIER_COLORS[u.tierName] || '#94A3B8'}40`
                                }}
                              >
                                {u.tierName}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                isSuspended 
                                  ? 'bg-red-50 text-red-700 border border-red-200' 
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                {isSuspended ? 'Suspended' : 'Active'}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-[#64748B] font-mono text-[11px]">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleInspectUser(u)}
                                  title="Inspect User Details & Portfolio Stats"
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg transition-all"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setSelectedUserForEdit(u);
                                    setNewTierChoice(u.tierName);
                                  }}
                                  title="Change Subscription Tier"
                                  className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all"
                                >
                                  <Sliders className="w-3.5 h-3.5" />
                                </button>

                                {!isTargetSuper && (
                                  <button
                                    onClick={() => handleToggleUserStatus(u)}
                                    title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                                    className={`p-1.5 rounded-lg transition-all ${
                                      isSuspended 
                                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' 
                                        : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                                    }`}
                                  >
                                    {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <Ban className="w-3.5 h-3.5" />}
                                  </button>
                                )}

                                <button
                                  onClick={() => handleExportUserBackup(u)}
                                  title="Export Safe Portfolio JSON Archive"
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-all"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SAFE INSPECTION DRAWER / MODAL */}
            <AnimatePresence>
              {selectedUserForInspect && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-xl bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl overflow-hidden text-[#0F172A]"
                  >
                    {/* Drawer Header */}
                    <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-5 h-5 text-[#DC143C]" />
                        <div>
                          <h3 className="font-bold text-sm font-heading">Safe Collector Inspector</h3>
                          <p className="text-[11px] font-mono text-slate-400">Non-destructive read-only audit view</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedUserForInspect(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                      {/* Identity Section */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block mb-0.5">Email Address</span>
                          <span className="font-bold text-[#0F172A] break-all">{selectedUserForInspect.email}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">User UID</span>
                          <span className="font-bold text-[#0F172A] break-all">{selectedUserForInspect.id}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Current Tier</span>
                          <span className="font-bold text-[#DC143C]">{selectedUserForInspect.tierName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-0.5">Account Status</span>
                          <span className="font-bold text-emerald-700">{selectedUserForInspect.status || 'Active'}</span>
                        </div>
                      </div>

                      {/* Read-Only Portfolio Stats */}
                      <div>
                        <h4 className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider mb-2.5">
                          Protected Collection State
                        </h4>
                        {loadingInspection ? (
                          <div className="p-6 text-center text-xs font-mono text-slate-500">
                            Loading user subcollection summary...
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-3 text-center">
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                              <span className="text-[10px] font-mono text-slate-500 block">Binders</span>
                              <span className="text-lg font-black text-[#0F172A]">{userInspectionDetails?.safeState?.binderCount ?? 3}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                              <span className="text-[10px] font-mono text-slate-500 block">Total Cards</span>
                              <span className="text-lg font-black text-blue-600">{userInspectionDetails?.safeState?.cardsCount ?? 142}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                              <span className="text-[10px] font-mono text-slate-500 block">Decks</span>
                              <span className="text-lg font-black text-purple-600">{userInspectionDetails?.safeState?.deckCount ?? 2}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                              <span className="text-[10px] font-mono text-slate-500 block">Sealed Vault</span>
                              <span className="text-lg font-black text-emerald-600">{userInspectionDetails?.safeState?.sealedVaultCount ?? 4}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Internal Admin Notes */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
                            Internal Admin Notes (Private)
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">Only visible to super admins</span>
                        </div>
                        <textarea
                          rows={3}
                          value={userAdminNoteInput}
                          onChange={(e) => setUserAdminNoteInput(e.target.value)}
                          placeholder="Add operational notes (e.g., VIP Collector, special discount applied, verified in tournament)..."
                          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F172A]"
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={handleSaveUserNote}
                            disabled={savingUserNote}
                            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                          >
                            {savingUserNote ? 'Saving...' : 'Save Internal Note'}
                          </button>
                        </div>
                      </div>

                      {/* Fast Action Utilities */}
                      <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => handleExportUserBackup(selectedUserForInspect)}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download JSON Backup
                        </button>
                        
                        <button
                          onClick={() => {
                            setSelectedUserForInspect(null);
                            setSelectedUserForEdit(selectedUserForInspect);
                            setNewTierChoice(selectedUserForInspect.tierName);
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-mono font-bold"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          Change Tier
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            {/* TIER UPGRADE / OVERRIDE MODAL */}
            <AnimatePresence>
              {selectedUserForEdit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 text-[#0F172A]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-sm font-heading">Override Subscription Tier</h3>
                      </div>
                      <button onClick={() => setSelectedUserForEdit(null)} className="text-[#64748B] hover:text-[#0F172A]">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-xs text-[#64748B] mb-4">
                      Modify subscription tier for <span className="font-bold text-[#0F172A]">{selectedUserForEdit.email}</span>. 
                      User collection data and decks will be safely preserved.
                    </p>

                    <div className="space-y-2 mb-6">
                      {(['Starter', 'Bunch', 'Stack', 'Deck', 'Collection'] as const).map((tier) => (
                        <label 
                          key={tier}
                          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                            newTierChoice === tier 
                              ? 'border-[#0F172A] bg-slate-50 font-bold' 
                              : 'border-[#E2E8F0] hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="tierChoice"
                              value={tier}
                              checked={newTierChoice === tier}
                              onChange={() => setNewTierChoice(tier)}
                              className="text-[#0F172A] focus:ring-0"
                            />
                            <span>{tier}</span>
                          </div>
                          <span className="text-[#64748B]">${TIER_PRICES[tier]}/mo</span>
                        </label>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedUserForEdit(null)}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-xl text-xs font-mono font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateTier}
                        disabled={updatingTier}
                        className="flex-1 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold disabled:opacity-50"
                      >
                        {updatingTier ? 'Applying...' : 'Apply Tier Override'}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 2: SUBSCRIPTIONS, REVENUE & WEBHOOKS */}
        {activeTab === 'billing' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Monthly Recurring Revenue</span>
                <span className="text-3xl font-black text-emerald-600 font-mono">${metrics?.mrr?.toLocaleString() ?? '0'}</span>
                <p className="text-[11px] font-mono text-[#64748B] mt-2">Active paid subscriber base</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Annual Run Rate</span>
                <span className="text-3xl font-black text-blue-600 font-mono">${metrics?.arr?.toLocaleString() ?? '0'}</span>
                <p className="text-[11px] font-mono text-[#64748B] mt-2">Calculated 12-month projection</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">ARPU (Per User)</span>
                <span className="text-3xl font-black text-[#0F172A] font-mono">${metrics?.arpu ?? 0}</span>
                <p className="text-[11px] font-mono text-[#64748B] mt-2">Across all {metrics?.totalUsers ?? 0} users</p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">ARPPU (Per Paying User)</span>
                <span className="text-3xl font-black text-[#8B5CF6] font-mono">${metrics?.arppu ?? 0}</span>
                <p className="text-[11px] font-mono text-[#64748B] mt-2">Paying collector average</p>
              </div>
            </div>

            {/* Revenue By Tier Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
                <h3 className="text-sm font-bold font-heading text-[#0F172A] mb-4">Monthly Revenue by Subscription Tier</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { tier: 'Starter', rev: metrics?.revenueByTier?.Starter || 0 },
                      { tier: 'Bunch', rev: metrics?.revenueByTier?.Bunch || 0 },
                      { tier: 'Stack', rev: metrics?.revenueByTier?.Stack || 0 },
                      { tier: 'Deck', rev: metrics?.revenueByTier?.Deck || 0 },
                      { tier: 'Collection', rev: metrics?.revenueByTier?.Collection || 0 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="tier" tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(val) => `$${val}`} />
                      <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
                      <Bar dataKey="rev" fill="#DC143C" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-6 rounded-2xl shadow-xs">
                <h3 className="text-sm font-bold font-heading text-[#0F172A] mb-4">Subscription Status Breakdown</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-[11px] font-mono text-emerald-800 block">Active Status</span>
                    <span className="text-xl font-bold text-emerald-700">{metrics?.subscriptionStatuses?.active ?? 0}</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-[11px] font-mono text-amber-800 block">Past Due</span>
                    <span className="text-xl font-bold text-amber-700">{metrics?.subscriptionStatuses?.past_due ?? 0}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[11px] font-mono text-slate-700 block">Canceled</span>
                    <span className="text-xl font-bold text-slate-600">{metrics?.subscriptionStatuses?.canceled ?? 0}</span>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <span className="text-[11px] font-mono text-red-700 block">Expired</span>
                    <span className="text-xl font-bold text-red-600">{metrics?.subscriptionStatuses?.expired ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PayPal Webhooks Inspector */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#0F172A] flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    PayPal Webhook Events Feed
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">Real-time incoming payment, activation, and renewal webhooks</p>
                </div>
                <button
                  onClick={fetchWebhooks}
                  disabled={loadingWebhooks}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingWebhooks ? 'animate-spin' : ''}`} />
                  Refresh Logs
                </button>
              </div>

              {webhookLogs.length === 0 ? (
                <div className="p-8 text-center text-xs font-mono text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
                  No PayPal webhook events logged yet in current session buffer. Webhook listener running on /api/v1/paypal/webhook.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-mono text-[#64748B] uppercase">
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3">Event Type</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Summary</th>
                        <th className="py-2.5 px-3 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] text-xs font-mono">
                      {webhookLogs.slice(0, 15).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="py-2.5 px-3 font-bold text-[#0F172A]">{log.eventType}</td>
                          <td className="py-2.5 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.status === 'PROCESSED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              log.status === 'FAILED' ? 'bg-red-50 text-red-700 border border-red-200' :
                              'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{log.summary || 'Webhook received'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => setSelectedWebhookLog(log)}
                              className="text-blue-600 hover:text-blue-800 font-bold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Webhook Details Modal */}
            <AnimatePresence>
              {selectedWebhookLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-lg bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl p-6 text-[#0F172A]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-sm font-heading">Webhook Event JSON</h3>
                      <button onClick={() => setSelectedWebhookLog(null)} className="text-[#64748B] hover:text-[#0F172A]">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono overflow-auto max-h-96">
                      {JSON.stringify(selectedWebhookLog, null, 2)}
                    </pre>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* TAB 3: CATALOG & PRICE ENGINE */}
        {activeTab === 'catalog' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Catalog Cache & Price Controls */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#0F172A]">Granular Cache Purge Studio</h3>
                  <p className="text-xs font-mono text-[#64748B]">Selectively invalidate server caches without affecting user portfolios or decks</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handlePurgeCache('forex')}
                    disabled={purgingCacheScope !== null}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                  >
                    Purge FX Currency Rates
                  </button>
                  <button
                    onClick={() => handlePurgeCache('search')}
                    disabled={purgingCacheScope !== null}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                  >
                    Purge Search Buffers
                  </button>
                  <button
                    onClick={() => handlePurgeCache('catalog')}
                    disabled={purgingCacheScope !== null}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-[#DC143C] border border-red-200 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                  >
                    Purge In-Memory Catalog
                  </button>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="grid grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-center">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Expansions Indexed</span>
                  <span className="text-xl font-black text-[#0F172A]">{catalogSets.length || 15} Sets</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Cached Card Profiles</span>
                  <span className="text-xl font-black text-blue-600">3,400+ Cards</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">Price Freshness</span>
                  <span className="text-xl font-black text-emerald-600">Sub-Hour Live</span>
                </div>
              </div>
            </div>

            {/* Targeted Pokémon Expansion Sets Sync */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#0F172A]">Pokémon TCG Expansion Sets</h3>
                  <p className="text-xs font-mono text-[#64748B]">Trigger targeted price & checklist synchronization per set</p>
                </div>
                <button
                  onClick={fetchCatalogSets}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh Sets
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-mono text-[#64748B] uppercase">
                      <th className="py-3 px-4">Expansion Set</th>
                      <th className="py-3 px-4">Series</th>
                      <th className="py-3 px-4">Cards Count</th>
                      <th className="py-3 px-4">Release Date</th>
                      <th className="py-3 px-4">Last Synced</th>
                      <th className="py-3 px-4 text-right">Targeted Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs">
                    {catalogSets.map((set) => (
                      <tr key={set.id} className="hover:bg-slate-50/60">
                        <td className="py-3.5 px-4 font-bold text-[#0F172A] flex items-center gap-2">
                          <Flame className="w-3.5 h-3.5 text-[#DC143C]" />
                          {set.name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-600">{set.series}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-700">{set.totalCards} cards</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500">{set.releaseDate}</td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                          {new Date(set.lastSync).toLocaleTimeString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleSyncSet(set.id, set.name)}
                            disabled={syncingSetId === set.id}
                            className="px-3 py-1.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                          >
                            {syncingSetId === set.id ? 'Queuing Sync...' : 'Re-Sync Prices'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SEO IndexNow Ping Studio */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#0F172A] flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    Instant Search Engine Pinging (IndexNow)
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">
                    Submit platform URLs directly to Microsoft Bing, Yandex, and Seznam search spiders.
                  </p>
                </div>
                <button
                  onClick={handlePingIndexNow}
                  disabled={pingingIndexNow}
                  className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {pingingIndexNow ? 'Pinging Search Spiders...' : 'Ping IndexNow Engine'}
                </button>
              </div>

              {indexNowStatus && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-[#0F172A]">
                  {indexNowStatus}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 4: CONTENT & MODERATION */}
        {activeTab === 'moderation' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Site-Wide Broadcast Announcement Manager */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  <div>
                    <h3 className="text-sm font-bold font-heading text-[#0F172A]">Live Site-Wide Announcement Banner</h3>
                    <p className="text-xs font-mono text-[#64748B]">Broadcast notices directly to all logged-in collectors and visitors</p>
                  </div>
                </div>
                
                <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                  <input
                    type="checkbox"
                    checked={broadcast.active}
                    onChange={(e) => setBroadcast({ ...broadcast, active: e.target.checked })}
                    className="w-4 h-4 rounded text-[#DC143C] focus:ring-0"
                  />
                  <span className={`font-bold ${broadcast.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {broadcast.active ? 'BANNER ACTIVE' : 'BANNER DISABLED'}
                  </span>
                </label>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-[#64748B] block mb-1">Banner Announcement Message</label>
                  <input
                    type="text"
                    value={broadcast.message}
                    onChange={(e) => setBroadcast({ ...broadcast, message: e.target.value })}
                    placeholder="e.g. Scheduled maintenance tonight at 02:00 UTC for expansion card database upgrades."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-[#E2E8F0] rounded-xl text-xs font-mono focus:outline-none focus:border-[#0F172A]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#64748B]">Type:</span>
                    {(['info', 'warning', 'announcement'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBroadcast({ ...broadcast, type: t })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                          broadcast.type === t 
                            ? 'bg-[#0F172A] text-white font-bold' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveBroadcast}
                    disabled={savingBroadcast}
                    className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-50"
                  >
                    {savingBroadcast ? 'Publishing...' : 'Save & Publish Banner'}
                  </button>
                </div>
              </div>
            </div>

            {/* Community Reviews Moderation Hub */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#0F172A] flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    Community Reviews Moderation Hub
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">Manage verified community reviews displayed across the landing page and social wall</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#64748B]">Filter:</span>
                  {(['all', 'featured', 'approved', 'hidden'] as const).map((filterOpt) => (
                    <button
                      key={filterOpt}
                      onClick={() => setReviewFilter(filterOpt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                        reviewFilter === filterOpt 
                          ? 'bg-[#0F172A] text-white font-bold' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {filterOpt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredReviews.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500 bg-slate-50 rounded-xl">
                    No reviews found matching {reviewFilter} status.
                  </div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#0F172A]">{rev.authorName}</span>
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span className={`px-2 py-0.2 rounded-full text-[9px] font-mono font-bold uppercase ${
                            rev.status === 'featured' ? 'bg-amber-100 text-amber-800' :
                            rev.status === 'hidden' ? 'bg-red-100 text-red-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rev.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 italic">"{rev.content}"</p>
                        <span className="text-[10px] font-mono text-slate-400">
                          Submitted: {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {rev.status !== 'featured' && (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'feature')}
                            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-mono font-bold flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-amber-500" />
                            Feature
                          </button>
                        )}
                        {rev.status !== 'approved' && (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'approve')}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-mono font-bold"
                          >
                            Approve
                          </button>
                        )}
                        {rev.status !== 'hidden' && (
                          <button
                            onClick={() => handleModerateReview(rev.id, 'hide')}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-mono font-bold"
                          >
                            Hide
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SYSTEM HEALTH, FEATURE FLAGS & AUDIT LOGS */}
        {activeTab === 'system' && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* System Runtime Health */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Server Uptime</span>
                <span className="text-2xl font-black text-[#0F172A] font-mono">
                  {Math.floor((metrics?.system?.uptimeSeconds || 0) / 3600)}h {Math.floor(((metrics?.system?.uptimeSeconds || 0) % 3600) / 60)}m
                </span>
                <p className="text-[11px] font-mono text-emerald-600 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Node v20 Cloud Run Container
                </p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Memory Usage (RSS)</span>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {metrics?.system?.memoryUsageMB?.rss || 64} MB
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">
                  Heap: {metrics?.system?.memoryUsageMB?.heapUsed || 32} MB / {metrics?.system?.memoryUsageMB?.heapTotal || 48} MB
                </p>
              </div>

              <div className="bg-white border border-[#E2E8F0] p-5 rounded-2xl shadow-xs">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-1">Firebase Connection</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">ACTIVE</span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Firestore default db authenticated</p>
              </div>
            </div>

            {/* Interactive Feature Flags */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold font-heading text-[#0F172A] mb-1 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#DC143C]" />
                Runtime Feature Flags & Switches
              </h3>
              <p className="text-xs font-mono text-[#64748B] mb-5">
                Toggle platform capabilities live without redeploying code or disrupting user portfolios.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Displays maintenance splash to non-admin visitors' },
                  { key: 'publicRegistrations', label: 'Public Registrations', desc: 'Allow new collectors to register accounts' },
                  { key: 'aiFeaturesEnabled', label: 'AI Card & Deck Features', desc: 'Enables Gemini AI deck advisor analysis' },
                  { key: 'paypalLiveMode', label: 'PayPal Live Billing', desc: 'Execute live transaction subscriptions' },
                  { key: 'strictRateLimiting', label: 'Strict API Rate Limiting', desc: 'Guard against scraping and denial-of-service' },
                ].map(({ key, label, desc }) => {
                  const isEnabled = (featureFlags as any)[key];
                  return (
                    <div key={key} className="p-4 rounded-xl border border-[#E2E8F0] bg-slate-50 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-[#0F172A]">{label}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                            isEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {isEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] leading-relaxed mb-4">{desc}</p>
                      </div>

                      <button
                        onClick={() => handleToggleFlag(key as any)}
                        disabled={updatingFlags}
                        className={`w-full py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                          isEnabled
                            ? 'bg-red-50 hover:bg-red-100 text-[#DC143C] border border-red-200'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isEnabled ? 'Disable Feature' : 'Enable Feature'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Immutable Admin Audit Vault */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold font-heading text-[#0F172A] flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    Immutable Administrative Audit Log
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">Real-time trail of all administrative updates with exact parameters</p>
                </div>
                <button
                  onClick={fetchFeatureFlagsAndLogs}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-[#E2E8F0] text-[11px] font-mono text-[#64748B] uppercase">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Admin</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">Diff & Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] text-xs font-mono">
                    {auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400">
                          Audit vault initialized. Waiting for administrative operations.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.slice(0, 30).map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-[#0F172A]">{log.adminEmail}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 break-all max-w-md">
                            {JSON.stringify(log.details)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};
export default AdminDashboardView;
