import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../components/Toast';
import { Toast } from '../components/Toast';



const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [userType, setUserType] = useState<'client' | 'creative' | null>(null);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (mode === 'signup') {
      if (!userType) { showToast('Select Client or Creative'); return; }
      if (!agreed) { showToast('Accept the terms to continue'); return; }
      showToast('✓ Account created!');
      setTimeout(() => navigate(userType === 'creative' ? '/onboarding' : '/explore'), 600);
    } else {
      showToast('✓ Welcome back!');
      setTimeout(() => navigate('/dashboard'), 600);
    }
  };

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
                <button onClick={() => showToast('Google sign-in…')} className="w-full py-2.5 rounded-full border-[1.5px] border-border bg-card text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 hover:border-foreground hover:text-foreground">
                  🔵 Continue with Google
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-otj-muted font-semibold">or sign up with email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Full Name</div>
                  <input placeholder="Your full name" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Email</div>
                  <input type="email" placeholder="you@email.com" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Password</div>
                  <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
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
                <button onClick={() => showToast('Google sign-in…')} className="w-full py-2.5 rounded-full border-[1.5px] border-border bg-card text-[13px] font-bold text-otj-text cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 hover:border-foreground hover:text-foreground">
                  🔵 Continue with Google
                </button>

                <div className="flex items-center gap-3 my-1">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-otj-muted font-semibold">or log in with email</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Email</div>
                  <input type="email" placeholder="you@email.com" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-otj-muted mb-[5px]">Password</div>
                  <input type="password" placeholder="••••••••" className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-otj-off text-[13.5px] text-foreground outline-none transition-all duration-150 focus:border-foreground focus:bg-card placeholder:text-otj-muted" />
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
