import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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
import './RealTimeMonitoringPage.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const RealTimeMonitoringPage = () => {
  const [eegData, setEegData] = useState([])
  const [attention, setAttention] = useState(50)
  const [emotion, setEmotion] = useState('平静')
  const [signalQuality, setSignalQuality] = useState('良好')
  const [recording, setRecording] = useState(false)
  const [recordingStartTime, setRecordingStartTime] = useState(null)
  const canvasRef = useRef(null)

  // 模拟脑电数据生成
  useEffect(() => {
    let interval
    const labels = []
    const data = []
    let time = 0

    if (recording || true) { // 默认一直显示波形
      interval = setInterval(() => {
        // 生成模拟EEG数据
        const newDataPoint = Math.sin(time * 0.1) * 20 + Math.random() * 10 - 5
        
        labels.push('')
        data.push(newDataPoint)
        
        // 保持数据点数量在200个以内
        if (labels.length > 200) {
          labels.shift()
          data.shift()
        }

        time++
        setEegData({ labels, datasets: [{ data, borderColor: '#667eea', tension: 0.4 }] })
        
        // 更新注意力指数
        setAttention(prev => Math.max(0, Math.min(100, prev + (Math.random() - 0.5) * 5)))
        
        // 随机更新情绪状态
        if (Math.random() > 0.95) {
          const emotions = ['愉悦', '平静', '专注', '放松', '紧张', '焦虑']
          setEmotion(emotions[Math.floor(Math.random() * emotions.length)])
        }
        
        // 随机更新信号质量
        if (Math.random() > 0.97) {
          const qualities = ['良好', '良好', '良好', '良好', '一般', '较差']
          setSignalQuality(qualities[Math.floor(Math.random() * qualities.length)])
        }
      }, 100)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [recording])

  const startRecording = () => {
    setRecording(true)
    setRecordingStartTime(new Date())
  }

  const stopRecording = () => {
    setRecording(false)
    // 模拟保存记录
    alert('记录已保存！可以在历史记录中查看。')
  }

  const getEmotionColor = (emotion) => {
    const colorMap = {
      '愉悦': '#ff6b6b',
      '平静': '#4ecdc4',
      '专注': '#45b7d1',
      '放松': '#96ceb4',
      '紧张': '#ffeaa7',
      '焦虑': '#dda0dd'
    }
    return colorMap[emotion] || '#666'
  }

  const getSignalQualityColor = (quality) => {
    const colorMap = {
      '良好': '#4caf50',
      '一般': '#ff9800',
      '较差': '#f44336'
    }
    return colorMap[quality] || '#666'
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      x: { display: false },
      y: {
        display: false,
        min: -40,
        max: 40
      }
    },
    elements: {
      point: { radius: 0 },
      line: { borderWidth: 2 }
    }
  }

  return (
    <div className="real-time-monitoring-page page-transition">
      <div className="container">
        <Link to="/record" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回记录
        </Link>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>实时数据监测</h1>
          
          {/* 信号质量提示 */}
          <div style={{ 
            padding: '12px', 
            backgroundColor: getSignalQualityColor(signalQuality) + '20',
            borderRadius: '8px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '1.5rem' }}>
                {signalQuality === '良好' ? '✅' : signalQuality === '一般' ? '⚠️' : '❌'}
              </div>
              <div>
                <strong>连接状态：</strong>
                <span style={{ color: getSignalQualityColor(signalQuality), marginLeft: '8px' }}>
                  {signalQuality === '良好' ? '设备已连接' : 
                   signalQuality === '一般' ? '信号较弱' : '连接不稳定'}
                </span>
              </div>
            </div>
            {signalQuality !== '良好' && (
              <span style={{ color: getSignalQualityColor(signalQuality), fontSize: '0.9rem' }}>
                请检查设备佩戴
              </span>
            )}
          </div>
        </div>

        {/* 脑电波形显示 */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '20px' }}>实时脑电波形</h3>
          <div style={{ height: '200px', width: '100%' }}>
            {eegData.labels && (
              <Line ref={canvasRef} data={eegData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* 实时指标卡片 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
          {/* 注意力指数 */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>注意力指数</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#667eea' }}>
                {Math.round(attention)}
                <span style={{ fontSize: '1.5rem', marginLeft: '4px' }}>%</span>
              </div>
              <div>
                <div style={{ fontSize: '3rem' }}>🎯</div>
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div style={{ width: '100%', height: '10px', background: '#e0e0e0', borderRadius: '5px', overflow: 'hidden' }}>
                <div 
                  style={{
                    width: `${attention}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.9rem', color: '#666' }}>
                {attention >= 80 ? '高度专注' : attention >= 60 ? '中度专注' : attention >= 40 ? '一般' : '需要集中'}
              </p>
            </div>
          </div>

          {/* 情绪状态 */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>情绪状态</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: getEmotionColor(emotion) }}>
                {emotion}
              </div>
              <div style={{ fontSize: '3rem' }}>
                {emotion === '愉悦' ? '😊' :
                 emotion === '平静' ? '😌' :
                 emotion === '专注' ? '🤔' :
                 emotion === '放松' ? '😇' :
                 emotion === '紧张' ? '😰' : '😟'}
              </div>
            </div>
            <div style={{ marginTop: '16px' }}>
              <div 
                style={{
                  width: '100%',
                  height: '4px',
                  backgroundColor: getEmotionColor(emotion),
                  borderRadius: '2px'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* 记录控制按钮 */}
        <div className="card" style={{ textAlign: 'center' }}>
          {!recording ? (
            <button className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '18px' }} onClick={startRecording}>
              📊 开始记录
            </button>
          ) : (
            <div>
              <p style={{ marginBottom: '16px' }}>
                记录时间：{(new Date() - recordingStartTime) / 1000} 秒
              </p>
              <button className="btn" style={{ padding: '16px 48px', fontSize: '18px', backgroundColor: '#f44336', color: 'white' }} onClick={stopRecording}>
                ⏹️ 停止记录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RealTimeMonitoringPage