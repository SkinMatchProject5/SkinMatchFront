import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Header, Navigation, Hero, Footer } from '@/components/ui/theme-layout';
import { Camera, Search, Sparkles, ArrowRight, Check } from 'lucide-react';
import heroModel from '@/assets/hero-model.jpg';
import step1Camera from '@/assets/step-1-camera.jpg';
import step2Analysis from '@/assets/step-2-analysis.jpg';
import step3Results from '@/assets/step-3-results.jpg';
import step4Hospital from '@/assets/step-4-hospital.jpg';

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI 피부 분석',
      description: '정밀한 피부 상태 분석과 맞춤형 솔루션 제공'
    },
    {
      icon: Search,
      title: '전문 병원 매칭',
      description: '분석 결과 기반 최적의 피부과 전문의 연결'
    },
    {
      icon: Sparkles,
      title: 'K-뷰티 케어',
      description: '개인별 맞춤 스킨케어 루틴과 제품 추천'
    }
  ];

  const steps = [
    { 
      number: '01', 
      title: '3방향 촬영', 
      description: '정면, 좌측, 우측으로 촬영하여 정확한 피부 상태 파악',
      image: step1Camera 
    },
    { 
      number: '02', 
      title: 'AI 분석', 
      description: '고도화된 딥러닝 알고리즘으로 피부 타입과 문제점 분석',
      image: step2Analysis 
    },
    { 
      number: '03', 
      title: '결과 리포트', 
      description: '상세한 분석 결과와 개선 방향 제시',
      image: step3Results 
    },
    { 
      number: '04', 
      title: '전문의 매칭', 
      description: '필요시 해당 분야 전문의와 직접 상담 연결',
      image: step4Hospital 
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Linear Style */}
      <Section spacing="hero" className="relative">
        <Container size="xl" className="text-center">
          {/* TODO: 실제 서비스에서는 고품질 K-뷰티 모델 사진으로 교체 */}
          <div className="absolute inset-0 z-0 opacity-10">
            <img 
              src={heroModel} 
              alt="K-beauty model background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <Typography variant="caption" className="uppercase tracking-wider text-primary">
                피부과 전문 AI 분석
              </Typography>
              <Typography variant="h1" className="max-w-4xl mx-auto">
                AI가 제안하는<br />당신만의 피부 솔루션
              </Typography>
              <Typography variant="h2" className="max-w-2xl mx-auto">
                전문적인 피부 분석과 맞춤형 케어로 건강한 피부를 만나보세요
              </Typography>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/camera" className="flex-1">
                <Button size="lg" className="w-full">
                  <Camera className="w-5 h-5" />
                  피부 분석 시작
                </Button>
              </Link>
              <Link to="/hospital" className="flex-1">
                <Button variant="outline" size="lg" className="w-full">
                  병원 찾기
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            {/* Login/Signup Buttons */}
            <div className="flex justify-center gap-4 pt-8">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" size="sm">
                  회원가입
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
              <div className="text-center">
                <Typography variant="h3" className="text-primary">50K+</Typography>
                <Typography variant="bodySmall">분석 완료</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="text-primary">98.7%</Typography>
                <Typography variant="bodySmall">정확도</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h3" className="text-primary">1.2K+</Typography>
                <Typography variant="bodySmall">협력 병원</Typography>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="default" background="muted">
        <Container size="xl">
          <div className="text-center mb-16 space-y-4">
            <Typography variant="h3">전문적인 피부 케어 솔루션</Typography>
            <Typography variant="subtitle" className="max-w-2xl mx-auto">
              AI 분석부터 전문의 상담까지 통합적인 피부 관리 서비스
            </Typography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-card rounded-xl p-8 h-full border border-border hover:border-primary/20 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Typography variant="h4" className="mb-4 text-foreground">
                    {feature.title}
                  </Typography>
                  <Typography variant="bodySmall" className="leading-relaxed">
                    {feature.description}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      <Section spacing="default">
        <Container size="xl">
          <div className="text-center mb-16 space-y-4">
            <Typography variant="h3">간단한 4단계 프로세스</Typography>
            <Typography variant="subtitle" className="max-w-2xl mx-auto">
              직관적이고 효율적인 피부 분석 과정
            </Typography>
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-sm font-medium">
                      {step.number}
                    </div>
                    <Typography variant="caption" className="text-primary uppercase tracking-wider">
                      STEP {step.number}
                    </Typography>
                  </div>
                  <Typography variant="h3" className="text-foreground">
                    {step.title}
                  </Typography>
                  <Typography variant="body" className="leading-relaxed max-w-md">
                    {step.description}
                  </Typography>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  {/* TODO: 실제 구현 시 각 단계별 실제 앱 화면 캡처 이미지로 교체 */}
                  <div className="relative bg-card rounded-2xl overflow-hidden border border-border">
                    <img 
                      src={step.image} 
                      alt={`${step.title} 미리보기`}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
                        <Typography variant="caption" className="text-foreground">
                          {step.title}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="default" background="card">
        <Container size="lg" className="text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-4">
              <Typography variant="h3">
                지금 바로 시작해보세요
              </Typography>
              <Typography variant="h2">
                전문적인 피부 분석과 맞춤형 솔루션을 경험해보세요
              </Typography>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/camera" className="flex-1">
                <Button size="lg" className="w-full">
                  <Camera className="w-5 h-5" />
                  무료로 시작하기
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                무료 분석
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                즉시 결과
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />
                전문의 매칭
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Index;
