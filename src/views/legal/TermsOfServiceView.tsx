import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, AlertCircle, FileText, CheckCircle2, DollarSign, Lock, HelpCircle } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../../components/landing/LandingMotionDirectorate';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';
import { TIER_LIMITS } from '../../types';

interface TermsOfServiceViewProps {
  onOpenAuth: () => void;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateHowItWorks,
}) => {
  const navigate = useNavigate();
  const easeCurve = [0.16, 1, 0.3, 1] as const;

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
      <PageHead
        title="Terms of Service | DECK / divider"
        description="Terms of service, subscription billing policies, valuation disclaimers, and acceptable use guidelines for DECK / divider collectors and deck builders."
        canonicalPath="/terms"
        keywords={[
          'deck divider terms of service',
          'pokemon card tracker terms',
          'deck divider usage agreement',
          'tcg valuation disclaimer'
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
        <GeoBreadcrumbs items={[{ label: 'Terms of Service', path: '/terms' }]} />

        {/* Header */}
        <div className="space-y-4 border-b border-[#E2E8F0] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF0F3] border border-[#DC143C]/20 text-[#DC143C] text-xs font-mono font-bold uppercase tracking-wider">
            <FileText className="w-3.5 h-3.5" />
            <span>User Agreement &amp; Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight font-heading">
            Terms of Service
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#64748B]">
            Effective Date: March 2026 • Last Updated: October 2026
          </p>
        </div>

        {/* Section 1: Acceptance */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            1. Acceptance of Terms
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            By accessing or using DECK / divider (including web application, Progressive Web App, and public directory catalogs), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, do not access or use the service.
          </p>
        </section>

        {/* Section 2: Important Valuation & Financial Disclaimer */}
        <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-amber-950 font-heading flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            2. Valuation &amp; Financial Disclaimer (Crucial Notice)
          </h2>
          <div className="space-y-3 text-sm text-amber-900 leading-relaxed">
            <p>
              <strong>DECK / divider is an informational cataloging and deckbuilding tool, NOT a licensed financial advisor, certified appraiser, or investment service.</strong>
            </p>
            <ul className="space-y-2 font-mono text-xs text-amber-900/90">
              <li>• <strong>Estimated Market Values:</strong> All card values, graded slab premiums, and sealed portfolio valuations are automated approximations calculated from third-party marketplace transaction feeds (including TCGplayer and eBay). Actual realized prices may vary widely based on individual buyer demand, localized market shifts, centering, surface condition, or grading turnaround times.</li>
              <li>• <strong>No Investment Advice:</strong> Nothing contained within the service constitutes tax advice, financial counseling, or a recommendation to buy, sell, or hold collectibles as an investment asset. You assume sole responsibility for any financial decisions made.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Subscriptions, Billing & Cancellations */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            3. Subscription Plans, Billing &amp; 7-Day Guarantee
          </h2>
          <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <p>
              DECK / divider offers free starter access, flexible pay-per-period subscription passes, and a permanent Founder Lifetime option:
            </p>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 sm:p-5 font-mono text-xs space-y-2">
              <div>• <strong>Starter Plan ($0/mo):</strong> 6 decks (full 60-card decks), 5 wishlists (100 items/list), 25 graded slabs, 15 sealed items. 100% free forever without payment information.</div>
              <div>• <strong>Bunch Plan ($4/mo or $42/yr):</strong> 15 decks, 15 wishlists, 100 graded slabs, 50 sealed items, multi-currency live FX.</div>
              <div>• <strong>Stack Plan ($7/mo or $75/yr):</strong> 30 decks, 30 wishlists, 300 graded slabs, 150 sealed items, GLC &amp; retro tournament specs.</div>
              <div>• <strong>Deck Plan ($11/mo or $120/yr):</strong> 60 decks, 60 wishlists, 1,000 graded slabs, 500 sealed items, standardized CSV export.</div>
              <div>• <strong>Collection Plan ($14/mo or $150/yr):</strong> Unlimited decks, cards, wishlists, slabs, and vault assets.</div>
              <div className="pt-2 border-t border-[#E2E8F0] text-[#DC143C] font-bold">• <strong>Founder Lifetime Pass ($250 One-Time):</strong> Permanent Collection Tier access with zero future renewal charges. Capped strictly at the first 100 purchasers with live registry slot tracking. Never expires.</div>
            </div>
            <ul className="space-y-2 font-mono text-xs text-[#334155] pt-2">
              <li>• <strong>Flexible Subscription Model:</strong> Standard plans are pay-per-period subscription passes (30-day Monthly or 365-day Annual). There are zero continuous forced mandates or locked recurring obligations. You can opt out or choose not to renew at any time.</li>
              <li>• <strong>Opt Out &amp; Graceful Reversion:</strong> If you choose not to renew a pass, your account safely reverts to the Free Starter tier upon period end. No cards, decks, or portfolio data are ever deleted.</li>
              <li>• <strong>7-Day Money-Back Guarantee:</strong> First-time paid pass purchasers may request a full refund within 7 days of payment by emailing deckdivider@outlook.com.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Acceptable Use & Account Conduct */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            4. Acceptable Use
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            You agree not to misuse the service. Prohibited activities include:
          </p>
          <ul className="space-y-1.5 font-mono text-xs text-[#64748B]">
            <li>• Attempting to disrupt or overwhelm our infrastructure via automated DDoS or scraping bots.</li>
            <li>• Reverse engineering, decompiling, or attempting to extract proprietary source code.</li>
            <li>• Sharing account credentials or circumventing tier capacity constraints.</li>
            <li>• Uploading malicious payloads, harmful scripts, or fraudulent certificate numbers.</li>
          </ul>
        </section>

        {/* Section 5: Intellectual Property & Fair Use Disclaimer */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            5. Intellectual Property &amp; Trademarks (Fair Use Notice)
          </h2>
          <div className="space-y-3 text-sm text-[#475569] leading-relaxed">
            <p>
              <strong>DECK / divider is an independent fan-made cataloging application and is NOT affiliated with, sponsored by, endorsed by, or associated with Nintendo, Creatures Inc., GAME FREAK inc., or The Pokémon Company International.</strong>
            </p>
            <p className="text-xs text-[#64748B]">
              Pokémon and Pokémon character names, card designs, artwork, and expansion logos are registered trademarks of Nintendo, Creatures Inc., and GAME FREAK inc. All card photography and illustrations are displayed for identification, review, and educational tournament organization purposes under Fair Use.
            </p>
          </div>
        </section>

        {/* Section 6: Limitation of Liability */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            6. Limitation of Liability
          </h2>
          <p className="text-sm text-[#475569] leading-relaxed">
            To the maximum extent permitted by applicable law, DECK / divider and its developer shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, goodwill, or collectibles market depreciation, resulting from your access to or inability to use the service.
          </p>
        </section>

        {/* Section 7: Contact */}
        <section className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
          <h2 className="text-xl font-bold text-[#0F172A] font-heading">
            7. Legal Contact
          </h2>
          <div className="font-mono text-xs text-[#0F172A] bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-1">
            <div><strong>Operator:</strong> Gurutva Murdia (DECK / divider)</div>
            <div><strong>Email:</strong> deckdivider@outlook.com</div>
          </div>
        </section>

        <PtcPartnerBanner />
        <PublicInterlinkMesh currentPath="/terms" />
      </main>

      <LandingFooter
        onEnterApp={() => navigate('/app')}
        onOpenAuth={onOpenAuth}
      />
    </div>
  );
};
