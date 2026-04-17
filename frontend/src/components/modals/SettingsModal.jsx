import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { useSettings, useUpsertSetting } from '../../hooks/useData'
import { Modal, Button } from '../ui'

const PRESETS = [
  { label: 'OpenAI', base_url: 'https://api.openai.com/v1', model: 'gpt-4o-mini' },
  { label: 'OpenAI GPT-4o', base_url: 'https://api.openai.com/v1', model: 'gpt-4o' },
  { label: 'Anthropic Claude', base_url: 'https://api.anthropic.com/v1', model: 'claude-3-5-haiku-20241022' },
  { label: 'Groq', base_url: 'https://api.groq.com/openai/v1', model: 'llama-3.1-8b-instant' },
  { label: 'NVIDIA NIM', base_url: 'https://integrate.api.nvidia.com/v1', model: 'meta/llama-3.1-8b-instruct' },
  { label: 'Custom', base_url: '', model: '' },
]

export default function SettingsModal() {
  const { settingsModalOpen, setSettingsModalOpen } = useApp()
  const { data: settings = [], isLoading } = useSettings()
  const upsert = useUpsertSetting()

  const [apiKey, setApiKey] = useState('')
  const [baseUrl, setBaseUrl] = useState('https://api.openai.com/v1')
  const [model, setModel] = useState('gpt-4o-mini')
  const [showKey, setShowKey] = useState(false)
  const [preset, setPreset] = useState('OpenAI')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!settings.length) return
    const map = Object.fromEntries(settings.map(s => [s.key, s.value]))
    if (map.api_key) setApiKey(map.api_key)
    if (map.base_url) setBaseUrl(map.base_url)
    if (map.model) setModel(map.model)
  }, [settings])

  const handlePreset = (label) => {
    setPreset(label)
    const p = PRESETS.find(x => x.label === label)
    if (p && label !== 'Custom') {
      setBaseUrl(p.base_url)
      setModel(p.model)
    }
  }

  const handleSave = async () => {
    const ops = []
    if (apiKey && !apiKey.startsWith('**')) {
      ops.push(upsert.mutateAsync({ key: 'api_key', value: apiKey, is_sensitive: true }))
    }
    ops.push(upsert.mutateAsync({ key: 'base_url', value: baseUrl, is_sensitive: false }))
    ops.push(upsert.mutateAsync({ key: 'model', value: model, is_sensitive: false }))
    await Promise.all(ops)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const isKeyConfigured = settings.some(s => s.key === 'api_key' && s.value)

  return (
    <Modal open={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} title="Settings" width="max-w-lg">
      <div className="p-5 space-y-5">
        {/* Status */}
        <div className={`flex items-center gap-2 px-3 py-2 border font-mono text-xs
          ${isKeyConfigured
            ? 'border-ai-accent/30 bg-ai-accent/5 text-ai-accent'
            : 'border-primary/30 bg-primary/5 text-primary'
          }`}>
          <span>{isKeyConfigured ? '● AI Configured' : '○ API Key Required'}</span>
        </div>

        {/* Provider preset */}
        <div>
          <label className="label-base">Provider Preset</label>
          <div className="grid grid-cols-3 gap-1">
            {PRESETS.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => handlePreset(p.label)}
                className={`px-2 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors
                  ${preset === p.label
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-text-muted hover:border-text-muted hover:text-text-primary'
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        <div>
          <label className="label-base">API Key</label>
          <div className="flex gap-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="sk-…"
              className="input-base flex-1"
              autoComplete="off"
            />
            <button
              type="button"
              onClick={() => setShowKey(v => !v)}
              className="btn-ghost text-[10px] px-2"
            >
              {showKey ? '◎' : '○'}
            </button>
          </div>
          <p className="font-mono text-[10px] text-text-muted mt-1">
            Stored securely. Only last 4 chars shown after save.
          </p>
        </div>

        {/* Base URL */}
        <div>
          <label className="label-base">Base URL (OpenAI-compatible)</label>
          <input
            value={baseUrl}
            onChange={e => setBaseUrl(e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="input-base"
          />
        </div>

        {/* Model */}
        <div>
          <label className="label-base">Model ID</label>
          <input
            value={model}
            onChange={e => setModel(e.target.value)}
            placeholder="gpt-4o-mini"
            className="input-base"
          />
        </div>

        {/* Save */}
        <div className="flex items-center gap-3 pt-1">
          <Button variant="primary" onClick={handleSave} disabled={upsert.isPending}>
            {upsert.isPending ? 'Saving…' : 'Save Settings'}
          </Button>
          {saved && (
            <span className="font-mono text-[10px] text-ai-accent">✓ Saved</span>
          )}
        </div>
      </div>
    </Modal>
  )
}
