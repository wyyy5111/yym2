import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EmotionCloudPage.css';

const EmotionCloudPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [emotionData, setEmotionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('week'); // week, month

  useEffect(() => {
    // 模拟加载情绪云数据
    const loadEmotionData = () => {
      setLoading(true);
      // 模拟网络延迟
      setTimeout(() => {
        const mockData = generateMockEmotionData(selectedDate, selectedView);
        setEmotionData(mockData);
        setLoading(false);
      }, 600);
    };

    loadEmotionData();
  }, [selectedDate, selectedView]);

  // 生成模拟情绪云数据
  const generateMockEmotionData = (date, viewType) => {
    const emotions = [
      { name: '平静', color: '#4ecdc4', size: 14 },
      { name: '专注', color: '#45b7d1', size: 16 },
      { name: '愉悦', color: '#ff6b6b', size: 18 },
      { name: '放松', color: '#96ceb4', size: 14 },
      { name: '紧张', color: '#ffeaa7', size: 12 },
      { name: '焦虑', color: '#dda0dd', size: 10 },
      { name: '满足', color: '#feca57', size: 15 },
      { name: '兴奋', color: '#ff9ff3', size: 17 },
      { name: '疲惫', color: '#a29bfe', size: 11 },
      { name: '好奇', color: '#00d2d3', size: 13 },
      { name: '感激', color: '#ff9f43', size: 14 },
      { name: '希望', color: '#1dd1a1', size: 16 },
      { name: '思考', color: '#5f27cd', size: 14 },
      { name: '宁静', color: '#00b894', size: 15 },
      { name: '快乐', color: '#fdcb6e', size: 19 },
      { name: '积极', color: '#6c5ce7', size: 16 },
      { name: '平衡', color: '#00cec9', size: 14 },
      { name: '舒适', color: '#a29bfe', size: 13 },
      { name: '活力', color: '#fd79a8', size: 17 },
      { name: '淡定', color: '#fdcb6e', size: 14 }
    ];

    // 根据视图类型生成不同的情绪分布
    let emotionDistribution = [];
    const baseMultiplier = viewType === 'week' ? 1 : 2;

    emotions.forEach(emotion => {
      // 生成1-8次出现频率，乘以基础倍数
      const frequency = Math.floor(Math.random() * 8) + 1;
      const totalOccurrences = frequency * baseMultiplier;
      
      // 生成不同的旋转角度
      const rotation = Math.floor(Math.random() * 60) - 30; // -30到30度
      
      emotionDistribution.push({
        ...emotion,
        frequency: totalOccurrences,
        rotation: rotation,
        // 基于频率的大小调整
        adjustedSize: emotion.size * (1 + (totalOccurrences - 1) * 0.1)
      });
    });

    // 计算最常见情绪
    const mostFrequent = [...emotionDistribution]
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 3);

    // 生成情绪趋势数据
    const trendDays = viewType === 'week' ? 7 : 30;
    const trendLabels = [];
    const trendData = [];

    // 生成高低更明显区分的数据：20-100范围，确保差异性
    for (let i = trendDays - 1; i >= 0; i--) {
      const trendDate = new Date(date);
      trendDate.setDate(trendDate.getDate() - i);
      trendLabels.push(viewType === 'week' 
        ? ['日', '一', '二', '三', '四', '五', '六'][trendDate.getDay()]
        : `${trendDate.getDate()}日`);
      
      // 使用分阶段的随机生成，让高低点分布更自然
      const randomValue = Math.random();
      let value;
      if (randomValue < 0.2) {
        value = Math.floor(Math.random() * 20) + 20; // 低活跃度：20-40
      } else if (randomValue < 0.6) {
        value = Math.floor(Math.random() * 20) + 50; // 中活跃度：50-70
      } else if (randomValue < 0.9) {
        value = Math.floor(Math.random() * 20) + 80; // 高活跃度：80-100
      } else {
        value = Math.floor(Math.random() * 30) + 30; // 随机填充：30-60
      }
      trendData.push(value);
    }

    return {
      emotionDistribution,
      mostFrequent,
      trendLabels,
      trendData,
      totalEmotions: emotionDistribution.reduce((sum, e) => sum + e.frequency, 0)
    };
  };

  // 更改日期
  const changeDate = (direction) => {
    const newDate = new Date(selectedDate);
    if (selectedView === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  // 格式化日期显示
  const formatDateDisplay = () => {
    if (selectedView === 'week') {
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      return `${startDate.getMonth() + 1}月${startDate.getDate()}日 - ${endDate.getMonth() + 1}月${endDate.getDate()}日`;
    } else {
      return `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月`;
    }
  };

  if (loading) {
    return (
      <div className="emotion-cloud-container">
        <Link to="/record" className="btn btn-secondary" style={{ marginBottom: '20px', display: 'inline-block' }}>
          ← 返回记录
        </Link>
        <h1>情绪云</h1>
        <div className="loading">生成情绪云...</div>
      </div>
    );
  }

  return (
    <div className="emotion-cloud-container">
      <Link to="/record" className="btn btn-secondary" style={{ marginBottom: '20px', display: 'inline-block' }}>
        ← 返回记录
      </Link>
      <h1>情绪云</h1>
      
      {/* 日期选择器 */}
      <div className="date-selector">
        <button className="date-btn" onClick={() => changeDate('prev')}>←</button>
        <div className="date-display">
          <span>{formatDateDisplay()}</span>
          <div className="view-toggle">
            <button 
              className={`view-btn ${selectedView === 'week' ? 'active' : ''}`}
              onClick={() => setSelectedView('week')}
            >
              周视图
            </button>
            <button 
              className={`view-btn ${selectedView === 'month' ? 'active' : ''}`}
              onClick={() => setSelectedView('month')}
            >
              月视图
            </button>
          </div>
        </div>
        <button className="date-btn" onClick={() => changeDate('next')}>→</button>
      </div>

      {/* 情绪概览 */}
      <div className="emotion-overview">
        <div className="overview-card">
          <h3>情绪总量</h3>
          <div className="value">{emotionData.totalEmotions}</div>
        </div>
        <div className="overview-card">
          <h3>最常见情绪</h3>
          <div className="top-emotions">
            {emotionData.mostFrequent.map((emotion, index) => (
              <span 
                key={index} 
                className="emotion-tag"
                style={{ 
                  backgroundColor: `${emotion.color}33`, 
                  color: emotion.color
                }}
              >
                {emotion.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 情绪趋势 */}
      <div className="emotion-trend">
        <h2>情绪活跃度趋势</h2>
        <p className="trend-description">显示{selectedView === 'week' ? '一周' : '一个月'}内的情绪活跃度变化情况</p>
        
        <div className="trend-stats">
          <div className="stat-item">
            <span className="stat-label">平均活跃度:</span>
            <span className="stat-value">{Math.round(emotionData.trendData.reduce((sum, val) => sum + val, 0) / emotionData.trendData.length)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最高活跃度:</span>
            <span className="stat-value max">{Math.max(...emotionData.trendData)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最低活跃度:</span>
            <span className="stat-value min">{Math.min(...emotionData.trendData)}%</span>
          </div>
        </div>
        
        <div className="trend-chart">
          {emotionData.trendLabels.map((label, index) => {
            const value = emotionData.trendData[index];
            // 根据活跃度值确定颜色
            const getBarColorClass = (val) => {
              if (val >= 70) return 'high';
              if (val >= 45) return 'medium';
              return 'low';
            };
            
            return (
              <div key={index} className="trend-bar-container" data-value={value} data-label={label}>
                <div className="trend-bar-value">{value}%</div>
                <div className={`trend-bar ${getBarColorClass(value)}`} style={{ height: `${value}%` }}></div>
                <div className="trend-label">{label}</div>
              </div>
            );
          })}
        </div>
        
        <div className="trend-legend">
          <div className="legend-item">
            <div className="legend-color high"></div>
            <span>高活跃度 (70-100%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color medium"></div>
            <span>中活跃度 (45-69%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color low"></div>
            <span>低活跃度 (20-44%)</span>
          </div>
        </div>
      </div>

      {/* 情绪云 */}
      <div className="emotion-cloud-section">
        <h2>情绪词云</h2>
        <div className="emotion-cloud">
          {emotionData.emotionDistribution.map((emotion, index) => {
            // 基于频率重复情绪标签
            const elements = [];
            for (let i = 0; i < emotion.frequency; i++) {
              // 随机位置偏移
              const randomX = Math.random() * 20 - 10;
              const randomY = Math.random() * 20 - 10;
              
              elements.push(
                <div
                  key={`${emotion.name}-${i}`}
                  className="emotion-word"
                  style={{
                    fontSize: `${emotion.adjustedSize}px`,
                    color: emotion.color,
                    transform: `rotate(${emotion.rotation + (i * 5) % 10}deg)`,
                    left: `${randomX}%`,
                    top: `${randomY}%`,
                    opacity: 0.7 + (i * 0.05),
                    zIndex: emotion.frequency - i
                  }}
                >
                  {emotion.name}
                </div>
              );
            }
            return elements;
          })}
        </div>
      </div>

      {/* 情绪分析 */}
      <div className="emotion-insights">
        <h2>情绪分析</h2>
        <div className="insights-list">
          <div className="insight-item">
            <div className="insight-icon">📊</div>
            <div className="insight-content">
              <h4>情绪多样性</h4>
              <p>您在这段时间内体验了{emotionData.emotionDistribution.length}种不同的情绪，情绪体验较为丰富。</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon">✨</div>
            <div className="insight-content">
              <h4>主导情绪</h4>
              <p>"{emotionData.mostFrequent[0].name}"是您的主要情绪，出现了{emotionData.mostFrequent[0].frequency}次。</p>
            </div>
          </div>
          <div className="insight-item">
            <div className="insight-icon">💡</div>
            <div className="insight-content">
              <h4>建议</h4>
              <p>尝试记录触发不同情绪的事件，有助于更好地了解和管理自己的情绪模式。</p>
            </div>
          </div>
        </div>
      </div>

      {/* 导出和分享 */}
      <div className="action-buttons">
        <button className="action-btn export-btn">导出情绪报告</button>
        <button className="action-btn share-btn">分享情绪云</button>
        <Link to="/emotion-analysis" className="action-btn analysis-btn">详细分析</Link>
      </div>
    </div>
  );
};

export default EmotionCloudPage;