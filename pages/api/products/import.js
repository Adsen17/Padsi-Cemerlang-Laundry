import { getDB } from "../../../lib/db";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await getDB();
    const items = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: "Body harus array" });
    }

    for (const it of items) {
      const name = String(it.name || it.Name || "").trim();
      const delta = Number(it.delta ?? it.qty ?? it.quantity ?? 0);
      const price = it.price != null ? Number(it.price) : null;

      if (!name) continue;
      if (!Number.isFinite(delta) || delta === 0) continue;

      // cari produk existing
      const { rows } = await db.query(
        "SELECT id, quantity FROM products WHERE name = $1 LIMIT 1",
        [name]
      );

      if (rows.length > 0) {
        const productId = rows[0].id;
        const currentQty = Number(rows[0].quantity || 0);

        let newQty = currentQty + delta;
        if (newQty < 0) newQty = 0;

        await db.query("UPDATE products SET quantity = $1 WHERE id = $2", [
          newQty,
          productId,
        ]);

        // optional update price kalau ada di excel
        if (price != null && !Number.isNaN(price)) {
          await db.query("UPDATE products SET price = $1 WHERE id = $2", [
            price,
            productId,
          ]);
        }

        // catat log
        const type = delta > 0 ? "IN" : "OUT";
        const qtyAbs = Math.abs(delta);

        await db.query(
          "INSERT INTO stock_logs (product_id, type, qty, note) VALUES ($1,$2,$3,$4)",
          [productId, type, qtyAbs, "Import Excel"]
        );
      } else {
        // insert produk baru
        const ref = "PRD-" + nanoid(8).toUpperCase();
        const qty = Math.max(delta, 0);
        const p = price != null && !Number.isNaN(price) ? price : 0;

        const ins = await db.query(
          "INSERT INTO products (ref, name, quantity, price, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING id",
          [ref, name, qty, p]
        );
        const productId = ins.rows[0].id;

        // catat log (anggap IN kalau produk baru)
        await db.query(
          "INSERT INTO stock_logs (product_id, type, qty, note) VALUES ($1,$2,$3,$4)",
          [productId, "IN", qty, "Import Excel (new product)"]
        );
      }
    }

    return res.status(200).json({ message: "Import Excel berhasil" });
  } catch (e) {
    console.error("IMPORT ERROR:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
}
