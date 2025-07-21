import { useState, useCallback, useRef } from 'react';

export const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(
    'speechSynthesis' in window && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );
  
  const recognitionRef = useRef(null);

  // Text-to-Speech 기능
  const speak = useCallback((text, lang = 'en-US', rate = 0.8) => {
    if (!speechSupported || !text) return;

    // 현재 말하고 있는 것을 중지
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [speechSupported]);

  // 음성 중지
  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  // Speech-to-Text 기능
  const startListening = useCallback((onResult, onError, lang = 'en-US') => {
    if (!speechSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;  // 연속 인식 활성화
    recognitionRef.current.interimResults = true;  // 중간 결과 표시
    recognitionRef.current.lang = lang;
    recognitionRef.current.maxAlternatives = 1;

    let finalTranscript = '';
    let isRecognitionActive = true;

    // 10초 후 자동 종료 타이머
    const timeoutId = setTimeout(() => {
      if (recognitionRef.current && isRecognitionActive) {
        recognitionRef.current.stop();
      }
    }, 10000);

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      isRecognitionActive = true;
    };

    recognitionRef.current.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      // 최종 결과가 있으면 콜백 호출
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
        clearTimeout(timeoutId);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      isRecognitionActive = false;
      clearTimeout(timeoutId);
      if (onError) onError(event.error);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      isRecognitionActive = false;
      clearTimeout(timeoutId);
      
      // 만약 결과가 없고 에러도 없었다면, 다시 시도
      if (!finalTranscript.trim() && isRecognitionActive) {
        // 2초 후 다시 시작 (사용자가 말을 안 했을 경우)
        setTimeout(() => {
          if (isRecognitionActive && recognitionRef.current) {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.log('Recognition restart failed:', e);
            }
          }
        }, 100);
      }
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Speech recognition start error:', error);
      if (onError) onError('start_failed');
    }
  }, [speechSupported]);

  // 음성 인식 중지
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    isSpeaking,
    isListening,
    speechSupported
  };
}; 