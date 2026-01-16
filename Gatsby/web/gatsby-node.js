const path = require("path");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const API_BASE = process.env.API_BASE_URL || "http://localhost:3000";
const PAGE_SIZE = 200;

async function fetchPage(url, tag) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`[${tag}] Error HTTP ${res.status} en ${url}`);
  return res.json();
}

async function sourceEspacios({ actions, createNodeId, createContentDigest, reporter }) {
  const { createNode } = actions;

  reporter.info(`[espacios] Source desde ${API_BASE} (page size ${PAGE_SIZE})`);

  let start = 0;
  let total = null;

  while (true) {
    const end = start + PAGE_SIZE - 1;
    const url = `${API_BASE}/espacios?start=${start}&end=${end}`;

    const json = await fetchPage(url, "espacios");
    const data = Array.isArray(json.data) ? json.data : [];

    if (total === null && Number.isFinite(json.total)) total = json.total;
    if (data.length === 0) break;

    for (const espacio of data) {
      // Tu API de /espacios devuelve { id, nombre, ... }
      const espacioIdReal = String(espacio.id ?? "").trim();
      const telefono =
        espacio.telefono == null
          ? null
          : String(espacio.telefono).replace(/\s+/g, " ").trim();

      const nodeId = createNodeId(`EspacioCultural-${espacioIdReal || JSON.stringify(espacio)}`);

      createNode({
        ...espacio,
        telefono,
        // guardamos el id real para queries / createPages
        espacio_cultural_id: espacioIdReal,
        // id interno Gatsby (sobrescribe el id del API)
        id: nodeId,
        internal: {
          type: "EspacioCultural",
          contentDigest: createContentDigest(espacio),
        },
      });
    }

    reporter.info(
      `[espacios] Recibidos ${data.length} (start=${json.start ?? start}, end=${json.end ?? end}, total=${json.total ?? total ?? "?"})`
    );

    if (Number.isFinite(total) && start + data.length >= total) break;
    if (data.length < PAGE_SIZE) break;

    start += PAGE_SIZE;
  }

  reporter.info(`[espacios] OK${Number.isFinite(total) ? ` (total=${total})` : ""}`);
}

async function sourceNoticias({ actions, createNodeId, createContentDigest, reporter }) {
  const { createNode } = actions;

  reporter.info(`[noticias] Source desde ${API_BASE} (page size ${PAGE_SIZE})`);

  let start = 0;
  let total = null;

  while (true) {
    const end = start + PAGE_SIZE - 1;
    const url = `${API_BASE}/noticias?start=${start}&end=${end}`;

    const json = await fetchPage(url, "noticias");
    const data = Array.isArray(json.data) ? json.data : [];

    if (total === null && Number.isFinite(json.total)) total = json.total;
    if (data.length === 0) break;

    for (const noticia of data) {
      const noticiaIdReal = String(noticia.id ?? "").trim();          // ej: n-3523-0
      const espacioIdReal = String(noticia.espacio?.id ?? "").trim(); // id real del espacio

      const nodeId = createNodeId(`Noticia-${noticiaIdReal || JSON.stringify(noticia)}`);

      createNode({
        ...noticia,
        noticia_id: noticiaIdReal,
        // clave para filtrar noticias por espacio en GraphQL
        espacio_cultural_id: espacioIdReal,
        // id interno Gatsby
        id: nodeId,
        internal: {
          type: "Noticia",
          contentDigest: createContentDigest(noticia),
        },
      });
    }

    reporter.info(
      `[noticias] Recibidas ${data.length} (start=${json.start ?? start}, end=${json.end ?? end}, total=${json.total ?? total ?? "?"})`
    );

    if (Number.isFinite(total) && start + data.length >= total) break;
    if (data.length < PAGE_SIZE) break;

    start += PAGE_SIZE;
  }

  reporter.info(`[noticias] OK${Number.isFinite(total) ? ` (total=${total})` : ""}`);
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  createTypes(`
    type EspacioCultural implements Node {
      telefono: String
    }
  `);
};

exports.sourceNodes = async (gatsbyApi) => {
  await sourceEspacios(gatsbyApi);
  await sourceNoticias(gatsbyApi);
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query CreateEspacioPages {
      allEspacioCultural {
        nodes {
          espacio_cultural_id
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic("Error en query de createPages", result.errors);
    return;
  }

  const template = path.resolve("./src/templates/espacio.js");

  for (const n of result.data.allEspacioCultural.nodes) {
    const espacioId = String(n.espacio_cultural_id).trim();
    if (!espacioId) continue;

    createPage({
      path: `/espacios/${espacioId}`,
      component: template,
      context: { espacioId },
    });
  }

  reporter.info(`[createPages] OK: ${result.data.allEspacioCultural.nodes.length} espacios`);
};