import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { Database, sequelize } from "./src/config/connectionDb.js";
import { seed } from "./src/config/seed.js";
import { setupAssociations } from "./src/models/associations.model.js";
import { router } from "./src/routes/index.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use("/api", router);

const PORT: string | number = process.env.PORT || 3000;

const startServer = async () => {
  const db = Database.getInstance();
  try {
    await db.testConnection();

    // Las asociaciones deben existir ANTES de consultar con `include`
    setupAssociations();

    // Crea las tablas que falten y carga los datos mínimos.
    // sync() es solo para desarrollo: en producción se usan migraciones.
    await sequelize.sync();
    await seed();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el servidor:", error);
    process.exit(1);
  }
};

void startServer();
