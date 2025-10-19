import { Router } from "express";
const router = Router();

import {
  createChat,
  getChat,
  deleteChat,
} from "../controllers/chat.controller.js";
import {
  messageController,
  imageController,
} from "../controllers/message.controller.js";
import auth from "../middleware/auth.js";

router.get("/createChat", auth, createChat);
router.get("/getChat", auth, getChat);
router.delete("/deleteChat", auth, deleteChat);

router.post("/text", auth, messageController);
router.post("/image", auth, imageController);

export default router;
