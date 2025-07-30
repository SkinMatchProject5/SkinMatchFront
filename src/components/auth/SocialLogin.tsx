import React from 'react';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/theme-typography';

interface SocialLoginProps {
  isSignup?: boolean;
}

const SocialLogin = ({ isSignup = false }: SocialLoginProps) => {
  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login with axios
    console.log(`${isSignup ? 'Signup' : 'Login'} with ${provider}`);
  };

  const socialProviders = [
    {
      name: 'Google',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      bgColor: 'bg-white hover:bg-gray-50 border-gray-200',
      textColor: 'text-gray-700'
    },
    {
      name: 'Naver',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z"/>
        </svg>
      ),
      bgColor: 'bg-[#03C75A] hover:bg-[#02B350]',
      textColor: 'text-white'
    },
    {
      name: 'Kakao',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.749 3 2.5 6.824 2.5 11.5c0 2.962 1.919 5.573 4.834 7.118-.206-.902-.389-2.287.082-3.281.427-.894 2.755-11.647 2.755-11.647s-.703.118-1.164 2.981c-.46 2.864.895 4.174 1.789 4.174.894 0 2.25-1.31 1.789-4.174-.46-2.863-1.164-2.981-1.164-2.981s2.328 10.753 2.755 11.647c.471.994.288 2.38.082 3.281C19.581 17.073 21.5 14.462 21.5 11.5 21.5 6.824 17.251 3 12 3Z"/>
        </svg>
      ),
      bgColor: 'bg-[#FEE500] hover:bg-[#FDD835]',
      textColor: 'text-gray-900'
    }
  ];

  return (
    <div className="mt-6 space-y-3">
      {socialProviders.map((provider) => (
        <Button
          key={provider.name}
          variant="outline"
          size="lg"
          className={`w-full ${provider.bgColor} ${provider.textColor} border`}
          onClick={() => handleSocialLogin(provider.name)}
        >
          <div className="flex items-center justify-center gap-3">
            {provider.icon}
            <Typography variant="body" className="font-medium">
              {provider.name}로 {isSignup ? '회원가입' : '로그인'}
            </Typography>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default SocialLogin;