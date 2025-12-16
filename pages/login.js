import { useState } from "react";
import { login } from "../lib/auth";

export default function Login({ notify }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    try {
      await login({ username, password });
      notify("Login berhasil");
      window.location.href = "/dashboard";
    } catch (err) {
      notify(err.message || "Login gagal");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-center text-lg font-semibold mb-4">Log In</h1>

        <div className="bg-yellow-100 text-yellow-800 text-xs px-3 py-2 rounded mb-4 border border-yellow-200">
          You must log in to continue.
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold text-sm"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="#" className="text-xs text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </div>

        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <a
          href="/signup"
          className="block w-full bg-green-600 hover:bg-green-700 text-white rounded py-2 text-center font-semibold text-sm"
        >
          Create new account
        </a>
      </div>
    </div>
  );
}
