import { useState, useEffect } from 'react';
import { addToCanvas, subscribeCanvasActive } from './creativeEditorBridge';

// ─── Source panel mock data ───────────────────────────────────────────────────
const MOCK_CHAT = [
  { id: 's1', type: 'chat-bot' as const, content: '嗨！今天要一起完成數學任務嗎？🌟', label: 'Na-Bo 訊息' },
  { id: 's2', type: 'chat-user' as const, content: '好的！我想學分數加減法。', label: '你的訊息' },
  { id: 's3', type: 'chat-bot' as const, content: '分數加減法的關鍵是找公分母！\n例如：1/2 + 1/3 = 3/6 + 2/6 = 5/6 ✨', label: 'Na-Bo 說明' },
  { id: 's4', type: 'chat-user' as const, content: '那 2/5 + 1/3 呢？', label: '你的提問' },
  { id: 's5', type: 'chat-bot' as const, content: '2/5 + 1/3 = 6/15 + 5/15 = 11/15 🎉\n你學得很快！', label: 'Na-Bo 解答' },
];

const MOCK_IMAGES = [
  { id: 'img1', url: 'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?w=300&q=80', label: '學習筆記' },
  { id: 'img2', url: 'https://images.unsplash.com/photo-1554103210-26d928978fb5?w=300&q=80', label: '便利貼牆' },
];

interface HistoryItem {
  id: number;
  date: string;
  preview: string;
  year: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  scratchMode?: boolean;
  onChatSelect?: () => void;
}

export function HistoryPanel({ isOpen, onToggle, scratchMode, onChatSelect }: HistoryPanelProps) {
  const [activeId, setActiveId] = useState(3);
  const [canvasActive, setCanvasActive] = useState(false);
  const [sourceTab, setSourceTab] = useState<'chat' | 'images'>('chat');

  // 進入 Scratch 模式時取消選取
  useEffect(() => {
    if (scratchMode) setActiveId(-1);
  }, [scratchMode]);

  // Subscribe to canvas mount/unmount via bridge
  useEffect(() => {
    return subscribeCanvasActive(setCanvasActive);
  }, []);

  const historyItems: HistoryItem[] = [
    { id: 1, date: '12/1', preview: '😊 開心事', year: '2025年' },
    { id: 2, date: '1/1', preview: '💪 健康', year: '2026年' },
    { id: 3, date: '2/11', preview: '👋 問好', year: '2026年' },
    { id: 4, date: '2/18', preview: '🎨 畫畫練習', year: '2026年' },
    { id: 5, date: '2/22', preview: '🔢 數學幫忙', year: '2026年' },
    { id: 6, date: '3/1', preview: '📖 閱讀心得', year: '2026年' },
  ];

  let currentYear = '';

  return (
    <aside className="bg-white/60 backdrop-blur-sm border-r-[1.5px] border-[#48A88B]/20 p-5 pr-3.5 overflow-y-auto flex flex-col gap-1.5 relative transition-all duration-300">
      <style>{`
        .history-panel::-webkit-scrollbar {
          width: 3px;
        }
        .history-panel::-webkit-scrollbar-thumb {
          background: #A8E0D0;
          border-radius: 99px;
        }
      `}</style>
      
      {/* 收起按鈕 */}
      <button
        onClick={onToggle}
        className="absolute top-4 right-3 w-7 h-7 bg-white/80 backdrop-blur-sm rounded-lg border-[1.5px] border-[#48A88B]/25 shadow-[0_2px_8px_rgba(72,168,139,0.15)] flex items-center justify-center cursor-pointer transition-all hover:bg-[#48A88B]/10 hover:border-[#48A88B]/40 hover:shadow-[0_3px_12px_rgba(72,168,139,0.25)] z-10 group"
        title="收起歷史紀錄"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A648C] group-hover:text-[#48A88B] transition-colors">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="history-panel mt-8 flex flex-col" style={{ minHeight: 0 }}>
        {/* 新對話按鈕 */}
        <button
          onClick={() => { setActiveId(-1); onChatSelect?.(); }}
          className="w-full flex items-center gap-2.5 px-3.5 py-[11px] mb-3 rounded-[14px] cursor-pointer transition-all bg-gradient-to-r from-[#48A88B]/15 to-[#3A648C]/10 border-[1.5px] border-dashed border-[#48A88B]/40 text-[#3A648C] hover:from-[#48A88B]/25 hover:to-[#3A648C]/18 hover:border-[#48A88B]/70 hover:shadow-[0_4px_14px_rgba(72,168,139,0.18)] hover:translate-x-[2px] group"
        >
          <div className="w-5 h-5 rounded-full bg-[#48A88B]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#48A88B]/35 transition-colors">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="#48A88B" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[12px] font-bold tracking-wide">新對話</span>
        </button>

        {historyItems.map((item) => {
          const showYear = item.year !== currentYear;
          currentYear = item.year;
          
          return (
            <div key={item.id}>
              {showYear && (
                <div className="text-[13px] font-black text-[#7A8BA0] px-1 pt-2 pb-1 tracking-wide">
                  {item.year}
                </div>
              )}
              <div
                onClick={() => { setActiveId(item.id); onChatSelect?.(); }}
                className={`px-3.5 py-[11px] rounded-[14px] text-[13px] font-bold cursor-pointer transition-all ${
                  activeId === item.id
                    ? 'bg-[#3A648C] text-white shadow-[0_4px_14px_rgba(58,100,140,0.25)]'
                    : 'bg-transparent text-[#2B3A52] hover:bg-[#48A88B]/12 hover:translate-x-[3px]'
                }`}
              >
                <div className="text-[10px] opacity-65 mb-0.5">{item.date}</div>
                <div className="text-[12px] font-semibold">{item.preview}</div>
              </div>
            </div>
          );
        })}

        {/* ── 素材庫 — shown when CreativeEditorPage (canvas) is active ── */}
        {canvasActive && (
          null
        )}
      </div>
    </aside>
  );
}