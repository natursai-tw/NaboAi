import { useState } from 'react';
import coinImg from 'figma:asset/ad9a0be0aca0271395664bfaea4a3c16732d1663.png';

type TabId = 'energy' | 'costume' | 'warehouse';

interface ShopItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  emoji: string;
  badge?: string;
  badgeColor?: string;
  owned?: boolean;
  equipped?: boolean;
  tag?: string;
}

const ENERGY_ITEMS: ShopItem[] = [
  { id: 'e1', name: '能量補充包', desc: '立即恢復 50 點能量值', price: 80,  emoji: '⚡', badge: '熱賣', badgeColor: '#F3CC58', tag: '消耗品' },
  { id: 'e2', name: '超級能量罐', desc: '一次補滿全部能量值', price: 200, emoji: '🔋', badge: '推薦', badgeColor: '#48A88B', tag: '消耗品' },
  { id: 'e3', name: '雙倍經驗卡', desc: '1 小時內 XP 獲取 ×2', price: 150, emoji: '🌟', tag: '加成' },
  { id: 'e4', name: '三倍經驗卡', desc: '30 分鐘內 XP 獲取 ×3', price: 250, emoji: '✨', badge: '限定', badgeColor: '#E05C5C', tag: '加成' },
  { id: 'e5', name: '護盾卡', desc: '保護今日能量不消耗', price: 120, emoji: '🛡️', tag: '防護' },
  { id: 'e6', name: '學習加速器', desc: '課程進度加速 20%', price: 300, emoji: '🚀', badge: '新品', badgeColor: '#7B6CF6', tag: '加成' },
  { id: 'e7', name: '每日禮包', desc: '隨機獲得道具 ×3', price: 50,  emoji: '🎁', tag: '消耗品' },
  { id: 'e8', name: '幸運硬幣', desc: '答對題目額外獲得金幣', price: 180, emoji: '🪙', tag: '加成' },
];

const COSTUME_ITEMS: ShopItem[] = [
  { id: 'c1', name: '太空人裝', desc: '帥氣的太空探索套裝', price: 500,  emoji: '👨‍🚀', badge: '限定', badgeColor: '#E05C5C', tag: '全身' },
  { id: 'c2', name: '魔法師帽', desc: '神秘的星紋魔法帽', price: 280,  emoji: '🎩', tag: '頭飾' },
  { id: 'c3', name: '彩虹翅膀', desc: '背後裝飾七彩翅膀', price: 380,  emoji: '🌈', badge: '熱賣', badgeColor: '#F3CC58', tag: '背飾' },
  { id: 'c4', name: '海盜裝', desc: '勇敢的海上探險家套裝', price: 450, emoji: '🏴‍☠️', tag: '全身' },
  { id: 'c5', name: '忍者頭巾', desc: '帥酷的黑色忍者頭巾', price: 200, emoji: '🥷', tag: '頭飾' },
  { id: 'c6', name: '獨角獸角', desc: '閃亮亮的獨角獸裝飾', price: 320, emoji: '🦄', badge: '推薦', badgeColor: '#48A88B', tag: '頭飾' },
  { id: 'c7', name: '霸王龍裝', desc: '讓你變成恐龍！', price: 600,  emoji: '🦕', badge: '新品', badgeColor: '#7B6CF6', tag: '全身' },
  { id: 'c8', name: '貓耳髮箍', desc: '可愛貓咪耳朵髮箍', price: 160,  emoji: '🐱', tag: '頭飾' },
];

const WAREHOUSE_ITEMS: ShopItem[] = [
  { id: 'w1', name: '雙倍經驗卡', desc: '1 小時內 XP 獲取 ×2', price: 0, emoji: '🌟', owned: true, equipped: false, tag: '加成' },
  { id: 'w2', name: '彩虹翅膀',  desc: '背後裝飾七彩翅膀',   price: 0, emoji: '🌈', owned: true, equipped: true,  tag: '背飾' },
  { id: 'w3', name: '能量補充包', desc: '立即恢復 50 點能量值', price: 0, emoji: '⚡', owned: true, equipped: false, tag: '消耗品' },
  { id: 'w4', name: '護盾卡',    desc: '保護今日能量不消耗', price: 0, emoji: '🛡️', owned: true, equipped: false, tag: '防護' },
];

const TAGS: Record<TabId, string[]> = {
  energy:    ['全部', '消耗品', '加成', '防護'],
  costume:   ['全部', '全身', '頭飾', '背飾'],
  warehouse: ['全部', '加成', '背飾', '消耗品', '防護'],
};

export function ShopPage() {
  const [activeTab, setActiveTab] = useState<TabId>('energy');
  const [activeTag, setActiveTag] = useState('全部');
  const [bought, setBought] = useState<Set<string>>(new Set());
  const [equipped, setEquipped] = useState<Set<string>>(new Set(['w2']));
  const [coins, setCoins] = useState(1200);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleBuy = (item: ShopItem) => {
    if (bought.has(item.id)) return;
    if (coins < item.price) { showToast('金幣不足！', 'error'); return; }
    setCoins(c => c - item.price);
    setBought(prev => new Set([...prev, item.id]));
    showToast(`已購買「${item.name}」🎉`);
  };

  const handleEquip = (id: string) => {
    setEquipped(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const currentItems = activeTab === 'energy' ? ENERGY_ITEMS
    : activeTab === 'costume' ? COSTUME_ITEMS
    : WAREHOUSE_ITEMS;

  const filtered = activeTag === '全部'
    ? currentItems
    : currentItems.filter(i => i.tag === activeTag);

  const tabs: { id: TabId; label: string; emoji: string }[] = [
    { id: 'energy',    label: '能量商品', emoji: '⚡' },
    { id: 'costume',   label: '裝扮動作', emoji: '🎨' },
    { id: 'warehouse', label: '我的倉庫', emoji: '📦' },
  ];

  return (
    <div className="relative flex flex-col h-full overflow-hidden bg-transparent">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-[90px] left-1/2 -translate-x-1/2 z-[200] px-5 py-2.5 rounded-2xl shadow-xl text-white text-[13px] font-bold transition-all backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-[#48A88B] to-[#3A648C]'
              : 'bg-gradient-to-r from-[#E05C5C] to-[#C04040]'
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="px-8 pt-7 pb-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-[#1A2E4A]" style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.5px' }}>
            🛍️ Na-Bo 商店
          </h1>
          <p className="text-[#7A8BA0] text-[13px] mt-0.5">用金幣兌換道具與裝扮，讓學習更有趣！</p>
        </div>
        {/* Coin balance */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_4px_20px_rgba(58,100,140,0.12)]">
          <img src={coinImg} alt="金幣" className="w-[32px] h-[32px] object-contain" />
          <div>
            <div className="text-[11px] text-[#7A8BA0] font-bold leading-none">我的金幣</div>
            <div className="text-[#3A648C] text-[20px] font-black leading-tight">{coins.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 flex-shrink-0">
        <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-2xl p-1.5 w-fit shadow-[0_2px_12px_rgba(58,100,140,0.08)] border border-white/60">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setActiveTag('全部'); }}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-[13px] font-black transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-[#3A648C] to-[#48A88B] text-white shadow-[0_4px_12px_rgba(58,100,140,0.30)]'
                  : 'text-[#3A648C] hover:bg-white/70'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tag filter */}
      <div className="px-8 pt-3 pb-2 flex gap-2 flex-shrink-0">
        {TAGS[activeTab].map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3.5 py-1 rounded-full text-[12px] font-bold transition-all duration-150 ${
              activeTag === tag
                ? 'bg-[#48A88B] text-white shadow-sm'
                : 'bg-white/70 text-[#3A648C] border border-[#3A648C]/15 hover:bg-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-8 pb-8 pt-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#B0C4D4]">
            <div className="text-5xl mb-3">📭</div>
            <div className="font-bold text-[14px]">此分類尚無物品</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(item => (
              <ShopCard
                key={item.id}
                item={item}
                tab={activeTab}
                isBought={bought.has(item.id)}
                isEquipped={equipped.has(item.id)}
                onBuy={() => handleBuy(item)}
                onEquip={() => handleEquip(item.id)}
                coins={coins}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShopCard({
  item, tab, isBought, isEquipped, onBuy, onEquip, coins,
}: {
  item: ShopItem;
  tab: TabId;
  isBought: boolean;
  isEquipped: boolean;
  onBuy: () => void;
  onEquip: () => void;
  coins: number;
}) {
  const isWarehouse = tab === 'warehouse';
  const canAfford = coins >= item.price;
  const alreadyOwned = isWarehouse || isBought;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-200 hover:shadow-[0_8px_28px_rgba(58,100,140,0.18)] hover:-translate-y-0.5 group
        ${isEquipped ? 'border-[#48A88B]/60 shadow-[0_0_0_2px_rgba(72,168,139,0.25)]' : 'border-white/60 shadow-[0_4px_16px_rgba(58,100,140,0.09)]'}
        bg-white/75 backdrop-blur-md`}
    >
      {/* Badge */}
      {item.badge && !alreadyOwned && (
        <div
          className="absolute top-2.5 right-2.5 z-10 text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-sm"
          style={{ background: item.badgeColor ?? '#F3CC58', color: item.badgeColor === '#F3CC58' ? '#3A648C' : 'white' }}
        >
          {item.badge}
        </div>
      )}
      {isEquipped && (
        <div className="absolute top-2.5 right-2.5 z-10 text-[10px] font-black px-2 py-0.5 rounded-full bg-[#48A88B] text-white shadow-sm">
          使用中
        </div>
      )}

      {/* Emoji area */}
      <div className={`flex items-center justify-center pt-6 pb-4 text-[46px] transition-transform duration-200 group-hover:scale-110 ${alreadyOwned ? 'opacity-100' : canAfford ? 'opacity-100' : 'opacity-40'}`}>
        {item.emoji}
      </div>

      {/* Info */}
      <div className="px-3 pb-1 flex-1">
        <div className="text-[#1A2E4A] font-black text-[13px] leading-tight">{item.name}</div>
        <div className="text-[#7A8BA0] text-[11px] mt-0.5 leading-snug">{item.desc}</div>
      </div>

      {/* Tag pill */}
      {item.tag && (
        <div className="px-3 pb-2 mt-1">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF6FF] text-[#3A648C]">{item.tag}</span>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 pb-3 pt-1 flex items-center justify-between border-t border-[#E8F4F8]/60 mt-auto">
        {!isWarehouse ? (
          <>
            <div className="flex items-center gap-1">
              <span className="text-base">🪙</span>
              <span className={`font-black text-[14px] ${canAfford ? 'text-[#3A648C]' : 'text-[#C0B0A0]'}`}>{item.price}</span>
            </div>
            {alreadyOwned ? (
              <span className="text-[11px] font-black text-[#48A88B] bg-[#E8F8F2] px-3 py-1.5 rounded-xl">已擁有</span>
            ) : (
              <button
                onClick={onBuy}
                disabled={!canAfford}
                className={`text-[11px] font-black px-3 py-1.5 rounded-xl transition-all duration-150 ${
                  canAfford
                    ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white hover:shadow-[0_4px_12px_rgba(72,168,139,0.4)] hover:scale-105 active:scale-95'
                    : 'bg-[#E8EFF5] text-[#B0C4D4] cursor-not-allowed'
                }`}
              >
                購買
              </button>
            )}
          </>
        ) : (
          <div className="w-full flex justify-end">
            <button
              onClick={onEquip}
              className={`text-[11px] font-black px-3 py-1.5 rounded-xl transition-all duration-150 ${
                isEquipped
                  ? 'bg-[#E8F8F2] text-[#48A88B] hover:bg-[#D0F0E4]'
                  : 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white hover:shadow-[0_4px_12px_rgba(72,168,139,0.4)] hover:scale-105'
              }`}
            >
              {isEquipped ? '卸除' : '使用'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}