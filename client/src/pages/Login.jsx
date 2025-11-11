import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.username.trim().length < 3) {
      return setError("Username must be at least 3 characters.");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      await api.post("/auth/login", form);
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center app-bg">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome aboard</h1>
        <p className="text-sm text-slate-400 mb-6">
          Sign in to access your travel journal.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Username</label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-skyaqua text-skydeep font-medium text-sm hover:bg-sky-400 transition"
          >
            Enter the journey
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-400">
          New here?{" "}
          <Link to="/signup" className="text-skyaqua hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}