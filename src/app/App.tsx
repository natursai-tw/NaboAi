import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { HistoryPanel } from './components/HistoryPanel';
import { ChatArea } from './components/ChatArea';
import { QuickPanel } from './components/QuickPanel';
import { HomePage } from './components/HomePage';
import { CreativePage } from './components/CreativePage';
import { TextToImagePage } from './components/TextToImagePage';
import { ReportPage } from './components/ReportPage';
import { CoursePage } from './components/CoursePage';
import { OnlineCourseBrowse } from './components/OnlineCourseBrowse';
import { OnlineCourseLobby } from './components/OnlineCourseLobby';
import { OnlineCourseRoom } from './components/OnlineCourseRoom';
import { SettingsModal } from './components/SettingsModal';
import { ShopPage } from './components/ShopPage';
import { NotificationPage } from './components/NotificationPage';
import { TeacherAISharePage } from './components/TeacherAISharePage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    'home' | 'chat' | 'creative' | 'text-to-image' | 'image-to-image' |
    'report' | 'course' | 'online-browse' | 'online-lobby' | 'online-room' | 'shop' | 'notification' |
    'login' | 'register' | 'forgot-password' | 'teacher-share'
  >('home');
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scratchMode, setScratchMode] = useState(false);
  const [documentMode, setDocumentMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Resizable panel state — localStorage per mode
  const getStoredWidth = (mode: 'normal' | 'scratch' | 'document') => {
    const defaults = { normal: 170, scratch: 300, document: 460 };
    try {
      const stored = localStorage.getItem(`nabo_quickpanel_${mode}`);
      return stored ? parseInt(stored, 10) : defaults[mode];
    } catch {
      return defaults[mode];
    }
  };

  const saveStoredWidth = (mode: 'normal' | 'scratch' | 'document', width: number) => {
    try { localStorage.setItem(`nabo_quickpanel_${mode}`, String(width)); } catch {}
  };

  const [quickPanelWidth, setQuickPanelWidth] = useState(() => getStoredWidth('normal'));
  const [isResizingState, setIsResizingState] = useState(false);

  // Sync panel width with modes (load from localStorage per mode)
  useEffect(() => {
    if (documentMode) setQuickPanelWidth(getStoredWidth('document'));
    else if (scratchMode) setQuickPanelWidth(getStoredWidth('scratch'));
    else setQuickPanelWidth(getStoredWidth('normal'));
  }, [documentMode, scratchMode]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingState(true);
    const startX = e.clientX;
    const startWidth = quickPanelWidth;
    const currentMode = documentMode ? 'document' : scratchMode ? 'scratch' : 'normal';

    const handleMouseMove = (e: MouseEvent) => {
      const delta = startX - e.clientX;
      const newWidth = Math.max(140, Math.min(620, startWidth + delta));
      setQuickPanelWidth(newWidth);
      saveStoredWidth(currentMode, newWidth);
    };

    const handleMouseUp = () => {
      setIsResizingState(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleScratchMode = () => {
    setScratchMode(true);
    setCurrentPage('chat');
  };

  const handleCourseSelect = (mode: 'online' | 'video') => {
    setCurrentPage(mode === 'online' ? 'online-browse' : 'online-lobby');
  };

  // Sidebar activePage mapping
  const activePage =
    currentPage === 'text-to-image' || currentPage === 'image-to-image' ? 'creative'
    : currentPage === 'online-lobby' || currentPage === 'online-browse' ? 'course'
    : currentPage;

  // Layout class & inline grid-template-columns
  const historyWidth = scratchMode ? 220 : documentMode ? 200 : 260;
  const chatGridCols = isHistoryOpen
    ? `80px ${historyWidth}px 1fr 6px ${quickPanelWidth}px`
    : `80px 1fr 6px ${quickPanelWidth}px`;

  const layoutClass = isFullscreen
    ? 'relative z-[1] h-screen'
    : (['text-to-image', 'image-to-image', 'online-room', 'notification'] as string[]).includes(currentPage)
    ? 'relative z-[1] h-[calc(100vh-74px)]'
    : currentPage === 'home'
    ? 'relative z-[1] grid grid-cols-[80px_1fr_340px] h-[calc(100vh-74px)]'
    : currentPage === 'chat'
    ? 'relative z-[1] grid h-[calc(100vh-74px)]'
    : 'relative z-[1] grid grid-cols-[80px_1fr] h-[calc(100vh-74px)]';

  return (
    <>
      {/* Resize cursor overlay */}
      {isResizingState && (
        <div className="fixed inset-0 z-[9999] cursor-col-resize select-none" />
      )}
      <div className="min-h-screen relative overflow-hidden" style={{ fontFamily: 'Noto Sans TC, Nunito, sans-serif' }}>
        <style>{`
          body {
            background: linear-gradient(135deg, #C8F0EA 0%, #DCF0FF 40%, #EEF6FF 70%, #FFF8EE 100%);
            color: #2B3A52;
          }
          @keyframes blobFloat {
            0%, 100% { transform: translateY(0) scale(1); }
            50%       { transform: translateY(-24px) scale(1.04); }
          }
          .blob {
            position: fixed;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.25;
            pointer-events: none;
            z-index: 0;
          }
          .blob-1 { width: 400px; height: 400px; background: #48A88B; top: -100px; left: -100px; animation: blobFloat 8s ease-in-out infinite; }
          .blob-2 { width: 300px; height: 300px; background: #F3CC58; top: 40%; right: -80px; animation: blobFloat 10s ease-in-out infinite reverse; }
          .blob-3 { width: 250px; height: 250px; background: #3A648C; bottom: -60px; left: 30%; animation: blobFloat 12s ease-in-out infinite 2s; }
        `}</style>

        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        {!isFullscreen && (
          <TopNav
            onNotificationClick={() => setCurrentPage('notification')}
            logoOnly={['login', 'register', 'forgot-password'].includes(currentPage)}
          />
        )}

        {currentPage === 'login' ? (
          <LoginPage
            onLogin={() => setCurrentPage('home')}
            onGoRegister={() => setCurrentPage('register')}
            onForgotPassword={() => setCurrentPage('forgot-password')}
          />
        ) : currentPage === 'register' ? (
          <RegisterPage
            onRegister={() => setCurrentPage('home')}
            onGoLogin={() => setCurrentPage('login')}
          />
        ) : currentPage === 'forgot-password' ? (
          <ForgotPasswordPage
            onGoLogin={() => setCurrentPage('login')}
          />
        ) : (
        <div
          className={layoutClass}
          style={currentPage === 'chat' ? { gridTemplateColumns: chatGridCols } : undefined}
        >
          {currentPage === 'text-to-image' ? (
            <TextToImagePage onBack={() => setCurrentPage('creative')} />
          ) : currentPage === 'image-to-image' ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">🖼️</div>
                <div className="text-2xl font-bold text-[#1A2E4A] mb-2">圖生圖模式</div>
                <div className="text-[#7A8BA0] mb-4">即將推出...</div>
                <button
                  onClick={() => setCurrentPage('creative')}
                  className="px-6 py-3 bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white font-bold rounded-2xl hover:shadow-lg transition-all"
                >
                  返回選擇模式
                </button>
              </div>
            </div>
          ) : currentPage === 'notification' ? (
            <NotificationPage onBack={() => setCurrentPage('home')} />
          ) : currentPage === 'online-room' ? (
            <OnlineCourseRoom onLeave={() => setCurrentPage('online-lobby')} />
          ) : (
            <>
              <Sidebar
                activePage={activePage}
                onPageChange={setCurrentPage}
                onSettingsOpen={() => setSettingsOpen(true)}
              />

              {currentPage === 'home' ? (
                <HomePage
                  onNavigateToChat={() => setCurrentPage('chat')}
                  onNavigateToShop={() => setCurrentPage('shop')}
                />
              ) : currentPage === 'creative' ? (
                <CreativePage onModeSelect={(mode) => setCurrentPage(mode === 't2i' ? 'text-to-image' : 'image-to-image')} />
              ) : currentPage === 'report' ? (
                <ReportPage />
              ) : currentPage === 'course' ? (
                <CoursePage onCourseSelect={handleCourseSelect} />
              ) : currentPage === 'shop' ? (
                <ShopPage />
              ) : currentPage === 'teacher-share' ? (
                <TeacherAISharePage onBack={() => setCurrentPage('home')} />
              ) : currentPage === 'online-browse' ? (
                <OnlineCourseBrowse onBack={() => setCurrentPage('course')} onCourseSelect={() => {}} />
              ) : currentPage === 'online-lobby' ? (
                <OnlineCourseLobby onBack={() => setCurrentPage('course')} onJoinRoom={() => setCurrentPage('online-room')} />
              ) : (
                <>
                  {!isHistoryOpen && (
                    <button
                      onClick={() => setIsHistoryOpen(true)}
                      className="fixed left-[80px] top-1/2 -translate-y-1/2 w-8 h-16 bg-white/90 backdrop-blur-md rounded-r-xl border-[1.5px] border-[#48A88B]/30 border-l-0 shadow-[4px_0_16px_rgba(60,120,140,0.15)] flex items-center justify-center cursor-pointer transition-all hover:bg-white hover:w-10 hover:shadow-[4px_0_20px_rgba(60,120,140,0.25)] z-[100]"
                      title="展開歷史紀錄"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#3A648C]">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  )}
                  {isHistoryOpen && <HistoryPanel
                    isOpen={isHistoryOpen}
                    onToggle={() => setIsHistoryOpen(!isHistoryOpen)}
                    scratchMode={scratchMode}
                    onChatSelect={() => setScratchMode(false)}
                  />}
                  <ChatArea onSendMessage={() => {}} scratchMode={scratchMode} onExitScratch={() => setScratchMode(false)} />
                  {/* Resize Handle */}
                  <div
                    onMouseDown={handleResizeStart}
                    className="relative flex items-center justify-center cursor-col-resize group z-10 select-none"
                    style={{ width: 6 }}
                  >
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full transition-all duration-200"
                      style={{ background: isResizingState ? 'rgba(72,168,139,0.7)' : 'rgba(72,168,139,0.18)' }} />
                    {/* Drag dots indicator */}
                    <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {[0,1,2,3].map(i => (
                        <div key={i} className="w-[3px] h-[3px] rounded-full" style={{ background: 'rgba(72,168,139,0.8)' }} />
                      ))}
                    </div>
                  </div>
                  <QuickPanel
                    onScratchMode={handleScratchMode}
                    scratchMode={scratchMode}
                    onExitScratch={() => setScratchMode(false)}
                    onDocumentMode={(active) => setDocumentMode(active)}
                    documentMode={documentMode}
                    isFullscreen={isFullscreen}
                    onFullscreenChange={setIsFullscreen}
                  />
                </>
              )}
            </>
          )}
        </div>
        )}
      </div>
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} onLogout={() => setCurrentPage('login')} />}
    </>
  );
}