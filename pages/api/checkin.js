import { ethers } from "ethers";
import CheckinLedgerABI from "../../contracts/CheckinLedger.json";

export default async function handler(req, res) {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_RPC_URL);
  const wallet = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    CheckinLedgerABI,
    wallet
  );

  try {
    const user = req.body.address;
    const total = req.body.total || 1;
    const tx = await contract.updateTotal(user, total);
    await tx.wait();
    res.status(200).json({ message: `Check-in recorded for ${user}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error during check-in" });
  }
}
