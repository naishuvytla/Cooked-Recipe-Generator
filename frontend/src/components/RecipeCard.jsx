export default function RecipeCard({ recipe }) {
  if (!recipe) return null;

  const {
    title,
    servings,
    timeMinutes,
    ingredientsUsed = [],
    additionalIngredients = [],
    steps = [],
  } = recipe;

  const Paper = ({ children }) => (
    <section
      className="relative mx-auto w-full max-w-3xl rounded-[28px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.25)] ring-1 ring-black/5"
      style={{
        backgroundColor: "#f2ece9ff",
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(0,0,0,0) 0, rgba(0,0,0,0) 34px, rgba(106, 71, 51, 0.3) 35px)",
      }}
    >
      {children}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 translate-y-6 rounded-b-[28px] bg-black/25 blur-2xl" />
    </section>
  );

  const Jar = ({ lid = "#8B8ED6", body = "#2350A5", size = 32 }) => (
    <svg viewBox="0 0 64 64" width={size} height={size} aria-hidden>
      <rect x="12" y="20" width="40" height="34" rx="12" ry="12" fill={body} />
      <rect x="8" y="12" width="48" height="10" rx="8" fill={lid} />
    </svg>
  );

  return (
    <Paper>
      <div className="grid grid-cols-[1fr_auto] items-start gap-4">
        {title && (
          <h3 className="mb-2 text-2xl sm:text-3xl font-semibold text-neutral-900 text-left">
            {title}
          </h3>
        )}
        <div className="hidden sm:block">
          <div className="relative">
            <div className="absolute -left-5 top-6 h-5 w-5 rounded-full bg-[#bb6b2e]" />
            <div className="absolute left-0 top-14 h-5 w-5 rounded-full bg-[#bb6b2e]" />
            <div className="rotate-12">
              <Jar size={60} lid="#8B8ED6" body="#505e7fff" />
            </div>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-neutral-600 text-left">
        {servings ? `${servings} serving${servings > 1 ? "s" : ""}` : "—"} •{" "}
        {timeMinutes ? `${timeMinutes} min` : "—"}
      </p>

      <h4 className="mt-2 text-base font-semibold text-neutral-800">
        Chosen Ingredients
      </h4>
      <div className="mt-2 mb-4 flex flex-wrap justify-center gap-2">
        {ingredientsUsed.map((s, i) => (
          <span
            key={`used-${i}`}
            className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-sm text-neutral-700 shadow-sm"
          >
            {s}
          </span>
        ))}
        {ingredientsUsed.length === 0 && (
          <span className="text-sm text-neutral-500">—</span>
        )}
      </div>

      <h4 className="mt-2 text-base font-semibold text-neutral-800">
        Additional Ingredients
      </h4>
      <div className="mt-2 mb-6 flex flex-wrap justify-center gap-2">
        {additionalIngredients.length > 0 ? (
          additionalIngredients.map((s, i) => (
            <span
              key={`add-${i}`}
              className="rounded-full border border-neutral-300/80 bg-white/80 px-3 py-1 text-sm text-neutral-600"
            >
              {s}
            </span>
          ))
        ) : (
          <span className="text-sm text-neutral-500">—</span>
        )}
      </div>

      <h4 className="mt-2 text-base font-semibold text-neutral-800">Steps</h4>
      <ol className="mx-auto mt-2 max-w-2xl list-decimal space-y-4 pl-6 text-left text-[15px] leading-relaxed text-neutral-900">
        {steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <div className="mt-8 hidden items-end gap-3 sm:flex">
        <Jar lid="#8B8ED6" body="#595b98ff" size={60} />
        <Jar lid="#799878ff" body="#4F6D4E" size={60} />
        <Jar lid="#C2A57A" body="#927851ff" size={60} />
      </div>
    </Paper>
  );
}