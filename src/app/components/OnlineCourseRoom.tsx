import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Pencil, Eraser, Square, Circle, Type, Minus, MousePointer2,
  Mic, MicOff, Video, VideoOff, MonitorUp, MessageSquare, LogOut,
  ZoomIn, ZoomOut, Undo2, Redo2, Trash2, ChevronLeft, ChevronRight,
  Hand, Image as ImageIcon, Download
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

const mockParticipants: Participant[] = [
  { id: '1', name: '林老師', emoji: '👨‍🏫', isMuted: false, isVideoOn: true, isTeacher: true },
  { id: '2', name: '小明', emoji: '🧒', isMuted: true, isVideoOn: true },
  { id: '3', name: '小美', emoji: '👧', isMuted: false, isVideoOn: true },
  { id: '4', name: '小華', emoji: '👦', isMuted: true, isVideoOn: false },
  { id: '5', name: '小芳', emoji: '🧑', isMuted: false, isVideoOn: true },
];

const colors = ['#2B3A52', '#E74C3C', '#3498DB', '#48A88B', '#F3CC58', '#9B59B6', '#E67E22', '#1ABC9C'];
const strokeWidths = [2, 4, 6, 10];

export function OnlineCourseRoom({ onLeave }: OnlineCourseRoomProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>('pen');
  const [activeColor, setActiveColor] = useState('#2B3A52');
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showStrokeWidth, setShowStrokeWidth] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: '1', name: '林老師', text: '同學們好，今天我們來學習分數！', time: '14:02' },
    { id: '2', name: '小明', text: '老師好！', time: '14:02' },
    { id: '3', name: '小美', text: '準備好了 ✋', time: '14:03' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw grid
        ctx.strokeStyle = '#F0F4F8';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 30) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 30) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Drawing handlers
  const getPos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = useCallback((e: React.MouseEvent) => {
    if (activeTool === 'select' || activeTool === 'hand' || activeTool === 'text') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = activeTool === 'eraser' ? '#FFFFFF' : activeColor;
    ctx.lineWidth = activeTool === 'eraser' ? strokeWidth * 4 : strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [activeTool, activeColor, strokeWidth]);

  const draw = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [...prev, {
      id: String(Date.now()),
      name: '我',
      text: chatInput,
      time: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatInput('');
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#F0F4F8';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  };

  const tools: { id: Tool; icon: typeof Pencil; label: string }[] = [
    { id: 'select', icon: MousePointer2, label: '選取' },
    { id: 'pen', icon: Pencil, label: '畫筆' },
    { id: 'eraser', icon: Eraser, label: '橡皮擦' },
    { id: 'line', icon: Minus, label: '直線' },
    { id: 'rect', icon: Square, label: '矩形' },
    { id: 'circle', icon: Circle, label: '圓形' },
    { id: 'text', icon: Type, label: '文字' },
    { id: 'hand', icon: Hand, label: '移動' },
  ];

  return (
    <>
      <style>{`
        @keyframes roomSlideIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes chatSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .room-enter { animation: roomSlideIn 0.4s ease-out both; }
        .chat-enter { animation: chatSlideIn 0.3s ease-out both; }
        .lobby-modal { animation: lobbyPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes lobbyPopIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div className="room-enter flex flex-col h-[calc(100vh-74px)] bg-[#F0F4F8] relative overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-white/90 backdrop-blur-md border-b border-[#E8EFF5] z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#48A88B]/10 to-[#3A648C]/10 px-3 py-1.5 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-[#48A88B] animate-pulse"></div>
              <span className="text-[12px] font-black text-[#3A648C]">上課中</span>
            </div>
            <div className="text-[14px] font-black text-[#1A2E4A]">國語文閱讀理解</div>
            <div className="text-[11px] font-bold text-[#7A8BA0]">林老師</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#F5F8FA] px-3 py-1.5 rounded-xl">
              <span className="text-[11px] font-black text-[#7A8BA0]">⏱</span>
              <span className="text-[12px] font-black text-[#3A648C] tabular-nums">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F5F8FA] px-3 py-1.5 rounded-xl">
              <span className="text-[11px]">👥</span>
              <span className="text-[12px] font-black text-[#3A648C]">{mockParticipants.length}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Tool Panel */}
          <div className="w-[56px] bg-white/80 backdrop-blur-sm border-r border-[#E8EFF5] flex flex-col items-center py-3 gap-1">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => { setActiveTool(tool.id); setShowColorPicker(false); setShowStrokeWidth(false); }}
                  className={`group relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none transition-all ${
                    activeTool === tool.id
                      ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md'
                      : 'bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C]'
                  }`}
                  title={tool.label}
                >
                  <Icon size={17} />
                  <span className="absolute left-[48px] bg-[#3A648C] text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">
                    {tool.label}
                  </span>
                </button>
              );
            })}

            <div className="w-8 h-px bg-[#E8EFF5] my-1"></div>

            {/* Color picker trigger */}
            <button
              onClick={() => { setShowColorPicker(!showColorPicker); setShowStrokeWidth(false); }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent hover:bg-[#F0F4F8] transition-all group"
              title="顏色"
            >
              <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm" style={{ background: activeColor }}></div>
              <span className="absolute left-[48px] bg-[#3A648C] text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">顏色</span>
            </button>

            {/* Stroke width trigger */}
            <button
              onClick={() => { setShowStrokeWidth(!showStrokeWidth); setShowColorPicker(false); }}
              className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent hover:bg-[#F0F4F8] transition-all group"
              title="筆刷"
            >
              <div className="w-5 h-1 rounded-full" style={{ background: activeColor, height: Math.max(strokeWidth, 2) }}></div>
              <span className="absolute left-[48px] bg-[#3A648C] text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 z-50 transition-opacity">筆刷</span>
            </button>

            <div className="w-8 h-px bg-[#E8EFF5] my-1"></div>

            {/* Undo / Redo / Clear */}
            <button className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all" title="復原">
              <Undo2 size={16} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all" title="重做">
              <Redo2 size={16} />
            </button>
            <button onClick={clearCanvas} className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#FFE8E8] hover:text-[#E74C3C] transition-all" title="清除">
              <Trash2 size={16} />
            </button>

            <div className="flex-1"></div>

            {/* Image / Download */}
            <button className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all" title="插入圖片">
              <ImageIcon size={16} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all" title="下載">
              <Download size={16} />
            </button>
          </div>

          {/* Color Picker Popover */}
          {showColorPicker && (
            <div className="absolute left-[72px] top-[120px] z-50 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-3 border border-[#E8EFF5]">
              <div className="text-[10px] font-black text-[#7A8BA0] mb-2">選擇顏色</div>
              <div className="grid grid-cols-4 gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => { setActiveColor(c); setShowColorPicker(false); }}
                    className={`w-7 h-7 rounded-lg cursor-pointer border-2 transition-all hover:scale-110 ${
                      activeColor === c ? 'border-[#3A648C] scale-110' : 'border-transparent'
                    }`}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stroke Width Popover */}
          {showStrokeWidth && (
            <div className="absolute left-[72px] top-[170px] z-50 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] p-3 border border-[#E8EFF5]">
              <div className="text-[10px] font-black text-[#7A8BA0] mb-2">筆刷粗細</div>
              <div className="flex flex-col gap-2">
                {strokeWidths.map(w => (
                  <button
                    key={w}
                    onClick={() => { setStrokeWidth(w); setShowStrokeWidth(false); }}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-lg cursor-pointer border-none transition-all ${
                      strokeWidth === w ? 'bg-[#E8F8F3]' : 'bg-transparent hover:bg-[#F5F8FA]'
                    }`}
                  >
                    <div className="w-10 rounded-full" style={{ height: w, background: activeColor }}></div>
                    <span className="text-[10px] font-bold text-[#7A8BA0]">{w}px</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Center: Canvas */}
          <div className="flex-1 flex flex-col relative" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className={`flex-1 ${
                activeTool === 'pen' || activeTool === 'line' ? 'cursor-crosshair'
                  : activeTool === 'eraser' ? 'cursor-cell'
                  : activeTool === 'hand' ? 'cursor-grab'
                  : activeTool === 'text' ? 'cursor-text'
                  : 'cursor-default'
              }`}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />

            {/* Zoom Controls (bottom-left overlay) */}
            <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-2 py-1.5 shadow-sm border border-[#E8EFF5]">
              <button onClick={() => setZoom(z => Math.max(25, z - 25))} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all">
                <ZoomOut size={14} />
              </button>
              <span className="text-[11px] font-black text-[#3A648C] w-10 text-center tabular-nums">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] hover:text-[#3A648C] transition-all">
                <ZoomIn size={14} />
              </button>
            </div>

            {/* Page indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm border border-[#E8EFF5]">
              <button className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] transition-all">
                <ChevronLeft size={14} />
              </button>
              <span className="text-[11px] font-black text-[#3A648C]">1 / 1</span>
              <button className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none bg-transparent text-[#7A8BA0] hover:bg-[#F0F4F8] transition-all">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Right: Participants Panel */}
          {showParticipants && (
            <div className="w-[200px] bg-white/80 backdrop-blur-sm border-l border-[#E8EFF5] flex flex-col">
              <div className="px-3 py-3 border-b border-[#E8EFF5]">
                <div className="text-[12px] font-black text-[#3A648C]">參與者 ({mockParticipants.length})</div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2" style={{ scrollbarWidth: 'thin' }}>
                {mockParticipants.map(p => (
                  <div key={p.id} className="relative rounded-[14px] overflow-hidden">
                    {/* Video placeholder */}
                    <div className={`aspect-[4/3] rounded-[14px] flex flex-col items-center justify-center gap-1 ${
                      p.isTeacher
                        ? 'bg-gradient-to-br from-[#3A648C] to-[#2A4A6C]'
                        : p.isVideoOn
                        ? 'bg-gradient-to-br from-[#E8F8F3] to-[#C8F0EA]'
                        : 'bg-[#F0F4F8]'
                    }`}>
                      <span className="text-[28px]">{p.emoji}</span>
                      {!p.isVideoOn && (
                        <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#7A8BA0]">
                          <VideoOff size={10} /> 已關閉
                        </div>
                      )}
                    </div>
                    {/* Name bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-2 py-1 flex items-center justify-between rounded-b-[14px]">
                      <span className="text-[10px] font-bold text-white truncate">
                        {p.isTeacher && '👑 '}{p.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {p.isMuted ? (
                          <MicOff size={10} className="text-red-400" />
                        ) : (
                          <Mic size={10} className="text-[#48A88B]" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat Panel */}
          {showChat && (
            <div className="chat-enter w-[280px] bg-white/90 backdrop-blur-sm border-l border-[#E8EFF5] flex flex-col">
              <div className="px-4 py-3 border-b border-[#E8EFF5] flex items-center justify-between">
                <div className="text-[13px] font-black text-[#3A648C]">💬 聊天室</div>
                <button onClick={() => setShowChat(false)} className="w-6 h-6 rounded-md flex items-center justify-center cursor-pointer border-none bg-[#F0F4F8] text-[#7A8BA0] hover:text-[#3A648C] transition-all">
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5" style={{ scrollbarWidth: 'thin' }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col gap-0.5 ${msg.name === '我' ? 'items-end' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-[#3A648C]">{msg.name}</span>
                      <span className="text-[9px] text-[#7A8BA0]">{msg.time}</span>
                    </div>
                    <div className={`text-[12px] font-semibold px-3 py-2 rounded-2xl max-w-[85%] ${
                      msg.name === '我'
                        ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white rounded-br-md'
                        : 'bg-[#F5F8FA] text-[#2B3A52] rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#E8EFF5]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                    placeholder="輸入訊息..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#F5F8FA] border-[1.5px] border-[#E8EFF5] text-[12px] font-semibold text-[#2B3A52] placeholder:text-[#7A8BA0]/50 outline-none focus:border-[#48A88B]/40 transition-all"
                  />
                  <button
                    onClick={handleSendChat}
                    className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer border-none text-white transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #48A88B, #3A648C)' }}
                  >
                    ➜
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-white/90 backdrop-blur-md border-t border-[#E8EFF5] z-10">
          {/* Left: Room info */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#7A8BA0]">
            <span>📚 國語文閱讀理解</span>
          </div>

          {/* Center: Main controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-none transition-all hover:scale-105 ${
                isMicOn ? 'bg-[#F0F4F8] text-[#3A648C]' : 'bg-[#E74C3C] text-white'
              }`}
              title={isMicOn ? '靜音' : '取消靜音'}
            >
              {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-none transition-all hover:scale-105 ${
                isVideoOn ? 'bg-[#F0F4F8] text-[#3A648C]' : 'bg-[#E74C3C] text-white'
              }`}
              title={isVideoOn ? '關閉視訊' : '開啟視訊'}
            >
              {isVideoOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-none bg-[#F0F4F8] text-[#3A648C] transition-all hover:scale-105 hover:bg-[#E8F8F3]" title="分享螢幕">
              <MonitorUp size={18} />
            </button>
            <button
              onClick={() => { setShowChat(!showChat); }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-none transition-all hover:scale-105 ${
                showChat ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white' : 'bg-[#F0F4F8] text-[#3A648C]'
              }`}
              title="聊天室"
            >
              <MessageSquare size={18} />
            </button>
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-none transition-all hover:scale-105 text-[18px] ${
                showParticipants ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white' : 'bg-[#F0F4F8] text-[#3A648C]'
              }`}
              title="參與者"
            >
              👥
            </button>

            <div className="w-px h-7 bg-[#E8EFF5] mx-1"></div>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="w-11 h-11 rounded-2xl flex items-center justify-center cursor-pointer border-none bg-[#E74C3C] text-white transition-all hover:scale-105 hover:bg-[#D44235]"
              title="離開教室"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Right: spacer */}
          <div className="w-[120px]"></div>
        </div>
      </div>

      {/* Leave confirmation */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-[100] bg-[#3A648C]/45 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowLeaveModal(false)}>
          <div className="lobby-modal bg-white rounded-[28px] px-8 py-8 max-w-[360px] w-[90%] shadow-[0_24px_80px_rgba(26,46,74,0.3)] text-center" onClick={e => e.stopPropagation()}>
            <div className="text-[40px] mb-3">👋</div>
            <div className="text-[20px] font-black text-[#3A648C] mb-1.5">離開教室？</div>
            <div className="text-[13px] font-semibold text-[#7A8BA0] mb-6">確定要離開目前的課堂嗎？</div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="flex-1 py-3 rounded-2xl border-[1.5px] border-[#E8EFF5] bg-white text-[14px] font-black text-[#3A648C] cursor-pointer hover:bg-[#F5F8FA] transition-all"
              >
                繼續上課
              </button>
              <button
                onClick={onLeave}
                className="flex-1 py-3 rounded-2xl border-none bg-[#E74C3C] text-white text-[14px] font-black cursor-pointer hover:bg-[#D44235] transition-all"
              >
                離開教室
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}