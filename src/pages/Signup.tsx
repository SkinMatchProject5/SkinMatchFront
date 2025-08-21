import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';
import { authService } from '@/services/authService';
import { toast } from 'sonner';
import SocialLogin from '@/components/auth/SocialLogin';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && 
           /[A-Za-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
    } else if (formData.username.length < 3) {
      newErrors.username = '아이디는 3자 이상이어야 합니다';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상, 영문+숫자 조합이어야 합니다';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = '주소를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      
      try {
        const response = await authService.signup(formData);
        if (response.success) {
          toast.success('회원가입이 완료되었습니다!');
          navigate('/login');
        } else {
          toast.error(response.message || '회원가입에 실패했습니다.');
        }
      } catch (error: any) {
        console.error('회원가입 실패:', error);
        
        const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message || 
                            '회원가입에 실패했습니다.';
        
        toast.error(errorMessage);
        
        if (errorMessage.includes('이미 사용중인 이메일')) {
          setErrors(prev => ({ ...prev, email: '이미 사용중인 이메일입니다.' }));
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getPasswordStrength = () => {
    if (!formData.password) return { score: 0, text: '', color: '' };
    
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[a-z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    
    if (score <= 2) return { score, text: '약함', color: 'text-black' };
    if (score <= 3) return { score, text: '보통', color: 'text-black' };
    return { score, text: '강함', color: 'text-black' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 pt-24">
      <div className="w-full max-w-md">

        <Card className="bg-white border border-black">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-black">회원가입</CardTitle>
            <p className="text-black">새 계정을 만들어 서비스를 시작하세요</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* 아이디 */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-black">아이디</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="아이디를 입력하세요"
                    className={`bg-white text-black border ${errors.username ? 'border-black' : 'border-black'}`}
                  />
                  {errors.username && (
                    <p className="text-sm text-black">{errors.username}</p>
                  )}
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black">이메일</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력하세요"
                    className={`bg-white text-black border ${errors.email ? 'border-black' : 'border-black'}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-black">{errors.email}</p>
                  )}
                </div>

                {/* 비밀번호 */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black">비밀번호</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 입력하세요"
                      className={`bg-white text-black border pr-10 ${errors.password ? 'border-black' : 'border-black'}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-black"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-black rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-black transition-all duration-300"
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-sm ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-sm text-black">{errors.password}</p>
                  )}
                </div>

                {/* 비밀번호 확인 */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black">비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="비밀번호를 다시 입력하세요"
                      className={`bg-white text-black border pr-10 ${errors.confirmPassword ? 'border-black' : 'border-black'}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 text-black"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password && (
                    <div className="flex items-center gap-2">
                      {formData.password === formData.confirmPassword ? (
                        <Check className="w-4 h-4 text-black" />
                      ) : (
                        <X className="w-4 h-4 text-black" />
                      )}
                      <span className="text-sm text-black">
                        {formData.password === formData.confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                      </span>
                    </div>
                  )}
                  {errors.confirmPassword && (
                    <p className="text-sm text-black">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* 주소 */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-black">주소</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="주소를 입력하세요"
                    className={`bg-white text-black border ${errors.address ? 'border-black' : 'border-black'}`}
                  />
                  {errors.address && (
                    <p className="text-sm text-black">{errors.address}</p>
                  )}
                </div>
              </div>

            <Button
  type="submit"
  size="lg"
  className="w-full bg-black text-white font-sans relative flex items-center justify-center gap-2 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group overflow-hidden
  hover:bg-white hover:text-black border-2 border-transparent hover:border-black
  before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:skew-x-12 hover:before:translate-x-[100%] before:transition-transform before:duration-700"
  disabled={isLoading}
>
  {isLoading ? '회원가입 중...' : '회원가입'}
</Button>

            </form>

            {/* 소셜 로그인 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-black"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-black">또는</span>
                </div>
              </div>
              
              <SocialLogin isSignup />
            </div>

            <div className="mt-6 text-center">
              <p className="text-black">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-black underline font-medium">
                  로그인
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
