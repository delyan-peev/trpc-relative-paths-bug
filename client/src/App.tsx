import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter
} from 'react-router-dom';
import { Test } from './Test';
import './index.scss';
import { trpc } from './trpc';

const container = document.getElementById('app');
const root = createRoot(container!);

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [trpcClient] = useState(trpc.createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:9000/trpc'
      })
    ]
  }));

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Test />
        </BrowserRouter>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

root.render(<App />);
