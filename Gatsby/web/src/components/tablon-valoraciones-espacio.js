import * as React from "react";
import Tablon from "./tablon";
import { endpoints } from "../config/api";
import { renderStars } from "../helpers/formatters";
import * as formStyles from "./form.module.scss";
import * as itemStyles from "./tablon-item.module.scss";

export default function TablonValoracionesEspacio({ espacioId, title = "Valoraciones" }) {
  const [state, setState] = React.useState({ loading: true, error: null, data: [] });
  const [form, setForm] = React.useState({ username: "", review: "", rating: 5 });
  const [posting, setPosting] = React.useState(false);
  const [postError, setPostError] = React.useState(null);

  const reload = React.useCallback(async (signal) => {
    const url = endpoints.valoracionesReviewsEspacio({ espacioId, start: 0, end: 19 });
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json.data) ? json.data : [];
  }, [espacioId]);

  React.useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        setState({ loading: true, error: null, data: [] });
        const data = await reload(controller.signal);
        if (!cancelled) setState({ loading: false, error: null, data });
      } catch (e) {
        if (e.name === "AbortError") return;
        if (!cancelled) setState({ loading: false, error: String(e), data: [] });
      }
    })();

    return () => { cancelled = true; controller.abort(); };
  }, [reload]);

  async function onSubmit(e) {
    e.preventDefault();
    if (posting) return;

    setPosting(true);
    setPostError(null);

    try {
      const payload = {
        espacio_cultural_id: espacioId,
        rating: Number(form.rating),
        review: form.review?.trim() ? form.review.trim() : undefined,
        username: form.username?.trim() ? form.username.trim() : undefined,
      };

      const res = await fetch(endpoints.postValoracion(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }

      // refresca lista
      const controller = new AbortController();
      const data = await reload(controller.signal);
      setState({ loading: false, error: null, data });

      // limpia form (rating lo dejo como está)
      setForm((f) => ({ ...f, username: "", review: "" }));
    } catch (err) {
      setPostError(String(err));
    } finally {
      setPosting(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateRows: "1fr auto", minHeight: 0, gap: 10 }}>
      <Tablon
        title={title}
        loading={state.loading}
        error={state.error}
        items={state.data}
        emptyText="Aún no hay valoraciones para este espacio."
        loadingText="Cargando valoraciones…"
        renderItem={(r, idx) => (
          <li key={String(r.review_id ?? `${idx}-${r.timestamp ?? ""}`)}>
            <div className={itemStyles.item}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>{r.username || "Anónimo"}</strong>
                <span>{renderStars(r.rating)}</span>
              </div>

              {r.review ? (
                <div style={{ marginTop: 6 }}>{r.review}</div>
              ) : (
                <div style={{ marginTop: 6, color: "#64748b" }}>-</div>
              )}

              {r.timestamp ? (
                <div style={{ marginTop: 6, color: "#94a3b8", fontSize: "0.85em" }}>
                  {r.timestamp}
                </div>
              ) : null}
            </div>
          </li>
        )}
      />

      <section className={formStyles.formPanel}>
        <h3 className={formStyles.h3}>Añadir reseña</h3>

        {postError ? <div className={formStyles.error}>Error: {postError}</div> : null}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
             <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className={formStyles.inlineLabel}>Rating</span>
              <select
                className={formStyles.select}
                value={form.rating}
                onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                style={{ width: 90 }}
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
 
            <input
              className={formStyles.input}
              style={{ flex: 1 }}
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              placeholder="Usuario (opcional)"
            />
          </div>

          <textarea
            className={formStyles.textarea}
            value={form.review}
            onChange={(e) => setForm((f) => ({ ...f, review: e.target.value }))}
            placeholder="Tu reseña (opcional)"
            rows={3}
          />

          <button
            type="submit"
            disabled={posting}
            className={`${formStyles.button} ${posting ? formStyles.buttonDisabled : ""}`}
          >
            {posting ? "Publicando…" : "Publicar"}
          </button>
        </form>
      </section>
    </div>
  );
}
