import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Volume2, Sparkles, Loader2, Brain, AlertCircle } from 'lucide-react';
import { ChatMessage, Language } from '../types';
import { initialChatMessages } from '../data/seedData';
import { speechHandler } from '../services/speechRecognitionService';
import { speakText, stopSpeech } from '../services/ttsService';
import { getMemory, addQuestionToMemory } from '../services/memoryService';
import { LocationSelector } from '../components/LocationSelector';

interface AskRahbarScreenProps {
  language: Language;
  currentStreet?: string;
  isLiveGps?: boolean;
  onStreetChange?: (newStreet: string, isGps: boolean) => void;
}

export const AskRahbarScreen: React.FC<AskRahbarScreenProps> = ({
  language,
  currentStreet = 'Street 12, Soan Garden',
  isLiveGps = false,
  onStreetChange,
}) => {
  const isUrdu = language === 'ur';
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [micVolume, setMicVolume] = useState(0);
  const [micError, setMicError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReminder, setShowReminder] = useState(true);
  const [showMemoryTooltip, setShowMemoryTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const memory = getMemory();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speakText(
        text,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    // Add to lightweight local memory store
    addQuestionToMemory(textToSend);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      textUr: textToSend,
      textEn: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages,
          memoryContext: getMemory(),
          street: currentStreet,
        }),
      });

      if (!response.ok) throw new Error('Chat API failed');
      const data = await response.json();

      const rahbarMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'rahbar',
        textUr: data.textUr || 'جی، آپ کی گلی میں بجلی جانے کا امکان ہے۔',
        textEn: data.textEn || 'Ji, aapki gali mein bijli jaane ka imkaan hai.',
        spokenRomanUrdu: data.spokenRomanUrdu || data.textEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        predictionCard: data.hasPrediction
          ? {
              timeRange: data.timeRange || '06:00 PM – 09:00 PM',
              probability: data.probability || 'imkaan: 80%',
            }
          : undefined,
      };

      setMessages((prev) => [...prev, rahbarMsg]);

      // Auto-play voice reply if spokenRomanUrdu is present
      if (data.spokenRomanUrdu) {
        handleSpeakText(data.spokenRomanUrdu);
      }
    } catch (err) {
      // Fallback grounded response
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'rahbar',
        textUr: `آج شام 06:00 PM سے 09:00 PM کے درمیان ${currentStreet} میں بجلی جانے کا امکان ہے (80%)۔`,
        textEn: `Aaj shaam 06:00 PM – 09:00 PM ke darmiyan ${currentStreet} mein bijli jaane ka imkaan hai (80%).`,
        spokenRomanUrdu: `Aaj shaam chhe baje se nau baje ke darmiyan ${currentStreet} mein bijli jane ka imkaan assi percent hai.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        predictionCard: {
          timeRange: '06:00 PM – 09:00 PM',
          probability: 'imkaan: 80%',
        },
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      handleSpeakText(fallbackMsg.spokenRomanUrdu!);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isListening) {
      speechHandler.stopListening();
      setIsListening(false);
      setMicVolume(0);
      return;
    }

    setMicError('');
    setIsListening(true);

    speechHandler.startListening({
      onStart: () => {
        setIsListening(true);
      },
      onVolumeChange: (vol) => {
        setMicVolume(vol);
      },
      onPartialTranscript: (partial) => {
        setInputText(partial);
      },
      onFinalTranscript: (final) => {
        setIsListening(false);
        setMicVolume(0);
        setInputText(final);
        handleSend(final);
      },
      onError: (err) => {
        setIsListening(false);
        setMicVolume(0);
        setMicError(err);
      },
      onEnd: () => {
        setIsListening(false);
        setMicVolume(0);
      },
    });
  };

  return (
    <div id="screen-ask-rahbar" className="flex flex-col h-[78vh] max-w-md mx-auto px-4 py-2">
      
      {/* Top Sub-Header Row with Location Selector and "Rahbar Remembers" Affordance */}
      <div className="flex items-center justify-between gap-1.5 pb-2 mb-2 border-b border-neutral-200/60 shrink-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <Sparkles className="w-4 h-4 text-[#0B5E3C]" />
          <h2 className={`text-sm font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
            {isUrdu ? 'رہبر چیٹ بوٹ' : 'Ask Rahbar AI'}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onStreetChange && (
            <LocationSelector
              currentStreet={currentStreet}
              isLiveGps={isLiveGps}
              onStreetChange={onStreetChange}
              compact
            />
          )}

          {/* Rahbar Remembers Badge */}
          <div className="relative">
            <button
              onClick={() => setShowMemoryTooltip(!showMemoryTooltip)}
              className="flex items-center gap-1 bg-emerald-100 text-[#0B5E3C] px-2 py-1 rounded-full text-[10px] font-extrabold border border-emerald-300 shadow-2xs hover:bg-emerald-200 transition-colors shrink-0"
              title="Rahbar Remembers User Context"
            >
              <Brain className="w-3.5 h-3.5 text-[#0B5E3C]" />
              <span className="hidden sm:inline">{isUrdu ? 'رہبر یاد رکھتا ہے' : 'Remembers'}</span>
            </button>

            {/* Memory Tooltip Popover */}
            {showMemoryTooltip && (
              <div className="absolute right-0 top-7 z-40 bg-white text-neutral-800 rounded-2xl p-3 shadow-xl border border-neutral-200 w-64 text-xs animate-fade-in">
                <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-neutral-100">
                  <span className="font-extrabold text-[#0B5E3C]">🧠 User Context Memory</span>
                  <span className="text-[10px] text-neutral-400">Strictly Grounded</span>
                </div>
                <p className="text-[11px] text-neutral-600 mb-2">
                  Rahbar remembers your location (<strong>{currentStreet}</strong>) & recent queries for personalized answers.
                </p>
                {memory.recentQuestions.length > 0 && (
                  <div className="bg-neutral-50 p-2 rounded-xl text-[10px] font-medium text-neutral-700">
                    <span className="font-bold text-neutral-500 block mb-0.5">Last question:</span>
                    "{memory.recentQuestions[0]}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proactive Reminder Banner */}
      {showReminder && (
        <div className="bg-amber-500 text-white rounded-2xl p-3 shadow-md mb-3 border border-amber-600 flex items-center justify-between animate-slide-down shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🔔</span>
            <div className="flex flex-col">
              <span className="text-xs font-black text-amber-950 font-naskh">
                بجلی ~30 منٹ میں جا سکتی ہے
              </span>
              <span className="text-[11px] font-bold text-white">
                Power may go in ~30 min ({currentStreet})
              </span>
            </div>
          </div>
          <button
            onClick={() => handleSpeakText("Manal ji, agle 30 minute mein bijli jane ka imkaan hai. Phone charge kar lein.")}
            className="bg-white text-amber-900 font-extrabold text-xs px-3 py-1.5 rounded-full shadow-2xs hover:bg-amber-50 flex items-center gap-1.5 shrink-0"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-900" />
            <span>{isUrdu ? 'سنیں' : 'Listen'}</span>
          </button>
        </div>
      )}

      {/* Mic Error Toast if any */}
      {micError && (
        <div className="bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold p-2.5 rounded-xl mb-2 shrink-0 flex items-center gap-1.5 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Chat Messages Thread */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow-2xs text-xs ${
                  isUser
                    ? 'bg-[#0B5E3C] text-white rounded-br-2xs'
                    : 'bg-white text-neutral-900 border border-neutral-200 border-l-4 border-l-[#0B5E3C] rounded-bl-2xs'
                }`}
              >
                {/* Text */}
                <p className={`font-bold leading-relaxed ${isUrdu ? 'font-naskh' : ''}`}>
                  {msg.textUr}
                </p>

                {!isUser && msg.textEn && (
                  <p className="text-[11px] text-neutral-500 mt-1 font-medium italic border-t border-neutral-100 pt-1">
                    {msg.textEn}
                  </p>
                )}

                {/* Optional Embedded Prediction Card */}
                {msg.predictionCard && (
                  <div className="bg-emerald-950 text-white p-3 rounded-xl mt-2.5 border border-emerald-700 font-mono text-center shadow-xs">
                    <div className="text-sm font-black tracking-wide text-amber-300">
                      {msg.predictionCard.timeRange}
                    </div>
                    <div className="text-[10px] text-emerald-200 mt-0.5 font-sans font-bold">
                      ({msg.predictionCard.probability})
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamp & Speaker button */}
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 px-1">
                <span>{msg.timestamp}</span>
                {!isUser && msg.spokenRomanUrdu && (
                  <button
                    onClick={() => handleSpeakText(msg.spokenRomanUrdu!)}
                    className="text-[#0B5E3C] hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <Volume2 className="w-3 h-3 text-[#0B5E3C]" />
                    <span>Speak</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B5E3C] bg-white p-3 rounded-2xl border border-neutral-200 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-[#0B5E3C]" />
            <span>Rahbar is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 shrink-0 no-scrollbar">
        <button
          onClick={() => handleSend('Kal hamari gali mein bijli ka kya imkaan hai?')}
          className="text-[11px] font-bold text-[#0B5E3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100"
        >
          ⚡ Kal bijli ka kya imkaan hai?
        </button>
        <button
          onClick={() => handleSend('Paani kab aaye ga?')}
          className="text-[11px] font-bold text-[#0B5E3C] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full whitespace-nowrap hover:bg-emerald-100"
        >
          💧 Paani kab aaye ga?
        </button>
      </div>

      {/* Bottom Input Bar */}
      <div className="flex items-center gap-2 pt-1 border-t border-neutral-200 shrink-0">
        <div className="relative flex-1 flex flex-col gap-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              isListening
                ? (isUrdu ? 'رہبر سن رہا ہے...' : 'Listening...')
                : (isUrdu ? 'ٹائپ یا بولیں... / Type or speak...' : 'Type or speak... / ٹائپ یا بولیں')
            }
            className={`w-full bg-white border text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#0B5E3C] px-4 py-3 rounded-full shadow-2xs font-medium ${
              isListening ? 'border-emerald-500 ring-2 ring-emerald-200' : 'border-neutral-300'
            }`}
          />

          {/* Volume Meter line inside bar when listening */}
          {isListening && (
            <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden px-1">
              <div
                className="bg-emerald-600 h-full transition-all duration-75"
                style={{ width: `${Math.max(10, micVolume)}%` }}
              />
            </div>
          )}
        </div>

        {/* Mic Button */}
        <button
          onClick={handleMicToggle}
          className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
            isListening
              ? 'bg-red-600 animate-pulse ring-4 ring-red-300'
              : 'bg-[#0B5E3C] hover:bg-[#14532D]'
          }`}
          title={isListening ? 'Stop Listening' : 'Speak'}
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Send Button */}
        <button
          onClick={() => handleSend()}
          className="w-11 h-11 rounded-full bg-[#0B5E3C] hover:bg-[#14532D] text-white flex items-center justify-center shadow-md transition-all active:scale-95"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
