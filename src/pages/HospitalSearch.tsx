import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SearchFilters from '@/components/features/hospital/SearchFilters';
import HospitalCard from '@/components/features/hospital/HospitalCard';
import { MapPin, SlidersHorizontal, List, Grid3X3 } from 'lucide-react';

const HospitalSearch = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [bookmarkedHospitals, setBookmarkedHospitals] = useState<number[]>([]);

  const hospitals = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    }
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  const handleBookmark = (hospitalId: number) => {
    setBookmarkedHospitals(prev => 
      prev.includes(hospitalId)
        ? prev.filter(id => id !== hospitalId)
        : [...prev, hospitalId]
    );
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
      <SearchFilters
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
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-9 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-9 px-3"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 지도 영역 */}
          <div className="lg:sticky lg:top-32 h-[600px]">
            <Card className="h-full glass-card overflow-hidden">
              <CardContent className="p-0 h-full relative">
                <div className="h-full bg-gradient-to-br from-primary-soft/20 to-primary-glow/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
                    <p className="text-lg font-medium text-primary mb-2">
                      지도 영역
                    </p>
                    <p className="text-sm text-muted-foreground">
                      병원 위치가 여기에 표시됩니다
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
              hospitalsWithBookmarks.map((hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  onBookmark={handleBookmark}
                  onCall={handleCall}
                  onNavigate={handleNavigate}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalSearch;