export async function connectWarpcast() {
  const SignerAuthKit = window.SignerAuthKit;

  if (!SignerAuthKit) {
    alert("SignerAuthKit not loaded. Please reload the app inside Warpcast.");
    return null;
  }

  const signer = new SignerAuthKit();

  const result = await signer.signIn();
  if (result?.status === "connected") {
    console.log("Connected to Warpcast wallet:", result.address);
    return result.address;
  } else {
    alert("Wallet connection failed.");
    return null;
  }
}
