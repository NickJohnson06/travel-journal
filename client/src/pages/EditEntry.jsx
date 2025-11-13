import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function EditEntry() {
  const { entryId } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    date: "",
    content: "",
    photoUrl: "",
  });
  const [tripId, setTripId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function validate() {
    if (!form.title.trim()) return "Title is required.";
    if (!form.date) return "Date is required.";
    if (form.content.trim().length < 10)
      return "Content must be at least 10 characters.";
    return "";
  }

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/entries/${entryId}`);
        if (!cancelled) {
          const e = res.data.entry;
          setForm({
            title: e.title || "",
            date: e.date?.slice(0, 10) || "",
            content: e.content || "",
            photoUrl: e.photoUrl || "",
          });
          setTripId(e.tripId);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load entry.");
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [entryId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        date: form.date,
        content: form.content.trim(),
        photoUrl: form.photoUrl || undefined,
      };
      await api.put(`/entries/${entryId}`, payload);
      nav(`/trips/${tripId}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update entry.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg">
        <p className="text-slate-300 text-sm tracking-wide">
          Loading entry...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="card p-6">
          <h1 className="text-xl font-semibold text-white mb-2">
            Entry not available
          </h1>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => nav(tripId ? `/trips/${tripId}` : "/dashboard")}
            className="px-3 py-2 rounded-xl bg-skyaqua text-skydeep text-sm font-semibold hover:bg-sky-400 transition"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit Entry</h1>
          <p className="text-xs text-slate-400">
            Update the details of this memory.
          </p>
        </div>
        <button
          onClick={() => nav(`/trips/${tripId}`)}
          className="text-xs text-slate-400 hover:text-slate-200 transition"
        >
          Cancel
        </button>
      </header>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Title *</label>
          <input
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Date *</label>
          <input
            type="date"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Photo URL (optional)
          </label>
          <input
            type="url"
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.photoUrl}
            onChange={(e) => update("photoUrl", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Story *</label>
          <textarea
            rows={5}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-skyaqua"
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => nav(`/trips/${tripId}`)}
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