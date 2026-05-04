// Helper to provide a deterministic fallback image URL for courses
export function courseImageUrl(id: string | number, width = 600, height = 400) {
  const seed = encodeURIComponent(String(id || `course-${Math.random().toString(36).slice(2, 8)}`));
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
