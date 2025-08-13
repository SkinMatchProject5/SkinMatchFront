import { useState, useRef, useCallback, useEffect } from 'react';
import { cameraService } from '@/services/cameraService';

interface CameraConfig {
  facingMode: 'user' | 'environment';
  width?: number;
  height?: number;
}

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  supportsCamera: boolean;
}

interface FaceDetectionResult {
  detected: boolean;
  confidence: number;
  face_count: number;
  ready_for_capture: boolean;
  feedback: string;
}

interface CountdownState {
  isActive: boolean;
  remaining: number;
  total: number;
}

export const useCamera = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [faceDetection, setFaceDetection] = useState<FaceDetectionResult | null>(null);
  const [countdown, setCountdown] = useState<CountdownState>({
    isActive: false,
    remaining: 0,
    total: 3
  });
  const [isConnected, setIsConnected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 디바이스 정보 감지
  const detectDevice = useCallback((): DeviceInfo => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = isIOS || isAndroid || /mobile/.test(userAgent);
    const isTablet = /tablet|ipad/.test(userAgent) || (isAndroid && !/mobile/.test(userAgent));
    const isDesktop = !isMobile && !isTablet;
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      supportsCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices
    };
  }, []);

  // WebSocket 연결
  const connectWebSocket = useCallback((sessionId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    const ws = new WebSocket(cameraService.getWebSocketUrl(sessionId));
    
    ws.onopen = () => {
      console.log('Camera WebSocket connected');
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'face_detection_result':
            setFaceDetection({
              detected: data.detected,
              confidence: data.confidence,
              face_count: data.face_count,
              ready_for_capture: data.ready_for_capture,
              feedback: data.feedback
            });
            break;

          case 'countdown_started':
            setCountdown({
              isActive: true,
              remaining: data.duration,
              total: data.duration
            });
            break;

          case 'countdown_tick':
            setCountdown(prev => ({
              ...prev,
              remaining: data.remaining
            }));
            break;

          case 'countdown_stopped':
            setCountdown(prev => ({
              ...prev,
              isActive: false
            }));
            break;

          case 'capture_command':
            capturePhoto();
            setCountdown(prev => ({
              ...prev,
              isActive: false
            }));
            break;

          case 'error':
            console.error('WebSocket error:', data.message);
            setError(data.message);
            break;
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('Camera WebSocket disconnected');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket 연결 오류가 발생했습니다');
      setIsConnected(false);
    };

    wsRef.current = ws;
  }, []);

  // 얼굴 감지 프레임 전송
  const sendFrameForDetection = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 비디오 프레임을 캔버스에 그리기
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Base64로 변환해서 WebSocket으로 전송
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    wsRef.current.send(JSON.stringify({
      type: 'face_detection',
      image: imageData
    }));
  }, []);

  // 카메라 시작
  const startCamera = useCallback(async (config?: CameraConfig) => {
    try {
      setError(null);
      const device = detectDevice();
      setDeviceInfo(device);

      if (!device.supportsCamera) {
        throw new Error('이 기기는 카메라를 지원하지 않습니다');
      }

      // 플랫폼별 카메라 설정
      const constraints: MediaStreamConstraints = {
        video: device.isDesktop ? {
          // 웹: 전면 카메라 (얼굴 인식용)
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } : {
          // 모바일: 후면 카메라
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }

      setIsActive(true);

      // 세션 ID 생성 및 WebSocket 연결
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionIdRef.current = sessionId;
      connectWebSocket(sessionId);

      // 웹(데스크톱)에서만 실시간 얼굴 감지 시작
      if (device.isDesktop && !detectionIntervalRef.current) {
        detectionIntervalRef.current = setInterval(sendFrameForDetection, 100); // 10fps
      }

    } catch (err: any) {
      setError(err.message || '카메라에 접근할 수 없습니다');
      console.error('Camera start error:', err);
    }
  }, [detectDevice, connectWebSocket, sendFrameForDetection]);

  // 카메라 중지
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    setIsActive(false);
    setIsConnected(false);
    setFaceDetection(null);
    setCountdown({ isActive: false, remaining: 0, total: 3 });
  }, []);

  // 사진 촬영
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) {
      setError('촬영할 수 없습니다');
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // 고해상도로 캔버스 설정
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // 비디오 프레임 캡처
    ctx.drawImage(video, 0, 0);
    
    // Base64 이미지로 변환
    const imageData = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedImage(imageData);
    
    // 카메라 중지
    stopCamera();
  }, [stopCamera]);

  // 수동 촬영 (모바일용)
  const manualCapture = useCallback(() => {
    if (deviceInfo?.isDesktop) {
      // 웹에서는 얼굴 감지 결과에 따라 처리
      if (faceDetection?.ready_for_capture) {
        // 이미 준비된 상태면 바로 촬영
        capturePhoto();
      } else {
        setError('얼굴을 인식할 수 없습니다. 다시 시도해주세요.');
      }
    } else {
      // 모바일에서는 바로 촬영
      capturePhoto();
    }
  }, [deviceInfo, faceDetection, capturePhoto]);

  // 파일에서 이미지 설정
  const setImageFromFile = useCallback((imageData: string) => {
    setCapturedImage(imageData);
    stopCamera(); // 카메라 중지
  }, [stopCamera]);

  // 재촬영
  const retake = useCallback(() => {
    setCapturedImage(null);
    setError(null);
    startCamera();
  }, [startCamera]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    // 상태
    isActive,
    error,
    capturedImage,
    deviceInfo,
    faceDetection,
    countdown,
    isConnected,
    
    // 참조
    videoRef,
    canvasRef,
    
    // 메서드
    startCamera,
    stopCamera,
    capturePhoto,
    manualCapture,
    retake,
    setImageFromFile,
    
    // 유틸리티
    detectDevice
  };
};
