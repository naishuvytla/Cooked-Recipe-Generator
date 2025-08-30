import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import RecipeCard from "../components/RecipeCard.jsx";
import JarCard from "../components/JarCard.jsx";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Pantry() {
  const [ingredients, setIngredients] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [generating, setGenerating] = useState(false);

  const { getToken } = useAuth();

  const api = useMemo(() => {
    return async (path, options = {}) => {
      const token = await getToken();
      const res = await fetch(`${API_BASE}${path}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(options.headers || {}),
        },
        ...options,
      });
      if (!res.ok) {
        let msg = `Request failed (${res.status})`;
        try {
          const body = await res.json();
          if (body?.error) msg = Array.isArray(body.error) ? body.error.join(", ") : body.error;
        } catch { }
        throw new Error(msg);
      }
      try { return await res.json(); } catch { return null; }
    };
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const items = await api("/api/ingredients");
        if (!cancelled) setIngredients(items);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load ingredients.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [api]);

  async function handleAdd() {
    const trimmed = newName.trim();
    if (!trimmed) return;
    setLoading(true);
    setError("");
    try {
      const created = await api("/api/ingredients", {
        method: "POST",
        body: JSON.stringify({ name: trimmed }),
      });
      setIngredients((prev) => [created, ...prev]);
      setNewName("");
    } catch (e) {
      setError(e.message || "Failed to add ingredient.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    setLoading(true);
    setError("");
    try {
      await api(`/api/ingredients/${id}`, { method: "DELETE" });
      setIngredients((prev) => prev.filter((it) => it._id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (e) {
      setError(e.message || "Failed to delete ingredient.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleGenerateRecipe() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;

    setGenerating(true);
    setError("");
    setRecipe(null);
    try {
      const data = await api("/api/recipes/generate", {
        method: "POST",
        body: JSON.stringify({ ingredientIds: ids }),
      });
      setRecipe(data);
    } catch (e) {
      setError(e.message || "Failed to generate recipe.");
    } finally {
      setGenerating(false);
    }
  }

  const nothingSelected = selectedIds.size === 0;

  return (
    <main className="min-h-screen pt-10 pb-24 px-4">
      <div className="w-full max-w-2xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-5 text-white drop-shadow-lg">Your Pantry</h2>

        <div className="w-full max-w-md mx-auto mb-6 flex items-center gap-3 justify-center">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add an ingredient"
            className="flex-1 rounded-lg px-4 py-3 bg-white/50 text-black placeholder:text-black"
          />
          <button
            onClick={handleAdd}
            disabled={!newName.trim() || loading}
            className={`rounded-lg px-5 py-3 text-white ${!newName.trim() || loading ? "bg-orange-800 cursor-not-allowed" : "bg-gray-900 hover:opacity-90"
              }`}
          >
            Add
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-200">{error}</div>}
        {(loading || generating) && <div className="mb-4 text-sm text-white/90">Working...</div>}

        <div className="mb-8 flex flex-wrap justify-center gap-6">
          {ingredients.length === 0 && !loading && (
            <div className="text-white/90">No ingredients yet, add your first one above.</div>
          )}
          {ingredients.map((it) => {
            const selected = selectedIds.has(it._id);
            return (
              <JarCard
                key={it._id}
                label={it.name}
                seed={it._id}
                selected={selected}
                onClick={() => toggleSelect(it._id)}
                onDelete={() => handleDelete(it._id)}
              />
            );
          })}
        </div>

        <div className="w-full max-w-md mx-auto">
          <button
            onClick={handleGenerateRecipe}
            disabled={selectedIds.size === 0 || loading || generating}
            className={`w-full rounded-lg px-6 py-3 ${selectedIds.size === 0 || loading || generating
              ? "bg-orange-800 text-white cursor-not-allowed"
              : "bg-gray-900 text-white hover:opacity-90"
              }`}
          >
            {generating ? "Generating..." : "Generate Recipe"}
          </button>
        </div>

        <div className="mt-10 w-full max-w-xl mx-auto">
          <RecipeCard recipe={recipe} />
        </div>
      </div>
    </main>
  );
}