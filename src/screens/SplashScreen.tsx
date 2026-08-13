import React from 'react';
import { Language, ScreenId } from '../types';
import { NEPRA_REPORT_QUOTE } from '../data/iescoSchedule';
import { Globe, Heart } from 'lucide-react';

interface SplashScreenProps {
  language: Language;
  onToggleLanguage: () => void;
  onStart: (targetScreen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  language,
  onToggleLanguage,
  onStart,
}) => {
  const isUrdu = language === 'ur';

  return (
    <div id="screen-splash" className="min-h-screen w-full bg-[#FAF5EE] flex flex-col justify-between relative overflow-hidden text-[#1C1917] p-5">
      
      {/* Background Decorative Pakistani Elements & Minar-e-Pakistan Silhouette */}
      <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
        {/* Minar-e-Pakistan Vector Silhouette Left */}
        <svg className="absolute bottom-0 left-2 w-36 h-80 text-[#0B5E3C] fill-current" viewBox="0 0 100 250">
          <path d="M45 250 L55 250 L55 120 L58 120 L58 100 L54 100 L54 60 L57 60 L57 40 L50 10 L43 40 L43 60 L46 60 L46 100 L42 100 L42 120 L45 120 Z" />
          <path d="M30 250 L70 250 L65 200 L35 200 Z" />
          <path d="M20 250 L80 250 L75 220 L25 220 Z" />
          <polygon points="50,0 47,8 53,8" />
        </svg>

        {/* Flying birds */}
        <path d="M 80 80 Q 90 70 100 80 Q 110 70 120 80" fill="none" stroke="#0B5E3C" strokeWidth="2" strokeLinecap="round" />
        <path d="M 220 50 Q 228 42 236 50 Q 244 42 252 50" fill="none" stroke="#0B5E3C" strokeWidth="2" strokeLinecap="round" />
        <path d="M 160 120 Q 166 114 172 120 Q 178 114 184 120" fill="none" stroke="#0B5E3C" strokeWidth="1.5" strokeLinecap="round" />

        {/* Crescent and mosque watermark top right */}
        <svg className="absolute -top-10 -right-10 w-64 h-64 text-[#0B5E3C] opacity-20 fill-current" viewBox="0 0 100 100">
          <path d="M 50 10 A 40 40 0 1 0 90 50 A 30 30 0 1 1 50 10 Z" />
        </svg>
      </div>

      {/* Top Header Logo */}
      <div className="relative z-10 flex flex-col items-center pt-8 text-center">
        {/* Crescent + Mosque Emblem */}
        <div className="w-20 h-20 rounded-full bg-[#0B5E3C] border-4 border-emerald-700/30 flex items-center justify-center text-white shadow-xl mb-4 animate-bounce-short">
          <svg className="w-11 h-11 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10 1 1 0 0 1-10-10zm-3 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 3v5h-2v-3h-2v3H9v-5h6z" />
          </svg>
        </div>

        {/* Brand Wordmark */}
        <h1 className="text-4xl font-extrabold tracking-tight text-[#0B5E3C]">
          RAHBAR
        </h1>
        <h2 className="text-3xl font-nastaliq text-[#0B5E3C] font-bold mt-1">
          رہبر
        </h2>

        {/* Tagline */}
        <p className="text-sm font-bold text-neutral-800 mt-4 max-w-xs font-naskh leading-relaxed">
          Aapki gali jaanti hai. Rahbar batata hai.
        </p>
        <p className="text-xs text-neutral-500 font-medium">
          Your street knows. Rahbar tells you.
        </p>
      </div>

      {/* Middle Illustration / NEPRA Quote Banner */}
      <div className="relative z-10 my-6 bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-emerald-200/80 shadow-sm max-w-sm mx-auto">
        <div className="flex items-start gap-2.5">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#0B5E3C] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
            📜
          </div>
          <div className="flex flex-col gap-1 text-left">
            <span className="text-[10px] font-bold text-[#0B5E3C] uppercase tracking-wider">
              NEPRA Report FY 2024–25 (Official Evidence)
            </span>
            <p className="text-xs text-neutral-700 italic leading-snug">
              {NEPRA_REPORT_QUOTE.quote}
            </p>
            <span className="text-[10px] font-semibold text-emerald-800 mt-1">
              — Rahbar senses what official DISCO data misses.
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Actions & Language Picker */}
      <div className="relative z-10 flex flex-col gap-3.5 max-w-sm mx-auto w-full pb-4">
        
        {/* Stacked Primary & Secondary CTA Buttons */}
        <button
          id="btn-get-started"
          onClick={() => onStart('voice_greeting')}
          className="w-full min-h-[54px] bg-[#0B5E3C] hover:bg-[#14532D] text-white font-extrabold text-base rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <span>{isUrdu ? 'آغاز کریں / Get Started' : 'Get Started / آغاز کریں'}</span>
        </button>

        <button
          id="btn-already-account"
          onClick={() => onStart('voice_greeting')}
          className="w-full min-h-[52px] bg-white border-2 border-[#0B5E3C] text-[#0B5E3C] font-extrabold text-sm rounded-2xl shadow-xs hover:bg-emerald-50 transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <span>{isUrdu ? 'میرے پاس اکاؤنٹ ہے / I Already Have an Account' : 'I Already Have an Account / میرے پاس اکاؤنٹ ہے'}</span>
        </button>

        {/* Language Picker Card */}
        <div className="bg-white/80 rounded-2xl p-3 border border-neutral-200 flex items-center justify-between mt-1 shadow-2xs">
          <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#0B5E3C]" />
            {isUrdu ? 'زبان / Language' : 'Language / زبان'}
          </span>
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => { if (language !== 'en') onToggleLanguage(); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-[#0B5E3C] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => { if (language !== 'ur') onToggleLanguage(); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-naskh transition-all ${
                language === 'ur'
                  ? 'bg-[#0B5E3C] text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              اردو
            </button>
          </div>
        </div>

        {/* Made in Pakistan badge */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 font-medium pt-1">
          <span>Made in Pakistan 🇵🇰</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        </div>

      </div>

    </div>
  );
};
