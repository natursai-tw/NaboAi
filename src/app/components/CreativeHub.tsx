import { useState } from 'react';
import { CreationPlanEditor } from './CreationPlanEditor';
import { DocumentEditorPanel } from './DocumentEditorPanel';
import movieSvg from '../../imports/movie.svg';
import bookSvg from '../../imports/book.svg';
import gameSvg from '../../imports/game.svg';

type HubTab = 'frame' | 'document' | 'scratch';
type HubState = HubTab | 'home';

const TABS: { id: HubTab; label: string; icon: string; desc: string; accent: string; bg: string }[] = [
  { id: 'frame',    label: '創作影格', icon: movieSvg, desc: 'NA-BO 影格腳本編輯器',  accent: '#3A648C', bg: 'rgba(58,100,140,0.09)' },
  { id: 'document', label: '文件格式', icon: bookSvg,  desc: '多格式文件撰寫工具',    accent: '#48A88B', bg: 'rgba(72,168,139,0.09)' },
  { id: 'scratch',  label: '學習程式', icon: gameSvg,  desc: 'Scratch 積木程式學習',  accent: '#F3A020', bg: 'rgba(243,160,32,0.09)'  },
];

/* ────── Scratch 積木教學環境 ────── */

type ScratchBlock = {
  id: string;
  label: string;
  color: string;
  shape: 'motion' | 'input' | 'hat';
  params?: string[];
  explanation: string;
  details: string[];
};

const SCRATCH_BLOCKS: ScratchBlock[] = [
  {
    id: 'move',
    label: '移動',
    color: '#4C97FF',
    shape: 'motion',
    params: ['10'],
    explanation: '移動 n 步',
    details: [
      '讓角色朝「目前面對的方向」移動指定的步數。',
      '步數越大，移動越遠；輸入負數可以往反方向走。',
      '角色一開始面向右邊（90°），可以用「旋轉」積木改變方向。',
    ],
  },
  {
    id: 'goto',
    label: '定位到 x/y',
    color: '#4C97FF',
    shape: 'input',
    params: ['x:', 'y:'],
    explanation: '定位到 x / y',
    details: [
      '你可以把 Scratch 的舞台想像成一張地圖 🗺️，上面有一個十字的格子線，像這樣：',
      '中間點（0, 0）就是舞台正中間。',
      'x 是左右的方向，往右邊是正的（+），往左邊是負的（-）。',
      'y 是上下的方向，往上是正的（+），往下是負的（-）。',
    ],
  },
  {
    id: 'turn',
    label: '右轉',
    color: '#4C97FF',
    shape: 'motion',
    params: ['15 度'],
    explanation: '右轉 / 左轉',
    details: [
      '讓角色順時針（右轉）或逆時針（左轉）旋轉指定角度。',
      '360 度是一整圈，180 度是半圈（調頭）。',
      '可以搭配「重複」積木讓角色不斷旋轉。',
    ],
  },
  {
    id: 'say',
    label: '說話',
    color: '#9966FF',
    shape: 'motion',
    params: ['哈囉！'],
    explanation: '說 ...',
    details: [
      '讓角色在舞台上顯示一個對話泡泡。',
      '第一個欄位填要說的話，第二個欄位填持續幾秒。',
      '若不填秒數，對話泡泡會一直顯示直到下一個指令。',
    ],
  },
  {
    id: 'flag',
    label: '綠旗開始',
    color: '#FFAB19',
    shape: 'hat',
    explanation: '當 🚩 被點擊',
    details: [
      '這是一個「帽子積木」——程式的起點！',
      '當使用者按下舞台上方的綠旗按鈕，這個積木下方的所有指令就會開始執行。',
      '每個角色可以有多個綠旗積木，它們會同時執行。',
    ],
  },
];

function ScratchBlockVisual({ block }: { block: ScratchBlock }) {
  const { color, label, shape, params } = block;
  const shadow = `0 3px 0 ${color}88`;

  if (shape === 'hat') {
    return (
      <div className="flex flex-col items-start gap-0">
        {/* hat top */}
        <div style={{
          background: color,
          borderRadius: '12px 12px 0 0',
          padding: '6px 16px',
          fontSize: 12,
          fontWeight: 700,
          color: '#fff',
          boxShadow: shadow,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span>🚩</span>
          <span>{label}</span>
        </div>
        {/* notch connector */}
        <div style={{
          width: 28, height: 10,
          background: color,
          borderRadius: '0 0 4px 4px',
          marginLeft: 10,
          opacity: 0.75,
        }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0">
      <div style={{ width: 26, height: 8, background: color, borderRadius: '4px 4px 0 0', marginLeft: 10, opacity: 0.65 }} />
      <div style={{
        background: color,
        borderRadius: 6,
        padding: '8px 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
        boxShadow: shadow,
        whiteSpace: 'nowrap',
      }}>
        <span>{label}</span>
        {params?.map((p, i) => (
          p.endsWith(':')
            ? <span key={i}>{p}</span>
            : <span key={i} style={{
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 20,
                padding: '2px 10px',
                fontSize: 11,
                minWidth: 32,
                textAlign: 'center',
              }}>{p}</span>
        ))}
      </div>
      <div style={{ width: 26, height: 8, background: color, borderRadius: '0 0 4px 4px', marginLeft: 10, opacity: 0.65 }} />
    </div>
  );
}

function ScratchPage() {
  const [selected, setSelected] = useState<ScratchBlock>(SCRATCH_BLOCKS[1]);

  return (
    <div className="flex h-full p-3 gap-3 overflow-hidden">
      {/* ── Left panel: 積木排列 ── */}
      <div className="flex flex-col rounded-2xl overflow-hidden"
           style={{ width: '48%', border: '1.5px solid rgba(76,151,255,0.25)', background: '#fff', flexShrink: 0 }}>
        {/* title bar */}
        <div className="flex items-center gap-2 px-3 py-2" style={{ background: '#4C97FF' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: 0.5 }}>積木排列</span>
        </div>

        {/* block list */}
        <div className="flex flex-col gap-1.5 p-2.5 overflow-y-auto flex-1">
          {SCRATCH_BLOCKS.map(b => (
            <button
              key={b.id}
              onClick={() => setSelected(b)}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-left transition-all duration-150 hover:scale-[1.02] active:scale-95"
              style={{
                background: selected.id === b.id ? `${b.color}18` : 'transparent',
                border: `1.5px solid ${selected.id === b.id ? b.color + '55' : 'transparent'}`,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: b.color }} />
              <span style={{ fontSize: 11, fontWeight: selected.id === b.id ? 700 : 500, color: selected.id === b.id ? b.color : '#5A7A9A' }}>
                {b.explanation}
              </span>
            </button>
          ))}
        </div>

        {/* block preview */}
        <div className="flex items-center justify-center p-4"
             style={{ borderTop: '1px solid rgba(76,151,255,0.12)', background: 'rgba(76,151,255,0.03)' }}>
          <ScratchBlockVisual block={selected} />
        </div>
      </div>

      {/* ── Right panel: 解說 ── */}
      <div className="flex-1 flex flex-col rounded-2xl overflow-hidden"
           style={{ border: '1.5px solid rgba(243,204,88,0.4)', background: '#fff' }}>
        {/* title bar */}
        <div className="flex items-center px-3 py-2" style={{ background: '#F3CC58' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#3A648C', letterSpacing: 0.5 }}>
            {selected.explanation}
          </span>
        </div>

        {/* explanation body */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
          {selected.details.map((line, i) => (
            i === 0 ? (
              <p key={i} style={{ fontSize: 11, color: '#3A648C', lineHeight: 1.9 }}>{line}</p>
            ) : (
              <div key={i} className="flex items-start gap-1.5">
                <span style={{ color: '#F3CC58', fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>•</span>
                <span style={{ fontSize: 11, color: '#3A648C', lineHeight: 1.85 }}>{line}</span>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────── Landing Home Page ────── */
function HubHomePage({ onSelect, onScratchMode }: { onSelect: (tab: HubTab) => void; onScratchMode: () => void }) {
  return (
    <div className="flex flex-col h-full px-4 py-5 gap-4">
      {/* header */}
      <div className="flex flex-col gap-0.5">
        <h2 style={{ fontSize: 16, color: '#3A648C', fontWeight: 700 }}>創作工坊</h2>
        <p style={{ fontSize: 11, color: '#8AACC8' }}>選擇一個工具開始創作</p>
      </div>

      {/* cards */}
      <div className="flex flex-col gap-3 flex-1">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            onClick={() => tab.id === 'scratch' ? onScratchMode() : onSelect(tab.id)}
            className="group relative flex flex-col items-center justify-center gap-3 w-full rounded-2xl px-4 py-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            style={{
              background: tab.bg,
              border: `1.5px solid ${tab.accent}22`,
            }}
          >
            {/* icon */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
              style={{ background: `${tab.accent}18` }}
            >
              <img src={tab.icon} alt={tab.label} className="w-8 h-8 object-contain" />
            </div>

            {/* text */}
            <div className="flex flex-col items-center gap-0.5">
              <div style={{ fontSize: 14, fontWeight: 700, color: tab.accent }}>{tab.label}</div>
              <div style={{ fontSize: 10, color: '#8AACC8' }}>{tab.desc}</div>
            </div>

            {/* number badge */}
            <div
              className="absolute top-2.5 right-3 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: `${tab.accent}15` }}
            >
              <span style={{ fontSize: 9, color: tab.accent, fontWeight: 700 }}>{i + 1}</span>
            </div>
          </button>
        ))}
      </div>

      {/* footer hint */}
      <div className="flex items-center justify-center py-1.5 rounded-xl"
           style={{ background: 'rgba(58,100,140,0.05)' }}>
        <span style={{ fontSize: 10, color: '#A8C4D8' }}>點擊卡片進入對應工具</span>
      </div>
    </div>
  );
}

/* ────── Back Button Header ────── */
function SubPageHeader({ tab, onBack }: { tab: HubTab; onBack: () => void }) {
  const info = TABS.find(t => t.id === tab)!;
  return (
    <div
      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl mx-[0px] my-[12px]"
      style={{ background: info.bg, border: `1.5px solid ${info.accent}20` }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:bg-white/40 active:scale-95"
        style={{ color: info.accent }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke={info.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600 }}>返回</span>
      </button>
      <div className="w-px h-4" style={{ background: `${info.accent}30` }} />
      <img src={info.icon} alt="" className="w-4 h-4 object-contain" />
      <span style={{ fontSize: 12, fontWeight: 700, color: info.accent }}>{info.label}</span>
    </div>
  );
}

/* ────── Main Hub ────── */
export function CreativeHub({ onScratchMode, onDocumentMode }: { onScratchMode?: () => void; onDocumentMode?: (active: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<HubState>('home');

  return (
    <div className="flex flex-col w-full h-full">
      {activeTab === 'home' ? (
        <HubHomePage onSelect={setActiveTab} onScratchMode={onScratchMode || (() => {})} />
      ) : (
        <>
          <SubPageHeader tab={activeTab as HubTab} onBack={() => setActiveTab('home')} />
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTab === 'frame'    && <CreationPlanEditor />}
            {activeTab === 'document' && <DocumentEditorPanel onDocumentMode={onDocumentMode} />}
          </div>
        </>
      )}
    </div>
  );
}