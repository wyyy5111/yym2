import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../core/contexts/AuthContext';
import './UserClassificationPage.css';

const UserClassificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    gender: '',
    age: '',
    occupation: '',
    purpose: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除该字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 简化验证，只要求必须选择用户类型
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.purpose) {
      newErrors.purpose = '请选择使用目的';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 保存用户分类信息到本地存储
      localStorage.setItem('userClassification', JSON.stringify({
        gender: formData.gender,
        age: formData.age,
        occupation: formData.occupation,
        userType: formData.purpose === 'self-improvement' ? 'selfOptimization' : 'symptomManagement'
      }));
      
      // 标记分类完成
      localStorage.setItem('hasCompletedClassification', 'true');
      localStorage.setItem('userType', formData.purpose === 'self-improvement' ? 'selfOptimization' : 'symptomManagement');
      
      // 跳转到主页面
      navigate('/journal');
    } catch (error) {
      console.error('保存分类信息失败:', error);
      // 这里可以添加错误提示
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="classification-container">
      <div className="classification-card">
        <h2 className="classification-title">用户分类</h2>
        <p className="classification-subtitle">请完成以下信息，帮助我们为您提供个性化服务</p>
        
        <form className="classification-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">性别</label>
            <div className="gender-options">
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="gender" 
                  value="male" 
                  checked={formData.gender === 'male'} 
                  onChange={handleChange}
                />
                <span>男</span>
              </label>
              <label className="radio-option">
                <input 
                  type="radio" 
                  name="gender" 
                  value="female" 
                  checked={formData.gender === 'female'} 
                  onChange={handleChange}
                />
                <span>女</span>
              </label>

            </div>
            {errors.gender && <span className="error-message">{errors.gender}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="age">年龄</label>
            <input 
              type="number" 
              id="age" 
              name="age" 
              value={formData.age} 
              onChange={handleChange}
              className={`form-input ${errors.age ? 'error' : ''}`}
              placeholder="请输入您的年龄"
            />
            {errors.age && <span className="error-message">{errors.age}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="occupation">职业</label>
            <input 
              type="text" 
              id="occupation" 
              name="occupation" 
              value={formData.occupation} 
              onChange={handleChange}
              className={`form-input ${errors.occupation ? 'error' : ''}`}
              placeholder="请输入您的职业"
            />
            {errors.occupation && <span className="error-message">{errors.occupation}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">使用目的</label>
            <div className="purpose-options">
              <label className="radio-option purpose-option">
                <input 
                  type="radio" 
                  name="purpose" 
                  value="self-improvement" 
                  checked={formData.purpose === 'self-improvement'} 
                  onChange={handleChange}
                />
                <div className="purpose-info">
                  <span className="purpose-title">自我优化型</span>
                  <span className="purpose-desc">追求日常效率、专注力和情绪稳定，将"正常"状态提升到"轻松"状态。</span>
                </div>
              </label>
              <label className="radio-option purpose-option">
                <input 
                  type="radio" 
                  name="purpose" 
                  value="symptom-relief" 
                  checked={formData.purpose === 'symptom-relief'} 
                  onChange={handleChange}
                />
                <div className="purpose-info">
                  <span className="purpose-title">症状应对型</span>
                  <span className="purpose-desc">正在经历明显的焦虑或抑郁情绪，并主动寻求数据支持的解决方案或治疗。</span>
                </div>
              </label>
            </div>
            {errors.purpose && <span className="error-message">{errors.purpose}</span>}
          </div>
          
          <div className="classification-actions">
            <button 
              type="button" 
              className="skip-button"
              onClick={() => {
                localStorage.setItem('userClassificationSkipped', 'true');
                navigate('/journal');
              }}
            >
              跳过
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? '保存中...' : '完成'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserClassificationPage;
