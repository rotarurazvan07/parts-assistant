import React from 'react';
import { useAppContext } from '@context/AppContext';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import RightSidebar from './RightSidebar';
import CategoryTree from './CategoryTree';
import BinsList from './BinsList';
import SidebarFooter from './SidebarFooter';

const Layout = ({ children }) => {
  const { sidebarCollapsed } = useAppContext();
  
  return (
    <div className="flex h-screen bg-background flex-col">
      {/* Global Top Bar - Full width */}
      <TopBar />
      
      {/* Main Content Area with Sidebars */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Categories & Bins */}
          <div className={`hidden md:flex flex-col border-r border-border ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
          <Sidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <MainContent>
            {children}
          </MainContent>
        </div>
        
        {/* Right Sidebar - AI Chat */}
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;