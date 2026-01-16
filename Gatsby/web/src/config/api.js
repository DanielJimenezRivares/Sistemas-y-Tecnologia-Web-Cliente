const API_BASE = process.env.GATSBY_API_BASE_URL || "http://localhost:3000";

export const endpoints = {
  espacios: ({ start, end, q } = {}) => {
    const params = new URLSearchParams();
    if (start != null) params.set("start", String(start));
    if (end != null) params.set("end", String(end));
    if (q) params.set("q", q);
    const qs = params.toString();
    return `${API_BASE}/espacios${qs ? `?${qs}` : ""}`;
  },

  valoracionesReviewsRecientes: ({ limit } = {}) =>
    `${API_BASE}/valoraciones/reviews/recientes?limit=${encodeURIComponent(limit ?? 5)}`,

  noticiasRecientes: ({ limit } = {}) =>
    `${API_BASE}/noticias/recientes?limit=${encodeURIComponent(limit ?? 10)}`,

  valoracionesReviewsEspacio: ({ espacioId, start = 0, end = 19 } = {}) =>
    `${API_BASE}/valoraciones/reviews/${encodeURIComponent(espacioId)}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,

  postValoracion: () => `${API_BASE}/valoraciones`,
};