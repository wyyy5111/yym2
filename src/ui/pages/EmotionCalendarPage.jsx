import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar'
import { Line } from 'react-chartjs-2'
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

const EmotionCalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [emotionData, setEmotionData] = useState({})
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [customNote, setCustomNote] = useState('')
  const [currentView, setCurrentView] = useState('calendar') // calendar, stats

  // 情绪选项
  const emotions = [
    { name: '愉悦', emoji: '😊', color: '#ff6b6b' },
    { name: '平静', emoji: '😌', color: '#4ecdc4' },
    { name: '专注', emoji: '🤔', color: '#45b7d1' },
    { name: '放松', emoji: '😇', color: '#96ceb4' },
    { name: '紧张', emoji: '😰', color: '#ffeaa7' },
    { name: '焦虑', emoji: '😟', color: '#dda0dd' }
  ]

  // 标签选项
  const commonTags = [
    '工作', '学习', '休息', '运动', '社交', 
    '冥想', '阅读', '创作', '旅行', '聚会',
    '会议', '压力大', '睡眠不足', '心情好', '精力充沛'
  ]

  // 初始化情绪数据
  useEffect(() => {
    const savedData = localStorage.getItem('emotionCalendarData')
    if (savedData) {
      setEmotionData(JSON.parse(savedData))
    }
  }, [])

  // 保存情绪数据
  const saveEmotionData = () => {
    localStorage.setItem('emotionCalendarData', JSON.stringify(emotionData))
  }

  // 记录今日情绪
  const recordEmotion = (emotion, tags = []) => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    const newData = {
      ...emotionData,
      [dateStr]: {
        emotion,
        tags,
        note: customNote,
        timestamp: new Date().toISOString()
      }
    }
    setEmotionData(newData)
    setSelectedEmotion(emotion)
    saveEmotionData()
  }

  // 生成日历标记
  const generateMarkedDates = () => {
    const marked = {}
    
    Object.entries(emotionData).forEach(([dateStr, data]) => {
      const emotion = emotions.find(e => e.name === data.emotion)
      if (emotion) {
        marked[dateStr] = {
          customStyles: {
            backgroundColor: emotion.color + '40',
            borderRadius: '50%'
          },
          emoji: emotion.emoji
        }
      }
    })
    
    // 标记选中的日期
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    if (marked[selectedDateStr]) {
      marked[selectedDateStr].customStyles = {
        ...marked[selectedDateStr].customStyles,
        border: '2px solid #667eea',
        padding: '2px'
      }
    } else {
      marked[selectedDateStr] = {
        customStyles: {
          border: '2px solid #667eea',
          padding: '2px'
        }
      }
    }
    
    return marked
  }

  // 自定义日历单元格
  const tileContent = ({ date, view }) => {
    const dateStr = date.toISOString().split('T')[0]
    if (emotionData[dateStr]) {
      const emotion = emotions.find(e => e.name === emotionData[dateStr].emotion)
      if (emotion) {
        return (
          <div style={{ fontSize: '16px', display: 'flex', justifyContent: 'center' }}>
            {emotion.emoji}
          </div>
        )
      }
    }
    return null
  }

  // 获取选中日期的数据
  const getSelectedDateData = () => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    return emotionData[dateStr] || null
  }

  // 生成统计数据
  const generateStatsData = () => {
    // 统计过去30天的情绪分布
    const emotionCounts = emotions.reduce((acc, emotion) => {
      acc[emotion.name] = 0
      return acc
    }, {})

    // 统计过去7天的情绪变化
    const last7Days = []
    const emotionHistory = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayName = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
      last7Days.push(`周${dayName}`)
      
      if (emotionData[dateStr]) {
        // 给情绪赋值1-6的分数
        const emotionIndex = emotions.findIndex(e => e.name === emotionData[dateStr].emotion)
        emotionHistory.push(emotionIndex + 1)
        emotionCounts[emotionData[dateStr].emotion]++
      } else {
        emotionHistory.push(null)
      }
    }

    // 生成情绪趋势图表数据
    const trendData = {
      labels: last7Days,
      datasets: [
        {
          label: '情绪变化',
          data: emotionHistory,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 8,
          pointBackgroundColor: emotionHistory.map(val => 
            val ? emotions[val-1].color : 'transparent'
          )
        }
      ]
    }

    return { emotionCounts, trendData }
  }

  const selectedDateData = getSelectedDateData()
  const markedDates = generateMarkedDates()
  const { emotionCounts, trendData } = generateStatsData()

  const renderCalendarView = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={({ date }) => {
            const dateStr = date.toISOString().split('T')[0]
            return emotionData[dateStr] ? 'emotion-date' : ''
          }}
          locale="zh-CN"
          style={{
            width: '100%',
            maxWidth: '600px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        />
      </div>

      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>{selectedDate.toLocaleDateString('zh-CN')} 情绪记录</h3>
        {selectedDateData ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <span style={{ fontSize: '48px' }}>
                {emotions.find(e => e.name === selectedDateData.emotion)?.emoji}
              </span>
              <div>
                <h4>{selectedDateData.emotion}</h4>
                {selectedDateData.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {selectedDateData.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="tag"
                        style={{
                          backgroundColor: '#e0e0e0',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {selectedDateData.note && (
                  <p style={{ marginTop: '10px', color: '#666' }}>{selectedDateData.note}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '15px' }}>今天还没有记录情绪，点击下方情绪图标记录：</p>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {emotions.map((emotion) => (
                <button
                  key={emotion.name}
                  className="emotion-btn"
                  style={{
                    fontSize: '36px',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '10px',
                    borderRadius: '8px',
                    transition: 'background-color 0.3s'
                  }}
                  onClick={() => recordEmotion(emotion.name)}
                  title={emotion.name}
                >
                  {emotion.emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderStatsView = () => (
    <div>
      <div className="card" style={{ marginBottom: '30px' }}>
        <h3>情绪趋势</h3>
        <div style={{ height: '300px', marginBottom: '30px' }}>
          <Line 
            data={trendData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: '过去7天情绪变化' }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 6,
                  ticks: {
                    stepSize: 1,
                    callback: function(value) {
                      return value > 0 ? emotions[value-1]?.name : ''
                    }
                  }
                }
              }
            }} 
          />
        </div>
      </div>

      <div className="card">
        <h3>情绪分布统计</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
          {emotions.map((emotion) => {
            const count = emotionCounts[emotion.name] || 0
            const percentage = Math.round((count / 30) * 100) || 0
            
            return (
              <div key={emotion.name} className="stat-item" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '5px' }}>{emotion.emoji}</div>
                <div style={{ fontWeight: 'bold' }}>{emotion.name}</div>
                <div style={{ fontSize: '24px', color: emotion.color }}>{count}天</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{percentage}%</div>
                <div style={{ height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginTop: '10px' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${percentage}%`, 
                      backgroundColor: emotion.color,
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="emotion-calendar-page page-transition">
      <div className="container">
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回首页
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>情绪日历 (Emoji Mood Log)</h1>
          
          {/* 视图切换 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${currentView === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('calendar')}
            >
              日历视图
            </button>
            <button 
              className={`btn ${currentView === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCurrentView('stats')}
            >
              统计分析
            </button>
          </div>

          {/* 内容区域 */}
          {currentView === 'calendar' ? renderCalendarView() : renderStatsView()}

          {/* 图例说明 */}
          <div className="card" style={{ backgroundColor: '#f8f9fa', marginTop: '30px' }}>
            <h4>图例</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              {emotions.map((emotion) => (
                <div key={emotion.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{emotion.emoji}</span>
                  <span>{emotion.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmotionCalendarPage