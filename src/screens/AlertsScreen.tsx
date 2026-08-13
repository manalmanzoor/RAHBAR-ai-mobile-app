import React, { useState } from 'react';
import { Language } from '../types';
import { initialAlerts } from '../data/seedData';

interface AlertsScreenProps {
  language: Language;
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({ language }) => {
  const isUrdu = language === 'ur';
  const [filter, setFilter] = useState<'upcoming' | 'all' | 'past'>('upcoming');

  const filteredAlerts = initialAlerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.category === filter;
  });

  return (
    <div id="screen-alerts" className="flex flex-col gap-4 px-4 py-3 pb-8 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'اطلاعات' : 'Alerts'}
        </h2>
        <span className="text-xs font-semibold text-neutral-500">
          Islamabad Feeders
        </span>
      </div>

      {/* 3 Filter Pill Tabs */}
      <div className="flex items-center bg-neutral-200/80 p-1 rounded-2xl w-full">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {isUrdu ? 'سب All' : 'All / سب'}
        </button>

        <button
          onClick={() => setFilter('upcoming')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'upcoming'
              ? 'bg-[#0B5E3C] text-white shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {isUrdu ? 'آنے والی Upcoming' : 'Upcoming / آنے والی'}
        </button>

        <button
          onClick={() => setFilter('past')}
          className={`flex-1 py-2 text-xs font-extrabold rounded-xl transition-all ${
            filter === 'past'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900'
          }`}
        >
          {isUrdu ? 'ماضی Past' : 'Past / ماضی'}
        </button>
      </div>

      {/* Vertical List of Alert Cards */}
      <div className="flex flex-col gap-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center text-xs text-neutral-500 border border-neutral-200">
            No alerts found for this filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs flex items-center justify-between gap-3 hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-3">
                {/* Left Icon in Colored Circle */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${alert.iconBg}`}>
                  <span>{alert.icon}</span>
                </div>

                {/* Title & Description Line */}
                <div className="flex flex-col">
                  <h3 className={`text-sm font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
                    {isUrdu ? alert.titleUr : alert.titleEn}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium leading-snug">
                    {isUrdu ? alert.descriptionUr : alert.descriptionEn}
                  </p>
                </div>
              </div>

              {/* Trailing Metadata Chip */}
              <div className="shrink-0">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${alert.chipColor}`}>
                  {isUrdu ? alert.chipUr : alert.chipEn}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
