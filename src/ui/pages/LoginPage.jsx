import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../core/contexts/AuthContext'
import './LoginPage.css'

const LoginPage = () => {
  const [mode, setMode] = useState('password') // 'password' | 'otp'
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, sendOtp, loginWithOtp, authLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000)
    }
    return () => timer && clearInterval(timer)
  }, [countdown])

  const validatePhone = () => {
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入有效的手机号码')
      return false
    }
    return true
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!validatePhone()) return
      if (!password || password.length < 1) {
        setError('请输入密码')
        return
      }
      await login(phone, password)
      // 登录成功后跳转到同意书页面
      navigate('/consent-form', { replace: true })
    } catch (err) {
      setError(err?.message || '登录失败，请检查手机号和密码')
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async () => {
    setError('')
    if (!validatePhone()) return
    try {
      const res = await sendOtp(phone)
      setSentCode(res.code) // 仅示例展示，真实环境不会显示给用户
      setOtpSent(true)
      setCountdown(60)
    } catch (err) {
      setError(err?.message || '验证码发送失败')
    }
  }

  const handleOtpLogin = async () => {
    setLoading(true)
    setError('')
    try {
      if (!validatePhone()) return
      if (!otp || otp.length !== 6) {
        setError('请输入6位验证码')
        return
      }
      await loginWithOtp(phone, otp)
      navigate('/consent-form', { replace: true })
    } catch (err) {
      setError(err?.message || '验证码登录失败')
    } finally {
      setLoading(false)
    }
  }

  const renderModeSwitch = () => (
    <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setMode('password')}
        style={{
          flex: 1,
          padding: '10px',
          borderRadius: '8px',
          border: mode === 'password' ? '2px solid #667eea' : '2px solid #e0e0e0',
          backgroundColor: mode === 'password' ? '#eef2ff' : 'white',
          color: '#333'
        }}
      >
        密码登录
      </button>
      <button
        type="button"
        onClick={() => setMode('otp')}
        style={{
          flex: 1,
          padding: '10px',
          borderRadius: '8px',
          border: mode === 'otp' ? '2px solid #667eea' : '2px solid #e0e0e0',
          backgroundColor: mode === 'otp' ? '#eef2ff' : 'white',
          color: '#333'
        }}
      >
        免密码登录
      </button>
    </div>
  )

  return (
    <div className="login-container">
      <div className="login-form">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h1 style={{ color: '#667eea' }}>心晴屿</h1>
              <p>心理健康监测平台</p>
            </div>

          {renderModeSwitch()}
          
          {error && (
            <div style={{ color: 'red', marginBottom: '16px', padding: '12px', background: '#ffebee', borderRadius: '8px' }}>
              {error}
            </div>
          )}
          
          {mode === 'password' ? (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>手机号</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="tel"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="请输入手机号码"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    transition: 'border-color 0.3s',
                    backgroundColor: 'white'
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
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>密码</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="请输入密码"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    transition: 'border-color 0.3s',
                    backgroundColor: 'white'
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
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.3s'
              }} disabled={loading || authLoading}>
                {loading || authLoading ? <span className="loading"></span> : '登录'}
              </button>
            </form>
          ) : (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>手机号</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="tel"
                    className="input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="请输入手机号码"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    transition: 'border-color 0.3s',
                    backgroundColor: 'white'
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

              <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={authLoading || countdown > 0}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: countdown > 0 ? '#ccc' : '#667eea',
                    color: 'white'
                  }}
                >
                  {countdown > 0 ? `重新发送(${countdown}s)` : '发送验证码'}
                </button>
              </div>

              {otpSent && (
                <div style={{ marginBottom: '8px', color: '#555' }}>
                  验证码已发送：{sentCode}（演示用，真实环境不会显示）
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>验证码</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="input"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="请输入6位验证码"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 16px',
                    borderRadius: '8px',
                    border: '2px solid #e0e0e0',
                    fontSize: '16px',
                    transition: 'border-color 0.3s',
                    backgroundColor: 'white'
                  }}
                  />
                  <span style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    color: '#667eea',
                    fontSize: '20px'
                  }}>🔢</span>
                </div>
              </div>

              <button type="button" onClick={handleOtpLogin} style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#667eea',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.3s'
              }} disabled={loading || authLoading}>
                {loading || authLoading ? <span className="loading"></span> : '验证码登录'}
              </button>
            </div>
          )}
          
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p>还没有账号？ <Link to="/register" style={{ color: '#667eea', textDecoration: 'none' }}>立即注册</Link></p>
          </div>
      </div>
    </div>
  )
}

export default LoginPage