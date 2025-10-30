import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listReports, updateReport } from "../utils/db";
import "../App.css";

export default function NGODashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);

  const refresh = () => setReports(listReports());

  useEffect(() => {
    refresh();
  }, []);

  const takeAction = (id, action) => {
    updateReport(id, { status: action, handledBy: user.name });
    refresh();
  };

  return (
    <div className="page">
      <h2>NGO Dashboard {user.role === "admin" ? "(Admin)" : ""}</h2>
      <div className="cards">
        {reports.length === 0 && <div className="muted">No reports yet.</div>}
        {reports.map((r) => (
          <div className="card report" key={r.id}>
            <div className="report-row">
              <img className="thumb" src={r.photo} alt={r.animalType} />
              <div className="meta">
                <div className="title">{r.animalType} • {r.condition}</div>
                <div className="sub">Time: {new Date(r.time).toLocaleString()}</div>
                <div className="sub">Address: {r.address}</div>
                <div className={`badge ${r.aiVerdict.flagged ? "warn" : "ok"}`}>
                  AI: {r.aiVerdict.flagged ? "Review needed" : "Likely valid"} ({Math.round(r.aiVerdict.score * 100)}%)
                </div>
                <div className="sub">Status: {r.status}{r.handledBy ? ` • by ${r.handledBy}` : ""}</div>
              </div>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => takeAction(r.id, "in-progress")}>Accept</button>
              <button className="btn" onClick={() => takeAction(r.id, "resolved")}>Resolve</button>
              {user.role === "admin" && (
                <button className="btn danger" onClick={() => takeAction(r.id, "rejected")}>Reject</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}