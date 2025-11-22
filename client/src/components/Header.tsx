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

        {/* Connect Button */}
        <div className="w-48">
          <WalletConnect
            onConnect={(address) => console.log('Connected:', address)}
            onDisconnect={() => console.log('Disconnected')}
          />
        </div>
      </div>
    </header>
  );
}
