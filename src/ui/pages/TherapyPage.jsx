import React from 'react';
import { Link } from 'react-router-dom';
import './TherapyPage.css';

const TherapyPage = () => {
  return (
    <div className="therapy-page">
      <h1 className="page-title">心晴港湾</h1>
      <div className="therapy-options">
        <Link to="/emotion-music" className="option-card">
          <div className="option-icon">🎵</div>
          <h3>心灵旋律</h3>
          <p>在心晴屿的旋律中找到情绪的共鸣，让音乐轻抚您的心灵</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/emotion-cloud" className="option-card">
          <div className="option-icon">☁️</div>
          <h3>情绪云朵</h3>
          <p>在心晴天空中描绘您内心的情感色彩，释放情绪压力</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/mind-symphony" className="option-card">
          <div className="option-icon">🎼</div>
          <h3>脑波交响</h3>
          <p>聆听心晴屿上您大脑的独特乐章，促进深度放松</p>
          <div className="card-decoration"></div>
        </Link>
        <Link to="/perceptual-therapy" className="option-card">
          <div className="option-icon">🎯</div>
          <h3>感知疗愈</h3>
          <p>心晴屿的守护精灵，为您的情绪保驾护航，找回内心平静</p>
          <div className="card-decoration"></div>
        </Link>
      </div>
    </div>
  );
};

export default TherapyPage;