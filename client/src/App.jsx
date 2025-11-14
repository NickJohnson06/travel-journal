import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./lib/api";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddTrip from "./pages/AddTrip.jsx";
import TripDetail from "./pages/TripDetail.jsx";
import AddEntry from "./pages/AddEntry.jsx";
import EditEntry from "./pages/EditEntry.jsx";
import EditTrip from "./pages/EditTrip.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";

function Protected({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="app-bg min-h-screen flex items-center justify-center">
        <p className="text-slate-300 text-xs tracking-wide">
          Checking your boarding pass...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar user={user} />
      <main className="pt-16 pb-8">
        {children}
      </main>
    </>
  );
}

export default function App() {
  return (
    <div className="app-bg min-h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/trips/new"
          element={
            <Protected>
              <AddTrip />
            </Protected>
          }
        />
        <Route
          path="/trips/:id"
          element={
            <Protected>
              <TripDetail />
            </Protected>
          }
        />
        <Route
          path="/trips/:id/entries/new"
          element={
            <Protected>
              <AddEntry />
            </Protected>
          }
        />
        <Route
          path="/entries/:entryId/edit"
          element={
            <Protected>
              <EditEntry />
            </Protected>
          }
        />
        <Route
          path="/trips/:id/edit"
          element={
            <Protected>
              <EditTrip />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}