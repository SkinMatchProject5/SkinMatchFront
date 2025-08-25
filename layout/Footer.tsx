import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Analysis', path: '/analysis' },
    { label: 'Results', path: '/results' },
    { label: 'My Page', path: '/mypage' },
    { label: 'Login', path: '/login' },
  ];

  const teamMembers = [
    { name: '고경복', email: 'gbk08@naver.com' },
    { name: '김민경', email: 'dorian.kim.dev@gmail.com' },
    { name: '손석우', email: 'son90234@gmail.com' },
    { name: '이민지', email: 'lminjiiiii@gmail.com' },
    { name: '조성민', email: 'tjdals7071@gmail.com' },
  ];

  return (
    <footer className="bg-white text-black py-12 mt-auto border-t border-gray-300">
      <div className="container mx-auto px-6">
        {/* 반응형 레이아웃: 모바일=세로, md 이상=4단 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-start">
          {/* Logo */}
          <div className="flex md:block justify-center md:justify-start">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              SkinMatch
            </h1>
          </div>

          {/* Navigation - 오른쪽으로 이동 */}
          <div className="flex md:block justify-center md:justify-start md:ml-24">
            <div>
              <h3 className="text-sm font-bold mb-4">(NAVIGATION)</h3>
              <ul className="space-y-3 text-center md:text-left">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-2xl font-bold hover:opacity-70 transition"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* About - 조금 오른쪽으로 이동 */}
          <div className="text-center md:text-left md:ml-12">
            <h3 className="text-sm font-bold mb-4">(ABOUT)</h3>
            <p className="text-sm leading-relaxed whitespace-pre-line">
SkinMatch는 인공지능 기반 피부 분석을 통해,
당신의 피부 상태를 이해하고 그에 맞는 병원과 의료 서비스를 제안합니다.
단순한 진단을 넘어, 더 나은 피부 건강을 위한
첫걸음을 함께하는 동반자가 되어드립니다.
            </p>
          </div>

          {/* Info - 이름만 보이고, 호버 시 이메일 나타나게 */}
          <div className="text-left md:ml-36">
            <h3 className="text-sm font-bold mb-4">(INFO)</h3>
            <div className="space-y-3">
              {teamMembers.map((member, index) => (
                <div key={index} className="text-sm group">
                  <p className="font-medium cursor-pointer">{member.name}</p>
                  <a
                    href={`mailto:${member.email}`}
                    className="text-gray-600 hover:underline text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 block"
                  >
                    {member.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 */}
        <div className="border-t border-gray-300 pt-6 mt-6">
          <p className="text-center text-gray-500 text-sm">
            © 2025 SkinMatch. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
