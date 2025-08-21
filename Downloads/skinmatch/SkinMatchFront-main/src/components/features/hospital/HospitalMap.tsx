import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Loader2, Home } from 'lucide-react';
import { Hospital } from '@/services/hospitalService';

interface HospitalMapProps {
  hospitals: Hospital[];
  center?: { lat: number; lng: number };
  onHospitalSelect?: (hospital: Hospital) => void;
}

// Naver Map 타입 선언
declare global {
  interface Window {
    naver: any;
  }
}

const HospitalMap: React.FC<HospitalMapProps> = ({ 
  hospitals, 
  center = { lat: 37.5665, lng: 126.9780 }, // 서울 시청 기본 좌표
  onHospitalSelect 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Naver Map API 초기화
  useEffect(() => {
    // 네이버 지도 API가 로드될 때까지 대기
    const checkNaverMaps = () => {
      if (window.naver && window.naver.maps) {
        initializeMap();
      } else {
        // 네이버 지도 API가 아직 로드되지 않았다면 잠시 후 다시 확인
        setTimeout(checkNaverMaps, 100);
      }
    };

    checkNaverMaps();
  }, []);

  // 지도 초기화
  const initializeMap = () => {
    if (!mapContainer.current || !window.naver) return;

    try {
      const mapOptions = {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 14,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: window.naver.maps.MapTypeControlStyle.BUTTON,
          position: window.naver.maps.Position.TOP_RIGHT
        },
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.RIGHT_CENTER
        }
      };

      const map = new window.naver.maps.Map(mapContainer.current, mapOptions);
      mapRef.current = map;

      // 정보창 초기화
      infoWindowRef.current = new window.naver.maps.InfoWindow({
        maxWidth: 300,
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        anchorSize: new window.naver.maps.Size(10, 10),
        anchorSkew: true,
        anchorColor: "#ffffff",
        pixelOffset: new window.naver.maps.Point(20, -20)
      });

      setIsLoading(false);
      
      // 병원 마커 추가
      addHospitalMarkers(map);
      
      // 사용자 현재 위치 가져오기
      getCurrentLocation();

    } catch (error) {
      console.error('지도 초기화 오류:', error);
      setError('지도를 초기화할 수 없습니다.');
      setIsLoading(false);
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.warn('Geolocation이 지원되지 않는 브라우저입니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng });
        
        if (mapRef.current) {
          // 사용자 위치 마커 추가
          addUserLocationMarker(lat, lng);
        }
      },
      (error) => {
        console.warn('현재 위치를 가져올 수 없습니다:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  // 사용자 위치 마커 추가
  const addUserLocationMarker = (lat: number, lng: number) => {
    if (!mapRef.current || !window.naver) return;

    const position = new window.naver.maps.LatLng(lat, lng);
    
    // 사용자 위치 마커 (파란색 점)
    new window.naver.maps.Marker({
      position: position,
      map: mapRef.current,
      icon: {
        content: `
          <div style="
            width: 20px; 
            height: 20px; 
            background: #3b82f6; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        anchor: new window.naver.maps.Point(10, 10)
      }
    });

    // 사용자 위치로 지도 중심 이동
    mapRef.current.setCenter(position);
  };

  // 병원 마커 추가
  const addHospitalMarkers = (map: any) => {
    if (!window.naver || !hospitals.length) return;

    // 기존 마커 제거
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    hospitals.forEach((hospital) => {
      // 병원에 좌표가 있는 경우 바로 마커 생성
      if (hospital.latitude && hospital.longitude) {
        createHospitalMarker(map, hospital, hospital.latitude, hospital.longitude);
      } else {
        // 주소를 좌표로 변환 (네이버 지오코딩 API)
        if (window.naver.maps.Service) {
          window.naver.maps.Service.geocode({
            query: hospital.address
          }, (status: any, response: any) => {
            if (status === window.naver.maps.Service.Status.OK) {
              const result = response.v2.addresses[0];
              if (result) {
                const lat = parseFloat(result.y);
                const lng = parseFloat(result.x);
                createHospitalMarker(map, hospital, lat, lng);
              }
            } else {
              console.warn(`주소 변환 실패: ${hospital.address}`);
            }
          });
        }
      }
    });
  };

  // 병원 마커 생성
  const createHospitalMarker = (map: any, hospital: Hospital, lat: number, lng: number) => {
    const position = new window.naver.maps.LatLng(lat, lng);
    
    // 병원 타입에 따른 마커 색상
    const getMarkerColor = (specialties: string[]) => {
      if (specialties.some(s => s.includes('피부과'))) return '#ef4444'; // 빨간색
      if (specialties.some(s => s.includes('성형외과'))) return '#8b5cf6'; // 보라색
      if (specialties.some(s => s.includes('한의원'))) return '#10b981'; // 초록색
      return '#3b82f6'; // 파란색 (기본)
    };

    const markerColor = getMarkerColor(hospital.specialties);

    const marker = new window.naver.maps.Marker({
      position: position,
      map: map,
      icon: {
        content: `
          <div style="position: relative;">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24c0-8.84-7.16-16-16-16z" fill="${markerColor}" stroke="white" stroke-width="2"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
              <text x="16" y="20" text-anchor="middle" fill="${markerColor}" font-size="10" font-weight="bold">🏥</text>
            </svg>
          </div>
        `,
        anchor: new window.naver.maps.Point(16, 40)
      }
    });

    markersRef.current.push(marker);

    // 마커 클릭 이벤트
    window.naver.maps.Event.addListener(marker, 'click', () => {
      // 정보창 내용
      const contentString = `
        <div style="padding: 16px; font-family: 'Inter', sans-serif; max-width: 280px;">
          <div style="font-weight: 600; font-size: 16px; margin-bottom: 8px; color: #1f2937;">
            ${hospital.name}
          </div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="color: #fbbf24;">⭐</span>
            <span style="font-weight: 500;">${hospital.rating}</span>
            <span style="color: #6b7280;">•</span>
            <span style="color: #6b7280; font-size: 14px;">${hospital.distance}</span>
          </div>
          <div style="font-size: 13px; color: #6b7280; margin-bottom: 10px; line-height: 1.4;">
            📍 ${hospital.address}
          </div>
          <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 12px;">
            ${hospital.specialties.slice(0, 3).map(specialty => 
              `<span style="background: #f3f4f6; padding: 4px 8px; border-radius: 6px; font-size: 11px; color: #4b5563;">${specialty}</span>`
            ).join('')}
          </div>
          <div style="display: flex; gap: 8px;">
            <button onclick="window.open('tel:${hospital.phone}')" style="
              flex: 1; padding: 8px 12px; background: #3b82f6; color: white; border: none; 
              border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
            ">
              📞 전화하기
            </button>
            <button onclick="window.open('https://map.naver.com/v5/search/${encodeURIComponent(hospital.address)}')" style="
              flex: 1; padding: 8px 12px; background: #10b981; color: white; border: none; 
              border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 500;
            ">
              🗺️ 길찾기
            </button>
          </div>
        </div>
      `;

      infoWindowRef.current.setContent(contentString);
      infoWindowRef.current.open(map, marker);
      
      // 병원 선택 콜백 호출
      if (onHospitalSelect) {
        onHospitalSelect(hospital);
      }
    });
  };

  // 현재 위치로 이동
  const moveToCurrentLocation = () => {
    if (userLocation && mapRef.current) {
      const position = new window.naver.maps.LatLng(userLocation.lat, userLocation.lng);
      mapRef.current.setCenter(position);
      mapRef.current.setZoom(16);
    } else {
      getCurrentLocation();
    }
  };

  // 지도 재설정
  const resetMap = () => {
    if (mapRef.current) {
      const defaultCenter = new window.naver.maps.LatLng(center.lat, center.lng);
      mapRef.current.setCenter(defaultCenter);
      mapRef.current.setZoom(14);
    }
  };

  if (error) {
    return (
      <Card className="h-full glass-card">
        <CardContent className="h-full flex items-center justify-center p-6">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">지도를 불러올 수 없습니다</h3>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              다시 시도
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-card overflow-hidden">
      <CardContent className="p-0 h-full relative">
        {/* 로딩 오버레이 */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">네이버 지도를 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 지도 컨테이너 */}
        <div 
          ref={mapContainer} 
          className="w-full h-full"
          style={{ minHeight: '400px' }}
        />

        {/* 지도 컨트롤 버튼들 */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
            onClick={moveToCurrentLocation}
            disabled={isLoading}
          >
            <MapPin className="w-4 h-4 mr-1" />
            내 위치
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm"
            onClick={resetMap}
            disabled={isLoading}
          >
            <Home className="w-4 h-4 mr-1" />
            초기화
          </Button>
        </div>

        {/* 범례 */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
          <div className="text-xs space-y-2">
            <div className="font-medium text-gray-700 mb-2">병원 유형</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>피부과</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>성형외과</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>한의원</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>기타</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2 pt-1 border-t border-gray-200">
                <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                <span>내 위치</span>
              </div>
            )}
          </div>
        </div>

        {/* 네이버 지도 로고 (필수) */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/90 rounded px-2 py-1 text-xs text-gray-600">
            Powered by NAVER Map
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalMap;