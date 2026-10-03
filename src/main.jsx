import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './brand-tokens.css'
import './studio.css'
import './command.css'
import App from './Studio.jsx'
import './direction.css'
import './brand-experience.css'
import './editorial-refinement.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

