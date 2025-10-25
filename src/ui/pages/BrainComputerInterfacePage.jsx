import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line, Radar, Scatter, Bar } from 'react-chartjs-2';
import './BrainComputerInterfacePage.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
);

const BrainComputerInterfacePage = () => {
  // 页面状态管理
  const [activeTab, setActiveTab] = useState('attention');
  const [eegData, setEegData] = useState([]);
  const [attention, setAttention] = useState(60);
  const [emotion, setEmotion] = useState('平静');
  const [signalQuality, setSignalQuality] = useState('良好');
  const [recording, setRecording] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('已连接');
  const [selectedTimeRange, setSelectedTimeRange] = useState('day');
  const chartRef = useRef(null);

  // TGAM数据模拟生成
  useEffect(() => {
    let interval;
    const labels = [];
    const data = [];
    let time = 0;

    interval = setInterval(() => {
      // 生成模拟EEG数据 (TGAM格式)
      const newDataPoint = Math.sin(time * 0.05) * 15 + Math.random() * 10 - 5 + 
                         (Math.random() > 0.98 ? (Math.random() - 0.5) * 20 : 0); // 模拟突发尖峰
      
      labels.push('');
      data.push(newDataPoint);
      
      // 保持数据点数量在200个以内
      if (labels.length > 200) {
        labels.shift();
        data.shift();
      }

      time++;
      setEegData({ labels, datasets: [{ 
        label: 'EEG数据',
        data, 
        borderColor: '#667eea', 
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.3,
        fill: true
      }] });
      
      // 更新注意力指数
      setAttention(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 3)));
      
      // 更新情绪状态
      if (Math.random() > 0.97) {
        const emotions = ['愉悦', '平静', '专注', '放松', '紧张', '焦虑'];
        setEmotion(emotions[Math.floor(Math.random() * emotions.length)]);
      }
      
      // 更新信号质量
      if (Math.random() > 0.98) {
        const qualities = ['良好', '良好', '良好', '良好', '一般', '较差'];
        setSignalQuality(qualities[Math.floor(Math.random() * qualities.length)]);
      }
    }, 100);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // 开始/停止记录
  const toggleRecording = () => {
    if (recording) {
      setRecording(false);
      alert('脑电记录已保存！可以在历史记录中查看详细分析。');
    } else {
      setRecording(true);
    }
  };

  // 获取注意力曲线数据
  const getAttentionCurveData = () => {
    const hours = [];
    const attentionData = [];
    const stabilityData = [];

    const timePoints = selectedTimeRange === 'day' ? 24 : 
                      selectedTimeRange === 'week' ? 7 : 30;
    
    const labels = selectedTimeRange === 'day' ? 
                   Array.from({length: timePoints}, (_, i) => `${i}:00`) :
                   Array.from({length: timePoints}, (_, i) => 
                     selectedTimeRange === 'week' ? `星期${['日','一','二','三','四','五','六'][i]}` : 
                                                   `第${i+1}天`);

    for (let i = 0; i < timePoints; i++) {
      const baseAttention = Math.random() * 20 + 65; // 65-85的基础值
      attentionData.push(baseAttention);
      stabilityData.push(100 - Math.random() * baseAttention * 0.3); // 稳定性
    }

    return {
      labels,
      datasets: [
        {
          label: '注意力指数',
          data: attentionData,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true
        },
        {
          label: '注意力稳定性',
          data: stabilityData,
          borderColor: '#f093fb',
          backgroundColor: 'transparent',
          tension: 0.4,
          borderDash: [5, 5]
        }
      ]
    };
  };

  // 获取情绪雷达图数据
  const getEmotionRadarData = () => {
    const emotions = ['愉悦', '平静', '专注', '放松', '紧张', '焦虑'];
    const values = emotions.map(() => Math.random() * 40 + 10);
    
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', 
      '#96ceb4', '#ffeaa7', '#dda0dd'
    ];

    return {
      labels: emotions,
      datasets: [
        {
          label: '情绪强度',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: '#ff6b6b',
          pointBackgroundColor: colors,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: colors
        }
      ]
    };
  };

  // 获取情感-注意力交互数据
  const getEmotionAttentionInteractionData = () => {
    const labels = ['愉悦', '平静', '专注', '放松', '紧张', '焦虑'];
    const attentionScores = labels.map(() => Math.random() * 30 + 60);
    
    return {
      labels,
      datasets: [
        {
          label: '平均注意力水平',
          data: attentionScores,
          backgroundColor: '#667eea',
          borderColor: '#667eea',
          borderWidth: 1
        }
      ]
    };
  };

  // 获取脑波频段数据
  const getEEGBandData = () => {
    const labels = ['Delta', 'Theta', 'Alpha', 'Beta', 'Gamma'];
    const values = labels.map(() => Math.random() * 40 + 10);
    
    return {
      labels,
      datasets: [
        {
          label: '频段能量',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // 获取情绪动态轨迹数据
  const getEmotionTrajectoryData = () => {
    const points = Array.from({length: 50}, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
    
    return {
      datasets: [
        {
          label: '情绪轨迹',
          data: points,
          backgroundColor: 'rgba(102, 126, 234, 0.5)',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  };

  // 获取注意力网络评估数据
  const getAttentionNetworkData = () => {
    const labels = ['警觉网络', '定向网络', '执行控制网络'];
    const values = labels.map(() => Math.random() * 30 + 60);
    
    return {
      labels,
      datasets: [
        {
          label: '网络功能评分',
          data: values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  // 获取状态颜色
  const getStatusColor = (status) => {
    const colorMap = {
      '良好': '#52c41a',
      '一般': '#faad14',
      '较差': '#ff4d4f',
      '已连接': '#52c41a',
      '未连接': '#ff4d4f',
      '愉悦': '#ff6b6b',
      '平静': '#4ecdc4',
      '专注': '#45b7d1',
      '放松': '#96ceb4',
      '紧张': '#ffeaa7',
      '焦虑': '#dda0dd'
    };
    return colorMap[status] || '#8c8c8c';
  };

  // 渲染实时监测界面
  const renderRealTimeMonitoring = () => (
    <div className="realtime-monitoring-section">
      <div className="status-panel">
        <div className="status-item">
          <span className="status-label">连接状态:</span>
          <span className="status-value" style={{color: getStatusColor(connectionStatus)}}>
            {connectionStatus}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">信号质量:</span>
          <span className="status-value" style={{color: getStatusColor(signalQuality)}}>
            {signalQuality}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">当前情绪:</span>
          <span className="status-value" style={{color: getStatusColor(emotion)}}>
            {emotion}
          </span>
        </div>
        <div className="status-item">
          <span className="status-label">注意力指数:</span>
          <span className="status-value attention-value">
            {attention.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="eeg-display">
        <h3>脑电信号波形</h3>
        <div className="chart-container">
          <Line 
            data={eegData} 
            ref={chartRef}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
              },
              scales: {
                x: { display: false },
                y: { 
                  display: true,
                  title: { display: true, text: '振幅' }
                }
              },
              animation: {
                duration: 0 // 禁用动画以提高性能
              }
            }}
          />
        </div>
      </div>

      <div className="recording-controls">
        <button 
          className={`record-button ${recording ? 'recording' : ''}`} 
          onClick={toggleRecording}
        >
          {recording ? '停止记录' : '开始记录'}
        </button>
      </div>
    </div>
  );

  // 渲染注意力检测界面
  const renderAttentionDetection = () => (
    <div className="attention-detection-section">
      <div className="time-range-selector">
        <button 
          className={selectedTimeRange === 'day' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('day')}
        >
          日视图
        </button>
        <button 
          className={selectedTimeRange === 'week' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('week')}
        >
          周视图
        </button>
        <button 
          className={selectedTimeRange === 'month' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('month')}
        >
          月视图
        </button>
      </div>

      <div className="chart-container">
        <h3>注意力变化曲线</h3>
        <Line 
          data={getAttentionCurveData()} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
            },
            scales: {
              y: { min: 0, max: 100 }
            }
          }}
        />
      </div>

      <div className="attention-network-container">
        <h3>注意力网络评估</h3>
        <Bar 
          data={getAttentionNetworkData()} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { min: 0, max: 100 }
            }
          }}
        />
      </div>

      <div className="attention-insights">
        <h3>注意力洞察</h3>
        <div className="insight-card">
          <h4>专注模式分析</h4>
          <p>您的注意力在{selectedTimeRange === 'day' ? '上午9-11点' : selectedTimeRange === 'week' ? '周一和周四' : '月初'}达到峰值，建议安排重要任务在此时段。</p>
        </div>
        <div className="insight-card">
          <h4>注意力稳定性</h4>
          <p>您的注意力稳定性评分为{(Math.random() * 30 + 60).toFixed(1)}分，高于平均水平。</p>
        </div>
      </div>
    </div>
  );

  // 渲染情感识别界面
  const renderEmotionRecognition = () => (
    <div className="emotion-recognition-section">
      <div className="time-range-selector">
        <button 
          className={selectedTimeRange === 'day' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('day')}
        >
          日视图
        </button>
        <button 
          className={selectedTimeRange === 'week' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('week')}
        >
          周视图
        </button>
        <button 
          className={selectedTimeRange === 'month' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('month')}
        >
          月视图
        </button>
      </div>

      <div className="charts-grid">
        <div className="chart-container emotion-radar">
          <h3>情绪分布</h3>
          <Radar 
            data={getEmotionRadarData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: { beginAtZero: true, max: 100 }
              }
            }}
          />
        </div>

        <div className="chart-container emotion-trajectory">
          <h3>情绪动态轨迹</h3>
          <Scatter 
            data={getEmotionTrajectoryData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: { title: { display: true, text: '效价' }, min: 0, max: 100 },
                y: { title: { display: true, text: '唤醒度' }, min: 0, max: 100 }
              }
            }}
          />
        </div>
      </div>

      <div className="emotion-insights">
        <h3>情绪洞察</h3>
        <div className="insight-card">
          <h4>情绪稳定性分析</h4>
          <p>您的情绪波动频率为{(Math.random() * 10 + 5).toFixed(1)}次/{selectedTimeRange === 'day' ? '天' : selectedTimeRange === 'week' ? '周' : '月'}，情绪稳定性良好。</p>
        </div>
        <div className="insight-card">
          <h4>主导情绪</h4>
          <p>根据{selectedTimeRange === 'day' ? '今日' : selectedTimeRange === 'week' ? '本周' : '本月'}数据分析，您的主导情绪是{['愉悦', '平静', '专注', '放松'][Math.floor(Math.random() * 4)]}。</p>
        </div>
      </div>
    </div>
  );

  // 渲染数据可视化界面
  const renderDataVisualization = () => (
    <div className="data-visualization-section">
      <div className="time-range-selector">
        <button 
          className={selectedTimeRange === 'day' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('day')}
        >
          日视图
        </button>
        <button 
          className={selectedTimeRange === 'week' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('week')}
        >
          周视图
        </button>
        <button 
          className={selectedTimeRange === 'month' ? 'active' : ''}
          onClick={() => setSelectedTimeRange('month')}
        >
          月视图
        </button>
      </div>

      <div className="charts-grid">
        <div className="chart-container eeg-band">
          <h3>脑波频段分析</h3>
          <Bar 
            data={getEEGBandData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }}
          />
        </div>

        <div className="chart-container emotion-attention">
          <h3>情绪-注意力交互</h3>
          <Bar 
            data={getEmotionAttentionInteractionData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true }
              },
              scales: {
                y: { beginAtZero: true, max: 100 }
              }
            }}
          />
        </div>
      </div>

      <div className="visualization-insights">
        <h3>数据分析洞察</h3>
        <div className="insight-card">
          <h4>脑波特征</h4>
          <p>您的{['Alpha', 'Beta', 'Theta'][Math.floor(Math.random() * 3)]}波活动较为活跃，表明您可能处于{['放松', '专注', '创造性思考'][Math.floor(Math.random() * 3)]}状态。</p>
        </div>
        <div className="insight-card">
          <h4>情绪与注意力</h4>
          <p>数据显示，当您处于{['愉悦', '平静'][Math.floor(Math.random() * 2)]}状态时，注意力水平平均提升{(Math.random() * 10 + 5).toFixed(1)}%。</p>
        </div>
      </div>
    </div>
  );

  // 渲染专业分析界面
  const renderProfessionalAnalysis = () => (
    <div className="professional-analysis-section">
      <div className="analysis-report">
        <h3>专业评估报告</h3>
        
        <div className="report-section">
          <h4>1. 注意力功能评估</h4>
          <p><strong>注意力网络功能：</strong></p>
          <ul>
            <li>警觉网络：{(Math.random() * 30 + 60).toFixed(1)}分（正常范围）</li>
            <li>定向网络：{(Math.random() * 30 + 60).toFixed(1)}分（正常范围）</li>
            <li>执行控制网络：{(Math.random() * 30 + 60).toFixed(1)}分（正常范围）</li>
          </ul>
          <p><strong>持续注意力：</strong>您在{selectedTimeRange === 'day' ? '今日' : selectedTimeRange === 'week' ? '本周' : '本月'}的注意力持续时间平均为{(Math.random() * 20 + 30).toFixed(1)}分钟，符合健康成年人标准。</p>
        </div>

        <div className="report-section">
          <h4>2. 情绪功能评估</h4>
          <p><strong>情绪稳定性：</strong>情绪波动指数为{(Math.random() * 20 + 20).toFixed(1)}，属于稳定范围。</p>
          <p><strong>情绪调节能力：</strong>情绪恢复时间平均为{(Math.random() * 10 + 5).toFixed(1)}分钟，表明情绪调节能力良好。</p>
          <p><strong>情绪多样性：</strong>{selectedTimeRange === 'day' ? '今日' : selectedTimeRange === 'week' ? '本周' : '本月'}记录到{(Math.random() * 3 + 3).toFixed(0)}种不同情绪状态，情绪体验丰富。</p>
        </div>

        <div className="report-section">
          <h4>3. 综合心理状态</h4>
          <p>综合评估结果显示，您的注意力和情绪功能处于健康范围，未发现明显异常。建议保持良好的作息规律和适当的运动，以维持最佳心理状态。</p>
        </div>

        <div className="report-section">
          <h4>4. 个性化建议</h4>
          <ul>
            <li>在注意力高峰期安排重要工作和学习任务</li>
            <li>定期进行冥想或放松训练，进一步提升情绪稳定性</li>
            <li>保持规律作息，确保充足睡眠以优化脑功能</li>
            <li>建议每周进行2-3次有氧运动，有助于改善认知功能</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // 渲染内容区域
  const renderContent = () => {
    switch (activeTab) {
      case 'realtime':
        return renderRealTimeMonitoring();
      case 'attention':
        return renderAttentionDetection();
      case 'emotion':
        return renderEmotionRecognition();
      case 'visualization':
        return renderDataVisualization();
      case 'professional':
        return renderProfessionalAnalysis();
      default:
        return renderAttentionDetection();
    }
  };

  return (
    <div className="bci-page-container">
      <Link to="/analysis" className="btn btn-secondary" style={{ marginBottom: '20px', display: 'inline-block' }}>
        ← 返回分析
      </Link>
      <h2 className="page-title">脑机接口系统</h2>
      
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'realtime' ? 'active' : ''}`}
          onClick={() => setActiveTab('realtime')}
        >
          实时监测
        </button>
        <button 
          className={`tab-button ${activeTab === 'attention' ? 'active' : ''}`}
          onClick={() => setActiveTab('attention')}
        >
          注意力检测
        </button>
        <button 
          className={`tab-button ${activeTab === 'emotion' ? 'active' : ''}`}
          onClick={() => setActiveTab('emotion')}
        >
          情感识别
        </button>
        <button 
          className={`tab-button ${activeTab === 'visualization' ? 'active' : ''}`}
          onClick={() => setActiveTab('visualization')}
        >
          数据可视化
        </button>
        <button 
          className={`tab-button ${activeTab === 'professional' ? 'active' : ''}`}
          onClick={() => setActiveTab('professional')}
        >
          专业分析
        </button>
      </div>

      <div className="tab-content">
        {renderContent()}
      </div>

      <div className="navigation-hint">
        <p>提示：在左侧导航栏可以访问更多功能模块</p>
      </div>
    </div>
  );
};

export default BrainComputerInterfacePage;