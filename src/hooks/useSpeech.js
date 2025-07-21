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

    // 60초 후 안전 종료 타이머 (자동 중지 방지용)
    const safetyTimeoutId = setTimeout(() => {
      if (recognitionRef.current && isRecognitionActive) {
        recognitionRef.current.stop();
        console.log('음성 인식이 60초 제한으로 인해 종료되었습니다.');
      }
    }, 60000);

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
      
      // 최종 결과가 있어도 자동으로 중지하지 않고 계속 듣기
      if (finalTranscript.trim()) {
        onResult(finalTranscript.trim());
        // 자동 중지 제거 - clearTimeout(safetyTimeoutId); 호출하지 않음
        console.log('음성 인식 결과:', finalTranscript.trim(), '- 계속 듣는 중...');
      }
    };

    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      isRecognitionActive = false;
      clearTimeout(safetyTimeoutId);
      if (onError) onError(event.error);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      isRecognitionActive = false;
      clearTimeout(safetyTimeoutId);
      
      // 자동 재시작 제거 - 사용자가 수동으로 중지했거나 에러로 인한 종료일 때만 끝남
      console.log('음성 인식이 종료되었습니다.');
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