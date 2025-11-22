import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/Header';
import { ProgressBar } from '@/components/ProgressBar';
import { useToast } from '@/hooks/use-toast';
import { useContractStats } from '@/hooks/use-contract-stats';
import { ShoppingCart, Settings, Check } from 'lucide-react';
import { CONTRACT_ADDRESS, mintNFT } from '@/lib/thirdweb-client';

export default function MintFrame() {
  const account = useActiveAccount();
  const walletAddress = account?.address || '';
  const { minted = 0, total = 10000, price = 0 } = useContractStats() || {};
  
  const [quantity, setQuantity] = useState(1);
  const [showContractSettings, setShowContractSettings] = useState(false);
  const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESS);
  const [metadataUri, setMetadataUri] = useState('');
  const [isMinted, setIsMinted] = useState(false);
  const { toast } = useToast();

  const mintMutation = useMutation({
    mutationFn: async () => {
      if (!walletAddress) throw new Error('Wallet not connected');
      if (!account) throw new Error('Account not available');
      
      return await mintNFT(account, quantity);
    },
    onSuccess: (data) => {
      setIsMinted(true);
      toast({
        title: '✨ Mint Successful!',
        description: `Transaction: ${data.transactionHash?.slice(0, 16)}...`,
      });
      setTimeout(() => {
        setQuantity(1);
        setIsMinted(false);
      }, 3000);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : (typeof error === 'string' ? error : JSON.stringify(error));
      toast({
        title: '❌ Minting Failed',
        description: errorMessage.substring(0, 150),
        variant: 'destructive',
      });
    },
  });

  const handleMint = () => {
    if (!walletAddress) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }
    if (!contractAddress) {
      toast({
        title: 'No Contract',
        description: 'Please set a contract address',
        variant: 'destructive',
      });
      return;
    }
    mintMutation.mutate();
  };

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-slate-950 text-white pt-32 pb-12 px-4 flex flex-col items-center justify-start relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-lg relative z-10 slide-up space-y-8">
          {/* Main Card */}
          <Card className="border-violet-500/30 bg-slate-900 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-violet-400/5 pointer-events-none"></div>
            
            <CardHeader className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white text-2xl">Mint Your NFT</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">
                    Limited edition on Base
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowContractSettings(!showContractSettings)}
                  className="text-slate-400 hover:text-white"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 relative z-10">
              {/* Progress Bar */}
              <ProgressBar minted={minted} total={total} />

              {/* Contract Settings */}
              {showContractSettings && (
                <div className="bg-slate-800/50 rounded-xl p-4 border border-violet-500/30 space-y-4 slide-down">
                  <div>
                    <label className="text-sm font-semibold text-white block mb-2">
                      NFT Contract Address
                    </label>
                    <Input
                      placeholder="0x..."
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      className="bg-slate-700/50 border-violet-500/50 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Paste your deployed NFT contract address here
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-white block mb-2">
                      Metadata URI (Optional)
                    </label>
                    <Input
                      placeholder="ipfs://QmYour... or https://..."
                      value={metadataUri}
                      onChange={(e) => setMetadataUri(e.target.value)}
                      className="bg-slate-700/50 border-violet-500/50 text-white placeholder:text-slate-500"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      IPFS link to unrevealed metadata (same for all NFTs)
                    </p>
                  </div>
                </div>
              )}

              {/* Quantity Input */}
              <div className="space-y-3 slide-up">
                <label className="text-sm font-semibold text-white">
                  Quantity
                </label>
                <div className="flex items-center gap-3 bg-slate-800/30 p-3 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={mintMutation.isPending || quantity <= 1}
                  >
                    −
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))
                    }
                    disabled={mintMutation.isPending}
                    className="bg-slate-700/50 border-violet-500/50 text-white text-center font-bold text-lg flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={mintMutation.isPending || quantity >= 10}
                  >
                    +
                  </Button>
                </div>
                <p className="text-xs text-slate-400">
                  Maximum 10 per transaction
                </p>
              </div>

              {/* Price Info */}
              <div className="bg-slate-800/30 rounded-xl p-5 border border-violet-500/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-medium">Price per NFT</span>
                  <span className="text-white font-bold text-lg">{price === 0 ? 'FREE' : `${price} ETH`}</span>
                </div>
                <div className="w-full h-px bg-violet-600/30"></div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300 font-semibold">Total Cost</span>
                  <span className="text-2xl font-bold text-violet-400">
                    {price === 0 ? 'FREE' : `${(quantity * price).toFixed(4)} ETH`}
                  </span>
                </div>
              </div>

              {/* Mint Button */}
              <Button
                onClick={handleMint}
                disabled={mintMutation.isPending || isMinted}
                size="lg"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-base h-12"
              >
                {isMinted ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    Minting Successful!
                  </div>
                ) : mintMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Minting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Mint NFT
                  </div>
                )}
              </Button>

              {/* Footer Info */}
              <div className="pt-4 border-t border-violet-500/20">
                <p className="text-xs text-slate-400 text-center font-medium">
                  🔗 Built for Farcaster • 📦 Base Network • 🔒 Secure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
