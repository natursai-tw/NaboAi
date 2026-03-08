import { useState, useRef, useEffect } from 'react';
import image_4ad71c793313beb6be7d12942b6b5e3c0720a62b from '../../assets/4ad71c793313beb6be7d12942b6b5e3c0720a62b.png'
import chatIcon from '../../assets/74d096f57a8b9dc1ea908311212b278bc0e36835.png';
import creativeIcon from '../../assets/b4cbf609c8e833093c5932700b1ddfad0ae7b369.png';
import reportIcon from '../../assets/67aa282455554d9e8f0bd60270b186303c8ed287.png';
import courseIcon from '../../assets/cc1c1bf9544c3438487602e4e3f94c91c63fce7c.png';
import settingSvg from '../../imports/setting.svg';
import shopBagSvg from '../../imports/shop-bag-1.svg';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: any) => void;
  onSettingsOpen: () => void;
}

type NavItemDef = {
  id: string;
  icon: string;
  tooltip: string;
  page?: string;
  isImage?: boolean;
  isSettings?: boolean;
};

const ALL_ITEMS: NavItemDef[] = [
  { id: 'home',     icon: image_4ad71c793313beb6be7d12942b6b5e3c0720a62b, tooltip: 'AI 夥伴',  page: 'home',     isImage: true },
  { id: 'chat',     icon: chatIcon,     tooltip: '聊天室',   page: 'chat',     isImage: true },
  { id: 'creative', icon: creativeIcon, tooltip: '創作工坊', page: 'creative', isImage: true },
  { id: 'report',   icon: reportIcon,   tooltip: '學習報告', page: 'report',   isImage: true },
  { id: 'course',   icon: courseIcon,   tooltip: '課程',     page: 'course',   isImage: true },
  { id: 'shop',     icon: shopBagSvg,   tooltip: '商店',     page: 'shop',     isImage: true },
  { id: 'settings', icon: settingSvg,   tooltip: '設定',     isImage: true, isSettings: true },
];

const ALL_IDS = ALL_ITEMS.map(i => i.id);
const STORAGE_KEY = 'sidebar-nav-order-v4';

function loadOrder(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as string[];
      if (Array.isArray(parsed)) {
        // 移除已不存在的 id；補入缺少的 id（依 ALL_ITEMS 順序附加到末尾）
        const cleaned = parsed.filter(id => ALL_IDS.includes(id));
        const missing = ALL_IDS.filter(id => !cleaned.includes(id));
        const result = [...cleaned, ...missing];
        if (result.length === ALL_IDS.length) return result;
      }
    }
  } catch {}
  return [...ALL_IDS];
}

export function Sidebar({ activePage, onPageChange, onSettingsOpen }: SidebarProps) {
  const [order, setOrder] = useState<string[]>(loadOrder);
  const [editMode, setEditMode] = useState(false);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragId = useRef<string | null>(null);

  // HMR 熱更新時 React 會保留舊 state，導致新增的 id 不出現
  // 這個 effect 在 mount 後立即補入任何缺少的項目
  useEffect(() => {
    const missing = ALL_IDS.filter(id => !order.includes(id));
    if (missing.length > 0) {
      setOrder(prev => {
        const cleaned = prev.filter(id => ALL_IDS.includes(id));
        return [...cleaned, ...missing];
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  }, [order]);

  const orderedItems = order
    .map(id => ALL_ITEMS.find(i => i.id === id))
    .filter(Boolean) as NavItemDef[];

  // 上方區塊 = 前 5 個；下方區塊 = 後 2 個
  const topItems    = orderedItems.slice(0, -2);
  const bottomItems = orderedItems.slice(-2);

  const handleDragStart = (id: string) => {
    dragId.current = id;
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragId.current && dragId.current !== id) setDragOverId(id);
  };

  const handleDrop = (targetId: string) => {
    if (!dragId.current || dragId.current === targetId) return;
    setOrder(prev => {
      const next = [...prev];
      const fromIdx = next.indexOf(dragId.current!);
      const toIdx   = next.indexOf(targetId);
      next.splice(fromIdx, 1);
      next.splice(toIdx, 0, dragId.current!);
      return next;
    });
    dragId.current = null;
    setDragOverId(null);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    dragId.current = null;
    setDragOverId(null);
    setDraggingId(null);
  };

  const renderItem = (item: NavItemDef) => {
    const isOver         = dragOverId === item.id;
    const isBeingDragged = draggingId === item.id;

    return (
      <div
        key={item.id}
        className={`relative ${editMode ? 'edit-wiggle' : ''}`}
        draggable={editMode}
        onDragStart={editMode ? () => handleDragStart(item.id) : undefined}
        onDragOver={editMode ? e => handleDragOver(e, item.id) : undefined}
        onDrop={editMode ? () => handleDrop(item.id) : undefined}
        onDragEnd={editMode ? handleDragEnd : undefined}
        style={{ cursor: editMode ? (draggingId ? 'grabbing' : 'grab') : 'default' }}
      >
        {/* 放置指示線 */}
        {editMode && isOver && (
          <div className="absolute -top-[6px] left-[6px] right-[6px] h-[3px] rounded-full bg-[#48A88B] z-20 shadow-[0_0_6px_rgba(72,168,139,0.7)]" />
        )}

        {/* 拖曳把手徽章 */}
        {editMode && !isBeingDragged && (
          <div className="absolute -right-[2px] -top-[2px] w-[14px] h-[14px] rounded-full bg-[#3A648C] flex flex-col items-center justify-center gap-[2px] z-10 pointer-events-none shadow-sm">
            <span className="w-[7px] h-[1.5px] rounded-full bg-white block" />
            <span className="w-[7px] h-[1.5px] rounded-full bg-white block" />
          </div>
        )}

        <NavIcon
          icon={item.icon}
          tooltip={editMode ? '' : item.tooltip}
          active={!editMode && (item.page ? activePage === item.page : false)}
          onClick={!editMode ? (item.page ? () => onPageChange(item.page) : item.isSettings ? onSettingsOpen : undefined) : undefined}
          isImage={item.isImage}
          faded={isBeingDragged}
          editMode={editMode}
        />
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes editWiggle {
          0%, 100% { transform: rotate(-2deg); }
          50%       { transform: rotate(2deg); }
        }
        .edit-wiggle {
          animation: editWiggle 0.35s ease-in-out infinite;
        }
      `}</style>

      <aside
        className={`relative h-full bg-white/65 backdrop-blur-sm border-r-[1.5px] flex flex-col items-center py-5 gap-2.5 transition-all duration-300 ${
          editMode ? 'border-[#48A88B]/60 bg-[#F0FAF6]/80' : 'border-[#48A88B]/20'
        }`}
        style={{ width: 80 }}
      >
        {/* Logo */}
        {/* 已移至 TopNav，此處移除 */}

        {/* 編輯 / 完成 按鈕 */}
        <button
          onClick={() => setEditMode(v => !v)}
          className={`w-[42px] text-[10px] font-black rounded-lg py-[4px] border transition-all duration-200 mb-1 select-none ${
            editMode
              ? 'bg-[#48A88B] text-white border-[#48A88B] shadow-[0_2px_8px_rgba(72,168,139,0.4)]'
              : 'bg-white/80 text-[#3A648C] border-[#3A648C]/20 hover:border-[#3A648C]/50 hover:bg-white'
          }`}
        >
          {editMode ? '完成' : '編輯'}
        </button>

        {/* 分隔線 */}
        <div className={`w-[30px] h-[1.5px] rounded-full mb-0.5 transition-colors duration-300 ${editMode ? 'bg-[#48A88B]/40' : 'bg-[#D8E8F0]'}`} />

        {/* 上方導覽項目 */}
        {topItems.map(renderItem)}

        {/* 彈性空白 */}
        <div className="flex-1" />

        {/* 下方分隔線 */}
        <div className={`w-[30px] h-[1.5px] rounded-full mb-0.5 transition-colors duration-300 ${editMode ? 'bg-[#48A88B]/40' : 'bg-[#D8E8F0]'}`} />

        {/* 下方 2 個項目 */}
        {bottomItems.map(renderItem)}
      </aside>
    </>
  );
}

function NavIcon({
  icon, tooltip, active, onClick, isImage, faded, editMode
}: {
  icon: string;
  tooltip: string;
  active?: boolean;
  onClick?: () => void;
  isImage?: boolean;
  faded?: boolean;
  editMode?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative w-[50px] h-[50px] rounded-[14px] flex items-center justify-center text-[22px] transition-all group/icon select-none
        ${active ? 'bg-white/50 shadow-[0_4px_16px_rgba(58,100,140,0.15)]' : ''}
        ${faded ? 'opacity-25 scale-90' : ''}
        ${editMode ? 'bg-white/30 ring-1 ring-[#48A88B]/30' : 'hover:scale-110'}
        ${onClick && !editMode ? 'cursor-pointer' : ''}
      `}
    >
      {isImage ? (
        <img src={icon} alt={tooltip} className="w-8 h-8 object-contain pointer-events-none" />
      ) : (
        <span className="pointer-events-none">{icon}</span>
      )}
      {tooltip && (
        <span className="absolute left-[60px] bg-[#3A648C] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/icon:opacity-100 z-50">
          {tooltip}
        </span>
      )}
    </div>
  );
}