import { useState } from 'react';
import naboMascot from 'figma:asset/559cfa23c202ae2bafadecf045b5807d0bdfb1e6.png';

interface OnlineCourseBrowseProps {
  onBack?: () => void;
  onCourseSelect?: (courseId: string) => void;
}

interface Course {
  id: string;
  title: string;
  icon: string;
  color: string;
  teacher: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  students: number;
  category: string;
}

const courses: Course[] = [
  {
    id: '1',
    title: '數學進階班',
    icon: '🔢',
    color: '#3A648C',
    teacher: '王老師',
    progress: 65,
    totalLessons: 20,
    completedLessons: 13,
    students: 156,
    category: '數學'
  },
  {
    id: '2',
    title: '英文會話',
    icon: '🗣️',
    color: '#48A88B',
    teacher: '李老師',
    progress: 40,
    totalLessons: 24,
    completedLessons: 10,
    students: 203,
    category: '語言'
  },
  {
    id: '3',
    title: '自然科學探索',
    icon: '🔬',
    color: '#F3CC58',
    teacher: '陳老師',
    progress: 80,
    totalLessons: 15,
    completedLessons: 12,
    students: 98,
    category: '科學'
  },
  {
    id: '4',
    title: '程式設計入門',
    icon: '💻',
    color: '#6B7FD7',
    teacher: '張老師',
    progress: 25,
    totalLessons: 30,
    completedLessons: 8,
    students: 267,
    category: '科技'
  },
  {
    id: '5',
    title: '歷史文化',
    icon: '📚',
    color: '#E8896B',
    teacher: '林老師',
    progress: 50,
    totalLessons: 16,
    completedLessons: 8,
    students: 134,
    category: '人文'
  },
  {
    id: '6',
    title: '創意美術',
    icon: '🎨',
    color: '#D77FB4',
    teacher: '黃老師',
    progress: 90,
    totalLessons: 12,
    completedLessons: 11,
    students: 89,
    category: '藝術'
  },
  {
    id: '7',
    title: '音樂理論',
    icon: '🎵',
    color: '#9B86D3',
    teacher: '周老師',
    progress: 35,
    totalLessons: 18,
    completedLessons: 6,
    students: 112,
    category: '藝術'
  },
  {
    id: '8',
    title: '體育健身',
    icon: '⚽',
    color: '#5CC5B5',
    teacher: '吳老師',
    progress: 60,
    totalLessons: 10,
    completedLessons: 6,
    students: 178,
    category: '體育'
  }
];

export function OnlineCourseBrowse({ onBack, onCourseSelect }: OnlineCourseBrowseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');

  const categories = ['全部', '數學', '語言', '科學', '科技', '人文', '藝術', '體育'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .course-browse-header {
          animation: slideDown 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .course-card {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .course-card:nth-child(1) { animation-delay: 0.05s; }
        .course-card:nth-child(2) { animation-delay: 0.1s; }
        .course-card:nth-child(3) { animation-delay: 0.15s; }
        .course-card:nth-child(4) { animation-delay: 0.2s; }
        .course-card:nth-child(5) { animation-delay: 0.25s; }
        .course-card:nth-child(6) { animation-delay: 0.3s; }
        .course-card:nth-child(7) { animation-delay: 0.35s; }
        .course-card:nth-child(8) { animation-delay: 0.4s; }
      `}</style>

      <section className="flex flex-col h-full px-8 py-6 gap-6 relative overflow-y-auto">
        {/* Header */}
        <div className="course-browse-header flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="w-11 h-11 rounded-2xl bg-white/80 backdrop-blur-md border-[1.5px] border-[#48A88B]/30 flex items-center justify-center text-[#3A648C] font-black transition-all hover:bg-white hover:scale-105 hover:shadow-lg cursor-pointer"
              >
                ←
              </button>
            )}
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/80 border-[1.5px] border-[#48A88B]/35 rounded-[20px] px-3.5 py-[5px] text-[12px] font-black text-[#48A88B] mb-2">
                📚 線上課程
              </div>
              <h1 className="text-[28px] font-black text-[#3A648C] tracking-tight">探索課程</h1>
              <p className="text-[14px] text-[#7A8BA0] font-semibold mt-1">
                選擇你感興趣的課程，開始學習之旅！
              </p>
            </div>
          </div>

          {/* Mascot */}
          <div className="relative">
            <img src={naboMascot} alt="Na-Bo 吉祥物" className="w-16 h-[70px] object-contain animate-bounce" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 尋找課程..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/80 backdrop-blur-md border-[1.5px] border-[#48A88B]/30 text-[15px] font-semibold text-[#3A648C] placeholder:text-[#7A8BA0]/60 focus:outline-none focus:border-[#48A88B] focus:bg-white transition-all shadow-[0_4px_16px_rgba(60,120,140,0.1)]"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-[13px] font-black transition-all cursor-pointer ${
                selectedCategory === category
                  ? 'bg-gradient-to-br from-[#48A88B] to-[#3A648C] text-white shadow-[0_4px_12px_rgba(72,168,139,0.35)]'
                  : 'bg-white/70 text-[#7A8BA0] hover:bg-white hover:text-[#3A648C]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onSelect={() => onCourseSelect?.(course.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <div className="text-[20px] font-black text-[#3A648C] mb-2">找不到相關課程</div>
            <div className="text-[14px] text-[#7A8BA0] font-semibold">試試其他關鍵字或分類吧！</div>
          </div>
        )}
      </section>
    </>
  );
}

function CourseCard({ course, onSelect }: { course: Course; onSelect: () => void }) {
  return (
    <div
      className="course-card group relative bg-white/78 backdrop-blur-xl rounded-[24px] border-2 border-white/90 shadow-[0_6px_24px_rgba(60,120,140,0.12)] p-5 flex flex-col cursor-pointer transition-all duration-300 hover:translate-y-[-6px] hover:shadow-[0_16px_48px_rgba(60,120,140,0.2)] hover:border-white overflow-hidden"
      onClick={onSelect}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${course.color}20 0%, transparent 70%)`
        }}
      ></div>

      {/* Icon & Title */}
      <div className="relative flex items-start gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-[28px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
          style={{ background: `${course.color}15` }}
        >
          {course.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[16px] font-black text-[#1A2E4A] mb-1 truncate">{course.title}</h3>
          <div className="text-[12px] font-semibold text-[#7A8BA0]">👨‍🏫 {course.teacher}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-black text-[#7A8BA0]">學習進度</span>
          <span className="text-[11px] font-black" style={{ color: course.color }}>
            {course.progress}%
          </span>
        </div>
        <div className="relative h-2 bg-[#E8EFF5] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{ 
              width: `${course.progress}%`,
              background: `linear-gradient(90deg, ${course.color}, ${course.color}dd)`
            }}
          ></div>
        </div>
        <div className="text-[10px] font-semibold text-[#7A8BA0] mt-1.5">
          已完成 {course.completedLessons} / {course.totalLessons} 課
        </div>
      </div>

      {/* Stats */}
      <div className="relative flex items-center justify-between pt-3 border-t border-[#E8EFF5]">
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#7A8BA0]">
          👥 <span>{course.students} 位學生</span>
        </div>
        <div
          className="text-[11px] font-black px-2.5 py-1 rounded-lg"
          style={{
            background: `${course.color}15`,
            color: course.color
          }}
        >
          {course.category}
        </div>
      </div>

      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 shadow-lg" style={{ color: course.color }}>
        →
      </div>
    </div>
  );
}
