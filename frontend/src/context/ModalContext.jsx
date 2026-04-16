import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export function ModalContextProvider({ children }) {
  const [modalVisibility, setModalVisibility] = useState({
    partModal: false,
    settingsModal: false,
    importExportModal: false
  });
  
  return (
    <ModalContext.Provider value={{
      modalVisibility,
      setModalVisibility
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within ModalContextProvider');
  }
  return context;
}