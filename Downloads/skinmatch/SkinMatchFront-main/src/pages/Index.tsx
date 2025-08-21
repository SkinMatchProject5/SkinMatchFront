import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { useAuthContext } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, logout } = useAuthContext();

  // Simple useInView hook
  const useInView = <T extends HTMLElement,>() => {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => setInView(entry.isIntersecting),
        { threshold: 0.3 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return { ref, inView };
  };

  const hero = useInView<HTMLDivElement>();
  const secondSection = useInView<HTMLDivElement>();
  const thirdSection = useInView<HTMLDivElement>();

  return (
    <div className="theme-home-bright min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <Section spacing="hero" className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-out ${
            hero.inView ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage:
              'url(/lovable-uploads/d89990f8-9655-40af-a548-ce462b0ff981.png)',
          }}
        />

        <Container size="xl">
          <div className="relative z-10 flex items-center justify-center py-20 min-h-screen">
            <div
              ref={hero.ref}
              className={`w-full max-w-2xl text-center space-y-6 mt-20 transition-all duration-1000 ease-out ${
                hero.inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="text-4xl md:text-6xl text-white font-sans font-bold text-center">
                Diagnose. Match. Heal.
              </div>
              <Typography
                variant="h2"
                className="max-w-xl mx-auto text-white/90 text-center"
              >
                AI가 제안하는 당신만의 피부 솔루션
              </Typography>
            </div>
          </div>
        </Container>
      </Section>

      {/* AI 진단 홍보 Section */}
      <Section spacing="hero" className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-out ${
            secondSection.inView ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage:
              'url(/lovable-uploads/e737c29e-2c53-4377-945c-75e21ea3a41d.png)',
          }}
        />

        <Container size="xl">
          <div
            ref={secondSection.ref}
            className={`relative z-10 flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
              secondSection.inView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
              AI 기술로 종양을 정밀 분석
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
      <Section spacing="hero" className="relative min-h-screen overflow-hidden">
        {/* 배경 이미지 */}
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-out ${
            thirdSection.inView ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage:
              'url(/lovable-uploads/3cf38996-cc98-4c21-b772-a8382b1405c8.png)',
          }}
        />

        <Container size="xl">
          <div
            ref={thirdSection.ref}
            className={`relative z-10 flex flex-col items-center justify-center min-h-screen text-center space-y-8 transition-all duration-1000 ease-out ${
              thirdSection.inView
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-sans font-bold text-white">
              AI 기술로 얼굴을 자동 인식하고 분석
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
    </div>
  );
};

export default Index;
