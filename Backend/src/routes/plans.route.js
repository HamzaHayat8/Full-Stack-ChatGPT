import { Router } from "express";

const router = Router();
import { getPlans, purchasePlan } from "../controllers/plans.controller.js";
import auth from "../middleware/auth.js";

router.get("/getPlans", getPlans);
router.post("/purchasePlan", auth, purchasePlan);

export default router;
