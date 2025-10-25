import React from 'react';
import { Link } from 'react-router-dom';
import './AnalysisPage.css';

const AnalysisPage = () => {
  return (
    <div className="analysis-page">
      <h1 className="page-title">情绪解读</h1>
      <div className="analysis-options">
        <Link to="/emotion-analysis" className="option-card">
          <div className="option-icon">😀</div>
          <h3>情绪洞察</h3>
          <p>解码您的情绪图谱，发现内心世界的微妙变化</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/attention-analysis" className="option-card">
          <div className="option-icon">🔍</div>
          <h3>专注探索</h3>
          <p>追踪您的注意力状态，提升心流体验质量</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/brain-computer-interface" className="option-card">
          <div className="option-icon">🧠</div>
          <h3>脑波探索</h3>
          <p>深入解读脑电波信号，连接心灵与科技</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/professional-report" className="option-card">
          <div className="option-icon">📋</div>
          <h3>心晴报告</h3>
          <p>获取个性化的情绪健康分析与建议</p>
          <div className="card-decoration"></div>
        </Link>
      </div>
    </div>
  );
};

export default AnalysisPage;