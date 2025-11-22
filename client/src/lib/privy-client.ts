export const PRIVY_APP_ID = process.env.VITE_PRIVY_APP_ID || '';

if (!PRIVY_APP_ID) {
  console.warn('⚠️ VITE_PRIVY_APP_ID not set - Privy auth will not work');
}
