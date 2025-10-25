import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import './PerceptualTherapyPage.css'
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

const PerceptualTherapyPage = () => {
  const [activeMode, setActiveMode] = useState('relaxation') // relaxation, sleep, focus
  const [currentState, setCurrentState] = useState('idle') // idle, detecting, alerting, therapy
  const [stressLevel, setStressLevel] = useState(30)
  const [attentionLevel, setAttentionLevel] = useState(70)
  const [interventionTime, setInterventionTime] = useState(60) // 秒
  const [remainingTime, setRemainingTime] = useState(60)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: '压力水平',
      data: [],
      borderColor: '#ff6b6b',
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      tension: 0.4,
      fill: true
    }]
  })
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [deviceStatus, setDeviceStatus] = useState('disconnected') // disconnected, connected
  const [isVibrating, setIsVibrating] = useState(false)
  const [lightMode, setLightMode] = useState('off') // off, blue, green, red, pulsing
  const [isAudioPlaying, setIsAudioPlaying] = useState(false)
  const [currentAudioType, setCurrentAudioType] = useState(null) // 当前播放的音频类型
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)

  // 伸展建议列表
  const stretchSuggestions = [
    "颈部放松：缓慢向左右两侧倾斜头部，每个方向保持15秒",
    "肩部舒展：双肩缓慢向上提起，保持5秒后放松，重复3次",
    "深呼吸练习：缓慢吸气5秒，屏息2秒，呼气7秒，重复5次",
    "手腕伸展：伸直手臂，轻轻下拉手指，保持10秒，换另一只手",
    "眼部放松：闭上双眼，手掌搓热后覆盖在眼睛上，感受温暖1分钟",
    "坐姿扭转：坐在椅子上，轻轻扭转腰部，保持10秒，换另一侧",
    "腿部伸展：双脚平放地面，膝盖微屈，身体前倾触碰脚尖10秒",
    "耸肩放松：肩膀快速上下耸动10次，然后完全放松"
  ]

  // 冥想音频列表
  const meditationAudios = [
    { name: '雨声冥想', duration: '15:00', type: 'rain' },
    { name: '森林鸟鸣', duration: '20:00', type: 'forest' },
    { name: '海洋波浪', duration: '30:00', type: 'ocean' },
    { name: '白噪音', duration: '45:00', type: 'whitenoise' },
    { name: '禅意钟声', duration: '10:00', type: 'bell' }
  ]

  // 呼吸训练步骤
  const breathingExercises = [
    { step: 1, instruction: '准备：挺直坐姿，放松肩膀', duration: 5 },
    { step: 2, instruction: '吸气：通过鼻子缓慢吸气4秒', duration: 4 },
    { step: 3, instruction: '屏息：保持呼吸2秒', duration: 2 },
    { step: 4, instruction: '呼气：通过嘴巴缓慢呼气6秒', duration: 6 },
    { step: 5, instruction: '休息：暂停1秒', duration: 1 }
  ]

  // 模拟设备连接
  useEffect(() => {
    // 模拟设备连接过程
    const connectTimer = setTimeout(() => {
      setDeviceStatus('connected')
    }, 1000)

    return () => clearTimeout(connectTimer)
  }, [])

  // 模拟数据监测
  useEffect(() => {
    let interval
    if (isMonitoring) {
      interval = setInterval(() => {
        // 生成模拟数据
        const newStressLevel = Math.max(0, Math.min(100, stressLevel + (Math.random() * 10 - 5)))
        const newAttentionLevel = Math.max(0, Math.min(100, attentionLevel + (Math.random() * 10 - 5)))
        
        setStressLevel(newStressLevel)
        setAttentionLevel(newAttentionLevel)
        
        // 更新图表数据
        setChartData(prev => {
          const labels = [...prev.labels]
          const data = [...prev.datasets[0].data]
          
          // 只保留最近50个数据点
          if (labels.length > 50) {
            labels.shift()
            data.shift()
          }
          
          const time = new Date().toLocaleTimeString('zh-CN', { minute: '2-digit', second: '2-digit' })
          labels.push(time)
          data.push(newStressLevel)
          
          return {
            ...prev,
            labels,
            datasets: [{
              ...prev.datasets[0],
              data
            }]
          }
        })
        
        // 检测状态变化并触发干预
        if (activeMode === 'relaxation' && newStressLevel > 70 && currentState === 'idle') {
          setCurrentState('alerting')
          setRemainingTime(interventionTime)
          // 触发设备震动和红灯提醒
          triggerDeviceAlert('stress')
        } else if (activeMode === 'focus' && newAttentionLevel < 40 && currentState === 'idle') {
          setCurrentState('alerting')
          setRemainingTime(interventionTime)
          // 触发设备震动和橙灯提醒
          triggerDeviceAlert('attention')
        } else if (activeMode === 'sleep' && newStressLevel > 50) {
          // 睡眠模式下检测到焦虑，自动播放白噪音
          playAudio('whitenoise')
          setCurrentAudioType('whitenoise')
        }
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isMonitoring, stressLevel, attentionLevel, currentState, activeMode, interventionTime])

  // 倒计时效果
  useEffect(() => {
    let timer
    if (currentState === 'therapy' && remainingTime > 0) {
      timer = setTimeout(() => {
        setRemainingTime(remainingTime - 1)
      }, 1000)
    } else if (remainingTime === 0) {
      setCurrentState('idle')
      setRemainingTime(interventionTime)
    }
    
    return () => clearTimeout(timer)
  }, [currentState, remainingTime, interventionTime])

  // 开始监测
  const startMonitoring = () => {
    setIsMonitoring(true)
    setCurrentState('detecting')
    setChartData({
      labels: [],
      datasets: [{
        label: activeMode === 'relaxation' ? '压力水平' : '注意力水平',
        data: [],
        borderColor: activeMode === 'relaxation' ? '#ff6b6b' : '#45b7d1',
        backgroundColor: activeMode === 'relaxation' ? 'rgba(255, 107, 107, 0.1)' : 'rgba(69, 183, 209, 0.1)',
        tension: 0.4,
        fill: true
      }]
    })
  }

  // 停止监测
  const stopMonitoring = () => {
    setIsMonitoring(false)
    setCurrentState('idle')
  }

  // 触发设备提醒
  const triggerDeviceAlert = (type) => {
    // 模拟设备震动
    setIsVibrating(true)
    setTimeout(() => setIsVibrating(false), 1000)
    
    // 根据类型设置灯光模式
    if (type === 'stress') {
      setLightMode('red')
    } else if (type === 'attention') {
      setLightMode('pulsing')
    }
    
    // 3秒后恢复灯光
    setTimeout(() => setLightMode('blue'), 3000)
  }
  
  // 播放音频
  const playAudio = (audioType) => {
    // 停止之前的音频
    stopAudio()
    
    try {
      // 创建音频上下文
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext
      
      // 根据不同类型创建不同的音频效果
      if (audioType === 'whitenoise') {
        // 白噪音生成
        const bufferSize = 2 * audioContext.sampleRate
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
        const data = buffer.getChannelData(0)
        
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1 // 生成-1到1之间的随机值
        }
        
        const source = audioContext.createBufferSource()
        source.buffer = buffer
        source.loop = true
        
        // 添加音量控制
        const gainNode = audioContext.createGain()
        gainNode.gain.value = 0.3
        
        source.connect(gainNode)
        gainNode.connect(audioContext.destination)
        source.start()
        
        oscillatorRef.current = source
      } else {
        // 简单的振荡器模拟其他音效
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        // 根据音频类型设置频率和波形
        switch (audioType) {
          case 'rain':
            oscillator.frequency.value = 1000
            oscillator.type = 'sine'
            break
          case 'forest':
            oscillator.frequency.value = 800
            oscillator.type = 'triangle'
            break
          case 'ocean':
            oscillator.frequency.value = 500
            oscillator.type = 'sine'
            break
          case 'bell':
            oscillator.frequency.value = 1200
            oscillator.type = 'sine'
            break
        }
        
        gainNode.gain.value = 0.2
        
        // 添加音量包络使其更自然
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.2, audioContext.currentTime + 0.1)
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        oscillator.start()
        
        oscillatorRef.current = oscillator
      }
      
      setIsAudioPlaying(true)
      setCurrentAudioType(audioType) // 设置当前播放的音频类型
    } catch (error) {
      console.error('音频播放失败:', error)
    }
  }
  
  // 停止音频
  const stopAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop()
      } catch (e) {
        // 忽略已停止的错误
      }
      oscillatorRef.current = null
    }
    
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close()
      } catch (e) {
        // 忽略关闭错误
      }
      audioContextRef.current = null
    }
    
    setIsAudioPlaying(false)
    setCurrentAudioType(null) // 清除当前播放的音频类型
  }
  
  // 开始干预
  const startIntervention = () => {
    setCurrentState('therapy')
    setRemainingTime(interventionTime)
    // 干预开始时，设备显示绿灯
    setLightMode('green')
  }

  // 取消干预
  const cancelIntervention = () => {
    setCurrentState('idle')
    setRemainingTime(interventionTime)
    // 恢复正常状态灯
    setLightMode('blue')
    // 停止音频
    stopAudio()
  }

  // 组件卸载时清理音频
  useEffect(() => {
    return () => {
      stopAudio()
    }
  }, [])
  
  // 渲染设备状态指示器
  const renderDeviceStatus = () => (
    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ fontSize: '24px' }}>⚡</div>
        <div>
          <h4 style={{ margin: 0 }}>设备状态</h4>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#666' }}>
            {deviceStatus === 'connected' ? '已连接并正常工作' : '正在连接...'}
          </p>
        </div>
      </div>
      
      {/* 设备灯光指示器 */}
      <div 
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: 
            lightMode === 'off' ? '#ccc' :
            lightMode === 'blue' ? '#0984e3' :
            lightMode === 'green' ? '#00b894' :
            lightMode === 'red' ? '#d63031' : '#fdcb6e',
          animation: lightMode === 'pulsing' ? 'pulse 1s infinite' : 'none'
        }}
      />
    </div>
  )
  
  // 渲染震动效果提示
  const renderVibrationEffect = () => {
    if (!isVibrating) return null
    
    return (
      <div className="vibration-alert" style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) scale(1.1)',
        backgroundColor: 'rgba(214, 48, 49, 0.9)',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '10px',
        fontWeight: 'bold',
        fontSize: '18px',
        zIndex: 1000,
        animation: 'shake 0.5s'
      }}>
        📳 设备震动提醒 - 请注意休息!
      </div>
    )
  }
  
  // 添加CSS样式
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 1; }
        100% { opacity: 0.6; }
      }
      @keyframes shake {
        0%, 100% { transform: translate(-50%, -50%) scale(1.1); }
        25% { transform: translate(-52%, -50%) scale(1.1); }
        75% { transform: translate(-48%, -50%) scale(1.1); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  // 渲染不同模式的内容
  const renderModeContent = () => {
    if (activeMode === 'relaxation') {
      return (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>当前压力水平</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: stressLevel > 70 ? '#d63031' : stressLevel > 40 ? '#fdcb6e' : '#00b894',
                border: `4px solid ${stressLevel > 70 ? '#d63031' : stressLevel > 40 ? '#fdcb6e' : '#00b894'}`
              }}>
                {stressLevel}%
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${stressLevel}%`, 
                      backgroundColor: stressLevel > 70 ? '#d63031' : stressLevel > 40 ? '#fdcb6e' : '#00b894',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  <span>低</span>
                  <span>中</span>
                  <span>高</span>
                </div>
              </div>
            </div>
          </div>
          
          {currentState === 'alerting' && (
            <div className="alert-card" style={{ backgroundColor: '#ffeaa7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: '#d63031', margin: '0 0 10px 0' }}>⚠️ 检测到高压力水平</h4>
              <p style={{ margin: '0 0 15px 0' }}>建议进行放松训练缓解压力</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={startIntervention}>开始60秒放松</button>
                <button className="btn btn-secondary" onClick={cancelIntervention}>稍后提醒</button>
              </div>
            </div>
          )}
          
          {currentState === 'therapy' && (
            <div className="therapy-card" style={{ backgroundColor: '#74b9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', color: 'white' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>60秒伸展建议</h4>
              <p style={{ fontSize: '18px', margin: '0 0 20px 0', fontStyle: 'italic' }}>
                {stretchSuggestions[Math.floor(Math.random() * stretchSuggestions.length)]}
              </p>
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{remainingTime}</div>
                <p>秒</p>
              </div>
              <button className="btn btn-light" onClick={cancelIntervention}>提前结束</button>
            </div>
          )}
        </div>
      )
    } else if (activeMode === 'sleep') {
      return (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>睡前焦虑干预</h3>
            <p>选择一个冥想音频帮助您入睡，系统会自动监测焦虑水平并播放助眠音乐</p>
            
            {/* 自动播放状态 */}
            {isAudioPlaying && (
              <div style={{ 
                backgroundColor: '#74b9ff', 
                color: 'white', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>🎵 正在播放助眠音频</strong>
                  <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>系统检测到焦虑情绪，已自动开始播放</p>
                </div>
                <button 
                  className="btn btn-light btn-sm"
                  onClick={stopAudio}
                >
                  停止播放
                </button>
              </div>
            )}
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {meditationAudios.map((audio, index) => (
                <button 
                  key={index} 
                  className={`btn ${isAudioPlaying && audio.type === currentAudioType ? 'btn-primary' : 'btn-outline-secondary'}`} 
                  style={{ textAlign: 'left', padding: '15px', display: 'flex', justifyContent: 'space-between' }}
                  onClick={() => playAudio(audio.type)}
                >
                  <span>{audio.name}</span>
                  <span>{audio.duration}</span>
                </button>
              ))}
            </div>
            <div className="card" style={{ backgroundColor: '#f8f9fa' }}>
              <h4>智能干预说明</h4>
              <ul>
                <li>系统会自动监测您的焦虑水平</li>
                <li>当检测到睡前焦虑时，将自动播放白噪音</li>
                <li>设备会发出柔和的蓝光，营造舒适睡眠环境</li>
                <li>您也可以手动选择喜欢的助眠音频</li>
                <li>建议在睡前30分钟开启此功能</li>
              </ul>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3>当前注意力水平</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
              <div style={{ 
                width: '100px', 
                height: '100px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: attentionLevel > 70 ? '#00b894' : attentionLevel > 40 ? '#fdcb6e' : '#d63031',
                border: `4px solid ${attentionLevel > 70 ? '#00b894' : attentionLevel > 40 ? '#fdcb6e' : '#d63031'}`
              }}>
                {attentionLevel}%
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${attentionLevel}%`, 
                      backgroundColor: attentionLevel > 70 ? '#00b894' : attentionLevel > 40 ? '#fdcb6e' : '#d63031',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  <span>低</span>
                  <span>中</span>
                  <span>高</span>
                </div>
              </div>
            </div>
          </div>
          
          {currentState === 'alerting' && (
            <div className="alert-card" style={{ backgroundColor: '#ffeaa7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
              <h4 style={{ color: '#d63031', margin: '0 0 10px 0' }}>⚠️ 检测到注意力分散</h4>
              <p style={{ margin: '0 0 15px 0' }}>建议进行呼吸训练重新集中注意力</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-primary" onClick={startIntervention}>开始呼吸训练</button>
                <button className="btn btn-secondary" onClick={cancelIntervention}>稍后提醒</button>
              </div>
            </div>
          )}
          
          {currentState === 'therapy' && (
            <div className="therapy-card" style={{ backgroundColor: '#74b9ff', padding: '20px', borderRadius: '8px', marginBottom: '20px', color: 'white' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>呼吸训练</h4>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
                  {breathingExercises[Math.floor((interventionTime - remainingTime) / 18) % breathingExercises.length]?.instruction || ''}
                </p>
                <div style={{ fontSize: '48px' }}>{remainingTime}</div>
              </div>
              <button className="btn btn-light" onClick={cancelIntervention}>提前结束</button>
            </div>
          )}
        </div>
      )
    }
  }

  return (
      <div className="perceptual-therapy-page page-transition">
      {renderVibrationEffect()}
      
      <div className="container">
        <Link to="/therapy" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回调节页面
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '20px' }}>感知式治疗辅助</h1>
          
          {/* 设备状态显示 */}
          {renderDeviceStatus()}
          
          {/* 功能说明 */}
          <div className="card" style={{ backgroundColor: '#f8f9fa', marginBottom: '20px', padding: '15px' }}>
            <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
              <strong>💡 功能说明：</strong>本功能通过脑电波监测识别紧张或焦虑情绪，当检测到时设备会震动并亮灯提醒，同时提供放松建议或自动播放助眠音乐。
            </p>
          </div>
          
          {/* 模式切换 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${activeMode === 'relaxation' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveMode('relaxation')
                stopMonitoring()
              }}
            >
              紧张提醒
            </button>
            <button 
              className={`btn ${activeMode === 'sleep' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveMode('sleep')
                stopMonitoring()
              }}
            >
              睡前焦虑干预
            </button>
            <button 
              className={`btn ${activeMode === 'focus' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setActiveMode('focus')
                stopMonitoring()
              }}
            >
              专注模式
            </button>
          </div>

          {/* 监测控制 */}
          {(activeMode === 'relaxation' || activeMode === 'focus') && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
              <button 
                className={`btn ${isMonitoring ? 'btn-danger' : 'btn-success'}`}
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                disabled={deviceStatus !== 'connected'}
              >
                {isMonitoring ? '停止监测' : '开始监测'}
              </button>
            </div>
          )}

          {/* 数据可视化 */}
          {(activeMode === 'relaxation' || activeMode === 'focus') && (
            <div style={{ height: '200px', marginBottom: '20px' }}>
              {chartData.labels.length > 0 && (
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: true },
                      title: { display: true, text: activeMode === 'relaxation' ? '压力水平变化' : '注意力水平变化' }
                    },
                    scales: {
                      y: { beginAtZero: true, max: 100 }
                    }
                  }} 
                />
              )}
            </div>
          )}

          {/* 模式内容 */}
          {renderModeContent()}
        </div>
      </div>
    </div>
  )
}

export default PerceptualTherapyPage