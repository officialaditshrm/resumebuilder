import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import ScrollToTop from './pages/ScrollToTop.js'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>,
)
