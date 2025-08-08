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
  return <div className="min-h-screen bg-background">
      {/* Hero Section - Linear Style */}
      <Section spacing="hero" className="relative">
        <Container size="xl" className="text-center">
          {/* Top-right Login */}
          <div className="absolute right-4 top-4 z-20">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="scale-[1.5]">로그인</Button>
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
            
          </div>
        </Container>
      </Section>

      {/* How it works */}
      

      {/* CTA Section */}
      
    </div>;
};
export default Index;
