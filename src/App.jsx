import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CitizenReport from "./pages/CitizenReport";
import NGODashboard from "./pages/NGODashboard";
import MapView from "./pages/MapView";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  function NavLinks() {
    const { user } = useAuth();
    const role = user?.role;
    return (
      <div className="nav-links">
        <Link to="/">Home</Link>
        {role === "citizen" && <Link to="/report">Report</Link>}
        {(role === "ngo" || role === "admin") && <Link to="/ngo">NGO</Link>}
        {!user && <Link to="/login">Login</Link>}
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <nav className="navbar">
          <h3>🐾 Stray Animal Aid</h3>
          <NavLinks />
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/report"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <CitizenReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ngo"
            element={
              <ProtectedRoute roles={["ngo", "admin"]}>
                <NGODashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/map" element={<MapView />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


