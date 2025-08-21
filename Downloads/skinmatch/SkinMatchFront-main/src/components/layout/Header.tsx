import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuthContext();
  const location = useLocation();
  
  const isDarkPage = ['/camera', '/analysis', '/profile', '/login', '/signup'].includes(location.pathname);
  const textColor = isDarkPage ? 'text-black' : 'text-white/80';
  const hoverColor = isDarkPage ? 'hover:text-black/80' : 'hover:text-white';

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-5 items-center py-4 text-sm ${textColor}`}>
          <Link to="/" className={`text-center ${hoverColor} transition-colors`}>
            Home
          </Link>
          <Link to="/camera" className={`text-center ${hoverColor} transition-colors`}>
            Camera
          </Link>
          <Link to="/analysis" className={`text-center ${hoverColor} transition-colors`}>
            Results
          </Link>
          <Link to="/profile" className={`text-center ${hoverColor} transition-colors`}>
            My Page
          </Link>
          {isAuthenticated ? (
            <button 
              onClick={logout} 
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
