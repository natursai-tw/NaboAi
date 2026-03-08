import { useState, useRef } from 'react';
import { X, Mail, Pencil, Camera } from 'lucide-react';

/* 波形跳動動畫 */
const waveBarStyle = (delay: string): React.CSSProperties => ({
  width: '3px',
  borderRadius: '2px',
  backgroundColor: 'white',
  animation: 'waveBar 0.7s ease-in-out infinite alternate',
  animationDelay: delay,
});

const WAVE_KEYFRAMES = `
@keyframes waveBar {
  0%   { height: 4px; }
  100% { height: 14px; }
}
`;

interface SettingsModalProps {
  onClose: () => void;
  onLogout?: () => void;
}

const VOICE_OPTIONS = ['Bobo', 'Nana', 'Alex', 'Mia'];

export function SettingsModal({ onClose, onLogout }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [selectedVoice, setSelectedVoice] = useState('Bobo');
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [naboId, setNaboId] = useState('book030');
  const [isEditingId, setIsEditingId] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('https://images.unsplash.com/photo-1548884481-dfb662aadde1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwc3R1ZGVudCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Mjc5MDMwOHww&ixlib=rb-4.1.0&q=80&w=400');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarSrc(url);
    }
  };

  return (
    /* Backdrop */
    <>
      <style>{WAVE_KEYFRAMES}</style>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(40,60,90,0.25)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="relative bg-white rounded-[20px] shadow-[0_20px_60px_rgba(40,80,120,0.18)] w-[480px] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Tabs */}
          <div className="flex items-end pt-0 relative mx-[24px] mt-[24px] mb-[0px]" style={{ borderBottom: '2px solid #E5EDF5' }}>
            {/* 我的資料 tab */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`relative px-10 py-3.5 text-[15px] font-black rounded-t-[14px] transition-all border-none cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#F3CC58] text-white z-10 shadow-[0_2px_0_#F3CC58]'
                  : 'bg-[#E5EDF5] text-[#9AAABB]'
              }`}
              style={{ marginRight: '-2px' }}
            >
              我的資料
            </button>
            {/* 設定 tab */}
            <button
              onClick={() => setActiveTab('settings')}
              className={`relative px-10 py-3.5 text-[15px] font-black rounded-t-[14px] transition-all border-none cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#3A648C] text-white z-10'
                  : 'bg-[#E5EDF5] text-[#9AAABB]'
              }`}
            >
              設定
            </button>
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border-none cursor-pointer bg-transparent"
            >
              <X size={22} color="#3A648C" strokeWidth={2.5} />
            </button>
          </div>

          {/* Content */}
          <div className="px-10 py-12 min-h-[200px] mx-[24px] mt-[0px] mb-[24px]">
            {activeTab === 'profile' ? (
              /* ── 我的資料 ── */
              <div className="flex items-center gap-7">
                {/* Avatar */}
                <div className="relative flex-shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <img
                    src={avatarSrc}
                    alt="頭像"
                    className="w-[120px] h-[120px] rounded-[18px] object-cover shadow-md transition-opacity group-hover:opacity-70"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-[18px] flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} color="white" strokeWidth={2} />
                    <span className="text-white text-[11px] font-black drop-shadow">更換照片</span>
                  </div>
                  <div className="absolute top-2 right-2 bg-gradient-to-br from-[#A855F7] to-[#6366F1] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                    VIP
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4">
                  {/* Nabo ID */}
                  <div className="flex items-center gap-2">
                    {isEditingId ? (
                      <input
                        autoFocus
                        value={naboId}
                        onChange={e => setNaboId(e.target.value)}
                        onBlur={() => setIsEditingId(false)}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') setIsEditingId(false); }}
                        className="font-black text-[#3A648C] text-[16px] border-b-2 border-[#3A648C] outline-none bg-transparent w-[180px] pb-0.5"
                      />
                    ) : (
                      <span className="font-black text-[#3A648C] text-[16px]">Nabo ID: {naboId}</span>
                    )}
                    <button
                      className="border-none bg-transparent cursor-pointer p-1 rounded hover:bg-[#F0F6FF] transition-colors"
                      onClick={() => setIsEditingId(v => !v)}
                    >
                      <Pencil size={16} color={isEditingId ? '#48A88B' : '#3A648C'} strokeWidth={2} />
                    </button>
                  </div>
                  {/* Email */}
                  <div className="flex items-center gap-2.5 text-[16px] text-[#5A7A95] font-semibold">
                    <Mail size={18} color="#5A7A95" strokeWidth={1.8} />
                    <span>book030@gmail.com</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── 設定 ── */
              <div className="flex flex-col gap-9">
                {/* 語音 */}
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[#3A648C]">語音</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsPlaying(p => !p)}
                      className={`px-5 py-2 text-white text-[14px] font-black rounded-lg border-none cursor-pointer transition-colors flex items-center gap-2 ${
                        isPlaying ? 'bg-[#E05A5A] hover:bg-[#c94d4d]' : 'bg-[#3A648C] hover:bg-[#2e5070]'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          {/* 波形動畫 */}
                          <span className="flex items-center gap-[2px]" style={{ height: '16px' }}>
                            {['0s','0.15s','0.3s','0.45s'].map((d, i) => (
                              <span key={i} style={waveBarStyle(d)} />
                            ))}
                          </span>
                          停止
                        </>
                      ) : (
                        <>
                          {/* 播放圖示 */}
                          <span
                            style={{
                              width: 0, height: 0,
                              borderTop: '6px solid transparent',
                              borderBottom: '6px solid transparent',
                              borderLeft: '10px solid white',
                              flexShrink: 0,
                              display: 'inline-block',
                            }}
                          />
                          播放
                        </>
                      )}
                    </button>
                    {/* Voice Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setVoiceDropdownOpen(v => !v)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border-[1.5px] border-[#D0DDE8] rounded-lg text-[14px] font-bold text-[#3A648C] cursor-pointer hover:border-[#3A648C] transition-colors min-w-[110px] justify-between"
                      >
                        {selectedVoice}
                        <span className="text-[10px]">{voiceDropdownOpen ? '▲' : '▼'}</span>
                      </button>
                      {voiceDropdownOpen && (
                        <div className="absolute top-full mt-1 left-0 right-0 bg-white border-[1.5px] border-[#D0DDE8] rounded-lg shadow-lg z-10 overflow-hidden">
                          {VOICE_OPTIONS.map(v => (
                            <button
                              key={v}
                              onClick={() => { setSelectedVoice(v); setVoiceDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2 text-[14px] font-bold border-none cursor-pointer transition-colors ${
                                v === selectedVoice
                                  ? 'bg-[#EBF3FA] text-[#3A648C]'
                                  : 'bg-white text-[#5A7A95] hover:bg-[#F5F9FC]'
                              }`}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 在此裝置中登出 */}
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[#3A648C]">在此裝置中登出</span>
                  <button
                    onClick={() => { onClose(); onLogout?.(); }}
                    className="px-10 py-2.5 bg-[#3A648C] text-white text-[14px] font-black rounded-lg border-none cursor-pointer hover:bg-[#2e5070] transition-colors min-w-[180px]">
                    登出
                  </button>
                </div>

                {/* 取得 Na-bo Pro */}
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-[#3A648C]">取得Na-bo Pro</span>
                  <button className="px-10 py-2.5 bg-[#F3CC58] text-white text-[14px] font-black rounded-lg border-none cursor-pointer hover:bg-[#e0b840] transition-colors min-w-[180px]">
                    訂閱
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}