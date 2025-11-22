import { getContract, createThirdwebClient } from 'thirdweb';
import { base } from 'thirdweb/chains';

const CONTRACT_ADDRESS = '0xC69D12003f1f1c14874445818330066877A5A49e';

// Create a server-side client (without clientId for read-only calls)
const serverClient = createThirdwebClient({
  clientId: process.env.VITE_THIRDWEB_CLIENT_ID || 'server',
});

export function getContractInstance() {
  try {
    return getContract({
      client: serverClient,
      chain: base,
      address: CONTRACT_ADDRESS,
    });
  } catch (error) {
    console.error('Error getting contract instance:', error);
    return null;
  }
}
