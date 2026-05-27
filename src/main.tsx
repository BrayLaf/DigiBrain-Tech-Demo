import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactFlowProvider } from '@xyflow/react'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Missing #root element — check index.html');

createRoot(rootEl).render(
  <StrictMode>
    <ReactFlowProvider>
      <App />
    </ReactFlowProvider>
  </StrictMode>,
)
