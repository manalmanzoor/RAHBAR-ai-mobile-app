import React, { useState } from 'react';
import { MapPin, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { Language, MapRegion } from '../types';
import { initialMapRegions } from '../data/seedData';

interface PakistanMapSVGProps {
  language: Language;
}

export const PakistanMapSVG: React.FC<PakistanMapSVGProps> = ({ language }) => {
  const isUrdu = language === 'ur';
  const [selectedRegion, setSelectedRegion] = useState<MapRegion | null>(initialMapRegions[0]);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return { bg: '#22C55E', stroke: '#15803D', text: 'text-emerald-700', badge: 'bg-emerald-100 border-emerald-300' };
      case 'medium': return { bg: '#F59E0B', stroke: '#B45309', text: 'text-amber-700', badge: 'bg-amber-100 border-amber-300' };
      case 'high': return { bg: '#EF4444', stroke: '#B91C1C', text: 'text-red-700', badge: 'bg-red-100 border-red-300' };
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Map Container */}
      <div id="pakistan-map-container" className="relative w-full bg-gradient-to-b from-emerald-900/5 to-white rounded-2xl p-4 border border-neutral-200 shadow-xs flex flex-col items-center">
        
        {/* Title overlay */}
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {isUrdu ? 'پاکستان آؤٹیج ہیٹ میپ' : 'Outage Heatmap (Live)'}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#0B5E3C] bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Live Sensing
          </span>
        </div>

        {/* SVG Map of Pakistan */}
        <div className="relative w-full h-64 my-1 flex items-center justify-center">
          <svg viewBox="0 0 400 350" className="w-full h-full drop-shadow-sm">
            <defs>
              <filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Stylized Provinces Paths */}
            {/* Gilgit Baltistan / AJK */}
            <path
              d="M 220 30 L 290 20 L 310 60 L 260 85 L 210 65 Z"
              fill={getSeverityColor('medium').bg}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedRegion(initialMapRegions[3])}
            />
            {/* KPK */}
            <path
              d="M 180 60 L 220 30 L 210 65 L 225 120 L 170 120 Z"
              fill={getSeverityColor('medium').bg}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedRegion(initialMapRegions[3])}
            />
            {/* Punjab & Islamabad (High activity red spot) */}
            <path
              d="M 225 120 L 260 85 L 310 130 L 240 220 L 190 170 Z"
              fill={getSeverityColor('high').bg}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedRegion(initialMapRegions[0])}
            />
            {/* Sindh */}
            <path
              d="M 190 210 L 240 220 L 220 310 L 150 280 L 160 220 Z"
              fill={getSeverityColor('high').bg}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedRegion(initialMapRegions[2])}
            />
            {/* Balochistan */}
            <path
              d="M 60 170 L 180 120 L 190 210 L 160 220 L 150 280 L 60 250 Z"
              fill={getSeverityColor('low').bg}
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedRegion(initialMapRegions[4])}
            />

            {/* Islamabad / Soan Garden Pulsing Marker */}
            <g className="cursor-pointer" onClick={() => setSelectedRegion(initialMapRegions[0])}>
              <circle cx="230" cy="115" r="10" fill="#EF4444" opacity="0.4" className="animate-ping" />
              <circle cx="230" cy="115" r="6" fill="#B91C1C" stroke="#FFFFFF" strokeWidth="2" />
              <text x="240" y="112" fill="#1C1917" fontSize="11" fontWeight="bold">Islamabad</text>
              <text x="240" y="124" fill="#6B7280" fontSize="9">Soan Garden</text>
            </g>
          </svg>
        </div>

        {/* 3-item Legend Row */}
        <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-neutral-200/80 w-full text-xs font-semibold text-neutral-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
            <span>{isUrdu ? 'کم (Low)' : 'Low'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" />
            <span>{isUrdu ? 'متوسط (Medium)' : 'Medium'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-red-600" />
            <span>{isUrdu ? 'زیادہ (High)' : 'High'}</span>
          </div>
        </div>

      </div>

      {/* Your Area Card */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-col gap-2 transition-all">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-[#0B5E3C]">
              <MapPin className="w-5 h-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                {isUrdu ? 'آپ کا علاقہ / Your Area' : 'Your Area'}
              </span>
              <span className="text-base font-extrabold text-neutral-900">
                {selectedRegion ? (isUrdu ? selectedRegion.nameUr : selectedRegion.nameEn) : 'Soan Garden, Islamabad'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              {isUrdu ? 'زیادہ سرگرمی' : 'High Activity'}
            </span>
            <button className="text-neutral-400 hover:text-neutral-700">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isExpanded && selectedRegion && (
          <div className="mt-2 pt-3 border-t border-neutral-100 flex flex-col gap-2 text-xs text-neutral-600 animate-fade-in">
            <p className={`font-medium text-neutral-800 ${isUrdu ? 'font-naskh' : ''}`}>
              {isUrdu ? selectedRegion.descriptionUr : selectedRegion.descriptionEn}
            </p>
            <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
              <span className="font-semibold text-neutral-700">
                {isUrdu ? 'گلی رپورٹس کی تعداد:' : 'Live Street Reports:'}
              </span>
              <span className="font-bold text-[#0B5E3C]">{selectedRegion.reportsCount} Reports</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
