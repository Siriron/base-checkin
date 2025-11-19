import { ethers } from "ethers";
import CheckinLedgerABI from "../../contracts/CheckinLedger.json";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { address, total, signature } = req.body;

  if (!address) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  try {
    // Optional: Verify signature if provided
    if (signature) {
      const message = `Check-in for ${address}`;
      const signer = ethers.verifyMessage(message, signature);

      if (signer.toLowerCase() !== address.toLowerCase()) {
        return res.status(401).json({ message: "Signature verification failed" });
      }
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
    const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      CheckinLedgerABI,
      wallet
    );

    // Update total
    const tx = await contract.updateTotal(address, total || 1);
    await tx.wait();

    return res.status(200).json({ message: `Check-in recorded for ${address}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error during check-in" });
  }
}
