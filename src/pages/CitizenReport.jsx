// /Users/yashaswinibg/cursor/stray-heatmap/src/pages/CitizenReport.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { saveReport } from "../utils/db";
import { aiCheckPhoto } from "../utils/aiCheck";
import "../App.css";

export default function CitizenReport() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    animalType: "",
    condition: "",
    time: new Date().toISOString().slice(0, 16),
    address: "",
    photo: null,
    photoPreview: "",
    lat: "",
    lng: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onPhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: file, photoPreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const ai = await aiCheckPhoto(form.photoPreview);
      const payload = {
        id: crypto.randomUUID(),
        reporterId: user.id,
        reporterName: user.name,
        animalType: form.animalType,
        condition: form.condition,
        time: form.time,
        address: form.address,
        photo: form.photoPreview,
        aiVerdict: ai,
        status: "new",
        createdAt: Date.now(),
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      };
      await saveReport(payload);
      setResult({ ok: true, id: payload.id, ai });
      setForm({ animalType: "", condition: "", time: new Date().toISOString().slice(0, 16), address: "", photo: null, photoPreview: "", lat: "", lng: "" });
    } catch (err) {
      setResult({ ok: false, error: String(err) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page fullscreen">
      <h2>Report an Animal</h2>
      <form className="card form" onSubmit={onSubmit}>
        <div className="grid">
          <label>
            Animal Type
            <select value={form.animalType} onChange={(e) => setForm((f) => ({ ...f, animalType: e.target.value }))}>
              <option value="">Select</option>
              <option>Dog</option>
              <option>Cat</option>
              <option>Cow</option>
              <option>Bird</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Condition
            <select value={form.condition} onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}>
              <option value="">Select</option>
              <option>Injured</option>
              <option>Sick</option>
              <option>Trapped</option>
              <option>Aggressive</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Time
            <input type="datetime-local" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} />
          </label>

          <label className="full">
            Address
            <input placeholder="Street, Area, City" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </label>

          <label>
            Latitude
            <input
              type="number"
              step="any"
              placeholder="e.g. 12.9716"
              value={form.lat}
              onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
            />
          </label>

          <label>
            Longitude
            <input
              type="number"
              step="any"
              placeholder="e.g. 77.5946"
              value={form.lng}
              onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
            />
          </label>

          <label className="full">
            Photo
            <input type="file" accept="image/*" onChange={onPhoto} />
          </label>
        </div>

        {form.photoPreview && (
          <div className="preview">
            <img src={form.photoPreview} alt="preview" />
          </div>
        )}

        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Report"}
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => {
            if (!navigator.geolocation) return alert("Geolocation not supported by your browser.");
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                setForm((f) => ({ ...f, lat: String(latitude), lng: String(longitude) }));
              },
              (err) => {
                alert("Unable to fetch location: " + err.message);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          }}
          style={{ marginLeft: 12 }}
        >
          Use my location
        </button>
      </form>

      {result && (
        <div className={`alert ${result.ok ? "ok" : "err"}`}>
          {result.ok ? (
            <>
              Report submitted. ID: {result.id}. AI verdict: {result.ai.flagged ? "Needs review" : "Looks OK"} (score {Math.round(result.ai.score * 100)}%).
            </>
          ) : (
            <>Error: {result.error}</>
          )}
        </div>
      )}
    </div>
  );
}