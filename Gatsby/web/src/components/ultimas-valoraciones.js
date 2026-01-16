import * as React from "react";
import Tablon from "./tablon";
import TablonItemLink from "./tablon-item-link";
import { endpoints } from "../config/api";
import { renderStars } from "../helpers/formatters";

export default function UltimasValoraciones({
  espaciosById,
  limit = 5,
  getEspacioLink = (espacioId) => `/espacios/${espacioId}`,
  title = "Últimas valoraciones",
}) {
  const [state, setState] = React.useState({ loading: true, error: null, data: [] });

  React.useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      try {
        setState({ loading: true, error: null, data: [] });

        const url = endpoints.valoracionesReviewsRecientes({ limit });
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];

        if (!cancelled) setState({ loading: false, error: null, data });
      } catch (e) {
        if (e.name === "AbortError") return;
        if (!cancelled) setState({ loading: false, error: String(e), data: [] });
      }
    }

    run();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [limit]);

  return (
    <Tablon
      title={title}
      loading={state.loading}
      error={state.error}
      items={state.data}
      emptyText="Aún no hay valoraciones."
      loadingText="Cargando valoraciones…"
      renderItem={(r, idx) => {
        const espacioId = String(r.espacio_cultural_id ?? "").trim();
        const espacio = espaciosById?.get?.(espacioId);
        const key = String(r?.id ?? `${espacioId}-${idx}`);

        return (
          <li key={key}>
            <TablonItemLink
              to={getEspacioLink(espacioId)}
              espacio={espacio}
              fallbackEspacioId={espacioId}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{r.username || "Anónimo"}</strong>
                <span>{renderStars(r.rating)}</span>
              </div>
              {r.review ? <div style={{ marginTop: 6 }}>{r.review}</div> : null}
            </TablonItemLink>
          </li>
        );
      }}
    />
  );
}
