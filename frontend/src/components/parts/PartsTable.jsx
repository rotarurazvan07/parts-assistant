import { useState, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { useParts, useDeletePart } from '../../hooks/useData'
import { Button, Spinner, ConfirmDialog } from '../ui'

const COLUMNS = [
  { key: 'name', label: 'Name', width: 'w-40' },
  { key: 'part_number', label: 'Part #', width: 'w-28' },
  { key: 'category_id', label: 'Category', width: 'w-32' },
  { key: 'bin_id', label: 'Bin', width: 'w-28' },
  { key: 'quantity', label: 'Qty', width: 'w-14' },
  { key: 'manufacturer', label: 'Mfr', width: 'w-28' },
]

export default function PartsTable() {
  const { activeCategoryId, activeBinId, contextPartIds, toggleContextPart, openPartModal, setDeleteConfirm } = useApp()
  const deletePart = useDeletePart()

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const LIMIT = 25

  // Debounce search
  const handleSearch = useCallback((val) => {
    setSearch(val)
    clearTimeout(window._searchTimer)
    window._searchTimer = setTimeout(() => {
      setDebouncedSearch(val)
      setPage(1)
    }, 300)
  }, [])

  const params = {
    page,
    limit: LIMIT,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(activeCategoryId && { category_id: activeCategoryId }),
    ...(activeBinId && { bin_id: activeBinId }),
    sort_by: sortBy,
    sort_order: sortOrder,
  }

  const { data, isLoading, isError, error } = useParts(params)
  const parts = data?.parts || []
  const total = data?.total || 0
  const pages = data?.pages || 1

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
    setPage(1)
  }

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span className="text-border ml-0.5">⇅</span>
    return <span className="text-primary ml-0.5">{sortOrder === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search bar + Add button */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
        <div className="relative flex-1">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted font-mono text-xs">⌕</span>
          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search parts, part#, manufacturer, tags…"
            className="input-base pl-6 py-1.5"
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary font-mono text-xs"
            >
              ×
            </button>
          )}
        </div>
        <Button variant="primary" onClick={() => openPartModal(null)}>
          + Add Part
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 px-3 py-1.5 border-b border-border bg-panel shrink-0">
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
          Total: <span className="text-text-primary">{total}</span>
        </span>
        <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
          In Context: <span className="text-ai-accent">{contextPartIds.length}</span>
        </span>
        {(activeCategoryId || activeBinId || debouncedSearch) && (
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
            Filtered: <span className="text-primary">{parts.length} / {total}</span>
          </span>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32 gap-2">
            <Spinner /><span className="font-mono text-xs text-text-muted">Loading…</span>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-32">
            <span className="font-mono text-xs text-destructive">{error.message}</span>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-bg">
              <tr className="border-b border-border">
                {/* AI context column */}
                <th className="w-8 px-2 py-2 border-r border-border">
                  <span className="font-mono text-[9px] text-ai-accent uppercase tracking-widest">AI</span>
                </th>

                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className={`${col.width} px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-text-muted cursor-pointer hover:text-text-primary select-none`}
                    onClick={() => handleSort(col.key)}
                  >
                    {col.label}<SortIcon col={col.key} />
                  </th>
                ))}

                <th className="w-20 px-3 py-2 text-right font-mono text-[10px] uppercase tracking-widest text-text-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {parts.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length + 2} className="text-center py-12 font-mono text-xs text-text-muted">
                    {debouncedSearch ? 'No results found' : 'No parts yet — click + Add Part to get started'}
                  </td>
                </tr>
              ) : (
                parts.map(part => {
                  const inCtx = contextPartIds.includes(part.id)
                  return (
                    <tr key={part.id} className="table-row-base">
                      {/* AI toggle */}
                      <td className="px-2 py-2 border-r border-border text-center">
                        <button
                          onClick={() => toggleContextPart(part.id)}
                          className={`w-4 h-4 border transition-all duration-150 flex items-center justify-center
                            ${inCtx
                              ? 'border-ai-accent bg-ai-accent/10 text-ai-accent shadow-ai-glow'
                              : 'border-border hover:border-ai-accent/50 text-transparent hover:text-ai-accent/30'
                            }`}
                          title={inCtx ? 'Remove from AI context' : 'Add to AI context'}
                        >
                          <span className="font-mono text-[8px]">✓</span>
                        </button>
                      </td>

                      {/* Name */}
                      <td className="table-cell w-40 max-w-[160px]">
                        <button
                          onClick={() => openPartModal(part.id)}
                          className="text-text-primary hover:text-primary transition-colors text-left truncate block w-full font-mono text-xs"
                        >
                          {part.name}
                        </button>
                      </td>

                      <td className="table-cell w-28 text-text-muted">{part.part_number || '—'}</td>
                      <td className="table-cell w-32 text-text-muted">{part.category?.name || '—'}</td>
                      <td className="table-cell w-28 text-text-muted">{part.bin?.name || '—'}</td>

                      {/* Quantity with color */}
                      <td className="table-cell w-14">
                        <span className={`font-mono text-xs font-medium ${
                          part.quantity === 0 ? 'text-destructive' :
                          part.quantity < 5 ? 'text-primary' :
                          'text-text-primary'
                        }`}>
                          {part.quantity}
                        </span>
                      </td>

                      <td className="table-cell w-28 text-text-muted">{part.manufacturer || '—'}</td>

                      {/* Actions */}
                      <td className="px-3 py-2 text-right w-20">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openPartModal(part.id)}
                            className="font-mono text-[10px] text-text-muted hover:text-primary px-1.5 py-0.5 border border-transparent hover:border-border transition-colors"
                            title="Edit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ id: part.id, name: part.name })}
                            className="font-mono text-[10px] text-text-muted hover:text-destructive px-1.5 py-0.5 border border-transparent hover:border-destructive/30 transition-colors"
                            title="Delete"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between px-3 py-2 border-t border-border shrink-0">
          <span className="font-mono text-[10px] text-text-muted">
            Page {page} of {pages} · {total} parts
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost text-[10px] py-1 px-2 disabled:opacity-30"
            >
              ← Prev
            </button>
            {Array.from({ length: Math.min(5, pages) }, (_, i) => {
              const p = Math.max(1, Math.min(pages - 4, page - 2)) + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`font-mono text-[10px] py-1 px-2 border transition-colors
                    ${p === page ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text-primary hover:border-border'}`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="btn-ghost text-[10px] py-1 px-2 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
