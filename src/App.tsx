import React, { useState, useEffect } from 'react';
import { Language, ScreenId } from './types';
import { StatusBar } from './components/StatusBar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ProfileDrawer } from './components/ProfileDrawer';
import { EmergencyModal } from './components/EmergencyModal';

// Services
import { detectLocation } from './services/locationService';
import { updateDetectedStreetInMemory } from './services/memoryService';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { VoiceGreetingScreen } from './screens/VoiceGreetingScreen';
import { CheckingScreen } from './screens/CheckingScreen';
import { AnswerScreen } from './screens/AnswerScreen';
import { MyStreetScreen } from './screens/MyStreetScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { MapScreen } from './screens/MapScreen';
import { ImpactScreen } from './screens/ImpactScreen';
import { AskRahbarScreen } from './screens/AskRahbarScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('splash');
  const [language, setLanguage] = useState<Language>('ur'); // Default to Urdu/bilingual
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Global Location state
  const [currentStreet, setCurrentStreet] = useState('Street 12, Soan Garden');
  const [isLiveGps, setIsLiveGps] = useState(false);

  // On first load, attempt live GPS geolocation
  useEffect(() => {
    detectLocation(currentStreet).then((res) => {
      if (res.isLiveGps && res.streetName) {
        setCurrentStreet(res.streetName);
        setIsLiveGps(true);
        updateDetectedStreetInMemory(res.streetName);
      }
    });
  }, []);

  const handleStreetChange = (newStreet: string, isGps: boolean) => {
    setCurrentStreet(newStreet);
    setIsLiveGps(isGps);
    updateDetectedStreetInMemory(newStreet);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ur' ? 'en' : 'ur'));
  };

  const navigateTo = (screen: ScreenId) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1C1917] flex justify-center items-start font-sans">
      {/* Mobile Frame Outer Container */}
      <div className="w-full max-w-md min-h-screen bg-[#F7F5F0] shadow-2xl relative flex flex-col pb-20 border-x border-neutral-200/80 overflow-hidden">
        
        {/* Top Decorative Status Bar */}
        <StatusBar />

        {/* Global Header (hidden on splash) */}
        {currentScreen !== 'splash' && (
          <Header
            language={language}
            onToggleLanguage={toggleLanguage}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            onOpenEmergency={currentScreen === 'voice_greeting' ? undefined : () => setIsEmergencyModalOpen(true)}
            currentStreet={currentStreet}
            isLiveGps={isLiveGps}
            onStreetChange={handleStreetChange}
            titleOverride={
              currentScreen === 'map'
                ? (language === 'ur' ? 'پاکستان کا نقشہ' : 'Pakistan Map')
                : currentScreen === 'impact'
                ? (language === 'ur' ? 'میرا اثر' : 'My Impact')
                : undefined
            }
          />
        )}

        {/* Screen Routing */}
        <main className="flex-1 w-full">
          {currentScreen === 'splash' && (
            <SplashScreen
              language={language}
              onToggleLanguage={toggleLanguage}
              onStart={navigateTo}
            />
          )}

          {currentScreen === 'voice_greeting' && (
            <VoiceGreetingScreen
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'checking' && (
            <CheckingScreen
              language={language}
              onNavigate={navigateTo}
            />
          )}

          {currentScreen === 'answer' && (
            <AnswerScreen
              language={language}
              onNavigate={navigateTo}
              currentStreet={currentStreet}
              isLiveGps={isLiveGps}
              onStreetChange={handleStreetChange}
              onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            />
          )}

          {currentScreen === 'my_street' && (
            <MyStreetScreen
              language={language}
              currentStreet={currentStreet}
              isLiveGps={isLiveGps}
              onStreetChange={handleStreetChange}
            />
          )}

          {currentScreen === 'alerts' && (
            <AlertsScreen language={language} />
          )}

          {currentScreen === 'map' && (
            <MapScreen language={language} />
          )}

          {currentScreen === 'impact' && (
            <ImpactScreen language={language} />
          )}

          {currentScreen === 'ask_rahbar' && (
            <AskRahbarScreen
              language={language}
              currentStreet={currentStreet}
              isLiveGps={isLiveGps}
              onStreetChange={handleStreetChange}
            />
          )}
        </main>

        {/* Slide-out Profile & Settings Drawer */}
        <ProfileDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          language={language}
          onToggleLanguage={toggleLanguage}
          onNavigate={navigateTo}
          onOpenEmergency={() => setIsEmergencyModalOpen(true)}
          currentStreet={currentStreet}
          isLiveGps={isLiveGps}
        />

        {/* Global Emergency Quick-Dial Modal */}
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          language={language}
        />

        {/* Global Bottom Tab Bar (hidden on splash) */}
        {currentScreen !== 'splash' && (
          <BottomNav
            currentScreen={currentScreen}
            onSelectScreen={navigateTo}
            language={language}
          />
        )}

      </div>
    </div>
  );
}
