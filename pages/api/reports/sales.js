import { getDB } from "../../../lib/db";

export default async function handler(req, res) {
  try {
    const db = await getDB();

    const { rows } = await db.query(`
      SELECT 
        s.id,
        s.ref,
        s.total,
        s.created_at,
        COUNT(si.id) AS itemscount,
        COALESCE(SUM(si.qty),0) AS totalqty
      FROM sales s
      LEFT JOIN sales_items si ON si.sale_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
      LIMIT 50
    `);

    res.status(200).json(rows);
  } catch (e) {
    console.error("REPORT ERROR:", e);
    res.status(500).json({ message: "Internal server error" });
  }
}
