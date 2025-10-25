import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BottomNavigation from './ui/components/BottomNavigation';
import EmotionJournalPage from './ui/pages/EmotionJournalPage';
import RecordPage from './ui/pages/RecordPage';
import AnalysisPage from './ui/pages/AnalysisPage';
import TherapyPage from './ui/pages/TherapyPage';
import RealTimeMonitoringPage from './ui/pages/RealTimeMonitoringPage';
import HistoryRecordsPage from './ui/pages/HistoryRecordsPage';
import EmotionAnalysisPage from './ui/pages/EmotionAnalysisPage';
import AttentionAnalysisPage from './ui/pages/AttentionAnalysisPage';
import ProfessionalReportPage from './ui/pages/ProfessionalReportPage';
import EmotionMusicPage from './ui/pages/EmotionMusicPage';
import EmotionCloudPage from './ui/pages/EmotionCloudPage';
import MyProfilePage from './ui/pages/MyProfilePage';
import BrainComputerInterfacePage from './ui/pages/BrainComputerInterfacePage';
import MindSymphonyPage from './ui/pages/MindSymphonyPage';
import PerceptualTherapyPage from './ui/pages/PerceptualTherapyPage';
import LoginPage from './ui/pages/LoginPage';
import RegisterPage from './ui/pages/RegisterPage';
import WelcomePage from './ui/pages/WelcomePage';
import ConsentFormPage from './ui/pages/ConsentFormPage';
import UserClassificationPage from './ui/pages/UserClassificationPage';
import { AuthProvider, ProtectedRoute } from './core/contexts/AuthContext';
import './App.css';
import './assets/css/button.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* 公开路由 */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 登录后显示的同意书页面（需要登录） */}
        <Route path="/consent-form" element={
          <ProtectedRoute>
            <ConsentFormPage />
          </ProtectedRoute>
        } />
        
        {/* 受保护路由（需要登录） */}
        <Route path="/user-classification" element={
          <ProtectedRoute>
            <UserClassificationPage />
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute>
            <AppContent>
              <EmotionJournalPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/record" element={
          <ProtectedRoute>
            <AppContent>
              <RecordPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/analysis" element={
          <ProtectedRoute>
            <AppContent>
              <AnalysisPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/therapy" element={
          <ProtectedRoute>
            <AppContent>
              <TherapyPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/real-time-monitoring" element={
          <ProtectedRoute>
            <AppContent>
              <RealTimeMonitoringPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/history-records" element={
          <ProtectedRoute>
            <AppContent>
              <HistoryRecordsPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/emotion-analysis" element={
          <ProtectedRoute>
            <AppContent>
              <EmotionAnalysisPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/attention-analysis" element={
          <ProtectedRoute>
            <AppContent>
              <AttentionAnalysisPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/professional-report" element={
          <ProtectedRoute>
            <AppContent>
              <ProfessionalReportPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/emotion-music" element={
          <ProtectedRoute>
            <AppContent>
              <EmotionMusicPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/emotion-cloud" element={
          <ProtectedRoute>
            <AppContent>
              <EmotionCloudPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/my-profile" element={
          <ProtectedRoute>
            <AppContent>
              <MyProfilePage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/brain-computer-interface" element={
          <ProtectedRoute>
            <AppContent>
              <BrainComputerInterfacePage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/mind-symphony" element={
          <ProtectedRoute>
            <AppContent>
              <MindSymphonyPage />
            </AppContent>
          </ProtectedRoute>
        } />
        <Route path="/perceptual-therapy" element={
          <ProtectedRoute>
            <AppContent>
              <PerceptualTherapyPage />
            </AppContent>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

// 应用内容容器组件，包含主内容区和底部导航
const AppContent = ({ children }) => {
  return (
    <div className="app-container">
      <main className="main-content">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default App;