import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isDarkPage = ['/camera', '/analysis', '/profile', '/login', '/signup'].includes(location.pathname);
  const textColor = isDarkPage ? 'text-black' : 'text-white/80';
  const hoverColor = isDarkPage ? 'hover:text-black/80' : 'hover:text-white';
  
  // 메인페이지(/)가 아닐 때만 반투명 배경 적용
  const isMainPage = location.pathname === '/';
  const headerBackground = isMainPage ? '' : 'bg-white/80 backdrop-blur-sm shadow-sm';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 로그아웃 실패해도 홈으로 이동
      navigate('/', { replace: true });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${headerBackground}`}>
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-5 items-center py-4 text-sm ${textColor}`}>
          <Link to="/" className={`text-center ${hoverColor} transition-colors`}>
            Home
          </Link>
          <Link to="/camera" className={`text-center ${hoverColor} transition-colors`}>
          Analysis
          </Link>
          <Link to="/analysis" className={`text-center ${hoverColor} transition-colors`}>
            Results
          </Link>
          <Link to="/profile" className={`text-center ${hoverColor} transition-colors`}>
            My Page
          </Link>
          {isAuthenticated ? (
            <button 
              onClick={handleLogout} 
              className={`text-center ${hoverColor} transition-colors`}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={`text-center ${hoverColor} transition-colors`}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
