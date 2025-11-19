import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const nonce = Math.floor(Math.random() * 1000000);
  res.status(200).json({ nonce });
}
