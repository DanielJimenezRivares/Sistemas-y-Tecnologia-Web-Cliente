import * as React from "react";
import EspacioMiniCard from "../components/espacio-card";
import { endpoints } from "../config/api";
import * as styles from "./buscador-espacios.module.scss";

function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export default function BuscadorEspacios({ page_size = 20 }) {
  const [q, setQ] = React.useState("");
  const qDebounced = useDebouncedValue(q, 250);

  const [items, setItems] = React.useState([]);
  const [start, setStart] = React.useState(0);
  const [total, setTotal] = React.useState(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const listRef = React.useRef(null);
  const sentinelRef = React.useRef(null);
  const abortRef = React.useRef(null);

  const startRef = React.useRef(0);
  const loadingRef = React.useRef(false);
  const hasMoreRef = React.useRef(true);
  const qRef = React.useRef("");

  React.useEffect(() => { startRef.current = start; }, [start]);
  React.useEffect(() => { loadingRef.current = loading; }, [loading]);
  React.useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  React.useEffect(() => { qRef.current = qDebounced; }, [qDebounced]);

  const loadMore = React.useCallback(async ({ reset = false } = {}) => {
    if (loadingRef.current) return;
    if (!hasMoreRef.current && !reset) return;

    setLoading(true);
    setError(null);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const nextStart = reset ? 0 : startRef.current;
      const end = nextStart + page_size - 1;

      const url = endpoints.espacios({ start: String(nextStart), end: String(end), q: qRef.current.trim() });
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json.data) ? json.data : [];
      const apiTotal = Number.isFinite(json.total) ? json.total : null;

      setTotal(apiTotal);

      setItems((prev) => (reset ? data : [...prev, ...data]));

      setStart((prev) => (reset ? data.length : prev + data.length));

      const newStart = nextStart + data.length;
      const more = data.length === page_size && (apiTotal == null || newStart < apiTotal);
      setHasMore(more);
    } catch (e) {
      if (e.name !== "AbortError") setError(String(e));
    } finally {
      setLoading(false);
    }
  }, [page_size]);

  React.useEffect(() => {
    setItems([]);
    setStart(0);
    setTotal(null);
    setHasMore(true);
    setError(null);
    loadMore({ reset: true });
  }, [qDebounced, loadMore]);

  React.useEffect(() => {
    const rootEl = listRef.current;
    const sentinelEl = sentinelRef.current;
    if (!rootEl || !sentinelEl) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore({ reset: false });
        }
      },
      {
        root: rootEl,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    obs.observe(sentinelEl);
    return () => obs.disconnect();
  }, [loadMore]);

  return (
    <aside className={styles.wrap}>
      <h2 className={styles.title}>Buscar espacios</h2>

      <input
        className={styles.input}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar (nombre o dirección)"
      />

      <div className={styles.meta}>
        {total != null ? <>Mostrando {items.length} de {total}</> : <>Mostrando {items.length}</>}
      </div>

      {error && <div className={styles.error}>Error: {error}</div>}

      <div ref={listRef} className={styles.list}>
        {items.map((e) => (
          <EspacioMiniCard key={e.id} espacio={e} to={`/espacios/${e.id}`} />
        ))}

        {loading && <div className={styles.msg}>Cargando…</div>}

        {!loading && !hasMore && items.length > 0 && (
          <div className={styles.msg}>No hay más resultados.</div>
        )}

        {!loading && items.length === 0 && (
          <div className={styles.msg}>Sin resultados.</div>
        )}

        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </aside>
  );
}