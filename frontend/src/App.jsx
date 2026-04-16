import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import context providers
import { AppContextProvider } from '@context/AppContext';
import { AIContextProvider } from '@context/AIContext';
import { NavigationContextProvider } from '@context/NavigationContext';
import { ModalContextProvider } from '@context/ModalContext';

// Import components
import Layout from './components/layout/Layout';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import PartsManagement from './components/parts/PartsManagement';
import CategoryTree from './components/layout/CategoryTree';
import BinsList from './components/layout/BinsList';
import SidebarFooter from './components/layout/SidebarFooter';
import PartModal from './components/modals/PartModal';
import SettingsModal from './components/modals/SettingsModal';
import ImportExportModal from './components/modals/ImportExportModal';
import AIChatInterface from './components/layout/AIChatInterface';

function App() {
  // State for modals
  const [showPartModal, setShowPartModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);
  
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AppContextProvider>
        <AIContextProvider>
          <NavigationContextProvider>
            <ModalContextProvider>
              <Layout>
                <PartsManagement />
              </Layout>
              
              {/* Modals */}
              {showSettingsModal && (
                <SettingsModal
                  isOpen={showSettingsModal}
                  onClose={() => setShowSettingsModal(false)}
                  settings={{}} // Will be fetched from backend
                  onSave={(data) => {
                    // Save settings to backend via SettingsService
                    console.log('Saving settings:', data);
                    setShowSettingsModal(false);
                  }}
                />
              )}
              
              {showImportExportModal && (
                <ImportExportModal
                  isOpen={showImportExportModal}
                  onClose={() => setShowImportExportModal(false)}
                  onImport={async (file) => {
                    // Import will be handled by the modal itself via service
                    console.log('Import triggered');
                  }}
                  onExport={async () => {
                    // Export will be handled by the modal itself via service
                    console.log('Export triggered');
                  }}
                />
              )}
              
              {/* Mobile/Tablet View - Stacked layout for smaller screens */}
              <div className="md:hidden h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  <PartsManagement />
                </div>
                <div className="p-4 border-t border-border">
                  <div className="flex justify-around">
                    <button
                      className="p-2"
                      onClick={() => console.log('Show parts')}
                    >
                      <div>📋</div>
                      <span className="text-xs">Parts</span>
                    </button>
                    <button
                      className="p-2"
                      onClick={() => {
                        // Could toggle between views
                        console.log('Show categories');
                      }}
                    >
                      <div>📂</div>
                      <span className="text-xs">Categories</span>
                    </button>
                    <button
                      className="p-2"
                      onClick={() => console.log('Show AI')}
                    >
                      <div>🤖</div>
                      <span className="text-xs">AI Assistant</span>
                    </button>
                  </div>
                </div>
              </div>
            </ModalContextProvider>
          </NavigationContextProvider>
        </AIContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  );
}

export default App;