import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './studio.css'
import './command.css'
import App from './Studio.jsx'
import './direction.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

