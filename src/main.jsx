import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Error boundary wrapper
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: '#c0c0c0',
          padding: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <div style={{ 
            background: 'white', 
            padding: '20px', 
            border: '2px solid #000',
            maxWidth: '500px'
          }}>
            <h2 style={{ color: '#ff0000', marginTop: 0 }}>⚠️ Error Loading App</h2>
            <p>Something went wrong. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                background: '#000080',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Refresh Page
            </button>
            <details style={{ marginTop: '20px', fontSize: '12px' }}>
              <summary>Error Details</summary>
              <pre style={{ 
                background: '#f0f0f0', 
                padding: '10px', 
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Ensure root element exists before rendering
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  )
}

