import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Loader2 } from 'lucide-react';
import { DeckDividerBrand } from '../components/DeckDividerBrand';

export function AuthView({ 
  onBack,
}: { 
  onBack?: () => void;
  onGuestAccess?: () => void;
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // If user is already authenticated, automatically redirect to /app
  useEffect(() => {
    if (user) {
      navigate('/app', { replace: true });
    }
  }, [user, navigate]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email address & filter disposable domains
    const validation = validateEmailAddress(email);
    if (!validation.valid) {
      setError(validation.error || 'Invalid email address.');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (name.trim()) {
          await updateProfile(userCred.user, { displayName: name.trim() });
        }
      }
      navigate('/app');
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized in Firebase Auth. Please add it in your Firebase Console > Auth > Settings > Authorized Domains.';
      }
      setError(msg);
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      await signInWithPopup(auth, provider);
      navigate('/app');
    } catch (err: any) {
      console.error(err);
      let msg = err.message || 'Failed to sign in with Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Google sign-in popup was closed before completing.';
      } else if (err.code === 'auth/unauthorized-domain') {
        msg = 'This domain is not authorized in Firebase. Please add this app URL to Authorized Domains in Firebase Console.';
      }
      setError(msg);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-dot-grid bg-[#F8FAFC] font-mono select-none p-4">
      <div className="w-full max-w-md bg-white p-8 border border-[#E2E8F0] shadow-2xl rounded-2xl relative">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <span>← Back</span>
        </button>

        <div className="flex justify-center mb-6">
          <DeckDividerBrand size="lg" showLogo={true} onClick={() => navigate('/')} className="cursor-pointer" />
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

        <div className="mt-6 text-center">
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
        </div>
      </div>
    </div>
  );
}
