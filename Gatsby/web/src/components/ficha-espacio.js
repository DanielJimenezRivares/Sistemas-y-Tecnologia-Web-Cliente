import * as React from "react";
import { humanizeUnderscore } from "../helpers/formatters";
import * as styles from "./ficha-espacio.module.scss";

const isEmptyLike = (x) => {
  if (x == null) return true;
  const s = String(x).trim();
  return s === "" || s === "-" || s.toUpperCase() === "_U";
};

const V = (x) => (isEmptyLike(x) ? "-" : String(x).trim());

export default function FichaEspacio({ espacio }) {
  const validImages = Array.isArray(espacio?.imagenes)
  ? espacio.imagenes
      .map((u) => String(u ?? "").trim())
      .filter((u) => u && u.toUpperCase() !== "_U")
  : [];
  const [img] = validImages;
  const [imgOk, setImgOk] = React.useState(true);
  React.useEffect(() => {
    setImgOk(true);
  }, [img]);
  
  const tipos = Array.isArray(espacio?.tipos)
    ? espacio.tipos
        .map((t) => String(t ?? "").trim())
        .filter((t) => t && t.toUpperCase() !== "_U")
        .map(humanizeUnderscore)
        .join(", ")
    : "";
  const tiposTxt = tipos ? tipos : "-";

  return (
    <aside className={styles.wrap}>
      <div className={styles.imageBox}>
        {img && imgOk ? (
          <img
            src={img}
            alt={V(espacio?.nombre)}
            className={styles.image}
            onError={() => setImgOk(false)}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder}>Sin imagen</div>
        )}
      </div>

      <h2 className={styles.title}>{V(espacio?.nombre)}</h2>

      <div className={styles.kv}>
        <div className={styles.k}>Dirección</div>
        <div className={styles.v}>{V(espacio?.direccion)}</div>

        <div className={styles.k}>Tipo</div>
        <div className={styles.v}>{tiposTxt}</div>

        <div className={styles.k}>Teléfono</div>
        <div className={styles.v}>{V(espacio?.telefono)}</div>

        <div className={styles.k}>Web</div>
        <div className={styles.v}>
          {espacio?.web && espacio.web !== "-" ? (
            <a href={espacio.web} target="_blank" rel="noreferrer">{espacio.web}</a>
          ) : (
            "-"
          )}
        </div>

        <div className={styles.k}>Horario</div>
        <div className={styles.v}>{V(espacio?.horario)}</div>
      </div>
    </aside>
  );
}
