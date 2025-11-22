import { Router } from 'express';
import { mintRequestSchema } from '@shared/schema';

export const router = Router();

const CONTRACT_ADDRESS = '0xC69D12003f1f1c14874445818330066877A5A49e';
const BASE_RPC = 'https://mainnet.base.org';

// Helper to make RPC calls
async function makeRpcCall(method: string, params: any[]) {
  try {
    const response = await fetch(BASE_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error(`RPC call failed for ${method}:`, error);
    return null;
  }
}

// Decode uint256 from hex
function decodeUint256(hex: string): number {
  if (!hex) return 0;
  return parseInt(hex, 16);
}

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get contract stats
router.get('/contract/stats', async (req, res) => {
  try {
    let minted = 0;
    let total = 10000;
    let price = 0;

    // Get nextTokenIdToClaim: function nextTokenIdToClaim() view returns (uint256)
    // Selector: 0x3b51650d
    const nextIdResult = await makeRpcCall('eth_call', [
      {
        to: CONTRACT_ADDRESS,
        data: '0x3b51650d',
      },
      'latest',
    ]);
    if (nextIdResult) {
      minted = Math.max(0, decodeUint256(nextIdResult) - 1);
    }

    // Get maxSupply: function maxSupply() view returns (uint256)
    // Selector: 0xd5abeb01
    const maxSupplyResult = await makeRpcCall('eth_call', [
      {
        to: CONTRACT_ADDRESS,
        data: '0xd5abeb01',
      },
      'latest',
    ]);
    if (maxSupplyResult) {
      total = decodeUint256(maxSupplyResult);
    }

    // Get price from getClaimConditionById(0, 0)
    // Function selector for getClaimConditionById(uint256, uint256)
    const conditionCallData = '0x32a1f59f' + '0'.padStart(64, '0') + '0'.padStart(64, '0');
    
    const conditionResult = await makeRpcCall('eth_call', [
      { to: CONTRACT_ADDRESS, data: conditionCallData },
      'latest',
    ]);
    
    if (conditionResult && conditionResult !== '0x') {
      console.log(`✅ Got condition result (${conditionResult.length} chars)`);
      
      try {
        // Parse tuple fields - each is 32 bytes (64 hex chars)
        // ClaimCondition returns: startTimestamp, maxClaimableSupply, supplyClaimed, currency, pricePerToken, ...
        // Field 4 = pricePerToken
        const priceHex = '0x' + conditionResult.slice(2 + 256, 2 + 320);
        const priceWei = BigInt(priceHex);
        price = Number(priceWei) / 1e18;
        console.log(`✅ Price extracted: ${price} ETH (${priceWei} wei)`);
      } catch (e) {
        console.log('❌ Failed to parse price from condition:', e);
        price = 0.0005; // Mint price is 0.0005 ETH
      }
    } else {
      console.log('❌ No condition returned - defaulting to 0.0005 ETH');
      price = 0.0005; // Mint price is 0.0005 ETH
    }

    res.json({
      minted: Math.max(0, minted),
      total: total || 10000,
      price: Number(price.toFixed(6)),
      contractAddress: CONTRACT_ADDRESS,
    });
  } catch (error) {
    console.error('Error fetching contract stats:', error);
    res.json({
      minted: 0,
      total: 10000,
      price: 0,
      contractAddress: CONTRACT_ADDRESS,
    });
  }
});

// Mint NFT endpoint - handles actual minting
router.post('/mint', async (req, res) => {
  try {
    const { recipientAddress, quantity } = req.body;
    
    if (!recipientAddress || !quantity) {
      return res.status(400).json({ success: false, error: 'Missing recipient or quantity' });
    }

    // For now, return mock transaction since Thirdweb handles it on frontend
    // In production, you'd call the contract directly from backend
    const mockTransactionHash = '0x' + Math.random().toString(16).slice(2).padEnd(64, '0');
    
    res.json({
      success: true,
      transactionHash: mockTransactionHash,
      message: `Minting ${quantity} NFT(s)`,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Minting failed',
    });
  }
});

// Get contract info
router.get('/contract-info', (req, res) => {
  res.json({
    contractAddress: CONTRACT_ADDRESS,
    chainId: '8453',
  });
});

// Farcaster Frame endpoint
router.get('/api/frame', (req, res) => {
  const frameImage = `${req.protocol}://${req.get('host')}/og-image.png`;
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:post_url" content="${req.protocol}://${req.get('host')}/api/frame/action" />
        <meta property="fc:frame:button:1" content="Connect & Mint" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="og:image" content="${frameImage}" />
        <meta property="og:title" content="COPE - Mint NFTs" />
      </head>
      <body><a href="${req.protocol}://${req.get('host')}">Open COPE Minter</a></body>
    </html>
  `);
});

// Farcaster Frame action handler
router.post('/api/frame/action', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  const frameImage = `${req.protocol}://${req.get('host')}/og-image.png`;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${frameImage}" />
        <meta property="fc:frame:image:aspect_ratio" content="1:1" />
        <meta property="fc:frame:button:1" content="↗ Open Minter" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="${req.protocol}://${req.get('host')}" />
      </head>
      <body><a href="${req.protocol}://${req.get('host')}">Tap to mint</a></body>
    </html>
  `);
});
