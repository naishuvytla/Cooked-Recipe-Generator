/* Routes for ingredients for GET, POST, DELETE API Calls */

import { Router } from "express";
import { z } from "zod";
import Ingredient from "../models/Ingredient.js";

const router = Router();

const createIngredientSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Keep ingredient names under 50 characters"),
});

const idParamSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

/* GET /api/ingredients - returns the user's ingredients (sorted by oldest first) */
router.get("/", async (req, res) => {
  const { userId } = req.auth();
  const items = await Ingredient.find({ userId })
    .collation({ locale: "en", strength: 2 })
    .sort({ createdAt: 1 })
    .lean();
  res.json(items);
});

/* POST /api/ingredients - add new ingredient */
router.post("/", async (req, res) => {
  const { userId } = req.auth();
  const result = createIngredientSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const name = result.data.name.trim();
  try {
    const doc = await Ingredient.create({ userId, name });
    res.status(201).json(doc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "Already added ingredient" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error creating ingredient" });
  }
});

/* DELETE /api/ingredients/:id - deletes ingredient (only if it belongs to the current user) */
router.delete("/:id", async (req, res) => {
  const { userId } = req.auth();
  const result = idParamSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.errors });
  }
  const { id } = result.data;
  const out = await Ingredient.deleteOne({ _id: id, userId });
  if (out.deletedCount === 0) {
    return res.status(404).json({ error: "Ingredient not found" });
  }
  res.json({ ok: true });
});

export default router;