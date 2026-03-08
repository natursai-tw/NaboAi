import { useState } from 'react';
import mascotImg from '../../assets/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';
import chocolateImg from '../../assets/47ad7cf5ba2895388d173a0f9841851e83caaa84.png';
import coffeeImg from '../../assets/74d5123ae06057f7f116885d7f85cc78ca3a4507.png';
import crownBadge from '../../assets/3a1d0e7f95912ca2837579221fab3af62c0f4862.png';
import bookwormBadge from '../../assets/3ea2442dbd811d667211cc2f49196a162ef20c38.png';
import streakBadge from '../../assets/c2e7b90b819c1c170e22cabcb60c5f73c4ff561b.png';
import lockedBadge from '../../assets/ea5c04732f8940df4b683243081f62eecd8561b3.png';
import shopStandImg from '../../assets/e439de9b9f09b5f823acbdee8ebc6b9a382446c2.png';
import energySvg from '../../imports/energy-3.svg';
import interactiveSvg from '../../imports/interactive-1.svg';
import targetSvg from '../../imports/target-1.svg';

const MASCOT_MESSAGES = [
  '嗨！今天要一起完成數學任務嗎？🌟',
  '我有新的故事要和你分享喔！📖',
  '來挑戰今日任務，一起升等吧！🚀',
  '休息一下，喝點水再繼續！💧',
  '你今天表現超棒，繼續加油！✨',
];

interface HomePageProps {
  onNavigateToChat?: () => void;
  onNavigateToShop?: () => void;
}

export function HomePage({ onNavigateToChat, onNavigateToShop }: HomePageProps) {
  const [activeTab, setActiveTab] = useState<'interact' | 'energy' | 'missions'>('energy');
  const [msgIndex, setMsgIndex] = useState(0);

  const handleNope = () => {
    setMsgIndex(i => (i + 1) % MASCOT_MESSAGES.length);
  };

  const lines = MASCOT_MESSAGES[msgIndex].split('\n');
  return (
    <>
      <style>{`
        @keyframes mascotFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-16px);
          }
        }
        @keyframes bubblePop {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes companionBounce {
          0%, 100% {
            transform: translateY(0) rotate(-5deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }
        @keyframes starFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-12px) rotate(20deg);
            opacity: 1;
          }
        }
        .mascot-area {
          animation: mascotFloat 4s ease-in-out infinite;
        }
        .speech-bubble {
          animation: bubblePop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
        }
        .companion {
          animation: companionBounce 2s ease-in-out infinite;
        }
        .floating-star {
          animation: starFloat 3s ease-in-out infinite;
        }
        .floating-star:nth-child(2) {
          animation-delay: 1s;
        }
        .floating-star:nth-child(3) {
          animation-delay: 2s;
        }
      `}</style>

      {/* Center Stage */}
      <main className="flex flex-col items-center justify-center px-6 py-6 relative">
        {/* Scene Background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(72,168,139,0.15) 0%, transparent 70%), radial-gradient(ellipse 40% 30% at 30% 80%, rgba(58,100,140,0.2) 0%, transparent 60%)'
        }}></div>

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-b from-transparent to-[#48A88B]/8 border-t-2 border-[#48A88B]/15"></div>

        {/* Floating Stars */}
        <div className="floating-star absolute text-[18px] pointer-events-none" style={{ top: '15%', left: '15%', animationDelay: '0s' }}>⭐</div>
        <div className="floating-star absolute text-[14px] pointer-events-none" style={{ top: '25%', right: '20%', animationDelay: '1s' }}>✨</div>
        <div className="floating-star absolute text-[12px] pointer-events-none" style={{ bottom: '35%', left: '10%', animationDelay: '2s' }}>💫</div>

        {/* Mascot Area */}
        <div className="mascot-area relative z-[2] flex flex-col items-center">
          {/* Speech Bubble */}
          <div className="speech-bubble absolute -top-5 -right-[230px] bg-white rounded-[20px_20px_20px_4px] px-4 py-3 w-[220px] shadow-[0_8px_24px_rgba(60,120,140,0.15)] text-[12px] font-bold text-[#2B3A52] leading-[1.5]">
            {lines.map((line, i) => (
              <span key={i}>{line}{i < lines.length - 1 && <br />}</span>
            ))}
            {/* Buttons */}
            <div className="flex gap-1.5 mt-2.5 w-[148px]">
              <button
                onClick={onNavigateToChat}
                className="flex-1 bg-gradient-to-r from-[#3A648C] to-[#48A88B] text-white text-[11px] font-black px-2 py-1 rounded-lg shadow hover:opacity-90 active:scale-95 transition-all"
              >
                好 👍
              </button>
              <button
                onClick={handleNope}
                className="flex-1 bg-[#F0F6FF] text-[#3A648C] text-[11px] font-black px-2 py-1 rounded-lg hover:bg-[#E0EEFF] active:scale-95 transition-all"
              >
                不好 😅
              </button>
            </div>
            <div className="absolute -left-2.5 bottom-4 w-0 h-0 border-[6px] border-transparent border-r-white"></div>
          </div>

          {/* Na-Bo Mascot SVG */}
          <img src={mascotImg} alt="Na-Bo 吉祥物" className="w-[200px] h-[220px] object-contain m-[0px]" style={{ filter: 'drop-shadow(0 20px 40px rgba(72,168,139,0.3))' }} />

          {/* Companion */}
          <div className="companion absolute bottom-[30px] -left-[80px] text-[60px]">🌱</div>
        </div>
      </main>

      {/* Right Panel */}
      <aside className="bg-white/70 backdrop-blur-md border-l-[1.5px] border-[#48A88B]/20 p-5 pr-[18px] overflow-y-auto flex flex-col gap-4">
        <style>{`
          .right-panel::-webkit-scrollbar {
            width: 4px;
          }
          .right-panel::-webkit-scrollbar-track {
            background: transparent;
          }
          .right-panel::-webkit-scrollbar-thumb {
            background: #A8E0D0;
            border-radius: 99px;
          }
        `}</style>
        <div className="right-panel space-y-5">
          {/* Level Ring */}
          <div className="flex items-center gap-3.5 bg-white/85 rounded-[20px] px-4 py-3.5 shadow-[0_4px_20px_rgba(60,120,140,0.10)]">
            <div className="relative w-14 h-14 flex-shrink-0">
              <svg viewBox="0 0 56 56" className="w-14 h-14">
                <defs>
                  <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#48A88B" />
                    <stop offset="100%" stopColor="#3A648C" />
                  </linearGradient>
                </defs>
                <circle cx="28" cy="28" r="23" fill="none" stroke="#EEF3F8" strokeWidth="5" />
                <circle cx="28" cy="28" r="23" fill="none" stroke="url(#rg)" strokeWidth="5" strokeLinecap="round" strokeDasharray="145" strokeDashoffset="43" transform="rotate(-90 28 28)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[16px] font-black text-[#3A648C]">12</div>
            </div>
            <div>
              <div className="text-[11px] text-[#7A8BA0] font-bold">LEVEL 1</div>
              <div className="text-[14px] font-black">知識探索者</div>
              <div className="w-[120px] h-[7px] bg-[#EEF3F8] rounded-full overflow-hidden mt-1.5">
                <div className="h-full w-[70%] bg-gradient-to-r from-[#3A648C] to-[#48A88B] rounded-full"></div>
              </div>
              <div className="text-[10px] text-[#7A8BA0] font-bold mt-1">70 / 100 XP</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1.5 bg-[#48A88B]/10 rounded-2xl p-[5px]">
            <div 
              onClick={() => setActiveTab('interact')}
              className={`flex-1 py-2.5 text-center rounded-xl text-[12px] font-black cursor-pointer transition-all flex items-center justify-center gap-1 ${
                activeTab === 'interact' ? 'bg-white text-[#3A648C] shadow-[0_3px_10px_rgba(60,120,140,0.12)]' : 'text-[#7A8BA0]'
              }`}>
              <img src={interactiveSvg} alt="互動" className="w-[18px] h-[18px]" /> 互動
            </div>
            <div 
              onClick={() => setActiveTab('energy')}
              className={`flex-1 py-2.5 text-center rounded-xl text-[12px] font-black cursor-pointer transition-all flex items-center justify-center gap-1 ${
                activeTab === 'energy' ? 'bg-white text-[#3A648C] shadow-[0_3px_10px_rgba(60,120,140,0.12)]' : 'text-[#7A8BA0]'
              }`}><img src={energySvg} alt="能量" className="w-[18px] h-[18px]" /> 能量值</div>
            <div 
              onClick={() => setActiveTab('missions')}
              className={`flex-1 py-2.5 text-center rounded-xl text-[12px] font-black cursor-pointer transition-all flex items-center justify-center gap-1 ${
                activeTab === 'missions' ? 'bg-white text-[#3A648C] shadow-[0_3px_10px_rgba(60,120,140,0.12)]' : 'text-[#7A8BA0]'
              }`}>
              <img src={targetSvg} alt="任務" className="w-[18px] h-[18px]" /> 任務
            </div>
          </div>

          {/* Tab Content: Energy */}
          {activeTab === 'energy' && (
            <>
              <div className="text-[13px] font-black text-[#7A8BA0] uppercase tracking-widest">今日補給</div>
              <div className="grid grid-cols-2 gap-2.5">
                <ShopCard emoji="🍫" name="巧克力片" nameEn="Chocolate chips" price="490" oldPrice="5000" discount="-20%" image={chocolateImg} />
                <ShopCard emoji="☕" name="大杯拿鐵" nameEn="Large Latte" price="490" oldPrice="5000" discount="-20%" image={coffeeImg} />
              </div>
            </>
          )}

          {/* Tab Content: Missions */}
          {activeTab === 'missions' && (
            <>
              <div className="text-[13px] font-black text-[#7A8BA0] uppercase tracking-widest">今日任務</div>
              <MissionCard type="math" icon="🔢" name="分數加減法" sub="數學・第3單元" progress={65} xp="+120 XP" />
              <MissionCard type="reading" icon="📖" name="閱讀理解練習" sub="國語短文閱讀" progress={90} xp="+80 XP" />
              <MissionCard type="science" icon="🔬" name="自然觀察日記" sub="自然・生態探索" progress={30} xp="+150 XP" />
              <MissionCard type="art" icon="🎨" name="創意塗鴉挑戰" sub="藝術・主題繪畫" progress={0} xp="+60 XP" />
            </>
          )}

          {/* Tab Content: Interact */}
          {activeTab === 'interact' && (
            <>
              <div className="text-[13px] font-black text-[#7A8BA0] uppercase tracking-widest">互動動作</div>
              <div className="grid grid-cols-2 gap-2.5">
                <InteractCard emoji="👋" name="揮手" desc="向 Na-Bo 打招呼" />
                <InteractCard emoji="✊" name="猜拳" desc="剪刀石頭布！" />
                <InteractCard emoji="🤗" name="打招呼" desc="來個溫暖的問候" />
                <InteractCard emoji="🙌" name="擊掌" desc="太棒了！" />
                <InteractCard emoji="🎉" name="慶祝" desc="完成任務慶祝" />
                <InteractCard emoji="💪" name="加油" desc="為自己打氣" />
                <InteractCard emoji="🤔" name="提問" desc="我有問題想問" />
                <InteractCard emoji="😴" name="休息" desc="讓我休息一下" />
              </div>
            </>
          )}

          {/* Achievements */}
          <div className="text-[13px] font-black text-[#7A8BA0] uppercase tracking-widest">成就徽章</div>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            <AchievementBadge emoji="🏅" label="數學王" />
            <AchievementBadge emoji="📚" label="書蟲" image={bookwormBadge} />
            <AchievementBadge emoji="🔥" label="連勝王" image={streakBadge} />
            <AchievementBadge emoji="🌟" label="滿分" locked />
            <AchievementBadge emoji="🚀" label="進化者" locked />
          </div>

          {/* Shop Banner */}
          <div className="rounded-[18px] px-4 py-3.5 bg-white/85 border-[1.5px] border-white/90 flex items-center gap-3 cursor-pointer transition-all shadow-[0_6px_20px_rgba(60,120,140,0.10)] hover:translate-y-[-2px] hover:shadow-[0_10px_28px_rgba(60,120,140,0.16)]"
            onClick={onNavigateToShop}>
            <img src={shopStandImg} alt="商店" className="w-[70px] h-[70px] object-contain bg-white rounded-xl p-2" />
            <div className="flex-1">
              <div className="text-[16px] font-black text-[#3A648C]">商店 · SHOP</div>
              <div className="text-[11px] text-[#7A8BA0] font-semibold mt-0.5">用金幣換取超值道具！</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#3A648C] flex items-center justify-center text-[18px] text-white">→</div>
          </div>
        </div>
      </aside>
    </>
  );
}

function ShopCard({ emoji, name, nameEn, price, oldPrice, discount, image }: {
  emoji: string;
  name: string;
  nameEn: string;
  price: string;
  oldPrice: string;
  discount: string;
  image?: string;
}) {
  return (
    <div className="relative bg-white/85 rounded-[18px] px-3 py-3.5 text-center shadow-[0_4px_20px_rgba(60,120,140,0.10)] border-[1.5px] border-white/90 cursor-pointer transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(60,120,140,0.18)]">
      <div className="absolute -top-1.5 -right-1.5 bg-[#FF7F72] text-white text-[9px] font-black px-[7px] py-[3px] rounded-[10px] border-2 border-white">
        {discount}
      </div>
      {image ? (
        <img src={image} alt="item" className="w-[48px] h-[48px] object-contain block mb-1.5 mx-auto" />
      ) : (
        <span className="text-[36px] block mb-1.5">{emoji}</span>
      )}
      <div className="text-[12px] font-black mb-0.5">{name}</div>
      <div className="text-[10px] text-[#7A8BA0] mb-2">{nameEn}</div>
      <div className="flex items-center justify-center gap-[3px] text-[13px] font-black text-[#8B6A00]">
        <span className="text-[14px]">🪙</span> {price}
        <span className="text-[10px] line-through text-[#7A8BA0]">{oldPrice}</span>
      </div>
      <div className="flex justify-center gap-1.5 mt-1.5">
        <span className="text-[9px] font-black px-[7px] py-[2px] rounded-lg text-white bg-[#48A88B]">能量+10</span>
        <span className="text-[9px] font-black px-[7px] py-[2px] rounded-lg text-white bg-[#3A648C]">經驗+20%</span>
      </div>
    </div>
  );
}

function MissionCard({ type, icon, name, sub, progress, xp }: {
  type: 'math' | 'reading' | 'science' | 'art';
  icon: string;
  name: string;
  sub: string;
  progress: number;
  xp: string;
}) {
  const colors = {
    math: { border: '#FF7F72', bg: 'linear-gradient(135deg, #FFE0DC, #FFBBB5)', fill: 'linear-gradient(90deg, #FF7F72, #FFB3AD)' },
    reading: { border: '#48A88B', bg: 'linear-gradient(135deg, #D4F5E4, #A8E6C3)', fill: 'linear-gradient(90deg, #48A88B, #6ECAAD)' },
    science: { border: '#3A648C', bg: 'linear-gradient(135deg, #D4EDFF, #A8D8FF)', fill: 'linear-gradient(90deg, #3A648C, #5A8AAC)' },
    art: { border: '#F3CC58', bg: 'linear-gradient(135deg, #FFF3CC, #FFE580)', fill: 'linear-gradient(90deg, #F3CC58, #FFE380)' },
  };

  return (
    <div className="relative bg-white/85 rounded-[18px] px-4 py-3.5 shadow-[0_4px_20px_rgba(60,120,140,0.10)] border-[1.5px] border-white/80 flex items-center gap-3 cursor-pointer transition-all hover:translate-x-1 hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(60,120,140,0.16)] overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-[4px]" style={{ background: colors[type].border }}></div>
      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center text-[22px] flex-shrink-0" style={{ background: colors[type].bg }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[13px] font-black mb-1">{name}</div>
        <div className="text-[11px] text-[#7A8BA0] font-semibold">{sub}</div>
        <div className="mt-1.5">
          <div className="h-1.5 bg-[#EEF3F8] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: colors[type].fill }}></div>
          </div>
        </div>
      </div>
      <div className="text-[11px] font-black text-[#F3CC58] bg-gradient-to-br from-[#FFF3CC] to-[#FFE580] px-2 py-[3px] rounded-lg whitespace-nowrap flex-shrink-0">
        {xp}
      </div>
    </div>
  );
}

function AchievementBadge({ emoji, label, locked, image }: { emoji: string; label: string; locked?: boolean; image?: string }) {
  return (
    <div className={`flex-shrink-0 w-16 h-[72px] bg-white/85 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-[0_4px_20px_rgba(60,120,140,0.10)] text-[24px] cursor-pointer transition-all border-[1.5px] border-white/90 hover:scale-110 hover:rotate-[-3deg] ${
      locked ? 'opacity-40 grayscale' : ''
    }`}>
      <img src={locked ? lockedBadge : (image || crownBadge)} alt={label} className="w-8 h-8 object-contain" />
      <span className="text-[9px] font-black text-[#7A8BA0]">{label}</span>
    </div>
  );
}

function InteractCard({ emoji, name, desc }: { emoji: string; name: string; desc: string }) {
  return (
    <div
      className="relative bg-[#F5F6F8] rounded-[18px] px-3 py-6 text-center cursor-pointer transition-all hover:translate-y-[-4px] hover:shadow-[0_12px_30px_rgba(60,120,140,0.18)] hover:bg-white group aspect-square flex flex-col items-center justify-center gap-2"
    >
      <span className="text-[40px] block transition-transform group-hover:scale-110">{emoji}</span>
      <div className="text-[14px] font-black text-[#3A648C]">{name}</div>
      <div className="text-[10px] text-[#7A8BA0] font-semibold">{desc}</div>
    </div>
  );
}