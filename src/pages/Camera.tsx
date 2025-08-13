import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera as CameraIcon, Upload, RotateCcw, Check, MessageCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCamera } from '@/hooks/useCamera';

const Camera = () => {
  const navigate = useNavigate();
  
  // useCamera 훅 사용
  const {
    isActive,
    error,
    capturedImage,
    deviceInfo,
    faceDetection,
    countdown,
    isConnected,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    manualCapture,
    retake,
    setImageFromFile
  } = useCamera();
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImageFromFile(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const isComplete = capturedImage !== null;

  // 사용자 피드백 메시지 렌더링
  const renderFeedbackMessage = () => {
    if (!isActive) return null;
    
    if (deviceInfo?.isDesktop) {
      // 웹에서는 얼굴 감지 상태 표시
      return (
        <div className="text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20 mb-6">
          <div className="flex items-center justify-center mb-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`} />
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'AI 얼굴 감지 연결됨' : '연결 중...'}
            </span>
          </div>
          
          <p className="text-primary font-medium mb-2">
            {countdown.isActive ? `자동 촬영까지 ${countdown.remaining}초` : '얼굴을 인식하고 있습니다'}
          </p>
          
          <p className="text-sm text-muted-foreground">
            {faceDetection?.feedback || '카메라 앞에 얼굴을 위치시켜 주세요'}
          </p>
          
          {faceDetection && (
            <div className="mt-2 text-xs text-muted-foreground">
              감지된 얼굴: {faceDetection.face_count}개 | 
              신뢰도: {(faceDetection.confidence * 100).toFixed(1)}%
            </div>
          )}
        </div>
      );
    } else {
      // 모바일에서는 수동 촬영 안내
      return (
        <div className="text-center p-4 bg-white/30 backdrop-blur-sm rounded-xl border border-primary/20 mb-6">
          <p className="text-primary font-medium mb-2">
            환부를 프레임 안에 맞춰주세요
          </p>
          <p className="text-sm text-muted-foreground">
            아래 촬영 버튼을 눌러 사진을 찍어주세요
          </p>
        </div>
      );
    }
  };

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
                : countdown.isActive
                ? 'border-orange-500 text-orange-600 bg-orange-50'
                : 'border-primary text-primary bg-primary-soft/20'
            }`}>
              {isComplete ? (
                <Check className="w-6 h-6" />
              ) : countdown.isActive ? (
                <span className="text-lg font-bold">{countdown.remaining}</span>
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
                {/* 실제 카메라 비디오 스트림 */}
                {isActive && (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <canvas
                      ref={canvasRef}
                      className="hidden"
                    />
                  </>
                )}
                
                {/* 카메라가 비활성 상태일 때 */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/20 to-primary-glow/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
                        <CameraIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-primary/30">
                        <p className="text-primary font-medium mb-1">
                          카메라를 시작해주세요
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {deviceInfo?.isDesktop ? '얼굴 감지 모드로 자동 촬영' : '수동 촬영 모드'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 웹에서의 얼굴 감지 가이드라인 */}
                {deviceInfo?.isDesktop && isActive && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-72 h-72 border-2 border-dashed border-primary/80 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        {countdown.isActive ? (
                          <div className="bg-primary/90 backdrop-blur-sm rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-white/50">
                            <span className="text-3xl font-bold text-white">{countdown.remaining}</span>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
                            <CameraIcon className="w-8 h-8 text-primary" />
                          </div>
                        )}
                        
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-primary/30 max-w-xs">
                          <p className="text-primary font-medium mb-1">
                            {countdown.isActive ? '촬영 준비 중...' : '얼굴 인식 중'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {faceDetection?.feedback || '얼굴을 카메라 앞에 위치시켜 주세요'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 모바일에서의 촬영 가이드 */}
                {!deviceInfo?.isDesktop && isActive && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="w-80 h-80 border-2 border-dashed border-primary/80 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50">
                          <CameraIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-primary/30">
                          <p className="text-primary font-medium mb-1">
                            환부를 프레임 안에 맞춰주세요
                          </p>
                          <p className="text-sm text-muted-foreground">
                            촬영 버튼을 눌러 사진을 찍어주세요
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                      <img 
                        src={capturedImage} 
                        alt="촬영된 이미지" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-sm">
                          환부 촬영
                        </Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={retake}
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

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* 상태 메시지 */}
        {renderFeedbackMessage()}

        {/* 액션 버튼 */}
        <div className="space-y-4">
          {!isComplete ? (
            <>
              {!isActive ? (
                <Button 
                  className="w-full h-12 text-lg btn-k-beauty animate-glow"
                  onClick={() => startCamera()}
                >
                  <CameraIcon className="w-6 h-6 mr-2" />
                  카메라 시작
                </Button>
              ) : !deviceInfo?.isDesktop ? (
                // 모바일: 수동 촬영 버튼
                <Button 
                  className="w-full h-12 text-lg btn-k-beauty animate-glow"
                  onClick={manualCapture}
                  disabled={countdown.isActive}
                >
                  <CameraIcon className="w-6 h-6 mr-2" />
                  {countdown.isActive ? `촬영까지 ${countdown.remaining}초` : '촬영하기'}
                </Button>
              ) : null}
              
              {/* 파일 업로드는 모든 플랫폼에서 사용 가능 */}
              {!countdown.isActive && (
                <>
                  <div className="text-center">
                    <span className="text-muted-foreground text-sm">또는</span>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    갤러리에서 선택
                  </Button>
                  
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </>
              )}
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
          <h3 className="font-medium text-primary mb-2">📸 촬영 가이드</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 충분한 조명이 있는 곳에서 촬영해주세요</li>
            <li>• 환부가 선명하게 보이도록 가까이서 촬영해주세요</li>
            <li>• 손이나 그림자로 가리지 않도록 주의해주세요</li>
            {deviceInfo?.isDesktop && (
              <li>• 얼굴이 인식되면 자동으로 3초 후 촬영됩니다</li>
            )}
            {!deviceInfo?.isDesktop && (
              <li>• 후면 카메라로 고화질 촬영이 진행됩니다</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Camera;