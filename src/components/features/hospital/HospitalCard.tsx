import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Phone, Navigation, Clock, Heart } from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  image: string;
  rating: number;
  distance: string;
  specialties: string[];
  address: string;
  phone: string;
  description: string;
  availableToday: boolean;
  openHours?: string;
  reviewCount?: number;
  isBookmarked?: boolean;
}

interface HospitalCardProps {
  hospital: Hospital;
  onBookmark?: (id: number) => void;
  onCall?: (phone: string) => void;
  onNavigate?: (address: string) => void;
}

const HospitalCard = ({ hospital, onBookmark, onCall, onNavigate }: HospitalCardProps) => {
  return (
    <Card className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 병원 이미지 */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-glow flex-shrink-0 flex items-center justify-center relative overflow-hidden">
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
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex-1 min-w-0">
                  {hospital.name}
                </h3>
                <div className="flex gap-1 items-center flex-wrap">
                  {hospital.availableToday && (
                    <Badge className="bg-green-100 text-green-700 border-green-200 text-xs whitespace-nowrap">
                      오늘 예약 가능
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-6 w-6"
                    onClick={() => onBookmark?.(hospital.id)}
                    aria-label={hospital.isBookmarked ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        hospital.isBookmarked ? 'text-red-500 fill-red-500' : 'text-gray-400'
                      }`}
                    />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{hospital.rating}</span>
                  {hospital.reviewCount && (
                    <span className="text-xs">({hospital.reviewCount})</span>
                  )}
                </div>
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <Navigation className="w-4 h-4" />
                  <span>{hospital.distance}</span>
                </div>
                {hospital.openHours && (
                  <div className="flex items-center gap-1 whitespace-nowrap">
                    <Clock className="w-4 h-4" />
                    <span>{hospital.openHours}</span>
                  </div>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-3 break-words">
                {hospital.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {hospital.specialties.map((specialty) => (
                  <Badge
                    key={specialty}
                    variant="secondary"
                    className="text-xs bg-primary-soft/30 text-primary border-primary-soft whitespace-nowrap"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4 whitespace-pre-wrap break-words">
                <span className="text-xs">📍</span>
                <span>{hospital.address}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
                onClick={() => onNavigate?.(hospital.address)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                길찾기
              </Button>
              <Button
                className="flex-1 btn-k-beauty"
                onClick={() => onCall?.(hospital.phone)}
              >
                <Phone className="w-4 h-4 mr-2" />
                예약문의
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
