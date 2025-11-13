import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function EditTrip() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    location: "",
    startDate: "",
    endDate: "",
    budget: "",
    notes: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (!form.name.trim()) return "Trip name is required.";
    if (!form.location.trim()) return "Location is required.";
    if (!form.startDate) return "Start date is required.";
    if (!form.endDate) return "End date is required.";
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    if (end < start) return "End date cannot be before start date.";
    if (form.budget !== "" && Number(form.budget) < 0)
      return "Budget cannot be negative.";
    return "";
  }

  // Load existing trip data
  useEffect(() => {
    let cancelled = false;

    async function loadTrip() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/trips/${id}`);
        if (cancelled) return;
        const t = res.data.trip;
        setForm({
          name: t.name || "",
          location: t.location || "",
          startDate: (t.startDate || "").slice(0, 10),
          endDate: (t.endDate || "").slice(0, 10),
          budget:
            t.budget !== undefined && t.budget !== null ? String(t.budget) : "",
          notes: t.notes || "",
          imageUrl: t.imageUrl || "",
        });
        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load trip.");
          setLoading(false);
        }
      }
    }

    loadTrip();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget === "" ? 0 : Number(form.budget),
        notes: form.notes,
        imageUrl: form.imageUrl || undefined,
      };
      await api.put(`/trips/${id}`, payload);
      nav(`/trips/${id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update trip.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg">
        <p className="text-slate-300 text-sm tracking-wide">
          Loading trip details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="card p-6">
          <h1 className="text-xl font-semibold text-white mb-2">
            Trip not available
          </h1>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => nav("/dashboard")}
            className="px-3 py-2 rounded-xl bg-skyaqua text-skydeep text-sm font-semibold hover:bg-sky-400 transition"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white">Edit Trip</h1>
        <p className="text-xs text-slate-400">
          Update the details of your journey.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Trip Name *</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Location *</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Start Date *</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">End Date *</label>
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
            <label className="block text-xs text-slate-400 mb-1">Budget (USD)</label>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.budget}
              onChange={(e) => update("budget", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Cover Image URL (optional)
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Notes</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => nav(`/trips/${id}`)}
            className="px-3 py-2 rounded-xl border border-slate-700 text-slate-200 text-sm hover:bg-slate-800/60"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-skyaqua text-skydeep text-sm font-semibold hover:bg-sky-400 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}