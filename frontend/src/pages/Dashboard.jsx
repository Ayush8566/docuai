// import React, { useState, useRef } from "react";
// import RepoUploaderFetch from "../shared/RepoUploaderFetch";
// import RepoFilesView from "../shared/RepoFilesView";

// export default function Dashboard() {
//   const [files, setFiles] = useState([]);
//   const [docs, setDocs] = useState("// generated docs");
//   const [loading, setLoading] = useState(false);

//   // upload state
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [uploadType, setUploadType] = useState(""); // success | error | info
//   const [uploadSuccess, setUploadSuccess] = useState(false);

//   // github
//   const [githubUrl, setGithubUrl] = useState("");

//   const docsRef = useRef("");

//   /* ===================== UPLOAD SUCCESS ===================== */
//   function handleFilesUploaded(docsArr) {
//     if (!Array.isArray(docsArr)) {
//       setUploadStatus("Upload failed");
//       setUploadType("error");
//       setUploadSuccess(false);
//       return;
//     }

//     setFiles(docsArr);
//     setUploadStatus(`Uploaded successfully (${docsArr.length} files)`);
//     setUploadType("success");
//     setUploadSuccess(true);
//   }

//   /* ===================== GITHUB IMPORT ===================== */
//   async function importFromGithub() {
//     if (!githubUrl.includes("github.com")) {
//       setUploadStatus("Invalid GitHub URL");
//       setUploadType("error");
//       return;
//     }

//     try {
//       setUploadStatus("Importing from GitHub...");
//       setUploadType("info");

//       const resp = await fetch(
//         `${
//           import.meta.env.VITE_API_URL || "http://localhost:4000"
//         }/api/github/import`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ repoUrl: githubUrl }),
//         }
//       );

//       if (!resp.ok) {
//         const msg = await resp.text();
//         throw new Error(msg || "GitHub import failed");
//       }

//       const blob = await resp.blob();

//       const formData = new FormData();
//       formData.append("repo", blob, "repo.zip");

//       const uploadResp = await fetch(
//         `${
//           import.meta.env.VITE_API_URL || "http://localhost:4000"
//         }/api/upload/repo`,
//         { method: "POST", body: formData }
//       );

//       const data = await uploadResp.json();
//       if (!uploadResp.ok || !data.success) {
//         throw new Error(data?.message || "Upload failed");
//       }

//       handleFilesUploaded(data.docs);
//     } catch (err) {
//       console.error(err);
//       setUploadStatus(err.message || "GitHub import failed");
//       setUploadType("error");
//       setUploadSuccess(false);
//     }
//   }

//   /* ===================== GENERATE DOCS ===================== */
//   async function handleGenerate(selectedFiles) {
//     if (!uploadSuccess || selectedFiles.length === 0) return;

//     setLoading(true);
//     setDocs("");
//     docsRef.current = "";

//     try {
//       const payload = selectedFiles.map((f) => ({
//         path: f.path,
//         code: f.code,
//       }));

//       const resp = await fetch(
//         `${
//           import.meta.env.VITE_API_URL || "http://localhost:4000"
//         }/api/docs/generate`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ repoSummary: payload }),
//         }
//       );

//       const data = await resp.json();
//       const generated = data.documentation || "// no docs";

//       // show in dashboard
//       setDocs(generated);
//       docsRef.current = generated;

//       // ✅ SAVE TO HISTORY (for Documentation page)
//       const prev = JSON.parse(localStorage.getItem("history") || "[]");
//       const newItem = {
//         id: Date.now(),
//         files: payload.map((p) => p.path),
//         snippet: generated.slice(0, 300),
//         documentation: generated,
//       };
//       localStorage.setItem("history", JSON.stringify([newItem, ...prev]));

//       setUploadStatus("Documentation generated");
//       setUploadType("success");
//     } catch (err) {
//       console.error(err);
//       setDocs("// generation failed");
//       setUploadStatus("Generation failed");
//       setUploadType("error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ===================== UI ===================== */
//   return (
//     <main className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

//       {/* UPLOAD */}
//       <div className="card p-6 rounded-xl mb-6">
//         <RepoUploaderFetch
//           onFiles={handleFilesUploaded}
//           onStatus={(msg, type) => {
//             setUploadStatus(msg);
//             setUploadType(type);
//             if (type === "error") setUploadSuccess(false);
//           }}
//         />

//         {uploadStatus && (
//           <div
//             className={`mt-3 flex items-center gap-2 text-sm font-medium ${
//               uploadType === "success"
//                 ? "text-green-400"
//                 : uploadType === "error"
//                 ? "text-rose-400"
//                 : "text-slate-300"
//             }`}
//           >
//             {uploadType === "success" && (
//               <span className="w-5 h-5 bg-green-500 text-black rounded-full flex items-center justify-center animate-pulse">
//                 ✓
//               </span>
//             )}
//             {uploadStatus}
//           </div>
//         )}
//       </div>

//       {/* GITHUB IMPORT */}
//       <div className="card p-4 rounded-xl mb-6">
//         <h4 className="font-semibold mb-2">Import from GitHub</h4>
//         <div className="flex gap-2">
//           <input
//             value={githubUrl}
//             onChange={(e) => setGithubUrl(e.target.value)}
//             placeholder="https://github.com/user/repo"
//             className="flex-1 p-2 rounded border bg-transparent"
//           />
//           <button
//             onClick={importFromGithub}
//             className="px-4 py-2 bg-indigo-600 rounded"
//           >
//             Import
//           </button>
//         </div>
//       </div>

//       {/* FILES + DOCS */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="card p-4 rounded-xl">
//           <h4 className="font-semibold mb-3">Files</h4>
//           <RepoFilesView
//             files={files}
//             onGenerate={handleGenerate}
//             disabled={!uploadSuccess}
//           />
//         </div>

//         <div className="md:col-span-2 card p-4 rounded-xl">
//           <h4 className="font-semibold mb-2">Generated Documentation</h4>
//           <textarea
//             className="w-full h-72 bg-transparent p-4 text-sm"
//             value={docs}
//             readOnly
//           />
//           <div className="mt-2 text-sm text-slate-400">
//             {loading ? "Generating..." : "Ready"}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// frontend/src/pages/Dashboard.jsx
// frontend/src/pages/Dashboard.jsx
// import React, { useState, useRef } from "react";
// import RepoUploaderFetch from "../shared/RepoUploaderFetch";
// import RepoFilesView from "../shared/RepoFilesView";

// export default function Dashboard() {
//   const [files, setFiles] = useState([]);
//   const [docs, setDocs] = useState("// generated docs");
//   const [loading, setLoading] = useState(false);

//   // upload state
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [uploadType, setUploadType] = useState(""); // success | error | info
//   const [uploadSuccess, setUploadSuccess] = useState(false);

//   const docsRef = useRef("");

//   /* ===================== UPLOAD ===================== */
//   function handleFilesUploaded(docsArr) {
//     if (!Array.isArray(docsArr)) {
//       setUploadStatus("Upload returned unexpected data");
//       setUploadType("error");
//       setUploadSuccess(false);
//       return;
//     }
//     setFiles(docsArr);
//     setUploadStatus(`Uploaded successfully (${docsArr.length} files)`);
//     setUploadType("success");
//     setUploadSuccess(true);
//   }

//   /* ===================== GENERATE DOCS ===================== */
//   async function handleGenerate(selectedFiles) {
//     if (!uploadSuccess) return;

//     setLoading(true);
//     setDocs("");

//     try {
//       const payload = selectedFiles.map((f) => ({
//         path: f.path,
//         code: f.code,
//       }));

//       const url = `${
//         import.meta.env.VITE_API_URL || "http://localhost:4000"
//       }/api/docs/generate`;

//       const resp = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ repoSummary: payload }),
//       });

//       const data = await resp.json();

//       if (!resp.ok) {
//         setDocs("// Generation failed");
//         setUploadStatus("Documentation generation failed");
//         setUploadType("error");
//         return;
//       }

//       setDocs(data.documentation || "// (no documentation returned)");
//       setUploadStatus("Documentation generated successfully");
//       setUploadType("success");
//     } catch (err) {
//       console.error("generate error", err);
//       setDocs("// Generation failed");
//       setUploadStatus("Generation failed");
//       setUploadType("error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ===================== DOWNLOAD ===================== */
//   function downloadDocs() {
//     if (!docs || docs.startsWith("//")) return;

//     const blob = new Blob([docs], { type: "text/markdown;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "documentation.md";
//     a.click();

//     URL.revokeObjectURL(url);
//   }

//   function clearDocs() {
//     setDocs("// generated docs");
//     setUploadStatus("Ready to upload");
//     setUploadType("success");
//     setUploadSuccess(false);
//     setFiles([]);
//   }

//   /* ===================== UI ===================== */
//   return (
//     <main className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

//       {/* ===================== UPLOAD CARD ===================== */}
//       <div className="card p-6 rounded-xl mb-6">
//         <RepoUploaderFetch
//           onFiles={handleFilesUploaded}
//           onStatus={(msg, type) => {
//             setUploadStatus(msg);
//             setUploadType(type);
//             if (type !== "success") setUploadSuccess(false);
//           }}
//         />

//         {uploadStatus && (
//           <div
//             className={`mt-3 flex items-center gap-2 text-sm font-medium ${
//               uploadType === "success"
//                 ? "text-green-400"
//                 : uploadType === "error"
//                 ? "text-rose-400"
//                 : "text-slate-300"
//             }`}
//           >
//             {uploadType === "success" && (
//               <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-black animate-pulse">
//                 ✓
//               </span>
//             )}
//             {uploadStatus}
//           </div>
//         )}
//       </div>

//       {/* ===================== MAIN CONTENT ===================== */}
//       <div className="grid md:grid-cols-3 gap-6">
//         {/* FILES */}
//         <div className="md:col-span-1 card p-4 rounded-xl">
//           <h4 className="font-semibold mb-3">Files</h4>
//           <RepoFilesView
//             files={files}
//             onGenerate={(selected) => handleGenerate(selected)}
//             disabled={!uploadSuccess} // 🔒 disabled until upload success
//           />
//           {!uploadSuccess && (
//             <p className="text-xs text-slate-400 mt-2">
//               Upload a repository to enable generation
//             </p>
//           )}
//         </div>

//         {/* DOCS */}
//         <div className="md:col-span-2 space-y-4">
//           <div className="card p-4 rounded-xl">
//             <div className="flex items-center justify-between mb-2">
//               <h4 className="font-semibold">Generated Documentation</h4>
//               <div className="flex gap-2">
//                 <button
//                   onClick={downloadDocs}
//                   disabled={!docs || docs.startsWith("//")}
//                   className="px-3 py-1 border rounded text-sm disabled:opacity-40"
//                 >
//                   Download .md
//                 </button>
//                 <button
//                   onClick={clearDocs}
//                   className="px-3 py-1 border rounded text-sm"
//                 >
//                   Clear
//                 </button>
//               </div>
//             </div>

//             <textarea
//               className="w-full h-72 bg-transparent p-4 text-sm"
//               value={docs}
//               readOnly
//             />

//             <div className="mt-2 text-sm text-slate-400">
//               {loading ? "Generating..." : "Ready"}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// import React, { useState, useRef } from "react";
// import RepoUploaderFetch from "../shared/RepoUploaderFetch";
// import RepoFilesView from "../shared/RepoFilesView";

// export default function Dashboard() {
//   const [files, setFiles] = useState([]);
//   const [docs, setDocs] = useState("// generated docs");
//   const [loading, setLoading] = useState(false);

//   const [uploadStatus, setUploadStatus] = useState("");
//   const [uploadType, setUploadType] = useState("");
//   const [uploadSuccess, setUploadSuccess] = useState(false);

//   const [githubUrl, setGithubUrl] = useState("");

//   const docsRef = useRef("");

//   /* ===================== UPLOAD SUCCESS ===================== */
//   function handleFilesUploaded(docsArr) {
//     if (!Array.isArray(docsArr)) {
//       setUploadStatus("Upload failed");
//       setUploadType("error");
//       setUploadSuccess(false);
//       return;
//     }

//     setFiles(docsArr);
//     setUploadStatus(`Uploaded successfully (${docsArr.length} files)`);
//     setUploadType("success");
//     setUploadSuccess(true);
//   }

//   /* ===================== GITHUB IMPORT ===================== */
//   async function importFromGithub() {
//     if (!githubUrl.includes("github.com")) {
//       setUploadStatus("Invalid GitHub URL");
//       setUploadType("error");
//       return;
//     }

//     try {
//       setUploadStatus("Importing from GitHub...");
//       setUploadType("info");

//       const resp = await fetch(
//         `${
//           import.meta.env.VITE_API_URL || "http://localhost:4000"
//         }/api/github/import`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ repoUrl: githubUrl }),
//         }
//       );

//       if (!resp.ok) {
//         const msg = await resp.text();
//         throw new Error(msg || "GitHub import failed");
//       }

//       const blob = await resp.blob();

//       const formData = new FormData();
//       formData.append("repo", blob, "repo.zip");

//       const uploadResp = await fetch(
//         `${
//           import.meta.env.VITE_API_URL || "http://localhost:4000"
//         }/api/upload/repo`,
//         { method: "POST", body: formData }
//       );

//       const data = await uploadResp.json();
//       if (!uploadResp.ok || !data.success) {
//         throw new Error(data?.message || "Upload failed");
//       }

//       handleFilesUploaded(data.docs);
//     } catch (err) {
//       console.error(err);
//       setUploadStatus(err.message || "GitHub import failed");
//       setUploadType("error");
//       setUploadSuccess(false);
//     }
//   }

//   /* ===================== GENERATE DOCS ===================== */
//   async function handleGenerate(selectedFiles) {
//     if (!uploadSuccess || selectedFiles.length === 0) return;

//     setLoading(true);
//     setDocs("");
//     docsRef.current = "";

//     try {
//       const payload = selectedFiles.map((f) => ({
//         path: f.path,
//         code: f.code,
//       }));

//       // ✅ FIX: SEND TOKEN
//       const token = localStorage.getItem("token");
//       if (!token) throw new Error("Not authenticated");

//       const resp = await fetch(
//         `${
//           import.meta.env.VITE_API_URL || "http://localhost:4000"
//         }/api/docs/generate`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // 🔥 REQUIRED
//           },
//           body: JSON.stringify({ repoSummary: payload }),
//         }
//       );

//       if (!resp.ok) {
//         const txt = await resp.text();
//         throw new Error(txt || "Failed to generate docs");
//       }

//       const data = await resp.json();
//       const generated = data.documentation || "// no docs";

//       setDocs(generated);
//       docsRef.current = generated;

//       // ✅ SAVE TO HISTORY
//       const prev = JSON.parse(localStorage.getItem("history") || "[]");
//       const newItem = {
//         id: Date.now(),
//         files: payload.map((p) => p.path),
//         snippet: generated.slice(0, 300),
//         documentation: generated,
//       };
//       localStorage.setItem("history", JSON.stringify([newItem, ...prev]));

//       setUploadStatus("Documentation generated");
//       setUploadType("success");
//     } catch (err) {
//       console.error(err);
//       setDocs("// generation failed");
//       setUploadStatus(err.message || "Generation failed");
//       setUploadType("error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /* ===================== UI (UNCHANGED) ===================== */
//   return (
//     <main className="max-w-6xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

//       {/* UPLOAD */}
//       <div className="card p-6 rounded-xl mb-6">
//         <RepoUploaderFetch
//           onFiles={handleFilesUploaded}
//           onStatus={(msg, type) => {
//             setUploadStatus(msg);
//             setUploadType(type);
//             if (type === "error") setUploadSuccess(false);
//           }}
//         />

//         {uploadStatus && (
//           <div
//             className={`mt-3 flex items-center gap-2 text-sm font-medium ${
//               uploadType === "success"
//                 ? "text-green-400"
//                 : uploadType === "error"
//                 ? "text-rose-400"
//                 : "text-slate-300"
//             }`}
//           >
//             {uploadType === "success" && (
//               <span className="w-5 h-5 bg-green-500 text-black rounded-full flex items-center justify-center animate-pulse">
//                 ✓
//               </span>
//             )}
//             {uploadStatus}
//           </div>
//         )}
//       </div>

//       {/* GITHUB IMPORT */}
//       <div className="card p-4 rounded-xl mb-6">
//         <h4 className="font-semibold mb-2">Import from GitHub</h4>
//         <div className="flex gap-2">
//           <input
//             value={githubUrl}
//             onChange={(e) => setGithubUrl(e.target.value)}
//             placeholder="https://github.com/user/repo"
//             className="flex-1 p-2 rounded border bg-transparent"
//           />
//           <button
//             onClick={importFromGithub}
//             className="px-4 py-2 bg-indigo-600 rounded"
//           >
//             Import
//           </button>
//         </div>
//       </div>

//       {/* FILES + DOCS */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <div className="card p-4 rounded-xl">
//           <h4 className="font-semibold mb-3">Files</h4>
//           <RepoFilesView
//             files={files}
//             onGenerate={handleGenerate}
//             disabled={!uploadSuccess}
//           />
//         </div>

//         <div className="md:col-span-2 card p-4 rounded-xl">
//           <h4 className="font-semibold mb-2">Generated Documentation</h4>
//           <textarea
//             className="w-full h-72 bg-transparent p-4 text-sm"
//             value={docs}
//             readOnly
//           />
//           <div className="mt-2 text-sm text-slate-400">
//             {loading ? "Generating..." : "Ready"}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }
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

  /* ===================== UPLOAD SUCCESS ===================== */
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

  /* ===================== GITHUB IMPORT ===================== */
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
          import.meta.env.VITE_API_URL || "http://localhost:4000"
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

  /* ===================== GENERATE DOCS ===================== */
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
          import.meta.env.VITE_API_URL || "http://localhost:4000"
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

  /* ===================== UI ===================== */
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

      {/* GITHUB IMPORT */}
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
