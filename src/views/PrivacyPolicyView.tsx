import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../components/landing/LandingMotionDirectorate';

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
  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <div className="min-h-screen w-full bg-dot-grid text-[#0F172A] flex flex-col font-sans overflow-x-hidden relative selection:bg-[#DC143C] selection:text-white">
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

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-12 relative z-10">
        <section className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-[#DC143C] text-xs font-semibold shadow-xs"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="font-mono tracking-tight uppercase">Legal & Security</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] font-heading"
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
            className="text-slate-500 font-mono text-sm"
          >
            Effective Date: August 30, 2026
          </motion.p>
        </section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: easeCurve }}
          className="bg-white/90 backdrop-blur-md border border-[#E2E8F0] shadow-xl rounded-2xl p-6 sm:p-10 lg:p-12 prose prose-slate prose-a:text-[#DC143C] max-w-none"
        >
          <h3>Our Conviction</h3>
          <p>
            At DECK / divider, we build professional-grade tools for Pokémon TCG players and high-net-worth collectors. We are fundamentally opposed to the data-broker economy. Your personal collections, competitive decklists, and financial portfolio metrics are deeply private. We do not sell, rent, or trade your personal data. Period.
          </p>

          <h3>Data We Collect</h3>
          <p>To provide our services, we collect minimal data necessary for core functionality:</p>
          <ul>
            <li><strong>Account Information:</strong> When you register, we store your email address and authentication tokens to secure your account.</li>
            <li><strong>Portfolio & Deck Data:</strong> The cards you track, the decks you build, and your custom lists are stored to ensure your data persists across devices. This data remains strictly private unless you explicitly mark a deck or list as "Public".</li>
            <li><strong>Network & Security Data:</strong> We log basic IP addresses and edge routing metrics to prevent DDoS attacks, abuse, and to ensure global latency optimization.</li>
          </ul>

          <h3>Third-Party Processors</h3>
          <p>We partner with industry-leading, secure infrastructure providers to operate the platform:</p>
          <ul>
            <li><strong>Firebase (Google Cloud):</strong> Handles secure authentication and encrypted database hosting.</li>
            <li><strong>Cloudflare:</strong> Manages edge routing, SSL termination, and global asset delivery.</li>
            <li><strong>PayPal:</strong> Securely processes all subscription billing. DECK / divider never sees, touches, or stores your credit card numbers or raw financial instruments.</li>
            <li><strong>TCGdex:</strong> We utilize the TCGdex API for delivering high-resolution card images and bulk set data.</li>
          </ul>

          <h3>Your Rights & Data Ownership</h3>
          <p>
            You own your data. You have the right to access your portfolio metrics, export your decklists, and permanently delete your account and all associated records at any time. When you delete your account, your data is completely wiped from our active databases.
          </p>

          <h3>Contact Us</h3>
          <p>
            If you have any questions, concerns, or requests regarding your data, our engineering and security team is available to assist you.
            <br /><br />
            <strong>Email:</strong> <a href="mailto:privacy@deckdivider.com">privacy@deckdivider.com</a>
          </p>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
};
