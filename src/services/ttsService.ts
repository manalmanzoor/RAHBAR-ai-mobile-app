let cachedVoice: SpeechSynthesisVoice | null = null;

export function getBestVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Prefer Urdu voice -> Hindi voice -> English voice
  const urduVoice = voices.find((v) => v.lang.toLowerCase().includes('ur'));
  if (urduVoice) {
    cachedVoice = urduVoice;
    return urduVoice;
  }

  const hindiVoice = voices.find((v) => v.lang.toLowerCase().includes('hi'));
  if (hindiVoice) {
    cachedVoice = hindiVoice;
    return hindiVoice;
  }

  const defaultVoice = voices.find((v) => v.default) || voices[0];
  cachedVoice = defaultVoice;
  return defaultVoice;
}

// Pre-load voices
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getBestVoice();
  };
}

export function speakText(
  textToSpeak: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: () => void
): void {
  if (!('speechSynthesis' in window) || !textToSpeak) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // Stop any active speech

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  const voice = getBestVoice();

  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = 'ur-PK';
  }

  utterance.rate = 0.92; // Slightly relaxed pace for clarity
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis error:', e);
    if (onError) onError();
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
