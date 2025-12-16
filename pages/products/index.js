import Layout from "../../components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal confirm delete
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [toast, setToast] = useState({ open: false, msg: "" });

  // === NEW: popup stok rendah ===
  const [lowPopup, setLowPopup] = useState({ open: false, items: [] });
  const [hasShownLowPopup, setHasShownLowPopup] = useState(false);
  const LOW_STOCK_THRESHOLD = 20;

  const showToast = (msg) => {
    setToast({ open: true, msg });
    setTimeout(() => setToast({ open: false, msg: "" }), 1500);
  };

  async function loadProducts() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProducts(list);

      // === NEW: deteksi stok rendah dan munculkan popup ===
      const lowItems = list.filter(
        (p) => Number(p.quantity) < LOW_STOCK_THRESHOLD
      );

      if (!hasShownLowPopup && lowItems.length > 0) {
        setLowPopup({ open: true, items: lowItems });
        setHasShownLowPopup(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function doDelete(id) {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    setConfirm({ open: false, id: null });
    showToast("Produk berhasil dihapus");
    loadProducts();
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Daftar Produk</h1>

        <Link
          href="/products/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          + Tambah Produk
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-4 text-gray-500">Belum ada produk.</p>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Harga</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => {
                const low = Number(p.quantity) < LOW_STOCK_THRESHOLD;

                return (
                  <tr
                    key={p.id}
                    className={`border-t ${low ? "bg-red-50" : ""}`}
                  >
                    <td className="p-3">{p.name}</td>

                    <td className="p-3">
                      {p.quantity}
                      {low && (
                        <span className="ml-2 inline-block text-xs px-2 py-0.5 rounded bg-red-600 text-white">
                          Stok Rendah
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      Rp {Number(p.price || 0).toLocaleString("id-ID")}
                    </td>

                    <td className="p-3">
                      {low ? (
                        <span className="text-red-700 font-semibold">
                          &lt; {LOW_STOCK_THRESHOLD}
                        </span>
                      ) : (
                        <span className="text-green-700 font-semibold">Aman</span>
                      )}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => setConfirm({ open: true, id: p.id })}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* === NEW: POPUP NOTIFIKASI STOK RENDAH === */}
      {lowPopup.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-red-700 mb-2">
              ⚠️ Notifikasi Stok Rendah
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Berikut produk dengan stok di bawah {LOW_STOCK_THRESHOLD}:
            </p>

            <ul className="space-y-2 max-h-60 overflow-auto">
              {lowPopup.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center bg-red-50 px-3 py-2 rounded"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-red-700 font-bold">
                    {item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setLowPopup({ open: false, items: [] })}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Tutup
              </button>
              <Link
                href="/products/add"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => setLowPopup({ open: false, items: [] })}
              >
                Tambah Stok
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRM DELETE */}
      {confirm.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Hapus Produk?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Produk yang dihapus tidak bisa dikembalikan.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm({ open: false, id: null })}
                className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
              >
                Batal
              </button>
              <button
                onClick={() => doDelete(confirm.id)}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIF */}
      {toast.open && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded shadow text-sm z-50">
          {toast.msg}
        </div>
      )}
    </Layout>
  );
}
