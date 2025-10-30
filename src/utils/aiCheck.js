export async function aiCheckPhoto(dataUrl) {
    // Placeholder heuristic:
    // - missing photo => flagged
    // - very small data URL length => flagged
    // - otherwise produce a pseudo score
    if (!dataUrl) return { flagged: true, score: 0.1 };
  
    const len = dataUrl.length;
    const baseScore = Math.max(0.2, Math.min(0.95, (len % 1000) / 1000 + 0.2));
    const flagged = baseScore < 0.5;
    return new Promise((res) => setTimeout(() => res({ flagged, score: baseScore }), 400));
  }