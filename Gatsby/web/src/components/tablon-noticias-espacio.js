import * as React from "react";
import Tablon from "./tablon";
import * as itemStyles from "./tablon-item.module.scss";

export default function TablonNoticiasEspacio({ noticias = [], title = "Noticias" }) {
  return (
    <Tablon
      title={title}
      loading={false}
      error={null}
      items={noticias}
      emptyText="Aún no hay noticias para este espacio."
      renderItem={(n, idx) => {
        const key = String(n?.noticia_id ?? n?.id ?? idx);
        const body = n?.cuerpo ?? n?.texto ?? n?.descripcion ?? null;

        return (
          <li key={key}>
            <div className={itemStyles.item}>
              <div style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <strong>{n?.titulo || "Sin título"}</strong>
                  {n?.fecha ? <span style={{ color: "#666" }}>{n.fecha}</span> : null}
                </div>

                <div style={{ height: 1, background: "rgba(15,23,42,0.08)" }} />

                <div style={{ color: "#334155" }}>
                  {body ? body : <span style={{ color: "#64748b" }}>-</span>}
                </div>
              </div>
            </div>
          </li>
        );
      }}
    />
  );
}
