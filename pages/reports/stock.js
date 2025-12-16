import Layout from "../../components/Layout";
import { useEffect, useState } from "react";

export default function ReportStock() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/report/stock");
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error("Gagal load report stok:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Report Stok</h1>

      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : data.length === 0 ? (
          <p className="text-gray-500">Belum ada data stok.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Nama Produk</th>
                <th className="text-right p-2">Stok Saat Ini</th>
                <th className="text-right p-2">Barang Masuk</th>
                <th className="text-right p-2">Barang Keluar</th>
                <th className="text-left p-2">Aktivitas Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 text-right font-semibold">
                    {p.current_stock}
                  </td>
                  <td className="p-2 text-right text-green-600">
                    +{p.total_in}
                  </td>
                  <td className="p-2 text-right text-red-600">
                    -{p.total_out}
                  </td>
                  <td className="p-2 text-sm text-gray-600">
                    {p.last_activity
                      ? new Date(p.last_activity).toLocaleString("id-ID")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
