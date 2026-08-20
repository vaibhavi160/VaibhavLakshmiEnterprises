import React, { useState } from 'react';
import { useApp, checkIsAdmin } from '../context/AppContext';
import { X, User, Lock, Mail, Phone, ArrowRight, Loader2, ShieldCheck, KeyRound, CheckCircle2, HelpCircle } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'forgot_password';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, login, register, forgotPassword, loginWithGoogle, showToast } = useApp();

  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!isAuthOpen) return null;

  const isAdminEmail = checkIsAdmin(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'forgot_password') {
      if (!email.trim()) {
        showToast('Please enter your email address.', 'error');
        return;
      }
      setLoading(true);
      try {
        await forgotPassword(email);
        setResetSent(true);
      } catch (err: any) {
        // Handled in forgotPassword with toast
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await register(email, password, fullName, phoneNumber);
      } else {
        await login(email, password);
      }
      setIsAuthOpen(false);
      setEmail('');
      setPassword('');
      setFullName('');
      setPhoneNumber('');
      setMode('login');
      setResetSent(false);
    } catch (err: any) {
      showToast(err.message || 'Authentication error', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        setIsAuthOpen(false);
        setMode('login');
        setResetSent(false);
      }
    } catch (err: any) {
      // Handled in loginWithGoogle
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 glass-backdrop flex items-center justify-center p-4">
      <div id="auth-modal-card" className="glass-modal-card rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative text-slate-900 dark:text-slate-100">
        <button
          id="auth-modal-close-btn"
          onClick={() => {
            setIsAuthOpen(false);
            setMode('login');
            setResetSent(false);
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5 space-y-1">
          <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-2">
            {mode === 'forgot_password' ? (
              <KeyRound className="w-6 h-6" />
            ) : mode === 'register' ? (
              <User className="w-6 h-6" />
            ) : (
              <Lock className="w-6 h-6" />
            )}
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {mode === 'forgot_password'
              ? 'Reset Your Password'
              : mode === 'register'
              ? 'Create Customer Account'
              : 'Sign In to Your Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'forgot_password'
              ? 'We will send a password reset link to your registered email'
              : 'Maa Vaibhav Lakshmi Enterprises • Lucknow'}
          </p>
        </div>

        {mode === 'forgot_password' ? (
          /* FORGOT PASSWORD FORM */
          <div className="space-y-4">
            {resetSent ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">Reset Email Sent!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  A password recovery link has been dispatched to <strong className="text-slate-900 dark:text-white">{email}</strong>. Check your inbox (and spam folder) to set a new password.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setMode('login');
                  }}
                  className="mt-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="forgot-password-email-input"
                      type="email"
                      required
                      placeholder="e.g. customer@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  id="forgot-password-submit-btn"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors text-xs disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending reset email...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Password Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* LOGIN OR REGISTER FORM */
          <>
            {/* Primary Google Sign-in Option */}
            <button
              type="button"
              id="google-signin-btn"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full mb-3 py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>Continue with Google Account</span>
            </button>

            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400">or with email & password</span>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <input
                      id="auth-input-name"
                      type="text"
                      required
                      placeholder="e.g. Rajeshwar Shukla"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number (For Order Tracking)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="auth-input-phone"
                        type="tel"
                        placeholder="9454666748"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                  {isAdminEmail && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                      <ShieldCheck className="w-3 h-3" />
                      Administrator Account
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-email"
                    type="email"
                    required
                    placeholder="customer@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {isAdminEmail ? 'Admin Master Password' : 'Password'}
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot_password');
                        setResetSent(false);
                      }}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-input-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {isAdminEmail && (
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-amber-500" />
                    <span>Password verification required for administrator portal access.</span>
                  </p>
                )}
              </div>

              <button
                id="auth-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-colors text-xs pt-3 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'register' ? 'Create Account' : isAdminEmail ? 'Authenticate as Admin' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => setMode(mode === 'register' ? 'login' : 'register')}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                {mode === 'register' ? 'Already have an account? Sign In' : "Don't have an account? Register with Email"}
              </button>
              {mode === 'register' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium"
                >
                  Forgot password?
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
