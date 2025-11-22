import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import { createThirdwebClient } from "thirdweb";

// Create and export client
export const client = createThirdwebClient({
  clientId: import.meta.env.VITE_THIRDWEB_CLIENT_ID || "default",
});

export const CONTRACT_ADDRESS = "0xC69D12003f1f1c14874445818330066877A5A49e";

// Export chain for WalletConnect component
export const chain = base;

export async function mintNFT(account: any, quantity: number = 1) {
  if (!account) {
    throw new Error("Account is required");
  }
  
  if (!account.address) {
    throw new Error("Account address is required");
  }
  
  try {
    const statsRes = await fetch("/api/contract/stats");
    
    if (!statsRes.ok) {
      throw new Error("Failed to fetch contract stats");
    }
    
    const stats = await statsRes.json();
    const pricePerNFT = stats.price || 0.0005;
    const totalPrice = pricePerNFT * quantity;
    
    const contract = getContract({
      client,
      address: CONTRACT_ADDRESS,
      chain: base,
    });
    
    const pricePerTokenWei = BigInt(Math.floor(pricePerNFT * 1e18));
    const totalValueWei = pricePerTokenWei * BigInt(quantity);
    
    const tx = prepareContractCall({
      contract,
      method: "function claim(address,uint256,uint256,address,uint256,(bytes32[],uint256,uint256,address),bytes)",
      params: [
        account.address,
        BigInt(0),
        BigInt(quantity),
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        pricePerTokenWei,
        [
          [], 
          BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), 
          BigInt(0), 
          "0x0000000000000000000000000000000000000000"
        ],
        "0x",
      ],
      value: totalValueWei,
    });
    
    const receipt = await sendTransaction({
      transaction: tx,
      account,
    });
    
    return {
      transactionHash: receipt.transactionHash,
      success: true,
    };
  } catch (error: any) {
    // Re-throw with user-friendly message
    if (error?.message?.includes("user rejected") || error?.code === 4001) {
      throw new Error("Transaction was rejected");
    } else if (error?.message?.includes("insufficient funds")) {
      throw new Error("Insufficient funds for transaction");
    } else {
      throw new Error(error?.message || "Transaction failed");
    }
  }
}

export function getContractInstance() {
  return null;
}
