const totals = {};

export default function handler(req, res) {
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
