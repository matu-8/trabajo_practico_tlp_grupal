import express from "express";
import type { Express, Router } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

export function createApp(apiRouter: Router): Express {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api", apiRouter);

  return app;
}
