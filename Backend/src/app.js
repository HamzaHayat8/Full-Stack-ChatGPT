import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { webhookStripe } from "./controllers/plans.controller.js";

const app = express();

app.post("/webhook", express.raw({ type: "application/json" }), webhookStripe);

// Regular middlewares
app.use(cors());
app.use(express.json());

// Routes
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import planRoutes from "./routes/plans.route.js";

app.use("/api/v1", userRoutes);
app.use("/api/v2", chatRoutes);
app.use("/api/v3", planRoutes);

export default app;
