import { useState, useCallback } from 'react';
import { X, Plus, Download, Pencil, GripVertical } from 'lucide-react';

interface PartItem {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  imageUrl?: string;
}

interface Part {
  id: string;
  items: PartItem[];
}

function generateHTML(parts: Part[], title: string, emoji: string): string {
  const date = new Date().toLocaleString('zh-TW');
  const totalItems = parts.reduce((sum, p) => sum + p.items.length, 0);

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${new Date().toLocaleDateString()}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Microsoft JhengHei', 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #C8F0EA 0%, #DCF0FF 40%, #EEF6FF 70%, #FFF8EE 100%);
      min-height: 100vh;
      padding: 40px 20px;
      color: #2B3A52;
    }
    .container { max-width: 880px; margin: 0 auto; }
    .site-header {
      background: white;
      border-radius: 24px;
      padding: 30px 40px;
      margin-bottom: 28px;
      box-shadow: 0 8px 40px rgba(58,100,140,0.12);
      display: flex;
      align-items: center;
      gap: 22px;
    }
    .site-header-icon {
      width: 68px; height: 68px;
      background: linear-gradient(135deg, #48A88B, #3A648C);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 34px; flex-shrink: 0;
    }
    .site-header h1 { font-size: 26px; font-weight: 900; color: #3A648C; margin-bottom: 6px; }
    .site-header p { color: #7A8BA0; font-size: 13px; }
    .stats { display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
    .stat {
      background: linear-gradient(135deg, rgba(72,168,139,0.12), rgba(58,100,140,0.08));
      border: 1.5px solid rgba(72,168,139,0.25);
      border-radius: 10px;
      padding: 5px 14px;
      font-size: 12px; font-weight: 800;
      color: #3A648C;
    }
    .parts-grid { display: grid; gap: 22px; }
    .part {
      background: white;
      border-radius: 22px;
      overflow: hidden;
      box-shadow: 0 6px 28px rgba(58,100,140,0.10);
    }
    .part-header {
      background: linear-gradient(135deg, #3A648C 0%, #48A88B 100%);
      padding: 15px 26px;
      display: flex; align-items: center; gap: 12px;
    }
    .part-label {
      background: rgba(255,255,255,0.22);
      color: white;
      font-size: 11px; font-weight: 900;
      padding: 5px 14px;
      border-radius: 20px;
      letter-spacing: 0.12em;
    }
    .part-item-count {
      color: rgba(255,255,255,0.70);
      font-size: 12px;
      margin-left: auto;
    }
    .part-body { padding: 22px 26px; display: grid; gap: 18px; }
    .item-block { display: grid; gap: 10px; }
    .item-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: linear-gradient(135deg, rgba(72,168,139,0.14), rgba(58,100,140,0.08));
      border: 1.5px solid rgba(72,168,139,0.28);
      border-radius: 10px;
      padding: 4px 13px;
      font-size: 11px; font-weight: 800; color: #3A648C;
      width: fit-content;
    }
    .item-text {
      background: #F7FAFB;
      border-radius: 13px;
      padding: 16px 18px;
      font-size: 14px; line-height: 1.85;
      color: #2B3A52;
      border-left: 4px solid #48A88B;
    }
    .item-image {
      border-radius: 14px;
      max-width: 100%;
      box-shadow: 0 4px 18px rgba(0,0,0,0.08);
      display: block;
    }
    .item-divider {
      height: 1.5px;
      background: linear-gradient(to right, rgba(72,168,139,0.18), rgba(58,100,140,0.12), transparent);
    }
    .empty-part { color: #7A8BA0; font-size: 13px; text-align: center; padding: 16px; }
    .footer {
      background: white;
      border-radius: 20px;
      padding: 22px 40px;
      margin-top: 28px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(58,100,140,0.08);
      color: #7A8BA0; font-size: 13px;
    }
    .footer strong { color: #48A88B; }
  </style>
</head>
<body>
  <div class="container">
    <div class="site-header">
      <div class="site-header-icon">${emoji}</div>
      <div>
        <h1>${title}</h1>
        <p>匯出日期：${date}</p>
        <div class="stats">
          <div class="stat">🎬 ${parts.length} 個 Part</div>
          <div class="stat">✨ ${totalItems} 個內容</div>
        </div>
      </div>
    </div>

    <div class="parts-grid">
      ${parts.map((part, idx) => `
      <div class="part">
        <div class="part-header">
          <span class="part-label">PART ${idx + 1}</span>
          <span class="part-item-count">${part.items.length} 個內容</span>
        </div>
        <div class="part-body">
          ${part.items.length === 0
            ? '<p class="empty-part">（此 Part 尚無內容）</p>'
            : part.items.map((item, iIdx) => `
              ${iIdx > 0 ? '<div class="item-divider"></div>' : ''}
              <div class="item-block">
                <span class="item-badge">${item.type === 'image' ? '🖼️ 圖片' : item.type === 'video' ? '🎬 影片' : '📝 文字'}</span>
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="圖片內容" class="item-image" />` : ''}
                ${item.type !== 'image' && item.content ? `<div class="item-text">${item.content}</div>` : ''}
              </div>
            `).join('')}
        </div>
      </div>
      `).join('')}
    </div>

    <div class="footer">
      <p>✨ 由 <strong>Na-Bo 學習夥伴</strong> 生成 · 保留所有學習成果 ✨</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Sortable item inside a Part (native HTML5 drag) ───────────────────────────
function SortableItem({
  item,
  partId,
  index,
  onRemoveItem,
  onEditItem,
  onReorderItems,
  typeIcon,
}: {
  item: PartItem;
  partId: string;
  index: number;
  onRemoveItem: (partId: string, itemId: string) => void;
  onEditItem: (partId: string, itemId: string, content: string) => void;
  onReorderItems: (partId: string, from: number, to: number) => void;
  typeIcon: (type: string) => string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isOver, setIsOver] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation(); // Don't bubble to PartCard drop zone
    e.dataTransfer.setData(
      'application/nabo-part-item',
      JSON.stringify({ itemId: item.id, partId, index })
    );
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsOver(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!e.dataTransfer.types.includes('application/nabo-part-item')) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  };

  const handleDragLeave = () => setIsOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    const raw = e.dataTransfer.getData('application/nabo-part-item');
    if (!raw) return;
    try {
      const dragged = JSON.parse(raw);
      if (dragged.partId !== partId || dragged.index === index) return;
      onReorderItems(partId, dragged.index, index);
    } catch {}
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group relative flex items-start gap-1 rounded-[8px] px-1.5 py-1 border transition-all ${
        isDragging
          ? 'opacity-40 scale-[0.97] border-[#48A88B]/40 bg-[#A8E0D0]/20'
          : isOver
          ? 'border-[#48A88B] bg-[#A8E0D0]/25 scale-[1.01]'
          : 'border-[#48A88B]/15 bg-white/85'
      }`}
    >
      {/* Drag handle (visual only) */}
      <div
        className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-40 hover:!opacity-80 mt-0.5 transition-opacity"
        title="拖曳排序"
      >
        <GripVertical className="w-2.5 h-2.5 text-[#3A648C]" />
      </div>

      <span className="text-[10px] flex-shrink-0 mt-0.5">{typeIcon(item.type)}</span>
      <div className="flex-1 min-w-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="w-full h-[38px] object-cover rounded-[6px]"
          />
        ) : (
          <p className="text-[9px] text-[#2B3A52] line-clamp-2 leading-[1.4]">
            {item.content}
          </p>
        )}
      </div>

      {/* Edit button — only for text/video items */}
      {!item.imageUrl && (
        <button
          onClick={() => onEditItem(partId, item.id, item.content)}
          className="opacity-0 group-hover:opacity-100 absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#3A648C] rounded-full flex items-center justify-center transition-opacity z-10"
          title="編輯文字"
        >
          <Pencil className="w-2 h-2 text-white" />
        </button>
      )}
      <button
        onClick={() => onRemoveItem(partId, item.id)}
        className="opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center transition-opacity z-10"
      >
        <X className="w-2 h-2 text-white" />
      </button>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

// ── Part card with native HTML5 drop zone ─────────────────────────────────────
function PartCard({
  part,
  partIndex,
  onDrop,
  onRemoveItem,
  onRemovePart,
  onEditItem,
  onReorderItems,
}: {
  part: Part;
  partIndex: number;
  onDrop: (partId: string, item: PartItem) => void;
  onRemoveItem: (partId: string, itemId: string) => void;
  onRemovePart: (partId: string) => void;
  onEditItem: (partId: string, itemId: string, currentContent: string) => void;
  onReorderItems: (partId: string, from: number, to: number) => void;
}) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    // Only react to message drags (not part-item reorder drags)
    if (!e.dataTransfer.types.includes('application/nabo-message')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the drop zone entirely (not just entering a child)
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    const raw = e.dataTransfer.getData('application/nabo-message');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      onDrop(part.id, {
        id: `${Date.now()}-${Math.random()}`,
        type: data.messageType,
        content: data.content,
        imageUrl: data.imageUrl,
      });
    } catch {}
  };

  const typeIcon = (type: string) =>
    type === 'image' ? '🖼️' : type === 'video' ? '🎬' : '📝';

  return (
    <div className="relative">
      {/* Part header */}
      <div className="flex items-center justify-between px-2.5 py-[5px] bg-gradient-to-r from-[#3A648C] to-[#48A88B] rounded-t-[12px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-black text-white/80 tracking-widest">PART</span>
          <span className="bg-white/25 text-white text-[11px] font-black px-2 py-[1px] rounded-full">
            {partIndex + 1}
          </span>
        </div>
        <button
          onClick={() => onRemovePart(part.id)}
          className="w-[18px] h-[18px] rounded-full bg-white/15 hover:bg-white/35 flex items-center justify-center transition-all"
        >
          <X className="w-2.5 h-2.5 text-white" />
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-b-[12px] border-2 border-t-0 transition-all p-1.5 ${
          isOver
            ? 'border-[#48A88B] bg-[#A8E0D0]/30'
            : 'border-[#3A648C]/20 bg-white/50'
        }`}
      >
        {/* Transparent overlay when dragging — sits above SortableItems so drop
            events aren't swallowed by SortableItem's stopPropagation */}
        {isOver && (
          <div
            className="absolute inset-0 z-10 rounded-b-[12px]"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => { e.stopPropagation(); handleDrop(e); }}
          />
        )}
        {part.items.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center gap-0.5 py-3 transition-all ${
              isOver ? 'text-[#48A88B]' : 'text-[#7A8BA0]/50'
            }`}
          >
            <span className="text-[16px]">{isOver ? '✨' : '＋'}</span>
            <span className="text-[9px] font-black">
              {isOver ? '放開加入' : '拖曳訊息至此'}
            </span>
          </div>
        ) : (
          <div className="space-y-1">
            {part.items.map((item, idx) => (
              <SortableItem
                key={item.id}
                item={item}
                partId={part.id}
                index={idx}
                onRemoveItem={onRemoveItem}
                onEditItem={onEditItem}
                onReorderItems={onReorderItems}
                typeIcon={typeIcon}
              />
            ))}

            {/* Inline drop hint when has items */}
            {isOver && (
              <div className="flex items-center justify-center py-1 rounded-[8px] bg-[#48A88B]/10 border border-dashed border-[#48A88B]/40">
                <span className="text-[9px] font-black text-[#48A88B]">放開加入 ✨</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export function CreationPlanEditor() {
  const [parts, setParts] = useState<Part[]>([
    { id: 'part-1', items: [] },
    { id: 'part-2', items: [] },
  ]);
  const [title, setTitle] = useState('Na-Bo 創作影格');
  const [emoji] = useState('🎬');

  // ── Edit modal state ──────────────────────────────────────────
  const [editTarget, setEditTarget] = useState<{
    partId: string;
    itemId: string;
    content: string;
  } | null>(null);
  const [editDraft, setEditDraft] = useState('');

  const openEdit = (partId: string, itemId: string, currentContent: string) => {
    setEditTarget({ partId, itemId, content: currentContent });
    setEditDraft(currentContent);
  };

  const saveEdit = () => {
    if (!editTarget) return;
    setParts((prev) =>
      prev.map((p) =>
        p.id === editTarget.partId
          ? {
              ...p,
              items: p.items.map((i) =>
                i.id === editTarget.itemId ? { ...i, content: editDraft } : i
              ),
            }
          : p
      )
    );
    setEditTarget(null);
  };

  const cancelEdit = () => setEditTarget(null);
  // ─────────────────────────────────────────────────────────────

  // ── Reorder items within a Part ──────────────────────────────
  const reorderItems = useCallback((partId: string, from: number, to: number) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id !== partId) return p;
        const items = [...p.items];
        const [moved] = items.splice(from, 1);
        items.splice(to, 0, moved);
        return { ...p, items };
      })
    );
  }, []);
  // ─────────────────────────────────────────────────────────────

  const addPart = () => {
    setParts((prev) => [
      ...prev,
      { id: `part-${Date.now()}`, items: [] },
    ]);
  };

  const removePart = (partId: string) => {
    setParts((prev) => prev.filter((p) => p.id !== partId));
  };

  const handleDrop = useCallback((partId: string, item: PartItem) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === partId ? { ...p, items: [...p.items, item] } : p
      )
    );
  }, []);

  const removeItem = (partId: string, itemId: string) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === partId
          ? { ...p, items: p.items.filter((i) => i.id !== itemId) }
          : p
      )
    );
  };

  const hasContent = parts.some((p) => p.items.length > 0);

  const handleExport = async () => {
    const convertToBase64 = (url: string): Promise<string> =>
      new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          canvas.getContext('2d')!.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(url);
        img.src = url;
      });

    const exportParts = await Promise.all(
      parts.map(async (part) => ({
        ...part,
        items: await Promise.all(
          part.items.map(async (item) => ({
            ...item,
            imageUrl: item.imageUrl ? await convertToBase64(item.imageUrl) : undefined,
          }))
        ),
      }))
    );

    const html = generateHTML(exportParts, title, emoji);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_${new Date().toLocaleDateString().replace(/\//g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalItems = parts.reduce((sum, p) => sum + p.items.length, 0);

  return (
    <div className="bg-white/80 rounded-[18px] px-3.5 py-3 shadow-[0_4px_20px_rgba(60,120,140,0.10)] w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex-1 mr-2">
          <div className="flex flex-col gap-1.5 items-start">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-[11px] font-black text-[#7A8BA0] uppercase tracking-widest bg-transparent outline-none border-b border-transparent hover:border-[#48A88B]/30 focus:border-[#48A88B] w-[120px] transition-colors"
            />
            <span className="bg-[#48A88B]/15 text-[#48A88B] text-[9px] font-black px-1.5 py-[1px] rounded-full flex-shrink-0">
              {parts.length} Parts
            </span>
          </div>
        </div>
      </div>

      {/* Parts list */}
      <div className="flex-1 overflow-y-auto pr-0.5 pb-0.5 min-h-0">
        <style>{`
          .parts-scroll::-webkit-scrollbar { width: 4px; }
          .parts-scroll::-webkit-scrollbar-thumb { background: #A8E0D0; border-radius: 99px; }
        `}</style>
        <div className="parts-scroll space-y-2 w-full h-full pr-1">
          {parts.map((part, idx) => (
            <div key={part.id} className="w-full">
              <PartCard
                part={part}
                partIndex={idx}
                onDrop={handleDrop}
                onRemoveItem={removeItem}
                onRemovePart={removePart}
                onEditItem={openEdit}
                onReorderItems={reorderItems}
              />
              {/* Connector line between parts */}
              {idx < parts.length - 1 && (
                <div className="flex justify-center py-0.5 w-full">
                  <div className="w-[2px] h-[8px] bg-gradient-to-b from-[#48A88B]/40 to-[#3A648C]/20 rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Part button */}
      <button
        onClick={addPart}
        className="w-full mt-2 py-[7px] rounded-[12px] border-2 border-dashed border-[#48A88B]/35 text-[10px] font-black text-[#48A88B] hover:border-[#48A88B]/70 hover:bg-[#48A88B]/5 transition-all flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3 h-3" />
        新增 Part
      </button>

      {/* Status bar */}
      {totalItems > 0 && (
        <div className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-[#48A88B]/8 rounded-[8px]">
          <span className="text-[9px] font-black text-[#48A88B]">✨</span>
          <span className="text-[9px] font-semibold text-[#7A8BA0]">
            已收集 <span className="text-[#3A648C] font-black">{totalItems}</span> 個內容
          </span>
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={!hasContent}
        className={`w-full mt-2 py-2.5 rounded-[14px] text-[11px] font-black flex items-center justify-center gap-1.5 transition-all ${
          hasContent
            ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white hover:shadow-[0_6px_20px_rgba(72,168,139,0.4)] hover:translate-y-[-1px] cursor-pointer'
            : 'bg-[#E8EFF5] text-[#7A8BA0]/60 cursor-not-allowed'
        }`}
      >
        <Download className="w-3 h-3" />
        完成輸出 🚀
      </button>

      {/* ── Edit Text Modal ───────────────────────────────────── */}
      {editTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backdropFilter: 'blur(6px)', background: 'rgba(43,58,82,0.45)' }}
          onClick={cancelEdit}
        >
          <div
            className="relative bg-white/95 rounded-[20px] shadow-[0_16px_60px_rgba(58,100,140,0.28)] border border-[#48A88B]/20 w-[420px] max-w-[92vw] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-[#3A648C] to-[#48A88B] flex items-center justify-center flex-shrink-0">
                <Pencil className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[13px] font-black text-[#2B3A52]">編輯文字內容</span>
              <button
                onClick={cancelEdit}
                className="ml-auto w-6 h-6 rounded-full bg-[#F0F4F8] hover:bg-red-100 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-[#7A8BA0]" />
              </button>
            </div>

            <textarea
              autoFocus
              value={editDraft}
              onChange={(e) => setEditDraft(e.target.value)}
              rows={6}
              className="w-full rounded-[12px] border border-[#3A648C]/20 bg-[#F5F9FF] text-[12px] text-[#2B3A52] px-3 py-2.5 resize-none outline-none focus:border-[#48A88B] focus:ring-2 focus:ring-[#48A88B]/15 transition-all leading-relaxed"
              placeholder="在此輸入文字內容…"
            />

            <p className="text-[10px] text-[#7A8BA0] text-right mt-1 mb-3">
              {editDraft.length} 字
            </p>

            <div className="flex gap-2">
              <button
                onClick={cancelEdit}
                className="flex-1 py-2 rounded-[10px] border border-[#3A648C]/20 text-[11px] font-black text-[#7A8BA0] hover:bg-[#F0F4F8] transition-colors"
              >
                取消
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 py-2 rounded-[10px] bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-[11px] font-black text-white hover:shadow-[0_4px_16px_rgba(72,168,139,0.4)] hover:translate-y-[-1px] transition-all"
              >
                ✅ 儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}