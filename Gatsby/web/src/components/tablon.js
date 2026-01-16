import * as React from "react";
import * as styles from "./tablon.module.scss";

export default function Tablon({
  title,
  loading,
  error,
  items,
  emptyText = "Sin resultados.",
  loadingText = "Cargando…",
  className,
  style,
  renderItem,
}) {
  return (
    <section className={styles.wrap}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}
      {error ? <div className={styles.error}>Error: {error}</div> : null}

      <ul className={styles.list}>
        {Array.isArray(items) ? items.map(renderItem) : null}
        {loading && <li style={{ color: "var(--muted)", padding: "8px 0" }}>{loadingText}</li>}
        {!loading && (!items || items.length === 0) && (
          <li style={{ color: "var(--muted)", padding: "8px 0" }}>{emptyText}</li>
        )}
      </ul>
    </section>
  );
}
