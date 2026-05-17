import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminModeProvider } from './admin/AdminModeContext.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <AdminModeProvider>
          <App />
        </AdminModeProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
