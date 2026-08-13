export interface UserMemory {
  userName: string;
  detectedStreet: string;
  recentQuestions: string[];
  recentPredictions: {
    street: string;
    timeRange: string;
    probability: string;
    timestamp: string;
  }[];
  notes?: string[];
}

const MEMORY_KEY = 'rahbar_user_memory_v1';

const defaultMemory: UserMemory = {
  userName: 'Manal Manzoor',
  detectedStreet: 'Street 12, Soan Garden',
  recentQuestions: ['Aaj bijli ka kya scene hai?'],
  recentPredictions: [
    {
      street: 'Street 12, Soan Garden',
      timeRange: '06:00 PM – 09:00 PM',
      probability: 'imkaan: 80%',
      timestamp: 'Today',
    },
  ],
  notes: ['Prefers early water fill reminders before 5 PM'],
};

export function getMemory(): UserMemory {
  if (typeof window === 'undefined') return defaultMemory;
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) {
      saveMemory(defaultMemory);
      return defaultMemory;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultMemory;
  }
}

export function saveMemory(memory: UserMemory): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  } catch (e) {
    console.warn('Could not save memory to localStorage', e);
  }
}

export function addQuestionToMemory(question: string): void {
  const mem = getMemory();
  const updatedQuestions = [question, ...mem.recentQuestions.filter((q) => q !== question)].slice(0, 5);
  saveMemory({ ...mem, recentQuestions: updatedQuestions });
}

export function addPredictionToMemory(street: string, timeRange: string, probability: string): void {
  const mem = getMemory();
  const newPrediction = {
    street,
    timeRange,
    probability,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  const updatedPredictions = [newPrediction, ...mem.recentPredictions].slice(0, 5);
  saveMemory({ ...mem, recentPredictions: updatedPredictions, detectedStreet: street });
}

export function updateDetectedStreetInMemory(street: string): void {
  const mem = getMemory();
  saveMemory({ ...mem, detectedStreet: street });
}

export function clearUserMemory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch (e) {
    console.warn('Could not clear user memory', e);
  }
}
