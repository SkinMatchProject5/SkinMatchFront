import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/theme-typography';
import { Container, Section } from '@/components/ui/theme-container';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import SocialLogin from '@/components/auth/SocialLogin';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
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
    
    if (!formData.username.trim()) {
      newErrors.username = '아이디를 입력해주세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement login logic with axios
      console.log('Login attempt:', formData);
    }
  };

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
              <Typography variant="h3">로그인</Typography>
              <Typography variant="body" className="text-muted-foreground">
                계정에 로그인하여 서비스를 이용하세요
              </Typography>
            </div>
          </div>

          {/* Login Form */}
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
                {errors.password && (
                  <Typography variant="caption" className="text-destructive">
                    {errors.password}
                  </Typography>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full">
              로그인
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
            
            <SocialLogin />
          </div>

          {/* Sign up link */}
          <div className="mt-8 text-center">
            <Typography variant="body" className="text-muted-foreground">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                회원가입
              </Link>
            </Typography>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default Login;