import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import Index from './pages/index.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useEffect } from 'react'
import { setupInterceptors } from './services/githubService'
import { PlaceholdersAndVanishInputDemo } from './components/demo.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  useEffect(() => {
    setupInterceptors();
  }, []);
  
  return (
    <>
    <QueryClientProvider client={queryClient}>
      {/* <Index /> */}
      <PlaceholdersAndVanishInputDemo />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    </>
  )
}

export default App
