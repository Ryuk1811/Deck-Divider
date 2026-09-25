import React from 'react';
import { motion } from 'motion/react';
import { Shield, BookOpen, Layers, Users, Mail, Bell, FileText, Zap } from 'lucide-react';
import { LandingNav } from '../../components/landing/LandingNav';
import { LandingFooter } from '../../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../../components/landing/LandingMotionDirectorate';
import { PageHead, GeoBreadcrumbs } from '../../components/seo/PageHead';
import { PtcPartnerBanner } from '../../components/common/PtcPartnerBanner';
import { PublicInterlinkMesh } from '../../components/seo/PublicInterlinkMesh';

const easeCurve = [0.16, 1, 0.3, 1] as const;

const PageTemplate = ({ 
  title, 
  icon: Icon, 
  subtitle, 
  canonicalPath,
  description,
  keywords,
  children,
  onOpenAuth,
  onNavigateHome,
  onNavigateHowItWorks 
}: any) => (
  <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
    <PageHead
      title={`${title} | DECK / divider`}
      description={description || `${title} on DECK / divider.`}
      canonicalPath={canonicalPath}
      keywords={keywords || ['deck divider', 'pokemon tcg']}
    />
    <LandingMotionDirectorate />
    <LandingNav
      onOpenAuth={onOpenAuth}
      onNavigateSection={(id) => {
        if (id === 'how-it-works') onNavigateHowItWorks();
        else onNavigateHome();
      }}
    />
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 relative z-10">
      {canonicalPath && (
        <GeoBreadcrumbs items={[{ label: title, path: canonicalPath }]} />
      )}
      <section className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeCurve }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-xs font-semibold shadow-xs"
        >
          <Icon className="w-3.5 h-3.5" />
          <span className="font-mono tracking-tight uppercase">{subtitle}</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] font-heading"
        >
          {title}
        </motion.h1>
      </section>

      {/* PTC Collectibles Partner Offer */}
      <PtcPartnerBanner />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easeCurve }}
        className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl p-6 sm:p-10 lg:p-12 prose prose-slate prose-a:text-[#DC143C] max-w-none"
      >
        {children}
      </motion.div>
    </main>
    <PublicInterlinkMesh currentPath={canonicalPath} />
    <LandingFooter onOpenAuth={onOpenAuth} onNavigateSection={() => {}} />
  </div>
);

export const ContactPageView = (props: any) => (
  <PageTemplate
    title="Contact & Support"
    subtitle="Get In Touch"
    icon={Mail}
    canonicalPath="/contact"
    description="Contact the DECK / divider team for official support, bug reports, feature suggestions, or business inquiries at deckdivider@outlook.com."
    keywords={['contact deck divider', 'deck divider support', 'pokemon card tracker help']}
    {...props}
  >
    <h3>Direct Collector Support</h3>
    <p>Whether you have questions about card pricing, feature requests, missing promos, or need help with your account, our team is ready to assist.</p>
    <ul>
      <li><strong>Official Contact:</strong> <a href="mailto:deckdivider@outlook.com">deckdivider@outlook.com</a></li>
    </ul>
    <h3>Knowledge Base</h3>
    <p>Looking for quick answers? Browse our comprehensive <a href="/faq">Frequently Asked Questions</a> for instant guidance on collection management, deck legality, and pricing accuracy.</p>
  </PageTemplate>
);

export const SecurityPageView = (props: any) => (
  <PageTemplate
    title="Security Architecture"
    subtitle="Data Protection"
    icon={Shield}
    canonicalPath="/security"
    description="Explore the institutional security architecture of DECK / divider: TLS 1.3 in-transit encryption, Google Cloud AES-256 at-rest storage, and zero ad trackers."
    keywords={['deck divider security', 'pokemon collection privacy', 'encrypted card binder']}
    {...props}
  >
    <h3>Data Encryption &amp; Infrastructure</h3>
    <p>Your portfolio is your private asset. We secure all data in transit utilizing industry-standard TLS 1.3 encryption. All database records (including your lists, decks, and collection data) are encrypted at rest using AES-256 via Google Cloud infrastructure.</p>
    <h3>Authentication Security</h3>
    <p>We utilize Firebase Authentication, providing robust resistance against brute-force attacks, credential stuffing, and session hijacking. We never store or transmit your raw passwords.</p>
    <h3>Payment Processing</h3>
    <p>DECK / divider does not store, process, or transmit your credit card data. All subscription billing is securely handled off-site by PayPal's PCI-DSS compliant payment gateways.</p>
    <h3>Vulnerability Reporting</h3>
    <p>If you are a security researcher and believe you have discovered a vulnerability, please disclose it responsibly by contacting us at <a href="mailto:deckdivider@outlook.com">deckdivider@outlook.com</a>.</p>
  </PageTemplate>
);
