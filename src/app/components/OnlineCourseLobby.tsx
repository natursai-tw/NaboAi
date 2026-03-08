import { useState } from 'react';
import { Search, Plus, Users, Clock, ChevronRight, ArrowLeft, X } from 'lucide-react';

interface Room {
  id: string;
  name: string;
  teacher: string;
  participants: number;
  maxParticipants: number;
  status: 'live' | 'waiting' | 'full';
  subject: string;
  emoji: string;
  startTime?: string;
}

const mockRooms: Room[] = [
  { id: '1', name: '國語文閱讀理解', teacher: '林老師', participants: 5, maxParticipants: 8, status: 'live', subject: '國語', emoji: '📖', startTime: '14:00' },
  { id: '2', name: '數學解題特訓班', teacher: '陳老師', participants: 3, maxParticipants: 6, status: 'live', subject: '數學', emoji: '🔢', startTime: '14:30' },
  { id: '3', name: '自然科學實驗課', teacher: '王老師', participants: 0, maxParticipants: 10, status: 'waiting', subject: '自然', emoji: '🔬', startTime: '15:00' },
  { id: '4', name: '英語口說練習', teacher: '李老師', participants: 4, maxParticipants: 4, status: 'full', subject: '英語', emoji: '🌍', startTime: '15:30' },
  { id: '5', name: '社會歷史探究', teacher: '張老師', participants: 2, maxParticipants: 8, status: 'waiting', subject: '社會', emoji: '🏛️', startTime: '16:00' },
  { id: '6', name: '美術創意繪畫', teacher: '黃老師', participants: 6, maxParticipants: 8, status: 'live', subject: '美術', emoji: '🎨', startTime: '14:00' },
];

interface OnlineCourseLobbyProps {
  onBack: () => void;
  onJoinRoom: (roomId: string) => void;
}

export function OnlineCourseLobby({ onBack, onJoinRoom }: OnlineCourseLobbyProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'waiting'>('all');

  const filteredRooms = mockRooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.teacher.includes(searchQuery) ||
      room.subject.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleRoomClick = (room: Room) => {
    if (room.status === 'full') return;
    setSelectedRoom(room);
    setShowJoinModal(true);
  };

  const handleJoinConfirm = () => {
    if (selectedRoom) {
      setShowJoinModal(false);
      onJoinRoom(selectedRoom.id);
    }
  };

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      setShowCreateModal(false);
      setNewRoomName('');
      onJoinRoom('new');
    }
  };

  const statusConfig = {
    live: { label: '上課中', bg: 'bg-[#48A88B]/15', text: 'text-[#48A88B]', dot: 'bg-[#48A88B]' },
    waiting: { label: '等待中', bg: 'bg-[#F3CC58]/15', text: 'text-[#B8960A]', dot: 'bg-[#F3CC58]' },
    full: { label: '已滿', bg: 'bg-[#E8EFF5]', text: 'text-[#7A8BA0]', dot: 'bg-[#7A8BA0]' },
  };

  return (
    <>
      <style>{`
        @keyframes lobbyFadeIn {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes lobbyCardIn {
          from { transform: translateY(24px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes lobbyPopIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .lobby-header { animation: lobbyFadeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .lobby-search { animation: lobbyFadeIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .lobby-card { animation: lobbyCardIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
        .lobby-modal { animation: lobbyPopIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <section className="flex flex-col h-full overflow-hidden px-8 py-6 gap-5 relative">
        {/* Header */}
        <div className="lobby-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-white/70 backdrop-blur-sm border-[1.5px] border-[#48A88B]/20 flex items-center justify-center text-[#3A648C] hover:bg-white hover:scale-105 transition-all cursor-pointer"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-1.5 bg-white/80 border-[1.5px] border-[#48A88B]/35 rounded-[16px] px-3 py-[3px] text-[11px] font-black text-[#48A88B]">
                  📹 線上教室
                </div>
              </div>
              <h1 className="text-[24px] font-black text-[#3A648C] tracking-tight mt-0.5">教室大廳</h1>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-[13px] font-black cursor-pointer border-none hover:scale-105 hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #48A88B, #3A648C)' }}
          >
            <Plus size={16} />
            建立教室
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="lobby-search flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7A8BA0]" />
            <input
              type="text"
              placeholder="搜尋教室名稱、老師或科目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border-[1.5px] border-[#48A88B]/15 text-[13px] font-semibold text-[#2B3A52] placeholder:text-[#7A8BA0]/60 outline-none focus:border-[#48A88B]/40 focus:shadow-[0_0_0_3px_rgba(72,168,139,0.1)] transition-all"
            />
          </div>
          <div className="flex gap-1.5 bg-white/60 backdrop-blur-sm rounded-2xl p-1 border-[1.5px] border-white/80">
            {(['all', 'live', 'waiting'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black cursor-pointer border-none transition-all ${
                  filterStatus === status
                    ? 'bg-white text-[#3A648C] shadow-sm'
                    : 'bg-transparent text-[#7A8BA0] hover:text-[#3A648C]'
                }`}
              >
                {status === 'all' ? '全部' : status === 'live' ? '🟢 上課中' : '🟡 等待中'}
              </button>
            ))}
          </div>
        </div>

        {/* Room count */}
        <div className="text-[12px] font-bold text-[#7A8BA0] px-1">
          找到 <span className="text-[#3A648C]">{filteredRooms.length}</span> 間教室
        </div>

        {/* Room Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-4 content-start pb-4 pr-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#48A88B33 transparent' }}>
          {filteredRooms.map((room, idx) => {
            const sc = statusConfig[room.status];
            return (
              <div
                key={room.id}
                className="lobby-card"
                style={{ animationDelay: `${0.15 + idx * 0.07}s` }}
              >
                <div
                  onClick={() => handleRoomClick(room)}
                  className={`group relative bg-white/80 backdrop-blur-xl rounded-[22px] border-[1.5px] border-white/90 shadow-[0_4px_20px_rgba(60,120,140,0.08)] p-5 flex flex-col gap-3 transition-all duration-300 ${
                    room.status === 'full'
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:translate-y-[-4px] hover:shadow-[0_12px_40px_rgba(60,120,140,0.15)] hover:border-[#48A88B]/30'
                  }`}
                >
                  {/* Top row: emoji + status */}
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[#E8F8F3] to-[#C8F0EA] flex items-center justify-center text-[22px]">
                      {room.emoji}
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black ${sc.bg} ${sc.text}`}>
                      <div className={`w-[6px] h-[6px] rounded-full ${sc.dot} ${room.status === 'live' ? 'animate-pulse' : ''}`}></div>
                      {sc.label}
                    </div>
                  </div>

                  {/* Room name */}
                  <div>
                    <div className="text-[15px] font-black text-[#1A2E4A] tracking-tight">{room.name}</div>
                    <div className="text-[11px] font-semibold text-[#7A8BA0] mt-0.5">{room.teacher}</div>
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#E8EFF5]">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[#7A8BA0]">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {room.participants}/{room.maxParticipants}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {room.startTime}
                      </span>
                    </div>
                    {room.status !== 'full' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#48A88B] to-[#3A648C] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Breadcrumb */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[11px] font-bold text-[#7A8BA0] bg-white/70 px-4 py-1.5 rounded-[20px] backdrop-blur-sm">
          <span>🏠 首頁</span>
          <span className="opacity-40">›</span>
          <span>📚 課程中心</span>
          <span className="opacity-40">›</span>
          <span>📹 線上教室</span>
          <span className="opacity-40">›</span>
          <span className="text-[#3A648C] font-black">教室大廳</span>
        </div>
      </section>

      {/* Join Room Modal */}
      {showJoinModal && selectedRoom && (
        <div className="fixed inset-0 z-[100] bg-[#3A648C]/45 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowJoinModal(false)}>
          <div className="lobby-modal relative bg-white rounded-[28px] px-8 py-8 max-w-[400px] w-[90%] shadow-[0_24px_80px_rgba(26,46,74,0.3)] text-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowJoinModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E8EFF5] flex items-center justify-center text-[#7A8BA0] hover:bg-[#DDE5ED] cursor-pointer border-none transition-colors">
              <X size={14} />
            </button>
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#E8F8F3] to-[#C8F0EA] flex items-center justify-center text-[32px] mx-auto mb-4">
              {selectedRoom.emoji}
            </div>
            <div className="text-[20px] font-black text-[#3A648C] mb-1">{selectedRoom.name}</div>
            <div className="text-[13px] font-semibold text-[#7A8BA0] mb-1">{selectedRoom.teacher}</div>
            <div className="flex items-center justify-center gap-4 text-[12px] font-bold text-[#7A8BA0] mb-5 mt-3">
              <span className="flex items-center gap-1"><Users size={13} /> {selectedRoom.participants}/{selectedRoom.maxParticipants} 人</span>
              <span className="flex items-center gap-1"><Clock size={13} /> {selectedRoom.startTime} 開始</span>
            </div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black mb-6 ${statusConfig[selectedRoom.status].bg} ${statusConfig[selectedRoom.status].text}`}>
              <div className={`w-[6px] h-[6px] rounded-full ${statusConfig[selectedRoom.status].dot} ${selectedRoom.status === 'live' ? 'animate-pulse' : ''}`}></div>
              {statusConfig[selectedRoom.status].label}
            </div>
            <button
              onClick={handleJoinConfirm}
              className="w-full py-[14px] rounded-2xl border-none text-[15px] font-black cursor-pointer tracking-wide text-white hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #48A88B, #3A648C)' }}
            >
              進入教室 🚀
            </button>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-[#3A648C]/45 backdrop-blur-sm flex items-center justify-center" onClick={() => setShowCreateModal(false)}>
          <div className="lobby-modal relative bg-white rounded-[28px] px-8 py-8 max-w-[400px] w-[90%] shadow-[0_24px_80px_rgba(26,46,74,0.3)]" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E8EFF5] flex items-center justify-center text-[#7A8BA0] hover:bg-[#DDE5ED] cursor-pointer border-none transition-colors">
              <X size={14} />
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-[18px] bg-gradient-to-br from-[#48A88B] to-[#3A648C] flex items-center justify-center text-[28px] mx-auto mb-3">
                ✨
              </div>
              <div className="text-[20px] font-black text-[#3A648C]">建立新教室</div>
              <div className="text-[12px] font-semibold text-[#7A8BA0] mt-1">為你的課程取一個名字吧！</div>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-black text-[#3A648C] mb-1.5 block">教室名稱</label>
              <input
                type="text"
                placeholder="例如：數學進階班"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F8FA] border-[1.5px] border-[#E8EFF5] text-[13px] font-semibold text-[#2B3A52] placeholder:text-[#7A8BA0]/50 outline-none focus:border-[#48A88B]/40 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="text-[11px] font-black text-[#3A648C] mb-1.5 block">科目標籤</label>
              <div className="flex gap-2 flex-wrap">
                {['📖 國語', '🔢 數學', '🌍 英語', '🔬 自然', '🏛️ 社會', '🎨 美術'].map((tag) => (
                  <button key={tag} className="px-3 py-1.5 rounded-xl bg-[#F5F8FA] border-[1.5px] border-[#E8EFF5] text-[11px] font-bold text-[#7A8BA0] hover:border-[#48A88B]/30 hover:text-[#3A648C] hover:bg-[#E8F8F3] cursor-pointer transition-all">
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCreateRoom}
              className={`w-full py-[14px] rounded-2xl border-none text-[15px] font-black cursor-pointer tracking-wide text-white transition-all ${
                newRoomName.trim() ? 'hover:scale-[1.02] active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
              }`}
              style={{ background: 'linear-gradient(135deg, #48A88B, #3A648C)' }}
              disabled={!newRoomName.trim()}
            >
              建立並進入 🚀
            </button>
          </div>
        </div>
      )}
    </>
  );
}