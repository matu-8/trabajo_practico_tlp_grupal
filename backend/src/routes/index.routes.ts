import { Router } from "express";
import { authRouter } from "./auth.routes.js";

export const router: Router = Router();

router.use(authRouter);
