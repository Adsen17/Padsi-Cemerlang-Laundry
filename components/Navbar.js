import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO / TITLE */}
        <h1 className="text-xl font-bold">Inventory App</h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm">
          <Link href="/products" className="hover:text-blue-600">
            Produk
          </Link>
          <Link href="/import" className="hover:text-blue-600">
            Import
          </Link>
          <Link href="/reports" className="hover:text-blue-600">
            Laporan
          </Link>
          <Link href="/settings" className="hover:text-blue-600">
            Pengaturan
          </Link>
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white shadow px-4 pb-4 flex flex-col gap-3 text-sm">
          <Link href="/products" className="hover:text-blue-600">
            Produk
          </Link>
          <Link href="/import" className="hover:text-blue-600">
            Import
          </Link>
          <Link href="/reports" className="hover:text-blue-600">
            Laporan
          </Link>
          <Link href="/settings" className="hover:text-blue-600">
            Pengaturan
          </Link>
        </div>
      )}
    </nav>
  );
}
