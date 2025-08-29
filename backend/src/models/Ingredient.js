/* Schema for ingredients stored in MongoDB using a mongoose model */
/* Parameters include userId (which also functions as the index for the Schema), name of Ingredient, and time created (for sorting, oldest ingredient appear first) */

import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true, trim: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

IngredientSchema.index(
    { userId: 1, name: 1 },
    { unique: true, collation: {locale: "en", strength: 2 } }
);

export default mongoose.model("Ingredient", IngredientSchema)