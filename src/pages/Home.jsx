import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  // Use local images placed in /public (cow.jpg, dog.jpg). Keep the existing cat image.
  const images = useMemo(() => ([
    { url: "/cow.jpg", alt: "Cow on street" },
    { url: "/dog.jpg", alt: "Dog on street" },
    { url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1600&auto=format&fit=crop", alt: "Cat" },
  ]), []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length);
    }, 4000); // change every 4 seconds
    return () => clearInterval(id);
  }, [images.length]);
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-badge">Community • Safety • Care</div>
        <h1 className="hero-title">Crowd‑Sourced Stray Animal Assistance</h1>
        <p className="hero-subtitle">
          Report injured or distressed animals. Verified NGOs respond. Together we make streets safer.
        </p>
        <div className="hero-cta" style={{ flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link className="btn primary" to="/login">Get Started</Link>
          </div>
        </div>
        {/* Stats removed per request */}
      </div>

      <section className="features">
        <div className="feature-card">
          <h3>1. Report a stray</h3>
          <p>Share basic details, time and location. Add a photo if available.</p>
        </div>
        <div className="feature-card">
          <h3>2. We verify & notify</h3>
          <p>Reports are reviewed and alerts go to relevant responders.</p>
        </div>
        <div className="feature-card">
          <h3>3. Get updates</h3>
          <p>Track progress as responders accept and resolve the case.</p>
        </div>
      </section>
    </div>
  );
}
