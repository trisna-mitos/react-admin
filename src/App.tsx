// import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AppRouter } from './routing/AppRouter';
import { ThemeProvider } from './store/providers/ThemeProvider';
import { heroUIConfig } from './config/heroui.config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5*60*1000,
      gcTime: 10*60*1000,
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider {...heroUiConfig}>
        <ThemeProvider>
          <BrowserRouter>
            <AppRouter/>
          </BrowserRouter>
        </ThemeProvider>
      </HeroUIProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
