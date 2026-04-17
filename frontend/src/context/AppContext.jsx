import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // ── Navigation / filter state ───────────────────────────────────
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [activeBinId, setActiveBinId] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [aiPanelCollapsed, setAiPanelCollapsed] = useState(false)

  // ── Modal state ─────────────────────────────────────────────────
  const [partModalOpen, setPartModalOpen] = useState(false)
  const [partModalId, setPartModalId] = useState(null) // null = create
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [importExportModalOpen, setImportExportModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, name }

  // ── AI context parts ────────────────────────────────────────────
  const [contextPartIds, setContextPartIds] = useState([])

  const openPartModal = useCallback((id = null) => {
    setPartModalId(id)
    setPartModalOpen(true)
  }, [])

  const closePartModal = useCallback(() => {
    setPartModalOpen(false)
    setPartModalId(null)
  }, [])

  const toggleContextPart = useCallback((id) => {
    setContextPartIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [])

  const clearContextParts = useCallback(() => setContextPartIds([]), [])

  return (
    <AppContext.Provider value={{
      activeCategoryId, setActiveCategoryId,
      activeBinId, setActiveBinId,
      sidebarCollapsed, setSidebarCollapsed,
      aiPanelCollapsed, setAiPanelCollapsed,
      partModalOpen, partModalId, openPartModal, closePartModal,
      settingsModalOpen, setSettingsModalOpen,
      importExportModalOpen, setImportExportModalOpen,
      deleteConfirm, setDeleteConfirm,
      contextPartIds, toggleContextPart, clearContextParts,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
