import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Header, Navigation, Hero, Footer } from '@/components/ui/theme-layout';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';
const Index = () => {
  const features = [{
    icon: Camera,
    title: 'AI 피부 분석',
    description: '정밀한 피부 상태 분석 후 진단결과 제공'
  }, {
    icon: Search,
    title: '전문 병원 매칭',
    description: '분석 결과 기반 최적의 피부과 병원 추천'
  }];

  // 스냅 시 섹션이 보일 때 부드럽게 나타나는 래퍼
  const RevealOnSnap: React.FC<{
    className?: string;
    children: React.ReactNode;
  }> = ({
    className,
    children
  }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting);
      }, {
        threshold: 0.5
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return <div ref={ref} className={`${visible ? 'opacity-100 animate-enter' : 'opacity-100 animate-exit'} will-change-[transform,opacity] ${className ?? ''}`}>
        {children}
      </div>;
  };
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop smooth section-by-section scroll with iOS-like easing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let isAnimating = false;
    const sections = Array.from(el.querySelectorAll('.snap-start')) as HTMLElement[];
    const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const getCurrentIndex = () => {
      const y = el.scrollTop;
      const tops = sections.map(s => s.offsetTop);
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (y >= tops[i] - 1) idx = i;else break;
      }
      return idx;
    };
    const animateTo = (target: number, duration = 900) => {
      const start = el.scrollTop;
      const change = target - start;
      if (change === 0) return;
      const startTime = performance.now();
      isAnimating = true;
      const step = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = easeOutCubic(t);
        el.scrollTo({
          top: start + change * eased
        });
        if (t < 1) requestAnimationFrame(step);else isAnimating = false;
      };
      requestAnimationFrame(step);
    };
    const onWheel = (e: WheelEvent) => {
      // Only customize desktop wheel scrolling
      if (isAnimating) {
        e.preventDefault();
        return;
      }
      // Ignore tiny deltas (e.g., inertia tail)
      const delta = e.deltaY;
      if (Math.abs(delta) < 10) return; // allow micro moves
      e.preventDefault();
      const current = getCurrentIndex();
      const next = clamp(current + (delta > 0 ? 1 : -1), 0, sections.length - 1);
      if (next !== current) animateTo(sections[next].offsetTop, 900);
    };
    const onKey = (e: KeyboardEvent) => {
      if (isAnimating) {
        e.preventDefault();
        return;
      }
      const downKeys = ['ArrowDown', 'PageDown', ' '];
      const upKeys = ['ArrowUp', 'PageUp'];
      if (downKeys.includes(e.key) || e.key === ' ' && !e.shiftKey) {
        e.preventDefault();
        const current = getCurrentIndex();
        const next = clamp(current + 1, 0, sections.length - 1);
        if (next !== current) animateTo(sections[next].offsetTop, 900);
      } else if (upKeys.includes(e.key) || e.key === ' ' && e.shiftKey) {
        e.preventDefault();
        const current = getCurrentIndex();
        const prev = clamp(current - 1, 0, sections.length - 1);
        if (prev !== current) animateTo(sections[prev].offsetTop, 900);
      }
    };
    el.addEventListener('wheel', onWheel, {
      passive: false
    });
    window.addEventListener('keydown', onKey, {
      passive: false
    });
    return () => {
      el.removeEventListener('wheel', onWheel as any);
      window.removeEventListener('keydown', onKey as any);
    };
  }, []);
  return <div ref={containerRef} className="theme-home-bright h-screen bg-background overflow-y-scroll snap-y snap-mandatory scroll-smooth">
      {/* Hero Section - Linear Style */}
      <Section spacing="hero" className="relative gradient-hero snap-start min-h-screen flex items-center">
        <Container size="xl">
          {/* Top-right Login */}
          <div className="absolute right-4 top-4 z-20">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="scale-[1.5]">로그인</Button>
            </Link>
          </div>
          
          {/* Content */}
          <RevealOnSnap>
            <div className="relative z-10 pt-32">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Left: Image */}
                <div className="order-1 md:order-none">
                  
                </div>

                {/* Right: Text + CTAs */}
                <div className="space-y-8 text-left">
                  <Typography variant="h1" className="max-w-4xl">
                    AI가 제안하는<br />당신만의 피부 솔루션
                  </Typography>
                  <Typography variant="h2" className="max-w-2xl">
                    전문적인 피부 분석과 맞춤 병원 추천으로 건강한 피부를 만나보세요
                  </Typography>

                  <div className="flex flex-col sm:flex-row gap-4 max-w-md">
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
                </div>
              </div>
            </div>
          </RevealOnSnap>
        </Container>
      </Section>

      {/* AI 진단 홍보 Section */}
      <Section spacing="lg" background="muted" className="snap-start min-h-screen flex items-center">
        <Container size="xl">
          <RevealOnSnap>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Typography variant="h3">AI 피부질환 진단의 장점</Typography>
                <Typography variant="subtitle" className="max-w-prose">
                  빠르고 정확한 분석으로 조기 발견과 맞춤 치료를 돕습니다.
                </Typography>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-5 flex gap-3 items-start">
                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1">스마트 피부 진단</Typography>
                      <Typography variant="bodySmall">다양한 피부 이미지 학습으로 높은 신뢰도의 분석 제공</Typography>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 flex gap-3 items-start">
                    <Timer className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1">즉시 결과</Typography>
                      <Typography variant="bodySmall">촬영 후 몇 초 내 결과 확인 및 다음 단계 안내</Typography>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 flex gap-3 items-start">
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1">맞춤 가이드</Typography>
                      <Typography variant="bodySmall">피부 증상에 맞춘 병원 추천</Typography>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-5 flex gap-3 items-start">
                    <MousePointerClick className="w-5 h-5 text-primary shrink-0" />
                    <div>
                      <Typography variant="h4" className="mb-1">편리한 사용성</Typography>
                      <Typography variant="bodySmall">누구나 쉽게 사용할 수 있는 직관적인 인터페이스</Typography>
                    </div>
                  </div>
                </div>
                <div className="pt-2">
                  <Link to="/camera">
                    <Button size="lg">
                      <Camera className="w-5 h-5" />
                      지금 바로 분석하기
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="order-first md:order-last">
                <img src="/lovable-uploads/7723b9f9-13eb-40e3-b772-a09469caceb7.png" alt="AI 피부 진단 데모 이미지" loading="lazy" className="w-full h-auto rounded-2xl shadow-xl ring-1 ring-border object-cover" />
              </div>
            </div>
          </RevealOnSnap>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="default" background="gradient" className="relative overflow-hidden snap-start min-h-screen flex items-center">
        {/* Decorative background elements */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl opacity-30 animate-glow" />
          <div className="absolute -bottom-24 -left-16 w-80 h-80 flow-shape bg-gradient-primary opacity-20 blur-2xl animate-float" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-primary/0 via-primary/30 to-primary/0" />
        </div>
        <Container size="xl" className="relative z-10">
          <RevealOnSnap>
            <div className="text-center mb-16 space-y-4">
              <Typography variant="h3">전문적인 피부 케어 솔루션</Typography>
              <Typography variant="subtitle" className="max-w-2xl mx-auto">
                AI 분석부터 병원 추천까지 통합적인 피부 관리 서비스
              </Typography>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => <div key={index} className="group">
                  <div className="bg-card/90 backdrop-blur-sm rounded-xl p-8 h-full border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
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
          </RevealOnSnap>
        </Container>
      </Section>
    </div>;
};
export default Index;