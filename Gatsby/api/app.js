// src/app.js
import express from "express";
import cors from "cors";
import espaciosRouter from "./routes/espacios.routes.js";
import valoracionesRouter from "./routes/valoraciones.routes.js";
import noticiasRouter from "./routes/noticias.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/espacios", espaciosRouter);
app.use("/valoraciones", valoracionesRouter);
app.use("/noticias", noticiasRouter);

export default app;
