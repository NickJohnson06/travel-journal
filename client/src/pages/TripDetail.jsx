import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function TripDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [trip, setTrip] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [tripRes, entryRes] = await Promise.all([
          api.get(`/trips/${id}`),
          api.get("/entries", { params: { tripId: id } }),
        ]);

        if (!cancelled) {
          setTrip(tripRes.data.trip);
          setEntries(entryRes.data.entries || []);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Failed to load trip.");
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDeleteEntry(entryId) {
    const yes = window.confirm("Delete this entry? This cannot be undone.");
    if (!yes) return;
    try {
      await api.delete(`/entries/${entryId}`);
      setEntries((prev) => prev.filter((e) => e._id !== entryId));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete entry.");
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

  if (error || !trip) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="card p-6">
          <h1 className="text-xl font-semibold text-white mb-2">
            Trip not available
          </h1>
          <p className="text-sm text-slate-400 mb-4">
            {error || "We couldn't find this trip."}
          </p>
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

  const start = new Date(trip.startDate).toLocaleDateString();
  const end = new Date(trip.endDate).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => nav("/dashboard")}
          className="text-xs text-slate-400 hover:text-slate-200 transition"
        >
          ← Back to dashboard
        </button>
        <div className="flex gap-3">
          <button
            onClick={() => nav(`/trips/${trip._id}/edit`)}
            className="px-3 py-1.5 rounded-xl border border-slate-700 text-slate-200 text-xs hover:bg-slate-800/60"
          >
            Edit Trip
          </button>
          <button
            onClick={() => nav(`/trips/${trip._id}/entries/new`)}
            className="px-3 py-1.5 rounded-xl bg-sandsun text-skydeep text-xs font-semibold hover:bg-yellow-400 transition"
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Trip summary card */}
      <section className="card p-6 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">{trip.name}</h1>
            <p className="text-sm text-slate-400">{trip.location}</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p>
              {start} → {end}
            </p>
            {trip.budget !== undefined && trip.budget !== null && (
              <p className="mt-1">
                Budget:{" "}
                <span className="text-sandsun font-medium">
                  ${trip.budget}
                </span>
              </p>
            )}
          </div>
        </div>

        {trip.notes && (
          <p className="text-sm text-slate-300 whitespace-pre-wrap">
            {trip.notes}
          </p>
        )}
      </section>

      {/* Journal section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-skyaqua">Travel Journal</h2>
          <button
            onClick={() => nav(`/trips/${trip._id}/entries/new`)}
            className="text-xs text-skyaqua hover:text-sky-300 transition"
          >
            + New entry
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="card p-4 text-sm text-slate-300">
            No journal entries yet. Start by adding your first memory from this
            trip.
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <EntryCard
                key={entry._id}
                entry={entry}
                onEdit={() => nav(`/entries/${entry._id}/edit`)}
                onDelete={() => handleDeleteEntry(entry._id)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EntryCard({ entry, onEdit, onDelete }) {
  const date = new Date(entry.date).toLocaleDateString();
  return (
    <article className="card p-4 border-l-4 border-skyaqua/70">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{entry.title}</h3>
          <span className="text-xs text-slate-400">{date}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-[11px] text-skyaqua hover:text-sky-300"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-[11px] text-red-400 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-300 line-clamp-3">
        {entry.content}
      </p>
    </article>
  );
}