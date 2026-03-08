import { useState } from 'react';
import natursaiLogo from '../../imports/natursai_logo.svg';

interface LoginPageProps {
  onLogin: () => void;
  onGoRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginPage({ onLogin, onGoRegister, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 900);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #C8F0EA 0%, #DCF0FF 40%, #EEF6FF 70%, #FFF8EE 100%)' }}>
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
        .login-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.28; pointer-events: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s cubic-bezier(.4,0,.2,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.13s; }
        .fade-up-3 { animation-delay: 0.21s; }
        .fade-up-4 { animation-delay: 0.29s; }
        .fade-up-5 { animation-delay: 0.37s; }
      `}</style>

      {/* Blobs */}
      <div className="login-blob" style={{ width: 380, height: 380, background: '#48A88B', top: -100, left: -80, animation: 'blobFloat 8s ease-in-out infinite' }} />
      <div className="login-blob" style={{ width: 260, height: 260, background: '#F3CC58', bottom: -60, right: -60, animation: 'blobFloat 10s ease-in-out infinite reverse' }} />
      <div className="login-blob" style={{ width: 200, height: 200, background: '#3A648C', top: '40%', right: '15%', animation: 'blobFloat 12s ease-in-out infinite 2s' }} />

      <div className="w-full max-w-[900px] mx-4 flex rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(58,100,140,0.18)]" style={{ minHeight: 520 }}>

        {/* ── Left panel ── */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6 px-10 py-12 relative overflow-hidden flex-shrink-0"
          style={{ width: 360, background: 'linear-gradient(150deg, #3A648C 0%, #48A88B 100%)' }}>
          {/* subtle pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Mascot */}
          <div className="relative z-10 flex flex-col items-center gap-0 fade-up fade-up-1">
            <div className="flex items-center justify-center select-none">
              <img src={natursaiLogo} alt="Na-Bo logo" className="w-20 h-20 object-contain" />
            </div>
            <div className="text-center -mt-1">
              <div className="text-white text-[26px] font-black tracking-wide drop-shadow">Na-Bo</div>
              <div className="text-white/80 text-[13px] mt-1">你的 AI 學習夥伴</div>
            </div>
          </div>

          {/* Quick login buttons */}
          <div className="relative z-10 flex flex-col gap-2 w-full fade-up fade-up-2">
            <div className="text-white/55 text-[11px] font-semibold text-center mb-1 tracking-wide uppercase">快速登入</div>
            {[
              {
                key: 'google',
                label: 'Google',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ),
              },
              {
                key: 'microsoft',
                label: 'Microsoft',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <rect x="1" y="1" width="10.5" height="10.5" fill="#F25022"/>
                    <rect x="12.5" y="1" width="10.5" height="10.5" fill="#7FBA00"/>
                    <rect x="1" y="12.5" width="10.5" height="10.5" fill="#00A4EF"/>
                    <rect x="12.5" y="12.5" width="10.5" height="10.5" fill="#FFB900"/>
                  </svg>
                ),
              },
              {
                key: 'apple',
                label: 'Apple',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                ),
              },
            ].map(p => (
              <button
                key={p.key}
                type="button"
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl w-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}
              >
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{p.icon}</span>
                <span className="text-white/90 text-[13px] font-semibold">使用 {p.label} 繼續</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 relative"
          style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)' }}>

          {/* Mobile logo */}
          <div className="flex md:hidden items-center gap-2 mb-6">
            <span className="text-3xl">🐼</span>
            <span className="text-[22px] font-black" style={{ color: '#3A648C' }}>Na-Bo</span>
          </div>

          <div className="fade-up fade-up-1">
            <div className="text-[24px] font-black mb-1" style={{ color: '#1A2E4A' }}>歡迎回來</div>
            <div className="text-[13px] mb-7" style={{ color: '#8AACC8' }}>登入你的 Na-Bo 帳號，繼續學習之旅</div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="fade-up fade-up-2 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold" style={{ color: '#3A648C' }}>電子郵件</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACC8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(58,100,140,0.06)',
                    border: '1.5px solid rgba(58,100,140,0.18)',
                    fontSize: 13,
                    color: '#1A2E4A',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#48A88B'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,100,140,0.18)'}
                />
              </div>
            </div>

            {/* Password */}
            <div className="fade-up fade-up-3 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold" style={{ color: '#3A648C' }}>密碼</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACC8]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl outline-none transition-all"
                  style={{
                    background: 'rgba(58,100,140,0.06)',
                    border: '1.5px solid rgba(58,100,140,0.18)',
                    fontSize: 13,
                    color: '#1A2E4A',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#48A88B'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,100,140,0.18)'}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8AACC8] hover:text-[#3A648C] transition-colors">
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={onForgotPassword} className="text-[11px] font-semibold transition-colors hover:opacity-70" style={{ color: '#48A88B' }}>
                  忘記密碼？
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="fade-up fade-up-4 w-full py-3 rounded-xl text-white font-black text-[14px] transition-all active:scale-[0.98] disabled:opacity-70"
              style={{ background: loading ? '#7AADCC' : 'linear-gradient(135deg, #3A648C 0%, #48A88B 100%)', boxShadow: '0 4px 16px rgba(58,100,140,0.25)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  登入中…
                </span>
              ) : '登入'}
            </button>
          </form>

          {/* Divider */}
          <div className="fade-up fade-up-5 flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'rgba(58,100,140,0.12)' }} />
            <span className="text-[11px]" style={{ color: '#B0C8D8' }}>還沒有帳號？</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(58,100,140,0.12)' }} />
          </div>

          <button
            type="button"
            onClick={onGoRegister}
            className="fade-up fade-up-5 w-full py-2.5 rounded-xl font-bold text-[13px] transition-all hover:bg-[#48A88B]/10 active:scale-[0.98]"
            style={{ border: '1.5px solid rgba(72,168,139,0.4)', color: '#48A88B' }}
          >
            建立新帳號
          </button>
        </div>
      </div>
    </div>
  );
}