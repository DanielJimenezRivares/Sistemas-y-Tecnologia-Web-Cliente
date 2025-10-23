// src/api/valoraciones/valoraciones.routes.js
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.resolve(__dirname, "../../data/valoraciones.json");
console.log("🗂️ Valoraciones DB path:", DATA_PATH);

// ---------- Utils de persistencia ----------
function ensureDataFile() {
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, "{}", "utf-8");
  }
}
function readDB() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const obj = JSON.parse(raw || "{}");
  return obj && typeof obj === "object" ? obj : {};
}
function writeDB(db) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(db, null, 2), "utf-8");
}

// ---------- Helpers ----------
const isIntInRange = (n, min, max) =>
  Number.isInteger(n) && n >= min && n <= max;

const toISO = (ts) => {
  if (!ts) return new Date().toISOString();
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
};

// Estructura por ID:
// db[espacio_cultural_id] = {
//   sum: number,               // suma de ratings para precisión
//   count: number,             // nº de valoraciones
//   reviews: [                 // lista de valoraciones
//     { rating: number, review?: string, timestamp: string }
//   ]
// }
// overall = sum / count  (se calcula al vuelo al responder)

// ---------- POST /valoraciones ----------
router.post("/", (req, res) => {
  try {
    const { espacio_cultural_id, rating, review, timestamp, username } = req.body || {};

    // --- Basic validation ---
    if (
      espacio_cultural_id === undefined ||
      espacio_cultural_id === null ||
      (typeof espacio_cultural_id !== "string" &&
        typeof espacio_cultural_id !== "number")
    ) {
      return res.status(400).json({
        error: "espacio_cultural_id is required (string or number)",
      });
    }

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return res.status(400).json({
        error: "rating must be an integer between 0 and 5",
      });
    }

    const ts = timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
    const text = typeof review === "string" ? review.trim() : undefined;
    const user = typeof username === "string" ? username.trim() : "Anonymous";

    // --- Load / update DB ---
    const db = readDB();
    const key = String(espacio_cultural_id);

    if (!db[key]) {
      db[key] = { sum: 0, count: 0, reviews: [] };
    }

    db[key].reviews.push({
      rating: ratingNum,
      ...(text ? { review: text } : {}),
      username: user, // 👈 new field
      timestamp: ts,
    });

    db[key].sum += ratingNum;
    db[key].count += 1;

    writeDB(db);

    const overall = db[key].sum / db[key].count;

    return res.status(201).json({
      id: key,
      overall,
      count: db[key].count,
      lastReview: {
        rating: ratingNum,
        review: text ?? null,
        username: user, // 👈 include here too
        timestamp: ts,
      },
      message: "rating stored",
    });
  } catch (err) {
    console.error("POST /valoraciones error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// GET /valoraciones/rating/:id?  (also supports ?id=)
router.get("/rating/:id", (req, res) => {
  try {
    const id = (req.params?.id ?? req.query?.id ?? "").toString();
    if (!id) {
      return res.status(400).json({ error: "id is required" });
    }

    const db = readDB();
    const rec = db[String(id)];

    if (!rec) {
      // Devolvemos 200 con zeros para facilitar el consumo
      return res.json({ id: String(id), overall: 0, count: 0 });
    }
    const overall = rec.count > 0 ? rec.sum / rec.count : 0;
    return res.json({ id: String(id), overall, count: rec.count });
  } catch (err) {
    console.error("GET /valoraciones/rating/:id error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

// GET /valoraciones/reviews/:id?start=&end=   (also supports ?id= via optional param)
router.get("/reviews/:id?", (req, res) => {
  try {
    const id = (req.params?.id ?? req.query?.id ?? "").toString();
    if (!id) return res.status(400).json({ error: "id is required" });

    const db = readDB();
    const rec = db[id];

    if (!rec || !Array.isArray(rec.reviews) || rec.reviews.length === 0) {
      return res.json({ id, total: 0, start: 0, end: -1, count: 0, data: [] });
    }

    // Sort most recent first
    const sorted = [...rec.reviews].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const total = sorted.length;

    const start = Number.isFinite(Number(req.query.start))
      ? parseInt(req.query.start, 10)
      : 0;

    const end = Number.isFinite(Number(req.query.end))
      ? parseInt(req.query.end, 10)
      : Math.min(start + 19, total - 1); // default 20 items

    const s = Math.max(0, Math.min(start, total - 1));
    const e = Math.max(s, Math.min(end, total - 1));

    // Ensure each review has username (fallback to "Anonymous")
    const page = sorted.slice(s, e + 1).map(r => ({
      rating: r.rating,
      review: r.review ?? null,
      username: (typeof r.username === "string" && r.username.trim()) ? r.username.trim() : "Anonymous",
      timestamp: r.timestamp
    }));

    return res.json({ id, total, start: s, end: e, count: page.length, data: page });
  } catch (err) {
    console.error("GET /valoraciones/reviews error:", err);
    return res.status(500).json({ error: "internal server error" });
  }
});

export default router;
