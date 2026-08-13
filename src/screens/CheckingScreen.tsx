import React, { useEffect, useState } from 'react';
import { Check, Loader2, Activity } from 'lucide-react';
import { Language, ScreenId } from '../types';
import { initialAgentResults } from '../data/seedData';

interface CheckingScreenProps {
  language: Language;
  onNavigate: (screen: ScreenId) => void;
}

export const CheckingScreen: React.FC<CheckingScreenProps> = ({
  language,
  onNavigate,
}) => {
  const isUrdu = language === 'ur';
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 600);
    const timer2 = setTimeout(() => setStepIndex(2), 1200);
    const timer3 = setTimeout(() => setStepIndex(3), 1800);
    const timer4 = setTimeout(() => onNavigate('answer'), 2600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onNavigate]);

  const items = [
    {
      id: 'street',
      icon: '📡',
      titleEn: 'Street Insights',
      titleUr: 'گلی ایجنٹ (Street Insights)',
      statusEn: 'Checking WhatsApp updates & street reports...',
      statusUr: 'واٹس ایپ اپڈیٹس اور رپورٹس کا جائزہ...',
    },
    {
      id: 'schedule',
      icon: '📋',
      titleEn: 'Official Schedule',
      titleUr: 'رسمی شیڈول (Official Schedule)',
      statusEn: 'Checking IESCO schedule...',
      statusUr: 'آئیسکو شیڈول چیک کیا جا رہا ہے...',
    },
    {
      id: 'weather',
      icon: '☀️',
      titleEn: 'Weather',
      titleUr: 'موسم ایجنٹ (Weather)',
      statusEn: 'Checking live weather (40°C)...',
      statusUr: 'لائیو موسم (40°C) کی جانچ...',
    },
    {
      id: 'history',
      icon: '🔄',
      titleEn: 'Past Patterns',
      titleUr: 'پچھلے پیٹرنز (Past Patterns)',
      statusEn: 'Analyzing outage history...',
      statusUr: 'تاریخی پیٹرنز کا تجزیہ...',
    },
  ];

  return (
    <div id="screen-checking" className="flex flex-col items-center justify-between min-h-[82vh] px-5 py-4">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-1">
        <h2 className={`text-xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'رہبر آپ کی گلی کی نبز سن رہا ہے...' : 'Rahbar is checking...'}
        </h2>
        <p className="text-xs font-semibold text-[#0B5E3C] font-naskh">
          Main aapki gali ki nabz sun raha hun.
        </p>
      </div>

      {/* Pulsing Circular Heartbeat / Pulse Icon */}
      <div className="my-6 relative flex items-center justify-center">
        <div className="w-28 h-28 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-[#0B5E3C] shadow-inner animate-pulse-ring">
          <Activity className="w-12 h-12 text-[#0B5E3C] animate-pulse" />
        </div>
      </div>

      {/* Checklist Card List */}
      <div className="w-full max-w-sm bg-white rounded-2xl p-4 border border-neutral-200 shadow-sm flex flex-col gap-3.5 mb-4">
        {items.map((item, idx) => {
          const isDone = stepIndex > idx;
          const isInProgress = stepIndex === idx;

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                isInProgress
                  ? 'bg-emerald-50 border border-emerald-300'
                  : 'bg-neutral-50/80 border border-neutral-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div className="flex flex-col">
                  <span className={`text-xs font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
                    {isUrdu ? item.titleUr : item.titleEn}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {isUrdu ? item.statusUr : item.statusEn}
                  </span>
                </div>
              </div>

              {/* Status Indicator */}
              <div>
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : isInProgress ? (
                  <Loader2 className="w-5 h-5 text-[#0B5E3C] animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Skip Button */}
      <button
        onClick={() => onNavigate('answer')}
        className="text-xs font-bold text-[#0B5E3C] hover:underline pb-2"
      >
        {isUrdu ? 'جواب دیکھئے / Skip to Answer' : 'Skip to Answer / جواب دیکھئے'}
      </button>

    </div>
  );
};
