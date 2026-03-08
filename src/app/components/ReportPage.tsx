import { useState } from 'react';
import naboMascot from '../../assets/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';

// Radar chart data
const dimensions = [
  { key: 'reading', label: '閱讀理解', student: 80, baseline: 65 },
  { key: 'digital', label: '數位素養', student: 80, baseline: 60 },
  { key: 'selflearn', label: '自主學習', student: 70, baseline: 55 },
  { key: 'emotion', label: '情緒藝術', student: 65, baseline: 70 },
  { key: 'logic', label: '邏輯思維', student: 75, baseline: 60 },
  { key: 'collab', label: '合作與交流', student: 85, baseline: 68 },
];

const detailCards = [
  {
    label: '閱讀理解',
    score: 80,
    color: '#48A88B',
    desc: '透過協助能理解系統回應內容，並抓住關鍵元素進行修正（如「沒有角的」「再紅一點」「改成深藍色」「背景亮一點」），顯示能從回饋中擷取重點並延續指令脈絡。',
  },
  {
    label: '數位素養',
    score: 80,
    color: '#3A648C',
    desc: '能正確使用 AI 進行圖片生成，並透過多次嘗試調整顏色、物件與背景。',
  },
  {
    label: '自主學習',
    score: 85,
    color: '#48A88B',
    desc: '在對話中主動嘗試不同風格與構圖，展現自主探索精神，並持續優化成果。',
  },
  {
    label: '情緒藝術',
    score: 75,
    color: '#F3CC58',
    desc: '能將情緒融入創作中，透過色彩與構圖表達個人感受，展現藝術敏感度。',
  },
  {
    label: '邏輯思維',
    score: 70,
    color: '#FF7F72',
    desc: '能有條理地描述需求，並在遇到問題時嘗試不同方法解決，展現初步的邏輯推理能力。',
  },
  {
    label: '合作與交流',
    score: 85,
    color: '#9B59B6',
    desc: '與 AI 天伴的互動流暢，能清楚表達想法並根據回饋進行調整，展現良好的溝通能力。',
  },
];

// Helper: get hexagon point
function hexPoint(cx: number, cy: number, r: number, i: number, total: number) {
  const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
}

function hexPolygon(cx: number, cy: number, r: number, total: number) {
  return Array.from({ length: total }, (_, i) => {
    const p = hexPoint(cx, cy, r, i, total);
    return `${p.x},${p.y}`;
  }).join(' ');
}

function RadarChart() {
  const cx = 180, cy = 170, maxR = 130, total = 6;
  const rings = [0.25, 0.5, 0.75, 1];

  const studentPoints = dimensions.map((d, i) => {
    const r = (d.student / 100) * maxR;
    return hexPoint(cx, cy, r, i, total);
  });
  const baselinePoints = dimensions.map((d, i) => {
    const r = (d.baseline / 100) * maxR;
    return hexPoint(cx, cy, r, i, total);
  });

  const studentPath = studentPoints.map(p => `${p.x},${p.y}`).join(' ');
  const baselinePath = baselinePoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg viewBox="0 0 360 360" className="w-full max-w-[380px]">
      <defs>
        <linearGradient id="studentFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3A648C" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#48A88B" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="baseFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7F72" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#F3CC58" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Grid rings */}
      {rings.map((scale) => (
        <polygon
          key={scale}
          points={hexPolygon(cx, cy, maxR * scale, total)}
          fill="none"
          stroke="#B8D8E8"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}

      {/* Axis lines */}
      {dimensions.map((_, i) => {
        const p = hexPoint(cx, cy, maxR, i, total);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#B8D8E8" strokeWidth="1" opacity="0.4" />
        );
      })}

      {/* Baseline polygon */}
      <polygon
        points={baselinePath}
        fill="url(#baseFill)"
        stroke="#D94040"
        strokeWidth="2"
        opacity="0.7"
      />

      {/* Student polygon */}
      <polygon
        points={studentPath}
        fill="url(#studentFill)"
        stroke="#3A648C"
        strokeWidth="2.5"
      />

      {/* Data points - student */}
      {studentPoints.map((p, i) => (
        <circle key={`s-${i}`} cx={p.x} cy={p.y} r="4" fill="#3A648C" stroke="white" strokeWidth="2" />
      ))}

      {/* Data points - baseline */}
      {baselinePoints.map((p, i) => (
        <circle key={`b-${i}`} cx={p.x} cy={p.y} r="3" fill="#D94040" stroke="white" strokeWidth="1.5" />
      ))}

      {/* Labels */}
      {dimensions.map((d, i) => {
        const p = hexPoint(cx, cy, maxR + 28, i, total);
        return (
          <text
            key={d.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#2B3A52"
            fontSize="12"
            fontWeight="700"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

export function ReportPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes reportSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes radarDraw {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes cardSlideRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .report-container {
          animation: reportSlideIn 0.6s ease-out;
        }
        .radar-area {
          animation: radarDraw 0.8s ease-out 0.2s both;
        }
        .detail-card {
          animation: cardSlideRight 0.5s ease-out both;
        }
        .detail-card:nth-child(1) { animation-delay: 0.3s; }
        .detail-card:nth-child(2) { animation-delay: 0.45s; }
        .detail-card:nth-child(3) { animation-delay: 0.6s; }
        .detail-card:nth-child(4) { animation-delay: 0.75s; }
        .detail-card:nth-child(5) { animation-delay: 0.9s; }
        .detail-card:nth-child(6) { animation-delay: 1.05s; }
        .mascot-float {
          animation: floatSoft 4s ease-in-out infinite;
        }
        .report-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .report-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .report-scroll::-webkit-scrollbar-thumb {
          background: #B8F0E8;
          border-radius: 99px;
        }
      `}</style>

      <main className="report-container relative overflow-hidden h-full">
        {/* 3D room gradient overlay */}
        <div className="absolute inset-0 z-0" style={{
          background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(200,240,234,0.3) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 30%, rgba(220,240,255,0.25) 0%, transparent 50%)',
        }} />

        {/* Content */}
        <div className="relative z-[1] h-full flex flex-col px-6 py-4 overflow-hidden">
          {/* Header with Na-Bo logo */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Na-Bo mascot small */}
              <div className="mascot-float">
                <img src={naboMascot} alt="Na-Bo 吉祥物" className="w-[60px] h-[66px] object-contain" style={{ filter: 'drop-shadow(0 6px 16px rgba(62,191,173,0.3))' }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[20px] font-black text-[#48A88B]">Na-Bo</span>
                  <span className="text-[14px] text-[#7A8BA0] font-bold">學習報告</span>
                </div>
                <div className="text-[11px] text-[#7A8BA0]">110-1 學期・玩閱讀・林小明</div>
              </div>
            </div>

            {/* Print / Export buttons */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded-2xl bg-white/80 backdrop-blur-sm text-[12px] font-black text-[#2B3A52] shadow-[0_4px_16px_rgba(60,120,140,0.12)] hover:translate-y-[-2px] transition-all border border-white/90 flex items-center gap-1.5">
                📄 匯出報告
              </button>
              <button className="px-4 py-2 rounded-2xl bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-[12px] font-black text-white shadow-[0_4px_16px_rgba(72,168,139,0.4)] hover:translate-y-[-2px] transition-all flex items-center gap-1.5">
                📊 完整報告
              </button>
            </div>
          </div>

          {/* Main Content: 2 column */}
          <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
            {/* Left: Radar Chart */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Glass card */}
              <div className="bg-white/70 backdrop-blur-md rounded-[24px] border-[1.5px] border-white/80 shadow-[0_8px_32px_rgba(60,120,140,0.12)] p-5 flex-1 flex flex-col min-h-0 overflow-y-auto">
                <h2 className="text-[18px] font-black text-[#3A648C] mb-1">各項能力評估結果</h2>

                <div className="flex-1 flex flex-col items-center justify-center min-h-0">
                  <div className="text-[14px] font-black text-[#2B3A52] mb-2">六大面向學習表現</div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mb-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-[3px] rounded-full bg-[#3A648C]" />
                      <span className="text-[11px] font-bold text-[#2B3A52]">學生</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-[3px] rounded-full bg-[#D94040]" />
                      <span className="text-[11px] font-bold text-[#2B3A52]">基礎</span>
                    </div>
                  </div>

                  {/* Radar */}
                  <div className="radar-area w-full flex items-center justify-center">
                    <RadarChart />
                  </div>
                </div>

                {/* Summary stats */}
                <div className="flex gap-3 mt-2">
                  <StatPill label="平均分數" value="79" icon="📊" color="#48A88B" />
                  <StatPill label="最強能力" value="合作與交流" icon="🏆" color="#F3CC58" />
                  <StatPill label="進步幅度" value="+12%" icon="📈" color="#3A648C" />
                </div>
              </div>
            </div>

            {/* Right: Detail Cards */}
            <div className="w-[380px] flex-shrink-0 flex flex-col min-h-0">
              <h2 className="text-[18px] font-black text-[#48A88B] mb-3">各面向詳細分析</h2>

              <div className="flex-1 overflow-y-auto report-scroll pr-1 space-y-3">
                {detailCards.map((card, i) => (
                  <div
                    key={card.label}
                    className={`detail-card bg-white/75 backdrop-blur-md rounded-[20px] border-[1.5px] border-white/80 shadow-[0_4px_20px_rgba(60,120,140,0.10)] p-4 cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_28px_rgba(60,120,140,0.18)] ${
                      selectedCard === i ? 'ring-2 ring-offset-2' : ''
                    }`}
                    style={{
                      borderLeftWidth: '4px',
                      borderLeftColor: card.color,
                      ...(selectedCard === i ? { ringColor: card.color } : {}),
                    }}
                    onClick={() => setSelectedCard(selectedCard === i ? null : i)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[15px] font-black" style={{ color: card.color }}>
                        {card.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-black" style={{ color: card.color }}>
                          {card.score}分
                        </span>
                        <ScoreRing score={card.score} color={card.color} />
                      </div>
                    </div>
                    <p className="text-[12px] text-[#4A5568] leading-[1.8]">
                      {card.desc}
                    </p>

                    {selectedCard === i && (
                      <div className="mt-3 pt-3 border-t border-[#E8F4F8]">
                        <div className="flex items-center gap-3">
                          <SkillBar label="理解力" value={Math.min(card.score + 5, 100)} color={card.color} />
                          <SkillBar label="應用力" value={Math.max(card.score - 10, 40)} color={card.color} />
                          <SkillBar label="創造力" value={Math.min(card.score + 2, 100)} color={card.color} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function StatPill({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl px-3 py-2.5 flex items-center gap-2 shadow-[0_2px_12px_rgba(60,120,140,0.08)] border border-white/90">
      <span className="text-[18px]">{icon}</span>
      <div>
        <div className="text-[10px] text-[#7A8BA0] font-bold">{label}</div>
        <div className="text-[14px] font-black" style={{ color }}>{value}</div>
      </div>
    </div>
  );
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <svg width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r={r} fill="none" stroke="#EEF3F8" strokeWidth="3" />
      <circle
        cx="18" cy="18" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 18 18)"
      />
      <text x="18" y="18" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="9" fontWeight="900">
        {score}
      </text>
    </svg>
  );
}

function SkillBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-[#7A8BA0]">{label}</span>
        <span className="text-[10px] font-black" style={{ color }}>{value}%</span>
      </div>
      <div className="h-[5px] bg-[#EEF3F8] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}