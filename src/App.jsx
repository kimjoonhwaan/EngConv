import { useState, useEffect } from 'react';
import { Check, X, RotateCcw, MessageCircle, Coffee, ShoppingBag, Plane, Heart, Building, Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { useSpeech } from './hooks/useSpeech.js';

const ConversationalEnglishPractice = () => {
  const [currentScenario, setCurrentScenario] = useState('cafe');
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const [voiceModeEnabled, setVoiceModeEnabled] = useState(false);
  const [speechRecognitionText, setSpeechRecognitionText] = useState('');
  
  // 음성 기능 훅 사용
  const { speak, stopSpeaking, startListening, stopListening, isSpeaking, isListening, speechSupported } = useSpeech();

  const scenarios = {
    cafe: {
      title: "카페에서 주문하기",
      icon: Coffee,
      userRole: "손님",
      otherRole: "바리스타",
      steps: [
        {
          other: "Good morning! What can I get for you today?",
          otherKorean: "안녕하세요! 오늘 뭘 드릴까요?",
          userSentence: "I would like a large coffee please",
          userWords: ["I", "would", "like", "a", "large", "coffee", "please"],
          userKorean: "큰 사이즈 커피 하나 주세요"
        },
        {
          other: "Would you like that hot or iced?",
          otherKorean: "뜨거운 걸로 하시겠어요, 아니면 차가운 걸로 하시겠어요?",
          userSentence: "Hot please and can I add some sugar",
          userWords: ["Hot", "please", "and", "can", "I", "add", "some", "sugar"],
          userKorean: "뜨거운 걸로 주시고 설탕 좀 넣어주세요"
        },
        {
          other: "Sure! That'll be $4.50. How would you like to pay?",
          otherKorean: "네! 4달러 50센트입니다. 어떻게 결제하시겠어요?",
          userSentence: "I will pay with my credit card",
          userWords: ["I", "will", "pay", "with", "my", "credit", "card"],
          userKorean: "신용카드로 결제하겠습니다"
        },
        {
          other: "Perfect! Your coffee will be ready in just a moment.",
          otherKorean: "완벽해요! 커피가 곧 준비될 예정입니다.",
          userSentence: "Thank you very much have a nice day",
          userWords: ["Thank", "you", "very", "much", "have", "a", "nice", "day"],
          userKorean: "정말 감사합니다, 좋은 하루 보내세요"
        }
      ]
    },
    shopping: {
      title: "쇼핑몰에서 쇼핑하기",
      icon: ShoppingBag,
      userRole: "고객",
      otherRole: "점원",
      steps: [
        {
          other: "Hi there! Can I help you find anything today?",
          otherKorean: "안녕하세요! 오늘 찾으시는 것이 있나요?",
          userSentence: "Yes I am looking for a blue shirt",
          userWords: ["Yes", "I", "am", "looking", "for", "a", "blue", "shirt"],
          userKorean: "네, 파란색 셔츠를 찾고 있어요"
        },
        {
          other: "What size do you need?",
          otherKorean: "어떤 사이즈가 필요하세요?",
          userSentence: "I need a medium size please",
          userWords: ["I", "need", "a", "medium", "size", "please"],
          userKorean: "미디움 사이즈가 필요해요"
        },
        {
          other: "Here's a nice blue shirt in medium. Would you like to try it on?",
          otherKorean: "여기 미디움 사이즈 파란 셔츠가 있어요. 입어보시겠어요?",
          userSentence: "Yes where is the fitting room",
          userWords: ["Yes", "where", "is", "the", "fitting", "room"],
          userKorean: "네, 피팅룸이 어디에 있나요"
        },
        {
          other: "The fitting room is right over there. How does it fit?",
          otherKorean: "피팅룸은 바로 저기에 있어요. 사이즈가 어떤가요?",
          userSentence: "It fits perfectly I will take it",
          userWords: ["It", "fits", "perfectly", "I", "will", "take", "it"],
          userKorean: "완벽하게 맞아요, 이걸로 할게요"
        }
      ]
    },
    airport: {
      title: "공항에서 체크인하기",
      icon: Plane,
      userRole: "승객",
      otherRole: "체크인 직원",
      steps: [
        {
          other: "Good afternoon! May I see your passport and ticket please?",
          otherKorean: "안녕하세요! 여권과 티켓을 보여주시겠어요?",
          userSentence: "Here is my passport and boarding pass",
          userWords: ["Here", "is", "my", "passport", "and", "boarding", "pass"],
          userKorean: "여기 제 여권과 탑승권이 있습니다"
        },
        {
          other: "Thank you. Do you have any bags to check in?",
          otherKorean: "감사합니다. 체크인할 짐이 있으신가요?",
          userSentence: "Yes I have one suitcase to check",
          userWords: ["Yes", "I", "have", "one", "suitcase", "to", "check"],
          userKorean: "네, 체크인할 여행가방이 하나 있어요"
        },
        {
          other: "Perfect. Your gate is B12 and boarding starts at 3:30 PM.",
          otherKorean: "완벽해요. 탑승구는 B12이고 탑승은 오후 3시 30분에 시작됩니다.",
          userSentence: "What time does the plane take off",
          userWords: ["What", "time", "does", "the", "plane", "take", "off"],
          userKorean: "비행기는 몇 시에 출발하나요"
        }
      ]
    },
    hospital: {
      title: "병원에서 진료받기",
      icon: Heart,
      userRole: "환자",
      otherRole: "의사",
      steps: [
        {
          other: "Hello! What seems to be the problem today?",
          otherKorean: "안녕하세요! 오늘 어디가 아프신가요?",
          userSentence: "I have a bad headache and feel dizzy",
          userWords: ["I", "have", "a", "bad", "headache", "and", "feel", "dizzy"],
          userKorean: "심한 두통이 있고 어지러워요"
        },
        {
          other: "How long have you been feeling this way?",
          otherKorean: "언제부터 그런 증상이 있었나요?",
          userSentence: "Since yesterday morning it started suddenly",
          userWords: ["Since", "yesterday", "morning", "it", "started", "suddenly"],
          userKorean: "어제 아침부터 갑자기 시작됐어요"
        },
        {
          other: "I see. Have you been taking any medication?",
          otherKorean: "그렇군요. 복용하고 있는 약이 있나요?",
          userSentence: "No I have not taken anything",
          userWords: ["No", "I", "have", "not", "taken", "anything"],
          userKorean: "아니요, 아무것도 복용하지 않았어요"
        }
      ]
    },
    hotel: {
      title: "호텔에서 체크인하기",
      icon: Building,
      userRole: "투숙객",
      otherRole: "프론트 직원",
      steps: [
        {
          other: "Welcome! Do you have a reservation with us?",
          otherKorean: "환영합니다! 예약이 되어 있으신가요?",
          userSentence: "Yes I have a reservation under Smith",
          userWords: ["Yes", "I", "have", "a", "reservation", "under", "Smith"],
          userKorean: "네, 스미스 이름으로 예약이 되어 있어요"
        },
        {
          other: "Perfect! I found your reservation. You're staying for 3 nights, correct?",
          otherKorean: "완벽해요! 예약을 찾았습니다. 3박 하시는 게 맞죠?",
          userSentence: "Yes that is correct for three nights",
          userWords: ["Yes", "that", "is", "correct", "for", "three", "nights"],
          userKorean: "네, 맞습니다. 3박이에요"
        },
        {
          other: "Great! Here's your room key. You're in room 305 on the third floor.",
          otherKorean: "좋습니다! 여기 방 열쇠입니다. 3층 305호실이에요.",
          userSentence: "Thank you what time is breakfast served",
          userWords: ["Thank", "you", "what", "time", "is", "breakfast", "served"],
          userKorean: "감사합니다, 조식은 몇 시에 제공되나요"
        }
      ]
    }
  };

  const currentScenarioData = scenarios[currentScenario];
  const currentStepData = currentScenarioData.steps[currentStep];

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (currentStepData) {
      setAvailableWords(shuffleArray(currentStepData.userWords));
      setUserAnswer([]);
      setShowResult(false);
      setScenarioComplete(false);
    }
  }, [currentScenario, currentStep]);

  useEffect(() => {
    // 새로운 시나리오 시작 시 대화 히스토리 초기화
    setConversationHistory([]);
    setCurrentStep(0);
  }, [currentScenario]);

  const addWordToAnswer = (word, index) => {
    setUserAnswer([...userAnswer, word]);
    setAvailableWords(availableWords.filter((_, i) => i !== index));
  };

  const removeWordFromAnswer = (index) => {
    const removedWord = userAnswer[index];
    setUserAnswer(userAnswer.filter((_, i) => i !== index));
    setAvailableWords([...availableWords, removedWord]);
  };

  const checkAnswer = () => {
    const correct = userAnswer.join(' ') === currentStepData.userSentence;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      // 대화 히스토리에 추가
      const newHistory = [
        ...conversationHistory,
        {
          speaker: currentScenarioData.otherRole,
          message: currentStepData.other,
          korean: currentStepData.otherKorean
        },
        {
          speaker: currentScenarioData.userRole,
          message: currentStepData.userSentence,
          korean: currentStepData.userKorean
        }
      ];
      setConversationHistory(newHistory);
    }
  };

  const nextStep = () => {
    if (currentStep + 1 < currentScenarioData.steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setScenarioComplete(true);
    }
  };

  const resetStep = () => {
    setAvailableWords(shuffleArray(currentStepData.userWords));
    setUserAnswer([]);
    setShowResult(false);
  };

  const changeScenario = (scenario) => {
    setCurrentScenario(scenario);
    setCurrentStep(0);
    setConversationHistory([]);
    setScenarioComplete(false);
    stopSpeaking(); // 음성 중지
  };

  // TTS 기능들
  const speakOtherMessage = () => {
    if (currentStepData) {
      speak(currentStepData.other, 'en-US', 0.8);
    }
  };

  const speakUserMessage = (message) => {
    speak(message, 'en-US', 0.8);
  };

  const speakKoreanMessage = (message) => {
    speak(message, 'ko-KR', 0.8);
  };

  // STT 기능
  const startVoiceRecognition = () => {
    if (!speechSupported) {
      alert('죄송합니다. 이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    // 기존 음성 인식 결과 초기화
    setSpeechRecognitionText('');

    startListening(
      (transcript) => {
        console.log('음성 인식 결과:', transcript);
        setSpeechRecognitionText(transcript);
        
        // 음성 인식 결과를 단어로 분리하고 처리
        const words = transcript.toLowerCase()
          .replace(/[^\w\s]/g, '') // 특수문자 제거
          .split(/\s+/)
          .filter(word => word.length > 0);
        
        const targetWords = currentStepData.userWords.map(w => w.toLowerCase());
        
        // 더 정확한 단어 매칭 로직
        const recognizedWords = [];
        const usedTargetIndices = new Set();
        
        // 정확히 일치하는 단어들 먼저 찾기
        words.forEach(word => {
          const exactMatchIndex = targetWords.findIndex((target, index) => 
            target === word && !usedTargetIndices.has(index)
          );
          if (exactMatchIndex !== -1) {
            const originalWord = currentStepData.userWords[exactMatchIndex];
            if (!recognizedWords.includes(originalWord)) {
              recognizedWords.push(originalWord);
              usedTargetIndices.add(exactMatchIndex);
            }
          }
        });
        
        // 부분 일치하는 단어들 찾기 (정확한 매치가 없었을 때만)
        if (recognizedWords.length < words.length) {
          words.forEach(word => {
            if (word.length < 3) return; // 너무 짧은 단어는 제외
            
            const partialMatchIndex = targetWords.findIndex((target, index) => 
              (target.includes(word) || word.includes(target)) && 
              !usedTargetIndices.has(index) &&
              Math.abs(target.length - word.length) <= 3
            );
            
            if (partialMatchIndex !== -1) {
              const originalWord = currentStepData.userWords[partialMatchIndex];
              if (!recognizedWords.includes(originalWord)) {
                recognizedWords.push(originalWord);
                usedTargetIndices.add(partialMatchIndex);
              }
            }
          });
        }

        if (recognizedWords.length > 0) {
          setUserAnswer(recognizedWords);
          // 인식된 단어들을 available words에서 제거
          const remainingWords = availableWords.filter(word => 
            !recognizedWords.includes(word)
          );
          setAvailableWords(remainingWords);
        } else {
          // 인식된 단어가 없을 때 사용자에게 알림
          console.log('인식된 단어가 정답에 포함되어 있지 않습니다.');
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        let errorMessage = '음성 인식 중 오류가 발생했습니다';
        
        switch(error) {
          case 'not-allowed':
            errorMessage = '마이크 접근 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.';
            break;
          case 'no-speech':
            errorMessage = '음성이 감지되지 않았습니다. 다시 시도해주세요.';
            break;
          case 'audio-capture':
            errorMessage = '마이크에 문제가 있습니다. 마이크가 연결되어 있는지 확인해주세요.';
            break;
          case 'network':
            errorMessage = '네트워크 연결에 문제가 있습니다.';
            break;
          default:
            errorMessage += `: ${error}`;
        }
        
        alert(errorMessage);
        setSpeechRecognitionText(`오류: ${errorMessage}`);
      },
      'en-US'
    );
  };

  const ScenarioIcon = currentScenarioData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 text-center mb-3 sm:mb-4">
            실생활 영어 대화 연습
          </h1>
          
          {/* Speech Support Indicator */}
          <div className="text-center mb-3 sm:mb-4">
            {speechSupported ? (
              <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-green-50 text-green-700 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                <Volume2 size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">음성 기능이 지원됩니다!</span>
                <span className="sm:hidden">음성 지원</span>
              </div>
            ) : (
              <div className="inline-flex items-center space-x-1 sm:space-x-2 bg-yellow-50 text-yellow-700 px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm">
                <VolumeX size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">이 브라우저는 음성 기능을 지원하지 않습니다</span>
                <span className="sm:hidden">음성 미지원</span>
              </div>
            )}
          </div>
          
          {/* Scenario Selection */}
          <div className="mb-3 sm:mb-4">
            <div className="flex overflow-x-auto gap-2 sm:gap-4 pb-2 sm:grid sm:grid-cols-2 md:grid-cols-5 sm:overflow-visible">
              {Object.entries(scenarios).map(([key, scenario]) => {
                const Icon = scenario.icon;
                return (
                  <button
                    key={key}
                    onClick={() => changeScenario(key)}
                    onMouseDown={(e) => e.preventDefault()}
                    className={`flex-shrink-0 p-2 sm:p-4 rounded-lg text-center transition-all duration-200 focus:outline-none focus:ring-0 min-w-[80px] sm:min-w-0 ${
                      currentScenario === key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                    }`}
                  >
                    <Icon size={20} className="sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm font-medium leading-tight">{scenario.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
              <ScenarioIcon size={16} className="sm:w-5 sm:h-5 text-blue-600" />
              <span className="font-semibold text-base sm:text-lg">{currentScenarioData.title}</span>
            </div>
            <p className="text-sm sm:text-base text-gray-600">
              당신은 <span className="font-medium text-blue-600">{currentScenarioData.userRole}</span> 역할입니다
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Conversation History */}
          <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 order-1 lg:order-1">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center">
              <MessageCircle size={18} className="sm:w-5 sm:h-5 mr-1 sm:mr-2 text-blue-600" />
              대화 진행상황
            </h2>
            
            <div className="space-y-2 sm:space-y-4 max-h-64 sm:max-h-96 overflow-y-auto">
              {conversationHistory.map((entry, index) => (
                                  <div key={index} className={`flex ${entry.speaker === currentScenarioData.userRole ? 'justify-end' : 'justify-start'} items-end space-x-1 sm:space-x-2`}>
                   {entry.speaker !== currentScenarioData.userRole && speechSupported && (
                     <button
                       onClick={() => speak(entry.message, 'en-US', 0.8)}
                       disabled={isSpeaking}
                       onMouseDown={(e) => e.preventDefault()}
                       className={`p-1 rounded-full text-xs transition-all duration-200 focus:outline-none focus:ring-0 ${
                         isSpeaking 
                           ? 'bg-red-100 text-red-600' 
                           : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300'
                       }`}
                       title="영어 음성 듣기"
                     >
                       {isSpeaking ? <VolumeX size={10} className="sm:w-3 sm:h-3" /> : <Volume2 size={10} className="sm:w-3 sm:h-3" />}
                     </button>
                   )}
                   
                  <div className={`max-w-[280px] sm:max-w-xs p-2 sm:p-3 rounded-lg ${
                    entry.speaker === currentScenarioData.userRole 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="font-medium text-xs mb-1">{entry.speaker}</p>
                    <p className="text-xs sm:text-sm leading-relaxed">{entry.message}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs opacity-75 flex-1 mr-1">{entry.korean}</p>
                      {speechSupported && (
                        <button
                          onClick={() => speak(entry.korean, 'ko-KR', 0.8)}
                          disabled={isSpeaking}
                          onMouseDown={(e) => e.preventDefault()}
                          className={`p-1 rounded text-xs transition-all duration-200 focus:outline-none focus:ring-0 flex-shrink-0 ${
                            entry.speaker === currentScenarioData.userRole 
                              ? (isSpeaking ? 'bg-blue-700 text-blue-200' : 'bg-blue-700 text-blue-100 hover:bg-blue-800')
                              : (isSpeaking ? 'bg-gray-400 text-gray-600' : 'bg-gray-300 text-gray-600 hover:bg-gray-400')
                          }`}
                          title="한국어 번역 듣기"
                        >
                          🇰🇷
                        </button>
                      )}
                    </div>
                  </div>

                   {entry.speaker === currentScenarioData.userRole && speechSupported && (
                     <button
                       onClick={() => speak(entry.message, 'en-US', 0.8)}
                       disabled={isSpeaking}
                       onMouseDown={(e) => e.preventDefault()}
                       className={`p-1 rounded-full text-xs transition-all duration-200 focus:outline-none focus:ring-0 ${
                         isSpeaking 
                           ? 'bg-red-100 text-red-600' 
                           : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300'
                       }`}
                       title="내 답변 음성 듣기"
                     >
                       {isSpeaking ? <VolumeX size={10} className="sm:w-3 sm:h-3" /> : <Volume2 size={10} className="sm:w-3 sm:h-3" />}
                     </button>
                   )}
                </div>
              ))}
              
              {/* Current other person's message */}
              {!scenarioComplete && currentStepData && (
                <div className="flex justify-start items-end space-x-1 sm:space-x-2">
                  <div className="max-w-[280px] sm:max-w-xs p-2 sm:p-3 rounded-lg bg-gray-200 text-gray-800">
                    <p className="font-medium text-xs mb-1">{currentScenarioData.otherRole}</p>
                    <p className="text-xs sm:text-sm leading-relaxed">{currentStepData.other}</p>
                    <p className="text-xs opacity-75 mt-1">{currentStepData.otherKorean}</p>
                  </div>
                  {speechSupported && (
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={speakOtherMessage}
                        disabled={isSpeaking}
                        onMouseDown={(e) => e.preventDefault()} // 포커스 방지
                        className={`p-1.5 sm:p-2 rounded-full text-xs transition-all duration-200 focus:outline-none focus:ring-0 ${
                          isSpeaking 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300'
                        }`}
                        title="영어 음성 듣기"
                      >
                        {isSpeaking ? <VolumeX size={12} className="sm:w-4 sm:h-4" /> : <Volume2 size={12} className="sm:w-4 sm:h-4" />}
                      </button>
                      <button
                        onClick={() => speakKoreanMessage(currentStepData.otherKorean)}
                        disabled={isSpeaking}
                        onMouseDown={(e) => e.preventDefault()}
                        className={`p-1.5 sm:p-2 rounded-full text-xs transition-all duration-200 focus:outline-none focus:ring-0 ${
                          isSpeaking 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200 active:bg-green-300'
                        }`}
                        title="한국어 음성 듣기"
                      >
                        🇰🇷
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {scenarioComplete && (
              <div className="text-center mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 rounded-lg">
                <h3 className="text-base sm:text-lg font-bold text-green-800 mb-2">🎉 대화 완료!</h3>
                <p className="text-green-600 text-sm sm:text-base">훌륭해요! 이 상황에서의 대화를 성공적으로 마쳤습니다.</p>
                <button
                  onClick={() => changeScenario(Object.keys(scenarios)[0])}
                  onMouseDown={(e) => e.preventDefault()}
                  className="mt-3 bg-green-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-600 active:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-0 text-sm sm:text-base w-full sm:w-auto"
                >
                  다른 상황 연습하기
                </button>
              </div>
            )}
          </div>

          {/* Answer Input Area */}
          {!scenarioComplete && (
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6 order-2 lg:order-2">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">당신의 대답</h2>
              
              {/* Korean prompt */}
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-blue-800 font-medium text-sm sm:text-base">다음과 같이 말해보세요:</p>
                    <p className="text-blue-600 text-base sm:text-lg leading-relaxed">"{currentStepData?.userKorean}"</p>
                  </div>
                  {speechSupported && (
                    <button
                      onClick={() => speakKoreanMessage(currentStepData?.userKorean)}
                      disabled={isSpeaking}
                      onMouseDown={(e) => e.preventDefault()}
                      className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-0 flex-shrink-0 ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200 active:bg-green-300'
                      }`}
                      title="한국어 음성 듣기"
                    >
                      {isSpeaking ? <VolumeX size={14} className="sm:w-4 sm:h-4" /> : <Volume2 size={14} className="sm:w-4 sm:h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* User's Answer Area */}
              <div className="mb-3 sm:mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-600">영어로:</p>
                  {speechSupported && userAnswer.length > 0 && (
                    <button
                      onClick={() => speakUserMessage(userAnswer.join(' '))}
                      disabled={isSpeaking}
                      onMouseDown={(e) => e.preventDefault()}
                      className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs transition-all duration-200 focus:outline-none focus:ring-0 ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300'
                      }`}
                      title="현재 답변 음성으로 듣기"
                    >
                      {isSpeaking ? <VolumeX size={12} className="sm:w-3.5 sm:h-3.5" /> : <Volume2 size={12} className="sm:w-3.5 sm:h-3.5" />}
                      <span className="text-xs">듣기</span>
                    </button>
                  )}
                </div>
                <div className="min-h-[50px] sm:min-h-[60px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-2 sm:p-3 flex flex-wrap gap-1 sm:gap-2 items-center">
                  {userAnswer.length === 0 ? (
                    <span className="text-gray-400 italic text-xs sm:text-sm">단어를 클릭하여 문장을 만들어보세요</span>
                  ) : (
                    userAnswer.map((word, index) => (
                      <button
                        key={`answer-${index}`}
                        onClick={() => removeWordFromAnswer(index)}
                        onMouseDown={(e) => e.preventDefault()}
                        className="bg-blue-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-0 text-xs sm:text-sm"
                      >
                        {word}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Available Words */}
              <div className="mb-4 sm:mb-6">
                <p className="text-sm font-medium text-gray-600 mb-2">사용할 수 있는 단어:</p>
                <div className="flex flex-wrap gap-1 sm:gap-2">
                  {availableWords.map((word, index) => (
                    <button
                      key={`available-${index}`}
                      onClick={() => addWordToAnswer(word, index)}
                      onMouseDown={(e) => e.preventDefault()}
                      className="bg-gray-200 text-gray-700 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-300 active:bg-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 text-xs sm:text-sm"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speech Recognition Result */}
              {(speechRecognitionText || isListening) && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border-l-4 ${
                  isListening 
                    ? 'bg-purple-50 border-purple-400' 
                    : speechRecognitionText.startsWith('오류:')
                    ? 'bg-red-50 border-red-400'
                    : 'bg-green-50 border-green-400'
                }`}>
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <p className={`font-medium text-xs sm:text-sm flex-1 ${
                      isListening 
                        ? 'text-purple-800' 
                        : speechRecognitionText.startsWith('오류:')
                        ? 'text-red-800'
                        : 'text-green-800'
                    }`}>
                      {isListening ? '🎤 음성 인식 중...' : '음성 인식 결과:'}
                    </p>
                    {!isListening && (
                      <button
                        onClick={() => setSpeechRecognitionText('')}
                        onMouseDown={(e) => e.preventDefault()}
                        className={`text-xs hover:opacity-80 flex-shrink-0 focus:outline-none ${
                          speechRecognitionText.startsWith('오류:')
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        × 닫기
                      </button>
                    )}
                  </div>
                  
                  {isListening ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                      <div className="animate-pulse text-purple-600 text-xs sm:text-sm">
                        말씀하시면 자동으로 단어를 배치합니다...
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className={`text-xs sm:text-sm italic break-words ${
                        speechRecognitionText.startsWith('오류:')
                          ? 'text-red-700'
                          : 'text-green-700'
                      }`}>
                        "{speechRecognitionText}"
                      </p>
                      {!speechRecognitionText.startsWith('오류:') && (
                        <p className="text-xs text-gray-600 mt-1">
                          💡 인식된 단어가 자동으로 배치되었습니다!
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={userAnswer.length === 0 || showResult}
                  onMouseDown={(e) => e.preventDefault()}
                  className={`flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0 text-sm sm:text-base ${
                    userAnswer.length === 0 || showResult
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700'
                  }`}
                >
                  <Check size={16} className="sm:w-5 sm:h-5" />
                  <span>확인</span>
                </button>

                {speechSupported && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
                    <button
                      onClick={isListening ? stopListening : startVoiceRecognition}
                      disabled={showResult}
                      onBlur={(e) => e.target.blur()}
                      className={`flex items-center justify-center space-x-2 px-3 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-0 text-sm sm:text-base w-full sm:w-auto ${
                        showResult
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isListening
                          ? 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 animate-pulse'
                          : 'bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700'
                      }`}
                    >
                      {isListening ? <MicOff size={16} className="sm:w-5 sm:h-5" /> : <Mic size={16} className="sm:w-5 sm:h-5" />}
                      <span className="text-xs sm:text-sm">
                        {isListening ? '중지 (최대 10초)' : '음성으로 말하기'}
                      </span>
                    </button>
                    
                    {isListening && (
                      <div className="text-xs sm:text-sm text-purple-600 font-medium animate-pulse text-center sm:text-left">
                        🎤 말씀하세요...
                      </div>
                    )}
                  </div>
                )}
                
                <button
                  onClick={resetStep}
                  onMouseDown={(e) => e.preventDefault()}
                  className="flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 active:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-0 text-sm sm:text-base"
                >
                  <RotateCcw size={16} className="sm:w-5 sm:h-5" />
                  <span>다시</span>
                </button>
              </div>

              {/* Result */}
              {showResult && (
                <div className={`p-3 sm:p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 border-l-4 border-green-400' : 'bg-red-50 border-l-4 border-red-400'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isCorrect ? (
                      <>
                        <Check className="text-green-600" size={20} />
                        <span className="text-green-800 font-semibold text-base sm:text-lg">완벽해요! 🎉</span>
                      </>
                    ) : (
                      <>
                        <X className="text-red-600" size={20} />
                        <span className="text-red-800 font-semibold text-base sm:text-lg">다시 한번 시도해보세요</span>
                      </>
                    )}
                  </div>
                  
                  {!isCorrect && (
                    <div className="mt-2 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1">
                          <p className="text-red-700 text-xs sm:text-sm break-words">
                            <strong>정답:</strong> {currentStepData.userSentence}
                          </p>
                        </div>
                        {speechSupported && (
                          <button
                            onClick={() => speakUserMessage(currentStepData.userSentence)}
                            disabled={isSpeaking}
                            onMouseDown={(e) => e.preventDefault()}
                            className={`p-1.5 rounded transition-all duration-200 focus:outline-none focus:ring-0 flex-shrink-0 ${
                              isSpeaking 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300'
                            }`}
                            title="정답 음성 듣기"
                          >
                            {isSpeaking ? <VolumeX size={12} className="sm:w-3.5 sm:h-3.5" /> : <Volume2 size={12} className="sm:w-3.5 sm:h-3.5" />}
                          </button>
                        )}
                      </div>
                      <p className="text-red-700 text-xs sm:text-sm break-words">
                        <strong>당신의 답:</strong> {userAnswer.join(' ')}
                      </p>
                    </div>
                  )}

                  {isCorrect && (
                    <div className="mt-3 sm:mt-4 space-y-3">
                      {speechSupported && (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:space-x-2">
                          <span className="text-green-700 text-xs sm:text-sm">내 답변:</span>
                          <button
                            onClick={() => speakUserMessage(currentStepData.userSentence)}
                            disabled={isSpeaking}
                            onMouseDown={(e) => e.preventDefault()}
                            className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full text-xs transition-all duration-200 focus:outline-none focus:ring-0 ${
                              isSpeaking 
                                ? 'bg-red-100 text-red-600' 
                                : 'bg-green-100 text-green-600 hover:bg-green-200 active:bg-green-300'
                            }`}
                            title="내 답변 음성으로 듣기"
                          >
                            {isSpeaking ? <VolumeX size={12} /> : <Volume2 size={12} />}
                            <span className="text-xs break-words">"{currentStepData.userSentence}" 듣기</span>
                          </button>
                        </div>
                      )}
                      <div className="text-center">
                        <button
                          onClick={nextStep}
                          onMouseDown={(e) => e.preventDefault()}
                          className="bg-blue-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-0 text-sm sm:text-base w-full sm:w-auto"
                        >
                          대화 계속하기
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress */}
              <div className="text-center text-gray-600">
                <p className="text-xs sm:text-sm mb-2">진행상황: {currentStep + 1} / {currentScenarioData.steps.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / currentScenarioData.steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationalEnglishPractice;