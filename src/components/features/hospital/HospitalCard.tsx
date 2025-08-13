import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Navigation, Clock, Heart } from 'lucide-react';
import { Hospital } from '@/services/hospitalService';

interface HospitalCardProps {
  hospital: Hospital;
  onBookmark?: (id: number) => void;
  onCall?: (phone: string) => void;
  onNavigate?: (address: string) => void;
}

const HospitalCard = ({ hospital, onBookmark, onCall, onNavigate }: HospitalCardProps) => {
  return (
    <Card className="glass-card hover:shadow-xl transition-all duration-300 group">
      <CardContent className="p-4 md:p-6">
        <div className="flex gap-3 md:gap-4">
          {/* 병원 이미지 - 모바일에서는 숨김 */}
          <div className="hidden md:flex w-24 h-24 rounded-2xl bg-gradient-glow flex-shrink-0 items-center justify-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-xl bg-white/50 flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
            {hospital.isBookmarked && (
              <div className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white fill-white" />
              </div>
            )}
          </div>

          {/* 병원 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {hospital.name}
              </h3>
              <div className="flex gap-1">
                {/* 모바일에서는 예약 가능 배지 숨김 */}
                {hospital.availableToday && (
                  <Badge className="hidden md:inline-flex bg-green-100 text-green-700 border-green-200 text-xs">
                    오늘 예약 가능
                  </Badge>
                )}
                {/* 모바일에서는 북마크 버튼 숨김 */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex p-1 h-6 w-6"
                  onClick={() => onBookmark?.(hospital.id)}
                >
                  <Heart className={`w-4 h-4 ${hospital.isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                </Button>
              </div>
            </div>

            {/* 평점, 거리, 운영시간 - 모바일에서는 숨김 */}
            <div className="hidden md:flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{hospital.rating}</span>
                {hospital.reviewCount && (
                  <span className="text-xs text-muted-foreground">({hospital.reviewCount})</span>
                )}
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Navigation className="w-4 h-4" />
                <span className="text-sm">{hospital.distance}</span>
              </div>
              {hospital.openHours && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{hospital.openHours}</span>
                </div>
              )}
            </div>

            {/* 설명 - 모바일에서는 숨김 */}
            <p className="hidden md:block text-sm text-muted-foreground mb-3">{hospital.description}</p>

            {/* 전문분야 - 모바일에서는 숨김 */}
            <div className="hidden md:flex flex-wrap gap-1 mb-3">
              {hospital.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="text-xs bg-primary-soft/30 text-primary border-primary-soft">
                  {specialty}
                </Badge>
              ))}
            </div>

            {/* 주소 */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3 md:mb-4">
              <span className="text-xs">📍</span>
              <span className="truncate">{hospital.address}</span>
            </div>

            {/* 버튼들 */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => onNavigate?.(hospital.address)}
              >
                <Navigation className="w-4 h-4 mr-1 md:mr-2" />
                <span className="text-sm md:text-base">길찾기</span>
              </Button>
              <Button 
                className="flex-1 btn-k-beauty"
                onClick={() => onCall?.(hospital.phone)}
              >
                <Phone className="w-4 h-4 mr-1 md:mr-2" />
                <span className="text-sm md:text-base">예약문의</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
