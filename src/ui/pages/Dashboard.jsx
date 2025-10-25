import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [deviceConnected, setDeviceConnected] = useState(false);
  const [recentData, setRecentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检查认证状态
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 加载用户数据
    const loadUserData = () => {
      const userData = localStorage.getItem('userInfo');
      const classification = localStorage.getItem('userClassification');
      
      if (userData || classification) {
        setUser(userData ? JSON.parse(userData) : classification ? JSON.parse(classification) : null);
      }

      // 模拟设备连接状态
      setDeviceConnected(localStorage.getItem('deviceConnected') === 'true');
      
      // 加载最近的数据（模拟）
      setTimeout(() => {
        const mockRecentData = {
          attention: Math.floor(Math.random() * 60) + 40,
          emotion: ['平静', '专注', '愉悦'][Math.floor(Math.random() * 3)],
          timestamp: new Date().toLocaleString('zh-CN')
        };
        setRecentData(mockRecentData);
        setLoading(false);
      }, 1000);
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    // 清除认证状态
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="container" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: 'white'
      }}>
        <div className="loading-container">
          <div className="loading"></div>
          <p style={{ marginTop: '16px' }}>加载中...</p>
        </div>
      </div>
    );
  }

  // 获取用户类型标签
  const getUserTypeLabel = () => {
    const userType = localStorage.getItem('userType');
    return userType === 'optimization' ? '自我优化型' : 
           userType === 'symptom-relief' ? '症状应对型' : '未知';
  };

  return (
    <div className="dashboard-container">
      {/* 顶部导航栏 */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="app-title">心晴屿</h1>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-type-badge">{getUserTypeLabel()}</span>
            <span className="device-status">
              设备: {deviceConnected ? (
                <span style={{ color: '#4caf50' }}>已连接</span>
              ) : (
                <span style={{ color: '#f44336' }}>未连接</span>
              )}
            </span>
          </div>
          <div className="header-actions">
            <Link to="/profile" className="profile-link">个人中心</Link>
            <button onClick={handleLogout} className="logout-btn">退出</button>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="dashboard-main">
        {/* 欢迎区域 */}
        <section className="welcome-section">
          <h2>欢迎回来，{user?.occupation || '用户'}</h2>
          <p>今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </section>

        {/* 情绪日志区域 */}
        <section className="emotion-journal-section">
          <h3>情绪日志</h3>
          <div className="emotion-journal-card">
            <div className="emotion-input-area">
              <textarea 
                placeholder="记录您此刻的心情..."
                className="emotion-textarea"
              />
              <div className="emotion-buttons">
                <button className="emotion-btn happy">😊 开心</button>
                <button className="emotion-btn calm">😌 平静</button>
                <button className="emotion-btn anxious">😰 焦虑</button>
                <button className="emotion-btn sad">😢 难过</button>
                <button className="emotion-btn angry">😠 愤怒</button>
              </div>
              <button className="save-journal-btn">保存日志</button>
            </div>
            
            {/* 最近情绪记录 */}
            <div className="recent-journals">
              <h4>最近记录</h4>
              <div className="journal-list">
                <div className="journal-item">
                  <div className="journal-header">
                    <span className="journal-emotion">😊</span>
                    <span className="journal-time">今天 10:30</span>
                  </div>
                  <p className="journal-content">今天完成了重要的工作，心情很好！</p>
                </div>
                <div className="journal-item">
                  <div className="journal-header">
                    <span className="journal-emotion">😌</span>
                    <span className="journal-time">今天 09:15</span>
                  </div>
                  <p className="journal-content">早上做了冥想，感觉很平静。</p>
                </div>
                <div className="journal-item">
                  <div className="journal-header">
                    <span className="journal-emotion">😰</span>
                    <span className="journal-time">昨天 18:45</span>
                  </div>
                  <p className="journal-content">工作压力有点大，需要调整一下。</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 数据概览 */}
        <section className="data-overview">
          <h3>数据概览</h3>
          <div className="overview-cards">
            <div className="overview-card">
              <h4>本周情绪趋势</h4>
              <div className="trend-chart">
                {/* 简化的图表表示 */}
                <div className="chart-bars">
                  <div className="chart-bar" style={{height: '60%'}}></div>
                  <div className="chart-bar" style={{height: '75%'}}></div>
                  <div className="chart-bar" style={{height: '50%'}}></div>
                  <div className="chart-bar" style={{height: '80%'}}></div>
                  <div className="chart-bar" style={{height: '65%'}}></div>
                  <div className="chart-bar" style={{height: '70%'}}></div>
                  <div className="chart-bar" style={{height: '85%'}}></div>
                </div>
              </div>
            </div>
            
            <div className="overview-card">
              <h4>本月情绪分布</h4>
              <div className="emotion-distribution">
                <div className="emotion-stat">
                  <span className="emotion-icon">😊</span>
                  <span className="emotion-count">45%</span>
                </div>
                <div className="emotion-stat">
                  <span className="emotion-icon">😌</span>
                  <span className="emotion-count">30%</span>
                </div>
                <div className="emotion-stat">
                  <span className="emotion-icon">😰</span>
                  <span className="emotion-count">10%</span>
                </div>
                <div className="emotion-stat">
                  <span className="emotion-icon">😢</span>
                  <span className="emotion-count">5%</span>
                </div>
                <div className="emotion-stat">
                  <span className="emotion-icon">😠</span>
                  <span className="emotion-count">10%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 快速入口 */}
        <section className="quick-access">
          <h3>快速入口</h3>
          <div className="quick-links">
            <Link to="/real-time-monitoring" className="quick-link">
              <div className="quick-icon">📊</div>
              <span>实时监测</span>
            </Link>
            <Link to="/emotion-analysis" className="quick-link">
              <div className="quick-icon">😊</div>
              <span>情绪分析</span>
            </Link>
            <Link to="/mind-symphony" className="quick-link">
              <div className="quick-icon">🎵</div>
              <span>情绪音乐</span>
            </Link>
            <Link to="/device-binding" className="quick-link">
              <div className="quick-icon">🔗</div>
              <span>设备绑定</span>
            </Link>
          </div>
        </section>
      </main>

      {/* 底部信息 */}
      <footer className="dashboard-footer">
        <p>© 2023 心晴屿 - 脑电情绪监测与分析平台 | <span className="footer-note">本结果仅供参考，如有不适请及时就医</span></p>
      </footer>
    </div>
  );
};

export default Dashboard;
