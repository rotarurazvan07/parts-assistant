import { useState, useRef, useEffect, useCallback } from 'react'
import { useApp } from '../../context/AppContext'
import { useParts } from '../../hooks/useData'
import { aiApi } from '../../services/api'
import api from '../../services/api'
import { Spinner } from '../ui'

const SUGGESTIONS = [
  'What can I build with my inventory?',
  'What am I missing for an Arduino weather station?',
  'Where did I put the ESP32 modules?',
  'What power supply options do I have?',
  'Identify parts with low stock',
  'Suggest a beginner project',
]

function ChatMessage({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[85%]`}>
        {!isUser && (
          <div className="font-mono text-[9px] text-ai-accent uppercase tracking-widest mb-1">The Brain</div>
        )}
        <div className={`px-3 py-2 border text-xs
          ${isUser
            ? 'bg-hover border-primary/20 text-text-primary font-mono'
            : 'bg-panel border-ai-accent/20 text-text-primary ai-prose'
          }
          ${msg.streaming ? 'cursor-blink' : ''}`}
        >
          {msg.content || (msg.streaming ? '' : '…')}
        </div>
        {msg.timestamp && (
          <div className="font-mono text-[9px] text-text-muted mt-0.5 text-right">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AIChatPanel() {
  const { contextPartIds, clearContextParts, toggleContextPart, aiPanelCollapsed, setAiPanelCollapsed } = useApp()
  const [messages, setMessages] = useState([])
  const [historyLoaded, setHistoryLoaded] = useState(false)
  const [memoryActive, setMemoryActive] = useState(false)
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Fetch context part names for chips
  const { data: partsData } = useParts({ page: 1, limit: 200 })
  const allParts = partsData?.parts || []
  const contextParts = allParts.filter(p => contextPartIds.includes(p.id))

  // ── Hydrate from DB on mount ───────────────────────────────────
  useEffect(() => {
    api.get('/ai/history', { params: { limit: 100 } })
      .then(res => {
        const stored = res.data.map(m => ({
          role: m.role,
          content: m.content,
          timestamp: m.created_at ? new Date(m.created_at).getTime() : null,
        }))
        setMessages(stored)
      })
      .catch(() => {/* silently ignore if backend not up yet */})
      .finally(() => setHistoryLoaded(true))

    // Check if a memory note exists
    api.get('/ai/memory')
      .then(res => setMemoryActive(!!res.data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = useCallback(async (text) => {
    const content = text || input.trim()
    if (!content || streaming) return
    setInput('')

    const userMsg = { role: 'user', content, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setStreaming(true)

    const streamId = Date.now()
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true, id: streamId }])

    try {
      // No need to send history — backend reads from DB
      const response = await aiApi.chat(content, contextPartIds, [])
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) accumulated = `Error: ${parsed.error}`
            else if (parsed.token) accumulated += parsed.token
          } catch { /* ignore */ }
        }
        setMessages(prev => prev.map(m =>
          m.id === streamId ? { ...m, content: accumulated } : m
        ))
      }

      setMessages(prev => prev.map(m =>
        m.id === streamId
          ? { ...m, content: accumulated, streaming: false, timestamp: Date.now() }
          : m
      ))

      // After a few exchanges, a memory note likely exists now
      if (messages.length >= 4) setMemoryActive(true)

    } catch (e) {
      setMessages(prev => prev.map(m =>
        m.id === streamId ? { ...m, content: `Error: ${e.message}`, streaming: false } : m
      ))
    } finally {
      setStreaming(false)
    }
  }, [input, streaming, contextPartIds, messages.length])

  const clearChat = useCallback(async () => {
    try {
      await api.delete('/ai/history')
    } catch { /* ignore */ }
    setMessages([])
    clearContextParts()
    setMemoryActive(false)
  }, [clearContextParts])

  const clearMemory = useCallback(async () => {
    try {
      await api.delete('/ai/memory')
      setMemoryActive(false)
    } catch { /* ignore */ }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (aiPanelCollapsed) {
    return (
      <div className="w-10 bg-panel border-l border-border flex flex-col items-center py-2 shrink-0">
        <button
          onClick={() => setAiPanelCollapsed(false)}
          className="text-ai-accent font-mono text-xs p-1 hover:text-ai-accent/70 transition-colors"
          title="Expand AI panel"
        >
          ◂
        </button>
        <div className="mt-2 font-mono text-[9px] text-ai-accent uppercase tracking-widest [writing-mode:vertical-rl] mt-8">
          The Brain
        </div>
      </div>
    )
  }

  return (
    <div className="w-[400px] shrink-0 bg-panel border-l border-border flex flex-col" style={{ height: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-ai-accent ${streaming ? 'ai-glow' : ''}`} />
          <span className="font-heading font-bold text-sm text-ai-accent tracking-tight">The Brain</span>
          {streaming && (
            <span className="font-mono text-[9px] text-ai-accent uppercase tracking-widest animate-pulse">
              Processing…
            </span>
          )}
          {memoryActive && !streaming && (
            <span className="font-mono text-[9px] text-text-muted" title="Memory bank active">
              ◈ memory
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {memoryActive && (
            <button
              onClick={clearMemory}
              className="font-mono text-[9px] text-text-muted hover:text-primary px-1 transition-colors"
              title="Clear memory bank"
            >
              ◈✕
            </button>
          )}
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="font-mono text-[10px] text-text-muted hover:text-destructive px-1.5 transition-colors"
              title="Clear chat history"
            >
              ✕ Clear
            </button>
          )}
          <button
            onClick={() => setAiPanelCollapsed(true)}
            className="text-text-muted hover:text-text-primary font-mono text-xs px-1"
          >
            ▸
          </button>
        </div>
      </div>

      {/* Context chips */}
      {contextParts.length > 0 && (
        <div className="px-3 py-2 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-ai-accent">Context Parts</span>
            <button onClick={clearContextParts} className="font-mono text-[9px] text-text-muted hover:text-text-primary">
              clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {contextParts.map(p => (
              <button
                key={p.id}
                onClick={() => toggleContextPart(p.id)}
                className="ai-chip hover:border-destructive/50 hover:text-destructive transition-colors"
                title="Click to remove from context"
              >
                {p.name.length > 18 ? p.name.slice(0, 16) + '…' : p.name}
                <span className="ml-0.5 opacity-60">×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3">
        {!historyLoaded ? (
          <div className="flex items-center justify-center h-32 gap-2">
            <Spinner size={14} />
            <span className="font-mono text-[10px] text-text-muted">Restoring memory…</span>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="font-mono text-3xl text-ai-accent/30 mb-3">◈</div>
            <h3 className="font-heading font-bold text-sm text-text-primary mb-1">The Brain</h3>
            <p className="font-mono text-[10px] text-text-muted mb-4">
              AI assistant with full inventory awareness. Conversations persist across sessions.
            </p>
            <div className="space-y-1 w-full">
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left px-3 py-2 border border-border hover:border-ai-accent/30 hover:bg-hover font-mono text-[10px] text-text-muted hover:text-text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={msg.id || i} msg={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick suggestion chips (when chat has messages) */}
      {messages.length > 0 && !streaming && (
        <div className="px-3 py-2 border-t border-border shrink-0 flex flex-wrap gap-1">
          {SUGGESTIONS.slice(0, 3).map(s => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="px-2 py-1 border border-border hover:border-ai-accent/30 font-mono text-[9px] text-text-muted hover:text-ai-accent transition-colors"
            >
              {s.length > 30 ? s.slice(0, 28) + '…' : s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-3 py-2 border-t border-border shrink-0">
        <div className="flex gap-1">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your inventory…"
            rows={2}
            disabled={streaming}
            className="input-base flex-1 resize-none py-1.5 text-xs disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || streaming}
            className={`px-3 py-1.5 border font-mono text-xs transition-colors self-end
              ${input.trim() && !streaming
                ? 'border-ai-accent text-ai-accent hover:bg-ai-accent/10'
                : 'border-border text-text-muted cursor-not-allowed opacity-40'
              }`}
            title="Send (Enter)"
          >
            {streaming ? <Spinner size={14} /> : '→'}
          </button>
        </div>
        <p className="font-mono text-[9px] text-text-muted mt-1">Enter to send · Shift+Enter for newline</p>
      </div>
    </div>
  )
}
