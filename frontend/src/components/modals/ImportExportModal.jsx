import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { importExportApi } from '../../services/api'
import { Modal, Tabs, Button, Spinner } from '../ui'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const TABS = [{ id: 'import', label: 'Import' }, { id: 'export', label: 'Export' }]

export default function ImportExportModal() {
  const { importExportModalOpen, setImportExportModalOpen } = useApp()
  const qc = useQueryClient()
  const [tab, setTab] = useState('import')
  const [dragging, setDragging] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const processFile = async (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const text = await file.text()
      const res = await importExportApi.import(text)
      setResult(res.data)
      qc.invalidateQueries({ queryKey: ['parts'] })
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['bins'] })
      toast.success(`Imported ${res.data.imported} parts`)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  return (
    <Modal
      open={importExportModalOpen}
      onClose={() => setImportExportModalOpen(false)}
      title="Import / Export"
      width="max-w-lg"
    >
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'import' && (
        <div className="p-5 space-y-4">
          {/* Drop zone */}
          <div
            onDragEnter={() => setDragging(true)}
            onDragLeave={() => setDragging(false)}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors
              ${dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-text-muted'}`}
          >
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => processFile(e.target.files[0])} />
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Spinner /><span className="font-mono text-xs text-text-muted">Importing…</span>
              </div>
            ) : (
              <>
                <div className="font-mono text-2xl text-text-muted mb-2">⇅</div>
                <p className="font-mono text-xs text-text-muted">Drop CSV file here or click to browse</p>
              </>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className={`p-3 border font-mono text-xs space-y-1
              ${result.errors.length ? 'border-primary/30 bg-primary/5' : 'border-ai-accent/30 bg-ai-accent/5'}`}>
              <p className="text-text-primary">✓ Imported: <span className="text-ai-accent">{result.imported}</span> parts</p>
              {result.errors.length > 0 && (
                <div>
                  <p className="text-primary">{result.errors.length} error(s):</p>
                  <ul className="text-text-muted space-y-0.5 mt-1 max-h-32 overflow-y-auto">
                    {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Sample format */}
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-text-muted mb-1">CSV Format</div>
            <pre className="bg-hover border border-border p-2 font-mono text-[10px] text-text-muted overflow-x-auto">
              {`name,part_number,manufacturer,category,bin,quantity,description,tags,specifications
Resistor 10kΩ,RES-10K,Yageo,Resistors,Drawer A1,100,THT 1/4W,resistor,[]`}
            </pre>
          </div>

          <a href={importExportApi.sampleUrl()} download className="btn-ghost text-[10px] inline-block py-1">
            ↓ Download Sample CSV
          </a>
        </div>
      )}

      {tab === 'export' && (
        <div className="p-5 space-y-4">
          <p className="font-mono text-xs text-text-muted">
            Export all parts to a CSV file. Specifications are exported as JSON.
          </p>
          <a
            href={importExportApi.exportUrl()}
            download="parts_export.csv"
            className="btn-primary inline-block"
          >
            ↓ Export All Parts (CSV)
          </a>
        </div>
      )}
    </Modal>
  )
}
