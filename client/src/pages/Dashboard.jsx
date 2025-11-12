import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Dashboard() {
  const nav = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trips")
      .then((res) => {
        setTrips(res.data.trips || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function categorizeTrips() {
    const now = new Date();
    const upcoming = [];
    const past = [];
    for (const t of trips) {
      const end = new Date(t.endDate);
      (end >= now ? upcoming : past).push(t);
    }
    return { upcoming, past };
  }

  const { upcoming, past } = categorizeTrips();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center app-bg">
        <p className="text-slate-300 text-sm tracking-wide">
          Loading your journeys...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="flex items-baseline justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Your Trips</h1>
          <p className="text-xs text-slate-400">
            Plan, track, and relive your adventures.
          </p>
        </div>
        <button
          onClick={() => nav("/trips/new")}
          className="px-3 py-1.5 rounded-xl bg-sandsun text-skydeep text-xs font-semibold hover:bg-yellow-400 transition"
        >
          + Plan new trip
        </button>
      </header>

      {trips.length === 0 ? (
        <div className="card p-6 text-center text-slate-300">
          No trips yet. Start by planning your first adventure!
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-skyaqua mb-3">
                ✈️ Upcoming Trips
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcoming.map((trip) => (
                  <TripCard key={trip._id} trip={trip} onClick={() => nav(`/trips/${trip._id}`)} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section>
              <h2 className="text-lg font-medium text-slate-400 mb-3">
                🗺️ Past Trips
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {past.map((trip) => (
                  <TripCard key={trip._id} trip={trip} onClick={() => nav(`/trips/${trip._id}`)} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function TripCard({ trip, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:bg-slate-900/90 transition p-4"
    >
      <h3 className="text-lg font-medium text-white mb-1">{trip.name}</h3>
      <p className="text-xs text-slate-400">{trip.location}</p>
      <p className="text-xs text-slate-500">
        {new Date(trip.startDate).toLocaleDateString()} →{" "}
        {new Date(trip.endDate).toLocaleDateString()}
      </p>
      {trip.notes && (
        <p className="mt-2 text-xs text-slate-400 line-clamp-2">
          {trip.notes}
        </p>
      )}
    </div>
  );
}