import React from 'react';
import { Star } from 'lucide-react';
import { Language } from '../types';

interface ContributorBadgeProps {
  language: Language;
  currentXp?: number;
  maxXp?: number;
  level?: number;
}

export const ContributorBadge: React.FC<ContributorBadgeProps> = ({
  language,
  currentXp = 120,
  maxXp = 200,
  level = 2,
}) => {
  const isUrdu = language === 'ur';
  const percentage = Math.min(100, Math.round((currentXp / maxXp) * 100));

  return (
    <div id="contributor-badge" className="w-full bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-500 shadow-xs">
            <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-500">
              {isUrdu ? 'ترقیاتی درجہ' : 'Contributor Rank'}
            </span>
            <span className={`text-sm font-bold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
              {isUrdu ? `لیول ${level} – فعال حصہ دار` : `Level ${level} – Active Contributor`}
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#0B5E3C] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress XP bar */}
      <div className="w-full flex flex-col gap-1">
        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200/80">
          <div
            className="bg-gradient-to-r from-[#0B5E3C] to-[#14532D] h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-medium text-neutral-500 mt-0.5">
          <span>{currentXp} / {maxXp} XP</span>
          <span>{isUrdu ? 'اگلا لیول: 200 XP' : 'Next level: 200 XP'}</span>
        </div>
      </div>
    </div>
  );
};
