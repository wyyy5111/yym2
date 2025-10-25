import { useState } from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import { Line } from 'react-chartjs-2'
import './HistoryRecordsPage.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const HistoryRecordsPage = () => {
  const [viewType, setViewType] = useState('day') // day, week, month
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dataType, setDataType] = useState('attention') // attention, emotion

  // 生成模拟历史数据
  const generateMockData = () => {
    const labels = []
    const attentionData = []
    const emotionData = []
    
    if (viewType === 'day') {
      // 一天24小时的数据
      for (let i = 0; i < 24; i++) {
        labels.push(`${i}:00`)
        attentionData.push(Math.floor(Math.random() * 30) + 60) // 60-90的随机值
        emotionData.push(Math.floor(Math.random() * 5) + 1) // 1-6的随机值，对应不同情绪
      }
    } else if (viewType === 'week') {
      // 一周7天的数据
      const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      for (let i = 0; i < 7; i++) {
        labels.push(days[i])
        attentionData.push(Math.floor(Math.random() * 30) + 60)
        emotionData.push(Math.floor(Math.random() * 5) + 1)
      }
    } else {
      // 一个月30天的数据
      for (let i = 1; i <= 30; i++) {
        labels.push(`${i}日`)
        attentionData.push(Math.floor(Math.random() * 30) + 60)
        emotionData.push(Math.floor(Math.random() * 5) + 1)
      }
    }
    
    return { labels, attentionData, emotionData }
  }

  const { labels, attentionData, emotionData } = generateMockData()

  // 情绪映射
  const emotionMap = {
    1: { name: '愉悦', color: '#ff6b6b', emoji: '😊' },
    2: { name: '平静', color: '#4ecdc4', emoji: '😌' },
    3: { name: '专注', color: '#45b7d1', emoji: '🤔' },
    4: { name: '放松', color: '#96ceb4', emoji: '😇' },
    5: { name: '紧张', color: '#ffeaa7', emoji: '😰' },
    6: { name: '焦虑', color: '#dda0dd', emoji: '😟' }
  }

  // 准备图表数据
  const chartData = {
    labels,
    datasets: [
      {
        label: dataType === 'attention' ? '注意力指数' : '情绪状态',
        data: dataType === 'attention' ? attentionData : emotionData,
        borderColor: dataType === 'attention' ? '#667eea' : '#764ba2',
        backgroundColor: dataType === 'attention' ? 'rgba(102, 126, 234, 0.1)' : 'rgba(118, 75, 162, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: dataType === 'attention' ? 0 : 1,
        max: dataType === 'attention' ? 100 : 6
      }
    }
  }

  // 生成日历标记数据
  const generateCalendarMarkedDates = () => {
    const marked = {};
    // 为过去30天中的一些日期添加情绪标记
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (Math.random() > 0.5) { // 50%的概率有标记
        const emotionValue = Math.floor(Math.random() * 6) + 1;
        marked[dateStr] = {
          customStyles: {
            backgroundColor: emotionMap[emotionValue].color + '80',
            borderRadius: '50%'
          },
          dotColor: emotionMap[emotionValue].color,
          emoji: emotionMap[emotionValue].emoji
        };
      }
    }
    return marked;
  }

  const markedDates = generateCalendarMarkedDates();

  // 自定义日历单元格渲染
  const tileContent = ({ date, view }) => {
    const dateStr = date.toISOString().split('T')[0];
    if (markedDates[dateStr]) {
      return <div style={{ fontSize: '12px' }}>{markedDates[dateStr].emoji}</div>;
    }
    return null;
  };

  return (
    <div className="history-records-page page-transition">
      <div className="container">
        <Link to="/record" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回记录
        </Link>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>历史记录</h1>
          
          {/* 视图切换 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${viewType === 'day' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('day')}
            >
              日视图
            </button>
            <button 
              className={`btn ${viewType === 'week' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('week')}
            >
              周视图
            </button>
            <button 
              className={`btn ${viewType === 'month' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewType('month')}
            >
              月视图
            </button>
            
            <div style={{ width: '20px' }}></div>
            
            <button 
              className={`btn ${dataType === 'attention' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDataType('attention')}
            >
              注意力
            </button>
            <button 
              className={`btn ${dataType === 'emotion' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setDataType('emotion')}
            >
              情绪
            </button>
          </div>

          {/* 图表显示 */}
          <div style={{ height: '400px', marginBottom: '32px' }}>
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* 简要报告 */}
          <div className="card" style={{ backgroundColor: '#f8f9fa', marginBottom: '32px' }}>
            <h3>数据分析报告</h3>
            <p><strong>平均{dataType === 'attention' ? '注意力指数' : '情绪值'}：</strong>
              {dataType === 'attention' 
                ? Math.round(attentionData.reduce((a, b) => a + b, 0) / attentionData.length) + '%'
                : '中等'}
            </p>
            <p><strong>最高值：</strong>
              {dataType === 'attention' 
                ? Math.max(...attentionData) + '%'
                : emotionMap[Math.max(...emotionData)]?.name}
            </p>
            <p><strong>最低值：</strong>
              {dataType === 'attention' 
                ? Math.min(...attentionData) + '%'
                : emotionMap[Math.min(...emotionData)]?.name}
            </p>
            <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
          </div>

          {/* 情绪日历 */}
          {dataType === 'emotion' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>情绪日历</h3>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Calendar
                  onChange={setSelectedDate}
                  value={selectedDate}
                  tileContent={tileContent}
                  locale="zh-CN"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '20px', flexWrap: 'wrap' }}>
                {Object.entries(emotionMap).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{value.emoji}</span>
                    <span>{value.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryRecordsPage