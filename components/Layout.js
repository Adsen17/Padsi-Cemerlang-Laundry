import { useState } from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar open={open} onToggle={() => setOpen((v) => !v)} />

      <main className="flex-1 bg-gray-100 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
}
