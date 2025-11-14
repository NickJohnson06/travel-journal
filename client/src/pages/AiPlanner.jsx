import { useState } from "react";
import { api } from "../lib/api";

export default function AiPlanner() {
  const [form, setForm] = useState({
    destination: "",
    days: "4",
    style: "",
    budgetLevel: "midrange",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setItinerary("");

    if (!form.destination.trim()) {
      return setError("Destination is required.");
    }

    setLoading(true);
    try {
      const payload = {
        destination: form.destination.trim(),
        days: Number(form.days) || 4,
        style: form.style.trim() || undefined,
        budgetLevel: form.budgetLevel,
      };

      const res = await api.post("/ai/itinerary", payload);
      setItinerary(res.data.itinerary || "");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to generate itinerary. Try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">
          RoamLog AI Planner
        </h1>
        <p className="text-xs text-slate-400">
          Let our travel assistant draft a personalized itinerary for your next trip.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Destination *
            </label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              placeholder="Tokyo, Paris, New York..."
              value={form.destination}
              onChange={(e) => update("destination", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Trip Length (days)
            </label>
            <input
              type="number"
              min="1"
              max="14"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.days}
              onChange={(e) => update("days", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Travel Style (optional)
            </label>
            <input
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              placeholder="food-focused, museums, nightlife, nature..."
              value={form.style}
              onChange={(e) => update("style", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Budget Level
            </label>
            <select
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.budgetLevel}
              onChange={(e) => update("budgetLevel", e.target.value)}
            >
              <option value="budget">Budget</option>
              <option value="midrange">Midrange</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-skyaqua text-skydeep text-sm font-semibold hover:bg-sky-400 transition disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>
      </form>

      <section className="card p-6 min-h-[160px]">
        <h2 className="text-sm font-semibold text-white mb-2">
          Suggested Itinerary
        </h2>
        {!itinerary && !loading && !error && (
          <p className="text-xs text-slate-400">
            Fill in your trip details above and let RoamLog draft a day-by-day plan.
          </p>
        )}
        {itinerary && (
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {itinerary}
          </div>
        )}
        {loading && (
          <p className="text-xs text-slate-400">
            Asking the AI travel planner for ideas...
          </p>
        )}
      </section>
    </div>
  );
}