import { Router } from "express";
import { z } from "zod";
import Ingredient from "../models/Ingredient.js";
import { getModel } from "../gemini.js";

const router = Router();

const generateBodySchema = z.object({
  ingredientIds: z.array(z.string().min(1)).min(1, "Select at least one ingredient"),
});

export const recipeSchema = z.object({
  title: z.string(),
  servings: z.number().int().positive().optional().default(2),
  timeMinutes: z.number().int().positive().optional().default(20),
  ingredientsUsed: z.array(z.string()),
  additionalIngredients: z.array(z.string()),
  steps: z.array(z.string().min(1)),
});

function extractJson(text) {
  const cleaned = text.replace(/```json|```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in model response.");
  }
  const slice = cleaned.slice(start, end + 1);
  return JSON.parse(slice);
}

/* POST /api/recipes/generate - returns recipe JSON */
router.post("/generate", async (req, res) => {
  const parsed = generateBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { ingredientIds } = parsed.data;
  const { userId } = req.auth();

  const docs = await Ingredient.find({ _id: { $in: ingredientIds }, userId })
    .lean();
  if (docs.length === 0) {
    return res.status(400).json({ error: "No matching ingredients found." });
  }
  const names = docs.map(d => d.name);

  const prompt = `
You are a home-cooking assistant. The user ONLY has these ingredients:
${names.join(", ")}

Constraints:
- Make ONE practical recipe an average person can cook.
- Prefer using ONLY the provided ingredients.
- If you think of extras that would improve it, list them under "additionalIngredients". Keep it short (<= 5 items).
- Keep steps compact (1-2 sentences each). 4–8 steps total.
- Total time estimate is "timeMinutes" as a number (minutes).

Return ONLY valid JSON matching this TypeScript type:
{
  "title": string,
  "servings": number,
  "timeMinutes": number,
  "ingredientsUsed": string[],
  "additionalIngredients": string[],
  "steps": string[]
}
  `.trim();

  try {
    const model = getModel();
    const response = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }]}] });
    const text = response.response.text();

    let obj = extractJson(text);
    const validated = recipeSchema.parse(obj);

    return res.json(validated);

  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(500).json({
      error: "Failed to generate recipe, please try again",
      details: process.env.NODE_ENV === "development" ? String(err) : undefined,
    });
  }
});

export default router;