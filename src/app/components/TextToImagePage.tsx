import { useState } from 'react';
import exampleImage from '../../assets/715706f9df4e34361f3a9c13819ffcbcb6a714a6.png';

export function TextToImagePage({ onBack }: { onBack: () => void }) {
  const [inputText, setInputText] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userPrompt, setUserPrompt] = useState('');

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    setUserPrompt(inputText);
    
    // 模擬 AI 生成過程
    setTimeout(() => {
      setGeneratedImage(exampleImage);
      setIsGenerating(false);
      setInputText('');
    }, 2000);
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'nabo-creation.png';
    link.click();
  };

  return (
    <div className="relative w-full h-full overflow-hidden" style={{
      background: 'linear-gradient(180deg, #E8F4F8 0%, #D4E9F0 100%)',
    }}>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
        .float-anim {
          animation: float 3s ease-in-out infinite;
        }
        .sparkle-anim {
          animation: sparkle 2s ease-in-out infinite;
        }
        .generating-shimmer {
          background: linear-gradient(90deg, 
            rgba(72,168,139,0.1) 0%, 
            rgba(72,168,139,0.3) 50%, 
            rgba(72,168,139,0.1) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s linear infinite;
        }
      `}</style>

      {/* 3D Background Scene */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ceiling details */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-32 opacity-20">
          <div className="w-full h-full bg-gradient-to-b from-[#5EC0DE]/30 to-transparent rounded-b-[100%]"></div>
        </div>
        
        {/* Floating sparkles */}
        <div className="sparkle-anim absolute top-[15%] left-[20%] text-[#F3CC58] text-2xl">✨</div>
        <div className="sparkle-anim absolute top-[25%] right-[25%] text-[#48A88B] text-xl" style={{ animationDelay: '0.5s' }}>💫</div>
        <div className="sparkle-anim absolute top-[40%] left-[15%] text-[#FFD4B3] text-lg" style={{ animationDelay: '1s' }}>⭐</div>
        <div className="sparkle-anim absolute bottom-[30%] right-[20%] text-[#B8F0E8] text-xl" style={{ animationDelay: '1.5s' }}>✨</div>

        {/* Floor shadow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#3A648C]/10 to-transparent"></div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20">
        <div className="bg-white/80 backdrop-blur-lg rounded-[28px] p-4 shadow-[0_8px_32px_rgba(60,120,140,0.15)] flex flex-col items-center gap-4">
          {/* Logo */}
          <div className="w-14 h-14 bg-gradient-to-br from-[#48A88B] to-[#3A648C] rounded-2xl flex items-center justify-center shadow-lg">
            <div className="text-white font-black text-[10px] text-center leading-tight">
              V<span className="text-[#FFE380]">Na</span><br />-Bo
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#48A88B]/30 to-transparent"></div>

          {/* Nav Icons */}
          <SideNavIcon icon="🎨" active />
          <SideNavIcon icon="📝" />
          <SideNavIcon icon="🖼️" />
          <SideNavIcon icon="⚙️" />

          <div className="flex-1"></div>

          <button
            onClick={onBack}
            className="w-12 h-12 rounded-xl bg-[#48A88B]/10 hover:bg-[#48A88B]/20 transition-all flex items-center justify-center text-xl cursor-pointer"
            title="返回"
          >
            ⬅️
          </button>
        </div>
      </div>

      {/* Right Floating Icon */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 float-anim">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#48A88B] to-[#3A648C] shadow-[0_8px_24px_rgba(72,168,139,0.4)] flex items-center justify-center">
          <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.5" opacity="0.3" />
            <path d="M20 10 L20 20 L26 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="20" cy="20" r="2" fill="white" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="absolute left-[140px] right-[140px] top-1/2 -translate-y-1/2 z-10">
        <div className="relative bg-white/70 backdrop-blur-xl rounded-[48px] shadow-[0_20px_60px_rgba(60,120,140,0.2)] p-8 min-h-[500px] border-2 border-white/80">
          
          {/* User Prompt Bubble (if exists) */}
          {userPrompt && (
            <div className="absolute top-8 right-8 max-w-[280px] bg-[#5A7FA0] text-white rounded-[24px] rounded-tr-[8px] px-5 py-3 shadow-lg">
              <div className="text-sm font-semibold">{userPrompt}</div>
            </div>
          )}

          {/* Generated Image Display */}
          <div className="flex items-center justify-center min-h-[340px]">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-8 border-[#6EDCCA]/20"></div>
                  <div className="absolute inset-0 w-32 h-32 rounded-full border-8 border-t-[#48A88B] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">✨</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-[#2B3A52] mb-2">AI 正在創作中...</div>
                  <div className="generating-shimmer text-sm text-[#7A8BA0] font-semibold px-4 py-2 rounded-full">
                    魔法正在施展 🎨
                  </div>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="relative group">
                <img 
                  src={generatedImage} 
                  alt="Generated"
                  className="max-w-[400px] max-h-[340px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] border-4 border-white"
                />
                <button
                  onClick={handleDownload}
                  className="absolute top-4 left-4 bg-[#2B3A52] text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-[#1A2E4A] transition-all opacity-0 group-hover:opacity-100"
                >
                  📥 下載圖片
                </button>
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎨</div>
                <div className="text-xl font-bold text-[#2B3A52] mb-2">準備好開始創作了嗎？</div>
                <div className="text-sm text-[#7A8BA0] font-semibold">
                  在下方輸入你想要的圖片描述，讓 AI 幫你實現！
                </div>
              </div>
            )}
          </div>

          {/* Bottom Input Area */}
          <div className="absolute bottom-6 left-6 right-6 flex items-end gap-4">
            {/* Na-Bo Mascot */}
            <div className="flex-shrink-0 mb-2 float-anim">
              <svg width="80" height="88" viewBox="0 0 80 88" fill="none">
                <defs>
                  <radialGradient id="bodyGrad2" cx="50%" cy="40%" r="55%">
                    <stop offset="0%" stopColor="#FAFEFF" />
                    <stop offset="100%" stopColor="#E0F4F0" />
                  </radialGradient>
                  <filter id="softShadow2">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#3DBFAD" floodOpacity="0.2" />
                  </filter>
                </defs>
                <ellipse cx="40" cy="55" rx="27" ry="32" fill="url(#bodyGrad2)" filter="url(#softShadow2)" />
                <ellipse cx="30" cy="25" rx="5" ry="14" fill="#48A88B" transform="rotate(-18 30 25)" />
                <ellipse cx="50" cy="25" rx="5" ry="14" fill="#3A648C" transform="rotate(18 50 25)" />
                <circle cx="40" cy="45" r="18" fill="url(#bodyGrad2)" />
                <ellipse cx="33" cy="42" rx="3.5" ry="4" fill="#2B3A52" />
                <ellipse cx="47" cy="42" rx="3.5" ry="4" fill="#2B3A52" />
                <circle cx="35" cy="40" r="1.5" fill="white" />
                <circle cx="49" cy="40" r="1.5" fill="white" />
                <ellipse cx="28" cy="49" rx="4" ry="2.5" fill="#FFB3AD" opacity="0.5" />
                <ellipse cx="52" cy="49" rx="4" ry="2.5" fill="#FFB3AD" opacity="0.5" />
                <path d="M34 52 Q40 60 46 52" stroke="#2B3A52" strokeWidth="2" strokeLinecap="round" fill="none" />
                <ellipse cx="15" cy="52" rx="7" ry="5.5" fill="#2E3B5E" opacity="0.85" />
                <ellipse cx="65" cy="52" rx="7" ry="5.5" fill="#2E3B5E" opacity="0.85" />
                <ellipse cx="32" cy="75" rx="8" ry="4.5" fill="#D4EEF0" />
                <ellipse cx="48" cy="75" rx="8" ry="4.5" fill="#D4EEF0" />
              </svg>
            </div>

            {/* Input Box */}
            <div className="flex-1 bg-white rounded-[24px] shadow-[0_8px_24px_rgba(60,120,140,0.12)] border-2 border-[#48A88B]/20 overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="輸入新訊息..."
                  className="flex-1 bg-transparent outline-none text-[#2B3A52] font-medium placeholder:text-[#7A8BA0]/50"
                  disabled={isGenerating}
                />
                <button
                  className="w-10 h-10 rounded-xl bg-[#48A88B]/10 hover:bg-[#48A88B]/20 transition-all flex items-center justify-center text-xl flex-shrink-0"
                  title="語音輸入"
                >
                  🎤
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!inputText.trim() || isGenerating}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 transition-all ${
                    inputText.trim() && !isGenerating
                      ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] hover:shadow-lg hover:scale-105 cursor-pointer'
                      : 'bg-[#E8F4F8] text-[#7A8BA0] cursor-not-allowed'
                  }`}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#48A88B]"></div>
            <div className="w-2 h-2 rounded-full bg-[#48A88B]/30"></div>
            <div className="w-2 h-2 rounded-full bg-[#48A88B]/30"></div>
          </div>
        </div>
      </div>

      {/* Bottom Plants Decoration */}
      <div className="absolute bottom-8 left-[160px] text-5xl float-anim" style={{ animationDelay: '0.3s' }}>🪴</div>
      <div className="absolute bottom-8 right-[160px] text-5xl float-anim" style={{ animationDelay: '0.6s' }}>🌿</div>
    </div>
  );
}

function SideNavIcon({ icon, active }: { icon: string; active?: boolean }) {
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl cursor-pointer transition-all ${
      active 
        ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] shadow-lg scale-110' 
        : 'bg-transparent hover:bg-[#48A88B]/10'
    }`}>
      {icon}
    </div>
  );
}