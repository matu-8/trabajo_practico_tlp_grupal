import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { Database } from "./src/config/connectionDb.js";
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

const startServer = () => {
  const db = Database.getInstance();
  try {
    db.testConnection();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:3000`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
