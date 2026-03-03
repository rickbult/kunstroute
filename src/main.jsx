import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'  // Points to your App.jsx
import './App.css'  // Your styles

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
