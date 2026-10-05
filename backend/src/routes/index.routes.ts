import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { bookRouter } from "./book.routes.js";
import { subscriptionRouter } from "./subscription.routes.js";
import { notificationRouter } from "./notification.routes.js";
import { userRouter } from "./user.routes.js";

export const router: Router = Router();

router.use(authRouter);
router.use(bookRouter);
router.use(subscriptionRouter);
router.use(notificationRouter);
router.use(userRouter);
