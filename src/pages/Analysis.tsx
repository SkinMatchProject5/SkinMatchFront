import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, TrendingUp, AlertCircle, Info, Loader2, RefreshCw, Clock } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate, useLocation } from 'react-router-dom';
import { aiService, AnalysisResult } from '@/services/aiService';
import { analysisStorage } from '@/utils/analysisStorage';
import { toast } from 'sonner';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isFromStorage, setIsFromStorage] = useState(false);
  
  // 이전 페이지에서 전달받은 이미지 데이터
  const uploadedImage = location.state?.image || null;
  const additionalInfo = location.state?.additionalInfo || '';
  const questionnaireData = location.state?.questionnaireData || null;

  useEffect(() => {
    initializeAnalysis();
  }, []);

  const initializeAnalysis = async () => {
    // 먼저 저장된 결과가 있는지 확인
    const storedResult = analysisStorage.getResult();
    
    if (storedResult && !uploadedImage) {
      // 새로운 분석 요청 없이 저장된 결과만 보여주는 경우
      setAnalysisResult(mapStoredToAnalysisResult(storedResult));
      setIsFromStorage(true);
      setIsLoading(false);
      toast.info('저장된 분석 결과를 불러왔습니다.');
      return;
    }

    if (!uploadedImage) {
      // 이미지도 없고 저장된 결과도 없으면 카메라 페이지로
      toast.error('분석할 이미지가 없습니다.');
      navigate('/camera');
      return;
    }

    // 새로운 분석 실행
    await performAnalysis();
  };

  const performAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsFromStorage(false);

      // AI 백엔드 연결 상태 확인
      const isHealthy = await aiService.healthCheck();
      if (!isHealthy) {
        throw new Error('AI 분석 서비스에 연결할 수 없습니다.');
      }

      // 이미지 분석 실행
      const result = await aiService.analyzeImage({
        image: uploadedImage,
        additional_info: additionalInfo,
        questionnaire_data: questionnaireData
      });

      setAnalysisResult(result);
      
      // 분석 결과를 임시 저장
      analysisStorage.saveResult({
        id: analysisStorage.generateResultId(),
        diagnosis: result.predicted_disease || '진단 결과 없음',
        confidence_score: result.confidence,
        recommendations: result.recommendation,
        similar_conditions: result.similar_diseases?.map(d => d.name).join(', '),
        summary: result.summary, // 진단소견 추가
        image: uploadedImage instanceof File ? URL.createObjectURL(uploadedImage) : uploadedImage,
        additionalInfo: additionalInfo,
        questionnaireData: questionnaireData
      });

      toast.success('분석이 완료되었습니다!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('분석 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 저장된 결과를 AnalysisResult 형태로 변환
  const mapStoredToAnalysisResult = (stored: any): AnalysisResult => {
    return {
      predicted_disease: stored.diagnosis,
      confidence: stored.confidence_score || 0,
      summary: stored.summary || '저장된 분석 결과입니다.',
      recommendation: stored.recommendations || '전문의 상담을 권장합니다.',
      similar_diseases: stored.similar_conditions ? 
        stored.similar_conditions.split(', ').map((name: string, index: number) => ({
          name,
          confidence: Math.max(0, (stored.confidence_score || 0) - (index + 1) * 10),
          description: `${name}와 유사한 증상을 보입니다.`
        })) : []
    };
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getImageUrl = () => {
    // 저장된 결과에서 온 경우
    if (isFromStorage) {
      const storedResult = analysisStorage.getResult();
      return storedResult?.image || '/placeholder.svg';
    }
    
    // 새로운 분석인 경우
    if (uploadedImage instanceof File) {
      return URL.createObjectURL(uploadedImage);
    }
    return uploadedImage || '/placeholder.svg';
  };

  // 새로운 분석 시작
  const startNewAnalysis = () => {
    analysisStorage.clearResult();
    navigate('/camera');
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
          <h2 className="text-2xl font-bold text-gradient-primary mb-2">AI 분석 중...</h2>
          <p className="text-muted-foreground">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error || !analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-glass p-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">분석 실패</h2>
          <p className="text-muted-foreground mb-6">{error || '알 수 없는 오류가 발생했습니다.'}</p>
          <div className="space-y-2">
            <Button onClick={performAnalysis} className="w-full" disabled={!uploadedImage}>
              다시 시도
            </Button>
            <Button variant="outline" onClick={startNewAnalysis} className="w-full">
              새 사진 촬영
            </Button>
          </div>
        </div>
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
          <div className="mt-3 flex justify-center gap-2">
            {questionnaireData && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                설문조사 데이터 포함
              </Badge>
            )}
            {isFromStorage && (
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                저장된 결과
              </Badge>
            )}
          </div>
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
                      src={getImageUrl()} 
                      alt="사용자 업로드 이미지" 
                      className="w-full h-full object-cover rounded-xl" 
                      onError={() => setError('이미지를 불러올 수 없습니다.')}
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
                    {analysisResult.predicted_disease}
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

        {/* 비슷한 질환 (슬라이드) */}
        {analysisResult.similar_diseases && analysisResult.similar_diseases.length > 0 && (
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">유사질환</h2>
              </div>
              <Carousel opts={{ align: 'start', loop: true }}>
                <CarouselContent className="-ml-2">
                  {analysisResult.similar_diseases.map((item, index) => (
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
        <div className="grid grid-cols-1 gap-4">
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

        {/* 분석 관련 버튼들 */}
        <div className="mt-6 flex justify-center gap-3">
          <Button 
            onClick={startNewAnalysis}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Camera className="w-3 h-3" />
            새 사진 분석
          </Button>

          {analysisStorage.hasResult() && (
            <Button 
              onClick={() => analysisStorage.clearResult()}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              결과 삭제
            </Button>
          )}
        </div>

        {/* 저장된 결과 안내 */}
        {isFromStorage && (
          <div className="mt-4 p-3 bg-blue-50/80 backdrop-blur-sm rounded-xl border border-blue-200">
            <p className="text-sm text-blue-700 text-center flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              이 결과는 30분간 임시 저장됩니다. 새로운 분석을 원하시면 '재분석하기'를 클릭하세요.
            </p>
          </div>
        )}

        {/* 면책조항 */}
        <div className="mt-8 p-4 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            ※ 본 결과는 AI의 예측값으로 참고용입니다. 정확한 진단은 반드시 전문의의 상담을 받으시기 바랍니다.
            <br />
            본 서비스는 의료진단을 대체하지 않으며, 응급상황 시에는 즉시 병원에 내원하시기 바랍니다.
          </p>
        </div>

        {/* 디버깅 정보 (개발 모드에서만 표시) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 border rounded-lg text-xs">
            <p><strong>디버깅 정보:</strong></p>
            <p>• 이미지: {uploadedImage ? '✅' : '❌'}</p>
            <p>• 추가 정보: {additionalInfo ? '✅' : '❌'}</p>
            <p>• 설문조사 데이터: {questionnaireData ? '✅' : '❌'}</p>
            <p>• 저장된 결과: {analysisStorage.hasResult() ? '✅' : '❌'}</p>
            <p>• 결과 출처: {isFromStorage ? '저장소' : '새 분석'}</p>
            {questionnaireData && (
              <details className="mt-2">
                <summary className="cursor-pointer">설문조사 상세 데이터</summary>
                <pre className="mt-1 text-xs bg-white p-2 rounded overflow-auto">
                  {JSON.stringify(questionnaireData, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analysis;