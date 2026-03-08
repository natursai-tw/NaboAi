import mascotImg from 'figma:asset/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';

interface Notification {
  id: number;
  title: string;
  body: string;
  time: string;
  type: 'alert' | 'reward' | 'system' | 'social';
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: '太久沒上線了吧！！',
    body: '再不上線bo要開始罷工了，nabo公會理事長阿麗表示，近期出現動亂情形...',
    time: '16:15',
    type: 'alert',
    read: false,
  },
  {
    id: 2,
    title: '🎉 學習連續達成 7 天！',
    body: '太厲害了！你已連續學習 7 天，獲得「毅力勳章」與 200 點獎勵點數！',
    time: '10:30',
    type: 'reward',
    read: false,
  },
  {
    id: 3,
    title: '📚 新課程上架通知',
    body: '你追蹤的「Python 入門實戰」已更新第 8 章，快去看看吧！',
    time: '昨天 09:00',
    type: 'system',
    read: true,
  },
  {
    id: 4,
    title: '👋 Bo 有話對你說',
    body: '嘿！最近學習報告顯示你在「閱讀理解」方面進步很多，Bo 為你感到驕傲！',
    time: '昨天 21:05',
    type: 'social',
    read: true,
  },
  {
    id: 5,
    title: '🏆 排行榜週榜更新',
    body: '本週你在好友排行榜中排名第 3！距離第 2 名只差 50 點，加油！',
    time: '2 天前',
    type: 'reward',
    read: true,
  },
];

const TYPE_CONFIG = {
  alert: { emoji: '⚠️', color: '#E06060', bg: 'bg-red-50', border: 'border-red-100' },
  reward: { emoji: '🏆', color: '#F3CC58', bg: 'bg-yellow-50', border: 'border-yellow-100' },
  system: { emoji: '📢', color: '#3A648C', bg: 'bg-blue-50', border: 'border-blue-100' },
  social: { emoji: '💬', color: '#48A88B', bg: 'bg-emerald-50', border: 'border-emerald-100' },
};

interface NotificationPageProps {
  onBack: () => void;
}

export function NotificationPage({ onBack }: NotificationPageProps) {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/90 shadow-[0_2px_12px_rgba(58,100,140,0.15)] flex items-center justify-center hover:scale-110 hover:shadow-[0_4px_18px_rgba(58,100,140,0.25)] transition-all flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3A648C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
        <div>
          <h1 className="text-[22px] font-black text-[#2B3A52] tracking-tight">
            我的 / 最新消息
          </h1>
          {unreadCount > 0 && (
            <p className="text-[12px] text-[#7A8BA0] mt-0.5">
              你有 <span className="font-black text-[#48A88B]">{unreadCount}</span> 則未讀通知
            </p>
          )}
        </div>

        {/* Mascot decoration */}
        <div className="ml-auto flex-shrink-0 opacity-80">
          <img src={mascotImg} alt="Na-Bo" className="w-[48px] h-[48px] object-contain" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-[1.5px] bg-gradient-to-r from-[#48A88B]/30 via-[#3A648C]/15 to-transparent rounded-full mb-6" />

      {/* Unread section */}
      {MOCK_NOTIFICATIONS.some((n) => !n.read) && (
        <div className="mb-6">
          <p className="text-[11px] font-black text-[#7A8BA0] uppercase tracking-widest mb-3 px-1">
            未讀
          </p>
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.filter((n) => !n.read).map((notif) => (
              <NotifCard key={notif.id} notif={notif} />
            ))}
          </div>
        </div>
      )}

      {/* Read section */}
      {MOCK_NOTIFICATIONS.some((n) => n.read) && (
        <div>
          <p className="text-[11px] font-black text-[#7A8BA0] uppercase tracking-widest mb-3 px-1">
            已讀
          </p>
          <div className="space-y-3">
            {MOCK_NOTIFICATIONS.filter((n) => n.read).map((notif) => (
              <NotifCard key={notif.id} notif={notif} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {MOCK_NOTIFICATIONS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="text-6xl opacity-40">🔔</div>
          <p className="text-[16px] font-bold text-[#7A8BA0]">目前沒有通知</p>
          <p className="text-[13px] text-[#7A8BA0]/60">有新消息時會在這裡通知你！</p>
        </div>
      )}
    </div>
  );
}

function NotifCard({ notif }: { notif: Notification }) {
  const cfg = TYPE_CONFIG[notif.type];

  return (
    <div
      className={`relative bg-white/90 rounded-[18px] shadow-[0_4px_20px_rgba(58,100,140,0.08)] border border-[#E8EFF8] px-5 py-4 flex gap-4 items-start transition-all hover:shadow-[0_6px_28px_rgba(58,100,140,0.14)] hover:translate-y-[-1px] cursor-pointer ${
        !notif.read ? 'ring-1 ring-[#48A88B]/25' : 'opacity-75'
      }`}
    >
      {/* Unread dot */}
      {!notif.read && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#48A88B]" />
      )}

      {/* Icon */}
      <div
        className={`w-[44px] h-[44px] rounded-[14px] flex items-center justify-center flex-shrink-0 text-[22px] ${cfg.bg} border ${cfg.border}`}
      >
        {cfg.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-[15px] mb-1 leading-snug ${
            notif.read ? 'font-semibold text-[#4A5A6A]' : 'font-black text-[#2B3A52]'
          }`}
        >
          {notif.title}
        </p>
        <p className="text-[13px] text-[#7A8BA0] leading-relaxed line-clamp-2">
          {notif.body}
        </p>
        <p className="text-[11px] text-[#A0B0C0] mt-2 font-semibold">
          {notif.time}
        </p>
      </div>
    </div>
  );
}
