import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function AiPlanner() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    days: "4",
    style: "",
    budgetLevel: "midrange",
  });
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [error, setError] = useState("");
  const [createdTrip, setCreatedTrip] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.destination.trim()) {
      return "Destination is required.";
    }
    if (!form.startDate) {
      return "Start date is required.";
    }
    if (!form.endDate) {
      return "End date is required.";
    }
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (end < start) {
      return "End date cannot be before start date.";
    }
    const daysNum = Number(form.days);
    if (Number.isNaN(daysNum) || daysNum <= 0 || daysNum > 30) {
      return "Trip length must be between 1 and 30 days.";
    }
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setItinerary("");
    setCreatedTrip(null);

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setLoading(true);
    try {
      // 1) Ask AI to generate itinerary via OpenRouter backend route
      const aiPayload = {
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        days: Number(form.days),
        style: form.style.trim() || undefined,
        budgetLevel: form.budgetLevel,
      };

      const aiRes = await api.post("/ai/itinerary", aiPayload);
      const aiText = aiRes.data.itinerary || "";
      if (!aiText) {
        throw new Error("No itinerary returned from AI.");
      }

      // 2) Save Trip based on planner form
      const tripPayload = {
        name: `Trip to ${form.destination.trim()}`,
        location: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        budget: 0,
        notes: form.style
          ? `AI-generated ${form.style} itinerary. Budget: ${form.budgetLevel}.`
          : `AI-generated itinerary. Budget: ${form.budgetLevel}.`,
      };

      const tripRes = await api.post("/trips", tripPayload);
      const newTrip = tripRes.data.trip;

      // 3) Save itinerary as first entry for that trip
      const entryPayload = {
        tripId: newTrip._id,
        title: "AI-generated itinerary",
        date: form.startDate || new Date().toISOString().slice(0, 10),
        content: aiText,
      };

      await api.post("/entries", entryPayload);

      // 4) Update local state for UI
      setItinerary(aiText);
      setCreatedTrip(newTrip);
    } catch (err) {
      console.error("AI planner error:", err);
      setError(
        err.response?.data?.error ||
          "Failed to generate and save itinerary. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            RoamLog AI Planner
          </h1>
          <p className="text-xs text-slate-400">
            Start with your destination and dates — we&apos;ll generate a full itinerary and save it as a trip.
          </p>
        </div>
        <button
          type="button"
          onClick={() => nav("/trips/new")}
          className="text-xs px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-900/70 transition"
        >
          + Add trip manually
        </button>
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
              max="30"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.days}
              onChange={(e) => update("days", e.target.value)}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              End Date *
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.endDate}
              onChange={(e) => update("endDate", e.target.value)}
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
            {loading ? "Planning your journey..." : "Generate & Save Itinerary"}
          </button>
        </div>
      </form>

      <section className="card p-6 min-h-[160px] space-y-3">
        <h2 className="text-sm font-semibold text-white">
          Suggested Itinerary
        </h2>

        {!itinerary && !loading && !error && (
          <p className="text-xs text-slate-400">
            Fill in your trip details above and let RoamLog draft a day-by-day plan, then we&apos;ll save it to your trips automatically.
          </p>
        )}

        {loading && (
          <p className="text-xs text-slate-400">
            Asking the AI planner for ideas...
          </p>
        )}

        {itinerary && (
          <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
            {itinerary}
          </div>
        )}

        {createdTrip && (
          <div className="pt-3 border-t border-slate-800 mt-2 flex items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400">
              This itinerary has been saved as{" "}
              <span className="text-sandsun font-medium">
                {createdTrip.name}
              </span>{" "}
              in your trips.
            </p>
            <button
              type="button"
              onClick={() => nav(`/trips/${createdTrip._id}`)}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 border border-skyaqua/60 text-skyaqua hover:bg-slate-900/80 transition"
            >
              View trip
            </button>
          </div>
        )}
      </section>
    </div>
  );
}