import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Line, Bar, Scatter } from 'react-chartjs-2'
import './AttentionAnalysisPage.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
)

const AttentionAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('attentionCurve')

  // 生成注意力曲线数据
  const generateAttentionCurveData = () => {
    const hours = []
    const attentionData = []
    const stabilityData = []

    for (let i = 0; i < 24; i++) {
      hours.push(`${i}:00`)
      const baseAttention = Math.random() * 20 + 65 // 65-85的基础值
      attentionData.push(baseAttention)
      stabilityData.push(100 - Math.random() * baseAttention * 0.3) // 稳定性
    }

    return {
      labels: hours,
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
    }
  }

  // 生成分析报告数据
  const generateAnalysisData = () => {
    const labels = ['早晨', '上午', '下午', '晚上']
    const attentionScores = [
      Math.floor(Math.random() * 20) + 75,
      Math.floor(Math.random() * 20) + 70,
      Math.floor(Math.random() * 20) + 65,
      Math.floor(Math.random() * 20) + 70
    ]
    const focusDuration = [
      Math.floor(Math.random() * 30) + 45,
      Math.floor(Math.random() * 30) + 50,
      Math.floor(Math.random() * 30) + 30,
      Math.floor(Math.random() * 30) + 40
    ]
    const distractionCount = [
      Math.floor(Math.random() * 5) + 2,
      Math.floor(Math.random() * 7) + 1,
      Math.floor(Math.random() * 10) + 3,
      Math.floor(Math.random() * 7) + 2
    ]

    return {
      labels,
      datasets: [
        {
          label: '注意力评分',
          data: attentionScores,
          backgroundColor: '#667eea',
        },
        {
          label: '专注时长(分钟)',
          data: focusDuration,
          backgroundColor: '#4ecdc4',
        },
        {
          label: '分心次数',
          data: distractionCount,
          backgroundColor: '#f7b731',
        }
      ]
    }
  }

  // 生成关联分析数据
  const generateCorrelationData = () => {
    const scatterData = []
    
    for (let i = 0; i < 50; i++) {
      const attention = Math.random() * 40 + 60 // 60-100
      const emotion = Math.random() * 4 + 1 // 1-5
      
      scatterData.push({
        x: attention,
        y: emotion
      })
    }

    return {
      datasets: [
        {
          label: '注意力-情绪关联',
          data: scatterData,
          backgroundColor: '#74b9ff',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    }
  }

  const attentionCurveData = generateAttentionCurveData()
  const analysisData = generateAnalysisData()
  const correlationData = generateCorrelationData()

  const renderAttentionCurve = () => (
    <div className="tab-content">
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Line 
          data={attentionCurveData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: '注意力变化曲线' }
            },
            scales: {
              y: { beginAtZero: false, min: 50, max: 100 }
            }
          }} 
        />
      </div>
      <div className="card">
        <h3>注意力趋势分析</h3>
        <p>您的注意力水平整体保持在良好状态，高峰通常出现在上午10点左右。</p>
        <p>下午3-4点是注意力低谷期，建议在这个时间段安排短暂休息或进行低强度工作。</p>
        <p>睡眠充足对提升注意力水平有显著帮助，建议保持7-8小时的睡眠时间。</p>
        <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
      </div>
    </div>
  )

  const renderAnalysisReport = () => {
    const avgAttention = analysisData.datasets[0].data.reduce((a, b) => a + b, 0) / analysisData.datasets[0].data.length
    const maxFocusDuration = Math.max(...analysisData.datasets[1].data)
    const totalDistractions = analysisData.datasets[2].data.reduce((a, b) => a + b, 0)
    
    return (
      <div className="tab-content">
        <div style={{ height: '400px', marginBottom: '20px' }}>
          <Bar 
            data={analysisData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: '注意力分析报告' }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }} 
          />
        </div>
        <div className="card">
          <h3>详细分析报告</h3>
          <p><strong>平均注意力评分：</strong>{Math.round(avgAttention)}/100</p>
          <p><strong>最长专注时长：</strong>{maxFocusDuration}分钟</p>
          <p><strong>全天分心次数：</strong>{totalDistractions}次</p>
          <p><strong>最佳工作时段：</strong>上午（注意力评分最高，分心次数较少）</p>
          <p><strong>改进建议：</strong>采用番茄工作法，每专注25分钟休息5分钟，可以有效提高注意力持续时间。</p>
          <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
        </div>
      </div>
    )
  }

  const renderCorrelationAnalysis = () => (
    <div className="tab-content">
      <div style={{ height: '400px', marginBottom: '20px' }}>
        <Scatter 
          data={correlationData} 
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: '注意力-情绪关联分析' }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                title: {
                  display: true,
                  text: '注意力指数'
                },
                min: 50,
                max: 100
              },
              y: {
                title: {
                  display: true,
                  text: '情绪状态'
                },
                min: 0,
                max: 6,
                ticks: {
                  stepSize: 1,
                  callback: function(value) {
                    const emotions = ['', '愉悦', '平静', '专注', '放松', '紧张', '焦虑']
                    return emotions[value]
                  }
                }
              }
            }
          }} 
        />
      </div>
      <div className="card">
        <h3>关联分析解读</h3>
        <p>从散点图可以看出，您的注意力水平与情绪状态存在一定的关联性。</p>
        <p>当情绪状态处于平静和放松时，注意力指数通常较高；而在紧张或焦虑状态下，注意力水平可能下降。</p>
        <p><strong>建议：</strong>在重要任务前进行5-10分钟的深呼吸或冥想，调整情绪状态，可以有效提高注意力水平。</p>
        <p style={{ color: '#667eea', fontStyle: 'italic' }}>本结果仅供参考，如有不适请及时就医</p>
      </div>
    </div>
  )

  return (
    <div className="attention-analysis-page page-transition">
      <div className="container">
        <Link to="/analysis" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回分析
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>注意力分析系统</h1>
          
          {/* 标签页切换 */}
          <div className="tabs">
            <button 
              className={`tab-btn ${activeTab === 'attentionCurve' ? 'active' : ''}`}
              onClick={() => setActiveTab('attentionCurve')}
            >
              注意力曲线
            </button>
            <button 
              className={`tab-btn ${activeTab === 'analysisReport' ? 'active' : ''}`}
              onClick={() => setActiveTab('analysisReport')}
            >
              分析报告
            </button>
            <button 
              className={`tab-btn ${activeTab === 'correlationAnalysis' ? 'active' : ''}`}
              onClick={() => setActiveTab('correlationAnalysis')}
            >
              关联分析
            </button>
          </div>

          {/* 内容区域 */}
          {activeTab === 'attentionCurve' && renderAttentionCurve()}
          {activeTab === 'analysisReport' && renderAnalysisReport()}
          {activeTab === 'correlationAnalysis' && renderCorrelationAnalysis()}
        </div>
      </div>
    </div>
  )
}

export default AttentionAnalysisPage