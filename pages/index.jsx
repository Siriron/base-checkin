import { useState } from "react";
import { ethers } from "ethers";

export default function Home() {
  const [message, setMessage] = useState("");
  const [address, setAddress] = useState("");

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
    } catch (err) {
      console.error("Wallet connection failed:", err);
      alert("Wallet connection failed");
    }
  };

  // Handle check-in
  const handleCheckin = async () => {
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, total: 1 }),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error("Check-in failed:", err);
      setMessage("Check-in failed");
    }
  };

  return (
    <div>
      <h1>Base Checkin Mini App</h1>

      {!address && <button onClick={connectWallet}>Connect Wallet</button>}
      {address && <button onClick={handleCheckin}>Check-in</button>}

      <p>{message}</p>
    </div>
  );
}
