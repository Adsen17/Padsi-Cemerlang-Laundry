import { useState } from "react";

export default function Signup({ notify }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return notify(data.message || "Signup gagal");

    notify("Signup berhasil");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white w-96 p-8 rounded-xl shadow-xl">
        <h2 className="text-center text-xl font-bold mb-4">Create Account</h2>

        <form onSubmit={handleSignup}>
          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border p-2 mb-3 rounded"
            placeholder="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center">
          <a href="/login" className="text-blue-500 text-sm">
            Already have an account? LOGIN
          </a>
        </div>
      </div>
    </div>
  );
}
