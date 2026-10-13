import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Inicio from '@/pages/Inicio';
import NaoEncontrada from '@/pages/NaoEncontrada';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
