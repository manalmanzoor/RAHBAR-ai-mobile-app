import React, { useState } from 'react';
import { X, Zap, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { Language, StreetReport } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (report: StreetReport) => void;
  language: Language;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  language,
}) => {
  if (!isOpen) return null;

  const isUrdu = language === 'ur';
  const [selectedType, setSelectedType] = useState<'outage' | 'restored' | 'transformer'>('outage');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: StreetReport = {
      id: Date.now().toString(),
      type: selectedType,
      titleUr: selectedType === 'outage' ? 'Light chali gayi' : selectedType === 'restored' ? 'Bijli wapis aa gayi' : 'Transformer trip',
      titleEn: selectedType === 'outage' ? 'Light chali gayi (Power Cut)' : selectedType === 'restored' ? 'Bijli wapis aa gayi (Restored)' : 'Transformer trip / Sparking',
      location: `Soan Garden · Just Now`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'You (Ali H.)',
      helpfulCount: 1,
    };
    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-neutral-200 flex flex-col gap-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5E3C] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className={`text-base font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
              {isUrdu ? 'رپورٹ کریں / Report Event' : 'Report Event / رپورٹ کریں'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Report Type Selector */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-neutral-500">
              {isUrdu ? 'کیا مسئلہ ہوا؟' : 'What happened?'}
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              
              <button
                type="button"
                onClick={() => setSelectedType('outage')}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  selectedType === 'outage'
                    ? 'bg-red-50 border-red-500 text-red-900 shadow-xs ring-2 ring-red-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Light chali gayi (Power Cut)</span>
                  <span className="text-xs text-neutral-500 font-naskh">بجلی چلی گئی ہے</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('restored')}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  selectedType === 'restored'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs ring-2 ring-emerald-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Bijli wapis aa gayi (Restored)</span>
                  <span className="text-xs text-neutral-500 font-naskh">بجلی واپس آ گئی ہے</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType('transformer')}
                className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  selectedType === 'transformer'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-2 ring-amber-300'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Transformer trip / Sparking</span>
                  <span className="text-xs text-neutral-500 font-naskh">ٹرانسفارمر کا مسئلہ</span>
                </div>
              </button>

            </div>
          </div>

          {/* Optional Note */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-neutral-500">
              {isUrdu ? 'اضافی تفصیل (آپشنل):' : 'Additional note (Optional):'}
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isUrdu ? 'مثلاً: گلی نمبر 12 میں پول سے آواز آئی...' : 'e.g., Street 12 transformer sparked...'}
              className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#0B5E3C]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#0B5E3C] hover:bg-[#14532D] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 mt-2"
          >
            <Send className="w-4 h-4" />
            <span>{isUrdu ? 'رپورٹ جمع کریں / Submit Report' : 'Submit Report / رپورٹ کریں'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
