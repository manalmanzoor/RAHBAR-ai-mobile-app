import React, { useState } from 'react';
import { Plus, Activity, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import { Language, StreetReport } from '../types';
import { initialStreetReports } from '../data/seedData';
import { ReportModal } from '../components/ReportModal';
import { LocationSelector } from '../components/LocationSelector';

interface MyStreetScreenProps {
  language: Language;
  currentStreet?: string;
  isLiveGps?: boolean;
  onStreetChange?: (newStreet: string, isGps: boolean) => void;
}

export const MyStreetScreen: React.FC<MyStreetScreenProps> = ({
  language,
  currentStreet = 'Street 12, Soan Garden',
  isLiveGps = false,
  onStreetChange,
}) => {
  const isUrdu = language === 'ur';
  const [reports, setReports] = useState<StreetReport[]>(initialStreetReports);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const handleAddReport = (newReport: StreetReport) => {
    setReports([newReport, ...reports]);
  };

  return (
    <div id="screen-my-street" className="flex flex-col gap-4 px-4 py-3 pb-8 max-w-md mx-auto">
      
      {/* Header & Street Selector Dropdown */}
      <div className="flex items-center justify-between gap-2">
        <h2 className={`text-xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'میری گلی' : 'My Street'}
        </h2>

        {onStreetChange && (
          <LocationSelector
            currentStreet={currentStreet}
            isLiveGps={isLiveGps}
            onStreetChange={onStreetChange}
          />
        )}
      </div>

      {/* Dark-Green "Community Pulse (Last 24 Hours)" Card */}
      <div className="bg-[#0B5E3C] text-white rounded-3xl p-5 shadow-lg flex flex-col gap-3 border border-emerald-700 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-300" />
            {isUrdu ? 'کمیونٹی کی نبز (24 گھنٹے)' : 'Community Pulse (Last 24 Hours)'}
          </span>
          <span className="text-[11px] font-extrabold bg-emerald-800/90 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-600">
            Live Sensors
          </span>
        </div>

        {/* Big Number */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tight font-mono text-white">
            {78 + reports.length - 3}
          </span>
          <span className="text-base font-bold text-emerald-200">
            {isUrdu ? 'رپورٹس' : 'Reports'}
          </span>
        </div>

        {/* Light-Green Sparkline / Area Chart */}
        <div className="w-full pt-2">
          <div className="relative w-full h-20">
            <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d="M 0 60 Q 50 40 100 55 T 200 20 T 300 35 L 300 70 L 0 70 Z"
                fill="url(#chartGradient)"
              />

              {/* Sparkline line */}
              <path
                d="M 0 60 Q 50 40 100 55 T 200 20 T 300 35"
                fill="none"
                stroke="#4ADE80"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak points */}
              <circle cx="200" cy="20" r="5" fill="#FFFFFF" stroke="#0B5E3C" strokeWidth="2" />
              <circle cx="300" cy="35" r="4" fill="#4ADE80" />
            </svg>
          </div>

          {/* Time Labels Row */}
          <div className="flex items-center justify-between text-[10px] font-bold text-emerald-200/90 mt-1 font-mono px-1">
            <span>12 AM</span>
            <span>06 AM</span>
            <span>12 PM</span>
            <span>06 PM</span>
          </div>
        </div>
      </div>

      {/* Recent Reports / حالیہ رپورٹس */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
          <h3 className={`text-xs font-extrabold text-neutral-900 uppercase tracking-wider ${isUrdu ? 'font-naskh' : ''}`}>
            {isUrdu ? 'حالیہ رپورٹس / Recent Reports' : 'Recent Reports / حالیہ رپورٹس'}
          </h3>
          <span className="text-xs font-semibold text-neutral-500">
            {reports.length} Recent
          </span>
        </div>

        {/* Reports List */}
        <div className="flex flex-col gap-2.5">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200/70 hover:bg-neutral-100/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                {/* Status icon based on type */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-2xs shrink-0 ${
                  report.type === 'outage'
                    ? 'bg-red-500'
                    : report.type === 'restored'
                    ? 'bg-emerald-600'
                    : 'bg-amber-500'
                }`}>
                  {report.type === 'outage' ? (
                    <Zap className="w-5 h-5 fill-current" />
                  ) : report.type === 'restored' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className={`text-xs font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
                    {isUrdu ? report.titleUr : report.titleEn}
                  </span>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {report.location}
                  </span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end">
                <span className="text-[11px] font-bold text-neutral-400 font-mono">
                  {report.timestamp}
                </span>
                {report.helpfulCount && (
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md mt-0.5">
                    👍 {report.helpfulCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Width Green "Report Now / رپورٹ کریں" Button */}
      <button
        id="btn-report-now"
        onClick={() => setIsReportModalOpen(true)}
        className="w-full min-h-[54px] bg-[#0B5E3C] hover:bg-[#14532D] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 mt-1"
      >
        <Plus className="w-5 h-5 stroke-[3]" />
        <span>{isUrdu ? 'رپورٹ کریں / Report Now' : 'Report Now / رپورٹ کریں'}</span>
      </button>

      {/* Report Modal Component */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleAddReport}
        language={language}
      />

    </div>
  );
};
