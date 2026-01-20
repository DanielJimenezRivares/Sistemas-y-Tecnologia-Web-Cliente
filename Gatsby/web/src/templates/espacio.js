import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import FichaEspacio from "../components/ficha-espacio";
import TablonNoticiasEspacio from "../components/tablon-noticias-espacio";
import TablonValoracionesEspacio from "../components/tablon-valoraciones-espacio";
import * as styles from "./espacio.module.scss";

export default function EspacioPage({ data }) {
  const espacio = data.espacio;

  return (
    <Layout title="Espacios Culturales de Canarias">
      <div className={styles.grid}>
        <div className={styles.left}>
          <FichaEspacio espacio={espacio} />
        </div>

        <div className={styles.right}>
          <TablonNoticiasEspacio noticias={data.noticias.nodes} />
          <TablonValoracionesEspacio espacioId={espacio.espacio_cultural_id} />
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query EspacioTemplate($espacioId: String!) {
    espacio: espacioCultural(espacio_cultural_id: { eq: $espacioId }) {
      espacio_cultural_id
      nombre
      direccion
      tipos
      telefono
      web
      horario
      imagenes
    }

    noticias: allNoticia(
      filter: { espacio_cultural_id: { eq: $espacioId } }
      sort: { fecha: DESC }
      limit: 5
    ) {
      nodes {
        noticia_id
        titulo
        fecha
        cuerpo
      }
    }
  }
`;