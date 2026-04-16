# State Management Approach

## Overview

This document outlines the state management approach for the Smart Electronics Lab Ecosystem frontend implementation. The approach combines React Context API for global state management with React Query for server state management.

## State Management Architecture

### Global State Management (React Context API)

#### 1. Application Context
- Theme settings (dark mode, light mode)
- User preferences (sidebar collapsed state, language)
- UI state (modal visibility, loading states)

#### 2. AI Context
- Selected AI provider
- API key configuration status
- Current chat context parts

#### 3. Navigation Context
- Active tab state
- Sidebar navigation state
- Mobile view state

### Server State Management (React Query)

#### 1. Parts Data
- Parts list with pagination
- Individual part details
- Part specifications
- Part documents

#### 2. Categories Data
- Category tree structure
- Individual category details

#### 3. Bins Data
- Bins list
- Individual bin details

#### 4. Search Data
- Search results
- Filter parameters

#### 5. AI Chat Data
- Chat history
- Current context parts
- Message responses

## Implementation Details

### Context Providers Structure

```
AppContextProvider
├── ThemeProvider
├── AIContextProvider
├── NavigationProvider
└── ModalProvider
```

### React Query Configuration

#### Query Client Setup
```javascript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContextProvider>
        <AIContextProvider>
          <NavigationProvider>
            <ModalProvider>
              {/* App components */}
            </ModalProvider>
          </NavigationProvider>
        </AIContextProvider>
      </AppContextProvider>
    </QueryClientProvider>
  )
}
```

### State Management Patterns

#### 1. Global State with Context API

```javascript
// AppContext.js
import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppContextProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [language, setLanguage] = useState('en')
  
  return (
    <AppContext.Provider value={{
      theme,
      setTheme,
      sidebarCollapsed,
      setSidebarCollapsed,
      language,
      setLanguage
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppContextProvider')
  }
  return context
}
```

#### 2. Server State with React Query

```javascript
// partsService.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1'

export const partsService = {
  // Get all parts with pagination
  getParts: (params) => {
    return axios.get(`${API_BASE_URL}/parts`, { params })
  },
  
  // Get single part by ID
  getPart: (id) => {
    return axios.get(`${API_BASE_URL}/parts/${id}`)
  },
  
  // Create new part
  createPart: (data) => {
    return axios.post(`${API_BASE_URL}/parts`, data)
  },
  
  // Update part
  updatePart: (id, data) => {
    return axios.put(`${API_BASE_URL}/parts/${id}`, data)
  },
  
  // Delete part
  deletePart: (id) => {
    return axios.delete(`${API_BASE_URL}/parts/${id}`)
  }
}

// partsQueries.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { partsService } from '../services/partsService'

// Query for fetching parts list
export const useParts = (params) => {
  return useQuery({
    queryKey: ['parts', params],
    queryFn: () => partsService.getParts(params),
    keepPreviousData: true
  })
}

// Query for fetching single part
export const usePart = (id) => {
  return useQuery({
    queryKey: ['part', id],
    queryFn: () => partsService.getPart(id),
    enabled: !!id
  })
}

// Mutation for creating part
export const useCreatePart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: partsService.createPart,
    onSuccess: () => {
      queryClient.invalidateQueries('parts')
    }
  })
}

// Mutation for updating part
export const useUpdatePart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => partsService.updatePart(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries('parts')
      queryClient.invalidateQueries(['part', variables.id])
    }
  })
}

// Mutation for deleting part
export const useDeletePart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: partsService.deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries('parts')
    }
  })
}
```

### State Update Patterns

#### 1. Optimistic Updates
```javascript
// Optimistic update for part creation
const useCreatePart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: partsService.createPart,
    onMutate: async (newPart) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries('parts')
      
      // Snapshot the previous value
      const previousParts = queryClient.getQueryData('parts')
      
      // Optimistically update to the new value
      queryClient.setQueryData('parts', old => ({
        ...old,
        data: [...old.data, newPart]
      }))
      
      // Return a context object with the rollback data
      return { previousParts }
    },
    // If the mutation fails, use the context returned above
    onError: (err, variables, context) => {
      queryClient.setQueryData('parts', context.previousParts)
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries('parts')
    }
  })
}
```

#### 2. Cache Invalidation Strategy
```javascript
// Invalidate queries when data changes
const queryClient = useQueryClient()

// After successful part creation
queryClient.invalidateQueries('parts')

// After successful part update
queryClient.invalidateQueries('parts')
queryClient.invalidateQueries(['part', partId])

// After successful part deletion
queryClient.invalidateQueries('parts')
```

## Performance Considerations

### 1. Query Caching
- Implement proper cache time settings
- Use query key hashing for efficient cache lookups
- Implement background data fetching

### 2. Memory Management
- Implement proper cache garbage collection
- Use query cache invalidation strategies
- Implement pagination for large datasets

### 3. Network Optimization
- Implement request deduplication
- Use query prefetching for better UX
- Implement proper error handling and retries

## Error Handling

### 1. API Error States
```javascript
const { data, error, isLoading } = useParts()

if (isLoading) {
  return <LoadingSpinner />
}

if (error) {
  return <ErrorMessage error={error} />
}

return <PartsTable parts={data} />
```

### 2. Retry Strategies
```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error.response?.status < 500) {
          return false
        }
        // Only retry up to 3 times
        return failureCount < 3
      }
    }
  }
})
```

## Testing Strategy for State Management

### 1. Context Testing
```javascript
// AppContext.test.js
import { render, screen } from '@testing-library/react'
import { AppContextProvider } from './AppContext'

test('provides theme value', () => {
  render(
    <AppContextProvider>
      <TestComponent />
    </AppContextProvider>
  )
  
  // Test context values
})
```

### 2. React Query Testing
```javascript
// partsQueries.test.js
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useParts } from './partsQueries'

test('fetches parts data', async () => {
  const queryClient = new QueryClient()
  
  render(
    <QueryClientProvider client={queryClient}>
      <TestComponent />
    </QueryClientProvider>
  )
  
  await waitFor(() => {
    expect(screen.getByText('Parts data')).toBeInTheDocument()
  })
})
```

## Best Practices

### 1. State Organization
- Keep global state minimal and focused
- Use React Query for server state
- Use Context API for UI state
- Implement proper separation of concerns

### 2. Performance Optimization
- Implement proper query caching
- Use pagination for large datasets
- Implement background data fetching
- Use query prefetching for better UX

### 3. Error Handling
- Implement proper error boundaries
- Use React Query's error handling
- Provide user-friendly error messages
- Implement retry strategies

### 4. Testing
- Test context providers
- Test React Query hooks
- Test state update logic
- Test error scenarios