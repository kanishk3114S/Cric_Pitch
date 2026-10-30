import { motion } from 'framer-motion';
import { ArrowLeft, Shield, Lock, EyeOff, Server, HardDrive, Mail } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';
import Button from '../components/ui/Button';

export default function PrivacyPolicyView({ onBack }) {
  return (
    <div className="min-h-screen bg-theme-app text-theme-primary flex flex-col justify-between transition-colors">
      
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-theme-header backdrop-blur-md border-b border-theme-subtle px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={onBack}
            className="text-xs font-semibold uppercase tracking-wider"
          >
            Back to App
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-theme-muted uppercase tracking-wider">
              Legal & Privacy
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Content Body ── */}
      <main className="max-w-4xl mx-auto w-full px-6 py-12 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Title Header */}
          <div className="border-b border-theme-subtle pb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Stateless & Anonymous SaaS Architecture</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-cricket-title tracking-wide text-theme-primary uppercase">
              Privacy Policy
            </h1>
            <p className="text-theme-muted text-xs font-mono mt-2">
              Last Updated: October 31, 2026 • Effective Date: October 31, 2026
            </p>
          </div>

          {/* Quick Summary Callout */}
          <div className="rounded-2xl border border-theme-medium bg-theme-card p-6 shadow-theme-card space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-theme-primary flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#D91F2B]" />
              Executive Privacy Summary
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed">
              CricScript AI is engineered from the ground up as a <strong>stateless, anonymous SaaS platform</strong>.
              We do not require user registration, login, passwords, email addresses, credit cards, or accounts.
              We do not track your identity across sessions, and we do not use tracking cookies or third-party advertising pixels.
            </p>
          </div>

          {/* Section 1: Information We Do NOT Collect */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-500" />
              1. Information We Do Not Collect
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>Because CricScript AI requires no user account, we do not collect, request, or store:</p>
              <ul className="list-disc pl-5 space-y-1 text-theme-muted">
                <li>Names, email addresses, or phone numbers.</li>
                <li>User passwords, authentication credentials, or OAuth tokens.</li>
                <li>Payment details, billing addresses, or banking information.</li>
                <li>Personal demographic or behavioral profiling identifiers.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Data Processed During Generation */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <Server className="w-5 h-5 text-[#D91F2B]" />
              2. Data Processed During Generation Requests
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>
                When you initiate a research investigation or script synthesis, your request payload (cricket match topic, key focus points, and research preferences) is transmitted over encrypted TLS (HTTPS) to our backend:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-theme-muted">
                <li>
                  <strong>Tavily Search API:</strong> Used to search public cricket match scorecards, archives, and press conference quotes.
                </li>
                <li>
                  <strong>Google Gemini API:</strong> Used to analyze retrieved match facts and generate the 3-part Hinglish script.
                </li>
                <li>
                  <strong>Transient In-Memory Processing:</strong> Payloads are processed purely in-memory and streamed back to your browser. No user queries or generated scripts are saved to a persistent user database.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Browser Storage & Cookies */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-amber-500" />
              3. Browser Storage & Cookies Inventory
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>
                <strong>Zero Tracking Cookies:</strong> CricScript AI operates entirely without HTTP session cookies, third-party analytics cookies, or advertising trackers.
              </p>
              <p>
                <strong>Local Storage:</strong> We use your browser’s local storage solely for the following essential, privacy-neutral preference:
              </p>
              <div className="p-3 rounded-xl bg-theme-elevated border border-theme-subtle font-mono text-[11px] text-theme-secondary">
                <span className="text-emerald-500 font-bold">cricscript-theme:</span> Stores your UI theme preference (<code>"dark"</code> or <code>"light"</code>) locally on your device.
              </div>
            </div>
          </section>

          {/* Section 4: Data Protection Rights */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary">
              4. Data Protection & Regulatory Compliance
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed">
              In accordance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> of India, the <strong>General Data Protection Regulation (GDPR)</strong>, and international privacy standards:
            </p>
            <p className="text-xs text-theme-muted leading-relaxed">
              Because we do not store personal data associated with individual identities, there is no personal data ledger to access, rectify, or erase. If you communicate with us via email, your correspondence is used strictly to respond to your inquiry and will not be shared or marketed.
            </p>
          </section>

          {/* Section 5: Operator Contact Information */}
          <section className="space-y-3 border-t border-theme-subtle pt-6">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#D91F2B]" />
              5. Operator & Contact Inquiries
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed">
              For any questions regarding this Privacy Policy or our anonymous architecture, please contact:
            </p>
            <div className="p-4 rounded-xl bg-theme-card border border-theme-subtle text-xs space-y-1 font-mono text-theme-muted">
              <p><span className="text-theme-primary font-semibold">Service Operator:</span> [Project Owner / Operating Entity Name]</p>
              <p><span className="text-theme-primary font-semibold">Support & Privacy Contact:</span> privacy@[your-domain].com</p>
              <p><span className="text-theme-primary font-semibold">Platform:</span> CricScript AI (https://cricpitch.vercel.app)</p>
            </div>
          </section>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-theme-subtle py-6 px-6 text-center text-xs text-theme-muted">
        <p>CricScript AI • Anonymous, Stateless Creator Studio • Strictly Fact-Grounded</p>
      </footer>

    </div>
  );
}
