import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Camera, LogOut, Save, User } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();
  const [profileData, setProfileData] = useState({
    nickname: '',
    name: '',
    gender: 'male',
    birthYear: '1990',
    email: '',
    nationality: 'korean',
    profileImage: null as File | null
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [profileImagePreview, setProfileImagePreview] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
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
      reader.onload = () => setProfileImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!profileData.nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요';
    if (!profileData.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (!profileData.birthYear) newErrors.birthYear = '출생년도를 선택해주세요';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    toast.success('프로필이 저장되었습니다. (개발 모드)');
  };

  const handleLogout = async () => {
    toast.success('로그아웃되었습니다. (개발 모드)');
    navigate('/');
  };

  useEffect(() => {
    // 개발/테스트 모드 더미 데이터
    setProfileData({
      nickname: '테스트 사용자',
      name: '테스트 사용자',
      gender: 'male',
      birthYear: '1990',
      email: 'test@example.com',
      nationality: 'korean',
      profileImage: null,
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-white">
      <Section spacing="default">
        <Container size="sm" className="max-w-md">
          {/* Header */}
          <div className="mb-8 text-center space-y-2">
            <Typography variant="h3" className="text-black">프로필</Typography>
            <Typography variant="body" className="text-gray-600">개인정보를 관리하세요</Typography>
          </div>

          {/* Profile Image */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-4 border-gray-300">
                {profileImagePreview ? (
                  <img src={profileImagePreview} alt="프로필" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 bg-black text-white hover:bg-gray-800"
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
                  className={errors.nickname ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                />
                {errors.nickname && <Typography variant="caption" className="text-red-600">{errors.nickname}</Typography>}
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
                  className={errors.name ? 'border-red-500' : 'border-gray-300 focus:border-black'}
                />
                {errors.name && <Typography variant="caption" className="text-red-600">{errors.name}</Typography>}
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
                      <SelectItem key={year} value={year.toString()}>{year}년</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.birthYear && <Typography variant="caption" className="text-red-600">{errors.birthYear}</Typography>}
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
                  className="bg-gray-100 border-gray-300"
                />
                <Typography variant="caption" className="text-gray-600">이메일은 변경할 수 없습니다</Typography>
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
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSave}
                size="lg"
                className="w-full h-12 text-lg bg-black text-white font-sans border-2 border-transparent hover:bg-white hover:text-black hover:border-black
                relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <Save className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">저장하기</span>
              </Button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="lg"
                className="w-full h-12 text-lg font-sans bg-white border-2 border-black text-black relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden
                hover:bg-black hover:text-white hover:border-black
                before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
              >
                <LogOut className="w-5 h-5 mr-2 relative z-10" />
                <span className="relative z-10">로그아웃</span>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Profile;
