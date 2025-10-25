import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './MindSymphonyPage.css'
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

const MindSymphonyPage = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [audioData, setAudioData] = useState([])
  const [brainwaveData, setBrainwaveData] = useState([])
  const [selectedInstruments, setSelectedInstruments] = useState({
    alpha: true, // α波弦乐
    betaLow: true, // β波低频-打击乐
    betaHigh: true // β波高频-管乐
  })
  const [emotionIntensity, setEmotionIntensity] = useState(50)
  const audioContextRef = useRef(null)
  const oscillatorsRef = useRef({})
  const gainNodesRef = useRef({})

  // 初始化音频上下文
  useEffect(() => {
    if (window.AudioContext) {
      audioContextRef.current = new window.AudioContext()
    } else if (window.webkitAudioContext) {
      audioContextRef.current = new window.webkitAudioContext()
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // 模拟脑电波数据生成 - 不同脑区活动
  useEffect(() => {
    let interval
    if (isPlaying) {
      interval = setInterval(() => {
        // 生成不同频段的脑电波数据
        const newData = {
          timestamp: Date.now(),
          // α波 (8-12Hz) - 弦乐声部 (枕叶)
          alpha: Math.sin(Date.now() / 1000) * 20 + 30 + Math.random() * 10,
          // β波低频 (13-20Hz) - 打击乐声部 (顶叶)
          betaLow: Math.sin(Date.now() / 500) * 15 + 25 + Math.random() * 15,
          // β波高频 (20-30Hz) - 管乐声部 (额叶)
          betaHigh: Math.sin(Date.now() / 400) * 20 + 30 + Math.random() * 10,
          emotion: Math.random() * 100
        }
        
        setBrainwaveData(prev => {
          const updated = [...prev, newData]
          // 只保留最近100个数据点
          return updated.length > 100 ? updated.slice(-100) : updated
        })
        
        setEmotionIntensity(Math.round(newData.emotion))
        
        // 根据脑电波数据生成音乐
        generateMusicFromBrainwaves(newData)
      }, 100)
    }

    return () => clearInterval(interval)
  }, [isPlaying])
  
  // 根据脑电波数据生成音乐
  const generateMusicFromBrainwaves = (data) => {
    if (!audioContextRef.current || !isPlaying) return
    
    // 根据情绪强度调整音量和节奏
    const baseVolume = emotionIntensity / 100 * 0.2 // 进一步降低音量，为更丰富的音色留出空间
    const tempoMultiplier = 0.6 + (emotionIntensity / 100 * 0.4) // 调整节奏范围 0.6-1.0
    
    // 音符约束函数 - 将频率限制在合理的音符范围内
    const constrainToMusicalNotes = (baseFreq, variation) => {
      // 定义一个包含自然音阶音符频率的数组 (基于A4=440Hz)
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33, 659.25];
      
      // 根据基础频率选择最接近的音符
      let nearestNote = notes.reduce((prev, curr) => 
        Math.abs(curr - baseFreq) < Math.abs(prev - baseFreq) ? curr : prev
      );
      
      // 根据变化值在音符之间平滑过渡
      const noteIndex = notes.indexOf(nearestNote);
      const indexShift = Math.floor((variation / 100) * 3); // 最多移动3个音符
      const newIndex = Math.max(0, Math.min(notes.length - 1, noteIndex + indexShift));
      
      return notes[newIndex];
    };
    
    // α波 (小提琴音色 - 改进版)
    if (selectedInstruments.alpha) {
      const alphaFreq = constrainToMusicalNotes(440, data.alpha);
      playViolin(alphaFreq, baseVolume * (data.alpha / 100), tempoMultiplier)
    }
    
    // β波低频 (钢琴音色 - 替换打击乐)
    if (selectedInstruments.betaLow) {
      const pianoVolume = baseVolume * (data.betaLow / 100) * 1.5
      // 添加动态阈值，使音乐更加自然
      const dynamicThreshold = 0.06 + (emotionIntensity / 100 * 0.04)
      if (pianoVolume > dynamicThreshold) {
        const pianoFreq = constrainToMusicalNotes(110, data.betaLow); // 低八度的钢琴
        playPiano(pianoFreq, pianoVolume, tempoMultiplier)
      }
    }
    
    // β波高频 (长笛音色 - 改进版)
    if (selectedInstruments.betaHigh) {
      const betaHighFreq = constrainToMusicalNotes(523.25, data.betaHigh);
      playFlute(betaHighFreq, baseVolume * (data.betaHigh / 100), tempoMultiplier)
    }
  }
  
  // 播放小提琴音色 - 高级实现
  const playViolin = (frequency, volume, tempoMultiplier) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return
    
    // 停止之前的声音
    if (oscillatorsRef.current['violin']) {
      oscillatorsRef.current['violin'].stop()
    }
    if (oscillatorsRef.current['violinHarmonic']) {
      oscillatorsRef.current['violinHarmonic'].stop()
    }
    if (gainNodesRef.current['violin']) {
      gainNodesRef.current['violin'].disconnect()
    }
    
    // 创建主振荡器 (基频)
    const mainOsc = audioContext.createOscillator()
    // 创建谐波振荡器
    const harmonicOsc = audioContext.createOscillator()
    // 创建增益节点
    const mainGain = audioContext.createGain()
    const harmonicGain = audioContext.createGain()
    const masterGain = audioContext.createGain()
    // 创建滤波器
    const filter1 = audioContext.createBiquadFilter()
    const filter2 = audioContext.createBiquadFilter()
    
    // 设置音色参数
    mainOsc.type = 'triangle'
    mainOsc.frequency.setValueAtTime(frequency, audioContext.currentTime)
    
    // 谐波振荡器 - 模拟小提琴的泛音
    harmonicOsc.type = 'sine'
    harmonicOsc.frequency.setValueAtTime(frequency * 3.5, audioContext.currentTime) // 3.5倍频率模拟小提琴特色谐波
    
    // 设置滤波器 - 多频段滤波模拟小提琴共鸣
    filter1.type = 'lowpass'
    filter1.frequency.setValueAtTime(3200, audioContext.currentTime)
    filter1.Q.setValueAtTime(1.5, audioContext.currentTime)
    
    filter2.type = 'peaking'
    filter2.frequency.setValueAtTime(2500, audioContext.currentTime)
    filter2.Q.setValueAtTime(2.0, audioContext.currentTime)
    filter2.gain.setValueAtTime(3.0, audioContext.currentTime) // 提升2.5kHz频段
    
    // 音量包络 - 小提琴特有的音色包络
    const now = audioContext.currentTime
    const attackTime = 0.03 * tempoMultiplier // 快速起音
    const decayTime = 0.2 * tempoMultiplier
    const sustainLevel = volume * 0.65
    const releaseTime = 0.8 * tempoMultiplier // 较长的释放时间
    
    // 主音增益包络
    mainGain.gain.setValueAtTime(0, now)
    mainGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), now + attackTime)
    mainGain.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel), now + attackTime + decayTime)
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)
    
    // 谐波增益包络 - 稍微延迟和减弱
    harmonicGain.gain.setValueAtTime(0, now)
    harmonicGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.25), now + attackTime + 0.02)
    harmonicGain.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel * 0.2), now + attackTime + decayTime)
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)
    
    // 主音量控制
    masterGain.gain.setValueAtTime(1.0, now)
    
    // 连接音频节点
    mainOsc.connect(mainGain)
    harmonicOsc.connect(harmonicGain)
    mainGain.connect(filter1)
    harmonicGain.connect(filter1)
    filter1.connect(filter2)
    filter2.connect(masterGain)
    masterGain.connect(audioContext.destination)
    
    // 保存引用
    oscillatorsRef.current['violin'] = mainOsc
    oscillatorsRef.current['violinHarmonic'] = harmonicOsc
    gainNodesRef.current['violin'] = masterGain
    
    // 启动声音
    mainOsc.start()
    harmonicOsc.start()
    mainOsc.stop(now + attackTime + decayTime + releaseTime + 0.1)
    harmonicOsc.stop(now + attackTime + decayTime + releaseTime + 0.1)
  }
  
  // 播放长笛音色 - 高级实现
  const playFlute = (frequency, volume, tempoMultiplier) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return
    
    // 停止之前的声音
    if (oscillatorsRef.current['flute']) {
      oscillatorsRef.current['flute'].stop()
    }
    if (oscillatorsRef.current['fluteNoise']) {
      oscillatorsRef.current['fluteNoise'].stop()
    }
    if (gainNodesRef.current['flute']) {
      gainNodesRef.current['flute'].disconnect()
    }
    
    // 创建主振荡器 (基频)
    const mainOsc = audioContext.createOscillator()
    // 创建噪声源模拟呼吸声
    const noiseGen = audioContext.createBufferSource()
    // 创建增益节点
    const mainGain = audioContext.createGain()
    const noiseGain = audioContext.createGain()
    const masterGain = audioContext.createGain()
    // 创建滤波器
    const filter1 = audioContext.createBiquadFilter()
    const filter2 = audioContext.createBiquadFilter()
    const noiseFilter = audioContext.createBiquadFilter()
    
    // 设置音色参数
    mainOsc.type = 'sine' // 长笛主要是正弦波
    mainOsc.frequency.setValueAtTime(frequency, audioContext.currentTime)
    
    // 创建噪声缓冲区模拟呼吸声
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    for (let i = 0; i < noiseBuffer.length; i++) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.5
    }
    noiseGen.buffer = noiseBuffer
    noiseGen.loop = true
    
    // 设置滤波器 - 模拟长笛共鸣
    filter1.type = 'bandpass'
    filter1.frequency.setValueAtTime(frequency * 1.2, audioContext.currentTime)
    filter1.Q.setValueAtTime(1.0, audioContext.currentTime)
    
    filter2.type = 'highpass'
    filter2.frequency.setValueAtTime(frequency * 0.4, audioContext.currentTime)
    filter2.Q.setValueAtTime(0.5, audioContext.currentTime)
    
    // 噪声滤波器
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(frequency * 0.8, audioContext.currentTime)
    noiseFilter.Q.setValueAtTime(1.5, audioContext.currentTime)
    
    // 音量包络 - 长笛特有的音色包络
    const now = audioContext.currentTime
    const attackTime = 0.15 * tempoMultiplier // 缓慢起音模拟气息
    const decayTime = 0.1 * tempoMultiplier
    const sustainLevel = volume * 0.8
    const releaseTime = 0.5 * tempoMultiplier // 中等释放时间
    
    // 主音增益包络
    mainGain.gain.setValueAtTime(0, now)
    mainGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), now + attackTime)
    mainGain.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel), now + attackTime + decayTime)
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)
    
    // 噪声增益包络 - 开始强，然后减弱
    noiseGain.gain.setValueAtTime(0, now)
    noiseGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.15), now + attackTime * 0.5)
    noiseGain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume * 0.05), now + attackTime)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)
    
    // 主音量控制
    masterGain.gain.setValueAtTime(1.0, now)
    
    // 连接音频节点
    mainOsc.connect(filter1)
    filter1.connect(filter2)
    filter2.connect(mainGain)
    
    noiseGen.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    
    mainGain.connect(masterGain)
    noiseGain.connect(masterGain)
    masterGain.connect(audioContext.destination)
    
    // 保存引用
    oscillatorsRef.current['flute'] = mainOsc
    oscillatorsRef.current['fluteNoise'] = noiseGen
    gainNodesRef.current['flute'] = masterGain
    
    // 启动声音
    mainOsc.start()
    noiseGen.start()
    mainOsc.stop(now + attackTime + decayTime + releaseTime + 0.1)
    noiseGen.stop(now + attackTime + decayTime + releaseTime + 0.1)
  }
  
  // 播放钢琴音色 - 替换打击乐
  const playPiano = (frequency, volume, tempoMultiplier) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return
    
    // 停止之前的声音
    if (oscillatorsRef.current['piano1']) {
      oscillatorsRef.current['piano1'].stop()
    }
    if (oscillatorsRef.current['piano2']) {
      oscillatorsRef.current['piano2'].stop()
    }
    if (gainNodesRef.current['piano']) {
      gainNodesRef.current['piano'].disconnect()
    }
    
    // 创建多个振荡器模拟钢琴的复合音色
    const osc1 = audioContext.createOscillator()
    const osc2 = audioContext.createOscillator()
    // 创建增益节点
    const gain1 = audioContext.createGain()
    const gain2 = audioContext.createGain()
    const masterGain = audioContext.createGain()
    // 创建滤波器模拟钢琴共鸣
    const filter = audioContext.createBiquadFilter()
    
    // 设置音色参数
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(frequency, audioContext.currentTime)
    
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(frequency * 2, audioContext.currentTime) // 二次谐波
    
    // 设置滤波器 - 模拟钢琴共鸣
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(4000, audioContext.currentTime)
    filter.Q.setValueAtTime(1.2, audioContext.currentTime)
    
    // 钢琴特有的音量包络 - 快速起音，缓慢衰减
    const now = audioContext.currentTime
    const attackTime = 0.005 * tempoMultiplier // 极短起音
    const decayTime = 0.8 * tempoMultiplier    // 较长衰减
    const sustainLevel = volume * 0.05         // 很低的延音
    const releaseTime = 0.4 * tempoMultiplier
    
    // 主振荡器增益包络
    gain1.gain.setValueAtTime(0, now)
    gain1.gain.linearRampToValueAtTime(volume, now + attackTime) // 线性起音
    gain1.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel), now + attackTime + decayTime)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)
    
    // 谐波振荡器增益包络 - 稍微延迟
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(volume * 0.3, now + attackTime + 0.002)
    gain2.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel * 0.2), now + attackTime + decayTime)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + attackTime + decayTime + releaseTime)
    
    // 主音量控制
    masterGain.gain.setValueAtTime(1.0, now)
    
    // 连接音频节点
    osc1.connect(gain1)
    osc2.connect(gain2)
    gain1.connect(filter)
    gain2.connect(filter)
    filter.connect(masterGain)
    masterGain.connect(audioContext.destination)
    
    // 保存引用
    oscillatorsRef.current['piano1'] = osc1
    oscillatorsRef.current['piano2'] = osc2
    gainNodesRef.current['piano'] = masterGain
    
    // 启动声音
    osc1.start()
    osc2.start()
    osc1.stop(now + attackTime + decayTime + releaseTime + 0.1)
    osc2.stop(now + attackTime + decayTime + releaseTime + 0.1)
  }
  
  // 清理函数 - 停止所有声音
  const stopAllSounds = () => {
    const audioContext = audioContextRef.current
    if (!audioContext) return
    
    // 停止所有保存的振荡器
    Object.values(oscillatorsRef.current).forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
        // 忽略已经停止的振荡器
      }
    })
    
    // 断开所有增益节点
    Object.values(gainNodesRef.current).forEach(node => {
      try {
        node.disconnect()
      } catch (e) {
        // 忽略已经断开的节点
      }
    })
    
    // 清空引用
    oscillatorsRef.current = {}
    gainNodesRef.current = {}
  }
  
  // 乐器预览函数
  const previewInstrument = (instrumentType) => {
    const audioContext = audioContextRef.current
    if (!audioContext) return
    
    // 确保音频上下文已激活
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    
    // 停止当前所有声音
    stopAllSounds()
    
    const volume = 0.3 // 预览音量
    const tempo = 1.0   // 预览速度
    
    // 播放不同乐器的预览音符序列
    if (instrumentType === 'violin') {
      // 小提琴琶音
      const notes = [440, 554.37, 659.25, 880]
      notes.forEach((note, index) => {
        setTimeout(() => {
          playViolin(note, volume, tempo)
        }, index * 300)
      })
    } else if (instrumentType === 'piano') {
      // 钢琴和弦
      const notes = [110, 146.83, 196, 261.63]
      playPiano(notes[0], volume, tempo)
      setTimeout(() => playPiano(notes[1], volume, tempo), 100)
      setTimeout(() => playPiano(notes[2], volume, tempo), 200)
      setTimeout(() => playPiano(notes[3], volume, tempo), 300)
    } else if (instrumentType === 'flute') {
      // 长笛旋律
      const notes = [523.25, 587.33, 659.25, 783.99]
      notes.forEach((note, index) => {
        setTimeout(() => {
          playFlute(note, volume, tempo)
        }, index * 400)
      })
    }
  }

  // 切换乐器选择
  const toggleInstrument = (band) => {
    setSelectedInstruments(prev => ({
      ...prev,
      [band]: !prev[band]
    }))
  }

  // 播放/暂停
  const togglePlay = () => {
    if (!isPlaying && audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
    
    if (!isPlaying) {
      setAudioData([])
      setBrainwaveData([])
    } else {
      // 停止所有声音
      Object.values(oscillatorsRef.current).forEach(osc => {
        try {
          osc.stop()
        } catch (e) {}
      })
      oscillatorsRef.current = {}
      gainNodesRef.current = {}
    }
    
    setIsPlaying(!isPlaying)
  }

  // 开始/停止录音
  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) {
      setAudioData([])
    }
  }

  // 分享脑电波音乐
  const shareRecording = () => {
    // 模拟分享功能
    alert('已生成分享链接！在实际应用中，这里会调用分享API。')
  }

  // 准备图表数据
  const chartData = {
    labels: brainwaveData.map((_, index) => index),
    datasets: [
      selectedInstruments.alpha && {
        label: 'α波 (8-12Hz) - 弦乐声部',
        data: brainwaveData.map(d => d?.alpha || 0),
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        fill: false
      },
      selectedInstruments.betaLow && {
        label: 'β波低频 (13-20Hz) - 打击乐声部',
        data: brainwaveData.map(d => d?.betaLow || 0),
        borderColor: '#4ecdc4',
        backgroundColor: 'rgba(78, 205, 196, 0.1)',
        tension: 0.4,
        fill: false
      },
      selectedInstruments.betaHigh && {
        label: 'β波高频 (20-30Hz) - 管乐声部',
        data: brainwaveData.map(d => d?.betaHigh || 0),
        borderColor: '#45b7d1',
        backgroundColor: 'rgba(69, 183, 209, 0.1)',
        tension: 0.4,
        fill: false
      }
    ].filter(Boolean)
  }

  return (
    <div className="mindsymphony-page page-transition mind-symphony-page">
      <div className="container">
        <Link to="/therapy" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回调节页面
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>脑电波交响乐 (MindSymphony)</h1>
          
          {/* 脑电波可视化 */}
          <div style={{ height: '400px', marginBottom: '32px' }}>
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: '脑电波交响乐实时监测 - 不同脑区活动' }
                },
                scales: {
                  y: { beginAtZero: true, max: 100 }
                }
              }} 
            />
          </div>

          {/* 情绪强度指示器 */}
          <div className="card" style={{ marginBottom: '32px' }}>
            <h3>情绪强度控制</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <label htmlFor="emotion-slider">当前情绪强度: {emotionIntensity}%</label>
              <input 
                type="range" 
                id="emotion-slider" 
                min="0" 
                max="100" 
                value={emotionIntensity} 
                readOnly 
                style={{
                  flex: 1,
                  height: '8px',
                  borderRadius: '4px',
                  background: `linear-gradient(to right, #667eea 0%, #667eea ${emotionIntensity}%, #e0e0e0 ${emotionIntensity}%, #e0e0e0 100%)`
                }}
              />
            </div>
            <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
              提示：情绪强度决定音乐的音量和节奏。高强度情绪产生更大音量和更快节奏，低强度情绪产生柔和缓慢的音乐效果。
            </p>
          </div>

          {/* 乐器选择 */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <h3>脑区活动与乐器声部映射</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
          <label className="instrument-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            <input 
              type="checkbox" 
              checked={selectedInstruments.alpha} 
              onChange={() => toggleInstrument('alpha')} 
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '15px', height: '15px', backgroundColor: '#ff6b6b', borderRadius: '50%' }}></span>
              α波 - 弦乐声部 (高级小提琴)
            </span>
            <button 
              className="btn btn-sm preview-btn" 
              onClick={(e) => {e.stopPropagation(); previewInstrument('violin');}}
              style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.3s ease' }}
            >
              试听
            </button>
          </label>
          <label className="instrument-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            <input 
              type="checkbox" 
              checked={selectedInstruments.betaLow} 
              onChange={() => toggleInstrument('betaLow')} 
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '15px', height: '15px', backgroundColor: '#4ecdc4', borderRadius: '50%' }}></span>
              β波低频 - 打击乐声部 (古典钢琴)
            </span>
            <button 
              className="btn btn-sm preview-btn" 
              onClick={(e) => {e.stopPropagation(); previewInstrument('piano');}}
              style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.3s ease' }}
            >
              试听
            </button>
          </label>
          <label className="instrument-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', border: '1px solid #e0e0e0', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            <input 
              type="checkbox" 
              checked={selectedInstruments.betaHigh} 
              onChange={() => toggleInstrument('betaHigh')} 
            />
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '15px', height: '15px', backgroundColor: '#45b7d1', borderRadius: '50%' }}></span>
              β波高频 - 管乐声部 (古典长笛)
            </span>
            <button 
              className="btn btn-sm preview-btn" 
              onClick={(e) => {e.stopPropagation(); previewInstrument('flute');}}
              style={{ marginLeft: 'auto', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.3s ease' }}
            >
              试听
            </button>
          </label>
        </div>
      </div>

          {/* 控制按钮 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <button 
              className={`btn ${isPlaying ? 'btn-danger' : 'btn-success'}`} 
              onClick={togglePlay}
              style={{ minWidth: '120px' }}
            >
              {isPlaying ? '⏸️ 暂停' : '▶️ 开始'}
            </button>
            <button 
              className={`btn ${isRecording ? 'btn-warning' : 'btn-primary'}`} 
              onClick={toggleRecording}
              disabled={!isPlaying}
              style={{ minWidth: '120px' }}
            >
              {isRecording ? '⏹️ 停止录音' : '🎵 录制音乐'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={shareRecording}
              disabled={!audioData.length}
              style={{ minWidth: '120px' }}
            >
              🔗 分享音乐
            </button>
          </div>

          {/* 说明信息 */}
      <div className="card" style={{ marginTop: '30px', backgroundColor: '#f8f9fa' }}>
        <h4>功能说明</h4>
        <ul style={{ margin: 0 }}>
          <li>脑电波交响乐功能将您的实时脑电波转化为高品质的个性化交响乐作品</li>
          <li><strong>α波 (8-12Hz)</strong> - 对应弦乐声部，高级小提琴音色，来自枕叶脑区活动，音色温暖富有表现力</li>
          <li><strong>β波低频 (13-20Hz)</strong> - 对应打击乐声部，古典钢琴音色，来自顶叶脑区活动，提供稳定的和声基础</li>
          <li><strong>β波高频 (20-30Hz)</strong> - 对应管乐声部，古典长笛音色，来自额叶脑区活动，音色明亮通透</li>
          <li><strong>情绪强度</strong> - 决定音乐的音量和节奏速度，高强度情绪产生更强烈的音乐效果</li>
          <li>点击乐器旁的"试听"按钮可以预览各音色特点，然后组合创造您的专属音乐体验</li>
        </ul>
      </div>
        </div>
      </div>
    </div>
  )
}

export default MindSymphonyPage