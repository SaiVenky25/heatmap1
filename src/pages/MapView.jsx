import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { listReports } from "../utils/db";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in many bundlers
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const reports = useMemo(() => listReports().filter(r => r.lat && r.lng), []);

  const center = useMemo(() => {
    if (reports.length > 0) return [reports[0].lat, reports[0].lng];
    return [12.9716, 77.5946]; // fallback: Bengaluru
  }, [reports]);

  return (
    <div className="page">
      <h2>Reports Map</h2>
      <div style={{ height: "70vh", width: "100%", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
        <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {reports.map((r) => (
            <Marker key={r.id} position={[r.lat, r.lng]}>
              <Popup>
                <div style={{ maxWidth: 220 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>{r.animalType} • {r.condition}</div>
                  <div style={{ fontSize: 12, color: "#555" }}>{new Date(r.time).toLocaleString()}</div>
                  <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>{r.address}</div>
                  {r.photo && (
                    <img src={r.photo} alt={r.animalType} style={{ width: "100%", borderRadius: 8 }} />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {reports.length === 0 && <div className="muted" style={{ marginTop: 12 }}>No geotagged reports yet. Submit a report with location.</div>}
    </div>
  );
}









