export default function RecipeCard({ recipe }) {
  if (!recipe) return null;

  const { title, servings, timeMinutes, ingredientsUsed, additionalIngredients, steps } = recipe;

  return (
    <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">
        {servings ? `${servings} serving${servings > 1 ? "s" : ""}` : null}
        {servings && timeMinutes ? " • " : ""}
        {timeMinutes ? `${timeMinutes} min` : null}
      </p>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Ingredients Used</h4>
        <div className="flex flex-wrap gap-2">
          {ingredientsUsed?.map((s, i) => (
            <span key={i} className="rounded-full border px-3 py-1 text-sm bg-gray-50">
              {s}
            </span>
          ))}
        </div>
      </div>

      {additionalIngredients && additionalIngredients.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Additional Ingredients</h4>
          <div className="flex flex-wrap gap-2">
            {additionalIngredients.map((s, i) => (
              <span key={i} className="rounded-full border px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h4 className="font-medium mb-2">Steps</h4>
        <ol className="list-decimal pl-5 space-y-2">
          {steps?.map((step, i) => (
            <li key={i} className="text-gray-800">{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}