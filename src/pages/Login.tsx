import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SocialLogin from '@/components/auth/SocialLogin';

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      console.log('로그인 요청 데이터:', formData); // 디버깅용
      
      try {
        const response = await authService.login(formData);
        console.log('로그인 성공 응답:', response); // 디버깅용
        
        if (response.success) {
          // 로그인 성공 시 토큰 저장 및 사용자 정보 업데이트
          const { accessToken, refreshToken, user } = response.data;
          
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userId', user.id.toString());
          localStorage.setItem('userInfo', JSON.stringify(user));
          
          // AuthContext의 로그인 함수 호출
          authLogin(user, accessToken, refreshToken);
          
          toast.success(`${user.name}님, 환영합니다!`);
          navigate('/');
        } else {
          toast.error(response.message || '로그인에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('로그인 실패:', error);
        console.error('에러 응답 상세:', error.response?.data); // 상세 에러 정보
        
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            '로그인에 실패했습니다.';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">돌아가기</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">로그인</CardTitle>
            <p className="text-gray-600">계정에 로그인하여 서비스를 이용하세요</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 입력하세요"
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">또는</span>
                </div>
              </div>
              
              <SocialLogin />
            </div>

            {/* Sign up link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                계정이 없으신가요?{' '}
                <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                  회원가입
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
