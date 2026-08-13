import React, { useState } from 'react';
import { Mic, AlertCircle, Volume2, ShieldAlert } from 'lucide-react';
import { Language, ScreenId } from '../types';
import { MascotRobot } from '../components/MascotRobot';
import { speechHandler } from '../services/speechRecognitionService';
import { addQuestionToMemory } from '../services/memoryService';

interface VoiceGreetingScreenProps {
  language: Language;
  onNavigate: (screen: ScreenId) => void;
}

export const VoiceGreetingScreen: React.FC<VoiceGreetingScreenProps> = ({
  language,
  onNavigate,
}) => {
  const isUrdu = language === 'ur';
  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 100
  const [transcript, setTranscript] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPermissionError, setIsPermissionError] = useState(false);

  const handleStartListening = async () => {
    setErrorMsg('');
    setIsPermissionError(false);
    setTranscript('');

    if (!speechHandler.isSupported()) {
      setErrorMsg('Web Speech API is not supported in this browser. Tap a quick question below or type.');
      return;
    }

    setIsListening(true);

    speechHandler.startListening({
      onStart: () => {
        setIsListening(true);
      },
      onVolumeChange: (vol) => {
        setVolumeLevel(vol);
      },
      onPartialTranscript: (partial) => {
        setTranscript(partial);
      },
      onFinalTranscript: (final) => {
        setTranscript(final);
        addQuestionToMemory(final);
        setIsListening(false);
        setVolumeLevel(0);
        onNavigate('checking');
      },
      onError: (err, permError) => {
        setIsListening(false);
        setVolumeLevel(0);
        setErrorMsg(err);
        if (permError) setIsPermissionError(true);
      },
      onEnd: () => {
        setIsListening(false);
        setVolumeLevel(0);
      },
    });
  };

  const handleStopListening = () => {
    speechHandler.stopListening();
    setIsListening(false);
    setVolumeLevel(0);
  };

  const handleQuickQuestion = (questionText: string) => {
    addQuestionToMemory(questionText);
    onNavigate('checking');
  };

  return (
    <div id="screen-voice-greeting" className="flex flex-col items-center justify-between min-h-[82vh] px-5 py-4 text-center">
      
      {/* Top Greeting Text */}
      <div className="flex flex-col items-center gap-1.5 pt-2">
        <h2 className={`text-2xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'السلام علیکم!' : 'Assalamualaikum!'}
        </h2>
        <p className={`text-[#0B5E3C] font-extrabold text-base max-w-xs ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu
            ? 'میں آپ کا رہبر ہوں۔ کیا معلوم کرنا ہے؟'
            : 'Main aapka Rahbar hoon. Kya maloom karna hai?'}
        </p>
        <p className="text-xs text-neutral-500 font-medium mt-0.5">
          Ask Rahbar about electricity, water, or gas outage predictions.
        </p>
      </div>

      {/* Mascot Robot Center */}
      <div className="my-2 relative">
        <MascotRobot isListening={isListening} isSpeaking={!isListening && !transcript} />

        {/* Real-time Audio Meter Visualizer Rings around Mascot */}
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full border-2 border-emerald-500/60 transition-all duration-75"
              style={{
                width: `${120 + volumeLevel * 0.8}px`,
                height: `${120 + volumeLevel * 0.8}px`,
                opacity: 0.3 + (volumeLevel / 100) * 0.7,
              }}
            />
          </div>
        )}
      </div>

      {/* Hero Mic Button & CTA */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs mb-6">
        
        {/* Live Transcript Display */}
        {transcript && (
          <div className="bg-emerald-50 border border-emerald-300 text-[#0B5E3C] text-xs font-bold p-2.5 rounded-xl w-full text-center animate-fade-in shadow-2xs">
            "{transcript}"
          </div>
        )}

        {/* Audio Volume Bar when Listening */}
        {isListening && (
          <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden my-1">
            <div
              className="bg-emerald-600 h-full transition-all duration-75"
              style={{ width: `${Math.max(5, volumeLevel)}%` }}
            />
          </div>
        )}

        {/* Error message / Permission help */}
        {errorMsg && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold p-3 rounded-xl w-full text-left flex flex-col gap-1 animate-fade-in shadow-2xs">
            <div className="flex items-center gap-1.5">
              {isPermissionError ? (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span className="font-extrabold">{isPermissionError ? 'Microphone Permission Blocked' : 'Notice'}</span>
            </div>
            <p className="text-[11px] font-medium text-neutral-700 leading-normal">{errorMsg}</p>
            {isPermissionError && (
              <p className="text-[10px] text-neutral-500 italic mt-0.5">
                Tip: Click the padlock/microphone icon in your browser address bar to grant permission.
              </p>
            )}
          </div>
        )}

        <span className="text-xs font-bold text-neutral-500 tracking-wide uppercase flex items-center gap-1">
          {isListening ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{isUrdu ? 'رہبر سن رہا ہے...' : 'Listening to microphone...'}</span>
            </>
          ) : (
            <span>{isUrdu ? 'بولیں / Tap to speak' : 'Tap to speak / بولیں'}</span>
          )}
        </span>

        {/* Large Circular Green Mic Button */}
        <button
          id="btn-voice-mic"
          onClick={isListening ? handleStopListening : handleStartListening}
          className={`w-24 h-24 rounded-full bg-[#0B5E3C] hover:bg-[#14532D] text-white flex items-center justify-center shadow-xl transition-all duration-300 active:scale-95 ${
            isListening ? 'animate-pulse ring-8 ring-emerald-400/40 bg-emerald-700' : 'hover:shadow-2xl'
          }`}
          title={isListening ? 'Stop Listening' : 'Speak to Rahbar'}
        >
          <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
        </button>

        {/* Preset Prompt Suggestion Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          <button
            onClick={() => handleQuickQuestion('Kal bijli ka kya imkaan hai?')}
            className="text-xs font-semibold text-[#0B5E3C] bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            ⚡ Kal bijli ka kya imkaan hai?
          </button>
          <button
            onClick={() => handleQuickQuestion('Water supply kab aaye gi?')}
            className="text-xs font-semibold text-[#0B5E3C] bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors shadow-2xs"
          >
            💧 Water supply kab aaye gi?
          </button>
        </div>
      </div>

    </div>
  );
};
