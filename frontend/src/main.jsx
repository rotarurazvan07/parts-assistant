import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#0A0A0A',
            color: '#F5F5F5',
            border: '1px solid #262626',
            borderRadius: '2px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '12px',
          },
          success: { iconTheme: { primary: '#00FF41', secondary: '#050505' } },
          error: { iconTheme: { primary: '#FF3B30', secondary: '#050505' } },
        }}
      />
    </QueryClientProvider>
  </React.StrictMode>
)
