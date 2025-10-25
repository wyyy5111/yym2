import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-header">
          <span className="welcome-icon">🏝️</span>
          <h1 className="welcome-title">心晴屿</h1>
          <p className="welcome-subtitle">您的心灵避风港</p>
        </div>
        
        <div className="welcome-message">
          <p>欢迎来到心晴屿，这里是您的心理健康监测与调节平台。</p>
          <p>通过我们的服务，您可以记录情绪、分析心理状态、获得个性化的心理干预建议。</p>
        </div>
        
        <div className="welcome-features">
          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <p>情绪监测</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎵</div>
            <p>音乐疗愈</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🧠</div>
            <p>脑机接口</p>
          </div>
        </div>
        
        <div className="welcome-actions">
          <Link to="/login" className="btn btn-primary">登录</Link>
          <Link to="/register" className="btn btn-secondary">注册</Link>
        </div>
        
        <div className="welcome-footer">
          <p>开始您的心理健康之旅</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
