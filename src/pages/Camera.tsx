import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera as CameraIcon, Upload, RotateCcw, Check, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import faceAnalysisDemo from '@/assets/face-analysis-demo.jpg';

const Camera = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCapture = () => {
    // 실제로는 카메라 API를 사용하여 사진을 촬영
    const dummyImage = '/placeholder.svg';
    setCapturedImage(dummyImage);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setCapturedImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const isComplete = capturedImage !== null;

  return (
    <div className="min-h-screen bg-gradient-glass p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            환부 촬영
          </h1>
          <p className="text-muted-foreground">
            정확한 분석을 위해 환부를 정면에서 촬영해주세요
          </p>
        </div>

        {/* 진행 상황 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              isComplete 
                ? 'bg-primary border-primary text-white' 
                : 'border-primary text-primary bg-primary-soft/20'
            }`}>
              {isComplete ? (
                <Check className="w-6 h-6" />
              ) : (
                <CameraIcon className="w-6 h-6" />
              )}
            </div>
          </div>
        </div>

        {!isComplete ? (
          /* 촬영 화면 */
          <Card className="glass-card mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-soft/10 to-primary-glow/10 relative flex items-center justify-center overflow-hidden">
                {/* 데모용 이미지 - 실제 서비스에서는 실시간 카메라 피드로 교체 */}
                {/* TODO: 실제 구현 시 getUserMedia API로 카메라 스트림 연결 */}
                <div className="absolute inset-0">
                  <img 
                    src={faceAnalysisDemo} 
                    alt="Camera demo" 
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/20 to-primary-glow/20"></div>
                </div>
                
                {/* 가이드라인 */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-72 h-72 border-2 border-dashed border-primary/80 rounded-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
                        <CameraIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-primary/30">
                        <p className="text-primary font-medium mb-1">
                          환부를 정면으로 촬영
                        </p>
                        <p className="text-sm text-muted-foreground">
                          환부가 가이드 박스 안에 들어오도록 촬영해주세요
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* 촬영 완료 미리보기 */
          <Card className="glass-card mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-center mb-6">촬영 완료</h2>
              <div className="flex justify-center mb-6">
                <div className="relative group max-w-xs">
                  <div className="aspect-square bg-gradient-glow rounded-2xl p-3">
                    <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <span className="text-6xl">📸</span>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-sm">
                          환부 촬영
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={retakePhoto}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  환부가 선명하게 촬영되었는지 확인해주세요
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {!isComplete ? (
            <>
              <Button 
                className="w-full h-16 text-lg btn-k-beauty animate-glow"
                onClick={handleCapture}
              >
                <CameraIcon className="w-6 h-6 mr-2" />
                촬영하기
              </Button>
              
              <div className="text-center">
                <span className="text-muted-foreground text-sm">또는</span>
              </div>
              
              <Button
                variant="outline"
                className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-5 h-5 mr-2" />
                갤러리에서 선택
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </>
          ) : (
            <Button 
              className="w-full h-16 text-lg btn-k-beauty animate-glow"
              onClick={() => navigate('/questionnaire')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              설문조사 시작하기
            </Button>
          )}
        </div>
        
        {/* 촬영 가이드 */}
        <div className="mt-8 p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20">
          <h3 className="font-medium text-primary mb-2">촬영 가이드</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 충분한 조명이 있는 곳에서 촬영해주세요</li>
            <li>• 환부가 선명하게 보이도록 가까이서 촬영해주세요</li>
            <li>• 손이나 그림자로 가리지 않도록 주의해주세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Camera;