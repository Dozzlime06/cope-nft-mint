# Deploy to Vercel

Your COPE NFT minting app is ready to deploy to Vercel! 🚀

## Quick Deploy (2 minutes)

### Step 1: Go to Vercel
https://vercel.com/new

### Step 2: Import from GitHub
- Click **"Import from Git Repository"**
- Search for: **dozzlime06/cope-nft-mint**
- Click **Import**

### Step 3: Configure Environment
If you have API keys, add them as Environment Variables:
- `VITE_API_URL` (if using custom backend)
- `VITE_CONTRACT_ADDRESS` (should already be set)

### Step 4: Deploy
Click **Deploy** and wait ~2 minutes

### Done! ✅
Your app will be live at: `https://cope-nft-mint.vercel.app`

---

## What's Deployed:
- Full-stack Next.js app (Express + React)
- Farcaster frame integration ready
- Base network NFT minting (COPE contract)
- Debug logs system built-in

## After Deployment:
1. Test the app at your Vercel URL
2. Share the URL in your Farcaster frame
3. Users can mint directly!

---

## Troubleshooting:
If deployment fails:
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct scripts
- Verify all environment variables are set
- Check that Node version is 18+ (default on Vercel)

---

**Questions?** Check the Vercel docs: https://vercel.com/docs
