import React from 'react';
import { Link } from 'react-router-dom';
import './RecordPage.css';

const RecordPage = () => {
  return (
    <div className="record-page">
      <h1 className="page-title">心情记录</h1>
      <div className="record-options">
        <Link to="/real-time-monitoring" className="option-card">
          <div className="option-icon">📈</div>
          <h3>实时心情</h3>
          <p>实时捕捉并记录您的情绪波动，让内心世界可视化</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/history-records" className="option-card">
          <div className="option-icon">📚</div>
          <h3>心情轨迹</h3>
          <p>探索您的情绪历史，发现隐藏在数据中的心灵密码</p>
          <div className="card-decoration"></div>
        </Link>
      </div>
    </div>
  );
};

export default RecordPage;