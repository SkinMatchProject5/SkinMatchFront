import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import HospitalCard from '@/components/features/hospital/HospitalCard';
import HospitalMap from '@/components/features/hospital/HospitalMap';
import { hospitalService, Hospital, getCurrentLocation } from '@/services/hospitalService';
import { MapPin, SlidersHorizontal, List, Grid3X3, Search, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

// 접을 수 있는 SearchFilters 컴포넌트
const CollapsibleSearchFilters = ({
  searchLocation,
  setSearchLocation,
  selectedFilters,
  onToggleFilter,
  onClearFilters
}: {
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterCategories = [
    {
      title: '진료 분야',
      filters: ['여드름', '기미', '주름', '아토피', '민감성피부', '색소침착', '여드름흉터', '모공', '탄력']
    },
    {
      title: '치료 방법',
      filters: ['레이저치료', '약물치료', '수술치료', '한방치료', '보톡스', '필러', '리프팅']
    },
    {
      title: '병원 유형',
      filters: ['피부과', '성형외과', '한의원', '종합병원', '개인병원']
    },
    {
      title: '편의사항',
      filters: ['주차가능', '야간진료', '주말진료', '예약가능', '당일진료', '보험적용']
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* 검색바 */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="지역명, 병원명 검색" 
              value={searchLocation} 
              onChange={e => setSearchLocation(e.target.value)} 
              className="w-full h-12 pl-10 pr-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" 
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="h-12 px-4 border-gray-200 hover:bg-primary hover:text-white hover:border-primary"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            필터
            {isExpanded ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>
        </div>

        {/* 선택된 필터 표시 */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedFilters.map(filter => (
              <Badge 
                key={filter} 
                variant="secondary" 
                className="bg-primary text-white hover:bg-primary/90 cursor-pointer" 
                onClick={() => onToggleFilter(filter)}
              >
                {filter}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-primary">
              전체 삭제
            </Button>
          </div>
        )}

        {/* 접을 수 있는 필터 영역 */}
        {isExpanded && (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filterCategories.map(category => (
                <div key={category.title}>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {category.title}
                  </h3>
                  <div className="space-y-2">
                    {category.filters.map(filter => (
                      <label key={filter} className="flex items-center cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.includes(filter)} 
                          onChange={() => onToggleFilter(filter)} 
                          className="rounded border-gray-300 text-primary focus:ring-primary/50 mr-2" 
                        />
                        <span className="text-sm text-gray-600 group-hover:text-primary">
                          {filter}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const HospitalSearch = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [bookmarkedHospitals, setBookmarkedHospitals] = useState<number[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    loadInitialData();
  }, []);

  // 검색 조건 변경 시 병원 데이터 재로드
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchHospitals();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchLocation, selectedFilters, userLocation]);

  // 초기 데이터 로드
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // 현재 위치 가져오기
      try {
        const location = await getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.warn('현재 위치를 가져올 수 없습니다:', error);
        setUserLocation({ lat: 37.5665, lng: 126.9780 });
      }

      // 북마크된 병원 목록 가져오기
      try {
        const bookmarked = await hospitalService.getBookmarkedHospitals();
        setBookmarkedHospitals(bookmarked.map(h => h.id));
      } catch (error) {
        console.warn('북마크 목록을 가져올 수 없습니다:', error);
      }

      // 초기 병원 검색
      await searchHospitals();
    } catch (error) {
      console.error('초기 데이터 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 병원 검색
  const searchHospitals = async () => {
    try {
      const searchParams = {
        location: searchLocation || undefined,
        specialties: selectedFilters.length > 0 ? selectedFilters : undefined,
        latitude: userLocation?.lat,
        longitude: userLocation?.lng,
        radius: 10,
        sortBy: 'distance' as const,
        limit: 20
      };

      const response = await hospitalService.searchHospitals(searchParams);
      setHospitals(response.hospitals);
    } catch (error) {
      console.error('병원 검색 오류:', error);
    }
  };

  // 필터 토글
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };

  // 필터 초기화
  const clearFilters = () => {
    setSelectedFilters([]);
    setSearchLocation('');
  };

  // 북마크 토글
  const handleBookmark = async (hospitalId: number) => {
    try {
      const result = await hospitalService.toggleBookmark(hospitalId);
      
      if (result.isBookmarked) {
        setBookmarkedHospitals(prev => [...prev, hospitalId]);
      } else {
        setBookmarkedHospitals(prev => prev.filter(id => id !== hospitalId));
      }
    } catch (error) {
      console.error('북마크 토글 오류:', error);
      setBookmarkedHospitals(prev => 
        prev.includes(hospitalId) 
          ? prev.filter(id => id !== hospitalId) 
          : [...prev, hospitalId]
      );
    }
  };

  // 전화 걸기
  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  // 길찾기 - 네이버 지도로 변경
  const handleNavigate = (address: string) => {
    const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(address)}`;
    window.open(naverMapUrl, '_blank');
  };

  // 병원 선택 (지도에서 마커 클릭 시)
  const handleHospitalSelect = (hospital: Hospital) => {
    setSelectedHospital(hospital);
    const element = document.getElementById(`hospital-${hospital.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // 현재 위치로 지도 이동
  const moveToCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);
    } catch (error) {
      console.error('현재 위치를 가져올 수 없습니다:', error);
    }
  };

  // 필터링된 병원 목록
  const filteredHospitals = hospitals.filter(hospital => {
    if (searchLocation) {
      const searchLower = searchLocation.toLowerCase();
      const matchesSearch = 
        hospital.name.toLowerCase().includes(searchLower) ||
        hospital.address.toLowerCase().includes(searchLower) ||
        hospital.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }

    return true;
  });

  const hospitalsWithBookmarks = filteredHospitals.map(hospital => ({
    ...hospital,
    isBookmarked: bookmarkedHospitals.includes(hospital.id)
  }));

  const resultCount = hospitalsWithBookmarks.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-glass flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">병원 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-glass">
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
      <CollapsibleSearchFilters 
        searchLocation={searchLocation} 
        setSearchLocation={setSearchLocation} 
        selectedFilters={selectedFilters} 
        onToggleFilter={toggleFilter} 
        onClearFilters={clearFilters} 
      />

      {/* 결과 헤더 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">
              검색 결과 <span className="text-primary">{resultCount}개</span>
            </h2>
            {selectedFilters.length > 0 && (
              <Badge variant="secondary" className="bg-primary-soft text-primary">
                {selectedFilters.length}개 필터 적용중
              </Badge>
            )}
            {userLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={moveToCurrentLocation}
                className="text-xs"
              >
                <MapPin className="w-3 h-3 mr-1" />
                현재 위치
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 실제 지도 영역 */}
          <div className="lg:sticky lg:top-32 h-[600px]">
            <HospitalMap
              hospitals={hospitalsWithBookmarks}
              center={userLocation || { lat: 37.5665, lng: 126.9780 }}
              onHospitalSelect={handleHospitalSelect}
            />
          </div>

          {/* 병원 리스트 */}
          <div className="space-y-4">
            {resultCount === 0 ? (
              <Card className="glass-card">
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
              </Card>
            ) : (
              <div className={`space-y-4 ${viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : ''}`}>
                {hospitalsWithBookmarks.map(hospital => (
                  <div
                    key={hospital.id}
                    id={`hospital-${hospital.id}`}
                    className={`transition-all duration-300 ${
                      selectedHospital?.id === hospital.id 
                        ? 'ring-2 ring-primary ring-offset-2' 
                        : ''
                    }`}
                  >
                    <HospitalCard 
                      hospital={hospital} 
                      onBookmark={handleBookmark} 
                      onCall={handleCall} 
                      onNavigate={handleNavigate} 
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalSearch;
