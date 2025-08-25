import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Header, Navigation, Hero, Footer } from '@/components/ui/theme-layout';
import { Camera, Search, ArrowRight, ShieldCheck, Timer, Sparkles, MousePointerClick } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
const Index = () => {
  const {
    isAuthenticated,
    logout
  } = useAuthContext();

  const [scrollY, setScrollY] = useState(0);

  // Simple implementation of useInView hook functionality
  const useInView = <T extends HTMLElement,>() => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, {
        threshold: 0.3
      });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return {
      ref,
      inView
    };
  };

  // Scroll handler for parallax effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hero = useInView<HTMLDivElement>();
  const secondSection = useInView<HTMLDivElement>();
  const thirdSection = useInView<HTMLDivElement>();
  const features = [{
    icon: Camera,
    title: '정밀 분석',
    description: '간결한 촬영, 신뢰할 수 있는 결과'
  }, {
    icon: Search,
    title: '전문의 매칭',
    description: '필요할 때 정확한 연결'
  }];
  return <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section with Fixed Background */}
      {/* Hero Section */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)'
  }}
>
  <Container size="xl">
    <div className="relative z-10 flex items-center justify-center py-20 min-h-screen">
      <div 
        ref={hero.ref} 
        className={`flex flex-col items-center justify-center text-center space-y-8 transition-all duration-1000 ease-out ${
          hero.inView 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-10'
        }`}
      >
        <h1 className="text-4xl md:text-6xl text-white font-sans font-bold">
        Scan. Detect. Connect.
        </h1>
        <h2 className="text-xl md:text-2xl text-white/90 font-sans">
        AI 피부 분석으로 질환을 빠르게 확인하세요
        </h2>
      </div>
    </div>
  </Container>
</Section>



      {/* AI 진단 홍보 Section */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-fixed bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/lovable-uploads/cloud.jpg)'
  }}
>
  <Container size="xl">
    <div 
      ref={secondSection.ref}
      className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
        secondSection.inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
      “AI 기반 피부 종양 분석과 맞춤 병원 추천”
      </h2>
      <Link to="/camera">
        <Button 
          size="lg" 
          className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
        >
          AI 종양 분석하기
        </Button>
      </Link>
    </div>
  </Container>
</Section>

{/* AI 안면 분석 Section */}
<Section 
  spacing="hero" 
  className="relative min-h-screen bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: 'url(/lovable-uploads/3cf38996-cc98-4c21-b772-a8382b1405c8.png)'
  }}
>
  <Container size="xl">
    <div 
      ref={thirdSection.ref}
      className={`flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
        thirdSection.inView 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10'
      }`}
    >
      <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
      “AI 기반 안면부 피부질환 분석과 맞춤 병원 추천”
      </h2>
      <Link to="/camera">
        <Button 
          size="lg" 
          className="bg-transparent border-2 border-white text-white font-sans hover:bg-white hover:text-black transition-all duration-300 px-8 py-4 text-lg"
        >
          AI 안면부 분석하기
        </Button>
      </Link>
    </div>
  </Container>
</Section>
    </div>;
};
export default Index;