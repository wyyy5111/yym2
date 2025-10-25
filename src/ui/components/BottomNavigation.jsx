import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BottomNavigation.css';

const BottomNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // 判断当前激活的板块 - 更新为匹配Navigation中的路径
  const getActiveSection = () => {
    if (currentPath === '/journal') return 'home'; // 情绪日志
    if (['/record', '/real-time-monitoring', '/history-records'].includes(currentPath)) return 'record';
    if (['/analysis', '/emotion-analysis', '/attention-analysis', '/brain-computer-interface', '/professional-report'].includes(currentPath)) return 'analysis';
    if (['/therapy', '/emotion-music', '/emotion-cloud', '/mind-symphony', '/perceptual-therapy'].includes(currentPath)) return 'therapy';
    if (['/my-profile', '/profile'].includes(currentPath)) return 'mine';
    return '';
  };

  const activeSection = getActiveSection();

  return (
    <nav className="bottom-navigation">
      <Link to="/journal" className={`nav-item ${activeSection === 'home' ? 'active' : ''}`}>
        <div className="nav-icon">📝</div>
        <span className="nav-text">日志</span>
      </Link>
      
      <Link to="/record" className={`nav-item ${activeSection === 'record' ? 'active' : ''}`}>
        <div className="nav-icon">📊</div>
        <span className="nav-text">记录</span>
      </Link>
      
      <Link to="/analysis" className={`nav-item ${activeSection === 'analysis' ? 'active' : ''}`}>
        <div className="nav-icon">📊</div>
        <span className="nav-text">分析</span>
      </Link>
      
      <Link to="/therapy" className={`nav-item ${activeSection === 'therapy' ? 'active' : ''}`}>
        <div className="nav-icon">🎵</div>
        <span className="nav-text">调节</span>
      </Link>
      
      <Link to="/my-profile" className={`nav-item ${activeSection === 'mine' ? 'active' : ''}`}>
        <div className="nav-icon">👤</div>
        <span className="nav-text">我的</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;