import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

requestAnimationFrame(() => {
  const boot = document.getElementById('boot')
  if (boot) {
    boot.classList.add('done')
    setTimeout(() => boot.remove(), 900)
  }
})
