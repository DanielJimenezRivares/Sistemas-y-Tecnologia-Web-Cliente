/**
 * Convierte un "slug" con guiones bajos a texto legible.
 * Ej: "centro_docente" -> "Centro docente"
 */
export function humanizeUnderscore(value) {
  const s = String(value ?? "").trim();
  if (!s) return "";

  const spaced = s.replace(/_/g, " ").replace(/\s+/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function renderStars(rating) {
  const r = Math.max(0, Math.min(5, Number(rating) || 0));
  return "★".repeat(r) + "☆".repeat(5 - r);
}