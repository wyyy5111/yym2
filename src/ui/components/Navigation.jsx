import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // 导航菜单项配置
  const menuItems = [
    {section: 'home',
      label: '心晴首页',
      icon: '🏝️',
      items: [
        { path: '/', label: '心情日志', icon: '📝' }
      ]
    },
    {
      section: 'records',
      label: '心晴记录',
      icon: '📊',
      items: [
        { path: '/real-time-monitoring', label: '实时心情', icon: '⚡' },
        { path: '/history-records', label: '心情轨迹', icon: '📋' }
      ]
    },
    {
      section: 'analysis',
      label: '心晴探索',
      icon: '🔍',
      items: [
        { path: '/emotion-analysis', label: '情绪解读', icon: '😊' },
        { path: '/attention-analysis', label: '专注力分析', icon: '🎯' },
        { path: '/brain-computer-interface', label: '脑波探索', icon: '🧠' },
        { path: '/professional-report', label: '心晴报告', icon: '📑' }
      ]
    },
    {
      section: 'regulation',
      label: '心晴港湾',
      icon: '🎵',
      items: [
        { path: '/emotion-music', label: '心灵旋律', icon: '🎧' },
        { path: '/emotion-cloud', label: '情绪云朵', icon: '☁️' },
        { path: '/mind-symphony', label: '脑波交响', icon: '🎼' },
        { path: '/perceptual-therapy', label: '感知疗愈', icon: '🎯' }
      ]
    },
    {
      section: 'profile',
      label: '我的心晴',
      icon: '👤',
      items: [
        { path: '/my-profile', label: '个人中心', icon: '👨‍👩‍👧‍👦' },
        { path: '/profile', label: '心晴设置', icon: '⚙️' }
      ]
    }
  ];

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navigation">
      {/* 顶部导航栏 */}
      <div className="nav-header">
        {/* 应用品牌 */}
        <div className="app-brand">
          <span className="brand-icon">🏝️</span>
          <h1 className="brand-title">心晴屿</h1>
          <p className="brand-subtitle">您的心灵避风港</p>
        </div>
        
        {/* 主导航链接 - 仅显示主要功能 */}
        <div className="main-nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">📝</span>
            <span>日志</span>
          </NavLink>
          <NavLink 
            to="/emotion-cloud" 
            className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">☁️</span>
            <span>情绪云</span>
          </NavLink>
          <NavLink 
            to="/emotion-music" 
            className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🎵</span>
            <span>音乐</span>
          </NavLink>
          <NavLink 
            to="/brain-computer-interface" 
            className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">🧠</span>
            <span>脑机接口</span>
          </NavLink>
          <NavLink 
            to="/my-profile" 
            className={({ isActive }) => `main-nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">👤</span>
            <span>我的</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;