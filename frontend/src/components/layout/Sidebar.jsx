import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { useCategories, useBins, useCreateCategory, useCreateBin, useDeleteCategory, useDeleteBin } from '../../hooks/useData'
import { Button, Input } from '../ui'

// ── Category Tree ──────────────────────────────────────────────────
function CategoryNode({ node, depth = 0 }) {
  const { activeCategoryId, setActiveCategoryId, setActiveBinId } = useApp()
  const deleteCategory = useDeleteCategory()
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = node.subcategories && node.subcategories.length > 0
  const isActive = activeCategoryId === node.id

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 cursor-pointer group transition-colors
          ${isActive ? 'bg-hover text-primary' : 'hover:bg-hover text-text-muted hover:text-text-primary'}`}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(v => !v) }}
            className="w-3 h-3 flex items-center justify-center text-text-muted hover:text-text-primary shrink-0"
          >
            <span className="font-mono text-[10px]">{expanded ? '▾' : '▸'}</span>
          </button>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        <span
          className="flex-1 font-mono text-[11px] truncate select-none"
          onClick={() => {
            setActiveCategoryId(isActive ? null : node.id)
            setActiveBinId(null)
          }}
        >
          {node.name}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); deleteCategory.mutate(node.id) }}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-destructive transition-opacity font-mono text-xs ml-1"
          title="Delete category"
        >
          ×
        </button>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.subcategories.map(child => (
            <CategoryNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryTree() {
  const { data: categories = [], isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [expanded, setExpanded] = useState(true)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await createCategory.mutateAsync({ name: newName.trim() })
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div className="border-b border-border">
      <button
        className="section-title w-full text-left flex items-center justify-between hover:text-text-primary transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <span>Categories</span>
        <span className="font-mono text-xs">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <>
          <div className="max-h-64 overflow-y-auto">
            {isLoading ? (
              <p className="px-3 py-2 font-mono text-[10px] text-text-muted">Loading…</p>
            ) : categories.length === 0 ? (
              <p className="px-3 py-2 font-mono text-[10px] text-text-muted">No categories</p>
            ) : (
              categories.map(cat => <CategoryNode key={cat.id} node={cat} />)
            )}
          </div>

          {showAdd ? (
            <div className="p-2 flex gap-1 border-t border-border">
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAdd(false) }}
                placeholder="Category name…"
                className="input-base flex-1 py-1 text-[11px]"
              />
              <button onClick={handleAdd} className="text-primary hover:text-primary-hover font-mono text-xs px-1">✓</button>
              <button onClick={() => setShowAdd(false)} className="text-text-muted hover:text-text-primary font-mono text-xs px-1">✕</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted hover:text-primary hover:bg-hover transition-colors border-t border-border"
            >
              + Add Category
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ── Bins List ──────────────────────────────────────────────────────
function BinsList() {
  const { activeBinId, setActiveBinId, setActiveCategoryId } = useApp()
  const { data: bins = [], isLoading } = useBins()
  const createBin = useCreateBin()
  const deleteBin = useDeleteBin()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [expanded, setExpanded] = useState(true)

  const handleAdd = async () => {
    if (!newName.trim()) return
    await createBin.mutateAsync({ name: newName.trim() })
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div className="border-b border-border">
      <button
        className="section-title w-full text-left flex items-center justify-between hover:text-text-primary transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <span>Storage Bins</span>
        <span className="font-mono text-xs">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <>
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <p className="px-3 py-2 font-mono text-[10px] text-text-muted">Loading…</p>
            ) : bins.length === 0 ? (
              <p className="px-3 py-2 font-mono text-[10px] text-text-muted">No bins yet</p>
            ) : (
              bins.map(bin => {
                const isActive = activeBinId === bin.id
                return (
                  <div
                    key={bin.id}
                    className={`flex items-center gap-1 px-3 py-1.5 cursor-pointer group transition-colors
                      ${isActive ? 'bg-hover text-primary' : 'hover:bg-hover text-text-muted hover:text-text-primary'}`}
                  >
                    <span className="font-mono text-[10px] mr-1 shrink-0">□</span>
                    <span
                      className="flex-1 font-mono text-[11px] truncate select-none"
                      onClick={() => {
                        setActiveBinId(isActive ? null : bin.id)
                        setActiveCategoryId(null)
                      }}
                    >
                      {bin.name}
                    </span>
                    <button
                      onClick={() => deleteBin.mutate(bin.id)}
                      className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-destructive transition-opacity font-mono text-xs"
                    >
                      ×
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {showAdd ? (
            <div className="p-2 flex gap-1 border-t border-border">
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setShowAdd(false) }}
                placeholder="Bin name…"
                className="input-base flex-1 py-1 text-[11px]"
              />
              <button onClick={handleAdd} className="text-primary hover:text-primary-hover font-mono text-xs px-1">✓</button>
              <button onClick={() => setShowAdd(false)} className="text-text-muted hover:text-text-primary font-mono text-xs px-1">✕</button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full text-left px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-text-muted hover:text-primary hover:bg-hover transition-colors border-t border-border"
            >
              + Add Bin
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────
export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, setSettingsModalOpen, setImportExportModalOpen, activeCategoryId, setActiveCategoryId, activeBinId, setActiveBinId } = useApp()

  return (
    <div
      className={`flex flex-col bg-panel border-r border-border transition-all duration-200 shrink-0 ${sidebarCollapsed ? 'w-10' : 'w-[220px]'}`}
      style={{ height: '100%', overflow: 'hidden' }}
    >
      {sidebarCollapsed ? (
        // Rail
        <div className="flex flex-col items-center py-2 gap-2">
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="text-text-muted hover:text-text-primary font-mono text-xs p-1"
            title="Expand sidebar"
          >
            ▸
          </button>
          <button onClick={() => setImportExportModalOpen(true)} className="text-text-muted hover:text-primary font-mono text-sm p-1" title="Import/Export">⇅</button>
          <button onClick={() => setSettingsModalOpen(true)} className="text-text-muted hover:text-primary font-mono text-sm p-1" title="Settings">⚙</button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
            <div>
              <div className="font-heading font-bold text-sm text-text-primary tracking-tight">LAB</div>
              <div className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Electronics Inventory</div>
            </div>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="text-text-muted hover:text-text-primary font-mono text-xs"
              title="Collapse"
            >
              ◂
            </button>
          </div>

          {/* Active filters */}
          {(activeCategoryId || activeBinId) && (
            <div className="px-3 py-1.5 border-b border-border flex items-center gap-1 flex-wrap">
              {activeCategoryId && (
                <button
                  onClick={() => setActiveCategoryId(null)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-hover border border-primary/30 font-mono text-[10px] text-primary"
                >
                  cat filter ×
                </button>
              )}
              {activeBinId && (
                <button
                  onClick={() => setActiveBinId(null)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-hover border border-primary/30 font-mono text-[10px] text-primary"
                >
                  bin filter ×
                </button>
              )}
            </div>
          )}

          {/* Scrollable nav area */}
          <div className="flex-1 overflow-y-auto">
            <CategoryTree />
            <BinsList />
          </div>

          {/* Footer */}
          <div className="border-t border-border p-2 flex gap-1 shrink-0">
            <button
              onClick={() => setImportExportModalOpen(true)}
              className="flex-1 btn-ghost text-[10px] py-1.5"
            >
              ⇅ Import/Export
            </button>
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="flex-1 btn-ghost text-[10px] py-1.5"
            >
              ⚙ Settings
            </button>
          </div>
        </>
      )}
    </div>
  )
}
