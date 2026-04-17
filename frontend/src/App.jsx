import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/layout/Sidebar'
import AIChatPanel from './components/layout/AIChatPanel'
import PartsTable from './components/parts/PartsTable'
import PartModal from './components/modals/PartModal'
import SettingsModal from './components/modals/SettingsModal'
import ImportExportModal from './components/modals/ImportExportModal'
import { ConfirmDialog } from './components/ui'
import { useDeletePart } from './hooks/useData'

function DeleteConfirmWrapper() {
  const { deleteConfirm, setDeleteConfirm } = useApp()
  const deletePart = useDeletePart()

  if (!deleteConfirm) return null

  return (
    <ConfirmDialog
      open={!!deleteConfirm}
      title="Delete Part"
      message={`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
      onConfirm={async () => {
        await deletePart.mutateAsync(deleteConfirm.id)
        setDeleteConfirm(null)
      }}
      onCancel={() => setDeleteConfirm(null)}
    />
  )
}

// ── Center panel with tab bar ──────────────────────────────────────
function CenterPanel() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-bg">
      {/* Tab bar */}
      <div className="flex items-center border-b border-border shrink-0 px-2 bg-panel">
        <button className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-primary border-b-2 border-primary -mb-px">
          Inventory
        </button>
        <button className="px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors" disabled>
          Projects <span className="ml-1 text-[9px] text-border">(soon)</span>
        </button>
      </div>

      {/* Parts table */}
      <div className="flex-1 overflow-hidden">
        <PartsTable />
      </div>
    </div>
  )
}

function Layout() {
  return (
    <div className="flex h-full">
      <Sidebar />
      <CenterPanel />
      <AIChatPanel />

      {/* Modals */}
      <PartModal />
      <SettingsModal />
      <ImportExportModal />
      <DeleteConfirmWrapper />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  )
}
