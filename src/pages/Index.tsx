import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Header, Navigation, Hero, Footer } from '@/components/ui/theme-layout';
import { Camera, Search, ArrowRight } from 'lucide-react';
import heroModel from '@/assets/hero-model.jpg';
import step1Camera from '@/assets/step-1-camera.jpg';
import step2Analysis from '@/assets/step-2-analysis.jpg';
import step3Results from '@/assets/step-3-results.jpg';
import step4Hospital from '@/assets/step-4-hospital.jpg';
const Index = () => {
  const features = [{
    icon: Camera,
    title: 'AI 피부 분석',
    description: '정밀한 피부 상태 분석과 맞춤형 솔루션 제공'
  }, {
    icon: Search,
    title: '전문 병원 매칭',
    description: '분석 결과 기반 최적의 피부과 전문의 연결'
  }];
  const steps = [{
    number: '01',
    title: '3방향 촬영',
    description: '정면, 좌측, 우측으로 촬영하여 정확한 피부 상태 파악',
    image: step1Camera
  }, {
    number: '02',
    title: 'AI 분석',
    description: '고도화된 딥러닝 알고리즘으로 피부 타입과 문제점 분석',
    image: step2Analysis
  }, {
    number: '03',
    title: '결과 리포트',
    description: '상세한 분석 결과와 개선 방향 제시',
    image: step3Results
  }, {
    number: '04',
    title: '전문의 매칭',
    description: '필요시 해당 분야 전문의와 직접 상담 연결',
    image: step4Hospital
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section - Linear Style */}
      <Section spacing="hero" className="relative">
        <Container size="xl" className="text-center">
          {/* Top-right Login */}
          <div className="absolute right-4 top-4 z-20">
            <Link to="/login">
              <Button variant="ghost" size="xl" className="scale-[3]">로그인</Button>
            </Link>
          </div>
          {/* TODO: 실제 서비스에서는 고품질 K-뷰티 모델 사진으로 교체 */}
          <div className="absolute inset-0 z-0 opacity-10">
            <img src={heroModel} alt="K-beauty model background" className="w-full h-full object-cover" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <Typography variant="caption" className="uppercase tracking-wider text-primary">피부과 전문 AI 분석</Typography>
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
            

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
              <div className="text-center">
                
                
              </div>
              <div className="text-center">
                
                
              </div>
              <div className="text-center">
                
                
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => <div key={index} className="group">
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
              </div>)}
          </div>
        </Container>
      </Section>

      {/* How it works */}
      

      {/* CTA Section */}
      
    </div>;
};
export default Index;