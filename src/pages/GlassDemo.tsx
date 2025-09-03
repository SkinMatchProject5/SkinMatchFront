import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Zap, Layers, Eye } from 'lucide-react';

const GlassDemo = () => {
  return (
    <div className="min-h-screen p-4 pt-20 bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-black mb-4">
            ✨ Enhanced Liquid Glass Effects
          </h1>
          <p className="text-gray-600 text-lg">
            프로젝트에 적용된 강화된 Glassmorphism 효과들
          </p>
        </div>

        {/* Button Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">버튼 변형들</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="glass" size="lg" className="h-14">
              <Eye className="w-5 h-5 mr-2" />
              Glass Button
            </Button>
            <Button variant="liquid" size="lg" className="h-14">
              <Sparkles className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">Liquid Glass</span>
            </Button>
            <Button variant="default" size="lg" className="h-14">
              <Zap className="w-5 h-5 mr-2" />
              Default Button
            </Button>
          </div>
        </div>

        {/* Card Variants */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">카드 변형들</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Standard Liquid Glass */}
            <Card className="h-64">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">Standard Glass</CardTitle>
                  <Badge variant="outline">Default</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  기본 liquid-glass 클래스가 적용된 카드입니다.
                </p>
                <div className="space-y-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-xs text-gray-500">투명도: 25%, Blur: 20px</p>
                </div>
              </CardContent>
            </Card>

            {/* Light Glass */}
            <div className="liquid-glass-light rounded-xl p-6 h-64">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Light Glass</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-600">Light</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                가벼운 liquid-glass-light 효과입니다.
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full w-1/2"></div>
                </div>
                <p className="text-xs text-gray-500">투명도: 15%, Blur: 15px</p>
              </div>
            </div>

            {/* Strong Glass */}
            <div className="liquid-glass-strong rounded-xl p-6 h-64">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Strong Glass</h3>
                <Badge variant="outline" className="bg-purple-50 text-purple-600">Strong</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                강력한 liquid-glass-strong 효과입니다.
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full w-4/5"></div>
                </div>
                <p className="text-xs text-gray-500">투명도: 35%, Blur: 25px</p>
              </div>
            </div>

            {/* Primary Glass */}
            <div className="liquid-glass-primary rounded-xl p-6 h-64">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Primary Glass</h3>
                <Badge variant="outline" className="bg-pink-50 text-pink-600">Primary</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                브랜드 컬러가 적용된 liquid-glass-primary입니다.
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-pink-500 rounded-full w-2/3"></div>
                </div>
                <p className="text-xs text-gray-500">Primary 색상, Blur: 20px</p>
              </div>
            </div>

            {/* Interactive Example */}
            <div className="liquid-glass rounded-xl p-6 h-64 hover:shadow-2xl transition-all duration-300 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Interactive</h3>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100">Hover</Badge>
              </div>
              <p className="text-gray-600 mb-4">
                호버 시 효과가 변하는 인터랙티브 카드입니다.
              </p>
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-3/5 group-hover:w-full transition-all duration-500"></div>
                </div>
                <p className="text-xs text-gray-500">호버해서 확인해보세요!</p>
              </div>
            </div>

            {/* Feature Showcase */}
            <div className="liquid-glass rounded-xl p-6 h-64">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <Layers className="w-5 h-5 mr-2" />
                  Features
                </h3>
                <Badge variant="outline" className="bg-green-50 text-green-600">Enhanced</Badge>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>✓ 향상된 백드롭 블러</li>
                <li>✓ 레이어드 그라데이션</li>
                <li>✓ 부드러운 호버 효과</li>
                <li>✓ 모바일 최적화</li>
                <li>✓ 접근성 지원</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="liquid-glass rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center">
            <Sparkles className="w-6 h-6 mr-3" />
            기술적 개선사항
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">시각적 향상</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 백드롭 필터 강화 (blur + saturate)</li>
                <li>• 다중 레이어 그라데이션 오버레이</li>
                <li>• 동적 투명도 조절</li>
                <li>• 향상된 보더와 그림자</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">성능 최적화</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• 모바일 blur 강도 자동 조절</li>
                <li>• prefers-reduced-motion 지원</li>
                <li>• GPU 가속 활용</li>
                <li>• 부드러운 전환 효과</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <Button variant="liquid" size="lg" className="px-8">
            <Sparkles className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Enhanced Liquid Glass Applied! ✨</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GlassDemo;
