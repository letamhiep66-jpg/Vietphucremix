import { useState, useEffect, useRef, useCallback } from 'react';

// Declarations for Web Speech API
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export interface UseVoiceInputOptions {
  lang?: string;
  onResult?: (transcript: string) => void;
  onError?: (errorMessage: string) => void;
}

export function useVoiceInput(options: UseVoiceInputOptions = {}) {
  const { lang = 'vi-VN', onResult, onError } = options;

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            currentFinal += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (currentFinal) {
          const cleanedFinal = currentFinal.trim();
          setTranscript(cleanedFinal);
          setInterimTranscript('');
          if (onResult) {
            onResult(cleanedFinal);
          }
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event: any) => {
        let msg = 'Không thể thu âm';
        if (event.error === 'not-allowed') {
          msg = 'Bạn chưa cấp quyền truy cập micro trên trình duyệt.';
        } else if (event.error === 'no-speech') {
          msg = 'Chưa nghe thấy giọng nói. Vui lòng thử lại gần micro hơn.';
        } else if (event.error === 'network') {
          msg = 'Lỗi kết nối mạng khi nhận diện giọng nói.';
        }
        setError(msg);
        setIsListening(false);
        if (onError) onError(msg);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [lang, onResult, onError]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói Web Speech.');
      return;
    }
    setError(null);
    setTranscript('');
    setInterimTranscript('');

    try {
      recognitionRef.current.start();
    } catch (e) {
      // If already started, restart
      try {
        recognitionRef.current.abort();
        setTimeout(() => recognitionRef.current?.start(), 100);
      } catch {
        setError('Không thể khởi động micro.');
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
