import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EmotionMusicPage.css';

const EmotionMusicPage = () => {
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentMusic, setCurrentMusic] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  useEffect(() => {
    // 模拟检测当前情绪（实际应用中可能基于后端数据）
    const detectEmotion = () => {
      const emotions = ['平静', '专注', '愉悦', '放松', '紧张', '焦虑'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      setCurrentEmotion(randomEmotion);
    };

    detectEmotion();
    loadMusicList();
  }, []);

  // 加载音乐列表
  const loadMusicList = () => {
    setLoading(true);
    // 模拟网络延迟
    setTimeout(() => {
      const mockMusicList = generateMockMusicList();
      setMusicList(mockMusicList);
      setLoading(false);
    }, 500);
  };

  // 生成模拟音乐数据
  const generateMockMusicList = () => {
    const categories = [
      { id: 'relax', name: '放松减压', icon: '🧘' },
      { id: 'focus', name: '专注学习', icon: '🎯' },
      { id: 'happy', name: '愉悦心情', icon: '😊' },
      { id: 'calm', name: '平静心灵', icon: '😌' },
      { id: 'sleep', name: '助眠音乐', icon: '😴' },
      { id: 'energy', name: '活力激发', icon: '💪' }
    ];

    const musicData = [];
    
    categories.forEach(category => {
      // 每个类别生成5-8首音乐
      const count = Math.floor(Math.random() * 4) + 5;
      
      for (let i = 1; i <= count; i++) {
        musicData.push({
          id: `${category.id}-${i}`,
          title: `${category.name}音乐 ${i}`,
          artist: getRandomArtist(),
          category: category.id,
          categoryName: category.name,
          categoryIcon: category.icon,
          duration: Math.floor(Math.random() * 120) + 180, // 3-5分钟
          coverUrl: `https://picsum.photos/id/${(category.id.charCodeAt(0) + i) % 100}/300/300`,
          playCount: Math.floor(Math.random() * 10000) + 1000,
          favorite: Math.random() > 0.8
        });
      }
    });

    return musicData;
  };

  // 生成随机艺术家名称
  const getRandomArtist = () => {
    const artists = ['轻音乐大师', '自然音乐家', '冥想音乐团队', '心灵治愈师', '环境音乐创作者'];
    return artists[Math.floor(Math.random() * artists.length)];
  };

  // 格式化时长
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 播放音乐
  const playMusic = (music) => {
    setCurrentMusic(music);
    setIsPlaying(true);
    setShowPlayer(true);
    // 在实际应用中这里会调用音频API
  };

  // 暂停/恢复播放
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // 在实际应用中这里会控制音频播放状态
  };

  // 切换收藏状态
  const toggleFavorite = (musicId) => {
    setMusicList(musicList.map(music => 
      music.id === musicId ? { ...music, favorite: !music.favorite } : music
    ));
    
    if (currentMusic && currentMusic.id === musicId) {
      setCurrentMusic({ ...currentMusic, favorite: !currentMusic.favorite });
    }
  };

  // 过滤音乐列表
  const filteredMusicList = selectedCategory === 'all' 
    ? musicList 
    : musicList.filter(music => music.category === selectedCategory);

  // 推荐音乐（基于当前情绪）
  const recommendedMusic = () => {
    const emotionCategoryMap = {
      '平静': 'calm',
      '专注': 'focus',
      '愉悦': 'happy',
      '放松': 'relax',
      '紧张': 'relax',
      '焦虑': 'relax'
    };

    const recommendedCategory = emotionCategoryMap[currentEmotion] || 'relax';
    return musicList
      .filter(music => music.category === recommendedCategory)
      .slice(0, 3);
  };

  const categories = [
    { id: 'all', name: '全部', icon: '🎵' },
    { id: 'relax', name: '放松减压', icon: '🧘' },
    { id: 'focus', name: '专注学习', icon: '🎯' },
    { id: 'happy', name: '愉悦心情', icon: '😊' },
    { id: 'calm', name: '平静心灵', icon: '😌' },
    { id: 'sleep', name: '助眠音乐', icon: '😴' },
    { id: 'energy', name: '活力激发', icon: '💪' }
  ];

  return (
    <div className="emotion-music-container">
      <Link to="/therapy" className="btn btn-secondary" style={{ marginBottom: '20px', display: 'inline-block' }}>
        ← 返回调节
      </Link>
      <h1>情绪音乐</h1>
      
      {/* 情绪检测推荐 */}
      {currentEmotion && (
        <div className="emotion-recommendation">
          <div className="emotion-detection">
            <span className="detection-text">检测到您当前情绪：</span>
            <span className="emotion-tag">{currentEmotion}</span>
          </div>
          <h2>为您推荐</h2>
          <div className="recommended-music">
            {recommendedMusic().map(music => (
              <div key={music.id} className="music-card" onClick={() => playMusic(music)}>
                <div className="music-cover">
                  <img src={music.coverUrl} alt={music.title} />
                  <div className="play-overlay">
                    <span className="play-icon">▶️</span>
                  </div>
                </div>
                <div className="music-info">
                  <div className="music-title">{music.title}</div>
                  <div className="music-artist">{music.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 分类选择 */}
      <div className="category-section">
        <h2>音乐分类</h2>
        <div className="categories-list">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 音乐列表 */}
      <div className="music-list-section">
        <h2>
          {selectedCategory === 'all' ? '全部音乐' : 
           categories.find(c => c.id === selectedCategory)?.name}
          <span className="music-count">({filteredMusicList.length})</span>
        </h2>
        
        {loading ? (
          <div className="loading">加载音乐中...</div>
        ) : (
          <div className="music-list">
            {filteredMusicList.map(music => (
              <div key={music.id} className="music-item" onClick={() => playMusic(music)}>
                <div className="music-item-left">
                  <img src={music.coverUrl} alt={music.title} className="music-item-cover" />
                  <div className="music-item-info">
                    <div className="music-item-title">{music.title}</div>
                    <div className="music-item-meta">
                      <span className="music-item-category">{music.categoryIcon} {music.categoryName}</span>
                      <span className="music-item-artist">{music.artist}</span>
                    </div>
                  </div>
                </div>
                <div className="music-item-right">
                  <span className="music-duration">{formatDuration(music.duration)}</span>
                  <button 
                    className={`favorite-btn ${music.favorite ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(music.id);
                    }}
                  >
                    {music.favorite ? '❤️' : '🤍'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 音乐播放器 */}
      {showPlayer && currentMusic && (
        <div className="music-player">
          <div className="player-content">
            <div className="player-info">
              <img src={currentMusic.coverUrl} alt={currentMusic.title} className="player-cover" />
              <div className="player-details">
                <div className="player-title">{currentMusic.title}</div>
                <div className="player-artist">{currentMusic.artist}</div>
              </div>
              <button 
                className={`player-favorite-btn ${currentMusic.favorite ? 'active' : ''}`}
                onClick={() => toggleFavorite(currentMusic.id)}
              >
                {currentMusic.favorite ? '❤️' : '🤍'}
              </button>
            </div>
            
            <div className="player-controls">
              <button className="control-btn">⏮️</button>
              <button className="control-btn play-btn" onClick={togglePlayPause}>
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              <button className="control-btn">⏭️</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionMusicPage;