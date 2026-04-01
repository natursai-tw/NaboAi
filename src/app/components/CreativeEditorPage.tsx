import { useState, useRef, useCallback, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { registerCanvasHandler, unregisterCanvasHandler, registerTouchDropHandler, unregisterTouchDropHandler } from './creativeEditorBridge';
import html2canvas from 'html2canvas';

// ─── Types ───────────────────────────────────────────────────────────────────
type ItemType = 'chat-bot' | 'chat-user' | 'text-block' | 'image-block';

interface CanvasItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
  color?: string;
  imageUrl?: string;
  rotation?: number;
  aspectRatio?: number; // For image-block: original width/height ratio
  // Text editing properties
  fontSize?: number;
  textColor?: string;
  textColorAlpha?: number; // 0-1
  bgColor?: string;
  bgColorAlpha?: number; // 0-1
  borderRadius?: number;
}

// ─── Color helper functions ──────────────────────────────────────────────────
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function extractHexFromColor(color: string | undefined): string {
  if (!color || color === 'transparent') return '#ffffff';
  if (color.startsWith('#')) return color;
  // Extract from rgba(r, g, b, a)
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#ffffff';
}

function extractAlphaFromColor(color: string | undefined): number {
  if (!color) return 1;
  if (color === 'transparent') return 0;
  const match = color.match(/rgba?\([^,]+,[^,]+,[^,]+,?\s*([\d.]+)?\)/);
  return match && match[1] ? parseFloat(match[1]) : 1;
}

// ─── Touch distance helper ───────────────────────────────────────────────────
function getTouchDist(t1: Touch, t2: Touch) {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// ─── Universal Resize Handle (mouse + touch, bottom-right corner) ─────────────
function ResizeHandle({
  onResize,
  color = '#3A648C',
}: {
  onResize: (dw: number, dh: number) => void;
  color?: string;
}) {
  // ── Mouse ──
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    let lastX = e.clientX, lastY = e.clientY;
    const move = (ev: MouseEvent) => {
      const dw = ev.clientX - lastX;
      const dh = ev.clientY - lastY;
      lastX = ev.clientX;
      lastY = ev.clientY;
      onResize(dw, dh);
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  // ── Touch ──
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.touches.length !== 1) return;
    let lastX = e.touches[0].clientX, lastY = e.touches[0].clientY;
    const move = (ev: TouchEvent) => {
      ev.preventDefault();
      if (!ev.touches.length) return;
      const dw = ev.touches[0].clientX - lastX;
      const dh = ev.touches[0].clientY - lastY;
      lastX = ev.touches[0].clientX;
      lastY = ev.touches[0].clientY;
      onResize(dw, dh);
    };
    const end = () => {
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', end);
    };
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 5,
        background: color,
        border: '2.5px solid white',
        cursor: 'nwse-resize',
        zIndex: 300,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
        touchAction: 'none',
      }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1.5 6.5l5-5M4.5 6.5h2v-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Mock source data ────────────────────────────────────────────────────────
const MOCK_CHAT = [
  { id: 's1', type: 'chat-bot' as ItemType, content: '嗨！今天要一起完成數學任務嗎？🌟', label: 'Na-Bo 訊息' },
  { id: 's2', type: 'chat-user' as ItemType, content: '好的！我想學分數加減法。', label: '你的訊息' },
  { id: 's3', type: 'chat-bot' as ItemType, content: '分數加減法的關鍵是找公分母！\n例如：1/2 + 1/3 = 3/6 + 2/6 = 5/6 ✨', label: 'Na-Bo 說明' },
  { id: 's4', type: 'chat-user' as ItemType, content: '那 2/5 + 1/3 呢？', label: '你的提問' },
  { id: 's5', type: 'chat-bot' as ItemType, content: '2/5 + 1/3 = 6/15 + 5/15 = 11/15 🎉\n你學得很快！', label: 'Na-Bo 解答' },
];

const MOCK_IMAGES = [
  {
    id: 'img1',
    url: 'https://images.unsplash.com/photo-1727522974621-c64b5ea90c0b?w=300&q=80',
    label: '學習筆記',
  },
  {
    id: 'img2',
    url: 'https://images.unsplash.com/photo-1554103210-26d928978fb5?w=300&q=80',
    label: '便利貼牆',
  },
];

let nextId = 1;
const genId = () => `item-${Date.now()}-${nextId++}`;

// ─── Default canvas items ────────────────────────────────────────────────────
const DEFAULT_ITEMS: CanvasItem[] = [
  {
    id: 'default-1',
    type: 'sticky',
    x: 80,
    y: 60,
    w: 180,
    h: 160,
    content: '💡 小提示\n\n使用上方工具列新增便利貼或文字，或從對話中放入訊息。',
    color: '#FFF3CC',
    rotation: -2,
  },
  {
    id: 'default-2',
    type: 'text-block',
    x: 320,
    y: 80,
    w: 260,
    h: 60,
    content: '我的學習白板 📚',
  },
];

// ─── Canvas Item Components ──────────────────────────────────────────────────
function ChatBubbleItem({
  item,
  isSelected,
  onMouseDown,
  onTouchStart,
  onSelect,
  onDelete,
  onResize,
  onContentChange,
}: {
  item: CanvasItem;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onSelect: () => void;
  onDelete: () => void;
  onResize: (w: number, h: number) => void;
  onContentChange?: (content: string) => void;
}) {
  const isBot = item.type === 'chat-bot';
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: item.w, h: item.h || 80 });
  // Keep sizeRef in sync when item changes externally
  sizeRef.current = { w: item.w, h: item.h || (containerRef.current?.offsetHeight ?? 80) };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => { if (!isEditing) { onMouseDown(e); } }}
      onTouchStart={(e) => { if (!isEditing) { onTouchStart(e); } }}
      onDoubleClick={() => setIsEditing(true)}
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h > 0 ? item.h : undefined,
        overflow: item.h > 0 ? 'hidden' : undefined,
        userSelect: 'none',
        cursor: isEditing ? 'text' : 'grab',
        outline: 'none',
        borderRadius: 0,
        zIndex: isSelected ? 1000 : 1,
      }}
    >
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        style={{
          background: item.bgColor && item.bgColor !== 'transparent' ? item.bgColor : 'transparent',
          border: isSelected && !isEditing ? '2px solid #3A648C' : 'none',
          borderRadius: item.borderRadius ?? 0,
          padding: '10px 14px',
          fontSize: item.fontSize ?? 11,
          lineHeight: 1.7,
          color: item.textColor || '#2B3A52',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          height: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          cursor: isEditing ? 'text' : 'move',
        }}
      >
        {isEditing ? (
          <textarea
            value={item.content}
            onChange={(e) => onContentChange?.(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onBlur={() => setIsEditing(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsEditing(false);
                (e.target as HTMLTextAreaElement).blur();
              }
            }}
            autoFocus
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: item.fontSize ?? 11,
              lineHeight: 1.7,
              color: item.textColor || '#2B3A52',
              fontFamily: 'inherit',
              padding: 0,
            }}
          />
        ) : (
          item.content
        )}
      </div>
      {isSelected && !isEditing && (
        <div style={{
          position: 'absolute',
          bottom: -14,
          left: 0,
          fontSize: 9,
          color: '#A8C4D8',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>雙擊編輯</div>
      )}
      {isSelected && (
        <>
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#FF6B6B',
              border: '2px solid white',
              color: 'white',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
            }}
          >×</button>
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              e.preventDefault();
              let lastX = e.clientX, lastY = e.clientY;
              const move = (ev: MouseEvent) => {
                const dw = ev.clientX - lastX;
                const dh = ev.clientY - lastY;
                lastX = ev.clientX;
                lastY = ev.clientY;
                const curH = sizeRef.current.h || (containerRef.current?.offsetHeight ?? 80);
                const newW = Math.max(120, sizeRef.current.w + dw);
                const newH = Math.max(40, curH + dh);
                sizeRef.current = { w: newW, h: newH };
                onResize(newW, newH);
              };
              const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
              window.addEventListener('mousemove', move);
              window.addEventListener('mouseup', up);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (e.touches.length !== 1) return;
              let lastX = e.touches[0].clientX, lastY = e.touches[0].clientY;
              const move = (ev: TouchEvent) => {
                ev.preventDefault();
                if (!ev.touches.length) return;
                const dw = ev.touches[0].clientX - lastX;
                const dh = ev.touches[0].clientY - lastY;
                lastX = ev.touches[0].clientX;
                lastY = ev.touches[0].clientY;
                const curH = sizeRef.current.h || (containerRef.current?.offsetHeight ?? 80);
                const newW = Math.max(120, sizeRef.current.w + dw);
                const newH = Math.max(40, curH + dh);
                sizeRef.current = { w: newW, h: newH };
                onResize(newW, newH);
              };
              const end = () => { window.removeEventListener('touchmove', move); window.removeEventListener('touchend', end); };
              window.addEventListener('touchmove', move, { passive: false });
              window.addEventListener('touchend', end);
            }}
            style={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              width: 20,
              height: 20,
              borderRadius: 5,
              background: isBot ? '#48A88B' : '#3A648C',
              border: '2.5px solid white',
              cursor: 'nwse-resize',
              zIndex: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
              touchAction: 'none',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 6.5l5-5M4.5 6.5h2v-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

function TextBlockItem({
  item,
  isSelected,
  onMouseDown,
  onTouchStart,
  onSelect,
  onDelete,
  onContentChange,
  onResize,
}: {
  item: CanvasItem;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onSelect: () => void;
  onDelete: () => void;
  onContentChange: (content: string) => void;
  onResize: (w: number, h: number) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ w: item.w, h: item.h || 40 });
  sizeRef.current = { w: item.w, h: item.h || (containerRef.current?.offsetHeight ?? 40) };

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => {
        if (!isEditing) { onMouseDown(e); }
      }}
      onTouchStart={(e) => {
        if (!isEditing) { onTouchStart(e); }
      }}
      onDoubleClick={() => setIsEditing(true)}
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h > 0 ? item.h : undefined,
        overflow: item.h > 0 ? 'hidden' : undefined,
        userSelect: 'none',
        cursor: isEditing ? 'text' : 'grab',
        outline: isSelected ? '2px solid #3A648C' : 'none',
        borderRadius: item.borderRadius ?? 8,
        zIndex: isSelected ? 1000 : 1,
        background: item.bgColor || 'transparent',
      }}
    >
      <input
        value={item.content}
        onChange={(e) => onContentChange(e.target.value)}
        readOnly={!isEditing}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        onMouseDown={(e) => { if (isEditing) e.stopPropagation(); }}
        onTouchStart={(e) => { if (isEditing) e.stopPropagation(); }}
        onKeyDown={(e) => { if (e.key === 'Escape') { setIsEditing(false); (e.target as HTMLInputElement).blur(); } }}
        placeholder="在這裡輸入文字..."
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
          border: isEditing ? '1.5px solid #3A648C44' : 'none',
          outline: 'none',
          fontSize: item.fontSize ?? 16,
          fontWeight: 700,
          color: item.textColor || '#2B3A52',
          cursor: isEditing ? 'text' : 'grab',
          padding: isEditing ? '4px 6px' : '4px 0',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          borderRadius: item.borderRadius ?? 6,
          pointerEvents: isEditing ? 'auto' : 'none',
        }}
      />
      {isSelected && !isEditing && (
        <div style={{
          position: 'absolute',
          bottom: -14,
          left: 0,
          fontSize: 9,
          color: '#A8C4D8',
          fontWeight: 600,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>雙擊編輯</div>
      )}
      {isSelected && (
        <>
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#FF6B6B',
              border: '2px solid white',
              color: 'white',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
            }}
          >×</button>
          <ResizeHandle
            color="#3A648C"
            onResize={(dw, dh) => {
              const curH = sizeRef.current.h || (containerRef.current?.offsetHeight ?? 40);
              const newW = Math.max(80, sizeRef.current.w + dw);
              const newH = Math.max(28, curH + dh);
              sizeRef.current = { w: newW, h: newH };
              onResize(newW, newH);
            }}
          />
        </>
      )}
    </div>
  );
}

function ImageBlockItem({
  item,
  isSelected,
  onMouseDown,
  onTouchStart,
  onSelect,
  onDelete,
  onResize,
}: {
  item: CanvasItem;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onSelect: () => void;
  onDelete: () => void;
  onResize?: (w: number, h: number) => void;
}) {
  const sizeRef = useRef({ w: item.w, h: item.h });
  sizeRef.current = { w: item.w, h: item.h };
  
  // Use aspect ratio if available, otherwise default to current dimensions
  const aspectRatio = item.aspectRatio || (item.w / item.h);

  return (
    <div
      onMouseDown={(e) => { onMouseDown(e); }}
      onTouchStart={(e) => { onTouchStart(e); }}
      style={{
        position: 'absolute',
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
        userSelect: 'none',
        cursor: 'grab',
        outline: isSelected ? '2px solid #3A648C' : 'none',
        boxShadow: '2px 4px 16px rgba(0,0,0,0.12)',
        zIndex: isSelected ? 1000 : 1,
      }}
    >
      <ImageWithFallback
        src={item.imageUrl || ''}
        alt={item.content}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {isSelected && (
        <>
          <button
            onMouseDown={(e) => { e.stopPropagation(); onDelete(); }}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#FF6B6B',
              border: '2px solid white',
              color: 'white',
              fontSize: 12,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 200,
              boxShadow: '0 1px 6px rgba(0,0,0,0.18)',
            }}
          >×</button>
          <ResizeHandle
            color="#A855F7"
            onResize={(dw, dh) => {
              // Lock aspect ratio: use the larger dimension change
              const isWidthDominant = Math.abs(dw) > Math.abs(dh);
              
              let newW: number;
              let newH: number;
              
              if (isWidthDominant) {
                // Width is being dragged, calculate height from width
                newW = Math.max(80, sizeRef.current.w + dw);
                newH = Math.max(60, newW / aspectRatio);
              } else {
                // Height is being dragged, calculate width from height
                newH = Math.max(60, sizeRef.current.h + dh);
                newW = Math.max(80, newH * aspectRatio);
              }
              
              sizeRef.current = { w: newW, h: newH };
              onResize?.(newW, newH);
            }}
          />
        </>
      )}
    </div>
  );
}

// ─── Main CreativeEditorPage ─────────────────────────────────────────────────
export function CreativeEditorPage({ 
  isFullscreen: externalIsFullscreen, 
  onFullscreenChange 
}: { 
  isFullscreen?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
} = {}) {
  const [items, setItems] = useState<CanvasItem[]>(DEFAULT_ITEMS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [canvasRatio, setCanvasRatio] = useState<'1:1' | '3:4' | '16:9'>('3:4');
  const [canvasFlipped, setCanvasFlipped] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // Use external fullscreen state if provided, otherwise use local state
  const isFullscreen = externalIsFullscreen ?? false;
  const setIsFullscreen = onFullscreenChange ?? (() => {});

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const panning = useRef<{ startX: number; startY: number; origOffsetX: number; origOffsetY: number } | null>(null);

  // ── Touch refs ──
  const touchDragging = useRef<{ id: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const touchPanning = useRef<{ startX: number; startY: number; origOffsetX: number; origOffsetY: number } | null>(null);
  const pinchRef = useRef<{ dist: number; startZoom: number; midX: number; midY: number; origOffsetX: number; origOffsetY: number } | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { offsetRef.current = offset; }, [offset]);

  // ── Register bridge handlers ──
  useEffect(() => {
    registerCanvasHandler((payload) => {
      // For image blocks, load the image to get aspect ratio
      if (payload.type === 'image-block' && payload.imageUrl) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newItem: CanvasItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            type: payload.type,
            x: 60 + Math.random() * 200,
            y: 60 + Math.random() * 200,
            w: 200,
            h: 200 / aspectRatio,
            content: payload.content,
            imageUrl: payload.imageUrl,
            aspectRatio: aspectRatio,
          };
          setItems(prev => [...prev, newItem]);
          setSelectedId(newItem.id);
        };
        img.onerror = () => {
          // Fallback if image fails to load
          const newItem: CanvasItem = {
            id: `item-${Date.now()}-${Math.random()}`,
            type: payload.type,
            x: 60 + Math.random() * 200,
            y: 60 + Math.random() * 200,
            w: 200,
            h: 140,
            content: payload.content,
            imageUrl: payload.imageUrl,
          };
          setItems(prev => [...prev, newItem]);
          setSelectedId(newItem.id);
        };
        img.src = payload.imageUrl;
      } else {
        // Non-image items
        const newItem: CanvasItem = {
          id: `item-${Date.now()}-${Math.random()}`,
          type: payload.type,
          x: 60 + Math.random() * 200,
          y: 60 + Math.random() * 200,
          w: 240,
          h: 0,
          content: payload.content,
          imageUrl: payload.imageUrl,
        };
        setItems(prev => [...prev, newItem]);
        setSelectedId(newItem.id);
      }
    });

    // Touch drag drop handler — called by ChatArea when finger is released
    registerTouchDropHandler((clientX, clientY, payload) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      // Only handle if finger released inside the canvas bounds
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) return;
      // Account for canvas frame offset (20px) and zoom/pan
      const dropX = (clientX - rect.left - offsetRef.current.x) / zoomRef.current - 20;
      const dropY = (clientY - rect.top - offsetRef.current.y) / zoomRef.current - 20;
      
      // For image blocks, load the image to get aspect ratio
      if (payload.type === 'image-block' && payload.imageUrl) {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const defaultWidth = 220;
          const newItem: CanvasItem = {
            id: genId(),
            type: payload.type,
            x: dropX - defaultWidth / 2,
            y: dropY - (defaultWidth / aspectRatio) / 2,
            w: defaultWidth,
            h: defaultWidth / aspectRatio,
            content: payload.content,
            imageUrl: payload.imageUrl,
            aspectRatio: aspectRatio,
          };
          setItems(prev => [...prev, newItem]);
          setSelectedId(newItem.id);
          setIsDragOver(false);
        };
        img.onerror = () => {
          // Fallback if image fails to load
          const newItem: CanvasItem = {
            id: genId(),
            type: payload.type,
            x: dropX - 110,
            y: dropY - 75,
            w: 220,
            h: 150,
            content: payload.content,
            imageUrl: payload.imageUrl,
          };
          setItems(prev => [...prev, newItem]);
          setSelectedId(newItem.id);
          setIsDragOver(false);
        };
        img.src = payload.imageUrl;
      } else {
        // Non-image items
        const newItem: CanvasItem = {
          id: genId(),
          type: payload.type,
          x: dropX - 130,
          y: dropY - 40,
          w: 260,
          h: 0,
          content: payload.content,
          imageUrl: payload.imageUrl,
        };
        setItems(prev => [...prev, newItem]);
        setSelectedId(newItem.id);
        setIsDragOver(false);
      }
    });

    return () => {
      unregisterCanvasHandler();
      unregisterTouchDropHandler();
    };
  }, []);

  // ── Item drag start ──
  const handleItemMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedId(id); // Select when starting to drag
    const item = items.find(it => it.id === id);
    if (!item) return;
    dragging.current = { id, startX: e.clientX, startY: e.clientY, origX: item.x, origY: item.y };
  }, [items]);

  // ── Item touch start ──
  const handleItemTouchStart = useCallback((id: string, e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches.length !== 1) return;
    setSelectedId(id); // Select when starting to drag
    const touch = e.touches[0];
    const item = items.find(it => it.id === id);
    if (!item) return;
    touchDragging.current = { id, startX: touch.clientX, startY: touch.clientY, origX: item.x, origY: item.y };
    // Long press → context menu
    longPressTimer.current = setTimeout(() => {
      touchDragging.current = null;
      setContextMenu({ x: touch.clientX, y: touch.clientY, id });
    }, 600);
  }, [items]);

  // ── Canvas pan start ──
  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setSelectedId(null);
      panning.current = {
        startX: e.clientX,
        startY: e.clientY,
        origOffsetX: offset.x,
        origOffsetY: offset.y,
      };
    }
  }, [offset]);

  // ── Canvas touch start ──
  const handleCanvasTouchStart = useCallback((e: React.TouchEvent) => {
    setContextMenu(null);
    if (e.touches.length === 1) {
      setSelectedId(null);
      const touch = e.touches[0];
      touchPanning.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        origOffsetX: offsetRef.current.x,
        origOffsetY: offsetRef.current.y,
      };
    } else if (e.touches.length === 2) {
      touchPanning.current = null;
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      pinchRef.current = { dist, startZoom: zoomRef.current, midX, midY, origOffsetX: offsetRef.current.x, origOffsetY: offsetRef.current.y };
    }
  }, []);

  // ── Mouse move ──
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging.current) {
        const { id, startX, startY, origX, origY } = dragging.current;
        const dx = (e.clientX - startX) / zoom;
        const dy = (e.clientY - startY) / zoom;
        setItems(prev => prev.map(it =>
          it.id === id ? { ...it, x: origX + dx, y: origY + dy } : it
        ));
      } else if (panning.current) {
        const dx = e.clientX - panning.current.startX;
        const dy = e.clientY - panning.current.startY;
        setOffset({ x: panning.current.origOffsetX + dx, y: panning.current.origOffsetY + dy });
      }
    };
    const handleMouseUp = () => {
      dragging.current = null;
      panning.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom]);

  // ── Touch move / end (non-passive for preventDefault) ──
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }

      if (touchDragging.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const { id, startX, startY, origX, origY } = touchDragging.current;
        const dx = (touch.clientX - startX) / zoomRef.current;
        const dy = (touch.clientY - startY) / zoomRef.current;
        setItems(prev => prev.map(it => it.id === id ? { ...it, x: origX + dx, y: origY + dy } : it));
      } else if (touchPanning.current && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - touchPanning.current.startX;
        const dy = touch.clientY - touchPanning.current.startY;
        setOffset({ x: touchPanning.current.origOffsetX + dx, y: touchPanning.current.origOffsetY + dy });
      } else if (pinchRef.current && e.touches.length === 2) {
        const newDist = getTouchDist(e.touches[0], e.touches[1]);
        const scale = newDist / pinchRef.current.dist;
        const newZoom = Math.min(2, Math.max(0.3, pinchRef.current.startZoom * scale));
        setZoom(newZoom);
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const panDx = midX - pinchRef.current.midX;
        const panDy = midY - pinchRef.current.midY;
        setOffset(prev => ({ x: prev.x + panDx, y: prev.y + panDy }));
        pinchRef.current.midX = midX;
        pinchRef.current.midY = midY;
      }
    };
    const handleTouchEnd = () => {
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      touchDragging.current = null;
      touchPanning.current = null;
      pinchRef.current = null;
    };
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchcancel', handleTouchEnd);
    }
    return () => {
      if (canvas) {
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
      }
    };
  }, []);

  // ── Wheel zoom ──
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(2, Math.max(0.3, z * delta)));
  }, []);

  // ── Add from source ��─
  const addChatItem = (src: typeof MOCK_CHAT[0]) => {
    const newItem: CanvasItem = {
      id: genId(),
      type: src.type,
      x: 80 + Math.random() * 200,
      y: 80 + Math.random() * 200,
      w: 240,
      h: 0,
      content: src.content,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const addImageItem = (src: typeof MOCK_IMAGES[0]) => {
    const newItem: CanvasItem = {
      id: genId(),
      type: 'image-block',
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      w: 200,
      h: 140,
      content: src.label,
      imageUrl: src.url,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const addTextBlock = () => {
    const newItem: CanvasItem = {
      id: genId(),
      type: 'text-block',
      x: 150 + Math.random() * 300,
      y: 120 + Math.random() * 200,
      w: 280,
      h: 50,
      content: '標題文字',
      fontSize: 16,
      textColor: '#2B3A52',
      bgColor: 'transparent',
      borderRadius: 8,
    };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
    setSelectedId(null);
  };

  const duplicateItem = (id: string) => {
    const item = items.find(it => it.id === id);
    if (!item) return;
    const newItem: CanvasItem = { ...item, id: genId(), x: item.x + 24, y: item.y + 24 };
    setItems(prev => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const updateContent = (id: string, content: string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, content } : it));
  };

  const updateSize = (id: string, w: number, h: number) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, w, h } : it));
  };

  const updateTextProperty = (id: string, property: 'fontSize' | 'textColor' | 'bgColor' | 'borderRadius', value: number | string) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [property]: value } : it));
  };

  // ── Layer management ──
  const bringToFront = (id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.push(item);
      return next;
    });
  };
  const sendToBack = (id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.id === id);
      if (idx === -1 || idx === 0) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.unshift(item);
      return next;
    });
  };
  const bringForward = (id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.id === id);
      if (idx === -1 || idx === prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };
  const sendBackward = (id: string) => {
    setItems(prev => {
      const idx = prev.findIndex(it => it.id === id);
      if (idx === -1 || idx === 0) return prev;
      const next = [...prev];
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
      return next;
    });
  };

  const clearCanvas = () => {
    setItems([]);
    setSelectedId(null);
  };

  const handleDownload = async () => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    try {
      // Temporarily deselect to avoid selection border in export
      const previousSelectedId = selectedId;
      setSelectedId(null);

      // Wait for React to update
      await new Promise(resolve => setTimeout(resolve, 100));

      // Find the canvas surface element
      const canvasSurface = canvasElement.querySelector('[data-canvas-surface]') as HTMLElement;
      if (!canvasSurface) {
        alert('找不到白板內容');
        setSelectedId(previousSelectedId);
        return;
      }

      // Get the actual dimensions of the canvas surface
      const rect = canvasSurface.getBoundingClientRect();
      const width = parseInt(canvasSurface.style.width) || rect.width;
      const height = parseInt(canvasSurface.style.height) || rect.height;

      const canvas = await html2canvas(canvasSurface, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `nabo-whiteboard-${new Date().getTime()}.png`;
        link.click();
        URL.revokeObjectURL(url);
        
        // Restore selection
        setSelectedId(previousSelectedId);
      });
    } catch (error) {
      console.error('下載失敗:', error);
      alert('下載失敗，請重試');
      setSelectedId(null);
    }
  };

  // ── Drag-over / Drop from chat ──
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/nabo-message')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const raw = e.dataTransfer.getData('application/nabo-message');
    if (!raw || !canvasRef.current) return;
    const payload = JSON.parse(raw) as { content: string; messageType: 'text' | 'image'; imageUrl?: string };
    const rect = canvasRef.current.getBoundingClientRect();
    // Account for canvas frame offset (20px) and zoom/pan
    const dropX = (e.clientX - rect.left - offsetRef.current.x) / zoomRef.current - 20;
    const dropY = (e.clientY - rect.top - offsetRef.current.y) / zoomRef.current - 20;
    
    // For image blocks, load the image to get aspect ratio
    if (payload.messageType === 'image' && payload.imageUrl) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const defaultWidth = 220;
        const newItem: CanvasItem = {
          id: genId(),
          type: 'image-block',
          x: dropX - defaultWidth / 2,
          y: dropY - (defaultWidth / aspectRatio) / 2,
          w: defaultWidth,
          h: defaultWidth / aspectRatio,
          content: payload.content,
          imageUrl: payload.imageUrl,
          aspectRatio: aspectRatio,
        };
        setItems(prev => [...prev, newItem]);
        setSelectedId(newItem.id);
      };
      img.onerror = () => {
        // Fallback if image fails to load
        const newItem: CanvasItem = {
          id: genId(),
          type: 'image-block',
          x: dropX - 110,
          y: dropY - 75,
          w: 220,
          h: 150,
          content: payload.content,
          imageUrl: payload.imageUrl,
        };
        setItems(prev => [...prev, newItem]);
        setSelectedId(newItem.id);
      };
      img.src = payload.imageUrl;
    } else {
      // Non-image items
      const newItem: CanvasItem = {
        id: genId(),
        type: 'chat-bot',
        x: dropX - 130,
        y: dropY - 40,
        w: 260,
        h: 0,
        content: payload.content,
        imageUrl: payload.imageUrl,
      };
      setItems(prev => [...prev, newItem]);
      setSelectedId(newItem.id);
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      width: '100%', 
      height: '100%', 
      overflow: 'hidden', 
      background: '#F5F7FA',
      ...(isFullscreen ? {
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
      } : {}),
    }}>

      {/* ── Context Menu (long press) ── */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 999999,
            background: 'white',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(58,100,140,0.20)',
            padding: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 130,
            transform: 'translate(-50%, 8px)',
          }}
        >
          {[
            { label: '📋 複製物件', action: () => { duplicateItem(contextMenu.id); setContextMenu(null); } },
            { label: '⬆️ 移到最上層', action: () => { bringToFront(contextMenu.id); setContextMenu(null); } },
            { label: '⬇️ 移到最下層', action: () => { sendToBack(contextMenu.id); setContextMenu(null); } },
            { label: '🗑 刪除', action: () => { deleteItem(contextMenu.id); setContextMenu(null); }, danger: true },
          ].map(item => (
            <button
              key={item.label}
              onPointerDown={(e) => { e.stopPropagation(); item.action(); }}
              style={{
                background: item.danger ? 'rgba(224,85,85,0.07)' : 'transparent',
                border: 'none',
                borderRadius: 9,
                padding: '9px 14px',
                fontSize: 12,
                color: item.danger ? '#E05555' : '#2B3A52',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
              }}
            >{item.label}</button>
          ))}
          <button
            onPointerDown={(e) => { e.stopPropagation(); setContextMenu(null); }}
            style={{ background: 'rgba(58,100,140,0.06)', border: 'none', borderRadius: 9, padding: '7px 14px', fontSize: 11, color: '#8AACC8', cursor: 'pointer', textAlign: 'center', marginTop: 2 }}
          >取消</button>
        </div>
      )}
      {contextMenu && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999998 }} onPointerDown={() => setContextMenu(null)} />
      )}

      {/* ── Main Area ── */}
      <div style={{ 
        flex: 1, 
        minWidth: 0, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        height: '100%',
      }}>

        {/* Toolbar — compact icon-only */}
        <div style={{
          height: 36,
          flexShrink: 0,
          background: isFullscreen ? 'rgba(58,100,140,0.02)' : 'white',
          borderBottom: '1.5px solid rgba(58,100,140,0.10)',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          padding: '0 6px',
          overflow: 'hidden',
          position: 'relative',
          zIndex: 100,
        }}>
          <IconBtn title="文字" onClick={addTextBlock} color="#3A648C">
            <span style={{ fontWeight: 900, fontSize: 11 }}>T</span>
          </IconBtn>

          {/* Text editing controls — always visible */}
          {(() => {
            const item = selectedId ? items.find(it => it.id === selectedId) : null;
            const isTextSelected = item?.type === 'text-block' || item?.type === 'chat-bot' || item?.type === 'chat-user';
            
            return (
              <>
                <div style={{ width: 1, height: 18, background: 'rgba(58,100,140,0.12)', flexShrink: 0, marginLeft: 3 }} />
                
                {/* Font Size */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, opacity: isTextSelected ? 1 : 0.4 }}>
                  <span style={{ fontSize: 9, color: '#A8BDD0', whiteSpace: 'nowrap' }}>文字大小</span>
                  <input
                    type="range"
                    min="10"
                    max="48"
                    value={isTextSelected ? (item.fontSize ?? 16) : 16}
                    onChange={(e) => isTextSelected && selectedId && updateTextProperty(selectedId, 'fontSize', parseInt(e.target.value))}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!isTextSelected}
                    style={{
                      width: 60,
                      height: 3,
                      accentColor: '#3A648C',
                      cursor: isTextSelected ? 'pointer' : 'not-allowed',
                    }}
                  />
                  <span style={{ fontSize: 9, color: '#5A7A9A', width: 18 }}>{isTextSelected ? (item.fontSize ?? 16) : 16}</span>
                </div>
                
                {/* Text Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, opacity: isTextSelected ? 1 : 0.4 }}>
                  <span style={{ fontSize: 9, color: '#A8BDD0', whiteSpace: 'nowrap' }}>文字</span>
                  <input
                    type="color"
                    value={isTextSelected ? extractHexFromColor(item.textColor) : '#2B3A52'}
                    onChange={(e) => {
                      if (isTextSelected && selectedId) {
                        const alpha = item.textColorAlpha ?? extractAlphaFromColor(item.textColor) ?? 1;
                        updateTextProperty(selectedId, 'textColor', hexToRgba(e.target.value, alpha));
                        updateTextProperty(selectedId, 'textColorAlpha', alpha);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!isTextSelected}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 3,
                      border: '1.5px solid rgba(58,100,140,0.20)',
                      cursor: isTextSelected ? 'pointer' : 'not-allowed',
                      padding: 0,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isTextSelected ? ((item.textColorAlpha ?? extractAlphaFromColor(item.textColor) ?? 1) * 100) : 100}
                    onChange={(e) => {
                      if (isTextSelected && selectedId) {
                        const alpha = parseInt(e.target.value) / 100;
                        const hex = extractHexFromColor(item.textColor);
                        updateTextProperty(selectedId, 'textColor', hexToRgba(hex, alpha));
                        updateTextProperty(selectedId, 'textColorAlpha', alpha);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!isTextSelected}
                    title={`透明度: ${isTextSelected ? Math.round((item.textColorAlpha ?? extractAlphaFromColor(item.textColor) ?? 1) * 100) : 100}%`}
                    style={{
                      width: 40,
                      height: 3,
                      accentColor: '#3A648C',
                      cursor: isTextSelected ? 'pointer' : 'not-allowed',
                    }}
                  />
                </div>
                
                {/* Background Color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0, opacity: isTextSelected ? 1 : 0.4 }}>
                  <span style={{ fontSize: 9, color: '#A8BDD0', whiteSpace: 'nowrap' }}>背景</span>
                  <input
                    type="color"
                    value={isTextSelected ? extractHexFromColor(item.bgColor) : '#ffffff'}
                    onChange={(e) => {
                      if (isTextSelected && selectedId) {
                        const alpha = item.bgColorAlpha ?? extractAlphaFromColor(item.bgColor) ?? 1;
                        updateTextProperty(selectedId, 'bgColor', hexToRgba(e.target.value, alpha));
                        updateTextProperty(selectedId, 'bgColorAlpha', alpha);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!isTextSelected}
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 3,
                      border: '1.5px solid rgba(58,100,140,0.20)',
                      cursor: isTextSelected ? 'pointer' : 'not-allowed',
                      padding: 0,
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isTextSelected ? ((item.bgColorAlpha ?? extractAlphaFromColor(item.bgColor) ?? 1) * 100) : 100}
                    onChange={(e) => {
                      if (isTextSelected && selectedId) {
                        const alpha = parseInt(e.target.value) / 100;
                        const hex = extractHexFromColor(item.bgColor);
                        updateTextProperty(selectedId, 'bgColor', alpha === 0 ? 'transparent' : hexToRgba(hex, alpha));
                        updateTextProperty(selectedId, 'bgColorAlpha', alpha);
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!isTextSelected}
                    title={`透明度: ${isTextSelected ? Math.round((item.bgColorAlpha ?? extractAlphaFromColor(item.bgColor) ?? 1) * 100) : 100}%`}
                    style={{
                      width: 40,
                      height: 3,
                      accentColor: '#3A648C',
                      cursor: isTextSelected ? 'pointer' : 'not-allowed',
                    }}
                  />
                </div>
                
                {/* Border Radius */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, opacity: isTextSelected ? 1 : 0.4 }}>
                  <span style={{ fontSize: 9, color: '#A8BDD0', whiteSpace: 'nowrap' }}>圓角</span>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={isTextSelected ? (item.borderRadius ?? 8) : 8}
                    onChange={(e) => isTextSelected && selectedId && updateTextProperty(selectedId, 'borderRadius', parseInt(e.target.value))}
                    onMouseDown={(e) => e.stopPropagation()}
                    disabled={!isTextSelected}
                    style={{
                      width: 50,
                      height: 3,
                      accentColor: '#3A648C',
                      cursor: isTextSelected ? 'pointer' : 'not-allowed',
                    }}
                  />
                  <span style={{ fontSize: 9, color: '#5A7A9A', width: 14 }}>{isTextSelected ? (item.borderRadius ?? 8) : 8}</span>
                </div>
              </>
            );
          })()}

          <div style={{ flex: 1 }} />
          <IconBtn 
            title="下載白板為圖片" 
            onClick={handleDownload} 
            color="#48A88B"
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>⬇</span>
          </IconBtn>
          <IconBtn 
            title={isFullscreen ? "退出全屏" : "全屏顯示"} 
            onClick={() => setIsFullscreen(!isFullscreen)} 
            color="#3A648C"
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{isFullscreen ? '⤓' : '⤢'}</span>
          </IconBtn>
          <IconBtn title="清除白板" onClick={clearCanvas} color="#E05555">🗑</IconBtn>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onTouchStart={handleCanvasTouchStart}
          onWheel={handleWheel}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            flex: 1,
            overflow: 'hidden',
            cursor: panning.current ? 'grabbing' : 'default',
            position: 'relative',
            background: `radial-gradient(circle, rgba(58,100,140,0.12) 1px, transparent 1px)`,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${offset.x}px ${offset.y}px`,
            outline: isDragOver ? '3px dashed #A855F7' : 'none',
            transition: 'outline 0.15s',
          }}
        >
          {/* Drop overlay hint */}
          {isDragOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(168,85,247,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              pointerEvents: 'none',
            }}>
              <div style={{
                background: 'rgba(168,85,247,0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: 20,
                padding: '14px 28px',
                color: 'white',
                fontSize: 14,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="1.5" width="15" height="15" rx="3" stroke="white" strokeWidth="1.8"/><path d="M9 5v8M5 9h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
                放開以加入白板
              </div>
            </div>
          )}
          {/* Canvas surface */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transformOrigin: '0 0',
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            }}
          >
            {/* ── Ratio frame guide ── */}
            {(() => {
              const BASE = 480;
              const ratioMap: Record<string, [number, number]> = {
                '1:1':  [1, 1],
                '3:4':  [3, 4],
                '16:9': [16, 9],
              };
              const [rw, rh] = ratioMap[canvasRatio];
              const fw = canvasFlipped ? BASE * rh / rw : BASE;
              const fh = canvasFlipped ? BASE : BASE * rh / rw;
              return (
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    width: fw,
                    height: fh,
                    border: '2px dashed rgba(58,100,140,0.22)',
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.55)',
                    boxShadow: '0 2px 20px rgba(58,100,140,0.06)',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                >
                  {/* Inner container for export - no border/background */}
                  <div
                    data-canvas-surface
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: fw,
                      height: fh,
                      background: '#ffffff',
                      overflow: 'hidden',
                    }}
                  >
                    {/* corner label */}
                    <div style={{
                      position: 'absolute',
                      top: 8,
                      left: 10,
                      fontSize: 9,
                      fontWeight: 700,
                      color: 'rgba(58,100,140,0.35)',
                      letterSpacing: 0.5,
                      userSelect: 'none',
                      zIndex: 2,
                    }}>
                      {canvasFlipped
                        ? `${canvasRatio.split(':').reverse().join(':')}`
                        : canvasRatio}
                      {canvasFlipped ? ' ↕' : ''}
                    </div>

                    {/* Coordinate bridge — items are positioned relative to canvas surface */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: 0,
                      height: 0,
                      pointerEvents: 'auto',
                      zIndex: 1,
                    }}>
                    {items.map(item => {
                      const isSelected = item.id === selectedId;
                      const sharedProps = {
                        item,
                        isSelected,
                        onMouseDown: (e: React.MouseEvent) => handleItemMouseDown(item.id, e),
                        onTouchStart: (e: React.TouchEvent) => handleItemTouchStart(item.id, e),
                        onSelect: () => setSelectedId(item.id),
                        onDelete: () => deleteItem(item.id),
                        onResize: (w: number, h: number) => updateSize(item.id, w, h),
                      };

                      if (item.type === 'chat-bot' || item.type === 'chat-user') {
                        return (
                          <ChatBubbleItem
                            key={item.id}
                            {...sharedProps}
                            onContentChange={(c) => updateContent(item.id, c)}
                          />
                        );
                      }
                      if (item.type === 'text-block') {
                        return (
                          <TextBlockItem
                            key={item.id}
                            {...sharedProps}
                            onContentChange={(c) => updateContent(item.id, c)}
                          />
                        );
                      }
                      if (item.type === 'image-block') {
                        return <ImageBlockItem key={item.id} {...sharedProps} />;
                      }
                      return null;
                    })}

                    {/* Empty state hint */}
                    {items.length === 0 && (
                      <div style={{
                        position: 'absolute',
                        top: fh / 2,
                        left: fw / 2,
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        pointerEvents: 'none',
                      }}>
                        <div style={{ fontSize: 48, marginBottom: 12 }}>🎨</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#8AACC8' }}>白板是空的</div>
                        <div style={{ fontSize: 11, color: '#A8C4D8', marginTop: 4 }}>使用上方工具列新增文字方塊</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
            })()}
          </div>

          {/* ── Floating zoom pill — centered below selected item ── */}
          {(() => {
            const sel = selectedId ? items.find(it => it.id === selectedId) : null;
            // Account for canvas frame offset (20px) when calculating pill position
            const pillLeft = sel
              ? (sel.x + 20 + sel.w / 2) * zoom + offset.x
              : '50%';
            const pillTop = sel
              ? (sel.y + 20 + Math.max(sel.h || 72, 72)) * zoom + offset.y + 12
              : undefined;
            const pillBottom = sel ? undefined : 12;
            return (
              <div
                onMouseDown={e => e.stopPropagation()}
                onTouchStart={e => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 12,
                  transform: 'translateX(-50%)',
                  zIndex: 2000,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  background: 'rgba(255,255,255,0.96)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 20,
                  boxShadow: '0 4px 20px rgba(58,100,140,0.18), 0 1.5px 0 rgba(255,255,255,0.8) inset',
                  border: '1.5px solid rgba(58,100,140,0.14)',
                  padding: '3px 6px',
                  pointerEvents: 'auto',
                  userSelect: 'none',
                }}
              >
                <button
                  title="縮小"
                  onMouseDown={e => { e.stopPropagation(); setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2))); }}
                  onTouchEnd={e => { e.stopPropagation(); setZoom(z => Math.max(0.3, +(z - 0.1).toFixed(2))); }}
                  style={{ width: 26, height: 26, borderRadius: 10, border: '1px solid rgba(58,100,140,0.15)', background: 'rgba(58,100,140,0.07)', color: '#5A7A9A', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.12s', fontWeight: 700 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,100,140,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(58,100,140,0.07)'; }}
                >−</button>
                <span
                  style={{ fontSize: 10, fontWeight: 800, color: '#4A6A8A', minWidth: 34, textAlign: 'center', letterSpacing: 0.3, cursor: 'pointer' }}
                  title="重置縮放"
                  onMouseDown={e => { e.stopPropagation(); setZoom(1); setOffset({ x: 0, y: 0 }); }}
                  onTouchEnd={e => { e.stopPropagation(); setZoom(1); setOffset({ x: 0, y: 0 }); }}
                >
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  title="放大"
                  onMouseDown={e => { e.stopPropagation(); setZoom(z => Math.min(2, +(z + 0.1).toFixed(2))); }}
                  onTouchEnd={e => { e.stopPropagation(); setZoom(z => Math.min(2, +(z + 0.1).toFixed(2))); }}
                  style={{ width: 26, height: 26, borderRadius: 10, border: '1px solid rgba(58,100,140,0.15)', background: 'rgba(58,100,140,0.07)', color: '#5A7A9A', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.12s', fontWeight: 700 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,100,140,0.14)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(58,100,140,0.07)'; }}
                >+</button>
              </div>
            );
          })()}
        </div>

        {/* Status bar — with layer controls */}
        <div style={{
          height: 28,
          flexShrink: 0,
          background: 'white',
          borderTopWidth: 1,
          borderTopStyle: 'solid',
          borderTopColor: 'rgba(58,100,140,0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          gap: 6,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 100,
        }}>
          

          {/* Layer controls — only when an item is selected */}
          {selectedId && (() => {
            const idx = items.findIndex(it => it.id === selectedId);
            const isTop = idx === items.length - 1;
            const isBottom = idx === 0;
            const btnBase: React.CSSProperties = {
              height: 18,
              padding: '0 6px',
              borderRadius: 4,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'rgba(58,100,140,0.20)',
              background: 'rgba(58,100,140,0.06)',
              color: '#5A7A9A',
              fontSize: 9,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.12s',
            };
            const disabledStyle: React.CSSProperties = {
              ...btnBase,
              opacity: 0.35,
              cursor: 'default',
            };
            return (
              <>
                <div style={{ width: 1, height: 14, background: 'rgba(58,100,140,0.12)', flexShrink: 0 }} />
                <span style={{ fontSize: 9, color: '#A8BDD0', whiteSpace: 'nowrap' }}>
                  層級 {idx + 1}/{items.length}
                </span>
                <button
                  title="移到最上層"
                  onMouseDown={(e) => { e.stopPropagation(); bringToFront(selectedId); }}
                  style={isTop ? disabledStyle : btnBase}
                  disabled={isTop}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 7.5h7M4.5 5.5V1.5M2 4l2.5-2.5L7 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  最上層
                </button>
                <button
                  title="上移一層"
                  onMouseDown={(e) => { e.stopPropagation(); bringForward(selectedId); }}
                  style={isTop ? disabledStyle : btnBase}
                  disabled={isTop}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M2 5.5l2.5-2.5L7 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  上移
                </button>
                <button
                  title="下移一層"
                  onMouseDown={(e) => { e.stopPropagation(); sendBackward(selectedId); }}
                  style={isBottom ? disabledStyle : btnBase}
                  disabled={isBottom}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M2 3.5l2.5 2.5L7 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  下移
                </button>
                <button
                  title="移到最下層"
                  onMouseDown={(e) => { e.stopPropagation(); sendToBack(selectedId); }}
                  style={isBottom ? disabledStyle : btnBase}
                  disabled={isBottom}
                >
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                    <path d="M1 1.5h7M4.5 3.5v4M2 5l2.5 2.5L7 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  最��層
                </button>
              </>
            );
          })()}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Ratio controls on the right */}
          <div style={{ width: 1, height: 14, background: 'rgba(58,100,140,0.12)', flexShrink: 0 }} />
          {(['1:1', '3:4', '16:9'] as const).map(ratio => {
            const isActive = canvasRatio === ratio;
            return (
              <button
                key={ratio}
                onClick={() => setCanvasRatio(ratio)}
                title={`比例 ${ratio}`}
                style={{
                  height: 18,
                  padding: '0 6px',
                  borderRadius: 4,
                  border: `1.5px solid ${isActive ? '#3A648C' : 'rgba(58,100,140,0.18)'}`,
                  background: isActive ? '#3A648C' : 'transparent',
                  color: isActive ? 'white' : '#5A7A9A',
                  fontSize: 9,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  letterSpacing: 0.3,
                  transition: 'all 0.15s',
                }}
              >{ratio}</button>
            );
          })}
          <button
            onClick={() => setCanvasFlipped(f => !f)}
            title={canvasFlipped ? '已翻轉（點擊恢復）' : '翻轉方向'}
            style={{
              width: 20,
              height: 20,
              borderRadius: 5,
              border: `1.5px solid ${canvasFlipped ? '#48A88B' : 'rgba(58,100,140,0.18)'}`,
              background: canvasFlipped ? '#48A88B18' : 'transparent',
              color: canvasFlipped ? '#48A88B' : '#5A7A9A',
              fontSize: 11,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
              <path d="M2 6.5h9M8 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 3.5L2 6.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.45"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Icon-only toolbar button ─────────────────────────────────────────────────
function IconBtn({
  children,
  title,
  onClick,
  color,
}: {
  children: React.ReactNode;
  title: string;
  onClick: (e?: React.MouseEvent) => void;
  color: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      title={title}
      style={{
        width: 26,
        height: 26,
        flexShrink: 0,
        borderRadius: 7,
        border: `1px solid ${color}30`,
        background: `${color}10`,
        color,
        fontSize: 13,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = `${color}22`; e.currentTarget.style.transform = 'scale(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = `${color}10`; e.currentTarget.style.transform = 'scale(1)'; }}
    >
      {children}
    </button>
  );
}