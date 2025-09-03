import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Typography } from '@/components/ui/theme-typography';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import MarkdownMessage from '@/components/chat/MarkdownMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, TrendingUp, AlertCircle, Info, Loader2, RefreshCw, Clock, MapPin, Phone, Globe, MessageCircle, Send, X, ArrowLeft } from 'lucide-react';
import { aiService, AnalysisResult } from '@/services/aiService';
import { hospitalService, type Hospital } from '@/services/hospitalService';
import { chatbotService } from '@/services/chatbotService';
import { analysisStorage } from '@/utils/analysisStorage';
import { toast } from 'sonner';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFromStorage, setIsFromStorage] = useState(false);
  // 카메라 촬영 시 입력된 증상 텍스트
  const symptomText: string = location.state?.symptomText || '';
  const [refinedText, setRefinedText] = useState<string | null>(null);

  // 챗봇 관련 상태
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // 주변 병원 관련 상태 (더미 데이터)
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  // 분석에 필요한 입력값: 이미지, 텍스트, 설문 데이터 등
  const uploadedImage = location.state?.image || null;
  // 추가 정보 (현재는 사용되지 않음)
  const additionalInfo = '';
  const questionnaireData = null;

  useEffect(() => {
    initializeAnalysis();
  }, []);

  const initializeAnalysis = async () => {
    // 30분 이내에 저장된 결과가 있는지 확인
    const storedResult = analysisStorage.getResult();

    if (storedResult && !uploadedImage) {
      // 저장된 결과가 있고 새로 업로드한 이미지가 없는 경우
      setAnalysisResult(mapStoredToAnalysisResult(storedResult));
      setIsFromStorage(true);
      setIsLoading(false);
      toast.info('최근에 분석한 결과가 있습니다. 다시 분석하려면 "새로 분석하기"를 눌러주세요.');
      return;
    }

    if (!uploadedImage) {
      // 분석할 이미지가 없는 경우
      setAnalysisResult(null);
      setIsLoading(false);
      return;
    }

    // 새로운 이미지로 분석 수행
    await performAnalysis();
  };

  // 주변 병원 데이터 가져오기 (더미)
  const fetchHospitals = async (result: AnalysisResult | null) => {
    try {
      if (!result) {
        setHospitals([]);
        return;
      }
      const diagnosis = result.predicted_disease || '알 수 없음';
      const description = result.summary || result.recommendation;
      const similar = result.similar_diseases?.map(s => s.name) || [];
      const { hospitals: list } = await hospitalService.searchHospitalsByDiagnosis(
          diagnosis,
          description,
          similar,
          2
      );
      setHospitals(list);
    } catch (e) {
      console.error('병원 검색에 실패했습니다.', e);
      setHospitals([]);
    }
  };

  const performAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsFromStorage(false);

      // AI 서비스 상태 확인
      const isHealthy = await aiService.healthCheck();
      if (!isHealthy) {
        throw new Error('AI 분석 서비스가 현재 원활하지 않습니다.');
      }

      // 실제 분석 수행
      const result = await aiService.analyzeImage({
        image: uploadedImage
      });

      setAnalysisResult(result);
      // 병원 데이터 가져오기
      fetchHospitals(result);

      // 증상 텍스트가 있는 경우 사용자에게 보여줄 문구로 다듬기
      if (symptomText && symptomText.trim().length > 0) {
        try {
          const refined = await aiService.refineUtterance(symptomText.trim(), 'ko');
          setRefinedText(refined && refined.trim().length > 0 ? refined.trim() : null);
        } catch (e) {
          setRefinedText(null);
        }
      } else {
        setRefinedText(null);
      }

      // 분석 결과 저장
      analysisStorage.saveResult({
        id: analysisStorage.generateResultId(),
        diagnosis: result.predicted_disease || '알 수 없음',
        confidence_score: result.confidence,
        recommendations: result.recommendation,
        similar_conditions: result.similar_diseases?.map(d => d.name).join(', '),
        summary: result.summary, // 추가 요약
        image: uploadedImage instanceof File ? URL.createObjectURL(uploadedImage) : uploadedImage,
        // 기타 추가 정보
      });

      toast.success('분석이 완료되었습니다.');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 중 알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('분석 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 저장된 분석 결과가 있는 경우 병원 데이터 가져오기
  useEffect(() => {
    if (isFromStorage && analysisResult) {
      fetchHospitals(analysisResult);
    }
  }, [isFromStorage, analysisResult]);

  // 저장된 결과를 AnalysisResult 타입으로 변환
  const mapStoredToAnalysisResult = (stored: any): AnalysisResult => {
    return {
      predicted_disease: stored.diagnosis,
      confidence: stored.confidence_score || 0,
      summary: stored.summary || '이전에 분석된 결과입니다.',
      recommendation: stored.recommendations || '별도의 추천 사항이 없습니다.',
      similar_diseases: stored.similar_conditions ?
          stored.similar_conditions.split(', ').map((name: string, index: number) => ({
            name,
            confidence: Math.max(0, (stored.confidence_score || 0) - (index + 1) * 10),
            description: `${name}은(는) 이전에 분석된 유사 질환입니다.`
          })) : []
    };
  };

  // 상위 3개 결과에 softmax temperature 적용 (확신도를 조정하여 시각화 효과 증대)
  const applySoftmaxToTop3 = (mainConfidence: number, similarDiseases: any[], temperature?: number) => {
    // 상위 3개 confidence 값을 추출
    const raw = [
      mainConfidence,
      ...(similarDiseases?.slice(0, 2).map(d => d.confidence) || [])
    ];

    // 입력값이 없는 경우 예외 처리
    if (raw.length === 0) return { main: mainConfidence, similar: similarDiseases };

    // 0~100 스케일을 0~1 확률값으로 변환
    const maxRaw = Math.max(...raw.map(v => (Number.isFinite(v) ? v : 0)));
    const isFractionScale = maxRaw <= 1.5; // 1.0 이하인 경우 이미 확률값이라고 가정
    const toProb = (c: number) => {
      const v = Number.isFinite(c) ? c : 0;
      const p = isFractionScale ? v : v / 100;
      return Math.min(1, Math.max(0, p));
    };

    // 1위와 2위 간의 차이에 따라 temperature 자동 조정
    const p0 = toProb(raw[0] ?? 0);
    const p1 = toProb(raw[1] ?? 0);
    const gap = Math.max(0, p0 - p1);
    const autoTemperature = (() => {
      if (p0 >= 0.90 && gap >= 0.50) return 0.55;
      if (p0 >= 0.85 && gap >= 0.35) return 0.6;
      if (p0 >= 0.80 && gap >= 0.25) return 0.7;
      if (p0 >= 0.50 && gap >= 0.10) return 0.7;
      if (p0 >= 0.70 && gap >= 0.15) return 1.0;
      if (gap >= 0.10) return 1.2;
      return 1.4;
    })();
    const usedTemperature = Math.min(1.6, Math.max(0.5, temperature ?? autoTemperature));

    // confidence 값을 logit으로 변환하고 temperature 적용
    const logits = raw.map(c => Math.log(Math.max(toProb(c), 0.001)));
    const adjustedLogits = logits.map(logit => logit / usedTemperature);

    // softmax 계산
    const maxLogit = Math.max(...adjustedLogits);
    const expValues = adjustedLogits.map(logit => Math.exp(logit - maxLogit));
    const sumExp = expValues.reduce((sum, val) => sum + val, 0);
    let softmaxValues = expValues.map(val => val / (sumExp || 1));

    // 메인 결과를 약간 강조하여 시각적 효과 증대
    const mainBoost = 1.1;
    const boosted = softmaxValues.map((v, idx) => (idx === 0 ? v * mainBoost : v));
    const boostedSum = boosted.reduce((a, b) => a + b, 0) || 1;
    softmaxValues = boosted.map(v => v / boostedSum);

    // 100% 기준으로 조정 (정수 반올림)
    const adjustedConfidences = softmaxValues.map(val => Math.round(val * 100));
    // 합이 100이 안 되는 경우 마지막 값 조정
    const total = adjustedConfidences.reduce((a, b) => a + b, 0);
    if (total !== 100 && adjustedConfidences.length > 0) {
      const diff = 100 - total;
      adjustedConfidences[adjustedConfidences.length - 1] = Math.max(
          0,
          adjustedConfidences[adjustedConfidences.length - 1] + diff
      );
    }

    return {
      main: adjustedConfidences[0] ?? mainConfidence,
      similar: (similarDiseases?.slice(0, 2) || []).map((disease, idx) => ({
        ...disease,
        confidence: adjustedConfidences[idx + 1] ?? disease.confidence
      }))
    };
  };

  // 분석 결과에 소프트맥스 temperature 적용
  const adjustedResults = analysisResult ? applySoftmaxToTop3(
      analysisResult.confidence,
      analysisResult.similar_diseases || []
  ) : null;

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200 hover:bg-green-100 transition-colors duration-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200 hover:bg-yellow-100 transition-colors duration-200';
    return 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100 transition-colors duration-200';
  };

  const getImageUrl = () => {
    // 저장된 분석 결과가 있는 경우
    if (isFromStorage) {
      const storedResult = analysisStorage.getResult();
      return storedResult?.image || '/placeholder.svg';
    }

    // 파일로 업로드된 경우
    if (uploadedImage instanceof File) {
      return URL.createObjectURL(uploadedImage);
    }

    // URL로 업로드된 경우
    if (uploadedImage) {
      return uploadedImage;
    }

    // 기본 이미지
    return '/placeholder.svg';
  };

  // 새로운 분석 시작
  const startNewAnalysis = () => {
    analysisStorage.clearResult();
    navigate('/camera');
  };

  // 챗봇 메시지 전송
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const text = newMessage;
    const userMessage = { id: Date.now().toString(), text, isUser: true, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsBotTyping(true);

    try {
      // 세션이 없는 경우 새로운 세션 시작
      if (!chatSessionId) {
        const analysisPayload = (() => {
          if (analysisResult) {
            return {
              diagnosis: analysisResult.predicted_disease,
              recommendations: analysisResult.recommendation,
              summary: analysisResult.summary,
              similar_diseases: analysisResult.similar_diseases?.map(s => s.name),
              refined_text: refinedText || undefined,
            };
          }
          const stored = analysisStorage.getResult();
          if (stored) {
            return {
              diagnosis: stored.diagnosis,
              recommendations: stored.recommendations,
              summary: stored.summary,
              similar_diseases: (stored.similar_conditions || '').split(',').map((s: string) => s.trim()).filter(Boolean),
              refined_text: refinedText || undefined,
            };
          }
          return null;
        })();

        if (analysisPayload) {
          const res = await chatbotService.startConsult(analysisPayload, text);
          setChatSessionId(res.session_id);
          const botMessage = { id: (Date.now() + 1).toString(), text: res.reply || '답변을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.', isUser: false, timestamp: new Date() };
          setChatMessages(prev => [...prev, botMessage]);
          return;
        } else {
          throw new Error('분석 결과가 없어 대화를 시작할 수 없습니다.');
        }
      }

      // 기존 세션에 메시지 전송
      const { reply } = await chatbotService.sendMessage(chatSessionId, text);
      const botMessage = { id: (Date.now() + 1).toString(), text: reply, isUser: false, timestamp: new Date() };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (e: any) {
      const botMessage = { id: (Date.now() + 1).toString(), text: '메시지를 전송하는 데 실패했습니다. 잠시 후 다시 시도해주세요.', isUser: false, timestamp: new Date() };
      setChatMessages(prev => [...prev, botMessage]);
      console.error('Chat error:', e);
    } finally {
      setIsBotTyping(false);
    }
  };

  // AI 챗봇 모달이 열리면 자동으로 대화 시작
  useEffect(() => {
    const bootstrapConsult = async () => {
      if (!isChatOpen || chatSessionId) return;
      try {
        setIsBotTyping(true);
        const healthy = await chatbotService.healthCheck();
        if (!healthy) {
          console.warn('Chatbot service is not healthy');
          return;
        }

        // 분석 결과를 챗봇에 전달
        const analysis = (() => {
          if (analysisResult) {
            return {
              diagnosis: analysisResult.predicted_disease,
              recommendations: analysisResult.recommendation,
              summary: analysisResult.summary,
              similar_diseases: analysisResult.similar_diseases?.map(s => s.name),
              refined_text: refinedText || undefined,
            };
          }
          const stored = analysisStorage.getResult();
          if (stored) {
            return {
              diagnosis: stored.diagnosis,
              recommendations: stored.recommendations,
              summary: stored.summary,
              similar_diseases: (stored.similar_conditions || '').split(',').map((s: string) => s.trim()).filter(Boolean),
              refined_text: refinedText || undefined,
            };
          }
          return null;
        })();

        if (!analysis) return;
        const res = await chatbotService.startConsult(analysis);
        setChatSessionId(res.session_id);
        if (res.reply) {
          setChatMessages(prev => [
            ...prev,
            { id: (Date.now() + 1).toString(), text: res.reply, isUser: false, timestamp: new Date() }
          ]);
        }
      } catch (e) {
        console.error('Failed to start consult:', e);
      } finally {
        setIsBotTyping(false);
      }
    };
    bootstrapConsult();
  }, [isChatOpen, analysisResult, refinedText]);

  // 스크롤 영역이 업데이트될 때마다 맨 아래로 스크롤
  useEffect(() => {
    if (!isChatOpen) return;
    const id = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    return () => window.cancelAnimationFrame(id);
  }, [chatMessages, isBotTyping, isChatOpen]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isBotTyping) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 로딩 상태
  if (isLoading) {
    return (
        <div className="min-h-screen p-4 flex items-center justify-center bg-[#f0efea]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-black" />
            <h2 className="text-2xl font-bold text-black mb-2">AI 분석 중...</h2>
            <p className="text-gray-600">조금만 기다려주세요!</p>
          </div>
        </div>
    );
  }

  // 오류 상태
  if (error) {
    return (
        <div className="min-h-screen bg-[#f0efea] p-4 pt-20 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-black mb-4">분석에 실패했습니다</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <div className="space-y-3">
              <Button
                  onClick={performAnalysis}
                  disabled={!uploadedImage}
                  variant="liquid"
                  size="lg"
                  className="w-full h-12 text-lg font-semibold"
              >
                <RefreshCw className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">다시 시도하기</span>
              </Button>
              <Button
                  onClick={startNewAnalysis}
                  variant="liquid"
                  size="lg"
                  className="w-full h-12 text-lg font-semibold"
              >
                <Camera className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">새로 촬영하기</span>
              </Button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen p-4 pt-20 bg-[#f0efea] relative">
        {/* 컨텐츠 */}
        <div className="relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* 헤더 */}
            <div className="mb-8">
              <div className="text-center space-y-2">
                <Typography variant="h2" className="text-black">
                  피부 분석 결과
                </Typography>
                <Typography variant="body" className="text-gray-600">
                  AI가 분석한 결과를 확인해보세요.
                </Typography>
              </div>
            </div>

            {/* 분석 이미지 및 분석 결과 요약 카드 */}
            <Card className="mb-6 overflow-hidden rounded-tl-none">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 분석 이미지 */}
                  <div className="space-y-4 flex flex-col">
                    <h2 className="text-xl font-semibold mb-3 mx-[13px] my-0">분석 대상</h2>
                    <div className="rounded-2xl overflow-hidden flex-grow" style={{boxShadow: 'none', filter: 'none'}}>
                      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                        <img
                            src={getImageUrl()}
                            alt="분석 대상"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // 이미지 로딩 실패 시 placeholder 표시
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                            <div class="flex flex-col items-center justify-center text-gray-400 w-full h-full">
                              <div class="w-16 h-16 mb-2">이미지</div>
                              <p class="text-sm">이미지 로딩 실패</p>
                            </div>
                          `;
                              }
                            }}
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-black text-white">
                            {uploadedImage ? '촬영된 이미지' : '이전 이미지'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 주요 분석 결과 + 추천 요약 */}
                  <div className="space-y-4 flex flex-col">
                    <h2 className="text-xl font-semibold mb-3">분석 결과</h2>

                    <div className="rounded-2xl overflow-hidden" style={{boxShadow: 'none', filter: 'none'}}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-lg flex-1 min-w-0 whitespace-normal pr-2 pl-2">주요 진단 결과</h3>
                        <Badge className="bg-gray-100 text-black border-gray-300 hover:bg-gray-200 transition-colors duration-200">
                          {adjustedResults?.main ?? analysisResult.confidence}% 확신
                        </Badge>
                      </div>
                      <p className="text-2xl font-bold text-black mb-2">
                        {analysisResult.predicted_disease}
                      </p>

                      {/* 확신도 바 */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">확신도</span>
                          <span className="font-semibold">{adjustedResults?.main ?? analysisResult.confidence}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${adjustedResults?.main ?? analysisResult.confidence}%` }}
                          ></div>
                        </div>
                      </div>

                      {(adjustedResults?.main ?? analysisResult.confidence) < 70 && (
                          <div className="flex items-center gap-2 text-gray-700 text-sm p-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30">
                            <AlertCircle className="w-4 h-4" />
                            <span>낮은 확신도입니다. 전문의의 진료를 받아보시는 것을 추천합니다.</span>
                          </div>
                      )}
                    </div>

                    {/* 요약 */}
                    <div className="rounded-2xl overflow-hidden flex-grow" style={{boxShadow: 'none', filter: 'none'}}>
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-4 h-4 text-black" />
                        <h3 className="font-semibold text-lg">요약</h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                        {analysisResult.summary}
                      </p>
                      <div className="rounded-lg p-3 bg-white/20 backdrop-blur-sm border border-white/30">
                        {refinedText ? (
                            <>
                              <p className="text-xs font-semibold text-gray-700 mb-1">환자에게 이렇게 설명해보세요!</p>
                              <p className="text-sm text-gray-800 whitespace-pre-wrap">{refinedText}</p>
                            </>
                        ) : (
                            <p className="text-sm text-gray-600">{analysisResult.recommendation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 유사 질환 */}
            {analysisResult.similar_diseases && analysisResult.similar_diseases.length > 0 && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold">유사 질환</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(adjustedResults?.similar || analysisResult.similar_diseases || []).slice(0, 2).map((item, index) => {
                        const adjustedConfidence = item.confidence;
                        const circleRadius = 18;
                        const circleCircumference = 2 * Math.PI * circleRadius;
                        const progress = (adjustedConfidence / 100) * circleCircumference;

                        return (
                            <div key={index} className="liquid-glass-primary rounded-xl p-4 transition-all duration-200 no-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-800">{item.name}</h3>

                                {/* 확신도 원형 차트 */}
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-600 font-sans">확신도</span>
                                  <div className="relative w-12 h-12 flex-shrink-0">
                                    <svg className="w-12 h-12">
                                      <circle
                                          className="text-gray-200"
                                          strokeWidth="3"
                                          stroke="currentColor"
                                          fill="transparent"
                                          r={circleRadius}
                                          cx="24"
                                          cy="24"
                                      />
                                      <circle
                                          className="text-blue-500"
                                          strokeWidth="3"
                                          stroke="currentColor"
                                          fill="transparent"
                                          r={circleRadius}
                                          cx="24"
                                          cy="24"
                                          strokeDasharray={circleCircumference}
                                          strokeDashoffset={circleCircumference - progress}
                                          strokeLinecap="round"
                                          transform="rotate(-90 24 24)"
                                      />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-800">
                            {adjustedConfidence}%
                          </span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
            )}

            {/* 주변 병원 */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">추천 병원</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hospitals.map((hospital, index) => (
                      <div key={index} className="liquid-glass-light rounded-xl p-4 transition-all duration-300 no-shadow hover:shadow-none hover:translate-y-0">
                        {/* 병원 이름 - 더미 데이터이므로 실제 정보와 다를 수 있음 */}
                        <div className="mb-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-800 text-lg leading-tight pr-2 flex-1">
                              {hospital.name}
                            </h3>
                            <Badge variant="outline" className="text-xs bg-gray-100 text-black border-gray-300 whitespace-nowrap flex-shrink-0">
                              피부과
                            </Badge>
                          </div>
                        </div>

                        {/* 병원 정보 - 더미 데이터이므로 실제 정보와 다를 수 있음 */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                            <span className="text-sm text-gray-600 leading-relaxed break-words flex-1">
                        {hospital.address}
                      </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <a href={`tel:${hospital.phone}`} className="text-sm text-black hover:underline break-all">
                              {hospital.phone}
                            </a>
                          </div>

                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                            <a
                                href={hospital.website || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-black hover:underline truncate"
                            >
                              병원 웹사이트
                            </a>
                          </div>
                        </div>

                        {/* 진료 과목 */}
                        <div className="rounded-lg p-3 bg-white/20 backdrop-blur-sm border border-white/30">
                          <p className="text-xs text-gray-500 mb-1">진료 과목</p>
                          <p className="text-sm font-medium text-gray-700 leading-relaxed break-words">
                            {Array.isArray(hospital.specialties) ? hospital.specialties.join(', ') : ''}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 새로운 분석 및 챗봇 버튼 */}
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Button
                  onClick={startNewAnalysis}
                  size="lg"
                  variant="liquid"
                  className="w-40 font-semibold"
              >
                <Camera className="w-5 h-5 relative z-10" />
                <span className="relative z-10">새로 분석하기</span>
              </Button>

              {/* 챗봇 버튼 */}
              <Dialog open={isChatOpen} onOpenChange={(v) => { if (!v) setIsChatOpen(false); }}>
                <Button
                    size="lg"
                    variant="liquid"
                    className="w-40 relative overflow-hidden font-semibold"
                    onClick={() => setIsChatOpen(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-100/10 to-gray-200/10"></div>
                  <MessageCircle className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">AI 상담</span>
                </Button>

                <DialogContent className="max-w-lg h-[90vh] flex flex-col p-0 bg-[#f2efea] shadow-none">
                  <DialogHeader className="p-4 border-b border-white/40 backdrop-blur-sm">
                    <DialogTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-black" />
                      피부 분석 AI 챗봇
                    </DialogTitle>
                  </DialogHeader>

                  {/* 챗봇 메시지 영역 */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                          <div
                              key={message.id}
                              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                                    message.isUser
                                        ? 'bg-gradient-to-r from-[hsl(222_89%_60%)] to-[hsl(259_94%_61%)] text-white shadow-md'
                                        : 'bg-white text-gray-900 border border-black/10 shadow-md'
                                }`}
                            >
                              {message.isUser ? (
                                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                              ) : (
                                  <div className="text-sm">
                                    <MarkdownMessage content={message.text} />
                                  </div>
                              )}
                              <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                            </div>
                          </div>
                      ))}
                      {/* AI 답변 대기 중 표시 */}
                      {isBotTyping && (
                          <div className="flex justify-start">
                            <div className="px-3 py-2 rounded-2xl bg-white text-gray-800 border border-black/10 shadow-md">
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '120ms'}} />
                                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '240ms'}} />
                              </div>
                            </div>
                          </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* 챗봇 입력 영역 */}
                  <div className="p-4 border-t border-white/40 backdrop-blur-sm">
                    <div className="flex gap-2 items-center">
                      <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder={isBotTyping ? 'AI가 답변을 생성 중입니다...' : '궁금한 점을 자유롭게 물어보세요!'}
                          className="flex-1 bg-white/80 backdrop-blur-sm border border-black rounded-full h-11 px-4 text-sm focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim() || isBotTyping}
                          className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-md transition ${(!newMessage.trim() || isBotTyping) ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95'} bg-gradient-to-r from-[hsl(222_89%_60%)] to-[hsl(259_94%_61%)]`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* 저장된 분석 결과 문구 */}
            {isFromStorage && (
                <div className="mt-4 p-3 bg-gray-100 rounded-xl border border-gray-300">
                  <p className="text-sm text-gray-700 text-center flex items-center justify-center gap-2">
                    <Clock className="w-4 h-4" />
                    최근 30분 내에 분석된 결과입니다. 다시 분석하려면 '새로 분석하기' 버튼을 눌러주세요.
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default Analysis;