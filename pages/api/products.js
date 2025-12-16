// pages/api/products.js
import { getDB } from "../../lib/db";

const LOW_STOCK_THRESHOLD = 20;

export default async function handler(req, res) {
  try {
    const db = await getDB();

    if (req.method === "GET") {
      const { rows } = await db.query(
        "SELECT id, name, quantity, price, description, created_at FROM products ORDER BY id ASC"
      );

      // tambahin flag stok rendah
      const withLowStockFlag = rows.map((p) => ({
        ...p,
        lowStock: Number(p.quantity) < LOW_STOCK_THRESHOLD,
      }));

      return res.status(200).json(withLowStockFlag);
    }

    if (req.method === "POST") {
      const { name, quantity = 0, price = 0, description = "" } = req.body;

      await db.query(
        "INSERT INTO products (name, quantity, price, description, created_at) VALUES ($1,$2,$3,$4,NOW())",
        [name, Number(quantity), Number(price), description]
      );

      return res.status(201).json({ message: "Produk ditambahkan" });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: "id wajib" });

      await db.query("DELETE FROM products WHERE id=$1", [id]);
      return res.status(200).json({ message: "Produk dihapus" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (e) {
    console.error("API PRODUCTS ERROR:", e);
    return res.status(500).json({ error: "Internal server error" });
  }
}
