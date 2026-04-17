import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.detail || err.message || 'Request failed'
    return Promise.reject(new Error(msg))
  }
)

export default api

// ── Parts ──────────────────────────────────────────────────────────
export const partsApi = {
  list: (params) => api.get('/parts', { params }),
  get: (id) => api.get(`/parts/${id}`),
  create: (data) => api.post('/parts', data),
  update: (id, data) => api.put(`/parts/${id}`, data),
  remove: (id) => api.delete(`/parts/${id}`),
  listSpecs: (id) => api.get(`/parts/${id}/specifications`),
  addSpec: (id, data) => api.post(`/parts/${id}/specifications`, data),
  updateSpec: (partId, specId, data) => api.put(`/parts/${partId}/specifications/${specId}`, data),
  deleteSpec: (partId, specId) => api.delete(`/parts/${partId}/specifications/${specId}`),
  listDocs: (id) => api.get(`/parts/${id}/documents`),
  addDoc: (id, data) => api.post(`/parts/${id}/documents`, data),
  uploadDoc: (id, formData) => api.post(`/parts/${id}/documents/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

// ── Categories ─────────────────────────────────────────────────────
export const categoriesApi = {
  list: () => api.get('/categories'),
  get: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
}

// ── Bins ───────────────────────────────────────────────────────────
export const binsApi = {
  list: () => api.get('/bins'),
  get: (id) => api.get(`/bins/${id}`),
  create: (data) => api.post('/bins', data),
  update: (id, data) => api.put(`/bins/${id}`, data),
  remove: (id) => api.delete(`/bins/${id}`),
}

// ── Documents ──────────────────────────────────────────────────────
export const documentsApi = {
  get: (id) => api.get(`/documents/${id}`),
  update: (id, data) => api.put(`/documents/${id}`, data),
  remove: (id) => api.delete(`/documents/${id}`),
  downloadUrl: (id) => `/api/v1/documents/${id}/download`,
}

// ── Settings ───────────────────────────────────────────────────────
export const settingsApi = {
  list: () => api.get('/settings'),
  get: (key) => api.get(`/settings/${key}`),
  create: (data) => api.post('/settings', data),
  update: (key, data) => api.put(`/settings/${key}`, data),
  remove: (key) => api.delete(`/settings/${key}`),
}

// ── Search ─────────────────────────────────────────────────────────
export const searchApi = {
  search: (q, params) => api.get('/search', { params: { q, ...params } }),
}

// ── Import / Export ────────────────────────────────────────────────
export const importExportApi = {
  import: (csvData) => api.post('/import', { csv_data: csvData }),
  exportUrl: () => '/api/v1/export',
  sampleUrl: () => '/api/v1/export/sample',
}

// ── AI ─────────────────────────────────────────────────────────────
export const aiApi = {
  // Returns a fetch Response (streaming SSE)
  chat: async (message, contextParts, history) => {
    return fetch('/api/v1/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        context_parts: contextParts,
        history,
      }),
    })
  },
}
