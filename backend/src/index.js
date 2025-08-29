import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { requireAuth, clerkMiddleware } from "@clerk/express";

import ingredientsRouter from "./routes/ingredients.js";
import recipesRouter from "./routes/recipes.js";

dotenv.config();

const app = express();
const origins =
  process.env.CORS_ORIGIN?.split(",").map(s => s.trim()) ?? [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

const corsOptions = {
  origin: origins,
  credentials: true,
  methods: ["GET", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/ingredients", requireAuth(), ingredientsRouter);
app.use("/api/recipes", requireAuth(), recipesRouter);

const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "pantry",
    });
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
}

start();