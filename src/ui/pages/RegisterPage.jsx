import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../core/contexts/AuthContext'
import './RegisterPage.css'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      setLoading(false)
      return
    }

    try {
      // 手机号验证
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        setError('请输入有效的手机号码')
        return
      }
      
      // 使用AuthContext中的注册方法
      await register(formData.phone, formData.password)
      
      setSuccess('注册成功！正在跳转到登录页面...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('注册失败，请稍后重试')
      console.error('Registration error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-form">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ color: '#667eea' }}>创建账号</h1>
              <p>欢迎加入心晴屿</p>
            </div>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '16px', padding: '12px', background: '#ffebee', borderRadius: '8px' }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ color: 'green', marginBottom: '16px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
              {success}
            </div>
          )}
          
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>手机号</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="tel"
                  name="phone"
                  className="input"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="请输入手机号码"
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      transition: 'border-color 0.3s'
                }}
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  color: '#667eea',
                  fontSize: '20px'
                }}>📱</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>密码</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="password"
                  name="password"
                  className="input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="请输入密码（至少6位）"
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    transition: 'border-color 0.3s'
                  }}
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  color: '#667eea',
                  fontSize: '20px'
                }}>🔒</span>
              </div>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>确认密码</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                type="password"
                name="confirmPassword"
                className="input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="请再次输入密码"
                style={{
                  width: '100%',
                  padding: '12px 40px 12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    backgroundColor: 'white',
                    transition: 'border-color 0.3s'
                }}
                minLength={6}
                />
                <span style={{ 
                  position: 'absolute', 
                  right: '12px', 
                  color: '#667eea',
                  fontSize: '20px'
                }}>🔐</span>
              </div>
            </div>
            
            <button type="submit" style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#667eea',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }} disabled={loading}>
              {loading ? <span className="loading"></span> : '注册'}
            </button>
          </form>
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p>已有账号？ <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>立即登录</Link></p>
          </div>
      </div>
    </div>
  )
}

export default RegisterPage