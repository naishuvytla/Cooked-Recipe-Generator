// src/pages/Pantry.jsx
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import RecipeCard from "../components/RecipeCard.jsx";

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
        } catch {}
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
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4">Your Pantry</h2>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add an ingredient"
          className="w-full max-w-md rounded-lg border px-3 py-2"
        />
        <button
          onClick={handleAdd}
          disabled={!newName.trim() || loading}
          className={`rounded-lg px-4 py-2 text-white ${
            !newName.trim() || loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:opacity-90"
          }`}
        >
          Add
        </button>
      </div>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      {(loading || generating) && <div className="mb-3 text-sm text-gray-600">Working...</div>}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
        {ingredients.length === 0 && !loading && (
          <div className="text-gray-500 col-span-full">
            No ingredients yet, add your first one above
          </div>
        )}

        {ingredients.map((it) => {
          const selected = selectedIds.has(it._id);
          return (
            <div
              key={it._id}
              className={`flex items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-sm select-none cursor-pointer transition
                ${selected ? "bg-gray-100 ring-2 ring-gray-900 font-medium" : "bg-white hover:bg-gray-50"}`}
              onClick={() => toggleSelect(it._id)}
              title={selected ? "Selected" : "Click to select"}
            >
              <span className="truncate">{it.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(it._id); }}
                className="ml-2 text-xs rounded-full border px-2 py-0.5 hover:bg-gray-100"
                aria-label={`Delete ${it.name}`}
                title="Delete"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8">
        <button
          onClick={handleGenerateRecipe}
          disabled={nothingSelected || loading || generating}
          className={`rounded-lg px-4 py-2 ${
            nothingSelected || loading || generating
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-900 text-white hover:opacity-90"
          }`}
          title={nothingSelected ? "Select ingredients first" : "Generate a recipe"}
        >
          {generating ? "Generating..." : "Generate Recipe"}
        </button>
      </div>

      <RecipeCard recipe={recipe} />
    </main>
  );
}