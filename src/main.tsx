import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SettingsPanelProvider } from '@/contexts/SettingsPanelContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsPanelProvider>
      <App />
    </SettingsPanelProvider>
  </React.StrictMode>,
)