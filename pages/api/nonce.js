export default function handler(req, res) {
  const nonce = Math.floor(Math.random() * 1000000);
  res.status(200).json({ nonce });
}
