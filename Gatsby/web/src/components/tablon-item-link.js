import * as React from "react";
import { Link } from "gatsby";
import { humanizeUnderscore } from "../helpers/formatters";
import * as styles from "./tablon-item.module.scss";

export default function TablonItemLink({
  to,
  espacio,
  fallbackEspacioId,    // string si no hay espacio
  children,
}) {
  const nombre = espacio?.nombre || (fallbackEspacioId ? `Espacio ${fallbackEspacioId}` : "Espacio (desconocido)");
  const direccion = espacio?.direccion || "";
  const tiposTxt = espacio?.tipos?.length
    ? espacio.tipos.map(humanizeUnderscore).join(", ")
    : "";

  const card = (
    <div className={styles.item}>
      <div className={styles.header}>
        <div className={styles.nombre}>{nombre}</div>
        {direccion ? <div className={styles.direccion}>{direccion}</div> : null}
        {tiposTxt ? <div className={styles.tipos}>{tiposTxt}</div> : null}
      </div>

      <div className={styles.divider} />
      <div>{children}</div>
    </div>
  );

  if (!to) return card;

  return (
    <Link to={to} className={styles.link}>
      {card}
    </Link>
  );
}
