import React from 'react';
import { Menu, PhoneCall, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenDrawer: () => void;
  onOpenEmergency?: () => void;
  currentStreet?: string;
  isLiveGps?: boolean;
  onStreetChange?: (newStreet: string, isGps: boolean) => void;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenDrawer,
  onOpenEmergency,
  currentStreet,
  isLiveGps = false,
  titleOverride,
  subtitleOverride,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F5F0]/95 backdrop-blur-md px-3 py-2 border-b border-neutral-200/60 flex items-center justify-between gap-2 w-full">
      {/* Left logo / title + Live GPS pill */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded-full bg-[#0B5E3C] flex items-center justify-center text-white shadow-xs border border-emerald-700/50 shrink-0">
          {/* Crescent and mosque vector mark */}
          <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10 1 1 0 0 1-10-10zm-3 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 3v5h-2v-3h-2v3H9v-5h6z" />
          </svg>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-black tracking-tight text-neutral-900 leading-none">
              {titleOverride || (language === 'ur' ? 'رہبر' : 'RAHBAR')}
            </h1>
            {!titleOverride && (
              <span className="text-[11px] font-nastaliq text-[#0B5E3C] font-semibold leading-none">
                رہبر
              </span>
            )}
            {/* Live GPS status pill */}
            {isLiveGps ? (
              <span
                className="flex items-center gap-1 text-[9px] font-black text-[#0B5E3C] bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-300/80 shrink-0"
                title="Location active via High-Accuracy GPS"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                Live GPS
              </span>
            ) : (
              <span
                className="flex items-center gap-1 text-[9px] font-extrabold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-full border border-neutral-200 shrink-0"
                title="Location active"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                GPS
              </span>
            )}
          </div>
          {subtitleOverride && (
            <span className="text-[10px] text-neutral-500 leading-tight mt-0.5">
              {subtitleOverride}
            </span>
          )}
        </div>
      </div>

      {/* Right controls: Emergency 112 Phone Button, Language Toggle & Menu */}
      <div className="flex items-center gap-1.5 shrink-0">
        {onOpenEmergency && (
          <button
            onClick={onOpenEmergency}
            className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-2xs transition-colors shrink-0"
            title="Emergency 112 Helpline / ہنگامی نمبر"
          >
            <PhoneCall className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}

        <button
          id="language-toggle-header"
          onClick={onToggleLanguage}
          className="flex items-center gap-1 bg-white border border-neutral-300 rounded-full px-2 py-1 text-[11px] font-extrabold shadow-2xs hover:bg-emerald-50 transition-colors"
          title="Switch Language / زبان تبدیل کریں"
        >
          <Globe className="w-3 h-3 text-[#0B5E3C]" />
          <span className={language === 'en' ? 'text-[#0B5E3C] font-black' : 'text-neutral-400 font-medium'}>
            EN
          </span>
          <span className="text-neutral-300 text-[10px]">/</span>
          <span className={language === 'ur' ? 'text-[#0B5E3C] font-black font-naskh' : 'text-neutral-400 font-medium'}>
            اردو
          </span>
        </button>

        <button
          id="menu-drawer-trigger"
          onClick={onOpenDrawer}
          className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors shadow-2xs"
          title="Open Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
