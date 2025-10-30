import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-badge">Community • Safety • Care</div>
        <h1 className="hero-title">Crowd‑Sourced Stray Animal Assistance</h1>
        <p className="hero-subtitle">
          Report injured or distressed animals. Verified NGOs respond. Together we make streets safer.
        </p>
        <div className="hero-cta">
          <Link className="btn primary" to="/login">Get Started</Link>
          <Link className="btn" to="/report">Report an Animal</Link>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>120+</span> Reports this month</div>
          <div className="stat"><span>35</span> Verified NGOs</div>
          <div className="stat"><span>92%</span> Resolved cases</div>
        </div>
      </div>

      <section className="features">
        <div className="feature-card">
          <h3>Easy Reporting</h3>
          <p>Upload a photo, add time and address. We’ll notify nearby NGOs.</p>
        </div>
        <div className="feature-card">
          <h3>Verified NGOs</h3>
          <p>Access for government-verified NGOs. Admins manage approvals.</p>
        </div>
        <div className="feature-card">
          <h3>Trust & Safety</h3>
          <p>Built‑in AI check flags likely fake photos for review.</p>
        </div>
      </section>
    </div>
  );
}
