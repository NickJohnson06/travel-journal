import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [meRes, tripsRes] = await Promise.all([
          api.get("/auth/me"),
          api.get("/trips"),
        ]);

        if (cancelled) return;

        setUser(meRes.data.user || null);
        setTrips(tripsRes.data.trips || []);
        setLoading(false);
      } catch (_err) {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg">
        <p className="text-slate-300 text-sm tracking-wide">
          Loading your profile...
        </p>
      </div>
    );
  }

  const tripCount = trips.length;
  const now = new Date();
  const upcomingTrips = trips.filter(
    (t) => new Date(t.endDate) >= now
  );
  const upcomingCount = upcomingTrips.length;

  // Find a "favorite" location by frequency (if any trips exist)
  let favoriteDestination = "";
  if (trips.length > 0) {
    const counts = trips.reduce((acc, t) => {
      const loc = t.location || "Unknown";
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});
    favoriteDestination = Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">
          Traveler Profile
        </h1>
        <p className="text-xs text-slate-400">
          View your account and journey stats.
        </p>
      </header>

      <section className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">Logged in as</p>
          <p className="text-lg font-semibold text-white">
            {user?.username}
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <p className="text-slate-400">Total Trips</p>
            <p className="text-xl font-semibold text-sandsun">
              {tripCount}
            </p>
          </div>
          <div>
            <p className="text-slate-400">Upcoming Trips</p>
            <p className="text-xl font-semibold text-skyaqua">
              {upcomingCount}
            </p>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-2">
            Journey Summary
          </h2>
          {tripCount === 0 ? (
            <p className="text-xs text-slate-300">
              You haven&apos;t planned any trips yet. Start by creating your
              first adventure on the dashboard.
            </p>
          ) : (
            <ul className="text-xs text-slate-300 space-y-1">
              <li>Trips planned: {tripCount}</li>
              <li>Upcoming trips: {upcomingCount}</li>
              {favoriteDestination && (
                <li>Most visited destination: {favoriteDestination}</li>
              )}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white mb-2">
            Tips for your next journey
          </h2>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            <li>Use notes on each trip to track must-see spots.</li>
            <li>
              Add journal entries after each day to keep memories fresh.
            </li>
            <li>
              Keep all your trips organized from the dashboard view.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}