import { motion } from 'framer-motion';
import { ArrowLeft, FileText, CheckCircle, AlertTriangle, Scale, ShieldCheck, Mail } from 'lucide-react';
import { ThemeToggle } from '../context/ThemeContext';
import Button from '../components/ui/Button';

export default function TermsView({ onBack }) {
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
              Legal & Terms
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <FileText className="w-3.5 h-3.5" />
              <span>Standard Terms of Service</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-cricket-title tracking-wide text-theme-primary uppercase">
              Terms & Conditions
            </h1>
            <p className="text-theme-muted text-xs font-mono mt-2">
              Last Updated: October 31, 2026 • Effective Date: October 31, 2026
            </p>
          </div>

          {/* Section 1: Acceptance of Terms */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              1. Acceptance & Description of Service
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>
                By accessing or using <strong>CricScript AI</strong>, you agree to be bound by these Terms and Conditions.
                CricScript AI provides cricket content creators, journalists, and enthusiasts with autonomous multi-hop research tools and cadence-matched Hinglish documentary script generation.
              </p>
              <p>
                The service is provided on an anonymous, stateless basis without requiring user account creation.
              </p>
            </div>
          </section>

          {/* Section 2: Acceptable Use & Prohibited Conduct */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D91F2B]" />
              2. Acceptable Use & Prohibited Conduct
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>You agree not to use CricScript AI to:</p>
              <ul className="list-disc pl-5 space-y-1 text-theme-muted">
                <li>Submit automated denial-of-service (DoS) requests or bypass rate limits.</li>
                <li>Conduct abusive automated scraping or extraction of platform infrastructure.</li>
                <li>Generate defamatory, hateful, abusive, or explicitly unlawful content concerning athletes, officials, or third parties.</li>
                <li>Attempt to reverse-engineer, inject malicious payloads, or compromise server environments.</li>
              </ul>
            </div>
          </section>

          {/* Section 3: Intellectual Property & Output Ownership */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              3. Intellectual Property & Output Rights
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>
                <strong>Your Generated Scripts:</strong> You retain full creative rights to the text scripts and documentary dossiers generated through your prompts. You are free to publish, narrate, and monetize video essays created with these scripts.
              </p>
              <p>
                <strong>Cricket Authority Trademarks:</strong> Player names, team identities, tournament names (e.g. ICC, IPL, The Ashes, BCCI), match scorecards, and historical records remain the intellectual property and historical heritage of their respective cricket governing bodies and archives. CricScript AI references public sports facts under fair use principles.
              </p>
            </div>
          </section>

          {/* Section 4: Disclaimers & Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              4. Service Availability & Disclaimers
            </h2>
            <div className="text-xs text-theme-secondary space-y-2 leading-relaxed">
              <p>
                CricScript AI is provided on an "AS IS" and "AS AVAILABLE" basis. While our multi-hop agent enforces strict fact grounding against verified archives, AI-generated material should be reviewed for journalistic accuracy prior to high-stakes broadcast.
              </p>
              <p>
                We do not guarantee uninterrupted availability and reserve the right to modify or adjust rate limits to protect shared infrastructure without liability.
              </p>
            </div>
          </section>

          {/* Section 5: Governing Law & Inquiries */}
          <section className="space-y-3 border-t border-theme-subtle pt-6">
            <h2 className="text-lg font-cricket-title uppercase tracking-wide text-theme-primary flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#D91F2B]" />
              5. Governing Law & Contact
            </h2>
            <p className="text-xs text-theme-secondary leading-relaxed">
              These terms are governed by applicable laws in [Operating Jurisdiction: e.g. India / Delaware, USA].
              For legal inquiries, contact:
            </p>
            <div className="p-4 rounded-xl bg-theme-card border border-theme-subtle text-xs space-y-1 font-mono text-theme-muted">
              <p><span className="text-theme-primary font-semibold">Legal Contact:</span> legal@[your-domain].com</p>
              <p><span className="text-theme-primary font-semibold">Service:</span> CricScript AI Studio</p>
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
