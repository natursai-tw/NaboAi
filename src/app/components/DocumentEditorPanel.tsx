import { useState, useRef, useEffect } from 'react';

const FORMATS = [
  { label: '學習報告', color: '#3A648C', bg: 'rgba(58,100,140,0.10)', emoji: '📋', placeholder: '撰寫學習報告，整理知識重點…' },
  { label: '筆記整理', color: '#48A88B', bg: 'rgba(72,168,139,0.10)', emoji: '📝', placeholder: '整理課堂筆記，建立知識體系…' },
  { label: '簡報草稿', color: '#4C97FF', bg: 'rgba(76,151,255,0.10)', emoji: '📊', placeholder: '規劃簡報架構，撰寫投影片內容…' },
  { label: '心智圖文字', color: '#9966FF', bg: 'rgba(153,102,255,0.10)', emoji: '🧠', placeholder: '以文字方式描述心智圖的分支架構…' },
  { label: '教案設計', color: '#48A88B', bg: 'rgba(72,168,139,0.10)', emoji: '📚', placeholder: '設計教學活動，撰寫教案流程…' },
  { label: '問卷設計', color: '#F3CC58', bg: 'rgba(243,204,88,0.15)', emoji: '📋', placeholder: '撰寫問卷題目與選項內容…' },
];

const SAMPLE_CONTENT: Record<string, string> = {
  '學習報告': `<h2>一、前言</h2><p>本報告旨在整理本週學習內容，歸納重要概念並反思學習歷程。</p><h2>二、主要內容</h2><p>在本次學習中，我們探討了以下幾個重要主題：</p><ul><li>核心概念的定義與範疇</li><li>實際應用的案例分析</li><li>與既有知識的連結與比較</li></ul><h2>三、學習心得</h2><p>透過這次學習，我對這個領域有了更深入的理解。特別是在實作部分，讓我對理論有了更具體的認識。</p>`,
  '筆記整理': `<h2>📌 重點摘要</h2><p>今日課程核心概念整理如下。</p><h2>📖 詳細筆記</h2><p><strong>第一節：</strong>介紹基本概念與定義。</p><p><strong>第二節：</strong>深入探討應用場景與實際操作方式。</p><h2>💡 補充說明</h2><p>課堂中提到的額外資源與延伸閱讀…</p>`,
  '簡報草稿': `<h2>🎯 簡報主題</h2><p>本簡報旨在介紹…</p><h2>投影片 1：開場與動機</h2><p>為什麼這個主題重要？引起聽眾興趣的切入點。</p><h2>投影片 2：核心內容</h2><p>主要論點一：…</p><p>主要論點二：…</p><h2>投影片 3：結論與呼籲行動</h2><p>總結重點，提出行動建議。</p>`,
  '心智圖文字': `<h2>🧠 中心主題</h2><p><strong>主枝一：</strong>概念說明 → 子項目 A → 子項目 B</p><p><strong>主枝二：</strong>應用情境 → 案例 1 → 案例 2</p><p><strong>主枝三：</strong>延伸思考 → 問題探究 → 未來方向</p>`,
  '教案設計': `<h2>教學目標</h2><p>學生能夠理解並應用本課程的核心概念。</p><h2>教學流程</h2><p><strong>引入（10分鐘）：</strong>透過提問引發學生的先備知識。</p><p><strong>發展（25分鐘）：</strong>教師示範、學生操作練習。</p><p><strong>總結（10分鐘）：</strong>學生分享學習成果，教師補充。</p><h2>評量方式</h2><p>觀察學生操作過程，並收集學習單。</p>`,
  '問卷設計': `<h2>問卷說明</h2><p>本問卷旨在了解…，請您花費約 5 分鐘填答。</p><h2>第一部分：基本資料</h2><p>Q1. 您的年級？</p><p>□ 一年級　□ 二年級　□ 三年級</p><h2>第二部分：主題問題</h2><p>Q2. 您對這個主題的熟悉程度？（1＝非常不熟悉，5＝非常熟悉）</p><p>□ 1　□ 2　□ 3　□ 4　□ 5</p>`,
};

type FormatLabel = typeof FORMATS[number]['label'];

interface DocumentEditorPanelProps {
  onDocumentMode?: (active: boolean) => void;
}

export function DocumentEditorPanel({ onDocumentMode }: DocumentEditorPanelProps) {
  const [selected, setSelected] = useState<typeof FORMATS[0]>(FORMATS[0]);
  const [title, setTitle] = useState('我的學習報告');
  const editorRef = useRef<HTMLDivElement>(null);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    onDocumentMode?.(true);
    return () => { onDocumentMode?.(false); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (fmt: typeof FORMATS[0]) => {
    setSelected(fmt);
    setTitle(`我的${fmt.label}`);
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = SAMPLE_CONTENT[fmt.label as FormatLabel] ?? `<p>${fmt.placeholder}</p>`;
        countWords();
      }
    }, 50);
  };

  const countWords = () => {
    const text = editorRef.current?.innerText ?? '';
    setWordCount(text.replace(/\s+/g, '').length);
  };

  const execCmd = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    countWords();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-3 py-2 gap-2"
           style={{ borderBottom: '1.5px solid rgba(58,100,140,0.1)', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="px-2 py-0.5 rounded-lg flex-shrink-0"
                style={{ background: selected.bg, color: selected.color, fontSize: 10, fontWeight: 700, border: `1px solid ${selected.color}30` }}>
            {selected.emoji} {selected.label}
          </span>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="flex-1 min-w-0 bg-transparent outline-none truncate"
            style={{ fontSize: 13, fontWeight: 700, color: '#2B3A52' }}
            placeholder="文件標題"
          />
        </div>
        <span className="flex-shrink-0" style={{ fontSize: 10, color: '#B0C4D4' }}>{wordCount} 字</span>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex-shrink-0 flex items-center gap-0.5 px-2 py-1.5 flex-wrap"
           style={{ borderBottom: '1.5px solid rgba(58,100,140,0.08)', background: 'rgba(248,252,255,0.9)' }}>
        {[
          { label: 'B', cmd: 'bold',      title: '粗體',      style: { fontWeight: 800 } },
          { label: 'I', cmd: 'italic',    title: '斜體',      style: { fontStyle: 'italic' } },
          { label: 'U', cmd: 'underline', title: '底線',      style: { textDecoration: 'underline' } },
        ].map(b => (
          <button key={b.cmd} onMouseDown={e => { e.preventDefault(); execCmd(b.cmd); }}
                  title={b.title}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all hover:bg-[rgba(58,100,140,0.12)] active:scale-90"
                  style={{ color: '#3A648C', ...b.style }}>
            {b.label}
          </button>
        ))}
        <div className="w-px h-4 mx-1" style={{ background: 'rgba(58,100,140,0.15)' }}/>
        {[
          { label: 'H1', title: '標題一', tag: 'h1' },
          { label: 'H2', title: '標題二', tag: 'h2' },
        ].map(b => (
          <button key={b.tag} onMouseDown={e => { e.preventDefault(); execCmd('formatBlock', b.tag); }}
                  title={b.title}
                  className="px-2 h-7 rounded-md flex items-center justify-center text-[10px] transition-all hover:bg-[rgba(58,100,140,0.12)] active:scale-90"
                  style={{ color: '#3A648C', fontWeight: 700 }}>
            {b.label}
          </button>
        ))}
        <div className="w-px h-4 mx-1" style={{ background: 'rgba(58,100,140,0.15)' }}/>
        <button onMouseDown={e => { e.preventDefault(); execCmd('insertUnorderedList'); }}
                title="項目清單" className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-[rgba(58,100,140,0.12)] active:scale-90">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="2.5" cy="4.5" r="1.5" fill="#3A648C"/>
            <circle cx="2.5" cy="8" r="1.5" fill="#3A648C"/>
            <circle cx="2.5" cy="11.5" r="1.5" fill="#3A648C"/>
            <rect x="6" y="3.5" width="8" height="2" rx="1" fill="#3A648C"/>
            <rect x="6" y="7" width="8" height="2" rx="1" fill="#3A648C"/>
            <rect x="6" y="10.5" width="8" height="2" rx="1" fill="#3A648C"/>
          </svg>
        </button>
        <button onMouseDown={e => { e.preventDefault(); execCmd('insertOrderedList'); }}
                title="編號清單" className="w-7 h-7 rounded-md flex items-center justify-center transition-all hover:bg-[rgba(58,100,140,0.12)] active:scale-90">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <text x="0" y="6" style={{ fontSize: '6px', fill: '#3A648C', fontWeight: 'bold' }}>1.</text>
            <text x="0" y="10" style={{ fontSize: '6px', fill: '#3A648C', fontWeight: 'bold' }}>2.</text>
            <text x="0" y="14" style={{ fontSize: '6px', fill: '#3A648C', fontWeight: 'bold' }}>3.</text>
            <rect x="7" y="3.5" width="7" height="2" rx="1" fill="#3A648C"/>
            <rect x="7" y="7.5" width="7" height="2" rx="1" fill="#3A648C"/>
            <rect x="7" y="11.5" width="7" height="2" rx="1" fill="#3A648C"/>
          </svg>
        </button>
        <div className="flex-1"/>
      </div>

      {/* ── Editor Body ── */}
      <div className="flex-1 overflow-y-auto px-5 py-4"
           style={{ background: '#fff' }}>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={countWords}
          className="outline-none min-h-full prose-doc"
          style={{
            fontSize: 13,
            lineHeight: 1.9,
            color: '#2B3A52',
            minHeight: '100%',
          }}
        />
      </div>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2"
           style={{ borderTop: '1.5px solid rgba(58,100,140,0.08)', background: 'rgba(248,252,255,0.9)', backdropFilter: 'blur(8px)' }}>
        <span style={{ fontSize: 10, color: '#B0C4D4' }}>💬 在左側聊天室請 Na-Bo 協助修改</span>
        <button
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all hover:scale-[1.03] active:scale-95"
          style={{ background: 'rgba(243,204,88,0.15)', color: '#B8940A', fontSize: 10, fontWeight: 700, border: '1px solid rgba(243,204,88,0.4)' }}
        >
          💾 儲存草稿
        </button>
      </div>

      <style>{`
        [contenteditable] h1 { font-size: 18px; font-weight: 800; color: #1A2E4A; margin: 12px 0 6px; }
        [contenteditable] h2 { font-size: 14px; font-weight: 700; color: #3A648C; margin: 10px 0 4px; border-left: 3px solid #48A88B; padding-left: 8px; }
        [contenteditable] p  { margin: 4px 0; }
        [contenteditable] ul, [contenteditable] ol { padding-left: 20px; margin: 4px 0; }
        [contenteditable] li { margin: 2px 0; }
        [contenteditable] strong { color: #1A2E4A; }
        [contenteditable]:focus { outline: none; }
      `}</style>
    </div>
  );
}
