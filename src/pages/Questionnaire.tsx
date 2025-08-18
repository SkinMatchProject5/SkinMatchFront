import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Send, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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
  
  // 이전 페이지에서 전달받은 이미지 데이터
  const uploadedImage = location.state?.image;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

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
    // 이미지가 없으면 카메라 페이지로 리다이렉트
    if (!uploadedImage) {
      navigate('/camera');
      return;
    }
    
    // 첫 번째 질문으로 시작
    simulateTyping(questions[0].question, 500);
  }, [uploadedImage, navigate]);

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

    // 다음 질문 또는 완료
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      setTimeout(() => {
        simulateTyping(questions[nextIndex].question, 800);
      }, 500);
    } else {
      // 설문 완료
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
    // 설문조사 답변을 텍스트로 변환
    const additionalInfo = Object.entries(answers)
      .map(([key, value]) => {
        const question = questions.find(q => q.id === key);
        return `${question?.question.replace(/[.?!]/g, '')}: ${value}`;
      })
      .join('\n');

    // 이미지와 설문조사 데이터를 함께 분석 페이지로 전달
    navigate('/analysis', { 
      state: { 
        image: uploadedImage,
        additionalInfo: additionalInfo,
        questionnaireData: answers 
      } 
    });
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