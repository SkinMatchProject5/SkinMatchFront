import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, X } from 'lucide-react';

interface SearchFiltersProps {
  searchLocation: string;
  setSearchLocation: (value: string) => void;
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
}

const SearchFilters = ({ 
  searchLocation, 
  setSearchLocation, 
  selectedFilters, 
  onToggleFilter,
  onClearFilters 
}: SearchFiltersProps) => {
  const filterCategories = {
    specialty: {
      title: '전문분야',
      options: ['피부과', '성형외과', '피부미용과', '한의원', '재활의학과']
    },
    distance: {
      title: '거리',
      options: ['1km 이내', '3km 이내', '5km 이내', '10km 이내']
    },
    rating: {
      title: '평점',
      options: ['평점 4.8+', '평점 4.5+', '평점 4.0+']
    },
    availability: {
      title: '이용가능',
      options: ['예약 가능', '야간 진료', '주말 진료', '당일 예약']
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-white/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* 검색바 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="지역, 병원명을 검색하세요 (예: 강남구, 서울대병원)"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="pl-10 pr-10 h-12 rounded-2xl border-2 border-primary-soft/50 focus:border-primary transition-colors bg-white/80"
          />
        </div>

        {/* 필터 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">필터</span>
            {selectedFilters.length > 0 && (
              <Badge variant="secondary" className="bg-primary text-white">
                {selectedFilters.length}개 선택
              </Badge>
            )}
          </div>
          {selectedFilters.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-primary"
            >
              <X className="w-4 h-4 mr-1" />
              전체 해제
            </Button>
          )}
        </div>

        {/* 필터 카테고리별 옵션 */}
        <div className="space-y-3">
          {Object.entries(filterCategories).map(([key, category]) => (
            <div key={key}>
              <h3 className="text-sm font-medium text-foreground mb-2">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => (
                  <Badge
                    key={option}
                    variant={selectedFilters.includes(option) ? "default" : "outline"}
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedFilters.includes(option)
                        ? 'bg-primary text-white hover:bg-primary/90 shadow-md'
                        : 'border-primary-soft text-primary hover:bg-primary-soft/20 hover:border-primary'
                    }`}
                    onClick={() => onToggleFilter(option)}
                  >
                    {option}
                    {selectedFilters.includes(option) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 선택된 필터 요약 */}
        {selectedFilters.length > 0 && (
          <div className="pt-2 border-t border-primary-soft/30">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">선택된 필터:</span>
              {selectedFilters.map((filter) => (
                <Badge
                  key={filter}
                  className="bg-primary-soft/20 text-primary border-primary-soft cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  onClick={() => onToggleFilter(filter)}
                >
                  {filter}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilters;