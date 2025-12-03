// Local whitelist simulating government-verified NGOs.
// In production, fetch this securely from a backend.

export const VERIFIED_NGOS = [
  { name: "Blue Cross Society", code: "NGO-BCS-2025", role: "ngo" },
  { name: "City Animal Welfare Board", code: "NGO-CAWB-2025", role: "admin" },
  { name: "Stray Care Trust", code: "NGO-SCT-2025", role: "ngo" },
];

export function findVerifiedNgo(orgName, code) {
  if (!orgName || !code) return null;
  const normalizedName = orgName.trim().toLowerCase();
  const normalizedCode = code.trim();
  return (
    VERIFIED_NGOS.find(
      (n) => n.name.trim().toLowerCase() === normalizedName && n.code === normalizedCode
    ) || null
  );
}









