import User from '../../imports/User-360-13';
import Heart from '../../imports/Heart';
import Eye from '../../imports/Eye';
import { useState, useRef, useCallback } from "react";

interface CreativePageProps {
  onModeSelect?: (mode: "t2i" | "i2i") => void;
}

type Category =
  | "all"
  | "picture-book"
  | "game"
  | "novel"
  | "movie"
  | "image";

type Work = {
  id: number;
  title: string;
  author: string;
  category: Category;
  award: string;
  coverEmoji: string;
  coverImage: string;
  description: string;
  likes: number;
  views: number;
  gradient: string;
  isOwn?: boolean;
  htmlContent?: string;
};

const studentWorks: Work[] = [
  {
    id: 1,
    title: "森林裡的秘密",
    author: "林小明",
    category: "picture-book",
    award: "🏆 金獎",
    coverEmoji: "🌳",
    coverImage: "",
    description: "一個關於友誼與勇氣的溫馨繪本故事",
    likes: 245,
    views: 1203,
    gradient: "from-[#A8E6CF] to-[#78C2A4]",
  },
  {
    id: 2,
    title: "星際冒險王",
    author: "王小華",
    category: "game",
    award: "🥇 特優",
    coverEmoji: "🚀",
    coverImage: "",
    description: "結合程式邏輯的太空冒險遊戲",
    likes: 382,
    views: 2150,
    gradient: "from-[#FFD3A5] to-[#FD6585]",
  },
  {
    id: 3,
    title: "時空旅行者",
    author: "陳小芳",
    category: "novel",
    award: "🥈 優等",
    coverEmoji: "⏰",
    coverImage: "",
    description: "穿越時空的奇幻冒險小說",
    likes: 198,
    views: 856,
    gradient: "from-[#C4A5F5] to-[#9B7FD8]",
  },
  {
    id: 4,
    title: "勇敢的小企鵝",
    author: "張小強",
    category: "movie",
    award: "🎬 最佳影片",
    coverEmoji: "🐧",
    coverImage: "",
    description: "定格動畫短片，講述企鵝的成長故事",
    likes: 421,
    views: 3102,
    gradient: "from-[#89D4F7] to-[#5BA3D0]",
  },
  {
    id: 5,
    title: "魔法花園",
    author: "李小美",
    category: "picture-book",
    award: "🥉 佳作",
    coverEmoji: "🌸",
    coverImage: "",
    description: "充滿想像力的奇幻花園繪本",
    likes: 167,
    views: 743,
    gradient: "from-[#FFB6C1] to-[#FF85A2]",
  },
  {
    id: 6,
    title: "數字大冒險",
    author: "劉小勇",
    category: "game",
    award: "🎮 創意獎",
    coverEmoji: "🔢",
    coverImage: "",
    description: "寓教於樂的數學解謎遊戲",
    likes: 289,
    views: 1567,
    gradient: "from-[#F3CC58] to-[#D4A030]",
  },
  {
    id: 7,
    title: "海底王國",
    author: "周小玲",
    category: "novel",
    award: "",
    coverEmoji: "🐠",
    coverImage: "",
    description: "探索神秘海底世界的奇幻故事",
    likes: 134,
    views: 621,
    gradient: "from-[#48A88B] to-[#3A7A68]",
  },
  {
    id: 8,
    title: "小鎮的故事",
    author: "黃小傑",
    category: "movie",
    award: "📹 人氣獎",
    coverEmoji: "🏘️",
    coverImage: "",
    description: "紀錄家鄉小鎮的溫暖短片",
    likes: 356,
    views: 2234,
    gradient: "from-[#FFDAA8] to-[#FFB347]",
  },
  {
    id: 9,
    title: "晨光中的貓",
    author: "吳小晴",
    category: "image",
    award: "📷 最佳攝影",
    coverEmoji: "🐱",
    coverImage: "",
    description: "捕捉清晨陽光灑落的溫柔瞬間",
    likes: 312,
    views: 1890,
    gradient: "from-[#FDE8C8] to-[#F9A66C]",
  },
  {
    id: 10,
    title: "城市幾何",
    author: "蔡小宇",
    category: "image",
    award: "🎨 創意獎",
    coverEmoji: "🏙️",
    coverImage: "",
    description: "用鏡頭發現城市建築中的幾何美學",
    likes: 278,
    views: 1435,
    gradient: "from-[#B8D4FF] to-[#7AA8F0]",
  },
];

/* ─── Upload Modal ─── */
function UploadModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (work: Omit<Work, "id" | "likes" | "views" | "coverEmoji" | "gradient" | "isOwn">) => void;
}) {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverDragging, setCoverDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<Category>("image");
  const [htmlContent, setHtmlContent] = useState("");
  const [htmlFileName, setHtmlFileName] = useState("");
  const [htmlDragging, setHtmlDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ cover?: string; title?: string }>({});
  const coverRef = useRef<HTMLInputElement>(null);
  const htmlRef = useRef<HTMLInputElement>(null);

  const handleCoverFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCoverPreview(URL.createObjectURL(file));
    setErrors((e) => ({ ...e, cover: undefined }));
  }, []);

  const handleHtmlFile = useCallback((file: File) => {
    const name = file.name.toLowerCase();
    if (!name.endsWith(".html") && !name.endsWith(".htm")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setHtmlContent(e.target?.result as string);
      setHtmlFileName(file.name);
    };
    reader.readAsText(file);
  }, []);

  const handleSubmit = () => {
    const errs: { cover?: string; title?: string } = {};
    if (!coverPreview) errs.cover = "請上傳封面圖片（必填）";
    if (!title.trim()) errs.title = "請填寫主題名稱（必填）";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        onSubmit({
          title: title.trim(),
          author: "我",
          category,
          award: "",
          coverImage: coverPreview!,
          description: desc.trim() || "（無說明）",
          htmlContent: htmlContent || undefined,
        });
        onClose();
      }, 800);
    }, 1100);
  };

  const catOptions: { id: Category; label: string }[] = [
    { id: "novel", label: "📖 小說" },
    { id: "image", label: "🖼️ 圖片" },
    { id: "picture-book", label: "📚 繪本" },
    { id: "movie", label: "🎬 電影" },
    { id: "game", label: "🎮 遊戲" },
  ];

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-6"
      style={{ background: "rgba(20,35,55,0.55)", backdropFilter: "blur(10px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-[28px] shadow-[0_24px_80px_rgba(26,46,74,0.3)] w-full max-w-[680px] flex flex-col overflow-hidden"
        style={{ border: "1.5px solid rgba(255,255,255,0.9)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4">
          <div>
            <h3 className="text-[18px] font-black text-[#2b3a52]">🌟 投稿我的創作</h3>
            <p className="text-[11px] text-[#8AACC8] mt-0.5">上傳作品至展示區，與同學分享</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[18px] text-[#7a8ba0] hover:bg-[#f0f4f8] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-7 pb-6 flex gap-5">
          {/* Left: Cover upload */}
          <div className="flex flex-col gap-3 w-[260px] flex-shrink-0">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-[#3A648C]">
                封面圖片 <span className="text-red-400">*</span>
              </label>
              <div
                onClick={() => coverRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setCoverDragging(true); }}
                onDragLeave={() => setCoverDragging(false)}
                onDrop={(e) => { e.preventDefault(); setCoverDragging(false); const f = e.dataTransfer.files[0]; if (f) handleCoverFile(f); }}
                className="relative w-full h-[180px] rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center group"
                style={{
                  border: errors.cover ? "2px dashed #E05C5C" : coverPreview ? "none" : "2px dashed rgba(58,100,140,0.3)",
                  background: coverPreview ? "transparent" : coverDragging ? "rgba(58,100,140,0.08)" : "rgba(220,240,255,0.4)",
                }}
              >
                {coverPreview ? (
                  <>
                    <img src={coverPreview} alt="封面" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white text-[12px] font-black drop-shadow">🖼️ 更換封面</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2.5">
                    <span className="text-[32px]">🖼️</span>
                    <div className="text-center">
                      <p className="text-[12px] font-black text-[#3A648C]">點擊或拖曳上傳封面</p>
                      <p className="text-[10px] text-[#8AACC8] mt-0.5">必填・PNG、JPG、GIF</p>
                    </div>
                  </div>
                )}
              </div>
              {errors.cover && <p className="text-[11px] text-red-500 font-medium">⚠ {errors.cover}</p>}
              <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverFile(f); }} />
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-black text-[#3A648C]">類別</label>
              <div className="flex flex-wrap gap-1.5">
                {catOptions.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all active:scale-95"
                    style={{
                      background: category === cat.id ? "#3A648C" : "rgba(58,100,140,0.08)",
                      color: category === cat.id ? "#fff" : "#5A7A9A",
                      border: `1.5px solid ${category === cat.id ? "#3A648C" : "transparent"}`,
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Text fields + tips */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black text-[#3A648C]">
                主題 <span className="text-red-400">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setErrors((v) => ({ ...v, title: undefined })); }}
                placeholder="例：星際冒險王"
                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] text-[#2b3a52] placeholder-[#B0C4D8] outline-none transition-all"
                style={{ background: "rgba(220,240,255,0.5)", border: errors.title ? "1.5px solid #E05C5C" : "1.5px solid rgba(58,100,140,0.2)" }}
                onFocus={(e) => (e.target.style.border = "1.5px solid rgba(58,100,140,0.6)")}
                onBlur={(e) => (e.target.style.border = errors.title ? "1.5px solid #E05C5C" : "1.5px solid rgba(58,100,140,0.2)")}
              />
              {errors.title && <p className="text-[11px] text-red-500 font-medium">⚠ {errors.title}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black text-[#3A648C]">說明</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="簡單介紹你的作品…"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] text-[#2b3a52] placeholder-[#B0C4D8] outline-none resize-none transition-all"
                style={{ background: "rgba(220,240,255,0.5)", border: "1.5px solid rgba(58,100,140,0.2)" }}
                onFocus={(e) => (e.target.style.border = "1.5px solid rgba(58,100,140,0.6)")}
                onBlur={(e) => (e.target.style.border = "1.5px solid rgba(58,100,140,0.2)")}
              />
            </div>

            {/* HTML Attachment */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-black text-[#3A648C]">附件內容（HTML）</label>
              <div
                onClick={() => htmlRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setHtmlDragging(true); }}
                onDragLeave={() => setHtmlDragging(false)}
                onDrop={(e) => { e.preventDefault(); setHtmlDragging(false); const f = e.dataTransfer.files[0]; if (f) handleHtmlFile(f); }}
                className="relative w-full rounded-xl flex items-center gap-3 px-3.5 py-2.5 cursor-pointer transition-all"
                style={{
                  background: htmlContent ? "rgba(72,168,139,0.07)" : htmlDragging ? "rgba(58,100,140,0.08)" : "rgba(220,240,255,0.4)",
                  border: htmlContent ? "1.5px solid rgba(72,168,139,0.4)" : "1.5px dashed rgba(58,100,140,0.25)",
                }}
              >
                <span className="text-[20px] flex-shrink-0">{htmlContent ? "📄" : "📎"}</span>
                <div className="flex-1 min-w-0">
                  {htmlContent ? (
                    <>
                      <p className="text-[12px] font-black text-[#2A7A60] truncate">{htmlFileName}</p>
                      <p className="text-[10px] text-[#48A88B]">已載入・點擊更換</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[12px] font-bold text-[#5A7A9A]">點擊或拖曳上傳 HTML 檔案</p>
                      <p className="text-[10px] text-[#A8C4D8]">支援 .html / .htm</p>
                    </>
                  )}
                </div>
                {htmlContent && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setHtmlContent(""); setHtmlFileName(""); }}
                    className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-400 text-[10px] font-black hover:bg-red-200 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
              <input ref={htmlRef} type="file" accept=".html,.htm" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleHtmlFile(f); }} />
            </div>

            {/* Tips */}
            <div className="rounded-xl p-3 flex flex-col gap-1.5" style={{ background: "rgba(72,168,139,0.08)", border: "1px solid rgba(72,168,139,0.15)" }}>
              <p className="text-[11px] font-black text-[#2A7A60]">📋 投稿須知</p>
              {["封面圖片和主題為必填欄位", "上 HTML 檔後，瀏覽者可直接互動體驗", "作品上傳後將進入審核，通過後公開展示"].map((tip, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#48A88B] text-[10px] font-bold mt-px">•</span>
                  <span className="text-[11px] text-[#3A7A65] leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-7 py-4"
          style={{ borderTop: "1px solid rgba(58,100,140,0.1)", background: "rgba(248,252,255,0.9)" }}
        >
          <button onClick={onClose} className="px-5 py-2 rounded-xl text-[12px] font-bold text-[#7a8ba0] hover:bg-[rgba(58,100,140,0.08)] transition-all">
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || submitted}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl text-white text-[13px] font-black transition-all active:scale-95 disabled:cursor-not-allowed"
            style={{
              background: submitted ? "linear-gradient(135deg,#48A88B,#2A7A60)" : "linear-gradient(135deg,#3A648C,#2A5070)",
              boxShadow: "0 4px 16px rgba(58,100,140,0.3)",
              opacity: submitting || submitted ? 0.85 : 1,
            }}
          >
            {submitted ? "✅ 上傳成功！" : submitting ? "⏳ 上傳中…" : "☁️ 確認上傳"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreativePage({
  onModeSelect,
}: CreativePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [viewingWork, setViewingWork] = useState<Work | null>(null);
  const [activeTab, setActiveTab] = useState<"gallery" | "my-works">("gallery");
  const [showUpload, setShowUpload] = useState(false);
  const [myWorks, setMyWorks] = useState<Work[]>([]);
  const nextId = useRef(200);

  const handleUploadSubmit = (data: Omit<Work, "id" | "likes" | "views" | "coverEmoji" | "gradient" | "isOwn">) => {
    setMyWorks((prev) => [
      {
        ...data,
        id: nextId.current++,
        likes: 0,
        views: 0,
        coverEmoji: "✨",
        gradient: "from-[#DCF0FF] to-[#C8F0EA]",
        isOwn: true,
      },
      ...prev,
    ]);
    setActiveTab("my-works");
  };

  const sourceWorks = activeTab === "gallery" ? studentWorks : myWorks;

  const categories = [
    { id: "all" as Category, label: "全部作品", icon: "✨", count: sourceWorks.length },
    { id: "novel" as Category, label: "小說", icon: "📖", count: sourceWorks.filter((w) => w.category === "novel").length },
    { id: "image" as Category, label: "圖片", icon: "🖼️", count: sourceWorks.filter((w) => w.category === "image").length },
    { id: "picture-book" as Category, label: "繪本", icon: "📚", count: sourceWorks.filter((w) => w.category === "picture-book").length },
    { id: "movie" as Category, label: "電影", icon: "🎬", count: sourceWorks.filter((w) => w.category === "movie").length },
    { id: "game" as Category, label: "遊戲", icon: "🎮", count: sourceWorks.filter((w) => w.category === "game").length },
  ];

  const filteredWorks =
    selectedCategory === "all"
      ? sourceWorks
      : sourceWorks.filter((work) => work.category === selectedCategory);

  const sortedWorks = [...filteredWorks].sort((a, b) => {
    if (a.award && !b.award) return -1;
    if (!a.award && b.award) return 1;
    return b.likes - a.likes;
  });

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes cardPop {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes mascotFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0.5; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .page-fade-in {
          animation: fadeIn 0.6s ease-out both;
        }
        .category-slide {
          animation: slideIn 0.5s ease-out both;
        }
        .work-card {
          animation: cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .mascot-bounce {
          animation: mascotFloat 3s ease-in-out infinite;
        }
        .sparkle-icon {
          animation: sparkle 2s ease-in-out infinite;
        }
        .works-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .works-scroll::-webkit-scrollbar-track {
          background: rgba(72,168,139,0.1);
          border-radius: 99px;
        }
        .works-scroll::-webkit-scrollbar-thumb {
          background: #A8E0D0;
          border-radius: 99px;
        }
      `}</style>

      <section className="page-fade-in h-full flex flex-col px-8 py-6 relative overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(72,168,139,0.08) 0%, transparent 60%)",
          }}
        ></div>

        {/* Floating Sparks */}
        <span
          className="sparkle-icon absolute text-[14px] pointer-events-none z-[1]"
          style={{ top: "12%", right: "12%", animationDelay: "0.8s" }}
        >
          ⭐
        </span>
        <span
          className="sparkle-icon absolute text-[12px] pointer-events-none z-[1]"
          style={{ bottom: "20%", right: "18%", animationDelay: "1.6s" }}
        >
          💫
        </span>

        {/* Header */}
        <div className="relative z-10 text-center m-[0px]">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#48A88B]/15 to-[#F3CC58]/15 border-[1.5px] border-[#48A88B]/30 rounded-[20px] px-4 py-[6px] text-[13px] font-black text-[#3A648C] absolute top-[10px] left-[212px] mx-[0px] my-[31px]">
            <span className="sparkle-icon">🌟</span>{" "}
            學生創作工坊
          </div>
          <h1 className="text-[32px] font-black text-[#3A648C] tracking-tight text-left mx-[0px] my-[32px]">
            優秀作品展示
          </h1>

          {/* Tab switcher + Upload button — absolute to top-right of header */}
          <div className="absolute top-[10px] right-0 flex items-center gap-2">
            {/* Tab toggle */}
            <div className="flex items-center p-[3px] rounded-[14px] gap-0.5" style={{ background: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(58,100,140,0.15)", boxShadow: "0 2px 8px rgba(60,120,140,0.08)" }}>
              {(["gallery", "my-works"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-3.5 py-1.5 rounded-[11px] text-[11px] font-black transition-all duration-200 active:scale-95"
                  style={{
                    background: activeTab === tab ? "#3A648C" : "transparent",
                    color: activeTab === tab ? "#fff" : "#7a8ba0",
                    boxShadow: activeTab === tab ? "0 2px 8px rgba(58,100,140,0.3)" : "none",
                  }}
                >
                  {tab === "gallery" ? "作品展區" : "我的創作"}
                </button>
              ))}
            </div>
            {/* Upload button */}
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[14px] text-white text-[11px] font-black transition-all hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg,#48A88B,#3A648C)", boxShadow: "0 3px 12px rgba(58,100,140,0.3)" }}
            >
              ＋ 投稿作品
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-slide relative z-10 flex gap-3 overflow-x-auto px-[0px] py-[8px] mx-[0px] mt-[8px] mb-[32px]">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative flex-shrink-0 flex flex-col items-center gap-1.5 rounded-[20px] text-[13px] font-black cursor-pointer transition-all border-[1.5px] min-w-[72px] ${selectedCategory === cat.id ? "bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white border-transparent shadow-[0_4px_16px_rgba(72,168,139,0.35)]" : "bg-white/80 text-[#7A8BA0] border-white/90 hover:bg-white hover:text-[#3A648C]"} px-[20px] py-[10px]`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <span
                className={`absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-black px-1.5 shadow-sm ${
                  selectedCategory === cat.id ? "bg-white text-[#48A88B]" : "bg-[#48A88B] text-white"
                }`}
              >
                {cat.count}
              </span>
              <span className="text-[24px] leading-none">{cat.icon}</span>
              <span className="mt-0.5">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="works-scroll relative z-[4] flex-1 overflow-y-auto pr-2">
          {activeTab === "my-works" && myWorks.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <button
                onClick={() => setShowUpload(true)}
                className="group flex flex-col items-center gap-4 px-12 py-10 rounded-3xl transition-all hover:shadow-[0_8px_32px_rgba(58,100,140,0.18)] hover:-translate-y-1"
                style={{ border: "2px dashed rgba(58,100,140,0.22)", background: "rgba(255,255,255,0.6)" }}
              >
                <span className="text-[48px] group-hover:scale-110 transition-transform inline-block">🎨</span>
                <div className="text-center">
                  <p className="text-[16px] font-black text-[#3A648C]">投稿你的第一件作品</p>
                  <p className="text-[12px] text-[#8AACC8] mt-1">上傳封面、填寫主題，即可投稿！</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 px-[0px] py-[16px]">
              {/* Upload card (my-works tab only) */}
              {activeTab === "my-works" && (
                <button
                  key="upload-card"
                  onClick={() => setShowUpload(true)}
                  className="group work-card flex flex-col items-center justify-center gap-3 rounded-[20px] border-[2px] border-dashed transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(58,100,140,0.15)] min-h-[261px]"
                  style={{ borderColor: "rgba(58,100,140,0.22)", background: "rgba(255,255,255,0.6)" }}
                >
                  <span className="text-[40px] group-hover:scale-110 transition-transform">＋</span>
                  <p className="text-[12px] font-black text-[#3A648C]">投稿新作品</p>
                </button>
              )}
              {sortedWorks.map((work, idx) => (
                <div
                  key={work.id}
                  className="work-card group relative bg-white/85 backdrop-blur-md rounded-[20px] border-[1.5px] border-white/90 shadow-[0_4px_20px_rgba(60,120,140,0.12)] overflow-hidden cursor-pointer transition-all hover:translate-y-[-6px] hover:shadow-[0_12px_32px_rgba(60,120,140,0.2)] hover:border-white"
                  style={{ animationDelay: `${idx * 0.08}s` }}
                  onClick={() => setSelectedWork(work)}
                >
                  {/* Award Badge */}
                  {work.award && (
                    <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-[12px] px-2 py-1 text-[10px] font-black shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                      {work.award}
                    </div>
                  )}
                  {/* Own badge */}
                  {work.isOwn && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-[10px] text-[9px] font-black" style={{ background: "rgba(72,168,139,0.85)", color: "#fff" }}>
                      待審核
                    </div>
                  )}

                  {/* Cover */}
                  <div
                    className={`relative h-[140px] bg-gradient-to-br ${work.gradient} flex items-center justify-center text-[56px] transition-transform group-hover:scale-110`}
                  >
                    <div className="absolute inset-0 bg-white/10"></div>
                    {work.coverImage ? (
                      <img
                        src={work.coverImage}
                        alt={work.title}
                        className="absolute inset-0 w-full h-full object-cover z-10"
                      />
                    ) : (
                      <span className="relative z-10">{work.coverEmoji}</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <h3 className="text-[15px] font-black text-[#2B3A52] mb-1 line-clamp-1">
                      {work.title}
                    </h3>
                    <p className="text-[11px] text-[#7A8BA0] font-semibold mb-2 line-clamp-2 leading-[1.5]">
                      {work.description}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#7A8BA0] mb-2">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 relative"><User /></span> {work.author}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-[#7A8BA0]">
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 relative"><Heart /></span> {work.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="inline-block w-4 h-4 relative"><Eye /></span> {work.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mascot */}
        <div className="mascot-bounce absolute bottom-6 right-8 z-[5]">
          <div className="w-[72px] h-[80px] rounded-2xl bg-gradient-to-br from-[#48A88B] to-[#3A648C] flex items-center justify-center text-[36px]" style={{ filter: "drop-shadow(0 8px 20px rgba(72,168,139,0.35))" }}>
            🤖
          </div>
        </div>
      </section>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSubmit={handleUploadSubmit}
        />
      )}

      {/* Detail Modal */}
      {selectedWork && (
        <div
          className="fixed inset-0 z-[100] bg-[#3A648C]/50 backdrop-blur-md flex items-center justify-center p-8"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white rounded-[28px] max-w-[600px] w-full shadow-[0_24px_80px_rgba(26,46,74,0.4)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: "cardPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            {/* Cover */}
            <div
              className={`relative h-[220px] bg-gradient-to-br ${selectedWork.gradient} flex items-center justify-center text-[80px]`}
            >
              {selectedWork.award && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-[16px] px-4 py-2 text-[14px] font-black shadow-[0_3px_12px_rgba(0,0,0,0.15)]">
                  {selectedWork.award}
                </div>
              )}
              {selectedWork.coverImage ? (
                <img
                  src={selectedWork.coverImage}
                  alt={selectedWork.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="relative z-10">{selectedWork.coverEmoji}</span>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-[28px] font-black text-[#2B3A52] mb-2">
                {selectedWork.title}
              </h2>
              <p className="text-[14px] text-[#7A8BA0] font-semibold mb-4">
                作者：{selectedWork.author}
              </p>
              <p className="text-[15px] text-[#4A5568] leading-[1.8] mb-6">
                {selectedWork.description}
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-gradient-to-br from-[#FFE0E0] to-[#FFB8B8] rounded-[16px] px-4 py-3 flex items-center gap-2">
                  <span className="inline-block w-6 h-6 relative"><Heart /></span>
                  <div>
                    <div className="text-[11px] text-[#7A8BA0] font-bold">喜歡數</div>
                    <div className="text-[18px] font-black text-[#FF6B6B]">{selectedWork.likes}</div>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#E0E8FF] to-[#B8CAFF] rounded-[16px] px-4 py-3 flex items-center gap-2">
                  <span className="inline-block w-6 h-6 relative"><Eye /></span>
                  <div>
                    <div className="text-[11px] text-[#7A8BA0] font-bold">觀看數</div>
                    <div className="text-[18px] font-black text-[#5B7FDB]">{selectedWork.views}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-[16px] bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white text-[15px] font-black border-none cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(72,168,139,0.4)]"
                  onClick={() => { setViewingWork(selectedWork); setSelectedWork(null); }}
                >
                  查看完整作品
                </button>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="px-6 py-3 rounded-[16px] bg-[#F5F6F8] text-[#7A8BA0] text-[15px] font-black border-none cursor-pointer transition-all hover:bg-[#E8EFF5]"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Work Viewer Modal */}
      {viewingWork && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ background: "rgba(15,25,45,0.75)", backdropFilter: "blur(14px)" }}
          onClick={() => setViewingWork(null)}
        >
          <div
            className="relative bg-white rounded-[28px] shadow-[0_32px_100px_rgba(26,46,74,0.5)] w-full max-w-[860px] max-h-[90vh] flex flex-col overflow-hidden"
            style={{ border: "1.5px solid rgba(255,255,255,0.9)", animation: "cardPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(58,100,140,0.1)", background: "rgba(248,252,255,0.95)" }}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${viewingWork.gradient} flex items-center justify-center overflow-hidden flex-shrink-0`}>
                  {viewingWork.coverImage ? (
                    <img src={viewingWork.coverImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[24px]">{viewingWork.coverEmoji}</span>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-black text-[#2b3a52]">{viewingWork.title}</p>
                  <p className="text-[11px] text-[#7a8ba0]">作者：{viewingWork.author}　{viewingWork.description}</p>
                </div>
              </div>
              <button
                onClick={() => setViewingWork(null)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[16px] text-[#7a8ba0] hover:bg-[#f0f4f8] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {viewingWork.htmlContent && viewingWork.htmlContent.trim() ? (
                <div className="flex-1 w-full overflow-auto p-8">
                  <div className="bg-gradient-to-br from-[#F8FCFF] to-[#E8F5FF] rounded-2xl p-6 min-h-[65vh] flex flex-col items-center justify-center gap-4">
                    <span className="text-[48px]">📄</span>
                    <div className="text-center">
                      <p className="text-[16px] font-black text-[#3A648C]">HTML 內容已載入</p>
                      <p className="text-[12px] text-[#8AACC8] mt-2">互動式內容將在未來版本中顯示</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* No HTML — show cover + info */
                <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                  <div className={`w-full max-w-[420px] h-[240px] rounded-2xl bg-gradient-to-br ${viewingWork.gradient} overflow-hidden relative flex items-center justify-center text-[80px]`}>
                    {viewingWork.coverImage ? (
                      <img src={viewingWork.coverImage} alt={viewingWork.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <span className="relative z-10">{viewingWork.coverEmoji}</span>
                    )}
                    {viewingWork.award && (
                      <div className="absolute top-3 right-3 bg-white/95 rounded-xl px-3 py-1.5 text-[12px] font-black shadow-lg">
                        {viewingWork.award}
                      </div>
                    )}
                  </div>
                  <div className="text-center max-w-[420px]">
                    <h2 className="text-[22px] font-black text-[#2B3A52] mb-2">{viewingWork.title}</h2>
                    <p className="text-[13px] text-[#7A8BA0] font-semibold mb-3">作者：{viewingWork.author}</p>
                    <p className="text-[14px] text-[#4A5568] leading-[1.8]">{viewingWork.description}</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] text-[#8AACC8]" style={{ background: "rgba(220,240,255,0.6)", border: "1px solid rgba(58,100,140,0.12)" }}>
                    <span>💡</span>
                    <span>此作品未附加 HTML 互動內容</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}