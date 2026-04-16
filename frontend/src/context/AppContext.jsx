import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppContextProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [language, setLanguage] = useState('en');
  
  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      rightSidebarCollapsed,
      setRightSidebarCollapsed,
      language,
      setLanguage
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider');
  }
  return context;
}