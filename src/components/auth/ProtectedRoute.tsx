// src/components/auth/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { Container, Section } from '@/components/ui/theme-container';
import { Typography } from '@/components/ui/theme-typography';
import { User } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  // 로딩 중일 때 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Section spacing="default">
          <Container size="sm" className="max-w-md text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-muted-foreground animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <Typography variant="h3">로딩 중...</Typography>
                <Typography variant="body" className="text-muted-foreground">
                  인증 상태를 확인하고 있습니다
                </Typography>
              </div>
              
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </Container>
        </Section>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;