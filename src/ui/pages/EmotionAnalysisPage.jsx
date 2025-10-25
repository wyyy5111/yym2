import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import './EmotionAnalysisPage.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
} from 'chart.js'
// import ReactWordcloud from 'react-wordcloud' // 暂时注释以解决兼容性问题

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement
)

const EmotionAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('emotionCurve')
  const [galaxyData, setGalaxyData] = useState([])

  // 生成情绪曲线数据
  const generateEmotionCurveData = () => {
    const hours = []
    const emotions = {
      愉悦: [],
      平静: [],
      专注: [],
      放松: [],
      紧张: [],
      焦虑: []
    }

    for (let i = 0; i < 24; i++) {
      hours.push(`${i}:00`)
      emotions['愉悦'].push(Math.random() * 30)
      emotions['平静'].push(Math.random() * 40)
      emotions['专注'].push(Math.random() * 35)
      emotions['放松'].push(Math.random() * 25)
      emotions['紧张'].push(Math.random() * 20)
      emotions['焦虑'].push(Math.random() * 15)
    }

    const datasets = Object.entries(emotions).map(([name, data], index) => {
      const colors = [
        '#ff6b6b', '#4ecdc4', '#45b7d1', 
        '#96ceb4', '#ffeaa7', '#dda0dd'
      ]
      
      return {
        label: name,
        data,
        borderColor: colors[index],
        backgroundColor: colors[index] + '20',
        tension: 0.4,
        fill: false
      }
    })

    return { labels: hours, datasets }
  }

  // 生成情绪词云数据
  const generateWordCloudData = () => {
    const words = [
      { text: '平静', value: 30 },
      { text: '专注', value: 25 },
      { text: '放松', value: 20 },
      { text: '愉悦', value: 18 },
      { text: '思考', value: 15 },
      { text: '冥想', value: 12 },
      { text: '学习', value: 10 },
      { text: '工作', value: 8 },
      { text: '休息', value: 7 },
      { text: '阅读', value: 6 },
      { text: '创作', value: 5 },
      { text: '紧张', value: 4 },
      { text: '焦虑', value: 3 },
      { text: '压力', value: 2 }
    ]

    return words
  }

  // 生成情绪星云图数据
  useEffect(() => {
    const generateGalaxy = () => {
      const stars = []
      const emotionTypes = [
        { name: '愉悦', color: '#ff6b6b' },
        { name: '平静', color: '#4ecdc4' },
        { name: '专注', color: '#45b7d1' },
        { name: '放松', color: '#96ceb4' },
        { name: '紧张', color: '#ffeaa7' },
        { name: '焦虑', color: '#dda0dd' }
      ]

      for (let i = 0; i < 100; i++) {
        const emotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)]
        const intensity = Math.random() * 0.8 + 0.2
        
        stars.push({
          x: Math.random() * 100 - 50,
          y: Math.random() * 100 - 50,
          size: Math.random() * 5 + 2,
          color: emotion.color,
          opacity: intensity,
          type: emotion.name
        })
      }

      setGalaxyData(stars)
    }

    generateGalaxy()
  }, [])

  const options = {
    rotations: 2,
    rotationAngles: [0, 90],
    fontSizes: [15, 50],
    fontSize: (word) => Math.log2(word.value) * 5 + 10,
    fontWeight: 400,
    fontFamily: 'Arial, sans-serif'
  }

  const emotionCurveData = generateEmotionCurveData()
  const wordCloudData = generateWordCloudData()

  // 获取随机颜色函数
  const getRandomColor = () => {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a']
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const renderEmotionCurve = () => (
    <div className="tab-content">
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Line data={emotionCurveData} options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: '情绪变化曲线' }
          },
          scales: {
            y: { beginAtZero: true, max: 100 }
          }
        }} />
      </div>
      <div className="card">
        <h3>数据分析</h3>
        <p>从情绪曲线可以看出，您在一天中情绪变化相对平稳，平静和专注是主要的情绪状态。</p>
        <p>建议在情绪较低的时段（如下午3-4点）进行短暂的休息和放松活动。</p>
        <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
      </div>
    </div>
  )

  const renderWordCloud = () => (
    <div className="tab-content">
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
      }}>
        {wordCloudData.length > 0 ? (
          wordCloudData.map((word, index) => (
            <span
              key={index}
              style={{
                fontSize: `${word.value / 2}px`,
                margin: '5px',
                padding: '5px 10px',
                backgroundColor: getRandomColor(),
                color: 'white',
                borderRadius: '4px',
                opacity: 0.8
              }}
            >
              {word.text}
            </span>
          ))
        ) : (
          <p>暂无词云数据</p>
        )}
      </div>
      <div className="card">
        <h3>情绪关键词分析</h3>
        <p>词云中的关键词反映了您的主要情绪状态，字体大小表示该情绪的强度。</p>
        <p>您的主要积极情绪为平静和专注，建议继续保持当前的生活和工作节奏。</p>
        <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
      </div>
    </div>
  )

  const renderEmotionGalaxy = () => (
    <div className="tab-content">
      <div style={{ 
        height: '500px', 
        position: 'relative',
        backgroundColor: '#0a0a1a',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        {galaxyData.map((star, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${star.x + 50}%`,
              top: `${star.y + 50}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              backgroundColor: star.color,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px ${star.size}px ${star.color}40`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer'
            }}
            title={`${star.type} - 强度: ${Math.round(star.opacity * 100)}%`}
          />
        ))}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          color: 'white',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(255,255,255,0.8)'
        }}>
          情绪星云图
        </div>
      </div>
      <div className="card">
        <h3>星云图解读</h3>
        <p>情绪星云图展示了您长期的情绪分布情况，每个星点代表一个情绪状态。</p>
        <p>星点的颜色表示情绪类型，大小和亮度表示情绪强度，位置反映情绪的关联程度。</p>
        <p>您的情绪星云分布相对均匀，表明情绪状态多样化且平衡。</p>
        <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
      </div>
    </div>
  )

  return (
    <div className="emotion-analysis-page page-transition">
      <div className="container">
        <Link to="/analysis" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回分析
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>情绪分析系统</h1>
          
          {/* 标签页切换 */}
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'emotionCurve' ? 'active' : ''}`}
              onClick={() => setActiveTab('emotionCurve')}
            >
              情绪曲线
            </button>
            <button 
              className={`tab-btn ${activeTab === 'wordCloud' ? 'active' : ''}`}
              onClick={() => setActiveTab('wordCloud')}
            >
              情绪词云
            </button>
            <button 
              className={`tab-btn ${activeTab === 'emotionGalaxy' ? 'active' : ''}`}
              onClick={() => setActiveTab('emotionGalaxy')}
            >
              情绪星云图
            </button>
          </div>

          {/* 内容区域 */}
          {activeTab === 'emotionCurve' && renderEmotionCurve()}
          {activeTab === 'wordCloud' && renderWordCloud()}
          {activeTab === 'emotionGalaxy' && renderEmotionGalaxy()}
        </div>
      </div>
    </div>
  )
}

export default EmotionAnalysisPage