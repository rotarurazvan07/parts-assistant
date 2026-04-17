import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useApp } from '../../context/AppContext'
import { usePart, useCreatePart, useUpdatePart, useCategories, useBins } from '../../hooks/useData'
import { partsApi, documentsApi } from '../../services/api'
import { Modal, Tabs, Button, Input, Textarea, Select, TagList, Spinner } from '../ui'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

const TABS = [
  { id: 'details', label: 'Details' },
  { id: 'specs', label: 'Specs' },
  { id: 'docs', label: 'Documents' },
]

// ── Specifications tab ─────────────────────────────────────────────
function SpecsTab({ fields, append, remove, register }) {
  return (
    <div className="p-4 space-y-2">
      <div className="space-y-1">
        {fields.map((field, i) => (
          <div key={field.id} className="flex gap-1">
            <input
              {...register(`specifications.${i}.key`)}
              placeholder="key (e.g. voltage)"
              className="input-base flex-1"
            />
            <input
              {...register(`specifications.${i}.value`)}
              placeholder="value (e.g. 5V)"
              className="input-base flex-1"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-text-muted hover:text-destructive font-mono text-sm px-2 border border-transparent hover:border-destructive/30 transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => append({ key: '', value: '' })}
        className="btn-ghost text-[10px] py-1"
      >
        + Add Specification
      </button>
    </div>
  )
}

// ── Documents tab ──────────────────────────────────────────────────
function DocsTab({ partId }) {
  const qc = useQueryClient()
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [urlForm, setUrlForm] = useState({ name: '', url: '', document_type: 'datasheet' })
  const [uploading, setUploading] = useState(false)
  const [showUrlForm, setShowUrlForm] = useState(false)

  useEffect(() => {
    if (!partId) return
    partsApi.listDocs(partId).then(r => setDocs(r.data))
  }, [partId])

  const addUrl = async () => {
    if (!urlForm.name || !urlForm.url) return
    try {
      const res = await partsApi.addDoc(partId, urlForm)
      setDocs(d => [...d, res.data])
      setUrlForm({ name: '', url: '', document_type: 'datasheet' })
      setShowUrlForm(false)
      toast.success('Document added')
    } catch (e) { toast.error(e.message) }
  }

  const uploadFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    fd.append('name', file.name)
    fd.append('document_type', 'datasheet')
    setUploading(true)
    try {
      const res = await partsApi.uploadDoc(partId, fd)
      setDocs(d => [...d, res.data])
      toast.success('File uploaded')
    } catch (e) { toast.error(e.message) }
    finally { setUploading(false); e.target.value = '' }
  }

  const removeDoc = async (id) => {
    try {
      await documentsApi.remove(id)
      setDocs(d => d.filter(x => x.id !== id))
      toast.success('Document removed')
    } catch (e) { toast.error(e.message) }
  }

  if (!partId) return (
    <div className="p-4 text-center font-mono text-xs text-text-muted">
      Save the part first to manage documents
    </div>
  )

  return (
    <div className="p-4 space-y-3">
      {/* Doc list */}
      {docs.length === 0 ? (
        <p className="font-mono text-xs text-text-muted">No documents yet</p>
      ) : (
        <div className="space-y-1">
          {docs.map(d => (
            <div key={d.id} className="flex items-center gap-2 p-2 bg-hover border border-border group">
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider w-16 shrink-0">
                {d.document_type || 'doc'}
              </span>
              <span className="flex-1 font-mono text-xs text-text-primary truncate">{d.name}</span>
              {d.url && (
                <a href={d.url} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[10px] text-primary hover:text-primary-hover px-1.5">
                  ↗ Open
                </a>
              )}
              {d.storage_path && (
                <a href={documentsApi.downloadUrl(d.id)} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-[10px] text-primary hover:text-primary-hover px-1.5">
                  ↓ Download
                </a>
              )}
              <button
                onClick={() => removeDoc(d.id)}
                className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-destructive font-mono text-xs transition-opacity"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setShowUrlForm(v => !v)}
          className="btn-ghost text-[10px] py-1"
        >
          + Add URL Link
        </button>
        <label className="btn-ghost text-[10px] py-1 cursor-pointer">
          {uploading ? <Spinner size={12} /> : '↑ Upload File'}
          <input type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.webp" className="hidden" onChange={uploadFile} />
        </label>
      </div>

      {showUrlForm && (
        <div className="space-y-2 p-3 border border-border bg-hover">
          <input
            value={urlForm.name}
            onChange={e => setUrlForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Document name"
            className="input-base"
          />
          <input
            value={urlForm.url}
            onChange={e => setUrlForm(f => ({ ...f, url: e.target.value }))}
            placeholder="https://…"
            className="input-base"
          />
          <select
            value={urlForm.document_type}
            onChange={e => setUrlForm(f => ({ ...f, document_type: e.target.value }))}
            className="input-base"
          >
            <option value="datasheet">Datasheet</option>
            <option value="schematic">Schematic</option>
            <option value="manual">Manual</option>
            <option value="other">Other</option>
          </select>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={addUrl}>Add</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowUrlForm(false)}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Part Modal ─────────────────────────────────────────────────────
export default function PartModal() {
  const { partModalOpen, partModalId, closePartModal } = useApp()
  const { data: categories = [] } = useCategories()
  const { data: bins = [] } = useBins()
  const { data: existingPart, isLoading } = usePart(partModalId)
  const createPart = useCreatePart()
  const updatePart = useUpdatePart()

  const [activeTab, setActiveTab] = useState('details')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      name: '', part_number: '', manufacturer: '',
      category_id: '', bin_id: '', quantity: 0,
      description: '', specifications: [],
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'specifications' })

  useEffect(() => {
    if (!partModalOpen) return
    if (existingPart) {
      reset({
        name: existingPart.name || '',
        part_number: existingPart.part_number || '',
        manufacturer: existingPart.manufacturer || '',
        category_id: existingPart.category_id || '',
        bin_id: existingPart.bin_id || '',
        quantity: existingPart.quantity || 0,
        description: existingPart.description || '',
        specifications: existingPart.specifications || [],
      })
      setTags(existingPart.tags ? existingPart.tags.split(',').map(t => t.trim()).filter(Boolean) : [])
    } else {
      reset({ name: '', part_number: '', manufacturer: '', category_id: '', bin_id: '', quantity: 0, description: '', specifications: [] })
      setTags([])
    }
    setActiveTab('details')
  }, [existingPart, partModalOpen, reset])

  // Flatten category tree for select
  const flatCategories = []
  const flatten = (cats, depth = 0) => {
    cats.forEach(c => {
      flatCategories.push({ id: c.id, name: ('  '.repeat(depth)) + c.name })
      if (c.subcategories) flatten(c.subcategories, depth + 1)
    })
  }
  flatten(categories)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      category_id: data.category_id ? Number(data.category_id) : null,
      bin_id: data.bin_id ? Number(data.bin_id) : null,
      quantity: Number(data.quantity) || 0,
      tags: tags.join(','),
      specifications: data.specifications.filter(s => s.key && s.value),
    }

    try {
      if (partModalId) {
        await updatePart.mutateAsync({ id: partModalId, data: payload })
      } else {
        await createPart.mutateAsync(payload)
      }
      closePartModal()
    } catch (e) {
      // toast already shown by mutation
    }
  }

  const isPending = createPart.isPending || updatePart.isPending
  const isEditing = !!partModalId

  return (
    <Modal
      open={partModalOpen}
      onClose={closePartModal}
      title={isEditing ? 'Edit Part' : 'Add Part'}
      width="max-w-2xl"
    >
      {isLoading && isEditing ? (
        <div className="flex items-center justify-center py-10"><Spinner /></div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
          <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

          <div className="flex-1 overflow-y-auto">
            {activeTab === 'details' && (
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="label-base">Name *</label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className={`input-base ${errors.name ? 'border-destructive' : ''}`}
                    placeholder="e.g. Resistor 10kΩ"
                  />
                  {errors.name && <p className="font-mono text-[10px] text-destructive mt-0.5">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="label-base">Part Number</label>
                  <input {...register('part_number')} className="input-base" placeholder="e.g. RES-10K-01" />
                </div>

                <div>
                  <label className="label-base">Manufacturer</label>
                  <input {...register('manufacturer')} className="input-base" placeholder="e.g. Yageo" />
                </div>

                <div>
                  <label className="label-base">Category</label>
                  <select {...register('category_id')} className="input-base">
                    <option value="">— None —</option>
                    {flatCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-base">Storage Bin</label>
                  <select {...register('bin_id')} className="input-base">
                    <option value="">— None —</option>
                    {bins.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label-base">Quantity</label>
                  <input
                    type="number"
                    min="0"
                    {...register('quantity')}
                    className="input-base"
                  />
                </div>

                <div className="col-span-2">
                  <label className="label-base">Description</label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="input-base resize-none"
                    placeholder="Free-form notes, application info…"
                  />
                </div>

                {/* Tags */}
                <div className="col-span-2">
                  <label className="label-base">Tags</label>
                  <TagList tags={tags} onRemove={t => setTags(prev => prev.filter(x => x !== t))} />
                  <div className="flex gap-1 mt-1">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                      placeholder="Add tag…"
                      className="input-base flex-1 py-1"
                    />
                    <button type="button" onClick={addTag} className="btn-ghost text-[10px] py-1 px-2">+</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <SpecsTab fields={fields} append={append} remove={remove} register={register} />
            )}

            {activeTab === 'docs' && (
              <DocsTab partId={partModalId} />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-border shrink-0">
            <Button variant="ghost" type="button" onClick={closePartModal}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={isPending}>
              {isPending ? 'Saving…' : isEditing ? 'Update Part' : 'Create Part'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
