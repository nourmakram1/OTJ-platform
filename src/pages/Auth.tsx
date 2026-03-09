import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';
import { useProjects } from '../context/ProjectContext';

const Auth = () => {
  const navigate = useNavigate();
  const { setUserRole } = useProjects();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [userType, setUserType] = useState<'client' | 'creative' | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (mode === 'signup') {
      if (!userType) { showToast('Select Client or Creative'); return; }
      if (!agreed) { showToast('Accept the terms to continue'); return; }
      setUserRole(userType);
      showToast('✓ Account created!');
      if (userType === 'creative') {
        setTimeout(() => navigate('/onboarding'), 600);
      } else {
        setTimeout(() => navigate('/client-onboarding'), 600);
      }
    } else {
      showToast('✓ Welcome back!');
      setTimeout(() => navigate('/dashboard'), 600);
    }
  };

  const handleSocialSignIn = (provider: 'google' | 'apple') => {
    if (mode === 'signup' && !userType) {
      showToast('Select Client or Creative first');
      return;
    }
    if (mode === 'signup' && !agreed) {
      showToast('Accept the terms to continue');
      return;
    }
    const role = userType || 'client';
    setUserRole(role);
    showToast(`✓ Signed in with ${provider === 'google' ? 'Google' : 'Apple'}!`);
    if (mode === 'signup') {
      if (role === 'creative') {
        setTimeout(() => navigate('/onboarding'), 600);
      } else {
        setTimeout(() => navigate('/client-onboarding'), 600);
      }
    } else {
      setTimeout(() => navigate('/dashboard'), 600);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted";

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-[440px]">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-[28px] font-extrabold tracking-[-0.05em] text-foreground mb-1">
              OTJ<sup className="text-[10px] align-super">™</sup>
            </div>
            <div className="text-sm text-otj-text">Egypt's Creative Booking Platform</div>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 bg-otj-off rounded-full mb-6 border border-border">
            {(['signup', 'login'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] ${
                  mode === m ? 'bg-primary text-primary-foreground' : 'bg-transparent text-otj-text'
                }`}
              >
                {m === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-[18px] p-6">
            {mode === 'signup' ? (
              <div className="animate-fade-up flex flex-col gap-4">
                {/* Social sign-in buttons */}
                <button
                  onClick={() => handleSocialSignIn('google')}
                  className="w-full py-2.5 rounded-full border-[1.5px] border-border bg-card text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2.5 hover:border-foreground hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialSignIn('apple')}
                  className="w-full py-2.5 rounded-full border-[1.5px] border-border bg-card text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2.5 hover:border-foreground hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-otj-muted font-semibold">or sign up with email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Full Name</div>
                  <input placeholder="Your full name" className={inputClass} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Email</div>
                  <input type="email" placeholder="you@email.com" className={inputClass} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Password</div>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                </div>

                {/* User type toggle */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">I am a… <span className="text-destructive">*</span></div>
                  <div className="flex gap-2">
                    {(['client', 'creative'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setUserType(t)}
                        className={`flex-1 py-3 rounded-full border-[1.5px] text-[13px] font-bold cursor-pointer transition-all duration-150 capitalize ${
                          userType === t
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-card border-border text-otj-text hover:border-foreground hover:text-foreground'
                        }`}
                      >
                        {t === 'client' ? '🏢 Client' : '🎨 Creative'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 rounded border-border accent-primary cursor-pointer" />
                  <span className="text-xs text-otj-text leading-relaxed">I agree to OTJ's <span className="text-foreground font-semibold underline cursor-pointer">Terms of Service</span> and <span className="text-foreground font-semibold underline cursor-pointer">Privacy Policy</span></span>
                </label>

                <button onClick={handleSubmit} className="w-full py-3 rounded-full border-none bg-primary text-primary-foreground text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 hover:bg-primary/90 group mt-1">
                  Create Account <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </button>
              </div>
            ) : (
              <div className="animate-fade-up flex flex-col gap-4">
                <button
                  onClick={() => handleSocialSignIn('google')}
                  className="w-full py-2.5 rounded-full border-[1.5px] border-border bg-card text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2.5 hover:border-foreground hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleSocialSignIn('apple')}
                  className="w-full py-2.5 rounded-full border-[1.5px] border-border bg-card text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2.5 hover:border-foreground hover:text-foreground"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  Continue with Apple
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-otj-muted font-semibold">or log in with email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Email</div>
                  <input type="email" placeholder="you@email.com" className={inputClass} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Password</div>
                  <input type="password" placeholder="••••••••" className={inputClass} />
                  <div className="text-right mt-1.5">
                    <span className="text-xs text-otj-blue font-semibold cursor-pointer hover:underline">Forgot password?</span>
                  </div>
                </div>

                <button onClick={handleSubmit} className="w-full py-3 rounded-full border-none bg-primary text-primary-foreground text-sm font-bold cursor-pointer transition-all duration-150 tracking-[-0.01em] flex items-center justify-center gap-2 hover:bg-primary/90 group">
                  Log In <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-center mt-5 text-xs text-otj-muted">
            Built for Egypt's creative economy
          </div>
        </div>
      </div>
      <Toast />
    </>
  );
};

export default Auth;
