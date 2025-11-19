import { useState, useEffect } from "react";
import { ethers } from "ethers";
import CheckinLedgerABI from "../contracts/CheckinLedger.json";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE"; // Replace with your deployed contract

export default function Home() {
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");
  const [total, setTotal] = useState(0);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask or Base Wallet is required");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0]);
      setMessage(`Wallet connected: ${accounts[0]}`);
      fetchTotal(accounts[0], provider);
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Wallet connection failed");
    }
  };

  // Fetch check-in total for a user
  const fetchTotal = async (userAddress, provider) => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CheckinLedgerABI, signer);
      const userTotal = await contract.totals(userAddress);
      setTotal(userTotal.toString());
    } catch (err) {
      console.error("Failed to fetch total:", err);
    }
  };

  // Handle check-in
  const handleCheckin = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Optional: sign a message for proof
      const verificationMessage = `Check-in proof for ${address}`;
      const signature = await signer.signMessage(verificationMessage);
      console.log("Signed message:", signature);

      // Call contract on-chain
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CheckinLedgerABI, signer);
      const tx = await contract.updateTotal(address, 1);
      setMessage("Transaction sent, waiting for confirmation...");

      await tx.wait();
      setMessage(`Check-in successful! Tx hash: ${tx.hash}`);

      // Update total after successful check-in
      fetchTotal(address, provider);
    } catch (err) {
      console.error("Check-in failed:", err);
      setMessage(`Check-in failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Base Checkin Mini App</h1>

      {!address && (
        <button onClick={connectWallet} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Connect Wallet
        </button>
      )}

      {address && (
        <>
          <button onClick={handleCheckin} style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
            Check-in
          </button>
          <p style={{ marginTop: "1rem" }}>Your check-in total: {total}</p>
        </>
      )}

      <p style={{ marginTop: "1rem", color: "#333" }}>{message}</p>
    </div>
  );
}
