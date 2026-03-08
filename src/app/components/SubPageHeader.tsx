import { ReactNode } from 'react';

interface SubPageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  accent?: string;
  bg?: string;
  onBack: () => void;
  backLabel?: string;
}

export function SubPageHeader({
  icon,
  title,
  subtitle,
  accent = '#3A648C',
  bg = 'rgba(58,100,140,0.09)',
  onBack,
  backLabel = '返回',
}: SubPageHeaderProps) {
  return (
    <div
      className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl mx-[0px] my-[12px]"
      style={{ background: bg, border: `1.5px solid ${accent}20` }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all hover:bg-white/40 active:scale-95"
        style={{ color: accent }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: 11, fontWeight: 600 }}>{backLabel}</span>
      </button>

      {/* Divider */}
      <div className="w-px h-4" style={{ background: `${accent}30` }} />

      {/* Icon */}
      <div className="flex-shrink-0">{icon}</div>

      {/* Title + subtitle */}
      <div className="flex flex-col leading-none gap-[3px]">
        <span style={{ fontSize: 12, fontWeight: 700, color: accent }}>{title}</span>
        {subtitle && (
          <span style={{ fontSize: 10, color: `${accent}99` }}>{subtitle}</span>
        )}
      </div>
    </div>
  );
}
