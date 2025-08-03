import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux';
import { store } from './redux/store.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    style: {
      background: '#1a1a1a',
      color: '#d1fae5',
      border: '1px solid #4ade80',
      fontFamily: 'Inter, sans-serif',
      borderRadius: '12px',
      padding: '12px 16px',
    },
    success: {
      iconTheme: {
        primary: '#4ade80',
        secondary: '#ffffff',
      },
    },
    error: {
      style: {
        background: '#2e2e2e',
        border: '1px solid #ef4444',
        color: '#fecaca',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  }}
/>
<Provider store={store}>
    <App />
</Provider>
    </BrowserRouter>
  </StrictMode>,
)
