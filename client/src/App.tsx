import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ThirdwebProviderWrapper } from '@/lib/thirdweb-provider';
import MintFrame from '@/pages/mint';

function App() {
  return (
    <ThirdwebProviderWrapper>
      <QueryClientProvider client={queryClient}>
        <MintFrame />
      </QueryClientProvider>
    </ThirdwebProviderWrapper>
  );
}

export default App;
