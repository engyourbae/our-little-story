import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './app/App';
import { ErrorBoundary } from './components/UI/ErrorBoundary';
import './styles/global.css';

try { registerSW({ immediate: true }); } catch { /* PWA opsional */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<div style={{ padding: 24, color: '#fff' }}>Terjadi kesalahan. Muat ulang halaman.</div>}>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
