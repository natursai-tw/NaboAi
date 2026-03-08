import { useState } from 'react';
import natursaiLogo from '../../imports/natursai_logo.svg';

interface ForgotPasswordPageProps {
  onGoLogin: () => void;
}

export function ForgotPasswordPage({ onGoLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1000);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #C8F0EA 0%, #DCF0FF 40%, #EEF6FF 70%, #FFF8EE 100%)' }}
    >
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
        .fp-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.28; pointer-events: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fp-fade-up { animation: fadeUp 0.55s cubic-bezier(.4,0,.2,1) both; }
        .fp-fade-up-1 { animation-delay: 0.05s; }
        .fp-fade-up-2 { animation-delay: 0.13s; }
        .fp-fade-up-3 { animation-delay: 0.21s; }
        .fp-fade-up-4 { animation-delay: 0.29s; }
        @keyframes checkPop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .check-pop { animation: checkPop 0.5s cubic-bezier(.4,0,.2,1) both; }
      `}</style>

      {/* Blobs */}
      <div className="fp-blob" style={{ width: 380, height: 380, background: '#48A88B', top: -100, left: -80, animation: 'blobFloat 8s ease-in-out infinite' }} />
      <div className="fp-blob" style={{ width: 260, height: 260, background: '#F3CC58', bottom: -60, right: -60, animation: 'blobFloat 10s ease-in-out infinite reverse' }} />
      <div className="fp-blob" style={{ width: 200, height: 200, background: '#3A648C', top: '40%', right: '15%', animation: 'blobFloat 12s ease-in-out infinite 2s' }} />

      <div className="w-full max-w-[820px] mx-4 flex rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(58,100,140,0.18)]" style={{ minHeight: 460 }}>

        {/* ── Left panel ── */}
        <div
          className="hidden md:flex flex-col items-center justify-center gap-6 px-10 py-12 relative overflow-hidden flex-shrink-0"
          style={{ width: 320, background: 'linear-gradient(150deg, #3A648C 0%, #48A88B 100%)' }}
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Logo */}
          <div className="relative z-10 flex flex-col items-center gap-0 fp-fade-up fp-fade-up-1">
            <div className="flex items-center justify-center select-none">
              <img src={natursaiLogo} alt="Na-Bo logo" className="w-20 h-20 object-contain" />
            </div>
            <div className="text-center -mt-1">
              <div className="text-white text-[26px] font-black tracking-wide drop-shadow">Na-Bo</div>
              <div className="text-white/80 text-[13px] mt-1">你的 AI 學習夥伴</div>
            </div>
          </div>

          {/* Hint card */}
          <div className="relative z-10 w-full fp-fade-up fp-fade-up-2 px-4 py-3.5 rounded-2xl flex items-start gap-3"
            style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}>
            <div className="flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <p className="text-white/75 text-[12px] leading-relaxed">
              我們將發送一封包含重設密碼連結的郵件到你的信箱，連結有效期為 30 分鐘。
            </p>
          </div>

          {/* Back to login */}
          <button
            onClick={onGoLogin}
            className="relative z-10 fp-fade-up fp-fade-up-3 flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            返回登入
          </button>
        </div>

        {/* ── Right panel ── */}
        <div
          className="flex-1 flex flex-col justify-center px-8 py-12 relative"
          style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)' }}
        >
          {/* Mobile top */}
          <div className="flex md:hidden items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <img src={natursaiLogo} alt="Na-Bo logo" className="w-8 h-8 object-contain" />
              <span className="text-[20px] font-black" style={{ color: '#3A648C' }}>Na-Bo</span>
            </div>
            <button onClick={onGoLogin} className="text-[12px] font-semibold" style={{ color: '#48A88B' }}>← 返回登入</button>
          </div>

          {!sent ? (
            <>
              {/* Header */}
              <div className="fp-fade-up fp-fade-up-1 mb-6">
                <div className="text-[22px] font-black mb-1" style={{ color: '#1A2E4A' }}>忘記密碼？</div>
                <div className="text-[13px]" style={{ color: '#8AACC8' }}>
                  輸入你的帳號 Email，我們會發送重設連結給你
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="fp-fade-up fp-fade-up-2 flex flex-col gap-1.5">
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
                      autoFocus
                      className="w-full pl-9 pr-4 py-3 rounded-xl outline-none transition-all"
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

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="fp-fade-up fp-fade-up-3 w-full py-3 rounded-xl text-white font-black text-[14px] transition-all active:scale-[0.98] disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #3A648C 0%, #48A88B 100%)', boxShadow: '0 4px 16px rgba(58,100,140,0.25)' }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      發送中…
                    </span>
                  ) : '發送重設連結'}
                </button>

                {/* Back (mobile) */}
                <button
                  type="button"
                  onClick={onGoLogin}
                  className="fp-fade-up fp-fade-up-4 md:hidden w-full py-2.5 rounded-xl font-bold text-[13px] transition-all hover:bg-[#48A88B]/10"
                  style={{ border: '1.5px solid rgba(72,168,139,0.4)', color: '#48A88B' }}
                >
                  返回登入
                </button>
              </form>
            </>
          ) : (
            /* ── Success state ── */
            <div className="flex flex-col items-center text-center gap-5 py-4">
              {/* Check icon */}
              <div
                className="check-pop w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #48A88B 0%, #3A648C 100%)', boxShadow: '0 8px 32px rgba(72,168,139,0.3)' }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <path d="M8 18l7 7 13-13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div>
                <div className="text-[22px] font-black mb-2" style={{ color: '#1A2E4A' }}>郵件已送出！</div>
                <div className="text-[13px] leading-relaxed" style={{ color: '#8AACC8' }}>
                  重設密碼連結已發送至
                  <br />
                  <span className="font-bold" style={{ color: '#3A648C' }}>{email}</span>
                  <br />
                  請檢查你的收件匣（含垃圾郵件資料夾）
                </div>
              </div>

              {/* Info box */}
              <div
                className="w-full px-4 py-3 rounded-2xl text-left flex items-start gap-3"
                style={{ background: 'rgba(72,168,139,0.08)', border: '1.5px solid rgba(72,168,139,0.2)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#48A88B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
                </svg>
                <p className="text-[12px] leading-relaxed" style={{ color: '#48A88B' }}>
                  連結有效期為 <span className="font-bold">30 分鐘</span>，若未收到請稍候再試。
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full mt-1">
                <button
                  onClick={() => { setEmail(''); setSent(false); }}
                  className="w-full py-2.5 rounded-xl font-bold text-[13px] transition-all hover:bg-[#48A88B]/10 active:scale-[0.98]"
                  style={{ border: '1.5px solid rgba(72,168,139,0.4)', color: '#48A88B' }}
                >
                  重新輸入 Email
                </button>
                <button
                  onClick={onGoLogin}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-[13px] transition-all active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #3A648C 0%, #48A88B 100%)' }}
                >
                  返回登入
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
