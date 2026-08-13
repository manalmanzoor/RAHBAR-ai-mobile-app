import React from 'react';
import { Award, Users, Flame, Heart } from 'lucide-react';
import { Language } from '../types';
import { initialProfile } from '../data/seedData';
import { ContributorBadge } from '../components/ContributorBadge';

interface ImpactScreenProps {
  language: Language;
}

export const ImpactScreen: React.FC<ImpactScreenProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  return (
    <div id="screen-impact" className="flex flex-col gap-4 px-4 py-3 pb-8 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'میرا اثر' : 'My Impact'}
        </h2>
        <span className="text-xs font-semibold text-neutral-500">
          Street 12 Contributor
        </span>
      </div>

      {/* Dark-Green Card titled "Me contributing to Rahbar" */}
      <div className="bg-[#0B5E3C] text-white rounded-3xl p-5 shadow-lg flex flex-col gap-3 border border-emerald-700 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
            {isUrdu ? 'میں رہبر میں حصہ ڈال رہا ہوں' : 'Me contributing to Rahbar'}
          </span>
          <span className="text-xs font-extrabold bg-emerald-800 px-2.5 py-0.5 rounded-full text-amber-300">
            🇵🇰 Active
          </span>
        </div>

        <p className={`text-sm font-bold text-white leading-snug ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu
            ? 'آپ کی رپورٹوں نے سون گارڈن کی گلی نمبر 12 کی پیش گوئی کو 95٪ درست بنایا۔'
            : 'Your reports made Street 12 outage predictions 95% accurate for 140 neighbors.'}
        </p>

        {/* Vector Illustration of community around Pakistani Flag */}
        <div className="w-full h-24 bg-emerald-900/50 rounded-2xl p-3 border border-emerald-600/50 flex items-center justify-center relative overflow-hidden mt-1">
          <svg viewBox="0 0 300 80" className="w-full h-full">
            {/* Green Pakistani Flag Background banner */}
            <rect x="110" y="10" width="80" height="50" rx="4" fill="#14532D" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="110" y="10" width="20" height="50" fill="#FFFFFF" />
            <circle cx="155" cy="35" r="12" fill="#FFFFFF" />
            <circle cx="158" cy="34" r="10" fill="#14532D" />
            <polygon points="163,30 165,35 160,32 165,32 160,35" fill="#FFFFFF" />

            {/* People silhouettes holding hands around flag */}
            <circle cx="50" cy="30" r="10" fill="#4ADE80" />
            <path d="M 35 60 C 35 45, 65 45, 65 60 Z" fill="#4ADE80" />

            <circle cx="85" cy="25" r="9" fill="#22C55E" />
            <path d="M 72 55 C 72 40, 98 40, 98 55 Z" fill="#22C55E" />

            <circle cx="215" cy="25" r="9" fill="#22C55E" />
            <path d="M 202 55 C 202 40, 228 40, 228 55 Z" fill="#22C55E" />

            <circle cx="250" cy="30" r="10" fill="#4ADE80" />
            <path d="M 235 60 C 235 45, 265 45, 265 60 Z" fill="#4ADE80" />
          </svg>
        </div>
      </div>

      {/* Three Stat Tiles in a Row */}
      <div className="grid grid-cols-3 gap-2.5">
        
        {/* Stat 1: Reports */}
        <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-2xs flex flex-col items-center text-center">
          <span className="text-2xl font-black text-[#0B5E3C] font-mono">
            {initialProfile.reportsCount}
          </span>
          <span className="text-xs font-extrabold text-neutral-900 mt-0.5">
            {isUrdu ? 'رپورٹس' : 'Reports'}
          </span>
          <span className="text-[10px] font-semibold text-neutral-400">
            Submitted
          </span>
        </div>

        {/* Stat 2: Helpful */}
        <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-2xs flex flex-col items-center text-center">
          <span className="text-2xl font-black text-[#0B5E3C] font-mono">
            {initialProfile.helpfulCount}
          </span>
          <span className="text-xs font-extrabold text-neutral-900 mt-0.5">
            {isUrdu ? 'پڑوسیوں کی مدد' : 'Helpful'}
          </span>
          <span className="text-[10px] font-semibold text-neutral-400">
            Neighbors Helped
          </span>
        </div>

        {/* Stat 3: Streak */}
        <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-2xs flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-2xl font-black text-amber-500 font-mono">
            <span>{initialProfile.streakDays}</span>
            <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
          <span className="text-xs font-extrabold text-neutral-900 mt-0.5">
            {isUrdu ? 'دن Streak' : 'Streak Days'}
          </span>
          <span className="text-[10px] font-semibold text-neutral-400">
            Active Days
          </span>
        </div>

      </div>

      {/* "My Impact" Text Card */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs flex flex-col gap-1.5">
        <h4 className={`text-xs font-extrabold text-neutral-900 uppercase tracking-wider ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'میرا اثر / My Impact' : 'My Impact / میرا اثر'}
        </h4>
        <p className={`text-xs text-neutral-700 leading-relaxed font-medium ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu
            ? 'آپ کی رپورٹس سے آپ کی گلی زیادہ بہتر ہو رہی ہے۔ گلی نمبر 12 کے تمام رہائشیوں کو اب وقت پر الرٹ ملتا ہے۔'
            : 'Aapke reports se aapki gali zyada behtar ho rahi hai. Street 12 residents receive accurate alerts before power cuts.'}
        </p>
      </div>

      {/* Gamification Contributor Badge Row */}
      <ContributorBadge
        language={language}
        currentXp={initialProfile.xpCurrent}
        maxXp={initialProfile.xpMax}
        level={initialProfile.level}
      />

    </div>
  );
};
