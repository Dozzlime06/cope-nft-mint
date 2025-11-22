import { getContract, prepareContractCall, resolveMethod, sendTransaction } from "thirdweb";
import { client } from "@/lib/client";
import { debugLog } from "./debug-logger";

export const CONTRACT_ADDRESS = "0xC69D12003f1f1c14874445818330066877A5A49e";
const CHAIN_ID = 8453; // Base

export async function mintNFT(account: any, quantity: number = 1) {
  debugLog.log("🚀 mintNFT called", { address: account?.address, quantity });
  
  try {
    debugLog.log("📊 Fetching contract stats...");
    const statsRes = await fetch("/api/contract/stats");
    const stats = await statsRes.json();
    debugLog.log("💰 Price per NFT:", stats.price);
    
    const pricePerNFT = stats.price || 0.0005;
    const totalPrice = pricePerNFT * quantity;
    debugLog.log(`💵 Total cost: ${totalPrice} ETH for ${quantity} NFTs`);
    
    debugLog.log("🔗 Creating contract instance...");
    const contract = getContract({
      client,
      address: CONTRACT_ADDRESS,
      chain: { id: CHAIN_ID },
    });
    debugLog.log("✅ Contract created");
    
    debugLog.log("📝 Preparing claim transaction...");
    const pricePerTokenWei = BigInt(Math.floor(pricePerNFT * 1e18));
    const totalValueWei = pricePerTokenWei * BigInt(quantity);
    
    const tx = prepareContractCall({
      contract,
      method: "function claim(address,uint256,uint256,address,uint256,(bytes32[],uint256,uint256,address),bytes)",
      params: [
        account.address,
        BigInt(0),
        BigInt(quantity),
        "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
        pricePerTokenWei,
        [[], BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"), BigInt(0), "0x0000000000000000000000000000000000000000"],
        "0x",
      ],
      value: totalValueWei,
    });
    debugLog.log("✅ Transaction prepared");
    
    debugLog.log("📤 Sending transaction to wallet...");
    const receipt = await sendTransaction({
      transaction: tx,
      account,
    });
    debugLog.log("✅ Transaction hash:", receipt.transactionHash);
    
    debugLog.log("⏳ Waiting for confirmation...");
    return {
      transactionHash: receipt.transactionHash,
      success: true,
    };
  } catch (error: any) {
    debugLog.error("ERROR in mintNFT", {
      message: error?.message,
      name: error?.name,
      code: error?.code,
      data: error?.data?.message || error?.data,
    });
    throw new Error(error?.message || "Transaction failed");
  }
}

export function getContractInstance() {
  return null;
}
