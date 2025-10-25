import React from 'react';
import BottomNavigation from './BottomNavigation';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <main className="main-content">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;