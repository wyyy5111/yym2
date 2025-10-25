import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EmotionJournalPage.css';

const EmotionJournalPage = () => {
  // 添加页面顶部的品牌标题
  const renderAppHeader = () => {
    return (
      <div className="app-header">
        <div className="app-brand">
          <span className="brand-icon">🏝️</span>
          <h1 className="brand-title">心晴屿</h1>
          <p className="brand-subtitle">您的心灵避风港</p>
        </div>
      </div>
    );
  };

  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    emotion: '',
    intensity: 5,
    thoughts: '',
    activities: [],
    tags: '',
    date: new Date(),
    weather: 'sunny'
  });
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 模拟加载数据
  useEffect(() => {
    const loadEntries = () => {
      setIsLoading(true);
      // 模拟网络请求延迟
      setTimeout(() => {
        const mockEntries = generateMockEntries();
        setEntries(mockEntries);
        setIsLoading(false);
      }, 800);
    };

    loadEntries();
  }, []);

  // 生成模拟数据
  const generateMockEntries = () => {
    const mockEntries = [
      {
        id: 1,
        emotion: 'happy',
        intensity: 8,
        thoughts: '今天完成了一个重要项目，感觉很有成就感！团队合作得很愉快。',
        activities: ['工作', '团队协作'],
        tags: '成就,团队',
        date: new Date(Date.now() - 86400000), // 昨天
        weather: 'sunny'
      },
      {
        id: 2,
        emotion: 'calm',
        intensity: 6,
        thoughts: '午休时间在公园散步，阳光很好，听着音乐感到很放松。',
        activities: ['散步', '听音乐'],
        tags: '放松,自然',
        date: new Date(Date.now() - 172800000), // 前天
        weather: 'sunny'
      },
      {
        id: 3,
        emotion: 'anxious',
        intensity: 7,
        thoughts: '即将到来的演讲让我感到紧张，担心自己表现不好。',
        activities: ['准备演讲', '思考'],
        tags: '压力,工作',
        date: new Date(Date.now() - 259200000), // 3天前
        weather: 'cloudy'
      },
      {
        id: 4,
        emotion: 'excited',
        intensity: 9,
        thoughts: '收到了期待已久的好消息，整个人都充满了动力！',
        activities: ['社交', '庆祝'],
        tags: '兴奋,期待',
        date: new Date(Date.now() - 345600000), // 4天前
        weather: 'sunny'
      }
    ];
    return mockEntries;
  };

  // 情绪选项
  const emotionOptions = [
    { value: 'happy', label: '开心', emoji: '😊', color: '#FFD93D' },
    { value: 'sad', label: '难过', emoji: '😢', color: '#6C5CE7' },
    { value: 'angry', label: '愤怒', emoji: '😠', color: '#FF6B6B' },
    { value: 'calm', label: '平静', emoji: '😌', color: '#00B894' },
    { value: 'anxious', label: '焦虑', emoji: '😰', color: '#A29BFE' },
    { value: 'excited', label: '兴奋', emoji: '🤗', color: '#FF7675' },
    { value: 'tired', label: '疲惫', emoji: '😴', color: '#636E72' },
    { value: 'grateful', label: '感激', emoji: '🙏', color: '#55E6C1' },
  ];

  // 活动选项
  const activityOptions = [
    '工作', '学习', '运动', '社交', '休息', '阅读',
    '听音乐', '看电影', '散步', '冥想', '创作', '购物'
  ];

  // 天气选项
  const weatherOptions = [
    { value: 'sunny', label: '☀️', title: '晴天' },
    { value: 'cloudy', label: '☁️', title: '多云' },
    { value: 'rainy', label: '🌧️', title: '雨天' },
    { value: 'snowy', label: '❄️', title: '雪天' },
    { value: 'windy', label: '💨', title: '大风' },
  ];

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEntry({ ...currentEntry, [name]: value });
  };

  // 处理情绪选择
  const handleEmotionSelect = (emotion) => {
    setCurrentEntry({ ...currentEntry, emotion });
  };

  // 处理活动选择
  const toggleActivity = (activity) => {
    setCurrentEntry(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  // 处理天气选择
  const handleWeatherSelect = (weather) => {
    setCurrentEntry({ ...currentEntry, weather });
  };

  // 保存日记条目
  const saveEntry = () => {
    if (!currentEntry.emotion || !currentEntry.thoughts.trim()) {
      alert('请至少选择情绪并记录想法');
      return;
    }

    const newEntry = {
      ...currentEntry,
      id: editingId || Date.now(),
      date: new Date(currentEntry.date)
    };

    if (editingId) {
      setEntries(entries.map(entry => 
        entry.id === editingId ? newEntry : entry
      ));
    } else {
      setEntries([newEntry, ...entries]);
    }

    resetForm();
  };

  // 重置表单
  const resetForm = () => {
    setCurrentEntry({
      emotion: '',
      intensity: 5,
      thoughts: '',
      activities: [],
      tags: '',
      date: new Date(),
      weather: 'sunny'
    });
    setShowEntryForm(false);
    setEditingId(null);
  };

  // 编辑条目
  const editEntry = (entry) => {
    setCurrentEntry({
      ...entry,
      date: new Date(entry.date)
    });
    setEditingId(entry.id);
    setShowEntryForm(true);
  };

  // 删除条目
  const deleteEntry = (id) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  // 筛选和搜索
  const filteredEntries = entries.filter(entry => {
    const matchesFilter = selectedFilter === 'all' || entry.emotion === selectedFilter;
    const matchesSearch = entry.thoughts.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.tags.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // 格式化日期
  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // 获取情绪标签信息
  const getEmotionInfo = (emotionValue) => {
    return emotionOptions.find(e => e.value === emotionValue) || { label: '未知', emoji: '😐', color: '#95A5A6' };
  };

  // 统计数据
  const getStats = () => {
    if (entries.length === 0) return { total: 0, averageIntensity: 0, topEmotion: null };
    
    const total = entries.length;
    const totalIntensity = entries.reduce((sum, entry) => sum + entry.intensity, 0);
    const averageIntensity = Math.round(totalIntensity / total);
    
    // 找出最常见的情绪
    const emotionCounts = {};
    entries.forEach(entry => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });
    const topEmotionValue = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
    const topEmotion = topEmotionValue ? getEmotionInfo(topEmotionValue) : null;
    
    return { total, averageIntensity, topEmotion };
  };

  const stats = getStats();

  // 移除外层div容器，直接返回内容
  return (
    <>
      {renderAppHeader()}
      <header className="journal-header">
        <h1>情绪日志</h1>
        <p className="journal-subtitle">记录每一天的心情变化</p>
      </header>

      {/* 统计卡片 */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>总记录</h3>
          <p className="stat-value">{stats.total}</p>
          <p className="stat-unit">条</p>
        </div>
        <div className="stat-card">
          <h3>平均强度</h3>
          <p className="stat-value">{stats.averageIntensity}</p>
          <p className="stat-unit">/10</p>
        </div>
        {stats.topEmotion && (
          <div className="stat-card">
            <h3>常见情绪</h3>
            <p className="stat-emoji">{stats.topEmotion.emoji}</p>
            <p className="stat-unit">{stats.topEmotion.label}</p>
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="action-buttons">
        <button 
          className="primary-btn" 
          onClick={() => setShowEntryForm(true)}
        >
          写新日志
        </button>
      </div>

      {/* 筛选器 */}
      <div className="filters">
        <input
          type="text"
          placeholder="搜索想法或标签..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="emotion-filter">
          <button 
            className={`filter-btn ${selectedFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('all')}
          >
            全部
          </button>
          {emotionOptions.map(emotion => (
            <button
              key={emotion.value}
              className={`filter-btn ${selectedFilter === emotion.value ? 'active' : ''}`}
              onClick={() => setSelectedFilter(emotion.value)}
              style={{ backgroundColor: selectedFilter === emotion.value ? emotion.color : 'transparent' }}
              title={emotion.label}
            >
              {emotion.emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 日记列表 */}
      <div className="entries-container">
        {isLoading ? (
          <div className="loading">加载中...</div>
        ) : filteredEntries.length === 0 ? (
          <div className="empty-state">
            <p>还没有情绪记录</p>
            <button 
              className="primary-btn" 
              onClick={() => setShowEntryForm(true)}
            >
              开始记录
            </button>
          </div>
        ) : (
          filteredEntries.map(entry => {
            const emotionInfo = getEmotionInfo(entry.emotion);
            const weatherInfo = weatherOptions.find(w => w.value === entry.weather);
            
            return (
              <div className="entry-card" key={entry.id}>
                <div className="entry-header">
                  <div className="emotion-badge" style={{ backgroundColor: `${emotionInfo.color}33` }}>
                    <span className="emotion-emoji">{emotionInfo.emoji}</span>
                    <span className="emotion-label">{emotionInfo.label}</span>
                    <span className="intensity-indicator">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span 
                          key={i}
                          className={`intensity-dot ${i < entry.intensity ? 'active' : ''}`}
                          style={{ backgroundColor: i < entry.intensity ? emotionInfo.color : '#ddd' }}
                        ></span>
                      ))}
                    </span>
                  </div>
                  <div className="entry-meta">
                    <span className="entry-date">{formatDate(entry.date)}</span>
                    <span className="entry-weather" title={weatherInfo?.title}>{weatherInfo?.label}</span>
                    <div className="entry-actions">
                      <button className="action-icon" onClick={() => editEntry(entry)} title="编辑">
                        ✏️
                      </button>
                      <button className="action-icon" onClick={() => deleteEntry(entry.id)} title="删除">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
                
                <p className="entry-thoughts">{entry.thoughts}</p>
                
                {entry.activities.length > 0 && (
                  <div className="entry-activities">
                    {entry.activities.map((activity, idx) => (
                      <span key={idx} className="activity-tag">{activity}</span>
                    ))}
                  </div>
                )}
                
                {entry.tags && (
                  <div className="entry-tags">
                    {entry.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="tag">#{tag.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 情绪记录表单 */}
      {showEntryForm && (
        <div className="entry-form-overlay" onClick={resetForm}>
          <div className="entry-form" onClick={(e) => e.stopPropagation()}>
            <div className="form-header">
              <h2>{editingId ? '编辑日志' : '新建日志'}</h2>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            
            <div className="form-group">
              <label>日期</label>
              <input
                type="date"
                name="date"
                value={currentEntry.date.toISOString().split('T')[0]}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>选择情绪</label>
              <div className="emotion-options">
                {emotionOptions.map(emotion => (
                  <button
                    key={emotion.value}
                    className={`emotion-option ${currentEntry.emotion === emotion.value ? 'selected' : ''}`}
                    onClick={() => handleEmotionSelect(emotion.value)}
                    style={{ 
                      borderColor: currentEntry.emotion === emotion.value ? emotion.color : '#ddd',
                      backgroundColor: currentEntry.emotion === emotion.value ? `${emotion.color}22` : 'transparent'
                    }}
                  >
                    <span className="emoji">{emotion.emoji}</span>
                    <span className="label">{emotion.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>情绪强度 ({currentEntry.intensity}/10)</label>
              <input
                type="range"
                name="intensity"
                min="1"
                max="10"
                value={currentEntry.intensity}
                onChange={handleInputChange}
                className="range-control"
              />
            </div>
            
            <div className="form-group">
              <label>记录你的想法</label>
              <textarea
                name="thoughts"
                value={currentEntry.thoughts}
                onChange={handleInputChange}
                placeholder="描述一下你的感受和想法..."
                rows="4"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>今天做了什么</label>
              <div className="activity-options">
                {activityOptions.map(activity => (
                  <button
                    key={activity}
                    className={`activity-option ${currentEntry.activities.includes(activity) ? 'selected' : ''}`}
                    onClick={() => toggleActivity(activity)}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-group">
              <label>添加标签 (用逗号分隔)</label>
              <input
                type="text"
                name="tags"
                value={currentEntry.tags}
                onChange={handleInputChange}
                placeholder="例如：工作,压力,放松"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label>天气</label>
              <div className="weather-options">
                {weatherOptions.map(weather => (
                  <button
                    key={weather.value}
                    className={`weather-option ${currentEntry.weather === weather.value ? 'selected' : ''}`}
                    onClick={() => handleWeatherSelect(weather.value)}
                    title={weather.title}
                  >
                    {weather.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button className="cancel-btn" onClick={resetForm}>取消</button>
              <button className="save-btn" onClick={saveEntry}>保存</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EmotionJournalPage;