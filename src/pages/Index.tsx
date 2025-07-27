import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Search, Sparkles, TrendingUp, Star, Users } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI 피부 분석',
      description: '3방향 촬영으로 정밀한 피부 상태 분석',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Search,
      title: '맞춤 병원 추천',
      description: '분석 결과에 따른 전문 병원 찾기',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Sparkles,
      title: 'K-뷰티 케어',
      description: '개인 맞춤형 스킨케어 루틴 제안',
      color: 'from-cyan-500 to-blue-500'
    }
  ];

  const steps = [
    { step: '01', title: '사진 촬영', desc: '정면, 좌측, 우측 3방향으로 촬영' },
    { step: '02', title: 'AI 분석', desc: '고도화된 AI가 피부 상태를 정밀 분석' },
    { step: '03', title: '결과 확인', desc: '상세한 분석 결과와 개선 방법 제시' },
    { step: '04', title: '병원 추천', desc: '필요시 전문 의료진 상담 연결' }
  ];

  return (
    <div className="min-h-screen bg-gradient-glass">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-gradient-primary">Skin Match</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              AI가 분석하는 당신만의 글래스 스킨
            </p>
            <p className="text-lg text-muted-foreground">
              K-뷰티의 혁신으로 완벽한 피부를 찾아보세요
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/camera">
              <Button className="h-14 px-8 text-lg btn-k-beauty animate-glow">
                <Camera className="w-6 h-6 mr-2" />
                피부 분석 시작하기
              </Button>
            </Link>
            <Link to="/hospital">
              <Button variant="outline" className="h-14 px-8 text-lg border-primary text-primary hover:bg-primary hover:text-white">
                <Search className="w-6 h-6 mr-2" />
                병원 찾기
              </Button>
            </Link>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">분석 완료</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">98.7%</div>
              <div className="text-muted-foreground">정확도</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">1,200+</div>
              <div className="text-muted-foreground">협력 병원</div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 소개 */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">완벽한 K-뷰티 솔루션</h2>
            <p className="text-xl text-muted-foreground">
              AI 기술과 전문의 네트워크로 제공하는 통합 피부 케어 서비스
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover:shadow-xl transition-all duration-500 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="py-20 px-4 bg-white/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">간단한 4단계</h2>
            <p className="text-xl text-muted-foreground">
              누구나 쉽게 사용할 수 있는 직관적인 프로세스
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <Card className="glass-card">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {step.step}
                        </div>
                        <h3 className="text-2xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-lg text-muted-foreground">{step.desc}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex-1">
                  <div className="w-full h-64 bg-gradient-glow rounded-3xl flex items-center justify-center">
                    <span className="text-6xl opacity-50">📱</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="glass-card">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-6">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                AI가 분석하는 당신만의 글래스 스킨 여정을 시작해보세요
              </p>
              <Link to="/camera">
                <Button className="h-16 px-12 text-xl btn-k-beauty animate-glow">
                  <Sparkles className="w-6 h-6 mr-2" />
                  무료로 시작하기
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
