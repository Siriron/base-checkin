export default async function handler(req, res) {
  const { address, signature } = req.body;

  // Here you would verify signature using ethers.js
  const verified = true; // placeholder

  if (verified) {
    res.status(200).json({ verified: true });
  } else {
    res.status(401).json({ verified: false });
  }
}
