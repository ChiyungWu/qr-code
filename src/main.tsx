import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/i18n';

import { App } from '@/App';
import '@/tailwind.css';

import { initLocale } from '@/utils/switchLocale';

(async () => {
  await initLocale();
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
})();
