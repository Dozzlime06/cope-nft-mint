import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONTRACT_ADDRESS = '0xC69D12003f1f1c14874445818330066877A5A49e';
const BASE_RPC = 'https://mainnet.base.org';

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

function decodeUint256(hex: string): number {
  if (!hex) return 0;
  return parseInt(hex, 16);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let minted = 0;
    let total = 10000;
    let price = 0.0005;

    // Get nextTokenIdToClaim
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

    // Get maxSupply
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
    const conditionCallData = '0x32a1f59f' + '0'.padStart(64, '0') + '0'.padStart(64, '0');
    
    const conditionResult = await makeRpcCall('eth_call', [
      { to: CONTRACT_ADDRESS, data: conditionCallData },
      'latest',
    ]);
    
    if (conditionResult && conditionResult !== '0x') {
      try {
        const priceHex = '0x' + conditionResult.slice(2 + 256, 2 + 320);
        const priceWei = BigInt(priceHex);
        price = Number(priceWei) / 1e18;
      } catch (e) {
        price = 0.0005;
      }
    } else {
      price = 0.0005;
    }

    res.status(200).json({
      minted: Math.max(0, minted),
      total: total || 10000,
      price: Number(price.toFixed(6)),
      contractAddress: CONTRACT_ADDRESS,
    });
  } catch (error) {
    console.error('Error fetching contract stats:', error);
    res.status(200).json({
      minted: 0,
      total: 10000,
      price: 0.0005,
      contractAddress: CONTRACT_ADDRESS,
    });
  }
}
