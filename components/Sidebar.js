import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  Package,
  FileText,
  LogOut,
} from "lucide-react";
import { logout } from "../lib/auth";

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="relative w-64 bg-white border-r min-h-screen p-4">
      <h1 className="text-xl font-bold mb-6 text-blue-700">
        Cemerlang Laundry
      </h1>

      <div>
        <p className="text-gray-500 font-semibold mb-2">Navigasi Utama</p>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
        >
          <Package size={20} />
          <span>Produk</span>
        </Link>

        {/* ✅ hanya Report Stok */}
        <Link
          href="/reports/stock"
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
        >
          <FileText size={20} />
          <span>Report Stok</span>
        </Link>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
