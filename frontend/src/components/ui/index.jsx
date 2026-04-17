import { forwardRef, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// ── Button ─────────────────────────────────────────────────────────
export function Button({ variant = 'secondary', size = 'md', className = '', children, ...props }) {
  const base = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  }[variant] || 'btn-secondary'

  const sz = size === 'sm' ? 'py-1 px-2 text-[10px]' : ''

  return (
    <button className={`${base} ${sz} ${className} disabled:opacity-40 disabled:cursor-not-allowed`} {...props}>
      {children}
    </button>
  )
}

// ── Input ──────────────────────────────────────────────────────────
export const Input = forwardRef(function Input({ label, error, className = '', ...props }, ref) {
  return (
    <div>
      {label && <label className="label-base">{label}</label>}
      <input ref={ref} className={`input-base ${error ? 'border-destructive' : ''} ${className}`} {...props} />
      {error && <p className="font-mono text-[10px] text-destructive mt-0.5">{error}</p>}
    </div>
  )
})

// ── Textarea ───────────────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea({ label, error, className = '', rows = 3, ...props }, ref) {
  return (
    <div>
      {label && <label className="label-base">{label}</label>}
      <textarea
        ref={ref}
        rows={rows}
        className={`input-base resize-none ${error ? 'border-destructive' : ''} ${className}`}
        {...props}
      />
      {error && <p className="font-mono text-[10px] text-destructive mt-0.5">{error}</p>}
    </div>
  )
})

// ── Select ─────────────────────────────────────────────────────────
export const Select = forwardRef(function Select({ label, error, className = '', children, ...props }, ref) {
  return (
    <div>
      {label && <label className="label-base">{label}</label>}
      <select
        ref={ref}
        className={`input-base appearance-none ${error ? 'border-destructive' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="font-mono text-[10px] text-destructive mt-0.5">{error}</p>}
    </div>
  )
})

// ── Spinner ────────────────────────────────────────────────────────
export function Spinner({ size = 16, className = '' }) {
  return (
    <svg
      className={`animate-spin text-text-muted ${className}`}
      width={size} height={size}
      viewBox="0 0 24 24" fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeLinecap="round" />
    </svg>
  )
}

// ── Modal ──────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = 'max-w-xl' }) {
  const overlayRef = useRef()

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="modal-overlay animate-fade-in"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className={`modal-box ${width} animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <h2 className="font-mono text-xs uppercase tracking-widest text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors font-mono text-lg leading-none"
          >
            ×
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Tabs ───────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex border-b border-border shrink-0">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors
            ${active === t.id
              ? 'text-primary border-b-2 border-primary -mb-px'
              : 'text-text-muted hover:text-text-primary'
            }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── Confirm Dialog ─────────────────────────────────────────────────
export function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger = true }) {
  if (!open) return null
  return createPortal(
    <div className="modal-overlay animate-fade-in">
      <div className="modal-box max-w-sm animate-slide-up">
        <div className="p-5 space-y-3">
          <h3 className="font-mono text-sm uppercase tracking-wider text-text-primary">{title}</h3>
          <p className="font-body text-xs text-text-muted">{message}</p>
          <div className="flex gap-2 pt-2">
            <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} className="flex-1">Confirm</Button>
            <Button variant="ghost" onClick={onCancel} className="flex-1">Cancel</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Tag chips row ──────────────────────────────────────────────────
export function TagList({ tags, onRemove }) {
  if (!tags || !tags.length) return null
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map(t => (
        <span key={t} className="tag-chip">
          {t}
          {onRemove && (
            <button onClick={() => onRemove(t)} className="ml-0.5 hover:text-destructive">×</button>
          )}
        </span>
      ))}
    </div>
  )
}
