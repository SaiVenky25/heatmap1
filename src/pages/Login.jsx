import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { findVerifiedNgo } from "../utils/verifiedNGOs";
import "../App.css";
import "./Login.css";

export default function Login() {
  const [tab, setTab] = useState("citizen");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [ngoCode, setNgoCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onCitizen = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }
    setLoading(true);
    setError("");
    
    setTimeout(() => {
      login({ id: crypto.randomUUID(), name, role: "citizen" });
      navigate("/report");
      setLoading(false);
    }, 500);
  };

  const onNGO = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!org.trim()) {
      setError("Organization name is required");
      return;
    }
    if (!ngoCode.trim()) {
      setError("Verification code is required");
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      const verified = findVerifiedNgo(org, ngoCode);
      if (!verified) {
        setError("Access denied. Organization is not verified or code is invalid.");
        setLoading(false);
        return;
      }
      login({ id: crypto.randomUUID(), name: verified.name, role: verified.role, meta: { verified: true } });
      navigate("/ngo");
      setLoading(false);
    }, 500);
  };

  return (
    <div className="auth fullscreen login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <div className="logo-circle">🐾</div>
          <h1>Stray Animal Aid</h1>
          <p className="subtitle">Report and help stray animals in need</p>
        </div>

        {/* Tabs */}
        <div className="tabs login-tabs">
          <button 
            className={`tab-btn ${tab === "citizen" ? "active" : ""}`}
            onClick={() => {
              setTab("citizen");
              setError("");
              setOrg("");
              setNgoCode("");
            }}
          >
            <span className="tab-icon">👤</span>
            Citizen
          </button>
          <button 
            className={`tab-btn ${tab === "ngo" ? "active" : ""}`}
            onClick={() => {
              setTab("ngo");
              setError("");
              setName("");
            }}
          >
            <span className="tab-icon">🏢</span>
            NGO / Admin
          </button>
        </div>

        {/* Forms */}
        {tab === "citizen" ? (
          <form className="login-form" onSubmit={onCitizen}>
            <div className="form-group">
              <label className={`form-label ${nameFocused || name ? "focused" : ""}`}>
                Your Name
              </label>
              <input
                type="text"
                className="login-input"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                disabled={loading}
              />
              <div className="input-underline"></div>
            </div>

            {error && (
              <div className="alert-box error-alert">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{error}</span>
              </div>
            )}

            <button 
              className="btn primary btn-submit" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                <>
                  Continue
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>

            <p className="form-hint">
              <span className="hint-icon">ℹ️</span>
              No account needed. Just enter your name to get started.
            </p>
          </form>
        ) : (
          <form className="login-form" onSubmit={onNGO}>
            <div className="form-group">
              <label className="form-label">Organization Name</label>
              <input
                type="text"
                className="login-input"
                placeholder="Enter your organization name"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                disabled={loading}
              />
              <div className="input-underline"></div>
            </div>

            <div className="form-group">
              <label className="form-label">Verification Code</label>
              <div className="password-input-group">
                <input
                  type={showCode ? "text" : "password"}
                  className="login-input"
                  placeholder="Enter your verification code"
                  value={ngoCode}
                  onChange={(e) => setNgoCode(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => setShowCode(!showCode)}
                  tabIndex="-1"
                >
                  {showCode ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              <div className="input-underline"></div>
            </div>

            {error && (
              <div className="alert-box error-alert">
                <span className="alert-icon">⚠️</span>
                <span className="alert-text">{error}</span>
              </div>
            )}

            <button 
              className="btn primary btn-submit" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  Continue
                  <span className="btn-arrow">→</span>
                </>
              )}
            </button>

            <p className="form-hint">
              <span className="hint-icon">🔐</span>
              Only verified NGOs can access the dashboard. Contact admin to register.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}