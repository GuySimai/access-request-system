import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { init, sdk } from '@sdk/access';
import { queryClient } from './queries/queryClient';
import { AuthProvider } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
import App from '@/App.tsx';
import '@vibe/core/tokens';
import './index.css';

const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
init(backendUrl);
sdk.defaults.withCredentials = true;

createRoot(document.getElementById('root') as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ToastProvider>
  </QueryClientProvider>
);
