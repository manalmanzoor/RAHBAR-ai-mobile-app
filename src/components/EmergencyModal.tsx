import React from 'react';
import { X, Phone, AlertTriangle, ShieldAlert, Zap, Flame } from 'lucide-react';
import { Language } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  const emergencyContacts = [
    {
      number: '112',
      titleEn: 'General Emergency',
      titleUr: 'عام ایمرجنسی (General Emergency)',
      descEn: 'National Emergency Response Helpline',
      descUr: 'قومی ہنگامی ہیلپ لائن',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      color: 'bg-red-50 border-red-200 text-red-900',
    },
    {
      number: '118',
      titleEn: 'Electricity Emergency / WAPDA Fault Line',
      titleUr: 'بجلی ایمرجنسی / واپڈا فالٹ لائن',
      descEn: 'IESCO / WAPDA Power Outage & Transformer Line',
      descUr: 'آئیسکو / واپڈا پاور اور ٹرانسفارمر فالٹ لائن',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      color: 'bg-amber-50 border-amber-200 text-amber-900',
    },
    {
      number: '1500',
      titleEn: 'Rescue Service 1122 / Rescue 1500',
      titleUr: 'ریسکیو سروس 1500',
      descEn: 'Ambulance & Fire Rescue',
      descUr: 'ایمبولینس اور فائر برگیڈ سروس',
      icon: <Flame className="w-5 h-5 text-orange-600" />,
      color: 'bg-orange-50 border-orange-200 text-orange-900',
    },
    {
      number: '15',
      titleEn: 'Police Emergency (15)',
      titleUr: 'پولیس ہیلپ لائن (15)',
      descEn: 'Islamabad Police Emergency Center',
      descUr: 'اسلام آباد پولیس ایمرجنسی سینٹر',
      icon: <Phone className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200 text-blue-900',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-red-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className={`text-base font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
              {isUrdu ? 'ہنگامی نمبرز / Emergency Numbers' : 'Emergency Numbers / ہنگامی نمبرز'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-600 font-medium leading-relaxed">
          {isUrdu
            ? 'کسی بھی ایمرجنسی کی صورت میں فوری رابطہ کے لیے نیچے دیے گئے نمبر پر ٹیپ کریں۔'
            : 'Tap any service below to trigger direct quick-dial on your phone:'}
        </p>

        {/* Contacts List */}
        <div className="flex flex-col gap-2.5">
          {emergencyContacts.map((contact) => (
            <a
              key={contact.number}
              href={`tel:${contact.number}`}
              className={`flex items-center justify-between p-3.5 rounded-2xl border ${contact.color} hover:opacity-95 transition-all shadow-2xs active:scale-98`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-2xs shrink-0">
                  {contact.icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className={`text-xs font-black ${isUrdu ? 'font-naskh' : ''}`}>
                    {isUrdu ? contact.titleUr : contact.titleEn}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">
                    {isUrdu ? contact.descUr : contact.descEn}
                  </span>
                </div>
              </div>

              {/* Number Badge */}
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 text-neutral-900 font-black font-mono text-sm shrink-0 shadow-2xs">
                <Phone className="w-3.5 h-3.5 text-emerald-700 fill-emerald-700" />
                <span>{contact.number}</span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-[10px] text-center text-neutral-400 font-medium pt-1">
          Handed off directly to your device dialer. No charges from Rahbar.
        </p>

      </div>
    </div>
  );
};
