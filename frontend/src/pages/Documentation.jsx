// frontend/src/pages/Documentation.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css"; // highlight.js stylesheet

export default function Documentation() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fullText, setFullText] = useState("");
  const [copied, setCopied] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(h);
  }, []);

  useEffect(() => {
    if (!id) {
      setSelected(null);
      setFullText("");
      return;
    }
    const h = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(h);
    const foundById = h.find((it) => String(it.id) === String(id));
    if (foundById) {
      setSelected(foundById);
      setFullText(foundById.documentation || foundById.snippet || "");
      return;
    }
    const foundByFile = h.find(
      (it) => Array.isArray(it.files) && it.files.some((f) => f.includes(id))
    );
    if (foundByFile) {
      setSelected(foundByFile);
      setFullText(foundByFile.documentation || foundByFile.snippet || "");
      return;
    }
    setSelected(null);
    setFullText("");
  }, [id]);

  function openItem(it) {
    navigate(`/doc/${it.id}`);
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(
        fullText || selected?.documentation || selected?.snippet || ""
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  }

  function downloadMarkdown(text, filename = "documentation") {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename.replace(/[/\\]/g, "_")}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // POST all docs to backend to create zip and download it
  async function downloadAllZip() {
    if (!history || history.length === 0) return;
    // Prepare docs: each item { filename, text }
    const docs = history.map((h, idx) => {
      const filename =
        (Array.isArray(h.files) ? h.files[0] : h.files) ||
        `doc-${idx}-${h.id}` ||
        `doc-${idx}`;
      const text = h.documentation || h.snippet || "";
      return { filename: filename.replace(/[/\\]/g, "_") + ".md", text };
    });

    try {
      const resp = await fetch(`${API_BASE}/api/docs/download-zip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docs }),
      });

      if (!resp.ok) {
        const errText = await resp.text().catch(() => "");
        throw new Error(errText || "Failed to create zip");
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `docs-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("download zip error", err);
      alert("Failed to download zip: " + err.message);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-8 min-h-[70vh]">
      <h1 className="text-3xl font-bold text-white mb-6">Documentation</h1>

      <div className="flex items-center justify-end gap-3 mb-4">
        <button
          onClick={downloadAllZip}
          className="px-4 py-2 bg-teal-500 text-black rounded font-semibold"
          title="Download all saved docs as a ZIP"
        >
          Download all (.zip)
        </button>
        <Link
          to="/dashboard"
          className="px-4 py-2 border border-slate-700 rounded text-slate-200"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Left: list */}
        <aside className="md:col-span-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Docs</h3>
            <button
              className="text-sm text-slate-400 hover:text-white"
              onClick={() => {
                localStorage.removeItem("history");
                setHistory([]);
                setSelected(null);
                setFullText("");
                navigate("/documentation");
              }}
              title="Clear history"
            >
              Clear
            </button>
          </div>

          {history.length === 0 ? (
            <div className="text-slate-400 text-sm">
              No docs yet. Generate docs from the Dashboard.
            </div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
              {history.map((h) => (
                <div
                  key={h.id}
                  className={`p-3 rounded-lg border ${
                    selected && selected.id === h.id
                      ? "border-teal-400 bg-slate-800/60"
                      : "border-slate-800 hover:border-slate-700"
                  } cursor-pointer transition`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-sm text-teal-300">
                      {Array.isArray(h.files) ? h.files[0] : h.files}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(h.id).toLocaleString()}
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 mt-2 line-clamp-3">
                    {h.snippet || "No content"}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => openItem(h)}
                      className="text-sm px-3 py-1 bg-teal-500 text-black rounded"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        setSelected(h);
                        setFullText(h.documentation || h.snippet || "");
                        navigate(`/doc/${h.id}`);
                      }}
                      className="text-sm px-3 py-1 border rounded border-slate-700 text-slate-200"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        downloadMarkdown(
                          h.documentation || h.snippet || "",
                          (Array.isArray(h.files) ? h.files[0] : h.files) ||
                            `doc-${h.id}`
                        )
                      }
                      className="text-sm px-3 py-1 border rounded border-slate-700 text-slate-200"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Right: viewer */}
        <section className="md:col-span-3 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 min-h-[40vh]">
          {!selected ? (
            <div className="p-6 rounded-lg bg-slate-800/30 border border-slate-800">
              <div className="text-slate-300">
                <strong># Example Documentation</strong>
                <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-200 bg-transparent p-2 rounded">
                  {`# Example Documentation

This is where generated docs appear. Generate documentation from Dashboard → Upload ZIP → Generate.`}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm text-teal-300 font-mono">
                    {Array.isArray(selected.files)
                      ? selected.files.join(", ")
                      : selected.files}
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-2">
                    Documentation Preview
                  </h2>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(selected.id).toLocaleString()}
                  </div>
                </div>

                <div className="flex gap-2 items-center">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 bg-slate-700 border border-slate-600 rounded text-sm"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() =>
                      downloadMarkdown(
                        fullText ||
                          selected.documentation ||
                          selected.snippet ||
                          "",
                        (Array.isArray(selected.files)
                          ? selected.files[0]
                          : selected.files) || `doc-${selected.id}`
                      )
                    }
                    className="px-3 py-1 bg-teal-500 text-black rounded text-sm"
                  >
                    Download .md
                  </button>
                </div>
              </div>

              <div className="prose max-w-none prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {fullText || selected.documentation || selected.snippet || ""}
                </ReactMarkdown>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
