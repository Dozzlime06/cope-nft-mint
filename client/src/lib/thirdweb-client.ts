import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import { client } from "@/lib/client";
import { debugLog } from "./debug-logger";

export const CONTRACT_ADDRESS = "0xC69D12003f1f1c14874445818330066877A5A49e";

// Export chain for WalletConnect component
export const chain = base;

export async function mintNFT(account: any, quantity: number = 1) {
  debugLog.log("🚀 mintNFT called", { address: account?.address, quantity });
  
  if (!account) {
    debugLog.error("❌ No account provided");
    throw new Error("Account is required");
  }
  
  if (!account.address) {
    debugLog.error("❌ Account has no address");
    throw new Error("Account address is required");
  }
  
  try {
    debugLog.log("📊 Fetching contract stats...");
    const statsRes = await fetch("/api/contract/stats");
    
    if (!statsRes.ok) {
      debugLog.error("❌ Failed to fetch stats", statsRes.status);
      throw new Error("Failed to fetch contract stats");
    }
    
    const stats = await statsRes.json();
    debugLog.log("💰 Stats received:", stats);
    
    const pricePerNFT = stats.price || 0.0005;
    const totalPrice = pricePerNFT * quantity;
    debugLog.log(`💵 Total cost: ${totalPrice} ETH for ${quantity} NFTs`);
    
    debugLog.log("🔗 Creating contract instance...");
    const contract = getContract({
      client,
      address: CONTRACT_ADDRESS,
      chain: base,
    });
    debugLog.log("✅ Contract created:", CONTRACT_ADDRESS);
    
    debugLog.log("📝 Preparing claim transaction...");
    const pricePerTokenWei = BigInt(Math.floor(pricePerNFT * 1e18));
    const totalValueWei = pricePerTokenWei * BigInt(quantity);
    
    debugLog.log(`💎 Price: ${pricePerTokenWei.toString()} wei per token`);
    debugLog.log(`💎 Total: ${totalValueWei.toString()} wei`);
    
    const tx = prepareContractCall({
      contract,
      method: "function claim(address,uint256,uint256,address,uint256,(bytes32[],uint256,uint256,address),bytes)",
      params: [
        account.address,
        BigInt(0),
        BigInt(quantity),
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
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
    debugLog.log("✅ Transaction prepared, ready to send");
    
    debugLog.log("📤 Sending transaction to wallet... (wallet popup should appear now)");
    const receipt = await sendTransaction({
      transaction: tx,
      account,
    });
    
    debugLog.log("✅ Transaction sent! Hash:", receipt.transactionHash);
    
    return {
      transactionHash: receipt.transactionHash,
      success: true,
    };
  } catch (error: any) {
    debugLog.error("❌ ERROR in mintNFT", {
      message: error?.message,
      name: error?.name,
      code: error?.code,
      reason: error?.reason,
      data: error?.data?.message || error?.data,
      stack: error?.stack?.split('\n')[0],
    });
    
    // Re-throw with user-friendly message
    if (error?.message?.includes("user rejected")) {
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
