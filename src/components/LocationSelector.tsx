import React, { useState } from 'react';
import { ChevronDown, Loader2, Navigation, AlertCircle } from 'lucide-react';
import { detectLocation, KNOWN_STREETS } from '../services/locationService';

interface LocationSelectorProps {
  currentStreet: string;
  isLiveGps: boolean;
  onStreetChange: (newStreet: string, isGps: boolean) => void;
  compact?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  currentStreet,
  isLiveGps,
  onStreetChange,
  compact = false,
}) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleDetectGPS = async () => {
    setIsDetecting(true);
    setStatusMessage('Acquiring high-accuracy GPS position...');

    const res = await detectLocation(currentStreet);
    setIsDetecting(false);

    if (res.isLiveGps) {
      setStatusMessage(res.accuracyLabel ? `Location updated: ${res.accuracyLabel}` : 'Location updated from GPS');
      onStreetChange(res.streetName, true);
    } else {
      setStatusMessage(res.errorDetails || 'GPS fix failed. Using fallback street.');
      onStreetChange(res.streetName, false);
    }

    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleManualSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'TRIGGER_GPS') {
      handleDetectGPS();
    } else {
      setStatusMessage(null);
      onStreetChange(val, false);
    }
  };

  return (
    <div className="flex flex-col gap-1 relative">
      <div className="flex items-center gap-1.5">
        {/* Live GPS pulsing indicator badge */}
        {isLiveGps ? (
          <span
            className="flex items-center gap-1 text-[10px] font-black text-[#0B5E3C] bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 shrink-0 cursor-pointer hover:bg-emerald-200 transition-colors"
            title="Auto-detected live from GPS. Click to refresh position."
            onClick={handleDetectGPS}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Live GPS
          </span>
        ) : (
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="text-neutral-400 hover:text-[#0B5E3C] transition-colors p-1 flex items-center gap-1"
            title="Detect Current Location via High-Accuracy GPS"
          >
            {isDetecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0B5E3C]" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-neutral-500 hover:text-[#0B5E3C]" />
            )}
          </button>
        )}

        {/* Dropdown Select */}
        <div className="relative inline-block">
          <select
            value={currentStreet}
            onChange={handleManualSelect}
            disabled={isDetecting}
            className={`bg-white border border-neutral-300 text-[#0B5E3C] font-extrabold rounded-full appearance-none shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0B5E3C] cursor-pointer truncate ${
              compact ? 'max-w-[140px] px-2 py-1 pr-5 text-[10px]' : 'px-3 py-1.5 pr-7 text-xs'
            }`}
          >
            {/* Custom option if detected street is not in default list */}
            {!KNOWN_STREETS.includes(currentStreet) && (
              <option value={currentStreet}>{currentStreet}</option>
            )}

            {KNOWN_STREETS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}

            <option value="TRIGGER_GPS">📍 Detect Live Location (GPS)...</option>
          </select>
          <ChevronDown
            className={`text-[#0B5E3C] absolute right-2 pointer-events-none ${
              compact ? 'w-3 h-3 top-2' : 'w-3.5 h-3.5 top-2.5'
            }`}
          />
        </div>
      </div>

      {/* GPS Status feedback toast under selector */}
      {statusMessage && (
        <div className="absolute right-0 top-7 z-50 bg-neutral-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg flex items-center gap-1 whitespace-nowrap animate-fade-in">
          {isDetecting && <Loader2 className="w-3 h-3 animate-spin text-emerald-400 shrink-0" />}
          {!isDetecting && !isLiveGps && <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />}
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
