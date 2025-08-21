import apiClient from './authService';

// 병원 타입 정의
export interface Hospital {
  id: number;
  name: string;
  image?: string;
  rating: number;
  distance: string;
  specialties: string[];
  address: string;
  phone: string;
  description: string;
  availableToday: boolean;
  openHours: string;
  reviewCount: number;
  isBookmarked?: boolean;
  latitude?: number;
  longitude?: number;
  // 추가 필드들
  website?: string;
  parkingAvailable?: boolean;
  nightService?: boolean;
  weekendService?: boolean;
  reservationAvailable?: boolean;
  sameDayService?: boolean;
  insuranceAccepted?: boolean;
}

// 병원 검색 요청 타입
export interface HospitalSearchRequest {
  location?: string;
  latitude?: number;
  longitude?: number;
  specialties?: string[];
  radius?: number; // 검색 반경 (km)
  sortBy?: 'distance' | 'rating' | 'reviewCount';
  limit?: number;
  offset?: number;
}

// 병원 검색 응답 타입
export interface HospitalSearchResponse {
  hospitals: Hospital[];
  total: number;
  hasMore: boolean;
}

// 지오코딩 서비스 (주소 -> 좌표 변환) - 네이버 지오코딩 API 사용
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    // 브라우저 내장 지오코딩 사용 (네이버 지도 스크립트가 로드된 경우)
    if (window.naver && window.naver.maps && window.naver.maps.Service) {
      return new Promise((resolve) => {
        window.naver.maps.Service.geocode({
          query: address
        }, (status: any, response: any) => {
          if (status === window.naver.maps.Service.Status.OK && response.v2.addresses.length > 0) {
            const result = response.v2.addresses[0];
            resolve({
              lat: parseFloat(result.y),
              lng: parseFloat(result.x)
            });
          } else {
            resolve(null);
          }
        });
      });
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding 오류:', error);
    return null;
  }
};

// 현재 위치 가져오기
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 지원되지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

// 두 좌표 간의 거리 계산 (Haversine 공식)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// 병원 서비스 API
export const hospitalService = {
  // 병원 검색
  async searchHospitals(params: HospitalSearchRequest): Promise<HospitalSearchResponse> {
    try {
      const response = await apiClient.get('/hospitals/search', { params });
      return response.data.data;
    } catch (error) {
      console.error('병원 검색 오류:', error);
      
      // 개발 중에는 목업 데이터 반환
      return {
        hospitals: getMockHospitals(params),
        total: getMockHospitals(params).length,
        hasMore: false
      };
    }
  },

  // 병원 상세 정보 조회
  async getHospitalDetail(hospitalId: number): Promise<Hospital> {
    try {
      const response = await apiClient.get(`/hospitals/${hospitalId}`);
      return response.data.data;
    } catch (error) {
      console.error('병원 상세 정보 조회 오류:', error);
      throw error;
    }
  },

  // 병원 북마크 토글
  async toggleBookmark(hospitalId: number): Promise<{ isBookmarked: boolean }> {
    try {
      const response = await apiClient.post(`/hospitals/${hospitalId}/bookmark`);
      return response.data.data;
    } catch (error) {
      console.error('북마크 토글 오류:', error);
      throw error;
    }
  },

  // 사용자 북마크 목록 조회
  async getBookmarkedHospitals(): Promise<Hospital[]> {
    try {
      const response = await apiClient.get('/hospitals/bookmarks');
      return response.data.data;
    } catch (error) {
      console.error('북마크 목록 조회 오류:', error);
      return [];
    }
  },

  // 병원 리뷰 작성
  async addReview(hospitalId: number, review: {
    rating: number;
    comment: string;
    visitDate?: string;
  }): Promise<void> {
    try {
      await apiClient.post(`/hospitals/${hospitalId}/reviews`, review);
    } catch (error) {
      console.error('리뷰 작성 오류:', error);
      throw error;
    }
  },

  // 근처 병원 검색 (현재 위치 기반)
  async findNearbyHospitals(
    latitude: number, 
    longitude: number, 
    radius: number = 5
  ): Promise<Hospital[]> {
    try {
      const response = await apiClient.get('/hospitals/nearby', {
        params: { latitude, longitude, radius }
      });
      return response.data.data;
    } catch (error) {
      console.error('근처 병원 검색 오류:', error);
      
      // 개발 중에는 목업 데이터 반환
      return getMockHospitalsWithDistance(latitude, longitude, radius);
    }
  }
};

// 개발용 목업 데이터
const getMockHospitals = (params: HospitalSearchRequest): Hospital[] => {
  const mockHospitals: Hospital[] = [
    {
      id: 1,
      name: '강남 글래스 스킨 클리닉',
      rating: 4.8,
      distance: '0.8km',
      specialties: ['여드름', '기미', '주름', '피부과'],
      address: '서울특별시 강남구 역삼동 123-45',
      phone: '02-123-4567',
      description: '최신 레이저 장비와 K-뷰티 케어 전문 클리닉',
      availableToday: true,
      openHours: '09:00-18:00',
      reviewCount: 1247,
      latitude: 37.5006,
      longitude: 127.0366,
      parkingAvailable: true,
      reservationAvailable: true,
      insuranceAccepted: true
    },
    {
      id: 2,
      name: '뷰티 더마 의원',
      rating: 4.6,
      distance: '1.2km',
      specialties: ['아토피', '민감성피부', '색소침착', '피부과'],
      address: '서울특별시 강남구 신사동 567-89',
      phone: '02-234-5678',
      description: '개인 맞춤형 피부 솔루션 제공',
      availableToday: false,
      openHours: '10:00-19:00',
      reviewCount: 892,
      latitude: 37.5172,
      longitude: 127.0286,
      nightService: true,
      weekendService: true,
      reservationAvailable: true
    },
    {
      id: 3,
      name: '서울 스킨케어 센터',
      rating: 4.9,
      distance: '2.1km',
      specialties: ['여드름흉터', '모공', '탄력', '성형외과'],
      address: '서울특별시 강남구 청담동 234-56',
      phone: '02-345-6789',
      description: '피부 재생 치료 전문 클리닉',
      availableToday: true,
      openHours: '08:30-17:30',
      reviewCount: 2156,
      latitude: 37.5197,
      longitude: 127.0474,
      parkingAvailable: true,
      sameDayService: true,
      insuranceAccepted: true
    },
    {
      id: 4,
      name: '프리미엄 스킨 클리닉',
      rating: 4.7,
      distance: '1.8km',
      specialties: ['보톡스', '필러', '리프팅', '성형외과'],
      address: '서울특별시 강남구 논현동 789-12',
      phone: '02-456-7890',
      description: 'VIP 개인 맞춤 케어 서비스',
      availableToday: true,
      openHours: '09:30-18:30',
      reviewCount: 634,
      latitude: 37.5109,
      longitude: 127.0226,
      parkingAvailable: true,
      reservationAvailable: true
    },
    {
      id: 5,
      name: '자연치유 한의원',
      rating: 4.4,
      distance: '3.2km',
      specialties: ['한방치료', '체질개선', '면역강화', '한의원'],
      address: '서울특별시 강남구 대치동 345-67',
      phone: '02-567-8901',
      description: '천연 한방 피부 치료 전문',
      availableToday: false,
      openHours: '10:00-20:00',
      reviewCount: 445,
      latitude: 37.4951,
      longitude: 127.0619,
      nightService: true,
      weekendService: false,
      insuranceAccepted: true
    }
  ];

  // 필터링 로직
  let filtered = mockHospitals;

  if (params.specialties && params.specialties.length > 0) {
    filtered = filtered.filter(hospital =>
      params.specialties!.some(specialty =>
        hospital.specialties.includes(specialty)
      )
    );
  }

  if (params.location) {
    filtered = filtered.filter(hospital =>
      hospital.name.includes(params.location!) ||
      hospital.address.includes(params.location!)
    );
  }

  // 정렬
  if (params.sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (params.sortBy === 'reviewCount') {
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return filtered;
};

// 거리 기반 목업 데이터
const getMockHospitalsWithDistance = (
  userLat: number, 
  userLng: number, 
  radius: number
): Hospital[] => {
  const mockHospitals = getMockHospitals({});
  
  return mockHospitals
    .map(hospital => {
      if (hospital.latitude && hospital.longitude) {
        const distance = calculateDistance(
          userLat, userLng, 
          hospital.latitude, hospital.longitude
        );
        return {
          ...hospital,
          distance: `${distance.toFixed(1)}km`
        };
      }
      return hospital;
    })
    .filter(hospital => {
      if (hospital.latitude && hospital.longitude) {
        const distance = calculateDistance(
          userLat, userLng, 
          hospital.latitude, hospital.longitude
        );
        return distance <= radius;
      }
      return false;
    })
    .sort((a, b) => {
      const distanceA = parseFloat(a.distance.replace('km', ''));
      const distanceB = parseFloat(b.distance.replace('km', ''));
      return distanceA - distanceB;
    });
};

export default hospitalService;
