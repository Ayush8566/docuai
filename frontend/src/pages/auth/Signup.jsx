// // frontend/src/pages/auth/Signup.jsx
// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../../api/api";
// import { useAuth } from "../../context/AuthProvider";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState("");
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   async function submit(e) {
//     e.preventDefault();
//     setErr("");
//     try {
//       const res = await api.post("/api/auth/signup", { name, email, password });
//       if (res.data && res.data.token) {
//         login(res.data.user, res.data.token);
//         localStorage.setItem("token", res.data.token);
//         navigate("/dashboard");
//       } else {
//         setErr("Signup failed");
//       }
//     } catch (err) {
//       setErr(err?.response?.data?.message || err.message || "Signup failed");
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="card p-8 rounded-2xl w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-4">Create an account</h2>
//         <form onSubmit={submit} className="space-y-4">
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="Full name"
//             className="w-full p-2 rounded bg-slate-800 border border-slate-700"
//           />
//           <input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//             className="w-full p-2 rounded bg-slate-800 border border-slate-700"
//           />
//           <input
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             type="password"
//             placeholder="Password"
//             className="w-full p-2 rounded bg-slate-800 border border-slate-700"
//           />
//           {err && <div className="text-rose-400">{err}</div>}
//           <button className="w-full bg-teal-500 text-black p-2 rounded">
//             Sign up
//           </button>
//         </form>
//         <p className="mt-4 text-sm">
//           Already have an account?{" "}
//           <Link to="/login" className="text-teal-300">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// frontend/src/pages/auth/Signup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ FIX
import { motion } from "framer-motion";
import api from "../../api/api";
import { useAuth } from "../../context/AuthProvider";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate(); // ✅ FIX

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");

    try {
      const res = await api.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      // save auth
      login(res.data.user, res.data.token);

      console.log("✅ Signup successful");

      // ✅ REDIRECT TO LANDING PAGE
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/60 backdrop-blur border border-slate-800 rounded-2xl p-8 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-1">
          Create your account ✨
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          Start generating documentation with AI
        </p>

        {/* GOOGLE SIGNUP */}
        <a
          href={`${API}/api/auth/google`}
          className="w-full flex items-center justify-center gap-3 border border-slate-700 rounded-lg py-2 text-sm text-white hover:bg-slate-800 transition mb-4"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Sign up with Google
        </a>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-slate-700" />
          <span className="text-xs text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-700" />
        </div>

        {/* EMAIL SIGNUP */}
        <form onSubmit={submit} className="space-y-4">
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white"
          />
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

          <button className="w-full py-2 rounded-lg bg-teal-500 text-black font-semibold hover:bg-teal-400 transition">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
