// src/api/noticias/noticias.routes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reutiliza el JSON de espacios (ajusta si tu ruta real es otra)
const ESPACIOS_PATH = path.resolve(__dirname, "../data/espacios-culturales.json");

// Cache generado 1 vez
const CACHE_PATH = path.resolve(__dirname, "../data/noticias-cache.json");

const NOTICIAS_POR_ESPACIO = 5;

// -------------------- Utils --------------------
function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
function readJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}
function getMTimeMs(p) {
  return fs.statSync(p).mtimeMs;
}
function writeJSONAtomic(p, data) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const tmp = `${p}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmp, p);
}

// RNG determinista (para fechas estables)
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function isoFromDaysAgo(daysAgo, minutesOffset = 0) {
  const ms = daysAgo * 24 * 60 * 60 * 1000 + minutesOffset * 60 * 1000;
  return new Date(Date.now() - ms).toISOString();
}

const LOREM = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
  "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
  "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra.",
  "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.",
  "In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.",
].join(" ");

function generarNoticiasDesdeEspacios(espacios) {
  const all = [];

  for (const it of espacios) {
    const espacioId = String(it?.espacio_cultural_id ?? "").trim();
    if (!espacioId) continue;

    const nombre = String(it?.espacio_cultura_nombre ?? "").trim() || "Espacio cultural";

    const rng = mulberry32(hashSeed(`news:${espacioId}`));

    for (let i = 0; i < NOTICIAS_POR_ESPACIO; i++) {
      // Fecha estable: entre 1 y 180 días atrás
      const daysAgo = 1 + Math.floor(rng() * 180);
      const minutesOffset = Math.floor(rng() * 24 * 60);

      all.push({
        id: `n-${espacioId}-${i}`,
        fecha: isoFromDaysAgo(daysAgo, minutesOffset),
        titulo: `Noticia ${i + 1} - ${nombre}`,
        cuerpo: LOREM,
        espacio: { id: espacioId }, // 👈 requerido: id existe
      });
    }
  }

  all.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  return all;
}

function getOrBuildNoticias() {
  if (!fileExists(ESPACIOS_PATH)) {
    throw new Error(`No existe el source de espacios: ${ESPACIOS_PATH}`);
  }
  const sourceM = getMTimeMs(ESPACIOS_PATH);

  if (!fileExists(CACHE_PATH)) {
    const espacios = readJSON(ESPACIOS_PATH);
    const noticias = generarNoticiasDesdeEspacios(espacios);
    writeJSONAtomic(CACHE_PATH, {
      generatedAt: new Date().toISOString(),
      sourceMTimeMs: sourceM,
      total: noticias.length,
      data: noticias,
    });
    return noticias;
  }

  const cacheObj = readJSON(CACHE_PATH);
  const cacheSourceM = cacheObj?.sourceMTimeMs ?? 0;

  if (sourceM > cacheSourceM) {
    const espacios = readJSON(ESPACIOS_PATH);
    const noticias = generarNoticiasDesdeEspacios(espacios);
    writeJSONAtomic(CACHE_PATH, {
      generatedAt: new Date().toISOString(),
      sourceMTimeMs: sourceM,
      total: noticias.length,
      data: noticias,
    });
    return noticias;
  }

  return Array.isArray(cacheObj?.data) ? cacheObj.data : [];
}

// -------------------- Rutas --------------------

// GET /noticias?start=0&end=19  (paginado global)
router.get("/", (req, res) => {
  try {
    const all = getOrBuildNoticias(); // tu función que devuelve array de noticias ya ordenadas (desc)

    const total = all.length;
    if (total === 0) {
      return res.json({ total: 0, start: 0, end: -1, count: 0, data: [] });
    }

    const start = Number.isFinite(Number(req.query.start))
      ? parseInt(req.query.start, 10)
      : 0;

    const end = Number.isFinite(Number(req.query.end))
      ? parseInt(req.query.end, 10)
      : Math.min(start + 19, total - 1);

    const s = Math.max(0, Math.min(start, total - 1));
    const e = Math.max(s, Math.min(end, total - 1));

    const data = all.slice(s, e + 1);

    return res.json({
      total,
      start: s,
      end: e,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("GET /noticias error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});


// GET /noticias/recientes?limit=10
router.get("/recientes", (req, res) => {
  try {
    const limitRaw = Number.isFinite(Number(req.query.limit))
      ? parseInt(req.query.limit, 10)
      : 10;
    const limit = Math.max(1, Math.min(limitRaw, 100));

    const all = getOrBuildNoticias();
    const data = all.slice(0, limit).map((n) => ({
      id: n.id,
      fecha: n.fecha,
      titulo: n.titulo,
      espacio: { id: String(n?.espacio?.id || "") },
    }));

    return res.json({
      total: all.length,
      limit,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("GET /noticias/recientes error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /noticias/espacio/:id?limit=5
router.get("/espacio/:id", (req, res) => {
  try {
    const id = String(req.params?.id ?? "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const limitRaw = Number.isFinite(Number(req.query.limit))
      ? parseInt(req.query.limit, 10)
      : 5;
    const limit = Math.max(1, Math.min(limitRaw, 20));

    const all = getOrBuildNoticias();
    const delEspacio = all.filter((n) => String(n?.espacio?.id) === id);

    // ya vienen ordenadas por fecha desc global, pero filtrando conservas orden
    const data = delEspacio.slice(0, limit).map((n) => ({
      id: n.id,
      fecha: n.fecha,
      titulo: n.titulo,
      espacio: { id },
    }));

    return res.json({
      espacio_id: id,
      total: delEspacio.length,
      limit,
      count: data.length,
      data,
    });
  } catch (err) {
    console.error("GET /noticias/espacio/:id error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

// GET /noticias/:id (detalle)
router.get("/:id", (req, res) => {
  try {
    const id = String(req.params?.id ?? "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });

    const all = getOrBuildNoticias();
    const noticia = all.find((n) => n?.id === id) || null;

    if (!noticia) return res.status(404).json({ error: "Noticia no encontrada" });
    return res.json({ data: noticia });
  } catch (err) {
    console.error("GET /noticias/:id error:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
