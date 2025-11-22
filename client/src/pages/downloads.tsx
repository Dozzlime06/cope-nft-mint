import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileJson, Image as ImageIcon } from 'lucide-react';

export default function Downloads() {
  const files = [
    {
      name: 'COPE Metadata (10K)',
      description: 'Complete 10,000 NFT metadata file for Thirdweb deployment',
      filename: 'cope-metadata-10k.json',
      size: '5.53 MB',
      icon: FileJson,
    },
    {
      name: 'COPE Character Image',
      description: 'Cute cartoon character unrevealed NFT image',
      filename: 'cope-character.jpeg',
      size: '79 KB',
      icon: ImageIcon,
    },
    {
      name: 'Single Metadata Template',
      description: 'Template for single NFT metadata in Thirdweb format',
      filename: 'metadata-thirdweb.json',
      size: '551 B',
      icon: FileJson,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white mb-2">COPE NFT Downloads</h1>
          <p className="text-slate-400">Everything you need to deploy your 10K COPE NFT collection</p>
        </div>

        {/* Files Grid */}
        <div className="grid gap-4 mb-12">
          {files.map((file, index) => {
            const Icon = file.icon;
            return (
              <Card key={index} className="border-violet-500/30 bg-slate-900">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-600/20 rounded-lg">
                        <Icon className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white">{file.name}</CardTitle>
                        <CardDescription className="text-slate-400 mt-1">
                          {file.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Size: {file.size}</span>
                    <a href={`/downloads/${file.filename}`} download>
                      <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <Card className="border-violet-500/30 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div>
              <h3 className="font-semibold text-white mb-2">Step 1: Upload Image to IPFS</h3>
              <p className="text-sm">
                Upload the COPE Character Image to Pinata.cloud or NFT.storage and copy the IPFS hash.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Step 2: Update Metadata</h3>
              <p className="text-sm">
                Replace <code className="bg-slate-800 px-2 py-1 rounded">YOUR_IMAGE_HASH_HERE</code> with your IPFS hash in the metadata JSON file.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Step 3: Deploy Contract</h3>
              <p className="text-sm">
                Go to thirdweb.com, deploy an ERC721 contract on Base chain, upload the metadata file, and get your contract address.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Step 4: Mint in App</h3>
              <p className="text-sm">
                Paste your contract address in the app settings and start minting!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
