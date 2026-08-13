import React, { useState } from 'react';
import { Share2, Bell, Check, Sparkles, AlertTriangle, ArrowRight, Volume2, VolumeX, PhoneCall } from 'lucide-react';
import { Language, ScreenId } from '../types';
import { speakText, stopSpeech } from '../services/ttsService';
import { LocationSelector } from '../components/LocationSelector';

interface AnswerScreenProps {
  language: Language;
  onNavigate: (screen: ScreenId) => void;
  currentStreet?: string;
  isLiveGps?: boolean;
  onStreetChange?: (newStreet: string, isGps: boolean) => void;
  onOpenEmergency?: () => void;
}

export const AnswerScreen: React.FC<AnswerScreenProps> = ({
  language,
  onNavigate,
  currentStreet = 'Street 12, Soan Garden',
  isLiveGps = false,
  onStreetChange,
  onOpenEmergency,
}) => {
  const isUrdu = language === 'ur';
  const [copied, setCopied] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 2500);
  };

  const handlePlayVoice = () => {
    if (isPlayingVoice) {
      stopSpeech();
      setIsPlayingVoice(false);
    } else {
      setIsPlayingVoice(true);
      const textToSpeak = "Manal ji, aaj 06:00 PM se 09:00 PM ke darmiyan bijli jane ka 80 percent imkaan hai. AAP paani pehle store kar lein aur devices charge rakhein.";
      speakText(
        textToSpeak,
        () => setIsPlayingVoice(true),
        () => setIsPlayingVoice(false),
        () => setIsPlayingVoice(false)
      );
    }
  };

  return (
    <div id="screen-answer" className="flex flex-col gap-4 px-4 py-3 pb-8 max-w-md mx-auto">
      
      {/* Header & Location */}
      <div className="flex items-center justify-between gap-2">
        <h2 className={`text-xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'رہبر کا جواب' : 'Rahbar ka jawab'}
        </h2>
        
        {onStreetChange && (
          <LocationSelector
            currentStreet={currentStreet}
            isLiveGps={isLiveGps}
            onStreetChange={onStreetChange}
            compact
          />
        )}
      </div>

      {/* Large Dark Green Prediction Result Card */}
      <div className="bg-[#0B5E3C] text-white rounded-3xl p-5 shadow-lg flex flex-col gap-3 border border-emerald-700 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-emerald-500/20 pointer-events-none" />

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            {isUrdu ? 'ملٹی ایجنٹ پیش گوئی' : 'Multi-Agent Prediction'}
          </span>

          <div className="flex items-center gap-2">
            {/* Voice Audio Speaker Button */}
            <button
              onClick={handlePlayVoice}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold border transition-all ${
                isPlayingVoice
                  ? 'bg-amber-400 text-amber-950 border-amber-300 animate-pulse'
                  : 'bg-emerald-800 text-emerald-100 border-emerald-600 hover:bg-emerald-700'
              }`}
              title="Listen to prediction in Urdu"
            >
              {isPlayingVoice ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'سنیں' : 'Listen'}</span>
                </>
              )}
            </button>

            <span className="text-xs font-bold bg-emerald-800/80 px-2.5 py-0.5 rounded-full border border-emerald-600 text-amber-200">
              {isUrdu ? 'امکان: 80%' : '(imkaan: 80%)'}
            </span>
          </div>
        </div>

        {/* Headline */}
        <h3 className={`text-lg font-bold leading-snug ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu
            ? 'آج آپ کی گلی میں بجلی جانے کا امکان ہے۔'
            : 'Aaj aapki gali mein bijli jaane ka imkaan hai.'}
        </h3>

        {/* Large Time Range */}
        <div className="bg-emerald-900/70 rounded-2xl p-3.5 border border-emerald-600/60 text-center my-1">
          <span className="text-2xl font-black tracking-wide text-white font-mono">
            06:00 PM – 09:00 PM
          </span>
          <p className="text-[11px] text-emerald-200 font-medium mt-0.5">
            Expected Outage Window (Tonight)
          </p>
        </div>

        {/* Inline Emergency Quick Link during outage */}
        {onOpenEmergency && (
          <div className="pt-1 border-t border-emerald-700/60 flex items-center justify-between">
            <span className="text-xs text-emerald-200 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
              {isUrdu ? 'کرم یا فالٹ رپورٹ کے لیے:' : 'Power fault or emergency?'}
            </span>
            <button
              onClick={onOpenEmergency}
              className="text-xs font-extrabold text-amber-300 hover:text-white underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>{isUrdu ? 'ہنگامی ہیلپ لائن (118/112)' : 'Call Helpline (118/112)'}</span>
            </button>
          </div>
        )}

      </div>

      {/* Footer Source Citation Strip */}
      <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider py-0.5">
        <span>Data Sources:</span>
        <span className="text-neutral-600 font-extrabold">IESCO</span>
        <span>·</span>
        <span className="text-neutral-600 font-extrabold">NEPRA</span>
        <span>·</span>
        <span className="text-neutral-600 font-extrabold">Open-Meteo</span>
      </div>

      {/* Wajah / Reason Bulleted List */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-2xs flex flex-col gap-2">
        <h4 className={`text-xs font-extrabold text-neutral-900 uppercase tracking-wider ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'وجہ / Reason:' : 'Wajah / Reason:'}
        </h4>
        <ul className="flex flex-col gap-2 text-xs text-neutral-700 font-medium pl-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5E3C]" />
            <span>High temperature (40°C)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5E3C]" />
            <span>High demand expected on {currentStreet} Feeder</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5E3C]" />
            <span>Past pattern match (unscheduled outages last 5 days)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5E3C]" />
            <span>Neighbors reporting local voltage drops</span>
          </li>
        </ul>
      </div>

      {/* Aap kya kar sakte hain? / What can you do */}
      <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 shadow-2xs flex flex-col gap-2">
        <h4 className={`text-xs font-extrabold text-[#0B5E3C] uppercase tracking-wider ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'آپ کیا کر سکتے ہیں؟ / What can you do' : 'Aap kya kar sakte hain? / What can you do'}
        </h4>
        <ul className="flex flex-col gap-2 text-xs text-neutral-800 font-semibold pl-1">
          <li className="flex items-center gap-2">
            <span className="text-emerald-700">💧</span>
            <span>Paani store kar lein (Fill water tanks early)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-700">🔋</span>
            <span>Devices charge kar lein (Charge phones & UPS)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-700">👔</span>
            <span>Zaroori kaam pehle kar lein (Iron clothes now)</span>
          </li>
        </ul>
      </div>

      {/* Toast feedback for reminder */}
      {reminderSet && (
        <div className="bg-emerald-800 text-white p-3 rounded-xl text-xs font-bold text-center animate-fade-in flex items-center justify-center gap-2">
          <Check className="w-4 h-4" />
          <span>{isUrdu ? 'ریمنڈر سیٹ ہو گیا ہے! (5:30 PM الرٹ)' : 'Reminder set for 05:30 PM!'}</span>
        </div>
      )}

      {/* Two Full-Width Buttons */}
      <div className="flex flex-col gap-2.5 mt-2">
        <button
          id="btn-share-neighbors"
          onClick={handleShare}
          className="w-full min-h-[52px] bg-[#0B5E3C] hover:bg-[#14532D] text-white font-extrabold text-sm rounded-2xl shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Share2 className="w-4 h-4" />
          <span>
            {copied
              ? (isUrdu ? 'واٹس ایپ پر بھیج دیا گیا!' : 'Copied to WhatsApp!')
              : (isUrdu ? 'پڑوسیوں کے ساتھ شیئر کریں / Share with Neighbors' : 'Share with Neighbors / پڑوسیوں کو بتائیں')}
          </span>
        </button>

        <button
          id="btn-set-reminder"
          onClick={handleSetReminder}
          className="w-full min-h-[50px] bg-white border-2 border-[#0B5E3C] text-[#0B5E3C] font-extrabold text-sm rounded-2xl shadow-2xs hover:bg-emerald-50 transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <Bell className="w-4 h-4" />
          <span>{isUrdu ? 'ریمنڈر لگائیں / Set Reminder' : 'Set Reminder / ریمنڈر لگائیں'}</span>
        </button>
      </div>

      {/* Navigation link to Ask Rahbar chat */}
      <button
        onClick={() => onNavigate('ask_rahbar')}
        className="text-xs font-bold text-neutral-500 hover:text-[#0B5E3C] flex items-center justify-center gap-1 mt-1"
      >
        <span>Have more questions? Ask Rahbar in Chat</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

    </div>
  );
};
