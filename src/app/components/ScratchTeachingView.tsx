import { useState } from 'react';

/* ── Types ────────────────────────────────────────────────── */
type Category = 'motion' | 'looks' | 'events' | 'control';

interface BlockParam { type: 'text' | 'input' | 'oval'; value: string }
interface ScratchBlock {
  id: string; label: string; color: string; category: Category;
  params?: BlockParam[];
  title: string; intro: string; details: string[]; tip: string;
}

/* ── Data ────────────────────────────────────────────────── */
const CATS: { id: Category; label: string; color: string }[] = [
  { id: 'motion',  label: '動作', color: '#4C97FF' },
  { id: 'looks',   label: '外觀', color: '#9966FF' },
  { id: 'events',  label: '事件', color: '#FFAB19' },
  { id: 'control', label: '控制', color: '#FF8C1A' },
];

const BLOCKS: ScratchBlock[] = [
  { id:'move', label:'移動', color:'#4C97FF', category:'motion',
    params:[{type:'input',value:'10'},{type:'text',value:'步'}],
    title:'移動 n 步',
    intro:'讓角色朝「目前面對的方向」移動指定的步數。',
    details:['步數越大，移動越遠。','輸入負數可以往反方向走 ↩️','角色一開始面向右邊（90°）。','可以搭配「旋轉」積木改變移動方向。'],
    tip:'試試放在「重複」裡，讓角色一直走！' },
  { id:'goto', label:'定位到', color:'#4C97FF', category:'motion',
    params:[{type:'text',value:'x:'},{type:'input',value:'0'},{type:'text',value:'y:'},{type:'input',value:'0'}],
    title:'定位到 x / y',
    intro:'把 Scratch 的舞台想像成一張地圖 🗺️，有橫縱格線，中心是 (0, 0)。',
    details:['x 是左右方向：往右 +，往左 −','y 是上下方向：往上 +，往下 −','舞台寬 480、高 360（各自 ±240 / ±180）。'],
    tip:'輸入 x:0 y:0 可以瞬間把角色移回舞台正中間！' },
  { id:'turn', label:'右轉', color:'#4C97FF', category:'motion',
    params:[{type:'input',value:'15'},{type:'text',value:'度'}],
    title:'右轉 / 左轉',
    intro:'讓角色順時針（右轉）或逆時針（左轉）旋轉指定角度。',
    details:['360 度是一整圈。','180 度是半圈（調頭）。','90 度是一個直角。'],
    tip:'放進「重複」積木，可以讓角色不停旋轉！' },
  { id:'say', label:'說', color:'#9966FF', category:'looks',
    params:[{type:'input',value:'哈囉！'},{type:'text',value:'持續'},{type:'input',value:'2'},{type:'text',value:'秒'}],
    title:'說 ... （持續 n 秒）',
    intro:'讓角色在舞台上顯示一個說話泡泡 💬。',
    details:['第一個欄位：要說的內容。','第二個欄位：泡泡顯示幾秒後消失。','不填秒數版本會一直顯示到下一個指令。'],
    tip:'可以讓角色在故事中「開口說話」，超有趣！' },
  { id:'size', label:'設定大小', color:'#9966FF', category:'looks',
    params:[{type:'text',value:'大小設為'},{type:'input',value:'100'},{type:'text',value:'%'}],
    title:'設定大小 %',
    intro:'改變角色的顯示大小，原始大小是 100%。',
    details:['數字 > 100 → 角色變大。','數字 < 100 → 角色縮小。','大小改變不會影響角色的實際碰撞範圍。'],
    tip:'試試讓角色由小變大，做出「進場」的動畫效果！' },
  { id:'flag', label:'綠旗開始', color:'#FFAB19', category:'events',
    params:[],
    title:'當 🚩 被點擊',
    intro:'這是「帽子積木」——程式的起點！按下舞台上方的綠旗按鈕，就會執行下方所有積木。',
    details:['每個角色可以有多個綠旗積木，它們同時執行。','按下紅色停止鈕 🟥 可以停止所有程式。'],
    tip:'所有的 Scratch 程式幾乎都從這個積木開始！' },
  { id:'keypress', label:'按下按鍵', color:'#FFAB19', category:'events',
    params:[{type:'oval',value:'空白鍵'}],
    title:'當按下 [按鍵]',
    intro:'當使用者在鍵盤上按下指定按鍵時，執行下方積木。',
    details:['可以設定方向鍵、字母鍵、空白鍵等。','非常適合製作鍵盤控制遊戲！','多個角色可以各自監聽不同的按鍵。'],
    tip:'用方向鍵控制角色移動，製作你的第一個小遊戲！' },
  { id:'repeat', label:'重複', color:'#FF8C1A', category:'control',
    params:[{type:'input',value:'10'}],
    title:'重複 n 次',
    intro:'把包住的積木重複執行指定的次數。',
    details:['積木會一次一次依序執行，到達次數後停止。','可以嵌套（重複裡放重複）做出複雜的動作。','搭配移動積木，可以讓角色走固定的距離。'],
    tip:'把「移動 10 步」放進「重複 36 次」，角色會走一個正多邊形！' },
  { id:'forever', label:'重複無限次', color:'#FF8C1A', category:'control',
    params:[],
    title:'重複無限次',
    intro:'永遠執行包住的積木，除非按下停止鈕。',
    details:['適合製作持續移動、或持續偵測的功能。','遊戲中很常用：讓角色一直追蹤滑鼠位置。','注意：記得加入「等待」積木，避免程式跑太快！'],
    tip:'搭配「定位到滑鼠位置」讓角色跟著你的滑鼠跑！' },
];

/* ── Block Visual Component ───────────────────────────────── */
function BlockVisual({ block }: { block: ScratchBlock }) {
  const { color, label, params, category } = block;
  const isHat = category === 'events';

  return (
    <div className="flex flex-col items-start gap-0 select-none">
      {isHat ? (
        <>
          <div style={{ background: color, color: '#fff', borderRadius: '14px 14px 0 0', padding: '7px 16px', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: `0 3px 0 ${color}aa` }}>
            {label === '綠旗開始' && <span>🚩</span>}
            {label === '按下按鍵' && <span>⌨️</span>}
            <span>{label}</span>
          </div>
          <div style={{ width: 26, height: 10, background: color, borderRadius: '0 0 5px 5px', marginLeft: 12, opacity: 0.65 }} />
        </>
      ) : label === '重複無限次' ? (
        <>
          <div style={{ width: 26, height: 10, background: color, borderRadius: '5px 5px 0 0', marginLeft: 12, opacity: 0.65 }} />
          <div style={{ background: color, color: '#fff', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 700, boxShadow: `0 3px 0 ${color}aa` }}>∞ 重複無限次</div>
          <div style={{ width: 26, height: 10, background: color, borderRadius: '0 0 5px 5px', marginLeft: 12, opacity: 0.65 }} />
        </>
      ) : (
        <>
          <div style={{ width: 26, height: 10, background: color, borderRadius: '5px 5px 0 0', marginLeft: 12, opacity: 0.65 }} />
          <div style={{ background: color, color: '#fff', borderRadius: 7, padding: '8px 14px', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: `0 3px 0 ${color}aa`, whiteSpace: 'nowrap' }}>
            <span>{label}</span>
            {params?.map((p, i) =>
              p.type === 'text' ? (
                <span key={i}>{p.value}</span>
              ) : p.type === 'oval' ? (
                <span key={i} style={{ background: 'rgba(255,255,255,0.9)', color, borderRadius: 20, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{p.value}</span>
              ) : (
                <span key={i} style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 5, padding: '2px 10px', fontSize: 11, minWidth: 28, textAlign: 'center' }}>{p.value}</span>
              )
            )}
          </div>
          <div style={{ width: 26, height: 10, background: color, borderRadius: '0 0 5px 5px', marginLeft: 12, opacity: 0.65 }} />
        </>
      )}
    </div>
  );
}

/* ── Main Component ───────────────────────────────────────── */
interface ScratchTeachingViewProps {
  onExit: () => void;
}

export function ScratchTeachingView({ onExit }: ScratchTeachingViewProps) {
  const [activeCat, setActiveCat] = useState<Category>('motion');
  const [selected, setSelected] = useState<ScratchBlock>(BLOCKS[1]);

  const filtered = BLOCKS.filter(b => b.category === activeCat);
  const cat = CATS.find(c => c.id === activeCat)!;

  return (
    <div className="flex flex-col h-full gap-3">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2.5 rounded-2xl"
           style={{ background: 'linear-gradient(135deg,rgba(76,151,255,0.13),rgba(58,100,140,0.08))', border: '1.5px solid rgba(76,151,255,0.2)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
               style={{ background: '#4C97FF', boxShadow: '0 3px 10px rgba(76,151,255,0.35)' }}>🧩</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#3A648C' }}>Scratch 積木教學</div>
            <div style={{ fontSize: 11, color: '#8AACC8' }}>點選積木，Na-Bo 為你詳細解說</div>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all hover:bg-white/60 active:scale-95"
          style={{ color: '#8AACC8', border: '1.5px solid rgba(58,100,140,0.15)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2l8 8M10 2l-8 8" stroke="#8AACC8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 600 }}>離開教學</span>
        </button>
      </div>

      {/* ── Category Tabs ── */}
      <div className="flex-shrink-0 flex gap-2 px-1">
        {CATS.map(c => (
          <button
            key={c.id}
            onClick={() => { setActiveCat(c.id); setSelected(BLOCKS.find(b => b.category === c.id)!); }}
            className="flex-1 py-1.5 rounded-xl transition-all duration-150 hover:scale-[1.03] active:scale-95"
            style={{
              background: activeCat === c.id ? c.color : `${c.color}14`,
              color: activeCat === c.id ? '#fff' : c.color,
              fontSize: 11, fontWeight: 700,
              border: `1.5px solid ${c.color}${activeCat === c.id ? 'ff' : '30'}`,
              boxShadow: activeCat === c.id ? `0 3px 10px ${c.color}44` : 'none',
            }}
          >{c.label}</button>
        ))}
      </div>

      {/* ── Workspace Canvas (積木排列區) ── */}
      <div className="flex-1 rounded-2xl overflow-hidden relative flex flex-col min-h-0"
           style={{ background: 'linear-gradient(160deg,#1e2d3d 0%,#162030 100%)', border: `2px solid ${cat.color}30` }}>
        {/* 積木列表 (上半) */}
        <div className="flex-shrink-0 px-3 pt-3 pb-1">
          <div className="text-[10px] font-bold tracking-widest mb-2 px-1" style={{ color: cat.color, opacity: 0.8 }}>積木列表</div>
          <div className="flex flex-wrap gap-1.5">
            {filtered.map(b => (
              <button
                key={b.id}
                onClick={() => setSelected(b)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all hover:scale-[1.04] active:scale-95"
                style={{
                  background: selected.id === b.id ? `${b.color}` : 'rgba(255,255,255,0.1)',
                  border: `1.5px solid ${selected.id === b.id ? b.color : 'rgba(255,255,255,0.12)'}`,
                  color: selected.id === b.id ? '#fff' : `${b.color}cc`,
                  fontSize: 10, fontWeight: 700,
                  boxShadow: selected.id === b.id ? `0 3px 10px ${b.color}55` : 'none',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: selected.id === b.id ? '#fff' : b.color }}/>
                {b.title}
              </button>
            ))}
          </div>
        </div>

        {/* 分隔線 */}
        <div className="mx-3 my-2 opacity-20" style={{ height: 1, background: cat.color }}/>

        {/* 積木堆疊預覽 (下半) */}
        <div className="flex-1 flex items-center justify-center px-4 pb-4 relative z-10">
          <div style={{ filter: `drop-shadow(0 8px 24px ${cat.color}44)` }}>
            <BlockVisual block={selected} />
          </div>
        </div>

        {/* 底部說明標籤 */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <div style={{ background: 'rgba(76,151,255,0.15)', border: '1px solid rgba(76,151,255,0.25)', borderRadius: 20, padding: '4px 14px', fontSize: 10, color: '#8AACC8', backdropFilter: 'blur(6px)' }}>
            🔌 Scratch 編輯器整合區域 — 等待串接
          </div>
        </div>
      </div>

      {/* ── Explanation Panel ── */}
      <div className="flex-shrink-0 rounded-2xl overflow-hidden"
           style={{ background: '#fff', border: '1.5px solid rgba(243,204,88,0.4)' }}>
        {/* title bar */}
        <div className="px-4 py-2 flex items-center justify-between"
             style={{ background: '#F3CC58' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#3A648C' }}>{selected.title}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#3A648C', background: 'rgba(58,100,140,0.12)', borderRadius: 99, padding: '2px 7px' }}>說明</span>
        </div>
        {/* body */}
        <div className="p-3 flex flex-col gap-2">
          <p style={{ fontSize: 11, color: '#2B3A52', lineHeight: 1.8 }}>{selected.intro}</p>
          <div className="flex flex-col gap-1">
            {selected.details.map((d, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span style={{ color: selected.color, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 11, color: '#3A648C', lineHeight: 1.7 }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2 p-2 rounded-xl"
               style={{ background: 'rgba(243,204,88,0.1)', border: '1.5px solid rgba(243,204,88,0.25)' }}>
            <span style={{ fontSize: 13 }}>💡</span>
            <span style={{ fontSize: 10, color: '#6A7A52', lineHeight: 1.75, fontStyle: 'italic' }}>{selected.tip}</span>
          </div>
        </div>
      </div>

    </div>
  );
}