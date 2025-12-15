// // frontend/src/components/Navbar.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthProvider";

// export default function Navbar() {
//   const loc = useLocation();
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);
//   const ref = useRef();

//   // close dropdown on outside click
//   useEffect(() => {
//     function onDoc(e) {
//       if (ref.current && !ref.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener("click", onDoc);
//     return () => document.removeEventListener("click", onDoc);
//   }, []);

//   return (
//     <header className="bg-transparent backdrop-blur-sm border-b border-slate-800">
//       <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//         <Link to="/" className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl">
//             📄
//           </div>
//           <span className="font-semibold text-lg">DocuAI</span>
//         </Link>

//         <nav className="flex items-center gap-6">
//           <Link
//             to="/"
//             className={`text-sm ${
//               loc.pathname === "/" ? "text-teal-300" : "text-slate-300"
//             }`}
//           >
//             Home
//           </Link>
//           <Link
//             to="/dashboard"
//             className={`text-sm ${
//               loc.pathname === "/dashboard" ? "text-teal-300" : "text-slate-300"
//             }`}
//           >
//             Dashboard
//           </Link>
//           <Link
//             to="/documentation"
//             className={`text-sm ${
//               loc.pathname.startsWith("/documentation")
//                 ? "text-teal-300"
//                 : "text-slate-300"
//             }`}
//           >
//             Documentation
//           </Link>

//           {!user ? (
//             <>
//               <Link to="/login" className="text-sm text-slate-300">
//                 Sign In
//               </Link>
//               <Link
//                 to="/signup"
//                 className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 text-black text-sm font-semibold shadow-lg"
//               >
//                 Get Started
//               </Link>
//             </>
//           ) : (
//             <div className="relative" ref={ref}>
//               <button
//                 className="flex items-center gap-2 p-1 rounded"
//                 onClick={() => setOpen((v) => !v)}
//               >
//                 <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700">
//                   {localStorage.getItem("userAvatar") ? (
//                     <img
//                       src={localStorage.getItem("userAvatar")}
//                       alt="avatar"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-slate-700 flex items-center justify-center text-sm text-slate-300">
//                       {user.name ? user.name.charAt(0).toUpperCase() : "U"}
//                     </div>
//                   )}
//                 </div>
//                 <span className="hidden sm:inline text-sm text-slate-200">
//                   {user.name || user.email}
//                 </span>
//               </button>

//               {open && (
//                 <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded shadow-lg py-2 z-50">
//                   <Link
//                     to="/profile"
//                     className="block px-4 py-2 text-sm hover:bg-slate-800"
//                   >
//                     Profile
//                   </Link>
//                   <Link
//                     to="/settings"
//                     className="block px-4 py-2 text-sm hover:bg-slate-800"
//                   >
//                     Settings
//                   </Link>
//                   <button
//                     onClick={() => {
//                       logout();
//                     }}
//                     className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

export default function Navbar() {
  const loc = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const avatar = localStorage.getItem("userAvatar");

  return (
    <header className="bg-transparent backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-xl">
            📄
          </div>
          <span className="font-semibold text-lg">DocuAI</span>
        </Link>

        {/* NAV LINKS */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm ${
              loc.pathname === "/" ? "text-teal-300" : "text-slate-300"
            }`}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className={`text-sm ${
              loc.pathname === "/dashboard" ? "text-teal-300" : "text-slate-300"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/documentation"
            className={`text-sm ${
              loc.pathname.startsWith("/documentation")
                ? "text-teal-300"
                : "text-slate-300"
            }`}
          >
            Documentation
          </Link>

          {/* AUTH SECTION */}
          {!user ? (
            <>
              <Link
                to="/signup"
                className="ml-4 px-4 py-2 rounded-lg bg-gradient-to-br from-green-400 to-cyan-400 text-black text-sm font-semibold shadow-lg"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={ref}>
              {/* AVATAR BUTTON */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 p-1 rounded hover:bg-slate-800 transition"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-teal-500 flex items-center justify-center text-black font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <span className="hidden sm:inline text-sm text-slate-200">
                  {user.name}
                </span>
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-slate-800 transition"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
