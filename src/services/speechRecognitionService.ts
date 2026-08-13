/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onAudioStart?: () => void;
  onSoundStart?: () => void;
  onSpeechStart?: () => void;
  onVolumeChange?: (volumeLevel: number) => void; // 0 to 100
  onPartialTranscript?: (text: string) => void;
  onFinalTranscript?: (text: string) => void;
  onError?: (errorMsg: string, isPermissionError?: boolean) => void;
  onEnd?: () => void;
}

export class SpeechHandler {
  private activeRecognition: any = null;
  private silenceTimer: any = null;
  private isListening: boolean = false;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private animFrameId: number | null = null;

  public isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Check and request Microphone permissions via getUserMedia first.
   * This ensures iOS Safari, Android Chrome, and Desktop Web browser
   * permissions are requested explicitly before starting Web Speech API.
   */
  public async requestMicrophonePermission(): Promise<{ granted: boolean; error?: string }> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { granted: false, error: 'MediaDevices API not supported in this browser environment.' };
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Keep stream reference briefly or stop if only checking
      return { granted: true };
    } catch (err: any) {
      console.warn('Microphone permission request failed:', err);
      let errorMsg = 'Microphone permission denied. Please allow microphone access in browser settings.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Microphone permission denied by user or system policy.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No microphone hardware detected on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Microphone is already in use by another application.';
      }
      return { granted: false, error: errorMsg };
    }
  }

  public async startListening(callbacks: SpeechRecognitionCallbacks): Promise<void> {
    // 1. Stop any current session
    this.stopListening();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not available in window');
      callbacks.onError?.(
        'Voice input is not supported in this browser. Please type your query.',
        false
      );
      callbacks.onEnd?.();
      return;
    }

    // 2. Pre-flight Mic check via getUserMedia
    const permResult = await this.requestMicrophonePermission();
    if (!permResult.granted) {
      console.warn('Mic permission denied:', permResult.error);
      callbacks.onError?.(permResult.error || 'Microphone access denied', true);
      callbacks.onEnd?.();
      return;
    }

    // 3. Setup Web Audio API volume visualizer
    this.setupAudioVisualizer(callbacks.onVolumeChange);

    // 4. Instantiate a FRESH SpeechRecognition instance on every call
    const recognition = new SpeechRecognition();
    this.activeRecognition = recognition;
    this.isListening = true;

    recognition.continuous = true;
    recognition.interimResults = true;
    // Primary Urdu language with English fallback
    recognition.lang = 'ur-PK';

    let finalTranscript = '';
    let hasReceivedResult = false;

    const resetSilenceTimer = () => {
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      // Stop after 2.5 seconds of silence after user speaks
      this.silenceTimer = setTimeout(() => {
        if (this.isListening) {
          console.log('[SpeechRecognition] Silence timeout reached, stopping...');
          this.stopListening();
        }
      }, 2500);
    };

    recognition.onstart = () => {
      console.log('[SpeechRecognition] Event: onstart');
      callbacks.onStart?.();
      resetSilenceTimer();
    };

    recognition.onaudiostart = () => {
      console.log('[SpeechRecognition] Event: onaudiostart');
      callbacks.onAudioStart?.();
    };

    recognition.onsoundstart = () => {
      console.log('[SpeechRecognition] Event: onsoundstart');
      callbacks.onSoundStart?.();
    };

    recognition.onspeechstart = () => {
      console.log('[SpeechRecognition] Event: onspeechstart');
      callbacks.onSpeechStart?.();
    };

    recognition.onresult = (event: any) => {
      resetSilenceTimer();
      hasReceivedResult = true;
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      const currentText = (finalTranscript + interim).trim();
      console.log('[SpeechRecognition] Transcript:', currentText);
      callbacks.onPartialTranscript?.(currentText);
    };

    recognition.onerror = (event: any) => {
      console.warn('[SpeechRecognition] Event onerror:', event.error, event);
      this.clearSilenceTimer();

      let isPermission = false;
      let userFriendlyMsg = 'Speech recognition error. Please try again.';

      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          isPermission = true;
          userFriendlyMsg = 'Microphone access is blocked by browser or system security settings.';
          break;
        case 'audio-capture':
          isPermission = true;
          userFriendlyMsg = 'No audio captured. Check microphone connection.';
          break;
        case 'no-speech':
          userFriendlyMsg = 'سنائی نہیں دیا، دوبارہ بولیں / Didn\'t catch any voice, please try again.';
          break;
        case 'network':
          userFriendlyMsg = 'Network error during speech recognition. Check internet connection.';
          break;
        case 'language-not-supported':
          userFriendlyMsg = 'Urdu speech model not installed on device. Try speaking again or type.';
          // Try switching language to English as fallback
          try {
            recognition.lang = 'en-US';
          } catch (e) {
            console.warn('Fallback language failed', e);
          }
          break;
        case 'aborted':
          userFriendlyMsg = 'Speech listening was cancelled.';
          break;
        default:
          userFriendlyMsg = `Speech error (${event.error}). Please try again or type.`;
      }

      // If we already received some partial transcript, don't throw harsh error
      if (!hasReceivedResult) {
        callbacks.onError?.(userFriendlyMsg, isPermission);
      }
    };

    recognition.onnomatch = () => {
      console.warn('[SpeechRecognition] Event: onnomatch');
      callbacks.onError?.('سنائی نہیں دیا، دوبارہ بولیں / Could not match speech, try again.');
    };

    recognition.onend = () => {
      console.log('[SpeechRecognition] Event: onend');
      this.clearSilenceTimer();
      this.stopAudioVisualizer();
      this.isListening = false;

      const resultText = finalTranscript.trim();
      if (resultText) {
        callbacks.onFinalTranscript?.(resultText);
      } else if (!hasReceivedResult) {
        // If no speech captured at all
        callbacks.onError?.('سنائی نہیں دیا، دوبارہ بولیں / Didn\'t catch any speech, please try again.');
      }
      callbacks.onEnd?.();
    };

    try {
      console.log('[SpeechRecognition] Starting recognition session...');
      recognition.start();
      resetSilenceTimer();
    } catch (err: any) {
      console.error('[SpeechRecognition] Exception in start():', err);
      this.isListening = false;
      this.stopAudioVisualizer();
      callbacks.onError?.(`Could not launch microphone session: ${err.message || 'Unknown error'}`);
      callbacks.onEnd?.();
    }
  }

  public stopListening(): void {
    this.clearSilenceTimer();
    this.stopAudioVisualizer();

    if (this.activeRecognition && this.isListening) {
      this.isListening = false;
      try {
        console.log('[SpeechRecognition] Stopping active recognition...');
        this.activeRecognition.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
    }
    this.activeRecognition = null;
  }

  public isCurrentlyListening(): boolean {
    return this.isListening;
  }

  private clearSilenceTimer(): void {
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
  }

  private async setupAudioVisualizer(onVolumeChange?: (vol: number) => void) {
    if (!onVolumeChange || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        if (!this.isListening) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));
        onVolumeChange(normalizedVolume);
        this.animFrameId = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (err) {
      console.warn('Audio visualizer setup failed:', err);
    }
  }

  private stopAudioVisualizer(): void {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch (e) {
        console.warn('Error closing audioContext:', e);
      }
      this.audioContext = null;
    }
  }
}

export const speechHandler = new SpeechHandler();
