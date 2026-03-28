import { StrictMode } from 'react';

import '@/styles.css';
import { createRoot } from 'react-dom/client';

import { App } from '@/app';
import { ConfigProvider } from '@/hooks/config';

const root = document.getElementById('root');
if (!root) throw new Error('could not find root node');

createRoot(root).render(
  <StrictMode>
    <ConfigProvider>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </ConfigProvider>
  </StrictMode>
);
