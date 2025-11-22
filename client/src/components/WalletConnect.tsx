import { ConnectButton } from 'thirdweb/react';
import { client, chain } from '@/lib/thirdweb-client';

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  return (
    <div className="w-full">
      <ConnectButton
        client={client}
        chain={chain}
        onConnect={(wallet) => {
          const address = wallet?.getAccount?.()?.address;
          if (address && onConnect) {
            onConnect(address);
          }
        }}
        onDisconnect={() => {
          if (onDisconnect) {
            onDisconnect();
          }
        }}
        appMetadata={{
          name: 'COPE',
          description: 'Mint exclusive COPE NFTs on Base',
          url: typeof window !== 'undefined' ? window.location.origin : '',
          logoUrl: '',
        }}
        theme='dark'
        connectModal={{
          size: 'compact',
          title: 'Connect Wallet',
          showThirdwebBranding: false,
        }}
      />
    </div>
  );
}
