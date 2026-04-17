import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partsApi, categoriesApi, binsApi, settingsApi } from '../services/api'
import toast from 'react-hot-toast'

// ── Parts ──────────────────────────────────────────────────────────
export function useParts(params) {
  return useQuery({
    queryKey: ['parts', params],
    queryFn: () => partsApi.list(params).then(r => r.data),
    keepPreviousData: true,
  })
}

export function usePart(id) {
  return useQuery({
    queryKey: ['part', id],
    queryFn: () => partsApi.get(id).then(r => r.data),
    enabled: !!id,
  })
}

export function useCreatePart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => partsApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Part created')
    },
    onError: (e) => toast.error(e.message),
  })
}

export function useUpdatePart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => partsApi.update(id, data).then(r => r.data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['parts'] })
      qc.invalidateQueries({ queryKey: ['part', id] })
      toast.success('Part updated')
    },
    onError: (e) => toast.error(e.message),
  })
}

export function useDeletePart() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => partsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Part deleted')
    },
    onError: (e) => toast.error(e.message),
  })
}

// ── Categories ─────────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.list().then(r => r.data),
    staleTime: 60_000,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => categoriesApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category created')
    },
    onError: (e) => toast.error(e.message),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => categoriesApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] })
      qc.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Category deleted')
    },
    onError: (e) => toast.error(e.message),
  })
}

// ── Bins ───────────────────────────────────────────────────────────
export function useBins() {
  return useQuery({
    queryKey: ['bins'],
    queryFn: () => binsApi.list().then(r => r.data),
    staleTime: 60_000,
  })
}

export function useCreateBin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => binsApi.create(data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bins'] })
      toast.success('Bin created')
    },
    onError: (e) => toast.error(e.message),
  })
}

export function useDeleteBin() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => binsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bins'] })
      qc.invalidateQueries({ queryKey: ['parts'] })
      toast.success('Bin deleted')
    },
    onError: (e) => toast.error(e.message),
  })
}

// ── Settings ───────────────────────────────────────────────────────
export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => settingsApi.list().then(r => r.data),
    staleTime: 120_000,
  })
}

export function useUpsertSetting() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ key, value, is_sensitive }) => {
      try {
        // try update first
        return await settingsApi.update(key, { value, is_sensitive }).then(r => r.data)
      } catch {
        // create if not found
        return await settingsApi.create({ key, value, is_sensitive }).then(r => r.data)
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
    onError: (e) => toast.error(e.message),
  })
}
