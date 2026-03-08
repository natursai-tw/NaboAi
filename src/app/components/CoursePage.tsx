import naboMascot from 'figma:asset/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';

interface CoursePageProps {
  onCourseSelect?: (mode: 'online' | 'video') => void;
}

export function CoursePage({ onCourseSelect }: CoursePageProps) {
  return (
    <>
      <style>{`
        @keyframes fadeDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes mascotBounce {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes sparkFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-14px) rotate(25deg); opacity: 1; }
        }
        @keyframes popIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .course-header-anim {
          animation: fadeDown 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .course-grid-anim {
          animation: fadeUp 0.7s cubic-bezier(0.34,1.56,0.64,1) 0.2s both;
        }
        .course-mascot-float {
          animation: mascotBounce 3s ease-in-out infinite;
        }
        .course-spark {
          animation: sparkFloat 4s ease-in-out infinite;
        }
        .course-modal-content {
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
      `}</style>

      <section className="flex flex-col items-center justify-center px-12 py-8 gap-8 relative col-span-1 min-h-0 overflow-y-auto">
        {/* Floating Sparks */}
        <span className="course-spark absolute text-[16px] pointer-events-none" style={{ top: '12%', left: '22%', animationDelay: '0s' }}>📖</span>
        <span className="course-spark absolute text-[12px] pointer-events-none" style={{ top: '18%', right: '18%', animationDelay: '1.2s' }}>🌟</span>
        <span className="course-spark absolute text-[14px] pointer-events-none" style={{ bottom: '28%', right: '22%', animationDelay: '2.4s' }}>✏️</span>

        {/* Page Header */}
        <div className="course-header-anim text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/80 border-[1.5px] border-[#48A88B]/35 rounded-[20px] px-3.5 py-[5px] text-[12px] font-black text-[#48A88B] mb-2.5">
            📚 課程中心
          </div>
          <h1 className="text-[28px] font-black text-[#3A648C] tracking-tight">選擇你的上課方式</h1>
          <p className="text-[14px] text-[#7A8BA0] font-semibold mt-1.5">
            線上自學或視訊互動，找到最適合你的學習模式！
          </p>
        </div>

        {/* Mode Cards Grid */}
        <div className="course-grid-anim grid grid-cols-2 gap-7 w-full max-w-[900px]">
          {/* Online Course Card */}
          <CourseCard
            type="online"
            title="線上課程"
            description="隨時隨地自主學習<br />豐富影片與互動教材"
            features={['📹 影片課程', '📝 隨堂測驗', '🔄 無限回放']}
            onSelect={() => onCourseSelect?.('online')}
          />

          {/* Video Class Card */}
          <CourseCard
            type="video"
            title="視訊上課"
            description="與老師即時互動<br />一對一或小班制教學"
            features={['🎥 即時視訊', '🙋 互動問答', '👨‍🏫 真人教學']}
            onSelect={() => onCourseSelect?.('video')}
          />
        </div>

        {/* Mascot */}
        <div className="course-mascot-float absolute bottom-5 left-[120px] z-[5]">
          <img src={naboMascot} alt="Na-Bo 吉祥物" className="w-16 h-[70px] object-contain" />
        </div>

        {/* Breadcrumb */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-bold text-[#7A8BA0] bg-white/70 px-4 py-1.5 rounded-[20px] backdrop-blur-sm">
          <span>🏠 首頁</span>
          <span className="opacity-40">›</span>
          <span>📚 課程中心</span>
          <span className="opacity-40">›</span>
          <span className="text-[#3A648C] font-black">選擇模式</span>
        </div>
      </section>
    </>
  );
}

function CourseCard({ type, title, description, features, onSelect }: {
  type: 'online' | 'video';
  title: string;
  description: string;
  features: string[];
  onSelect: () => void;
}) {
  return (
    <div className="group relative bg-white/78 backdrop-blur-xl rounded-[28px] border-2 border-white/90 shadow-[0_8px_32px_rgba(60,120,140,0.13)] px-7 py-8 pb-6 flex flex-col items-center cursor-pointer transition-all duration-[350ms] hover:translate-y-[-8px] hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(60,120,140,0.2)] hover:border-white overflow-hidden">
      {/* Background gradient overlay */}
      <div
        className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: type === 'online'
            ? 'radial-gradient(ellipse at 50% 0%, rgba(72,168,139,0.12) 0%, transparent 70%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(243,204,88,0.12) 0%, transparent 70%)',
        }}
      ></div>

      {/* Illustration */}
      <div className="relative w-full">
        {type === 'online' ? <OnlineIllustration /> : <VideoIllustration />}
      </div>

      {/* Title & Description */}
      <div className="text-[22px] font-black text-[#1A2E4A] mb-1 tracking-tight">{title}</div>
      <div
        className="text-[12px] font-semibold text-[#7A8BA0] text-center mb-5 leading-[1.5]"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* CTA Button */}
      <button
        className="relative w-full py-4 rounded-[18px] border-none text-[18px] font-black flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 tracking-wide text-white overflow-hidden group/btn hover:scale-[1.04] active:scale-[0.97]"
        style={{
          background: type === 'online'
            ? 'linear-gradient(135deg, #48A88B, #3A648C)'
            : 'linear-gradient(135deg, #F3CC58, #D4B030)',
          boxShadow: type === 'online'
            ? '0 8px 28px rgba(72,168,139,0.4)'
            : '0 8px 28px rgba(243,204,88,0.35)',
        }}
        onClick={onSelect}
      >
        {title}
        <div className="w-[30px] h-[30px] rounded-[10px] bg-white/25 flex items-center justify-center text-[16px]">➜</div>
        <div className="absolute inset-0 bg-white/12 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"></div>
      </button>

      {/* Feature Pills */}
      <div className="flex gap-1.5 justify-center mt-3 flex-wrap">
        {features.map((feature, idx) => (
          <span
            key={idx}
            className="text-[10px] font-black px-2.5 py-[3px] rounded-[10px]"
            style={{
              background: type === 'online' ? 'rgba(72,168,139,0.15)' : 'rgba(243,204,88,0.15)',
              color: type === 'online' ? '#2D7A62' : '#8B6A00',
            }}
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
}

function OnlineIllustration() {
  return (
    <div className="w-full h-[180px] rounded-[20px] bg-gradient-to-br from-[#E8F8F3] to-[#C8F0EA] border-[1.5px] border-[#48A88B]/15 flex items-center justify-center mb-6 relative overflow-hidden">
      <div className="flex items-center gap-5 px-4">
        {/* Video Player */}
        <div className="relative flex-shrink-0">
          <div className="w-[120px] h-[85px] bg-white rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.1)] border-2 border-white flex flex-col overflow-hidden">
            <div className="flex-1 bg-gradient-to-br from-[#48A88B] to-[#3A648C] flex items-center justify-center relative">
              <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[14px] border-l-white ml-1"></div>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-white/20">
                <div className="h-full w-[65%] bg-[#F3CC58] rounded-r"></div>
              </div>
            </div>
            <div className="h-[18px] flex items-center px-2 gap-1">
              <div className="h-[4px] w-[40%] bg-[#CBD8E5] rounded"></div>
              <div className="h-[4px] w-[25%] bg-[#E8EFF5] rounded"></div>
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-[8px] bg-gradient-to-br from-[#48A88B] to-[#3A9F7A] flex items-center justify-center text-[14px] z-[5] shadow-[0_3px_10px_rgba(72,168,139,0.35)]">
            📹
          </div>
        </div>

        {/* Course list */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="w-[100px] h-[22px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center px-2 gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#48A88B] flex items-center justify-center text-[7px] text-white">✓</div>
            <div className="h-[4px] w-[60%] bg-[#CBD8E5] rounded"></div>
          </div>
          <div className="w-[100px] h-[22px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center px-2 gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#48A88B] flex items-center justify-center text-[7px] text-white">✓</div>
            <div className="h-[4px] w-[50%] bg-[#CBD8E5] rounded"></div>
          </div>
          <div className="w-[100px] h-[22px] bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex items-center px-2 gap-1.5 border-[1.5px] border-[#F3CC58]/40">
            <div className="w-3 h-3 rounded-full bg-[#F3CC58] flex items-center justify-center text-[7px]">▶</div>
            <div className="h-[4px] w-[70%] bg-[#F3CC58]/30 rounded"></div>
          </div>
          <div className="w-[100px] h-[22px] bg-white/60 rounded-lg flex items-center px-2 gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#E8EFF5]"></div>
            <div className="h-[4px] w-[45%] bg-[#E8EFF5] rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoIllustration() {
  return (
    <div className="w-full h-[180px] rounded-[20px] bg-gradient-to-br from-[#FFF8EE] to-[#FFEFD0] border-[1.5px] border-[#F3CC58]/20 flex items-center justify-center mb-6 relative overflow-hidden">
      <div className="flex items-center gap-4 px-4">
        {/* Teacher screen */}
        <div className="relative flex-shrink-0">
          <div className="w-[90px] h-[90px] rounded-2xl bg-gradient-to-br from-[#3A648C] to-[#2A4A6C] shadow-[0_4px_16px_rgba(0,0,0,0.15)] border-2 border-white flex flex-col items-center justify-center gap-1">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-[22px]">
              👨‍🏫
            </div>
            <div className="text-[9px] text-white/80 font-bold">老師</div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#48A88B] flex items-center justify-center shadow-md">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
          </div>
        </div>

        {/* Connection lines */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
            <defs>
              <linearGradient id="connGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F3CC58" />
                <stop offset="100%" stopColor="#48A88B" />
              </linearGradient>
            </defs>
            <path d="M4 15 L36 15" stroke="url(#connGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
            <path d="M4 30 L36 30" stroke="url(#connGrad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M4 45 L36 45" stroke="url(#connGrad)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
          </svg>
        </div>

        {/* Students grid */}
        <div className="grid grid-cols-2 gap-2 flex-shrink-0">
          {['🧒', '👧', '👦', '🧑'].map((emoji, i) => (
            <div key={i} className="w-[52px] h-[52px] rounded-xl bg-white shadow-[0_3px_12px_rgba(0,0,0,0.08)] border-[1.5px] border-white flex flex-col items-center justify-center gap-0.5">
              <span className="text-[18px]">{emoji}</span>
              <div className="h-[3px] w-[60%] bg-[#E8EFF5] rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Live badge */}
      <div className="absolute top-3 right-4 flex items-center gap-1 bg-gradient-to-br from-[#F3CC58] to-[#D4B030] text-white font-black text-[11px] px-2.5 py-1 rounded-xl shadow-[0_3px_10px_rgba(243,204,88,0.4)]">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
        LIVE
      </div>
    </div>
  );
}