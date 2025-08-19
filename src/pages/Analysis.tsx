import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, TrendingUp, AlertCircle, Info, Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate, useLocation } from 'react-router-dom';
import { logger } from '@/utils/logger';

interface AnalysisResult {
  predictedDisease: string;
  confidence: number;
  summary: string;
  recommendation: string;
  similarDiseases?: Array<{
    name: string;
    confidence: number;
    description: string;
  }>;
}

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('/placeholder.svg');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    logger.info('분석 페이지 진입', {
      hasState: !!location.state,
      stateKeys: location.state ? Object.keys(location.state) : []
    });

    // location.state에서 이미지와 분석 결과 받기
    if (location.state) {
      const { imageUrl, analysisData, questionnaireData, additionalInfo } = location.state as any;
      
      if (imageUrl) {
        setUploadedImage(imageUrl);
        logger.info('분석 이미지 수신 완료', { 
          imageUrl: imageUrl.substring(0, 50) + '...',
          imageSize: imageUrl.length 
        });
      }

      if (questionnaireData) {
        logger.info('설문조사 데이터 수신 완료', {
          answersCount: Object.keys(questionnaireData).length,
          hasAdditionalInfo: !!additionalInfo
        });
      }

      if (analysisData) {
        setAnalysisResult(analysisData);
        logger.info('분석 결과 수신 완료', {
          disease: analysisData.predictedDisease,
          confidence: analysisData.confidence
        });
        setIsLoading(false);
      } else {
        // 분석 결과가 없으면 분석 API 호출 (설문조사 데이터 포함)
        performAnalysis(imageUrl, additionalInfo);
      }
    } else {
      // state가 없으면 카메라 페이지로 리다이렉트
      logger.warn('분석 페이지에 필요한 데이터가 없음 - 카메라 페이지로 리다이렉트');
      navigate('/camera', { replace: true });
    }
  }, [location.state, navigate]);

  const performAnalysis = async (imageUrl: string, additionalInfo?: string) => {
    if (!imageUrl) {
      setError('분석할 이미지가 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      logger.info('AI 분석 시작', { 
        imageUrl: imageUrl.substring(0, 50) + '...',
        hasAdditionalInfo: !!additionalInfo,
        additionalInfoLength: additionalInfo?.length || 0
      });
      setIsLoading(true);
      setError('');

      // AI 분석 서비스 import
      const { analysisService } = await import('@/services/analysisService');
      
      // 기본 추가 정보와 설문조사 데이터 결합
      const combinedAdditionalInfo = additionalInfo 
        ? `피부 병변 분석을 위한 이미지입니다.\n\n${additionalInfo}`
        : '피부 병변 분석을 위한 이미지입니다.';

      logger.info('설문조사 데이터 포함 AI 분석 요청', {
        additionalInfoPreview: combinedAdditionalInfo.substring(0, 200) + '...',
        totalLength: combinedAdditionalInfo.length
      });
      
      // AI 분석 요청 (설문조사 데이터 포함)
      const result = await analysisService.analyzeImageFromUrl({
        imageUrl: imageUrl,
        additionalInfo: combinedAdditionalInfo,
        responseFormat: 'JSON'
      });
      
      // 응답 데이터를 AnalysisResult 형식으로 변환
      const formattedResult: AnalysisResult = {
        predictedDisease: result.predicted_disease,
        confidence: result.confidence,
        summary: result.summary,
        recommendation: result.recommendation,
        similarDiseases: result.similar_diseases || []
      };

      setAnalysisResult(formattedResult);
      logger.info('AI 분석 완료 (설문조사 데이터 포함)', {
        disease: formattedResult.predictedDisease,
        confidence: formattedResult.confidence,
        processingTime: result.metadata?.processing_time_seconds,
        usedQuestionnaireData: !!additionalInfo
      });

    } catch (error: any) {
      logger.error('AI 분석 실패', error);
      
      // 사용자 친화적인 오류 메시지
      let errorMessage = '분석 중 오류가 발생했습니다.';
      
      if (error.response?.status === 404) {
        errorMessage = 'AI 분석 서비스를 찾을 수 없습니다. 서비스가 실행 중인지 확인해주세요.';
      } else if (error.response?.status === 422) {
        errorMessage = '이미지 형식이나 요청 데이터에 문제가 있습니다. 다시 시도해주세요.';
      } else if (error.response?.status === 500) {
        errorMessage = 'AI 분석 서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        errorMessage = 'AI 분석 서비스에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
      } else if (error.response?.data?.detail) {
        // 서버에서 온 에러 메시지가 문자열인지 확인
        const detail = error.response.data.detail;
        errorMessage = typeof detail === 'string' ? detail : '서버에서 오류가 발생했습니다.';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <Card className="glass-card max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">분석 오류</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/camera')} className="w-full">
              다시 촬영하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <Card className="glass-card max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-semibold mb-2">AI 분석 중...</h2>
            <p className="text-muted-foreground">
              피부 상태를 분석하고 있습니다. 잠시만 기다려주세요.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <Card className="glass-card max-w-md mx-auto">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">분석 결과 없음</h2>
            <p className="text-muted-foreground mb-4">
              분석 결과를 불러올 수 없습니다.
            </p>
            <Button onClick={() => navigate('/camera')} className="w-full">
              다시 촬영하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-glass p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            피부 분석 결과
          </h1>
          <p className="text-muted-foreground">
            AI가 분석한 환부의 상태입니다
          </p>
        </div>

        {/* 사용자 업로드 이미지와 예상 질환 */}
        <Card className="glass-card mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 업로드된 사진 */}
              <div className="space-y-4 flex flex-col justify-center">
                <h2 className="text-xl font-semibold mb-3 mx-[13px] my-0">분석 이미지</h2>
                <div className="aspect-square bg-gradient-glow rounded-2xl p-3">
                  <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="분석 대상 이미지" 
                      className="w-full h-full object-cover rounded-xl" 
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary text-white">
                        환부 촬영
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* 예상 질환명과 점수 + 진단소견 */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-3">분석 결과</h2>
                
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">예상 질환</h3>
                    <Badge className={getConfidenceColor(analysisResult.confidence)}>
                      {analysisResult.confidence}% 일치
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary mb-2">
                    {analysisResult.predictedDisease}
                  </p>
                  
                  {/* 신뢰도 바 */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">신뢰도</span>
                      <span className="font-semibold">{analysisResult.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${analysisResult.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  {analysisResult.confidence < 70 && (
                    <div className="flex items-center gap-2 text-amber-600 text-sm p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <AlertCircle className="w-4 h-4" />
                      <span>정확한 진단을 위해 전문의 상담을 권장합니다</span>
                    </div>
                  )}
                </div>

                {/* 진단 소견 */}
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-primary" />
                    <h3 className="font-semibold text-lg">진단 소견</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {analysisResult.summary}
                  </p>
                  <div className="bg-primary-soft/20 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      {analysisResult.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 비슷한 질환 (슬라이드) - 데이터가 있을 때만 표시 */}
        {analysisResult.similarDiseases && analysisResult.similarDiseases.length > 0 && (
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">유사질환</h2>
              </div>
              <Carousel opts={{ align: 'start', loop: true }}>
                <CarouselContent className="-ml-2">
                  {analysisResult.similarDiseases.map((item, index) => (
                    <CarouselItem key={index} className="pl-2 basis-full">
                      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-primary/40 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {item.confidence}%
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center" onClick={() => navigate('/camera')}>
              <div className="w-16 h-16 bg-primary-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">재분석하기</h3>
              <p className="text-sm text-muted-foreground">새로운 사진으로 다시 분석</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center" onClick={() => navigate('/questionnaire')}>
              <div className="w-16 h-16 bg-primary-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">추가 질문</h3>
              <p className="text-sm text-muted-foreground">더 정확한 분석을 위한 설문</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center" onClick={() => navigate('/hospital')}>
              <div className="w-16 h-16 bg-primary-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">병원 찾기</h3>
              <p className="text-sm text-muted-foreground">전문의 상담 받기</p>
            </CardContent>
          </Card>
        </div>

        {/* 면책조항 */}
        <div className="mt-8 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            ※ 본 결과는 AI의 예측값으로 참고용입니다. 정확한 진단은 반드시 전문의의 상담을 받으시기 바랍니다.
            <br />
            본 서비스는 의료진단을 대체하지 않으며, 응급상황 시에는 즉시 병원에 내원하시기 바랍니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;