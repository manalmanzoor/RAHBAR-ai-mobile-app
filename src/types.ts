export type Language = 'en' | 'ur';

export type ScreenId = 
  | 'splash'
  | 'voice_greeting'
  | 'checking'
  | 'answer'
  | 'my_street'
  | 'alerts'
  | 'map'
  | 'impact'
  | 'ask_rahbar';

export interface AgentResult {
  id: 'street' | 'schedule' | 'weather' | 'history';
  icon: string;
  nameUr: string;
  nameEn: string;
  sourceLabel: string;
  findingUr: string;
  findingEn: string;
  status: 'done' | 'in_progress' | 'pending';
}

export interface PredictionData {
  spokenUrdu: string;
  display: {
    headlineUr: string;
    headlineEn: string;
    timeRange: string;
    confidenceUr: string;
    confidenceEn: string;
    confidencePercent: number;
    reasonsUr: string[];
    reasonsEn: string[];
    actionsUr: string[];
    actionsEn: string[];
  };
  agents: AgentResult[];
}

export interface StreetReport {
  id: string;
  type: 'outage' | 'restored' | 'transformer';
  titleUr: string;
  titleEn: string;
  location: string;
  timestamp: string;
  user?: string;
  helpfulCount?: number;
}

export interface AlertItem {
  id: string;
  category: 'upcoming' | 'past' | 'all';
  type: 'possible' | 'maintenance' | 'heat' | 'wapda';
  titleUr: string;
  titleEn: string;
  descriptionUr: string;
  descriptionEn: string;
  chipUr: string;
  chipEn: string;
  chipColor: string;
  iconBg: string;
  icon: string;
  timeLabel: string;
}

export interface MapRegion {
  id: string;
  nameEn: string;
  nameUr: string;
  severity: 'low' | 'medium' | 'high';
  reportsCount: number;
  descriptionUr: string;
  descriptionEn: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'rahbar';
  textUr: string;
  textEn: string;
  spokenRomanUrdu?: string;
  timestamp: string;
  predictionCard?: {
    timeRange: string;
    probability: string;
  };
}

export interface UserProfile {
  name: string;
  location: string;
  level: number;
  levelTitleUr: string;
  levelTitleEn: string;
  reportsCount: number;
  helpfulCount: number;
  streakDays: number;
  xpCurrent: number;
  xpMax: number;
}
