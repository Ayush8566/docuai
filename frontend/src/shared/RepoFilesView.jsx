import React, { useState } from "react";

export default function RepoFilesView({ files = [], onGenerate }) {
  const [selected, setSelected] = useState([]);
  function toggle(f) {
    setSelected((prev) =>
      prev.find((p) => p.path === f.path)
        ? prev.filter((p) => p.path !== f.path)
        : [...prev, f]
    );
  }
  return (
    <div>
      {files.length === 0 ? (
        <div className="text-slate-400">No files loaded</div>
      ) : (
        <div className="space-y-2 max-h-80 overflow-auto">
          {files.map((f) => (
            <div
              key={f.path}
              className="p-2 rounded border border-slate-800 flex justify-between items-center"
            >
              <div>
                <div className="font-mono text-sm">{f.path}</div>
                <div className="text-xs text-slate-400">
                  {(f.code || "").slice(0, 120)}
                  {(f.code || "").length > 120 ? "..." : ""}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <label className="text-sm">
                  <input
                    type="checkbox"
                    checked={!!selected.find((s) => s.path === f.path)}
                    onChange={() => toggle(f)}
                  />{" "}
                  Select
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onGenerate(selected.length ? selected : files, false)}
          className="px-4 py-2 bg-indigo-600 rounded"
        >
          Generate
        </button>
        <button
          onClick={() => onGenerate(selected.length ? selected : files, true)}
          className="px-4 py-2 bg-rose-600 rounded"
        >
          Combine & Generate
        </button>
      </div>
    </div>
  );
}
