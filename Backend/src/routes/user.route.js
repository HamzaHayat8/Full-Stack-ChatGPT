import { Router } from "express";

import {
  register,
  login,
  getUser,
  getPublicImg,
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getUser", auth, getUser);
router.get("/getPublicImg", auth, getPublicImg);

export default router;
