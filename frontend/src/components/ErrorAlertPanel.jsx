import { motion } from 'framer-motion';
import Button from './ui/Button';
import {
  AlertTriangle,
  RotateCcw,
  X,
  ShieldAlert,
  Clock,
  WifiOff,
  ServerCrash,
  KeyRound,
  Coins
} from 'lucide-react';

export default function ErrorAlertPanel({ error, onRetry, onDismiss, className = '' }) {
  if (!error) return null;

  // Extract normalized fields
  const message = typeof error === 'string' ? error : (error.message || 'An error occurred during generation.');
  const errorType = error.errorType || 'SERVER_ERROR';
  const statusCode = error.statusCode;
  const retryable = error.retryable !== false;
  const actionHint = error.actionHint;

  // Visual configuration based on error type
  const config = {
    QUOTA_EXHAUSTED: {
      title: 'AI Quota / Usage Allowance Exhausted',
      badge: 'QUOTA EXHAUSTED • 429',
      icon: Coins,
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      glow: 'shadow-rose-500/10',
      textAccent: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300',
      defaultHint: 'Google Gemini quota or free-tier credit limit reached. Check usage in Google AI Studio or update your API key in backend/.env.',
    },
    RATE_LIMITED: {
      title: 'Provider Rate Limit Reached',
      badge: 'RATE LIMIT • 429',
      icon: Clock,
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      glow: 'shadow-amber-500/10',
      textAccent: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300',
      defaultHint: 'The LLM provider is throttling requests. Wait 20-30 seconds before retrying.',
    },
    AUTH_FAILURE: {
      title: 'API Authentication / Key Failure',
      badge: `AUTH ERROR • ${statusCode || 401}`,
      icon: KeyRound,
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      glow: 'shadow-red-500/10',
      textAccent: 'text-red-600 dark:text-red-400',
      badgeBg: 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300',
      defaultHint: 'Verify that GEMINI_API_KEY in backend/.env is present, valid, and enabled for Gemini 3.8 models.',
    },
    TIMEOUT: {
      title: 'Generation Request Timed Out',
      badge: 'GATEWAY TIMEOUT • 504',
      icon: WifiOff,
      border: 'border-orange-500/40',
      bg: 'bg-orange-500/10',
      glow: 'shadow-orange-500/10',
      textAccent: 'text-orange-600 dark:text-orange-400',
      badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-700 dark:text-orange-300',
      defaultHint: 'The upstream AI model took too long to complete. Click Retry to re-dispatch the synthesis.',
    },
    VALIDATION_ERROR: {
      title: 'Invalid Request Parameters',
      badge: 'VALIDATION • 400',
      icon: AlertTriangle,
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      glow: 'shadow-amber-500/10',
      textAccent: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300',
      defaultHint: 'Ensure the documentary topic is non-empty and valid.',
    },
    SERVER_ERROR: {
      title: 'Server Synthesis Failure',
      badge: `ERROR • ${statusCode || 500}`,
      icon: ServerCrash,
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      glow: 'shadow-red-500/10',
      textAccent: 'text-red-600 dark:text-red-400',
      badgeBg: 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300',
      defaultHint: 'An unexpected issue occurred on the server. You can retry the operation.',
    },
  }[errorType] || {
    title: 'Execution Error',
    badge: 'ERROR',
    icon: ShieldAlert,
    border: 'border-red-500/40',
    bg: 'bg-red-500/10',
    glow: 'shadow-red-500/10',
    textAccent: 'text-red-600 dark:text-red-400',
    badgeBg: 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300',
    defaultHint: 'Please review your inputs and try again.',
  };

  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl border ${config.border} ${config.bg} p-5 shadow-lg ${config.glow} transition-all ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className={`w-9 h-9 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center shrink-0 ${config.textAccent}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                {config.badge}
              </span>
              <h4 className="text-sm font-bold text-theme-primary">
                {config.title}
              </h4>
            </div>
            
            {/* The exact backend error message */}
            <p className="text-xs text-theme-secondary font-medium leading-relaxed pt-1 whitespace-pre-line">
              {message}
            </p>

            {/* Actionable Hint */}
            {(actionHint || config.defaultHint) && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-theme-app/60 border border-theme-subtle text-[11px] text-theme-muted flex items-start gap-2">
                <span className="font-mono font-bold text-theme-secondary shrink-0 uppercase tracking-wider text-[10px]">
                  💡 NEXT STEP:
                </span>
                <span className="leading-relaxed">
                  {actionHint || config.defaultHint}
                </span>
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-theme-muted hover:text-theme-primary p-1 rounded-lg hover:bg-theme-hover transition-colors shrink-0 cursor-pointer"
            title="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action Bar (Retry Button when appropriate) */}
      {retryable && onRetry && (
        <div className="mt-4 pt-3 border-t border-theme-subtle/60 flex items-center justify-between">
          <span className="text-[11px] text-theme-muted font-mono">
            This issue may be temporary and resolved on retry.
          </span>
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={onRetry}
            className="text-xs font-semibold"
          >
            Retry Generation
          </Button>
        </div>
      )}
    </motion.div>
  );
}
