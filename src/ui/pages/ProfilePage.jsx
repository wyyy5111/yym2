import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    healthInfo: {
      sleepHours: '',
      exerciseFrequency: '',
      stressLevel: ''
    }
  })
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // 从localStorage获取用户信息
    const savedInfo = localStorage.getItem('userInfo')
    if (savedInfo) {
      const parsed = JSON.parse(savedInfo)
      setUserInfo(prev => ({ ...prev, ...parsed }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setUserInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setUserInfo(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')

    try {
      // 模拟保存数据
      await new Promise(resolve => setTimeout(resolve, 1000))
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      setSuccess('个人信息已更新')
      setEditing(false)
    } catch (err) {
      console.error('保存失败', err)
    } finally {
      setLoading(false)
    }
  }

  const getGenderText = (gender) => {
    const map = { male: '男', female: '女', other: '其他' }
    return map[gender] || gender
  }

  const getUserTypeText = (type) => {
    const map = { 
      'optimization': '自我优化型', 
      'symptom-relief': '症状应对型' 
    }
    return map[type] || type
  }

  return (
    <div className="profile-page page-transition">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* 返回按钮 */}
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回首页
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>个人信息</h1>

          {success && (
            <div style={{ color: 'green', marginBottom: '20px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
              {success}
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>姓名</label>
                  <input
                    type="text"
                    name="name"
                    className="input"
                    value={userInfo.name}
                    onChange={handleChange}
                    placeholder="请输入姓名"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>性别</label>
                  <select
                    name="gender"
                    className="input"
                    value={userInfo.gender}
                    onChange={handleChange}
                  >
                    <option value="">请选择</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>年龄</label>
                  <input
                    type="number"
                    name="age"
                    className="input"
                    value={userInfo.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>职业</label>
                  <input
                    type="text"
                    name="occupation"
                    className="input"
                    value={userInfo.occupation}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '16px' }}>基础健康信息</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>睡眠时长（小时/天）</label>
                    <input
                      type="number"
                      name="healthInfo.sleepHours"
                      className="input"
                      value={userInfo.healthInfo.sleepHours}
                      onChange={handleChange}
                      min="0"
                      max="24"
                      step="0.5"
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>运动频率</label>
                    <select
                      name="healthInfo.exerciseFrequency"
                      className="input"
                      value={userInfo.healthInfo.exerciseFrequency}
                      onChange={handleChange}
                    >
                      <option value="">请选择</option>
                      <option value="daily">每天</option>
                      <option value="weekly">每周数次</option>
                      <option value="monthly">每月数次</option>
                      <option value="rarely">很少</option>
                    </select>
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>压力水平</label>
                    <select
                      name="healthInfo.stressLevel"
                      className="input"
                      value={userInfo.healthInfo.stressLevel}
                      onChange={handleChange}
                    >
                      <option value="">请选择</option>
                      <option value="low">低</option>
                      <option value="moderate">中等</option>
                      <option value="high">高</option>
                      <option value="very-high">非常高</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  取消
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="loading"></span> : '保存'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>基本信息</h3>
                  <p><strong>姓名：</strong>{userInfo.name || '未设置'}</p>
                  <p><strong>性别：</strong>{getGenderText(userInfo.gender)}</p>
                  <p><strong>年龄：</strong>{userInfo.age || '未设置'}</p>
                  <p><strong>职业：</strong>{userInfo.occupation}</p>
                  <p><strong>用户类型：</strong>{getUserTypeText(localStorage.getItem('userType'))}</p>
                </div>
                
                <div className="card">
                  <h3 style={{ marginBottom: '16px' }}>健康信息</h3>
                  <p><strong>睡眠时长：</strong>{userInfo.healthInfo.sleepHours || '未设置'} 小时/天</p>
                  <p><strong>运动频率：</strong>{userInfo.healthInfo.exerciseFrequency || '未设置'}</p>
                  <p><strong>压力水平：</strong>{userInfo.healthInfo.stressLevel || '未设置'}</p>
                </div>
              </div>
              
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                编辑个人信息
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage