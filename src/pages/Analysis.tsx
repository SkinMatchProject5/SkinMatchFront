import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

const Analysis = () => {
  const skinScore = 78;
  
  const analysisResults = [
    { category: '수분', score: 85, status: 'good', icon: '💧' },
    { category: '유분', score: 65, status: 'normal', icon: '✨' },
    { category: '탄력', score: 72, status: 'normal', icon: '🎯' },
    { category: '주름', score: 45, status: 'poor', icon: '📏' },
    { category: '모공', score: 68, status: 'normal', icon: '🔍' },
    { category: '색소', score: 82, status: 'good', icon: '🌈' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-50 border-green-200';
      case 'normal': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good': return '양호';
      case 'normal': return '보통';
      case 'poor': return '관리필요';
      default: return '분석중';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-glass p-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            피부 분석 결과
          </h1>
          <p className="text-muted-foreground">
            AI가 분석한 당신의 피부 상태입니다
          </p>
        </div>

        {/* 전체 스코어 */}
        <Card className="glass-card mb-8 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full border-8 border-primary-soft/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary animate-spin-slow"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{skinScore}</div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">글래스 스킨 레벨</h2>
            <Badge className="bg-primary-soft text-primary text-lg px-4 py-2">
              Level 3 - 좋음
            </Badge>
            <p className="text-muted-foreground mt-4">
              전반적으로 건강한 피부 상태입니다. 꾸준한 관리로 더욱 개선할 수 있어요.
            </p>
          </CardContent>
        </Card>

        {/* 상세 분석 결과 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {analysisResults.map((result) => (
            <Card key={result.category} className="glass-card hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{result.icon}</span>
                    <h3 className="font-semibold">{result.category}</h3>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {getStatusText(result.status)}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">점수</span>
                    <span className="font-bold text-lg">{result.score}</span>
                  </div>
                  <Progress value={result.score} className="h-2" />
                </div>

                {result.status === 'poor' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
                    <AlertCircle className="w-4 h-4" />
                    <span>전문의 상담 권장</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 액션 버튼들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">재분석하기</h3>
              <p className="text-sm text-muted-foreground">새로운 사진으로 다시 분석</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">맞춤 케어</h3>
              <p className="text-sm text-muted-foreground">AI 추천 케어 루틴</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-soft/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">병원 찾기</h3>
              <p className="text-sm text-muted-foreground">전문의 상담 받기</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;