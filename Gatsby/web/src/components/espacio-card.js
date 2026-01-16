import React from "react";
import { Link } from "gatsby";
import { humanizeUnderscore } from "../helpers/formatters";
import * as styles from "./espacio-card.module.scss";

export default function EspacioMiniCard({ espacio, to }) {
  const tiposTxt =
    espacio?.tipos?.length ? espacio.tipos.map(humanizeUnderscore).join(", ") : "-";

  const card = (
    <div className={styles.card}>
      <div className={styles.name}>{espacio?.nombre || "-"}</div>
      <div className={styles.addr}>{espacio?.direccion || "-"}</div>
      <div className={styles.types}>{tiposTxt}</div>
    </div>
  );

  if (!to) return card;

  return (
    <Link to={to} className={styles.link}>
      {card}
    </Link>
  );
}