const KEY = "reports.v1";

export function listReports() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveReport(report) {
  const all = listReports();
  all.unshift(report);
  localStorage.setItem(KEY, JSON.stringify(all));
  return report.id;
}

export function updateReport(id, patch) {
  const all = listReports();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patch };
    localStorage.setItem(KEY, JSON.stringify(all));
  }
}