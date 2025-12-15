// // frontend/src/shared/RepoUploader.jsx
// import React, { useRef, useState } from "react";
// import axios from "axios";

// export default function RepoUploader({ onFiles }) {
//   const fileRef = useRef();
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [progress, setProgress] = useState(0);
//   const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

//   function handleFileChange() {
//     setErr("");
//     setProgress(0);
//   }

//   async function handleUpload() {
//     const f = fileRef.current?.files?.[0];
//     if (!f) {
//       setErr("Please choose a ZIP file first.");
//       return;
//     }
//     if (!f.name.toLowerCase().endsWith(".zip")) {
//       setErr("Only .zip files are allowed.");
//       return;
//     }

//     const fd = new FormData();
//     // IMPORTANT: field name must match multer's fieldname 'repo'
//     fd.append("repo", f);

//     setErr("");
//     setLoading(true);
//     setProgress(0);

//     try {
//       const res = await axios.post(`${API}/api/upload/repo`, fd, {
//         // DO NOT set a Content-Type header here. Let the browser/axios set it with boundary.
//         onUploadProgress: (p) => {
//           if (p.total) setProgress(Math.round((p.loaded * 100) / p.total));
//         },
//         timeout: 5 * 60 * 1000,
//         validateStatus: () => true,
//       });

//       console.log("UPLOAD RESPONSE:", res);
//       if (res.status >= 200 && res.status < 300) {
//         if (res.data && res.data.docs) {
//           onFiles(res.data.docs);
//           setErr("");
//         } else {
//           setErr("Upload succeeded but server returned no docs.");
//         }
//       } else {
//         const serverMsg =
//           res?.data?.message ||
//           res?.data?.error ||
//           res.statusText ||
//           `HTTP ${res.status}`;
//         setErr(`Upload failed: ${serverMsg}`);
//       }
//     } catch (error) {
//       console.error("XHR ERROR", error);
//       const msg =
//         error?.response?.data?.message ||
//         error?.message ||
//         "Network error - check backend & CORS";
//       setErr(String(msg));
//     } finally {
//       setLoading(false);
//       setTimeout(() => setProgress(0), 700);
//     }
//   }

//   return (
//     <div>
//       <div className="border-dashed border-2 border-slate-800 rounded-xl p-8 text-center">
//         <div className="mb-3">Drop your ZIP file here</div>

//         <input
//           ref={fileRef}
//           type="file"
//           accept=".zip"
//           onChange={handleFileChange}
//           className="mx-auto"
//         />

//         <div className="mt-4 flex gap-3 justify-center">
//           <button
//             onClick={() => fileRef.current && fileRef.current.click()}
//             className="px-6 py-3 btn-cta rounded"
//           >
//             Choose ZIP
//           </button>

//           <button
//             onClick={handleUpload}
//             disabled={loading}
//             className="px-6 py-3 bg-indigo-600 rounded"
//           >
//             {loading ? `Uploading ${progress}%` : "Upload ZIP"}
//           </button>
//         </div>

//         {progress > 0 && (
//           <div className="mt-4">
//             <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
//               <div
//                 style={{ width: `${progress}%` }}
//                 className="h-2 bg-teal-400"
//               />
//             </div>
//             <div className="text-xs text-slate-300 mt-1">{progress}%</div>
//           </div>
//         )}

//         {err && <div className="text-rose-400 mt-3">{err}</div>}
//       </div>
//     </div>
//   );
// }

// frontend/src/shared/RepoUploader.jsx

import React, { useRef, useState } from "react";
import axios from "axios";

export default function RepoUploader({ onFiles }) {
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [progress, setProgress] = useState(0);

  const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

  // ✅ FRONTEND FILE SIZE LIMIT (must match backend)
  const MAX_ZIP_MB = 20;

  function handleFileChange() {
    setErr("");
    setProgress(0);
  }

  async function handleUpload() {
    const file = fileRef.current?.files?.[0];

    if (!file) {
      setErr("Please choose a ZIP file first.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".zip")) {
      setErr("Only .zip files are allowed.");
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_ZIP_MB) {
      setErr(
        `ZIP file too large (${sizeMB.toFixed(
          1
        )}MB). Max allowed is ${MAX_ZIP_MB}MB.`
      );
      return;
    }

    const formData = new FormData();
    formData.append("repo", file); // must match multer field name

    setErr("");
    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.post(`${API}/api/upload/repo`, formData, {
        // ⚠️ DO NOT set Content-Type manually
        onUploadProgress: (evt) => {
          if (evt.total) {
            setProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },

        // ✅ VERY IMPORTANT
        // Prevent browser abort for large ZIP extraction
        timeout: 0,

        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (response.status >= 200 && response.status < 300) {
        if (response.data?.docs) {
          onFiles(response.data.docs);
          setErr("");
        } else {
          setErr("Upload succeeded, but no files were extracted.");
        }
      } else {
        const serverMsg =
          response.data?.message ||
          response.data?.error ||
          `Server error (${response.status})`;

        if (serverMsg.toLowerCase().includes("too many files")) {
          setErr(
            "ZIP has too many files. Please upload source code only (exclude node_modules, dist, build, .git)."
          );
        } else {
          setErr(serverMsg);
        }
      }
    } catch (error) {
      console.error("UPLOAD ERROR:", error);

      if (error.code === "ECONNABORTED") {
        setErr("Upload timed out. Try a smaller ZIP file.");
      } else if (!error.response) {
        setErr(
          "Network error. Backend may have rejected the ZIP or stopped responding."
        );
      } else {
        setErr(error.message || "Upload failed.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 800);
    }
  }

  return (
    <div className="border-dashed border-2 border-slate-800 rounded-xl p-8 text-center">
      <div className="mb-3">Drop your ZIP file here</div>

      <input
        ref={fileRef}
        type="file"
        accept=".zip"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={() => fileRef.current?.click()}
          className="px-6 py-3 btn-cta rounded"
        >
          Choose ZIP
        </button>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="px-6 py-3 bg-indigo-600 rounded disabled:opacity-50"
        >
          {loading ? `Uploading ${progress}%` : "Upload ZIP"}
        </button>
      </div>

      {progress > 0 && (
        <div className="mt-4">
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-teal-400 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-slate-300 mt-1">{progress}%</div>
        </div>
      )}

      {err && <div className="text-rose-400 mt-4">{err}</div>}
    </div>
  );
}
