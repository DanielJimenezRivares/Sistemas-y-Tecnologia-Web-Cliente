import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import UltimasNoticias from "../components/ultimas-noticias";
import UltimasValoraciones from "../components/ultimas-valoraciones";
import BuscadorEspacios from "../components/buscador-espacios";

export default function IndexPage({ data }) {
  const espacios = data.allEspacioCultural.nodes;

  const espaciosById = React.useMemo(() => {
    const m = new Map();
    for (const e of espacios) m.set(String(e.espacio_cultural_id), e);
    return m;
  }, [espacios]);

  return (
    <Layout title="Espacios Culturales de Canarias">
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16, height: "100%", minHeight: 0 }}>
        <div
          style={{
            display: "grid",
            gridTemplateRows: "1fr 1fr",
            gap: 16,
            minHeight: 0,
            overflow: "hidden",
          }}
        >
          <UltimasNoticias espaciosById={espaciosById} limit={10} />
          <UltimasValoraciones espaciosById={espaciosById} limit={5} />
        </div>
        <div style={{ minHeight: 0, overflow: "hidden" }}>
          <BuscadorEspacios />
        </div>
      </div>
    </Layout>
  );
}

export const query = graphql`
  query HomeQuery {
    allEspacioCultural {
      nodes {
        espacio_cultural_id
        nombre
        direccion
        tipos
      }
    }
  }
`;
