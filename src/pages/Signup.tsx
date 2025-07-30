import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Eye, EyeOff, ArrowLeft, Check, X } from 'lucide-react';
import SocialLogin from '@/components/auth/SocialLogin';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    // Clear error when user starts typing
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement signup logic with axios
      console.log('Signup attempt:', formData);
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
    
    if (score <= 2) return { score, text: '약함', color: 'text-destructive' };
    if (score <= 3) return { score, text: '보통', color: 'text-yellow-500' };
    return { score, text: '강함', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength();

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
              <Typography variant="h3">회원가입</Typography>
              <Typography variant="body" className="text-muted-foreground">
                새 계정을 만들어 서비스를 시작하세요
              </Typography>
            </div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">아이디</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="아이디를 입력하세요"
                  className={errors.username ? 'border-destructive' : ''}
                />
                {errors.username && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.username}
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="이메일을 입력하세요"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.email}
                  </Typography>
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
                    className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
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
                {formData.password && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.score <= 2 ? 'bg-destructive' :
                          passwordStrength.score <= 3 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <Typography variant="caption" className={passwordStrength.color}>
                      {passwordStrength.text}
                    </Typography>
                  </div>
                )}
                {errors.password && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.password}
                  </Typography>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력하세요"
                    className={errors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {formData.confirmPassword && formData.password && (
                  <div className="flex items-center gap-2">
                    {formData.password === formData.confirmPassword ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-destructive" />
                    )}
                    <Typography variant="caption" className={
                      formData.password === formData.confirmPassword ? 'text-green-500' : 'text-destructive'
                    }>
                      {formData.password === formData.confirmPassword ? '비밀번호가 일치합니다' : '비밀번호가 일치하지 않습니다'}
                    </Typography>
                  </div>
                )}
                {errors.confirmPassword && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.confirmPassword}
                  </Typography>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="주소를 입력하세요"
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.address}
                  </Typography>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full">
              회원가입
            </Button>
          </form>

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">또는</span>
              </div>
            </div>
            
            <SocialLogin isSignup />
          </div>

          {/* Login link */}
          <div className="mt-8 text-center">
            <Typography variant="body" className="text-muted-foreground">
              이미 계정이 있으신가요?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                로그인
              </Link>
            </Typography>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Signup;