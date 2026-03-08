import { useState } from 'react';
import natursaiLogo from "../../imports/natursai_logo.svg";

interface RegisterPageProps {
  onRegister: () => void;
  onGoLogin: () => void;
}

export function RegisterPage({ onRegister, onGoLogin }: RegisterPageProps) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [grade, setGrade] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const GRADES = ['國小 1–2 年級', '國小 3–4 年級', '國小 5–6 年級', '國中 1 年級', '國中 2 年級', '國中 3 年級', '高中 / 其他'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister();
    }, 900);
  };

  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden py-8"
      style={{ background: 'linear-gradient(135deg, #C8F0EA 0%, #DCF0FF 40%, #EEF6FF 70%, #FFF8EE 100%)' }}>
      <style>{`
        @keyframes blobFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-24px) scale(1.04); }
        }
        .reg-blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.28; pointer-events: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.55s cubic-bezier(.4,0,.2,1) both; }
        .fade-up-1 { animation-delay: 0.05s; }
        .fade-up-2 { animation-delay: 0.12s; }
        .fade-up-3 { animation-delay: 0.19s; }
        .fade-up-4 { animation-delay: 0.26s; }
        .fade-up-5 { animation-delay: 0.33s; }
        .fade-up-6 { animation-delay: 0.40s; }
      `}</style>

      {/* Blobs */}
      <div className="reg-blob" style={{ width: 380, height: 380, background: '#48A88B', top: -100, left: -80, animation: 'blobFloat 8s ease-in-out infinite' }} />
      <div className="reg-blob" style={{ width: 260, height: 260, background: '#F3CC58', bottom: -60, right: -60, animation: 'blobFloat 10s ease-in-out infinite reverse' }} />
      <div className="reg-blob" style={{ width: 200, height: 200, background: '#3A648C', top: '35%', right: '10%', animation: 'blobFloat 12s ease-in-out infinite 2s' }} />

      <div className="w-full max-w-[900px] mx-4 flex rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(58,100,140,0.18)]">

        {/* ── Left panel ── */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6 px-10 py-12 relative overflow-hidden flex-shrink-0"
          style={{ width: 320, background: 'linear-gradient(150deg, #48A88B 0%, #3A648C 100%)' }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          <div className="relative z-10 flex flex-col items-center gap-0 fade-up fade-up-1">
            <div className="flex items-center justify-center select-none">
              <img src={natursaiLogo} alt="Na-Bo logo" className="w-20 h-20 object-contain" />
            </div>
            <div className="text-center -mt-1">
              <div className="text-white text-[22px] font-black drop-shadow">開始你的旅程</div>
              <div className="text-white/75 text-[12px] mt-1.5 leading-relaxed">建立帳號，解鎖 Na-Bo<br/>的所有學習功能</div>
            </div>
          </div>

          {/* Steps */}
          <div className="relative z-10 w-full flex flex-col gap-2.5 fade-up fade-up-2">
            {[
              { step: '01', text: '填寫基本資料' },
              { step: '02', text: '選擇年級' },
              { step: '03', text: '開始 AI 學習' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)' }}>
                <span className="text-[11px] font-black text-white/60">{s.step}</span>
                <span className="text-white/90 text-[13px] font-semibold">{s.text}</span>
              </div>
            ))}
          </div>

          {/* Back to login */}
          <button onClick={onGoLogin}
            className="relative z-10 fade-up fade-up-3 flex items-center gap-1.5 text-white/75 hover:text-white transition-colors"
            style={{ fontSize: 12, fontWeight: 600 }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            已有帳號？登入
          </button>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="flex-1 flex flex-col justify-center px-8 py-10 overflow-y-auto"
          style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(20px)' }}>

          {/* Mobile top */}
          <div className="flex md:hidden items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐼</span>
              <span className="text-[22px] font-black" style={{ color: '#3A648C' }}>Na-Bo</span>
            </div>
            <button onClick={onGoLogin} className="text-[12px] font-semibold" style={{ color: '#48A88B' }}>← 登入</button>
          </div>

          <div className="fade-up fade-up-1 mb-6">
            <div className="text-[22px] font-black" style={{ color: '#1A2E4A' }}>建立帳號</div>
            <div className="text-[13px] mt-1" style={{ color: '#8AACC8' }}>只需幾步，即可加入 Na-Bo 學習社群</div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {/* Nickname */}
            <div className="fade-up fade-up-2 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold" style={{ color: '#3A648C' }}>暱稱</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACC8]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input type="text" placeholder="你想被怎麼稱呼？" value={nickname} onChange={e => setNickname(e.target.value)} required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(58,100,140,0.06)', border: '1.5px solid rgba(58,100,140,0.18)', fontSize: 13, color: '#1A2E4A' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#48A88B'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,100,140,0.18)'} />
              </div>
            </div>

            {/* Email */}
            <div className="fade-up fade-up-2 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold" style={{ color: '#3A648C' }}>電子郵件</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACC8]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3"/><path d="m2 7 10 7 10-7"/>
                  </svg>
                </span>
                <input type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{ background: 'rgba(58,100,140,0.06)', border: '1.5px solid rgba(58,100,140,0.18)', fontSize: 13, color: '#1A2E4A' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#48A88B'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,100,140,0.18)'} />
              </div>
            </div>

            {/* Password row */}
            <div className="fade-up fade-up-3 grid grid-cols-2 gap-3">
              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold" style={{ color: '#3A648C' }}>密碼</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8AACC8]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl outline-none transition-all"
                    style={{ background: 'rgba(58,100,140,0.06)', border: '1.5px solid rgba(58,100,140,0.18)', fontSize: 13, color: '#1A2E4A' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#48A88B'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,100,140,0.18)'} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8AACC8] hover:text-[#3A648C] transition-colors">
                    {showPassword
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
              {/* Confirm */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-bold" style={{ color: mismatch ? '#E05555' : '#3A648C' }}>確認密碼</label>
                <input type={showPassword ? 'text' : 'password'} placeholder="再輸入一次" value={confirm} onChange={e => setConfirm(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all"
                  style={{
                    background: mismatch ? 'rgba(224,85,85,0.06)' : 'rgba(58,100,140,0.06)',
                    border: `1.5px solid ${mismatch ? 'rgba(224,85,85,0.45)' : 'rgba(58,100,140,0.18)'}`,
                    fontSize: 13, color: '#1A2E4A'
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = mismatch ? 'rgba(224,85,85,0.6)' : '#48A88B'}
                  onBlur={e => e.currentTarget.style.borderColor = mismatch ? 'rgba(224,85,85,0.45)' : 'rgba(58,100,140,0.18)'} />
                {mismatch && <span className="text-[11px]" style={{ color: '#E05555' }}>密碼不一致</span>}
              </div>
            </div>

            {/* Grade */}
            <div className="fade-up fade-up-4 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold" style={{ color: '#3A648C' }}>年級</label>
              <div className="relative">
                <select value={grade} onChange={e => setGrade(e.target.value)} required
                  className="w-full px-4 py-2.5 rounded-xl outline-none transition-all appearance-none"
                  style={{ background: 'rgba(58,100,140,0.06)', border: '1.5px solid rgba(58,100,140,0.18)', fontSize: 13, color: grade ? '#1A2E4A' : '#A0B8CC' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#48A88B'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,100,140,0.18)'}>
                  <option value="" disabled>選擇你的年級</option>
                  <option value="小小孩" style={{ color: '#1A2E4A' }}>小小孩</option>
                  {GRADES.map(g => <option key={g} value={g} style={{ color: '#1A2E4A' }}>{g}</option>)}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8AACC8]">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6l4 4 4-4"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Agreement */}
            <div className="fade-up fade-up-5 flex items-start gap-2.5">
              <button type="button" onClick={() => setAgreed(v => !v)}
                className="flex-shrink-0 w-4.5 h-4.5 rounded mt-0.5 transition-all flex items-center justify-center"
                style={{
                  width: 18, height: 18, border: `2px solid ${agreed ? '#48A88B' : 'rgba(58,100,140,0.3)'}`,
                  background: agreed ? '#48A88B' : 'transparent',
                }}>
                {agreed && <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}
              </button>
              <span className="text-[11px] leading-relaxed" style={{ color: '#8AACC8' }}>
                我已閱讀並同意 <button type="button" className="font-bold hover:underline" style={{ color: '#48A88B' }}>服務條款</button> 及 <button type="button" className="font-bold hover:underline" style={{ color: '#48A88B' }}>隱私政策</button>
              </span>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !agreed || mismatch}
              className="fade-up fade-up-6 w-full py-3 rounded-xl text-white font-black text-[14px] transition-all active:scale-[0.98] disabled:opacity-60 mt-1"
              style={{ background: 'linear-gradient(135deg, #48A88B 0%, #3A648C 100%)', boxShadow: '0 4px 16px rgba(72,168,139,0.25)' }}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  建立中…
                </span>
              ) : '建立帳號'}
            </button>
          </form>

          {/* Back link (mobile) */}
          <div className="flex md:hidden justify-center mt-4">
            <button onClick={onGoLogin} className="text-[12px] font-semibold" style={{ color: '#48A88B' }}>
              ← 已有帳號？返回登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}