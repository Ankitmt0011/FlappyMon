import { SignerAuthKit } from '@farcaster/auth-kit';

let signer = null;
let userAddress = null;

/**
 * Connect to Warpcast using Farcaster Auth Kit
 * Returns user's Ethereum address
 */
export async function connectWarpcast() {
  try {
    signer = new SignerAuthKit();

    const result = await signer.signIn(); // Opens Warpcast sign-in modal

    if (result && result.status === 'connected') {
      userAddress = result.address;
      console.log("✅ Connected Warpcast wallet:", userAddress);
      return userAddress;
    } else {
      console.warn("❌ Wallet connection failed.");
      alert("Wallet connection failed. Please try again inside Warpcast.");
      return null;
    }

  } catch (err) {
    console.error("AuthKit error:", err);
    alert("Error during wallet connection.");
    return null;
  }
}

export function getConnectedAddress() {
  return userAddress;
}
