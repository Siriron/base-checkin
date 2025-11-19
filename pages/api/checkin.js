import { ethers } from "ethers";
import CheckinLedgerABI from "../../contracts/CheckinLedger.json";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { address, total, signature } = req.body;

  console.log("=== Check-in Request ===");
  console.log("Address:", address);
  console.log("Total:", total);
  console.log("Signature:", signature);

  if (!address) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    // Verify signature if provided
    if (signature) {
      const message = `Check-in for ${address}`;
      let signer;
      try {
        signer = ethers.verifyMessage(message, signature);
      } catch (sigErr) {
        console.error("Signature verification error:", sigErr);
        return res.status(401).json({ message: "Invalid signature" });
      }

      if (signer.toLowerCase() !== address.toLowerCase()) {
        console.error("Signature does not match address");
        return res.status(401).json({ message: "Signature verification failed" });
      }
      console.log("Signature verified successfully");
    } else {
      console.warn("No signature provided");
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      CheckinLedgerABI,
      wallet
    );

    console.log("Sending transaction to contract...");
    const tx = await contract.updateTotal(address, total || 1);
    console.log("Transaction sent, waiting for confirmation...");
    await tx.wait();
    console.log("Transaction confirmed:", tx.hash);

    return res.status(200).json({ message: `Check-in recorded for ${address}`, txHash: tx.hash });
  } catch (err) {
    console.error("Transaction error:", err);
    return res.status(500).json({ message: "Transaction failed: " + err.message });
  }
}
