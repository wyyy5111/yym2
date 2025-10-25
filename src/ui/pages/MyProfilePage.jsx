import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyProfilePage.css';

const MyProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '张小明',
    avatar: null,
    age: '28',
    gender: 'male',
    occupation: '软件工程师',
    healthInfo: {
      sleepHours: '7.5',
      exerciseFrequency: 'weekly',
      stressLevel: 'moderate'
    }
  });
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 模拟统计数据
  const stats = {
    emotionRecords: 42,
    daysStreak: 15,
    moodImprovement: '65%',
    therapySessions: 8
  };
  
  // 模拟收藏内容
  const favorites = [
    { id: 1, title: '放松冥想指导', type: 'therapy', date: '2023-10-15' },
    { id: 2, title: '积极心理学入门', type: 'article', date: '2023-10-12' },
    { id: 3, title: '自然雨声白噪音', type: 'music', date: '2023-10-10' }
  ];
  
  // 模拟通知
  const notifications = [
    { id: 1, title: '情绪分析报告已生成', date: '今天 14:30', read: false },
    { id: 2, title: '冥想提醒', date: '今天 10:00', read: true },
    { id: 3, title: '新功能上线通知', date: '昨天 18:20', read: false }
  ];
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // 从localStorage获取用户信息
    const savedInfo = localStorage.getItem('userInfo');
    if (savedInfo) {
      try {
        const parsed = JSON.parse(savedInfo);
        setUserInfo(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setUserInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setUserInfo(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    
    try {
      // 模拟保存数据
      await new Promise(resolve => setTimeout(resolve, 800));
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setSuccess('个人信息已更新');
      setEditing(false);
      
      // 3秒后清除成功提示
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('保存失败', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUserInfo(prev => ({ ...prev, avatar: event.target.result }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };
  
  const getGenderText = (gender) => {
    const map = { male: '男', female: '女', other: '其他' };
    return map[gender] || gender || '未设置';
  };
  
  const getExerciseText = (freq) => {
    const map = {
      daily: '每天',
      weekly: '每周数次',
      monthly: '每月数次',
      rarely: '很少'
    };
    return map[freq] || freq || '未设置';
  };
  
  const getStressText = (level) => {
    const map = {
      low: '低',
      moderate: '中等',
      high: '高',
      'very-high': '非常高'
    };
    return map[level] || level || '未设置';
  };
  
  return (
    <div className="my-profile-page">
      <div className="container">
        <h1 className="page-title">我的</h1>
        
        {/* 用户信息头部 */}
        <div className="user-header">
          <div className="avatar-container">
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt="用户头像" className="avatar" />
            ) : (
              <div className="avatar-placeholder">
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '用'}
              </div>
            )}
            {editing && (
              <label className="avatar-upload-btn">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                <span>更换头像</span>
              </label>
            )}
          </div>
          <div className="user-basic-info">
            <h2 className="user-name">{userInfo.name || '未设置昵称'}</h2>
            <p className="user-meta">{getGenderText(userInfo.gender)} | {userInfo.age || '--'}岁 | {userInfo.occupation || '未设置职业'}</p>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-value">{stats.emotionRecords}</div>
            <div className="stat-label">情绪记录</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.daysStreak}</div>
            <div className="stat-label">连续记录天数</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.moodImprovement}</div>
            <div className="stat-label">情绪改善</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.therapySessions}</div>
            <div className="stat-label">治疗练习次数</div>
          </div>
        </div>
        
        {/* 功能选项卡 */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            个人信息
          </button>
          <button 
            className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            我的收藏
          </button>
          <button 
            className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            通知中心
            <span className="notification-badge">
              {notifications.filter(n => !n.read).length}
            </span>
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            设置
          </button>
        </div>
        
        {/* 选项卡内容 */}
        <div className="tab-content">
          {/* 个人信息 */}
          {activeTab === 'profile' && (
            <div className="profile-content">
              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}
              
              {editing ? (
                <form className="profile-form" onSubmit={handleSave}>
                  <div className="form-section">
                    <h3>基本信息</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>姓名</label>
                        <input
                          type="text"
                          name="name"
                          className="form-input"
                          value={userInfo.name}
                          onChange={handleChange}
                          placeholder="请输入姓名"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>性别</label>
                        <select
                          name="gender"
                          className="form-input"
                          value={userInfo.gender}
                          onChange={handleChange}
                        >
                          <option value="">请选择</option>
                          <option value="male">男</option>
                          <option value="female">女</option>
                          <option value="other">其他</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>年龄</label>
                        <input
                          type="number"
                          name="age"
                          className="form-input"
                          value={userInfo.age}
                          onChange={handleChange}
                          min="1"
                          max="120"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>职业</label>
                        <input
                          type="text"
                          name="occupation"
                          className="form-input"
                          value={userInfo.occupation}
                          onChange={handleChange}
                          placeholder="请输入职业"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h3>健康信息</h3>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>睡眠时长（小时/天）</label>
                        <input
                          type="number"
                          name="healthInfo.sleepHours"
                          className="form-input"
                          value={userInfo.healthInfo.sleepHours}
                          onChange={handleChange}
                          min="0"
                          max="24"
                          step="0.5"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>运动频率</label>
                        <select
                          name="healthInfo.exerciseFrequency"
                          className="form-input"
                          value={userInfo.healthInfo.exerciseFrequency}
                          onChange={handleChange}
                        >
                          <option value="">请选择</option>
                          <option value="daily">每天</option>
                          <option value="weekly">每周数次</option>
                          <option value="monthly">每月数次</option>
                          <option value="rarely">很少</option>
                        </select>
                      </div>
                      
                      <div className="form-group full-width">
                        <label>压力水平</label>
                        <select
                          name="healthInfo.stressLevel"
                          className="form-input"
                          value={userInfo.healthInfo.stressLevel}
                          onChange={handleChange}
                        >
                          <option value="">请选择</option>
                          <option value="low">低</option>
                          <option value="moderate">中等</option>
                          <option value="high">高</option>
                          <option value="very-high">非常高</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>
                      取消
                    </button>
                    <button type="submit" className="btn-primary" disabled={loading}>
                      {loading ? '保存中...' : '保存'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display">
                  <div className="info-grid">
                    <div className="info-card">
                      <h3>基本信息</h3>
                      <div className="info-item">
                        <span className="info-label">姓名：</span>
                        <span className="info-value">{userInfo.name || '未设置'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">性别：</span>
                        <span className="info-value">{getGenderText(userInfo.gender)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">年龄：</span>
                        <span className="info-value">{userInfo.age || '未设置'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">职业：</span>
                        <span className="info-value">{userInfo.occupation || '未设置'}</span>
                      </div>
                    </div>
                    
                    <div className="info-card">
                      <h3>健康信息</h3>
                      <div className="info-item">
                        <span className="info-label">睡眠时长：</span>
                        <span className="info-value">{userInfo.healthInfo.sleepHours || '未设置'} 小时/天</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">运动频率：</span>
                        <span className="info-value">{getExerciseText(userInfo.healthInfo.exerciseFrequency)}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">压力水平：</span>
                        <span className="info-value">{getStressText(userInfo.healthInfo.stressLevel)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="btn-primary edit-profile-btn" onClick={() => setEditing(true)}>
                    编辑个人信息
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* 我的收藏 */}
          {activeTab === 'favorites' && (
            <div className="favorites-content">
              {favorites.length > 0 ? (
                <div className="favorites-list">
                  {favorites.map(item => (
                    <div className="favorite-item" key={item.id}>
                      <div className="favorite-info">
                        <h4>{item.title}</h4>
                        <div className="favorite-meta">
                          <span className={`favorite-type ${item.type}`}>
                            {item.type === 'therapy' ? '治疗练习' : 
                             item.type === 'article' ? '文章' : '音乐'}
                          </span>
                          <span className="favorite-date">{item.date}</span>
                        </div>
                      </div>
                      <button className="btn-remove">移除</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>您还没有收藏任何内容</p>
                </div>
              )}
            </div>
          )}
          
          {/* 通知中心 */}
          {activeTab === 'notifications' && (
            <div className="notifications-content">
              {notifications.length > 0 ? (
                <div className="notifications-list">
                  {notifications.map(notification => (
                    <div 
                      className={`notification-item ${notification.read ? 'read' : ''}`}
                      key={notification.id}
                    >
                      <h4>{notification.title}</h4>
                      <p className="notification-date">{notification.date}</p>
                      {!notification.read && <span className="unread-dot"></span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>暂无通知</p>
                </div>
              )}
            </div>
          )}
          
          {/* 设置 */}
          {activeTab === 'settings' && (
            <div className="settings-content">
              <div className="settings-section">
                <h3>账户设置</h3>
                <div className="setting-item">
                  <span>修改密码</span>
                  <button className="btn-link">修改</button>
                </div>
                <div className="setting-item">
                  <span>隐私设置</span>
                  <button className="btn-link">管理</button>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>通知设置</h3>
                <div className="setting-item">
                  <span>推送通知</span>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <span>邮件提醒</span>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              
              <div className="settings-section">
                <h3>关于</h3>
                <div className="setting-item">
                  <span>版本信息</span>
                  <span className="version">v1.0.0</span>
                </div>
                <div className="setting-item">
                  <span>使用条款</span>
                  <button className="btn-link">查看</button>
                </div>
                <div className="setting-item">
                  <span>隐私政策</span>
                  <button className="btn-link">查看</button>
                </div>
              </div>
              
              <button className="btn-danger logout-btn" onClick={handleLogout}>
                退出登录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfilePage;