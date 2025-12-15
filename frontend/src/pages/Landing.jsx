// frontend/src/pages/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, when: "beforeChildren" },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardHover = {
  scale: 1.02,
  y: -6,
  boxShadow: "0 12px 30px rgba(2,8,23,0.45)",
};
const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 6px rgba(45,212,191,0.3)",
      "0 0 18px rgba(45,212,191,0.8)",
      "0 0 6px rgba(45,212,191,0.3)",
    ],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut",
  },
};
export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#071026] to-[#071323] overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* ================= HERO ================= */}
        <motion.section
          className="grid md:grid-cols-2 gap-12 items-center"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Left */}
          <motion.div variants={fadeUp}>
            <motion.h1
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-extrabold leading-tight text-white"
            >
              Generate{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                Beautiful Docs
              </span>{" "}
              From Your Code
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 text-slate-300 max-w-xl text-lg leading-relaxed"
            >
              Transform your codebase into comprehensive, well-structured
              documentation in seconds. Upload a ZIP or import from a GitHub URL
              to get API references, module summaries and diagrams.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex gap-4">
              <Link
                to="/dashboard?mode=upload"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-teal-400 to-cyan-400 text-black font-semibold shadow-lg hover:opacity-95 transition"
              >
                Upload Project
              </Link>

              <Link
                to="/dashboard?mode=github"
                className="px-6 py-3 rounded-lg border border-slate-700 bg-white/5 hover:bg-white/10 transition"
              >
                Connect GitHub
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Preview */}
          <motion.div
            variants={fadeUp}
            whileHover={{ scale: 1.01 }}
            className="card p-6 rounded-2xl border border-slate-800 bg-white/3 h-[260px] flex items-center"
          >
            <div className="w-full">
              <h4 className="text-slate-300 text-sm mb-3">Quick Preview</h4>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -2 }}
                className="bg-[#071226] p-4 rounded-xl border border-slate-800 h-[180px] overflow-auto scrollbar-hide"
              >
                <pre className="text-slate-200 text-sm whitespace-pre-wrap leading-relaxed">
                  {`# UserAuthentication Module

## Overview
Handles login, registration, and session management.

## Methods
- authenticate(credentials)
- logout()
`}
                </pre>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* ================= HOW IT WORKS ================= */}
        <motion.section
          className="mt-28 text-center"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-bold text-white"
          >
            How It <span className="text-teal-300">Works</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-slate-400 mt-2 max-w-2xl mx-auto"
          >
            Four simple steps to transform your codebase into comprehensive
            documentation.
          </motion.p>

          <motion.div
            variants={container}
            className="grid md:grid-cols-4 gap-10 mt-12"
          >
            {[
              {
                icon: "⬆️",
                title: "Upload or Import",
                desc: "Upload a ZIP file or import from a GitHub repository URL.",
              },
              {
                icon: "⚙️",
                title: "AI Analyzes Structure",
                desc: "AST parser + AI understand your codebase.",
              },
              {
                icon: "📄",
                title: "Documentation Generated",
                desc: "Get module summaries, API references and diagrams.",
              },
              {
                icon: "⬇️",
                title: "Export & Share",
                desc: "Download Markdown, HTML, or PDF.",
              },
            ].map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={cardHover}
                className="p-6 rounded-xl bg-white/3 border border-slate-800"
              >
                <div className="w-16 h-16 mx-auto flex items-center justify-center rounded-full bg-white/5 border border-teal-500">
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <h4 className="font-semibold mt-4 text-white">{s.title}</h4>
                <p className="text-slate-400 text-sm mt-2">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ================= FEATURES ================= */}
        <motion.section
          className="mt-28"
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-bold text-center text-white"
          >
            Everything You Need for{" "}
            <span className="text-teal-300">Perfect Docs</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-slate-400 mt-3 max-w-2xl mx-auto text-center"
          >
            From code parsing to export-ready documentation, DocuAI handles the
            entire workflow.
          </motion.p>

          <motion.div
            variants={container}
            className="grid md:grid-cols-3 gap-6 mt-14"
          >
            {/* Code Analysis */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover}
              className="p-6 rounded-xl bg-white/3 border border-slate-800"
            >
              <h4 className="font-semibold text-white">Code Analysis</h4>
              <p className="text-slate-400 text-sm mt-2">
                Parses your codebase using AST to understand structure,
                functions, classes, and relationships.
              </p>
            </motion.div>

            {/* AI Generation */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover}
              className="p-6 rounded-xl bg-white/3 border border-slate-800"
            >
              <h4 className="font-semibold text-white">
                AI-Powered Generation
              </h4>
              <p className="text-slate-400 text-sm mt-2">
                Leverages AI to generate human-readable, structured
                documentation instantly.
              </p>
            </motion.div>

            {/* GitHub */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover}
              className="p-6 rounded-xl bg-white/3 border border-slate-800"
            >
              <h4 className="font-semibold text-white">GitHub Integration</h4>
              <p className="text-slate-400 text-sm mt-2">
                Import repositories directly and keep documentation in sync with
                your code.
              </p>
            </motion.div>

            {/* Architecture – Coming Soon */}
            <motion.div
              variants={fadeUp}
              className="p-6 rounded-xl bg-white/3 border border-teal-500/50 relative"
            >
              {/* ✅ ONLY THIS SPAN IS ANIMATED */}
              <motion.span
                {...glowPulse}
                className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full
                bg-teal-500/20 text-teal-300 border border-teal-500"
              >
                Coming Soon
              </motion.span>

              <h4 className="font-semibold text-white">
                Architecture Diagrams
              </h4>
              <p className="text-slate-400 text-sm mt-2">
                Auto-generated system and dependency diagrams for better
                understanding.
              </p>
            </motion.div>

            {/* Formats */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover}
              className="p-6 rounded-xl bg-white/3 border border-slate-800"
            >
              <h4 className="font-semibold text-white">Multiple Formats</h4>
              <p className="text-slate-400 text-sm mt-2">
                Export to Markdown, HTML, or PDF — perfect for READMEs and
                wikis.
              </p>
            </motion.div>

            {/* Security */}
            <motion.div
              variants={fadeUp}
              whileHover={cardHover}
              className="p-6 rounded-xl bg-white/3 border border-slate-800"
            >
              <h4 className="font-semibold text-white">Secure Processing</h4>
              <p className="text-slate-400 text-sm mt-2">
                Enterprise-grade security ensures your code stays protected.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          className="mt-32"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="rounded-3xl bg-gradient-to-r from-teal-500/30 to-cyan-500/10 p-14 text-center">
            <h2 className="text-4xl font-bold text-white">
              Ready to Automate Your{" "}
              <span className="text-teal-300">Documentation?</span>
            </h2>

            <p className="text-slate-300 mt-4 max-w-2xl mx-auto">
              Join thousands of developers who save hours every week with
              AI-generated documentation.
            </p>

            <Link
              to="/dashboard"
              className="inline-block mt-8 px-8 py-4 rounded-xl
              bg-gradient-to-r from-teal-400 to-cyan-400
              text-black font-semibold shadow-xl hover:opacity-95 transition"
            >
              Start Documenting Free →
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
