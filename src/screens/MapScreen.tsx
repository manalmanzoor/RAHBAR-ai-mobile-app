import React from 'react';
import { Language } from '../types';
import { PakistanMapSVG } from '../components/PakistanMapSVG';

interface MapScreenProps {
  language: Language;
}

export const MapScreen: React.FC<MapScreenProps> = ({ language }) => {
  const isUrdu = language === 'ur';

  return (
    <div id="screen-map" className="flex flex-col gap-4 px-4 py-3 pb-8 max-w-md mx-auto">
      
      {/* Header */}
      <div className="flex flex-col">
        <h2 className={`text-xl font-extrabold text-neutral-900 ${isUrdu ? 'font-naskh' : ''}`}>
          {isUrdu ? 'پاکستان کا نقشہ' : 'Pakistan Map'}
        </h2>
        <span className="text-xs font-semibold text-neutral-500">
          {isUrdu ? 'بندش کا نقشہ (لائیو)' : 'Outage Heatmap (Live)'}
        </span>
      </div>

      {/* Pakistan Map & Legend */}
      <PakistanMapSVG language={language} />

    </div>
  );
};
