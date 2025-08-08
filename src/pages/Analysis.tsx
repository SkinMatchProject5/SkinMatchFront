import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Sparkles, TrendingUp, AlertCircle, Info } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';
const Analysis = () => {
  const navigate = useNavigate();

  // 사용자가 업로드한 사진 (실제로는 props나 state에서 가져올 것)
  const userUploadedImage = '/placeholder.svg'; // 실제 업로드된 이미지 URL

  // AI 분석 결과
  const analysisResult = {
    predictedDisease: '습진성 피부염',
    confidence: 85,
    summary: '전신 · 이미지 촬영 결과 습진성 피부염이 의심됩니다. 피부의 염증 질환을 통칭하는 용어이며, 다양한 원인으로 인해 발생할 수 있습니다. 임상적으로는 가려움증, 붉은 반점, 각질, 물집 등의 증상을 보이며, 만성적인 경과를 보이기도 합니다. 아토피 피부염은 습진의 한 종류로, 가려움증을 동반하는 만성 염증성 피부 질환입니다.',
    recommendation: '*해당 결과는 AI진단 이므로 정확한 진단은 근처 병원에 방문하여 받아보시길 바랍니다.'
  };

  // 비슷한 질환들 (슬라이드용)
  const similarDiseases = [{
    name: '접촉성 피부염',
    confidence: 78,
    description: '외부 자극물질로 인한 피부 염증'
  }, {
    name: '아토피 피부염',
    confidence: 72,
    description: '만성적인 알레르기성 피부 질환'
  }, {
    name: '지루성 피부염',
    confidence: 68,
    description: '피지 분비가 많은 부위의 염증'
  }, {
    name: '건선',
    confidence: 65,
    description: '면역계 이상으로 인한 만성 피부 질환'
  }, {
    name: '두드러기',
    confidence: 62,
    description: '알레르기 반응으로 인한 일시적 피부 증상'
  }];
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };
  return <div className="min-h-screen bg-gradient-glass p-4">
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
                    <img src={userUploadedImage} alt="사용자 업로드 이미지" className="w-full h-full object-cover rounded-xl" />
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
                      <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{
                      width: `${analysisResult.confidence}%`
                    }}></div>
                    </div>
                  </div>

                  {analysisResult.confidence < 70 && <div className="flex items-center gap-2 text-amber-600 text-sm p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <AlertCircle className="w-4 h-4" />
                      <span>정확한 진단을 위해 전문의 상담을 권장합니다</span>
                    </div>}
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
        <Card className="glass-card mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">유사질환</h2>
            </div>
            <Carousel opts={{
            align: 'start',
            loop: true
          }}>
              <CarouselContent className="-ml-2">
                {similarDiseases.map((item, index) => <CarouselItem key={index} className="pl-2 basis-full">
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
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

          </CardContent>
        </Card>

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
    </div>;
};
export default Analysis;