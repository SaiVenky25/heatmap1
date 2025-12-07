import React, { useState, useMemo } from "react";
import { listReports } from "../utils/db";
import "../App.css";
import "./ReportHistory.css";

export default function ReportHistory() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  const reports = useMemo(() => {
    const allReports = listReports();
    
    // Filter by status
    let filtered = allReports;
    if (filterStatus !== "all") {
      filtered = allReports.filter((r) => r.status === filterStatus);
    }

    // Sort
    if (sortBy === "latest") {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => a.createdAt - b.createdAt);
    } else if (sortBy === "animal") {
      filtered.sort((a, b) => a.animalType.localeCompare(b.animalType));
    }

    return filtered;
  }, [filterStatus, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const allReports = listReports();
    return {
      total: allReports.length,
      new: allReports.filter((r) => r.status === "new").length,
      inProgress: allReports.filter((r) => r.status === "in-progress").length,
      resolved: allReports.filter((r) => r.status === "resolved").length,
      rejected: allReports.filter((r) => r.status === "rejected").length,
    };
  }, []);

  return (
    <div className="page">
      <h2>Report History & Analytics</h2>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Reports</div>
        </div>
        <div className="stat-card new-stat">
          <div className="stat-value">{stats.new}</div>
          <div className="stat-label">New</div>
        </div>
        <div className="stat-card progress-stat">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card resolved-stat">
          <div className="stat-value">{stats.resolved}</div>
          <div className="stat-label">Resolved ✓</div>
        </div>
        <div className="stat-card rejected-stat">
          <div className="stat-value">{stats.rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Filter by Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Reports</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="animal">Animal Type</option>
          </select>
        </div>

        <div className="filter-info">
          Showing {reports.length} of {listReports().length} reports
        </div>
      </div>

      {/* Reports List */}
      <div className="reports-container">
        {reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Reports Found</h3>
            <p>Try adjusting your filters to see reports</p>
          </div>
        ) : (
          <div className="reports-grid">
            {reports.map((r) => (
              <div key={r.id} className={`report-card status-${r.status}`}>
                {/* Photo */}
                {r.photo && (
                  <div className="report-photo">
                    <img src={r.photo} alt={r.animalType} />
                    <div className={`status-badge ${r.status}`}>
                      {r.status === "new" && "🆕 New"}
                      {r.status === "in-progress" && "⏳ In Progress"}
                      {r.status === "resolved" && "✅ Resolved"}
                      {r.status === "rejected" && "❌ Rejected"}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="report-content">
                  <div className="report-header">
                    <h3>{r.animalType}</h3>
                    <span className="condition-badge">{r.condition}</span>
                  </div>

                  <div className="report-details">
                    <div className="detail-item">
                      <span className="detail-label">📍 Address:</span>
                      <span className="detail-value">{r.address}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">🕐 Time:</span>
                      <span className="detail-value">{new Date(r.time).toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">👤 Reporter:</span>
                      <span className="detail-value">{r.reporterName}</span>
                    </div>

                    {r.handledBy && (
                      <div className="detail-item handled">
                        <span className="detail-label">🏢 Handled By:</span>
                        <span className="detail-value">{r.handledBy}</span>
                      </div>
                    )}

                    {r.aiVerdict && (
                      <div className={`ai-verdict ${r.aiVerdict.flagged ? "warning" : "valid"}`}>
                        <span className="ai-label">AI Check:</span>
                        <span className="ai-text">
                          {r.aiVerdict.flagged ? "⚠️ Review needed" : "✅ Likely valid"} ({Math.round(r.aiVerdict.score * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="report-footer">
                    <small className="report-id">ID: {r.id.slice(0, 8)}</small>
                    <small className="report-date">{new Date(r.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
