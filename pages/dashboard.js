import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProduk: 0,
    totalStok: 0,
    totalNilai: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [topData, setTopData] = useState([]); // <-- chart ke-2

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();

        setStats({
          totalProduk: data.totalProducts || 0,
          totalStok: data.totalStock || 0,
          totalNilai: data.totalValue || 0,
        });

        // chart aktivitas
        if (Array.isArray(data.chart)) {
          setChartData(
            data.chart.map((d) => ({
              date: d.date,
              count: Number(d.cnt || 0),
            }))
          );
        } else {
          setChartData([]);
        }

        // chart top produk stok
        if (Array.isArray(data.topProducts)) {
          setTopData(
            data.topProducts.map((p) => ({
              name: p.name,
              quantity: Number(p.quantity || 0),
            }))
          );
        } else {
          setTopData([]);
        }
      } catch (e) {
        console.error("Gagal load dashboard:", e);
        setChartData([]);
        setTopData([]);
      }
    }
    load();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total Produk</p>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalProduk}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total Stok</p>
          <p className="text-3xl font-bold text-green-600">
            {stats.totalStok}
          </p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <p className="text-gray-500">Total Nilai</p>
          <p className="text-3xl font-bold text-purple-600">
            Rp {Number(stats.totalNilai).toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* ===== Chart 1: Line aktivitas ===== */}
      <div className="p-6 bg-white rounded shadow mb-8" style={{ height: 350 }}>
        <p className="font-semibold mb-3">Grafik Aktivitas Produk</p>

        {chartData.length === 0 ? (
          <p className="text-gray-500">Belum ada aktivitas</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ===== Chart 2: Bar top stok ===== */}
      <div className="p-6 bg-white rounded shadow" style={{ height: 350 }}>
        <p className="font-semibold mb-3">Top 5 Produk Berdasarkan Stok</p>

        {topData.length === 0 ? (
          <p className="text-gray-500">Belum ada data produk</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topData} margin={{ top: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Layout>
  );
}
