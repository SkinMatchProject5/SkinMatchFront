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
    <div className="min-h-screen gradient-hero">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* 플로우 백그라운드 셰이프들 */}
        <div className="flow-shape w-96 h-96 top-10 -left-20 animate-flow"></div>
        <div className="flow-shape-2 w-80 h-80 top-40 -right-16 animate-flow" style={{animationDelay: '2s'}}></div>
        <div className="flow-shape w-64 h-64 bottom-20 left-1/4 animate-flow" style={{animationDelay: '4s'}}></div>
        <div className="flow-shape-2 w-72 h-72 bottom-0 right-1/3 animate-flow" style={{animationDelay: '6s'}}></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <div className="mb-6 relative">
              <h1 className="text-6xl md:text-8xl font-bold mb-4">
                <span className="text-gradient-primary font-serif italic">SkinMatch</span>
              </h1>
              <p className="text-sm tracking-[0.2em] text-luxury-gold font-medium uppercase">
                AI CLARA
              </p>
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
              AI가 분석하는 당신만의 글래스 스킨
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              K-뷰티의 혁신과 럭셔리 스킨케어의 만남으로 완벽한 피부를 찾아보세요
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Link to="/camera">
              <Button className="h-16 px-10 text-lg btn-luxury animate-glow">
                <Camera className="w-6 h-6 mr-3" />
                피부 분석 시작하기
              </Button>
            </Link>
            <Link to="/hospital">
              <Button variant="outline" className="h-16 px-10 text-lg border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-foreground backdrop-blur-sm bg-white/10 border-2">
                <Search className="w-6 h-6 mr-3" />
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
              <Card key={index} className="luxury-card hover:shadow-2xl transition-all duration-500 hover:scale-105 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-10 text-center relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 사용 방법 */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-luxury opacity-60"></div>
        <div className="flow-shape w-72 h-72 top-0 left-0 animate-flow" style={{animationDelay: '1s'}}></div>
        <div className="flow-shape-2 w-96 h-96 bottom-0 right-0 animate-flow" style={{animationDelay: '3s'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">간단한 4단계</h2>
            <p className="text-xl text-muted-foreground">
              누구나 쉽게 사용할 수 있는 직관적인 프로세스
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
                <div className="flex-1">
                  <Card className="luxury-card shadow-2xl">
                    <CardContent className="p-10">
                      <div className="flex items-center gap-6 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-luxury-gold rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {step.step}
                        </div>
                        <h3 className="text-3xl font-bold">{step.title}</h3>
                      </div>
                      <p className="text-xl text-muted-foreground leading-relaxed">{step.desc}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="flex-1">
                  <div className="w-full h-80 gradient-cream-flow rounded-[3rem] flex items-center justify-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    <span className="text-8xl opacity-60 relative z-10">📱</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="flow-shape w-80 h-80 top-0 right-0 animate-flow" style={{animationDelay: '2s'}}></div>
        <div className="flow-shape-2 w-96 h-96 bottom-0 left-0 animate-flow" style={{animationDelay: '4s'}}></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Card className="luxury-card shadow-2xl border-luxury-gold/30">
            <CardContent className="p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-luxury-gold/10 via-transparent to-primary/5"></div>
              <div className="relative z-10">
                <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-luxury-gold bg-clip-text text-transparent">
                  지금 바로 시작하세요
                </h2>
                <p className="text-2xl text-muted-foreground mb-12 leading-relaxed max-w-3xl mx-auto">
                  AI가 분석하는 당신만의 글래스 스킨 여정을 시작해보세요
                </p>
                <Link to="/camera">
                  <Button className="h-20 px-16 text-2xl btn-luxury animate-glow shadow-2xl">
                    <Sparkles className="w-8 h-8 mr-4" />
                    무료로 시작하기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
