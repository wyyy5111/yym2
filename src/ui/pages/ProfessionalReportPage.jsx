import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './ProfessionalReportPage.css'

const ProfessionalReportPage = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟生成报告数据
    setTimeout(() => {
      const mockReport = {
        reportDate: new Date().toLocaleDateString('zh-CN'),
        attentionSummary: {
          avgAttention: Math.floor(Math.random() * 20) + 70,
          peakAttention: Math.floor(Math.random() * 10) + 85,
          lowAttention: Math.floor(Math.random() * 15) + 60,
          stabilityLevel: ['低', '中', '高'][Math.floor(Math.random() * 3)],
          focusDuration: Math.floor(Math.random() * 30) + 40,
          distractionCount: Math.floor(Math.random() * 10) + 5
        },
        emotionSummary: {
          dominantEmotion: ['愉悦', '平静', '专注', '放松', '紧张', '焦虑'][Math.floor(Math.random() * 6)],
          emotionStability: ['不稳定', '一般', '稳定'][Math.floor(Math.random() * 3)],
          positiveRatio: Math.floor(Math.random() * 30) + 60,
          negativeRatio: Math.floor(Math.random() * 20) + 10
        },
        overallAssessment: generateOverallAssessment(),
        recommendations: generateRecommendations(),
        healthSuggestions: generateHealthSuggestions()
      }
      setReportData(mockReport)
      setLoading(false)
    }, 1500)
  }, [])

  // 生成总体评估
  function generateOverallAssessment() {
    const assessments = [
      {
        level: '良好',
        description: '您的注意力和情绪状态整体表现良好，处于健康范围内。注意力水平稳定，情绪以积极状态为主。'
      },
      {
        level: '一般',
        description: '您的心理健康状态处于一般水平。注意力有时会出现波动，情绪状态需要适当关注和调整。'
      },
      {
        level: '需要关注',
        description: '您的注意力和情绪状态显示出一定的不稳定性，建议适当调整生活方式，增加休息和放松时间。'
      }
    ]
    return assessments[Math.floor(Math.random() * assessments.length)]
  }

  // 生成建议
  function generateRecommendations() {
    const allRecommendations = [
      '保持规律的作息时间，确保充足的睡眠（7-8小时/天）',
      '每天进行至少30分钟的有氧运动，有助于提高注意力和改善情绪',
      '尝试冥想或深呼吸练习，每天10-15分钟，可以有效减轻压力',
      '注意饮食均衡，减少咖啡因和糖分的摄入',
      '工作或学习时采用番茄工作法，提高效率并减少疲劳',
      '保持适当的社交活动，与朋友和家人保持良好的沟通',
      '培养兴趣爱好，丰富生活内容',
      '合理规划工作和学习任务，避免过度压力',
      '学习情绪管理技巧，及时调整不良情绪',
      '定期进行自我评估，关注心理健康状态变化'
    ]
    
    // 随机选择3-5条建议
    const count = Math.floor(Math.random() * 3) + 3
    const shuffled = [...allRecommendations].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // 生成健康建议
  function generateHealthSuggestions() {
    const healthSuggestions = [
      {
        condition: '注意力不集中',
        suggestion: '尝试进行注意力训练，如冥想、阅读或拼图游戏。确保充足的睡眠和规律的饮食。'
      },
      {
        condition: '情绪波动较大',
        suggestion: '记录情绪变化，找出触发因素。尝试写日记，进行放松训练，必要时寻求专业帮助。'
      },
      {
        condition: '压力过大',
        suggestion: '学习压力管理技巧，如深呼吸、渐进式肌肉放松。适当减少工作或学习负担，增加休息时间。'
      },
      {
        condition: '睡眠质量差',
        suggestion: '保持规律的睡眠时间，睡前避免使用电子设备。创建舒适的睡眠环境，可以尝试听轻柔的音乐或白噪音。'
      },
      {
        condition: '焦虑情绪',
        suggestion: '尝试正念冥想，进行适量的运动，保持社交联系。如果症状持续，建议咨询专业心理医生。'
      }
    ]
    
    // 随机选择1-2条健康建议
    const count = Math.floor(Math.random() * 2) + 1
    const shuffled = [...healthSuggestions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="professional-report-page page-transition">
        <div className="container">
            <Link to="/analysis" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
              ← 返回分析
            </Link>
          <div className="card">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>正在生成专业评估报告，请稍候...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 渲染报告内容
  if (reportData) {
    return (
      <div className="professional-report-page page-transition">
        <div className="container">
          <Link to="/analysis" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
            ← 返回分析
          </Link>
          
          <div className="card">
            <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>专业心理健康评估报告</h1>
            <p style={{ textAlign: 'right', color: '#666', marginBottom: '30px' }}>报告生成日期：{reportData.reportDate}</p>
            
            {/* 总体评估卡片 */}
            <div className="card" style={{ marginBottom: '30px', borderLeft: '5px solid #667eea' }}>
              <h2 style={{ color: '#667eea' }}>总体评估</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div 
                  className="assessment-badge" 
                  style={{
                    padding: '10px 20px',
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: 'white',
                    backgroundColor: 
                      reportData.overallAssessment.level === '良好' ? '#00b894' :
                      reportData.overallAssessment.level === '一般' ? '#fdcb6e' : '#e17055'
                  }}
                >
                  {reportData.overallAssessment.level}
                </div>
                <p style={{ margin: 0 }}>{reportData.overallAssessment.description}</p>
              </div>
            </div>

            {/* 注意力分析 */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#667eea', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>注意力分析</h3>
              <div className="report-grid">
                <div className="report-item">
                  <span className="report-label">平均注意力指数：</span>
                  <span className="report-value">{reportData.attentionSummary.avgAttention}%</span>
                </div>
                <div className="report-item">
                  <span className="report-label">注意力峰值：</span>
                  <span className="report-value">{reportData.attentionSummary.peakAttention}%</span>
                </div>
                <div className="report-item">
                  <span className="report-label">注意力低谷：</span>
                  <span className="report-value">{reportData.attentionSummary.lowAttention}%</span>
                </div>
                <div className="report-item">
                  <span className="report-label">稳定性水平：</span>
                  <span className="report-value">{reportData.attentionSummary.stabilityLevel}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">平均专注时长：</span>
                  <span className="report-value">{reportData.attentionSummary.focusDuration}分钟</span>
                </div>
                <div className="report-item">
                  <span className="report-label">平均分心次数：</span>
                  <span className="report-value">{reportData.attentionSummary.distractionCount}次/小时</span>
                </div>
              </div>
            </div>

            {/* 情绪分析 */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#667eea', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>情绪分析</h3>
              <div className="report-grid">
                <div className="report-item">
                  <span className="report-label">主导情绪：</span>
                  <span className="report-value">{reportData.emotionSummary.dominantEmotion}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">情绪稳定性：</span>
                  <span className="report-value">{reportData.emotionSummary.emotionStability}</span>
                </div>
                <div className="report-item">
                  <span className="report-label">积极情绪占比：</span>
                  <span className="report-value">{reportData.emotionSummary.positiveRatio}%</span>
                </div>
                <div className="report-item">
                  <span className="report-label">消极情绪占比：</span>
                  <span className="report-value">{reportData.emotionSummary.negativeRatio}%</span>
                </div>
              </div>
            </div>

            {/* 生活建议 */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#667eea', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>生活建议</h3>
              <ul className="recommendations-list">
                {reportData.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* 健康建议 */}
            <div className="card" style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#667eea', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>健康建议</h3>
              {reportData.healthSuggestions.map((suggestion, index) => (
                <div key={index} style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#00b894' }}>{suggestion.condition}</h4>
                  <p style={{ margin: 0 }}>{suggestion.suggestion}</p>
                </div>
              ))}
            </div>

            {/* 免责声明 */}
            <div className="disclaimer" style={{ 
              backgroundColor: '#fff9c4', 
              padding: '15px', 
              borderRadius: '5px', 
              borderLeft: '5px solid #ffc107',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#ff6b00' }}>
                免责声明：本结果仅供参考，如有不适请及时就医
              </p>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                本报告基于您的历史数据生成，不能替代专业医疗诊断。如有持续的情绪或注意力问题，请咨询专业医疗或心理服务提供者。
              </p>
            </div>
            
            {/* 操作按钮 */}
            <div className="report-actions">
              <button className="btn btn-primary">保存报告</button>
              <button className="btn btn-secondary">打印报告</button>
              <button className="btn btn-outline-secondary">分享报告</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default ProfessionalReportPage