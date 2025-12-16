import { getDB } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const db = await getDB();

    const { rows } = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.quantity AS current_stock,
        p.price,
        COALESCE(SUM(CASE WHEN l.type='IN' THEN l.qty END), 0) AS total_in,
        COALESCE(SUM(CASE WHEN l.type='OUT' THEN l.qty END), 0) AS total_out,
        MAX(l.created_at) AS last_activity
      FROM products p
      LEFT JOIN stock_logs l ON l.product_id = p.id
      GROUP BY p.id, p.name, p.quantity, p.price
      ORDER BY p.id ASC
    `);

    return res.status(200).json(rows);
  } catch (e) {
    console.error("API REPORT STOCK ERROR:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
