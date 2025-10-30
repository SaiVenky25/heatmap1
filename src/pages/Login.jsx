import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Login() {
  const [tab, setTab] = useState("citizen");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const onCitizen = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    login({ id: crypto.randomUUID(), name, role: "citizen" });
    navigate("/report");
  };

  const onNGO = (e) => {
    e.preventDefault();
    if (!org.trim()) return;
    const isAdmin = adminKey.trim() === "ADMIN-ACCESS-2025";
    login({ id: crypto.randomUUID(), name: org, role: isAdmin ? "admin" : "ngo", meta: { verified: true } });
    navigate("/ngo");
  };

  return (
    <div className="auth">
      <div className="tabs">
        <button className={tab === "citizen" ? "active" : ""} onClick={() => setTab("citizen")}>Citizen</button>
        <button className={tab === "ngo" ? "active" : ""} onClick={() => setTab("ngo")}>NGO</button>
      </div>

      {tab === "citizen" ? (
        <form className="card" onSubmit={onCitizen}>
          <h2>Citizen Login</h2>
          <input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="btn primary" type="submit">Continue</button>
        </form>
      ) : (
        <form className="card" onSubmit={onNGO}>
          <h2>NGO / Admin Login</h2>
          <input placeholder="Organization Name" value={org} onChange={(e) => setOrg(e.target.value)} />
          <input placeholder="Admin Key (optional)" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
          <button className="btn primary" type="submit">Continue</button>
          <p className="hint">Admins are granted by site staff after government verification.</p>
        </form>
      )}
    </div>
  );
}