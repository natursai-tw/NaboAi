import image_ad9a0be0aca0271395664bfaea4a3c16732d1663 from 'figma:asset/ad9a0be0aca0271395664bfaea4a3c16732d1663.png'
import avatarImg from 'figma:asset/941a92c659608ffbeb37fe1770ac4272455109af.png';
import energySvg from '../../imports/energy-2.svg';
import plusSvg from '../../imports/plus_q.svg';
import bellSvg from '../../imports/bell.svg';
import { NaBoLogo } from './NaBoLogo';

interface TopNavProps {
  onNotificationClick?: () => void;
  logoOnly?: boolean;
}

export function TopNav({ onNotificationClick, logoOnly }: TopNavProps) {
  return (
    <nav className="relative z-10 flex items-center justify-between px-7 py-3.5 bg-white/75 backdrop-blur-md border-b-[1.5px] border-[#48A88B]/25">
      <div className="flex items-center gap-3.5">
        {/* Logo */}
        <NaBoLogo className="w-11 h-11 rounded-[14px]" />

        {!logoOnly && (
          <div className="flex items-center gap-2 bg-white/90 rounded-[20px] shadow-[0_4px_20px_rgba(60,120,140,0.10)] px-[28px] py-[10px]">
            <img src={energySvg} alt="量" className="w-[24px] h-[24px]" />
            <span className="text-[#7A8BA0] font-bold text-[14px]">能量值</span>
            <div className="w-[90px] h-[9px] bg-[#E8F4F8] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#3A648C] to-[#48A98B] w-[85%]"></div>
            </div>
            <span className="font-black text-[#3A648C] text-[16px]">85</span>

            {/* Divider */}
            <div className="w-[1.5px] h-[22px] bg-[#D8E8F0] rounded-full mx-1" />

            {/* Level */}
            <span className="text-[#7A8BA0] font-bold text-[14px]">Level 1</span>
            <div className="w-[90px] h-[9px] bg-[#E8F4F8] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[#3A648C] to-[#48A98B]" style={{ width: '70%' }}></div>
            </div>
            <span className="font-black text-[#3A648C] text-[14px]">70<span className="text-[#7A8BA0] font-bold text-[13px]">/100</span></span>
          </div>
        )}
      </div>

      {!logoOnly && (
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white/90 rounded-[20px] shadow-[0_4px_20px_rgba(60,120,140,0.10)] font-black text-[#3a648c] text-[16px] px-[28px] py-[8px]">
            <img src={image_ad9a0be0aca0271395664bfaea4a3c16732d1663} alt="點數" className="w-[30px] h-[30px]" /> 1,200
            <button className="w-[24px] h-[24px] rounded-lg bg-white/60 border-none cursor-pointer flex items-center justify-center text-[14px] text-[#3A648C] hover:bg-white/80 transition-all ml-1">
              <img src={plusSvg} alt="新增" className="w-[20px] h-[20px]" />
            </button>
          </div>

          {/* 通知鈴鐺 */}
          <div className="relative group/bell">
            <button
              onClick={onNotificationClick}
              className="w-[46px] h-[46px] rounded-full bg-white/90 shadow-[0_4px_12px_rgba(58,100,140,0.18)] flex items-center justify-center cursor-pointer hover:scale-110 hover:shadow-[0_6px_18px_rgba(58,100,140,0.28)] transition-all flex-shrink-0">
              <img src={bellSvg} alt="通知" className="w-[33px] h-[33px]" />
            </button>
            <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 bg-[#3A648C] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/bell:opacity-100 z-50">
              通知
            </span>
          </div>

          {/* 大頭貼 */}
          <div className="relative w-[46px] h-[46px] rounded-full overflow-hidden cursor-pointer hover:scale-110 transition-all group/avatar flex-shrink-0"
            style={{ boxShadow: '0 4px 12px rgba(58,100,140,0.35)' }}>
            <img src={avatarImg} alt="大頭貼" className="w-full h-full object-cover rounded-full" />
            <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 bg-[#3A648C] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap opacity-0 pointer-events-none transition-opacity group-hover/avatar:opacity-100 z-50">
              個人檔案
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}