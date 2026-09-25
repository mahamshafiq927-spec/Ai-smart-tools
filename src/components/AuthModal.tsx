import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X,
  RefreshCw
} from 'lucide-react';
import { authService } from '../lib/authService.ts';
import type { User } from '../types/index.ts';

export type AuthMode = 'login' | 'signup' | 'forgot';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: AuthMode;
  onSuccess: (user: User) => void;
  isFullPage?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
  isFullPage = false,
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setError(null);
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  if (!isOpen && !isFullPage) return null;

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      // Calls real Firebase Auth or secure built-in OAuth provider
      const user = await authService.signInWithGoogle();
      onSuccess(user);
      if (!isFullPage) onClose();
    } catch (err: any) {
      setError(err?.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Authentication
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (mode === 'signup') {
        if (!email.trim() || !password) {
          throw new Error('Please fill in both email and password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        const user = await authService.signUpWithEmail(displayName, email, password);
        onSuccess(user);
        if (!isFullPage) onClose();
      } else if (mode === 'login') {
        if (!email.trim() || !password) {
          throw new Error('Please enter your email and password.');
        }
        const user = await authService.signInWithEmail(email, password);
        onSuccess(user);
        if (!isFullPage) onClose();
      } else if (mode === 'forgot') {
        if (!email.trim()) {
          throw new Error('Please enter your registered email address.');
        }
        const msg = await authService.sendPasswordReset(email);
        setSuccessMessage(msg);
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 relative">
      
      {/* Close button (if modal overlay) */}
      {!isFullPage && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header with MagicAI Logo */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-xl shadow-indigo-500/20 mb-3">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          {mode === 'login' && 'Welcome to MagicAI'}
          {mode === 'signup' && 'Create Your MagicAI Account'}
          {mode === 'forgot' && 'Reset Your Password'}
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {mode === 'login' && 'Sign in to access 8 free AI smart tools.'}
          {mode === 'signup' && 'Join thousands of creators using free AI tools.'}
          {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{error}</div>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-emerald-300 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{successMessage}</div>
        </div>
      )}

      {/* Primary: Google Sign In (for login & signup) */}
      {mode !== 'forgot' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {/* Google Multicolor SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-500 font-medium">
              or continue with email
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>
        </div>
      )}

      {/* Email / Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {mode !== 'forgot' && (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setError(null);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>
                {mode === 'login' && 'Sign In with Email'}
                {mode === 'signup' && 'Create Free Account'}
                {mode === 'forgot' && 'Send Password Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch between Modes */}
      <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
        {mode === 'login' && (
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Create New Account
            </button>
          </p>
        )}

        {mode === 'signup' && (
          <p>
            Already have an account?{' '}
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        )}

        {mode === 'forgot' && (
          <p>
            Remembered your password?{' '}
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
            >
              Back to Login
            </button>
          </p>
        )}
      </div>

      {/* Trust & Security footer */}
      <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Secure authentication • Gemini API Key kept on backend</span>
      </div>

    </div>
  );

  if (isFullPage) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
        {modalContent}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {modalContent}
    </div>
  );
};
