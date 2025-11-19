import type { NextApiRequest, NextApiResponse } from "next";

const totals: Record<string, number> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json(totals);
  } else if (req.method === "POST") {
    const { user, total } = req.body;
    totals[user] = total;
    res.status(200).json({ message: "Updated total" });
  } else {
    res.status(405).end();
  }
}
