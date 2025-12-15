import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ FIX
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });

      login(res.data.user, res.data.token);

      console.log("login success");
      navigate("/", { replace: true }); // ✅ NOW WORKS
    } catch (e) {
      setErr(e?.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-1">Welcome back 👋</h2>

        <a
          href={`${API}/api/auth/google`}
          className="w-full flex items-center justify-center gap-3 border border-slate-700 rounded-lg py-2 text-sm text-white hover:bg-slate-800 transition mb-4"
        >
          Continue with Google
        </a>

        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />

          {err && <p className="text-rose-400 text-sm">{err}</p>}

          <button
            disabled={loading}
            className="w-full py-2 rounded-lg bg-teal-500 text-black font-semibold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-teal-400">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
