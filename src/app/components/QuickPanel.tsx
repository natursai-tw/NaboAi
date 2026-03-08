import { CreativeHub } from './CreativeHub';
import { SubPageHeader } from './SubPageHeader';

interface QuickPanelProps {
  onScratchMode: () => void;
  scratchMode?: boolean;
  onExitScratch?: () => void;
  onDocumentMode?: (active: boolean) => void;
  documentMode?: boolean;
}

export function QuickPanel({ onScratchMode, scratchMode, onExitScratch, onDocumentMode }: QuickPanelProps) {
  return (
    <aside className="p-0 overflow-y-auto w-full h-full">
      <style>{`.quick-panel::-webkit-scrollbar { display: none; }`}</style>
      <div className="quick-panel w-full h-full">
        {scratchMode ? (
          <div className="p-3 h-full flex flex-col gap-3">
            {/* 標題列 */}
            <SubPageHeader
              icon={
                <div
                  className="w-5 h-5 rounded-lg flex items-center justify-center text-xs"
                  style={{ background: '#4C97FF', boxShadow: '0 3px 8px rgba(76,151,255,0.35)' }}
                >🖥️</div>
              }
              title="積木排列區"
              subtitle="程式模擬顯示"
              accent="#4C97FF"
              bg="rgba(76,151,255,0.08)"
              onBack={onExitScratch}
              backLabel="離開"
            />

            {/* 深色積木畫布 */}
            <div className="flex-1 rounded-2xl overflow-hidden relative flex items-center justify-center"
                 style={{ background: 'linear-gradient(160deg,#1e2d3d 0%,#162030 100%)', border: '2px solid rgba(76,151,255,0.2)' }}>
              {/* 點狀格線背景 */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, #7AADCC 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}/>

              {/* 積木堆疊示範 */}
              <div className="relative z-10 flex flex-col items-start gap-0 select-none" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.5))' }}>
                {/* 帽子積木：綠旗 */}
                <div style={{ background: '#FFAB19', color: '#fff', borderRadius: '18px 18px 4px 4px', padding: '8px 16px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 0 #cc8800' }}>
                  <span>🚩</span><span>當 綠旗 被點擊</span>
                </div>
                <div style={{ width: 24, height: 9, background: '#FFAB19', borderRadius: '0 0 5px 5px', marginLeft: 12, opacity: 0.6 }}/>

                {/* 重複積木 */}
                <div style={{ width: 24, height: 9, background: '#FF8C1A', borderRadius: '5px 5px 0 0', marginLeft: 12, opacity: 0.6 }}/>
                <div style={{ background: '#FF8C1A', color: '#fff', borderRadius: 6, padding: '7px 16px', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 7, boxShadow: '0 3px 0 #c05500' }}>
                  <span>重複</span>
                  <span style={{ background: 'rgba(255,255,255,0.28)', borderRadius: 5, padding: '2px 8px', fontSize: 11 }}>10</span>
                  <span>次</span>
                </div>

                {/* 內縮：移動 */}
                <div className="ml-6 flex flex-col gap-0">
                  <div style={{ width: 22, height: 8, background: '#4C97FF', borderRadius: '5px 5px 0 0', marginLeft: 10, opacity: 0.6 }}/>
                  <div style={{ background: '#4C97FF', color: '#fff', borderRadius: 5, padding: '6px 13px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 3px 0 #2a6acc', whiteSpace: 'nowrap' }}>
                    <span>移動</span>
                    <span style={{ background: 'rgba(255,255,255,0.28)', borderRadius: 4, padding: '2px 8px', fontSize: 10 }}>10</span>
                    <span>步</span>
                  </div>
                  <div style={{ width: 22, height: 8, background: '#4C97FF', borderRadius: '0 0 5px 5px', marginLeft: 10, opacity: 0.5 }}/>
                  <div style={{ width: 22, height: 8, background: '#4C97FF', borderRadius: '5px 5px 0 0', marginLeft: 10, opacity: 0.6 }}/>
                  <div style={{ background: '#4C97FF', color: '#fff', borderRadius: 5, padding: '6px 13px', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 3px 0 #2a6acc', whiteSpace: 'nowrap' }}>
                    <span>右轉</span>
                    <span style={{ background: 'rgba(255,255,255,0.28)', borderRadius: 4, padding: '2px 8px', fontSize: 10 }}>15</span>
                    <span>度</span>
                  </div>
                  <div style={{ width: 22, height: 8, background: '#4C97FF', borderRadius: '0 0 5px 5px', marginLeft: 10, opacity: 0.5 }}/>
                </div>

                {/* 重複底部 */}
                <div style={{ width: 24, height: 9, background: '#FF8C1A', borderRadius: '0 0 5px 5px', marginLeft: 12, opacity: 0.6 }}/>
              </div>

              {/* 底部提示 */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <div style={{ background: 'rgba(76,151,255,0.18)', border: '1px solid rgba(76,151,255,0.3)', borderRadius: 20, padding: '4px 12px', fontSize: 10, color: '#8AACC8', backdropFilter: 'blur(6px)' }}>
                  🔌 等待串接 Scratch 編輯器
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CreativeHub onScratchMode={onScratchMode} onDocumentMode={onDocumentMode} />
        )}
      </div>
    </aside>
  );
}