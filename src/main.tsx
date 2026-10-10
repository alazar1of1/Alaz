// Compatibility shim for browser extensions that overwrite window.fetch
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: originalFetch,
  });
} catch {
  try {
    let currentFetch = window.fetch;
    Object.defineProperty(window, 'fetch', {
      configurable: true,
      enumerable: true,
      get: () => currentFetch,
      set: (fn) => {
        currentFetch = fn;
      },
    });
  } catch {
    // Ignore if already configured
  }
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
