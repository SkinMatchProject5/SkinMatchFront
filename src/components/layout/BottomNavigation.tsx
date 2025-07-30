import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Search, BarChart3, User, Shield } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();
  
  // TODO: Get from auth context
  const isLoggedIn = true;
  const isAdmin = false; // TODO: Check if user is admin (admin username: admin)

  const getNavItems = () => {
    const baseItems = [
      { path: '/', icon: Home, label: '홈' },
      { path: '/camera', icon: Camera, label: '분석' },
      { path: '/hospital', icon: Search, label: '병원' },
      { path: '/analysis', icon: BarChart3, label: '결과' },
    ];

    if (isAdmin) {
      return [...baseItems, { path: '/admin', icon: Shield, label: '관리자' }];
    } else {
      return [...baseItems, { path: '/profile', icon: User, label: '프로필' }];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t border-border z-50">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary bg-primary/10 scale-110' 
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
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