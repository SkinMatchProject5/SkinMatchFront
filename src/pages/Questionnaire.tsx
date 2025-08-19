import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logger } from '@/utils/logger';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface Question {
  id: string;
  question: string;
  options?: string[];
  type: 'text' | 'select' | 'number';
  required: boolean;
}

const Questionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [imageData, setImageData] = useState<{
    imageUrl: string;
    timestamp: string;
    source: string;
  } | null>(null);

  const questions: Question[] = [
    {
      id: 'age',
      question: '안녕하세요! 피부 분석을 위해 몇 가지 질문을 드릴게요. 먼저 나이를 알려주세요.',
      type: 'number',
      required: true
    },
    {
      id: 'gender',
      question: '성별을 선택해주세요.',
      options: ['남성', '여성', '기타'],
      type: 'select',
      required: true
    },
    {
      id: 'skinType',
      question: '평소 피부 타입은 어떤가요?',
      options: ['건성', '지성', '복합성', '민감성', '잘 모르겠어요'],
      type: 'select',
      required: true
    },
    {
      id: 'skinConcerns',
      question: '가장 고민되는 피부 문제가 있다면 무엇인가요?',
      options: ['주름/탄력', '모공', '색소침착', '여드름', '건조함', '유분과다', '민감함', '특별한 고민 없음'],
      type: 'select',
      required: true
    },
    {
      id: 'currentSymptoms',
      question: '현재 촬영한 부위에서 느끼는 증상이 있다면 선택해주세요.',
      options: ['가려움', '따가움', '뜨거움', '건조함', '붓기', '통증', '없음'],
      type: 'select',
      required: true
    },
    {
      id: 'symptomDuration',
      question: '해당 증상이 언제부터 시작되었나요?',
      options: ['최근 며칠', '1-2주 전', '1개월 전', '3개월 이상', '정확히 모르겠음'],
      type: 'select',
      required: true
    },
    {
      id: 'surgeryHistory',
      question: '피부 관련 시술이나 수술 경험이 있으신가요?',
      options: ['없음', '레이저 시술', '필러/보톡스', '성형수술', '기타'],
      type: 'select',
      required: true
    },
    {
      id: 'allergies',
      question: '화장품이나 피부 관련 알레르기가 있으신가요? (없으면 "없음"이라고 입력해주세요)',
      type: 'text',
      required: true
    },
    {
      id: 'medications',
      question: '현재 복용 중인 약물이나 바르고 있는 연고가 있다면 알려주세요. (없으면 "없음")',
      type: 'text',
      required: false
    },
    {
      id: 'skincare',
      question: '현재 사용하고 있는 스킨케어 루틴이 있다면 간단히 알려주세요.',
      type: 'text',
      required: false
    }
  ];

  const simulateTyping = (message: string, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    }, delay);
  };

  useEffect(() => {
    // location.state에서 이미지 데이터 받기
    if (location.state) {
      const { imageUrl, timestamp, source } = location.state as any;
      if (imageUrl) {
        setImageData({ imageUrl, timestamp, source });
        logger.info('설문조사에서 이미지 데이터 수신', {
          imageSize: imageUrl.length,
          timestamp,
          source
        });
      }
    } else {
      // 이미지 데이터가 없으면 카메라 페이지로 리다이렉트
      logger.warn('설문조사에 필요한 이미지 데이터가 없음 - 카메라 페이지로 리다이렉트');
      navigate('/camera', { replace: true });
      return;
    }

    // 첫 번째 질문으로 시작
    simulateTyping(questions[0].question, 500);
  }, [location.state, navigate]);

  const handleSendAnswer = (answer: string) => {
    if (!answer.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // 사용자 메시지 추가
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: answer,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // 답변 저장
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setCurrentInput('');

    // 답변 로그
    logger.info('설문 답변 저장', {
      questionId: currentQuestion.id,
      question: currentQuestion.question.substring(0, 50) + '...',
      answer: answer,
      questionIndex: currentQuestionIndex + 1,
      totalQuestions: questions.length
    });

    // 다음 질문 또는 완료
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      setTimeout(() => {
        simulateTyping(questions[nextIndex].question, 800);
      }, 500);
    } else {
      // 설문 완료
      logger.info('설문조사 완료', {
        totalAnswers: Object.keys(answers).length + 1, // +1 for current answer
        answers: { ...answers, [currentQuestion.id]: answer }
      });
      
      setTimeout(() => {
        simulateTyping('설문조사가 완료되었습니다! 이제 AI 분석을 시작하겠습니다. 💫', 800);
        setIsCompleted(true);
      }, 500);
    }
  };

  const handleOptionSelect = (option: string) => {
    handleSendAnswer(option);
  };

  const handleStartAnalysis = () => {
    if (!imageData) {
      logger.error('AI 분석 시작 실패 - 이미지 데이터 없음');
      return;
    }

    // 설문조사 데이터를 AI 분석에 적합한 형태로 변환
    const questionnaireText = Object.entries(answers).map(([key, value]) => {
      const question = questions.find(q => q.id === key);
      return `${question?.question}: ${value}`;
    }).join('\n');

    const additionalInfo = `
환자 기본 정보:
- 나이: ${answers.age}세
- 성별: ${answers.gender}
- 피부 타입: ${answers.skinType}

피부 상태 및 증상:
- 주요 고민: ${answers.skinConcerns}
- 현재 증상: ${answers.currentSymptoms}
- 증상 지속 기간: ${answers.symptomDuration}

병력 및 치료:
- 시술 경험: ${answers.surgeryHistory}
- 알레르기: ${answers.allergies}
- 복용 약물: ${answers.medications || '없음'}

관리 현황:
- 스킨케어 루틴: ${answers.skincare || '특별한 루틴 없음'}

위 정보를 바탕으로 피부 병변을 정확히 진단해주세요.
`.trim();

    logger.info('AI 분석 시작 - 이미지와 설문조사 데이터 전송', {
      hasImage: !!imageData.imageUrl,
      imageSize: imageData.imageUrl.length,
      questionnaireDataLength: additionalInfo.length,
      answersCount: Object.keys(answers).length,
      timestamp: new Date().toISOString()
    });

    // 분석 페이지로 이미지와 설문조사 데이터 함께 전송
    navigate('/analysis', { 
      state: { 
        imageUrl: imageData.imageUrl,
        questionnaireData: answers,
        additionalInfo: additionalInfo,
        timestamp: new Date().toISOString(),
        source: 'questionnaire'
      } 
    });

    logger.info('분석 페이지 네비게이션 완료');
  };

  const currentQuestion = questions[currentQuestionIndex];
  const showOptions = currentQuestion?.type === 'select' && !isCompleted;

  return (
    <div className="min-h-screen bg-gradient-glass p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gradient-primary mb-2">
            피부 분석 설문조사
          </h1>
          <p className="text-muted-foreground">
            정확한 분석을 위해 몇 가지 질문에 답해주세요
          </p>
          <div className="mt-4">
            <Badge variant="outline" className="px-4 py-2">
              {currentQuestionIndex + 1} / {questions.length}
            </Badge>
          </div>
        </div>

        {/* 채팅 영역 */}
        <Card className="glass-card mb-4" style={{ height: '60vh' }}>
          <CardContent className="p-0 h-full flex flex-col">
            {/* 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <Avatar className="w-8 h-8">
                      {message.type === 'bot' ? (
                        <>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarFallback className="bg-secondary">
                            <User className="w-4 h-4" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* 타이핑 인디케이터 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 입력 영역 */}
            <div className="border-t p-4">
              {isCompleted ? (
                <div className="text-center">
                  <Button 
                    onClick={handleStartAnalysis}
                    className="bg-gradient-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    AI 분석 시작하기
                  </Button>
                </div>
              ) : (
                <>
                  {/* 선택지 버튼들 */}
                  {showOptions && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {currentQuestion.options?.map((option, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={() => handleOptionSelect(option)}
                          className="text-sm h-auto py-2 px-3 whitespace-normal"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* 텍스트 입력 */}
                  {(currentQuestion?.type === 'text' || currentQuestion?.type === 'number') && (
                    <div className="flex gap-2">
                      <Input
                        type={currentQuestion.type === 'number' ? 'number' : 'text'}
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="답변을 입력해주세요..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendAnswer(currentInput);
                          }
                        }}
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => handleSendAnswer(currentInput)}
                        disabled={!currentInput.trim()}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 진행 상황 */}
        <div className="text-center text-sm text-muted-foreground">
          설문조사 완료 후 AI 분석이 시작됩니다
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;