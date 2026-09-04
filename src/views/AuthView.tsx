import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { validateEmailAddress } from '../lib/emailValidator';
import { trackAuthView, trackSignupSubmit, trackSignupSuccess, trackLoginSuccess } from '../lib/analytics';
import { Loader2 } from 'lucide-react';
import { DeckDividerBrand } from '../components/DeckDividerBrand';

export function AuthView({ 
  onBack,
  onGuestAccess,
}: { 
  onBack?: () => void;
  onGuestAccess?: () => void;
}) {
  const navigate = useNavigate();
  const { user, loading: authLoading, signInWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Track auth page view on mount
  useEffect(() => {
    trackAuthView();
  }, []);

  // If user is already authenticated, automatically redirect to /app
  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  if (authLoading || user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-dot-grid bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <DeckDividerBrand size="md" showLogo={true} />
          <Loader2 className="w-5 h-5 animate-spin text-[#DC143C]" />
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email address & filter disposable domains
    const validation = validateEmailAddress(email);
    if (!validation.valid) {
      setError(validation.error || 'Invalid email address.');
      return;
    }

    // Validate password
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    if (!isLogin) {
      trackSignupSubmit('email');
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
        trackLoginSuccess('email');
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(userCred.user, { displayName: name.trim() });
        }
        trackSignupSuccess('email');
      }
      try {
        localStorage.removeItem('dd_guest_mode');
      } catch (e) {}
      navigate('/app');
    } catch (err: any) {
      console.error('[Firebase Auth Error]', err);
      let msg = 'An unexpected error occurred during authentication.';
      
      const errorCode = err.code || '';
      if (
        errorCode === 'auth/invalid-credential' || 
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/wrong-password' ||
        errorCode === 'auth/invalid-login-credentials'
      ) {
        msg = isLogin 
          ? 'Invalid email or password. If you do not have an account yet, click "Sign up" below.'
          : 'Invalid credentials provided.';
      } else if (errorCode === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please switch to "Sign in" below.';
      } else if (errorCode === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (errorCode === 'auth/invalid-email') {
        msg = 'Please provide a valid email address format.';
      } else if (errorCode === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is disabled in your Firebase project. Please enable "Email/Password" in Firebase Console > Authentication > Sign-in method.';
      } else if (errorCode === 'auth/internal-error') {
        msg = 'Firebase Auth Internal Error: Please ensure "Email/Password" sign-in provider is enabled in your Firebase Console (Authentication > Sign-in method), or use "Continue with Google".';
      } else if (errorCode === 'auth/too-many-requests') {
        msg = 'Access temporarily disabled due to multiple failed attempts. Please wait a moment and try again.';
      } else if (errorCode === 'auth/network-request-failed') {
        msg = 'Network error. Please check your internet connection and try again.';
      } else if (errorCode === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        msg = `Domain "${currentDomain}" is not authorized. Add it in Firebase Console > Authentication > Settings > Authorized Domains.`;
      } else if (err.message) {
        // Strip raw "Firebase: Error (auth/...)" prefix if present for clean readability
        msg = err.message.replace(/^Firebase:\s*Error\s*\((auth\/[^)]+)\)\.?/i, '$1:').trim() || err.message;
      }
      
      setError(msg);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    trackSignupSubmit('google');

    try {
      if (signInWithGoogle) {
        await signInWithGoogle();
      } else {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        provider.setCustomParameters({
          prompt: 'select_account'
        });
        await signInWithPopup(auth, provider);
      }
      trackSignupSuccess('google');
      try {
        localStorage.removeItem('dd_guest_mode');
      } catch (e) {}
      navigate('/app');
    } catch (err: any) {
      console.warn('[Google Auth Error]', err);
      setGoogleLoading(false);

      if (
        err.code === 'auth/popup-closed-by-user' || 
        err.code === 'auth/cancelled-popup-request' ||
        err.message?.includes('closed-by-user')
      ) {
        return;
      }

      let msg = 'Google Sign-In failed. Please try again.';
      if (err.code === 'auth/popup-blocked') {
        msg = 'Sign-in popup was blocked by the browser. Please allow popups for this site.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized in Firebase Auth settings.';
      } else if (err.message) {
        msg = err.message.replace(/^Firebase:\s*Error\s*\((auth\/[^)]+)\)\.?/i, '').trim() || err.message;
      }
      
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-dot-grid bg-[#F8FAFC] font-mono select-none p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 border border-[#E2E8F0] shadow-2xl rounded-2xl relative">
        <Link
          to="/"
          onClick={() => onBack && onBack()}
          className="absolute top-4 left-4 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>← Back to Home</span>
        </Link>

        <div className="flex justify-center mb-6">
          <Link to="/" className="cursor-pointer" aria-label="DECK / divider Home">
            <DeckDividerBrand size="lg" showLogo={true} />
          </Link>
        </div>

        <h1 className="font-heading font-bold text-2xl text-center text-[#0F172A] mb-1">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-center text-xs text-[#64748B] mb-6">
          {isLogin 
            ? 'Access your Pokemon TCG portfolio & deck builder.' 
            : 'Join Deck Divider to manage your portfolio.'}
        </p>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full h-11 mb-5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#CBD5E1] rounded-md text-xs font-bold transition-all flex items-center justify-center gap-3 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          {googleLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#DC143C]" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-2 items-center mb-5">
          <div className="flex-grow border-t border-[#E2E8F0]"></div>
          <span className="flex-shrink mx-4 text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">Or with email</span>
          <div className="flex-grow border-t border-[#E2E8F0]"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#0F172A]">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-md text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none transition-all"
                placeholder="Trainer Ash"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F172A]">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-md text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none transition-all"
              placeholder="name@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0F172A]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-[#E2E8F0] rounded-md text-sm focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-[#FFF0F3] border border-[#DC143C]/20 rounded-md">
              <p className="text-[11px] text-[#DC143C] font-semibold leading-relaxed">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full h-10 mt-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-sm font-bold rounded-md transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLogin ? 'Sign In with Email' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>

          <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                if (onGuestAccess) {
                  onGuestAccess();
                } else {
                  try {
                    localStorage.setItem('dd_guest_mode', 'true');
                  } catch (e) {}
                  navigate('/app');
                }
              }}
              className="text-xs font-mono text-slate-500 hover:text-[#DC143C] transition-colors cursor-pointer"
            >
              Or continue in Guest / Demo Mode →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
