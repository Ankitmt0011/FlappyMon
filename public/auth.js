
import { SignerAuthKit } from '@farcaster/auth-kit';

let signer = null;
let userAddress = null;

export async function connectWarpcast() {
  signer = new SignerAuthKit();

  const result = await signer.signIn(); // opens Warpcast sign-in
  if (result?.status === 'connected') {
    userAddress = result.address;
    console.log("Connected wallet:", userAddress);
  } else {
    alert("Wallet connection failed.");
  }

  return userAddress;
}
