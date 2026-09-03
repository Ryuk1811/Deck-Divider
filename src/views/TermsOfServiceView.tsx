import React from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { LandingNav } from '../components/landing/LandingNav';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LandingMotionDirectorate } from '../components/landing/LandingMotionDirectorate';

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
  const easeCurve = [0.16, 1, 0.3, 1] as const;

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
            Terms of Service
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
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing or using DECK / divider (the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </p>

          <h3>2. Fan Project Disclaimer & Intellectual Property</h3>
          <p>
            <strong>DECK / divider is an independent fan project and is not affiliated with, endorsed by, or sponsored by The Pokémon Company, Nintendo, or Game Freak.</strong>
            <br /><br />
            All original code, interface designs, layout architecture, and custom graphics associated with DECK / divider are the intellectual property of the DECK / divider team. However, Pokémon, Pokémon character names, and Pokémon TCG card images are trademarks of Nintendo, Creatures Inc., and Game Freak. The Service uses these assets solely for educational, organizational, and informational purposes.
          </p>

          <h3>3. Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>

          <h3>4. Subscriptions and Billing</h3>
          <p>
            Certain premium features of DECK / divider require an active subscription. All payments are processed securely via PayPal. By subscribing, you authorize us (via our payment processor) to charge your selected payment method on a recurring basis. You may cancel your subscription at any time through your account settings or directly via PayPal. Refunds are handled on a case-by-case basis at our sole discretion.
          </p>

          <h3>5. Acceptable Use</h3>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul>
            <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law.</li>
            <li>Attempting to reverse engineer, scrape, bypass, or exploit the Service's APIs, infrastructure, or pricing systems.</li>
            <li>Publishing or sharing decks/lists that contain malicious links, hate speech, or content designed to harass others.</li>
            <li>Attempting to interfere with the proper functioning of the Service, including DDoS attacks or unauthorized access to our databases.</li>
          </ul>

          <h3>6. Limitation of Liability</h3>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for extreme precision and uptime, DECK / divider shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues resulting from your use of the Service, market value fluctuations, or temporary infrastructure outages.
          </p>

          <h3>7. Contact Us</h3>
          <p>
            If you require support or have questions about these Terms, please contact us.
            <br /><br />
            <strong>Email:</strong> <a href="mailto:support@deckdivider.com">support@deckdivider.com</a>
          </p>
        </motion.div>
      </main>

      <LandingFooter />
    </div>
  );
};
