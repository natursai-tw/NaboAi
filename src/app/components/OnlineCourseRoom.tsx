import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pencil, Eraser, Square, Circle, Type, Minus, MousePointer2,
  Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, LogOut,
  ZoomIn, ZoomOut, Undo2, Redo2, Trash2, ChevronLeft, ChevronRight,
  Hand, ImageIcon, Download, Users, X, Send
} from 'lucide-react';

interface OnlineCourseRoomProps {
  onLeave: () => void;
}

type Tool = 'select' | 'pen' | 'eraser' | 'line' | 'rect' | 'circle' | 'text' | 'hand';

interface Participant {
  id: string;
  name: string;
  emoji: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isTeacher?: boolean;
}

interface Permissions {
  mic: boolean;
  chat: boolean;
  share: boolean;
}

const mockParticipants: Participant[] = [
  { id: '1', name: '林老師', emoji: '👨‍🏫', isMuted: false, isVideoOn: true, isTeacher: true },
  { id: '2', name: '小明', emoji: '🧒', isMuted: true, isVideoOn: true },
  { id: '3', name: '小美', emoji: '👧', isMuted: false, isVideoOn: true },
  { id: '4', name: '小華', emoji: '👦', isMuted: true, isVideoOn: false },
  { id: '5', name: '小芳', emoji: '🧑', isMuted: false, isVideoOn: true },
];

const COLORS = ['#2B3A52', '#E74C3C', '#3498DB', '#48A88B', '#F3CC58', '#9B59B6', '#E67E22', '#1ABC9C'];
const STROKE_WIDTHS = [2, 4, 6, 10];

const TOOL_LIST: { id: Tool; label: string; icon: React.FC<{ size?: number }> }[] = [
  { id: 'select', label: '選取', icon: (p) => <MousePointer2 {...p} /> },
  { id: 'pen',    label: '畫筆', icon: (p) => <Pencil {...p} /> },
  { id: 'eraser', label: '橡皮擦', icon: (p) => <Eraser {...p} /> },
  { id: 'line',   label: '直線', icon: (p) => <Minus {...p} /> },
  { id: 'rect',   label: '矩形', icon: (p) => <Square {...p} /> },
  { id: 'circle', label: '圓形', icon: (p) => <Circle {...p} /> },
  { id: 'text',   label: '文字', icon: (p) => <Type {...p} /> },
  { id: 'hand',   label: '移動', icon: (p) => <Hand {...p} /> },
];

export function OnlineCourseRoom({ onLeave }: OnlineCourseRoomProps) {
  // Canvas
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const canvasWrap  = useRef<HTMLDivElement>(null);
  const isDrawingRef = useRef(false);

  // Tool state
  const [activeTool,   setActiveTool]   = useState<Tool>('pen');
  const [activeColor,  setActiveColor]  = useState('#2B3A52');
  const [strokeWidth,  setStrokeWidth]  = useState(4);
  const [showColors,   setShowColors]   = useState(false);
  const [showStrokes,  setShowStrokes]  = useState(false);
  const [zoom,         setZoom]         = useState(100);

  // UI panels
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat,          setShowChat]         = useState(false);
  const [showLeaveModal,    setShowLeaveModal]   = useState(false);

  // Permissions per participant (keyed by id, teacher excluded)
  const [permissions, setPermissions] = useState<Record<string, Permissions>>(() =>
    Object.fromEntries(
      mockParticipants
        .filter(p => !p.isTeacher)
        .map(p => [p.id, { mic: true, chat: true, share: false }])
    )
  );

  const togglePerm = (id: string, key: keyof Permissions) =>
    setPermissions(prev => ({
      ...prev,
      [id]: { ...prev[id], [key]: !prev[id][key] },
    }));

  // AV
  const [micOn,   setMicOn]   = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { id: '1', name: '林老師', text: '同學們好，今天我們來學習分數！', time: '14:02' },
    { id: '2', name: '小明',   text: '老師好！',                       time: '14:02' },
    { id: '3', name: '小美',   text: '準備好了 ✋',                     time: '14:03' },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Timer
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  // ── Canvas setup ────────────────────────────────────────────────
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#EEF2F7';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = canvasWrap.current;
    if (!canvas || !wrap) return;
    const sync = () => {
      canvas.width  = wrap.clientWidth;
      canvas.height = wrap.clientHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) drawGrid(ctx, canvas.width, canvas.height);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [drawGrid]);

  // ── Drawing ─────────────────────────────────────────────────────
  const getPos = (e: React.MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'select' || activeTool === 'hand' || activeTool === 'text') return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : activeColor;
    ctx.lineWidth   = activeTool === 'eraser' ? strokeWidth * 4 : strokeWidth;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
  }, [activeTool, activeColor, strokeWidth]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDrawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, []);

  const onMouseUp = useCallback(() => { isDrawingRef.current = false; }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) drawGrid(ctx, canvas.width, canvas.height);
  };

  // ── Chat ─────────────────────────────────────────────────────────
  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: String(Date.now()), name: '我', text: chatInput,
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatInput('');
  };

  const cursorClass =
    activeTool === 'pen'  || activeTool === 'line' ? 'cursor-crosshair' :
    activeTool === 'eraser'                         ? 'cursor-cell'      :
    activeTool === 'hand'                           ? 'cursor-grab'      :
    activeTool === 'text'                           ? 'cursor-text'      : 'cursor-default';

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      {/* ── Animations ── */}
      <style>{`
        @keyframes ocr-in  { from { opacity:0; transform:scale(.97) } to { opacity:1; transform:scale(1) } }
        @keyframes ocr-sx  { from { opacity:0; transform:translateX(16px) } to { opacity:1; transform:translateX(0) } }
        @keyframes ocr-pop { from { opacity:0; transform:scale(.88) } to { opacity:1; transform:scale(1) } }
        .ocr-room { animation: ocr-in  .35s ease both }
        .ocr-panel{ animation: ocr-sx  .25s ease both }
        .ocr-pop  { animation: ocr-pop .3s cubic-bezier(.34,1.56,.64,1) both }
      `}</style>

      {/* ════════════════════════════════════════════════════════════
          OUTER WRAPPER  –  fills the space below the app header
      ════════════════════════════════════════════════════════════ */}
      <div className="ocr-room flex flex-col bg-[#EEF2F7]"
           style={{ height: 'calc(100vh - 74px)' }}>

        {/* ── TOP BAR ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-2.5
                        bg-white/95 backdrop-blur border-b border-[#E2EAF2] z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#48A88B]/10 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#48A88B] animate-pulse block" />
              <span className="text-[11px] font-black text-[#48A88B]">上課中</span>
            </div>
            <span className="text-[14px] font-black text-[#1A2E4A]">國語文閱讀理解</span>
            <span className="text-[11px] font-bold text-[#8A9BB0]">林老師</span>
          </div>
          <div className="flex items-center gap-2">
            <Pill>⏱ {fmt(elapsed)}</Pill>
            <Pill>👥 {mockParticipants.length}</Pill>
          </div>
        </div>

        {/* ── MAIN ROW ── */}
        <div className="flex-1 flex min-h-0">

          {/* ── LEFT TOOL PANEL ── */}
          <div className="shrink-0 w-14 bg-white/85 backdrop-blur border-r border-[#E2EAF2]
                          flex flex-col items-center py-3 gap-0.5 overflow-y-auto">

            {TOOL_LIST.map(t => (
              <ToolBtn
                key={t.id}
                label={t.label}
                active={activeTool === t.id}
                onClick={() => { setActiveTool(t.id); setShowColors(false); setShowStrokes(false); }}
              >
                <t.icon size={17} />
              </ToolBtn>
            ))}

            <Divider />

            {/* Color swatch */}
            <div className="relative">
              <button
                onClick={() => { setShowColors(v => !v); setShowStrokes(false); }}
                title="顏色"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F0F4F8] transition-all"
              >
                <span className="w-5 h-5 rounded-full border-2 border-white shadow"
                      style={{ background: activeColor }} />
              </button>
              {showColors && (
                <div className="absolute left-12 top-0 z-50 bg-white rounded-2xl shadow-xl border border-[#E2EAF2] p-3">
                  <p className="text-[10px] font-black text-[#8A9BB0] mb-2">選擇顏色</p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {COLORS.map(c => (
                      <button key={c}
                        onClick={() => { setActiveColor(c); setShowColors(false); }}
                        className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110
                          ${activeColor === c ? 'border-[#3A648C] scale-110' : 'border-transparent'}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stroke width */}
            <div className="relative">
              <button
                onClick={() => { setShowStrokes(v => !v); setShowColors(false); }}
                title="筆刷粗細"
                className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-[#F0F4F8] transition-all"
              >
                <span className="w-5 rounded-full"
                      style={{ height: Math.max(strokeWidth, 2), background: activeColor, display:'block' }} />
              </button>
              {showStrokes && (
                <div className="absolute left-12 top-0 z-50 bg-white rounded-2xl shadow-xl border border-[#E2EAF2] p-3">
                  <p className="text-[10px] font-black text-[#8A9BB0] mb-2">筆刷粗細</p>
                  <div className="flex flex-col gap-1.5">
                    {STROKE_WIDTHS.map(w => (
                      <button key={w}
                        onClick={() => { setStrokeWidth(w); setShowStrokes(false); }}
                        className={`flex items-center gap-3 px-3 py-1.5 rounded-xl transition-all
                          ${strokeWidth === w ? 'bg-[#E8F8F3]' : 'hover:bg-[#F5F8FA]'}`}
                      >
                        <span className="w-10 rounded-full" style={{ height: w, background: activeColor, display:'block' }} />
                        <span className="text-[10px] font-bold text-[#8A9BB0]">{w}px</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Divider />

            <ToolBtn label="復原"  onClick={() => {}}><Undo2 size={16} /></ToolBtn>
            <ToolBtn label="重做"  onClick={() => {}}><Redo2 size={16} /></ToolBtn>
            <ToolBtn label="清除"  onClick={clearCanvas} danger><Trash2 size={16} /></ToolBtn>

            <div className="flex-1" />

            <ToolBtn label="插入圖片" onClick={() => {}}><ImageIcon size={16} /></ToolBtn>
            <ToolBtn label="下載"     onClick={() => {}}><Download size={16} /></ToolBtn>
          </div>

          {/* ── CANVAS AREA ── */}
          <div className="flex-1 relative min-w-0" ref={canvasWrap}>
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full ${cursorClass}`}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
            />

            {/* Zoom HUD */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1
                            bg-white/90 backdrop-blur rounded-xl px-2 py-1.5 shadow-sm border border-[#E2EAF2]">
              <HudBtn onClick={() => setZoom(z => Math.max(25, z - 25))}><ZoomOut size={13}/></HudBtn>
              <span className="text-[11px] font-black text-[#3A648C] w-10 text-center tabular-nums">{zoom}%</span>
              <HudBtn onClick={() => setZoom(z => Math.min(200, z + 25))}><ZoomIn size={13}/></HudBtn>
            </div>

            {/* Page HUD */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1
                            bg-white/90 backdrop-blur rounded-xl px-2 py-1.5 shadow-sm border border-[#E2EAF2]">
              <HudBtn onClick={() => {}}><ChevronLeft size={13}/></HudBtn>
              <span className="text-[11px] font-black text-[#3A648C] px-1">1 / 1</span>
              <HudBtn onClick={() => {}}><ChevronRight size={13}/></HudBtn>
            </div>
          </div>

          {/* ── PARTICIPANTS PANEL ── always 200 px, always visible when toggled ── */}
          {showParticipants && (
            <div className="ocr-panel shrink-0 w-[200px] bg-white/90 backdrop-blur
                            border-l border-[#E2EAF2] flex flex-col">
              {/* header */}
              <div className="flex items-center justify-between px-3 py-3 border-b border-[#E2EAF2]">
                <span className="text-[12px] font-black text-[#3A648C]">
                  參與者（{mockParticipants.length}）
                </span>
                <button onClick={() => setShowParticipants(false)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center
                                   bg-[#F0F4F8] text-[#8A9BB0] hover:text-[#3A648C] hover:bg-[#E2EAF2] transition-all">
                  <X size={12} />
                </button>
              </div>
              {/* list */}
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2"
                   style={{ scrollbarWidth: 'thin' }}>
                {mockParticipants.map(p => (
                   <div key={p.id} className={`rounded-[14px] border border-[#E2EAF2] overflow-hidden bg-white shadow-sm ${!p.isTeacher ? 'flex' : ''}`}>
                     {/* 左側：視訊和名稱欄 */}
                     <div className="flex-1 min-w-0">
                       {/* video area */}
                       <div className={`aspect-video flex flex-col items-center justify-center gap-1 ${ p.isTeacher ? 'bg-gradient-to-br from-[#3A648C] to-[#2A4A6C]' : p.isVideoOn ? 'bg-gradient-to-br from-[#E8F8F3] to-[#C8F0EA]' : 'bg-[#F0F4F8]' } m-[0px]`}>
                         <span className="text-[28px]">{p.emoji}</span>
                         {!p.isVideoOn && (
                           <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#8A9BB0]">
                             <VideoOff size={10} /> 已關閉
                           </div>
                         )}
                       </div>
                       
                       {/* Name bar */}
                       <div className="bg-[#2B3A52] px-2 py-1 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-white truncate">
                           {p.isTeacher && '👑 '}{p.name}
                         </span>
                         {p.isMuted
                           ? <MicOff size={10} className="text-red-400 shrink-0" />
                           : <Mic    size={10} className="text-[#48A88B] shrink-0" />}
                       </div>
                     </div>
                     
                     {/* 右側：權限控制區 - 管理員可控制學生權限 */}
                     {!p.isTeacher && (
                       <div className="shrink-0 w-12 bg-[#F5F8FA] border-l border-[#E2EAF2] flex flex-col items-center justify-center gap-2 py-2">
                         {/* 麥克風權限 */}
                         <button
                           onClick={() => togglePerm(p.id, 'mic')}
                           title={`麥克風${permissions[p.id]?.mic ? '已啟用' : '已停用'} - 點擊切換`}
                           className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                             permissions[p.id]?.mic
                               ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md'
                               : 'bg-[#D8E4EE] text-[#8A9BB0]'
                           }`}
                         >
                           {permissions[p.id]?.mic ? <Mic size={13} /> : <MicOff size={13} />}
                         </button>
                         
                         {/* 聊天權限 */}
                         <button
                           onClick={() => togglePerm(p.id, 'chat')}
                           title={`聊天${permissions[p.id]?.chat ? '已啟用' : '已停用'} - 點擊切換`}
                           className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                             permissions[p.id]?.chat
                               ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md'
                               : 'bg-[#D8E4EE] text-[#8A9BB0]'
                           }`}
                         >
                           <MessageSquare size={13} />
                         </button>
                         
                         {/* 分享螢幕權限 */}
                         <button
                           onClick={() => togglePerm(p.id, 'share')}
                           title={`分享螢幕${permissions[p.id]?.share ? '已啟用' : '已停用'} - 點擊切換`}
                           className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                             permissions[p.id]?.share
                               ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md'
                               : 'bg-[#D8E4EE] text-[#8A9BB0]'
                           }`}
                         >
                           <MonitorUp size={13} />
                         </button>
                       </div>
                     )}
                   </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CHAT PANEL ── */}
          {showChat && (
            <div className="ocr-panel shrink-0 w-[280px] bg-white/90 backdrop-blur
                            border-l border-[#E2EAF2] flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2EAF2]">
                <span className="text-[13px] font-black text-[#3A648C]">💬 聊天室</span>
                <button onClick={() => setShowChat(false)}
                        className="w-6 h-6 rounded-lg flex items-center justify-center
                                   bg-[#F0F4F8] text-[#8A9BB0] hover:text-[#3A648C] hover:bg-[#E2EAF2] transition-all">
                  <X size={12} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3"
                   style={{ scrollbarWidth: 'thin' }}>
                {chatMessages.map(m => (
                  <div key={m.id} className={`flex flex-col gap-0.5 ${m.name === '我' ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-[#3A648C]">{m.name}</span>
                      <span className="text-[9px] text-[#8A9BB0]">{m.time}</span>
                    </div>
                    <div className={`text-[12px] font-semibold px-3 py-2 rounded-2xl max-w-[85%] ${
                      m.name === '我'
                        ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white rounded-br-sm'
                        : 'bg-[#F5F8FA] text-[#2B3A52] rounded-bl-sm'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#E2EAF2]">
                <div className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    placeholder="輸入訊息…"
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F5F8FA] border border-[#E2EAF2]
                               text-[12px] font-semibold text-[#2B3A52] placeholder:text-[#8A9BB0]/60
                               outline-none focus:border-[#48A88B]/50 transition-all"
                  />
                  <button onClick={sendChat}
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                                     bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white
                                     hover:scale-105 active:scale-95 transition-all">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>{/* end MAIN ROW */}

        {/* ── BOTTOM BAR ── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-2.5
                        bg-white/95 backdrop-blur border-t border-[#E2EAF2] z-20">

          {/* left */}
          <div className="flex items-center gap-2 min-w-[120px]">
            <span className="text-[11px] font-bold text-[#8A9BB0]">📚 國語文閱讀理解</span>
          </div>

          {/* center controls */}
          <div className="flex items-center gap-2">
            <CtrlBtn active={!micOn}   danger={!micOn}   onClick={() => setMicOn(v => !v)}   title={micOn   ? '靜音'    : '取消靜音'}>
              {micOn   ? <Mic  size={18}/> : <MicOff  size={18}/>}
            </CtrlBtn>
            <CtrlBtn active={!videoOn} danger={!videoOn} onClick={() => setVideoOn(v => !v)} title={videoOn ? '關閉視訊' : '開啟視訊'}>
              {videoOn ? <Video size={18}/> : <VideoOff size={18}/>}
            </CtrlBtn>
            <CtrlBtn onClick={() => {}} title="分享螢幕">
              <MonitorUp size={18}/>
            </CtrlBtn>

            <div className="w-px h-7 bg-[#E2EAF2] mx-1" />

            <CtrlBtn active={showParticipants} onClick={() => setShowParticipants(v => !v)} title="參與者">
              <Users size={18}/>
            </CtrlBtn>
            <CtrlBtn active={showChat} onClick={() => setShowChat(v => !v)} title="聊天室">
              <MessageSquare size={18}/>
            </CtrlBtn>

            <div className="w-px h-7 bg-[#E2EAF2] mx-1" />

            <button onClick={() => setShowLeaveModal(true)}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center
                               bg-[#E74C3C] text-white hover:bg-[#D44235] hover:scale-105
                               active:scale-95 transition-all"
                    title="離開教室">
              <LogOut size={18}/>
            </button>
          </div>

          {/* right spacer */}
          <div className="min-w-[120px]" />
        </div>

      </div>{/* end OUTER WRAPPER */}

      {/* ── LEAVE MODAL ── */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[200] bg-[#3A648C]/40 backdrop-blur-sm
                        flex items-center justify-center"
             onClick={() => setShowLeaveModal(false)}>
          <div className="ocr-pop bg-white rounded-[28px] px-8 py-8 w-[90%] max-w-[360px]
                          shadow-[0_24px_80px_rgba(26,46,74,.28)] text-center"
               onClick={e => e.stopPropagation()}>
            <div className="text-[44px] mb-3">👋</div>
            <p className="text-[20px] font-black text-[#3A648C] mb-1.5">離開教室？</p>
            <p className="text-[13px] font-semibold text-[#8A9BB0] mb-6">確定要離開目前的課堂嗎？</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLeaveModal(false)}
                      className="flex-1 py-3 rounded-2xl border border-[#E2EAF2] bg-white
                                 text-[14px] font-black text-[#3A648C] hover:bg-[#F5F8FA] transition-all">
                繼續上課
              </button>
              <button onClick={onLeave}
                      className="flex-1 py-3 rounded-2xl bg-[#E74C3C] text-white
                                 text-[14px] font-black hover:bg-[#D44235] transition-all">
                離開教室
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Small internal components ────────────────────────────────────

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 bg-[#F5F8FA] px-3 py-1.5 rounded-xl">
      <span className="text-[12px] font-black text-[#3A648C]">{children}</span>
    </div>
  );
}

function Divider() {
  return <div className="w-8 h-px bg-[#E2EAF2] my-1" />;
}

function ToolBtn({
  children, label, active, danger, onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        active
          ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md'
          : danger
          ? 'text-[#8A9BB0] hover:bg-[#FFE8E8] hover:text-[#E74C3C]'
          : 'text-[#8A9BB0] hover:bg-[#F0F4F8] hover:text-[#3A648C]'
      }`}
    >
      {children}
      <span className="absolute left-11 bg-[#3A648C] text-white text-[10px] font-bold
                       px-2 py-0.5 rounded-md whitespace-nowrap pointer-events-none
                       opacity-0 group-hover:opacity-100 z-50 transition-opacity">
        {label}
      </span>
    </button>
  );
}

function HudBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick}
            className="w-6 h-6 rounded-md flex items-center justify-center
                       text-[#8A9BB0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all">
      {children}
    </button>
  );
}

function CtrlBtn({
  children, active, danger, onClick, title,
}: {
  children: React.ReactNode;
  active?: boolean;
  danger?: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all
                  hover:scale-105 active:scale-95 ${
        danger  ? 'bg-[#E74C3C] text-white' :
        active  ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white' :
                  'bg-[#F0F4F8] text-[#3A648C]'
      }`}
    >
      {children}
    </button>
  );
}