import Layout from "../../components/Layout";
import { useState } from "react";
import { useRouter } from "next/router";
import * as XLSX from "xlsx";

export default function AddProductPage() {
  const router = useRouter();

  // form manual
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);

  // excel
  const [excelFile, setExcelFile] = useState(null);
  const [importing, setImporting] = useState(false);

  // modal notif
  const [modal, setModal] = useState({ open: false, title: "", msg: "" });
  const openModal = (title, msg) =>
    setModal({ open: true, title, msg });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setSaving(true);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity, price }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal tambah produk");
      }

      openModal("Berhasil", "Produk berhasil ditambahkan!");
      setName("");
      setQuantity(0);
      setPrice(0);
    } catch (e) {
      openModal("Gagal", e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleImportExcel() {
    if (!excelFile) {
      openModal("Info", "Pilih file Excel dulu ya.");
      return;
    }

    try {
      setImporting(true);

      const data = await excelFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      // mapping jadi {name, delta, price}
      const items = json
        .map((row) => ({
          name: String(row.name || row.Name || row.NAMA || "").trim(),
          delta: Number(row.delta || row.Delta || row.QTY || row.qty || 0),
          price:
            row.price != null
              ? Number(row.price || row.Price || row.HARGA)
              : null,
        }))
        .filter((x) => x.name);

      if (items.length === 0) {
        openModal("Gagal", "Data Excel kosong / format salah.");
        return;
      }

      const res = await fetch("/api/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Import gagal");
      }

      openModal("Berhasil", "Import Excel berhasil, stok sudah terupdate!");
      setExcelFile(null);
    } catch (e) {
      openModal("Gagal", e.message);
    } finally {
      setImporting(false);
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>

      {/* FORM MANUAL */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-6 max-w-lg space-y-4 mb-8"
      >
        <h2 className="font-semibold">Tambah Manual</h2>

        <div>
          <label className="block text-sm font-medium mb-1">Nama Produk</label>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Quantity</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Harga</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2 text-sm"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
          />
        </div>

        <div className="flex gap-2">
          <button
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/products")}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Kembali
          </button>
        </div>
      </form>

      {/* IMPORT EXCEL */}
      <div className="bg-white rounded shadow p-6 max-w-lg space-y-3">
        <h2 className="font-semibold">Import Excel (Update Stok)</h2>
        <p className="text-xs text-gray-500">
          Format kolom: <b>name</b>, <b>delta</b> (contoh -10), opsional <b>price</b>
        </p>

        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
          className="text-sm"
        />

        <button
          onClick={handleImportExcel}
          disabled={importing}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm disabled:opacity-50"
        >
          {importing ? "Importing..." : "Upload & Update Stok"}
        </button>
      </div>

      {/* MODAL NOTIF */}
      {modal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">{modal.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{modal.msg}</p>
            <button
              onClick={() => setModal({ open: false, title: "", msg: "" })}
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
