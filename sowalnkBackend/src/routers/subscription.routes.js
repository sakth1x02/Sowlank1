import { Router } from "express";
import {
  createSubscription,
  verifySubscription,
  getSubscriptionStatus,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT); // Protect all subscription routes

router.post("/create", createSubscription);
router.post("/verify", verifySubscription);
router.get("/status", getSubscriptionStatus);

export default router;
