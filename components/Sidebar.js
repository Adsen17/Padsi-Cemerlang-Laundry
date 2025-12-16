import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Package, FileText, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { logout } from "../lib/auth";

export default function Sidebar({ open, onToggle }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div
      className={`relative bg-white border-r min-h-screen p-4 transition-all duration-200
      ${open ? "w-64" : "w-20"}`}
    >
      {/* Header + tombol toggle */}
      <div className="flex items-center justify-between mb-6">
        <h1 className={`text-xl font-bold text-blue-700 ${open ? "block" : "hidden"}`}>
          Cemerlang Laundry
        </h1>

        <button
          type="button"
          onClick={onToggle}
          className="p-2 rounded hover:bg-gray-100"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <div>
        <p className={`text-gray-500 font-semibold mb-2 ${open ? "block" : "hidden"}`}>
          Navigasi Utama
        </p>

        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          title="Dashboard"
        >
          <LayoutDashboard size={20} />
          <span className={`${open ? "block" : "hidden"}`}>Dashboard</span>
        </Link>

        <Link
          href="/products"
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          title="Produk"
        >
          <Package size={20} />
          <span className={`${open ? "block" : "hidden"}`}>Produk</span>
        </Link>

        <Link
          href="/reports/stock"
          className="flex items-center gap-2 p-2 rounded hover:bg-blue-100"
          title="Report Stok"
        >
          <FileText size={20} />
          <span className={`${open ? "block" : "hidden"}`}>Report Stok</span>
        </Link>
      </div>

      {/* Logout tetap ada, teks disembunyikan saat collapse */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
          title="Logout"
        >
          <LogOut size={18} />
          <span className={`${open ? "block" : "hidden"}`}>Logout</span>
        </button>
      </div>
    </div>
  );
}
