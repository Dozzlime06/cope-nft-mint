import { WalletConnect } from './WalletConnect';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-violet-500/20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-violet-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">COPE</h1>
        </div>
        
        {/* Connect Button - Styled */}
        <div className="connect-button-wrapper">
          <WalletConnect
            onConnect={(address) => console.log('Connected:', address)}
            onDisconnect={() => console.log('Disconnected')}
          />
        </div>
      </div>
      
      {/* Global styles for ConnectButton */}
      <style jsx global>{`
        .connect-button-wrapper button {
          background: rgb(124 58 237) !important;
          color: white !important;
          border: none !important;
          padding: 0.75rem 1.5rem !important;
          border-radius: 0.5rem !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          min-width: 160px !important;
          height: 48px !important;
          transition: all 0.2s ease !important;
        }
        
        .connect-button-wrapper button:hover {
          background: rgb(109 40 217) !important;
          transform: translateY(-1px);
        }
        
        .connect-button-wrapper button:active {
          transform: translateY(0);
        }
      `}</style>
    </header>
  );
}
