import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// 引入JitViewer样式
import '@jit-viewer/core/style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
