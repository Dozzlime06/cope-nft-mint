import { ThirdwebProvider } from 'thirdweb/react';
import { base } from 'thirdweb/chains';
import { client } from './thirdweb-client';

interface ThirdwebProviderWrapperProps {
  children: React.ReactNode;
}

export function ThirdwebProviderWrapper({ children }: ThirdwebProviderWrapperProps) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}
