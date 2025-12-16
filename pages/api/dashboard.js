import { getDB } from "../../lib/db";

export default async function handler(req, res) {
  try {
    const db = await getDB();

    // total produk
    const { rows: pRows } = await db.query(
      "SELECT COUNT(*)::int AS total FROM products"
    );
    const totalProducts = pRows?.[0]?.total || 0;

    // total stok
    const { rows: sRows } = await db.query(
      "SELECT COALESCE(SUM(quantity),0)::int AS totalStock FROM products"
    );
    const totalStock = sRows?.[0]?.totalstock ?? sRows?.[0]?.totalStock ?? 0;

    // total nilai stok
    const { rows: vRows } = await db.query(
      "SELECT COALESCE(SUM(price * quantity),0) AS totalValue FROM products"
    );
    const totalValue = Number(vRows?.[0]?.totalvalue ?? vRows?.[0]?.totalValue ?? 0);

    // chart transaksi masuk/keluar 30 hari terakhir (berdasarkan stock_logs)
    let chartRows = [];
    try {
      const { rows: logs } = await db.query(`
        SELECT 
          DATE(created_at) AS date,
          COALESCE(SUM(CASE WHEN type='IN' THEN qty END), 0) AS total_in,
          COALESCE(SUM(CASE WHEN type='OUT' THEN qty END), 0) AS total_out
        FROM stock_logs
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
        LIMIT 30
      `);
      chartRows = logs || [];
    } catch {
      chartRows = [];
    }

    // chart top produk berdasarkan stok
    let topRows = [];
    try {
      const { rows: tops } = await db.query(`
        SELECT 
          name,
          quantity
        FROM products
        ORDER BY quantity DESC
        LIMIT 5
      `);
      topRows = tops || [];
    } catch {
      topRows = [];
    }

    return res.status(200).json({
      totalProducts,
      totalStock,
      totalValue,
      chart: chartRows,
      topProducts: topRows,
    });
  } catch (e) {
    console.error("API DASHBOARD ERROR:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
