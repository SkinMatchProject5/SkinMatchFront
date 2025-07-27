import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Search, BarChart3, User } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/camera', icon: Camera, label: '분석' },
    { path: '/hospital', icon: Search, label: '병원' },
    { path: '/analysis', icon: BarChart3, label: '결과' },
    { path: '/profile', icon: User, label: '프로필' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-primary-soft/30 safe-area-pb z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary bg-primary-soft/20 scale-110' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary-soft/10'
              }`}
            >
              <item.icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-bounce' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;