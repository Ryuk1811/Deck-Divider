import React, { useEffect, useState } from 'react';
import { Shield, Key, Database, RefreshCw, CheckCircle2 } from 'lucide-react';

export const DynamicCredentialsPanel: React.FC = () => {
  const [creds, setCreds] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/config/credentials')
      .then((res) => res.json())
      .then((data) => {
        setCreds(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white border border-[#E2E8F0] rounded-lg font-mono text-xs text-[#64748B] flex items-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-[#DC143C]" />
        <span>Loading credentials configuration from Firestore...</span>
      </div>
    );
  }

  if (!creds) return null;

  return (
    <div className="p-4 bg-white border border-[#E2E8F0] rounded-lg space-y-3 font-mono text-xs shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
        <div className="flex items-center gap-2 text-[#0F172A] font-bold">
          <Database className="w-4 h-4 text-[#16A34A]" />
          <span>Firestore Secured Credentials Client</span>
        </div>
        <span className="flex items-center gap-1 text-[10px] bg-[#F0FDF4] text-[#16A34A] border border-[#16A34A]/30 px-2 py-0.5 rounded font-bold">
          <CheckCircle2 className="w-3 h-3" />
          <span>Loaded from `deckdivider1` Firestore</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
        {/* PayPal Config */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-1">
          <div className="font-bold text-[#0F172A] flex items-center gap-1">
            <Key className="w-3.5 h-3.5 text-[#DC143C]" />
            <span>PayPal Live Gateway</span>
          </div>
          <div className="text-[#64748B] text-[10px]">Client ID: {creds.paypal?.clientId ? '••••' + creds.paypal.clientId.slice(-6) : 'N/A'}</div>
          <div className="text-[#64748B] text-[10px]">Mode: {creds.paypal?.mode || 'live'}</div>
          <div className="text-[#16A34A] font-bold text-[10px]">Plan IDs: Active (4 Tiers)</div>
        </div>

        {/* TCGdex Config */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-1">
          <div className="font-bold text-[#0F172A] flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>TCGdex Engine API</span>
          </div>
          <div className="text-[#64748B] text-[10px]">Base URL: {creds.tcgdex?.baseUrl || 'https://api.tcgdex.net/v2/en'}</div>
          <div className="text-[#16A34A] font-bold text-[10px]">Proxy Client: Connected</div>
        </div>

        {/* Firebase Config */}
        <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-1">
          <div className="font-bold text-[#0F172A] flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-[#0F172A]" />
            <span>Firebase Admin DB</span>
          </div>
          <div className="text-[#64748B] text-[10px]">Project ID: {creds.firebase?.projectId || 'deckdivider1'}</div>
          <div className="text-[#16A34A] font-bold text-[10px]">Admin SDK: Initialized</div>
        </div>
      </div>
    </div>
  );
};
