import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera as CameraIcon, Upload, RotateCcw, Check, ArrowRight } from 'lucide-react';

const Camera = () => {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const steps = ['정면', '좌측', '우측'];
  
  const handleCapture = () => {
    // 실제로는 카메라 API를 사용하여 사진을 촬영
    const dummyImage = '/placeholder.svg';
    const newImages = [...capturedImages, dummyImage];
    setCapturedImages(newImages);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        const newImages = [...capturedImages, imageUrl];
        setCapturedImages(newImages);
        
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const retakePhoto = (index: number) => {
    const newImages = [...capturedImages];
    newImages.splice(index, 1);
    setCapturedImages(newImages);
    setCurrentStep(index);
  };

  const isComplete = capturedImages.length === 3;

  return (
    <div className="min-h-screen bg-gradient-glass p-4">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            피부 촬영
          </h1>
          <p className="text-muted-foreground">
            정확한 분석을 위해 3방향에서 촬영해주세요
          </p>
        </div>

        {/* 진행 상황 */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < capturedImages.length 
                    ? 'bg-primary border-primary text-white' 
                    : index === currentStep
                    ? 'border-primary text-primary bg-primary-soft/20'
                    : 'border-muted text-muted-foreground'
                }`}>
                  {index < capturedImages.length ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {!isComplete ? (
          /* 촬영 화면 */
          <Card className="glass-card mb-6 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/3] bg-gradient-to-br from-primary-soft/10 to-primary-glow/10 relative flex items-center justify-center">
                {/* 가이드라인 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-80 border-2 border-dashed border-primary/50 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👤</span>
                      </div>
                      <p className="text-primary font-medium">
                        {steps[currentStep]} 각도로 촬영
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        얼굴을 가이드에 맞춰주세요
                      </p>
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
              <div className="grid grid-cols-3 gap-4 mb-6">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gradient-glow rounded-2xl p-2">
                      <div className="w-full h-full bg-white/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                        <span className="text-4xl">📸</span>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-primary text-xs">
                            {steps[index]}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => retakePhoto(index)}
                        >
                          <RotateCcw className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
              onClick={() => {/* 분석 페이지로 이동 */}}
            >
              <span className="mr-2">✨</span>
              AI 분석 시작하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Camera;