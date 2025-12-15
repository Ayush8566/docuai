// frontend/src/shared/RepoUploaderFetch.jsx
import React, { useRef, useState } from "react";

export default function RepoUploaderFetch({ onFiles, onProgress, onStatus }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  function chooseFile() {
    fileRef.current?.click();
  }

  async function upload() {
    const file = fileRef.current?.files?.[0];

    if (!file) {
      onStatus?.("Choose a ZIP file first.", "error");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      onStatus?.("Only .zip files are allowed.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("repo", file); // must match upload.single("repo")

    setLoading(true);
    onProgress?.(0);
    onStatus?.("Uploading…", "info");

    try {
      const response = await fetch(`${API}/api/upload/repo`, {
        method: "POST",
        body: formData,
      });

      // Fetch does not give upload progress events,
      // so we simulate progress completion on success
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const msg =
          data?.message ||
          data?.error ||
          response.statusText ||
          `HTTP ${response.status}`;
        onStatus?.(`Upload failed: ${msg}`, "error");
        setLoading(false);
        return;
      }

      if (data?.success && Array.isArray(data.docs)) {
        onProgress?.(100);
        onStatus?.("Uploaded OK", "success");
        onFiles?.(data.docs);
      } else if (data?.success) {
        onProgress?.(100);
        onStatus?.("Uploaded but no docs returned", "info");
      } else {
        onStatus?.("Upload failed: unexpected server response", "error");
      }
    } catch (err) {
      console.error("fetch upload error", err);
      onStatus?.(
        "Network error. Backend may have stopped responding.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-dashed border-2 border-slate-800 rounded-xl p-8 text-center">
      <input
        ref={fileRef}
        type="file"
        accept=".zip"
        hidden
        onChange={() => {
          onStatus?.("Ready to upload", "info");
          onProgress?.(0);
        }}
      />

      <div className="mb-3">Drop your ZIP file here</div>

      <div className="mt-4 flex gap-3 justify-center">
        <button
          onClick={chooseFile}
          className="px-6 py-3 btn-cta rounded"
          disabled={loading}
        >
          Choose ZIP
        </button>

        <button
          onClick={upload}
          className="px-6 py-3 bg-indigo-600 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Uploading…" : "Upload ZIP"}
        </button>
      </div>
    </div>
  );
}
