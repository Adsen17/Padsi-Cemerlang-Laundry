import { getDB } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const db = await getDB();

    const { rows } = await db.query(`
      SELECT 
        DATE(l.created_at) AS date,
        COALESCE(SUM(l.qty),0) AS totalout,
        COALESCE(SUM(l.qty * p.price),0) AS totalvalue
      FROM stock_logs l
      JOIN products p ON p.id = l.product_id
      WHERE l.type = 'OUT'
      GROUP BY DATE(l.created_at)
      ORDER BY DATE(l.created_at) DESC
      LIMIT 30
    `);

    return res.status(200).json(rows);
  } catch (e) {
    console.error("REPORT SALES ERROR:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
