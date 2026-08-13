import React from 'react';
import {
  X,
  Bell,
  Settings,
  LayoutDashboard,
  MessageSquare,
  MapPin,
  FileText,
  Map,
  Award,
  LogOut,
  Globe,
  Star,
  PhoneCall,
  Trash2
} from 'lucide-react';
import { Language, ScreenId } from '../types';
import { clearUserMemory } from '../services/memoryService';

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onToggleLanguage: () => void;
  onNavigate: (screen: ScreenId) => void;
  onOpenEmergency?: () => void;
  currentStreet?: string;
  isLiveGps?: boolean;
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onToggleLanguage,
  onNavigate,
  onOpenEmergency,
  currentStreet = 'Street 12, Soan Garden',
  isLiveGps = false,
}) => {
  if (!isOpen) return null;

  const isUrdu = language === 'ur';

  const menuItems: { id: ScreenId | 'dashboard' | 'reports' | 'settings' | 'logout'; labelUr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', labelUr: 'ڈیش بورڈ', labelEn: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'ask_rahbar', labelUr: 'رہبر سے پوچھیں', labelEn: 'Ask Rahbar', icon: <MessageSquare className="w-5 h-5" /> },
    { id: 'my_street', labelUr: 'میری گلی', labelEn: 'My Street', icon: <MapPin className="w-5 h-5" /> },
    { id: 'alerts', labelUr: 'اطلاعات', labelEn: 'Alerts', icon: <Bell className="w-5 h-5" /> },
    { id: 'reports', labelUr: 'رپورٹس', labelEn: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'map', labelUr: 'نقشہ', labelEn: 'Map', icon: <Map className="w-5 h-5" /> },
    { id: 'impact', labelUr: 'میرا اثر', labelEn: 'My Impact', icon: <Award className="w-5 h-5" /> },
    { id: 'settings', labelUr: 'ترتیبات', labelEn: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleItemClick = (itemId: string) => {
    onClose();
    if (itemId === 'dashboard' || itemId === 'reports') {
      onNavigate('my_street');
    } else if (itemId === 'settings') {
      onNavigate('impact');
    } else if (itemId === 'logout') {
      onNavigate('splash');
    } else {
      onNavigate(itemId as ScreenId);
    }
  };

  const handleClearData = () => {
    clearUserMemory();
    alert(isUrdu ? 'آپ کا تمام سٹور کیا گیا ڈیٹا اور چیٹ ہسٹری مٹا دی گئی ہے۔' : 'Your stored data and memory history have been cleared.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-[320px] bg-[#0B5E3C] text-white h-full overflow-y-auto flex flex-col justify-between p-5 shadow-2xl z-10 border-l border-emerald-700/50">
        
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-emerald-700/60">
            <button
              id="close-drawer-btn"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-emerald-800/80 flex items-center justify-center text-white hover:bg-emerald-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  if (onOpenEmergency) onOpenEmergency();
                }}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'ہنگامی (112)' : 'Emergency'}</span>
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3.5 my-4 bg-emerald-800/40 p-3 rounded-2xl border border-emerald-700/50">
            <div className="w-12 h-12 rounded-full bg-white text-[#0B5E3C] flex items-center justify-center font-extrabold text-xl shadow-md border-2 border-emerald-300">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white">Manal Manzoor</span>
              <span className="text-xs text-emerald-200/90 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-300" />
                {currentStreet} {isLiveGps && '📍'} 🇵🇰
              </span>
            </div>
          </div>

          {/* Level 2 Contributor Badge in Drawer */}
          <div className="mb-4 bg-emerald-900/60 p-3 rounded-2xl border border-emerald-600/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
                <Star className="w-4 h-4 fill-amber-950" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-semibold">
                  Contributor Badge
                </span>
                <span className="text-xs font-bold text-white">
                  {isUrdu ? 'لیول 2 – فعال حصہ دار' : 'Level 2 – Active Contributor'}
                </span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full">
              120/200 XP
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-emerald-100 hover:bg-emerald-800/60 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-emerald-300">{item.icon}</span>
                  <span>{isUrdu ? item.labelUr : item.labelEn}</span>
                </div>
                {isUrdu && <span className="text-xs text-emerald-300 font-naskh">{item.labelEn}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-emerald-700/60 flex flex-col gap-2">
          {/* Language toggle inside drawer */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-800/40 text-xs font-medium text-emerald-100 border border-emerald-700/50">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-300" />
              {isUrdu ? 'زبان / Language' : 'Language / زبان'}
            </span>
            <button
              onClick={onToggleLanguage}
              className="flex items-center bg-white text-[#0B5E3C] px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs hover:bg-emerald-50"
            >
              <span className={language === 'en' ? 'underline font-extrabold' : ''}>EN</span>
              <span className="mx-1">/</span>
              <span className={language === 'ur' ? 'underline font-extrabold font-naskh' : ''}>اردو</span>
            </button>
          </div>

          {/* Privacy: Forget My Data */}
          <button
            onClick={handleClearData}
            className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-emerald-200 hover:bg-emerald-800/60 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-amber-300" />
            <span>{isUrdu ? 'میری معلومات مٹائیں (Forget My Data)' : 'Forget My Data'}</span>
          </button>

          {/* Log Out */}
          <button
            onClick={() => handleItemClick('logout')}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-200 hover:bg-red-900/40 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-300" />
            <span>{isUrdu ? 'لاگ آؤٹ / Log Out' : 'Log Out / لاگ آؤٹ'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
