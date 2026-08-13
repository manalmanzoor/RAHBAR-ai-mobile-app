import React from 'react';

interface MascotRobotProps {
  isListening?: boolean;
  isSpeaking?: boolean;
}

export const MascotRobot: React.FC<MascotRobotProps> = ({
  isListening = false,
  isSpeaking = false,
}) => {
  return (
    <div className="flex flex-col items-center justify-center my-2 relative">
      {/* Background glow / rings when active */}
      {(isListening || isSpeaking) && (
        <div className="absolute w-44 h-44 rounded-full bg-emerald-500/10 animate-ping" />
      )}

      {/* Robot Mascot SVG / Vector */}
      <div className="relative w-36 h-36 flex items-center justify-center drop-shadow-md transition-transform duration-300 hover:scale-105">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Head outer glow */}
          <circle cx="100" cy="100" r="85" fill="#E8F5E9" opacity="0.6" />

          {/* Antennas */}
          <line x1="100" y1="35" x2="100" y2="15" stroke="#0B5E3C" strokeWidth="5" strokeLinecap="round" />
          <circle cx="100" cy="12" r="8" fill="#3E8E5C" />

          {/* Ears */}
          <rect x="25" y="80" width="12" height="24" rx="6" fill="#0B5E3C" />
          <rect x="163" y="80" width="12" height="24" rx="6" fill="#0B5E3C" />

          {/* Head Shell - Rounded White Body */}
          <rect x="35" y="35" width="130" height="110" rx="40" fill="#FFFFFF" stroke="#0B5E3C" strokeWidth="4" />

          {/* Visor / Screen Face */}
          <rect x="52" y="55" width="96" height="52" rx="20" fill="#1C1917" />

          {/* Glowing Green Robot Eyes */}
          <circle cx="78" cy="78" r="10" fill="#4ADE80" className={isListening ? "animate-bounce" : ""} />
          <circle cx="122" cy="78" r="10" fill="#4ADE80" className={isListening ? "animate-bounce" : ""} />
          {/* Eye reflections */}
          <circle cx="81" cy="75" r="3" fill="#FFFFFF" />
          <circle cx="125" cy="75" r="3" fill="#FFFFFF" />

          {/* Friendly Smile Mouth */}
          <path d="M 86 92 Q 100 102 114 92" fill="none" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" />

          {/* Scarf / Green Pakistani Flag Scarf */}
          <path d="M 50 135 C 70 128, 130 128, 150 135 L 140 160 C 110 168, 90 168, 60 160 Z" fill="#0B5E3C" stroke="#14532D" strokeWidth="2" />
          
          {/* Crescent & Star on Scarf */}
          <circle cx="100" cy="146" r="6" fill="#FFFFFF" />
          <circle cx="102" cy="145" r="5" fill="#0B5E3C" />
          <polygon points="106,143 108,147 104,145 108,145 104,147" fill="#FFFFFF" />

          {/* Waving Hand Left/Right */}
          <g className={isListening ? "animate-spin origin-bottom" : "animate-pulse"}>
            <circle cx="168" cy="120" r="12" fill="#FFFFFF" stroke="#0B5E3C" strokeWidth="3" />
            {/* Waving motion lines */}
            <path d="M 178 110 Q 185 115 178 125" fill="none" stroke="#3E8E5C" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Soundwaves underneath */}
      <div className="flex items-center justify-center gap-1.5 h-6 mt-1">
        <div className={`w-1 bg-[#0B5E3C] rounded-full transition-all ${isListening || isSpeaking ? 'animate-waveform-1' : 'h-2'}`} />
        <div className={`w-1 bg-[#0B5E3C] rounded-full transition-all ${isListening || isSpeaking ? 'animate-waveform-2' : 'h-3'}`} />
        <div className={`w-1.5 bg-[#0B5E3C] rounded-full transition-all ${isListening || isSpeaking ? 'animate-waveform-3' : 'h-4'}`} />
        <div className={`w-1 bg-[#0B5E3C] rounded-full transition-all ${isListening || isSpeaking ? 'animate-waveform-4' : 'h-3'}`} />
        <div className={`w-1 bg-[#0B5E3C] rounded-full transition-all ${isListening || isSpeaking ? 'animate-waveform-5' : 'h-2'}`} />
      </div>
    </div>
  );
};
