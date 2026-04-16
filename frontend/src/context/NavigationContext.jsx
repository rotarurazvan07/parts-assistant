import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export function NavigationContextProvider({ children }) {
  const [activeTab, setActiveTab] = useState('parts');
  const [mobileView, setMobileView] = useState(false);
  
  return (
    <NavigationContext.Provider value={{
      activeTab,
      setActiveTab,
      mobileView,
      setMobileView
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationContextProvider');
  }
  return context;
}