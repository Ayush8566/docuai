import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Profile from "./pages/Profile";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import OAuthSuccess from "./pages/auth/OAuthSuccess";
import PublicDoc from "./pages/PublicDoc";

function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-2">404 — Page not found</h2>
        <p className="text-slate-400">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Docs */}
        <Route
          path="/documentation"
          element={
            <ProtectedRoute>
              <Documentation />
            </ProtectedRoute>
          }
        />
        <Route path="/doc/:id" element={<Documentation />} />
        <Route path="/public/:publicId" element={<PublicDoc />} />

        {/* Auth */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
