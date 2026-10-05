import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, EyeOff, FileText, Database, Server, CheckCircle2, Download, Trash2 } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../../components/landing/LandingMotionDirectorate';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';

interface PrivacyPolicyViewProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateHowItWorks,
}) => {
  const navigate = useNavigate();
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
      <PageHead
        title="Privacy Policy | DECK / divider"
        description="Comprehensive privacy policy, security disclosures, and data rights for DECK / divider collectors. Learn how collection records, purchase prices, and offline vaults are safeguarded."
        canonicalPath="/privacy"
        keywords={[
          'deck divider privacy policy',
          'pokemon collection data security',
          'offline card tracker privacy',
          'encrypted card binder storage',
          'subprocessors privacy policy'
        ]}
      />
      <LandingMotionDirectorate />

      <LandingNav
        onOpenAuth={onOpenAuth}
        onNavigateSection={(id) => {
          if (id === 'how-it-works') {
            onNavigateHowItWorks();
          } else {
            onNavigateHome();
          }
        }}
      />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 relative z-10">
        <GeoBreadcrumbs items={[{ label: 'Privacy Policy', path: '/privacy' }]} />

        {/* Header */}
        <div className="space-y-4 border-b border-[#E2E8F0] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-xs font-mono font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy &amp; Data Protection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight font-heading">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#64748B]">
            Effective Date: March 2026 • Last Updated: October 2026
          </p>
        </div>

        {/* Core Commitments Box */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-[#0F172A] font-heading flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-600" />
            Our Core Privacy Philosophy
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            DECK / divider is an independent collection management platform built by collectors for collectors. We believe your cards, acquisition costs, inventory volumes, and trade wishlists belong exclusively to you. <strong>We do not sell personal data, we do not partner with third-party advertising brokers, and we do not deploy behavioral profiling ad trackers.</strong>
          </p>
        </div>

        {/* Section 1: Information Collected */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            1. Information We Collect &amp; Store
          </h2>
          <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <p>
              Depending on how you interact with DECK / divider, we process the following categories of data:
            </p>
            <ul className="space-y-2.5 font-mono text-xs text-[#334155]">
              <li>• <strong>Account Credentials:</strong> If you register an account, we store your email address and display name via Google Firebase Authentication. Passwords are never stored on our servers.</li>
              <li>• <strong>Collection &amp; Portfolio State:</strong> Custom binder lists, deck configurations, card quantities, card conditions (NM/LP/MP/HP/DMG), acquisition purchase prices, acquisition dates, notes, and sealed product inventory.</li>
              <li>• <strong>Graded Slab Records:</strong> Certification numbers, grading companies (PSA, BGS, CGC, ACE), numerical grades, and subgrade specifications entered voluntarily.</li>
              <li>• <strong>Guest Mode Usage:</strong> If you browse as a guest, your entire collection state is stored locally inside your browser's IndexedDB and Web Storage APIs. Zero personal identification information is transmitted to our servers.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Zero Ad Trackers & Cookie Policy */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            2. Cookies, Local Storage &amp; Zero Ad Trackers
          </h2>
          <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <p>
              We maintain a strict technical policy regarding browser storage:
            </p>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 space-y-2 font-mono text-xs">
              <div className="font-bold text-[#0F172A] text-emerald-700">Zero Advertising Trackers:</div>
              <p className="text-[#64748B]">
                DECK / divider does not load third-party ad networks, social media tracking pixels (e.g. Meta Pixel, TikTok Pixel), or cross-site behavioral tracking cookies.
              </p>
            </div>
            <p className="text-xs text-[#64748B]">
              We only utilize <strong>essential functional storage</strong> required for application operation:
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-[#64748B]">
              <li>• <code>firebase:authUser</code>: Maintains your authenticated user session.</li>
              <li>• <code>displayCurrency</code>: Stores your preferred fiat currency code (e.g. USD, EUR, GBP, JPY).</li>
              <li>• <code>tcg_portfolio_backup_v1</code>: Local browser IndexedDB replica for instantaneous offline collection access.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Subprocessors & Service Providers */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            3. Authorized Third-Party Subprocessors
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            We partner exclusively with enterprise infrastructure providers to deliver reliable, encrypted cloud services:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[#64748B]">
                  <th className="py-2.5 px-3">Subprocessor</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Data Handled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                <tr>
                  <td className="py-2.5 px-3 font-bold">Google Cloud / Firebase</td>
                  <td className="py-2.5 px-3">Authentication &amp; Firestore Encrypted Cloud Sync</td>
                  <td className="py-2.5 px-3">Email, User ID, Encrypted collection state snapshots</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">PayPal (Europe / USA)</td>
                  <td className="py-2.5 px-3">Payment Processing &amp; Recurring Tier Subscriptions</td>
                  <td className="py-2.5 px-3">Subscription ID, billing tier status (credit card numbers handled exclusively by PayPal)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold">Cloudflare</td>
                  <td className="py-2.5 px-3">Global Edge CDN, SSL/TLS Encryption &amp; DDoS Protection</td>
                  <td className="py-2.5 px-3">Standard transit IP address and request telemetry</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Data Sovereignty, Portability & Deletion */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            4. User Rights, Data Portability &amp; Account Deletion
          </h2>
          <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <p>
              In full compliance with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                  <Download className="w-4 h-4 text-[#DC143C]" />
                  <span>Right to Portability (1-Click CSV/JSON)</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  You can export your complete inventory, raw cards, graded slabs, purchase costs, and deck lists to standard CSV or JSON format at any time directly from the Settings or Collection studio.
                </p>
              </div>

              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-[#0F172A]">
                  <Trash2 className="w-4 h-4 text-[#DC143C]" />
                  <span>Right to Erasure (Instant Purge)</span>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  You can request complete deletion of your account and all associated Firestore cloud snapshots by contacting us or triggering deletion in Settings. Deletions are permanent and irreversible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Security & Encryption */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            5. Security &amp; Encryption Architecture
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            All data in transit is encrypted using industry standard TLS 1.3. Cloud backups utilize authenticated user security rules on Google Firebase Firestore, with optional client-side AES-GCM encryption for local vaults. While no system is impenetrable, we maintain rigorous security hardening and conduct automated dependency audits.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            6. Privacy Inquiries &amp; Data Protection Contact
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            For privacy inquiries, GDPR/CCPA data export requests, or security vulnerability disclosures, contact the platform operator directly:
          </p>
          <div className="font-mono text-xs text-[#0F172A] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <div><strong>Operator:</strong> Gurutva Murdia (DECK / divider)</div>
            <div><strong>Email:</strong> deckdivider@outlook.com</div>
            <div><strong>Response SLA:</strong> Within 48 business hours</div>
          </div>
        </section>

        <PtcPartnerBanner />
        <PublicInterlinkMesh currentPath="/privacy" />
      </main>

      <LandingFooter
        onEnterApp={() => navigate('/app')}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};
