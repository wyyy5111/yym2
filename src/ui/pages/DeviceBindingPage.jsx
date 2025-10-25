import { useState } from 'react'
import { Link } from 'react-router-dom'

const DeviceBindingPage = () => {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [signalStrength, setSignalStrength] = useState(0)

  const handleScan = async () => {
    setIsScanning(true)
    setDevices([])

    // 模拟扫描设备
    setTimeout(() => {
      setDevices([
        { id: '1', name: 'NeuroSky MindWave Mobile 2', rssi: -65 },
        { id: '2', name: 'NeuroSky ThinkGear TGAM', rssi: -78 }
      ])
      setIsScanning(false)
    }, 2000)
  }

  const handleConnect = async (device) => {
    setSelectedDevice(device)
    setIsConnected(false)

    // 模拟连接过程
    setTimeout(() => {
      setIsConnected(true)
      // 开始模拟信号强度变化
      const interval = setInterval(() => {
        setSignalStrength(Math.floor(Math.random() * 30) + 70) // 70-100的随机值
      }, 1000)
      
      // 保存interval ID以便后续清除
      localStorage.setItem('signalInterval', interval)
    }, 3000)
  }

  const handleCalibrate = async () => {
    setIsCalibrating(true)
    setCalibrationStep(1)

    // 模拟校准步骤
    const steps = [
      () => setCalibrationStep(2),
      () => setCalibrationStep(3),
      () => setCalibrationStep(4),
      () => {
        setCalibrationStep(5)
        setIsCalibrating(false)
        alert('校准完成！设备已准备就绪。')
      }
    ]

    steps.forEach((step, index) => {
      setTimeout(step, (index + 1) * 2000)
    })
  }

  const getSignalQualityColor = (strength) => {
    if (strength >= 90) return '#4caf50'
    if (strength >= 70) return '#ff9800'
    return '#f44336'
  }

  return (
    <div className="device-binding-page page-transition">
      <div className="container">
        <Link to="/dashboard" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← 返回首页
        </Link>

        <div className="card">
          <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '32px' }}>设备绑定与校准</h1>
          
          {!isConnected ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <h3>请扫描并连接您的NeuroSky设备</h3>
                <p style={{ color: '#666' }}>确保设备已开启并处于配对模式</p>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={handleScan} 
                  disabled={isScanning}
                  style={{ marginBottom: '20px' }}
                >
                  {isScanning ? (
                    <>
                      <span className="loading" style={{ marginRight: '8px' }}></span>
                      正在扫描...
                    </>
                  ) : (
                    '扫描设备'
                  )}
                </button>
              </div>

              {devices.length > 0 && (
                <div>
                  <h3 style={{ marginBottom: '16px' }}>找到的设备</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {devices.map(device => (
                      <div 
                        key={device.id} 
                        className="card"
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleConnect(device)}
                      >
                        <div>
                          <p style={{ fontWeight: '500' }}>{device.name}</p>
                          <p style={{ color: '#666', fontSize: '0.9rem' }}>信号强度: {device.rssi} dBm</p>
                        </div>
                        <button className="btn btn-secondary">连接</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '16px' }}>已连接设备</h3>
                <p><strong>设备名称：</strong>{selectedDevice?.name}</p>
                <p><strong>连接状态：</strong>
                  <span style={{ color: '#4caf50', marginLeft: '8px' }}>已连接</span>
                </p>
                <div style={{ marginTop: '16px' }}>
                  <p><strong>信号强度：</strong></p>
                  <div style={{ width: '100%', height: '20px', background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
                    <div 
                      style={{
                        width: `${signalStrength}%`,
                        height: '100%',
                        backgroundColor: getSignalQualityColor(signalStrength),
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <p style={{ textAlign: 'center', marginTop: '8px', color: getSignalQualityColor(signalStrength) }}>
                    {signalStrength}% ({signalStrength >= 90 ? '优秀' : signalStrength >= 70 ? '良好' : '较弱'})
                  </p>
                </div>
              </div>

              {calibrationStep === 0 && (
                <button 
                  className="btn btn-primary" 
                  onClick={handleCalibrate}
                  style={{ width: '100%' }}
                >
                  开始校准
                </button>
              )}

              {calibrationStep > 0 && (
                <div className="card">
                  <h3 style={{ marginBottom: '24px' }}>设备校准</h3>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      {[1, 2, 3, 4, 5].map(step => (
                        <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                          <div 
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: step <= calibrationStep ? '#667eea' : '#e0e0e0',
                              color: step <= calibrationStep ? 'white' : '#666',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto 8px auto',
                              fontWeight: 'bold'
                            }}
                          >
                            {step}
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>
                            {step === 1 && '准备'}
                            {step === 2 && '放松'}
                            {step === 3 && '专注'}
                            {step === 4 && '测试'}
                            {step === 5 && '完成'}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ height: '4px', background: '#e0e0e0', borderRadius: '2px', marginTop: '-16px' }}>
                      <div 
                        style={{
                          height: '100%',
                          width: `${((calibrationStep - 1) / 4) * 100}%`,
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', padding: '20px', background: '#f5f7fa', borderRadius: '8px' }}>
                    {calibrationStep === 1 && (
                      <>
                        <h4>准备校准</h4>
                        <p>请确保设备佩戴正确，保持舒适的坐姿</p>
                      </>
                    )}
                    {calibrationStep === 2 && (
                      <>
                        <h4>放松阶段</h4>
                        <p>请闭上眼睛，深呼吸，完全放松...（10秒）</p>
                      </>
                    )}
                    {calibrationStep === 3 && (
                      <>
                        <h4>专注阶段</h4>
                        <p>请集中注意力，注视前方的一个点...（10秒）</p>
                      </>
                    )}
                    {calibrationStep === 4 && (
                      <>
                        <h4>测试阶段</h4>
                        <p>设备正在测试信号准确性，请稍候...</p>
                      </>
                    )}
                    {calibrationStep === 5 && (
                      <>
                        <h4>校准完成！</h4>
                        <p>您的设备已准备就绪，可以开始使用了</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DeviceBindingPage