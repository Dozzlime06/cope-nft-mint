import { useActiveAccount } from 'thirdweb/react';

const NEYNAR_API_KEY = import.meta.env.VITE_NEYNAR_API_KEY || '';
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export async function checkFarcasterProStatus(farcasterAddress: string): Promise<boolean> {
  try {
    if (!NEYNAR_API_KEY) {
      console.warn('Neynar API key not configured');
      return false;
    }

    // Get user details from Farcaster address
    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/user/by_address?address=${farcasterAddress}&api_key=${NEYNAR_API_KEY}`
    );

    if (!response.ok) {
      console.error('Failed to fetch user from Neynar');
      return false;
    }

    const data = await response.json();
    
    // Check if user has premium/pro subscription
    if (data.user && data.user.experimental_features) {
      return data.user.experimental_features.includes('premium') || 
             data.user.experimental_features.includes('pro');
    }

    // Alternative: check via subscription endpoints if available
    if (data.user && data.user.subscription_status === 'active') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return false;
  }
}

export async function getFarcasterUser(farcasterId: string) {
  try {
    if (!NEYNAR_API_KEY) return null;

    const response = await fetch(
      `${NEYNAR_BASE_URL}/farcaster/user/by_fid?fid=${farcasterId}&api_key=${NEYNAR_API_KEY}`
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching Farcaster user:', error);
    return null;
  }
}
