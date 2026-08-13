import React from 'react';
import { Home, MessageSquare, Bell, MapPin, User } from 'lucide-react';
import { Language, ScreenId } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  language: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  language,
}) => {
  const isUrdu = language === 'ur';

  const navItems: { id: ScreenId; labelEn: string; labelUr: string; icon: React.ReactNode }[] = [
    {
      id: 'voice_greeting', // or splash
      labelEn: 'Home',
      labelUr: 'ہوم',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'ask_rahbar',
      labelEn: 'Ask Rahbar',
      labelUr: 'رہبر سے پوچھیں',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'alerts',
      labelEn: 'Alerts',
      labelUr: 'اطلاعات',
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: 'my_street',
      labelEn: 'My Street',
      labelUr: 'میری گلی',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      id: 'impact', // or profile drawer
      labelEn: 'Profile',
      labelUr: 'پروفائل',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 max-w-md mx-auto shadow-lg">
      <div className="flex items-center justify-around py-2 px-1">
        {navItems.map((item) => {
          const isActive =
            currentScreen === item.id ||
            (item.id === 'voice_greeting' && (currentScreen === 'splash' || currentScreen === 'checking' || currentScreen === 'answer')) ||
            (item.id === 'impact' && currentScreen === 'impact');

          return (
            <button
              key={item.id}
              id={`tab-${item.id}`}
              onClick={() => onSelectScreen(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 min-w-[60px] rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#0B5E3C] font-bold scale-105'
                  : 'text-neutral-400 hover:text-neutral-600 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-100/70 text-[#0B5E3C]' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className={`text-[10px] leading-tight mt-0.5 whitespace-nowrap ${isUrdu ? 'font-naskh' : ''}`}>
                {isUrdu ? item.labelUr : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
