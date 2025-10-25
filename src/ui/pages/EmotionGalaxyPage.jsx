import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

const EmotionGalaxyPage = () => {
  const [galaxyData, setGalaxyData] = useState([])
  const [selectedEmotion, setSelectedEmotion] = useState(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [viewMode, setViewMode] = useState('single') // single, evolution
  const [selectedDate, setSelectedDate] = useState(new Date())
  const canvasRef = useRef(null)

  // 情绪类型定义
  const emotionTypes = [
    { name: '愉悦', color: '#ff6b6b', symbol: '😊' },
    { name: '平静', color: '#4ecdc4', symbol: '😌' },
    { name: '专注', color: '#45b7d1', symbol: '🤔' },
    { name: '放松', color: '#96ceb4', symbol: '😇' },
    { name: '紧张', color: '#ffeaa7', symbol: '😰' },
    { name: '焦虑', color: '#dda0dd', symbol: '😟' }
  ]

  // 生成单次测量的情绪星云数据
  useEffect(() => {
    if (viewMode === 'single') {
      generateSingleMeasurementGalaxy()
    } else {
      generateEvolutionGalaxy()
    }
  }, [viewMode, selectedDate])

  // 渲染星云图
  useEffect(() => {
    if (galaxyData.length === 0 || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // 设置画布尺寸
    const resizeCanvas = () => {
      const container = canvas.parentElement
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    // 绘制星云
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      galaxyData.forEach(star => {
        // 计算星星在画布上的位置
        const x = (star.x * zoomLevel) + canvas.width / 2
        const y = (star.y * zoomLevel) + canvas.height / 2
        
        // 计算亮度和大小
        const brightness = star.opacity * (1 - Math.abs(star.x) / 70) * (1 - Math.abs(star.y) / 70)
        const size = star.size * zoomLevel * brightness
        
        if (brightness > 0.1) {
          // 绘制星星光晕
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3)
          gradient.addColorStop(0, star.color + 'FF')
          gradient.addColorStop(0.3, star.color + '80')
          gradient.addColorStop(1, star.color + '00')
          
          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(x, y, size * 3, 0, Math.PI * 2)
          ctx.fill()
          
          // 绘制星星核心
          ctx.beginPath()
          ctx.fillStyle = star.color
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      })
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [galaxyData, zoomLevel])

  // 生成单次测量的星云数据
  const generateSingleMeasurementGalaxy = () => {
    const stars = []
    const centerEmotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)]
    
    // 创建中心星团（主导情绪）
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 20
      
      stars.push({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: Math.random() * 3 + 2,
        color: centerEmotion.color,
        opacity: Math.random() * 0.5 + 0.5,
        type: centerEmotion.name,
        symbol: centerEmotion.symbol
      })
    }
    
    // 创建周围弥散的其他情绪星星
    emotionTypes.forEach(emotion => {
      const count = Math.floor(Math.random() * 20) + 5
      const radius = Math.random() * 30 + 40
      
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const distance = radius + Math.random() * 20
        
        stars.push({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          size: Math.random() * 2 + 1,
          color: emotion.color,
          opacity: Math.random() * 0.4 + 0.1,
          type: emotion.name,
          symbol: emotion.symbol
        })
      }
    })
    
    setGalaxyData(stars)
  }
  
  // 生成情绪演化星系数据
  const generateEvolutionGalaxy = () => {
    const stars = []
    
    // 模拟过去30天的情绪演化
    for (let day = 0; day < 30; day++) {
      const dayOffset = day * 5 // 每天偏移5个单位
      
      // 每天生成一些情绪星星
      const dailyEmotions = Math.floor(Math.random() * 15) + 10
      
      for (let i = 0; i < dailyEmotions; i++) {
        const emotion = emotionTypes[Math.floor(Math.random() * emotionTypes.length)]
        const angle = Math.random() * Math.PI * 2
        const distance = Math.random() * 30
        
        stars.push({
          x: Math.cos(angle) * distance + dayOffset,
          y: Math.sin(angle) * distance + (Math.random() * 10 - 5), // 轻微上下波动
          size: Math.random() * 2 + 1,
          color: emotion.color,
          opacity: Math.random() * 0.4 + 0.1,
          type: emotion.name,
          symbol: emotion.symbol,
          day: 30 - day
        })
      }
    }
    
    setGalaxyData(stars)
  }

  // 处理画布点击事件
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left - canvas.width / 2
    const y = e.clientY - rect.top - canvas.height / 2
    
    // 转换为星云中的坐标
    const galaxyX = x / zoomLevel
    const galaxyY = y / zoomLevel
    
    // 查找点击的星星
    const clickedStar = galaxyData.find(star => {
      const distance = Math.sqrt(
        Math.pow(star.x - galaxyX, 2) + Math.pow(star.y - galaxyY, 2)
      )
      return distance < star.size * 3
    })
    
    if (clickedStar) {
      setSelectedEmotion(clickedStar)
    } else {
      setSelectedEmotion(null)
    }
  }

  // 处理缩放
  const handleZoom = (factor) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(3, prev * factor)))
  }

  // 重置视图
  const resetView = () => {
    setZoomLevel(1)
    setSelectedEmotion(null)
  }

  return (
    <div className="emotion-galaxy-page page-transition">
      <div className="container">
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回首页
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>情绪可视化 (Emotion Galaxy)</h1>
          
          {/* 视图模式切换 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${viewMode === 'single' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('single')}
            >
              单次测量星云
            </button>
            <button 
              className={`btn ${viewMode === 'evolution' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('evolution')}
            >
              情绪演化星系
            </button>
          </div>

          {/* 画布容器 */}
          <div style={{ 
            height: '500px', 
            position: 'relative',
            backgroundColor: '#0a0a1a',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '20px'
          }}>
            <canvas 
              ref={canvasRef} 
              onClick={handleCanvasClick} 
              style={{ cursor: 'crosshair', width: '100%', height: '100%' }}
            />
            
            {/* 缩放控制 */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px'
            }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleZoom(1.2)}
                style={{ width: '36px', height: '36px', padding: 0 }}
                title="放大"
              >
                +
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => handleZoom(0.8)}
                style={{ width: '36px', height: '36px', padding: 0 }}
                title="缩小"
              >
                -
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={resetView}
                style={{ width: '36px', height: '36px', padding: 0 }}
                title="重置视图"
              >
                ↺
              </button>
            </div>
            
            {/* 当前缩放等级显示 */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              缩放: {(zoomLevel * 100).toFixed(0)}%
            </div>
          </div>

          {/* 情绪详情卡片 */}
          {selectedEmotion && (
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3>情绪详情</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '36px' }}>{selectedEmotion.symbol}</span>
                <div>
                  <p><strong>情绪类型：</strong>{selectedEmotion.type}</p>
                  <p><strong>情绪强度：</strong>{Math.round(selectedEmotion.opacity * 100)}%</p>
                  {selectedEmotion.day && (
                    <p><strong>记录天数：</strong>{selectedEmotion.day}天前</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 图例说明 */}
          <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
            <h3>图例说明</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
              {emotionTypes.map((emotion, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div 
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: emotion.color,
                      borderRadius: '50%',
                      boxShadow: `0 0 10px ${emotion.color}`
                    }}
                  />
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {emotion.symbol} {emotion.name}
                  </span>
                </div>
              ))}
            </div>
            <p><strong>使用说明：</strong></p>
            <ul>
              <li>点击星云中的任何星点可查看该情绪的详细信息</li>
              <li>使用右下角的控制按钮进行缩放和重置视图</li>
              <li>情绪星云图中，星点的大小表示情绪强度，亮度表示活跃程度</li>
              <li>情绪演化星系展示了过去30天的情绪变化轨迹</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmotionGalaxyPage