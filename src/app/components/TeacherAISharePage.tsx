import { useState } from 'react';
import {
  Search, Upload, Heart, Download, Star, Share2, Eye, BookOpen, FileText,
  Settings, Monitor, Cpu, Cloud, Server, Activity, ChevronRight, ChevronDown,
  CheckCircle2, Circle, Zap, Globe, Lock, RefreshCw, Play, Pause, Trash2,
  Plus, Filter, Sliders, Box, BrainCircuit, Sparkles, ClipboardList,
  BarChart3, HardDrive, Wifi, AlertCircle, X, ArrowRight, Check,
  PenLine, FlaskConical, Layers
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'gallery' | 'model' | 'env' | 'online';

interface AIWork {
  id: string;
  title: string;
  type: '教案' | '行政軟體' | '教學素材' | '評量設計' | '課程規劃';
  subject: string;
  grade: string;
  creator: string;
  school: string;
  aiTool: string;
  likes: number;
  downloads: number;
  stars: number;
  date: string;
  tags: string[];
  desc: string;
  color: string;
  icon: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockWorks: AIWork[] = [
  {
    id: '1', title: '分數加法互動教案（GPT-4o 生成）',
    type: '教案', subject: '數學', grade: '三年級',
    creator: '林淑芳', school: '台北市立中山國小',
    aiTool: 'GPT-4o', likes: 128, downloads: 89, stars: 4.9,
    date: '2026-03-18',
    tags: ['分數', '互動', '遊戲化'],
    desc: '以 GPT-4o 設計的分數加減法教案，融入具體操作與遊戲機制，附完整教學流程與評量。',
    color: '#48A88B', icon: '📐',
  },
  {
    id: '2', title: '班級出缺勤自動彙整系統',
    type: '行政軟體', subject: '班級行政', grade: '全年級',
    creator: '王建宏', school: '新竹縣竹北國中',
    aiTool: 'Claude 3.5', likes: 94, downloads: 156, stars: 4.7,
    date: '2026-03-12',
    tags: ['出勤', '自動化', 'Google Sheets'],
    desc: '由 Claude 3.5 協助開發的 Google Apps Script 出缺勤系統，自動傳送家長通知。',
    color: '#3A648C', icon: '📋',
  },
  {
    id: '3', title: '閱讀理解分層提問素材包',
    type: '教學素材', subject: '國語', grade: '五年級',
    creator: '陳佩君', school: '台中市立光明國小',
    aiTool: 'Gemini 1.5', likes: 67, downloads: 43, stars: 4.5,
    date: '2026-03-08',
    tags: ['閱讀', '差異化', '提問'],
    desc: 'Gemini 生成的三層次提問素材，搭配學習單與課後評量，適合差異化教學使用。',
    color: '#F3CC58', icon: '📖',
  },
  {
    id: '4', title: '生物多樣性單元評量題庫',
    type: '評量設計', subject: '自然科', grade: '六年級',
    creator: '黃志遠', school: '高雄市立鹽埕國小',
    aiTool: 'GPT-4o', likes: 52, downloads: 38, stars: 4.6,
    date: '2026-03-05',
    tags: ['自然', '評量', '生物'],
    desc: '涵蓋選擇、填充、問答的完整評量題庫，GPT-4o 依課綱標準生成並人工審核修正。',
    color: '#9B59B6', icon: '🌿',
  },
  {
    id: '5', title: '108 課綱素養導向課程地圖',
    type: '課程規劃', subject: '社會', grade: '全年級',
    creator: '蔡雅婷', school: '台南市立大成國中',
    aiTool: 'Claude 3.5', likes: 189, downloads: 212, stars: 5.0,
    date: '2026-02-28',
    tags: ['108課綱', '素養', '課程地圖'],
    desc: '以 Claude 繪製的跨年級素養課程地圖，清楚呈現學習進程與核心素養連結。',
    color: '#E67E22', icon: '🗺️',
  },
  {
    id: '6', title: '聯絡簿 AI 智慧回饋生成工具',
    type: '行政軟體', subject: '班級行政', grade: '全年級',
    creator: '林建志', school: '桃園市立大園國小',
    aiTool: 'GPT-4o mini', likes: 73, downloads: 98, stars: 4.4,
    date: '2026-02-20',
    tags: ['聯絡簿', 'AI回饋', '效率'],
    desc: '輸入學生表現關鍵字，自動生成個性化聯絡簿留言，大幅降低班導師日常負擔。',
    color: '#1ABC9C', icon: '✉️',
  },
];

const AI_MODELS = [
  { provider: 'OpenAI', color: '#10A37F', models: ['GPT-4o', 'GPT-4o mini', 'GPT-4 Turbo', 'GPT-3.5 Turbo'], icon: '🟢' },
  { provider: 'Anthropic', color: '#D97757', models: ['Claude 3.5 Sonnet', 'Claude 3 Haiku', 'Claude 3 Opus'], icon: '🟠' },
  { provider: 'Google', color: '#4285F4', models: ['Gemini 1.5 Pro', 'Gemini 1.5 Flash', 'Gemini 1.0 Pro'], icon: '🔵' },
  { provider: 'Meta', color: '#0866FF', models: ['Llama 3.1 8B', 'Llama 3.1 70B', 'Llama 3.1 405B'], icon: '🟣' },
];

const WORK_TYPES = ['全部', '教案', '行政軟體', '教學素材', '評量設計', '課程規劃'] as const;
type WorkTypeFilter = typeof WORK_TYPES[number];

const TYPE_COLORS: Record<string, string> = {
  '教案': '#48A88B', '行政軟體': '#3A648C', '教學素材': '#F3CC58',
  '評量設計': '#9B59B6', '課程規劃': '#E67E22',
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const color = TYPE_COLORS[type] || '#8A9BB0';
  return (
    <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
      {type}
    </span>
  );
}

function AiToolBadge({ tool }: { tool: string }) {
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#1A2E4A]/8 text-[#3A648C] border border-[#3A648C]/15">
      🤖 {tool}
    </span>
  );
}

function StarRow({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={9}
          className={i <= Math.round(value) ? 'text-[#F3CC58] fill-[#F3CC58]' : 'text-[#D8E4EE]'} />
      ))}
      <span className="text-[10px] font-black text-[#3A648C] ml-0.5">{value.toFixed(1)}</span>
    </div>
  );
}

// ─── Tab: Gallery (作品廣場) ──────────────────────────────────────────────────

function GalleryTab({ onUploadClick }: { onUploadClick: () => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<WorkTypeFilter>('全部');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [previewWork, setPreviewWork] = useState<AIWork | null>(null);

  const toggleLike = (id: string) => setLikedIds(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });
  const toggleSave = (id: string) => setSavedIds(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const filtered = mockWorks.filter(w => {
    const matchType = filter === '全部' || w.type === filter;
    const matchSearch = !search || w.title.includes(search) || w.creator.includes(search) ||
      w.subject.includes(search) || w.tags.some(t => t.includes(search));
    return matchType && matchSearch;
  });

  return (
    <div className="flex flex-col gap-4 h-full min-h-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9BB0]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜尋作品、創作者、學科…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/80 border border-[#E2EAF2]
                       text-[12px] text-[#2B3A52] placeholder:text-[#8A9BB0]/70 outline-none
                       focus:border-[#48A88B]/50 focus:ring-2 focus:ring-[#48A88B]/10 transition-all"
          />
        </div>
        <button onClick={onUploadClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl shrink-0
                     bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white
                     text-[12px] font-black hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
          <Upload size={13} /> 上傳作品
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <Filter size={12} className="text-[#8A9BB0]" />
        {WORK_TYPES.map(t => (
          <button key={t}
            onClick={() => setFilter(t)}
            className={`text-[11px] font-black px-3 py-1 rounded-full border transition-all ${
              filter === t
                ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white border-transparent shadow-sm'
                : 'bg-white/70 text-[#3A648C] border-[#3A648C]/20 hover:border-[#3A648C]/50'
            }`}>
            {t}
          </button>
        ))}
        <span className="ml-auto text-[11px] text-[#8A9BB0] font-semibold">{filtered.length} 件作品</span>
      </div>

      {/* Cards grid */}
      <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 gap-3" style={{ scrollbarWidth: 'thin' }}>
        {filtered.map(w => (
          <div key={w.id}
            className="bg-white/85 backdrop-blur rounded-2xl border border-[#E2EAF2] shadow-sm
                       hover:shadow-md hover:border-[#48A88B]/30 transition-all group overflow-hidden">
            {/* Color strip */}
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${w.color}, ${w.color}60)` }} />

            <div className="p-4">
              {/* Header row */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm"
                  style={{ background: `${w.color}15`, border: `1.5px solid ${w.color}25` }}>
                  {w.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 flex-wrap mb-1">
                    <TypeBadge type={w.type} />
                    <AiToolBadge tool={w.aiTool} />
                  </div>
                  <h3 className="text-[13px] font-black text-[#1A2E4A] leading-tight line-clamp-2">{w.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-[#5A6E84] leading-relaxed mb-3 line-clamp-2">{w.desc}</p>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap mb-3">
                {w.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full
                                             bg-[#EEF6FF] text-[#3A648C] border border-[#3A648C]/15">
                    #{tag}
                  </span>
                ))}
                <span className="text-[9px] text-[#8A9BB0] ml-auto">{w.subject} · {w.grade}</span>
              </div>

              {/* Meta row */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-[10px] font-bold text-[#5A6E84]">👤 {w.creator}</span>
                <span className="text-[9px] text-[#8A9BB0]">·</span>
                <span className="text-[9px] text-[#8A9BB0]">{w.school}</span>
                <span className="text-[9px] text-[#8A9BB0] ml-auto">{w.date}</span>
              </div>

              {/* Stats + actions */}
              <div className="flex items-center gap-3">
                <StarRow value={w.stars} />
                <div className="flex items-center gap-1 text-[10px] text-[#8A9BB0]">
                  <Download size={10} /> {w.downloads}
                </div>
                <div className="flex-1" />
                <button onClick={() => toggleLike(w.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                    likedIds.has(w.id) ? 'bg-rose-50 text-rose-500' : 'bg-[#F5F8FA] text-[#8A9BB0] hover:text-rose-400'
                  }`}>
                  <Heart size={12} className={likedIds.has(w.id) ? 'fill-rose-500' : ''} />
                </button>
                <button onClick={() => toggleSave(w.id)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                    savedIds.has(w.id) ? 'bg-[#F3CC58]/15 text-[#C8A030]' : 'bg-[#F5F8FA] text-[#8A9BB0] hover:text-[#F3CC58]'
                  }`}>
                  <Star size={12} className={savedIds.has(w.id) ? 'fill-[#F3CC58] text-[#F3CC58]' : ''} />
                </button>
                <button onClick={() => setPreviewWork(w)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black
                             bg-gradient-to-br from-[#48A88B]/10 to-[#3A648C]/10
                             text-[#3A648C] border border-[#3A648C]/20
                             hover:from-[#48A88B] hover:to-[#3A648C] hover:text-white hover:border-transparent
                             transition-all active:scale-95">
                  <Eye size={11} /> 預覽
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black
                                   bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white
                                   hover:shadow-md active:scale-95 transition-all">
                  <Download size={11} /> 取用
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-[13px] font-bold text-[#8A9BB0]">找不到符合條件的作品</p>
            <p className="text-[11px] text-[#8A9BB0]/70 mt-1">試試不同的搜尋關鍵字</p>
          </div>
        )}
      </div>

      {/* Preview modal */}
      {previewWork && (
        <div className="fixed inset-0 z-[300] bg-[#1A2E4A]/50 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setPreviewWork(null)}>
          <div className="bg-white rounded-[24px] w-full max-w-[520px] shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            <div className="h-2" style={{ background: `linear-gradient(90deg, ${previewWork.color}, ${previewWork.color}60)` }} />
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm"
                    style={{ background: `${previewWork.color}15`, border: `2px solid ${previewWork.color}25` }}>
                    {previewWork.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <TypeBadge type={previewWork.type} />
                      <AiToolBadge tool={previewWork.aiTool} />
                    </div>
                    <h2 className="text-[15px] font-black text-[#1A2E4A]">{previewWork.title}</h2>
                  </div>
                </div>
                <button onClick={() => setPreviewWork(null)}
                  className="w-8 h-8 rounded-xl bg-[#F0F4F8] flex items-center justify-center text-[#8A9BB0] hover:text-[#3A648C] transition-all">
                  <X size={14} />
                </button>
              </div>
              <div className="bg-[#F8FAFC] rounded-xl p-4 mb-4">
                <p className="text-[12px] text-[#2B3A52] leading-relaxed">{previewWork.desc}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <InfoCell label="學科" value={previewWork.subject} />
                <InfoCell label="年級" value={previewWork.grade} />
                <InfoCell label="創作者" value={previewWork.creator} />
                <InfoCell label="學校" value={previewWork.school} />
              </div>
              <div className="flex items-center gap-2">
                <StarRow value={previewWork.stars} />
                <span className="text-[10px] text-[#8A9BB0] ml-1">{previewWork.likes} 人喜歡 · {previewWork.downloads} 次下載</span>
                <div className="flex-1" />
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-black
                                   bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white
                                   hover:shadow-lg active:scale-95 transition-all">
                  <Download size={13} /> 下載取用
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-[#E2EAF2]">
      <p className="text-[9px] font-bold text-[#8A9BB0] mb-0.5">{label}</p>
      <p className="text-[12px] font-black text-[#2B3A52]">{value}</p>
    </div>
  );
}

// ─── Tab: Model Config (模型配置) ─────────────────────────────────────────────

function ModelTab() {
  const [selectedProvider, setSelectedProvider] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(0.9);
  const [systemPrompt, setSystemPrompt] = useState(
    '你是一位專業的教育助手，擅長協助台灣教師設計優質教學方案，回應時請使用繁體中文，語氣友善且具教育專業性。'
  );
  const [configName, setConfigName] = useState('');
  const [savedConfigs, setSavedConfigs] = useState(['教案設計模式', '評量生成模式']);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const provider = AI_MODELS[selectedProvider];

  const handleSave = () => {
    if (!configName.trim()) return;
    setSavedConfigs(prev => [...prev, configName.trim()]);
    setConfigName('');
  };

  const handleTest = () => {
    if (!testInput.trim()) return;
    setIsTesting(true);
    setTestOutput('');
    setTimeout(() => {
      setTestOutput(`【${provider.models[selectedModel]}】\n\n根據您的提問：「${testInput}」\n\n以下是建議的教學策略：\n\n1. 首先透過引起動機的活動吸引學生興趣...\n2. 接著利用分組合作讓學生探索核心概念...\n3. 最後透過多元評量確認學習成效...\n\n（這是模擬輸出，實際使用時請連接 API 金鑰）`);
      setIsTesting(false);
    }, 1500);
  };

  return (
    <div className="flex gap-4 h-full min-h-0">
      {/* Left: Config panel */}
      <div className="flex flex-col gap-3 w-[280px] shrink-0 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
        {/* Provider */}
        <SectionCard title="AI 模型供應商" icon={<BrainCircuit size={14} />}>
          <div className="grid grid-cols-2 gap-2">
            {AI_MODELS.map((m, i) => (
              <button key={m.provider}
                onClick={() => { setSelectedProvider(i); setSelectedModel(0); }}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedProvider === i
                    ? 'border-[#48A88B] bg-[#E8F8F3] shadow-sm'
                    : 'border-[#E2EAF2] bg-white hover:border-[#48A88B]/40'
                }`}>
                <div className="text-base mb-1">{m.icon}</div>
                <div className="text-[11px] font-black text-[#2B3A52]">{m.provider}</div>
                <div className="text-[9px] text-[#8A9BB0]">{m.models.length} 個模型</div>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Model version */}
        <SectionCard title="模型版本" icon={<Box size={14} />}>
          <div className="flex flex-col gap-1.5">
            {provider.models.map((m, i) => (
              <button key={m}
                onClick={() => setSelectedModel(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-left transition-all ${
                  selectedModel === i
                    ? 'border-[#48A88B] bg-[#E8F8F3] text-[#2B3A52]'
                    : 'border-[#E2EAF2] bg-white text-[#5A6E84] hover:border-[#48A88B]/40'
                }`}>
                {selectedModel === i
                  ? <CheckCircle2 size={12} className="text-[#48A88B] shrink-0" />
                  : <Circle size={12} className="text-[#D8E4EE] shrink-0" />}
                <span className="text-[11px] font-bold">{m}</span>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* Parameters */}
        <SectionCard title="參數設定" icon={<Sliders size={14} />}>
          <SliderRow label="溫度 (Temperature)" value={temperature}
            min={0} max={1} step={0.1}
            hint={temperature < 0.4 ? '較保守' : temperature < 0.7 ? '均衡' : '較創意'}
            onChange={setTemperature} />
          <SliderRow label="最大 Token 數" value={maxTokens}
            min={256} max={8192} step={256}
            hint={`${maxTokens.toLocaleString()} tokens`}
            onChange={setMaxTokens} />
          <SliderRow label="Top-P" value={topP}
            min={0} max={1} step={0.05}
            hint={`${(topP * 100).toFixed(0)}%`}
            onChange={setTopP} />
        </SectionCard>

        {/* Save config */}
        <SectionCard title="儲存配置" icon={<ClipboardList size={14} />}>
          <div className="flex gap-2 mb-2">
            <input
              value={configName}
              onChange={e => setConfigName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="配置名稱…"
              className="flex-1 px-3 py-2 rounded-xl bg-[#F5F8FA] border border-[#E2EAF2]
                         text-[11px] text-[#2B3A52] placeholder:text-[#8A9BB0]/60
                         outline-none focus:border-[#48A88B]/50 transition-all" />
            <button onClick={handleSave}
              className="px-3 py-2 rounded-xl bg-gradient-to-br from-[#48A88B] to-[#3A648C]
                         text-white text-[11px] font-black hover:shadow-md active:scale-95 transition-all">
              儲存
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {savedConfigs.map(c => (
              <div key={c} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F5F8FA] border border-[#E2EAF2]">
                <Check size={10} className="text-[#48A88B]" />
                <span className="text-[11px] font-semibold text-[#3A648C] flex-1">{c}</span>
                <button className="text-[9px] font-bold text-[#48A88B] hover:underline">載入</button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Right: System prompt + test */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <SectionCard title="系統提示詞 (System Prompt)" icon={<PenLine size={14} />}>
          <div className="mb-2">
            <p className="text-[10px] text-[#8A9BB0] mb-2">定義 AI 的角色與行為準則，這是教師客製化模型的關鍵設定。</p>
            <div className="flex gap-1.5 flex-wrap mb-2">
              {['教案助手', '評量設計師', '班級管理助手', '親師溝通顧問'].map(t => (
                <button key={t}
                  className="text-[9px] font-bold px-2 py-1 rounded-lg bg-[#EEF6FF] text-[#3A648C]
                             border border-[#3A648C]/15 hover:bg-[#3A648C] hover:text-white transition-all">
                  {t}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={systemPrompt}
            onChange={e => setSystemPrompt(e.target.value)}
            rows={5}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                       text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50
                       transition-all resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[9px] text-[#8A9BB0]">{systemPrompt.length} 字元</span>
            <button className="text-[10px] font-black text-[#48A88B] hover:underline">分享到作品廣場</button>
          </div>
        </SectionCard>

        {/* Live test */}
        <SectionCard title="快速測試" icon={<FlaskConical size={14} />}>
          <div className="bg-[#1A2E4A]/4 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#3A648C]">
              <Zap size={11} className="text-[#F3CC58]" />
              目前使用：{provider.provider} / {provider.models[selectedModel]}
              · 溫度 {temperature} · {maxTokens.toLocaleString()} tokens
            </div>
          </div>
          <textarea
            value={testInput}
            onChange={e => setTestInput(e.target.value)}
            rows={3}
            placeholder="輸入測試提示詞，例如：請幫我設計一堂三年級分數加法的引起動機活動…"
            className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                       text-[12px] text-[#2B3A52] placeholder:text-[#8A9BB0]/60 outline-none
                       focus:border-[#48A88B]/50 transition-all resize-none"
          />
          <button onClick={handleTest}
            disabled={isTesting || !testInput.trim()}
            className="w-full mt-2 py-2.5 rounded-xl text-[12px] font-black flex items-center justify-center gap-2
                       bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white
                       hover:shadow-lg active:scale-[.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {isTesting ? <><RefreshCw size={13} className="animate-spin" /> 生成中…</> : <><Sparkles size={13} /> 發送測試</>}
          </button>
          {testOutput && (
            <div className="mt-3 p-3 bg-[#F0FAF6] rounded-xl border border-[#48A88B]/20">
              <p className="text-[10px] font-black text-[#48A88B] mb-2">📤 模型輸出</p>
              <pre className="text-[11px] text-[#2B3A52] whitespace-pre-wrap leading-relaxed font-sans">{testOutput}</pre>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, step, hint, onChange }: {
  label: string; value: number; min: number; max: number;
  step: number; hint: string; onChange: (v: number) => void;
}) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-bold text-[#5A6E84]">{label}</span>
        <span className="text-[10px] font-black text-[#48A88B]">{hint}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: '#48A88B' }} />
    </div>
  );
}

// ─── Tab: Environment (環境設定) ──────────────────────────────────────────────

const ENV_TYPES = [
  { id: 'local', label: '本機環境', icon: <HardDrive size={18} />, desc: '在自己的電腦上運行，離線可用，資料不離開校園', color: '#48A88B' },
  { id: 'cloud', label: '雲端環境', icon: <Cloud size={18} />, desc: '透過雲端平台處理，算力更強，隨時隨地可用', color: '#3A648C' },
  { id: 'hybrid', label: '混合模式', icon: <Layers size={18} />, desc: '本機處理隱私資料，雲端處理複雜任務，靈活安全', color: '#F3CC58' },
] as const;

type EnvType = typeof ENV_TYPES[number]['id'];

const CLOUD_PROVIDERS = [
  { id: 'aws', name: 'AWS Bedrock', region: 'ap-northeast-1 (東京)', status: 'ok' as const },
  { id: 'gcp', name: 'Google Cloud', region: 'asia-east1 (台灣)', status: 'ok' as const },
  { id: 'azure', name: 'Azure OpenAI', region: 'eastasia (香港)', status: 'warn' as const },
];

function EnvTab() {
  const [envType, setEnvType] = useState<EnvType>('cloud');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('https://api.openai.com/v1');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [selectedCloud, setSelectedCloud] = useState('aws');
  const [privacyMode, setPrivacyMode] = useState(true);
  const [autoFallback, setAutoFallback] = useState(true);

  const handleTest = () => {
    setTestStatus('testing');
    setTimeout(() => setTestStatus('ok'), 1800);
  };

  return (
    <div className="flex gap-4 h-full min-h-0">
      {/* Left */}
      <div className="w-[260px] shrink-0 flex flex-col gap-3 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
        <SectionCard title="環境類型" icon={<Server size={14} />}>
          <div className="flex flex-col gap-2">
            {ENV_TYPES.map(e => (
              <button key={e.id} onClick={() => setEnvType(e.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  envType === e.id
                    ? 'border-[#48A88B] bg-[#E8F8F3] shadow-sm'
                    : 'border-[#E2EAF2] bg-white hover:border-[#48A88B]/40'
                }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: e.color }}>{e.icon}</span>
                  <span className="text-[12px] font-black text-[#1A2E4A]">{e.label}</span>
                  {envType === e.id && <CheckCircle2 size={12} className="text-[#48A88B] ml-auto" />}
                </div>
                <p className="text-[9px] text-[#8A9BB0] leading-relaxed">{e.desc}</p>
              </button>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="安全與隱私" icon={<Lock size={14} />}>
          <ToggleRow label="隱私保護模式" desc="不上傳學生個資至雲端"
            value={privacyMode} onChange={setPrivacyMode} />
          <ToggleRow label="自動故障轉移" desc="主環境異常時自動切換"
            value={autoFallback} onChange={setAutoFallback} />
        </SectionCard>
      </div>

      {/* Right */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {envType === 'cloud' || envType === 'hybrid' ? (
          <SectionCard title="雲端服務商" icon={<Globe size={14} />}>
            <div className="flex flex-col gap-2 mb-3">
              {CLOUD_PROVIDERS.map(p => (
                <button key={p.id} onClick={() => setSelectedCloud(p.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${
                    selectedCloud === p.id
                      ? 'border-[#48A88B] bg-[#E8F8F3]'
                      : 'border-[#E2EAF2] bg-white hover:border-[#48A88B]/30'
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${p.status === 'ok' ? 'bg-[#48A88B]' : 'bg-[#F3CC58]'} animate-pulse`} />
                  <div className="flex-1 text-left">
                    <p className="text-[11px] font-black text-[#2B3A52]">{p.name}</p>
                    <p className="text-[9px] text-[#8A9BB0]">{p.region}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    p.status === 'ok' ? 'bg-[#E8F8F3] text-[#48A88B]' : 'bg-[#FFF8E1] text-[#C8A030]'
                  }`}>
                    {p.status === 'ok' ? '正常' : '延遲'}
                  </span>
                </button>
              ))}
            </div>
          </SectionCard>
        ) : null}

        <SectionCard title="連線設定" icon={<Settings size={14} />}>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#5A6E84] block mb-1">API 端點</label>
              <input value={endpoint} onChange={e => setEndpoint(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                           text-[12px] text-[#2B3A52] font-mono outline-none
                           focus:border-[#48A88B]/50 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#5A6E84] block mb-1">API 金鑰</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)}
                placeholder="sk-…  (輸入您的 API Key)"
                className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                           text-[12px] text-[#2B3A52] font-mono outline-none
                           focus:border-[#48A88B]/50 transition-all" />
            </div>
          </div>
          <button onClick={handleTest}
            disabled={testStatus === 'testing'}
            className="mt-3 w-full py-2.5 rounded-xl text-[12px] font-black flex items-center justify-center gap-2
                       bg-gradient-to-br from-[#3A648C] to-[#2A4A6C] text-white
                       hover:shadow-lg active:scale-[.98] disabled:opacity-60 transition-all">
            {testStatus === 'testing'
              ? <><RefreshCw size={13} className="animate-spin" /> 測試連線中…</>
              : testStatus === 'ok'
              ? <><CheckCircle2 size={13} className="text-[#7DFFCA]" /> 連線成功！</>
              : testStatus === 'fail'
              ? <><AlertCircle size={13} className="text-red-300" /> 連線失敗，請檢查設定</>
              : <><Wifi size={13} /> 測試連線</>}
          </button>
          {testStatus === 'ok' && (
            <div className="mt-2 p-3 bg-[#E8F8F3] rounded-xl border border-[#48A88B]/25">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[#48A88B]">
                <CheckCircle2 size={12} />
                連線正常 · 延遲 42ms · {envType === 'cloud' ? 'GPT-4o 可用' : '本機模型已就緒'}
              </div>
            </div>
          )}
        </SectionCard>

        {envType === 'local' && (
          <SectionCard title="本機模型管理" icon={<HardDrive size={14} />}>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Llama 3.1 8B', size: '4.7 GB', status: '已安裝' },
                { name: 'Phi-3 Mini', size: '2.3 GB', status: '已安裝' },
                { name: 'Mistral 7B', size: '4.1 GB', status: '未安裝' },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-3 px-3 py-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2EAF2]">
                  <div className={`w-2 h-2 rounded-full ${m.status === '已安裝' ? 'bg-[#48A88B]' : 'bg-[#D8E4EE]'}`} />
                  <span className="text-[11px] font-bold text-[#2B3A52] flex-1">{m.name}</span>
                  <span className="text-[9px] text-[#8A9BB0]">{m.size}</span>
                  <button className={`text-[9px] font-black px-2 py-1 rounded-lg transition-all ${
                    m.status === '已安裝'
                      ? 'bg-[#E8F8F3] text-[#48A88B]'
                      : 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white hover:shadow-sm'
                  }`}>
                    {m.status === '已安裝' ? '✓ 已安裝' : '下載安裝'}
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
  );
}

function ToggleRow({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-[#F0F4F8] last:border-0">
      <div>
        <p className="text-[11px] font-bold text-[#2B3A52]">{label}</p>
        <p className="text-[9px] text-[#8A9BB0]">{desc}</p>
      </div>
      <button onClick={() => onChange(!value)}
        className={`w-10 h-5.5 rounded-full relative transition-all ${value ? 'bg-[#48A88B]' : 'bg-[#D8E4EE]'}`}
        style={{ minWidth: 40, height: 22 }}>
        <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-all ${
          value ? 'left-[19px]' : 'left-[2px]'
        }`} />
      </button>
    </div>
  );
}

// ─── Tab: Online Environment (線上環境) ──────────────────────────────────────

const mockInstances = [
  { id: 'i-001', name: '教案生成工作站', model: 'GPT-4o', status: 'running' as const, cpu: 34, mem: 61, cost: 0.24 },
  { id: 'i-002', name: '評量批改助手', model: 'Claude 3.5', status: 'running' as const, cpu: 78, mem: 82, cost: 0.51 },
  { id: 'i-003', name: '圖像生成伺服器', model: 'DALL·E 3', status: 'paused' as const, cpu: 0, mem: 12, cost: 0 },
];

function OnlineTab() {
  const [instances, setInstances] = useState(mockInstances);

  const toggleInstance = (id: string) => {
    setInstances(prev => prev.map(i =>
      i.id === id ? { ...i, status: i.status === 'running' ? 'paused' : 'running' } : i
    ));
  };

  const totalCost = instances.reduce((s, i) => s + i.cost, 0);
  const runningCount = instances.filter(i => i.status === 'running').length;

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 shrink-0">
        {[
          { label: '運行中', value: runningCount.toString(), unit: '個實例', icon: <Activity size={16} />, color: '#48A88B' },
          { label: '今日用量', value: '12,841', unit: 'tokens', icon: <Zap size={16} />, color: '#3A648C' },
          { label: '今日費用', value: `$${totalCost.toFixed(2)}`, unit: 'USD', icon: <BarChart3 size={16} />, color: '#F3CC58' },
          { label: '回應速度', value: '0.8s', unit: '平均', icon: <Monitor size={16} />, color: '#9B59B6' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/85 backdrop-blur rounded-2xl border border-[#E2EAF2] p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span style={{ color: stat.color }}>{stat.icon}</span>
              <span className="text-[10px] font-bold text-[#8A9BB0]">{stat.label}</span>
            </div>
            <p className="text-[20px] font-black text-[#1A2E4A]">{stat.value}</p>
            <p className="text-[9px] text-[#8A9BB0]">{stat.unit}</p>
          </div>
        ))}
      </div>

      {/* Instances */}
      <SectionCard title="運行實例" icon={<Server size={14} />}>
        <div className="flex flex-col gap-2">
          {instances.map(inst => (
            <div key={inst.id}
              className="flex items-center gap-4 px-4 py-3 bg-[#F8FAFC] rounded-xl border border-[#E2EAF2] hover:border-[#48A88B]/30 transition-all">
              <div className={`w-2.5 h-2.5 rounded-full ${inst.status === 'running' ? 'bg-[#48A88B] animate-pulse' : 'bg-[#D8E4EE]'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[12px] font-black text-[#2B3A52]">{inst.name}</p>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    inst.status === 'running' ? 'bg-[#E8F8F3] text-[#48A88B]' : 'bg-[#F0F4F8] text-[#8A9BB0]'
                  }`}>
                    {inst.status === 'running' ? '運行中' : '已暫停'}
                  </span>
                </div>
                <p className="text-[10px] text-[#8A9BB0]">{inst.model} · {inst.id}</p>
              </div>

              {inst.status === 'running' && (
                <div className="flex items-center gap-4">
                  <MiniUsage label="CPU" value={inst.cpu} color={inst.cpu > 70 ? '#E74C3C' : '#48A88B'} />
                  <MiniUsage label="記憶體" value={inst.mem} color={inst.mem > 80 ? '#E74C3C' : '#3A648C'} />
                  <div className="text-center">
                    <p className="text-[10px] font-black text-[#2B3A52]">${inst.cost.toFixed(2)}/hr</p>
                    <p className="text-[9px] text-[#8A9BB0]">費用</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5">
                <button onClick={() => toggleInstance(inst.id)}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                    inst.status === 'running'
                      ? 'bg-[#FFF8E1] text-[#C8A030] hover:bg-[#F3CC58]/30'
                      : 'bg-[#E8F8F3] text-[#48A88B] hover:bg-[#48A88B]/20'
                  }`}>
                  {inst.status === 'running' ? <Pause size={13} /> : <Play size={13} />}
                </button>
                <button
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#FFF0F0] text-red-400 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Add instance */}
          <button className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[#48A88B]/30
                             text-[11px] font-black text-[#48A88B] hover:border-[#48A88B] hover:bg-[#E8F8F3]
                             transition-all active:scale-[.98]">
            <Plus size={14} /> 新增實例
          </button>
        </div>
      </SectionCard>

      {/* Activity log */}
      <SectionCard title="近期活動紀錄" icon={<Activity size={14} />}>
        <div className="flex flex-col gap-1.5">
          {[
            { time: '14:32', msg: 'GPT-4o 完成「三年級數學教案」生成（1,247 tokens）', ok: true },
            { time: '14:28', msg: 'Claude 3.5 完成批改第三組評量作業（892 tokens）', ok: true },
            { time: '14:15', msg: '圖像生成實例已暫停（閒置超過 30 分鐘）', ok: false },
            { time: '13:58', msg: 'GPT-4o 完成「聯絡簿回饋」10 筆生成（456 tokens）', ok: true },
            { time: '13:41', msg: '環境自動故障轉移：從 AWS 東京 → GCP 台灣', ok: false },
          ].map((log, i) => (
            <div key={i} className="flex items-start gap-2 px-3 py-2 rounded-lg hover:bg-[#F8FAFC] transition-all">
              <span className="text-[9px] font-bold text-[#8A9BB0] shrink-0 mt-0.5 w-10">{log.time}</span>
              <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${log.ok ? 'bg-[#48A88B]' : 'bg-[#F3CC58]'}`} />
              <span className="text-[10px] text-[#5A6E84]">{log.msg}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function MiniUsage({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-[52px]">
      <div className="w-full h-1.5 bg-[#E2EAF2] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <p className="text-[9px] font-black text-[#2B3A52]">{value}%</p>
      <p className="text-[9px] text-[#8A9BB0]">{label}</p>
    </div>
  );
}

// ─── Upload Flow Modal ─────────────────────────────────────────────────────────

const UPLOAD_STEPS = ['選擇類型', '填寫資訊', '上傳內容', '發布'];

function UploadModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [workType, setWorkType] = useState('');
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [desc, setDesc] = useState('');
  const [aiTool, setAiTool] = useState('GPT-4o');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');

  const canNext = [
    !!workType,
    !!(title && subject && grade),
    !!content,
    true,
  ][step];

  const handlePublish = () => {
    // Mock publish
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[400] bg-[#1A2E4A]/50 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}>
      <div className="bg-white rounded-[24px] w-full max-w-[560px] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#E2EAF2]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-black text-[#1A2E4A]">📤 上傳 AI 作品</h2>
            <button onClick={onClose}
              className="w-8 h-8 rounded-xl bg-[#F0F4F8] flex items-center justify-center text-[#8A9BB0] hover:text-[#3A648C]">
              <X size={14} />
            </button>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {UPLOAD_STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                  i < step ? 'bg-[#48A88B] text-white' :
                  i === step ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md' :
                  'bg-[#F0F4F8] text-[#8A9BB0]'
                }`}>
                  {i < step ? <Check size={11} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold ${i === step ? 'text-[#3A648C]' : 'text-[#8A9BB0]'}`}>{s}</span>
                {i < UPLOAD_STEPS.length - 1 && (
                  <ArrowRight size={12} className={i < step ? 'text-[#48A88B]' : 'text-[#D8E4EE]'} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 min-h-[240px]">
          {step === 0 && (
            <div>
              <p className="text-[12px] font-bold text-[#5A6E84] mb-3">請選擇您的 AI 作品類型：</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: '教案', icon: '📐', desc: 'AI 輔助設計的課堂教案' },
                  { type: '行政軟體', icon: '📋', desc: '教學行政自動化工具' },
                  { type: '教學素材', icon: '📖', desc: '教學用圖文素材包' },
                  { type: '評量設計', icon: '📝', desc: '考卷、測驗、評量單' },
                  { type: '課程規劃', icon: '🗺️', desc: '學期或單元課程地圖' },
                  { type: '其他', icon: '✨', desc: '其他 AI 輔助教學成果' },
                ].map(({ type, icon, desc }) => (
                  <button key={type} onClick={() => setWorkType(type)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      workType === type
                        ? 'border-[#48A88B] bg-[#E8F8F3] shadow-sm'
                        : 'border-[#E2EAF2] bg-[#F8FAFC] hover:border-[#48A88B]/40'
                    }`}>
                    <div className="text-2xl mb-1">{icon}</div>
                    <p className="text-[11px] font-black text-[#2B3A52]">{type}</p>
                    <p className="text-[9px] text-[#8A9BB0] mt-0.5">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-3">
              <FormField label="作品標題 *">
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="例：三年級分數加法互動教案（GPT-4o）"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                             text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50 transition-all" />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="學科 *">
                  <select value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                               text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50">
                    <option value="">選擇學科</option>
                    {['數學', '國語', '英語', '自然', '社會', '藝術', '健康', '班級行政', '跨領域'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="年級 *">
                  <select value={grade} onChange={e => setGrade(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                               text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50">
                    <option value="">選擇年級</option>
                    {['一年級', '二年級', '三年級', '四年級', '五年級', '六年級', '七年級', '八年級', '九年級', '全年級', '跨年級'].map(g => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </FormField>
              </div>
              <FormField label="使用的 AI 工具">
                <div className="flex flex-wrap gap-1.5">
                  {['GPT-4o', 'GPT-4o mini', 'Claude 3.5', 'Gemini 1.5', 'DALL·E 3', '其他'].map(t => (
                    <button key={t} onClick={() => setAiTool(t)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        aiTool === t
                          ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white border-transparent'
                          : 'bg-white text-[#3A648C] border-[#3A648C]/20 hover:border-[#3A648C]/50'
                      }`}>{t}</button>
                  ))}
                </div>
              </FormField>
              <FormField label="簡介">
                <textarea value={desc} onChange={e => setDesc(e.target.value)}
                  rows={2} placeholder="簡短描述這份作品的特色與使用方式…"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                             text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50 resize-none transition-all" />
              </FormField>
              <FormField label="標籤（以逗號分隔）">
                <input value={tags} onChange={e => setTags(e.target.value)}
                  placeholder="例：分數, 遊戲化, 差異化教學"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                             text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50 transition-all" />
              </FormField>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="border-2 border-dashed border-[#48A88B]/40 rounded-2xl p-6 text-center
                              hover:border-[#48A88B] hover:bg-[#E8F8F3]/30 transition-all cursor-pointer">
                <div className="text-3xl mb-2">📎</div>
                <p className="text-[12px] font-black text-[#3A648C]">拖曳檔案到這裡或點擊上傳</p>
                <p className="text-[10px] text-[#8A9BB0] mt-1">支援 PDF、DOCX、PPTX、Google Docs 連結</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#5A6E84] mb-2">或貼上 AI 生成內容：</p>
                <textarea value={content} onChange={e => setContent(e.target.value)}
                  rows={6} placeholder="將您的 AI 生成教案、軟體程式碼、素材等內容貼在這裡…"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2EAF2]
                             text-[12px] text-[#2B3A52] outline-none focus:border-[#48A88B]/50 resize-none transition-all" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-4 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#48A88B] to-[#3A648C] flex items-center justify-center shadow-lg">
                <CheckCircle2 size={32} className="text-white" />
              </div>
              <div>
                <p className="text-[16px] font-black text-[#1A2E4A] mb-1">準備發布！</p>
                <p className="text-[12px] text-[#5A6E84]">您的作品將在審核後出現在 AI 作品廣場</p>
              </div>
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2EAF2] p-4 text-left w-full">
                <div className="flex flex-col gap-1.5">
                  <SummaryRow label="類型" value={workType} />
                  <SummaryRow label="標題" value={title || '（未填寫）'} />
                  <SummaryRow label="學科" value={`${subject || '—'} · ${grade || '—'}`} />
                  <SummaryRow label="AI 工具" value={aiTool} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2EAF2] flex items-center justify-between">
          <button onClick={() => step > 0 ? setStep(s => s - 1) : onClose()}
            className="px-4 py-2 rounded-xl text-[12px] font-black text-[#3A648C]
                       bg-[#F0F4F8] hover:bg-[#E2EAF2] active:scale-95 transition-all">
            {step === 0 ? '取消' : '上一步'}
          </button>
          <div className="flex items-center gap-1.5">
            {UPLOAD_STEPS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === step ? 'bg-[#48A88B] w-4' : 'bg-[#D8E4EE]'}`} />
            ))}
          </div>
          <button onClick={() => step < 3 ? setStep(s => s + 1) : handlePublish()}
            disabled={!canNext}
            className="px-5 py-2 rounded-xl text-[12px] font-black text-white
                       bg-gradient-to-br from-[#48A88B] to-[#3A648C]
                       hover:shadow-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            {step === 3 ? '🚀 發布' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] font-bold text-[#5A6E84] block mb-1">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-[#8A9BB0] w-12 shrink-0">{label}</span>
      <span className="text-[11px] font-black text-[#2B3A52]">{value}</span>
    </div>
  );
}

// ─── Shared: Section Card ─────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="bg-white/85 backdrop-blur rounded-2xl border border-[#E2EAF2] shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#F0F4F8]">
        <span className="text-[#48A88B]">{icon}</span>
        <span className="text-[12px] font-black text-[#3A648C]">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface TeacherAISharePageProps {
  onBack?: () => void;
}

const TABS: { id: TabId; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'gallery', label: 'AI 作品廣場', icon: <Share2 size={15} />, desc: '瀏覽與分享教師 AI 作品' },
  { id: 'model',   label: '模型配置',   icon: <BrainCircuit size={15} />, desc: '選擇並設定 AI 模型' },
  { id: 'env',     label: '環境設定',   icon: <Settings size={15} />, desc: '本機、雲端或混合環境' },
  { id: 'online',  label: '線上環境',   icon: <Monitor size={15} />, desc: '即時監控與資源管理' },
];

export function TeacherAISharePage({ onBack: _onBack }: TeacherAISharePageProps) {
  const [activeTab, setActiveTab] = useState<TabId>('gallery');
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <div className="flex flex-col h-full min-h-0 overflow-hidden">

        {/* ── Page Header ── */}
        <div className="shrink-0 px-5 pt-4 pb-0">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#48A88B] to-[#3A648C]
                              flex items-center justify-center shadow-md">
                <Sparkles size={17} className="text-white" />
              </div>
              <div>
                <h1 className="text-[16px] font-black text-[#1A2E4A] leading-tight">教師 AI 共創平台</h1>
                <p className="text-[10px] text-[#8A9BB0]">分享 AI 作品 · 配置模型 · 管理環境</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E8F8F3] border border-[#48A88B]/25">
                <div className="w-1.5 h-1.5 rounded-full bg-[#48A88B] animate-pulse" />
                <span className="text-[10px] font-black text-[#48A88B]">6 位老師在線</span>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-white/60 backdrop-blur rounded-2xl p-1 border border-[#E2EAF2]">
            {TABS.map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-md'
                    : 'text-[#5A6E84] hover:bg-white/60 hover:text-[#3A648C]'
                }`}>
                <span className={activeTab === tab.id ? 'text-white' : 'text-[#8A9BB0]'}>{tab.icon}</span>
                <span className="text-[11px] font-black whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1 min-h-0 px-5 py-4 overflow-hidden">
          {activeTab === 'gallery' && <GalleryTab onUploadClick={() => setShowUpload(true)} />}
          {activeTab === 'model'   && <ModelTab />}
          {activeTab === 'env'     && <EnvTab />}
          {activeTab === 'online'  && <OnlineTab />}
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </>
  );
}
