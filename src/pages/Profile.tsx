import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { ArrowLeft, Camera, LogOut, Save, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuthContext();
  const [profileData, setProfileData] = useState({
    nickname: '',
    name: '',
    gender: 'male',
    birthYear: '1990',
    email: '',
    nationality: 'korean',
    allergies: '',
    surgicalHistory: '',
    profileImage: null as File | null
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileData(prev => ({ ...prev, profileImage: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profileData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요';
    }
    
    if (!profileData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    
    if (!profileData.birthYear) {
      newErrors.birthYear = '출생년도를 선택해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    (async () => {
      try {
        const res = await authService.updateProfile({
          name: profileData.name,
          nickname: profileData.nickname,
          profileImage: undefined,
          gender: profileData.gender,
          birthYear: profileData.birthYear,
          nationality: profileData.nationality,
          allergies: profileData.allergies,
          surgicalHistory: profileData.surgicalHistory,
        });
        if (res.success) {
          toast.success('프로필이 저장되었습니다.');
        } else {
          toast.error(res.message || '프로필 저장에 실패했습니다.');
        }
      } catch (e: any) {
        toast.error(e.response?.data?.message || '프로필 저장 중 오류가 발생했습니다.');
      }
    })();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // 로그인 여부 확인 중 로딩 표시
  if (isLoading) {
    return null;
  }

  // 비로그인 접근 차단
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Section spacing="default">
          <Container size="sm" className="max-w-md text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <Typography variant="h3">로그인이 필요합니다</Typography>
                <Typography variant="body" className="text-muted-foreground">
                  프로필을 확인하려면 먼저 로그인해주세요
                </Typography>
              </div>
              
              <div className="space-y-3">
                <Link to="/login" className="block">
                  <Button size="lg" className="w-full">
                    로그인
                  </Button>
                </Link>
                <Link to="/signup" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    회원가입
                  </Button>
                </Link>
              </div>
              
              <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <Typography variant="bodySmall">홈으로 돌아가기</Typography>
              </Link>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  // 사용자 정보 불러오기
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const res = await authService.getCurrentUser();
        if (res.success && res.data) {
          const d = res.data;
          setProfileData({
            nickname: d.nickname || user.name || '',
            name: d.name || user.name || '',
            gender: d.gender || 'male',
            birthYear: d.birthYear || '1990',
            email: d.email || user.email || '',
            nationality: d.nationality || 'korean',
            allergies: d.allergies || '',
            surgicalHistory: d.surgicalHistory || '',
            profileImage: null,
          });
        }
      } catch (e) {
        toast.error('프로필 정보를 불러오지 못했습니다.');
      }
    };
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Section spacing="default">
        <Container size="sm" className="max-w-md">
          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" />
              <Typography variant="bodySmall">돌아가기</Typography>
            </Link>
            
            <div className="text-center space-y-2">
              <Typography variant="h3">프로필</Typography>
              <Typography variant="body" className="text-muted-foreground">
                개인정보를 관리하세요
              </Typography>
            </div>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-muted rounded-full overflow-hidden border-4 border-border">
                {profileImagePreview ? (
                  <img 
                    src={profileImagePreview} 
                    alt="프로필" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 rounded-full w-8 h-8"
                onClick={() => document.getElementById('profile-image')?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Nickname */}
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  value={profileData.nickname}
                  onChange={handleInputChange}
                  placeholder="닉네임을 입력하세요"
                  className={errors.nickname ? 'border-destructive' : ''}
                />
                {errors.nickname && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.nickname}
                  </Typography>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.name}
                  </Typography>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>성별</Label>
                <Select value={profileData.gender} onValueChange={handleSelectChange('gender')}>
                  <SelectTrigger>
                    <SelectValue placeholder="성별을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">남성</SelectItem>
                    <SelectItem value="female">여성</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Birth Year */}
              <div className="space-y-2">
                <Label>출생년도</Label>
                <Select value={profileData.birthYear} onValueChange={handleSelectChange('birthYear')}>
                  <SelectTrigger>
                    <SelectValue placeholder="출생년도를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => 2024 - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.birthYear && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.birthYear}
                  </Typography>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  disabled
                  className="bg-muted"
                />
                <Typography variant="caption" className="text-muted-foreground">
                  이메일은 변경할 수 없습니다
                </Typography>
              </div>

              {/* Nationality */}
              <div className="space-y-2">
                <Label>국적</Label>
                <Select value={profileData.nationality} onValueChange={handleSelectChange('nationality')}>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="korean">대한민국</SelectItem>
                    <SelectItem value="american">미국</SelectItem>
                    <SelectItem value="chinese">중국</SelectItem>
                    <SelectItem value="japanese">일본</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label htmlFor="allergies">알러지 정보</Label>
                <Textarea
                  id="allergies"
                  name="allergies"
                  value={profileData.allergies}
                  onChange={handleInputChange}
                  placeholder="알러지가 있다면 입력해주세요"
                  rows={3}
                />
              </div>

              {/* Surgical History */}
              <div className="space-y-2">
                <Label htmlFor="surgicalHistory">수술 경험</Label>
                <Textarea
                  id="surgicalHistory"
                  name="surgicalHistory"
                  value={profileData.surgicalHistory}
                  onChange={handleInputChange}
                  placeholder="과거 수술 경험이 있다면 입력해주세요"
                  rows={3}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleSave} size="lg" className="w-full">
                <Save className="w-4 h-4" />
                저장하기
              </Button>
              
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="lg" 
                className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Profile;