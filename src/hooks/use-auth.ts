// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';

interface User {
    id: string;
    email: string;
    name: string;
    nickname?: string;
    profileImage?: string;
    gender?: string;
    birthYear?: string;
    nationality?: string;
    allergies?: string;
    surgicalHistory?: string;
    provider?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // 초기 인증 상태 체크
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = localStorage.getItem('userInfo');

            if (!accessToken) {
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                });
                return;
            }

            // 로컬 스토리지에서 사용자 정보가 있으면 먼저 설정
            if (userInfo) {
                const parsedUser = JSON.parse(userInfo);
                setAuthState({
                    user: parsedUser,
                    isLoading: false,
                    isAuthenticated: true,
                });
            }

            // 백엔드에서 최신 사용자 정보 가져오기 (토큰 유효성도 함께 검증)
            try {
                const response = await authService.getCurrentUser();
                if (response.success) {
                    const userData = response.data;
                    const user: User = {
                        id: userData.id?.toString() || '',
                        email: userData.email || '',
                        name: userData.name || '',
                        nickname: userData.nickname,
                        profileImage: userData.profileImage,
                        gender: userData.gender,
                        birthYear: userData.birthYear,
                        nationality: userData.nationality,
                        allergies: userData.allergies,
                        surgicalHistory: userData.surgicalHistory,
                        provider: userData.provider,
                        role: userData.role,
                    };

                    setAuthState({
                        user,
                        isLoading: false,
                        isAuthenticated: true,
                    });

                    // 최신 정보로 localStorage 업데이트
                    localStorage.setItem('userInfo', JSON.stringify(user));
                }
            } catch (error) {
                console.warn('Failed to fetch current user, using local data:', error);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            // 토큰이 유효하지 않은 경우 로그아웃 처리
            logout();
        }
    };

    const login = (user: User, accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(user));

        setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
        });
    };

    const logout = async (): Promise<void> => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // API 실패와 관계없이 로컬 데이터는 정리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userId');

            setAuthState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
        }
    };

    const refreshAuthState = (): void => {
        checkAuthStatus();
    };

    return {
        user: authState.user,
        isLoading: authState.isLoading,
        isAuthenticated: authState.isAuthenticated,
        login,
        logout,
        refreshAuthState,
    };
};
