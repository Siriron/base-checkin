import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const handleCheckin = async () => {
    const res = await fetch("/api/checkin", { method: "POST" });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h1>Base Checkin Mini App</h1>
      <button onClick={handleCheckin}>Check-in</button>
      <p>{message}</p>
    </div>
  );
}
