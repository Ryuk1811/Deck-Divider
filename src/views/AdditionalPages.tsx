import React from 'react';
import { motion } from 'motion/react';
import { Shield, BookOpen, Layers, Users, Mail, Bell, FileText, Zap } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../components/landing/LandingMotionDirectorate';

const easeCurve = [0.16, 1, 0.3, 1];

const PageTemplate = ({ 
  title, 
  icon: Icon, 
  subtitle, 
  children,
  onOpenAuth,
  onNavigateHome,
  onNavigateHowItWorks 
}: any) => (
  <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
    <LandingMotionDirectorate />
    <LandingNav
      onOpenAuth={onOpenAuth}
      onNavigateSection={(id) => {
        if (id === 'how-it-works') onNavigateHowItWorks();
        else onNavigateHome();
      }}
    />
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12 relative z-10">
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easeCurve }}
        className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl p-6 sm:p-10 lg:p-12 prose prose-slate prose-a:text-[#DC143C] max-w-none"
      >
        {children}
      </motion.div>
    </main>
    <LandingFooter onOpenAuth={onOpenAuth} onNavigateSection={() => {}} />
  </div>
);

export const FeaturesPageView = (props: any) => (
  <PageTemplate title="All Features" subtitle="Platform Overview" icon={Zap} {...props}>
    <h3>Comprehensive Portfolio Tracking</h3>
    <p>Track raw cards and graded slabs across all Pokémon TCG sets. Our multi-currency system calculates Live NAV in USD, EUR, GBP, and JPY utilizing real-time TCGplayer market data.</p>
    <ul>
      <li>Live dynamic pricing</li>
      <li>Automatic currency conversions</li>
      <li>Historical NAV charts and insights</li>
      <li>Sealed product portfolio integration</li>
    </ul>
    <h3>Advanced Deck Builder</h3>
    <p>Construct tournament-legal decks in milliseconds. Our builder checks standard rotation legality, identifies banned cards, and exports directly to PTCGL with one click.</p>
    <h3>Master Set Completion</h3>
    <p>Track your master sets efficiently. Easily identify missing Reverse Holos, Secret Rares, and promotional variants. Generate missing cards checklists in seconds.</p>
    <h3>Intelligent Price Alerts</h3>
    <p>Never miss a market dip again. Set custom price drop alerts for high-value singles and slabs, and receive push notifications or emails when your targets are hit.</p>
  </PageTemplate>
);

export const ChangelogPageView = (props: any) => (
  <PageTemplate title="Changelog" subtitle="Product Updates" icon={Bell} {...props}>
    <h3>v2.1.0 - The Sealed Vault Update (Sep 2026)</h3>
    <ul>
      <li><strong>Added:</strong> Complete support for tracking sealed ETBs, Booster Boxes, and Blisters.</li>
      <li><strong>Added:</strong> Public Showcase links for custom collections.</li>
      <li><strong>Improved:</strong> Search performance increased by 40% globally.</li>
    </ul>
    <h3>v2.0.0 - Global Currency Sync (Aug 2026)</h3>
    <ul>
      <li><strong>Added:</strong> Live exchange rate engine for EUR, GBP, JPY, and CAD.</li>
      <li><strong>Changed:</strong> Overhauled the deck builder UI for mobile users.</li>
      <li><strong>Fixed:</strong> Corrected PTCGL export formatting for SV era special energies.</li>
    </ul>
    <h3>v1.5.0 - Early Access Release</h3>
    <p>The original launch of DECK / divider featuring the core portfolio tracker, basic deck builder, and TCGplayer market sync.</p>
  </PageTemplate>
);

export const SupportPageView = (props: any) => (
  <PageTemplate title="Support Center" subtitle="Help & Resources" icon={BookOpen} {...props}>
    <h3>How can we assist you?</h3>
    <p>Whether you're encountering a bug, need help navigating the Master Set tools, or have questions about your PayPal subscription, our support team is ready to help.</p>
    <h3>Knowledge Base</h3>
    <p>Before submitting a ticket, consider reviewing our comprehensively documented <a href="/faq">FAQ & Insights</a> page which resolves 90% of user queries instantly.</p>
    <h3>Contact Support</h3>
    <p>If you require direct assistance, please email us at <strong>deckdivider@outlook.com</strong>. We aim to respond to all technical and billing inquiries within 24 business hours.</p>
  </PageTemplate>
);

export const ContactPageView = (props: any) => (
  <PageTemplate title="Contact Us" subtitle="Get In Touch" icon={Mail} {...props}>
    <h3>Business Inquiries & Partnerships</h3>
    <p>DECK / divider is constantly looking to integrate with local game stores (LGS), tournament organizers, and content creators. If you represent a business or organization in the Pokémon TCG space, we'd love to chat.</p>
    <ul>
      <li><strong>General & Support:</strong> deckdivider@outlook.com</li>
      <li><strong>Business Development:</strong> deckdivider@outlook.com</li>
    </ul>
    <h3>Social Media & Community</h3>
    <p>Follow our journey, vote on upcoming features, and connect with other passionate collectors on our official community channels (coming soon).</p>
  </PageTemplate>
);

export const CookiePolicyView = (props: any) => (
  <PageTemplate title="Cookie Policy" subtitle="Privacy Controls" icon={FileText} {...props}>
    <h3>Our Stance on Cookies</h3>
    <p>We use absolute minimal cookies. As a platform built for privacy-conscious users, we deploy zero third-party advertising cookies, zero cross-site trackers, and zero invasive telemetry systems.</p>
    <h3>Essential Cookies Only</h3>
    <ul>
      <li><strong>Authentication:</strong> We use secure, HTTP-only cookies and tokens via Firebase Auth to keep you logged in securely across sessions.</li>
      <li><strong>Preferences:</strong> We store basic local state (like your preferred currency or theme) in your browser's LocalStorage to ensure the platform feels like home every time you open it.</li>
      <li><strong>Security:</strong> We employ necessary security tokens (such as CSRF protection) to prevent malicious actors from compromising your session.</li>
    </ul>
    <p>By using DECK / divider, you consent strictly to these essential functional data pieces.</p>
  </PageTemplate>
);

export const SecurityPageView = (props: any) => (
  <PageTemplate title="Security Architecture" subtitle="Enterprise Grade" icon={Shield} {...props}>
    <h3>Data Encryption & Infrastructure</h3>
    <p>Your portfolio is your private asset. We secure all data in transit utilizing industry-standard TLS 1.3 encryption. All database records (including your lists, decks, and collection data) are encrypted at rest using AES-256 via Google Cloud infrastructure.</p>
    <h3>Authentication Security</h3>
    <p>We utilize Firebase Authentication, providing robust resistance against brute-force attacks, credential stuffing, and session hijacking. We never store or transmit your raw passwords.</p>
    <h3>Payment Processing</h3>
    <p>DECK / divider does not store, process, or transmit your credit card data. All subscription billing is securely handled off-site by PayPal's PCI-DSS compliant payment gateways.</p>
    <h3>Vulnerability Reporting</h3>
    <p>If you are a security researcher and believe you have discovered a vulnerability, please disclose it responsibly by contacting us at <strong>deckdivider@outlook.com</strong>.</p>
  </PageTemplate>
);

export const MediaKitPageView = (props: any) => (
  <PageTemplate title="Media Kit" subtitle="Brand Assets" icon={Layers} {...props}>
    <h3>Brand Guidelines</h3>
    <p>The DECK / divider brand represents institutional precision, clean design, and a modern approach to the Pokémon TCG hobby. When referencing us in articles, videos, or streams, please adhere to these guidelines.</p>
    <h3>Logo & Naming</h3>
    <ul>
      <li>Always write the name as <strong>DECK / divider</strong>. Not DeckDivider, Deck Divider, or Deck-Divider.</li>
      <li>Do not alter the proportions or colors of our official logo marks.</li>
      <li>Ensure adequate padding (negative space) around all brand marks.</li>
    </ul>
    <h3>Assets</h3>
    <p>To request high-resolution SVG or PNG versions of our logos, brand marks, or application mockups for press usage, please email deckdivider@outlook.com.</p>
  </PageTemplate>
);
