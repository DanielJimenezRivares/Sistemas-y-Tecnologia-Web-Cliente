// src/api/espacios/espacios.routes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = path.resolve(__dirname, "../../data/espacios-culturales.json");

let RAW = [];
try {
  RAW = JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
} catch (err) {
  console.error("Error leyendo JSON:", err.message);
}

const TIPOS_ADMITIDOS = new Set([
  "archivo",
  "auditorio",
  "biblioteca",
  "centro_cultural",
  "centro_interpretacion",
  "centro_docente",
  "cine",
  "galeria_arte",
  "museo",
  "sala_conciertos",
  "sala_exposiciones",
  "sala_polivalente",
  "teatro",
]);

const sinTildes = (s) =>
  s?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() || "";

function getCampo(obj, claves) {
  for (const k of claves) if (obj?.[k]) return obj[k];
  return "";
}

function construirDireccion(it) {
  return [
    getCampo(it, ["direccion"]),
    getCampo(it, ["direccion_municipio_nombre"]),
    getCampo(it, ["direccion_codigo_postal"]),
    getCampo(it, ["direccion_isla_nombre"]),
  ]
    .filter(Boolean)
    .map((x) => String(x).trim())
    .join(", ");
}

// Interpreta varios formatos de “sí”
function esSi(v) {
  if (v === true || v === 1) return true;
  const s = sinTildes(String(v));
  return s === "si" || s === "1" || s === "sí";
}

function getTipos(it) {
  const tipos = [];
  for (const tipo of TIPOS_ADMITIDOS) {
    if (esSi(it[tipo])) tipos.push(tipo);
  }
  return tipos;
}

function obtenerNombre(it) {
  return getCampo(it, ["espacio_cultura_nombre"]);
}

function mapearSalida(it) {
  return {
    id: getCampo(it, ["espacio_cultural_id"]) || null,
    nombre: obtenerNombre(it) || null,
    direccion: construirDireccion(it) || null,
    horario: getCampo(it, ["horario"]) || null,
    telefono: getCampo(it, ["telefono"]) || null,
    web: getCampo(it, ["pagina_web"]) || null,
    tipos: getTipos(it)
  };
}

function filtrarDatos({ tipo, q }) {
  let datos = RAW;

  if (tipo) {
    const t = sinTildes(tipo);
    datos = datos.filter((it) => esSi(it[t]));
  }

  if (q) {
    const qNorm = sinTildes(q);
    datos = datos.filter((it) => {
      const nombre = sinTildes(obtenerNombre(it));
      const direccion = sinTildes(construirDireccion(it));
      return nombre.includes(qNorm) || direccion.includes(qNorm);
    });
  }

  return datos;
}

function buscarEspacioPorId(id) {
  if (!id) return null;
  // En tu JSON el id viene como "espacio_cultural_id"
  return RAW.find((it) => String(getCampo(it, ["espacio_cultural_id"])) === id) || null;
}

// GET /espacios
router.get("/", (req, res) => {
  const { tipo, q } = req.query;

  if (tipo && !TIPOS_ADMITIDOS.has(sinTildes(tipo))) {
    return res.status(400).json({
      error: "tipo no válido",
      tipos_admitidos: [...TIPOS_ADMITIDOS],
    });
  }

  const filtrados = filtrarDatos({ tipo, q });
  const total = filtrados.length;

  if (total === 0) {
    return res.json({ total, start: 0, end: -1, count: 0, data: [] });
  }

  const start = Number.isFinite(Number(req.query.start))
    ? parseInt(req.query.start, 10)
    : 0;

  const end = Number.isFinite(Number(req.query.end))
    ? parseInt(req.query.end, 10)
    : Math.min(start + 19, total - 1); // 20 por defecto

  const s = Math.max(0, Math.min(start, total - 1));
  const e = Math.max(s, Math.min(end, total - 1));

  const data = filtrados.slice(s, e + 1).map(mapearSalida);

  res.json({
    total,
    start: s,
    end: e,
    count: data.length,
    data,
  });
});

// GET /espacios/ids
// Devuelve una lista con todos los IDs de espacios culturales disponibles
router.get("/ids", (req, res) => {
  try {
    const ids = RAW.map((it) => getCampo(it, ["espacio_cultural_id"]))
      .filter((id) => id !== undefined && id !== null && id !== "")
      .map((id) => String(id));

    if (ids.length === 0) {
      return res.json({ total: 0, ids: [] });
    }

    res.json({ total: ids.length, ids });
  } catch (err) {
    console.error("GET /espacios/ids error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /espacios/espacio/:id
router.get("/espacio/:id", (req, res) => {
  try {
    const id = (req.params?.id ?? req.query?.id ?? "").toString();
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const it = buscarEspacioPorId(id);
    if (!it) return res.status(404).json({ error: "Espacio no encontrado" });

    return res.json(mapearSalida(it));
  } catch (err) {
    console.error("GET /espacios/:id error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;