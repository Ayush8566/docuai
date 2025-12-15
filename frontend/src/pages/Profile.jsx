// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

// export default function Profile() {
//   const [user, setUser] = useState(() =>
//     JSON.parse(localStorage.getItem("user") || "{}")
//   );
//   const [history, setHistory] = useState([]);
//   const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || "");

//   useEffect(() => {
//     setHistory(JSON.parse(localStorage.getItem("history") || "[]"));
//   }, []);

//   function save(e) {
//     e.preventDefault();
//     const fd = new FormData(e.target);

//     const updated = {
//       name: fd.get("name"),
//       email: fd.get("email"),
//     };

//     // Save avatar if uploaded
//     if (avatar) updated.avatar = avatar;

//     localStorage.setItem("user", JSON.stringify(updated));
//     localStorage.setItem("avatar", avatar);
//     setUser(updated);
//   }

//   function handleAvatarUpload(e) {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = () => {
//       setAvatar(reader.result);
//       localStorage.setItem("avatar", reader.result);
//     };
//     reader.readAsDataURL(file);
//   }

//   return (
//     <main className="max-w-6xl mx-auto p-8">
//       <motion.h2
//         className="text-3xl font-bold mb-8 text-white"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//       >
//         Profile
//       </motion.h2>

//       <div className="grid md:grid-cols-2 gap-10">
//         {/* LEFT SECTION — USER INFO */}
//         <motion.form
//           onSubmit={save}
//           className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur"
//           initial={{ opacity: 0, scale: 0.97 }}
//           animate={{ opacity: 1, scale: 1 }}
//         >
//           <h3 className="text-xl font-semibold text-white mb-4">
//             Personal Information
//           </h3>

//           {/* Avatar Upload */}
//           <div className="flex items-center gap-4 mb-6">
//             <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-teal-400 shadow">
//               {avatar ? (
//                 <img src={avatar} className="w-full h-full object-cover" />
//               ) : (
//                 <div className="w-full h-full bg-slate-700 flex items-center justify-center text-white">
//                   {user?.name?.charAt(0)?.toUpperCase() || "U"}
//                 </div>
//               )}
//             </div>

//             <label className="cursor-pointer bg-teal-500 px-3 py-1 rounded text-black font-semibold hover:bg-teal-400 transition">
//               Upload Photo
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleAvatarUpload}
//               />
//             </label>
//           </div>

//           {/* Name Input */}
//           <label className="text-sm text-slate-300">Name</label>
//           <input
//             name="name"
//             defaultValue={user.name || ""}
//             className="w-full p-3 mt-1 mb-4 bg-slate-800 border border-slate-700 rounded-lg text-white"
//           />

//           {/* Email Input */}
//           <label className="text-sm text-slate-300">Email</label>
//           <input
//             name="email"
//             defaultValue={user.email || ""}
//             className="w-full p-3 mt-1 mb-6 bg-slate-800 border border-slate-700 rounded-lg text-white"
//           />

//           <button className="px-6 py-2 bg-teal-500 text-black rounded-lg font-semibold hover:bg-teal-400 transition">
//             Save Changes
//           </button>
//         </motion.form>

//         {/* RIGHT SECTION — RECENT PROJECTS */}
//         <motion.div
//           className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur"
//           initial={{ opacity: 0, scale: 0.97 }}
//           animate={{ opacity: 1, scale: 1 }}
//         >
//           <h3 className="text-xl font-semibold text-white mb-4">
//             Recent Projects
//           </h3>

//           {history.length === 0 ? (
//             <div className="text-slate-400">No recent projects yet.</div>
//           ) : (
//             <div className="space-y-4 max-h-[450px] overflow-auto pr-2">
//               {history.map((h) => (
//                 <motion.div
//                   key={h.id}
//                   className="p-4 bg-slate-800/60 border border-slate-700 rounded-xl shadow hover:border-teal-400 transition cursor-pointer"
//                   whileHover={{ scale: 1.01 }}
//                 >
//                   <div className="font-mono text-sm text-teal-300">
//                     {h.files.join(", ")}
//                   </div>
//                   <div className="text-xs text-slate-400 mt-1 leading-relaxed">
//                     {h.snippet}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </motion.div>
//       </div>
//     </main>
//   );
// }

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [avatar, setAvatar] = useState(
    localStorage.getItem("userAvatar") || ""
  );
  const [editing, setEditing] = useState(false);

  function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result);
      localStorage.setItem("userAvatar", reader.result);
    };
    reader.readAsDataURL(file);
  }

  function saveChanges() {
    localStorage.setItem("user", JSON.stringify(user));
    setEditing(false);
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <motion.h1
        className="text-3xl font-bold mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Profile
      </motion.h1>

      <motion.div
        className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur shadow-xl"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center text-center">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-teal-400 shadow-lg mb-4">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-700 flex items-center justify-center text-3xl">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <label className="text-sm text-teal-400 cursor-pointer hover:underline">
            Change photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarUpload}
            />
          </label>

          <h2 className="text-xl font-semibold mt-4">{user.name || "User"}</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>

        {/* Info */}
        <div className="mt-8 grid gap-6">
          <div>
            <label className="text-sm text-slate-400">Full Name</label>
            <input
              disabled={!editing}
              value={user.name || ""}
              onChange={(e) => setUser((u) => ({ ...u, name: e.target.value }))}
              className={`w-full mt-1 p-3 rounded-lg ${
                editing
                  ? "bg-slate-800 border border-slate-600"
                  : "bg-slate-800/40 border border-slate-800 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              disabled
              value={user.email || ""}
              className="w-full mt-1 p-3 rounded-lg bg-slate-800/40 border border-slate-800 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-2 rounded-lg bg-teal-500 text-black font-semibold hover:bg-teal-400 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={saveChanges}
                className="px-6 py-2 rounded-lg bg-teal-500 text-black font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 rounded-lg border border-slate-600 text-slate-300"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
