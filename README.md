# Liminal Dreams - Farcaster NFT Minting

A modern NFT minting platform built for Farcaster on the Base network, powered by thirdweb.

## Features

✨ **Thirdweb Wallet Integration** - Multi-wallet support (MetaMask, Coinbase, Rainbow, etc.)
🎨 **Beautiful UI** - Dark theme with gradient design
📦 **Base Network** - Low gas fees, high speed
🔒 **Secure** - All transactions signed by user wallets
🌐 **Farcaster Ready** - Optimized for Farcaster Mini Apps

## Setup

### Environment Variables

The following secrets are already configured in Replit:
- `VITE_THIRDWEB_CLIENT_ID` ✅ (from thirdweb integration)

### Configuration

Add your NFT contract details:

1. Click the ⚙️ Settings icon on the minting card
2. Enter your NFT contract address (0x...)
3. Set environment variables:
   - `VITE_NFT_CONTRACT_ADDRESS` - Your deployed NFT contract
   - `VITE_CHAIN_ID` - 8453 for Base mainnet
   - `VITE_MINT_PRICE` - Price per NFT in ETH

## How to Use

1. **Connect Wallet** - Click the connect button and select your wallet
2. **Set Quantity** - Choose how many NFTs to mint (1-10)
3. **Mint** - Click "Mint NFT" and confirm in your wallet

## Architecture

```
client/src/
├── pages/mint.tsx          - Main minting interface
├── components/
│   └── WalletConnect.tsx   - Thirdweb wallet connection
├── lib/
│   ├── thirdweb-client.ts  - Thirdweb configuration
│   └── thirdweb-provider.tsx - Provider wrapper
└── ...

server/
├── routes.ts               - API endpoints for minting
└── index.ts               - Express server

shared/
└── schema.ts              - Zod schemas for validation
```

## API Endpoints

- `POST /api/mint` - Mint NFTs (requires wallet address, quantity, contract address)
- `GET /api/health` - Health check
- `GET /api/contract-info` - Get contract configuration

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express.js
- **Web3**: Thirdweb SDK
- **Blockchain**: Base Network (EVM compatible)
- **Build**: Vite

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run preview # Preview production build
```

## Deployment

The app is ready for production deployment on Replit or any Node.js hosting platform.

## Support

For issues or questions, contact the development team.

---

Built with ❤️ for Farcaster
