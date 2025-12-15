import React, { useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import RepoUploaderFetch from "../shared/RepoUploaderFetch";
import RepoFilesView from "../shared/RepoFilesView";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "upload"; // upload | github

  const [files, setFiles] = useState([]);
  const [docs, setDocs] = useState("// generated docs");
  const [loading, setLoading] = useState(false);

  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadType, setUploadType] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [githubUrl, setGithubUrl] = useState("");

  const docsRef = useRef("");

  function handleFilesUploaded(docsArr) {
    if (!Array.isArray(docsArr)) {
      setUploadStatus("Upload failed");
      setUploadType("error");
      setUploadSuccess(false);
      return;
    }

    setFiles(docsArr);
    setUploadStatus(`Uploaded successfully (${docsArr.length} files)`);
    setUploadType("success");
    setUploadSuccess(true);
  }


  async function importFromGithub() {
    if (!githubUrl.includes("github.com")) {
      setUploadStatus("Invalid GitHub URL");
      setUploadType("error");
      return;
    }

    try {
      setUploadStatus("Importing from GitHub...");
      setUploadType("info");

      const resp = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4000"
        }/api/github/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoUrl: githubUrl }),
        }
      );

      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || "GitHub import failed");
      }

      const blob = await resp.blob();

      const formData = new FormData();
      formData.append("repo", blob, "repo.zip");

      const uploadResp = await fetch(
        `${
          import.meta.env.VITE_API_URL 
        }/api/upload/repo`,
        { method: "POST", body: formData }
      );

      const data = await uploadResp.json();
      if (!uploadResp.ok || !data.success) {
        throw new Error(data?.message || "Upload failed");
      }

      handleFilesUploaded(data.docs);
    } catch (err) {
      console.error(err);
      setUploadStatus(err.message || "GitHub import failed");
      setUploadType("error");
      setUploadSuccess(false);
    }
  }


  async function handleGenerate(selectedFiles) {
    if (!uploadSuccess || selectedFiles.length === 0) return;

    setLoading(true);
    setDocs("");
    docsRef.current = "";

    try {
      const payload = selectedFiles.map((f) => ({
        path: f.path,
        code: f.code,
      }));

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const resp = await fetch(
        `${
          import.meta.env.VITE_API_URL 
        }/api/docs/generate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ repoSummary: payload }),
        }
      );

      if (!resp.ok) {
        const t = await resp.text();
        throw new Error(t || "Generation failed");
      }

      const data = await resp.json();
      const generated = data.documentation || "// no docs";

      setDocs(generated);
      docsRef.current = generated;

      // save history
      const prev = JSON.parse(localStorage.getItem("history") || "[]");
      const newItem = {
        id: Date.now(),
        files: payload.map((p) => p.path),
        snippet: generated.slice(0, 300),
        documentation: generated,
      };
      localStorage.setItem("history", JSON.stringify([newItem, ...prev]));

      setUploadStatus("Documentation generated");
      setUploadType("success");
    } catch (err) {
      console.error(err);
      setDocs("// generation failed");
      setUploadStatus(err.message || "Generation failed");
      setUploadType("error");
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* ZIP UPLOAD (default) */}
      {mode === "upload" && (
        <div className="card p-6 rounded-xl mb-6">
          <RepoUploaderFetch
            onFiles={handleFilesUploaded}
            onStatus={(msg, type) => {
              setUploadStatus(msg);
              setUploadType(type);
              if (type === "error") setUploadSuccess(false);
            }}
          />

          {uploadStatus && (
            <div
              className={`mt-3 text-sm font-medium ${
                uploadType === "success"
                  ? "text-green-400"
                  : uploadType === "error"
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {uploadStatus}
            </div>
          )}
        </div>
      )}

  
      {mode === "github" && (
        <div className="card p-4 rounded-xl mb-6">
          <h4 className="font-semibold mb-2">Import from GitHub</h4>
          <div className="flex gap-2">
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="flex-1 p-2 rounded border bg-transparent"
            />
            <button
              onClick={importFromGithub}
              className="px-4 py-2 bg-indigo-600 rounded"
            >
              Import
            </button>
          </div>
        </div>
      )}

      {/* FILES + DOCS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card p-4 rounded-xl">
          <h4 className="font-semibold mb-3">Files</h4>
          <RepoFilesView
            files={files}
            onGenerate={handleGenerate}
            disabled={!uploadSuccess}
          />
        </div>

        <div className="md:col-span-2 card p-4 rounded-xl">
          <h4 className="font-semibold mb-2">Generated Documentation</h4>
          <textarea
            className="w-full h-72 bg-transparent p-4 text-sm"
            value={docs}
            readOnly
          />
          <div className="mt-2 text-sm text-slate-400">
            {loading ? "Generating..." : "Ready"}
          </div>
        </div>
      </div>
    </main>
  );
}
