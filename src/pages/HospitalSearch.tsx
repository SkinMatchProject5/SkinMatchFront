import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HospitalCard from '@/components/features/hospital/HospitalCard';
import { MapPin, SlidersHorizontal, List, Grid3X3, Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import hospitalMapDemo from '@/assets/hospital-map-demo.jpg';

// 접을 수 있는 SearchFilters 컴포넌트
const CollapsibleSearchFilters = ({
  searchLocation,
  setSearchLocation,
  selectedFilters,
  onToggleFilter,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterCategories = [{
    title: '진료 분야',
    filters: ['여드름', '기미', '주름', '아토피', '민감성피부', '색소침착', '여드름흉터', '모공', '탄력']
  }, {
    title: '치료 방법',
    filters: ['레이저치료', '약물치료', '수술치료', '한방치료', '보톡스', '필러', '리프팅']
  }, {
    title: '병원 유형',
    filters: ['피부과', '성형외과', '한의원', '종합병원', '개인병원']
  }, {
    title: '편의사항',
    filters: ['주차가능', '야간진료', '주말진료', '예약가능', '당일진료', '보험적용']
  }];
  return <div className="bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 검색바 */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder="지역명, 병원명 검색" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="h-12 px-4 border-gray-200 hover:bg-primary hover:text-white hover:border-primary">
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            필터
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* 선택된 필터 표시 */}
        {selectedFilters.length > 0 && <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.map(filter => <Badge key={filter} variant="secondary" className="bg-primary text-white hover:bg-primary/90 cursor-pointer" onClick={() => onToggleFilter(filter)}>
                {filter}
                <X className="w-3 h-3 ml-1" />
              </Badge>)}
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-primary">
              전체 삭제
            </Button>
          </div>}

        {/* 접을 수 있는 필터 영역 */}
        {isExpanded && <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterCategories.map(category => <div key={category.title}>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.filters.map(filter => <label key={filter} className="flex items-center cursor-pointer group">
                        <input type="checkbox" checked={selectedFilters.includes(filter)} onChange={() => onToggleFilter(filter)} className="rounded border-gray-300 text-primary focus:ring-primary/50 mr-2" />
                        <span className="text-sm text-gray-600 group-hover:text-primary">
                          {filter}
                        </span>
                      </label>)}
                  </div>
                </div>)}
            </div>
          </div>}
      </div>
    </div>;
};
const HospitalSearch = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [bookmarkedHospitals, setBookmarkedHospitals] = useState<number[]>([]);
  const hospitals = [{
    id: 1,
    name: '강남 글래스 스킨 클리닉',
    image: '/placeholder.svg',
    rating: 4.8,
    distance: '0.8km',
    specialties: ['여드름', '기미', '주름'],
    address: '서울시 강남구 역삼동 123-45',
    phone: '02-123-4567',
    description: '최신 레이저 장비와 K-뷰티 케어 전문 클리닉',
    availableToday: true,
    openHours: '09:00-18:00',
    reviewCount: 1247,
    isBookmarked: false
  }, {
    id: 2,
    name: '뷰티 더마 의원',
    image: '/placeholder.svg',
    rating: 4.6,
    distance: '1.2km',
    specialties: ['아토피', '민감성피부', '색소침착'],
    address: '서울시 강남구 신사동 567-89',
    phone: '02-234-5678',
    description: '개인 맞춤형 피부 솔루션 제공',
    availableToday: false,
    openHours: '10:00-19:00',
    reviewCount: 892,
    isBookmarked: true
  }, {
    id: 3,
    name: '서울 스킨케어 센터',
    image: '/placeholder.svg',
    rating: 4.9,
    distance: '2.1km',
    specialties: ['여드름흉터', '모공', '탄력'],
    address: '서울시 강남구 청담동 234-56',
    phone: '02-345-6789',
    description: '피부 재생 치료 전문 클리닉',
    availableToday: true,
    openHours: '08:30-17:30',
    reviewCount: 2156,
    isBookmarked: false
  }, {
    id: 4,
    name: '프리미엄 스킨 클리닉',
    image: '/placeholder.svg',
    rating: 4.7,
    distance: '1.8km',
    specialties: ['보톡스', 'V라인', '리프팅'],
    address: '서울시 강남구 논현동 789-12',
    phone: '02-456-7890',
    description: 'VIP 개인 맞춤 케어 서비스',
    availableToday: true,
    openHours: '09:30-18:30',
    reviewCount: 634,
    isBookmarked: false
  }, {
    id: 5,
    name: '자연치유 한의원',
    image: '/placeholder.svg',
    rating: 4.4,
    distance: '3.2km',
    specialties: ['한방치료', '체질개선', '면역강화'],
    address: '서울시 강남구 대치동 345-67',
    phone: '02-567-8901',
    description: '천연 한방 피부 치료 전문',
    availableToday: false,
    openHours: '10:00-20:00',
    reviewCount: 445,
    isBookmarked: true
  }];
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };
  const clearFilters = () => {
    setSelectedFilters([]);
  };
  const handleBookmark = (hospitalId: number) => {
    setBookmarkedHospitals(prev => prev.includes(hospitalId) ? prev.filter(id => id !== hospitalId) : [...prev, hospitalId]);
  };
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };
  const handleNavigate = (address: string) => {
    // 실제 구현에서는 지도 앱을 열거나 내부 지도 기능을 사용
    console.log('길찾기:', address);
  };
  const hospitalsWithBookmarks = hospitals.map(hospital => ({
    ...hospital,
    isBookmarked: bookmarkedHospitals.includes(hospital.id)
  }));
  const resultCount = hospitalsWithBookmarks.length;
  return <div className="min-h-screen bg-gradient-glass pb-28 pb-safe-bottom">
      {/* 헤더 */}
      <div className="bg-white/90 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            전문 병원 찾기
          </h1>
          <p className="text-muted-foreground mb-6">
            AI 분석 결과에 맞는 피부 전문 병원을 찾아보세요
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <CollapsibleSearchFilters searchLocation={searchLocation} setSearchLocation={setSearchLocation} selectedFilters={selectedFilters} onToggleFilter={toggleFilter} onClearFilters={clearFilters} />

      {/* 결과 헤더 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              검색 결과 <span className="text-primary">{resultCount}개</span>
            </h2>
            {selectedFilters.length > 0 && <Badge variant="secondary" className="bg-primary-soft text-primary">
                {selectedFilters.length}개 필터 적용중
              </Badge>}
          </div>

          <div className="flex items-center gap-2">
            
            
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 지도 영역 */}
          <div className="h-[45svh] sm:h-[50svh] md:h-[60svh] lg:h-[70svh]">
            <Card className="h-full glass-card overflow-hidden">
              <CardContent className="p-0 h-full relative">
                {/* 데모용 구글맵 스타일 이미지 - 실제 서비스에서는 Google Maps API로 교체 */}
                {/* TODO: 실제 구현 시 Google Maps JavaScript API 또는 Naver Maps API 연동 */}
                <div className="h-full relative">
                  <img src={hospitalMapDemo} alt="Hospital map interface demo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/10 to-primary-glow/10"></div>
                  
                  {/* 오버레이 정보 */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-primary/30">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm font-medium text-primary mb-1">
                      실시간 병원 위치
                    </p>
                    <p className="text-xs text-muted-foreground">
                      개발 시 실제 지도로 교체
                    </p>
                  </div>
                </div>
                
                {/* 지도 컨트롤 */}
                <div className="absolute top-4 right-4 space-y-2">
                  <Button size="sm" variant="outline" className="bg-white/90">
                    현재 위치
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/90">
                    확대
                  </Button>
                </div>

                {/* 범례 */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
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
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 병원 리스트 */}
          <div className="space-y-4">
            {resultCount === 0 ? <Card className="glass-card">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
                  <p className="text-muted-foreground mb-4">
                    다른 검색어나 필터를 사용해보세요
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    필터 초기화
                  </Button>
                </CardContent>
              </Card> : hospitalsWithBookmarks.map(hospital => <HospitalCard key={hospital.id} hospital={hospital} onBookmark={handleBookmark} onCall={handleCall} onNavigate={handleNavigate} />)}
          </div>
        </div>
      </div>
    </div>;
};
export default HospitalSearch;