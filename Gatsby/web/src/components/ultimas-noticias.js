import * as React from "react";
import Tablon from "./tablon";
import TablonItemLink from "./tablon-item-link";
import { endpoints } from "../config/api";

export default function UltimasNovedades({
  espaciosById,
  limit = 10,
  getEspacioLink = (espacioId) => `/espacios/${espacioId}`,
  title = "Últimas noticias",
}) {
  const [state, setState] = React.useState({ loading: true, error: null, data: [] });

  React.useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function run() {
      try {
        setState({ loading: true, error: null, data: [] });

        const url = endpoints.noticiasRecientes({ limit });
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
      emptyText="Aún no hay noticias."
      loadingText="Cargando noticias…"
      renderItem={(n, idx) => {
        const espacioId = String(n?.espacio?.id ?? "").trim();
        const espacio = espaciosById?.get?.(espacioId);
        const key = String(n?.id ?? `${espacioId}-${idx}`);

        return (
          <li key={key}>
            <TablonItemLink
              to={getEspacioLink(espacioId)}
              espacio={espacio}
              fallbackEspacioId={espacioId}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{n.titulo || "Sin título"}</strong>
                {n.fecha ? <span style={{ color: "#666" }}>{n.fecha}</span> : null}
              </div>
            </TablonItemLink>
          </li>
        );
      }}
    />
  );
}
