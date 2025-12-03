import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { findVerifiedNgo } from "../utils/verifiedNGOs";
import "../App.css";

export default function Login() {
  const [tab, setTab] = useState("citizen");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [ngoCode, setNgoCode] = useState("");
  const [error, setError] = useState("");
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
    setError("");
    if (!org.trim() || !ngoCode.trim()) {
      setError("Organization and verification code are required.");
      return;
    }
    const verified = findVerifiedNgo(org, ngoCode);
    if (!verified) {
      setError("Access denied. Organization is not on the verified list or code is invalid.");
      return;
    }
    login({ id: crypto.randomUUID(), name: verified.name, role: verified.role, meta: { verified: true } });
    navigate("/ngo");
  };

  return (
    <div className="auth fullscreen">
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
          <input placeholder="Organization Name (must be verified)" value={org} onChange={(e) => setOrg(e.target.value)} />
          <input placeholder="Verification Code" value={ngoCode} onChange={(e) => setNgoCode(e.target.value)} />
          <button className="btn primary" type="submit">Continue</button>
          {error && <div className="alert err" style={{ marginTop: 10 }}>{error}</div>}
          <p className="hint">Only government‑verified NGOs are allowed. Contact site admin to be added.</p>
        </form>
      )}
    </div>
  );
}