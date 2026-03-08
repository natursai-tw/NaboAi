import { useState } from 'react';
import naboMascot from '../../assets/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';

interface CreativePageProps {
  onModeSelect?: (mode: 't2i' | 'i2i') => void;
}

type Category = 'all' | 'picture-book' | 'game' | 'novel' | 'movie' | 'image';

const studentWorks = [
  {
    id: 1,
    title: '森林裡的秘密',
    author: '林小明',
    category: 'picture-book',
    award: '🏆 金獎',
    coverEmoji: '🌳',
    coverImage: 'https://images.unsplash.com/photo-1771998872950-4bf206f43513?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBtYWdpY2FsJTIwZmFpcnklMjB0YWxlJTIwY2hpbGRyZW4lMjBib29rfGVufDF8fHx8MTc3Mjk0MzQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '一個關於友誼與勇氣的溫馨繪本故事',
    likes: 245,
    views: 1203,
    gradient: 'from-[#A8E6CF] to-[#78C2A4]',
  },
  {
    id: 2,
    title: '星際冒險王',
    author: '王小華',
    category: 'game',
    award: '🥇 特優',
    coverEmoji: '🚀',
    coverImage: 'https://images.unsplash.com/photo-1669028991857-d53d63e7eaf1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGFjZSUyMHJvY2tldCUyMGFkdmVudHVyZSUyMGdhbWUlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzI5NDM0Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '結合程式邏輯的太空冒險遊戲',
    likes: 382,
    views: 2150,
    gradient: 'from-[#FFD3A5] to-[#FD6585]',
  },
  {
    id: 3,
    title: '時空旅行者',
    author: '陳小芳',
    category: 'novel',
    award: '🥈 優等',
    coverEmoji: '⏰',
    coverImage: 'https://images.unsplash.com/photo-1636718008440-e768b548b3ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aW1lJTIwdHJhdmVsJTIwY2xvY2slMjBmYW50YXN5JTIwYWR2ZW50dXJlfGVufDF8fHx8MTc3Mjk0MzQ2OXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '穿越時空的奇幻冒險小說',
    likes: 198,
    views: 856,
    gradient: 'from-[#C4A5F5] to-[#9B7FD8]',
  },
  {
    id: 4,
    title: '勇敢的小企鵝',
    author: '張小強',
    category: 'movie',
    award: '🎬 最佳影片',
    coverEmoji: '🐧',
    coverImage: 'https://images.unsplash.com/photo-1718593381230-7f2dc037f236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwcGVuZ3VpbiUyMHNub3clMjBhZHZlbnR1cmV8ZW58MXx8fHwxNzcyOTQzNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '定格動畫短片，講述企鵝的成長故事',
    likes: 421,
    views: 3102,
    gradient: 'from-[#89D4F7] to-[#5BA3D0]',
  },
  {
    id: 5,
    title: '魔法花園',
    author: '李小美',
    category: 'picture-book',
    award: '🥉 佳作',
    coverEmoji: '🌸',
    coverImage: 'https://images.unsplash.com/photo-1673073529863-9d210d7c10c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWdpYyUyMGdhcmRlbiUyMGZsb3dlcnMlMjBmYW50YXN5JTIwY29sb3JmdWx8ZW58MXx8fHwxNzcyOTQzNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '充滿想像力的奇幻花園繪本',
    likes: 167,
    views: 743,
    gradient: 'from-[#FFB6C1] to-[#FF85A2]',
  },
  {
    id: 6,
    title: '數字大冒險',
    author: '劉小勇',
    category: 'game',
    award: '🎮 創意獎',
    coverEmoji: '🔢',
    coverImage: 'https://images.unsplash.com/photo-1624117987059-f1b8c83edfaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoJTIwbnVtYmVycyUyMHB1enpsZSUyMGdhbWUlMjBraWRzfGVufDF8fHx8MTc3Mjk0MzQ3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '寓教於樂的數學解謎遊戲',
    likes: 289,
    views: 1567,
    gradient: 'from-[#F3CC58] to-[#D4A030]',
  },
  {
    id: 7,
    title: '海底王國',
    author: '周小玲',
    category: 'novel',
    award: '',
    coverEmoji: '🐠',
    coverImage: 'https://images.unsplash.com/photo-1759222859619-8db751c63d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmRlcndhdGVyJTIwb2NlYW4lMjBmaXNoJTIwa2luZ2RvbSUyMGNvbG9yZnVsfGVufDF8fHx8MTc3Mjk0MzQ3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '探索神秘海底世界的奇幻故事',
    likes: 134,
    views: 621,
    gradient: 'from-[#48A88B] to-[#3A7A68]',
  },
  {
    id: 8,
    title: '小鎮的故事',
    author: '黃小傑',
    category: 'movie',
    award: '📹 人氣獎',
    coverEmoji: '🏘️',
    coverImage: 'https://images.unsplash.com/photo-1745296669988-d05031b620b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFsbCUyMHRvd24lMjBzdHJlZXQlMjBjb3p5JTIwdmlsbGFnZXxlbnwxfHx8fDE3NzI5NDM0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '紀錄家鄉小鎮的溫暖短片',
    likes: 356,
    views: 2234,
    gradient: 'from-[#FFDAA8] to-[#FFB347]',
  },
  {
    id: 9,
    title: '晨光中的貓',
    author: '吳小晴',
    category: 'image',
    award: '📷 最佳攝影',
    coverEmoji: '🐱',
    coverImage: 'https://images.unsplash.com/photo-1758228147088-840f9bfeeffd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXQlMjBtb3JuaW5nJTIwc3VubGlnaHQlMjBjb3p5JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzcyOTQzNDc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '捕捉清晨陽光灑落的溫柔瞬間',
    likes: 312,
    views: 1890,
    gradient: 'from-[#FDE8C8] to-[#F9A66C]',
  },
  {
    id: 10,
    title: '城市幾何',
    author: '蔡小宇',
    category: 'image',
    award: '🎨 創意獎',
    coverEmoji: '🏙️',
    coverImage: 'https://images.unsplash.com/photo-1756481602921-863b17ce6f83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYXJjaGl0ZWN0dXJlJTIwZ2VvbWV0cnklMjB1cmJhbiUyMGFic3RyYWN0fGVufDF8fHx8MTc3Mjk0MzQ3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '用鏡頭發現城市建築中的幾何美學',
    likes: 278,
    views: 1435,
    gradient: 'from-[#B8D4FF] to-[#7AA8F0]',
  },
];

export function CreativePage({ onModeSelect }: CreativePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedWork, setSelectedWork] = useState<typeof studentWorks[0] | null>(null);

  const categories = [
    { id: 'all' as Category, label: '全部作品', icon: '✨', count: studentWorks.length },
    { id: 'novel' as Category, label: '小說', icon: '📖', count: studentWorks.filter(w => w.category === 'novel').length },
    { id: 'image' as Category, label: '圖片', icon: '🖼️', count: studentWorks.filter(w => w.category === 'image').length },
    { id: 'picture-book' as Category, label: '繪本', icon: '📚', count: studentWorks.filter(w => w.category === 'picture-book').length },
    { id: 'movie' as Category, label: '電影', icon: '🎬', count: studentWorks.filter(w => w.category === 'movie').length },
    { id: 'game' as Category, label: '遊戲', icon: '🎮', count: studentWorks.filter(w => w.category === 'game').length },
  ];

  const filteredWorks = selectedCategory === 'all' 
    ? studentWorks 
    : studentWorks.filter(work => work.category === selectedCategory);

  // Sort by award first (award works come first), then by likes
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
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 20%, rgba(72,168,139,0.08) 0%, transparent 60%)',
        }}></div>

        {/* Floating Sparks */}
        <span className="sparkle-icon absolute text-[16px] pointer-events-none z-[1]" style={{ top: '8%', left: '15%', animationDelay: '0s' }}>✨</span>
        <span className="sparkle-icon absolute text-[14px] pointer-events-none z-[1]" style={{ top: '12%', right: '12%', animationDelay: '0.8s' }}>⭐</span>
        <span className="sparkle-icon absolute text-[12px] pointer-events-none z-[1]" style={{ bottom: '20%', right: '18%', animationDelay: '1.6s' }}>💫</span>

        {/* Header */}
        <div className="relative z-10 text-center m-[0px]">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#48A88B]/15 to-[#F3CC58]/15 border-[1.5px] border-[#48A88B]/30 rounded-[20px] px-4 py-[6px] text-[13px] font-black text-[#3A648C] absolute top-[10px] left-[212px] mx-[0px] my-[31px]">
            <span className="sparkle-icon">🌟</span> 學生創作工坊
          </div>
          <h1 className="text-[32px] font-black text-[#3A648C] tracking-tight text-left mx-[0px] my-[32px]">優秀作品展示</h1>
          
        </div>

        {/* Category Tabs */}
        <div className="category-slide relative z-10 flex gap-3 overflow-x-auto px-[0px] py-[8px] mx-[0px] mt-[8px] mb-[32px]">
          {categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative flex-shrink-0 flex flex-col items-center gap-1.5 rounded-[20px] text-[13px] font-black cursor-pointer transition-all border-[1.5px] min-w-[72px] ${ selectedCategory === cat.id ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white border-transparent shadow-[0_4px_16px_rgba(72,168,139,0.35)]' : 'bg-white/80 text-[#7A8BA0] border-white/90 hover:bg-white hover:text-[#3A648C]' } px-[20px] py-[10px]`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Count badge top-right */}
              <span className={`absolute -top-2 -right-2 min-w-[20px] h-[20px] flex items-center justify-center rounded-full text-[10px] font-black px-1.5 shadow-sm ${
                selectedCategory === cat.id
                  ? 'bg-white text-[#48A88B]'
                  : 'bg-[#48A88B] text-white'
              }`}>
                {cat.count}
              </span>
              <span className="text-[24px] leading-none">
                {cat.id === 'all'
                  ? <svg width="48" height="48" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedCategory === 'all' ? 'white' : '#3A648C' }}>
                      <path d="M354.147 248.297C416.706 223.266 454.026 208.333 499.999 208.333C545.973 208.333 583.293 223.266 645.853 248.297L744.836 287.89C776.653 300.617 802.426 310.925 820.116 320.2C829.069 324.894 837.743 330.216 844.433 336.631C851.306 343.223 858.333 353.219 858.333 366.667C858.333 380.114 851.306 390.111 844.433 396.702C837.743 403.117 829.069 408.439 820.116 413.133C802.426 422.408 776.653 432.716 744.836 445.443L645.853 485.037C583.293 510.067 545.973 525 499.999 525C454.026 525 416.706 510.067 354.147 485.037L255.164 445.443C223.345 432.716 197.573 422.408 179.882 413.133C170.928 408.439 162.254 403.117 155.566 396.702C148.694 390.111 141.666 380.114 141.666 366.667C141.666 353.219 148.694 343.223 155.566 336.631C162.254 330.216 170.928 324.894 179.882 320.2C197.573 310.925 223.345 300.617 255.165 287.89L354.147 248.297Z" fill="currentColor"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M183.352 481.383L183.305 481.34L183.421 481.44C183.568 481.57 183.842 481.803 184.242 482.137C185.042 482.807 186.348 483.87 188.161 485.27C191.786 488.073 197.431 492.21 205.094 497.18C220.423 507.12 243.807 520.383 275.247 532.957L368.862 570.403C436.357 597.4 464.654 608.333 500.001 608.333C535.348 608.333 563.644 597.4 631.141 570.403L724.754 532.957C756.194 520.383 779.581 507.12 794.907 497.18C802.571 492.21 808.217 488.073 811.841 485.27C813.654 483.87 814.961 482.807 815.761 482.137C816.161 481.803 816.434 481.57 816.581 481.44L816.651 481.383C816.667 481.367 816.687 481.35 816.704 481.333C826.984 472.173 842.744 473.05 851.944 483.307C861.164 493.583 860.307 509.39 850.027 518.61L833.334 500C850.027 518.61 850.034 518.603 850.027 518.61L849.981 518.65L849.924 518.703L849.767 518.84L849.311 519.24C848.941 519.56 848.441 519.99 847.804 520.517C846.537 521.577 844.741 523.037 842.414 524.833C837.764 528.427 830.997 533.367 822.114 539.13C804.344 550.653 778.081 565.48 743.324 579.38L649.707 616.827C648.414 617.347 647.128 617.86 645.854 618.37C583.294 643.4 545.974 658.333 500.001 658.333C454.028 658.333 416.708 643.4 354.148 618.37C352.874 617.86 351.589 617.347 350.293 616.827L256.677 579.38C221.921 565.48 195.658 550.653 177.888 539.13C169.003 533.367 162.236 528.427 157.587 524.833C155.262 523.037 153.465 521.577 152.197 520.517C151.562 519.99 151.06 519.56 150.69 519.24L150.233 518.84L150.079 518.703L150.02 518.65L149.984 518.62C149.979 518.613 149.974 518.61 166.668 500L149.984 518.62C139.706 509.4 138.838 493.583 148.058 483.307C157.259 473.05 173.026 472.18 183.305 481.34M183.3 614.67C173.02 605.507 157.259 606.383 148.058 616.64L183.3 614.67ZM183.3 614.67L183.421 614.773C183.568 614.903 183.842 615.137 184.242 615.47C185.042 616.14 186.348 617.203 188.161 618.603C191.786 621.407 197.431 625.543 205.094 630.513C220.423 640.453 243.807 653.713 275.247 666.29L368.862 703.737C436.357 730.733 464.654 741.667 500.001 741.667C535.348 741.667 563.644 730.733 631.141 703.737L724.754 666.29C756.194 653.713 779.581 640.453 794.907 630.513C802.571 625.543 808.217 621.407 811.841 618.603C813.654 617.203 814.961 616.14 815.761 615.47C816.161 615.137 816.434 614.903 816.581 614.773L816.651 614.717C816.667 614.7 816.687 614.683 816.704 614.667C826.984 605.507 842.744 606.383 851.944 616.64C861.164 626.917 860.307 642.723 850.027 651.943L833.887 633.95C850.027 651.943 850.034 651.937 850.027 651.943L849.981 651.983L849.924 652.037L849.767 652.173L849.311 652.573C848.941 652.893 848.441 653.323 847.804 653.85C846.537 654.91 844.741 656.37 842.414 658.167C837.764 661.76 830.997 666.7 822.114 672.463C804.344 683.987 778.081 698.813 743.324 712.713L649.707 750.16C648.414 750.68 647.128 751.193 645.854 751.703C583.294 776.733 545.974 791.667 500.001 791.667C454.028 791.667 416.708 776.733 354.149 751.703C352.874 751.193 351.589 750.68 350.293 750.16L256.677 712.713C221.921 698.813 195.658 683.987 177.888 672.463C169.003 666.7 162.236 661.76 157.587 658.167C155.262 656.37 153.465 654.91 152.197 653.85C151.562 653.323 151.06 652.893 150.69 652.573L150.233 652.173L150.079 652.037L150.02 651.983L149.984 651.953C149.979 651.947 149.974 651.943 166.668 633.333L149.984 651.953C139.706 642.733 138.838 626.917 148.058 616.64" fill="currentColor"/>
                    </svg>
                  : cat.id === 'novel'
                  ? <svg width="48" height="48" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedCategory === 'novel' ? 'white' : '#3A648C' }}>
                      <g clipPath="url(#bookClip)">
                        <path d="M403.181 107.331C352.375 80.5894 252.243 132.261 223.479 177.751C210.664 198.107 211.571 212.777 211.571 221.099V666.349L587.068 900L657.679 861.445V427.826L272.143 206.471C292.832 180.433 339.361 148.682 374.25 161.434L717.653 345.099L717.653 828.153L788.443 789.529V306.485L403.181 107.331Z" fill="currentColor"/>
                      </g>
                      <defs>
                        <clipPath id="bookClip">
                          <rect width="800" height="800" fill="white" transform="translate(100 100)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  : cat.id === 'image'
                  ? <svg width="48" height="48" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedCategory === 'image' ? 'white' : '#3A648C' }}>
                      <path d="M833.957 660.676L729.623 416.676C710.623 372.009 682.29 346.676 649.957 345.009C617.957 343.342 586.957 365.676 563.29 408.342L499.957 522.01C486.623 546.01 467.623 560.343 446.957 562.01C425.956 564.01 404.956 553.01 387.956 531.343L380.622 522.01C356.956 492.343 327.622 478.01 297.622 481.01C267.622 484.01 241.956 504.677 224.956 538.343L167.289 653.343C146.622 695.01 148.622 743.343 172.956 782.677C197.289 822.01 239.622 845.676 285.956 845.676H711.29C755.957 845.676 797.623 823.343 822.29 786.01C847.623 748.676 851.623 701.676 833.957 660.676Z" fill="currentColor"/>
                      <path d="M332.329 379.369C394.553 379.369 444.994 328.927 444.994 266.703C444.994 204.479 394.553 154.036 332.329 154.036C270.105 154.036 219.662 204.479 219.662 266.703C219.662 328.927 270.105 379.369 332.329 379.369Z" fill="currentColor"/>
                    </svg>
                  : cat.id === 'picture-book'
                  ? <svg width="48" height="48" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedCategory === 'picture-book' ? 'white' : '#3A648C' }}>
                      <path d="M823.048 718.591C781.061 718.591 747.086 752.565 747.086 794.553C747.086 836.54 781.061 870.515 823.048 870.515V900H277.854V899.68C221.765 897.435 176 851.968 176 795.238V204.762C176 146.749 225.289 100 283.302 100H823.048V718.591ZM275.934 718.911C236.829 721.797 205.739 754.489 205.739 794.231C205.739 836.219 240.035 870.514 282.022 870.193H750.289C730.416 850.962 717.597 824.038 717.597 794.231C717.597 764.101 730.74 737.181 751.254 717.949L275.934 718.911ZM566.166 330.651C552.006 329.912 538.289 339.822 527.816 358.755L499.791 409.195C493.891 419.845 485.484 426.206 476.339 426.945C467.046 427.833 457.753 422.951 450.23 413.337L446.985 409.195C436.513 396.031 423.533 389.671 410.258 391.002C396.983 392.333 385.626 401.504 378.104 416.443L352.586 467.475C343.441 485.964 344.325 507.412 355.093 524.866C365.86 542.32 384.593 552.822 405.096 552.822H593.306C613.071 552.822 631.509 542.912 642.424 526.346C653.634 509.779 655.403 488.922 647.586 470.729L601.419 362.453C593.011 342.632 580.474 331.391 566.166 330.651ZM425.615 245.907C398.081 245.907 375.761 268.291 375.761 295.903C375.761 323.515 398.081 345.898 425.615 345.898C453.149 345.898 475.469 323.515 475.47 295.903C475.47 268.291 453.15 245.907 425.615 245.907Z" fill="currentColor"/>
                    </svg>
                  : cat.id === 'movie'
                  ? <svg width="48" height="48" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedCategory === 'movie' ? 'white' : '#3A648C' }}>
                      <g clipPath="url(#movieClip)">
                        <path opacity="0.6" fillRule="evenodd" clipRule="evenodd" d="M199.523 233.333H799.523C808.363 233.333 816.842 236.845 823.093 243.097C829.344 249.348 832.856 257.826 832.856 266.667V300H166.189V266.667C166.189 257.826 169.701 249.348 175.953 243.097C182.204 236.845 190.682 233.333 199.523 233.333Z" fill="currentColor"/>
                        <path opacity="0.3" fillRule="evenodd" clipRule="evenodd" d="M266.191 166.667H732.857C741.698 166.667 750.176 170.178 756.428 176.43C762.679 182.681 766.191 191.159 766.191 200V233.333H232.857V200C232.857 191.159 236.369 182.681 242.621 176.43C248.872 170.178 257.35 166.667 266.191 166.667Z" fill="currentColor"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M132.857 300H866.19C875.031 300 883.509 303.512 889.76 309.763C896.012 316.014 899.523 324.493 899.523 333.333V833.333C899.523 842.174 896.012 850.652 889.76 856.904C883.509 863.155 875.031 866.667 866.19 866.667H132.857C124.016 866.667 115.538 863.155 109.287 856.904C103.035 850.652 99.5234 842.174 99.5234 833.333V333.333C99.5234 324.493 103.035 316.014 109.287 309.763C115.538 303.512 124.016 300 132.857 300ZM132.857 366.667V466.667H232.857V366.667H132.857ZM132.857 533.333V633.333H232.857V533.333H132.857ZM132.857 700V800H232.857V700H132.857ZM766.19 366.667V466.667H866.19V366.667H766.19ZM766.19 533.333V633.333H866.19V533.333H766.19ZM766.19 700V800H866.19V700H766.19Z" fill="currentColor"/>
                      </g>
                      <defs>
                        <clipPath id="movieClip">
                          <rect width="800" height="800" fill="white" transform="translate(99.5234 100)"/>
                        </clipPath>
                      </defs>
                    </svg>
                  : cat.id === 'game'
                  ? <svg width="48" height="48" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: selectedCategory === 'game' ? 'white' : '#3A648C' }}>
                      <path d="M499.523 160C520.037 160 536.944 175.442 539.254 195.335L539.523 200V240H599.523C765.207 240 899.523 374.314 899.523 540C899.523 702.435 770.423 834.721 609.233 839.846L599.523 840H399.523C233.838 840 99.5234 705.684 99.5234 540C99.5234 377.563 228.622 245.279 389.814 240.154L399.523 240H459.523V200C459.523 177.909 477.431 160 499.523 160ZM639.523 440C617.431 440 599.523 457.908 599.523 480V500H579.523C557.431 500 539.523 517.908 539.523 540C539.523 562.092 557.431 580 579.523 580H599.523V600C599.523 622.092 617.431 640 639.523 640C661.615 640 679.523 622.092 679.523 600V580H699.523C721.615 580 739.523 562.092 739.523 540C739.523 517.908 721.615 500 699.523 500H679.523V480C679.523 457.908 661.615 440 639.523 440ZM359.523 440C304.295 440 259.523 484.772 259.523 540C259.523 595.228 304.295 640 359.523 640C414.752 640 459.523 595.228 459.523 540C459.523 484.772 414.752 440 359.523 440ZM359.523 520C370.569 520 379.523 528.956 379.523 540C379.523 551.044 370.569 560 359.523 560C348.478 560 339.523 551.044 339.523 540C339.523 528.956 348.478 520 359.523 520Z" fill="currentColor"/>
                    </svg>
                  : cat.icon}
              </span>
              <span className="mt-0.5">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Works Grid */}
        <div className="works-scroll relative z-[4] flex-1 overflow-y-auto pr-2">
          <div className="grid grid-cols-4 gap-4 pb-4">
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

                {/* Cover */}
                <div 
                  className={`relative h-[140px] bg-gradient-to-br ${work.gradient} flex items-center justify-center text-[56px] transition-transform group-hover:scale-110`}
                >
                  <div className="absolute inset-0 bg-white/10"></div>
                  <img
                    src={work.coverImage}
                    alt={work.title}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                  />
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <h3 className="text-[15px] font-black text-[#2B3A52] mb-1 line-clamp-1">{work.title}</h3>
                  <p className="text-[11px] text-[#7A8BA0] font-semibold mb-2 line-clamp-2 leading-[1.5]">
                    {work.description}
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#7A8BA0] mb-2">
                    <span className="flex items-center gap-1">
                      👤 {work.author}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-[#7A8BA0]">
                    <span className="flex items-center gap-1">
                      ❤️ {work.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      👁️ {work.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mascot */}
        <div className="mascot-bounce absolute bottom-6 right-8 z-[5]">
          <img src={naboMascot} alt="Na-Bo 吉祥物" className="w-[72px] h-[80px] object-contain" style={{ filter: 'drop-shadow(0 8px 20px rgba(72,168,139,0.35))' }} />
        </div>
      </section>

      {/* Detail Modal */}
      {selectedWork && (
        <div
          className="fixed inset-0 z-[100] bg-[#3A648C]/50 backdrop-blur-md flex items-center justify-center p-8"
          onClick={() => setSelectedWork(null)}
        >
          <div
            className="bg-white rounded-[28px] max-w-[600px] w-full shadow-[0_24px_80px_rgba(26,46,74,0.4)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'cardPop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
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
              <span>{selectedWork.coverEmoji}</span>
            </div>

            {/* Content */}
            <div className="p-8">
              <h2 className="text-[28px] font-black text-[#2B3A52] mb-2">{selectedWork.title}</h2>
              <p className="text-[14px] text-[#7A8BA0] font-semibold mb-4">
                作者：{selectedWork.author}
              </p>
              <p className="text-[15px] text-[#4A5568] leading-[1.8] mb-6">
                {selectedWork.description}
              </p>

              {/* Stats */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-gradient-to-br from-[#FFE0E0] to-[#FFB8B8] rounded-[16px] px-4 py-3 flex items-center gap-2">
                  <span className="text-[24px]">❤️</span>
                  <div>
                    <div className="text-[11px] text-[#7A8BA0] font-bold">喜歡數</div>
                    <div className="text-[18px] font-black text-[#FF6B6B]">{selectedWork.likes}</div>
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#E0E8FF] to-[#B8CAFF] rounded-[16px] px-4 py-3 flex items-center gap-2">
                  <span className="text-[24px]">👁️</span>
                  <div>
                    <div className="text-[11px] text-[#7A8BA0] font-bold">觀看數</div>
                    <div className="text-[18px] font-black text-[#5B7FDB]">{selectedWork.views}</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-[16px] bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white text-[15px] font-black border-none cursor-pointer transition-all hover:translate-y-[-2px] hover:shadow-[0_8px_24px_rgba(72,168,139,0.4)]"
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
    </>
  );
}